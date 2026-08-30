// `WorldDef` (spec §2.1) and the overlay-resolution helpers (§0's directory
// map: "scope, visibility, light, movement, resolution helpers") — §8 task 6.
//
// SPLIT NOTE (task 3 → task 6): task 3 parked a narrow slice of the v2
// `GameState`/`Clock`/overlay types here alongside `WorldDef`, documented in
// this file's previous header, because `src/engine/state.ts` was (and still
// is) the live MVP file. Task 6 finishes that split: the full `GameState`
// and `initialState(world)` now live in `gamestate.ts` (see that file's
// header for why not `state.ts`). This file re-exports every type that
// moved so `cond.ts`, `clock.ts`, `prose.ts`, `effects.ts`, and their tests
// — all of which import `GameState`/`Clock`/etc. from `'./world'` — keep
// compiling with zero changes to their own source.
//
// SEAM NOTE (task 6 follow-up, found in review): `objectLocation` and
// `objectState` — the overlay-with-authored-fallback resolvers — now live
// in `resolve.ts`, not here, because `cond.ts`'s `objectAt`/`objectState`/
// `has` arms need them too and a plain `world.ts` → `cond.ts` → `world.ts`
// wiring would cycle (`cond.ts` needs `WorldDef`; `world.ts`'s `isDark`
// needs `cond.ts`'s `evaluate`). `resolve.ts` is a types-only leaf both
// modules import from at runtime with no cycle. Likewise `npcRoom` now
// lives in `cond.ts` (its schedule fallback needs `evaluate`, and the two
// are mutually recursive), re-exported from here so existing callers of
// `world.ts`'s `npcRoom` keep working unchanged. This file re-exports both
// kinds of import for that reason — see `resolve.ts` and `cond.ts` for the
// full explanation.
//
// This file's own job now is: `WorldDef` (still a growing narrow slice —
// later tasks add the rest of §2.1's rooms/objects/npcs authoring surface),
// `isDark` (§2.4's sole darkness authority), and `scope` (what the player
// can currently see) — the two resolvers that *do* need `Cond` evaluation
// (a room's `dark` baseline can be a `Cond`) but don't need to live beside
// `evaluate` itself the way `npcRoom` does.

import type { Cond } from './cond';
import { evaluate } from './cond';
import type { ActionClass, DayPhase, FlagId, FlagValue, MemoryId, ClueId, NpcId, ObjectId, PlaceId, QuestionId, RoomId, ScriptId, VerbId } from './ids';
// Type-only: `Effect` is only referenced in `HandlerDef`'s type signature
// below, never called at runtime from this module, so this stays a
// compile-time-only edge even though `effects.ts` itself imports `WorldDef`
// from here (also `import type`) — a genuine runtime cycle would need a
// real value to flow in both directions, and neither side has one, unlike
// the `cond.ts`/`world.ts` `evaluate` cycle documented above.
import type { Effect } from './effects';
import type { Prose } from './prose';
import { objectLocation, objectState } from './resolve';
import type { GameEvent, GameState } from './gamestate';

export type { Clock, GameEvent, GameState, NpcOverlay, ObjectOverlay, Phase } from './gamestate';
export { initialState } from './gamestate';
export { objectLocation, objectState } from './resolve';
export { npcRoom } from './cond';

/**
 * The day/week scheduling surface (canon A9). `phases` gives the start
 * minute of each of the four `DayPhase`s; `weekLength` is the number of
 * days in a week (`weekday = (day - 1) % weekLength`, 0-based). Consumed by
 * `clock.ts`'s `phase()`/`weekday()` — see that module for the resolution
 * rules (wraparound, duplicate-boundary rejection).
 */
export interface WorldMeta {
  phases: Record<DayPhase, number>;
  weekLength: number;
  /**
   * Where `initialState()` places the player. Optional only because the
   * task 3–5 fixture/test `WorldDef` literals (not this task's to touch)
   * predate it and don't declare one; `initialState()` throws if it's
   * missing rather than guessing a room.
   */
  startRoom?: RoomId;
  /**
   * Minutes a non-meta turn advances the clock by (§4.1: "Non-meta actions
   * advance it `minutesPerTurn` (default 1)"). `tick.ts` (task 13) reads
   * this; optional, defaulting to 1, so every fixture/test `WorldMeta`
   * literal that predates task 13 keeps compiling unchanged. Travel and
   * scripted `advanceClock` effects add *more* minutes on top of this base
   * — that addition happens in `effects.ts`, before `tick` ever runs.
   */
  minutesPerTurn?: number;
}

/**
 * Minimal container-authoring slice of §2.5's `ObjectDef.container` — just
 * the fields `objectState`/`isDark`/`scope` below read.
 */
export interface ContainerDef {
  open?: boolean;
  locked?: boolean;
  transparent?: boolean;
  /** The object that LOCK/UNLOCK accepts (`actions.ts`, §8 task 8). Absent ⇒ not lockable at all. */
  key?: ObjectId;
}

/**
 * Object-authoring slice of §2.5's `ObjectDef`. Task 6 had `location`,
 * `hidden`, `container`, `supporter`, `lightSource`, `plotCritical` —
 * darkness/scope/the plot-critical guard's needs. Task 8 (`actions.ts`)
 * adds `name` (rung-2 `{name}` templating and built-in refusal prose),
 * `portable`/`wearable`/`switchable` (the built-in verb gates), `text` and
 * `description` (READ's fallback, §2.5), and `handlers` (rung 1). Still not
 * `nouns`/`adjectives` — those are the parser's (tasks 9–11) to add.
 *
 * Task 9 (`parser/vocabulary.ts`) adds `nouns`/`adjectives` themselves —
 * the words the vocabulary compiler indexes an object under (§2.5).
 * Optional, not required as §2.5's full `ObjectDef` has them, so existing
 * fixture objects that predate the parser tasks keep compiling; an object
 * with neither contributes no vocabulary and can only ever be referred to
 * by pronoun (task 10) or not at all.
 */
export interface ObjectDefSlice {
  location: PlaceId;
  name?: string;
  nouns?: string[];
  adjectives?: string[];
  hidden?: boolean;
  container?: ContainerDef;
  supporter?: boolean;
  lightSource?: boolean; // while `on` and in scope, defeats baseline darkness (isDark, §2.4)
  plotCritical?: boolean;
  portable?: boolean;
  wearable?: boolean;
  switchable?: boolean;
  description?: Prose;
  text?: Prose; // READ; falls back to `description` when absent (§2.5)
  handlers?: HandlerDef[];
}

/**
 * §2.5's authored verb response/decoration for one object: rung 1 of the
 * §3.6 response ladder. `actions.ts`'s `performAction` looks for the first
 * handler on the resolved `dobj` whose `verbs` includes the verb, whose
 * `when` (if any) holds, and whose `withInstrument` matches the resolved
 * `iobj` — first match wins, exactly as `prose.ts`'s `ProseRule` selection
 * does. A match overrides built-in semantics entirely; it does not run
 * *in addition to* them.
 */
export interface HandlerDef {
  verbs: VerbId[];
  when?: Cond;
  /** `undefined` = don't care; `'any'` = some instrument required; `'none'` = no instrument; list = exactly one of these. */
  withInstrument?: ObjectId[] | 'any' | 'none';
  /** Overrides the verb's own `class` tag for this one handler (spec §2.5). */
  class?: ActionClass;
  effects: Effect[];
  /** Default true (spec §2.9's "consumesTurn — default true"). */
  consumesTurn?: boolean;
}

/**
 * §2.9's verb table entry. `words`/`patterns`/`preps` are the parser's
 * (tasks 9–11) to consume; task 8 needs only `class`, `meta`, and
 * `default` — the response-ladder rung 2 fallback (§3.6) — but the full
 * shape is declared here now so the parser tasks don't have to redefine
 * (and potentially diverge from) this type.
 */
export interface VerbDef {
  id: VerbId;
  words: string[];
  patterns: ('V' | 'V dobj' | 'V dobj prep iobj' | 'V npc about topic')[];
  preps?: string[];
  /** `null` = neutral (LOOK, WAIT, meta verbs). */
  class: ActionClass | null;
  /** SAVE/LOAD/UNDO/HINT/MAP…: no turn, no clock (§4.1). */
  meta?: boolean;
  /**
   * §14 rung-2 family, `{name}`-templated. Required (non-null) for every
   * non-meta verb — `validate` rejects a non-meta verb with `default: null`
   * (§8 task 8's first owed rule; without this, any verb–object pair
   * nobody hand-authored produces nothing).
   */
  default: Prose | null;
}

/**
 * Minimal room-authoring slice of §2.4's `RoomDef` — `dark`, the baseline
 * `isDark` reads, plus (task 9) `name`/`aliases` (§2.4), what the
 * vocabulary compiler indexes a room under for `GO TO`/bare-room-word
 * resolution (task 11), and (task 11) `exits` — the graph `GO TO`'s BFS
 * walks (§3.5). Still not `description`/etc. — those are later tasks' to
 * add. `name`/`aliases`/`dark`/`exits` are all optional, like
 * `ObjectDefSlice`'s `nouns`/`adjectives`, so existing fixture rooms that
 * predate these fields keep compiling.
 */
export interface RoomDefSlice {
  name?: string;
  aliases?: string[];
  dark?: true | Cond;
  exits?: ExitDefSlice[];
}

/**
 * Minimal exit-authoring slice of §2.4's full `ExitDef` (task 11, §3.5's
 * `GO TO`). The full spec shape also has `dir`, `blockedText`, `travelText`,
 * `minutes` — content-authoring/room-description fields a later task adds;
 * this is a minimal slice, like every other `*DefSlice` in this file, of
 * just what `GO TO`'s BFS needs to know an exit exists and is currently
 * passable: `to` (always), and optionally a `door` that must be open
 * (`objectState(world, state, door, 'open')`) or a `when` `Cond` that must
 * hold for the exit to be passable right now.
 */
export interface ExitDefSlice {
  to: RoomId;
  door?: ObjectId;
  when?: Cond;
}

/**
 * Minimal schedule-authoring slice of §2.6. `ScheduleRule.room` is where an
 * NPC is when `when` holds (or unconditionally, if `when` is omitted);
 * rules are tried in order, first match wins — the same convention
 * `prose.ts`'s `ProseRule` selection uses. This is deliberately not full
 * derivation (no `activity` text, no interaction with `tick`'s per-turn
 * recompute, no witnessed-event awareness) — task 13 owns that; see
 * `cond.ts`'s `npcRoom` doc comment for the precise boundary, and its file
 * header for why a rule's `when` must not depend on `npcAt` for its own npc.
 */
export interface ScheduleRule {
  when?: Cond;
  room: RoomId | 'offstage';
}

/**
 * Minimal npc-authoring slice of §2.6 — `schedule`, which `npcRoom`'s
 * fallback reads, `nouns`/`adjectives` (task 9), what the vocabulary
 * compiler indexes an NPC under, and (task 10) `pronoun` — §2.6's `NpcDef`
 * already specifies it; it was simply unplumbed until the parser's
 * `him`/`her`/`them` resolution (§3.4) needed a real data source instead of
 * guessing. Not yet `topics`/`handlers`/etc. — those are tasks 13–14's (see
 * `vocabulary.ts`'s `topicWords` doc comment: topic vocabulary has no data
 * source until `NpcDef.topics` lands).
 */
export interface NpcDefSlice {
  schedule?: ScheduleRule[];
  nouns?: string[];
  adjectives?: string[];
  /** §3.4's `him`/`her`/`them` resolution reads this — see `parser/vocabulary.ts`'s `npcPronouns`. Absent ⇒ this NPC never participates in pronoun fallback/antecedent-tracking (no guessing a gender the content never declared). */
  pronoun?: 'he' | 'she' | 'they';
}

/**
 * §2.8's world events, verbatim plus one task-13 addition. `when` is
 * typically clock + flags; `once` (default true) records `id` in
 * `state.firedEvents` the first time `when` holds and never fires again —
 * the ordinary shape for a one-time story beat (§4.2's "evaluate `EventDef`s
 * (fire matching, record `once` in `firedEvents`)"). `once: false` fires
 * every tick `when` holds, with no dedup — content's tool for something
 * that should keep re-applying for as long as a condition is true, not the
 * mechanism recurring weekly windows use (those are NPC schedules, §4.3
 * rule 1 — a schedule's `when` is re-evaluated fresh every tick with no
 * stored state to go stale, so "poker night" needs no `EventDef` at all).
 *
 * **`witnessedWhen` (task 13 addition, spec §4.3.3).** The spec's
 * `onlyIfWitnessed` flag says only "fire only when its effects are
 * observable" — it doesn't say *how* observability is determined, and
 * `EventDef` as specified carries no room to check the player against.
 * Reusing the `Cond` DSL for the perceivability check itself (rather than
 * inventing a bespoke `room`/`observedBy` field) keeps this expressive
 * without a new mechanism: an author writes `{ at: R('lobby') }` for "the
 * player must be in the room," or `{ all: [{ at: … }, { npcAt: […] }] }` for
 * "player and NPC in the same room," or anything else `Cond` can already
 * say. Required when `onlyIfWitnessed` is true — `tick.ts` throws rather
 * than silently treating a missing `witnessedWhen` as "never witnessed"
 * (which would quietly and permanently strand a `once: true` beat, exactly
 * the silent-doom failure mode §4.3.4/constitution §10 exists to prevent).
 * `when` and `witnessedWhen` are independent conditions, both re-evaluated
 * every tick: `when` says *whether* the beat is due; `witnessedWhen` says
 * whether the player can currently perceive it. A beat can become due while
 * unwitnessed and simply wait — every tick after that re-checks both, so it
 * fires the instant the player is in position, never missing the window
 * outright.
 */
export interface EventDef {
  id: string;
  when: Cond;
  /** Default true. */
  once?: boolean;
  /** Fire only when `witnessedWhen` also holds (§4.3.3). */
  onlyIfWitnessed?: boolean;
  /** The perceivability check (task 13 addition) — required iff `onlyIfWitnessed`. */
  witnessedWhen?: Cond;
  effects: Effect[];
}

/** Narrow, still-growing slice of §2.1's `WorldDef`. */
export interface WorldDef {
  meta: WorldMeta;
  flags: Record<FlagId, { default: FlagValue; doc: string }>;
  rooms?: Record<RoomId, RoomDefSlice>;
  objects?: Record<ObjectId, ObjectDefSlice>;
  npcs?: Record<NpcId, NpcDefSlice>;
  /** §2.8's world events (§8 task 13). Content is not required to declare any. */
  events?: Record<string, EventDef>;
  /** §2.9's verb table (§8 task 8). Content seeds this; the engine ships none. */
  verbs?: Record<VerbId, VerbDef>;
  /** Minimal slice of §2.7's `MemoryDef` — just what a `grantMemory` event needs. */
  memories?: Record<MemoryId, { lines: string[] }>;
  /** Minimal slice of §2.7's `ClueDef` — just what a `grantClue` event needs. */
  clues?: Record<ClueId, { title: string }>;
  /** Minimal slice of §2.7's `QuestionDef` — just what an open/answer event needs. */
  questions?: Record<QuestionId, { text: string }>;
  /** The `script` effect's escape hatch (ADR 0008): pure functions registered by id. */
  scripts?: Record<ScriptId, ScriptFn>;
  /**
   * Global response families the §3.6 ladder falls back to (`unknown`,
   * `nounMiss`, `unknownVerbKnownNoun`, …). A handler reaches one via
   * `{ say: { ref: 'familyName' } }` (§2.2) rather than duplicating a
   * shared family inline; `prose.ts`'s `render` resolves the ref.
   */
  responses?: Record<string, Prose>;
}

/**
 * The DSL escape hatch (spec §2.3, ADR 0008): pure, registered by id in
 * `world.scripts`, invoked by the `{ script: { id, args } }` effect. Takes
 * and returns the same shape `apply()` does, so a script's result threads
 * into the surrounding effect sequence exactly like any other effect.
 */
export type ScriptFn = (
  world: WorldDef,
  state: GameState,
  args?: Record<string, FlagValue>,
) => { state: GameState; events: GameEvent[] };

// ---------------------------------------------------------------------------
// Darkness and scope (§2.4, §0) — the two resolvers that need `Cond`
// evaluation (a room's `dark` baseline can be a `Cond`) but aren't part of
// `cond.ts`'s own mutually-recursive `npcRoom`/`evaluate` pair.
// ---------------------------------------------------------------------------

function isTransparent(world: WorldDef, id: ObjectId): boolean {
  return world.objects?.[id]?.container?.transparent === true;
}

/**
 * Whether `id` is somewhere the player could presently reach/perceive *if*
 * they were standing in `room` — directly in `room`, on a supporter in
 * `room`, inside an open-or-transparent container that is itself in scope
 * of `room` (recursively), or (only when `room` is where the player
 * actually is) carried in `inventory`/`worn`. Shared by `scope()` (always
 * called with `state.location`) and `isDark()`'s light-source check (called
 * with the room being tested for darkness, which in real play is always
 * `state.location` too — the parameter exists so both can be unit-tested
 * against an arbitrary room without moving the player there).
 */
function inScopeAt(world: WorldDef, state: GameState, room: RoomId, id: ObjectId): boolean {
  const loc = objectLocation(world, state, id);
  if (loc === 'inventory' || loc === 'worn') return room === state.location;
  if (typeof loc === 'string') return loc === room;
  if ('in' in loc) {
    if (!inScopeAt(world, state, room, loc.in)) return false;
    return objectState(world, state, loc.in, 'open') || isTransparent(world, loc.in);
  }
  if ('on' in loc) return inScopeAt(world, state, room, loc.on);
  return false; // { npc } or 'nowhere'
}

/**
 * §2.4's sole darkness authority. `RoomDef.dark` is baseline only ("this
 * room has no ambient light of its own"); a room is actually dark when the
 * baseline holds **and** no `lightSource` object that is `on` is in scope
 * (in the room, held, or worn — containers must be open or transparent).
 * The baseline cond must never itself mention a light source — that's what
 * makes a lit lamp defeat darkness through this function, not through the
 * room's own cond.
 */
export function isDark(world: WorldDef, state: GameState, room: RoomId): boolean {
  if (!baselineDark(world, state, room)) return false;
  return !hasActiveLightSourceInScope(world, state, room);
}

function baselineDark(world: WorldDef, state: GameState, room: RoomId): boolean {
  const dark = world.rooms?.[room]?.dark;
  if (dark === undefined) return false;
  if (dark === true) return true;
  return evaluate(world, state, dark);
}

function hasActiveLightSourceInScope(world: WorldDef, state: GameState, room: RoomId): boolean {
  const ids = Object.keys(world.objects ?? {}) as ObjectId[];
  return ids.some((id) => {
    if (world.objects![id]!.lightSource !== true) return false;
    if (!objectState(world, state, id, 'on')) return false;
    return inScopeAt(world, state, room, id);
  });
}

/**
 * Everything the player can currently see and reach: room contents,
 * supporters, open-or-transparent containers (recursively), inventory, and
 * worn items — excluding `hidden` objects and, when the room is dark,
 * excluding everything except what's carried (`inventory`/`worn`), which
 * stays reachable by touch (the classic IF convention: `INVENTORY` and
 * dropping/taking your own gear still work in the dark; you just can't see
 * the room around you).
 */
export function scope(world: WorldDef, state: GameState): ObjectId[] {
  const ids = Object.keys(world.objects ?? {}) as ObjectId[];
  const dark = isDark(world, state, state.location);
  return ids.filter((id) => {
    if (objectState(world, state, id, 'hidden')) return false;
    if (dark) {
      const loc = objectLocation(world, state, id);
      return loc === 'inventory' || loc === 'worn';
    }
    return inScopeAt(world, state, state.location, id);
  });
}
