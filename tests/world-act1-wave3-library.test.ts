// Act I Wave 3 — the County Library (Records Annex)
// (`docs/superpowers/specs/2026-09-04-act1-wave3-prose.md` PART TWO).
//
// `validate(WORLD)` clean of ERRORS is the shape proof (matching
// `tests/world-act1.test.ts`'s own convention). The playthrough below drives
// the real engine (`DeterministicParser` + `buildScopeView` + `takeTurn`,
// exactly what `src/cli/repl.ts` calls per line) against the real `WORLD`,
// but — like `tests/world-act1-wave3-diner.test.ts` — teleports the player
// straight into the library via `renderArrival` rather than walking there
// from Main Street: Main Street's own `southeast` exit to this room is a
// separate task's to add (this task's brief, "Do NOT edit mainStreet.ts"),
// so no in-fiction path to the library exists yet in this build.

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
  CLUE_DEAD_CROSS_REFERENCE,
  CLUE_RECORD_RANGE,
  CLUE_TERMINAL_NO_CROSSREFS,
  COUNTY_LIBRARY,
  FLAG_READ_LEFT_FRAME,
  FLAG_SIGNED_THE_BOOK,
  FLAG_VISITED_LIBRARY,
} from '../src/content/world/act1/ids';

const vocab = compileVocabulary(WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-04T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

/** Teleports a fresh session straight into the library, running a genuine first-visit arrival (same technique `session.ts`'s own `startSession` uses for the real start room). */
function enterLibrary(): { session: SessionState; events: GameEvent[] } {
  const fresh = createSession(WORLD);
  const teleported: GameState = { ...fresh.state, location: COUNTY_LIBRARY };
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

describe('validate — Act I Wave 3 (County Library)', () => {
  // Scoped to this room's own content: `sundown_diner`/`town_edge` are two
  // other builders' concurrent work on the same shared `world.ts`/`ids.ts`,
  // landing in parallel with this task — a pre-existing `noise-word-
  // vocabulary` error on `sundown_diner`'s own aliases is out of this
  // task's module and untouched here (see this task's report).
  it('produces zero errors mentioning this room\'s own content', () => {
    const errors = validate(WORLD).filter((f) => f.severity === 'error');
    const libraryErrors = errors.filter((f) => /county_library|microfiche|fiche_drawers|card_catalogue|catalogue_terminal|sign_in_book|darkroom_door/.test(f.message));
    expect(libraryErrors).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Playthrough
// ---------------------------------------------------------------------------

describe('County Library — a real playthrough', () => {
  it('first entry renders the pre-opening first-sight description', () => {
    const { session, events } = enterLibrary();
    const rendered = text(events);
    expect(rendered).toContain('RECORDS ANNEX. OPEN. PLEASE SIGN THE BOOK AND MIND THE LAMP.');
    expect(rendered).toContain('Somebody left it running.');
    expect(session.state.flags[FLAG_VISITED_LIBRARY]).toBe(true);
  });

  it('a second LOOK renders the shorter return-visit description', () => {
    const store = new MemoryStore();
    let { session } = enterLibrary();
    const result = say(session, 'look', store);
    session = result.session;
    expect(text(result.events)).toBe(
      'The cold, the drawer bank, the oak cabinet, the terminal, and the reader with its page still up on the screen. The steps to the street behind you.',
    );
  });

  it('SMELL, LISTEN and LOOK UP render the room\'s own senses', () => {
    const store = new MemoryStore();
    let { session } = enterLibrary();
    let r = say(session, 'smell', store);
    expect(text(r.events)).toContain('vinegar smell old film gets');
    session = r.session;
    r = say(session, 'listen', store);
    expect(text(r.events)).toContain("reader's fan");
    session = r.session;
    r = say(session, 'look up', store);
    expect(text(r.events)).toContain('Floor joists whitewashed');
  });

  it('EXAMINE READER gives the machine description; READ SCREEN / EXAMINE PAGE / READ NEWSPAPER set read_left_frame', () => {
    const store = new MemoryStore();
    let { session } = enterLibrary();
    let r = say(session, 'examine reader', store);
    expect(text(r.events)).toContain('nobody in this room but you');
    session = r.session;
    for (const phrase of ['read screen', 'examine page', 'read newspaper']) {
      const { session: after, events } = say(session, phrase, store);
      session = after;
      expect(text(events)).toContain('FIFTY YEARS AGO THIS WEEK');
      expect(after.state.flags[FLAG_READ_LEFT_FRAME]).toBe(true);
    }
  });

  it('TURN CRANK / WIND REEL / USE READER / SEARCH FILM / READ MICROFICHE all render the same crank text', () => {
    const store = new MemoryStore();
    const { session } = enterLibrary();
    for (const phrase of ['turn crank', 'wind reel', 'use reader', 'search film', 'read microfiche']) {
      const { events } = say(session, phrase, store);
      expect(text(events)).toContain('You could spend the night at this');
    }
  });

  it('EXAMINE DRAWERS sets clue_record_range', () => {
    const store = new MemoryStore();
    const { session } = enterLibrary();
    const { events } = say(session, 'examine drawers', store);
    expect(text(events)).toContain('2036–2039');
    expect(clueIds(events)).toContain(CLUE_RECORD_RANGE);
  });

  it('OPEN DRAWER / LOOK IN DRAWER / EXAMINE REELS all render the same tin-reels text, no clue', () => {
    const store = new MemoryStore();
    let { session } = enterLibrary();
    for (const phrase of ['open drawer', 'look in drawer', 'examine reels']) {
      const r = say(session, phrase, store);
      session = r.session;
      expect(text(r.events)).toContain('Nothing in here is locked and nothing ever needed to be.');
      expect(clueIds(r.events)).not.toContain(CLUE_RECORD_RANGE);
    }
  });

  it('READ CARDS / SEARCH CATALOGUE / OPEN CARD DRAWER / LOOK UP SUBJECT all render the same cross-reference text, and the first one grants the clue', () => {
    const store = new MemoryStore();
    for (const phrase of ['read cards', 'search catalogue', 'open card drawer', 'look up subject']) {
      const { session } = enterLibrary();
      const { events } = say(session, phrase, store);
      expect(text(events)).toContain('There is no RECLAMATION card');
    }
    // grantClue is idempotent (`effects.ts`) — only the first grant in a
    // session emits a `clue` event — so this checks it once, fresh.
    const { session } = enterLibrary();
    const { events } = say(session, 'read cards', store);
    expect(clueIds(events)).toContain(CLUE_DEAD_CROSS_REFERENCE);
  });

  it('EXAMINE CATALOGUE gives the cabinet description, distinct from the cards text', () => {
    const store = new MemoryStore();
    const { session } = enterLibrary();
    const { events } = say(session, 'examine catalogue', store);
    expect(text(events)).toContain('Sixty little drawers in oak');
  });

  it('EXAMINE TERMINAL gives the "decided you are the public" text; SEARCH TERMINAL / USE TERMINAL / TYPE RECLAMATION / LOOK UP RECLAMATION all render the same search text, and the first one grants the clue', () => {
    const store = new MemoryStore();
    const { session: examined } = enterLibrary();
    const examine = say(examined, 'examine terminal', store);
    expect(text(examine.events)).toContain('it has decided you are the public');
    for (const phrase of ['search terminal', 'use terminal', 'type reclamation', 'look up reclamation']) {
      const { session } = enterLibrary();
      const { events } = say(session, phrase, store);
      expect(text(events)).toContain('NO RECORDS MATCH THAT SUBJECT');
    }
    // grantClue is idempotent — see the card-catalogue test's own comment.
    const { session } = enterLibrary();
    const { events } = say(session, 'search terminal', store);
    expect(clueIds(events)).toContain(CLUE_TERMINAL_NO_CROSSREFS);
  });

  it('SEARCH MY NAME / SEARCH FOR MYSELF / LOOK MYSELF UP render the library\'s own WHO AM I override', () => {
    const store = new MemoryStore();
    const { session } = enterLibrary();
    for (const phrase of ['search my name', 'search for myself', 'look myself up']) {
      const { events } = say(session, phrase, store);
      expect(text(events)).toContain('The box will take anything.');
    }
  });

  it('EXAMINE BOOK gives the ledger description; SIGN BOOK / WRITE IN BOOK / USE PEN set signed_the_book', () => {
    const store = new MemoryStore();
    let { session } = enterLibrary();
    let r = say(session, 'examine book', store);
    expect(text(r.events)).toContain('YEAR');
    session = r.session;
    for (const phrase of ['sign book', 'write in book', 'use pen']) {
      const result = say(session, phrase, store);
      session = result.session;
      expect(text(result.events)).toContain('The pen goes back on its string.');
      expect(result.session.state.flags[FLAG_SIGNED_THE_BOOK]).toBe(true);
    }
  });

  it('EXAMINE DARKROOM gives the locked-door description; OPEN/TRY/UNLOCK/KNOCK all refuse it', () => {
    const store = new MemoryStore();
    let { session } = enterLibrary();
    let r = say(session, 'examine darkroom', store);
    expect(text(r.events)).toContain('DO NOT OPEN IF LAMP IS LIT');
    session = r.session;
    for (const phrase of ['open darkroom', 'try darkroom', 'unlock darkroom', 'knock on darkroom']) {
      const result = say(session, phrase, store);
      session = result.session;
      expect(text(result.events)).toContain("somebody's arrangement with the county");
    }
  });

  it('WAIT renders the fan/lamp/forty-two-drawers text', () => {
    const store = new MemoryStore();
    const { session } = enterLibrary();
    const { events } = say(session, 'wait', store);
    expect(text(events)).toBe('You wait. The fan. The lamp ticking. Forty-two drawers of everything that ever happened to this county, none of it in any hurry.');
  });

  it('HELLO/SHOUT (no target) renders the cellar text', () => {
    const store = new MemoryStore();
    const { session } = enterLibrary();
    const { events } = say(session, 'shout', store);
    expect(text(events)).toContain('downward, into a cellar');
  });

  it('SLEEP renders the library\'s own chair text', () => {
    const store = new MemoryStore();
    const { session } = enterLibrary();
    const { events } = say(session, 'sleep', store);
    expect(text(events)).toContain('libraries buy specifically so nobody sleeps in it');
  });

  it('WHAT YEAR IS IT falls through to the global (no room override, matching generalStore.ts\'s own precedent)', () => {
    const store = new MemoryStore();
    const { session } = enterLibrary();
    const { events } = say(session, 'what year is it', store);
    expect(text(events)).toContain('You could make a case for a good many different years');
  });

  // Wave-3 amendment (§15.3, Main Street task): `up` and `n` are now also
  // real exits to Main Street (§10's own exits table — "out"/"up"/
  // "north"/"leave"/"exit"), alongside the reciprocal compass `nw`.
  it('OUT, NW, UP and N all leave to Main Street with the exit\'s travelText', () => {
    const store = new MemoryStore();
    for (const phrase of ['out', 'nw', 'up', 'n']) {
      const { session } = enterLibrary();
      const { session: after, events } = say(session, phrase, store);
      expect(text(events)).toContain('colder than the cellar was');
      expect(after.state.location).toBe('act1_main_street');
    }
  });

  it('every other direction gives the in-world refusal, not a build-boundary line', () => {
    const store = new MemoryStore();
    const { session } = enterLibrary();
    for (const dir of ['s', 'e', 'w', 'ne', 'se', 'sw', 'down']) {
      const { events } = say(session, dir, store);
      expect(text(events)).toContain('The library over your head is somebody else\'s building until morning.');
      expect(text(events)).not.toContain('END OF BUILD');
    }
  });

  it('produces no unexpected diagnostics across the whole script', () => {
    const store = new MemoryStore();
    let { session, events: openingEvents } = enterLibrary();
    let allDiags = diagCodes(openingEvents);
    const script = [
      'examine reader',
      'read screen',
      'turn crank',
      'examine drawers',
      'open drawer',
      'read cards',
      'examine catalogue',
      'examine terminal',
      'search terminal',
      'examine book',
      'sign book',
      'examine darkroom',
      'wait',
      'sleep',
    ];
    for (const line of script) {
      const r = say(session, line, store);
      session = r.session;
      allDiags = allDiags.concat(diagCodes(r.events));
    }
    expect(allDiags).toEqual([]);
  });
});
