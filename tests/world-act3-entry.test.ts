// Act III, Wave D3, task A — travel to the perimeter and P16's four routes
// in (`docs/superpowers/specs/2026-09-07-stage-d-plan.md` §2 D3;
// `docs/superpowers/specs/2026-09-11-stage-d3-prose.md` §3, §5). Same
// harness idiom as `tests/world-act2-travel.test.ts`: `act2Travel` called
// directly for beat/effect sequencing, the real session/turn pipeline for
// player-facing route behavior.

import { describe, expect, it } from 'vitest';
import { WORLD } from '../src/content/world/game';
import { act2Travel } from '../src/content/world/act2/travel';
import { renderArrival } from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import { validate } from '../src/engine/validate';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import { JACKS_MOTEL, MONSTER_TRUCK, WORK_ORDER } from '../src/content/world/act1/ids';
import { ACT2_NOLAN_BADGE, ACT2_Q_INSIDE_THE_PLANT, ACT2_STARTED } from '../src/content/world/act2/ids';
import {
  ACT3_ALERTNESS,
  ACT3_AT_PERIMETER,
  ACT3_CLUE_GATE_RHYTHM,
  ACT3_COOLING_PLANT,
  ACT3_FLAG_ENTERED_AS_VENDOR,
  ACT3_FLAG_TAILGATED,
  ACT3_HORSE_TIED,
  ACT3_INSIDE,
  ACT3_JACK_WILL_RAM,
  ACT3_LOBBY,
  ACT3_MEM_M20D,
  ACT3_P16_ENTRY,
  ACT3_PERIMETER_ROAD,
} from '../src/content/world/act3/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-09T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

function withState(patch: Partial<GameState>): SessionState {
  const fresh = createSession(TEST_WORLD);
  return { ...fresh, state: { ...fresh.state, ...patch, flags: { [ACT2_STARTED]: true, ...(patch.flags ?? {}) } } };
}

function say(session: SessionState, input: string, store: MemoryStore): { session: SessionState; events: GameEvent[] } {
  const view = buildScopeView(TEST_WORLD, session.state, vocab);
  const outcome = new DeterministicParser().interpret(input, view);
  const result = takeTurn(TEST_WORLD, session, vocab, outcome, opts(store));
  return { session: result.session, events: result.events };
}

function text(events: GameEvent[]): string {
  return events
    .filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line')
    .map((e) => e.text)
    .join('\n');
}

function beatCount(events: GameEvent[]): number {
  return events.filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line' && e.kind === 'beat').length;
}

// ---------------------------------------------------------------------------
// Travel — act2Travel called directly (§3).
// ---------------------------------------------------------------------------

describe('act2Travel — the perimeter, truck', () => {
  it('costs 30 minutes, pins Jack there, sets act3_at_perimeter, and renders the first-ride beats ("I\'ll be here")', () => {
    const base = createSession(TEST_WORLD).state;
    const state: GameState = { ...base, clock: { day: 1, minute: 260 }, location: JACKS_MOTEL, flags: { [ACT2_STARTED]: true } };
    const { state: after, events } = act2Travel(TEST_WORLD, state, { mode: 'truck', to: 'perimeter' });

    expect(after.clock).toEqual({ day: 1, minute: 290 });
    expect(after.flags[ACT3_AT_PERIMETER]).toBe(true);
    expect(after.location).toBe(ACT3_PERIMETER_ROAD);
    expect(beatCount(events)).toBe(3);
    expect(text(events)).toContain("I'll be here");
  });

  it('a second truck trip (act3_at_perimeter already true) renders the shorter 1-beat scene', () => {
    const base = createSession(TEST_WORLD).state;
    const state: GameState = { ...base, clock: { day: 1, minute: 260 }, location: JACKS_MOTEL, flags: { [ACT2_STARTED]: true, [ACT3_AT_PERIMETER]: true } };
    const { events } = act2Travel(TEST_WORLD, state, { mode: 'truck', to: 'perimeter' });
    expect(beatCount(events)).toBe(1);
    expect(text(events)).not.toContain("I'll be here");
  });
});

describe('act2Travel — the perimeter, horse', () => {
  it('costs 60 minutes and balks a mile short, tying the horse (act3_horse_tied)', () => {
    const base = createSession(TEST_WORLD).state;
    const state: GameState = { ...base, clock: { day: 1, minute: 260 }, flags: { [ACT2_STARTED]: true } };
    const { state: after, events } = act2Travel(TEST_WORLD, state, { mode: 'horse', to: 'perimeter' });

    expect(after.clock).toEqual({ day: 1, minute: 320 });
    expect(after.flags[ACT3_HORSE_TIED]).toBe(true);
    expect(after.location).toBe(ACT3_PERIMETER_ROAD);
    expect(text(events)).toContain('You tie it at the corner post');
  });
});

// ---------------------------------------------------------------------------
// P16 — the four routes in (§5).
// ---------------------------------------------------------------------------

describe('P16 — route (a), the badge', () => {
  it('USE BADGE, with the badge held, enters the Lobby and answers act2_q_inside_the_plant', () => {
    const store = new MemoryStore();
    const session = withState({
      location: ACT3_PERIMETER_ROAD,
      objects: { [ACT2_NOLAN_BADGE]: { location: 'inventory' } },
    });
    const { events, session: after } = say(session, 'use badge', store);
    expect(after.state.location).toBe(ACT3_LOBBY);
    expect(after.state.flags[ACT3_INSIDE]).toBe(true);
    expect(after.state.questions[ACT2_Q_INSIDE_THE_PLANT]).toBe('answered');
    expect(text(events)).toContain('NOLAN — GATE 1');
  });
});

describe('P16 — route (a\'), the tailgate', () => {
  it('FOLLOW NOLAN at 07:10, with Nolan present, tailgates into the Lobby', () => {
    const store = new MemoryStore();
    const session = withState({ location: ACT3_PERIMETER_ROAD, clock: { day: 2, minute: 430 } });
    const { events, session: after } = say(session, 'follow nolan', store);
    expect(after.state.location).toBe(ACT3_LOBBY);
    expect(after.state.flags[ACT3_FLAG_TAILGATED]).toBe(true);
    expect(text(events)).toContain('holding the door on the flat of his foot');
  });

  it('FOLLOW NOLAN at 08:00 (outside the tailgate window) is refused — Nolan is no longer there', () => {
    const store = new MemoryStore();
    const session = withState({ location: ACT3_PERIMETER_ROAD, clock: { day: 2, minute: 480 } });
    const { session: after } = say(session, 'follow nolan', store);
    expect(after.state.location).toBe(ACT3_PERIMETER_ROAD);
    expect(after.state.flags[ACT3_FLAG_TAILGATED]).not.toBe(true);
  });
});

describe('P16 — route (c), the fence', () => {
  it('RAM FENCE, with the truck present and Jack persuaded, sets alertness 1, fires M20-D, and arrives at the Cooling Plant', () => {
    const store = new MemoryStore();
    const session = withState({
      location: ACT3_PERIMETER_ROAD,
      flags: { [ACT3_JACK_WILL_RAM]: true },
      objects: { [MONSTER_TRUCK]: { location: ACT3_PERIMETER_ROAD } },
    });
    const { events, session: after } = say(session, 'ram fence', store);
    expect(after.state.flags[ACT3_ALERTNESS]).toBe(1);
    expect(after.state.memories).toContain(ACT3_MEM_M20D);
    expect(after.state.flags[ACT3_INSIDE]).toBe(true);
    expect(after.state.location).toBe(ACT3_COOLING_PLANT);
    expect(text(events)).toContain('"Huh," says Jack.');
  });

  it('RAM FENCE without persuasion (no act3_jack_will_ram, no M20-D) is refused', () => {
    const store = new MemoryStore();
    const session = withState({
      location: ACT3_PERIMETER_ROAD,
      objects: { [MONSTER_TRUCK]: { location: ACT3_PERIMETER_ROAD } },
    });
    const { events, session: after } = say(session, 'ram fence', store);
    expect(after.state.location).toBe(ACT3_PERIMETER_ROAD);
    expect(text(events)).toContain('Get me a reason.');
  });
});

describe('P16 — route (d), the manifest', () => {
  it('SIGN MANIFEST on a Tuesday morning, with the work order in hand, enters as a vendor', () => {
    const store = new MemoryStore();
    // day 7: weekday (7-1)%7 = 6 = tue (act2/calendar.ts's own WEEKDAY table).
    const session = withState({
      location: ACT3_PERIMETER_ROAD,
      clock: { day: 7, minute: 430 },
      objects: { [WORK_ORDER]: { location: 'inventory' } },
    });
    const { events, session: after } = say(session, 'sign manifest', store);
    expect(after.state.location).toBe(ACT3_LOBBY);
    expect(after.state.flags[ACT3_FLAG_ENTERED_AS_VENDOR]).toBe(true);
    expect(text(events)).toContain('opens the whole gate rather than the turnstile');
  });

  it('SIGN MANIFEST on a Wednesday (day 1) is refused — no clipboard on the nail', () => {
    const store = new MemoryStore();
    const session = withState({
      location: ACT3_PERIMETER_ROAD,
      clock: { day: 1, minute: 430 },
      objects: { [WORK_ORDER]: { location: 'inventory' } },
    });
    const { events, session: after } = say(session, 'sign manifest', store);
    expect(after.state.location).toBe(ACT3_PERIMETER_ROAD);
    expect(text(events)).toContain('There is no clipboard on the nail');
  });
});

// ---------------------------------------------------------------------------
// The light — WATCH grants the rhythm clue (§4.6).
// ---------------------------------------------------------------------------

describe('WATCH LIGHT', () => {
  it('grants act3_clue_gate_rhythm', () => {
    const store = new MemoryStore();
    const session = withState({ location: ACT3_PERIMETER_ROAD });
    const { session: after } = say(session, 'watch light', store);
    expect(after.state.clues).toContain(ACT3_CLUE_GATE_RHYTHM);
  });
});

// ---------------------------------------------------------------------------
// The arrival render itself must not throw (both destinations have real
// room content by the time this wave assembles).
// ---------------------------------------------------------------------------

describe('Arrival rendering', () => {
  it('renderArrival at the Lobby and the Cooling Plant both succeed', () => {
    const base = createSession(TEST_WORLD).state;
    expect(() => renderArrival(TEST_WORLD, { ...base, location: ACT3_LOBBY })).not.toThrow();
    expect(() => renderArrival(TEST_WORLD, { ...base, location: ACT3_COOLING_PLANT })).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// The validator — P16's clock-free-solution rule (§4.3.4/constitution §10).
// ---------------------------------------------------------------------------

describe('validate — act3_p16_entry', () => {
  it('has at least one clock-free solutions route (puzzle-no-clock-free-solution passes)', () => {
    const findings = validate(TEST_WORLD);
    const offenders = findings.filter((f) => f.code === 'puzzle-no-clock-free-solution' && f.message.includes(ACT3_P16_ENTRY));
    expect(offenders).toEqual([]);
  });
});

