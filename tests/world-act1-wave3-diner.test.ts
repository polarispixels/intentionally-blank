// Act I Wave 3 — the Sundown Diner and Pearl
// (`docs/superpowers/specs/2026-09-04-act1-wave3-prose.md` PART ONE).
//
// `validate(WORLD)` clean of ERRORS is the shape proof (matching
// `tests/world-act1.test.ts`'s own convention). The playthrough below drives
// the real engine (`DeterministicParser` + `buildScopeView` + `takeTurn`,
// exactly what `src/cli/repl.ts` calls per line) against the real `WORLD`,
// but — unlike `tests/world-act1-playthrough.test.ts` — teleports the
// player straight into the diner via `renderArrival` rather than walking
// there from `your_room`: Main Street's own `northwest` exit to this room
// is a separate task's to add (this task's brief, "Do NOT edit
// mainStreet.ts"), so no in-fiction path to the diner exists yet in this
// build. Teleporting is `startSession`'s own technique (seed a location,
// then run it through `renderArrival` for a genuine first-visit render),
// applied here starting from `createSession` instead of the real start room.

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
  CLUE_MUG_SPELLING,
  FLAG_HANDLED_MUG,
  FLAG_MET_PEARL,
  FLAG_PEARL_NOTICED_YOU,
  FLAG_SAT_AT_COUNTER,
  FLAG_TOLD_PEARL_ABOUT_ROOM,
  FLAG_VISITED_DINER,
  MUG,
  SUNDOWN_DINER,
} from '../src/content/world/act1/ids';

const vocab = compileVocabulary(WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-04T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

/** Teleports a fresh session straight into the diner, running a genuine first-visit arrival (same technique `session.ts`'s own `startSession` uses for the real start room). */
function enterDiner(): { session: SessionState; events: GameEvent[] } {
  const fresh = createSession(WORLD);
  const teleported: GameState = { ...fresh.state, location: SUNDOWN_DINER };
  const { state, events } = renderArrival(WORLD, teleported);
  return { session: { ...fresh, state }, events };
}

/** One line of real player input, through the real parser and turn pipeline — `src/cli/repl.ts`'s own `feed()`, minus the shell chrome. */
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
// Shape — validate(WORLD) clean of errors
// ---------------------------------------------------------------------------

describe('validate — Act I Wave 3 (Sundown Diner)', () => {
  it('produces zero errors', () => {
    expect(validate(WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Playthrough
// ---------------------------------------------------------------------------

describe('Sundown Diner — a real playthrough', () => {
  it('first entry renders the pre-opening first-sight description and Pearl already there', () => {
    const { session, events } = enterDiner();
    const rendered = text(events);
    expect(rendered).toContain('THE SUNDOWN');
    expect(rendered).toContain('Behind the counter a woman in an apron is doing four things, and looks up.');
    expect(session.state.flags[FLAG_VISITED_DINER]).toBe(true);
    expect(session.state.flags[FLAG_MET_PEARL]).toBe(true);
  });

  it('a second LOOK renders the shorter return-visit description', () => {
    const store = new MemoryStore();
    let { session } = enterDiner();
    const result = say(session, 'look', store);
    session = result.session;
    expect(text(result.events)).toBe('Warm, and the griddle up, and the chairs still stacked over the tables at the dark end. The counter, the mugs, the pie case, the photographs. Pearl, doing four things.');
  });

  it('SMELL, LISTEN and LOOK UP render the room\'s own senses', () => {
    const store = new MemoryStore();
    let { session } = enterDiner();
    let r = say(session, 'smell', store);
    expect(text(r.events)).toContain('Coffee, and hot iron');
    session = r.session;
    r = say(session, 'listen', store);
    expect(text(r.events)).toContain('The urn. The griddle ticking');
    session = r.session;
    r = say(session, 'look up', store);
    expect(text(r.events)).toContain('Acoustic tile');
  });

  it('EXAMINE MUGS notes the clue with both spellings staged flatly', () => {
    const store = new MemoryStore();
    const { session } = enterDiner();
    const { events } = say(session, 'examine mugs', store);
    expect(text(events)).toContain('THE SUNDOWNER');
    expect(clueIds(events)).toContain(CLUE_MUG_SPELLING);
  });

  it('TAKE MUG sets handled_mug and grants the mug to inventory', () => {
    const store = new MemoryStore();
    let { session } = enterDiner();
    const { session: after, events } = say(session, 'take mug', store);
    expect(text(events)).toContain('Pearl fills it before you have decided whether you wanted it filled.');
    expect(after.state.flags[FLAG_HANDLED_MUG]).toBe(true);
    expect(after.state.objects[MUG]?.location).toBe('inventory');
  });

  it('READ MUG resolves to the same examine text, no second string', () => {
    const store = new MemoryStore();
    const { session } = enterDiner();
    const { events } = say(session, 'read mug', store);
    expect(text(events)).toContain('THE SUNDOWNER');
  });

  it('SIT AT COUNTER / SIT ON STOOL set sat_at_counter — bare SIT has no dobj to resolve (SIT is "V dobj"-only everywhere in this world, matching Front Desk\'s and the Post Office\'s own SIT wiring, not a gap this room introduces)', () => {
    const store = new MemoryStore();
    for (const phrase of ['sit at counter', 'sit on stool']) {
      const { session } = enterDiner();
      const { session: after, events } = say(session, phrase, store);
      expect(text(events)).toContain('The stool takes your weight');
      expect(after.state.flags[FLAG_SAT_AT_COUNTER]).toBe(true);
    }
  });

  it('READ MENU gives the menu text, distinct from EXAMINE COUNTER', () => {
    const store = new MemoryStore();
    let { session } = enterDiner();
    let r = say(session, 'examine counter', store);
    expect(text(r.events)).toContain('Formica with a boomerang pattern');
    session = r.session;
    r = say(session, 'read menu', store);
    expect(text(r.events)).toContain("AND AFTER THAT IT'S JUST COFFEE");
  });

  it('DRINK COFFEE, ORDER COFFEE, POUR COFFEE and USE URN all render the same urn text', () => {
    const store = new MemoryStore();
    const { session } = enterDiner();
    for (const phrase of ['drink coffee', 'order coffee', 'pour coffee', 'use urn']) {
      const { events } = say(session, phrase, store);
      expect(text(events)).toContain("You don't have to ask");
    }
  });

  it('OPEN CASE / TAKE PIE / STEAL PIE render the case-opens text', () => {
    const store = new MemoryStore();
    const { session } = enterDiner();
    for (const phrase of ['open case', 'take pie', 'steal pie']) {
      const { events } = say(session, phrase, store);
      expect(text(events)).toContain("The case opens on Pearl's side");
    }
  });

  it('ASK FOR PIE / ORDER PIE render the rhubarb-pie serving text', () => {
    const store = new MemoryStore();
    const { session } = enterDiner();
    for (const phrase of ['ask for pie', 'order pie']) {
      const { events } = say(session, phrase, store);
      expect(text(events)).toContain('Yesterday\'s');
    }
  });

  it('EXAMINE PHOTOS gives the room description; SEARCH PHOTOS and LOOK FOR YOURSELF give the faces text', () => {
    const store = new MemoryStore();
    let { session } = enterDiner();
    let r = say(session, 'examine photos', store);
    expect(text(r.events)).toContain('Four rows deep');
    session = r.session;
    r = say(session, 'search photos', store);
    expect(text(r.events)).toContain('You go along the rows looking at faces');
    session = r.session;
    r = say(session, 'look for yourself', store);
    expect(text(r.events)).toContain('You go along the rows looking at faces');
  });

  it('EXAMINE FACES gives the same faces text via the sub-part', () => {
    const store = new MemoryStore();
    const { session } = enterDiner();
    const { events } = say(session, 'examine faces', store);
    expect(text(events)).toContain('You go along the rows looking at faces');
  });

  it('EXAMINE WINDOW gives the gold-arc/OPEN-card text; LOOK OUT WINDOW gives the street text', () => {
    const store = new MemoryStore();
    let { session } = enterDiner();
    let r = say(session, 'examine window', store);
    expect(text(r.events)).toContain('NWODNUS EHT');
    session = r.session;
    r = say(session, 'look out window', store);
    expect(text(r.events)).toContain('weather happening to somebody else');
  });

  it('WAIT and SLEEP render the diner\'s own text', () => {
    const store = new MemoryStore();
    let { session } = enterDiner();
    let r = say(session, 'wait', store);
    expect(text(r.events)).toBe("You wait. The griddle comes up another few degrees. Pearl tells you something about somebody's roof.");
    session = r.session;
    r = say(session, 'sleep', store);
    expect(text(r.events)).toContain('eight feet from a coffee urn');
  });

  it('EAT / ORDER FOOD / ORDER BREAKFAST / ASK FOR FOOD all render the same eat text', () => {
    const store = new MemoryStore();
    const { session } = enterDiner();
    for (const phrase of ['eat', 'order food', 'order breakfast', 'ask for food']) {
      const { events } = say(session, phrase, store);
      expect(text(events)).toContain('It arrives before you have finished asking');
    }
  });

  // Wave-3 amendment (§15.3, Main Street task): `e` is now also a real
  // exit to Main Street (§5's own exits table — "out"/"east"/"leave"/
  // "exit"), reciprocal-compass `se` kept alongside it.
  it('OUT, SE and E all leave to Main Street with the exit\'s travelText', () => {
    const store = new MemoryStore();
    for (const phrase of ['out', 'se', 'e']) {
      const { session } = enterDiner();
      const { session: after, events } = say(session, phrase, store);
      expect(text(events)).toContain('The door has a bell on a leaf spring');
      expect(after.state.location).toBe('act1_main_street');
    }
  });

  it('every other direction gives the in-world refusal, not a build-boundary line', () => {
    const store = new MemoryStore();
    const { session } = enterDiner();
    for (const dir of ['n', 's', 'w', 'up', 'down']) {
      const { events } = say(session, dir, store);
      expect(text(events)).toContain("Past the counter is Pearl's kitchen");
      expect(text(events)).not.toContain('END OF BUILD');
    }
  });

  it('produces no unexpected diagnostics across the whole script', () => {
    const store = new MemoryStore();
    let { session, events: openingEvents } = enterDiner();
    let allDiags = diagCodes(openingEvents);
    const script = [
      'examine mugs',
      'take mug',
      'sit at counter',
      'examine counter',
      'read menu',
      'drink coffee',
      'open case',
      'ask for pie',
      'examine photos',
      'search photos',
      'examine window',
      'look out window',
      'wait',
      'eat',
    ];
    for (const line of script) {
      const r = say(session, line, store);
      session = r.session;
      allDiags = allDiags.concat(diagCodes(r.events));
    }
    expect(allDiags).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Pearl
// ---------------------------------------------------------------------------

describe('Pearl', () => {
  it('greeting rule 1 is the first HELLO (the engine marks her met after it, v0.8.0); the rotation starts on the second', () => {
    const store = new MemoryStore();
    let { session } = enterDiner();
    const first = say(session, 'hello pearl', store);
    expect(text(first.events)).toContain('Well, sit down');
    session = first.session;
    const { events } = say(session, 'hello pearl', store);
    expect(text(events)).toContain('Shift comes off at four and the buses take most of them home');
  });

  it('greeting rotation continues through variants 2 and 3', () => {
    const store = new MemoryStore();
    let { session } = enterDiner();
    session = say(session, 'hello pearl', store).session; // rule 1, the first meeting
    const first = say(session, 'hello pearl', store); // consume variant 1
    session = first.session;
    let r = say(session, 'hello pearl', store);
    session = r.session;
    expect(text(r.events)).toContain('There\'s been a Sundown on this corner longer than there\'s been a county to put it in');
    r = say(session, 'hello pearl', store);
    expect(text(r.events)).toContain('He\'ll not have said two words');
  });

  it('EXAMINE PEARL gives her description', () => {
    const store = new MemoryStore();
    const { session } = enterDiner();
    const { events } = say(session, 'examine pearl', store);
    expect(text(events)).toContain('decides you need feeding');
  });

  it('ASK PEARL ABOUT SUNDOWN — the beat: "you\'ll turn up a right one if you keep looking"', () => {
    const store = new MemoryStore();
    const { session } = enterDiner();
    const { events } = say(session, 'ask pearl about sundown', store);
    expect(text(events)).toContain("You'll turn up a right one if you keep looking.");
  });

  it('ASK PEARL ABOUT PEARL — fifty-one years', () => {
    const store = new MemoryStore();
    const { session } = enterDiner();
    const { events } = say(session, 'ask pearl about pearl', store);
    expect(text(events)).toContain('Fifty-one years this side of the counter');
  });

  it('ASK PEARL ABOUT TOWN sets pearl_noticed_you', () => {
    const store = new MemoryStore();
    const { session } = enterDiner();
    const { session: after, events } = say(session, 'ask pearl about town', store);
    expect(text(events)).toContain("And I've not met you once.");
    expect(after.state.flags[FLAG_PEARL_NOTICED_YOU]).toBe(true);
  });

  it('ASK PEARL ABOUT PLANT, HEAD, MARLOW and WHITLOCK all resolve to their own topics (no topicMiss)', () => {
    const store = new MemoryStore();
    let { session } = enterDiner();
    for (const [phrase, expected] of [
      ['ask pearl about plant', 'Good wage. Long way to sit.'],
      ['ask pearl about head', "Clinic's at nine"],
      ['ask pearl about marlow', 'He was married.'],
      ['ask pearl about whitlock', 'If she tells you a thing'],
    ] as const) {
      const r = say(session, phrase, store);
      session = r.session;
      expect(text(r.events)).toContain(expected);
      expect(diagCodes(r.events)).toEqual([]);
    }
  });

  it('unknownTopic rotates through its three variants and tags topicMiss', () => {
    const store = new MemoryStore();
    let { session } = enterDiner();
    const seen: string[] = [];
    for (let i = 0; i < 3; i++) {
      const r = say(session, 'ask pearl about the weather', store);
      session = r.session;
      seen.push(text(r.events));
      expect(diagCodes(r.events)).toEqual(['topicMiss']);
    }
    expect(seen[0]).toContain("Oh, that I couldn't tell you.");
    expect(seen[1]).toContain("her sister's boy and a truck");
    expect(seen[2]).toContain('"Somebody knows that,"');
  });

  it('TELL PEARL ABOUT ROOM sets told_pearl_about_room and gives the deduction', () => {
    const store = new MemoryStore();
    const { session } = enterDiner();
    const { session: after, events } = say(session, 'tell pearl about room', store);
    expect(text(events)).toContain('Then they wanted a thing, not things.');
    expect(after.state.flags[FLAG_TOLD_PEARL_ABOUT_ROOM]).toBe(true);
  });

  // The shelf (`diner_mugs`) shares the bare noun "mug" with the carried
  // mug; the resolver's held tie-break (§3.2) makes the spec-canonical
  // phrasing land on the one in hand without a clarify.
  it('EXAMINE MUG / READ MUG in hand render the carried mug\'s own text, no diagnostic', () => {
    const store = new MemoryStore();
    let { session } = enterDiner();
    session = say(session, 'take mug', store).session;
    for (const cmd of ['x mug', 'read mug']) {
      const { events } = say(session, cmd, store);
      expect(text(events)).toContain('The handle takes two fingers and no more.');
      expect(text(events)).not.toContain('[error]');
    }
  });

  it('SHOW MUG TO PEARL — resolves to the carried mug; she never engages with the object itself', () => {
    const store = new MemoryStore();
    let { session } = enterDiner();
    const taken = say(session, 'take mug', store);
    session = taken.session;
    const { events } = say(session, 'show mug to pearl', store);
    expect(text(events)).toContain('The question you were forming does not survive the coffee.');
  });

  it('ATTACK PEARL, KISS PEARL and FOLLOW PEARL render their own handlers', () => {
    const store = new MemoryStore();
    let { session } = enterDiner();
    let r = say(session, 'attack pearl', store);
    expect(text(r.events)).toContain('stops there');
    session = r.session;
    r = say(session, 'kiss pearl', store);
    expect(text(r.events)).toContain('puts you back on the stool');
    session = r.session;
    r = say(session, 'follow pearl', store);
    expect(text(r.events)).toContain("I'm behind the counter.");
  });
});
