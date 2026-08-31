// Stage D3, task C — the Cooling Plant and the freight elevator (D3 prose
// doc §10, §13, §15): Return B's warm touch, the drawing's compare route,
// the chase hatch by wrench and by leg, the empty-handed refusal, the
// hatch's DOWN once open, the yard door, and the elevator (call, enter,
// panel, blank, S1/S5's beats + boundary + clock, L).

import { describe, expect, it } from 'vitest';
import { WORLD } from '../src/content/world/game';
import { renderArrival } from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import { CHAIR_LEG } from '../src/content/world/act1/ids';
import {
  ACT3_CLUE_WARM_RETURN,
  ACT3_COOLING_PLANT,
  ACT3_ELEVATOR_CALLED,
  ACT3_HATCH_OPEN,
  ACT3_PIPE_CHASE,
  ACT3_PRESSED_BLANK,
  ACT3_Q_SECOND_RETURN,
  ACT3_S1_MECHANICAL_GALLERY,
  ACT3_S5_REACTOR_INTERFACE,
  ACT3_WRENCH,
} from '../src/content/world/act3/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-12T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

function withState(patch: Partial<GameState>): SessionState {
  const fresh = createSession(TEST_WORLD);
  return { ...fresh, state: { ...fresh.state, ...patch } };
}

function enter(session: SessionState, location: GameState['location']): { session: SessionState; events: GameEvent[] } {
  const teleported: GameState = { ...session.state, location };
  const { state, events } = renderArrival(TEST_WORLD, teleported);
  return { session: { ...session, state }, events };
}

function say(session: SessionState, textIn: string, store: MemoryStore): { session: SessionState; events: GameEvent[] } {
  const view = buildScopeView(TEST_WORLD, session.state, vocab);
  const outcome = new DeterministicParser().interpret(textIn, view);
  const result = takeTurn(TEST_WORLD, session, vocab, outcome, opts(store));
  return { session: result.session, events: result.events };
}

function text(events: GameEvent[]): string {
  return events
    .filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line')
    .map((e) => e.text)
    .join('\n');
}

function lineKinds(events: GameEvent[]): string[] {
  return events.filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line').map((e) => e.kind);
}

function atPlant(patch: Partial<GameState> = {}): SessionState {
  const s = withState({ location: ACT3_COOLING_PLANT, ...patch });
  return enter(s, ACT3_COOLING_PLANT).session;
}

describe('Cooling Plant — Return B (P18 surface half)', () => {
  it('TOUCH RETURN B grants the warm-return clue and opens the second-return question', () => {
    const store = new MemoryStore();
    const session = atPlant();
    const result = say(session, 'touch return b', store);
    expect(result.session.state.clues).toContain(ACT3_CLUE_WARM_RETURN);
    expect(result.session.state.questions[ACT3_Q_SECOND_RETURN]).toBe('open');
    expect(text(result.events)).toMatch(/Warm/);
  });

  it('COMPARE DRAWING WITH RETURN B grants the same clue', () => {
    const store = new MemoryStore();
    const session = atPlant();
    const result = say(session, 'compare drawing with return b', store);
    expect(result.session.state.clues).toContain(ACT3_CLUE_WARM_RETURN);
  });
});

describe('Cooling Plant — the chase hatch', () => {
  it('refuses empty-handed', () => {
    const store = new MemoryStore();
    const session = atPlant();
    const result = say(session, 'open hatch', store);
    expect(result.session.state.flags[ACT3_HATCH_OPEN]).not.toBe(true);
    expect(text(result.events)).toMatch(/hands are the one/);
  });

  it('opens with the wrench (UNBOLT)', () => {
    const store = new MemoryStore();
    const session = atPlant({ objects: { [ACT3_WRENCH]: { location: 'inventory' } } });
    const result = say(session, 'unbolt hatch', store);
    expect(result.session.state.flags[ACT3_HATCH_OPEN]).toBe(true);
  });

  it('opens with the chair leg (PRY)', () => {
    const store = new MemoryStore();
    const session = atPlant({ objects: { [CHAIR_LEG]: { location: 'inventory' } } });
    const result = say(session, 'pry hatch', store);
    expect(result.session.state.flags[ACT3_HATCH_OPEN]).toBe(true);
  });

  // D4 task D amendment (D4 prose doc §12.3/§21.1): D3's own boundary on
  // this exit is retired — DOWN/ENTER HATCH now really lead to the Pipe
  // Chase, keeping D3's in-world ladder text verbatim. These two tests
  // updated to match (they asserted the old boundary behaviour); the wave's
  // one surviving boundary is exercised in `tests/world-act3-d4-chase.test.ts`.
  it('DOWN, once open, prints D3\'s kept-verbatim ladder text and arrives in the Pipe Chase', () => {
    const store = new MemoryStore();
    const session = atPlant({ flags: { [ACT3_HATCH_OPEN]: true } });
    const result = say(session, 'down', store);
    expect(text(result.events)).toMatch(/The ladder goes down the near side of the hole/);
    expect(result.session.state.location).toBe(ACT3_PIPE_CHASE);
  });

  it('ENTER HATCH, once open, does the same', () => {
    const store = new MemoryStore();
    const session = atPlant({ flags: { [ACT3_HATCH_OPEN]: true } });
    const result = say(session, 'enter hatch', store);
    expect(text(result.events)).toMatch(/The ladder goes down the near side of the hole/);
    expect(result.session.state.location).toBe(ACT3_PIPE_CHASE);
  });

  it('DOWN before the hatch is open does not reach the Pipe Chase', () => {
    const store = new MemoryStore();
    const session = atPlant();
    const result = say(session, 'down', store);
    expect(result.session.state.location).toBe(ACT3_COOLING_PLANT);
  });
});

describe('Cooling Plant — the yard door', () => {
  it('OUT leaves toward the perimeter', () => {
    const store = new MemoryStore();
    const session = atPlant();
    const result = say(session, 'out', store);
    expect(text(result.events)).toMatch(/apron/);
  });
});

describe('The freight elevator (§13)', () => {
  it('CALL ELEVATOR sets act3_elevator_called', () => {
    const store = new MemoryStore();
    const session = atPlant();
    const result = say(session, 'call elevator', store);
    expect(result.session.state.flags[ACT3_ELEVATOR_CALLED]).toBe(true);
  });

  it('ENTER LIFT describes the car', () => {
    const store = new MemoryStore();
    const session = atPlant();
    const result = say(session, 'enter lift', store);
    expect(text(result.events)).toMatch(/quilted pads/);
  });

  it('EXAMINE PANEL describes L/S1/S5 and the blank', () => {
    const store = new MemoryStore();
    const session = atPlant();
    const result = say(session, 'examine panel', store);
    expect(text(result.events)).toMatch(/S1/);
    expect(text(result.events)).toMatch(/S5/);
  });

  it('PRESS BLANK sets act3_pressed_blank', () => {
    const store = new MemoryStore();
    const session = atPlant();
    const result = say(session, 'press blank', store);
    expect(result.session.state.flags[ACT3_PRESSED_BLANK]).toBe(true);
  });

  // D4 task B amendment (D4 prose doc §12.1/§21.1): S1 and S5 are real
  // destinations now, each with its own beat 4 — D3's boundary tail is
  // retired for this script (`act3/scripts.ts`'s `act3ElevatorRide`).
  it('PRESS S1 plays three beats plus its own beat 4, advances the clock by 3, and actually moves the player to S1', () => {
    const store = new MemoryStore();
    const session = atPlant();
    const before = session.state.clock.minute;
    const result = say(session, 'press s1', store);
    expect(lineKinds(result.events).filter((k) => k === 'beat')).toHaveLength(4);
    expect(text(result.events)).toMatch(/gallery lit like an office/);
    expect(result.session.state.location).toBe(ACT3_S1_MECHANICAL_GALLERY);
    expect(result.session.state.clock.minute - before).toBeGreaterThanOrEqual(3);
  });

  it('PRESS S5 also plays the ride plus its own beat 4, and actually moves the player to S5', () => {
    const store = new MemoryStore();
    const session = atPlant();
    const result = say(session, 'press s5', store);
    expect(text(result.events)).toMatch(/leaves go back on quiet/);
    expect(result.session.state.location).toBe(ACT3_S5_REACTOR_INTERFACE);
  });

  it('PRESS L is polite about already being at L', () => {
    const store = new MemoryStore();
    const session = atPlant();
    const result = say(session, 'press l', store);
    expect(text(result.events)).toMatch(/being polite about it/);
  });
});

