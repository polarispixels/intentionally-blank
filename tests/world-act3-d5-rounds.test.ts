// Stage D5, task H — the Custodian's rounds, the four spotted events, the
// chiller alarm, and Dad on the rig (`docs/superpowers/specs/2026-09-13-
// stage-d5-prose.md` §18-§20, §39; Stage D plan §2 D5's own rounds table).

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
import { npcRoom } from '../src/engine/cond';
import {
  ACT3_ALARM_PULLED,
  ACT3_ALERTNESS,
  ACT3_CLUE_ROUNDS,
  ACT3_COOLING_PLANT,
  ACT3_PIPE_CHASE,
  ACT3_REACHED_S6,
  ACT3_S1_MECHANICAL_GALLERY,
  ACT3_S5_REACTOR_INTERFACE,
  ACT3_S6_ARCHIVE_HUB,
  ACT3_S6_MAINTENANCE_BAY,
  ACT3_WEARING_COVERALLS,
} from '../src/content/world/act3/ids';
import { ACT2_CUSTODIAN, ACT2_DAD } from '../src/content/world/act2/ids';

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

const ALL_TEXT: string[] = [];
function record(t: string): string {
  ALL_TEXT.push(t);
  return t;
}

describe("the Custodian's rounds (D5 §18; Stage D plan §2 D5's rounds table)", () => {
  it('places him in the Bay at 22:30, the Archive Hub at 00:30, S5 at 02:00, the Bay again at 03:30, and nowhere below at 05:00', () => {
    const bay1 = withState({ clock: { day: 1, minute: 1350 } }); // 22:30
    expect(npcRoom(TEST_WORLD, bay1.state, ACT2_CUSTODIAN)).toBe(ACT3_S6_MAINTENANCE_BAY);

    const hub = withState({ clock: { day: 1, minute: 30 } }); // 00:30
    expect(npcRoom(TEST_WORLD, hub.state, ACT2_CUSTODIAN)).toBe(ACT3_S6_ARCHIVE_HUB);

    const s5 = withState({ clock: { day: 1, minute: 120 } }); // 02:00
    expect(npcRoom(TEST_WORLD, s5.state, ACT2_CUSTODIAN)).toBe(ACT3_S5_REACTOR_INTERFACE);

    const bay2 = withState({ clock: { day: 1, minute: 210 } }); // 03:30
    expect(npcRoom(TEST_WORLD, bay2.state, ACT2_CUSTODIAN)).toBe(ACT3_S6_MAINTENANCE_BAY);

    const gone = withState({ clock: { day: 1, minute: 300 } }); // 05:00
    expect(npcRoom(TEST_WORLD, gone.state, ACT2_CUSTODIAN)).toBe('offstage');
  });

  it('puts him in the Pipe Chase at 21:40 only when alertness is at least 1', () => {
    const notAlert = withState({ clock: { day: 1, minute: 1300 } }); // 21:40
    expect(npcRoom(TEST_WORLD, notAlert.state, ACT2_CUSTODIAN)).toBe('offstage');

    const alert = withState({ clock: { day: 1, minute: 1300 }, flags: { [ACT3_ALERTNESS]: 1 } });
    expect(npcRoom(TEST_WORLD, alert.state, ACT2_CUSTODIAN)).toBe(ACT3_PIPE_CHASE);
  });

  it('takes him offstage while the alarm is pulled, even inside a window that would otherwise place him', () => {
    const pulled = withState({ clock: { day: 1, minute: 1350 }, flags: { [ACT3_ALARM_PULLED]: true } }); // 22:30, the Bay window
    expect(npcRoom(TEST_WORLD, pulled.state, ACT2_CUSTODIAN)).toBe('offstage');
  });
});

describe('the four spotted events (D5 §18.1-18.4)', () => {
  it('spots the player in the Bay at 22:30: three beats, a retreat to the Pipe Chase, alertness +1, the rounds clue', () => {
    const store = new MemoryStore();
    const teleported = enter(withState({ clock: { day: 1, minute: 1350 }, location: ACT3_S6_MAINTENANCE_BAY }), ACT3_S6_MAINTENANCE_BAY).session;
    const result = say(teleported, 'look', store);
    const t = record(text(result.events));
    expect(t).toMatch(/There is a man in the room/);
    expect(t).toMatch(/that is worse than if he had/);
    expect(result.session.state.location).toBe(ACT3_PIPE_CHASE);
    expect(result.session.state.flags[ACT3_ALERTNESS]).toBe(1);
    expect(result.session.state.clues).toContain(ACT3_CLUE_ROUNDS);
  });

  it('caps alertness at 2 on repeated sightings', () => {
    const store = new MemoryStore();
    const once = withState({ clock: { day: 1, minute: 1350 }, location: ACT3_S6_MAINTENANCE_BAY, flags: { [ACT3_ALERTNESS]: 1 } });
    const teleported = enter(once, ACT3_S6_MAINTENANCE_BAY).session;
    const firstResult = say(teleported, 'look', store);
    expect(firstResult.session.state.flags[ACT3_ALERTNESS]).toBe(2);

    // Re-enter and get spotted again: alertness must not exceed 2.
    const again = enter({ ...firstResult.session, state: { ...firstResult.session.state, location: ACT3_S6_MAINTENANCE_BAY } }, ACT3_S6_MAINTENANCE_BAY).session;
    const secondResult = say(again, 'look', store);
    expect(secondResult.session.state.flags[ACT3_ALERTNESS]).toBe(2);
  });

  it('spots the player in the Archive Hub, S5, and the Pipe Chase, with the right retreat rooms', () => {
    const store = new MemoryStore();

    const hub = enter(withState({ clock: { day: 1, minute: 30 }, location: ACT3_S6_ARCHIVE_HUB }), ACT3_S6_ARCHIVE_HUB).session;
    const hubResult = say(hub, 'look', store);
    expect(record(text(hubResult.events))).toMatch(/He is at the terminal/);
    expect(hubResult.session.state.location).toBe(ACT3_S6_MAINTENANCE_BAY);

    const s5 = enter(withState({ clock: { day: 1, minute: 120 }, location: ACT3_S5_REACTOR_INTERFACE }), ACT3_S5_REACTOR_INTERFACE).session;
    const s5Result = say(s5, 'look', store);
    expect(record(text(s5Result.events))).toMatch(/The gauge wall has a man in front of it/);
    expect(s5Result.session.state.location).toBe(ACT3_S1_MECHANICAL_GALLERY);

    const chase = enter(withState({ clock: { day: 1, minute: 1300 }, location: ACT3_PIPE_CHASE, flags: { [ACT3_ALERTNESS]: 1 } }), ACT3_PIPE_CHASE).session;
    const chaseResult = say(chase, 'look', store);
    expect(record(text(chaseResult.events))).toMatch(/There is somebody on the ladder below you/);
    expect(chaseResult.session.state.location).toBe(ACT3_COOLING_PLANT);
  });

  it('never fires while the player wears the coveralls — only the once-only nod', () => {
    const store = new MemoryStore();
    const session = enter(withState({ clock: { day: 1, minute: 1350 }, location: ACT3_S6_MAINTENANCE_BAY, flags: { [ACT3_WEARING_COVERALLS]: true } }), ACT3_S6_MAINTENANCE_BAY).session;
    const result = say(session, 'look', store);
    const t = record(text(result.events));
    expect(t).not.toMatch(/There is a man in the room/);
    expect(t).toMatch(/he goes on being in the room/);
    expect(result.session.state.location).toBe(ACT3_S6_MAINTENANCE_BAY); // no retreat
    expect(result.session.state.flags[ACT3_ALERTNESS] ?? 0).toBe(0); // no alertness change

    // Once only: a second turn in the same room must not repeat the nod.
    const secondResult = say(result.session, 'look', store);
    expect(text(secondResult.events)).not.toMatch(/he goes on being in the room/);
  });
});

describe('the chiller alarm (D5 §20)', () => {
  it('PULL ALARM sets the flag and prints §20.2; a second pull prints §20.4; RESET ALARM prints §20.5 without clearing the flag', () => {
    const store = new MemoryStore();
    const session = enter(withState({ location: ACT3_COOLING_PLANT }), ACT3_COOLING_PLANT).session;

    const first = say(session, 'pull alarm', store);
    expect(record(text(first.events))).toMatch(/The glass goes on the second tap/);
    expect(first.session.state.flags[ACT3_ALARM_PULLED]).toBe(true);

    const second = say(first.session, 'pull alarm', store);
    expect(record(text(second.events))).toMatch(/a handle\nthat is already down is not a plan/);
    expect(second.session.state.flags[ACT3_ALARM_PULLED]).toBe(true);

    const reset = say(second.session, 'reset alarm', store);
    expect(record(text(reset.events))).toMatch(/the chiller does not restart/);
    expect(reset.session.state.flags[ACT3_ALARM_PULLED]).toBe(true); // §20.5's own honest failure: this does NOT clear it
  });

  it('takes the Custodian offstage until the automatic reset event clears the flag', () => {
    const store = new MemoryStore();
    const session = enter(withState({ location: ACT3_COOLING_PLANT, clock: { day: 1, minute: 1350 } }), ACT3_COOLING_PLANT).session; // 22:30, would otherwise be the Bay window
    const pulled = say(session, 'pull alarm', store);
    expect(npcRoom(TEST_WORLD, pulled.session.state, ACT2_CUSTODIAN)).toBe('offstage');

    // Walk to an S-room before 30 minutes have passed: still offstage, flag still set.
    const tooSoon = enter({ ...pulled.session, state: { ...pulled.session.state, location: ACT3_S6_MAINTENANCE_BAY } }, ACT3_S6_MAINTENANCE_BAY).session;
    const stillPulled = say(tooSoon, 'wait', store);
    expect(stillPulled.session.state.flags[ACT3_ALARM_PULLED]).toBe(true);

    // Jump the clock forward 30+ minutes and re-enter an S-room: the reset fires.
    const later: SessionState = { ...stillPulled.session, state: { ...stillPulled.session.state, clock: { day: 1, minute: 1385 } } };
    const reentered = enter(later, ACT3_S6_MAINTENANCE_BAY).session;
    const reset = say(reentered, 'wait', store);
    expect(record(text(reset.events))).toMatch(/the note comes back up a tone/);
    expect(reset.session.state.flags[ACT3_ALARM_PULLED]).toBe(false);
  });
});

describe('Dad on the rig (D5 §19)', () => {
  it('the S5 push fires once, with Dad running (following)', () => {
    const store = new MemoryStore();
    const session = enter(withState({ location: ACT3_S5_REACTOR_INTERFACE, npcs: { [ACT2_DAD]: { following: true } } }), ACT3_S5_REACTOR_INTERFACE).session;
    const first = say(session, 'look', store);
    expect(record(text(first.events))).toMatch(/"Stop\."/);

    const second = say(first.session, 'look', store);
    expect(text(second.events)).not.toMatch(/"Stop\."/);
  });

  // Stage F sweep — F2 prose §6 (register 151): the present-case arm.
  // Player and Custodian in the SAME room now reaches the room-agnostic
  // "cloth on glass" text (prepended above the shipped four), not the
  // adjacent-room "Next room along" line, which was wrong from inside the
  // room Dad was describing.
  it('ASK DAD ABOUT ROUNDS renders the present-case arm when the Custodian is in the SAME room as the player', () => {
    const store = new MemoryStore();
    const session = enter(
      withState({ location: ACT3_S6_ARCHIVE_HUB, npcs: { [ACT2_DAD]: { following: true }, [ACT2_CUSTODIAN]: { room: ACT3_S6_ARCHIVE_HUB } } }),
      ACT3_S6_ARCHIVE_HUB,
    ).session;
    const result = say(session, 'ask dad about rounds', store);
    expect(record(text(result.events))).toMatch(/That's cloth on glass/);
    expect(text(result.events)).not.toMatch(/Next room along/);
  });

  // The shipped arm is unchanged and still fires when the Custodian is
  // elsewhere — "next room along" reads correctly from the Bay while he is
  // in the Hub.
  it('ASK DAD ABOUT ROUNDS still renders the shipped "next room along" arm when the Custodian is in an ADJACENT room', () => {
    const store = new MemoryStore();
    const session = enter(
      withState({ location: ACT3_S6_MAINTENANCE_BAY, npcs: { [ACT2_DAD]: { following: true }, [ACT2_CUSTODIAN]: { room: ACT3_S6_ARCHIVE_HUB } } }),
      ACT3_S6_MAINTENANCE_BAY,
    ).session;
    const result = say(session, 'ask dad about rounds', store);
    expect(record(text(result.events))).toMatch(/Next room along\. The one with the machine in it/);
  });

  // Stage F sweep — `topic_how_do_you_know`'s word list used to include
  // "hearing," which (declared first, no `when` gate) permanently shadowed
  // `topic_hearing`'s own Senate-hearing topic for that exact word
  // (`resolveTopic` takes the first array match). "hearing" now belongs to
  // `topic_hearing` alone; "listening"/"how do you know" still reach the
  // method topic.
  it('ASK DAD ABOUT HEARING reaches the Senate-hearing topic, not shadowed by topic_how_do_you_know', () => {
    const store = new MemoryStore();
    const session = enter(withState({ npcs: { [ACT2_DAD]: { following: true } } }), ACT3_S6_MAINTENANCE_BAY).session;
    const result = say(session, 'ask dad about hearing', store);
    expect(record(text(result.events))).toMatch(/siting subcommittee/i);
  });

  it('ASK DAD ABOUT HOW DO YOU KNOW still reaches its own topic', () => {
    const store = new MemoryStore();
    const session = enter(withState({ npcs: { [ACT2_DAD]: { following: true } } }), ACT3_S6_MAINTENANCE_BAY).session;
    const result = say(session, 'ask dad about how do you know', store);
    expect(record(text(result.events))).toMatch(/You put a man in a building with no eyes/);
  });

  it('ASK DAD ABOUT THE CHAIRS only answers once act3_reached_s6 is set', () => {
    const store = new MemoryStore();
    // Deliberately NOT the Bay: entering it (`enter()` runs the room's own
    // `onEnter`) sets `act3_reached_s6` itself (§2's own flag table — "set
    // by the first onEnter of the Bay"), which would make this half of the
    // test vacuous. The Pipe Chase never touches that flag.
    const notYet = enter(withState({ location: ACT3_PIPE_CHASE, npcs: { [ACT2_DAD]: { following: true } } }), ACT3_PIPE_CHASE).session;
    const before = say(notYet, 'ask dad about the chairs', store);
    expect(text(before.events)).not.toMatch(/Say the bit about the sheepskin again/);

    const reached = enter(
      withState({ location: ACT3_S6_MAINTENANCE_BAY, npcs: { [ACT2_DAD]: { following: true } }, flags: { [ACT3_REACHED_S6]: true } }),
      ACT3_S6_MAINTENANCE_BAY,
    ).session;
    const after = say(reached, 'ask dad about the chairs', store);
    expect(record(text(after.events))).toMatch(/Say the bit about the sheepskin again/);
  });
});

describe('no leaks', () => {
  it('none of this task\'s own collected responses leak an act2_/act3_ id or an unfilled {template}', () => {
    expect(ALL_TEXT.length).toBeGreaterThan(0);
    for (const t of ALL_TEXT) {
      expect(t).not.toMatch(/act2_/);
      expect(t).not.toMatch(/act3_/);
      expect(t).not.toMatch(/\{name\}/);
      expect(t).not.toMatch(/\{dobj\}/);
      expect(t).not.toMatch(/\{iobj\}/);
      expect(t).not.toMatch(/\{topic\}/);
    }
  });
});
