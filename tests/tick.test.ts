// tests/tick.test.ts — spec §4, §8 task 13.

import { describe, expect, it } from 'vitest';
import { evaluate, npcRoom } from '../src/engine/cond';
import { apply } from '../src/engine/effects';
import { deriveNpcPositions, tick } from '../src/engine/tick';
import type { GameState } from '../src/engine/world';
import type { EventDef, WorldDef } from '../src/engine/world';
import {
  FIXTURE_WORLD,
  FLAG_EVENT_FIRED,
  FLAG_EVENT_TRIGGER,
  FLAG_WITNESS_TRIGGER,
  FLAG_WITNESSED_FIRED,
  GUIDE,
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

describe('tick(): the clock', () => {
  it('advances by meta.minutesPerTurn on a turn-consuming action (default 1)', () => {
    const state = baseState({ clock: { day: 1, minute: 600 } });
    const result = tick(FIXTURE_WORLD, state, { consumesTurn: true });
    expect(result.state.clock).toEqual({ day: 1, minute: 601 });
  });

  it('honors a non-default meta.minutesPerTurn', () => {
    const world: WorldDef = { ...FIXTURE_WORLD, meta: { ...FIXTURE_WORLD.meta, minutesPerTurn: 5 } };
    const state = baseState({ clock: { day: 1, minute: 600 } });
    const result = tick(world, state, { consumesTurn: true });
    expect(result.state.clock).toEqual({ day: 1, minute: 605 });
  });

  it('rolls over into the next day past minute 1439', () => {
    const state = baseState({ clock: { day: 1, minute: 1439 } });
    const result = tick(FIXTURE_WORLD, state, { consumesTurn: true });
    expect(result.state.clock).toEqual({ day: 2, minute: 0 });
  });

  it('meta verbs (consumesTurn: false) cost nothing — the clock does not move', () => {
    const state = baseState({ clock: { day: 1, minute: 600 } });
    const result = tick(FIXTURE_WORLD, state, { consumesTurn: false });
    expect(result.state.clock).toEqual({ day: 1, minute: 600 });
    expect(result.state).toBe(state); // full no-op: same reference, not just equal value
    expect(result.events).toEqual([]);
  });
});

describe('tick(): EventDef once semantics', () => {
  it('fires a matching event and records its id in firedEvents', () => {
    const state = baseState({ flags: { [FLAG_EVENT_TRIGGER]: true } });
    const result = tick(FIXTURE_WORLD, state, { consumesTurn: true });
    expect(result.state.flags[FLAG_EVENT_FIRED]).toBe(true);
    expect(result.state.firedEvents).toContain('fixture_event_once');
  });

  it('does not fire when its when cond does not hold', () => {
    const state = baseState();
    const result = tick(FIXTURE_WORLD, state, { consumesTurn: true });
    expect(result.state.flags[FLAG_EVENT_FIRED]).toBeUndefined();
    expect(result.state.firedEvents).not.toContain('fixture_event_once');
  });

  it('never fires again once recorded, even if when still holds', () => {
    const state = baseState({
      flags: { [FLAG_EVENT_TRIGGER]: true, [FLAG_EVENT_FIRED]: false },
      firedEvents: ['fixture_event_once'],
    });
    const result = tick(FIXTURE_WORLD, state, { consumesTurn: true });
    // effects never re-ran: FLAG_EVENT_FIRED stays exactly what the state already had
    expect(result.state.flags[FLAG_EVENT_FIRED]).toBe(false);
    expect(result.state.firedEvents).toEqual(['fixture_event_once']); // no duplicate id
  });

  it('a meta verb (consumesTurn: false) never evaluates events at all — a due event is not lost by checking the map twice', () => {
    const state = baseState({ flags: { [FLAG_EVENT_TRIGGER]: true } });
    const checkedMapTwice = tick(FIXTURE_WORLD, tick(FIXTURE_WORLD, state, { consumesTurn: false }).state, {
      consumesTurn: false,
    });
    expect(checkedMapTwice.state.firedEvents).not.toContain('fixture_event_once');

    // the event is still due the moment a real turn happens
    const realTurn = tick(FIXTURE_WORLD, checkedMapTwice.state, { consumesTurn: true });
    expect(realTurn.state.firedEvents).toContain('fixture_event_once');
    expect(realTurn.state.flags[FLAG_EVENT_FIRED]).toBe(true);
  });
});

describe('tick(): EventDef onlyIfWitnessed semantics', () => {
  it('defers while due but not witnessed, without consuming the once-only slot', () => {
    const state = baseState({ location: ROOM_A, flags: { [FLAG_WITNESS_TRIGGER]: true } });
    const result = tick(FIXTURE_WORLD, state, { consumesTurn: true });
    expect(result.state.flags[FLAG_WITNESSED_FIRED]).toBeUndefined();
    expect(result.state.firedEvents).not.toContain('fixture_event_witnessed');
  });

  it('fires the instant witnessedWhen also holds, even many turns after when first became true', () => {
    let state = baseState({ location: ROOM_A, flags: { [FLAG_WITNESS_TRIGGER]: true } });
    // several turns pass unwitnessed
    for (let i = 0; i < 3; i++) state = tick(FIXTURE_WORLD, state, { consumesTurn: true }).state;
    expect(state.firedEvents).not.toContain('fixture_event_witnessed');

    // the player walks into the witnessing room (ROOM_B) — witnessedWhen: { at: ROOM_B }
    state = { ...state, location: ROOM_B };
    const result = tick(FIXTURE_WORLD, state, { consumesTurn: true });
    expect(result.state.flags[FLAG_WITNESSED_FIRED]).toBe(true);
    expect(result.state.firedEvents).toContain('fixture_event_witnessed');
  });

  it('throws for an onlyIfWitnessed event with no witnessedWhen — a content-authoring bug, not a silent no-fire', () => {
    const broken: EventDef = { id: 'broken', when: { flag: FLAG_WITNESS_TRIGGER }, onlyIfWitnessed: true, effects: [] };
    const world: WorldDef = { ...FIXTURE_WORLD, events: { ...FIXTURE_WORLD.events, broken } };
    const state = baseState({ flags: { [FLAG_WITNESS_TRIGGER]: true } });
    expect(() => tick(world, state, { consumesTurn: true })).toThrow(/witnessedWhen/);
  });

  it('a foreclosing event announces itself the moment it fires, via an ordinary say effect', () => {
    const foreclosure: EventDef = {
      id: 'fixture_train_missed',
      when: { flag: FLAG_EVENT_TRIGGER },
      effects: [{ say: 'By the time you reach the platform, the train is a smell of diesel and a dot.' }],
    };
    const world: WorldDef = { ...FIXTURE_WORLD, events: { ...FIXTURE_WORLD.events, fixture_train_missed: foreclosure } };
    const state = baseState({ flags: { [FLAG_EVENT_TRIGGER]: true } });
    const result = tick(world, state, { consumesTurn: true });
    expect(result.state.firedEvents).toContain('fixture_train_missed');
    expect(result.events).toContainEqual({
      type: 'line',
      kind: 'prose',
      text: 'By the time you reach the platform, the train is a smell of diesel and a dot.',
    });
  });
});

describe('tick(): schedule-derived NPC position', () => {
  it('derives from the schedule when no overlay pins or follows', () => {
    // JACK/MARA/RIVER declare no `schedule` at all, so they derive
    // 'offstage' (cond.ts's `scheduledRoom`: no rules ⇒ offstage) — only
    // GUIDE's position varies by phase below.
    const morning = baseState({ clock: { day: 1, minute: 400 } }); // morning window
    expect(deriveNpcPositions(FIXTURE_WORLD, morning)[GUIDE]).toBe(ROOM_B);

    const night = baseState({ clock: { day: 1, minute: 1350 } }); // night window
    expect(deriveNpcPositions(FIXTURE_WORLD, night)[GUIDE]).toBe('offstage');

    const afternoon = baseState({ clock: { day: 1, minute: 800 } }); // unconditional fallback rule
    expect(deriveNpcPositions(FIXTURE_WORLD, afternoon)[GUIDE]).toBe(ROOM_C);
  });

  it('a pin (moveNpc) overrides the schedule until explicitly unpinned', () => {
    const morning = baseState({ clock: { day: 1, minute: 400 } }); // schedule says ROOM_B
    const pinned = apply(FIXTURE_WORLD, morning, [{ moveNpc: [GUIDE, ROOM_A] }]).state;
    expect(npcRoom(FIXTURE_WORLD, pinned, GUIDE)).toBe(ROOM_A);

    const unpinned = apply(FIXTURE_WORLD, pinned, [{ moveNpc: [GUIDE, 'schedule'] }]).state;
    expect(npcRoom(FIXTURE_WORLD, unpinned, GUIDE)).toBe(ROOM_B); // back to deriving from the schedule
  });

  it('pinning offstage overrides the schedule too', () => {
    const morning = baseState({ clock: { day: 1, minute: 400 } });
    const pinned = apply(FIXTURE_WORLD, morning, [{ moveNpc: [GUIDE, 'offstage'] }]).state;
    expect(npcRoom(FIXTURE_WORLD, pinned, GUIDE)).toBe('offstage');
  });

  it('following overrides both pin and schedule, and tracks the player across turns (GO TO-style multi-room travel)', () => {
    let state = baseState({ location: ROOM_A, clock: { day: 1, minute: 400 } }); // schedule would say ROOM_B
    state = apply(FIXTURE_WORLD, state, [{ moveNpc: [GUIDE, ROOM_C] }, { setFollowing: [GUIDE, true] }]).state;
    expect(npcRoom(FIXTURE_WORLD, state, GUIDE)).toBe(ROOM_A); // following wins over the ROOM_C pin

    // GO TO moves the player one room per turn; the follower comes along each step
    state = apply(FIXTURE_WORLD, state, [{ goto: ROOM_B }]).state;
    expect(npcRoom(FIXTURE_WORLD, state, GUIDE)).toBe(ROOM_B);

    state = apply(FIXTURE_WORLD, state, [{ goto: ROOM_C }]).state;
    expect(npcRoom(FIXTURE_WORLD, state, GUIDE)).toBe(ROOM_C);

    // setFollowing off drops back to the (still-active) pin, not the schedule
    state = apply(FIXTURE_WORLD, state, [{ setFollowing: [GUIDE, false] }]).state;
    expect(npcRoom(FIXTURE_WORLD, state, GUIDE)).toBe(ROOM_C);
  });

  it('deriveNpcPositions reflects an npcAt Cond read through evaluate(), not a separately-maintained value', () => {
    const state = apply(FIXTURE_WORLD, baseState({ clock: { day: 1, minute: 400 } }), [
      { setFollowing: [GUIDE, true] },
    ]).state;
    const positions = deriveNpcPositions(FIXTURE_WORLD, state);
    expect(positions[GUIDE]).toBe(state.location);
    expect(evaluate(FIXTURE_WORLD, state, { npcAt: [GUIDE, state.location] })).toBe(true);
  });
});
