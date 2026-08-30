// The declarative `Cond` DSL (spec §2.3, ADR 0008) and its evaluator.
//
// `flag()` and `questionStatus()` are the only sanctioned way to read
// `state.flags` / `state.questions` (spec §1.2.1): both are sparse
// overlays where an absent entry means "use the content default"
// (`world.flags[id].default`) or `'unopened'`, and every other engine read
// — `evaluate` included — must go through them rather than indexing
// `state.flags[id]` / `state.questions[id]` directly.
//
// The other `Cond` arms (has/at/objectAt/objectState/prop/npcAt/met/…)
// read only from `GameState`'s overlays as recorded — this module does not
// fall back to a `WorldDef`-authored default location/state for objects or
// NPCs, and does not derive NPC position from a schedule. That overlay
// resolution ("scope, visibility, light, movement" per §0's directory map)
// is task 6's (`world.ts`) job; giving it here would preempt that task.

import type { ActionClass, ClueId, DayPhase, FlagId, FlagValue, MemoryId, NpcId, ObjectId, PlaceId, QuestionId, RoomId } from './ids';
import { samePlace } from './ids';
import { phase, weekday } from './clock';
import type { GameState, WorldDef } from './world';

export type Cond =
  | { flag: FlagId; is?: FlagValue; atLeast?: number } // is defaults to true
  | { has: ObjectId } // in inventory or worn
  | { at: RoomId } // player location
  | { objectAt: [ObjectId, PlaceId] }
  | { objectState: [ObjectId, 'open' | 'locked' | 'on' | 'hidden', boolean] }
  | { prop: [ObjectId | NpcId, string, FlagValue] }
  | { visited: RoomId }
  | { memory: MemoryId }
  | { clue: ClueId }
  | { question: [QuestionId, 'unopened' | 'open' | 'answered'] }
  | { npcAt: [NpcId, RoomId] }
  | { met: NpcId }
  | { clock: { day?: number; after?: number; before?: number } } // raw minutes — rare, precise cases only
  | { clockPhase: DayPhase } // the normal way to write schedules; via clock.ts's phase()
  | { weekday: number } // 0-based; via clock.ts's weekday()
  | { profileLeader: ActionClass }
  | { chance?: never } // deliberately absent: no RNG
  | { all: Cond[] }
  | { any: Cond[] }
  | { not: Cond };

export type QuestionStatus = 'unopened' | 'open' | 'answered';

/** The declared content default when `id` is absent from `state.flags`. */
export function flag(world: WorldDef, state: GameState, id: FlagId): FlagValue {
  const overlay = state.flags[id];
  if (overlay !== undefined) return overlay;
  const declared = world.flags[id];
  if (declared === undefined) throw new Error(`flag: "${id}" is not declared in world.flags`);
  return declared.default;
}

/** `'unopened'` when `id` is absent from `state.questions`. */
export function questionStatus(_world: WorldDef, state: GameState, id: QuestionId): QuestionStatus {
  return state.questions[id] ?? 'unopened';
}

/** Resolved NPC room: following > pin (schedule fallback is task 6/13's). */
function npcRoom(state: GameState, id: NpcId): RoomId | 'offstage' | undefined {
  const overlay = state.npcs[id];
  if (overlay?.following) return state.location;
  return overlay?.room;
}

export function evaluate(world: WorldDef, state: GameState, cond: Cond): boolean {
  if ('all' in cond) return cond.all.every((c) => evaluate(world, state, c));
  if ('any' in cond) return cond.any.some((c) => evaluate(world, state, c));
  if ('not' in cond) return !evaluate(world, state, cond.not);

  if ('flag' in cond) {
    const value = flag(world, state, cond.flag);
    if (cond.atLeast !== undefined) return typeof value === 'number' && value >= cond.atLeast;
    return value === (cond.is ?? true);
  }

  if ('has' in cond) {
    const location = state.objects[cond.has]?.location;
    return location === 'inventory' || location === 'worn';
  }

  if ('at' in cond) return state.location === cond.at;

  if ('objectAt' in cond) {
    const [id, place] = cond.objectAt;
    const location = state.objects[id]?.location;
    return location !== undefined && samePlace(location, place);
  }

  if ('objectState' in cond) {
    const [id, key, expected] = cond.objectState;
    const overlay = state.objects[id];
    const value = overlay?.[key] ?? false;
    return value === expected;
  }

  if ('prop' in cond) {
    const [id, key, expected] = cond.prop;
    const value = state.objects[id as ObjectId]?.props?.[key] ?? state.npcs[id as NpcId]?.props?.[key];
    return value === expected;
  }

  if ('visited' in cond) return cond.visited in state.visited;

  if ('memory' in cond) return state.memories.includes(cond.memory);
  if ('clue' in cond) return state.clues.includes(cond.clue);

  if ('question' in cond) {
    const [id, status] = cond.question;
    return questionStatus(world, state, id) === status;
  }

  if ('npcAt' in cond) {
    const [id, room] = cond.npcAt;
    return npcRoom(state, id) === room;
  }

  if ('met' in cond) return state.npcs[cond.met]?.met === true;

  if ('clock' in cond) {
    // Half-open window: `after` inclusive, `before` exclusive. Windows
    // compose without gaps or overlaps this way — confirmed with the
    // architect for task 3, and the same convention `clockPhase` uses.
    const { day, after, before } = cond.clock;
    if (day !== undefined && state.clock.day !== day) return false;
    if (after !== undefined && state.clock.minute < after) return false;
    if (before !== undefined && state.clock.minute >= before) return false;
    return true;
  }

  if ('clockPhase' in cond) return phase(world.meta, state.clock) === cond.clockPhase;
  if ('weekday' in cond) return weekday(world.meta, state.clock) === cond.weekday;

  if ('profileLeader' in cond) {
    // Strict max only — a tie has no leader. Picking one by declaration
    // order would silently bias the behavioral profile Act IV reveals to
    // the player, so a tie deliberately returns false rather than guessing.
    const target = state.profile[cond.profileLeader];
    return (Object.entries(state.profile) as [ActionClass, number][]).every(
      ([cls, tally]) => cls === cond.profileLeader || tally < target,
    );
  }

  throw new Error(`evaluate: unhandled Cond ${JSON.stringify(cond)}`);
}
