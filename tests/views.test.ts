// tests/views.test.ts — spec §6.1-§6.4 (map/questions/notebook/memories),
// §8 task 17. `availableHints`/`revealHint` (§6.5, task 16) stay tested in
// `tests/puzzles.test.ts` — this file owns everything else `views.ts`
// exports.
//
// The rule every test here is ultimately checking (constitution §20/§25,
// spec 05 §14): these four selectors are memory assistance, never quest
// markers. Each `describe` block below includes at least one spoiler-
// boundary test — content that exists in `world` but hasn't been reached
// in `state` must not appear in the corresponding view's output.

import { describe, expect, it } from 'vitest';
import { mapView, memoriesView, notebookView, questionsView } from '../src/engine/views';
import type { GameState } from '../src/engine/world';
import {
  CLUE_1,
  FIXTURE_WORLD,
  FLAG_QUESTION_ANSWER,
  FLAG_QUESTION_OPEN,
  MEMORY_1,
  MEMORY_2,
  QUESTION_1,
  QUESTION_2,
  ROOM_A,
  ROOM_B,
  ROOM_C,
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

describe('mapView()', () => {
  it('lists only visited rooms, at their authored coordinates, grouped by area, current room marked', () => {
    const state = baseState({ visited: { [ROOM_A]: 0, [ROOM_B]: 5 }, location: ROOM_B });
    const view = mapView(FIXTURE_WORLD, state);

    expect(view.rooms).toEqual([
      { room: ROOM_A, name: 'Fixture Room Alpha', area: 'fixture-wing', x: 0, y: 0, z: undefined, current: false },
      { room: ROOM_B, name: 'Fixture Room B', area: 'fixture-wing', x: 1, y: 0, z: undefined, current: true },
    ]);
  });

  it('never lists an unvisited room — no name, no coordinates, no area leak', () => {
    const state = baseState(); // only ROOM_A visited (seeded by initialState convention)
    const view = mapView(FIXTURE_WORLD, state);

    expect(view.rooms).toHaveLength(1);
    expect(view.rooms[0]!.room).toBe(ROOM_A);
    // ROOM_B/ROOM_C never appear anywhere in the result, by name or id.
    const serialized = JSON.stringify(view);
    expect(serialized).not.toContain('Fixture Room B');
    expect(serialized).not.toContain('Fixture Room C');
    expect(serialized).not.toContain(ROOM_B);
    expect(serialized).not.toContain(ROOM_C);
  });

  it('connects visited rooms by exits currently seen from them, unvisited destinations rendering as an unresolved stub (no id, no name)', () => {
    // ROOM_A's only exit goes to ROOM_B, which is unvisited.
    const state = baseState();
    const view = mapView(FIXTURE_WORLD, state);

    expect(view.edges).toEqual([{ from: ROOM_A, to: { known: false } }]);
  });

  it('resolves an edge to the real room once its destination has been visited', () => {
    const state = baseState({ visited: { [ROOM_A]: 0, [ROOM_B]: 3 }, location: ROOM_B });
    const view = mapView(FIXTURE_WORLD, state);

    const aToB = view.edges.find((e) => e.from === ROOM_A);
    expect(aToB).toEqual({ from: ROOM_A, to: { known: true, room: ROOM_B } });
  });

  it('an exit behind a closed door still renders as a connection (existence, not passability) — the destination stays a stub until actually entered', () => {
    // ROOM_B -> ROOM_C is gated by DOOR, closed by default; DOOR carries
    // no `when` cond (only a `door` lock), so the exit itself is "seen"
    // the moment the player is in ROOM_B, independent of the lock.
    const state = baseState({ visited: { [ROOM_A]: 0, [ROOM_B]: 3 }, location: ROOM_B });
    const view = mapView(FIXTURE_WORLD, state);

    const bToC = view.edges.find((e) => e.from === ROOM_B && e.to.known === false);
    expect(bToC).toEqual({ from: ROOM_B, to: { known: false } });
  });

  it('emits no edges at all from an unvisited room, even if it would otherwise have exits', () => {
    const state = baseState({ visited: { [ROOM_A]: 0, [ROOM_B]: 3 }, location: ROOM_B });
    const view = mapView(FIXTURE_WORLD, state);
    expect(view.edges.some((e) => e.from === ROOM_C)).toBe(false);
  });
});

describe('questionsView()', () => {
  it('lists an open question under `open`, phrased text intact', () => {
    const state = baseState({ questions: { [QUESTION_1]: 'open' } });
    const view = questionsView(FIXTURE_WORLD, state);

    expect(view.open).toEqual([{ id: QUESTION_1, text: 'Is this a fixture question?' }]);
    expect(view.settled).toEqual([]);
  });

  it('moves an answered question to `settled`, with the authored answer as recap', () => {
    const state = baseState({ questions: { [QUESTION_2]: 'answered' } });
    const view = questionsView(FIXTURE_WORLD, state);

    expect(view.open).toEqual([]);
    expect(view.settled).toEqual([
      {
        id: QUESTION_2,
        text: 'Does this fixture open and answer ambiently?',
        answer: 'Yes — ambiently, once both fixture flags were set.',
      },
    ]);
  });

  it('preserves the order questions were opened in, across a mix of open and settled', () => {
    // QUESTION_2 opened first, then QUESTION_1 opened, then QUESTION_2 answered.
    let state = baseState({ questions: { [QUESTION_2]: 'open' } });
    state = { ...state, questions: { ...state.questions, [QUESTION_1]: 'open' } };
    state = { ...state, questions: { ...state.questions, [QUESTION_2]: 'answered' } };

    const view = questionsView(FIXTURE_WORLD, state);
    expect(view.open.map((q) => q.id)).toEqual([QUESTION_1]);
    expect(view.settled.map((q) => q.id)).toEqual([QUESTION_2]);
  });

  it('spoiler boundary: a declared question that has never opened does not appear in either list', () => {
    const state = baseState(); // state.questions is empty — QUESTION_1/QUESTION_2 both declared in world, neither opened
    const view = questionsView(FIXTURE_WORLD, state);

    expect(view.open).toEqual([]);
    expect(view.settled).toEqual([]);
    const serialized = JSON.stringify(view);
    expect(serialized).not.toContain('fixture question');
  });
});

describe('notebookView()', () => {
  it('lists a discovered clue with title, detail recap, and the questions it bears on', () => {
    const state = baseState({ clues: [CLUE_1] });
    const view = notebookView(FIXTURE_WORLD, state);

    expect(view).toEqual([
      {
        id: CLUE_1,
        title: 'fixture clue title',
        detail: 'fixture clue detail — recap of the fixture scene that revealed it',
        questions: [QUESTION_1],
      },
    ]);
  });

  it('spoiler boundary: an undiscovered clue never appears, even though it is declared in world.clues', () => {
    const state = baseState(); // state.clues is empty
    const view = notebookView(FIXTURE_WORLD, state);

    expect(view).toEqual([]);
  });

  it('preserves discovery order (state.clues order), not world declaration order', () => {
    // Only one fixture clue exists, but this pins the contract: the view
    // walks `state.clues`, never `Object.keys(world.clues)`.
    const state = baseState({ clues: [CLUE_1] });
    const view = notebookView(FIXTURE_WORLD, state);
    expect(view.map((c) => c.id)).toEqual(state.clues);
  });
});

describe('memoriesView()', () => {
  it('lists a recovered memory by title, lines re-readable in full, in recovery order', () => {
    const state = baseState({ memories: [MEMORY_1, MEMORY_2] });
    const view = memoriesView(FIXTURE_WORLD, state);

    expect(view).toEqual([
      { id: MEMORY_1, title: 'Fixture Memory One', lines: ['You remember the fixture.', 'It was, in fact, a fixture.'] },
      { id: MEMORY_2, title: 'Fixture Memory Two', lines: ['You remember a second fixture, ambiently.'] },
    ]);
  });

  it('spoiler boundary: an unrecovered memory never appears, even though it is declared in world.memories', () => {
    const state = baseState({ memories: [MEMORY_1] }); // MEMORY_2 declared but not recovered
    const view = memoriesView(FIXTURE_WORLD, state);

    expect(view).toEqual([{ id: MEMORY_1, title: 'Fixture Memory One', lines: ['You remember the fixture.', 'It was, in fact, a fixture.'] }]);
    expect(view.some((m) => m.id === MEMORY_2)).toBe(false);
  });

  it('never exposes a total/possible count — no field carries the size of world.memories', () => {
    const state = baseState({ memories: [MEMORY_1] });
    const view = memoriesView(FIXTURE_WORLD, state);

    // The view is exactly the recovered list; nothing alongside it names a total.
    expect(Array.isArray(view)).toBe(true);
    expect(view).toHaveLength(1);
  });
});
