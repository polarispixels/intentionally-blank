// Stage E1, task M — Luke, the escort, R16, and the boundary
// (`docs/superpowers/specs/2026-09-18-stage-e1-prose.md` §11, §12, §20-§23,
// §29, §33, §37, §38). Same session/turn pipeline pattern as
// `tests/world-act4-e0-sheriff.test.ts` / `tests/world-act3-d5-hub.test.ts`.

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
import { ACT2_NOTEBOOK, ACT2_RETURNED_LETTER } from '../src/content/world/act2/ids';
import { FEDORA, INTACT_POLAROIDS } from '../src/content/world/act1/ids';
import { ACT3_CLUE_ROOT_REFUSES, ACT3_CLUE_S6_DOOR_REFUSES, ACT3_PIPE_CHASE, ACT3_S5_REACTOR_INTERFACE, ACT3_S6_ARCHIVE_HUB } from '../src/content/world/act3/ids';
import { doorEscortText } from '../src/content/world/act4/luke';
import { lukeAtS5Text } from '../src/content/world/act3/s5ReactorInterface';
import { s6DoorLukeText, s6StairText } from '../src/content/world/act3/objects/s5ReactorInterface';
import { ACT4_LUKE_AT_ROOT_TEXT } from '../src/content/world/act4/luke';
import {
  ACT4_CLUE_LUKES_REASON,
  ACT4_CLUE_LUKES_WORD,
  ACT4_CLUE_NOT_THE_USER,
  ACT4_CLUE_TWO_THING_DOOR,
  ACT4_LUKE,
  ACT4_LUKE_AT_ROOT,
  ACT4_LUKE_GONE,
  ACT4_LUKE_MET,
  ACT4_LUKE_WILL_ESCORT,
  ACT4_S5_DOWN_GATE,
  ACT4_S6_DOOR_OPEN,
  ACT4_STAGING_AREA,
  ACT4_STARTED,
  ACT4_VISIT_DAY,
  ACT4_VISIT_OVER_DAY,
  ACT4_Q_WHO_OUTRANKS_IT,
} from '../src/content/world/act4/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-18T04:00:00.000Z', gameVersion: 'test-0.0.0' };
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

describe('validate — Stage E1, task M', () => {
  it('produces no errors', () => {
    expect(validate(TEST_WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

/** Luke pinned at the Staging Area, the visit open. */
function withLukeAtStaging(patch: Partial<GameState> = {}): SessionState {
  return withState({
    ...patch,
    // `act4_visit_over_day` defaults to 0 (unset), and `onOrAfterDay`
    // reads any number, including 0, as due — pinned far in the future here
    // so the missed-window event (`events.ts`) never trips just because a
    // test sets `act4_started`/Luke's presence directly, bypassing the real
    // `act4_ev_start`/`act4_set_visit_day` pipeline that always sets both
    // together in play.
    flags: { [ACT4_STARTED]: true, [ACT4_VISIT_OVER_DAY]: 999, ...(patch.flags ?? {}) },
    npcs: { [ACT4_LUKE]: { room: ACT4_STAGING_AREA }, ...(patch.npcs ?? {}) },
  });
}

describe('Luke — description, greeting, unknownTopic', () => {
  it('EXAMINE LUKE', () => {
    const store = new MemoryStore();
    const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
    const { events } = say(session, 'examine luke', store);
    expect(text(events)).toMatch(/Wide face, heavy jaw/);
  });

  it('first HELLO — rule 1', () => {
    const store = new MemoryStore();
    const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
    const { events } = say(session, 'hello luke', store);
    expect(text(events)).toMatch(/You'll be the one who folds paper/);
  });

  it('second HELLO — rule 2, unconditional', () => {
    const store = new MemoryStore();
    const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
    const { session: after } = say(session, 'hello luke', store);
    const { events } = say(after, 'hello luke', store);
    expect(text(events)).toMatch(/coat still over the chair/);
  });

  it('unknownTopic rotation — attempt 4 does not repeat the long first line (firstOnce)', () => {
    const store = new MemoryStore();
    const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
    const { session: s1, events: e1 } = say(session, 'ask luke about weather', store);
    const { session: s2, events: e2 } = say(s1, 'ask luke about weather', store);
    const { session: s3, events: e3 } = say(s2, 'ask luke about weather', store);
    const { events: e4 } = say(s3, 'ask luke about weather', store);

    expect(text(e1)).toMatch(/I don't know/);
    expect(text(e2)).toMatch(/standing next to the one you asked/);
    expect(text(e3)).toMatch(/outside my competence/i);
    // Attempt 4 wraps into the two-element rotation (index 1 again) — it
    // must NOT repeat attempt 1's long first line.
    expect(text(e4)).not.toMatch(/I don't know/);
    expect(text(e4)).toMatch(/standing next to the one you asked/);
  });
});

describe('Luke — eight topics', () => {
  it('ASK LUKE ABOUT LETTERS — R15', () => {
    const store = new MemoryStore();
    const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
    const { events } = say(session, 'ask luke about letters', store);
    expect(text(events)).toMatch(/I kept them/);
  });

  it('ASK LUKE ABOUT NOUMENA grants the clue', () => {
    const store = new MemoryStore();
    const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
    const { session: after, events } = say(session, 'ask luke about noumena', store);
    expect(text(events)).toMatch(/You spelled it right/);
    expect(after.state.clues).toContain(ACT4_CLUE_LUKES_WORD);
  });

  it('ASK LUKE ABOUT JACK', () => {
    const store = new MemoryStore();
    const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
    const { events } = say(session, 'ask luke about jack', store);
    expect(text(events)).toMatch(/Is he well\?/);
  });

  it('ASK LUKE ABOUT JULES grants the clue — canon 110', () => {
    const store = new MemoryStore();
    const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
    const { session: after, events } = say(session, 'ask luke about jules', store);
    expect(text(events)).toMatch(/there was never an I/);
    expect(after.state.clues).toContain(ACT4_CLUE_LUKES_REASON);
  });

  it('ASK LUKE ABOUT FACILITY', () => {
    const store = new MemoryStore();
    const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
    const { events } = say(session, 'ask luke about facility', store);
    expect(text(events)).toMatch(/provenance of this building/);
  });

  it('ASK LUKE ABOUT SISSY', () => {
    const store = new MemoryStore();
    const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
    const { events } = say(session, 'ask luke about sissy', store);
    expect(text(events)).toMatch(/writes to everybody/);
  });

  it('ASK LUKE ABOUT DETAIL', () => {
    const store = new MemoryStore();
    const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
    const { events } = say(session, 'ask luke about detail', store);
    expect(text(events)).toMatch(/They are very good/);
  });

  describe('topic_door — two rules, then the escort', () => {
    it('before the clue — "Bring me a door"', () => {
      const store = new MemoryStore();
      const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
      const { session: after, events } = say(session, 'ask luke about door', store);
      expect(text(events)).toMatch(/Bring me a door/);
      expect(after.state.flags[ACT4_LUKE_WILL_ESCORT]).not.toBe(true);
    });

    it('with the S6 clue — "Take me to it", sets act4_luke_will_escort', () => {
      const store = new MemoryStore();
      const { session } = enter(withLukeAtStaging({ clues: [ACT3_CLUE_S6_DOOR_REFUSES] }), ACT4_STAGING_AREA);
      const { session: after, events } = say(session, 'ask luke about door', store);
      expect(text(events)).toMatch(/Take me to it/);
      expect(after.state.flags[ACT4_LUKE_WILL_ESCORT]).toBe(true);
    });
  });
});

describe('§12 — the four showResponses', () => {
  it('SHOW NOTEBOOK TO LUKE', () => {
    const store = new MemoryStore();
    const base = withLukeAtStaging({ objects: { [ACT2_NOTEBOOK]: { location: 'inventory' } } });
    const { session } = enter(base, ACT4_STAGING_AREA);
    const { events } = say(session, 'show notebook to luke', store);
    expect(text(events)).toMatch(/Whose is this\?/);
  });

  it('SHOW RETURNED LETTER TO LUKE', () => {
    const store = new MemoryStore();
    const base = withLukeAtStaging({ objects: { [ACT2_RETURNED_LETTER]: { location: 'inventory' } } });
    const { session } = enter(base, ACT4_STAGING_AREA);
    const { events } = say(session, 'show returned letter to luke', store);
    expect(text(events)).toMatch(/It's sealed/);
  });

  it('SHOW POLAROIDS TO LUKE', () => {
    const store = new MemoryStore();
    const base = withLukeAtStaging({ objects: { [INTACT_POLAROIDS]: { location: 'inventory' } } });
    const { session } = enter(base, ACT4_STAGING_AREA);
    const { events } = say(session, 'show polaroids to luke', store);
    expect(text(events)).toMatch(/That's the porch/);
  });

  it('SHOW FEDORA TO LUKE', () => {
    const store = new MemoryStore();
    const base = withLukeAtStaging({ objects: { [FEDORA]: { location: 'inventory' } } });
    const { session } = enter(base, ACT4_STAGING_AREA);
    const { events } = say(session, 'show fedora to luke', store);
    expect(text(events)).toMatch(/It's a hat/);
  });
});

describe('§20 — the escort', () => {
  it('a second ask, once act4_luke_will_escort holds, fires the escort', () => {
    const store = new MemoryStore();
    const base = withLukeAtStaging({ flags: { [ACT4_STARTED]: true, [ACT4_LUKE_WILL_ESCORT]: true }, clock: { day: 1, minute: 500 } });
    const { session } = enter(base, ACT4_STAGING_AREA);
    const { session: after, events } = say(session, 'ask luke about door', store);
    const rendered = text(events);
    expect(rendered).toMatch(/The leaves come together/);
    expect(rendered).toMatch(/and then S5/);
    // The room's own Luke-present arrival paragraph renders too, via the
    // ordinary post-`goto` arrival path (not said twice by the escort
    // script itself).
    expect(rendered).toMatch(/stops at the end wall/);
    expect(after.state.location).toBe(ACT3_S5_REACTOR_INTERFACE);
    expect(after.state.npcs[ACT4_LUKE]?.following).toBe(true);
    expect(after.state.clock.minute).toBe(520);
  });

  it('FOLLOW LUKE, once act4_luke_will_escort holds, reaches the same escort', () => {
    const store = new MemoryStore();
    const base = withLukeAtStaging({ flags: { [ACT4_STARTED]: true, [ACT4_LUKE_WILL_ESCORT]: true } });
    const { session } = enter(base, ACT4_STAGING_AREA);
    const { session: after, events } = say(session, 'follow luke', store);
    expect(text(events)).toMatch(/The leaves come together/);
    expect(after.state.location).toBe(ACT3_S5_REACTOR_INTERFACE);
  });

  it('FOLLOW LUKE before act4_luke_will_escort gives the shipped refusal', () => {
    const store = new MemoryStore();
    const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
    const { events } = say(session, 'follow luke', store);
    expect(text(events)).toMatch(/I'm not going anywhere/);
  });
});

/** Luke pinned at S5, following (post-escort state), the door not yet open. */
function atS5WithLuke(patch: Partial<GameState> = {}): SessionState {
  return withState({
    ...patch,
    flags: { [ACT4_STARTED]: true, [ACT4_LUKE_WILL_ESCORT]: true, [ACT4_VISIT_OVER_DAY]: 999, ...(patch.flags ?? {}) },
    npcs: { [ACT4_LUKE]: { room: ACT3_S5_REACTOR_INTERFACE, following: true }, ...(patch.npcs ?? {}) },
  });
}

describe('§21 — the door with two things, Luke present', () => {
  it('OPEN S6 DOOR sets act4_s6_door_open (permanent) and grants the clue', () => {
    const store = new MemoryStore();
    const { session } = enter(atS5WithLuke(), ACT3_S5_REACTOR_INTERFACE);
    const { session: after, events } = say(session, 'open s6 door', store);
    expect(text(events)).toMatch(/Behind it there is a stair/);
    expect(after.state.flags[ACT4_S6_DOOR_OPEN]).toBe(true);
    expect(after.state.clues).toContain(ACT4_CLUE_TWO_THING_DOOR);
  });

  it('the shipped refusal still answers alone, without Luke', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_STARTED]: true } }), ACT3_S5_REACTOR_INTERFACE);
    const { session: after, events } = say(session, 'open s6 door', store);
    expect(text(events)).toMatch(/nothing on it to move it by/);
    expect(after.state.flags[ACT4_S6_DOOR_OPEN]).not.toBe(true);
  });
});

describe('§21.1 — the stair, in-world, not a boundary', () => {
  // The flag alone is not the mechanism — §21's own effects also close the
  // stub gate behind the shipped `down` exit (`{ setState: [act4_s5_down_
  // gate, 'open', false] }`); fabricating "already open" state for this
  // test therefore closes the gate object explicitly too, exactly as §21's
  // own effects would have.
  function withStairOpen(patch: Partial<GameState> = {}): SessionState {
    return atS5WithLuke({
      ...patch,
      flags: { [ACT4_STARTED]: true, [ACT4_S6_DOOR_OPEN]: true, ...(patch.flags ?? {}) },
      objects: { [ACT4_S5_DOWN_GATE]: { open: false }, ...(patch.objects ?? {}) },
    });
  }

  it('GO DOWN, once open, gives the stair text and does not move the player', () => {
    const store = new MemoryStore();
    const { session } = enter(withStairOpen(), ACT3_S5_REACTOR_INTERFACE);
    const { session: after, events } = say(session, 'down', store);
    expect(text(events)).toMatch(/Poured steps going down out of the light/);
    expect(text(events)).not.toMatch(/END OF BUILD/);
    expect(after.state.location).toBe(ACT3_S5_REACTOR_INTERFACE);
  });

  it('ENTER STAIR reaches the same text, and does not move the player', () => {
    const store = new MemoryStore();
    const { session } = enter(withStairOpen(), ACT3_S5_REACTOR_INTERFACE);
    const { session: after, events } = say(session, 'enter stair', store);
    expect(text(events)).toMatch(/Poured steps going down out of the light/);
    expect(after.state.location).toBe(ACT3_S5_REACTOR_INTERFACE);
  });

  it('DOWN still reaches the Pipe Chase while the S6 door is shut', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_STARTED]: true } }), ACT3_S5_REACTOR_INTERFACE);
    const { session: after } = say(session, 'down', store);
    expect(after.state.location).toBe(ACT3_PIPE_CHASE);
  });
});

describe('§22/§23 — the reader at the bottom of the well, then he goes up', () => {
  it('leading Luke into the Hub (following) fires the scene once, grants the clue, answers the question, and sends him offstage', () => {
    const store = new MemoryStore();
    const base = withState({
      flags: { [ACT4_STARTED]: true },
      npcs: { [ACT4_LUKE]: { following: true } },
    });
    const { session, events } = enter(base, ACT3_S6_ARCHIVE_HUB);
    const rendered = text(events);
    expect(rendered).toMatch(/He follows you the length of Sublevel 6/);
    expect(rendered).toMatch(/He is already in the lift/);
    expect(session.state.flags[ACT4_LUKE_AT_ROOT]).toBe(true);
    expect(session.state.clues).toContain(ACT4_CLUE_NOT_THE_USER);
    expect(session.state.questions?.[ACT4_Q_WHO_OUTRANKS_IT]).toBe('answered');
    expect(session.state.flags[ACT4_LUKE_GONE]).toBe(true);
    expect(session.state.npcs[ACT4_LUKE]?.following).toBe(false);
    expect(session.state.npcs[ACT4_LUKE]?.room).toBe('offstage');

    // Re-entering does not repeat the scene (he is offstage anyway, but the
    // flag guard holds regardless of trigger path).
    const { events: again } = enter(session, ACT3_S6_ARCHIVE_HUB);
    expect(text(again)).not.toMatch(/He follows you the length of Sublevel 6/);
  });

  it('USE READER, with him present, reaches the same scene (the root door\'s own handler, belt and suspenders alongside onEnter)', () => {
    const store = new MemoryStore();
    // Deliberately not `enter()`'d — a genuine arrival with Luke already
    // present always resolves the scene via the room's own `onEnter` first
    // (the test just above this one). This constructs "already standing
    // here, and he already is too" with no fresh room-entry event pending,
    // to exercise the root door's own verb-handler path in isolation.
    const session = withState({
      location: ACT3_S6_ARCHIVE_HUB,
      flags: { [ACT4_STARTED]: true },
      npcs: { [ACT4_LUKE]: { room: ACT3_S6_ARCHIVE_HUB } },
    });
    const { session: after, events } = say(session, 'use reader', store);
    expect(text(events)).toMatch(/He follows you the length of Sublevel 6/);
    expect(after.state.flags[ACT4_LUKE_GONE]).toBe(true);
  });

  it('once already at root, a repeat attempt falls to the shipped refusal', () => {
    const store = new MemoryStore();
    const base = withState({ flags: { [ACT4_STARTED]: true, [ACT4_LUKE_AT_ROOT]: true } });
    const { session } = enter(base, ACT3_S6_ARCHIVE_HUB);
    const { events } = say(session, 'open door', store);
    expect(text(events)).not.toMatch(/He follows you the length of Sublevel 6/);
  });
});

describe('the after-visit arms', () => {
  it('Luke offstage per his own schedule, once act4_luke_gone', () => {
    const base = withState({ flags: { [ACT4_STARTED]: true, [ACT4_VISIT_DAY]: 1, [ACT4_LUKE_GONE]: true }, clock: { day: 2, minute: 500 } });
    const { session } = enter(base, ACT4_STAGING_AREA);
    // A fresh session has no npc overlay for Luke; his position resolves
    // entirely from the schedule — gone means offstage, unconditionally, so
    // he is not in scope even standing in his own room.
    const view = buildScopeView(TEST_WORLD, session.state, vocab);
    expect(view.visible.includes(ACT4_LUKE)).toBe(false);
  });

  it('the Staging Area, after the visit, if the door was never opened', () => {
    const store = new MemoryStore();
    const base = withState({
      flags: { [ACT4_STARTED]: true, [ACT4_LUKE_MET]: true, [ACT4_LUKE_GONE]: true, [ACT4_VISIT_OVER_DAY]: 1 },
      clock: { day: 2, minute: 500 },
    });
    // The room's own rule 1 (first sight, `{ not: { visited } }`) always
    // wins on a genuine first arrival — visit it once, then re-enter to see
    // the after-visit arm.
    const { session: seen } = enter(base, ACT4_STAGING_AREA);
    const { events } = enter(seen, ACT4_STAGING_AREA);
    expect(text(events)).toMatch(/He was here for two days, and then the two days were over/);
    void store;
  });
});

// E2 task O (`docs/superpowers/specs/2026-09-19-stage-e2-prose.md` §56.1) —
// "the IN entry point is gone"; the class object's own `IN` handler now
// always renders §3.1's "which one" line, never the boundary — moved to
// the well's own `down` exit below (the same `ACT3_CLUE_ROOT_REFUSES` seed
// this describe block's own fourth test already used).
describe('§29 — the boundary, three arms', () => {
  it('the shipped Act III line, with none of Act IV started', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ clues: [ACT3_CLUE_ROOT_REFUSES] }), ACT3_S6_ARCHIVE_HUB);
    const { events } = say(session, 'down', store);
    const rendered = text(events);
    expect(rendered).toMatch(/END OF BUILD/);
    expect(rendered).toMatch(/Act III ends here/);
  });

  it("E0's Act IV line, once started but before he is met", () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_STARTED]: true }, clues: [ACT3_CLUE_ROOT_REFUSES] }), ACT3_S6_ARCHIVE_HUB);
    const { events } = say(session, 'down', store);
    const rendered = text(events);
    expect(rendered).toMatch(/END OF BUILD/);
    expect(rendered).toMatch(/the man who is coming are this one/);
  });

  it("E1's own line, once act4_luke_met", () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_STARTED]: true, [ACT4_LUKE_MET]: true }, clues: [ACT3_CLUE_ROOT_REFUSES] }), ACT3_S6_ARCHIVE_HUB);
    const { events } = say(session, 'down', store);
    const rendered = text(events);
    expect(rendered).toMatch(/END OF BUILD/);
    expect(rendered).toMatch(/stair behind the door on Sublevel 5 is this one/);
  });

  it('the root door\'s own down exit reaches the same three arms', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_STARTED]: true, [ACT4_LUKE_MET]: true }, clues: [ACT3_CLUE_ROOT_REFUSES] }), ACT3_S6_ARCHIVE_HUB);
    const { events } = say(session, 'down', store);
    const rendered = text(events);
    expect(rendered).toMatch(/stair behind the door on Sublevel 5 is this one/);
  });
});

describe('canon 104 — no Luke line below S5', () => {
  it('none of the below-ground blocks contains a quotation mark', () => {
    // The lift ride text (still above ground, ends the moment the leaves
    // part for S5) is the boundary; everything transcribed below is
    // narrator-voiced with nobody speaking, from the arrival paragraph
    // onward.
    // `s6StairText` is a `ProseRule[]` as of the E1 addendum §7 rotation
    // (`firstOnce` — the shipped block, then the "second and later" text);
    // both rotation strings are checked, not the array itself.
    const s6StairStrings = s6StairText.flatMap((rule) => (Array.isArray(rule.text) ? rule.text : [rule.text as string]));
    const belowGroundBlocks = [lukeAtS5Text, s6DoorLukeText, ...s6StairStrings, ACT4_LUKE_AT_ROOT_TEXT];
    for (const block of belowGroundBlocks) {
      expect(block).not.toMatch(/"/);
    }
    // The lift-ride text itself carries no dialogue either (canon 104 turns
    // on at the leaves closing, before this text even finishes) — checked
    // separately since it is technically the one above-ground block in this
    // group.
    expect(doorEscortText).not.toMatch(/"/);
  });
});

describe('no id or {name} leaks', () => {
  it('spot check on the densest turn — the escort', () => {
    const store = new MemoryStore();
    const base = withLukeAtStaging({ flags: { [ACT4_STARTED]: true, [ACT4_LUKE_WILL_ESCORT]: true } });
    const { session } = enter(base, ACT4_STAGING_AREA);
    const { events } = say(session, 'ask luke about door', store);
    const rendered = text(events);
    expect(rendered).not.toMatch(/\{name\}/);
    expect(rendered).not.toMatch(/act4_|act3_|act1_|act2_/);
  });
});
