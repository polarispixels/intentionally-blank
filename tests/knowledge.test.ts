// tests/knowledge.test.ts — spec §2.7 (MemoryDef/ClueDef/QuestionDef),
// §4.2 (tick steps 4-5), §8 task 15.
//
// `evaluateMemoryTriggers`/`recomputeQuestions` are exercised directly
// (unit-level) AND through `tick()` (pipeline-level, once wired into its
// stubs) — the pipeline-level tests are what prove §4.2's ordering: a
// memory an action's own effects already granted (state going into `tick`)
// or one an ambient trigger grants mid-tick must be able to satisfy a
// question's `answerWhen` in that same `tick()` call, and a question opened
// by this tick's own recompute must be answerable later in that same call.

import { describe, expect, it } from 'vitest';
import { evaluateMemoryTriggers, recomputeQuestions } from '../src/engine/knowledge';
import { tick } from '../src/engine/tick';
import type { GameState } from '../src/engine/world';
import {
  FIXTURE_WORLD,
  FLAG_EVENT_FIRED,
  FLAG_EVENT_TRIGGER,
  FLAG_QUESTION_ANSWER,
  FLAG_QUESTION_OPEN,
  MEMORY_1,
  MEMORY_2,
  QUESTION_1,
  QUESTION_2,
  QUESTION_3,
  ROOM_A,
} from './fixtures/world';

function baseState(overrides: Partial<GameState> = {}): GameState {
  return {
    phase: 'playing',
    turn: 0,
    clock: { day: 1, minute: 600 },
    location: ROOM_A,
    objects: {},
    npcs: {},
    flags: {},
    counters: {},
    visited: {},
    memories: [],
    clues: [],
    questions: {},
    hintsUsed: {},
    profile: { analytical: 0, social: 0, direct: 0 },
    firedEvents: [],
    parser: {},
    ...overrides,
  };
}

describe('evaluateMemoryTriggers()', () => {
  it('grants a memory whose trigger.when newly holds, emitting a distinct memory event', () => {
    const state = baseState({ flags: { [FLAG_EVENT_FIRED]: true } });
    const result = evaluateMemoryTriggers(FIXTURE_WORLD, state);
    expect(result.state.memories).toContain(MEMORY_2);
    expect(result.events).toContainEqual({
      type: 'memory',
      id: MEMORY_2,
      lines: ['You remember a second fixture, ambiently.'],
    });
  });

  it('does not fire while trigger.when does not hold', () => {
    const state = baseState();
    const result = evaluateMemoryTriggers(FIXTURE_WORLD, state);
    expect(result.state.memories).not.toContain(MEMORY_2);
    expect(result.events).toEqual([]);
  });

  it('never re-fires a memory already held, even though trigger.when still holds — derived from state.memories, not a parallel flag', () => {
    const state = baseState({ flags: { [FLAG_EVENT_FIRED]: true }, memories: [MEMORY_2] });
    const result = evaluateMemoryTriggers(FIXTURE_WORLD, state);
    expect(result.state.memories).toEqual([MEMORY_2]); // no duplicate entry
    expect(result.events).toEqual([]); // no re-fired event
  });

  it('the once-only guarantee survives a save/load round-trip: a plain JSON-cloned state with no bespoke "fired" flag still refuses to re-grant', () => {
    const granted = baseState({ flags: { [FLAG_EVENT_FIRED]: true }, memories: [MEMORY_2] });
    const reloaded: GameState = JSON.parse(JSON.stringify(granted));
    const result = evaluateMemoryTriggers(FIXTURE_WORLD, reloaded);
    expect(result.state.memories).toEqual([MEMORY_2]);
    expect(result.events).toEqual([]);
  });

  it('does not double-grant when an explicit grantMemory effect already added the memory before this ran', () => {
    // Simulates an action's own handler effects (grantMemory) having
    // already run earlier in the same turn, before tick()/this function.
    const state = baseState({ flags: { [FLAG_EVENT_FIRED]: true }, memories: [MEMORY_2] });
    const result = evaluateMemoryTriggers(FIXTURE_WORLD, state);
    expect(result.events).toEqual([]);
  });
});

describe('recomputeQuestions()', () => {
  it('opens a question whose openWhen newly holds, emitting a question event with status "open"', () => {
    const state = baseState({ flags: { [FLAG_QUESTION_OPEN]: true } });
    const result = recomputeQuestions(FIXTURE_WORLD, state);
    expect(result.state.questions[QUESTION_2]).toBe('open');
    expect(result.events).toContainEqual({
      type: 'question',
      id: QUESTION_2,
      status: 'open',
      text: 'Does this fixture open and answer ambiently?',
    });
  });

  it('does not open while openWhen does not hold', () => {
    const state = baseState();
    const result = recomputeQuestions(FIXTURE_WORLD, state);
    expect(result.state.questions[QUESTION_2]).toBeUndefined();
  });

  it('does not re-open an already-open question (no duplicate event)', () => {
    const state = baseState({ flags: { [FLAG_QUESTION_OPEN]: true }, questions: { [QUESTION_2]: 'open' } });
    const result = recomputeQuestions(FIXTURE_WORLD, state);
    expect(result.events.filter((e) => e.type === 'question' && e.id === QUESTION_2)).toEqual([]);
  });

  it('answers an open question whose answerWhen holds', () => {
    const state = baseState({ questions: { [QUESTION_2]: 'open' }, flags: { [FLAG_QUESTION_ANSWER]: true } });
    const result = recomputeQuestions(FIXTURE_WORLD, state);
    expect(result.state.questions[QUESTION_2]).toBe('answered');
    expect(result.events).toContainEqual({
      type: 'question',
      id: QUESTION_2,
      status: 'answered',
      text: 'Does this fixture open and answer ambiently?',
    });
  });

  it('never answers a question that was never opened, even if answerWhen holds', () => {
    const state = baseState({ flags: { [FLAG_QUESTION_ANSWER]: true } }); // QUESTION_2 still 'unopened'
    const result = recomputeQuestions(FIXTURE_WORLD, state);
    expect(result.state.questions[QUESTION_2]).toBeUndefined();
  });

  it('does not re-answer an already-answered question (no duplicate event)', () => {
    const state = baseState({ questions: { [QUESTION_2]: 'answered' }, flags: { [FLAG_QUESTION_ANSWER]: true } });
    const result = recomputeQuestions(FIXTURE_WORLD, state);
    expect(result.events).toEqual([]);
  });

  it('a question opened this same call is answerable by the later answer pass of that same call', () => {
    const state = baseState({ flags: { [FLAG_QUESTION_OPEN]: true, [FLAG_QUESTION_ANSWER]: true } });
    const result = recomputeQuestions(FIXTURE_WORLD, state);
    expect(result.state.questions[QUESTION_2]).toBe('answered');
    // Both transitions actually happened, in order: open, then answered.
    const questionEvents = result.events.filter((e) => e.type === 'question' && e.id === QUESTION_2);
    expect(questionEvents).toEqual([
      { type: 'question', id: QUESTION_2, status: 'open', text: 'Does this fixture open and answer ambiently?' },
      { type: 'question', id: QUESTION_2, status: 'answered', text: 'Does this fixture open and answer ambiently?' },
    ]);
  });

  it('a memory already in state.memories can satisfy answerWhen', () => {
    const state = baseState({ questions: { [QUESTION_3]: 'open' }, memories: [MEMORY_2] });
    const result = recomputeQuestions(FIXTURE_WORLD, state);
    expect(result.state.questions[QUESTION_3]).toBe('answered');
  });

  it('leaves QUESTION_1 alone — it has no openWhen/answerWhen, only the explicit effect path', () => {
    const state = baseState({ flags: { [FLAG_QUESTION_OPEN]: true, [FLAG_QUESTION_ANSWER]: true } });
    const result = recomputeQuestions(FIXTURE_WORLD, state);
    expect(result.state.questions[QUESTION_1]).toBeUndefined();
  });
});

describe('tick(): knowledge ordering within one turn (§4.2)', () => {
  it('a memory already granted before tick() runs (an action\'s own effects) satisfies a question\'s answerWhen in the same turn', () => {
    const state = baseState({ questions: { [QUESTION_3]: 'open' }, memories: [MEMORY_2] });
    const result = tick(FIXTURE_WORLD, state, { consumesTurn: true });
    expect(result.state.questions[QUESTION_3]).toBe('answered');
  });

  it('chains across every §4.2 stage in one tick(): an EventDef sets the flag an ambient memory trigger reads, and the granted memory answers a question already open — event → memory trigger → question recompute, all in one turn', () => {
    const state = baseState({
      flags: { [FLAG_EVENT_TRIGGER]: true, [FLAG_QUESTION_OPEN]: true },
    });
    const result = tick(FIXTURE_WORLD, state, { consumesTurn: true });

    // Step 2: fixture_event_once fired (sets FLAG_EVENT_FIRED).
    expect(result.state.firedEvents).toContain('fixture_event_once');
    // Step 4: MEMORY_2's trigger ({ flag: FLAG_EVENT_FIRED }) fired off that same-turn flag.
    expect(result.state.memories).toContain(MEMORY_2);
    // Step 5 pass 1: QUESTION_3 opened (openWhen: FLAG_QUESTION_OPEN, already true).
    // Step 5 pass 2: QUESTION_3 answered (answerWhen: { memory: MEMORY_2 }, granted this same turn).
    expect(result.state.questions[QUESTION_3]).toBe('answered');
  });

  it('a question opened this turn by tick() is answerable within that same tick() call', () => {
    const state = baseState({ flags: { [FLAG_QUESTION_OPEN]: true, [FLAG_QUESTION_ANSWER]: true } });
    const result = tick(FIXTURE_WORLD, state, { consumesTurn: true });
    expect(result.state.questions[QUESTION_2]).toBe('answered');
  });

  it('a meta verb (consumesTurn: false) never evaluates knowledge triggers at all', () => {
    const state = baseState({ flags: { [FLAG_EVENT_FIRED]: true, [FLAG_QUESTION_OPEN]: true } });
    const result = tick(FIXTURE_WORLD, state, { consumesTurn: false });
    expect(result.state).toBe(state); // full no-op
    expect(result.state.memories).not.toContain(MEMORY_2);
    expect(result.state.questions[QUESTION_2]).toBeUndefined();
  });
});
