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

import type {
  ActionClass,
  ClueId,
  FlagId,
  FlagValue,
  MemoryId,
  NpcId,
  ObjectId,
  PlaceId,
  QuestionId,
  RoomId,
} from './ids';

/** Narrow slice of §2.1's `WorldDef` — just what `cond.ts` reads today. */
export interface WorldDef {
  flags: Record<FlagId, { default: FlagValue; doc: string }>;
}

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
 * reads. Deliberately omits `turn`, `phase`, `counters`, `hintsUsed`,
 * `firedEvents`, `parser`, and `ending`: `parser: ParserContext` forward
 * references `StructuredAction`, which belongs to the parser tasks (9–11)
 * and doesn't exist yet, and the rest simply aren't read by any `Cond` arm.
 * Task 6 adds them back when it moves this into the real `state.ts`.
 */
export interface GameState {
  clock: Clock;
  location: RoomId;
  objects: Partial<Record<ObjectId, ObjectOverlay>>;
  npcs: Partial<Record<NpcId, NpcOverlay>>;
  flags: Partial<Record<FlagId, FlagValue>>; // sparse overlay (§1.2.1)
  visited: Record<RoomId, number>; // roomId → turn of first entry
  memories: MemoryId[]; // in recovery order
  clues: ClueId[]; // in discovery order
  questions: Partial<Record<QuestionId, 'open' | 'answered'>>; // sparse (§1.2.1)
  profile: Record<ActionClass, number>; // behavioral tallies (spec 04 §3)
}
