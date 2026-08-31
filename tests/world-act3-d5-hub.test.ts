// Stage D5, task G — the S6 Archive Hub: the terminal/login, the ledger
// (R10), the load graph (R11), the queue (R12), the gate frames, the root
// door, and the Act III boundary (D5 prose doc §21-§31, §39, §40).

import { describe, expect, it } from 'vitest';
import { validate } from '../src/engine/validate';
import { WORLD } from '../src/content/world/game';
import { renderArrival } from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, respondToPrompt, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import {
  ACT3_CLUE_GATES,
  ACT3_CLUE_JULES_DEPRECATED,
  ACT3_CLUE_REACQUIRE,
  ACT3_CLUE_ROOT_REFUSES,
  ACT3_CLUE_TOWN_RUNS_HERE,
  ACT3_GATE_FRAMES,
  ACT3_HUB_LOGGED_IN,
  ACT3_HUB_LOGIN_PROMPT_ID,
  ACT3_HUB_LOGIN_SCRIPT,
  ACT3_KNOWS_WHO_HIT_YOU,
  ACT3_LEDGER,
  ACT3_LEDGER_SEARCH_PROMPT_ID,
  ACT3_LEDGER_SEARCH_RESPOND_SCRIPT,
  ACT3_LOAD_GRAPH,
  ACT3_MEM_M16_A,
  ACT3_MEM_M16_D,
  ACT3_MEM_M16_S,
  ACT3_P20_LEDGER,
  ACT3_Q_ARCHIVE_TERMINAL,
  ACT3_Q_WHAT_ARE_THESE_PEOPLE,
  ACT3_Q_WHAT_HAPPENED_TO_JULES,
  ACT3_Q_WHO_HIT_YOU,
  ACT3_QUEUE,
  ACT3_ROOT_DOOR,
  ACT3_S6_ARCHIVE_HUB,
  ACT3_S6_MAINTENANCE_BAY,
} from '../src/content/world/act3/ids';
import { ACT2_DAD_BOOTED, ACT2_NOLAN_BADGE, ACT2_NOTEBOOK, ACT2_REPLY_AUDIT, ACT2_STARTED, ACT2_USB } from '../src/content/world/act2/ids';
import { evaluate } from '../src/engine/cond';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-13T04:00:00.000Z', gameVersion: 'test-0.0.0' };
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

function loggedInAtHub(patch: Partial<GameState> = {}): SessionState {
  const base = withState({
    ...patch,
    flags: { [ACT3_HUB_LOGGED_IN]: true, ...(patch.flags ?? {}) },
    objects: {
      [ACT3_LEDGER]: { location: ACT3_S6_ARCHIVE_HUB, hidden: false },
      [ACT3_LOAD_GRAPH]: { location: ACT3_S6_ARCHIVE_HUB, hidden: false },
      [ACT3_QUEUE]: { location: ACT3_S6_ARCHIVE_HUB, hidden: false },
      ...(patch.objects ?? {}),
    },
  });
  const { session } = enter(base, ACT3_S6_ARCHIVE_HUB);
  return session;
}

describe('validate — Stage D5, task G (the S6 Archive Hub)', () => {
  it('produces no errors', () => {
    expect(validate(TEST_WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

describe('the Hub — description', () => {
  it('first sight (the very first arrival), not logged in', () => {
    const { events } = enter(withState({}), ACT3_S6_ARCHIVE_HUB);
    expect(text(events)).toMatch(/carpet/);
    expect(text(events)).toMatch(/heaviest thing you have seen/);
  });

  it('a later LOOK, still not logged in, shows the USER: prompt', () => {
    const { session } = enter(withState({}), ACT3_S6_ARCHIVE_HUB);
    const store = new MemoryStore();
    const { events } = say(session, 'look', store);
    expect(text(events)).toMatch(/USER:/);
  });
});

describe('READ LEDGER before login', () => {
  it('is an ordinary unknown-noun response, not a teasing refusal', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT3_S6_ARCHIVE_HUB);
    const { events } = say(session, 'read ledger', store);
    const rendered = text(events);
    expect(rendered).not.toMatch(/SUBJECT LEDGER/);
    expect(rendered.toLowerCase()).toMatch(/nothing in the room admits to being it|admits to being it/);
  });
});

describe('LOG IN — the prompt round trip', () => {
  it('opens a two-field prompt (user, password)', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT3_S6_ARCHIVE_HUB);
    const { events } = say(session, 'log in', store);
    const prompt = events.find((e): e is Extract<GameEvent, { type: 'prompt' }> => e.type === 'prompt');
    expect(prompt).toBeDefined();
    expect(prompt!.id).toBe(ACT3_HUB_LOGIN_PROMPT_ID);
    expect(prompt!.fields.map((f) => f.name)).toEqual(['user', 'password']);
  });

  it('wrong credentials: fails, stays logged out, and closes the prompt (the player types LOG IN again)', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT3_S6_ARCHIVE_HUB);
    const failed = respondToPrompt(TEST_WORLD, session, ACT3_HUB_LOGIN_SCRIPT, { user: 'nobody', password: 'wrong' });
    expect(text(failed.events)).toMatch(/ACCESS LEVEL: NONE/);
    expect(failed.session.state.flags[ACT3_HUB_LOGGED_IN]).not.toBe(true);
    // v0.15.0 playtest: re-opening the prompt here swallowed every later command.
    expect(failed.events.some((e) => e.type === 'prompt')).toBe(false);
  });

  it('right credentials (case-insensitive): succeeds, sets the flag, reveals the ledger/graph/queue', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT3_S6_ARCHIVE_HUB);
    const solved = respondToPrompt(TEST_WORLD, session, ACT3_HUB_LOGIN_SCRIPT, { user: 'ADMIN', password: 'Admin-Password' });
    expect(text(solved.events)).toMatch(/ACCESS LEVEL: MAINTENANCE/);
    expect(solved.session.state.flags[ACT3_HUB_LOGGED_IN]).toBe(true);
    expect(solved.session.state.objects[ACT3_LEDGER]?.hidden).toBe(false);
    expect(solved.session.state.objects[ACT3_LOAD_GRAPH]?.hidden).toBe(false);
    expect(solved.session.state.objects[ACT3_QUEUE]?.hidden).toBe(false);
    void store;
  });
});

describe('the ledger — R10', () => {
  it('READ LEDGER shows the top of the list', () => {
    const store = new MemoryStore();
    const session = loggedInAtHub();
    const { events } = say(session, 'read ledger', store);
    expect(text(events)).toMatch(/SUBJECT LEDGER/);
    expect(text(events)).toMatch(/CURRENT/);
  });

  it('SEARCH LEDGER FOR JULES grants the clue, answers the Jules question and the archive question, and solves P20', () => {
    const store = new MemoryStore();
    // ACT2_STARTED true so `act3_q_what_happened_to_jules` is actually open
    // (`openWhen: { flag: ACT2_STARTED }`) before this turn answers it.
    const session = loggedInAtHub({ flags: { [ACT2_STARTED]: true } });
    const { session: after, events } = say(session, 'search ledger for jules', store);
    expect(text(events)).toMatch(/DEPRECATED/);
    expect(text(events)).toMatch(/Nobody took him anywhere/);
    expect(after.state.clues).toContain(ACT3_CLUE_JULES_DEPRECATED);
    expect(after.state.questions?.[ACT3_Q_WHAT_HAPPENED_TO_JULES]).toBe('answered');
    expect(after.state.questions?.[ACT3_Q_ARCHIVE_TERMINAL]).toBe('answered');
    const p20 = TEST_WORLD.puzzles![ACT3_P20_LEDGER]!;
    expect(evaluate(TEST_WORLD, after.state, p20.solvedWhen)).toBe(true);
  });

  it('SEARCH LEDGER FOR NOLAN declines to open the file', () => {
    const store = new MemoryStore();
    const session = loggedInAtHub();
    const { events } = say(session, 'search ledger for nolan', store);
    expect(text(events)).toMatch(/You do not open it/);
  });
});

describe('the load graph — R11', () => {
  it('READ GRAPH alone shows the curve with no unit', () => {
    const store = new MemoryStore();
    const session = loggedInAtHub();
    const { events } = say(session, 'read graph', store);
    expect(text(events)).toMatch(/ALLOCATION, ROLLING/);
    expect(text(events)).toMatch(/no unit anywhere/);
  });

  it('COMPARE AUDIT WITH GRAPH, holding the audit, grants the clue and opens the Act IV question', () => {
    const store = new MemoryStore();
    const session = loggedInAtHub({ objects: { [ACT2_REPLY_AUDIT]: { location: 'inventory' } } });
    const { session: after, events } = say(session, 'compare audit with graph', store);
    expect(text(events)).toMatch(/Four hundred and sixty/);
    expect(text(events)).toMatch(/460/);
    expect(after.state.clues).toContain(ACT3_CLUE_TOWN_RUNS_HERE);
    expect(after.state.questions?.[ACT3_Q_WHAT_ARE_THESE_PEOPLE]).toBe('open');
  });
});

describe('the queue — R12', () => {
  function withProfile(profile: { analytical: number; social: number; direct: number }): SessionState {
    return loggedInAtHub({ profile });
  }

  it('READ QUEUE grants the clue, sets the flag, and answers who-hit-you', () => {
    const store = new MemoryStore();
    const session = withProfile({ analytical: 0, social: 0, direct: 0 });
    const { session: after, events } = say(session, 'read queue', store);
    expect(text(events)).toMatch(/RECONCILIATION - PENDING/);
    expect(text(events)).toMatch(/Top floor, back/);
    expect(after.state.clues).toContain(ACT3_CLUE_REACQUIRE);
    expect(after.state.flags[ACT3_KNOWS_WHO_HIT_YOU]).toBe(true);
    expect(after.state.questions?.[ACT3_Q_WHO_HIT_YOU]).toBe('answered');
  });

  it('fires exactly M16-A for an analytical leader', () => {
    const store = new MemoryStore();
    const session = withProfile({ analytical: 5, social: 0, direct: 0 });
    const { session: after } = say(session, 'read queue', store);
    expect(after.state.memories).toContain(ACT3_MEM_M16_A);
    expect(after.state.memories).not.toContain(ACT3_MEM_M16_S);
    expect(after.state.memories).not.toContain(ACT3_MEM_M16_D);
  });

  it('fires exactly M16-D for a direct leader', () => {
    const store = new MemoryStore();
    const session = withProfile({ analytical: 0, social: 0, direct: 5 });
    const { session: after } = say(session, 'read queue', store);
    expect(after.state.memories).toContain(ACT3_MEM_M16_D);
    expect(after.state.memories).not.toContain(ACT3_MEM_M16_A);
    expect(after.state.memories).not.toContain(ACT3_MEM_M16_S);
  });

  it('fires exactly M16-S when no class leads (the default)', () => {
    const store = new MemoryStore();
    const session = withProfile({ analytical: 0, social: 0, direct: 0 });
    const { session: after } = say(session, 'read queue', store);
    expect(after.state.memories).toContain(ACT3_MEM_M16_S);
    expect(after.state.memories).not.toContain(ACT3_MEM_M16_A);
    expect(after.state.memories).not.toContain(ACT3_MEM_M16_D);
  });
});

describe('the gate frames and the boundary — ENTER GATE', () => {
  it('EXAMINE FRAMES describes the openings', () => {
    const store = new MemoryStore();
    const session = loggedInAtHub();
    const { events } = say(session, 'x frames', store);
    expect(text(events)).toMatch(/ESCAPE RM/);
    expect(text(events)).toMatch(/HAB/);
  });

  it('ENTER GATE prints the in-world line then the system line, and the player stays in the Hub', () => {
    const store = new MemoryStore();
    const session = loggedInAtHub();
    const { session: after, events } = say(session, 'enter gate', store);
    const rendered = text(events);
    expect(rendered).toMatch(/the\s+floor on the other side of it is a floor/);
    expect(rendered).toMatch(/END OF BUILD/);
    expect(rendered).toMatch(/Act III ends here/);
    expect(after.state.location).toBe(ACT3_S6_ARCHIVE_HUB);
    expect(after.state.clues).toContain(ACT3_CLUE_GATES);
  });
});

describe('the root door and the boundary — DOWN', () => {
  it('examine/knock/badge/listen, then DOWN prints the in-world line and the system line', () => {
    const store = new MemoryStore();
    let session = loggedInAtHub({ objects: { [ACT2_NOLAN_BADGE]: { location: 'inventory' } } });

    ({ session } = say(session, 'x root door', store));
    ({ session } = say(session, 'knock on door', store));
    ({ session } = say(session, 'use badge', store));
    ({ session } = say(session, 'listen at door', store));

    expect(session.state.clues).toContain(ACT3_CLUE_ROOT_REFUSES);

    const { session: after, events } = say(session, 'down', store);
    const rendered = text(events);
    expect(rendered).toMatch(/gives you nothing back/);
    expect(rendered).toMatch(/END OF BUILD/);
    expect(rendered).toMatch(/Act III ends here/);
    expect(after.state.location).toBe(ACT3_S6_ARCHIVE_HUB);
  });
});

describe('Dad refuses the dock', () => {
  it('PUT USB IN TERMINAL, with Dad running, refuses ("No.")', () => {
    const store = new MemoryStore();
    const session = loggedInAtHub({
      flags: { [ACT3_HUB_LOGGED_IN]: true, [ACT2_DAD_BOOTED]: true },
      objects: { [ACT2_USB]: { location: 'inventory' } },
    });
    const { events } = say(session, 'put usb in terminal', store);
    expect(text(events)).toMatch(/"No\."/);
    expect(text(events)).toMatch(/Waiting is the one thing/);
  });
});

describe('exits', () => {
  it('WEST reaches the Maintenance Bay', () => {
    const store = new MemoryStore();
    const session = loggedInAtHub();
    const { session: after } = say(session, 'west', store);
    expect(after.state.location).toBe(ACT3_S6_MAINTENANCE_BAY);
  });
});

describe('no leaked ids or template placeholders', () => {
  it('none of the rendered strings above contain a raw act1_/act2_/act3_ id or an unfilled {name}', () => {
    const store = new MemoryStore();
    let session = loggedInAtHub({
      objects: {
        [ACT2_REPLY_AUDIT]: { location: 'inventory' },
        [ACT2_NOTEBOOK]: { location: 'inventory' },
        [ACT2_NOLAN_BADGE]: { location: 'inventory' },
      },
    });
    const inputs = [
      'look',
      'read ledger',
      'search ledger for jules',
      'search ledger for nolan',
      'search ledger for me',
      'search ledger for jack',
      'read graph',
      'compare audit with graph',
      'compare notebook with graph',
      'read queue',
      'x frames',
      'touch gate',
      'look under frames',
      'read legends',
      'enter gate',
      'x root door',
      'use badge',
      'knock on door',
      'listen at door',
      'search well drain',
      'listen',
      'smell',
      'wait',
      'shout',
    ];
    let allText = '';
    for (const input of inputs) {
      const result = say(session, input, store);
      session = result.session;
      allText += text(result.events);
    }
    expect(allText).not.toMatch(/\bact[123]_[a-z0-9_]+\b/);
    expect(allText).not.toMatch(/\{name\}/);
  });
});
