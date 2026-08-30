// The §3.6 response ladder (spec §3.6, §8 task 12) — the single place that
// decides which of the five rungs a player's input lands on, and renders
// the right prose for it.
//
// Rungs 1–2 (a resolved `StructuredAction`) delegate straight to
// `actions.ts`'s `performAction` — that module already implements "authored
// handler wins outright, else built-in semantics, else the verb's own
// `default` family" exactly as §3.6 rungs 1/2 require, diag included. This
// module's own job is rungs 3–5: what to say when `interpreter.ts` couldn't
// resolve an action at all (`InterpretOutcome.kind === 'miss'`), plus a thin
// pass-through for the interpreter's other non-ladder outcome kinds
// (`clarify`/`unreachable`/`allEmpty`) so `respond()` is a complete
// `InterpretOutcome → events` reducer for whichever later task wires it into
// `step()`.
//
// SPOILER BOUNDARY (rung 3): "the {name} isn't here" is only safe to say
// once the player has actually encountered the thing — otherwise it leaks
// the existence of content they haven't found yet. "Has seen" is derived
// from `state.visited` (§1.1's "nothing derivable is ever a field" rule) —
// no new stored flag: an object/NPC counts as seen once the room it
// currently resolves to (chasing container nesting for objects; the
// pin/schedule resolution `npcRoom` already does for NPCs) is a key of
// `state.visited`. A `hidden` object never counts as seen regardless of its
// room, since `hidden` is exactly "still concealed" (§1.2's own gloss on the
// field) — the player was never actually shown it.
//
// NPC TARGETS (response-families doc §0 note 3: "PUSH ELI reaches
// push.default"): the engine has no authored-handler mechanism for NPCs yet
// (`NpcDefSlice` has no `handlers` field), and `actions.ts`'s `ActionInput.
// dobj` is `ObjectId`-only (built-in verbs never target a person). So a
// resolved action whose `dobj` is an `NpcId` never reaches `performAction`
// at all here — it renders the verb's own `default` family directly (rung
// 2's non-built-in branch), using `candidateName` (the same
// vocabulary-derived helper disambiguation prompts use) for `{name}`
// templating, since `NpcDefSlice` has no display-name field of its own.
// Rung 1 for NPCs is therefore unreachable today — a real gap, flagged in
// this task's report, not silently invented around.
//
// BARE VERB VS. NOUN MISS (task 12 fix-2, coordinator review): a bare
// `TAKE` and a `TAKE XYZZY` both used to produce the identical
// `InterpretOutcome` shape (`{ verb, knownNouns }`), so both rendered as a
// rung-3 noun miss — "You look for it. Nothing in the room admits to being
// it." for a player who named no noun at all, exactly the "the game didn't
// understand me" failure constitution §12 exists to prevent. Fixed at the
// source: `interpreter.ts`'s `miss` outcome now carries `reason` —
// `'noPattern'` (no noun phrase was even attempted) vs. `'nounUnresolved'`
// (a real noun phrase resolved to nothing). This module reads it:
//   - `'noPattern'` + `hasBuiltinSemantics(verb)` → the verb's own `default`
//     family, rendered bare (`performAction` with no `dobj`) — safe *only*
//     for a built-in verb, because a built-in's `default` is *never*
//     reached with a resolved `dobj` (built-in semantics claim that case
//     outright), so it's authored bare-safe by construction (response-
//     families doc §0 note 5: "Take what?", not `{name}`-templated).
//   - `'noPattern'` + a non-built-in verb (§8 gap 5) → renders the global
//     `bareVerb` family instead (`respondToBareNonBuiltinVerb`, below),
//     `{verb}`-templated on the verb's own canonical word
//     (`VerbDef.words[0]`) — `bareVerb` was authored (response-families
//     doc §7) specifically for this shape, because rendering the verb's
//     own `default` here would be broken — it IS `{name}`-templated (§6)
//     and would render with no object to fill it — and none of the ~47
//     non-built-in verbs in `VERB_DEFAULTS` has a second, bare-safe prompt
//     authored. Still tagged `defaultResponse` (same code as the built-in
//     bare case above): unlike gap 6's `isDesignedBareResponse` suppression
//     in `actions.ts` — for a verb whose own `default` genuinely IS the
//     complete bare answer — `bareVerb` is a generic stand-in nobody wrote
//     a real answer for, so the diag still means what it always means:
//     "nobody authored anything better."
//   - `'nounUnresolved'` (or `reason` absent, e.g. an older/hand-built
//     outcome) → rung 3 as before, seen/unseen split included.

import type { ActionClass, NpcId, ObjectId, VerbId } from './ids';
import { V } from './ids';
import { evaluate } from './cond';
import { apply } from './effects';
import type { GameEvent, GameState, HandlerDef, NpcDefSlice, WorldDef } from './world';
import { npcRoom } from './world';
import { objectLocation, objectState } from './resolve';
import type { Prose } from './prose';
import { render } from './prose';
import { hasBuiltinSemantics, performAction, verbDefaultPath } from './actions';
import type { InterpretOutcome, StructuredAction } from './interpreter';
import { GO_TO_VERB_ID } from './interpreter';
import { DIRECTION_VERB_IDS, directionForVerb, executeGoTo, look, LOOK_VERB_ID, traverseDirection, traverseDoor, USE_VERB_ID } from './move';
import type { CompiledVocabulary } from './parser';
import { allEmptyFamilyKey, candidateName, isNpcId } from './parser';
import { NPC_VERB_IDS, npcDisplayName, respondToAsk, respondToGreeting, respondToShow, respondToTell } from './npc';
import { inventoryView } from './views';

/**
 * Reserved verb id for EXAMINE-on-NPC (task-1 fix, Ryan's playtest: `X
 * MARLOW`) — the same "content declares the words/patterns/class in
 * `world.verbs` exactly like any other verb; the engine recognizes it here
 * by id" convention `LOOK_VERB_ID`/`USE_VERB_ID` (`move.ts`) already set.
 * `respondToNpcTarget` renders `NpcDefSlice.description` for this verb id
 * specifically, ahead of the generic `{name}`-templated default family —
 * see that field's own doc comment (`world.ts`) for why EXAMINE needed a
 * real authoring surface and every other npc-targeted verb still doesn't.
 */
export const EXAMINE_VERB_ID = V('examine');

/**
 * Reserved verb id for `INVENTORY`/`I` (§8 gap 2). Content declares the
 * words/patterns/class in `world.verbs` exactly like any other verb (see
 * `act1/verbs.ts`) — recognized here by id, the same convention
 * `LOOK_VERB_ID`/`GO_TO_VERB_ID` already set, because the actual listing is
 * dynamic engine behavior (`respondToInventory`, below), not authored
 * prose. `patterns` must be `['V']` only (bare, no `dobj` ever) — that's
 * what lets the EMPTY case's fallthrough to `performAction` land on gap 6's
 * `isDesignedBareResponse` (no spurious `defaultResponse` diag for the
 * ordinary "nothing to list" case). `default` should be authored as a
 * `ProseRef` to the shared `inventory.empty` family, not inline text —
 * `respondToInventory`'s own EMPTY branch reuses the ordinary rung-1/2b
 * machinery (room-handler override included) rather than reimplementing
 * it, so whatever `default` says IS what an un-overridden empty-inventory
 * room renders.
 */
export const INVENTORY_VERB_ID = V('inventory');

/**
 * Ryan's v0.3.2 playtest, fix 1: the verbs whose resolved `dobj` is worth
 * checking against `move.ts`'s `traverseDoor` before anything else — IN/OUT
 * (now also `'V dobj'`-capable — "ENTER DOOR"/"EXIT DOOR"/"GO THROUGH
 * DOOR" all reach one of the two via their own registered words) and
 * `USE_VERB_ID` ("USE DOOR"). Content-agnostic by design: any world with
 * any room and any `ExitDefSlice.door` gets this for free, not just act1's
 * `your_room` — see `respondToAction`'s own use of this set below.
 */
const DOOR_TRAVERSAL_VERB_IDS: ReadonlySet<VerbId> = new Set([DIRECTION_VERB_IDS.in, DIRECTION_VERB_IDS.out, USE_VERB_ID]);

export interface RespondResult {
  state: GameState;
  events: GameEvent[];
  /**
   * The behavioral-profile class this turn tallies as (§8 task 16's owed
   * action-class plumbing, spec 04 §3) — `null` whenever nothing was
   * actually resolved/performed (rungs 3-5 of the ladder, plus `clarify`/
   * `unreachable`/`allEmpty`), matching `ActionResult.class`'s own
   * "`null` = neutral" convention. `tick.ts`'s `TickInput.class` is meant
   * to receive this field once a later task (18, `Session`) wires
   * `respond()` and `tick()` into one turn loop.
   *
   * MULTI-ACTION TURNS (ALL/AND, §3.5): `outcome.actions` can carry more
   * than one `StructuredAction` in a single call. Each one resolves its own
   * class independently (`respondToAction`, below), but this field is a
   * single value for the whole call — it reports the *last* action's
   * class. Tallying every sub-action's class individually needs a per-
   * action tick, which only exists once task 18's `Session` decides how
   * many turns an ALL/AND command actually consumes; flagged here rather
   * than guessed at, the same way this file already flags the NPC rung-1
   * gap above.
   */
  class: ActionClass | null;
}

/** Dispatches one already-interpreted `InterpretOutcome` to prose (§3.6's full ladder, plus the interpreter's other outcome kinds). */
export function respond(world: WorldDef, state: GameState, vocab: CompiledVocabulary, outcome: InterpretOutcome): RespondResult {
  if (outcome.kind === 'actions') return respondToActions(world, state, vocab, outcome.actions);
  if (outcome.kind === 'miss') return respondToMiss(world, state, vocab, outcome);
  if (outcome.kind === 'clarify') {
    return { state, events: [{ type: 'clarify', question: outcome.question, options: outcome.options }], class: null };
  }
  if (outcome.kind === 'unreachable') {
    return { state, events: [{ type: 'line', kind: 'system', text: outcome.message }], class: null };
  }
  // 'allEmpty' (§3.5): an authored family, not a coverage gap — no diag.
  const key = allEmptyFamilyKey(outcome.verb);
  const rendered = render(world, state, key, family(world, key));
  return { state: rendered.state, events: [{ type: 'line', kind: 'prose', text: rendered.text }], class: null };
}

// ---------------------------------------------------------------------------
// Rungs 1–2 — resolved actions
// ---------------------------------------------------------------------------

function respondToActions(world: WorldDef, state: GameState, vocab: CompiledVocabulary, actions: StructuredAction[]): RespondResult {
  let current = state;
  const events: GameEvent[] = [];
  let cls: ActionClass | null = null; // see RespondResult.class's MULTI-ACTION TURNS note: last action wins
  for (const action of actions) {
    const result = respondToAction(world, current, vocab, action);
    current = result.state;
    events.push(...result.events);
    cls = result.class;
  }
  return { state: current, events, class: cls };
}

/**
 * NPC CONVERSATION (§8 task 14): ASK/TELL/SHOW/TALK are ordinary verbs —
 * content authors them in `world.verbs` under `npc.ts`'s reserved
 * `NPC_VERB_IDS`, the same convention `actions.ts`'s `BUILTIN_VERB_IDS`
 * sets for TAKE/DROP/etc. — so they're recognized here by id, exactly the
 * way `hasBuiltinSemantics` lets rung 2 tell a built-in physical verb apart
 * from an ordinary one, before this function ever falls to the generic
 * `respondToNpcTarget`/`performAction` paths below. A verb authored under a
 * *different* id, even with an identical grammar pattern, gets none of
 * this — it's an ordinary unhandled npc-targeted verb, unchanged.
 *
 * ASK/TELL: `action.topic` (§3.1, never resolved by the parser) is required
 * for the pattern to have matched at all (`'V npc about topic'`) — the
 * `!== undefined` checks below are total, not a guess.
 *
 * TALK TO/HELLO: `respondToGreeting` returns `undefined` when the NPC has
 * no `greeting` authored; this function falls through to the ordinary
 * rung-2 default in that case (documented at `respondToGreeting`'s own
 * definition), rather than inventing a second fallback family.
 *
 * SHOW: unlike ASK/TELL, the *object* being shown is `dobj`
 * (`'V dobj prep iobj'`, prep "to") and the npc is `iobj` — the inverse of
 * every other npc-targeting shape here, so it needs its own guard rather
 * than reusing the `dobj`-is-npc check below. A miss (`respondToShow`
 * returns `undefined` — nothing in `showResponses` matched) falls to
 * `respondToShowDefault`, a SHOW-specific rung-2 default rather than
 * `respondToNpcTarget`: `performAction`'s ordinary rung-2 path would
 * template `{name}`/`{iobj}` from an object-only naming table, and it is
 * the *object*'s name that belongs in `{name}` here, the npc's in `{iobj}`
 * (response-families doc §0 note 3: SHOW is inherently person-facing).
 */
function respondToAction(world: WorldDef, state: GameState, vocab: CompiledVocabulary, action: StructuredAction): RespondResult {
  const dobj = action.dobj;
  const iobj = action.iobj;

  // Movement and LOOK (§8 task 20b): checked before anything else in this
  // function — `GO_TO_VERB_ID` is never in `world.verbs` (it would throw
  // reaching `performAction`'s `fallbackToVerbDefault`, per this task's own
  // brief), and the twelve direction verbs are always a bare `'V'` match
  // (no `dobj`), so neither would ever hit the NPC-target checks below
  // anyway — this is purely about reaching `move.ts` before the generic
  // `performAction` dispatch, which has no movement semantics of its own.
  if (action.verb === GO_TO_VERB_ID) {
    return executeGoTo(world, state, action.route ?? []);
  }
  // Fix 1 (see DOOR_TRAVERSAL_VERB_IDS's own doc comment): a resolved
  // `dobj` on one of these verbs names a specific door, not "whichever
  // exit this direction id normally leads to" — checked, and given
  // priority, before the bare-direction dispatch just below (IN/OUT are
  // both direction ids AND door-traversal-eligible; the dobj always wins
  // when present). `traverseDoor` returns `undefined` when `dobj` isn't
  // the `door` of any exit in the current room — falls through (note the
  // lack of a `return`) to ordinary dispatch for whatever it actually is
  // (a window, a lamp, anything else named).
  if (dobj !== undefined && !isNpcId(vocab, dobj) && DOOR_TRAVERSAL_VERB_IDS.has(action.verb)) {
    const doorResult = traverseDoor(world, state, action.verb, dobj as ObjectId);
    if (doorResult !== undefined) return doorResult;
  }
  const dir = directionForVerb(action.verb);
  if (dir !== undefined && dobj === undefined) {
    return traverseDirection(world, state, action.verb, dir);
  }
  if (action.verb === LOOK_VERB_ID) {
    return look(world, state, action.verb);
  }
  if (action.verb === INVENTORY_VERB_ID) {
    return respondToInventory(world, state, action.verb);
  }

  if (action.verb === NPC_VERB_IDS.ask && dobj !== undefined && isNpcId(vocab, dobj) && action.topic !== undefined) {
    return respondToAsk(world, state, vocab, dobj, action.topic);
  }
  if (action.verb === NPC_VERB_IDS.tell && dobj !== undefined && isNpcId(vocab, dobj) && action.topic !== undefined) {
    return respondToTell(world, state, vocab, dobj, action.topic);
  }
  if (action.verb === NPC_VERB_IDS.talk && dobj !== undefined && isNpcId(vocab, dobj)) {
    const greeting = respondToGreeting(world, state, vocab, dobj);
    if (greeting !== undefined) return greeting;
    // No greeting authored: fall through to the ordinary rung-2 default below.
  }
  if (action.verb === NPC_VERB_IDS.show && dobj !== undefined && !isNpcId(vocab, dobj) && iobj !== undefined && isNpcId(vocab, iobj)) {
    const shown = respondToShow(world, state, vocab, dobj as ObjectId, iobj);
    if (shown !== undefined) return shown;
    return respondToShowDefault(world, state, vocab, action.verb, dobj as ObjectId, iobj);
  }

  if (dobj !== undefined && isNpcId(vocab, dobj)) {
    return respondToNpcTarget(world, state, vocab, action.verb, dobj);
  }
  const result = performAction(world, state, {
    verb: action.verb,
    ...(dobj !== undefined ? { dobj: dobj as ObjectId } : {}),
    ...(iobj !== undefined ? { iobj: iobj as ObjectId } : {}),
  });
  return { state: result.state, events: result.events, class: result.class };
}

/**
 * NPC-targeted verb dispatch (task-1 fix). Three rungs, in order:
 *   1. an authored `NpcDefSlice.handlers` match (parity with `actions.ts`'s
 *      `findHandler`/`applyHandler` for objects — see that field's own doc
 *      comment on the one gap, no `iobj`/instrument threaded through yet).
 *   2. `EXAMINE_VERB_ID` with an authored `NpcDefSlice.description` — the
 *      task-1 fix itself: `X MARLOW` used to always fall straight to rung 3
 *      (no handler mechanism existed for NPCs at all), rendering the verb's
 *      generic `{name}`-templated `default` family instead of anything
 *      Marlow-specific.
 *   3. the verb's own `default` family, `{name}`-templated — unchanged
 *      rung-2 behavior for every other npc-targeted verb, and for EXAMINE
 *      itself when the NPC authors no `description`.
 * `{name}`/`{dobj}` now come from `npcDisplayName` (not bare `candidateName`
 * — see that helper's doc comment for why the old call here is what
 * actually produced "the night marlow").
 */
function respondToNpcTarget(world: WorldDef, state: GameState, vocab: CompiledVocabulary, verb: VerbId, npc: NpcId): RespondResult {
  const npcDef = world.npcs?.[npc];
  const handler = findNpcHandler(world, state, npcDef, verb);
  if (handler !== undefined) return applyNpcHandler(world, state, vocab, verb, npc, handler);

  if (verb === EXAMINE_VERB_ID && npcDef?.description !== undefined) {
    const name = npcDisplayName(world, vocab, npc);
    const path = `npc.${npc}.description`;
    const rendered = render(world, state, path, npcDef.description, { name, dobj: name });
    return {
      state: rendered.state,
      events: [{ type: 'line', kind: 'prose', text: rendered.text }],
      class: world.verbs?.[verb]?.class ?? null,
    };
  }

  const verbDef = world.verbs?.[verb];
  if (verbDef === undefined) throw new Error(`respond: verb "${verb}" is not declared in world.verbs`);
  if (verbDef.default === null) throw new Error(`respond: verb "${verb}" has no default family`);
  const name = npcDisplayName(world, vocab, npc);
  const rendered = render(world, state, verbDefaultPath(verb), verbDef.default, { name, dobj: name });
  return {
    state: rendered.state,
    events: [
      { type: 'line', kind: 'prose', text: rendered.text },
      { type: 'diag', code: 'defaultResponse', detail: `verb "${verb}" on npc "${npc}" fell to its default family` },
    ],
    class: verbDef.class,
  };
}

/** Rung 1 for an NPC target — mirrors `actions.ts`'s `findHandler`, sourced from `NpcDefSlice.handlers` instead of `ObjectDefSlice.handlers`. No `iobj` to match `withInstrument` against yet (see `NpcDefSlice.handlers`'s own doc comment). */
function findNpcHandler(world: WorldDef, state: GameState, npcDef: NpcDefSlice | undefined, verb: VerbId): HandlerDef | undefined {
  const handlers = npcDef?.handlers ?? [];
  return handlers.find((h) => h.verbs.includes(verb) && (h.when === undefined || evaluate(world, state, h.when)));
}

/** Runs a matched `NpcDefSlice.handlers` entry's effects — mirrors `actions.ts`'s `applyHandler`, with `npc.<id>.<verb>` as the rotation path base (the same per-NPC path convention `npc.ts`'s own topic/greeting/show handling already uses) and `{name}`/`{dobj}` from `npcDisplayName`. */
function applyNpcHandler(world: WorldDef, state: GameState, vocab: CompiledVocabulary, verb: VerbId, npc: NpcId, handler: HandlerDef): RespondResult {
  const name = npcDisplayName(world, vocab, npc);
  const path = `npc.${npc}.${verb}`;
  const { state: newState, events } = apply(world, state, handler.effects, { name, dobj: name, path });
  return {
    state: newState,
    events,
    class: handler.class ?? world.verbs?.[verb]?.class ?? null,
  };
}

/** SHOW's own rung-2 default (see `respondToAction`'s SHOW note): `{name}`/`{dobj}` is the shown object, `{iobj}` the npc. */
function respondToShowDefault(world: WorldDef, state: GameState, vocab: CompiledVocabulary, verb: VerbId, dobj: ObjectId, npc: NpcId): RespondResult {
  const verbDef = world.verbs?.[verb];
  if (verbDef === undefined) throw new Error(`respond: verb "${verb}" is not declared in world.verbs`);
  if (verbDef.default === null) throw new Error(`respond: verb "${verb}" has no default family`);
  const dobjName = world.objects?.[dobj]?.name ?? dobj;
  const npcName = npcDisplayName(world, vocab, npc);
  const rendered = render(world, state, verbDefaultPath(verb), verbDef.default, { name: dobjName, dobj: dobjName, iobj: npcName });
  return {
    state: rendered.state,
    events: [
      { type: 'line', kind: 'prose', text: rendered.text },
      { type: 'diag', code: 'defaultResponse', detail: `verb "${verb}" (show) of "${dobj}" to npc "${npc}" fell to its default family` },
    ],
    class: verbDef.class,
  };
}

/**
 * `INVENTORY`/`I` (§8 gap 2): dynamic, unlike task 22a's static stopgap —
 * lists exactly what `inventoryView` finds carried/worn right now, dark or
 * not (no `scope()`/light gate at all — see that view's own doc comment).
 *
 * EMPTY: handed off to `performAction` rather than rendered here directly —
 * that reuses gap 3's room-handler dispatch for free, so a room can author
 * its own `handlers` entry for `INVENTORY_VERB_ID` (the opening room's own
 * "you have nothing, and that's the clue" line, design doc §8.9/§14.4) that
 * takes precedence over the ordinary global `inventory.empty` family
 * (`VerbDef.default`, authored as a `ProseRef` to it — see this id's own
 * doc comment). Safe to route through the ordinary bare-verb machinery: a
 * room's INVENTORY handler only ever matters when this function has already
 * confirmed the inventory really is empty.
 *
 * NON-EMPTY: this module's own job — `inventory.carrying` (global, "no
 * room, no act, no canon" per its own doc note) as a one-line header,
 * followed by one line per item reusing its own already-authored `name`
 * mechanically (no new prose for the per-item lines; worn ones marked).
 */
function respondToInventory(world: WorldDef, state: GameState, verb: VerbId): RespondResult {
  const items = inventoryView(world, state);
  if (items.length === 0) {
    const result = performAction(world, state, { verb });
    return { state: result.state, events: result.events, class: result.class };
  }
  const cls = world.verbs?.[verb]?.class ?? null;
  const header = render(world, state, 'inventory.carrying', family(world, 'inventory.carrying'));
  const events: GameEvent[] = [
    { type: 'line', kind: 'prose', text: header.text },
    ...items.map((item): GameEvent => ({ type: 'line', kind: 'system', text: item.worn ? `${item.name} (worn)` : item.name })),
  ];
  return { state: header.state, events, class: cls };
}

// ---------------------------------------------------------------------------
// Rungs 3–5 — nothing resolved
// ---------------------------------------------------------------------------

function respondToMiss(world: WorldDef, state: GameState, vocab: CompiledVocabulary, outcome: Extract<InterpretOutcome, { kind: 'miss' }>): RespondResult {
  if (outcome.verb !== undefined) {
    if (outcome.reason === 'noPattern') {
      if (hasBuiltinSemantics(outcome.verb)) return respondToBareVerb(world, state, outcome.verb);
      return respondToBareNonBuiltinVerb(world, state, outcome.verb);
    }
    return respondToNounMiss(world, state, vocab, outcome.verb, outcome.knownNouns);
  }

  const candidates = candidatesForWords(vocab, outcome.knownNouns);
  if (candidates.length > 0) return respondToUnknownVerbKnownNoun(world, state, vocab, candidates[0]!);
  return respondToUnknown(world, state);
}

/**
 * A bare, object-free invocation of a built-in verb ("take" alone) — rung 2,
 * not rung 3 (see file header). `performAction` with no `dobj` already does
 * exactly the right thing: no handler/built-in lookup is even attempted
 * (both require a resolved `dobj`), so it falls straight to
 * `fallbackToVerbDefault`, rendering the verb's own (bare-safe, for a
 * built-in) `default` family with a `defaultResponse` diag — existing,
 * unchanged `actions.ts` machinery, not reimplemented here.
 */
function respondToBareVerb(world: WorldDef, state: GameState, verb: VerbId): RespondResult {
  const result = performAction(world, state, { verb });
  return { state: result.state, events: result.events, class: result.class };
}

/**
 * A bare, object-free invocation of a NON-built-in verb (§8 gap 5) — see
 * this file's header note on why this can't reuse `respondToBareVerb`'s
 * `performAction` route: that would render `verbDef.default` directly,
 * which for a non-built-in verb IS `{name}`-templated (§6) and has no
 * object to fill it. `bareVerb` (response-families doc §7) is the one
 * global family authored specifically for this shape, `{verb}`-templated
 * on the verb's own canonical word (`VerbDef.words[0]` — the parser only
 * hands this function a resolved `VerbId`, not which synonym the player
 * typed, and `words[0]` is this codebase's usual "the" word for a verb
 * when one is needed, e.g. `verbDefaultPath`). Tagged `defaultResponse`,
 * same as the built-in bare case — `bareVerb` is a generic stand-in, not a
 * designed complete answer, so the diag keeps meaning what it always means.
 */
function respondToBareNonBuiltinVerb(world: WorldDef, state: GameState, verb: VerbId): RespondResult {
  const verbDef = world.verbs?.[verb];
  const verbWord = verbDef?.words[0] ?? verb;
  const rendered = render(world, state, 'bareVerb', family(world, 'bareVerb'), { verb: verbWord });
  return {
    state: rendered.state,
    events: [
      { type: 'line', kind: 'prose', text: rendered.text },
      { type: 'diag', code: 'defaultResponse', detail: `verb "${verb}" called bare — rendered the global bareVerb family` },
    ],
    class: verbDef?.class ?? null,
  };
}

/** Rung 3. Spoiler boundary: `nounMiss.seen` only for a candidate the player has actually seen (see file header); `nounMiss.unseen` never names anything. */
function respondToNounMiss(world: WorldDef, state: GameState, vocab: CompiledVocabulary, verb: VerbId, knownNouns: string[]): RespondResult {
  const candidates = candidatesForWords(vocab, knownNouns);
  const seen = candidates.find((id) => hasSeen(world, state, vocab, id));
  const key = seen !== undefined ? 'nounMiss.seen' : 'nounMiss.unseen';
  const ctx = seen !== undefined ? { name: displayNameFor(world, vocab, seen), dobj: displayNameFor(world, vocab, seen) } : {};
  const rendered = render(world, state, key, family(world, key), ctx);
  return {
    state: rendered.state,
    events: [
      { type: 'line', kind: 'prose', text: rendered.text },
      { type: 'diag', code: 'nounMiss', detail: `verb "${verb}" — noun not in scope (${key})` },
    ],
    class: null, // nothing resolved — no action to tally
  };
}

/** Rung 4. */
function respondToUnknownVerbKnownNoun(world: WorldDef, state: GameState, vocab: CompiledVocabulary, id: ObjectId | NpcId): RespondResult {
  const name = displayNameFor(world, vocab, id);
  const rendered = render(world, state, 'unknownVerbKnownNoun', family(world, 'unknownVerbKnownNoun'), { name, dobj: name });
  return {
    state: rendered.state,
    events: [
      { type: 'line', kind: 'prose', text: rendered.text },
      { type: 'diag', code: 'parserMiss', detail: `verb unrecognized; noun "${name}" resolved` },
    ],
    class: null, // nothing resolved — no action to tally
  };
}

/** Rung 5. */
function respondToUnknown(world: WorldDef, state: GameState): RespondResult {
  const rendered = render(world, state, 'unknown', family(world, 'unknown'));
  return {
    state: rendered.state,
    events: [
      { type: 'line', kind: 'prose', text: rendered.text },
      { type: 'diag', code: 'parserMiss', detail: 'nothing in the input was recognized' },
    ],
    class: null, // nothing resolved — no action to tally
  };
}

// ---------------------------------------------------------------------------
// Shared: candidate lookup, the "has seen" spoiler boundary, family access
// ---------------------------------------------------------------------------

/** Rung 3/4's own naming: an NPC candidate goes through `npcDisplayName` (task-1 fix — same root cause as `respondToNpcTarget`'s, see that helper's own doc comment); an object candidate keeps the existing vocab-derived `candidateName` (objects have no equivalent "wrong to glue an adjective onto a proper name" problem — see `NpcDefSlice.name`'s doc comment). */
function displayNameFor(world: WorldDef, vocab: CompiledVocabulary, id: ObjectId | NpcId): string {
  return isNpcId(vocab, id) ? npcDisplayName(world, vocab, id) : candidateName(vocab, id);
}

/** Every object/NPC the vocabulary indexes any of `words` under — game-wide, not scope-restricted (mirrors `knownNounsIn`'s own four-map sweep). */
function candidatesForWords(vocab: CompiledVocabulary, words: string[]): (ObjectId | NpcId)[] {
  const ids: (ObjectId | NpcId)[] = [];
  for (const word of words) {
    ids.push(...(vocab.objectNouns.get(word) ?? []));
    ids.push(...(vocab.objectAdjectives.get(word) ?? []));
    ids.push(...(vocab.npcNouns.get(word) ?? []));
    ids.push(...(vocab.npcAdjectives.get(word) ?? []));
  }
  return ids;
}

function hasSeen(world: WorldDef, state: GameState, vocab: CompiledVocabulary, id: ObjectId | NpcId): boolean {
  return isNpcId(vocab, id) ? hasSeenNpc(world, state, id) : hasSeenObject(world, state, id as ObjectId);
}

function hasSeenNpc(world: WorldDef, state: GameState, id: NpcId): boolean {
  const room = npcRoom(world, state, id);
  return room !== 'offstage' && state.visited[room] !== undefined;
}

/** Recurses through container nesting to the room an object currently resolves to; `hidden` (top-level only — concealment is declared per-object, not inherited) always reads as unseen regardless of that room. */
function hasSeenObject(world: WorldDef, state: GameState, id: ObjectId): boolean {
  if (objectState(world, state, id, 'hidden')) return false;
  const loc = objectLocation(world, state, id);
  if (typeof loc === 'string') {
    if (loc === 'inventory' || loc === 'worn' || loc === 'self') return true; // carried, worn, or part of the player: trivially seen
    if (loc === 'nowhere') return false; // not yet revealed into the world
    return state.visited[loc] !== undefined;
  }
  if ('in' in loc) return hasSeenObject(world, state, loc.in);
  if ('on' in loc) return hasSeenObject(world, state, loc.on);
  return false; // { npc } — carried by an NPC, not directly seen
}

/** The declared global family for a ladder outcome — a missing family is a content bug, thrown like `actions.ts`'s own `family()` (same convention, duplicated rather than exported across the module boundary — see that file). */
function family(world: WorldDef, key: string): Prose {
  const prose = world.responses?.[key];
  if (prose === undefined) {
    throw new Error(`respond: response family "${key}" is not declared in world.responses`);
  }
  return prose;
}
