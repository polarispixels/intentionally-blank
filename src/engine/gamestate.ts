// The full v2 state schema (spec §1.2) plus `initialState(world)` (§8 task 6).
//
// COLLISION NOTE (task 3 → task 6, per the task 6 brief): the architecture
// doc's directory map puts `GameState` in `state.ts`, but `src/engine/state.ts`
// is still the *MVP* engine's file — `src/ui/App.vue` and `src/cli/play.ts`
// import `start()` from `../engine`, which re-exports it, and task 22 is the
// one that retires it. Rather than fight over that filename, the full v2
// state schema lands here instead; `world.ts` re-exports everything below so
// every existing `from './world'` import (cond.ts, prose.ts, effects.ts, and
// their tests) keeps compiling unchanged. A later rename to `state.ts` is a
// trivial, mechanical change once task 22 deletes the MVP file.
//
// FIELD COMPLETENESS: this is §1.2's `GameState` verbatim. `parser:
// ParserContext` was left out through task 6 — `ParserContext.pending` and
// `.last` forward-reference `StructuredAction`, which didn't exist until
// task 9 — but task 9's own header named this file's task as "whichever of
// task 10/11 first needs `pending`/`last` to persist turn-to-turn" to add
// it back; task 10 is that task (disambiguation and pronouns both need
// antecedents to survive save/load/undo exactly, per spec §3.4). The type
// itself stays owned by `interpreter.ts` (imported here, not redefined) —
// only `import type`, so this file gains no runtime dependency on it.
//
// `turn`/`phase`/`hintsUsed`/`firedEvents` are **required**, matching §1.2
// (only `ending` is optional there, and stays optional here). An earlier
// version of this file typed them optional to avoid touching the
// `baseState()` helpers in `tests/cond.test.ts`/`tests/effects.test.ts`/
// `tests/prose.test.ts` (task 3–5's, not task 6's to touch) — that traded a
// one-time fixture edit for a permanently weaker type every later task
// builds on (every read would need `state.turn ?? 0` forever, and one of
// them would eventually forget). Fixed in review: those three
// `baseState()` helpers now set all four fields, with the coordinator's
// explicit permission to touch exactly that line in each file.

import type {
  ActionClass,
  ClueId,
  FlagId,
  FlagValue,
  MemoryId,
  NpcId,
  ObjectId,
  PlaceId,
  PuzzleId,
  QuestionId,
  RoomId,
} from './ids';
import type { WorldDef } from './world';
import type { ParserContext } from './interpreter';

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

export type Phase = 'playing' | 'dead' | 'ended';

export interface GameState {
  phase: Phase;
  turn: number; // accepted world turns
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
  hintsUsed: Partial<Record<PuzzleId, number>>;
  profile: Record<ActionClass, number>; // behavioral tallies (spec 04 §3)
  firedEvents: string[]; // once-only EventDef / trigger ids
  /** Set when `phase !== 'playing'` (die/end effects). Optional per §1.2 itself. */
  ending?: { id: string };
  parser: ParserContext;
}

/**
 * §1.4's event union — the shell-facing output of every engine reducer.
 * Lives here (not `effects.ts`) so `world.ts`'s `ScriptFn` can reference it,
 * and here rather than `world.ts` (its task-3/5 home) because it is, per
 * §0's directory map, part of the state module's surface, not `WorldDef`'s.
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
      code: 'parserMiss' | 'defaultResponse' | 'nounMiss' | 'topicMiss' | 'plotCriticalGuard'
          | 'phaseRefused';
      detail: string;
    };

/**
 * The starting `GameState` for a fresh playthrough (§1.3). `world.meta.startRoom`
 * is required for this to resolve a location — it's typed optional on
 * `WorldMeta` only because older fixture/test `WorldDef` literals (task
 * 3–5's, not this task's to touch) don't declare it; a world that omits it
 * cannot start a game, so this throws rather than guessing a room.
 *
 * Two content decisions this task made, absent a spec-literal answer:
 *   - The starting clock is day 1 at the minute `meta.phases.morning` marks
 *     — "world time from day one" (§4.1) doesn't pin an exact minute, and
 *     the worked opening room (§2.10) reads as a morning scene.
 *   - `visited[startRoom] = 0` is seeded up front. The player begins in that
 *     room without an `onEnter`-triggering transition into it, and `GO TO`
 *     / the map view (§6.1) only ever route through `visited` rooms — if
 *     the start room weren't marked visited immediately, the player could
 *     never `GO TO` back to it after their first move.
 */
export function initialState(world: WorldDef): GameState {
  const startRoom = world.meta.startRoom;
  if (startRoom === undefined) {
    throw new Error('initialState: world.meta.startRoom is not declared');
  }
  return {
    clock: { day: 1, minute: world.meta.phases.morning },
    location: startRoom,
    objects: {},
    npcs: {},
    flags: {},
    counters: {},
    visited: { [startRoom]: 0 },
    memories: [],
    clues: [],
    questions: {},
    profile: { analytical: 0, social: 0, direct: 0 },
    turn: 0,
    phase: 'playing',
    hintsUsed: {},
    firedEvents: [],
    parser: {},
  };
}
