// Act I Wave 5 — the Close-out
// (`docs/superpowers/specs/2026-09-06-act1-wave5-close-out-prose.md`
// §8-§12, §14-§16). Exercises the whole close-out chain end to end, through
// the real parser/turn pipeline (same technique `world-act1-wave4-jack.
// test.ts` uses) — the concurrent Nolan's Yard task's own trash puzzle
// (§4-§7) is NOT re-tested here (see `world-act1-wave5-yard.test.ts`);
// `SHREDDED_STRIPS`/`KEYRING`/`CLAIM_TICKET`/etc. are carried directly into
// inventory below to isolate this task's own responses from that puzzle.

import { describe, expect, it } from 'vitest';
import { validate } from '../src/engine/validate';
import { WORLD } from '../src/content/world/act1/world';
import { renderArrival } from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import type { ObjectId } from '../src/engine/ids';
import {
  CASH_ENVELOPE,
  CHAIR_LEG,
  CLAIM_TICKET,
  CLUE_CLAIM_TICKET,
  CLUE_CUSTODIAN_SEEN,
  CLUE_INTACT_POLAROIDS,
  CLUE_PAID_IN_CASH,
  CLUE_S6_REVOKED,
  DRAWER,
  FLAG_ASSEMBLED_STRIPS,
  FLAG_DRAWER_OPEN,
  FLAG_JACK_GAVE_KEYS,
  FLAG_MET_JACK,
  FLAG_OFFERED_THE_RIDE,
  FLAG_OPENED_BOX_141,
  FLAG_REGISTER_IMPRESSION_FOUND,
  FLAG_TOLD_JACK_ABOUT_ROOM,
  FRONT_DESK,
  INTACT_POLAROIDS,
  JACKS_MOTEL,
  KEYRING,
  MAIN_STREET,
  MATCHBOOK,
  PIE_BOX,
  POST_OFFICE,
  QUESTION_NOTEBOOK,
  QUESTION_WALL_DRUG,
  SHREDDED_STRIPS,
  SUNDOWN_DINER,
  WORK_ORDER,
  YOUR_ROOM,
} from '../src/content/world/act1/ids';
import { ACT2_RODE_NORTH, ACT2_STARTED } from '../src/content/world/act2/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-06T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

function fresh(): SessionState {
  return createSession(TEST_WORLD);
}

/** Teleports a fresh session into `room`, with the arrival render already applied — same technique `world-act1-wave4-jack.test.ts`'s own `enterMotel`/`enterDiner` use. */
function teleport(room: typeof YOUR_ROOM): { session: SessionState; events: GameEvent[] } {
  const start = fresh();
  const teleported: GameState = { ...start.state, location: room };
  const { state, events } = renderArrival(TEST_WORLD, teleported);
  return { session: { ...start, state }, events };
}

function say(session: SessionState, text: string, store: MemoryStore): { session: SessionState; events: GameEvent[] } {
  const view = buildScopeView(TEST_WORLD, session.state, vocab);
  const outcome = new DeterministicParser().interpret(text, view);
  const result = takeTurn(TEST_WORLD, session, vocab, outcome, opts(store));
  return { session: result.session, events: result.events };
}

/** Carries objects straight into inventory, bypassing whatever normally grants them — same technique `world-act1-wave4-jack.test.ts`'s own `carry` uses. */
function carry(session: SessionState, ...ids: ObjectId[]): SessionState {
  const objects = { ...session.state.objects };
  for (const id of ids) objects[id] = { ...objects[id], location: 'inventory', hidden: false };
  return { ...session, state: { ...session.state, objects } };
}

function setFlags(session: SessionState, flags: Record<string, boolean>): SessionState {
  return { ...session, state: { ...session.state, flags: { ...session.state.flags, ...flags } } };
}

function text(events: GameEvent[]): string {
  return events
    .filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line')
    .map((e) => e.text)
    .join('\n');
}

function systemLines(events: GameEvent[]): string[] {
  return events.filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line' && e.kind === 'system').map((e) => e.text);
}

function clueIds(events: GameEvent[]): string[] {
  return events.filter((e): e is Extract<GameEvent, { type: 'clue' }> => e.type === 'clue').map((e) => e.id);
}

function held(session: SessionState, id: ObjectId): boolean {
  return session.state.objects[id]?.location === 'inventory';
}

describe('validate — Act I Wave 5 (Close-out)', () => {
  it('produces zero errors', () => {
    expect(validate(TEST_WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// P2 — the chair, the leg, the drawer, the envelope, the matchbook
// ---------------------------------------------------------------------------

describe('P2 — the chair, the leg, and the drawer', () => {
  it('TAKE LEG grants the chair leg; PRY DRAWER without it stays the shipped refusal', () => {
    const store = new MemoryStore();
    let session = fresh();
    session = say(session, 'pull chain', store).session; // light the room
    const examine = say(session, 'examine chair', store);
    expect(text(examine.events)).toContain('yard of hard maple with a taper on it');
    session = examine.session;

    const pryNoLeg = say(session, 'pry drawer', store);
    expect(text(pryNoLeg.events)).toContain('Somebody has already tried this');
    session = pryNoLeg.session;
    expect(session.state.flags[FLAG_DRAWER_OPEN]).not.toBe(true);

    const takeLeg = say(session, 'take leg', store);
    expect(text(takeLeg.events)).toContain('noise like a knuckle');
    session = takeLeg.session;
    expect(held(session, CHAIR_LEG)).toBe(true);
  });

  it('PRY DRAWER (holding the leg) opens the drawer for real, and PRY DRAWER WITH LEG reaches the same handler', () => {
    const store = new MemoryStore();
    let session = fresh();
    session = say(session, 'pull chain', store).session;
    session = carry(session, CHAIR_LEG);

    const pry = say(session, 'pry drawer', store);
    expect(text(pry.events)).toContain('It goes on the fourth');
    session = pry.session;
    expect(session.state.flags[FLAG_DRAWER_OPEN]).toBe(true);
    expect(session.state.objects[DRAWER]?.open).toBe(true);

    const take = say(session, 'take envelope', store);
    expect(held(take.session, CASH_ENVELOPE)).toBe(true);
    session = take.session;

    const takeMatch = say(session, 'take matchbook', store);
    expect(held(takeMatch.session, MATCHBOOK)).toBe(true);
    session = takeMatch.session;

    const readMatch = say(session, 'read matchbook', store);
    expect(text(readMatch.events)).toContain('THE ARROWHEAD');
    expect(text(readMatch.events)).toContain('VACANCY');

    // Same handler reached with the instrument named explicitly.
    let fresh2 = fresh();
    fresh2 = say(fresh2, 'pull chain', new MemoryStore()).session;
    fresh2 = carry(fresh2, CHAIR_LEG);
    const pryWith = say(fresh2, 'pry drawer with leg', new MemoryStore());
    expect(text(pryWith.events)).toContain('It goes on the fourth');
  });

  it('the envelope: rule 2 (no met_jack) then rule 1 (met_jack) — both set clue_paid_in_cash', () => {
    const store = new MemoryStore();
    let session = fresh();
    session = say(session, 'pull chain', store).session;
    session = carry(session, CASH_ENVELOPE);

    const rule2 = say(session, 'open envelope', store);
    expect(text(rule2.events)).toContain('does not keep records');
    expect(clueIds(rule2.events)).toContain(CLUE_PAID_IN_CASH);
    session = rule2.session;

    session = setFlags(session, { [FLAG_MET_JACK]: true });
    const rule1 = say(session, 'count money', store);
    expect(text(rule1.events)).toContain('rest of the sentence, in a drawer, under a splinter');
  });
});

// ---------------------------------------------------------------------------
// P7 — the shredded work order
// ---------------------------------------------------------------------------

describe('P7 — ASSEMBLE STRIPS', () => {
  it('refuses outdoors (no table in scope), succeeds at a table, and READ WORK ORDER sets the clue', () => {
    const store = new MemoryStore();
    const { session: outdoors } = teleport(MAIN_STREET);
    const carriedOutdoors = carry(outdoors, SHREDDED_STRIPS);
    const refusal = say(carriedOutdoors, 'assemble strips', store);
    expect(text(refusal.events)).toContain('Somewhere with a table');

    let atDesk = fresh();
    atDesk = say(atDesk, 'pull chain', store).session;
    atDesk = carry(atDesk, SHREDDED_STRIPS);
    const success = say(atDesk, 'assemble strips', store);
    expect(text(success.events)).toContain('most of a form');
    let session = success.session;
    expect(session.state.flags[FLAG_ASSEMBLED_STRIPS]).toBe(true);
    expect(held(session, WORK_ORDER)).toBe(true);

    const read = say(session, 'read work order', store);
    expect(text(read.events)).toContain('ACCESS REVOKED');
    expect(clueIds(read.events)).toContain(CLUE_S6_REVOKED);
  });

  it('READ STRIPS reaches the same reassembly as ASSEMBLE STRIPS', () => {
    const store = new MemoryStore();
    let session = fresh();
    session = say(session, 'pull chain', store).session;
    session = carry(session, SHREDDED_STRIPS);
    const { events } = say(session, 'read strips', store);
    expect(text(events)).toContain('most of a form');
  });
});

// ---------------------------------------------------------------------------
// P8 — the keys, the tag, and the box
// ---------------------------------------------------------------------------

describe('P8 — Jack hands over the ring', () => {
  it('TAKE KEYRING refuses before jack_gave_keys; SHOW WORK ORDER TO JACK hands it over for real', () => {
    const store = new MemoryStore();
    const { session: motel } = teleport(JACKS_MOTEL);

    const refusal = say(motel, 'take keyring', store);
    expect(text(refusal.events)).toContain("Leave those");

    const withOrder = carry(motel, WORK_ORDER);
    const handover = say(withOrder, 'show work order to jack', store);
    expect(text(handover.events)).toContain('If they open something, open it.');
    let session = handover.session;
    expect(session.state.flags[FLAG_JACK_GAVE_KEYS]).toBe(true);
    expect(held(session, KEYRING)).toBe(true);

    const examine = say(session, 'examine keyring', store);
    expect(text(examine.events)).toContain('a flat brass tag worn almost smooth');
  });

  it('ASK JACK ABOUT S6 (once holding the work order) reaches the same hand-over text', () => {
    const store = new MemoryStore();
    const { session: motel } = teleport(JACKS_MOTEL);
    const withOrder = carry(motel, WORK_ORDER);
    const { events } = say(withOrder, 'ask jack about s6', store);
    expect(text(events)).toContain('"Six."');
  });
});

describe('P8 — opening box 141', () => {
  it('OPEN BOX without the keyring stays the shipped refusal; with it, opens for real', () => {
    const store = new MemoryStore();
    const { session: office } = teleport(POST_OFFICE);

    const noKey = say(office, 'open box', store);
    expect(text(noKey.events)).toContain('means nothing without the three letters');

    const withKey = carry(office, KEYRING);
    const open = say(withKey, 'open box', store);
    expect(text(open.events)).toContain('There is no click');
    const session = open.session;
    expect(session.state.flags[FLAG_OPENED_BOX_141]).toBe(true);
    expect(held(session, INTACT_POLAROIDS)).toBe(true);
    expect(held(session, CLAIM_TICKET)).toBe(true);
  });

  it('DIAL LETTERS reaches the same handler', () => {
    const store = new MemoryStore();
    const { session: office } = teleport(POST_OFFICE);
    const withKey = carry(office, KEYRING);
    const { events } = say(withKey, 'dial letters', store);
    expect(text(events)).toContain('There is no click');
  });

  it('the Polaroids and the claim ticket grant their clues; the claim ticket opens q_wall_drug', () => {
    const store = new MemoryStore();
    const { session: office } = teleport(POST_OFFICE);
    let session = carry(office, INTACT_POLAROIDS, CLAIM_TICKET);

    const polaroids = say(session, 'examine polaroids', store);
    expect(clueIds(polaroids.events)).toContain(CLUE_INTACT_POLAROIDS);
    session = polaroids.session;

    const ticket = say(session, 'examine ticket', store);
    expect(clueIds(ticket.events)).toContain(CLUE_CLAIM_TICKET);
    session = ticket.session;
    expect(session.state.questions[QUESTION_WALL_DRUG]).toBe('open');
  });
});

// ---------------------------------------------------------------------------
// The Act I boundary
// ---------------------------------------------------------------------------

describe('The Act I boundary — the ride to Wall Drug', () => {
  // D1 amendment (Stage D1 prose doc §21; plan §2 D1's own "the boundary
  // moves"): `jack.ts`'s `jackWallDrugEffects` no longer calls
  // `END_OF_BUILD_SCRIPT` — the ride now exists, so this topic no longer
  // ends the build. It routes to `act2_travel` instead (§3's own ruling):
  // the first ask sets `offered_the_ride` and renders the first-ride north
  // scene (8 beats, `act2_rode_north`/`act2_started` set); a second ask
  // renders the shorter repeat scene (2 beats). Neither ever emits a
  // system line. This test is a deliberate, reported rewrite of a wave-5
  // assertion this task's own change makes false — see this task's report.
  it('routes to the travel script instead of firing END OF BUILD', () => {
    const store = new MemoryStore();
    const { session: motel } = teleport(JACKS_MOTEL);
    const withTicket = carry(motel, CLAIM_TICKET);

    const first = say(withTicket, 'ask jack about wall drug', store);
    expect(text(first.events)).toContain('Get in.');
    expect(text(first.events)).toContain('cattle guard'); // the first-ride scene's own beat 1
    expect(systemLines(first.events)).toEqual([]);
    let session = first.session;
    expect(session.state.flags[FLAG_OFFERED_THE_RIDE]).toBe(true);
    expect(session.state.flags[ACT2_RODE_NORTH]).toBe(true);
    expect(session.state.flags[ACT2_STARTED]).toBe(true);

    const second = say(session, 'ask jack about wall drug', store);
    expect(text(second.events)).toContain('Get in.');
    expect(systemLines(second.events)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Marlow — P4's small completion
// ---------------------------------------------------------------------------

describe("Marlow — topic_visitor's new rule 1", () => {
  it('fires once register_impression_found and (clue_paid_in_cash or met_jack) both hold', () => {
    const store = new MemoryStore();
    const { session: desk } = teleport(FRONT_DESK);
    const gated = setFlags(desk, { [FLAG_REGISTER_IMPRESSION_FOUND]: true, [FLAG_MET_JACK]: true });
    const { events } = say(gated, 'ask marlow about visitor', store);
    expect(text(events)).toContain('wiped his feet on the way in');
    expect(clueIds(events)).toContain(CLUE_CUSTODIAN_SEEN);
  });

  it('the shipped rule (register_impression_found alone) still answers otherwise', () => {
    const store = new MemoryStore();
    const { session: desk } = teleport(FRONT_DESK);
    const gated = setFlags(desk, { [FLAG_REGISTER_IMPRESSION_FOUND]: true });
    const { events } = say(gated, 'ask marlow about visitor', store);
    expect(text(events)).toContain('starts three times and gets nowhere');
  });
});

// ---------------------------------------------------------------------------
// Pearl — the pie to go
// ---------------------------------------------------------------------------

describe('Pearl — topic_pie_to_go', () => {
  it('rule 1 grants pie_box; rule 2 answers a second ask', () => {
    const store = new MemoryStore();
    const { session: diner } = teleport(SUNDOWN_DINER);
    const first = say(diner, 'ask pearl about pie', store);
    expect(text(first.events)).toContain('Bring the box back or don\'t');
    const session = first.session;
    expect(held(session, PIE_BOX)).toBe(true);

    const second = say(session, 'ask pearl about pie', store);
    expect(text(second.events)).toContain("You've got one.");
  });
});

// ---------------------------------------------------------------------------
// The two open questions
// ---------------------------------------------------------------------------

describe('The two hand-off questions', () => {
  it('q_notebook opens on told_jack_about_room', () => {
    const store = new MemoryStore();
    const { session: motel } = teleport(JACKS_MOTEL);
    const { session } = say(motel, 'tell jack about room', store);
    expect(session.state.flags[FLAG_TOLD_JACK_ABOUT_ROOM]).toBe(true);
    expect(session.state.questions[QUESTION_NOTEBOOK]).toBe('open');
  });
});
