// Puzzles + the behavioral profile tally (spec §2.7, §4.2 steps 6-7, §8
// task 16). This module owns the last two steps of `tick.ts`'s pipeline —
// the two the file header there has left as documented stubs since task
// 13 — and supplies the functions `tick()` calls in their place.
//
// SOLVEDWHEN IS DERIVED, NEVER A STORED BOOLEAN (§1.1). A `PuzzleDef` has
// no "solved" field to write; `checkSolvedPuzzles` below re-evaluates
// `solvedWhen` every tick and only *reacts* (fires `onSolved`) the first
// time it observes the condition newly true — an edge-trigger, not a level
// check. That once-ness has to survive save/load, so it is recorded the
// same way `tick.ts`'s own `fireEvents` records a `once: true` EventDef:
// appended to `state.firedEvents`, the same plain string array every save
// already serializes, under a derived id (`puzzle.<id>.solved`) namespaced
// so it can never collide with an author's own `EventDef.id` by accident.
// No parallel "solved" flag exists anywhere — reloading a save re-derives
// `solvedWhen` from the state that came back, sees its id already in
// `firedEvents`, and never re-fires `onSolved`, exactly the guarantee
// task 15's `evaluateMemoryTriggers` already established for memories
// (see that module's own header) and the reasoning this task reuses
// verbatim rather than inventing a second mechanism for the same problem.
//
// MULTI-ROUTE CONVERGENCE NEEDS NO SPECIAL MACHINERY (§2.7). Three
// different solution routes are just three different handlers/effects that
// each end up making `solvedWhen` true (typically via an `any: [...]`
// disjunction, one arm per route, or by each route setting the same flag).
// This module doesn't know or care how many routes exist or which one the
// player took — it only ever asks "does `solvedWhen` hold now, and did it
// not hold as of the last tick." Whichever route got there first is the
// one that fires `onSolved`; the other routes, if attempted afterward,
// find the puzzle already recorded solved and are no-ops here (their own
// handler effects still run — this module doesn't gate them — they simply
// no longer trigger a *second* `onSolved`).
//
// PROFILE TALLY (§4.2 step 7, spec 04 §3, the owed action-class-plumbing
// item). `tallyProfile` is deliberately tiny: `actions.ts`/`npc.ts`/
// `respond.ts` (this task's other half) already resolved *what* class an
// action was — a verb's own default, an authored handler's override, or
// `'social'` for a topic — by the time `tick.ts` calls this. All that's
// left here is "add one to the right bucket, or do nothing." `null`/
// `undefined` (a neutral verb like LOOK/WAIT, or any meta verb — §2.9:
// "null = neutral") tallies nothing, which is also enforced one layer up:
// `tick()` never reaches step 7 at all for a meta action, since meta verbs
// don't consume a turn and `tick()` no-ops entirely in that case (see that
// file's header). A non-meta but neutral verb (LOOK, WAIT, AGAIN) *does*
// still consume a turn and reach this step — it just tallies nothing,
// because "checking the map is not a play style" applies just as much to
// looking around as it does to a genuinely meta command.

import type { ActionClass, PuzzleId } from './ids';
import { evaluate } from './cond';
import { apply } from './effects';
import type { GameEvent, GameState, WorldDef } from './world';

export interface PuzzleResult {
  state: GameState;
  events: GameEvent[];
}

/** Namespaced `firedEvents` id for a puzzle's solved edge-trigger — see file header. */
function solvedEventId(id: PuzzleId): string {
  return `puzzle.${id}.solved`;
}

/**
 * §4.2 step 6. For every declared puzzle whose `solvedWhen` now holds and
 * hasn't already fired: runs `onSolved` (if any) and records the edge in
 * `firedEvents`, in `world.puzzles`' declaration-order iteration —
 * threading state the same way `tick.ts`'s own `fireEvents` does, so a
 * later puzzle's `solvedWhen` in the same call can see an earlier one's
 * `onSolved` effects.
 */
export function checkSolvedPuzzles(world: WorldDef, state: GameState): PuzzleResult {
  let current = state;
  const events: GameEvent[] = [];

  const ids = Object.keys(world.puzzles ?? {}) as PuzzleId[];
  for (const id of ids) {
    const def = world.puzzles![id]!;
    const eventId = solvedEventId(id);
    if (current.firedEvents.includes(eventId)) continue; // already solved — the edge already fired
    if (!evaluate(world, current, def.solvedWhen)) continue;

    if (def.onSolved !== undefined) {
      const result = apply(world, current, def.onSolved, { path: `puzzle.${id}.onSolved` });
      current = result.state;
      events.push(...result.events);
    }
    current = { ...current, firedEvents: [...current.firedEvents, eventId] };
  }

  return { state: current, events };
}

/** §4.2 step 7 — see file header. Pure; no-ops for a neutral/meta action (`class` null or absent). */
export function tallyProfile(state: GameState, actionClass: ActionClass | null | undefined): GameState {
  if (actionClass == null) return state;
  return { ...state, profile: { ...state.profile, [actionClass]: state.profile[actionClass] + 1 } };
}
