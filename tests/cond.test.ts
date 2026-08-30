import { describe, expect, it } from 'vitest';
import { evaluate, flag, questionStatus } from '../src/engine/cond';
import type { Cond } from '../src/engine/cond';
import type { GameState } from '../src/engine/world';
import {
  BOX,
  CLUE_1,
  FIXTURE_WORLD,
  FLAG_BOOL,
  FLAG_NUM,
  GUIDE,
  KEY,
  MEMORY_1,
  QUESTION_1,
  ROOM_A,
  ROOM_B,
  ROOM_C,
  SHELF,
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

describe('flag() resolver', () => {
  it('reads an unset boolean flag as its declared default', () => {
    expect(flag(FIXTURE_WORLD, baseState(), FLAG_BOOL)).toBe(false);
  });

  it('reads an unset numeric flag as its declared default', () => {
    expect(flag(FIXTURE_WORLD, baseState(), FLAG_NUM)).toBe(2);
  });

  it('reads a set flag from the state overlay, not the default', () => {
    const state = baseState({ flags: { [FLAG_BOOL]: true } });
    expect(flag(FIXTURE_WORLD, state, FLAG_BOOL)).toBe(true);
  });
});

describe('questionStatus() resolver', () => {
  it('reads an unopened question as "unopened" when absent from state', () => {
    expect(questionStatus(FIXTURE_WORLD, baseState(), QUESTION_1)).toBe('unopened');
  });

  it('reads a set question status from the state overlay', () => {
    const state = baseState({ questions: { [QUESTION_1]: 'open' } });
    expect(questionStatus(FIXTURE_WORLD, state, QUESTION_1)).toBe('open');
  });
});

describe('evaluate(): flag arm', () => {
  it('defaults `is` to true', () => {
    const state = baseState({ flags: { [FLAG_BOOL]: true } });
    expect(evaluate(FIXTURE_WORLD, state, { flag: FLAG_BOOL })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, baseState(), { flag: FLAG_BOOL })).toBe(false);
  });

  it('checks an explicit `is` value', () => {
    const state = baseState({ flags: { [FLAG_BOOL]: false } });
    expect(evaluate(FIXTURE_WORLD, state, { flag: FLAG_BOOL, is: false })).toBe(true);
  });

  it('checks `atLeast` against a numeric flag, including its declared default', () => {
    expect(evaluate(FIXTURE_WORLD, baseState(), { flag: FLAG_NUM, atLeast: 2 })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, baseState(), { flag: FLAG_NUM, atLeast: 3 })).toBe(false);
    const state = baseState({ flags: { [FLAG_NUM]: 5 } });
    expect(evaluate(FIXTURE_WORLD, state, { flag: FLAG_NUM, atLeast: 3 })).toBe(true);
  });
});

describe('evaluate(): has arm', () => {
  it('is true when the object is carried', () => {
    const state = baseState({ objects: { [KEY]: { location: 'inventory' } } });
    expect(evaluate(FIXTURE_WORLD, state, { has: KEY })).toBe(true);
  });

  it('is true when the object is worn', () => {
    const state = baseState({ objects: { [KEY]: { location: 'worn' } } });
    expect(evaluate(FIXTURE_WORLD, state, { has: KEY })).toBe(true);
  });

  it('is false when the object is elsewhere or unrecorded', () => {
    const state = baseState({ objects: { [KEY]: { location: ROOM_B } } });
    expect(evaluate(FIXTURE_WORLD, state, { has: KEY })).toBe(false);
    expect(evaluate(FIXTURE_WORLD, baseState(), { has: KEY })).toBe(false);
  });
});

describe('evaluate(): at arm', () => {
  it('compares the player location', () => {
    const state = baseState({ location: ROOM_B });
    expect(evaluate(FIXTURE_WORLD, state, { at: ROOM_B })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, state, { at: ROOM_A })).toBe(false);
  });
});

describe('evaluate(): objectAt arm', () => {
  it('compares a room PlaceId', () => {
    const state = baseState({ objects: { [KEY]: { location: ROOM_C } } });
    expect(evaluate(FIXTURE_WORLD, state, { objectAt: [KEY, ROOM_C] })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, state, { objectAt: [KEY, ROOM_B] })).toBe(false);
  });

  it('compares container/supporter/inventory/worn/nowhere PlaceId forms', () => {
    const inBox = baseState({ objects: { [KEY]: { location: { in: BOX } } } });
    expect(evaluate(FIXTURE_WORLD, inBox, { objectAt: [KEY, { in: BOX }] })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, inBox, { objectAt: [KEY, { on: SHELF }] })).toBe(false);

    const onShelf = baseState({ objects: { [KEY]: { location: { on: SHELF } } } });
    expect(evaluate(FIXTURE_WORLD, onShelf, { objectAt: [KEY, { on: SHELF }] })).toBe(true);

    const carried = baseState({ objects: { [KEY]: { location: { npc: GUIDE } } } });
    expect(evaluate(FIXTURE_WORLD, carried, { objectAt: [KEY, { npc: GUIDE }] })).toBe(true);

    const nowhere = baseState({ objects: { [KEY]: { location: 'nowhere' } } });
    expect(evaluate(FIXTURE_WORLD, nowhere, { objectAt: [KEY, 'nowhere'] })).toBe(true);
  });

  it('falls back to the authored default location when there is no overlay entry', () => {
    // KEY's authored default (tests/fixtures/world.ts) is ROOM_A. Before the
    // task 6 review fix, this arm read `state.objects[id]?.location` with no
    // fallback, so this was `false` for an object sitting exactly where
    // content placed it — see tests/world.test.ts's "cond.ts / resolve.ts
    // seam" block for the fuller regression coverage.
    expect(evaluate(FIXTURE_WORLD, baseState(), { objectAt: [KEY, ROOM_A] })).toBe(true);
  });

  it('throws for an object with no overlay and no authored declaration', () => {
    const undeclared = 'fixture_key_never_declared' as typeof KEY;
    expect(() => evaluate(FIXTURE_WORLD, baseState(), { objectAt: [undeclared, ROOM_A] })).toThrow();
  });
});

describe('evaluate(): objectState arm', () => {
  it('compares open/locked/on/hidden overlay fields', () => {
    const state = baseState({ objects: { [BOX]: { open: true, locked: false } } });
    expect(evaluate(FIXTURE_WORLD, state, { objectState: [BOX, 'open', true] })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, state, { objectState: [BOX, 'locked', false] })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, state, { objectState: [BOX, 'locked', true] })).toBe(false);
  });

  it('treats an unrecorded state field as false', () => {
    expect(evaluate(FIXTURE_WORLD, baseState(), { objectState: [BOX, 'open', false] })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, baseState(), { objectState: [BOX, 'open', true] })).toBe(false);
  });
});

describe('evaluate(): prop arm', () => {
  it('compares an object-scoped prop', () => {
    const state = baseState({ objects: { [BOX]: { props: { color: 'red' } } } });
    expect(evaluate(FIXTURE_WORLD, state, { prop: [BOX, 'color', 'red'] })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, state, { prop: [BOX, 'color', 'blue'] })).toBe(false);
  });

  it('compares an NPC-scoped prop', () => {
    const state = baseState({ npcs: { [GUIDE]: { props: { mood: 'wary' } } } });
    expect(evaluate(FIXTURE_WORLD, state, { prop: [GUIDE, 'mood', 'wary'] })).toBe(true);
  });

  it('is false when the prop was never set', () => {
    expect(evaluate(FIXTURE_WORLD, baseState(), { prop: [BOX, 'color', 'red'] })).toBe(false);
  });
});

describe('evaluate(): visited arm', () => {
  it('is true once a room has been visited', () => {
    const state = baseState({ visited: { [ROOM_B]: 3 } });
    expect(evaluate(FIXTURE_WORLD, state, { visited: ROOM_B })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, state, { visited: ROOM_C })).toBe(false);
  });
});

describe('evaluate(): memory and clue arms', () => {
  it('checks membership in the recovery/discovery lists', () => {
    const state = baseState({ memories: [MEMORY_1], clues: [CLUE_1] });
    expect(evaluate(FIXTURE_WORLD, state, { memory: MEMORY_1 })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, state, { clue: CLUE_1 })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, baseState(), { memory: MEMORY_1 })).toBe(false);
    expect(evaluate(FIXTURE_WORLD, baseState(), { clue: CLUE_1 })).toBe(false);
  });
});

describe('evaluate(): question arm', () => {
  it('matches against the resolved status, defaulting to unopened', () => {
    expect(evaluate(FIXTURE_WORLD, baseState(), { question: [QUESTION_1, 'unopened'] })).toBe(true);
    const state = baseState({ questions: { [QUESTION_1]: 'answered' } });
    expect(evaluate(FIXTURE_WORLD, state, { question: [QUESTION_1, 'answered'] })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, state, { question: [QUESTION_1, 'open'] })).toBe(false);
  });
});

describe('evaluate(): npcAt and met arms', () => {
  it('checks a pinned NPC room', () => {
    const state = baseState({ npcs: { [GUIDE]: { room: ROOM_B } } });
    expect(evaluate(FIXTURE_WORLD, state, { npcAt: [GUIDE, ROOM_B] })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, state, { npcAt: [GUIDE, ROOM_A] })).toBe(false);
  });

  it('a following NPC resolves to the player location, overriding any pin', () => {
    const state = baseState({
      location: ROOM_C,
      npcs: { [GUIDE]: { room: ROOM_B, following: true } },
    });
    expect(evaluate(FIXTURE_WORLD, state, { npcAt: [GUIDE, ROOM_C] })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, state, { npcAt: [GUIDE, ROOM_B] })).toBe(false);
  });

  it('checks met', () => {
    const state = baseState({ npcs: { [GUIDE]: { met: true } } });
    expect(evaluate(FIXTURE_WORLD, state, { met: GUIDE })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, baseState(), { met: GUIDE })).toBe(false);
  });
});

describe('evaluate(): clock arm', () => {
  it('matches an exact day', () => {
    const state = baseState({ clock: { day: 2, minute: 0 } });
    expect(evaluate(FIXTURE_WORLD, state, { clock: { day: 2 } })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, state, { clock: { day: 1 } })).toBe(false);
  });

  it('matches an after/before minute window', () => {
    const state = baseState({ clock: { day: 1, minute: 600 } }); // 10:00
    expect(evaluate(FIXTURE_WORLD, state, { clock: { after: 540, before: 720 } })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, state, { clock: { after: 601 } })).toBe(false);
    expect(evaluate(FIXTURE_WORLD, state, { clock: { before: 600 } })).toBe(false);
    expect(evaluate(FIXTURE_WORLD, state, { clock: { after: 600 } })).toBe(true);
  });
});

describe('evaluate(): clockPhase arm', () => {
  it('matches the phase resolved from world.meta.phases', () => {
    const morning = baseState({ clock: { day: 1, minute: 400 } });
    expect(evaluate(FIXTURE_WORLD, morning, { clockPhase: 'morning' })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, morning, { clockPhase: 'night' })).toBe(false);

    const wrapped = baseState({ clock: { day: 1, minute: 30 } }); // just after midnight
    expect(evaluate(FIXTURE_WORLD, wrapped, { clockPhase: 'night' })).toBe(true);
  });
});

describe('evaluate(): weekday arm', () => {
  it('matches the 0-based weekday resolved from world.meta.weekLength', () => {
    const state = baseState({ clock: { day: 9, minute: 0 } }); // (9-1) % 7 = 1
    expect(evaluate(FIXTURE_WORLD, state, { weekday: 1 })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, state, { weekday: 0 })).toBe(false);
  });
});

describe('evaluate(): profileLeader arm', () => {
  it('is true only for the strict tally leader', () => {
    const state = baseState({ profile: { analytical: 5, social: 2, direct: 1 } });
    expect(evaluate(FIXTURE_WORLD, state, { profileLeader: 'analytical' })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, state, { profileLeader: 'social' })).toBe(false);
  });

  it('is false on a tie', () => {
    const state = baseState({ profile: { analytical: 3, social: 3, direct: 0 } });
    expect(evaluate(FIXTURE_WORLD, state, { profileLeader: 'analytical' })).toBe(false);
    expect(evaluate(FIXTURE_WORLD, state, { profileLeader: 'social' })).toBe(false);
  });
});

describe('evaluate(): all/any/not nesting', () => {
  const state = baseState({ flags: { [FLAG_BOOL]: true }, location: ROOM_A });

  it('all: [] is vacuously true', () => {
    expect(evaluate(FIXTURE_WORLD, state, { all: [] })).toBe(true);
  });

  it('any: [] is vacuously false', () => {
    expect(evaluate(FIXTURE_WORLD, state, { any: [] })).toBe(false);
  });

  it('all requires every arm to hold', () => {
    const trueArm: Cond = { flag: FLAG_BOOL };
    const falseArm: Cond = { at: ROOM_B };
    expect(evaluate(FIXTURE_WORLD, state, { all: [trueArm] })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, state, { all: [trueArm, falseArm] })).toBe(false);
  });

  it('any requires at least one arm to hold', () => {
    const trueArm: Cond = { flag: FLAG_BOOL };
    const falseArm: Cond = { at: ROOM_B };
    expect(evaluate(FIXTURE_WORLD, state, { any: [falseArm, trueArm] })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, state, { any: [falseArm] })).toBe(false);
  });

  it('not negates its arm', () => {
    expect(evaluate(FIXTURE_WORLD, state, { not: { at: ROOM_B } })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, state, { not: { at: ROOM_A } })).toBe(false);
  });

  it('nests all/any/not arbitrarily deep', () => {
    const nested: Cond = {
      all: [
        { flag: FLAG_BOOL },
        {
          any: [
            { at: ROOM_B },
            { not: { at: ROOM_B } },
          ],
        },
        { not: { all: [] } },
      ],
    };
    // `not: { all: [] }` negates a vacuous true, so the whole thing is false.
    expect(evaluate(FIXTURE_WORLD, state, nested)).toBe(false);

    const nestedTrue: Cond = {
      all: [{ flag: FLAG_BOOL }, { any: [{ at: ROOM_A }] }, { not: { at: ROOM_B } }],
    };
    expect(evaluate(FIXTURE_WORLD, state, nestedTrue)).toBe(true);
  });
});
