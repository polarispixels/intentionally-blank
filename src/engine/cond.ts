// The declarative `Cond` DSL (spec §2.3, ADR 0008) and its evaluator.
//
// `flag()` and `questionStatus()` are the only sanctioned way to read
// `state.flags` / `state.questions` (spec §1.2.1): both are sparse
// overlays where an absent entry means "use the content default"
// (`world.flags[id].default`) or `'unopened'`, and every other engine read
// — `evaluate` included — must go through them rather than indexing
// `state.flags[id]` / `state.questions[id]` directly.
//
// `has`/`objectAt`/`objectState`/`prop` read through `resolve.ts`'s
// overlay-with-authored-default resolvers rather than indexing
// `state.objects`/`state.npcs` directly (§8 task 6 follow-up, found in
// review): before this, an object with no overlay entry yet — i.e. exactly
// where content placed it — failed every `objectAt`/`objectState`/`has`
// check against its own authored default, because there was no fallback.
// Since conditions are how nearly all game logic is expressed, that was a
// silent, everywhere bug. `resolve.ts` is a leaf (types only) specifically
// so this module can import real functions from it without risking a cycle
// back through `world.ts` (which needs `evaluate`, from here, for `isDark`).
//
// `npcRoom` (full: following > pin > schedule, §2.6) lives here rather than
// in `resolve.ts` or `world.ts` because schedule resolution needs `Cond`
// evaluation and the two are genuinely mutually recursive: a
// `ScheduleRule.when` can itself be an `npcAt` cond, which calls back into
// `npcRoom`. **Validation note for task 7**: a schedule rule's `when` must
// never (transitively) depend on `npcAt` for the *same* npc it belongs to,
// or `scheduledRoom` recurses forever — `evaluate` has no cycle guard here
// (unlike `prose.ts`'s `ProseRef` chains), so this is a content-authoring
// rule `validate.ts` should enforce, not a runtime protection this module
// provides. `world.ts` re-exports `npcRoom` so callers that only know it as
// a `world.ts` export (this task's own `isDark`/`scope` callers included)
// keep working unchanged.

import type { ActionClass, ClueId, DayPhase, FlagId, FlagValue, MemoryId, NpcId, ObjectId, PlaceId, QuestionId, RoomId } from './ids';
import { samePlace } from './ids';
import { phase, weekday } from './clock';
import { npcOverlayPosition, objectLocation, objectState, prop as readProp } from './resolve';
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

/**
 * Resolved NPC room (§2.6): **following > pin > schedule**. The first two
 * are `resolve.ts`'s `npcOverlayPosition` (no `Cond` evaluation needed);
 * the schedule fallback evaluates `NpcDefSlice.schedule` rules in order,
 * first match wins (or the first rule with no `when` at all) — the same
 * "first match, unconditional last rule" convention `prose.ts`'s
 * `ProseRule` selection uses. Deliberately the simple half of §4.2/§4.3's
 * scheduling: no `activity` text, no per-turn `tick` recompute hook, no
 * `onlyIfWitnessed` interaction, no interruption of a `following` npc
 * across multi-room `GO TO` travel — task 13 owns wiring this into the tick
 * loop and the richer scheduling rules; this is what it calls once per npc
 * per turn.
 */
export function npcRoom(world: WorldDef, state: GameState, id: NpcId): RoomId | 'offstage' {
  const pinned = npcOverlayPosition(state, id);
  if (pinned !== undefined) return pinned;
  return scheduledRoom(world, state, id);
}

function scheduledRoom(world: WorldDef, state: GameState, id: NpcId): RoomId | 'offstage' {
  const rules = world.npcs?.[id]?.schedule;
  if (rules === undefined || rules.length === 0) return 'offstage';
  for (const rule of rules) {
    if (rule.when === undefined || evaluate(world, state, rule.when)) return rule.room;
  }
  throw new Error(`npcRoom: no schedule rule for "${id}" matched, and none is unconditional`);
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
    const location = objectLocation(world, state, cond.has);
    return location === 'inventory' || location === 'worn' || location === 'self';
  }

  if ('at' in cond) return state.location === cond.at;

  if ('objectAt' in cond) {
    const [id, place] = cond.objectAt;
    return samePlace(objectLocation(world, state, id), place);
  }

  if ('objectState' in cond) {
    const [id, key, expected] = cond.objectState;
    return objectState(world, state, id, key) === expected;
  }

  if ('prop' in cond) {
    const [id, key, expected] = cond.prop;
    return readProp(world, state, id, key) === expected;
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
    return npcRoom(world, state, id) === room;
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
