// Stage E0, task J — Whitlock's Act IV, the cage, the evidence bag, the
// case notes, the comparison (R14, the analog leg), Jack's arithmetic, the
// numerals letter/reply, Dad's breath, and P21 (`docs/superpowers/specs/
// 2026-09-17-stage-e0-prose.md` §10-§15, §19-§21, §23, §27, §31). Same
// session/turn pipeline pattern as `tests/world-act2-censor.test.ts` /
// `tests/world-act3-d5-hub.test.ts`.

import { describe, expect, it } from 'vitest';
import { validate } from '../src/engine/validate';
import { evaluate } from '../src/engine/cond';
import { WORLD } from '../src/content/world/game';
import { renderArrival } from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import { CLUE_JULES, JACK, JACKS_MOTEL, KEYRING, PO_BOXES, POST_OFFICE, SHERIFF_OFFICE, WHITLOCK } from '../src/content/world/act1/ids';
import { EVIDENCE_CAGE } from '../src/content/world/act1/ids';
import {
  ACT2_AWAITING_REPLY,
  ACT2_CLUE_PAGE_FITS,
  ACT2_ELI_REPLY_DUE,
  ACT2_HAS_AUDIT,
  ACT2_LETTER_OUT,
  ACT2_LETTER_STATUS,
  ACT2_NOTEBOOK,
  ACT2_REPLY_AUDIT,
  ACT2_STARTED,
  ACT2_DAD,
} from '../src/content/world/act2/ids';
import { ACT3_S6_ARCHIVE_HUB } from '../src/content/world/act3/ids';
import {
  ACT4_CAGE_OPEN,
  ACT4_CASE_NOTES,
  ACT4_CLUE_ELIS_REASON,
  ACT4_CLUE_SAME_HAND,
  ACT4_EVIDENCE_BAG,
  ACT4_HANDWRITING_MATCHED,
  ACT4_NUMERAL_SEARCHED,
  ACT4_P21_SELF_EVIDENCE,
  ACT4_PROFILE_SEEN,
  ACT4_Q_RECORD_ABOUT_YOU,
  ACT4_REPLY_ELI_NUMERALS,
  ACT4_STARTED,
  ACT4_WHITLOCK_CONVINCED,
} from '../src/content/world/act4/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-17T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

function withState(patch: Partial<GameState>): SessionState {
  const fresh = createSession(TEST_WORLD);
  return { ...fresh, state: { ...fresh.state, ...patch, flags: { ...fresh.state.flags, ...(patch.flags ?? {}) } } };
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

const MORNING = 420;

describe('validate — Stage E0, task J', () => {
  it('produces no errors', () => {
    expect(validate(TEST_WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

function atWhitlockStarted(patch: Partial<GameState> = {}): SessionState {
  return withState({ flags: { [ACT4_STARTED]: true, ...(patch.flags ?? {}) }, ...patch });
}

describe("Whitlock's Act IV topics", () => {
  it('ASK WHITLOCK ABOUT READER', () => {
    const store = new MemoryStore();
    const { session } = enter(atWhitlockStarted(), SHERIFF_OFFICE);
    const { events } = say(session, 'ask whitlock about reader', store);
    expect(text(events)).toMatch(/That was mine/);
  });

  it('ASK WHITLOCK ABOUT HER NOTEBOOK', () => {
    const store = new MemoryStore();
    const { session } = enter(atWhitlockStarted(), SHERIFF_OFFICE);
    const { events } = say(session, 'ask whitlock about her notebook', store);
    expect(text(events)).toMatch(/I keep my own/);
  });

  it('ASK WHITLOCK ABOUT CAGE, before conviction', () => {
    const store = new MemoryStore();
    const { session } = enter(atWhitlockStarted(), SHERIFF_OFFICE);
    const { events } = say(session, 'ask whitlock about cage', store);
    expect(text(events)).toMatch(/Same answer as the first night/);
  });

  it('ASK WHITLOCK ABOUT VISIT', () => {
    const store = new MemoryStore();
    const { session } = enter(atWhitlockStarted(), SHERIFF_OFFICE);
    const { events } = say(session, 'ask whitlock about visit', store);
    expect(text(events)).toMatch(/I'm liaison/);
    expect(text(events)).toMatch(/PRINCIPAL/);
  });
});

describe('the two show-responses — act4_whitlock_convinced', () => {
  it('SHOW NOTEBOOK TO WHITLOCK, with the page fitted, convinces her', () => {
    const store = new MemoryStore();
    const base = withState({
      flags: { [ACT4_STARTED]: true },
      clues: [ACT2_CLUE_PAGE_FITS],
      objects: { [ACT2_NOTEBOOK]: { location: 'inventory' } },
    });
    const { session } = enter(base, SHERIFF_OFFICE);
    const { session: after, events } = say(session, 'show notebook to whitlock', store);
    expect(text(events)).toMatch(/Whose is this/);
    expect(after.state.flags[ACT4_WHITLOCK_CONVINCED]).toBe(true);
  });

  it('SHOW AUDIT TO WHITLOCK, with the audit read, convinces her', () => {
    const store = new MemoryStore();
    const base = withState({
      flags: { [ACT4_STARTED]: true, [ACT2_HAS_AUDIT]: true },
      objects: { [ACT2_REPLY_AUDIT]: { location: 'inventory' } },
    });
    const { session } = enter(base, SHERIFF_OFFICE);
    const { session: after, events } = say(session, 'show audit to whitlock', store);
    expect(text(events)).toMatch(/That's a working hand/);
    expect(after.state.flags[ACT4_WHITLOCK_CONVINCED]).toBe(true);
  });
});

describe('the cage opens — §12', () => {
  function convinced(patch: Partial<GameState> = {}): SessionState {
    return withState({ flags: { [ACT4_STARTED]: true, [ACT4_WHITLOCK_CONVINCED]: true, ...(patch.flags ?? {}) }, ...patch });
  }

  it('OPEN CAGE sets act4_cage_open and reveals the bag', () => {
    const store = new MemoryStore();
    const { session } = enter(convinced(), SHERIFF_OFFICE);
    const { session: after, events } = say(session, 'open cage', store);
    expect(text(events)).toMatch(/She gets up/);
    expect(after.state.flags[ACT4_CAGE_OPEN]).toBe(true);
    expect(after.state.objects[ACT4_EVIDENCE_BAG]?.hidden).toBe(false);
  });

  it('ASK WHITLOCK ABOUT CAGE, once convinced, reaches the same opening', () => {
    const store = new MemoryStore();
    const { session } = enter(convinced(), SHERIFF_OFFICE);
    const { session: after, events } = say(session, 'ask whitlock about cage', store);
    expect(text(events)).toMatch(/She gets up/);
    expect(after.state.flags[ACT4_CAGE_OPEN]).toBe(true);
  });

  it('ASK WHITLOCK ABOUT BAG, once convinced, also opens it', () => {
    const store = new MemoryStore();
    const { session } = enter(convinced(), SHERIFF_OFFICE);
    const { session: after, events } = say(session, 'ask whitlock about bag', store);
    expect(after.state.flags[ACT4_CAGE_OPEN]).toBe(true);
  });

  it('the bag is not there before the cage opens', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_STARTED]: true } }), SHERIFF_OFFICE);
    const { events } = say(session, 'examine bag', store);
    expect(text(events)).not.toMatch(/Brown paper, folded/);
  });
});

function bagOpen(patch: Partial<GameState> = {}): SessionState {
  return withState({
    flags: { [ACT4_STARTED]: true, [ACT4_WHITLOCK_CONVINCED]: true, [ACT4_CAGE_OPEN]: true, ...(patch.flags ?? {}) },
    objects: { [ACT4_EVIDENCE_BAG]: { hidden: false }, [ACT4_CASE_NOTES]: { hidden: false }, ...(patch.objects ?? {}) },
    ...patch,
  });
}

describe('the evidence bag — §13', () => {
  it('EXAMINE BAG', () => {
    const store = new MemoryStore();
    const { session } = enter(bagOpen(), SHERIFF_OFFICE);
    const { events } = say(session, 'examine bag', store);
    expect(text(events)).toMatch(/Brown paper, folded over twice/);
  });

  it('OPEN BAG moves the case notes to inventory', () => {
    const store = new MemoryStore();
    const { session } = enter(bagOpen(), SHERIFF_OFFICE);
    const { session: after, events } = say(session, 'open bag', store);
    expect(text(events)).toMatch(/The staples come out with a fingernail/);
    expect(after.state.objects[ACT4_CASE_NOTES]?.location).toBe('inventory');
  });

  it('LOOK IN BAG does the same', () => {
    const store = new MemoryStore();
    const { session } = enter(bagOpen(), SHERIFF_OFFICE);
    const { session: after } = say(session, 'look in bag', store);
    expect(after.state.objects[ACT4_CASE_NOTES]?.location).toBe('inventory');
  });

  it('TAKE NOTES does the same, directly', () => {
    const store = new MemoryStore();
    const { session } = enter(bagOpen(), SHERIFF_OFFICE);
    const { session: after, events } = say(session, 'take notes', store);
    expect(text(events)).toMatch(/The staples come out with a fingernail/);
    expect(after.state.objects[ACT4_CASE_NOTES]?.location).toBe('inventory');
  });

  it('TAKE BAG refuses, in Whitlock\'s voice', () => {
    const store = new MemoryStore();
    const { session } = enter(bagOpen(), SHERIFF_OFFICE);
    const { events } = say(session, 'take bag', store);
    expect(text(events)).toMatch(/The bag's the county's/);
  });
});

describe('the case notes — §14', () => {
  it('READ NOTES, once carried', () => {
    const store = new MemoryStore();
    const base = bagOpen({ objects: { [ACT4_CASE_NOTES]: { hidden: false, location: 'inventory' } } });
    const { session } = enter(base, SHERIFF_OFFICE);
    const { events } = say(session, 'read notes', store);
    expect(text(events)).toMatch(/Three weeks of you/);
  });

  it('SHOW NOTES TO WHITLOCK', () => {
    const store = new MemoryStore();
    const base = bagOpen({ objects: { [ACT4_CASE_NOTES]: { hidden: false, location: 'inventory' } } });
    const { session } = enter(base, SHERIFF_OFFICE);
    const { events } = say(session, 'show notes to whitlock', store);
    expect(text(events)).toMatch(/I read them the morning I bagged them/);
  });
});

describe('the comparison — §15, R14 analog leg', () => {
  it('COMPARE NOTES WITH NOTEBOOK sets the flag, grants the clue, and Whitlock stays silent', () => {
    const store = new MemoryStore();
    const base = bagOpen({
      objects: { [ACT4_CASE_NOTES]: { hidden: false, location: 'inventory' }, [ACT2_NOTEBOOK]: { location: 'inventory' } },
    });
    const { session } = enter(base, SHERIFF_OFFICE);
    const { session: after, events } = say(session, 'compare notes with notebook', store);
    const rendered = text(events);
    expect(rendered).toMatch(/Everybody's cursive looks alike/);
    expect(rendered).not.toMatch(/"/); // Whitlock is not quoted — she says nothing.
    expect(after.state.flags[ACT4_HANDWRITING_MATCHED]).toBe(true);
    expect(after.state.clues).toContain(ACT4_CLUE_SAME_HAND);
  });

  it('the mirror phrasing — COMPARE NOTEBOOK WITH NOTES — reaches the same effect', () => {
    const store = new MemoryStore();
    const base = bagOpen({
      objects: { [ACT4_CASE_NOTES]: { hidden: false, location: 'inventory' }, [ACT2_NOTEBOOK]: { location: 'inventory' } },
    });
    const { session } = enter(base, SHERIFF_OFFICE);
    const { session: after } = say(session, 'compare notebook with notes', store);
    expect(after.state.flags[ACT4_HANDWRITING_MATCHED]).toBe(true);
  });
});

describe('P21 — the evidence about yourself', () => {
  it('all three legs together solve it and answer the question', () => {
    const store = new MemoryStore();
    const base = withState({
      flags: { [ACT4_STARTED]: true, [ACT4_NUMERAL_SEARCHED]: true, [ACT4_PROFILE_SEEN]: true },
      clues: [ACT4_CLUE_SAME_HAND],
    });
    const { session } = enter(base, SHERIFF_OFFICE);
    const { session: after, events } = say(session, 'wait', store);
    const p21 = TEST_WORLD.puzzles![ACT4_P21_SELF_EVIDENCE]!;
    expect(evaluate(TEST_WORLD, after.state, p21.solvedWhen)).toBe(true);
    expect(after.state.questions?.[ACT4_Q_RECORD_ABOUT_YOU]).toBe('answered');
    void events;
  });

  it('two of three legs does not solve it', () => {
    const base = withState({
      flags: { [ACT4_STARTED]: true, [ACT4_NUMERAL_SEARCHED]: true },
      clues: [ACT4_CLUE_SAME_HAND],
    });
    const p21 = TEST_WORLD.puzzles![ACT4_P21_SELF_EVIDENCE]!;
    expect(evaluate(TEST_WORLD, base.state, p21.solvedWhen)).toBe(false);
  });
});

describe("Jack's arithmetic and topic_jules", () => {
  it('ASK JACK ABOUT WEEKS', () => {
    const store = new MemoryStore();
    const { session } = enter(atWhitlockStarted(), JACKS_MOTEL);
    const { events } = say(session, 'ask jack about weeks', store);
    expect(text(events)).toMatch(/Five weeks he's been gone/);
    expect(text(events)).toMatch(/Three weeks you've been looking for him/);
  });

  it('ASK JACK ABOUT JULES, after act4_started, reaches the prepended rule', () => {
    const store = new MemoryStore();
    const base = withState({ flags: { [ACT4_STARTED]: true }, clues: [CLUE_JULES] });
    const { session } = enter(base, JACKS_MOTEL);
    const { events } = say(session, 'ask jack about jules', store);
    expect(text(events)).toMatch(/Nothing's changed here/);
    expect(text(events)).toMatch(/Luke/);
  });
});

describe('the numerals letter and reply — §21, canon 110', () => {
  function withLetter(message: string): SessionState {
    return withState({
      clock: { day: 1, minute: MORNING },
      flags: { [ACT4_STARTED]: true },
      objects: { [ACT2_LETTER_OUT]: { location: 'inventory', props: { message, folded: false } } },
    });
  }

  it('a letter asking about the tattoo sets status numerals, due day +4', () => {
    const store = new MemoryStore();
    const { session } = enter(withLetter('why is there no tattoo with a numeral one'), POST_OFFICE);
    const { session: after } = say(session, 'post letter', store);
    expect(after.state.flags[ACT2_LETTER_STATUS]).toBe('numerals');
    expect(after.state.flags[ACT2_ELI_REPLY_DUE]).toBe(5);
  });

  it('the reply arrives in box 141 on the due day', () => {
    const store = new MemoryStore();
    const base = withState({
      clock: { day: 5, minute: MORNING },
      flags: { [ACT4_STARTED]: true, [ACT2_LETTER_STATUS]: 'numerals', [ACT2_ELI_REPLY_DUE]: 5, [ACT2_AWAITING_REPLY]: true },
    });
    const { session } = enter(base, POST_OFFICE);
    const { session: after } = say(session, 'wait', store);
    expect(after.state.objects[ACT4_REPLY_ELI_NUMERALS]?.location).toEqual({ in: PO_BOXES });
    expect(after.state.flags[ACT2_AWAITING_REPLY]).toBe(false);
  });

  it('READ REPLY grants the clue; EXAMINE REPLY describes the paper', () => {
    const store = new MemoryStore();
    const base = withState({ objects: { [ACT4_REPLY_ELI_NUMERALS]: { location: 'inventory' } } });
    const { session } = enter(base, POST_OFFICE);
    const { session: after, events } = say(session, 'read reply', store);
    expect(text(events)).toMatch(/There is no I\. There was never an I\./);
    expect(after.state.clues).toContain(ACT4_CLUE_ELIS_REASON);

    const { events: examined } = say(after, 'examine reply', store);
    expect(text(examined)).toMatch(/filing schedule/);
  });
});

describe("Dad's breath — §19, once", () => {
  it('fires the turn after act4_profile_seen, with Dad in the Hub', () => {
    const store = new MemoryStore();
    const base = withState({
      location: ACT3_S6_ARCHIVE_HUB,
      flags: { [ACT4_STARTED]: true, [ACT4_PROFILE_SEEN]: true },
      npcs: { [ACT2_DAD]: { following: true } },
    });
    const { session } = enter(base, ACT3_S6_ARCHIVE_HUB);
    const { session: after, events } = say(session, 'wait', store);
    expect(text(events)).toMatch(/Well," says Dad/);

    const { events: again } = say(after, 'wait', store);
    expect(text(again)).not.toMatch(/Well," says Dad/);
  });

  it('does not fire without Dad present', () => {
    const store = new MemoryStore();
    const base = withState({ location: ACT3_S6_ARCHIVE_HUB, flags: { [ACT4_STARTED]: true, [ACT4_PROFILE_SEEN]: true } });
    const { session } = enter(base, ACT3_S6_ARCHIVE_HUB);
    const { events } = say(session, 'wait', store);
    expect(text(events)).not.toMatch(/Well," says Dad/);
  });
});

describe('noun resolution — §31.2', () => {
  it('TAG still resolves to the cage (unchanged, no new ambiguity introduced)', () => {
    const store = new MemoryStore();
    const { session } = enter(bagOpen(), SHERIFF_OFFICE);
    const { events } = say(session, 'examine tag', store);
    expect(text(events)).toMatch(/tags hang whichever way|manila tag/);
  });

  it('BAG resolves to the evidence bag once revealed, not the cage', () => {
    const store = new MemoryStore();
    const { session } = enter(bagOpen(), SHERIFF_OFFICE);
    const { events } = say(session, 'examine bag', store);
    expect(text(events)).toMatch(/Brown paper, folded over twice/);
  });

  it('no id or {name} leaks anywhere in this suite\'s transcripts', () => {
    // Spot check on the densest turn (the comparison).
    const store = new MemoryStore();
    const base = bagOpen({
      objects: { [ACT4_CASE_NOTES]: { hidden: false, location: 'inventory' }, [ACT2_NOTEBOOK]: { location: 'inventory' } },
    });
    const { session } = enter(base, SHERIFF_OFFICE);
    const { events } = say(session, 'compare notes with notebook', store);
    const rendered = text(events);
    expect(rendered).not.toMatch(/\{name\}/);
    expect(rendered).not.toMatch(/act4_|act1_|act2_/);
  });
});
