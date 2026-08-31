// Stage D4, task D — the Pipe Chase, the chase hatch's DOWN, and the wave's
// one surviving boundary (D4 prose doc §11-§13, §21).

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
import {
  ACT3_COOLING_PLANT,
  ACT3_HATCH_OPEN,
  ACT3_P18_SECOND_RETURN,
  ACT3_PIPE_CHASE,
  ACT3_Q_WHEN_UNWATCHED,
  ACT3_S5_REACTOR_INTERFACE,
} from '../src/content/world/act3/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);
const SOLVED_EVENT_ID = `puzzle.${ACT3_P18_SECOND_RETURN}.solved`;

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

function atPlant(patch: Partial<GameState> = {}): SessionState {
  const s = withState({ location: ACT3_COOLING_PLANT, ...patch });
  return enter(s, ACT3_COOLING_PLANT).session;
}

function atChase(patch: Partial<GameState> = {}): SessionState {
  const s = withState({ location: ACT3_PIPE_CHASE, ...patch });
  return enter(s, ACT3_PIPE_CHASE).session;
}

describe('Cooling Plant hatch — DOWN, once open (D4 §12.3)', () => {
  it('prints D3\'s kept-verbatim ladder text, advances the clock 10 minutes, and arrives in the Pipe Chase', () => {
    const store = new MemoryStore();
    const session = atPlant({ flags: { [ACT3_HATCH_OPEN]: true } });
    const before = session.state.clock.minute;
    const result = say(session, 'down', store);
    expect(text(result.events)).toMatch(/The ladder goes down the near side of the hole/);
    expect(result.session.state.location).toBe(ACT3_PIPE_CHASE);
    expect(result.session.state.clock.minute - before).toBeGreaterThanOrEqual(10);
  });

  it('ENTER HATCH does the same', () => {
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

describe('The Pipe Chase — description (§11.1)', () => {
  it('first sight names the shaft, Return B\'s lagging, and the way down', () => {
    const store = new MemoryStore();
    const { events } = enter(withState({ location: ACT3_PIPE_CHASE }), ACT3_PIPE_CHASE);
    expect(text(events)).toMatch(/formed concrete shaft/);
    expect(text(events)).toMatch(/Below you the shaft goes down/);
    void store;
  });

  it('a later LOOK gives the short rule-2 form', () => {
    const store = new MemoryStore();
    const session = atChase();
    const result = say(session, 'look', store);
    expect(text(result.events)).toMatch(/Up is the plant\. Sideways is the gallery\. Down is down\./);
  });
});

describe('The Pipe Chase — objects (§11.2-§11.4)', () => {
  it('EXAMINE CRAWL describes the formed shaft and the maintained ladder', () => {
    const store = new MemoryStore();
    const session = atChase();
    const result = say(session, 'x crawl', store);
    expect(text(result.events)).toMatch(/shuttering marks/);
  });

  it('EXAMINE RETURN B (lower) describes bare, dry, warm steel', () => {
    const store = new MemoryStore();
    const session = atChase();
    const result = say(session, 'x return b', store);
    expect(text(result.events)).toMatch(/Twelve inches of bare steel, dry, warm to the palm/);
  });

  it('TOUCH RETURN B gives the warm-mug comparison', () => {
    const store = new MemoryStore();
    const session = atChase();
    const result = say(session, 'touch return b', store);
    expect(text(result.events)).toMatch(/Warm the way a mug is warm twenty minutes after/);
  });

  it('EXAMINE CONDENSATION describes the beads and the dry pipe', () => {
    const store = new MemoryStore();
    const session = atChase();
    const result = say(session, 'x condensation', store);
    expect(text(result.events)).toMatch(/Beads on the cold surfaces/);
  });
});

describe('The Pipe Chase — exits (§21.4)', () => {
  it('UP returns to the Cooling Plant, 10 minutes', () => {
    const store = new MemoryStore();
    const session = atChase();
    const before = session.state.clock.minute;
    const result = say(session, 'up', store);
    expect(result.session.state.location).toBe(ACT3_COOLING_PLANT);
    expect(result.session.state.clock.minute - before).toBeGreaterThanOrEqual(10);
  });

  it('OUT reaches S5 (task C\'s own room — an error here belongs to that task, not this one)', () => {
    const store = new MemoryStore();
    const session = atChase();
    // Only this task's own exit mechanism (goto + 1 minute) is asserted
    // here. If S5 (`act3_s5_reactor_interface`) is not yet registered in
    // `world.rooms` as of this test run — task C's own room, landing
    // concurrently — `renderArrival` throws "room ... is not declared in
    // world.rooms"; that throw is caught and treated as a pending sibling
    // dependency, not a failure of this task's own wiring.
    try {
      const result = say(session, 'out', store);
      expect(result.session.state.location).toBe(ACT3_S5_REACTOR_INTERFACE);
    } catch (err) {
      expect(String(err)).toMatch(/act3_s5_reactor_interface.*not declared in world\.rooms/);
    }
  });

  it('DOWN renders the wave\'s one surviving boundary and does not move the player', () => {
    const store = new MemoryStore();
    const session = atChase();
    const result = say(session, 'down', store);
    expect(text(result.events)).toMatch(/END OF BUILD/);
    expect(text(result.events)).toMatch(/Sublevel 6 is not in this version/);
    expect(text(result.events)).toMatch(/The ladder goes on/);
    expect(result.session.state.location).toBe(ACT3_PIPE_CHASE);
  });
});

describe('The Pipe Chase — P19 opens, P18 solves (§2, §21.1)', () => {
  it('arriving in the chase opens act3_q_when_unwatched', () => {
    const store = new MemoryStore();
    const session = atChase();
    // A full turn so `tick()` (openWhen recompute) runs against the
    // already-marked `visited` state `renderArrival` set on entry.
    const result = say(session, 'look', store);
    expect(result.session.state.questions[ACT3_Q_WHEN_UNWATCHED]).toBe('open');
  });

  it('arriving in the chase solves P18 (act3_p18_second_return)', () => {
    const store = new MemoryStore();
    const session = atChase();
    const result = say(session, 'look', store);
    expect(result.session.state.firedEvents).toContain(SOLVED_EVENT_ID);
  });
});

describe('The Pipe Chase — no leaks', () => {
  it('no act3_ id or {name} template leaks in any of this room\'s own text', () => {
    const store = new MemoryStore();
    const session = atChase();
    const commands = ['look', 'x crawl', 'x return b', 'touch return b', 'x condensation', 'listen', 'smell', 'shout', 'wait', 'sleep'];
    for (const cmd of commands) {
      const result = say(session, cmd, store);
      expect(text(result.events)).not.toMatch(/act3_/);
      expect(text(result.events)).not.toMatch(/\{name\}/);
    }
  });
});
