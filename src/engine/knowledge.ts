// Knowledge: memories, clues, questions (spec §2.7, §4.2 steps 4-5, §8 task
// 15). This module owns the *ambient* half of acquisition — the explicit
// `{ grantMemory }`/`{ grantClue }`/`{ openQuestion }`/`{ answerQuestion }`
// effects already live in `effects.ts` (task 5) and stay there; this file
// supplies the two functions `tick.ts` calls in place of its task-15 stubs.
//
// ONCE-ONLY, DERIVED FROM STATE (constitution's memory-assistance framing,
// spec 04 §2). A memory's ambient `trigger.when` is checked every tick, but
// it must never re-grant a memory the player already has, and that must
// hold across save/load. The guarantee comes for free from `effects.ts`'s
// own `grantMemory` arm, which already no-ops (no duplicate entry, no
// re-fired event) when `state.memories.includes(id)` — the same array a
// save serializes verbatim. `evaluateMemoryTriggers` below adds its own
// cheap pre-check only to skip evaluating `trigger.when` at all once a
// memory is held (no functional difference, since `apply()` would no-op
// anyway); there is no separate "already fired" flag anywhere, so there is
// nothing that could desync from `state.memories` across a reload.
//
// QUESTION RECOMPUTE — two passes, not one, per §4.2's own ordering note:
// "a question opened this turn must be answerable by a later step of the
// same turn if its condition holds." A single pass over `world.questions`
// in declaration order would only catch that case when the answering
// question happens to be declared after the opening one; two full passes
// (open every question whose `openWhen` now holds, THEN answer every
// question whose `answerWhen` now holds) make the ordering hold regardless
// of declaration order, and let a question's own `openWhen`/`answerWhen`
// both fire in one call — exactly the "opens and answers in the same turn"
// case `tests/knowledge.test.ts` exercises. `answerWhen` is only ever
// consulted for a question already `'open'` (by an earlier turn or by this
// same call's open pass) — a question cannot skip straight from `'unopened'`
// to `'answered'` via the ambient path; content that wants that uses the
// explicit `{ answerQuestion }` effect directly, same as any other
// deliberate skip of ordinary flow elsewhere in this engine.
//
// Both functions return the same `{ state, events }` shape `tick.ts`'s
// other pipeline steps use, and both are pure — `apply()` (task 5) is the
// only thing that ever writes state here.

import type { MemoryId, QuestionId } from './ids';
import { evaluate, questionStatus } from './cond';
import { apply } from './effects';
import type { GameEvent, GameState, WorldDef } from './world';

export interface KnowledgeResult {
  state: GameState;
  events: GameEvent[];
}

/**
 * §4.2 step 4. Grants every declared memory whose `trigger.when` newly holds
 * — in `world.memories`' declaration-order iteration, threading state so a
 * later memory's trigger can see an earlier one's grant within the same
 * call (the same "later effect sees an earlier one's state" convention
 * `apply()` itself uses). A memory with no `trigger` is untouched here; it
 * only ever moves via an explicit `{ grantMemory }` effect.
 */
export function evaluateMemoryTriggers(world: WorldDef, state: GameState): KnowledgeResult {
  let current = state;
  const events: GameEvent[] = [];

  const ids = Object.keys(world.memories ?? {}) as MemoryId[];
  for (const id of ids) {
    const def = world.memories![id]!;
    if (def.trigger === undefined) continue;
    if (current.memories.includes(id)) continue; // already held — never re-fires (state-derived, see file header)
    if (!evaluate(world, current, def.trigger.when)) continue;

    const result = apply(world, current, [{ grantMemory: id }]);
    current = result.state;
    events.push(...result.events);
  }

  return { state: current, events };
}

/**
 * §4.2 step 5. Two passes over `world.questions` — see file header for why
 * two, not one. Pass 1 opens every `'unopened'` question whose `openWhen`
 * now holds; pass 2 answers every `'open'` question (including one this
 * same call just opened) whose `answerWhen` now holds. A question with
 * neither field declared is untouched — it only ever moves via the explicit
 * `{ openQuestion }`/`{ answerQuestion }` effects.
 */
export function recomputeQuestions(world: WorldDef, state: GameState): KnowledgeResult {
  let current = state;
  const events: GameEvent[] = [];

  const ids = Object.keys(world.questions ?? {}) as QuestionId[];

  for (const id of ids) {
    const def = world.questions![id]!;
    if (def.openWhen === undefined) continue;
    if (questionStatus(world, current, id) !== 'unopened') continue;
    if (!evaluate(world, current, def.openWhen)) continue;

    const result = apply(world, current, [{ openQuestion: id }]);
    current = result.state;
    events.push(...result.events);
  }

  for (const id of ids) {
    const def = world.questions![id]!;
    if (def.answerWhen === undefined) continue;
    if (questionStatus(world, current, id) !== 'open') continue;
    if (!evaluate(world, current, def.answerWhen)) continue;

    const result = apply(world, current, [{ answerQuestion: id }]);
    current = result.state;
    events.push(...result.events);
  }

  return { state: current, events };
}
