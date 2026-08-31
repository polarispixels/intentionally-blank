// Stage F wiring wave B (act5 scope) — five sweep fixes:
//   2. the `INITIALIZE?` "no" text (supersedes E3 §31.1, register 151,
//      `docs/superpowers/specs/2026-09-21-stage-f2-prose.md` §5).
//   3. "SEARCH INDEX FOR DAD"/"FOR FATHER" reach the shipped
//      `INDEX_SEARCH_OTHER` text.
//   4. `CLIMB LADDER`/bare `CLIMB` at the Root Shaft descend, the same one
//      hop `DOWN`/`CLIMB DOWN` already make.
//   6. `X SNAPSHOT` reaches the shipped ledger field line before
//      `act5_jules_woken`, and the §24.4 repeat text after.
//   7. the locker's SEARCH/LOOK IN listing gets a system-kind chrome
//      header, `IN THE CABINET:`, above the named contents.
// (Item 5, "the other doors" double-`the` scenery, does not exist anywhere
// in `act5/**` — see this task's report — and is not covered here.)

import { describe, expect, it } from 'vitest';
import { validate } from '../src/engine/validate';
import { WORLD } from '../src/content/world/game';
import { apply } from '../src/engine/effects';
import { renderArrival } from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, respondToPrompt, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import {
  ACT5_BLANK_ROOM,
  ACT5_INITIALIZE_RESPOND_SCRIPT,
  ACT5_JULES_WOKEN,
  ACT5_LOCKER,
  ACT5_ROOT_ANTECHAMBER,
  ACT5_ROOT_SHAFT,
} from '../src/content/world/act5/ids';
import { ACT2_NOTEBOOK } from '../src/content/world/act2/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-20T04:00:00.000Z', gameVersion: 'test-0.0.0' };
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

function atRootShaft(patch: Partial<GameState> = {}): SessionState {
  const base = withState(patch);
  const { session } = enter(base, ACT5_ROOT_SHAFT);
  return session;
}

function atBlankRoom(patch: Partial<GameState> = {}): SessionState {
  const base = withState(patch);
  const { session } = enter(base, ACT5_BLANK_ROOM);
  return session;
}

describe('validate — Stage F wiring wave B', () => {
  it('produces no NEW errors', () => {
    expect(validate(TEST_WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

describe('item 2 — INITIALIZE? "no" (supersedes E3 §31.1, register 151)', () => {
  it('drops the retired "with everything you put in it still in it" clause', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const result = respondToPrompt(TEST_WORLD, session, ACT5_INITIALIZE_RESPOND_SCRIPT, { answer: 'no' }, opts(store));
    const rendered = text(result.events);
    expect(rendered).not.toMatch(/with everything you put in it still in it/);
    expect(rendered).toMatch(/nothing about it presses you/);
    expect(rendered).toMatch(/courtesy than any machine/);
    expect(rendered).toMatch(/Nothing down here is going anywhere\./);
  });
});

describe('item 3 — SEARCH INDEX FOR DAD / FOR FATHER', () => {
  it('reaches the shipped INDEX_SEARCH_OTHER text', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const dad = say(session, 'search index for dad', store);
    expect(text(dad.events)).toMatch(/1 RESULT/);
    expect(text(dad.events)).toMatch(/the word that is in that field on/);

    const father = say(session, 'search index for father', store);
    expect(text(father.events)).toMatch(/1 RESULT/);
    expect(text(father.events)).toMatch(/the word that is in that field on/);
  });
});

describe('item 4 — CLIMB LADDER / bare CLIMB at the Root Shaft', () => {
  it('CLIMB LADDER descends, the same one hop as DOWN', () => {
    const session = atRootShaft();
    const store = new MemoryStore();
    const result = say(session, 'climb ladder', store);
    expect(text(result.events)).toMatch(/rungs go on being rungs for longer than you were expecting/);
    expect(result.session.state.location).toBe(ACT5_ROOT_ANTECHAMBER);
  });

  it('bare CLIMB (no dobj) also descends', () => {
    const session = atRootShaft();
    const store = new MemoryStore();
    const result = say(session, 'climb', store);
    expect(text(result.events)).toMatch(/rungs go on being rungs for longer than you were expecting/);
    expect(result.session.state.location).toBe(ACT5_ROOT_ANTECHAMBER);
  });

  it('CLIMB DOWN still works (unchanged)', () => {
    const session = atRootShaft();
    const store = new MemoryStore();
    const result = say(session, 'climb down', store);
    expect(text(result.events)).toMatch(/rungs go on being rungs for longer than you were expecting/);
    expect(result.session.state.location).toBe(ACT5_ROOT_ANTECHAMBER);
  });
});

describe('item 6 — X SNAPSHOT', () => {
  it('before act5_jules_woken: the ledger field line', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const result = say(session, 'x snapshot', store);
    expect(text(result.events)).toBe('    SNAPSHOT ......................... ARCHIVED / ROOT');
  });

  it('after act5_jules_woken: the §24.4 repeat text', () => {
    const session = atBlankRoom({ flags: { [ACT5_JULES_WOKEN]: true } });
    const store = new MemoryStore();
    const result = say(session, 'x snapshot', store);
    expect(text(result.events)).toMatch(/That is the field\. It was the field before you opened it/);
  });
});

describe('item 7 — the locker listing gets an "IN THE CABINET:" header', () => {
  it('non-empty: the header precedes each named item', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const moved = apply(TEST_WORLD, session.state, [{ move: [ACT2_NOTEBOOK, { in: ACT5_LOCKER }] }]);
    const result = say({ ...session, state: moved.state }, 'search locker', store);
    const rendered = text(result.events);
    expect(rendered).toMatch(/^IN THE CABINET:/);
    expect(rendered).toContain('notebook');
  });

  it('empty locker: unchanged generic, no header', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const result = say(session, 'search locker', store);
    expect(text(result.events)).not.toMatch(/IN THE CABINET:/);
  });
});
