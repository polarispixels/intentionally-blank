// Stage D3, task C — Corridor B4 (D3 prose doc §11–§12): the three
// measuring routes (P/K/C), the notebook's re-score, the panel/stencil,
// reader B4's rotation, and M7 firing on entry.

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
import { STRING_ITEM } from '../src/content/world/act1/ids';
import { ACT2_NOLAN_BADGE, ACT2_NOTEBOOK, ACT2_ORIGAMI_RULER } from '../src/content/world/act2/ids';
import {
  ACT3_B4_MEASURED,
  ACT3_CLUE_41_FEET,
  ACT3_CLUE_NOV_1983,
  ACT3_CORRIDOR_B4,
  ACT3_MEM_M7,
  ACT3_PANEL_OPEN,
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

function atB4(patch: Partial<GameState> = {}): SessionState {
  const s = withState({ location: ACT3_CORRIDOR_B4, ...patch });
  return enter(s, ACT3_CORRIDOR_B4).session;
}

describe('Corridor B4 — measuring routes (P17, R8)', () => {
  it('PACE CORRIDOR: first pass does not set the flag; second pass does, and grants R8, once', () => {
    const store = new MemoryStore();
    let session = atB4();
    const first = say(session, 'pace corridor', store);
    session = first.session;
    expect(session.state.flags[ACT3_B4_MEASURED]).not.toBe(true);
    expect(session.state.clues).not.toContain(ACT3_CLUE_41_FEET);

    const second = say(session, 'pace corridor', store);
    session = second.session;
    expect(session.state.flags[ACT3_B4_MEASURED]).toBe(true);
    expect(session.state.clues).toContain(ACT3_CLUE_41_FEET);

    const cluesAfterSecond = session.state.clues;
    const third = say(session, 'pace corridor', store);
    expect(third.session.state.clues).toEqual(cluesAfterSecond); // idempotent — no re-grant
  });

  it('MEASURE CORRIDOR WITH STRING sets the flag and grants R8, once', () => {
    const store = new MemoryStore();
    let session = atB4({ objects: { [STRING_ITEM]: { location: 'inventory' } } });
    const result = say(session, 'measure corridor with string', store);
    expect(result.session.state.flags[ACT3_B4_MEASURED]).toBe(true);
    expect(result.session.state.clues).toContain(ACT3_CLUE_41_FEET);
  });

  it('MEASURE CORRIDOR WITH RULER sets the flag and grants R8, once', () => {
    const store = new MemoryStore();
    const session = atB4({ objects: { [ACT2_ORIGAMI_RULER]: { location: 'inventory' } } });
    const result = say(session, 'measure corridor with ruler', store);
    expect(result.session.state.flags[ACT3_B4_MEASURED]).toBe(true);
    expect(result.session.state.clues).toContain(ACT3_CLUE_41_FEET);
  });

  it('COMPARE PLAN WITH NOTEBOOK, with the notebook held, answers', () => {
    const store = new MemoryStore();
    const session = atB4({ objects: { [ACT2_NOTEBOOK]: { location: 'inventory' } } });
    const result = say(session, 'compare plan with notebook', store);
    expect(text(result.events)).toMatch(/hundred and eighty feet/);
  });
});

describe('Corridor B4 — the notebook re-scored (§11.8)', () => {
  it('examine notebook reads differently once act3_b4_measured', () => {
    const store = new MemoryStore();
    const session = atB4({ objects: { [ACT2_NOTEBOOK]: { location: 'inventory' } }, flags: { [ACT3_B4_MEASURED]: true } });
    const result = say(session, 'examine notebook', store);
    expect(text(result.events)).toMatch(/Everything in it is true/);
  });

  it('examine notebook keeps the shipped text before act3_b4_measured', () => {
    const store = new MemoryStore();
    const session = atB4({ objects: { [ACT2_NOTEBOOK]: { location: 'inventory' } } });
    const result = say(session, 'examine notebook', store);
    expect(text(result.events)).not.toMatch(/Everything in it is true/);
  });
});

describe('Corridor B4 — the panel and the stencil (L9)', () => {
  it('REMOVE PANEL sets act3_panel_open and grants act3_clue_nov_1983', () => {
    const store = new MemoryStore();
    const session = atB4();
    const result = say(session, 'open access panel', store);
    expect(result.session.state.flags[ACT3_PANEL_OPEN]).toBe(true);
    expect(result.session.state.clues).toContain(ACT3_CLUE_NOV_1983);
    expect(text(result.events)).toMatch(/NOV 1983/);
  });
});

describe('Corridor B4 — reader B4 (§11.6, §18 q10): the first ask fails', () => {
  it('USE BADGE fails on the first ask and succeeds on the second', () => {
    const store = new MemoryStore();
    let session = atB4({ objects: { [ACT2_NOLAN_BADGE]: { location: 'inventory' } } });
    const first = say(session, 'use badge', store);
    expect(text(first.events)).toMatch(/does not let go/);
    session = first.session;
    const second = say(session, 'use badge', store);
    expect(text(second.events)).toMatch(/Green/);
  });
});

describe('Corridor B4 — M7 fires on entry', () => {
  it('grants act3_mem_m7 the first time the player enters', () => {
    const fresh = withState({});
    const { session } = enter(fresh, ACT3_CORRIDOR_B4);
    expect(session.state.memories).toContain(ACT3_MEM_M7);
  });
});

