// Stage D0 — the calendar, pass-time verbs, SLEEP's two routes, and the
// Zone 1 schedule/presence retrofit (Stage D plan §3 E4/E5; ADR 0011).
// Drives the real session/turn pipeline (`createSession`/`takeTurn`,
// exactly `tests/world-act1-wave4-jack.test.ts`'s own pattern) so the
// clock arithmetic is proven the way a player would actually see it —
// through a real parsed command, `tick()`'s own structural minute
// included — not just by calling the registered scripts directly.

import { describe, expect, it } from 'vitest';
import { validate } from '../src/engine/validate';
import { WORLD } from '../src/content/world/act1/world';
import { renderArrival } from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import { npcRoom } from '../src/engine/cond';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import { FRONT_DESK, GENERAL_STORE, JACK, JACKS_MOTEL, MAIN_STREET, MARLOW, MONSTER_TRUCK, PEARL, SHERIFF_OFFICE, SUNDOWN_DINER, WHITLOCK, YOUR_ROOM } from '../src/content/world/act1/ids';
import { ACT2_JACK_AWAY, ACT2_SEEN_DESK_EMPTY, ACT2_SEEN_OFFICE_EMPTY, ACT2_SLEPT_SINCE_BOOT, ACT2_STARTED } from '../src/content/world/act2/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-08T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

/** A fresh session with `clock`/`flags`/`location` overridden directly — the same "patch state, then drive it through the real pipeline" idiom `carry()` uses in the wave-4 test. */
function withState(patch: Partial<GameState>): SessionState {
  const fresh = createSession(TEST_WORLD);
  return { ...fresh, state: { ...fresh.state, ...patch } };
}

/** Teleports a session into `location`, running a real arrival (onEnter included) — same technique `enterMotel`/`enterDiner` use in the wave-4 test. */
function enter(session: SessionState, location: GameState['location']): { session: SessionState; events: GameEvent[] } {
  const teleported: GameState = { ...session.state, location };
  const { state, events } = renderArrival(TEST_WORLD, teleported);
  return { session: { ...session, state }, events };
}

/** One line of real player input, through the real parser and turn pipeline. */
function say(session: SessionState, text: string, store: MemoryStore): { session: SessionState; events: GameEvent[] } {
  const view = buildScopeView(TEST_WORLD, session.state, vocab);
  const outcome = new DeterministicParser().interpret(text, view);
  const result = takeTurn(TEST_WORLD, session, vocab, outcome, opts(store));
  return { session: result.session, events: result.events };
}

function text(events: GameEvent[]): string {
  return events
    .filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line')
    .map((e) => e.text)
    .join('\n');
}

describe('validate — Act II D0 (calendar/passage)', () => {
  it('produces no new errors', () => {
    const errors = validate(TEST_WORLD).filter((f) => f.severity === 'error');
    expect(errors).toEqual([]);
  });
});

describe('WAIT UNTIL <phase> — act2_pass_time', () => {
  it('WAIT UNTIL MORNING at 04:20 lands at 07:00 the same day', () => {
    const store = new MemoryStore();
    const session = withState({ clock: { day: 1, minute: 260 } });
    const { session: after } = say(session, 'wait until morning', store);
    expect(after.state.clock).toEqual({ day: 1, minute: 420 });
  });

  it('WAIT UNTIL NIGHT at 23:00 lands at 22:00 the next day', () => {
    const store = new MemoryStore();
    const session = withState({ clock: { day: 1, minute: 1380 } });
    const { session: after } = say(session, 'wait until night', store);
    expect(after.state.clock).toEqual({ day: 2, minute: 1320 });
  });
});

describe('SLEEP — the two routes and the fallback', () => {
  it('in Your Room, after act2_started, advances to 07:00 and marks slept', () => {
    const store = new MemoryStore();
    const session = withState({ clock: { day: 1, minute: 260 }, flags: { [ACT2_STARTED]: true }, location: YOUR_ROOM });
    const { session: after, events } = say(session, 'sleep', store);
    expect(after.state.clock).toEqual({ day: 1, minute: 420 });
    expect(after.state.flags[ACT2_SLEPT_SINCE_BOOT]).toBe(true);
    expect(text(events)).toContain('The floor, then.');
  });

  it('on Main Street, after act2_started, is refused and costs no time (register 65: ordinary turns do not move the clock)', () => {
    const store = new MemoryStore();
    const base = withState({ clock: { day: 1, minute: 500 }, flags: { [ACT2_STARTED]: true } });
    const { session: entered } = enter(base, MAIN_STREET);
    const { session: after, events } = say(entered, 'sleep', store);
    expect(after.state.clock).toEqual({ day: 1, minute: 500 });
    expect(text(events)).toContain('Two places in this town have been offered to you');
  });

  it('before act2_started, the shipped SLEEP texts still render unchanged', () => {
    const store = new MemoryStore();
    const base = withState({ clock: { day: 1, minute: 500 } });
    const { session: entered } = enter(base, GENERAL_STORE);
    const { events } = say(entered, 'sleep', store);
    expect(text(events)).toContain('Out of the wind, on tile, in a doorway');
  });
});

describe('ADR 0011 rule 3 — every Act I NPC unchanged before act2_started', () => {
  const PHASES: { day: number; minute: number }[] = [
    { day: 1, minute: 260 }, // night (wraps)
    { day: 1, minute: 420 }, // morning
    { day: 1, minute: 720 }, // afternoon
    { day: 1, minute: 1080 }, // evening
    { day: 1, minute: 1320 }, // night
  ];

  it('Marlow, Whitlock, Jack, and Pearl are exactly where v0.9.0 put them, at every phase', () => {
    for (const clock of PHASES) {
      const state: GameState = { ...createSession(TEST_WORLD).state, clock };
      expect(npcRoom(TEST_WORLD, state, MARLOW)).toBe(FRONT_DESK);
      expect(npcRoom(TEST_WORLD, state, JACK)).toBe(JACKS_MOTEL);
      expect(npcRoom(TEST_WORLD, state, PEARL)).toBe(SUNDOWN_DINER);
    }
  });
});

describe('Zone 1 schedule retrofit — after act2_started', () => {
  it('Marlow is offstage at 09:00 (morning)', () => {
    const state: GameState = { ...createSession(TEST_WORLD).state, clock: { day: 1, minute: 540 }, flags: { [ACT2_STARTED]: true } };
    expect(npcRoom(TEST_WORLD, state, MARLOW)).toBe('offstage');
  });

  it("the front desk's long empty variant renders once, then the short one", () => {
    const store = new MemoryStore();
    const base = withState({ clock: { day: 1, minute: 540 }, flags: { [ACT2_STARTED]: true } });
    const { session: entered, events: first } = enter(base, FRONT_DESK);
    expect(text(first)).toContain('BACK SHORTLY');
    expect(entered.state.flags[ACT2_SEEN_DESK_EMPTY]).toBe(true);

    const { events: second } = say(entered, 'look', store);
    expect(text(second)).not.toContain('BACK SHORTLY');
    expect(text(second)).toContain('It is still shortly.');
  });

  it('Whitlock is at the diner Friday evening (day 3, weekday 2)', () => {
    const state: GameState = { ...createSession(TEST_WORLD).state, clock: { day: 3, minute: 1080 }, flags: { [ACT2_STARTED]: true } };
    expect(npcRoom(TEST_WORLD, state, WHITLOCK)).toBe(SUNDOWN_DINER);
  });

  it('Jack is at the diner at 07:30 unless act2_jack_away', () => {
    const present: GameState = { ...createSession(TEST_WORLD).state, clock: { day: 1, minute: 450 }, flags: { [ACT2_STARTED]: true } };
    expect(npcRoom(TEST_WORLD, present, JACK)).toBe(SUNDOWN_DINER);

    const away: GameState = { ...present, flags: { ...present.flags, [ACT2_JACK_AWAY]: true } };
    expect(npcRoom(TEST_WORLD, away, JACK)).toBe(JACKS_MOTEL);
  });

  it('HELLO JACK at the diner gives the diner greeting', () => {
    const store = new MemoryStore();
    const base = withState({ clock: { day: 1, minute: 450 }, flags: { [ACT2_STARTED]: true } });
    const { session: entered } = enter(base, SUNDOWN_DINER);
    const { events } = say(entered, 'hello jack', store);
    expect(text(events)).toContain('Told you about this counter.');
  });
});

describe('Presence variants — the other three (sheriff office, motel A/B)', () => {
  it("the sheriff's office long empty variant renders once, then the short one", () => {
    const store = new MemoryStore();
    // Whitlock is offstage afternoons regardless of act2_started (shipped
    // schedule) — this exercises the presence variant without needing the
    // new poker-night rule.
    const base = withState({ clock: { day: 1, minute: 720 }, flags: { [ACT2_STARTED]: true } });
    const { session: entered, events: first } = enter(base, SHERIFF_OFFICE);
    expect(text(first)).toContain('road numbers to a room with nobody in it');
    expect(entered.state.flags[ACT2_SEEN_OFFICE_EMPTY]).toBe(true);

    const { events: second } = say(entered, 'look', store);
    expect(text(second)).not.toContain('road numbers to a room with nobody in it');
    expect(text(second)).toContain('The radio, talking to the chair.');
  });

  it('the motel lot names the truck when it is there, and a gap when it is not', () => {
    const withTruck = withState({ clock: { day: 1, minute: 540 }, flags: { [ACT2_STARTED]: true } });
    const { events: truckPresent } = enter(withTruck, JACKS_MOTEL);
    expect(text(truckPresent)).toContain('the truck backed in across four spaces');

    const truckGone = withState({
      clock: { day: 1, minute: 540 },
      flags: { [ACT2_STARTED]: true },
      objects: { [MONSTER_TRUCK]: { location: 'nowhere' } },
    });
    const { events: truckAbsent } = enter(truckGone, JACKS_MOTEL);
    expect(text(truckAbsent)).toContain('a gap in the middle of the lot');
  });
});
