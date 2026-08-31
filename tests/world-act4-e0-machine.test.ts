// Stage E, wave E0, task K — the machine: the numeral search, the fourth
// heading, R13 (the profile), and the Act IV boundary
// (`docs/superpowers/specs/2026-09-17-stage-e0-prose.md` §16-§18, §22,
// §27, §31).

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
  ACT3_HUB_LOGGED_IN,
  ACT3_HUB_LOGIN_SCRIPT,
  ACT3_LEDGER,
  ACT3_LEDGER_SEARCH_RESPOND_SCRIPT,
  ACT3_LOAD_GRAPH,
  ACT3_QUEUE,
  ACT3_S6_ARCHIVE_HUB,
} from '../src/content/world/act3/ids';
import {
  ACT4_CLUE_FILED_UNDER_ONE,
  ACT4_CLUE_PROFILED,
  ACT4_NUMERAL_SEARCHED,
  ACT4_PROFILE_SEEN,
  ACT4_STARTED,
} from '../src/content/world/act4/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-17T04:00:00.000Z', gameVersion: 'test-0.0.0' };
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

/** A logged-in Hub session with Act IV started. */
function actFourHub(patch: Partial<GameState> = {}): SessionState {
  return loggedInAtHub({ ...patch, flags: { [ACT3_HUB_LOGGED_IN]: true, [ACT4_STARTED]: true, ...(patch.flags ?? {}) } });
}

describe('validate — E0 task K (the machine)', () => {
  it('produces no errors', () => {
    expect(validate(TEST_WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

describe('the ledger under a numeral — canon 105 (fixed-phrase form)', () => {
  it('SEARCH LEDGER FOR I: the screen block, the two paragraphs, the flag, the clue — nothing else that turn', () => {
    const store = new MemoryStore();
    const session = actFourHub();
    const { session: after, events } = say(session, 'search ledger for i', store);
    const rendered = text(events);
    expect(rendered).toMatch(/SEARCH: I/);
    expect(rendered).toMatch(/2 RESULTS/);
    expect(rendered).toMatch(/SUBJECT JULES I .+ DEPRECATED/);
    expect(rendered).toMatch(/SUBJECT \[UNRESOLVED\] .+ MAINTENANCE/);
    expect(rendered).toMatch(/read before and it has not improved/);
    expect(rendered).toMatch(/what it puts when there\nis not one/);
    expect(after.state.flags[ACT4_NUMERAL_SEARCHED]).toBe(true);
    expect(after.state.clues).toContain(ACT4_CLUE_FILED_UNDER_ONE);
    expect(after.state.clues).not.toContain(ACT4_CLUE_PROFILED);
  });

  it('SEARCH LEDGER FOR IV: one row, unopened, no flag, no clue', () => {
    const store = new MemoryStore();
    const session = actFourHub();
    const { session: after, events } = say(session, 'search ledger for iv', store);
    const rendered = text(events);
    expect(rendered).toMatch(/SEARCH: IV/);
    expect(rendered).toMatch(/1 RESULT/);
    expect(rendered).toMatch(/SUBJECT JACK IV .+ CURRENT/);
    expect(rendered).toMatch(/You do not open it/);
    expect(after.state.flags[ACT4_NUMERAL_SEARCHED]).not.toBe(true);
    expect(after.state.clues).not.toContain(ACT4_CLUE_FILED_UNDER_ONE);
  });

  it('before act4_started, the same fixed phrases still fall to OTHER', () => {
    const store = new MemoryStore();
    const session = loggedInAtHub();
    const one = say(session, 'search ledger for i', store);
    expect(text(one.events)).not.toMatch(/SUBJECT \[UNRESOLVED\]/);
    expect(text(one.events)).toMatch(/1 RESULT/);
    expect(one.session.state.flags[ACT4_NUMERAL_SEARCHED]).not.toBe(true);

    const four = say(session, 'search ledger for iv', store);
    expect(text(four.events)).not.toMatch(/SUBJECT JACK IV/);
    expect(text(four.events)).toMatch(/1 RESULT/);
  });
});

describe('the ledger under a numeral — the typed SEARCH prompt', () => {
  it('typing "ii" falls to the shipped OTHER response, even after act4_started', () => {
    const session = actFourHub();
    const result = respondToPrompt(TEST_WORLD, session, ACT3_LEDGER_SEARCH_RESPOND_SCRIPT, { search: 'ii' });
    const rendered = text(result.events);
    expect(rendered).toMatch(/1 RESULT/);
    expect(rendered).not.toMatch(/SUBJECT \[UNRESOLVED\]/);
    expect(rendered).not.toMatch(/SUBJECT JACK IV/);
  });

  it('typing "one" reaches §16.1, "four" reaches §16.2', () => {
    const session = actFourHub();
    const one = respondToPrompt(TEST_WORLD, session, ACT3_LEDGER_SEARCH_RESPOND_SCRIPT, { search: 'one' });
    expect(text(one.events)).toMatch(/SUBJECT \[UNRESOLVED\]/);
    const four = respondToPrompt(TEST_WORLD, session, ACT3_LEDGER_SEARCH_RESPOND_SCRIPT, { search: 'four' });
    expect(text(four.events)).toMatch(/SUBJECT JACK IV/);
  });
});

describe('the fourth heading — the login menu', () => {
  it('shows the fourth row (PROFILE) only after act4_started', () => {
    const before = loggedInAtHub({ flags: { [ACT3_HUB_LOGGED_IN]: false } });
    const loginBefore = respondToPrompt(TEST_WORLD, before, ACT3_HUB_LOGIN_SCRIPT, { user: 'admin', password: 'admin-password' });
    const renderedBefore = text(loginBefore.events);
    expect(renderedBefore).toMatch(/ACCESS LEVEL: MAINTENANCE/);
    expect(renderedBefore).not.toMatch(/PROFILE/);

    const afterFlag = loggedInAtHub({ flags: { [ACT3_HUB_LOGGED_IN]: false, [ACT4_STARTED]: true } });
    const loginAfter = respondToPrompt(TEST_WORLD, afterFlag, ACT3_HUB_LOGIN_SCRIPT, { user: 'admin', password: 'admin-password' });
    const renderedAfter = text(loginAfter.events);
    expect(renderedAfter).toMatch(/PROFILE \.+ BEHAVIORAL, CURRENT/);
    // first and last sentences unchanged.
    expect(renderedAfter).toMatch(/The cursor sits still for a moment, which the machine in your room never did\./);
    expect(renderedAfter).toMatch(/Upstairs that was the whole answer\. Down here it is a heading\./);
  });
});

describe('R13 — the profile', () => {
  it('READ PROFILE before it has rendered is the ordinary unknown-noun miss', () => {
    const store = new MemoryStore();
    const session = actFourHub();
    const { events } = say(session, 'read profile', store);
    const rendered = text(events);
    expect(rendered).not.toMatch(/BEHAVIORAL PROFILE/);
    expect(rendered).not.toMatch(/PRIMARY STRATEGY/);
  });

  it('after login, READ PROFILE prints the first-read sentence + block, with percentages summing sensibly, then just the block on a second read', () => {
    const store = new MemoryStore();
    const notLoggedIn = withState({ flags: { [ACT4_STARTED]: true }, profile: { analytical: 6, social: 3, direct: 1 } });
    const { session: atHub } = enter(notLoggedIn, ACT3_S6_ARCHIVE_HUB);
    const logged = respondToPrompt(TEST_WORLD, atHub, ACT3_HUB_LOGIN_SCRIPT, { user: 'admin', password: 'admin-password' });
    expect(text(logged.events)).toMatch(/PROFILE \.+ BEHAVIORAL, CURRENT/);

    const { session: afterRead, events: readEvents } = say(logged.session, 'read profile', store);
    const rendered = text(readEvents);
    expect(rendered).toMatch(/You take the fourth heading\. It comes up as fast as the other three/);
    expect(rendered).toMatch(/SUBJECT BEHAVIORAL PROFILE/);
    // 6/3/1 of 10 -> 60%, 30%, 10%.
    expect(rendered).toMatch(/OBSERVATION:\s+60%/);
    expect(rendered).toMatch(/SOCIAL INFERENCE:\s+30%/);
    expect(rendered).toMatch(/DIRECT ACTION:\s+10%/);
    expect(rendered).toMatch(/PRIMARY STRATEGY: ANALYTICAL/);
    expect(afterRead.state.flags[ACT4_PROFILE_SEEN]).toBe(true);
    expect(afterRead.state.clues).toContain(ACT4_CLUE_PROFILED);

    const { events: secondRead } = say(afterRead, 'read profile', store);
    const secondRendered = text(secondRead);
    expect(secondRendered).not.toMatch(/You take the fourth heading/);
    expect(secondRendered).toMatch(/SUBJECT BEHAVIORAL PROFILE/);
  });

  it('a tie prints UNDETERMINED', () => {
    const store = new MemoryStore();
    const notLoggedIn = withState({ flags: { [ACT4_STARTED]: true }, profile: { analytical: 4, social: 4, direct: 4 } });
    const { session: atHub } = enter(notLoggedIn, ACT3_S6_ARCHIVE_HUB);
    const logged = respondToPrompt(TEST_WORLD, atHub, ACT3_HUB_LOGIN_SCRIPT, { user: 'admin', password: 'admin-password' });
    const { events } = say(logged.session, 'read profile', store);
    expect(text(events)).toMatch(/PRIMARY STRATEGY: UNDETERMINED/);
  });

  it('zero total prints NONE and 0% three times', () => {
    const store = new MemoryStore();
    const notLoggedIn = withState({ flags: { [ACT4_STARTED]: true }, profile: { analytical: 0, social: 0, direct: 0 } });
    const { session: atHub } = enter(notLoggedIn, ACT3_S6_ARCHIVE_HUB);
    const logged = respondToPrompt(TEST_WORLD, atHub, ACT3_HUB_LOGIN_SCRIPT, { user: 'admin', password: 'admin-password' });
    const { events } = say(logged.session, 'read profile', store);
    const rendered = text(events);
    expect(rendered).toMatch(/PRIMARY STRATEGY: NONE/);
    expect(rendered).toMatch(/OBSERVATION:\s+0%/);
    expect(rendered).toMatch(/SOCIAL INFERENCE:\s+0%/);
    expect(rendered).toMatch(/DIRECT ACTION:\s+0%/);
  });
});

describe('the Act IV boundary — ENTER GATE', () => {
  it("prints canon 88's line before act4_started", () => {
    const store = new MemoryStore();
    const session = loggedInAtHub();
    const { events } = say(session, 'enter gate', store);
    const rendered = text(events);
    expect(rendered).toMatch(/Act III ends here/);
    expect(rendered).not.toMatch(/the man who is coming are this one/);
  });

  it("prints §22's line once act4_started", () => {
    const store = new MemoryStore();
    const session = actFourHub();
    const { events } = say(session, 'enter gate', store);
    const rendered = text(events);
    expect(rendered).toMatch(/END OF BUILD/);
    expect(rendered).toMatch(/street, the sheriff, the ledger and the man who is coming are this one/);
    expect(rendered).not.toMatch(/Act III ends here/);
  });
});

describe('no leaked ids, template placeholders, or an early "profile"', () => {
  it('none of the rendered strings above contain a raw act3_/act4_ id or an unfilled {name}', () => {
    const store = new MemoryStore();
    let session = actFourHub();
    const inputs = ['search ledger for i', 'search ledger for iv', 'read profile', 'enter gate'];
    let allText = '';
    for (const input of inputs) {
      const result = say(session, input, store);
      session = result.session;
      allText += text(result.events);
    }
    expect(allText).not.toMatch(/\bact[34]_[a-z0-9_]+\b/);
    expect(allText).not.toMatch(/\{name\}/);
    // "profile" appears nowhere in this run: it is not yet revealed, so
    // READ PROFILE is still the ordinary unknown-noun miss.
    expect(allText.toLowerCase()).not.toMatch(/profile/);
  });
});
