// Act I Wave 4 — Jack, M1/M3, and Pearl's `topic_jack`
// (`docs/superpowers/specs/2026-09-05-act1-wave4-prose.md` PART TWO §6,
// PART THREE §7-§8, PART FOUR §9).
//
// KNOWN OUT-OF-SCOPE VALIDATOR ERROR (the concurrent Arrowhead Motel
// task's own module, not this one's): `jacksMotelRoom.name`/`.aliases`
// ("The Arrowhead Motel" / "the arrowhead") trip `validate.ts`'s
// `noise-word-vocabulary` check (a leading "the" is stripped by
// `dropBaseNoise` before lookup, so the phrase as declared can never be
// typed back in). Filtered out of this file's own validate assertion below
// — fixing it means editing `jacksMotel.ts`, a different task's module —
// and reported rather than silently absorbed.

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
import {
  CLUE_JULES,
  CLUE_TATTOO_GAP,
  FEDORA,
  FLAG_HEARD_NOLAN_NAME,
  FLAG_JACK_SAW_PAGE,
  FLAG_SAW_JACK_TATTOO,
  FLAG_TOLD_JACK_ABOUT_ROOM,
  JACK,
  JACKS_MOTEL,
  MEM_M1_HIRING,
  MUG,
  PAGE_78,
  ROOM_KEY,
  SUNDOWN_DINER,
} from '../src/content/world/act1/ids';

// ---------------------------------------------------------------------------
// TEST_WORLD — see this file's header.
// ---------------------------------------------------------------------------

// The room landed in `world.ts` before this file was finished; the build-time overlay is gone.
const TEST_WORLD: WorldDef = WORLD;

const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-05T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

/** Teleports a fresh session straight into the motel — same technique `world-act1-wave3-diner.test.ts`'s own `enterDiner` uses. */
function enterMotel(): { session: SessionState; events: GameEvent[] } {
  const fresh = createSession(TEST_WORLD);
  const teleported: GameState = { ...fresh.state, location: JACKS_MOTEL };
  const { state, events } = renderArrival(TEST_WORLD, teleported);
  return { session: { ...fresh, state }, events };
}

/** Same, but into the diner (for M1's own trigger, §7: "first entry to sundown_diner"). */
function enterDiner(): { session: SessionState; events: GameEvent[] } {
  const fresh = createSession(TEST_WORLD);
  const teleported: GameState = { ...fresh.state, location: SUNDOWN_DINER };
  const { state, events } = renderArrival(TEST_WORLD, teleported);
  return { session: { ...fresh, state }, events };
}

/** One line of real player input, through the real parser and turn pipeline. */
function say(session: SessionState, text: string, store: MemoryStore): { session: SessionState; events: GameEvent[] } {
  const view = buildScopeView(TEST_WORLD, session.state, vocab);
  const outcome = new DeterministicParser().interpret(text, view);
  const result = takeTurn(TEST_WORLD, session, vocab, outcome, opts(store));
  return { session: result.session, events: result.events };
}

/**
 * Carries an object straight into inventory, bypassing TAKE. Also clears
 * `hidden` — `PAGE_78` (`objects/page78.ts`) declares `hidden: true` by
 * default (only revealed by searching the fedora), and a location overlay
 * alone does not clear that; `objectsListedInRoom`/scope visibility checks
 * both `location` and `hidden` regardless of whether the location is a
 * room or `'inventory'`.
 */
function carry(session: SessionState, ...ids: (typeof FEDORA)[]): SessionState {
  const objects = { ...session.state.objects };
  for (const id of ids) objects[id] = { ...objects[id], location: 'inventory', hidden: false };
  return { ...session, state: { ...session.state, objects } };
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
// Shape — validate(TEST_WORLD) clean of errors, this task's own content
// only (see this file's header for the one known, out-of-scope finding
// filtered out below).
// ---------------------------------------------------------------------------

/** The concurrent Arrowhead Motel task's own `noise-word-vocabulary` findings — see this file's header. */
const KNOWN_OUT_OF_SCOPE_ERROR_CODES = new Set(['noise-word-vocabulary']);

describe('validate — Act I Wave 4 (Jack)', () => {
  it('produces zero errors of this task\'s own making', () => {
    const errors = validate(TEST_WORLD).filter((f) => f.severity === 'error' && !KNOWN_OUT_OF_SCOPE_ERROR_CODES.has(f.code));
    expect(errors).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Greeting
// ---------------------------------------------------------------------------

describe('Jack — greeting', () => {
  it('rule 1 is the first HELLO; the rotation (rule 4) runs from the second on, with no memory/flag state', () => {
    const store = new MemoryStore();
    let { session } = enterMotel();
    const first = say(session, 'hello jack', store);
    expect(text(first.events)).toContain('He gets the chair out from under the table with his foot');
    session = first.session;
    expect(session.state.npcs[JACK]?.met).toBe(true);

    const r2 = say(session, 'hello jack', store);
    expect(text(r2.events)).toContain('He is at the table with the folder open');
    session = r2.session;
    const r3 = say(session, 'hello jack', store);
    expect(text(r3.events)).toContain("Five weeks I've been in this room");
    session = r3.session;
    const r4 = say(session, 'hello jack', store);
    expect(text(r4.events)).toContain("There's crackers");
  });

  it('rule 3 fires once M1 is held (after the first HELLO, which always hits rule 1)', () => {
    const store = new MemoryStore();
    let { session } = enterMotel();
    session = say(session, 'hello jack', store).session; // rule 1, the first meeting
    session = { ...session, state: { ...session.state, memories: [...session.state.memories, MEM_M1_HIRING] } };
    const { events } = say(session, 'hello jack', store);
    expect(text(events)).toContain('You want the coffee out of that machine');
  });

  it('rule 2 fires after TELL JACK ABOUT ROOM, ahead of rule 3', () => {
    const store = new MemoryStore();
    let { session } = enterMotel();
    session = { ...session, state: { ...session.state, memories: [...session.state.memories, MEM_M1_HIRING] } };
    const told = say(session, 'tell jack about room', store);
    session = told.session;
    expect(session.state.flags[FLAG_TOLD_JACK_ABOUT_ROOM]).toBe(true);
    const { events } = say(session, 'hello jack', store);
    expect(text(events)).toMatch(/does not sit down now|Truck's got gas in it/);
  });
});

// ---------------------------------------------------------------------------
// Topics
// ---------------------------------------------------------------------------

describe('Jack — topics', () => {
  it('topic_job rule 2 (no M1) then rule 1 (with M1)', () => {
    const store = new MemoryStore();
    let { session } = enterMotel();
    const r1 = say(session, 'ask jack about job', store);
    expect(text(r1.events)).toContain('Cash. Weekly, and whatever it costs you.');
    expect(diagCodes(r1.events)).toEqual([]);
    session = r1.session;
    session = { ...session, state: { ...session.state, memories: [...session.state.memories, MEM_M1_HIRING] } };
    const r2 = say(session, 'ask jack about job', store);
    expect(text(r2.events)).toContain('I asked whether you thought I was lying.');
  });

  it('topic_jules sets clue_jules', () => {
    const store = new MemoryStore();
    const { session } = enterMotel();
    const { events } = say(session, 'ask jack about jules', store);
    expect(text(events)).toContain('My oldest brother.');
    expect(clueIds(events)).toContain(CLUE_JULES);
  });

  it('topic_nobody', () => {
    const store = new MemoryStore();
    const { session } = enterMotel();
    const { events } = say(session, 'ask jack about nobody remembering him', store);
    expect(text(events)).toContain("I'm not asking you to believe me.");
  });

  it('topic_notebook', () => {
    const store = new MemoryStore();
    const { session } = enterMotel();
    const { events } = say(session, 'ask jack about notebook', store);
    expect(text(events)).toContain('He kept a book.');
  });

  it('topic_family', () => {
    const store = new MemoryStore();
    const { session } = enterMotel();
    const { events } = say(session, 'ask jack about family', store);
    expect(text(events)).toContain("There's four of us that anybody's heard of.");
  });

  it('topic_tattoo rule 2 (no M3) sets saw_jack_tattoo and grants clue_tattoo_gap; rule 1 fires once an M3 variant is held', () => {
    const store = new MemoryStore();
    let { session } = enterMotel();
    const r1 = say(session, 'ask jack about tattoo', store);
    expect(text(r1.events)).toContain("We all got them the same afternoon.");
    expect(clueIds(r1.events)).toContain(CLUE_TATTOO_GAP);
    session = r1.session;
    expect(session.state.flags[FLAG_SAW_JACK_TATTOO]).toBe(true);
    // Rule 2's own effects fire M3's trigger this same turn (§6.5's own
    // note): by the next question, an M3 variant is already held and rule
    // 1 answers instead.
    const r2 = say(session, 'ask jack about tattoo', store);
    expect(text(r2.events)).toContain("Ask Luke why he's two");
  });

  it('topic_letters', () => {
    const store = new MemoryStore();
    const { session } = enterMotel();
    const { events } = say(session, 'ask jack about letters', store);
    expect(text(events)).toContain("I'd have taken him not writing back.");
  });

  it('topic_polaroid', () => {
    const store = new MemoryStore();
    const { session } = enterMotel();
    const { events } = say(session, 'ask jack about polaroid', store);
    expect(text(events)).toContain("That's the porch at the old place.");
  });

  it('topic_keys', () => {
    const store = new MemoryStore();
    const { session } = enterMotel();
    const { events } = say(session, 'ask jack about keys', store);
    expect(text(events)).toContain('His spares.');
  });

  it('topic_nolan sets heard_nolan_name', () => {
    const store = new MemoryStore();
    const { session } = enterMotel();
    const { session: after, events } = say(session, 'ask jack about nolan', store);
    expect(text(events)).toContain("Jules's manager out there");
    expect(after.state.flags[FLAG_HEARD_NOLAN_NAME]).toBe(true);
  });

  it('topic_pearl (reciprocal of pearl.ts\'s topic_jack)', () => {
    const store = new MemoryStore();
    const { session } = enterMotel();
    const { events } = say(session, 'ask jack about pearl', store);
    expect(text(events)).toContain("Six every morning, at that counter.");
  });

  it('topic_name', () => {
    const store = new MemoryStore();
    const { session } = enterMotel();
    const { events } = say(session, 'ask jack about my name', store);
    expect(text(events)).toContain('You never gave me one.');
  });

  it('topic_head', () => {
    const store = new MemoryStore();
    const { session } = enterMotel();
    const { events } = say(session, 'ask jack about head', store);
    expect(text(events)).toContain('Somebody hit you.');
  });

  it('topic_dad', () => {
    const store = new MemoryStore();
    const { session } = enterMotel();
    const { events } = say(session, 'ask jack about dad', store);
    expect(text(events)).toContain("That's his writing in the lid.");
  });

  it('unknownTopic rotates through its three variants and tags topicMiss', () => {
    const store = new MemoryStore();
    let { session } = enterMotel();
    const seen: string[] = [];
    for (let i = 0; i < 3; i++) {
      const r = say(session, 'ask jack about the weather', store);
      session = r.session;
      seen.push(text(r.events));
      expect(diagCodes(r.events)).toEqual(['topicMiss']);
    }
    expect(seen[0]).toContain("I don't know that.");
    expect(seen[1]).toContain('turned back into his brother');
    expect(seen[2]).toContain("That's not one of mine.");
  });
});

// ---------------------------------------------------------------------------
// tellTopics
// ---------------------------------------------------------------------------

describe('Jack — tellTopics', () => {
  it('tell_room sets told_jack_about_room and gives the spine line', () => {
    const store = new MemoryStore();
    const { session } = enterMotel();
    const { session: after, events } = say(session, 'tell jack about room', store);
    expect(text(events)).toContain("there's somebody else looking for the same thing I am");
    expect(after.state.flags[FLAG_TOLD_JACK_ABOUT_ROOM]).toBe(true);
  });

  it('tell_memory', () => {
    const store = new MemoryStore();
    const { session } = enterMotel();
    const { events } = say(session, 'tell jack about my memory', store);
    expect(text(events)).toContain("I never had it anyway.");
  });
});

// ---------------------------------------------------------------------------
// showResponses
// ---------------------------------------------------------------------------

describe('Jack — showResponses', () => {
  it('SHOW HAT TO JACK', () => {
    const store = new MemoryStore();
    let { session } = enterMotel();
    session = carry(session, FEDORA);
    const { events } = say(session, 'show hat to jack', store);
    expect(text(events)).toContain("Keep it on");
  });

  it('SHOW MUG TO JACK', () => {
    const store = new MemoryStore();
    let { session } = enterMotel();
    session = carry(session, MUG);
    const { events } = say(session, 'show mug to jack', store);
    expect(text(events)).toContain("Take that back to her");
  });

  it('SHOW PAGE TO JACK sets jack_saw_page', () => {
    const store = new MemoryStore();
    let { session } = enterMotel();
    session = carry(session, PAGE_78);
    const { session: after, events } = say(session, 'show page to jack', store);
    expect(text(events)).toContain('Where did you get this?');
    expect(after.state.flags[FLAG_JACK_SAW_PAGE]).toBe(true);
  });

  it('SHOW KEY TO JACK', () => {
    const store = new MemoryStore();
    let { session } = enterMotel();
    session = carry(session, ROOM_KEY);
    const { events } = say(session, 'show key to jack', store);
    expect(text(events)).toContain("Marlow's tag.");
  });
});

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

describe('Jack — handlers', () => {
  it('ATTACK JACK, KISS JACK, HUG JACK and FOLLOW JACK each render their own text', () => {
    const store = new MemoryStore();
    let { session } = enterMotel();
    let r = say(session, 'attack jack', store);
    expect(text(r.events)).toContain('he would listen');
    session = r.session;
    r = say(session, 'kiss jack', store);
    expect(text(r.events)).toContain('somebody hit you in the head');
    session = r.session;
    r = say(session, 'hug jack', store);
    expect(text(r.events)).toContain('He allows it.');
    session = r.session;
    r = say(session, 'follow jack', store);
    expect(text(r.events)).toContain("I'm not going anywhere.");
  });
});

// ---------------------------------------------------------------------------
// M1 — the hiring
// ---------------------------------------------------------------------------

describe('M1 — the hiring', () => {
  it('is granted on the tick after the first entry to the diner', () => {
    const store = new MemoryStore();
    let { session } = enterDiner();
    expect(session.state.memories).not.toContain(MEM_M1_HIRING);
    const { session: after, events } = say(session, 'wait', store);
    expect(after.state.memories).toContain(MEM_M1_HIRING);
    const memoryEvent = events.find((e) => e.type === 'memory');
    expect(memoryEvent).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// M3 — the tattoo day
// ---------------------------------------------------------------------------

describe('M3 — the tattoo day', () => {
  it('a tied profile fires the social variant', () => {
    const store = new MemoryStore();
    const { session } = enterMotel();
    const { session: after } = say(session, 'ask jack about tattoo', store);
    expect(after.state.memories).toContain('act1_mem_m3_social');
    expect(after.state.memories).not.toContain('act1_mem_m3_analytical');
    expect(after.state.memories).not.toContain('act1_mem_m3_direct');
  });

  it('an analytical-leading profile fires the analytical variant', () => {
    const store = new MemoryStore();
    let { session } = enterMotel();
    session = { ...session, state: { ...session.state, profile: { analytical: 3, social: 0, direct: 0 } } };
    const { session: after } = say(session, 'ask jack about tattoo', store);
    expect(after.state.memories).toContain('act1_mem_m3_analytical');
    expect(after.state.memories).not.toContain('act1_mem_m3_social');
  });
});

// ---------------------------------------------------------------------------
// Pearl's topic_jack (§9)
// ---------------------------------------------------------------------------

describe("Pearl — topic_jack", () => {
  it('ASK PEARL ABOUT JACK / ASK PEARL ABOUT TRUCK both resolve to the same, ungated topic', () => {
    const store = new MemoryStore();
    // Pearl lives in the diner (unchanged from wave 3) — reuse the same
    // teleport-and-arrive technique as `enterDiner`, above.
    let { session } = enterDiner();
    for (const phrase of ['ask pearl about jack', 'ask pearl about truck']) {
      const { session: after, events } = say(session, phrase, store);
      expect(text(events)).toContain("He's a good boy carrying a thing.");
      expect(diagCodes(events)).toEqual([]);
      session = after;
    }
  });
});
