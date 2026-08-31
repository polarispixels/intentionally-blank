// Stage D2, task C — the Friday table (Stage D plan §2 D2 §4.3's seven
// tests; D2 prose doc §14–§16). Drives the real session/turn pipeline
// (`createSession`/`takeTurn`), same idiom as `tests/world-act2-calendar.
// test.ts`, on a Friday evening state with `act2_started` set.

import { describe, expect, it } from 'vitest';
import { validate } from '../src/engine/validate';
import { WORLD } from '../src/content/world/act1/world';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import { SUNDOWN_DINER } from '../src/content/world/act1/ids';
import { ACT2_DECK } from '../src/content/world/act2/ids';
import {
  ACT2_BADGE_WON,
  ACT2_BEAT_DADS_ADVICE,
  ACT2_CHEATED_ONCE,
  ACT2_CLUE_SAME_HANDS,
  ACT2_DAD,
  ACT2_HEARD_GATE_TALK,
  ACT2_NOLAN_BADGE,
  ACT2_POKER_BANNED_UNTIL,
  ACT2_POKER_HAND,
  ACT2_POKER_IN_PROGRESS,
  ACT2_POKER_RESULT,
  ACT2_POKER_SESSION,
  ACT2_POKER_WINS,
  ACT2_STARTED,
  ACT2_TELL_NOLAN,
} from '../src/content/world/act2/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-08T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

/** Friday evening, day 3 (day 1 is Wednesday — `act2/calendar.ts`), `act2_started`, at the diner. */
function fridayEveningAtTable(patch: Partial<GameState> = {}): SessionState {
  const fresh = createSession(TEST_WORLD);
  return {
    ...fresh,
    state: {
      ...fresh.state,
      location: SUNDOWN_DINER,
      clock: { day: 3, minute: 1080 },
      flags: { ...fresh.state.flags, [ACT2_STARTED]: true },
      ...patch,
    },
  };
}

function say(session: SessionState, text: string, store: MemoryStore): { session: SessionState; events: GameEvent[] } {
  const view = buildScopeView(TEST_WORLD, session.state, vocab);
  const outcome = new DeterministicParser().interpret(text, view);
  const result = takeTurn(TEST_WORLD, session, vocab, outcome, opts(store));
  return { session: result.session, events: result.events };
}

function textOf(events: GameEvent[]): string {
  return events
    .filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line')
    .map((e) => e.text)
    .join('\n');
}

/** Plays hand 1 through with a given action; returns the resulting session. */
function playHand1(session: SessionState, store: MemoryStore, action: string): SessionState {
  return say(session, action, store).session;
}

describe('validate — Stage D2, task C (the Friday table, Nolan, the Custodian, the buzz)', () => {
  it('produces no errors', () => {
    const errors = validate(TEST_WORLD).filter((f) => f.severity === 'error');
    expect(errors).toEqual([]);
  });
});

describe('the Friday table — sitting down', () => {
  it('SIT the first time stakes the player from Jack', () => {
    const store = new MemoryStore();
    const session = fridayEveningAtTable();
    const { session: after, events } = say(session, 'join game', store);
    expect(after.state.flags[ACT2_POKER_IN_PROGRESS]).toBe(true);
    expect(after.state.flags[ACT2_POKER_HAND]).toBe(1);
    expect(textOf(events)).toContain("That's a loan");
  });

  it('SIT while banned refuses, in voice', () => {
    const store = new MemoryStore();
    const session = fridayEveningAtTable({ flags: { [ACT2_POKER_BANNED_UNTIL]: 10 } });
    const { events } = say(session, 'play poker', store);
    expect(textOf(events)).toContain('Not this week');
  });

  it('JOIN GAME on a non-Friday night gives the wrong-night line', () => {
    const store = new MemoryStore();
    const session = fridayEveningAtTable({ clock: { day: 4, minute: 1080 } }); // Saturday evening
    const { events } = say(session, 'join game', store);
    expect(textOf(events)).toContain('"Friday," she says');
  });
});

describe('§4.3 test 1 — hand 1, CALL with/without the tell', () => {
  it('CALL on hand 1 without the tell loses', () => {
    const store = new MemoryStore();
    let session = fridayEveningAtTable();
    session = playHand1(session, store, 'join game');
    const { session: after, events } = say(session, 'call', store);
    expect(after.state.flags[ACT2_POKER_WINS]).toBe(0);
    expect(after.state.flags[ACT2_POKER_HAND]).toBe(2);
    expect(textOf(events)).toContain('he had it from the first card');
  });

  it('WATCH NOLAN then CALL on hand 1 wins', () => {
    const store = new MemoryStore();
    let session = fridayEveningAtTable();
    session = playHand1(session, store, 'join game');
    session = say(session, 'watch nolan', store).session;
    expect(session.state.flags[ACT2_TELL_NOLAN]).toBe(true);
    const { session: after, events } = say(session, 'call', store);
    expect(after.state.flags[ACT2_POKER_WINS]).toBe(1);
    expect(textOf(events)).toContain("That's you, then");
  });
});

describe('§4.3 test 2 — fold hand 2, then call hand 3, wins the session', () => {
  it('folding hand 2 (correct) then calling hand 3 (won hand 1 via raise) wins', () => {
    const store = new MemoryStore();
    let session = fridayEveningAtTable();
    session = playHand1(session, store, 'join game');
    session = say(session, 'raise', store).session; // hand 1: raise always wins
    expect(session.state.flags[ACT2_POKER_WINS]).toBe(1);
    expect(session.state.flags[ACT2_POKER_HAND]).toBe(2);
    session = say(session, 'fold cards', store).session; // hand 2: fold is correct
    expect(session.state.flags[ACT2_POKER_HAND]).toBe(3);
    expect(session.state.flags[ACT2_HEARD_GATE_TALK]).toBe(true);
    const { session: after, events } = say(session, 'call', store); // hand 3: won before -> wins
    expect(after.state.flags[ACT2_POKER_RESULT]).toBe('won');
    expect(after.state.flags[ACT2_POKER_IN_PROGRESS]).toBe(false);
    expect(textOf(events)).toContain('Every week');
  });
});

describe('§4.3 test 3 — raise on hand 2 ends the session', () => {
  it('raising into Whitlock ends the session immediately, as a loss, with no hand 3', () => {
    const store = new MemoryStore();
    let session = fridayEveningAtTable();
    session = playHand1(session, store, 'join game');
    session = say(session, 'fold cards', store).session; // hand 1 neutral
    const { session: after, events } = say(session, 'raise', store); // hand 2 raise
    expect(after.state.flags[ACT2_POKER_RESULT]).toBe('lost');
    expect(after.state.flags[ACT2_POKER_IN_PROGRESS]).toBe(false);
    expect(after.state.flags[ACT2_HEARD_GATE_TALK]).toBeFalsy();
    expect(textOf(events)).toContain('Get him a coffee, Pearl');
  });
});

describe('§4.3 test 4 — a win, then asking Nolan, gets the badge', () => {
  it('winning the session and then asking Nolan about the badge moves it to inventory', () => {
    const store = new MemoryStore();
    let session = fridayEveningAtTable();
    session = playHand1(session, store, 'join game');
    session = say(session, 'raise', store).session; // hand 1 win
    session = say(session, 'fold cards', store).session; // hand 2 correct
    session = say(session, 'call', store).session; // hand 3 win -> session won
    expect(session.state.flags[ACT2_POKER_RESULT]).toBe('won');
    const { session: after, events } = say(session, 'ask nolan about badge', store);
    expect(after.state.flags[ACT2_BADGE_WON]).toBe(true);
    expect(after.state.objects?.[ACT2_NOLAN_BADGE]?.location).toBe('inventory');
    expect(textOf(events)).toContain('There is no Sublevel 6');
  });
});

describe('§4.3 test 5 — the second session, hand 1, grants the same-hands clue', () => {
  it('a session already completed once shows the second-Friday hand-1 variant and grants the clue', () => {
    const store = new MemoryStore();
    const session = fridayEveningAtTable({ flags: { [ACT2_POKER_SESSION]: 1 } });
    const { session: after, events } = say(session, 'join game', store);
    expect(after.state.clues).toContain(ACT2_CLUE_SAME_HANDS);
    expect(textOf(events)).toContain('It is the same three hands');
  });
});

describe('§4.3 test 6 — Dad following coaches, and ignoring him on hand 3 sets act2_beat_dads_advice', () => {
  it('emits coaching lines while following, and winning hand 3 against his word grants M19-S', () => {
    const store = new MemoryStore();
    let session = fridayEveningAtTable({ npcs: { [ACT2_DAD]: { following: true } } });
    const first = say(session, 'join game', store);
    session = first.session;
    expect(textOf(first.events)).toContain("touching the thing on his shirt");
    const hand1Resolution = say(session, 'raise', store); // hand 1 win -> hand 2 deal, with Dad's hand-2 coaching
    session = hand1Resolution.session;
    expect(textOf(hand1Resolution.events)).toContain('Not this one');
    session = say(session, 'fold cards', store).session; // hand 2 correct
    const hand3 = say(session, 'call', store); // hand 3: won before -> wins, against Dad's advice
    session = hand3.session;
    expect(textOf(hand3.events)).toContain("That's not what he does");
    expect(session.state.flags[ACT2_BEAT_DADS_ADVICE]).toBe(true);
    expect(session.state.memories).toContain('act2_mem_m19s');
  });
});

describe('§4.3 test 7 — the second swap is caught, banned, and onOrAfterDay lifts the ban', () => {
  it('a second SWAP DECK in any session is caught and bans for a week; the ban lifts on the due day', () => {
    const store = new MemoryStore();
    let session = fridayEveningAtTable({ objects: { [ACT2_DECK]: { location: 'inventory' } } });
    session = playHand1(session, store, 'join game');
    const swap1 = say(session, 'swap deck', store);
    session = swap1.session;
    expect(session.state.flags[ACT2_CHEATED_ONCE]).toBe(true);
    expect(session.state.flags[ACT2_POKER_WINS]).toBe(1);
    expect(session.state.flags[ACT2_POKER_HAND]).toBe(2);
    const swap2 = say(session, 'swap deck', store);
    session = swap2.session;
    expect(session.state.flags[ACT2_POKER_RESULT]).toBe('caught');
    expect(session.state.flags[ACT2_POKER_BANNED_UNTIL]).toBe(10); // day 3 + 7
    expect(textOf(swap2.events)).toContain("I'm going to remember it");

    // The ban is a due-day flag: SIT before day 10 refuses; on/after day 10 it lifts.
    const stillBanned = say({ ...session, state: { ...session.state, clock: { day: 9, minute: 1080 } } }, 'join game', store);
    expect(textOf(stillBanned.events)).toContain('Not this week');
    const banLifted = say({ ...session, state: { ...session.state, clock: { day: 10, minute: 1080 } } }, 'join game', store);
    expect(textOf(banLifted.events)).not.toContain('Not this week');
    expect(banLifted.session.state.flags[ACT2_POKER_IN_PROGRESS]).toBe(true);
  });
});
