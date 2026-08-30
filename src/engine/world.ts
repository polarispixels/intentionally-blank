// v2 world/state types (spec §1.2, §2.1).
//
// Collision note (task 3 → task 6): the architecture doc's directory map
// puts `GameState` in `state.ts` and the rest of `WorldDef` in `world.ts`.
// `src/engine/state.ts` is still the MVP's file (stays untouched until task
// 22 retires it), so both narrow types land here for now. Task 6 ("State +
// world resolution") owns turning this into the real split — moving
// `GameState` into a new `state.ts` once that's possible — and extending
// `WorldDef` with `rooms`/`objects`/`npcs`/etc. This file only declares the
// slices task 3 needs; it deliberately does not stub `RoomDef`, `ObjectDef`,
// `NpcDef`, or any other content-schema type those later tasks own.
//
// Task 5 (`effects.ts`) additions below follow the same "narrow slice, grow
// later" pattern: `objects`/`memories`/`clues`/`questions`/`scripts` are
// **not** the full §2.1/§2.5/§2.7 authoring schemas (those bring in
// `RoomDef`/handlers/etc. and are task 6/7/15/16's to design) — they carry
// only the fields the `Effect` DSL's runtime needs (e.g. `plotCritical` for
// the move guard, `lines`/`title`/`text` for the events a grant/open/answer
// emits). All new `WorldDef` fields are optional so `tests/prose.test.ts`'s
// already-shipped inline `WorldDef` literal (which predates this task and
// isn't task 5's to touch) keeps compiling untouched. Likewise `GameState`
// gains `phase`/`ending` (needed by `die`/`end`) as optional, not required
// as §1.2 has them, for the same reason: `tests/cond.test.ts` and
// `tests/prose.test.ts` build `GameState` object literals that omit them,
// and those files belong to tasks 3/4.

import type {
  ActionClass,
  ClueId,
  DayPhase,
  FlagId,
  FlagValue,
  MemoryId,
  NpcId,
  ObjectId,
  PlaceId,
  QuestionId,
  RoomId,
  ScriptId,
} from './ids';
import type { Prose } from './prose';

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
}

/** Narrow slice of §2.1's `WorldDef` — just what `cond.ts` reads today. */
export interface WorldDef {
  meta: WorldMeta;
  flags: Record<FlagId, { default: FlagValue; doc: string }>;
  /**
   * Minimal object-authoring slice (§2.5's full `ObjectDef` is later tasks'
   * to add): today only `plotCritical`, which `effects.ts`'s `move()` reads
   * for its runtime guard, and membership itself, which `effects.ts`'s
   * `setProp` uses to tell an `ObjectId` from an `NpcId` target (both are
   * plain strings at runtime — see that module for the disambiguation
   * rule). A world need not declare every object here yet; one it omits
   * simply never guards or disambiguates as an object.
   */
  objects?: Record<ObjectId, { plotCritical?: boolean }>;
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
   * `{ say: { ref: 'familyName' } }` (§2.2) rather than duplicating it
   * inline; `prose.ts`'s `render` resolves the ref. Optional per this
   * file's narrow-slice pattern (see header note) — a world that hasn't
   * authored global families yet simply has no `responses` to ref.
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

export interface Clock {
  day: number; // 1-based story day
  minute: number; // 0..1439, minute of day
}

export interface ObjectOverlay {
  location?: PlaceId;
  open?: boolean;
  locked?: boolean;
  on?: boolean; // powered / lit
  hidden?: boolean; // still concealed in its location
  props?: Record<string, FlagValue>; // object-scoped custom state
}

export interface NpcOverlay {
  /** Pinned position (scripted). Absent ⇒ position derives from schedule. */
  room?: RoomId | 'offstage';
  /** Position is the player's room. Precedence: following > pin > schedule. */
  following?: boolean;
  met?: boolean;
  props?: Record<string, FlagValue>;
}

/**
 * Narrow slice of §1.2's `GameState` — the fields `cond.ts`'s `evaluate`
 * and (as of task 4) `prose.ts`'s `render` read. Deliberately still omits
 * `turn`, `phase`, `hintsUsed`, `firedEvents`, `parser`, and `ending`:
 * `parser: ParserContext` forward references `StructuredAction`, which
 * belongs to the parser tasks (9–11) and doesn't exist yet, and the rest
 * simply aren't read by `evaluate` or `render`. `counters` was added back
 * here by task 4 — prose rotation (§2.2) reads and writes it, and per
 * §1.2's prime rule it has to live on `GameState` (not a module-level
 * variable) for rotation to survive serialize/deserialize. Task 6 adds the
 * remaining fields back when it moves this into the real `state.ts`.
 */
export interface GameState {
  clock: Clock;
  location: RoomId;
  objects: Partial<Record<ObjectId, ObjectOverlay>>;
  npcs: Partial<Record<NpcId, NpcOverlay>>;
  flags: Partial<Record<FlagId, FlagValue>>; // sparse overlay (§1.2.1)
  counters: Record<string, number>; // per-prose-node rotation counters (§2.2)
  visited: Record<RoomId, number>; // roomId → turn of first entry
  memories: MemoryId[]; // in recovery order
  clues: ClueId[]; // in discovery order
  questions: Partial<Record<QuestionId, 'open' | 'answered'>>; // sparse (§1.2.1)
  profile: Record<ActionClass, number>; // behavioral tallies (spec 04 §3)
  /** Optional per the file-header note above; task 6's `initialState()` always sets it. */
  phase?: Phase;
  /** Set by `die`/`end` (§2.3); optional for the same reason as `phase`. */
  ending?: { id: string };
}

/** §1.2's phase enum. Full `GameState` also has `turn`/`hintsUsed`/`firedEvents`/`parser` — not this task's to add (see file header). */
export type Phase = 'playing' | 'dead' | 'ended';

/**
 * §1.4's event union — the shell-facing output of every engine reducer.
 * Defined here (not in `effects.ts`) so `ScriptFn` above can reference it
 * without a circular import between `world.ts` and `effects.ts`.
 *
 * One addition beyond §1.4's literal text: `diag`'s `code` enum there lists
 * `'parserMiss' | 'defaultResponse' | 'nounMiss' | 'topicMiss'`, all parser
 * concerns — but §2.5 requires the plot-critical `move` guard to "leave
 * state unchanged and emit a diag event," and none of those four codes fit
 * a refused move. Adding `'plotCriticalGuard'` closes that gap; it's
 * additive only; the CLI's diag dump (task 20) already handles the code
 * generically.
 */
export type GameEvent =
  | { type: 'echo'; text: string }
  | { type: 'line'; kind: 'prose' | 'beat' | 'system'; text: string }
  | { type: 'memory'; id: MemoryId; lines: string[] }
  | { type: 'clue'; id: ClueId; title: string }
  | { type: 'question'; id: QuestionId; status: 'open' | 'answered'; text: string }
  | { type: 'clarify'; question: string; options: string[] }
  | {
      type: 'prompt';
      id: string;
      title: string;
      body: string;
      fields: { name: string; placeholder?: string; secret?: boolean }[];
    }
  | { type: 'promptClosed'; id: string }
  | { type: 'checkpoint'; id: string }
  | { type: 'died'; deathId: string }
  | { type: 'ended'; endingId: string }
  | { type: 'restarted' }
  | {
      type: 'diag';
      code: 'parserMiss' | 'defaultResponse' | 'nounMiss' | 'topicMiss' | 'plotCriticalGuard';
      detail: string;
    };
