// Act I Wave 4 — The Arrowhead Motel
// (`docs/superpowers/specs/2026-09-05-act1-wave4-prose.md` PART ONE §2-§5,
// and §10's Main Street amendment). Jack himself and his own topics/
// greeting/memories (`jack.ts`) are a separate concurrent task's own
// module — not exercised here beyond the narration his presence produces
// inside this room's own description/object text.
//
// Scope: `src/content/world/act1/jacksMotel.ts` (the room) and
// `src/content/world/act1/objects/jacksMotel.ts` (its six objects, plus
// two "which noun word resolved" sub-parts), plus the Main Street
// amendment (`mainStreet.ts`/`objects/mainStreet.ts` — the `northeast`
// exit, the two description strings, and `motel_sign_front`'s routing).
//
// A real playthrough driven through the actual parser/turn pipeline
// (`DeterministicParser` + `buildScopeView` + `takeTurn`, the same
// production path `src/cli/repl.ts` calls per line), same idiom as
// `tests/world-act1-wave3-diner.test.ts`. Unlike that file, this room IS
// wired to be reachable by walking from Main Street (this task's own
// brief), so the opening playthrough walks there for real rather than
// teleporting; later sections teleport straight into the room for
// object-level coverage, matching the established convention once
// reachability itself has been demonstrated once.

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
import type { GameEvent, GameState } from '../src/engine/world';
import {
  CLUE_HIRED,
  CLUE_LETTERS_ANSWERED,
  CLUE_ODD_KEY,
  CLUE_POLAROID_FLARE,
  FLAG_MET_JACK,
  FLAG_NOTICED_ODD_KEY,
  FLAG_READ_JACK_LETTERS,
  FLAG_VISITED_MOTEL,
  JACKS_MOTEL,
  MAIN_STREET,
  POLAROID,
  ROOM_KEY,
} from '../src/content/world/act1/ids';

const vocab = compileVocabulary(WORLD);
const parser = new DeterministicParser();

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-05T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

/** Teleports a fresh session straight into a room, running a genuine first-visit arrival (same technique `session.ts`'s own `startSession` uses for the real start room, and `world-act1-wave3-diner.test.ts`'s own `enterDiner`). */
function enterFresh(room: typeof JACKS_MOTEL | typeof MAIN_STREET): { session: SessionState; events: GameEvent[] } {
  const fresh = createSession(WORLD);
  const teleported: GameState = { ...fresh.state, location: room };
  const { state, events } = renderArrival(WORLD, teleported);
  return { session: { ...fresh, state }, events };
}

/** Carries an object straight into inventory, bypassing TAKE (same idiom `tests/world-act1-wave4-jack.test.ts`'s own `carry` uses). */
function carry(session: SessionState, ...ids: (typeof ROOM_KEY)[]): SessionState {
  const objects = { ...session.state.objects };
  for (const id of ids) objects[id] = { ...objects[id], location: 'inventory', hidden: false };
  return { ...session, state: { ...session.state, objects } };
}

/** One line of real player input, through the real parser and turn pipeline. */
function say(session: SessionState, text: string, store: MemoryStore): { session: SessionState; events: GameEvent[] } {
  const view = buildScopeView(WORLD, session.state, vocab);
  const outcome = new DeterministicParser().interpret(text, view);
  const result = takeTurn(WORLD, session, vocab, outcome, opts(store));
  return { session: result.session, events: result.events };
}

function text(events: GameEvent[]): string {
  return events
    .filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line')
    .map((e) => e.text)
    .join('\n');
}

function diagCodes(events: GameEvent[]): string[] {
  return events.filter((e): e is Extract<GameEvent, { type: 'diag' }> => e.type === 'diag').map((e) => e.code);
}

function clueIds(events: GameEvent[]): string[] {
  return events.filter((e): e is Extract<GameEvent, { type: 'clue' }> => e.type === 'clue').map((e) => e.id);
}

// ---------------------------------------------------------------------------
// Shape
// ---------------------------------------------------------------------------

describe('validate — Act I Wave 4 (Arrowhead Motel)', () => {
  it('produces zero errors', () => {
    expect(validate(WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Reachability — walking from Main Street
// ---------------------------------------------------------------------------

describe('Main Street — the northeast exit and its scenery routing (§10)', () => {
  it('walks northeast from Main Street into the motel, first visit: the arrival text, onEnter effects, and clue_hired', () => {
    const store = new MemoryStore();
    const { session: atStreet } = enterFresh(MAIN_STREET);
    const { session, events } = say(atStreet, 'northeast', store);

    expect(session.state.location).toBe(JACKS_MOTEL);
    const rendered = text(events);
    expect(rendered).toContain('THE ARROWHEAD');
    expect(rendered).toContain('VACANCY');
    expect(rendered).toContain('The lot holds one vehicle.');
    expect(rendered).toContain('"You didn\'t come."');
    expect(rendered).toContain('I would like those to be two different things.');

    expect(session.state.flags[FLAG_VISITED_MOTEL]).toBe(true);
    expect(session.state.flags[FLAG_MET_JACK]).toBe(true);
    expect(clueIds(events)).toContain(CLUE_HIRED);
    expect(diagCodes(events)).toEqual([]);
  });

  it('the return-visit description renders on a second entry, and the exit back to Main Street works', () => {
    const store = new MemoryStore();
    const { session: atStreet } = enterFresh(MAIN_STREET);
    let r = say(atStreet, 'northeast', store);
    r = say(r.session, 'southwest', store);
    expect(r.session.state.location).toBe(MAIN_STREET);
    expect(text(r.events)).toContain('The asphalt gives out and the kerb starts again');

    r = say(r.session, 'go to motel', store);
    expect(r.session.state.location).toBe(JACKS_MOTEL);
    const rendered = text(r.events);
    expect(rendered).toContain('Asphalt, the sign on its post, eight doors under a walkway');
    expect(rendered).not.toContain('THE ARROWHEAD');
  });

  it('§10.1/§10.2 — the two amended Main Street description strings mention the motel sign', () => {
    const store = new MemoryStore();
    const { session: atStreet } = enterFresh(MAIN_STREET);
    const firstSight = text(enterFresh(MAIN_STREET).events);
    expect(firstSight).toContain('Past the last of the brick on this side, set back off the road, a sign on a post with a light still in it.');

    // Return visit (§10.2's added clause) — leave and come back.
    let r = say(atStreet, 'northeast', store);
    r = say(r.session, 'southwest', store);
    expect(text(r.events)).toContain('the motel sign burning away past the end of it all');
  });

  it('FIND JACK / ENTER MOTEL / GO TO ARROWHEAD all reach the motel from Main Street on a first visit (motel_sign_front routing, §10.3)', () => {
    const store = new MemoryStore();
    for (const cmd of ['find jack', 'enter motel', 'go to arrowhead']) {
      const { session: atStreet } = enterFresh(MAIN_STREET);
      const { session, events } = say(atStreet, cmd, store);
      expect(session.state.location, `"${cmd}" should reach the motel`).toBe(JACKS_MOTEL);
      expect(text(events)).toContain('THE ARROWHEAD');
    }
  });
});

// ---------------------------------------------------------------------------
// The room itself — object responses, teleported straight in
// ---------------------------------------------------------------------------

describe('The Arrowhead Motel — objects and room responses (§4-§5)', () => {
  it('the truck: EXAMINE (the bank lettering), CLIMB/EXAMINE CAB/LOOK THROUGH WINDOW (shared cab text), and DRIVE/START/GET IN/TAKE/OPEN TRUCK DOOR (shared locked-door text)', () => {
    const store = new MemoryStore();
    const { session: fresh } = enterFresh(JACKS_MOTEL);

    let r = say(fresh, 'examine truck', store);
    expect(text(r.events)).toContain('THE BANK');
    expect(text(r.events)).toContain('painted the whole thing by hand');

    r = say(r.session, 'climb truck', store);
    expect(text(r.events)).toContain('tidiest interior of anything you have been inside tonight');

    r = say(r.session, 'examine cab', store);
    expect(text(r.events)).toContain('A bench seat, a cup in the holder');

    r = say(r.session, 'look through window', store);
    expect(text(r.events)).toContain('A bench seat, a cup in the holder');

    for (const cmd of ['drive truck', 'start truck', 'get in truck', 'take truck', 'open truck door']) {
      const rr = say(r.session, cmd, store);
      expect(text(rr.events), cmd).toContain('The door is locked, the keys are in the pocket of a man four feet away');
      expect(diagCodes(rr.events)).toEqual([]);
    }
  });

  it('bare "door" genuinely clarifies between the unit and the truck; "truck door" resolves straight to the truck (§14 wiring item 1 — see this task\'s report)', () => {
    const { session: fresh } = enterFresh(JACKS_MOTEL);
    const view = buildScopeView(WORLD, fresh.state, vocab);
    expect(parser.interpret('open door', view).kind).toBe('clarify');
    const truckDoor = parser.interpret('open truck door', view);
    expect(truckDoor.kind).toBe('actions');
  });

  it('the unit: EXAMINE, and ENTER ROOM/OPEN SCREEN DOOR/KNOCK SCREEN DOOR (shared interior text)', () => {
    const store = new MemoryStore();
    const { session: fresh } = enterFresh(JACKS_MOTEL);
    let r = say(fresh, 'examine unit', store);
    expect(text(r.events)).toContain('Eight doors, painted the same brown');

    // "go inside" and bare "knock" are known gaps — see this task's report
    // and `jacksMotel.ts`'s/`objects/jacksMotel.ts`'s own comments. "knock
    // ON screen door" (with the preposition) is also a known miss — see
    // the next test.
    for (const cmd of ['enter room', 'open screen door', 'knock screen door']) {
      const rr = say(r.session, cmd, store);
      expect(text(rr.events), cmd).toContain('five weeks of a man living somewhere he did not intend to live');
    }
  });

  it('known gaps, reported: bare "go inside" is a miss (not the interior text, and not the exit either — "go" resolves as V_APPROACH\'s own word with an unresolved "inside" noun); bare "knock" needs a dobj; "knock ON screen door" (with the preposition) treats "on" as a phantom adjective and clarifies instead of resolving — "knock screen door" (no preposition) is the one that works', () => {
    const store = new MemoryStore();
    const { session: fresh } = enterFresh(JACKS_MOTEL);
    const goInside = say(fresh, 'go inside', store);
    expect(goInside.session.state.location).toBe(JACKS_MOTEL);
    expect(diagCodes(goInside.events).length).toBeGreaterThan(0);

    const knock = say(fresh, 'knock', store);
    expect(diagCodes(knock.events)).toContain('defaultResponse');

    const view = buildScopeView(WORLD, fresh.state, vocab);
    expect(parser.interpret('knock on screen door', view).kind).toBe('clarify');
  });

  it('the Polaroid: EXAMINE sets clue_polaroid_flare; TAKE/TURN OVER/LOOK AT BACK share the thumbprint response and do not add it to inventory', () => {
    const store = new MemoryStore();
    const { session: fresh } = enterFresh(JACKS_MOTEL);
    const r1 = say(fresh, 'examine polaroid', store);
    expect(text(r1.events)).toContain('white bloom where light got at the film');
    expect(clueIds(r1.events)).toContain(CLUE_POLAROID_FLARE);

    for (const cmd of ['take polaroid', 'turn over polaroid', 'look at back']) {
      const rr = say(r1.session, cmd, store);
      expect(text(rr.events), cmd).toContain('a thumbprint at one corner');
    }
    const after = say(r1.session, 'take polaroid', store).session;
    expect(after.state.objects[POLAROID]?.location).not.toBe('inventory');
  });

  it('the keyring: EXAMINE sets clue_odd_key + noticed_odd_key; TAKE/ASK FOR/BORROW share Jack\'s refusal', () => {
    const store = new MemoryStore();
    const { session: fresh } = enterFresh(JACKS_MOTEL);
    const r1 = say(fresh, 'examine keyring', store);
    expect(text(r1.events)).toContain('a squared bit that has never been near a house door');
    expect(clueIds(r1.events)).toContain(CLUE_ODD_KEY);
    expect(r1.session.state.flags[FLAG_NOTICED_ODD_KEY]).toBe(true);

    for (const cmd of ['take keys', 'ask for keys', 'borrow keys']) {
      const rr = say(r1.session, cmd, store);
      expect(text(rr.events), cmd).toContain('"Leave those," Jack says');
    }
  });

  it('the letters: EXAMINE (no clue); READ/READ REPLIES sets clue_letters_answered + read_jack_letters', () => {
    const store = new MemoryStore();
    const { session: fresh } = enterFresh(JACKS_MOTEL);
    const r1 = say(fresh, 'examine letters', store);
    expect(text(r1.events)).toContain('Half are his, sent. Half are what came back.');
    expect(clueIds(r1.events)).toEqual([]);

    const r2 = say(r1.session, 'read letters', store);
    expect(text(r2.events)).toContain('Forty-odd years and he has never signed off L in his life');
    expect(clueIds(r2.events)).toContain(CLUE_LETTERS_ANSWERED);
    expect(r2.session.state.flags[FLAG_READ_JACK_LETTERS]).toBe(true);

    const r3 = say(r1.session, 'read replies', store);
    expect(text(r3.events)).toContain('Forty-odd years');
  });

  it('the Catan box: EXAMINE (no clue); OPEN BOX/PLAY CATAN/PLAY GAME share "Not tonight"', () => {
    const store = new MemoryStore();
    const { session: fresh } = enterFresh(JACKS_MOTEL);
    const r1 = say(fresh, 'examine catan', store);
    expect(text(r1.events)).toContain('HOUSE RULES');
    expect(clueIds(r1.events)).toEqual([]);

    for (const cmd of ['open box', 'play catan', 'play game']) {
      const rr = say(r1.session, cmd, store);
      expect(text(rr.events), cmd).toContain('"Not tonight," Jack says');
    }
  });

  it('WAIT and SLEEP', () => {
    const store = new MemoryStore();
    const { session: fresh } = enterFresh(JACKS_MOTEL);
    const waited = say(fresh, 'wait', store);
    expect(text(waited.events)).toContain('The ice machine gets to the end of whatever it is doing and starts again.');

    const slept = say(fresh, 'sleep', store);
    expect(text(slept.events)).toContain("There's no wrong one.");
    // §5's own note: no refusal clause at all, unlike every other SLEEP in the game.
    expect(text(slept.events)).not.toMatch(/and you do not/i);
  });

  it('room senses: SMELL, LISTEN, LOOK UP', () => {
    const store = new MemoryStore();
    const { session: fresh } = enterFresh(JACKS_MOTEL);
    expect(text(say(fresh, 'smell', store).events)).toContain('Cold asphalt and diesel');
    expect(text(say(fresh, 'listen', store).events)).toContain('An ice machine at the far end of the walkway');
    expect(text(say(fresh, 'look up', store).events)).toContain('three summers of insects');
  });

  it('every other direction is an in-world refusal, not the build boundary', () => {
    const store = new MemoryStore();
    const { session: fresh } = enterFresh(JACKS_MOTEL);
    for (const dir of ['north', 'south', 'east', 'west', 'up', 'down']) {
      const r = say(fresh, dir, store);
      expect(text(r.events), dir).toContain('Seven other doors, all shut');
      expect(r.session.state.location, dir).toBe(JACKS_MOTEL);
    }
  });

  it('no WHAT YEAR IS IT, WHO AM I, or THINK response is authored for this room (§12.2) — no COUNT response is authored on any object either', () => {
    const store = new MemoryStore();
    const { session: fresh } = enterFresh(JACKS_MOTEL);
    // These all fall through to the global families rather than throwing or
    // rendering room-specific text — asserted by absence of this room's own
    // strings, not by a specific global string (which is out of this
    // module's own content).
    for (const cmd of ['what year is it', 'who am i', 'think']) {
      const r = say(fresh, cmd, store);
      expect(text(r.events), cmd).not.toContain('Jack talks');
      expect(text(r.events), cmd).not.toContain('THE ARROWHEAD');
    }
    // §12.2/§4.3's own point: this object has no COUNT response, so
    // "COUNT TRUCK" falls to the global V_COUNT default, not to any
    // authored text this room supplies.
    const counted = say(fresh, 'count truck', store);
    expect(text(counted.events)).not.toContain('THE BANK');
  });
});

// ---------------------------------------------------------------------------
// §14 wiring item 2 — the key/keys collision with the carried room key
// ---------------------------------------------------------------------------

describe('The keyring vs. the carried room key (§14 wiring item 2)', () => {
  it('bare "keys" (plural) always reaches the keyring, carried room key or not', () => {
    const store = new MemoryStore();
    const { session: fresh } = enterFresh(JACKS_MOTEL);
    const withKey = carry(fresh, ROOM_KEY);
    const r = say(withKey, 'examine keys', store);
    expect(text(r.events)).toContain('a squared bit that has never been near a house door');
  });

  it('bare "key" (singular), while the room key is carried, resolves to the carried key instead — the resolver\'s held tie-break wins the tie (v0.7.0); without the room key it reaches the keyring', () => {
    const store = new MemoryStore();
    const { session: fresh } = enterFresh(JACKS_MOTEL);

    const withKey = carry(fresh, ROOM_KEY);
    const heldResult = say(withKey, 'examine key', store);
    expect(text(heldResult.events)).toContain('A brass key on a wooden fob');

    const withoutKey = say(fresh, 'examine key', store);
    expect(text(withoutKey.events)).toContain('a squared bit that has never been near a house door');
  });
});
