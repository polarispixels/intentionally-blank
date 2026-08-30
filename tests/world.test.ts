// tests/world.test.ts — spec §1.1, §1.2.1, §2.4, §2.6, §8 task 6.

import { describe, expect, it } from 'vitest';
import { evaluate, flag, questionStatus } from '../src/engine/cond';
import { initialState, isDark, npcRoom, objectLocation, objectState, scope } from '../src/engine/world';
import type { GameState, WorldDef } from '../src/engine/world';
import {
  BOX,
  CHEST,
  FIXTURE_WORLD,
  FLAG_BOOL,
  GLASS_CASE,
  GUIDE,
  HIDDEN_COIN,
  KEY,
  KEY_FOB,
  LAMP,
  NOTEBOOK,
  QUESTION_1,
  ROOM_A,
  ROOM_B,
  ROOM_C,
  SELF_TEST,
  SELF_TEST_PART,
  SHELF,
  TOUCHABLE,
} from './fixtures/world';

function baseState(overrides: Partial<GameState> = {}): GameState {
  return {
    phase: 'playing',
    turn: 0,
    clock: { day: 1, minute: 600 }, // afternoon
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

describe('initialState(world)', () => {
  it('places the player in world.meta.startRoom', () => {
    expect(initialState(FIXTURE_WORLD).location).toBe(ROOM_A);
  });

  it('seeds the clock at day 1, the morning phase start minute', () => {
    expect(initialState(FIXTURE_WORLD).clock).toEqual({ day: 1, minute: 360 });
  });

  it('marks the start room visited at turn 0', () => {
    expect(initialState(FIXTURE_WORLD).visited).toEqual({ [ROOM_A]: 0 });
  });

  it('starts with empty overlays, turn 0, playing phase, and zeroed profile', () => {
    const state = initialState(FIXTURE_WORLD);
    expect(state.turn).toBe(0);
    expect(state.phase).toBe('playing');
    expect(state.objects).toEqual({});
    expect(state.npcs).toEqual({});
    expect(state.flags).toEqual({});
    expect(state.memories).toEqual([]);
    expect(state.clues).toEqual([]);
    expect(state.hintsUsed).toEqual({});
    expect(state.firedEvents).toEqual([]);
    expect(state.profile).toEqual({ analytical: 0, social: 0, direct: 0 });
  });

  it('throws when world.meta.startRoom is not declared', () => {
    const { startRoom: _startRoom, ...metaWithoutStartRoom } = FIXTURE_WORLD.meta;
    const world = { ...FIXTURE_WORLD, meta: metaWithoutStartRoom };
    expect(() => initialState(world)).toThrow(/startRoom/);
  });
});

describe('flag() / questionStatus() resolvers (§1.2.1) — reachable via world.ts consumers too', () => {
  it('an object with no overlay resolves the authored default location', () => {
    expect(objectLocation(FIXTURE_WORLD, baseState(), KEY)).toBe(ROOM_A);
  });

  it('flag() falls back to the declared default when unset', () => {
    expect(flag(FIXTURE_WORLD, baseState(), FLAG_BOOL)).toBe(false);
  });

  it('questionStatus() reads "unopened" when the question is absent from state', () => {
    expect(questionStatus(FIXTURE_WORLD, baseState(), QUESTION_1)).toBe('unopened');
  });
});

describe('objectLocation() — overlay-first fallback (§1.1)', () => {
  it('falls back to the authored default when there is no overlay entry', () => {
    expect(objectLocation(FIXTURE_WORLD, baseState(), BOX)).toBe(ROOM_A);
  });

  it('prefers the overlay location when one is set', () => {
    const state = baseState({ objects: { [BOX]: { location: 'inventory' } } });
    expect(objectLocation(FIXTURE_WORLD, state, BOX)).toBe('inventory');
  });

  it('throws for an object not declared in world.objects', () => {
    expect(() => objectLocation(FIXTURE_WORLD, baseState(), 'nope' as typeof BOX)).toThrow();
  });
});

describe('objectState() — overlay-first fallback for open/locked/on/hidden', () => {
  it('falls back to ObjectDef.container.open/locked when unset', () => {
    const state = baseState();
    expect(objectState(FIXTURE_WORLD, state, CHEST, 'open')).toBe(false);
    expect(objectState(FIXTURE_WORLD, state, CHEST, 'locked')).toBe(false);
  });

  it('prefers the overlay when one is set', () => {
    const state = baseState({ objects: { [CHEST]: { open: true } } });
    expect(objectState(FIXTURE_WORLD, state, CHEST, 'open')).toBe(true);
  });

  it('falls back to ObjectDef.hidden when unset, and defaults "on" to false', () => {
    expect(objectState(FIXTURE_WORLD, baseState(), HIDDEN_COIN, 'hidden')).toBe(true);
    expect(objectState(FIXTURE_WORLD, baseState(), LAMP, 'on')).toBe(false);
  });
});

// Regression coverage for the `cond.ts` / `resolve.ts` seam found in task 6
// review: before `resolve.ts` existed, `evaluate()`'s `has`/`objectAt`/
// `objectState`/`prop` arms read `state.objects`/`state.npcs` directly with
// no fallback to the authored default — so `evaluate({ objectAt: [KEY,
// ROOM_A] })` was `false` for a key sitting exactly where content placed
// it, simply because nothing had moved it yet. Each test below fails
// against that old behavior (confirmed by hand against the pre-fix
// `cond.ts` before this block was added) and passes now that `evaluate`
// resolves through `resolve.ts`.
describe('evaluate() — objectAt/objectState/has/prop overlay fallback (cond.ts / resolve.ts seam)', () => {
  it('objectAt: an object with no overlay entry satisfies a cond matching its authored default', () => {
    expect(evaluate(FIXTURE_WORLD, baseState(), { objectAt: [KEY, ROOM_A] })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, baseState(), { objectAt: [KEY, ROOM_B] })).toBe(false);
  });

  it('objectAt: after an effect changes the location, the cond follows the new value', () => {
    const moved = baseState({ objects: { [KEY]: { location: ROOM_B } } });
    expect(evaluate(FIXTURE_WORLD, moved, { objectAt: [KEY, ROOM_B] })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, moved, { objectAt: [KEY, ROOM_A] })).toBe(false);
  });

  it('objectState: an object with no overlay entry satisfies a cond matching its authored default', () => {
    expect(evaluate(FIXTURE_WORLD, baseState(), { objectState: [CHEST, 'open', false] })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, baseState(), { objectState: [CHEST, 'open', true] })).toBe(false);
  });

  it('objectState: after an effect changes the value, the cond follows the new value', () => {
    const opened = baseState({ objects: { [CHEST]: { open: true } } });
    expect(evaluate(FIXTURE_WORLD, opened, { objectState: [CHEST, 'open', true] })).toBe(true);
    expect(evaluate(FIXTURE_WORLD, opened, { objectState: [CHEST, 'open', false] })).toBe(false);
  });

  it('has: an object whose authored default location is inventory is satisfied with no overlay at all', () => {
    const world: WorldDef = { ...FIXTURE_WORLD, objects: { ...FIXTURE_WORLD.objects, [KEY]: { location: 'inventory' } } };
    expect(evaluate(world, baseState(), { has: KEY })).toBe(true);
  });

  it('prop: disambiguates a declared object by world.objects membership, not by which overlay table has a value', () => {
    // KEY is declared in world.objects; simulate an (illegal in practice,
    // but exactly what the old try-both-tables read would misread) id
    // collision by also giving `state.npcs` an entry under the same string.
    const state = baseState({ npcs: { [KEY as unknown as typeof GUIDE]: { props: { color: 'wrong-table' } } } });
    expect(evaluate(FIXTURE_WORLD, state, { prop: [KEY, 'color', 'wrong-table'] })).toBe(false);
  });

  it('prop: reads the overlay once an effect sets it', () => {
    const state = baseState({ objects: { [KEY]: { props: { color: 'brass' } } } });
    expect(evaluate(FIXTURE_WORLD, state, { prop: [KEY, 'color', 'brass'] })).toBe(true);
  });
});

describe('isDark() — the sole darkness authority (§2.4)', () => {
  it('a lit baseline room is never dark, regardless of light sources', () => {
    expect(isDark(FIXTURE_WORLD, baseState(), ROOM_B)).toBe(false);
  });

  it('a baseline-dark room with no active light source is dark', () => {
    expect(isDark(FIXTURE_WORLD, baseState(), ROOM_A)).toBe(true);
  });

  it('an unlit light source in the room does not defeat baseline darkness', () => {
    const state = baseState({ objects: { [LAMP]: { location: ROOM_A, on: false } } });
    expect(isDark(FIXTURE_WORLD, state, ROOM_A)).toBe(true);
  });

  it('a lit light source directly in the room defeats baseline darkness', () => {
    const state = baseState({ objects: { [LAMP]: { location: ROOM_A, on: true } } });
    expect(isDark(FIXTURE_WORLD, state, ROOM_A)).toBe(false);
  });

  it('a lit light source carried in inventory defeats baseline darkness', () => {
    const state = baseState({ objects: { [LAMP]: { location: 'inventory', on: true } } });
    expect(isDark(FIXTURE_WORLD, state, ROOM_A)).toBe(false);
  });

  it('a lit light source worn defeats baseline darkness', () => {
    const state = baseState({ objects: { [LAMP]: { location: 'worn', on: true } } });
    expect(isDark(FIXTURE_WORLD, state, ROOM_A)).toBe(false);
  });

  it('a lit light source inside a closed opaque container stays dark', () => {
    const state = baseState({
      objects: { [LAMP]: { location: { in: CHEST }, on: true }, [CHEST]: { location: ROOM_A, open: false } },
    });
    expect(isDark(FIXTURE_WORLD, state, ROOM_A)).toBe(true);
  });

  it('a lit light source inside an open opaque container defeats baseline darkness', () => {
    const state = baseState({
      objects: { [LAMP]: { location: { in: CHEST }, on: true }, [CHEST]: { location: ROOM_A, open: true } },
    });
    expect(isDark(FIXTURE_WORLD, state, ROOM_A)).toBe(false);
  });

  it('a lit light source inside a closed transparent container defeats baseline darkness', () => {
    const state = baseState({
      objects: { [LAMP]: { location: { in: GLASS_CASE }, on: true }, [GLASS_CASE]: { location: ROOM_A, open: false } },
    });
    expect(isDark(FIXTURE_WORLD, state, ROOM_A)).toBe(false);
  });

  it('the baseline can be a Cond: dark only while the cond holds', () => {
    const litState = baseState({ location: ROOM_C });
    const darkState = baseState({ location: ROOM_C, flags: { [FLAG_BOOL]: true } });
    expect(isDark(FIXTURE_WORLD, litState, ROOM_C)).toBe(false);
    expect(isDark(FIXTURE_WORLD, darkState, ROOM_C)).toBe(true);
  });
});

describe('scope() — visibility (§0)', () => {
  it('lists an object located directly in the room', () => {
    const state = baseState({ location: ROOM_B, objects: { [KEY]: { location: ROOM_B } } });
    expect(scope(FIXTURE_WORLD, state)).toContain(KEY);
  });

  it('excludes hidden objects even when directly in the room', () => {
    const state = baseState({ location: ROOM_B, objects: { [HIDDEN_COIN]: { location: ROOM_B } } });
    expect(scope(FIXTURE_WORLD, state)).not.toContain(HIDDEN_COIN);
  });

  it('lists an object on a supporter in the room', () => {
    const state = baseState({ location: ROOM_B, objects: { [SHELF]: { location: ROOM_B }, [KEY]: { location: { on: SHELF } } } });
    expect(scope(FIXTURE_WORLD, state)).toContain(KEY);
  });

  it('lists an object inside an open container in the room', () => {
    const state = baseState({
      location: ROOM_B,
      objects: { [KEY]: { location: { in: CHEST } }, [CHEST]: { location: ROOM_B, open: true } },
    });
    expect(scope(FIXTURE_WORLD, state)).toContain(KEY);
  });

  it('excludes an object inside a closed opaque container in the room', () => {
    const state = baseState({
      location: ROOM_B,
      objects: { [KEY]: { location: { in: CHEST } }, [CHEST]: { location: ROOM_B, open: false } },
    });
    expect(scope(FIXTURE_WORLD, state)).not.toContain(KEY);
  });

  it('lists an object inside a closed transparent container in the room', () => {
    const state = baseState({
      location: ROOM_B,
      objects: { [KEY]: { location: { in: GLASS_CASE } }, [GLASS_CASE]: { location: ROOM_B, open: false } },
    });
    expect(scope(FIXTURE_WORLD, state)).toContain(KEY);
  });

  it('lists carried (inventory) and worn objects', () => {
    const state = baseState({ location: ROOM_B, objects: { [KEY]: { location: 'inventory' }, [BOX]: { location: 'worn' } } });
    const visible = scope(FIXTURE_WORLD, state);
    expect(visible).toContain(KEY);
    expect(visible).toContain(BOX);
  });

  it('excludes an object left behind in a different room', () => {
    // NOTEBOOK's authored default location is ROOM_A; the player is in ROOM_B.
    expect(scope(FIXTURE_WORLD, baseState({ location: ROOM_B }))).not.toContain(NOTEBOOK);
  });

  it('in a dark room, only carried/worn objects remain in scope', () => {
    // ROOM_A is baseline-dark in the fixture, and no light source is on.
    const state = baseState({
      location: ROOM_A,
      objects: { [KEY]: { location: 'inventory' } },
    });
    const visible = scope(FIXTURE_WORLD, state);
    expect(visible).toContain(KEY);
    expect(visible).not.toContain(BOX); // BOX's authored default is ROOM_A, but unreachable in the dark
  });

  it('a dark room lit by a carried light source restores full scope', () => {
    const state = baseState({
      location: ROOM_A,
      objects: { [LAMP]: { location: 'inventory', on: true } },
    });
    const visible = scope(FIXTURE_WORLD, state);
    expect(visible).toContain(BOX); // ROOM_A's authored default location
    expect(visible).toContain(LAMP);
  });

  // Gap 1 (dark-reachability): `reachableInDark` — the per-object "findable
  // by touch" exception scope()'s all-or-nothing dark rule used to lack
  // entirely (see world.ts's own doc comment on the field).
  describe('reachableInDark — per-object touch exception (§2.4)', () => {
    it('a reachableInDark object physically in the dark room stays in scope', () => {
      const state = baseState({ location: ROOM_A });
      expect(scope(FIXTURE_WORLD, state)).toContain(TOUCHABLE);
    });

    it('a reachableInDark object is still excluded once it is no longer physically present in the dark room', () => {
      const state = baseState({ location: ROOM_A, objects: { [TOUCHABLE]: { location: ROOM_B } } });
      // ROOM_B is lit, so this also proves reachableInDark never grants
      // scope from a different room — only physical presence + the flag.
      expect(scope(FIXTURE_WORLD, state)).not.toContain(TOUCHABLE);
    });

    it('an object nested on something carried is reachable in the dark with no reachableInDark flag of its own', () => {
      const state = baseState({ location: ROOM_A, objects: { [KEY]: { location: 'inventory' } } });
      expect(scope(FIXTURE_WORLD, state)).toContain(KEY_FOB);
    });

    it('an object nested on something NOT carried, and not itself flagged, stays out of scope in the dark', () => {
      // KEY stays at its authored default (ROOM_A) — not carried.
      const state = baseState({ location: ROOM_A });
      expect(scope(FIXTURE_WORLD, state)).not.toContain(KEY_FOB);
    });
  });

  // The 'self' PlaceId (ids.ts's own doc comment): part of the player, not
  // tied to any room, always in scope, always reachable in the dark, with
  // no reachableInDark flag needed — this is what X ME / TOUCH HEAD /
  // SEARCH POCKETS rely on working from every room, not just the one a
  // body part happened to be authored against.
  describe("'self' PlaceId — always in scope, wherever the player is (§8 gap: PlaceId had no way to say 'part of the player')", () => {
    it('a self-placed object is in scope from ROOM_B — a room it was never authored against', () => {
      const state = baseState({ location: ROOM_B });
      expect(scope(FIXTURE_WORLD, state)).toContain(SELF_TEST);
    });

    it('a self-placed object is in scope from ROOM_C too', () => {
      const state = baseState({ location: ROOM_C });
      expect(scope(FIXTURE_WORLD, state)).toContain(SELF_TEST);
    });

    it('a sub-part resting { on: self-placed-object } inherits scope with no location or flag of its own', () => {
      const state = baseState({ location: ROOM_B });
      expect(scope(FIXTURE_WORLD, state)).toContain(SELF_TEST_PART);
    });

    it('stays in scope in a dark room, with no reachableInDark flag authored on it', () => {
      // ROOM_A is baseline-dark in the fixture, and no light source is on.
      const state = baseState({ location: ROOM_A });
      const visible = scope(FIXTURE_WORLD, state);
      expect(visible).toContain(SELF_TEST);
      expect(visible).toContain(SELF_TEST_PART);
    });
  });
});

describe('npcRoom() — following > pin > schedule precedence (§2.6)', () => {
  it('derives from the schedule when there is no overlay at all', () => {
    const state = baseState({ clock: { day: 1, minute: 360 } }); // morning
    expect(npcRoom(FIXTURE_WORLD, state, GUIDE)).toBe(ROOM_B);
  });

  it('the schedule can resolve to offstage', () => {
    const state = baseState({ clock: { day: 1, minute: 1320 } }); // night
    expect(npcRoom(FIXTURE_WORLD, state, GUIDE)).toBe('offstage');
  });

  it('the schedule falls back to its unconditional rule', () => {
    const state = baseState({ clock: { day: 1, minute: 720 } }); // afternoon
    expect(npcRoom(FIXTURE_WORLD, state, GUIDE)).toBe(ROOM_C);
  });

  it('a pin overrides the schedule', () => {
    const state = baseState({ clock: { day: 1, minute: 360 }, npcs: { [GUIDE]: { room: 'offstage' } } });
    expect(npcRoom(FIXTURE_WORLD, state, GUIDE)).toBe('offstage');
  });

  it('following overrides both the pin and the schedule', () => {
    const state = baseState({
      location: ROOM_C,
      clock: { day: 1, minute: 360 },
      npcs: { [GUIDE]: { room: 'offstage', following: true } },
    });
    expect(npcRoom(FIXTURE_WORLD, state, GUIDE)).toBe(ROOM_C);
  });

  it('an NPC with no declared schedule and no overlay is offstage', () => {
    const world = { ...FIXTURE_WORLD, npcs: {} };
    expect(npcRoom(world, baseState(), GUIDE)).toBe('offstage');
  });
});
