// The production `ScopeView` builder (spec §0, §8 task 20 — "task 19 noted
// that production `ScopeView` construction is this task's job," `turn.ts`'s
// own SCOPE header, `migrate.ts`'s `replay` doc comment). Every session
// test and parser test up to this point hand-built `ScopeView.portable`/
// `.location`/`.travel` from a `WorldDef`/`GameState` pair — see
// `tests/parser-multi.test.ts`'s `buildScopeHelpers`, which this function
// is the production twin of, plus NPC visibility (no test double needed
// one, since those tests were all object-centric).
//
// Pure and DOM/timer-free like every other shell helper in `src/cli/` —
// composed entirely from already-exported engine reads (`scope`, `isDark`,
// `npcRoom`, `objectLocation`, `objectState`, `evaluate`), never new engine
// internals.

import { evaluate } from '../engine/cond';
import type { NpcId, ObjectId, PlaceId, RoomId } from '../engine/ids';
import type { ScopeView } from '../engine/interpreter';
import type { CompiledVocabulary } from '../engine/parser';
import { isDark, npcRoom, objectLocation, objectState, scope as objectsInScope } from '../engine/world';
import type { GameState, WorldDef } from '../engine/world';

/**
 * Every NPC currently in the player's room — visible per the same "dark
 * means only what you're carrying" rule `world.ts`'s `scope()` applies to
 * objects (§2.4 governs "what the player can currently see" generally;
 * nothing carries an NPC, so in the dark none are visible — a direct
 * extension of `scope()`'s own object rule, not a new one, and the closest
 * reading of §2.4 absent a separate NPC-specific darkness clause).
 */
function visibleNpcs(world: WorldDef, state: GameState): NpcId[] {
  if (isDark(world, state, state.location)) return [];
  const ids = Object.keys(world.npcs ?? {}) as NpcId[];
  return ids.filter((id) => npcRoom(world, state, id) === state.location);
}

/** `GO TO`'s BFS graph (§3.5): every visited room, mapped to the other visited rooms one currently-passable exit away. */
function travelGraph(world: WorldDef, state: GameState): Map<RoomId, RoomId[]> {
  const passable = new Map<RoomId, RoomId[]>();
  for (const roomId of Object.keys(state.visited) as RoomId[]) {
    const exits = world.rooms?.[roomId]?.exits ?? [];
    const dests: RoomId[] = [];
    for (const exit of exits) {
      if (state.visited[exit.to] === undefined) continue; // GO TO only ever routes through visited rooms
      if (exit.door !== undefined && !objectState(world, state, exit.door, 'open')) continue;
      if (exit.when !== undefined && !evaluate(world, state, exit.when)) continue;
      dests.push(exit.to);
    }
    passable.set(roomId, dests);
  }
  return passable;
}

/** Builds a fresh `ScopeView` from `(world, state)` for one call to `DeterministicParser.interpret()`. Called once per turn — nothing here is cached across turns, matching every other pure read in this engine. */
export function buildScopeView(world: WorldDef, state: GameState, vocab: CompiledVocabulary): ScopeView {
  const visible: (ObjectId | NpcId)[] = [...objectsInScope(world, state), ...visibleNpcs(world, state)];

  const portable = new Set<ObjectId>();
  const location = new Map<ObjectId, PlaceId>();
  for (const id of Object.keys(world.objects ?? {}) as ObjectId[]) {
    if (world.objects![id]!.portable === true) portable.add(id);
    location.set(id, objectLocation(world, state, id));
  }

  return {
    vocabulary: vocab,
    visible,
    parser: state.parser,
    portable,
    location,
    travel: { current: state.location, passable: travelGraph(world, state) },
  };
}
