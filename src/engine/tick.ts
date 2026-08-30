// The tick loop (spec §4, §8 task 13): what happens to the world after a
// turn-consuming action, in the exact order §4.2 specifies:
//
//   advance clock → evaluate EventDefs (fire matching, record once in
//   firedEvents) → derive NPC positions (following > pin > schedule) →
//   evaluate memory triggers → recompute question open/answer conds →
//   check PuzzleDef.solvedWhen for first-time onSolved → tally the
//   action's class into the profile.
//
// This module owns and fully implements the first three steps (the clock,
// `EventDef`s, and NPC position derivation) and, as of task 15, the memory-
// trigger and question-recompute steps too, by calling straight through to
// `knowledge.ts`'s `evaluateMemoryTriggers`/`recomputeQuestions` — this file
// owns *when* they run in the pipeline, `knowledge.ts` owns *what* they do.
// The last two steps still belong to task 16 (`puzzles.ts` — `solvedWhen`
// and profile tallying); `tick()` below still calls a documented no-op stub
// for each so the ordering is real and load-bearing today, not a comment
// promising it later. Task 16 replaces exactly those two stubs, never
// touching the pipeline's shape.
//
// Meta verbs (SAVE, MAP, HINT, VERSION, …) "cost nothing" (§4.1): they
// don't advance the clock, and — just as important, per §4.3.4's no-silent-
// doom rule — they must not cause a player to *miss* a due event by
// happening to check the map at the wrong moment. The cleanest way to
// guarantee both at once is for `tick()` itself to no-op entirely when the
// action didn't consume a turn, rather than trusting every future caller to
// remember to skip calling it: nothing here runs, nothing here is skipped
// *partially*, and a due event that a meta verb "walked past" is still due
// (unconsumed, unfired) the moment a real turn happens next.

import type { ActionClass, NpcId, RoomId } from './ids';
import { evaluate, npcRoom } from './cond';
import { addMinutes, apply } from './effects';
import { evaluateMemoryTriggers, recomputeQuestions } from './knowledge';
import type { GameEvent, GameState, WorldDef } from './world';

const DEFAULT_MINUTES_PER_TURN = 1;

export interface TickInput {
  /**
   * Whether the action that just ran consumed a world turn. Mirrors
   * `actions.ts`'s `ActionResult.consumesTurn` (`false` for meta verbs and
   * any handler that opts out via `consumesTurn: false`) — `step()` (a
   * later task) passes this straight through from the action it just
   * applied. `tick()` no-ops entirely when this is `false`.
   */
  consumesTurn: boolean;
  /**
   * The action's class, for the profile tally (§4.2's last step, stubbed
   * here — task 16 owns the real tally). `null`/omitted for neutral or meta
   * actions, matching `ActionResult.class`.
   */
  class?: ActionClass | null;
}

export interface TickResult {
  state: GameState;
  events: GameEvent[];
}

/** Runs one turn's worth of world-clock advancement per §4.2's ordered pipeline. */
export function tick(world: WorldDef, state: GameState, input: TickInput): TickResult {
  if (!input.consumesTurn) return { state, events: [] };

  let current = state;
  const events: GameEvent[] = [];

  // 1. Advance the clock (§4.1). `advanceClock` effects and travel time
  //    already added their extra minutes before `tick` ever runs (they're
  //    ordinary `Effect`s, applied as part of the handler's own effect
  //    list) — this is only the flat per-turn base.
  current = { ...current, clock: addMinutes(current.clock, world.meta.minutesPerTurn ?? DEFAULT_MINUTES_PER_TURN) };

  // 2. Evaluate EventDefs: fire every matching one, in `world.events`'
  //    declaration order, threading state so a later event in the same
  //    tick sees an earlier one's effects.
  const fired = fireEvents(world, current);
  current = fired.state;
  events.push(...fired.events);

  // 3. Derive NPC positions (following > pin > schedule, §2.6/§4.3 rule 2).
  //    Nothing to *write*: positions are never stored, so there is no state
  //    change here by design — `deriveNpcPositions` below is exposed as a
  //    read-only snapshot for callers (a future `onlyIfWitnessed`/ambient-
  //    trigger check that wants "where is everyone right now") rather than
  //    a pipeline step that mutates anything.

  // 4. Evaluate ambient memory triggers (`MemoryDef.trigger`) and grant any
  //    that newly hold (`knowledge.ts`, task 15).
  const memoryTriggers = evaluateMemoryTriggers(world, current);
  current = memoryTriggers.state;
  events.push(...memoryTriggers.events);

  // 5. Recompute `QuestionDef.openWhen`/`answerWhen` conds that aren't only
  //    driven by explicit effects (`knowledge.ts`, task 15). Runs after step
  //    4 so a memory granted this same tick can already satisfy a
  //    question's `answerWhen` (§4.2's own ordering note).
  const questions = recomputeQuestions(world, current);
  current = questions.state;
  events.push(...questions.events);

  // 6. STUB (task 16, puzzles.ts): check every `PuzzleDef.solvedWhen` for a
  //    first-time (edge) transition to true and run its `onSolved` once.
  // 7. STUB (task 16, puzzles.ts): tally `input.class` into `state.profile`.

  return { state: current, events };
}

/**
 * §2.6/§4.3's soft-schedule resolver, snapshotted for every declared NPC.
 * A thin, read-only wrapper over `cond.ts`'s `npcRoom` (following > pin >
 * schedule) — positions derive fresh from the current `state` every call,
 * never drift, and are never themselves written back into state (§4.3 rule
 * 2: "an NPC is never lost by a missed update, and a loaded save is always
 * consistent"). Exposed for later tasks (an `onlyIfWitnessed` check that
 * cares where a specific NPC is, an ambient trigger keyed on `npcAt`) that
 * want every NPC's current room without repeating this loop themselves.
 */
export function deriveNpcPositions(world: WorldDef, state: GameState): Partial<Record<NpcId, RoomId | 'offstage'>> {
  const ids = Object.keys(world.npcs ?? {}) as NpcId[];
  const positions: Partial<Record<NpcId, RoomId | 'offstage'>> = {};
  for (const id of ids) positions[id] = npcRoom(world, state, id);
  return positions;
}

/**
 * §4.2 step 2 / §2.8. Iterates `world.events` in declaration order; a
 * `once` event (default true) is skipped once its id is in
 * `state.firedEvents` and, on firing, is appended there so it never fires
 * again. `onlyIfWitnessed` events additionally require `witnessedWhen` to
 * hold this tick — when it doesn't, the event is simply left alone (still
 * due, not recorded, not consumed): the very next tick re-checks both
 * conds, so the beat fires the instant the player can perceive it rather
 * than being lost the moment `when` first became true (§4.3.3/§4.3.4).
 */
function fireEvents(world: WorldDef, state: GameState): TickResult {
  let current = state;
  const events: GameEvent[] = [];

  for (const def of Object.values(world.events ?? {})) {
    const once = def.once ?? true;
    if (once && current.firedEvents.includes(def.id)) continue;
    if (!evaluate(world, current, def.when)) continue;

    if (def.onlyIfWitnessed) {
      if (def.witnessedWhen === undefined) {
        throw new Error(`tick: event "${def.id}" has onlyIfWitnessed but no witnessedWhen cond declared`);
      }
      if (!evaluate(world, current, def.witnessedWhen)) continue; // due, but not yet perceivable — deferred, not lost
    }

    const result = apply(world, current, def.effects, { path: `event.${def.id}` });
    current = result.state;
    events.push(...result.events);
    if (once) current = { ...current, firedEvents: [...current.firedEvents, def.id] };
  }

  return { state: current, events };
}
