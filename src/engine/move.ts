// Movement and looking (spec §2.4, §3.5, §4, §6.1, §8 task 20b) — the gap
// task 20 found: exits are declared (§2.4), validated (task 7), drawn on
// the map (task 17), and routed over by `GO TO` (task 11), but nothing ever
// *traverses* one, and there is no `LOOK`. This module owns:
//
//   - the twelve direction verbs (`DIRECTION_VERB_IDS`, reserved the same
//     way `actions.ts`'s `BUILTIN_VERB_IDS` reserves TAKE/DROP/etc — content
//     registers `VerbDef`s under these exact ids and supplies the words/
//     synonyms; this module supplies the semantics) and `LOOK_VERB_ID`;
//   - `traverseDirection` — executing one `ExitDefSlice`: the `when` gate,
//     the `door` open check, `blockedText` vs. the generic "no exit"
//     family, `travelText`, `minutes`;
//   - `look` — re-describes the current room, never `firstVisit`;
//   - `renderArrival` — firstVisit-once, `description`, `visited`-marking,
//     `onEnter` (§4.2's "derive NPC positions"/etc. steps are `tick`'s job,
//     not this one's — `renderArrival` only ever touches room-entry state);
//   - `executeGoTo` — walks task 11's `GO TO` route one room per world
//     turn, stopping early with a line if an exit is no longer passable.
//
// ARCHITECTURE — WHO CALLS `renderArrival`, AND WHEN (the piece that makes
// "Task 5's goto effect relocates the player without re-rendering" and "the
// step loop's job" (`effects.ts`'s own doc comment on the `goto` effect
// arm) both true at once, without ever rendering arrival twice):
//
//   `renderArrival` is called from exactly one place outside this module —
//   `turn.ts`'s `step()`, which compares `state.location` before and after
//   `respond()` runs and renders arrival iff it changed. That single choke
//   point is what lets ANY effect list that relocates the player (a
//   `{ goto }` in a handler, a script, or this module's own traversal)
//   "look like arriving somewhere rather than teleporting silently" with no
//   special-casing anywhere else. Consequently:
//
//   - `traverseDirection` applies `travelText`/`goto`/`minutes` and
//     STOPS — it never calls `renderArrival` itself. `turn.ts` renders
//     arrival once, after `respond()` returns, the same as it would for any
//     other relocating effect list.
//   - `executeGoTo` walks its route hop by hop. Every hop except the last
//     is *invisible* to `turn.ts`'s before/after location diff (it only
//     ever sees the state respond() finally returns), so an intermediate
//     hop's `onEnter` and its own turn's clock advance have to happen
//     inside this module, right when that hop is taken — see "CLOCK
//     ACCOUNTING" below. The *last* hop taken (whether it completes the
//     route or is where a blocked exit stops it) is left unticked and
//     un-rendered here, exactly like `traverseDirection`'s single hop, so
//     `turn.ts`'s one structural tick and one arrival render cover it.
//     Nothing here renders a full description for an intermediate hop
//     (spec §3.5 calls for a terse per-hop line — "You cut back through the
//     lobby" — which needs authored prose this task does not invent; see
//     this task's report).
//
// CLOCK ACCOUNTING ("one room per world turn", §3.5/this task's brief):
// `turn.ts`'s `step()` calls `tick()` exactly once per command, structurally
// (`commandConsumesTurn`, computed from the verb alone, before `respond()`
// even runs) — `executeGoTo` cannot change how many times *that* call
// happens. So an N-hop route needs N-1 internal `tick()` calls here (one
// per hop before the last thing that happens this command) plus the one
// `turn.ts` already contributes for the last thing — success or a blocked
// stop alike, since a blocked attempt costs a turn exactly like any other
// refusal in this codebase (`actions.ts`'s `refuse()`: `consumesTurn: true`
// always). A route blocked at hop `k` (0-indexed) therefore costs `k + 1`
// turns: `k` successful relocations, each ticked here, plus the blocked
// attempt itself, ticked by `turn.ts`. A route that completes all `N` hops
// costs exactly `N`: `N - 1` here, `1` from `turn.ts`.

import type { ActionClass, Direction, RoomId, VerbId } from './ids';
import { V } from './ids';
import { evaluate } from './cond';
import type { Effect } from './effects';
import { apply } from './effects';
import { objectState } from './resolve';
import { render } from './prose';
import { tick } from './tick';
import type { ExitDefSlice, GameEvent, GameState, ObjectDefSlice, WorldDef } from './world';
import { isDark, objectHasBeenMoved, objectsListedInRoom } from './world';

/**
 * Reserved verb ids for the twelve exit directions (§2.4's `ExitDef.dir`
 * union), following `BUILTIN_VERB_IDS`'s convention: content authors a
 * `VerbDef` per id (words, synonyms, `class`), this module supplies the
 * semantics. `ENTER`/`EXIT` (this task's brief) are deliberately not
 * separate ids — they're `IN`/`OUT` under different words, the classic IF
 * convention (Zork's ENTER and IN are the same action) and the simplest
 * reading that doesn't invent a second "enter/exit an object" mechanism
 * this task was never asked to build (see this task's report).
 */
export const DIRECTION_VERB_IDS: Record<Direction, VerbId> = {
  n: V('n'),
  s: V('s'),
  e: V('e'),
  w: V('w'),
  ne: V('ne'),
  nw: V('nw'),
  se: V('se'),
  sw: V('sw'),
  up: V('up'),
  down: V('down'),
  in: V('in'),
  out: V('out'),
};

const VERB_TO_DIRECTION = new Map<VerbId, Direction>(
  (Object.entries(DIRECTION_VERB_IDS) as [Direction, VerbId][]).map(([dir, id]) => [id, dir]),
);

/** `undefined` when `verb` isn't one of `DIRECTION_VERB_IDS`'s twelve ids. */
export function directionForVerb(verb: VerbId): Direction | undefined {
  return VERB_TO_DIRECTION.get(verb);
}

export const LOOK_VERB_ID = V('look');

/** The two global families this module renders when no exit-specific prose is authored (see this task's report for the exact keys). */
const NO_EXIT_FAMILY = 'move.noExit';
const BLOCKED_FAMILY = 'move.blocked';

/**
 * §2.5's generic room-listing family: renders for a portable object once
 * it has been handled (`objectHasBeenMoved`) — "There is a {name} here."
 * territory, `{name}`-templated exactly like the response-family
 * convention documented in `src/content/responses.ts`. Not yet declared in
 * `world.responses` as of this task — see this task's report for the
 * exact family this key needs and why it's left to `narrative-writer`
 * rather than authored here (hard rule 5).
 */
const GENERIC_LISTING_FAMILY = 'room.genericListing';

/**
 * The generic-listing family's own `{name}` (§2.5 fix): unlike every other
 * `{name}` interpolation in this engine — bare, "take the fedora", handler
 * prose — `GENERIC_LISTING_FAMILY`'s approved text is `'There is {name}
 * here.'` with no article of its own (hard rule 5 forbids adding one to the
 * authored string), so `{name}` has to arrive already articleized.
 * `def.proper` objects (an NPC-like object whose `name` is a proper name)
 * get none at all; `def.article` overrides the word; otherwise it's
 * derived from `name`'s first letter (a/an) so ordinary content never has
 * to annotate anything. Used only by the moved-object branch below —
 * `listedAs` (the other branch) is a full authored sentence and keeps the
 * bare `name`.
 */
function articleizedName(def: ObjectDefSlice | undefined, name: string): string {
  if (def?.proper) return name;
  const article = def?.article ?? (/^[aeiou]/i.test(name) ? 'an' : 'a');
  return `${article} ${name}`;
}

export interface MoveOutcome {
  state: GameState;
  events: GameEvent[];
  class: ActionClass | null;
}

function verbClass(world: WorldDef, verb: VerbId): ActionClass | null {
  return world.verbs?.[verb]?.class ?? null;
}

function family(world: WorldDef, key: string): string | string[] {
  const prose = world.responses?.[key];
  if (prose === undefined) {
    throw new Error(`move: response family "${key}" is not declared in world.responses`);
  }
  return prose as string | string[];
}

function renderFamily(world: WorldDef, state: GameState, key: string): { state: GameState; events: GameEvent[] } {
  const rendered = render(world, state, key, family(world, key));
  return { state: rendered.state, events: [{ type: 'line', kind: 'prose', text: rendered.text }] };
}

/**
 * Whether `exit` currently exists at all — the `when` gate (§2.4: "exit
 * exists/visible only when true"). An exit whose `when` doesn't hold is,
 * from the player's side, indistinguishable from no exit in that direction:
 * this task's own brief draws that line explicitly ("The `when` gate — an
 * exit that does not currently exist at all").
 */
function exitCurrentlyExists(world: WorldDef, state: GameState, exit: ExitDefSlice): boolean {
  return exit.when === undefined || evaluate(world, state, exit.when);
}

/** Whether a currently-existing `exit` will actually yield right now — false only for a closed door (§2.4: "must be open to pass"). */
function exitIsOpen(world: WorldDef, state: GameState, exit: ExitDefSlice): boolean {
  return exit.door === undefined || objectState(world, state, exit.door, 'open');
}

/**
 * The door-blocked refusal: `exit.blockedText` when the author wrote one
 * (exit-specific — "the iron gate is padlocked"), else the generic
 * `BLOCKED_FAMILY` — still distinct prose from `NO_EXIT_FAMILY`'s "you
 * can't go that way", per this task's brief (constitution §9: a locked door
 * is not the same lie as no door at all).
 */
function renderBlocked(world: WorldDef, state: GameState, path: string, exit: ExitDefSlice): { state: GameState; events: GameEvent[] } {
  if (exit.blockedText !== undefined) {
    const rendered = render(world, state, path, exit.blockedText);
    return { state: rendered.state, events: [{ type: 'line', kind: 'prose', text: rendered.text }] };
  }
  return renderFamily(world, state, BLOCKED_FAMILY);
}

// ---------------------------------------------------------------------------
// Single-step direction traversal
// ---------------------------------------------------------------------------

/**
 * The actual crossing of an already-confirmed-passable `exit`:
 * `travelText` (if authored) then `goto` then `minutes`' extra
 * `advanceClock` (if authored) — shared by `traverseDirection` (one hop)
 * and `executeGoTo` (every hop of a route), so a gap that takes longer to
 * cross costs the same, and reads the same, whichever way the player
 * crossed it.
 */
function applyExitTraversal(world: WorldDef, state: GameState, exit: ExitDefSlice, path: string): { state: GameState; events: GameEvent[] } {
  const effects: Effect[] = [];
  if (exit.travelText !== undefined) effects.push({ say: exit.travelText });
  effects.push({ goto: exit.to });
  if (exit.minutes !== undefined) effects.push({ advanceClock: exit.minutes });
  return apply(world, state, effects, { path });
}

/**
 * `N`/`S`/.../`GO <direction>` (§2.4, §3.5). Finds the exit declared with
 * `dir` in the player's current room and, if it's currently passable,
 * applies `travelText`/`goto`/`minutes` and stops — arrival (firstVisit,
 * description, `onEnter`) is `turn.ts`'s job, per this file's header.
 */
export function traverseDirection(world: WorldDef, state: GameState, verb: VerbId, dir: Direction): MoveOutcome {
  const cls = verbClass(world, verb);
  const roomId = state.location;
  const exit = (world.rooms?.[roomId]?.exits ?? []).find((e) => e.dir === dir);

  if (exit === undefined || !exitCurrentlyExists(world, state, exit)) {
    const { state: s, events } = renderFamily(world, state, NO_EXIT_FAMILY);
    return { state: s, events, class: cls };
  }
  if (!exitIsOpen(world, state, exit)) {
    const { state: s, events } = renderBlocked(world, state, `room.${roomId}.exit.${dir}.blockedText`, exit);
    return { state: s, events, class: cls };
  }

  const applied = applyExitTraversal(world, state, exit, `room.${roomId}.exit.${dir}`);
  return { state: applied.state, events: applied.events, class: cls };
}

// ---------------------------------------------------------------------------
// LOOK
// ---------------------------------------------------------------------------

/**
 * §2.5's room listing: appended after `description`, on arrival and on
 * `LOOK` alike (this task's brief) — shared by `renderDescription` (below)
 * and `renderArrival`. For every portable object currently present in
 * `roomId` (`objectsListedInRoom`, `world.ts`, declaration-order like
 * every other listing in this engine — `views.ts`'s own convention): an
 * untouched one (`objectHasBeenMoved` false) prints its own authored
 * `listedAs` line, if the author wrote one — an object woven entirely
 * into the room's own `description` prose while it stays put authors no
 * `listedAs` at all, and this prints nothing extra for it. A handled one
 * prints the generic `GENERIC_LISTING_FAMILY` line instead, `{name}`-
 * templated: the staged sentence stopped being true the moment the
 * player touched it.
 *
 * Renders nothing at all while `roomId` is dark (`isDark`, `world.ts`,
 * §2.4) — a judgment call this task's brief doesn't spell out, but the
 * room's own dark-variant `description` already says nothing concrete is
 * visible; appending an object listing under it would contradict that in
 * the same breath. Carried objects are unaffected (`objectsListedInRoom`
 * only ever returns what's physically in the room, never inventory/worn),
 * matching the rest of this engine's "you always know what you're
 * carrying, dark or not" convention.
 */
function renderRoomListing(world: WorldDef, state: GameState, roomId: RoomId): { state: GameState; events: GameEvent[] } {
  if (isDark(world, state, roomId)) return { state, events: [] };
  const ids = objectsListedInRoom(world, state, roomId);
  let current = state;
  const events: GameEvent[] = [];

  for (const id of ids) {
    const def = world.objects![id]!;
    const name = def.name ?? id;
    if (objectHasBeenMoved(current, id)) {
      const rendered = render(world, current, `room.${roomId}.listing.${id}`, { ref: GENERIC_LISTING_FAMILY }, { name: articleizedName(def, name) });
      current = rendered.state;
      events.push({ type: 'line', kind: 'prose', text: rendered.text });
    } else if (def.listedAs !== undefined) {
      const rendered = render(world, current, `object.${id}.listedAs`, def.listedAs, { name });
      current = rendered.state;
      events.push({ type: 'line', kind: 'prose', text: rendered.text });
    }
  }

  return { state: current, events };
}

/** `description`, then the room listing (§2.5) — shared by `look` and `executeGoTo`'s empty-route ("already there") case. Never `firstVisit`/`onEnter`. */
function renderDescription(world: WorldDef, state: GameState): { state: GameState; events: GameEvent[] } {
  const roomId = state.location;
  const def = world.rooms?.[roomId];
  if (def?.description === undefined) {
    throw new Error(`move: room "${roomId}" has no description to render`);
  }
  const rendered = render(world, state, `room.${roomId}.description`, def.description);
  const listing = renderRoomListing(world, rendered.state, roomId);
  return { state: listing.state, events: [{ type: 'line', kind: 'prose', text: rendered.text }, ...listing.events] };
}

/** `LOOK` (§8 task 20b): re-renders `description` only — never `firstVisit`, which fires once, ever, on genuine first entry (`renderArrival`). Not `onEnter` either: that's an entry hook, and LOOK doesn't re-enter anything. */
export function look(world: WorldDef, state: GameState, verb: VerbId): MoveOutcome {
  const { state: s, events } = renderDescription(world, state);
  return { state: s, events, class: verbClass(world, verb) };
}

// ---------------------------------------------------------------------------
// Arrival: firstVisit-once, description, visited-marking, onEnter
// ---------------------------------------------------------------------------

/**
 * §2.4/§2.8: runs every `onEnter` rule whose `when` currently holds, in
 * declared order, skipping a `once` (default true) rule already recorded in
 * `state.firedEvents` — mirrors `tick.ts`'s `fireEvents` exactly, keyed by a
 * derived id (`room.<roomId>.onEnter[i]`) since `OnEnterRule` has no `id` of
 * its own (`world.ts`'s doc comment on the type).
 */
function runOnEnter(world: WorldDef, state: GameState, roomId: RoomId): { state: GameState; events: GameEvent[] } {
  const rules = world.rooms?.[roomId]?.onEnter ?? [];
  let current = state;
  const events: GameEvent[] = [];

  rules.forEach((rule, i) => {
    const key = `room.${roomId}.onEnter[${i}]`;
    const once = rule.once ?? true;
    if (once && current.firedEvents.includes(key)) return;
    if (rule.when !== undefined && !evaluate(world, current, rule.when)) return;

    const result = apply(world, current, rule.effects, { path: key });
    current = result.state;
    events.push(...result.events);
    if (once) current = { ...current, firedEvents: [...current.firedEvents, key] };
  });

  return { state: current, events };
}

/**
 * Renders arrival at `state.location` (§2.4, this task's core deliverable):
 * `firstVisit` prepended exactly once (the turn `state.visited[room]` is
 * first set — never again, including across save/load, since `visited` is
 * ordinary saved state), then the state-appropriate `description`, then the
 * room listing (§2.5 — `renderRoomListing`, above), then `onEnter`. Called
 * from exactly one place — `turn.ts`'s `step()` — per this file's header;
 * never called by this module's own traversal functions, so a relocation is
 * rendered exactly once regardless of how it happened.
 */
export function renderArrival(world: WorldDef, state: GameState): { state: GameState; events: GameEvent[] } {
  const roomId = state.location;
  const def = world.rooms?.[roomId];
  if (def === undefined) {
    throw new Error(`move: room "${roomId}" is not declared in world.rooms`);
  }

  let current = state;
  const events: GameEvent[] = [];

  if (current.visited[roomId] === undefined) {
    // "turn of first entry" (gamestate.ts's own gloss): the turn count as
    // this command started, matching `initialState`'s `visited[startRoom] =
    // 0` alongside `turn: 0` — nothing in the engine reads this value as
    // more than "defined or not" (views.ts's mapView, cond.ts's `visited`
    // arm, respond.ts's hasSeen*), so the exact number only has to be
    // consistent with that seeding convention, not perfectly "post-turn".
    current = { ...current, visited: { ...current.visited, [roomId]: current.turn } };
    if (def.firstVisit !== undefined) {
      const rendered = render(world, current, `room.${roomId}.firstVisit`, def.firstVisit);
      current = rendered.state;
      events.push({ type: 'line', kind: 'prose', text: rendered.text });
    }
  }

  if (def.description === undefined) {
    throw new Error(`move: room "${roomId}" has no description to render`);
  }
  const rendered = render(world, current, `room.${roomId}.description`, def.description);
  current = rendered.state;
  events.push({ type: 'line', kind: 'prose', text: rendered.text });

  const listing = renderRoomListing(world, current, roomId);
  current = listing.state;
  events.push(...listing.events);

  const entered = runOnEnter(world, current, roomId);
  current = entered.state;
  events.push(...entered.events);

  return { state: current, events };
}

// ---------------------------------------------------------------------------
// GO TO — walking task 11's route
// ---------------------------------------------------------------------------

/** The declared exit from `from` to `to`, if any — `GO TO`'s route carries rooms, not directions, so this looks up by destination rather than `dir`. */
function findExitTo(world: WorldDef, from: RoomId, to: RoomId): ExitDefSlice | undefined {
  return (world.rooms?.[from]?.exits ?? []).find((e) => e.to === to);
}

/**
 * Executes task 11's `GO TO` movement plan (§3.5): one room per world turn
 * (see this file's header, "CLOCK ACCOUNTING"), stopping early with a line
 * if an exit is no longer passable by the time this hop is reached (state
 * can have changed since the route was planned — an earlier hop's own
 * `tick()` can fire an event that closes a door). `route` empty (already at
 * the target — `interpreter.ts`'s `bfsRoute` returns `[]` for `from === to`)
 * just re-renders the current room, the same as `LOOK`.
 *
 * Each hop crosses its exit via the same `applyExitTraversal` a manual
 * direction move uses — `travelText` and `minutes` apply per hop, not just
 * on `traverseDirection`'s single-step path. Two reasons: (1) "clock stays
 * honest" (this task's brief) would be a lie if a five-minute gap only cost
 * five minutes when walked one room at a time; (2) reusing each exit's
 * already-authored `travelText` gives every hop real texture with no new
 * prose invented — spec §3.5 calls for "terse" narration, and this task
 * does not invent a bespoke per-hop family (see this task's report).
 *
 * `GO_TO_VERB_ID` is never registered in `world.verbs` (`interpreter.ts`'s
 * own doc comment), so it has no declared `class` — this always tallies
 * `null`, same as a meta/neutral action.
 */
export function executeGoTo(world: WorldDef, state: GameState, route: readonly RoomId[]): MoveOutcome {
  if (route.length === 0) {
    const { state: s, events } = renderDescription(world, state);
    return { state: s, events, class: null };
  }

  let current = state;
  const events: GameEvent[] = [];

  for (let i = 0; i < route.length; i++) {
    const to = route[i]!;
    const from = current.location;
    const exit = findExitTo(world, from, to);
    if (exit === undefined || !exitCurrentlyExists(world, current, exit)) {
      const blocked = renderFamily(world, current, NO_EXIT_FAMILY);
      current = blocked.state;
      events.push(...blocked.events);
      break;
    }
    if (!exitIsOpen(world, current, exit)) {
      const blocked = renderBlocked(world, current, `goto.hop[${i}].blockedText`, exit);
      current = blocked.state;
      events.push(...blocked.events);
      break;
    }

    const applied = applyExitTraversal(world, current, exit, `goto.hop[${i}]`);
    current = applied.state;
    events.push(...applied.events);

    const isLast = i === route.length - 1;
    if (isLast) break; // last hop: turn.ts's own tick + arrival render cover it (this file's header)

    const entered = runOnEnter(world, current, to);
    current = entered.state;
    events.push(...entered.events);

    const ticked = tick(world, current, { consumesTurn: true, class: null });
    current = ticked.state;
    events.push(...ticked.events);
  }

  return { state: current, events, class: null };
}
