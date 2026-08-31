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
import type { ActionClass, DayPhase, Direction, FlagId, FlagValue, MemoryId, ClueId, NpcId, ObjectId, PlaceId, PuzzleId, QuestionId, RoomId, ScriptId, TopicId, VerbId } from './ids';
// Type-only: `Effect` is only referenced in `HandlerDef`'s type signature
// below, never called at runtime from this module, so this stays a
// compile-time-only edge even though `effects.ts` itself imports `WorldDef`
// from here (also `import type`) — a genuine runtime cycle would need a
// real value to flow in both directions, and neither side has one, unlike
// the `cond.ts`/`world.ts` `evaluate` cycle documented above.
import type { Effect } from './effects';
import type { Prose } from './prose';
import { objectLocation, objectState } from './resolve';
import type { Clock, GameEvent, GameState } from './gamestate';

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
  /**
   * Where `initialState` puts the clock; default `{ day: 1, minute:
   * phases.morning }` for fixtures that predate it (ADR 0011, Stage D
   * `E1`). Act I's fiction opens at 04:20, not the engine's old fixed
   * 07:00 — this is what let `startClock: { day: 1, minute: 260 }` fix
   * that without touching `GameState`/`SaveFile`. `validate.ts`'s
   * `meta-start-clock-invalid` rejects `day < 1` or a `minute` outside
   * `[0, 1440)`.
   */
  startClock?: Clock;
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
  /**
   * Findable by touch even when the room is dark (§2.4/§8 gap 1: the
   * opening room's pull chain — the tutorial affordance a player must be
   * able to find by feel before any light exists to see it by). `scope()`'s
   * dark branch is otherwise all-or-nothing ("only `inventory`/`worn` stays
   * reachable"); this is the per-object exception, checked against the
   * object's *own* current placement (`objectLocation`/`inScopeAt` — the
   * same physical-presence rule sight uses, minus the sight itself), not
   * inherited by anything resting on or inside it. A boolean field rather
   * than a string tag in the free-form `tags` list below: every other
   * gameplay-mechanical switch on this interface (`hidden`, `portable`,
   * `plotCritical`, …) is a typed boolean the engine checks directly;
   * `tags` is content-authoring metadata (`'analog'`, `'evidence'`, …) the
   * engine never reads, and stringly-matching a `'tactile'` entry out of it
   * would blur that boundary and be one typo away from silently doing
   * nothing. See `world.ts`'s `scope()`/`reachableByTouch` for the other
   * half of this: an object resting on/in something that is itself carried
   * (a player's own hand, a coat pocket) needs no flag of its own — it
   * inherits touch-reachability by following the same containment chain
   * `inScopeAt` already walks for sight.
   */
  reachableInDark?: boolean;
  description?: Prose;
  text?: Prose; // READ; falls back to `description` when absent (§2.5)
  /**
   * §2.5's room-listing line: what `move.ts`'s room rendering prints after
   * a room's `description` while this object is still unmoved from its
   * authored `location` (`objectHasBeenMoved`, below, is false) — "the
   * bespoke sentence... which is what makes a room read like prose rather
   * than a manifest." Optional: a portable object fully woven into the
   * room's own `description` prose (no separate listing line needed while
   * it stays put) simply omits this. Once the object has been handled
   * (`objectHasBeenMoved`), this is never rendered — the room's generic
   * listing family takes over instead, since the staged sentence is no
   * longer true. Never mentions state a room's `description` should
   * already cover (light, other objects); this is one object's own line.
   */
  listedAs?: Prose;
  /**
   * Overrides the article `move.ts`'s generic room-listing family
   * (`room.genericListing`, §2.5) prepends to `name` when this object has
   * been handled and lies wherever it was put down — the family text is
   * `'There is {name} here.'`, so `{name}` itself must carry it. Left
   * unset, the article defaults from `name`'s first letter (a/an), which
   * is right for the overwhelming majority of objects; author this only
   * for the exceptions (a plural, a mass noun). Ignored when `proper` is
   * true. Bare `name` (no article) is unaffected everywhere else —
   * `take`, refusals, handler prose all keep using it as authored.
   */
  article?: string;
  /**
   * True for an object whose `name` is a proper name and takes no article
   * at all in the generic listing family — an NPC-like object called
   * "Marlow" must render "There is Marlow here.", never "There is a
   * Marlow here." Overrides `article`.
   */
  proper?: boolean;
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
 * walks (§3.5). (Task 17) `area`/`map` — §2.4's map-grouping label and
 * authored `{x,y,z}` coordinates, read only by `views.ts`'s `mapView`
 * (§6.1); nothing else in the engine touches either field. Still not
 * `description`/etc. — those are later tasks' to add. Every field here is
 * optional, like `ObjectDefSlice`'s `nouns`/`adjectives`, so existing
 * fixture rooms that predate these fields keep compiling.
 */
/**
 * §2.4's `onEnter` entry — no `id` of its own (unlike `EventDef`), so
 * `move.ts`'s once-dedup key is derived from the room id + the rule's own
 * index in the array (`room.<roomId>.onEnter[i]`), mirroring `effects.ts`'s
 * own index-derived rotation paths. `once` defaults to `true`, matching
 * `EventDef`'s own default (§2.8) — the two shapes are otherwise identical,
 * and nothing in §2.4 states a different default for this one.
 */
export interface OnEnterRule {
  when?: Cond;
  /** Default true, matching `EventDef.once` (§2.8). */
  once?: boolean;
  effects: Effect[];
}

/**
 * §8 task 20b additions: `description` (full LOOK text, state-dependent —
 * `move.ts`'s `renderArrival`/`look` render this), `firstVisit` (prepended
 * exactly once, the first turn `state.visited[id]` is set), and `onEnter`
 * (run on every entry, `once`-gated per rule) — the room-authoring fields
 * task 6 left for "later tasks [...] to add" (see this interface's own
 * earlier header note). Both `description` and `firstVisit` are optional
 * here like every other `*DefSlice` field, but `move.ts`'s `renderArrival`
 * throws at runtime if a room it actually enters has no `description` — the
 * same "missing authored data is a content bug" convention `actions.ts`'s
 * `builtinRead` and `respond.ts`'s `family()` already use.
 */
export interface RoomDefSlice {
  name?: string;
  aliases?: string[];
  area?: string;
  map?: { x: number; y: number; z?: number };
  dark?: true | Cond;
  description?: Prose;
  firstVisit?: Prose;
  onEnter?: OnEnterRule[];
  exits?: ExitDefSlice[];
  /**
   * Room-level verb handlers (§2.4) — ambient senses with no direct object
   * (SMELL/LISTEN with nothing named) and other bare-verb actions whose
   * answer belongs to the room itself rather than to any one object (§8 gap
   * 3/4: STAND, a terminal login attempt, …). Matched by `actions.ts`'s
   * `performAction` the same way an object's own `handlers` are — first
   * `verbs`/`when`/`withInstrument` match wins — but only ever consulted
   * for a verb with no `dobj` at all, and only once no dobj-based
   * handler/built-in has already claimed the verb (there is none to claim
   * it, since `dobj` is absent): see that module's own call site for why.
   * Unlike an object's `handlers`, these run full `Effect`s (not just
   * `Prose`), which is what makes a bare verb able to set a flag at all —
   * `VerbDef.default` alone never could.
   */
  handlers?: HandlerDef[];
}

/**
 * Exit-authoring slice of §2.4's full `ExitDef` (task 11's `GO TO`, §8 task
 * 20b's direction traversal). `to`/`door`/`when` are task 11's (GO TO's BFS
 * graph needs only whether an exit exists and is currently passable).
 * Task 20b adds the rest: `dir` (which direction verb reaches this exit —
 * optional, like every other `*DefSlice` field, so an exit meant only for
 * `GO TO` routing needn't declare one, though `move.ts`'s direction
 * traversal can then never reach it directly), `blockedText` (exit-specific
 * prose for "exists but a closed door won't yield" — distinct from the
 * global "no exit that way" family, per this task's own brief), `travelText`
 * (shown on successful use, before the destination's arrival render), and
 * `minutes` (extra clock time this specific exit's travel costs, applied via
 * the same `advanceClock` mechanism `effects.ts` already defines — "beyond
 * the per-turn default", not a replacement of it; see `move.ts`'s header for
 * why that reading was chosen over the field's own doc-comment word
 * "override").
 */
export interface ExitDefSlice {
  dir?: Direction;
  to: RoomId;
  door?: ObjectId;
  when?: Cond;
  blockedText?: Prose;
  travelText?: Prose;
  minutes?: number;
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
 * §2.6's `TopicDef` — one ASK/TELL topic. `words` are the phrasings that
 * reach it ("sibling", "brother", "jules"), matched against the parser's
 * raw `StructuredAction.topic` string by `npc.ts` (§8 task 14) — never
 * resolved by the parser itself (§3.1: "ASK/TELL, raw topic words — never
 * resolved"). `when` is knowledge gating: a topic whose `when` doesn't hold
 * is treated by `npc.ts` as though it doesn't exist at all (falls to the
 * NPC's own `unknownTopic`, indistinguishable from a topic nobody authored
 * — see `npc.ts`'s header for why that's structural, not a special case).
 * `class` defaults to `'social'` when omitted (§2.6).
 */
export interface TopicDef {
  id: TopicId;
  words: string[];
  when?: Cond;
  response: Prose;
  effects?: Effect[];
  class?: ActionClass;
}

/**
 * §2.6's `NpcDef.showResponses` entry — SHOW <object> TO <npc>. `objects`
 * is either an explicit list or `'any'`; `when` gates it the same way a
 * topic's `when` does.
 */
export interface ShowResponseDef {
  objects: ObjectId[] | 'any';
  when?: Cond;
  response: Prose;
  effects?: Effect[];
}

/**
 * Minimal npc-authoring slice of §2.6 — `schedule`, which `npcRoom`'s
 * fallback reads, `nouns`/`adjectives` (task 9), what the vocabulary
 * compiler indexes an NPC under, and (task 10) `pronoun` — §2.6's `NpcDef`
 * already specifies it; it was simply unplumbed until the parser's
 * `him`/`her`/`them` resolution (§3.4) needed a real data source instead of
 * guessing. Task 14 adds `topics`/`tellTopics`/`showResponses`/
 * `unknownTopic`/`greeting` — see `npc.ts` for the logic that reads them.
 * All optional, like every other field here, so existing fixture NPCs that
 * predate conversation keep compiling unchanged; `npc.ts` throws at runtime
 * if a topic/show match is reached with no `unknownTopic` authored to fall
 * back to (a content bug, same convention as this codebase's other
 * `family()`-style throws) — not yet `validate`-enforced (see that file's
 * SCOPE NOTE on extending it alongside a new schema field).
 */
export interface NpcDefSlice {
  schedule?: ScheduleRule[];
  nouns?: string[];
  adjectives?: string[];
  /** §3.4's `him`/`her`/`them` resolution reads this — see `parser/vocabulary.ts`'s `npcPronouns`. Absent ⇒ this NPC never participates in pronoun fallback/antecedent-tracking (no guessing a gender the content never declared). */
  pronoun?: 'he' | 'she' | 'they';
  /**
   * The authored display name (mirrors `ObjectDefSlice.name`) — §2.6's
   * `NpcDef` doesn't specify a separate display-name field, but objects
   * have had one since task 8, read by `actions.ts`'s `objectName` for
   * every rung-2 `{name}` templating, precisely to avoid vocab-derived
   * naming in prose. NPCs had no equivalent, so every `{name}`/`{dobj}`
   * context this module's readers (`npc.ts`, `respond.ts`) built for an NPC
   * fell back to `parser/resolver.ts`'s `candidateName` — a *disambiguation*
   * helper (§3.3), never designed as a display name: it glues an NPC's
   * first-indexed adjective to its first-indexed noun ("night marlow" for
   * Marlow, whose `adjectives` lists "night" before `nouns` lists "marlow"
   * — correct for "which lamp did you mean," wrong for "who is this
   * person"). That is the single root cause of Ryan's `X MARLOW` bug
   * report (fixed here, not per-NPC): `npcDisplayName` (`npc.ts`) now reads
   * this field first and only falls back to `candidateName` when an NPC
   * doesn't author one — existing fixture/content NPCs with no `name` keep
   * their prior (still vocab-derived) rendering unchanged.
   */
  name?: string;
  /**
   * EXAMINE's authored text (§2.6: "the personality lives here") — mirrors
   * `ObjectDefSlice.description`, though an NPC has no READ fallback (people
   * aren't read). `respond.ts`'s NPC-target rung 2 renders this — ahead of
   * the verb's own generic `default` family — for the reserved EXAMINE verb
   * id only (`respond.ts`'s `EXAMINE_VERB_ID`, the same "content declares
   * the words/patterns under this exact id" convention `LOOK_VERB_ID`/
   * `USE_VERB_ID` already use), the same way `handlers` below is checked
   * first for every npc-targeted verb. Absent ⇒ EXAMINE on this NPC falls
   * through exactly as any other unhandled npc-targeted verb always has.
   */
  description?: Prose;
  /**
   * Generic npc-targeted verb handlers — parity with `ObjectDefSlice.
   * handlers` (rung 1), added alongside `description` per this task's
   * report (ATTACK MARLOW/FOLLOW MARLOW had no authoring surface at all).
   * Matched by `respond.ts`'s `respondToNpcTarget` the same way
   * `actions.ts`'s `findHandler` matches an object's own — first handler
   * whose `verbs` includes the resolved verb and whose `when` (if any)
   * holds wins, and its effects run via `apply()`, overriding the verb's
   * default family entirely. `withInstrument` is accepted by the type for
   * parity but is never actually matched against a real `iobj` today —
   * `respondToNpcTarget`'s own call site (`respond.ts`) doesn't thread one
   * through (ATTACK/FOLLOW aren't declared verbs anywhere in this world
   * yet, so nothing exercises it) — flagged here rather than silently
   * pretended-working.
   */
  handlers?: HandlerDef[];
  /** ASK <npc> ABOUT <topic>. */
  topics?: TopicDef[];
  /**
   * TELL <npc> ABOUT <topic>. Absent ⇒ `npc.ts` reuses `topics` for TELL
   * too (most NPCs don't need ASK and TELL to diverge) — see `npc.ts`'s
   * header for this default, called out as a task-14 assumption in its
   * report rather than left implicit.
   */
  tellTopics?: TopicDef[];
  /** SHOW <object> TO <npc>. */
  showResponses?: ShowResponseDef[];
  /**
   * Authored per NPC (§2.6: "the personality lives here") — what this NPC
   * says to a topic none of `topics`/`tellTopics` matched (word mismatch
   * or a real topic gated off by an unmet `when`; both look identical from
   * here, which is exactly what keeps a gated topic from leaking its own
   * existence). Required, in practice, by any NPC that declares `topics`
   * or `tellTopics` — see this field's optionality note above.
   */
  unknownTopic?: Prose;
  /** TALK TO / HELLO. Absent ⇒ falls through to the verb's own rung-2 `default` family, same as any other unhandled npc-targeted verb. */
  greeting?: Prose;
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

/**
 * §2.7's `PuzzleDef`, verbatim plus one task-16 addition (`route`, on
 * `solutions` entries — see `PuzzleSolution` below). `solvedWhen` is
 * derived — never a stored boolean (§1.1) — and checked every tick
 * (`puzzles.ts`, §8 task 16) for a first-time (edge) transition to true, at
 * which point `onSolved` fires once. Multi-route convergence needs no
 * special machinery: each route is ordinary handlers/effects that
 * eventually satisfy `solvedWhen` (e.g. `{ any: [{ flag: door_unlocked },
 * { flag: guard_distracted }] }`) — `solutions` merely *documents* those
 * routes "so hints, the profile system, and the design review can see
 * them" (§2.7).
 */
export interface PuzzleDef {
  id: PuzzleId;
  name: string;
  /** The player-facing anchor for HINT (§6.5/spec 04 §15). */
  question?: QuestionId;
  /** Derived — never a stored boolean (§1.1). */
  solvedWhen: Cond;
  solutions: PuzzleSolution[];
  /** Progressive ladder, vague → explicit (spec 04 §15). Authored prose (hard rule 5) — fixture-only strings belong in tests. */
  hints: string[];
  /** Fired once, the first tick `solvedWhen` holds (`puzzles.ts`, §4.2 step 6). */
  onSolved?: Effect[];
  /**
   * Named recovery path (§4.3.4/constitution §10) — satisfies
   * `validate.ts`'s clock-free-solution rule when no `solutions` route is
   * itself clock-free. Names the recovery a missed timed window falls back
   * to (a second occurrence, an alternate clue source, an NPC report)
   * rather than silently dooming the player.
   */
  missedRecovery?: string;
}

/**
 * §2.7's `solutions` entry (`{ id, class, note }`) verbatim, plus `route` —
 * the shape chosen (task 16) to make §4.3.4's clock-free-solution rule
 * mechanical. The spec entry carries no condition at all, so nothing about
 * it was checkable for a `clock`/`clockPhase`/`weekday` term; `route` is an
 * optional `Cond` describing what this specific route actually depends on
 * — typically the same flag/state condition that route's own handlers set
 * and `solvedWhen` reads back (e.g. `{ flag: door_unlocked }` for the
 * "pick the lock" route of a puzzle whose `solvedWhen` is `{ any: [{ flag:
 * door_unlocked }, { flag: guard_distracted }] }`). Optional and
 * design-time only — nothing in the engine evaluates it at runtime; a
 * route with no `route` cond at all reads as trivially clock-free to
 * `validate.ts` (there is nothing in it to flag), the safe default for a
 * route whose real condition genuinely never mentions the clock.
 */
export interface PuzzleSolution {
  id: string;
  class: ActionClass;
  note: string;
  route?: Cond;
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
  /**
   * Minimal slice of §2.7's `MemoryDef`. `trigger` (§8 task 15 addition) is
   * the ambient acquisition path — `knowledge.ts`'s tick step grants the
   * memory the first turn `trigger.when` holds, provided it isn't already
   * in `state.memories` (§4.2 step 4). Absent ⇒ this memory is only ever
   * granted by an explicit `{ grantMemory }` effect. `title` (task 17
   * addition) is the memory-list entry `views.ts`'s `memoriesView` (§6.4)
   * renders; not yet `class` (§2.7's full shape, the profile-flavored-recall
   * advisory tag) — that field has no reader anywhere in the engine yet, so
   * it stays out of this slice until something actually consumes it.
   */
  memories?: Record<MemoryId, { title: string; lines: string[]; trigger?: { when: Cond } }>;
  /**
   * Minimal slice of §2.7's `ClueDef`. `questions` (§8 task 15 addition) is
   * "which open questions it bears on" — declared here for §6.3's future
   * notebook view and referential-integrity checking (`validate.ts`); this
   * task's own tick logic never reads it. `detail` (task 17 addition) is
   * the notebook expansion `views.ts`'s `notebookView` (§6.3) renders —
   * strictly recap of the clue's own discovery scene, never new
   * information (an authoring rule, unenforceable mechanically; see that
   * function's doc comment).
   */
  clues?: Record<ClueId, { title: string; detail: string; questions?: QuestionId[] }>;
  /**
   * Minimal slice of §2.7's `QuestionDef`. `openWhen`/`answerWhen` (§8 task
   * 15 addition) are the ambient conditions `knowledge.ts`'s tick step
   * recomputes every turn (§4.2 step 5) — absent ⇒ that transition only
   * ever happens via an explicit `{ openQuestion }` / `{ answerQuestion }`
   * effect. `answer` (task 17 addition, not in the spec's §2.7 literal —
   * see `views.ts`'s `questionsView` doc comment) is the authored recap
   * text §6.2 requires once a question moves to the settled list. Optional
   * so content can open/answer a question ambiently before its recap is
   * written; a question answered with no `answer` authored surfaces as an
   * empty recap rather than throwing (a content gap to catch by review, not
   * a crash).
   */
  questions?: Record<QuestionId, { text: string; openWhen?: Cond; answerWhen?: Cond; answer?: string }>;
  /** §2.7's `PuzzleDef`s (§8 task 16). Content is not required to declare any. */
  puzzles?: Record<PuzzleId, PuzzleDef>;
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
  if (loc === 'inventory' || loc === 'worn' || loc === 'self') return room === state.location;
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
 * Whether `id` is reachable by TOUCH in a dark room — §8 gap 1's fix to
 * `scope()`'s previously all-or-nothing dark rule. Two independent routes,
 * either one is enough:
 *
 *   1. `id` is carried (`inventory`/`worn`) — unchanged from before this
 *      fix: you always know what you're holding, dark or not.
 *   2. `id` rests `{ in }`/`{ on }` something that is *itself* reachable by
 *      touch (recursively — this is what lets an object resting on a
 *      carried item, e.g. a sub-part of the player's own body, work with no
 *      `reachableInDark` flag of its own: touching your own hand needs no
 *      separate authoring), OR `id` itself is flagged `reachableInDark` and
 *      is currently physically present (`inScopeAt` — the same
 *      containment/open-container rule sight uses, just without the sight).
 *
 * `reachableInDark` is checked on `id` directly, never inherited downward
 * onto whatever rests on/in it — a lamp being findable by touch would not
 * itself make things sitting on its shade findable too; each object that
 * needs to be feelable in the dark says so.
 */
function reachableByTouch(world: WorldDef, state: GameState, room: RoomId, id: ObjectId): boolean {
  // Checked first, and on `id` itself only (never inherited via the
  // recursion below) — see this function's own doc comment.
  if (world.objects?.[id]?.reachableInDark === true) return inScopeAt(world, state, room, id);
  const loc = objectLocation(world, state, id);
  if (loc === 'inventory' || loc === 'worn' || loc === 'self') return true;
  if (typeof loc === 'object') {
    if ('in' in loc) return reachableByTouch(world, state, room, loc.in);
    if ('on' in loc) return reachableByTouch(world, state, room, loc.on);
  }
  return false;
}

/**
 * Everything the player can currently see and reach: room contents,
 * supporters, open-or-transparent containers (recursively), inventory, and
 * worn items — excluding `hidden` objects and, when the room is dark,
 * excluding everything except what's reachable by touch (`reachableByTouch`,
 * above): carried items (the classic IF convention: `INVENTORY` and
 * dropping/taking your own gear still work in the dark) plus whatever
 * content has explicitly authored as findable by feel (§2.4/§8 gap 1).
 */
export function scope(world: WorldDef, state: GameState): ObjectId[] {
  const ids = Object.keys(world.objects ?? {}) as ObjectId[];
  const dark = isDark(world, state, state.location);
  return ids.filter((id) => {
    if (objectState(world, state, id, 'hidden')) return false;
    if (dark) return reachableByTouch(world, state, state.location, id);
    return inScopeAt(world, state, state.location, id);
  });
}

// ---------------------------------------------------------------------------
// Room listing (§2.5 `listedAs`, this task) — the fix for the "fedora still
// on the floor after you took it" bug: a room's `description` is scenery
// (never goes stale because nothing in it moves); portable objects are
// listed separately, from state, after it.
// ---------------------------------------------------------------------------

/**
 * Whether `id`'s location has ever been explicitly written by an effect (a
 * `move` — including TAKE's and DROP's own built-in `{ move: [...] }`),
 * rather than still resolving purely through `objectLocation`'s authored-
 * default fallback (§1.1's overlay principle: an unset overlay entry means
 * "still where content put it"). Deliberately a *presence* check on the
 * overlay, not a value comparison against the authored `location` — DROP
 * back in the exact room an object started in still calls `{ move: [id,
 * state.location] }` (`actions.ts`'s `builtinDrop`), which unconditionally
 * writes a fresh overlay entry (`effects.ts`'s `move`/`patchObject`) even
 * though the resulting *value* matches the authored default again. A value
 * comparison would therefore call a dropped-back object "unmoved" and
 * re-print its staged `listedAs` line, contradicting this task's own
 * worked example ("took and dropped elsewhere, **or dropped back**" both
 * print the generic line). Presence, not value, is what "has been
 * handled" actually means here — and it's still derived, not a new flag:
 * this reads the exact overlay slot `objectLocation` already resolves
 * through, so it needs no extra bookkeeping and survives save/load for
 * free (§1.1).
 */
export function objectHasBeenMoved(state: GameState, id: ObjectId): boolean {
  return state.objects[id]?.location !== undefined;
}

/**
 * Portable objects physically present in `room` right now — what
 * `move.ts`'s room rendering lists after a room's `description`, on
 * arrival and on `LOOK` alike (§2.5). Walks the same containment shapes
 * `inScopeAt` does (direct in the room; on a supporter in the room; inside
 * an open-or-transparent container in the room, recursively — nesting
 * depth is not limited), but is its own recursion rather than a reuse of
 * `inScopeAt`: that function's `'inventory'`/`'worn'` arm returns true
 * whenever `room === state.location` (correct for `scope()`, which is
 * about to add the player's own hands to what's usable) — reused here it
 * would wrongly count whatever the player is carrying as "resting in the
 * room they're standing in". This walk instead returns `false` outright
 * for `'inventory'`/`'worn'`/`'self'`/`'nowhere'`/`{ npc }`, at every
 * level of the chain, not only the top. Scenery (`portable` unset or
 * `false`) is never listed regardless of its location or state — it lives
 * in the room's own prose, correctly, per this task's brief. `hidden`
 * objects are excluded the same way `scope()` excludes them.
 */
export function objectsListedInRoom(world: WorldDef, state: GameState, room: RoomId): ObjectId[] {
  const ids = Object.keys(world.objects ?? {}) as ObjectId[];
  return ids.filter((id) => {
    const def = world.objects![id]!;
    if (def.portable !== true) return false;
    if (objectState(world, state, id, 'hidden')) return false;
    return physicallyInRoom(world, state, room, id);
  });
}

function physicallyInRoom(world: WorldDef, state: GameState, room: RoomId, id: ObjectId): boolean {
  const loc = objectLocation(world, state, id);
  if (typeof loc === 'string') return loc === room; // false for 'inventory'/'worn'/'self'/'nowhere' too — none equals a real RoomId
  if ('in' in loc) {
    if (!physicallyInRoom(world, state, room, loc.in)) return false;
    return objectState(world, state, loc.in, 'open') || isTransparent(world, loc.in);
  }
  if ('on' in loc) return physicallyInRoom(world, state, room, loc.on);
  return false; // { npc } — carried by an NPC, not resting in the room
}
