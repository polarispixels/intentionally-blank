// Stage E1, task L — the Staging Area, the hand-offs, and the visit's
// machinery (`docs/superpowers/specs/2026-09-18-stage-e1-prose.md` §3-§10,
// §13-§19, §28, §37, §38). Same session/turn pipeline pattern as
// `tests/world-act4-e0-street.test.ts` / `tests/world-act4-e1-luke.test.ts`.

import { describe, expect, it } from 'vitest';
import { validate } from '../src/engine/validate';
import { WORLD } from '../src/content/world/game';
import { renderArrival } from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import { POST_OFFICE, PO_BOXES, SHERIFF_OFFICE, SUNDOWN_DINER } from '../src/content/world/act1/ids';
import { ACT2_LETTER_OUT, ACT2_REPLY_AUDIT, ACT2_REPLY_BLANK, ACT2_REPLY_REWRITTEN } from '../src/content/world/act2/ids';
import { ACT3_LOBBY } from '../src/content/world/act3/ids';
import {
  ACT4_CLUE_DETAIL_REFUSES,
  ACT4_CLUE_LETTERS_FROM_JACK,
  ACT4_CLUE_MESSAGE_THROUGH,
  ACT4_DETAIL,
  ACT4_LUKE_GONE,
  ACT4_LUKE_MET,
  ACT4_MESSAGE_DELIVERED,
  ACT4_MESSAGE_VERDICT,
  ACT4_OFFICE_REPLY_DUE,
  ACT4_Q_REACH_LUKE,
  ACT4_REPLY_ELI_NUMERALS,
  ACT4_REPLY_OFFICE,
  ACT4_STAGING_AREA,
  ACT4_STAGING_OPEN,
  ACT4_VISIT_ANNOUNCED,
  ACT4_VISIT_DAY,
  ACT4_WHITLOCK_CONVINCED,
} from '../src/content/world/act4/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-18T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

function withState(patch: Partial<GameState>): SessionState {
  const fresh = createSession(TEST_WORLD);
  return {
    ...fresh,
    state: {
      ...fresh.state,
      ...patch,
      flags: { ...fresh.state.flags, ...(patch.flags ?? {}) },
      objects: { ...fresh.state.objects, ...(patch.objects ?? {}) },
    },
  };
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

function clueIds(events: GameEvent[]): string[] {
  return events.filter((e): e is Extract<GameEvent, { type: 'clue' }> => e.type === 'clue').map((e) => e.id);
}

/** No raw id or unresolved `{name}`-style template ever reaches the player. */
function assertNoLeak(rendered: string): void {
  expect(rendered).not.toMatch(/act[1-4]_/);
  expect(rendered).not.toMatch(/\{[a-zA-Z]+\}/);
}

/** A letter, in inventory, with the given message/fold state (bypassing WRITE LETTER/FOLD). */
function withLetter(session: SessionState, message: string, folded: boolean): SessionState {
  return {
    ...session,
    state: {
      ...session.state,
      objects: {
        ...session.state.objects,
        [ACT2_LETTER_OUT]: { location: 'inventory', props: { message, folded } },
      },
    },
  };
}

/** The visit announced, day set, at the diner, letter in hand. */
function baseAtDiner(message: string, folded: boolean): SessionState {
  const base = withState({
    location: SUNDOWN_DINER,
    flags: { [ACT4_VISIT_ANNOUNCED]: true, [ACT4_VISIT_DAY]: 3 },
    clock: { day: 3, minute: 300 },
  });
  return withLetter(base, message, folded);
}

describe('validate — Stage E1, task L', () => {
  it('produces no errors', () => {
    expect(validate(TEST_WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// §14/§16 — GIVE LETTER TO PEARL, the verdict, the reply due
// ---------------------------------------------------------------------------

describe('§14/§16 — GIVE LETTER TO PEARL', () => {
  it('a plain letter: verdict "plain", office reply due, message not delivered', () => {
    const store = new MemoryStore();
    const session = baseAtDiner('hello there, hope all is well', false);
    const { session: after, events } = say(session, 'give letter to pearl', store);
    const rendered = text(events);
    expect(rendered).toMatch(/reads the outside of it/);
    expect(rendered).toMatch(/boy in the good coat/);
    assertNoLeak(rendered);
    expect(after.state.flags[ACT4_MESSAGE_VERDICT]).toBe('plain');
    expect(after.state.flags[ACT4_MESSAGE_DELIVERED]).not.toBe(true);
    expect(after.state.flags[ACT4_OFFICE_REPLY_DUE]).toBe(4);
    expect(after.state.objects[ACT2_LETTER_OUT]?.location).toBe('nowhere');
    expect(clueIds(events)).not.toContain(ACT4_CLUE_MESSAGE_THROUGH);
  });

  it('a family letter (fold + word + numeral): verdict "family", delivered, grants the clue, and the same one text as the plain case', () => {
    const store = new MemoryStore();
    const session = baseAtDiner('tell them all kiddo iv', true);
    const { session: after, events } = say(session, 'give letter to pearl', store);
    const rendered = text(events);
    expect(rendered).toMatch(/reads the outside of it/);
    assertNoLeak(rendered);
    expect(after.state.flags[ACT4_MESSAGE_VERDICT]).toBe('family');
    expect(after.state.flags[ACT4_MESSAGE_DELIVERED]).toBe(true);
    expect(clueIds(events)).toContain(ACT4_CLUE_MESSAGE_THROUGH);
  });

  it("a rewritten letter (flagged token): verdict 'rewritten', not delivered", () => {
    const store = new MemoryStore();
    const session = baseAtDiner('ask about sublevel six', true);
    const { session: after } = say(session, 'give letter to pearl', store);
    expect(after.state.flags[ACT4_MESSAGE_VERDICT]).toBe('rewritten');
    expect(after.state.flags[ACT4_MESSAGE_DELIVERED]).not.toBe(true);
  });

  it('not reachable before the visit is announced', () => {
    const store = new MemoryStore();
    const session = withLetter(withState({ location: SUNDOWN_DINER }), 'hello', false);
    const { events } = say(session, 'give letter to pearl', store);
    expect(text(events)).not.toMatch(/boy in the good coat/);
  });
});

describe('§15 — GIVE LETTER TO WHITLOCK', () => {
  it('the reward route, gated on act4_whitlock_convinced', () => {
    const store = new MemoryStore();
    const session = withLetter(
      withState({
        location: SHERIFF_OFFICE,
        flags: { [ACT4_WHITLOCK_CONVINCED]: true, [ACT4_VISIT_DAY]: 3 },
        clock: { day: 3, minute: 300 },
      }),
      'tell them all kiddo iv',
      true,
    );
    const { session: after, events } = say(session, 'give letter to whitlock', store);
    const rendered = text(events);
    expect(rendered).toMatch(/I'm liaison/);
    assertNoLeak(rendered);
    expect(after.state.flags[ACT4_MESSAGE_VERDICT]).toBe('family');
    expect(after.state.flags[ACT4_MESSAGE_DELIVERED]).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// §17 — the door opens, on the day
// ---------------------------------------------------------------------------

describe('§17 — the door opens', () => {
  it('a family verdict, on the visit day, opens the exit', () => {
    const store = new MemoryStore();
    const session = baseAtDiner('tell them all kiddo iv', true);
    const { session: after } = say(session, 'give letter to pearl', store);
    expect(after.state.flags[ACT4_STAGING_OPEN]).toBe(true);
  });

  it('a family verdict, before the visit day, does not yet open the exit', () => {
    const store = new MemoryStore();
    const session = withLetter(
      withState({
        location: SUNDOWN_DINER,
        flags: { [ACT4_VISIT_ANNOUNCED]: true, [ACT4_VISIT_DAY]: 30 },
        clock: { day: 3, minute: 300 },
      }),
      'tell them all kiddo iv',
      true,
    );
    const { session: after } = say(session, 'give letter to pearl', store);
    expect(after.state.flags[ACT4_MESSAGE_DELIVERED]).toBe(true);
    expect(after.state.flags[ACT4_STAGING_OPEN]).not.toBe(true);
  });

  it('W from the Lobby reaches the Staging Area once open', () => {
    const store = new MemoryStore();
    const session = withState({ location: ACT3_LOBBY, flags: { [ACT4_STAGING_OPEN]: true } });
    const { events } = say(session, 'w', store);
    expect(text(events)).toMatch(/A long room off the lobby/);
  });

  it('W from the Lobby is not an exit before the door opens (falls to the blocked staging-door text)', () => {
    const store = new MemoryStore();
    const session = withState({ location: ACT3_LOBBY });
    const { events } = say(session, 'w', store);
    expect(text(events)).not.toMatch(/A long room off the lobby/);
  });
});

// ---------------------------------------------------------------------------
// §3 — the room, three rules
// ---------------------------------------------------------------------------

describe('§3 — the Staging Area, three description rules', () => {
  it('rule 1 — first sight', () => {
    const store = new MemoryStore();
    const { events } = enter(withState({}), ACT4_STAGING_AREA);
    void store;
    expect(text(events)).toMatch(/A long room off the lobby/);
  });

  it('rule 2 — not yet gone', () => {
    const store = new MemoryStore();
    const session = withState({ visited: { [ACT4_STAGING_AREA]: 1 } });
    void store;
    const { events } = enter(session, ACT4_STAGING_AREA);
    expect(text(events)).toMatch(/coat over the back of it/);
  });

  it('rule 3 — gone', () => {
    const store = new MemoryStore();
    const session = withState({ visited: { [ACT4_STAGING_AREA]: 1 }, flags: { [ACT4_LUKE_GONE]: true } });
    void store;
    const { events } = enter(session, ACT4_STAGING_AREA);
    expect(text(events)).toMatch(/inch left in it and it is cold/);
  });
});

// ---------------------------------------------------------------------------
// §4 — the whiteboard: no digit, ever
// ---------------------------------------------------------------------------

describe('§4 — the whiteboard', () => {
  it('EXAMINE prints no digit, ever (canon 70 — no clock time)', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_STAGING_AREA);
    const { events } = say(session, 'examine whiteboard', store);
    const rendered = text(events);
    expect(rendered).toMatch(/PRINCIPAL/);
    expect(rendered).not.toMatch(/\d/);
    assertNoLeak(rendered);
  });

  it('RUB/TAKE/WRITE ON all give the same defensive text', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_STAGING_AREA);
    const { events: rubEvents } = say(session, 'rub whiteboard', store);
    const { events: takeEvents } = say(session, 'take whiteboard', store);
    const { events: writeEvents } = say(session, 'write on whiteboard', store);
    for (const ev of [rubEvents, takeEvents, writeEvents]) {
      expect(text(ev)).toMatch(/paid to notice exactly this/);
    }
  });
});

// ---------------------------------------------------------------------------
// §6/§7 — the folder and the letters, R15
// ---------------------------------------------------------------------------

describe('§7 — the letters (R15)', () => {
  it('READ LETTERS grants the clue', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_STAGING_AREA);
    const { session: after, events } = say(session, 'read letters', store);
    expect(text(events)).toMatch(/Jack/);
    expect(after.state.clues).toContain(ACT4_CLUE_LETTERS_FROM_JACK);
  });

  it('TAKE FOLDER and TAKE LETTERS give the same refusal', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_STAGING_AREA);
    const { events: folderEvents } = say(session, 'take folder', store);
    const { events: lettersEvents } = say(session, 'take letters', store);
    expect(text(folderEvents)).toMatch(/man at the far door does not move/);
    expect(text(lettersEvents)).toMatch(/man at the far door does not move/);
  });
});

// ---------------------------------------------------------------------------
// §8 — the window
// ---------------------------------------------------------------------------

describe('§8 — the window', () => {
  it('EXAMINE and OPEN', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_STAGING_AREA);
    const { events: examineEvents } = say(session, 'examine window', store);
    const { events: openEvents } = say(session, 'open window', store);
    expect(text(examineEvents)).toMatch(/lot has been swept/);
    expect(text(openEvents)).toMatch(/Sealed unit/);
  });
});

// ---------------------------------------------------------------------------
// §9 — the detail, four responses
// ---------------------------------------------------------------------------

// The detail's own object starts hidden at the Lobby (§37.2's "present in
// the Staging Area and in the Lobby on and after act4_visit_day") and only
// moves into the Staging Area via `act4_ev_staging_opens` (`events.ts`,
// this task's own) — teleporting straight into the room (`enter()`, below)
// bypasses that event, so these tests seed the post-door-open placement
// directly.
function withDetailInStagingArea(session: SessionState): SessionState {
  return { ...session, state: { ...session.state, objects: { ...session.state.objects, [ACT4_DETAIL]: { location: ACT4_STAGING_AREA, hidden: false } } } };
}

describe('§9 — the detail', () => {
  it('EXAMINE DETAIL', () => {
    const store = new MemoryStore();
    const session = withDetailInStagingArea(
      withState({ flags: { [ACT4_VISIT_ANNOUNCED]: true, [ACT4_VISIT_DAY]: 1 }, clock: { day: 5, minute: 300 } }),
    );
    const { session: staged } = enter(session, ACT4_STAGING_AREA);
    const { events } = say(staged, 'examine detail', store);
    expect(text(events)).toMatch(/Two of them/);
  });

  it('SHOW <anything> TO DETAIL grants the clue (room instrument handler)', () => {
    const store = new MemoryStore();
    const session = withDetailInStagingArea(
      withState({
        flags: { [ACT4_VISIT_ANNOUNCED]: true, [ACT4_VISIT_DAY]: 1 },
        clock: { day: 5, minute: 300 },
        objects: { [ACT2_LETTER_OUT]: { location: 'inventory', props: { message: 'hi', folded: false } } },
      }),
    );
    const { session: staged } = enter(session, ACT4_STAGING_AREA);
    const { session: after, events } = say(staged, 'show letter to detail', store);
    const rendered = text(events);
    expect(rendered).toMatch(/Thank you, sir/);
    expect(after.state.clues).toContain(ACT4_CLUE_DETAIL_REFUSES);
  });

  it('TALK TO DETAIL', () => {
    const store = new MemoryStore();
    const session = withDetailInStagingArea(
      withState({ flags: { [ACT4_VISIT_ANNOUNCED]: true, [ACT4_VISIT_DAY]: 1 }, clock: { day: 5, minute: 300 } }),
    );
    const { session: staged } = enter(session, ACT4_STAGING_AREA);
    const { events } = say(staged, 'talk to detail', store);
    expect(text(events)).toMatch(/"Sir\."/);
  });

  it('ATTACK DETAIL / PUSH PAST both refuse', () => {
    const store = new MemoryStore();
    const session = withDetailInStagingArea(
      withState({ flags: { [ACT4_VISIT_ANNOUNCED]: true, [ACT4_VISIT_DAY]: 1 }, clock: { day: 5, minute: 300 } }),
    );
    const { session: staged } = enter(session, ACT4_STAGING_AREA);
    const { events: attackEvents } = say(staged, 'attack detail', store);
    const { events: pushEvents } = say(staged, 'push past', store);
    expect(text(attackEvents)).toMatch(/^No\./);
    expect(text(pushEvents)).toMatch(/^No\./);
  });
});

// ---------------------------------------------------------------------------
// §10 — the coffee urn
// ---------------------------------------------------------------------------

describe('§10 — the urn', () => {
  it('EXAMINE and DRINK', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_STAGING_AREA);
    const { events: examineEvents } = say(session, 'examine urn', store);
    const { events: drinkEvents } = say(session, 'drink coffee', store);
    expect(text(examineEvents)).toMatch(/stainless catering urn/);
    expect(text(drinkEvents)).toMatch(/thirty-two miles from here/);
  });
});

// ---------------------------------------------------------------------------
// §18 — TELL PEARL ABOUT URN, gated on act4_luke_met
// ---------------------------------------------------------------------------

describe('§18 — Pearl, told about the urn', () => {
  it('gated on act4_luke_met', () => {
    const store = new MemoryStore();
    const session = withState({ location: SUNDOWN_DINER });
    const { events } = say(session, 'tell pearl about urn', store);
    expect(text(events)).not.toMatch(/sent a boy out for the urn/);
  });

  it('once Luke has been met', () => {
    const store = new MemoryStore();
    const session = withState({ location: SUNDOWN_DINER, flags: { [ACT4_LUKE_MET]: true } });
    const { events } = say(session, 'tell pearl about urn', store);
    expect(text(events)).toMatch(/sent a boy out for the urn/);
  });
});

// ---------------------------------------------------------------------------
// §19 — the office's reply
// ---------------------------------------------------------------------------

describe("§19 — the office's reply", () => {
  it('arrives in box 141 once the day comes (act4_ev_office_reply)', () => {
    const store = new MemoryStore();
    const session = withState({
      location: SUNDOWN_DINER,
      flags: { [ACT4_MESSAGE_VERDICT]: 'plain', [ACT4_OFFICE_REPLY_DUE]: 2 },
      clock: { day: 5, minute: 300 },
    });
    const { session: after } = say(session, 'wait', store);
    expect(after.state.objects[ACT4_REPLY_OFFICE]?.location).toEqual({ in: PO_BOXES });
  });

  it('READ OFFICE REPLY / EXAMINE OFFICE REPLY', () => {
    const store = new MemoryStore();
    const session = withState({
      location: POST_OFFICE,
      objects: { [ACT4_REPLY_OFFICE]: { location: 'inventory' } },
    });
    const { events: readEvents } = say(session, 'read office reply', store);
    const { events: examineEvents } = say(session, 'examine office reply', store);
    expect(text(readEvents)).toMatch(/Correspondence Unit/);
    expect(text(examineEvents)).toMatch(/crease in it/);
  });

  it('a five-way "reply" clarify names five distinct things', () => {
    const store = new MemoryStore();
    const session = withState({
      location: SUNDOWN_DINER,
      objects: {
        [ACT2_REPLY_REWRITTEN]: { location: 'inventory' },
        [ACT2_REPLY_BLANK]: { location: 'inventory' },
        [ACT2_REPLY_AUDIT]: { location: 'inventory' },
        [ACT4_REPLY_ELI_NUMERALS]: { location: 'inventory' },
        [ACT4_REPLY_OFFICE]: { location: 'inventory' },
      },
    });
    const { events } = say(session, 'read reply', store);
    const clarify = events.find((e): e is Extract<GameEvent, { type: 'clarify' }> => e.type === 'clarify');
    expect(clarify).toBeDefined();
    expect(clarify!.options.length).toBe(5);
    expect(new Set(clarify!.options).size).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// P22 — the message, solved by act4_luke_met
// ---------------------------------------------------------------------------

describe('P22 — the message', () => {
  it('solved once act4_luke_met, answers act4_q_reach_luke', () => {
    const store = new MemoryStore();
    const session = withState({ location: SUNDOWN_DINER, flags: { [ACT4_LUKE_MET]: true } });
    const { session: after } = say(session, 'wait', store);
    expect(after.state.questions[ACT4_Q_REACH_LUKE]).toBe('answered');
  });

  it('unsolved without act4_luke_met', () => {
    const store = new MemoryStore();
    const session = withState({ location: SUNDOWN_DINER });
    const { session: after } = say(session, 'wait', store);
    expect(after.state.questions[ACT4_Q_REACH_LUKE]).not.toBe('answered');
  });
});
