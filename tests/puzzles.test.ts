// tests/puzzles.test.ts — spec §2.7 (`PuzzleDef`), §4.2 steps 6-7, §4.3.4
// (clock-free-solution validate rule), §6.5/spec 04 §15 (hints), §8 task
// 16, including its two owed items: the action-class plumbing
// (`respond.ts`/`npc.ts`/`actions.ts` → `state.profile`) and the
// clock-free-solution `validate.ts` rule.

import { describe, expect, it } from 'vitest';
import { F, P, Q, T } from '../src/engine/ids';
import type { GameState, WorldDef } from '../src/engine/world';
import { checkSolvedPuzzles, tallyProfile } from '../src/engine/puzzles';
import { tick } from '../src/engine/tick';
import { availableHints, revealHint } from '../src/engine/views';
import { validate } from '../src/engine/validate';
import { respond } from '../src/engine/respond';
import { respondToAsk } from '../src/engine/npc';
import { BUILTIN_VERB_IDS } from '../src/engine/actions';
import { compileVocabulary } from '../src/engine/parser/vocabulary';
import type { InterpretOutcome } from '../src/engine/interpreter';
import {
  FIXTURE_WORLD,
  FLAG_PUZZLE_ROUTE_A,
  FLAG_PUZZLE_ROUTE_B,
  FLAG_PUZZLE_ROUTE_C,
  FLAG_PUZZLE_SOLVED,
  GUIDE,
  KEY,
  NOTEBOOK,
  PUZZLE_1,
  QUESTION_PUZZLE,
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
    visited: { [ROOM_A]: 0 },
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

const SOLVED_EVENT_ID = `puzzle.${PUZZLE_1}.solved`;

// ---------------------------------------------------------------------------
// solvedWhen: derived, edge-triggered
// ---------------------------------------------------------------------------

describe('checkSolvedPuzzles(): solvedWhen edge-trigger', () => {
  it('does nothing while solvedWhen does not hold', () => {
    const state = baseState();
    const result = checkSolvedPuzzles(FIXTURE_WORLD, state);
    expect(result.state.flags[FLAG_PUZZLE_SOLVED]).toBeUndefined();
    expect(result.state.firedEvents).not.toContain(SOLVED_EVENT_ID);
    expect(result.events).toEqual([]);
  });

  it('fires onSolved exactly once the first tick solvedWhen becomes true', () => {
    const state = baseState({ flags: { [FLAG_PUZZLE_ROUTE_A]: true } });
    const result = checkSolvedPuzzles(FIXTURE_WORLD, state);
    expect(result.state.flags[FLAG_PUZZLE_SOLVED]).toBe(true);
    expect(result.state.firedEvents).toContain(SOLVED_EVENT_ID);
    expect(result.events).toContainEqual({ type: 'line', kind: 'prose', text: 'The fixture door gives.' });
  });

  it('never re-fires onSolved once already solved, even though solvedWhen still holds', () => {
    const solvedOnce = checkSolvedPuzzles(FIXTURE_WORLD, baseState({ flags: { [FLAG_PUZZLE_ROUTE_A]: true } }));
    const again = checkSolvedPuzzles(FIXTURE_WORLD, solvedOnce.state);
    expect(again.events).toEqual([]); // no second onSolved
    expect(again.state.firedEvents.filter((id) => id === SOLVED_EVENT_ID)).toHaveLength(1); // no duplicate entry
  });

  it('the once-only guarantee survives a save/load round-trip: a plain JSON-cloned state with no bespoke flag still refuses to re-fire', () => {
    const solved = checkSolvedPuzzles(FIXTURE_WORLD, baseState({ flags: { [FLAG_PUZZLE_ROUTE_A]: true } }));
    const reloaded: GameState = JSON.parse(JSON.stringify(solved.state));
    const result = checkSolvedPuzzles(FIXTURE_WORLD, reloaded);
    expect(result.events).toEqual([]);
    expect(result.state).toEqual(reloaded); // no state churn at all — the guard is read-only once solved
  });
});

// ---------------------------------------------------------------------------
// Multi-route convergence
// ---------------------------------------------------------------------------

describe('checkSolvedPuzzles(): multi-route convergence', () => {
  it.each([
    ['route A (direct)', FLAG_PUZZLE_ROUTE_A],
    ['route B (analytical)', FLAG_PUZZLE_ROUTE_B],
    ['route C (social)', FLAG_PUZZLE_ROUTE_C],
  ])('%s alone satisfies solvedWhen and fires onSolved once', (_label, routeFlag) => {
    const state = baseState({ flags: { [routeFlag]: true } });
    const result = checkSolvedPuzzles(FIXTURE_WORLD, state);
    expect(result.state.flags[FLAG_PUZZLE_SOLVED]).toBe(true);
    expect(result.state.firedEvents.filter((id) => id === SOLVED_EVENT_ID)).toHaveLength(1);
  });

  it('completing a second route after the puzzle is already solved via a first route does not re-fire onSolved', () => {
    const solvedViaB = checkSolvedPuzzles(FIXTURE_WORLD, baseState({ flags: { [FLAG_PUZZLE_ROUTE_B]: true } }));
    const alsoDoneA = { ...solvedViaB.state, flags: { ...solvedViaB.state.flags, [FLAG_PUZZLE_ROUTE_A]: true } };
    const result = checkSolvedPuzzles(FIXTURE_WORLD, alsoDoneA);
    expect(result.events).toEqual([]);
    expect(result.state.firedEvents.filter((id) => id === SOLVED_EVENT_ID)).toHaveLength(1);
  });

  it('all three routes true simultaneously (e.g. a save loaded mid-completion) still fires onSolved exactly once', () => {
    const state = baseState({ flags: { [FLAG_PUZZLE_ROUTE_A]: true, [FLAG_PUZZLE_ROUTE_B]: true, [FLAG_PUZZLE_ROUTE_C]: true } });
    const result = checkSolvedPuzzles(FIXTURE_WORLD, state);
    expect(result.state.firedEvents.filter((id) => id === SOLVED_EVENT_ID)).toHaveLength(1);
    expect(result.events).toHaveLength(1); // exactly one onSolved firing's worth of events
  });
});

// ---------------------------------------------------------------------------
// tick() pipeline wiring — step 6 runs after steps 4-5, in the real loop
// ---------------------------------------------------------------------------

describe('tick(): puzzle step wires into the ordered pipeline', () => {
  it('a meta action (consumesTurn: false) does not check puzzles at all — full no-op, per tick()\'s own convention', () => {
    const state = baseState({ flags: { [FLAG_PUZZLE_ROUTE_A]: true } });
    const result = tick(FIXTURE_WORLD, state, { consumesTurn: false });
    expect(result.state).toBe(state); // same reference: nothing ran
  });

  it('a turn-consuming action reaches the puzzle-solved step', () => {
    const state = baseState({ flags: { [FLAG_PUZZLE_ROUTE_A]: true } });
    const result = tick(FIXTURE_WORLD, state, { consumesTurn: true });
    expect(result.state.flags[FLAG_PUZZLE_SOLVED]).toBe(true);
    expect(result.state.firedEvents).toContain(SOLVED_EVENT_ID);
  });
});

// ---------------------------------------------------------------------------
// Behavioral profile: class tallies (tallyProfile unit + full-pipeline wiring)
// ---------------------------------------------------------------------------

describe('tallyProfile()', () => {
  it('increments the given class by one', () => {
    const state = baseState();
    const result = tallyProfile(state, 'analytical');
    expect(result.profile).toEqual({ analytical: 1, social: 0, direct: 0 });
  });

  it('tallies each class independently across calls', () => {
    let state = baseState();
    state = tallyProfile(state, 'direct');
    state = tallyProfile(state, 'direct');
    state = tallyProfile(state, 'social');
    expect(state.profile).toEqual({ analytical: 0, social: 1, direct: 2 });
  });

  it('does not tally a neutral/meta action (class null)', () => {
    const state = baseState();
    const result = tallyProfile(state, null);
    expect(result).toBe(state); // full no-op
  });

  it('does not tally when class is omitted (undefined)', () => {
    const state = baseState();
    const result = tallyProfile(state, undefined);
    expect(result).toBe(state);
  });
});

describe('tick(): step 7 tallies input.class into state.profile', () => {
  it('tallies a resolved action class', () => {
    const state = baseState();
    const result = tick(FIXTURE_WORLD, state, { consumesTurn: true, class: 'direct' });
    expect(result.state.profile.direct).toBe(1);
  });

  it('a meta verb never reaches the tally step — consumesTurn: false is a full no-op', () => {
    const state = baseState();
    const result = tick(FIXTURE_WORLD, state, { consumesTurn: false, class: 'direct' });
    expect(result.state.profile.direct).toBe(0);
  });

  it('a turn-consuming but neutral action (class omitted) tallies nothing — "checking the map is not a play style"', () => {
    const state = baseState();
    const result = tick(FIXTURE_WORLD, state, { consumesTurn: true });
    expect(result.state.profile).toEqual({ analytical: 0, social: 0, direct: 0 });
  });
});

// ---------------------------------------------------------------------------
// The owed action-class plumbing: actions.ts / npc.ts / respond.ts thread
// the class all the way to a RespondResult that tick() can consume — this
// is what `respond.ts` used to discard before this task.
// ---------------------------------------------------------------------------

describe('respond() no longer discards ActionClass', () => {
  const vocab = compileVocabulary(FIXTURE_WORLD);

  it('a resolved built-in/handler action carries its class through respond(), and tick() can tally it', () => {
    const state = baseState();
    // KEY's own handler (fixtures/world.ts) overrides TAKE's class to 'direct'.
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: BUILTIN_VERB_IDS.take, dobj: KEY, raw: 'take key' }] };
    const responded = respond(FIXTURE_WORLD, state, vocab, outcome);
    expect(responded.class).toBe('direct');

    const ticked = tick(FIXTURE_WORLD, responded.state, { consumesTurn: true, class: responded.class });
    expect(ticked.state.profile.direct).toBe(1);
  });

  it('an unresolved miss (rung 3-5) carries no class — nothing was actually performed', () => {
    const world: WorldDef = { ...FIXTURE_WORLD, responses: { ...FIXTURE_WORLD.responses, unknown: "That doesn't mean anything to me." } };
    const state = baseState();
    const outcome: InterpretOutcome = { kind: 'miss', raw: 'xyzzy', knownNouns: [] };
    const responded = respond(world, state, vocab, outcome);
    expect(responded.class).toBeNull();
  });
});

describe('npc.ts topic responses default to \'social\' (§2.6), and thread their class out', () => {
  const TOPIC_PLAIN = T('fixture_topic_class_plain');
  const TOPIC_OVERRIDE = T('fixture_topic_class_direct');

  const WORLD: WorldDef = {
    ...FIXTURE_WORLD,
    npcs: {
      ...FIXTURE_WORLD.npcs,
      [GUIDE]: {
        ...FIXTURE_WORLD.npcs![GUIDE]!,
        topics: [
          { id: TOPIC_PLAIN, words: ['fixturetopic'], response: 'The guide answers.' },
          { id: TOPIC_OVERRIDE, words: ['override'], response: 'Overridden.', class: 'direct' },
        ],
        unknownTopic: 'The guide has nothing to say.',
      },
    },
  };
  const vocab = compileVocabulary(WORLD);

  it('a matched topic with no class override tallies as social', () => {
    const result = respondToAsk(WORLD, baseState(), vocab, GUIDE, 'fixturetopic');
    expect(result.class).toBe('social');
  });

  it('a matched topic can override its class', () => {
    const result = respondToAsk(WORLD, baseState(), vocab, GUIDE, 'override');
    expect(result.class).toBe('direct');
  });

  it('an unmatched topic (falls to unknownTopic) still tallies as social — the attempt itself is the social move', () => {
    const result = respondToAsk(WORLD, baseState(), vocab, GUIDE, 'nothing recognized here');
    expect(result.class).toBe('social');
  });
});

// ---------------------------------------------------------------------------
// Hints (§6.5, spec 04 §15) — explicit-only, ladder consumption
// ---------------------------------------------------------------------------

describe('availableHints()', () => {
  it('lists a puzzle whose anchor question is open', () => {
    const state = baseState({ questions: { [QUESTION_PUZZLE]: 'open' } });
    const entries = availableHints(FIXTURE_WORLD, state);
    expect(entries).toEqual([{ puzzle: PUZZLE_1, question: QUESTION_PUZZLE, questionText: 'How do you get through the fixture door?', used: 0, total: 3 }]);
  });

  it('omits a puzzle whose anchor question is unopened', () => {
    const state = baseState();
    expect(availableHints(FIXTURE_WORLD, state)).toEqual([]);
  });

  it('omits a puzzle whose anchor question is already answered', () => {
    const state = baseState({ questions: { [QUESTION_PUZZLE]: 'answered' } });
    expect(availableHints(FIXTURE_WORLD, state)).toEqual([]);
  });

  it('reflects hints already used', () => {
    const state = baseState({ questions: { [QUESTION_PUZZLE]: 'open' }, hintsUsed: { [PUZZLE_1]: 2 } });
    const entries = availableHints(FIXTURE_WORLD, state);
    expect(entries[0]!.used).toBe(2);
  });
});

describe('revealHint(): HINT <n> ladder consumption', () => {
  it('reveals level 1 and sets hintsUsed to 1', () => {
    const state = baseState();
    const result = revealHint(FIXTURE_WORLD, state, PUZZLE_1);
    expect(result.events).toEqual([{ type: 'line', kind: 'system', text: 'fixture hint level 1 (nudge)' }]);
    expect(result.state.hintsUsed[PUZZLE_1]).toBe(1);
  });

  it('each successive call reveals the next level', () => {
    let state = baseState();
    state = revealHint(FIXTURE_WORLD, state, PUZZLE_1).state;
    const second = revealHint(FIXTURE_WORLD, state, PUZZLE_1);
    expect(second.events).toEqual([{ type: 'line', kind: 'system', text: 'fixture hint level 2 (clue id)' }]);
    expect(second.state.hintsUsed[PUZZLE_1]).toBe(2);
  });

  it('caps at the ladder\'s length: repeating past the last level re-renders it without incrementing further', () => {
    let state = baseState({ hintsUsed: { [PUZZLE_1]: 3 } }); // already at the explicit-solution level (3 authored)
    const result = revealHint(FIXTURE_WORLD, state, PUZZLE_1);
    expect(result.events).toEqual([{ type: 'line', kind: 'system', text: 'fixture hint level 3 (explicit)' }]);
    expect(result.state.hintsUsed[PUZZLE_1]).toBe(3);
    expect(result.state).toBe(state); // full no-op once exhausted
  });

  it('hintsUsed is state (saved) — a plain JSON round-trip preserves the count', () => {
    const revealed = revealHint(FIXTURE_WORLD, baseState(), PUZZLE_1);
    const reloaded: GameState = JSON.parse(JSON.stringify(revealed.state));
    expect(reloaded.hintsUsed[PUZZLE_1]).toBe(1);
    const again = revealHint(FIXTURE_WORLD, reloaded, PUZZLE_1);
    expect(again.state.hintsUsed[PUZZLE_1]).toBe(2); // continues the ladder, not a re-grant of level 1
  });

  it('throws for a puzzle not declared in world.puzzles — a content bug, not a play-time refusal', () => {
    expect(() => revealHint(FIXTURE_WORLD, baseState(), P('fixture_no_such_puzzle'))).toThrow();
  });
});

// ---------------------------------------------------------------------------
// The clock-free-solution validate rule (§4.3.4/constitution §10) — the
// single most important rule in the validator (task 16's own brief).
// ---------------------------------------------------------------------------

describe('validate(): puzzle clock-free-solution rule', () => {
  it('the fixture puzzle (three flag-only routes) is clean', () => {
    expect(validate(FIXTURE_WORLD).filter((f) => f.code === 'puzzle-no-clock-free-solution')).toEqual([]);
  });

  it('rejects a puzzle whose only solution route mentions the clock, with no missedRecovery', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      puzzles: {
        [P('fixture_broken_puzzle')]: {
          id: P('fixture_broken_puzzle'),
          name: 'broken puzzle',
          solvedWhen: { flag: FLAG_PUZZLE_ROUTE_A },
          solutions: [{ id: 'only_route', class: 'direct', note: 'catch the 9:40', route: { clockPhase: 'morning' } }],
          hints: ['nudge'],
        },
      },
    };
    const findings = validate(world).filter((f) => f.code === 'puzzle-no-clock-free-solution');
    expect(findings).toHaveLength(1);
    expect(findings[0]!.severity).toBe('error');
    expect(findings[0]!.message).toContain('fixture_broken_puzzle');
  });

  it('accepts the same clock-only-route puzzle once missedRecovery is declared', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      puzzles: {
        [P('fixture_recovered_puzzle')]: {
          id: P('fixture_recovered_puzzle'),
          name: 'recovered puzzle',
          solvedWhen: { flag: FLAG_PUZZLE_ROUTE_A },
          solutions: [{ id: 'only_route', class: 'direct', note: 'catch the 9:40', route: { clockPhase: 'morning' } }],
          hints: ['nudge'],
          missedRecovery: 'The guide reports what happened at the platform the next day.',
        },
      },
    };
    expect(validate(world).filter((f) => f.code === 'puzzle-no-clock-free-solution')).toEqual([]);
  });

  it('a solutions entry with no route at all is treated as trivially clock-free', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      puzzles: {
        [P('fixture_routeless_puzzle')]: {
          id: P('fixture_routeless_puzzle'),
          name: 'routeless puzzle',
          solvedWhen: { flag: FLAG_PUZZLE_ROUTE_A },
          solutions: [{ id: 'undocumented_route', class: 'direct', note: 'no route cond authored' }],
          hints: ['nudge'],
        },
      },
    };
    expect(validate(world).filter((f) => f.code === 'puzzle-no-clock-free-solution')).toEqual([]);
  });

  it('rejects a puzzle whose only solution route is onOrAfterDay-gated, with no missedRecovery (ADR 0011, Stage D E2)', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      puzzles: {
        [P('fixture_due_day_puzzle')]: {
          id: P('fixture_due_day_puzzle'),
          name: 'due day puzzle',
          solvedWhen: { flag: FLAG_PUZZLE_ROUTE_A },
          solutions: [{ id: 'only_route', class: 'direct', note: 'wait for the reply', route: { onOrAfterDay: F('fixture_due_day') } }],
          hints: ['nudge'],
        },
      },
    };
    const findings = validate(world).filter((f) => f.code === 'puzzle-no-clock-free-solution');
    expect(findings).toHaveLength(1);
    expect(findings[0]!.severity).toBe('error');
    expect(findings[0]!.message).toContain('fixture_due_day_puzzle');
  });

  it('a puzzle with at least one clock-free route among several is clean, even if another route is clock-gated', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      puzzles: {
        [P('fixture_mixed_puzzle')]: {
          id: P('fixture_mixed_puzzle'),
          name: 'mixed puzzle',
          solvedWhen: { any: [{ flag: FLAG_PUZZLE_ROUTE_A }, { flag: FLAG_PUZZLE_ROUTE_B }] },
          solutions: [
            { id: 'timed_bonus', class: 'direct', note: 'catch the 9:40', route: { clockPhase: 'morning' } },
            { id: 'always_available', class: 'analytical', note: 'the slow way', route: { flag: FLAG_PUZZLE_ROUTE_B } },
          ],
          hints: ['nudge'],
        },
      },
    };
    expect(validate(world).filter((f) => f.code === 'puzzle-no-clock-free-solution')).toEqual([]);
  });
});

describe('validate(): puzzle referential integrity', () => {
  it('flags solvedWhen referencing an undeclared flag', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      puzzles: {
        [P('fixture_bad_ref_puzzle')]: {
          id: P('fixture_bad_ref_puzzle'),
          name: 'bad ref puzzle',
          solvedWhen: { flag: F('fixture_ghost_flag') },
          solutions: [{ id: 'r', class: 'direct', note: 'n' }],
          hints: ['nudge'],
        },
      },
    };
    const findings = validate(world).filter((f) => f.code === 'unknown-flag-ref');
    expect(findings.some((f) => f.message.includes('fixture_ghost_flag'))).toBe(true);
  });

  it('flags a question anchor referencing an undeclared question', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      puzzles: {
        [P('fixture_bad_question_puzzle')]: {
          id: P('fixture_bad_question_puzzle'),
          name: 'bad question puzzle',
          question: Q('fixture_ghost_question'),
          solvedWhen: { flag: FLAG_PUZZLE_ROUTE_A },
          solutions: [{ id: 'r', class: 'direct', note: 'n' }],
          hints: ['nudge'],
        },
      },
    };
    const findings = validate(world).filter((f) => f.code === 'unknown-question-ref');
    expect(findings.some((f) => f.message.includes('fixture_ghost_question'))).toBe(true);
  });

  it('flags an onSolved effect that strands a plot-critical object', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      puzzles: {
        [P('fixture_strand_puzzle')]: {
          id: P('fixture_strand_puzzle'),
          name: 'strand puzzle',
          solvedWhen: { flag: FLAG_PUZZLE_ROUTE_A },
          solutions: [{ id: 'r', class: 'direct', note: 'n' }],
          hints: ['nudge'],
          onSolved: [{ move: [NOTEBOOK, 'nowhere'] }],
        },
      },
    };
    const findings = validate(world).filter((f) => f.code === 'effect-strands-plot-critical');
    expect(findings.length).toBeGreaterThan(0);
  });
});
