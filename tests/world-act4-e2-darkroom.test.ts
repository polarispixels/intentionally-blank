// Stage E2, task Q — the library annex, the darkroom, the two prints, and
// R17 (`docs/superpowers/specs/2026-09-19-stage-e2-prose.md` §42-§47, §52,
// §56, §57). Same session/turn pipeline pattern as
// `tests/world-act4-e1-staging.test.ts`.

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
import type { ObjectId } from '../src/engine/ids';
import { CHAIR_LEG, COUNTY_LIBRARY, INTACT_POLAROIDS } from '../src/content/world/act1/ids';
import { ACT2_CACHE_POLAROID, ACT2_FILM_CANISTER } from '../src/content/world/act2/ids';
import {
  ACT4_ANNEX_SHELF,
  ACT4_CLUE_SKY_IS_CEILING,
  ACT4_DARKROOM_KEY,
  ACT4_DARKROOM_OPEN,
  ACT4_JULES_FILM_DEVELOPED,
  ACT4_P24_MARS_FILM,
  ACT4_PRINT_LAST_DAY,
  ACT4_PRINT_SKY,
  ACT4_Q_THE_SKY,
  ACT4_SISSY_FILM,
  ACT4_SISSY_FILM_DEVELOPED,
  ACT4_SKY_MATCHED,
  ACT4_STARTED,
} from '../src/content/world/act4/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-19T04:00:00.000Z', gameVersion: 'test-0.0.0' };
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

function enter(session: SessionState, location: GameState['location']): SessionState {
  const teleported: GameState = { ...session.state, location };
  const { state } = renderArrival(TEST_WORLD, teleported);
  return { ...session, state };
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

/** Canon 70/93 — nobody counts anything; no digit anywhere in this wave's own texts. */
function assertNoDigit(rendered: string): void {
  expect(rendered).not.toMatch(/[0-9]/);
}

function atLibrary(patch: Partial<GameState> = {}): SessionState {
  return enter(withState(patch), COUNTY_LIBRARY);
}

/** Places `id` directly in inventory, bypassing TAKE (and any `hidden: true` default — the fixture's business, not the object's; a player never gets here without the reveal already having happened). */
function held(session: SessionState, id: ObjectId): SessionState {
  return { ...session, state: { ...session.state, objects: { ...session.state.objects, [id]: { location: 'inventory', hidden: false } } } };
}

describe('validate — Stage E2, task Q', () => {
  // Scoped to this task's own ids (same idiom as `tests/world-act4-e0-
  // street.test.ts`'s own "produces no errors on this task's own..." check):
  // two other builders (O, P) run concurrently on this same `WORLD`, and an
  // error from their own module is not this task's to fix.
  it('produces no errors on this task\'s own objects/ids', () => {
    const errors = validate(TEST_WORLD).filter((f) => f.severity === 'error');
    const mine = errors.filter((f) => /act4_annex_shelf|act4_darkroom_key|act4_darkroom_open|act4_print_sky|act4_print_last_day|act4_clue_sky_is_ceiling|act4_p24_mars_film|act4_develop|act1_darkroom_door/.test(f.message));
    expect(mine).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// §42.1 — the annex shelf
// ---------------------------------------------------------------------------

describe('§42.1 — the annex shelf reveals the darkroom key', () => {
  it('EXAMINE SHELF reveals it; TAKE KEY then works', () => {
    const store = new MemoryStore();
    const session = atLibrary();
    const { session: after, events } = say(session, 'examine shelf', store);
    assertNoLeak(text(events));
    const { session: taken } = say(after, 'take key', store);
    expect(taken.state.objects[ACT4_DARKROOM_KEY]?.location).toBe('inventory');
  });

  it('SEARCH COUNTER reveals it too', () => {
    const store = new MemoryStore();
    const session = atLibrary();
    const { session: after } = say(session, 'search counter', store);
    const { session: taken } = say(after, 'take key', store);
    expect(taken.state.objects[ACT4_DARKROOM_KEY]?.location).toBe('inventory');
  });

  it('LOOK UNDER BOOK reveals it too (the key lives under the shelf the book stands on)', () => {
    const store = new MemoryStore();
    const session = atLibrary();
    const { session: after } = say(session, 'look under book', store);
    const { session: taken } = say(after, 'take key', store);
    expect(taken.state.objects[ACT4_DARKROOM_KEY]?.location).toBe('inventory');
  });

  it('the shelf does not take "book" as a noun of its own', () => {
    // "examine book" must still reach the shipped sign-in book, not the shelf.
    const store = new MemoryStore();
    const session = atLibrary();
    const { events } = say(session, 'examine book', store);
    expect(text(events)).toMatch(/ledger/);
  });
});

// ---------------------------------------------------------------------------
// §43 — opening the darkroom (register 131 — no act gate, any route)
// ---------------------------------------------------------------------------

describe('§43 — opening the darkroom', () => {
  it('PRY DOOR WITH CHAIR LEG sets act4_darkroom_open', () => {
    const store = new MemoryStore();
    let session = atLibrary();
    session = held(session, CHAIR_LEG);
    const { session: after, events } = say(session, 'pry door with chair leg', store);
    assertNoLeak(text(events));
    expect(after.state.flags[ACT4_DARKROOM_OPEN]).toBe(true);
  });

  it('on a fresh state, UNLOCK DOOR WITH KEY also sets it', () => {
    const store = new MemoryStore();
    let session = atLibrary();
    session = held(session, ACT4_DARKROOM_KEY);
    const { session: after, events } = say(session, 'unlock door with key', store);
    assertNoLeak(text(events));
    expect(after.state.flags[ACT4_DARKROOM_OPEN]).toBe(true);
  });

  it('the open examine (§43.3) once act4_darkroom_open is set', () => {
    const store = new MemoryStore();
    const session = atLibrary({ flags: { [ACT4_DARKROOM_OPEN]: true } });
    const { events } = say(session, 'examine door', store);
    const rendered = text(events);
    expect(rendered).toMatch(/curtain/);
    assertNoLeak(rendered);
  });

  it('opens in Act II state — no act4_started required (register 131)', () => {
    const store = new MemoryStore();
    let session = atLibrary({ flags: { [ACT4_STARTED]: false } });
    session = held(session, CHAIR_LEG);
    const { session: after } = say(session, 'pry door with chair leg', store);
    expect(after.state.flags[ACT4_DARKROOM_OPEN]).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// §44 — the develop scene
// ---------------------------------------------------------------------------

function darkroomReady(patch: Partial<GameState> = {}): SessionState {
  return atLibrary({ flags: { [ACT4_DARKROOM_OPEN]: true }, clock: { day: 1, minute: 480 }, ...patch });
}

describe('§44 — the develop scene', () => {
  it("develops Sissy's canister into the sky print; an hour passes", () => {
    const store = new MemoryStore();
    let session = darkroomReady();
    session = held(session, ACT4_SISSY_FILM);
    const before = session.state.clock.minute;
    const { session: after, events } = say(session, 'develop film', store);
    const rendered = text(events);
    assertNoLeak(rendered);
    assertNoDigit(rendered);
    expect(after.state.flags[ACT4_SISSY_FILM_DEVELOPED]).toBe(true);
    expect(after.state.objects[ACT4_PRINT_SKY]?.location).toBe('inventory');
    expect(after.state.clock.minute - before).toBe(60);
  });

  it("develops Jules's canister into the last-day print — the stranger unremarked, no 'face'", () => {
    const store = new MemoryStore();
    let session = darkroomReady();
    session = held(session, ACT2_FILM_CANISTER);
    const { session: after, events } = say(session, 'develop film', store);
    const rendered = text(events);
    assertNoLeak(rendered);
    expect(rendered).not.toMatch(/\bface\b/);
    expect(after.state.flags[ACT4_JULES_FILM_DEVELOPED]).toBe(true);
    expect(after.state.objects[ACT4_PRINT_LAST_DAY]?.location).toBe('inventory');
  });

  it('with both canisters held, DEVELOP FILM is ambiguous — asks which (§56.2\'s film row)', () => {
    let session = darkroomReady();
    session = held(session, ACT4_SISSY_FILM);
    session = held(session, ACT2_FILM_CANISTER);
    const view = buildScopeView(TEST_WORLD, session.state, vocab);
    const outcome = new DeterministicParser().interpret('develop film', view);
    expect(outcome.kind).toBe('clarify');
  });

  it('opens and develops in Act II state — no act4_started required (register 131)', () => {
    const store = new MemoryStore();
    let session = darkroomReady({ flags: { [ACT4_DARKROOM_OPEN]: true, [ACT4_STARTED]: false } });
    session = held(session, ACT4_SISSY_FILM);
    const { session: after } = say(session, 'develop film', store);
    expect(after.state.flags[ACT4_SISSY_FILM_DEVELOPED]).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// §45 — the two prints
// ---------------------------------------------------------------------------

describe('§45 — the two prints', () => {
  it('EXAMINE SKY PRINT — plotCritical, no digits, no leaks', () => {
    const store = new MemoryStore();
    let session = atLibrary();
    session = held(session, ACT4_PRINT_SKY);
    const { events } = say(session, 'examine sky print', store);
    const rendered = text(events);
    assertNoLeak(rendered);
    assertNoDigit(rendered);
    expect(TEST_WORLD.objects?.[ACT4_PRINT_SKY]?.plotCritical).toBe(true);
  });

  it('EXAMINE KITCHEN PRINT — the stranger, entirely unremarked', () => {
    const store = new MemoryStore();
    let session = atLibrary();
    session = held(session, ACT4_PRINT_LAST_DAY);
    const { events } = say(session, 'examine kitchen print', store);
    const rendered = text(events);
    assertNoLeak(rendered);
    expect(rendered).not.toMatch(/\bface\b/);
    expect(TEST_WORLD.objects?.[ACT4_PRINT_LAST_DAY]?.plotCritical).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// §46 — R17
// ---------------------------------------------------------------------------

describe('§46 — R17, COMPARE PRINT WITH POLAROID', () => {
  it('grants the clue, sets the flag, and answers the question', () => {
    const store = new MemoryStore();
    let session = atLibrary();
    session = held(session, ACT4_PRINT_SKY);
    session = held(session, INTACT_POLAROIDS);
    // Bare "print" alone is genuinely ambiguous once held alongside
    // `act1_intact_polaroids` (its own shipped noun list includes "print"/
    // "prints", §56.2's own print-collision row) — "SKY PRINT" is one of
    // §46's own three accepted phrasings and resolves the dobj uniquely.
    const { session: after, events } = say(session, 'compare sky print with polaroid', store);
    const rendered = text(events);
    assertNoLeak(rendered);
    expect(clueIds(events)).toContain(ACT4_CLUE_SKY_IS_CEILING);
    expect(after.state.flags[ACT4_SKY_MATCHED]).toBe(true);
    expect(after.state.questions[ACT4_Q_THE_SKY]).toBe('answered');
  });

  it('with the cache Polaroid also held, a clean disambiguating answer still resolves to act1_intact_polaroids, not the cache Polaroid', () => {
    const store = new MemoryStore();
    let session = atLibrary();
    session = held(session, ACT4_PRINT_SKY);
    session = held(session, INTACT_POLAROIDS);
    session = held(session, ACT2_CACHE_POLAROID);
    const { session: afterClarify, events: clarifyEvents } = say(session, 'compare sky print with polaroid', store);
    expect(clarifyEvents.some((e) => e.type === 'clarify')).toBe(true);
    // "porch" is one of act1_intact_polaroids' own nouns and not one of the
    // cache Polaroid's — an honest disambiguating answer, not a guess.
    const { session: after, events } = say(afterClarify, 'porch', store);
    const rendered = text(events);
    assertNoLeak(rendered);
    expect(clueIds(events)).toContain(ACT4_CLUE_SKY_IS_CEILING);
    expect(after.state.flags[ACT4_SKY_MATCHED]).toBe(true);
    expect(after.state.questions[ACT4_Q_THE_SKY]).toBe('answered');
  });
});

// ---------------------------------------------------------------------------
// §47.2 — P24's hint ladder
// ---------------------------------------------------------------------------

describe('P24 — act4_p24_mars_film', () => {
  it('is wired: question, solvedWhen, onSolved, three solutions, five hints', () => {
    const puzzle = TEST_WORLD.puzzles?.[ACT4_P24_MARS_FILM];
    expect(puzzle).toBeDefined();
    expect(puzzle?.question).toBe(ACT4_Q_THE_SKY);
    expect(puzzle?.solvedWhen).toEqual({ clue: ACT4_CLUE_SKY_IS_CEILING });
    expect(puzzle?.onSolved).toEqual([{ answerQuestion: ACT4_Q_THE_SKY }]);
    expect(puzzle?.solutions).toHaveLength(3);
    expect(puzzle?.hints).toHaveLength(5);
  });
});
