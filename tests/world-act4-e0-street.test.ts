// Stage E, wave E0, task I — the town before the visit
// (`docs/superpowers/specs/2026-09-17-stage-e0-prose.md` §3-§9, §27, §31,
// §32; Stage E plan §2 E0). Main Street's three description rules, the
// crews, the post office's second notice, Pearl's and Marlow's prepended
// rules, the diner's window, the Lobby's staging doors, and
// `act4_ev_start`/`act4_set_visit_day`.

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
import {
  COUNTY_LIBRARY,
  FRONT_DESK,
  GENERAL_STORE,
  JACKS_MOTEL,
  MAIN_STREET,
  POST_OFFICE,
  SHERIFF_OFFICE,
  SUNDOWN_DINER,
  TOWN_EDGE,
} from '../src/content/world/act1/ids';
import { ACT2_CACHE_FOUND, ACT2_CLUE_REPAVING, ACT2_STARTED } from '../src/content/world/act2/ids';
import { ACT3_CLUE_REACQUIRE, ACT3_LOBBY } from '../src/content/world/act3/ids';
import { ACT4_CLUE_VISIT_COMING, ACT4_STARTED, ACT4_VISIT_ANNOUNCED, ACT4_VISIT_DAY, ACT4_VISIT_NOTICE, ACT4_VISIT_OVER_DAY } from '../src/content/world/act4/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-17T04:00:00.000Z', gameVersion: 'test-0.0.0' };
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

/** No raw id or unresolved `{name}`-style template ever reaches the player. */
function assertNoLeak(rendered: string): void {
  expect(rendered).not.toMatch(/act4_/);
  expect(rendered).not.toMatch(/act1_/);
  expect(rendered).not.toMatch(/\{[a-zA-Z]+\}/);
}

/**
 * A session with Act IV under way (announced, day 5 — visit day 6, over
 * day 8), at Main Street, morning. Flags are patched directly (rather than
 * driving the real `act4_ev_start`, which is covered on its own below), so
 * the notice's one-way `{ reveal }` is replayed by hand (`objects`), and a
 * priming `wait` turn is taken once at Main Street so the crews' own
 * every-turn visibility recompute (`act4_ev_crews_visible`) has already
 * run once before the test's own command — exactly what a real player's
 * prior turn in the room would already have done (`enter()`, below, is a
 * raw teleport for testing arrival text and does not itself tick).
 */
function actFourMainStreet(patch: Partial<GameState> = {}): SessionState {
  const { flags: patchFlags, objects: patchObjects, clock: patchClock, ...rest } = patch;
  const base = withState({
    ...rest,
    clock: patchClock ?? { day: 5, minute: 480 }, // morning
    flags: {
      [ACT2_STARTED]: true,
      [ACT2_CACHE_FOUND]: true,
      [ACT4_STARTED]: true,
      [ACT4_VISIT_ANNOUNCED]: true,
      [ACT4_VISIT_DAY]: 6,
      [ACT4_VISIT_OVER_DAY]: 8,
      ...(patchFlags ?? {}),
    },
    objects: {
      [ACT4_VISIT_NOTICE]: { hidden: false },
      ...(patchObjects ?? {}),
    },
  });
  const { session } = enter(base, MAIN_STREET);
  const primed = say(session, 'wait', new MemoryStore());
  return primed.session;
}

describe('validate — E0 task I (the town before the visit)', () => {
  // Two other builders (J, K) run concurrently on this same `WORLD` — a
  // mid-flight error from their own module (e.g. Whitlock's showResponses
  // referencing `act4_case_notes`, task J's own object, declared or not
  // depending on ordering) is not this task's to fix. Scoped to errors
  // that name this task's own ids/paths.
  it('produces no errors on this task\'s own objects/rooms/npcs', () => {
    const errors = validate(TEST_WORLD).filter((f) => f.severity === 'error');
    const mine = errors.filter((f) => /act4_crews|act4_visit_notice|act1_main_street|act1_pearl|act1_marlow|act1_diner_window|act3_lobby|act4_ev_start|act4_ev_crews_visible|act4_set_visit_day|act4_crews_visibility/.test(f.message));
    expect(mine).toEqual([]);
  });
});

describe('act4_ev_start — the wave\'s hinge', () => {
  it('fires once, on act3_clue_reacquire, setting both flags and the two day flags off the live clock', () => {
    const store = new MemoryStore();
    const session = withState({ clock: { day: 10, minute: 480 }, clues: [ACT3_CLUE_REACQUIRE] });
    const { session: after } = say(session, 'wait', store);
    expect(after.state.flags[ACT4_STARTED]).toBe(true);
    expect(after.state.flags[ACT4_VISIT_ANNOUNCED]).toBe(true);
    expect(after.state.flags[ACT4_VISIT_DAY]).toBe(11);
    expect(after.state.flags[ACT4_VISIT_OVER_DAY]).toBe(13);
  });

  it('does not fire a second time (no double-apply on a later turn)', () => {
    const store = new MemoryStore();
    const session = withState({ clock: { day: 10, minute: 480 }, clues: [ACT3_CLUE_REACQUIRE] });
    const { session: once } = say(session, 'wait', store);
    const { session: twice } = say(once, 'wait', store);
    expect(twice.state.flags[ACT4_VISIT_DAY]).toBe(11);
    expect(twice.state.flags[ACT4_VISIT_OVER_DAY]).toBe(13);
  });

  it('does not fire before the clue is granted', () => {
    const store = new MemoryStore();
    const session = withState({ clock: { day: 10, minute: 480 } });
    const { session: after } = say(session, 'wait', store);
    expect(after.state.flags[ACT4_STARTED]).not.toBe(true);
    expect(after.state.flags[ACT4_VISIT_ANNOUNCED]).not.toBe(true);
  });
});

describe('Main Street — the three description rules (§3)', () => {
  it('rule 1 (§3.2) — morning/afternoon, announced, before the crews leave', () => {
    const session = actFourMainStreet({ clock: { day: 5, minute: 480 } });
    const { events } = enter(session, MAIN_STREET);
    const rendered = text(events);
    expect(rendered).toMatch(/A milling machine is eating the crown of the road/);
    expect(rendered).not.toMatch(/black and even/);
    assertNoLeak(rendered);
  });

  it('rule 1 (§3.2) — afternoon too', () => {
    const session = actFourMainStreet({ clock: { day: 5, minute: 800 } });
    const { events } = enter(session, MAIN_STREET);
    expect(text(events)).toMatch(/A milling machine is eating the crown of the road/);
  });

  it('rule 2 (§3.3) — evening/night, announced, before the crews leave', () => {
    const session = actFourMainStreet({ clock: { day: 5, minute: 1100 } });
    const { events } = enter(session, MAIN_STREET);
    const rendered = text(events);
    expect(rendered).toMatch(/The street is shut and lit/);
    expect(rendered).not.toMatch(/black and even/);
    assertNoLeak(rendered);
  });

  it('rule 2 (§3.3) — night too', () => {
    const session = actFourMainStreet({ clock: { day: 5, minute: 1350 } });
    const { events } = enter(session, MAIN_STREET);
    expect(text(events)).toMatch(/The street is shut and lit/);
  });

  it('rule 3 (§3.1) — on/after act4_visit_over_day, any phase, the crews are gone', () => {
    const session = actFourMainStreet({ clock: { day: 8, minute: 480 } });
    const { events } = enter(session, MAIN_STREET);
    const rendered = text(events);
    expect(rendered).toMatch(/black and even/);
    expect(rendered).toMatch(/The barriers are gone/);
    assertNoLeak(rendered);
  });

  it('rule 3 wins even at night, once over_day', () => {
    const session = actFourMainStreet({ clock: { day: 9, minute: 1350 } });
    const { events } = enter(session, MAIN_STREET);
    expect(text(events)).toMatch(/black and even/);
  });

  it('before act4_visit_announced, none of the three rules fire', () => {
    const session = withState({ clock: { day: 5, minute: 480 } });
    const { session: at, events: arrivalEvents } = enter(session, MAIN_STREET);
    void at;
    const rendered = text(arrivalEvents);
    expect(rendered).not.toMatch(/milling machine/);
    expect(rendered).not.toMatch(/black and even/);
    expect(rendered).not.toMatch(/street is shut and lit/);
  });
});

describe('the crews — act4_crews (§4)', () => {
  it('X CREW before the visit is announced: not there', () => {
    const session = withState({ clock: { day: 5, minute: 480 } });
    const { session: at } = enter(session, MAIN_STREET);
    const store = new MemoryStore();
    const { events } = say(at, 'x crew', store);
    const rendered = text(events);
    expect(rendered).not.toMatch(/County stripes/);
    assertNoLeak(rendered);
  });

  it('X CREW during the day, announced, before over_day: §4.1, with the one-word fix', () => {
    const session = actFourMainStreet();
    const store = new MemoryStore();
    const { events } = say(session, 'x crew', store);
    const rendered = text(events);
    expect(rendered).toMatch(/A crew of them, and none of them hurrying/);
    expect(rendered).not.toMatch(/Six of them/);
    assertNoLeak(rendered);
  });

  it('X CREW at night (before the crews leave): hidden — the day\'s work has not started', () => {
    const session = actFourMainStreet({ clock: { day: 5, minute: 1350 } });
    const store = new MemoryStore();
    const { events } = say(session, 'x crew', store);
    expect(text(events)).not.toMatch(/County stripes/);
  });

  it('X CREW on/after act4_visit_over_day: hidden, any phase', () => {
    const session = actFourMainStreet({ clock: { day: 8, minute: 480 } });
    const store = new MemoryStore();
    const { events } = say(session, 'x crew', store);
    expect(text(events)).not.toMatch(/County stripes/);
  });

  it('TALK TO CREW — §4.2', () => {
    const session = actFourMainStreet();
    const store = new MemoryStore();
    const { events } = say(session, 'talk to crew', store);
    const rendered = text(events);
    expect(rendered).toMatch(/takes an earplug out for you/);
    expect(rendered).toMatch(/Milling and resurfacing/);
    assertNoLeak(rendered);
  });

  it('HELP CREW — an engine gap (help is exclusively the meta HELP verb, no dobj slot): does not reach §4.3, but does not crash or leak', () => {
    const session = actFourMainStreet();
    const store = new MemoryStore();
    const { events } = say(session, 'help crew', store);
    const rendered = text(events);
    expect(rendered).not.toMatch(/tape end/);
    assertNoLeak(rendered);
  });

  it('USE MACHINE / TOUCH MILL reach §4.3 (the reachable synonyms for "get involved")', () => {
    const session = actFourMainStreet();
    const store = new MemoryStore();
    const useMachine = say(session, 'use machine', store);
    expect(text(useMachine.events)).toMatch(/tape\s+end/);
    const touchMill = say(session, 'touch mill', store);
    expect(text(touchMill.events)).toMatch(/tape\s+end/);
  });

  it('CROSS BARRIER — §4.4', () => {
    const session = actFourMainStreet();
    const store = new MemoryStore();
    const { events } = say(session, 'cross barrier', store);
    const rendered = text(events);
    expect(rendered).toMatch(/fill with water/);
    expect(rendered).toMatch(/gap at the nearest door is four feet wide/);
    assertNoLeak(rendered);
  });

  it('MOVE BARRIER / ENTER WORKS also reach §4.4', () => {
    const session = actFourMainStreet();
    const store = new MemoryStore();
    const moveBarrier = say(session, 'move barrier', store);
    expect(text(moveBarrier.events)).toMatch(/fill with water/);
    const enterWorks = say(session, 'enter works', store);
    expect(text(enterWorks.events)).toMatch(/fill with water/);
  });

  it('COUNT CREW refuses — no number (§4.5, canon 70)', () => {
    const session = actFourMainStreet();
    const store = new MemoryStore();
    const { events } = say(session, 'count crew', store);
    const rendered = text(events);
    expect(rendered).toMatch(/whether you are from the county/);
    expect(rendered).not.toMatch(/\bsix\b/i);
    assertNoLeak(rendered);
  });

  it('every Zone 1 exit from Main Street still works while the road is shut', () => {
    const store = new MemoryStore();
    const cases: [string, GameState['location']][] = [
      ['e', FRONT_DESK],
      ['w', GENERAL_STORE],
      ['s', POST_OFFICE],
      ['sw', SHERIFF_OFFICE],
      ['nw', SUNDOWN_DINER],
      ['se', COUNTY_LIBRARY],
      ['n', TOWN_EDGE],
      ['ne', JACKS_MOTEL],
    ];
    for (const [dir, dest] of cases) {
      const session = actFourMainStreet();
      const { session: after } = say(session, dir, store);
      expect(after.state.location).toBe(dest);
    }
  });
});

describe('the post office board — act4_visit_notice (§5)', () => {
  it('READ BOARD rule 1 — the closure notice, once announced', () => {
    const session = actFourMainStreet();
    const { session: at } = enter(session, POST_OFFICE);
    const store = new MemoryStore();
    const { events } = say(at, 'read board', store);
    const rendered = text(events);
    expect(rendered).toMatch(/NOTICE OF ROAD CLOSURE/);
    expect(rendered).toMatch(/FROM FIRST LIGHT UNTIL RELEASED/);
    expect(rendered).toMatch(/BY ORDER OF THE COUNTY/);
    assertNoLeak(rendered);
  });

  it('READ BOARD before announced falls to the shipped rule (unchanged)', () => {
    const session = withState({ flags: { [ACT2_CACHE_FOUND]: true } });
    const { session: at } = enter(session, POST_OFFICE);
    const store = new MemoryStore();
    const { events } = say(at, 'read board', store);
    expect(text(events)).not.toMatch(/NOTICE OF ROAD CLOSURE/);
  });

  it('EXAMINE CLOSURE NOTICE / SECOND NOTICE / ROAD CLOSURE all resolve to the sub-part', () => {
    const session = actFourMainStreet();
    const { session: at } = enter(session, POST_OFFICE);
    const store = new MemoryStore();
    for (const phrase of ['x closure notice', 'x second notice', 'x road closure']) {
      const { events } = say(at, phrase, store);
      expect(text(events)).toMatch(/NOTICE OF ROAD CLOSURE/);
    }
  });

  it('bare NOTICE stays the board (EXAMINE), not the sub-part', () => {
    const session = actFourMainStreet();
    const { session: at } = enter(session, POST_OFFICE);
    const store = new MemoryStore();
    const { events } = say(at, 'x notice', store);
    const rendered = text(events);
    expect(rendered).toMatch(/NOTICES AND PERSONS SOUGHT/);
    expect(rendered).not.toMatch(/NOTICE OF ROAD CLOSURE/);
  });

  it('the closure notice does not resolve before the visit is announced', () => {
    const session = withState({ flags: { [ACT2_CACHE_FOUND]: true } });
    const { session: at } = enter(session, POST_OFFICE);
    const store = new MemoryStore();
    const { events } = say(at, 'x closure notice', store);
    expect(text(events)).not.toMatch(/NOTICE OF ROAD CLOSURE/);
  });
});

describe('Pearl — topic_visit rule 1 (§6)', () => {
  it('grants act4_clue_visit_coming once announced, not act2_clue_repaving', () => {
    const session = actFourMainStreet();
    const { session: at } = enter(session, SUNDOWN_DINER);
    const store = new MemoryStore();
    const { session: after, events } = say(at, 'ask pearl about visit', store);
    const rendered = text(events);
    expect(rendered).toMatch(/Day after tomorrow/);
    expect(rendered).toMatch(/The President/);
    expect(rendered).toMatch(/two governors and a senator/);
    expect(after.state.clues).toContain(ACT4_CLUE_VISIT_COMING);
    expect(after.state.clues).not.toContain(ACT2_CLUE_REPAVING);
    assertNoLeak(rendered);
  });

  it('before announced, the shipped D2 rule still answers and still grants act2_clue_repaving', () => {
    const session = withState({ flags: { [ACT2_CACHE_FOUND]: true } });
    const { session: at } = enter(session, SUNDOWN_DINER);
    const store = new MemoryStore();
    const { session: after, events } = say(at, 'ask pearl about visit', store);
    const rendered = text(events);
    expect(rendered).toMatch(/Now, there's a thing/);
    expect(after.state.clues).toContain(ACT2_CLUE_REPAVING);
    expect(after.state.clues).not.toContain(ACT4_CLUE_VISIT_COMING);
  });
});

describe('Marlow — topic_register rule 1 (§7)', () => {
  it('the three-names line, once announced — no effect, no flag, no clue', () => {
    const session = actFourMainStreet({ clock: { day: 5, minute: 1100 } }); // evening — he's at the desk
    const { session: at } = enter(session, FRONT_DESK);
    const cluesBefore = at.state.clues;
    const store = new MemoryStore();
    const { session: after, events } = say(at, 'ask marlow about register', store);
    const rendered = text(events);
    expect(rendered).toMatch(/Three names went in Tuesday/);
    expect(rendered).toMatch(/One hand wrote all three/);
    expect(after.state.clues).toEqual(cluesBefore); // no clue granted by this rule
    assertNoLeak(rendered);
  });
});

describe("the Sundown's window (§8)", () => {
  it('appends the signwriter paragraph once announced', () => {
    const session = actFourMainStreet();
    const { session: at } = enter(session, SUNDOWN_DINER);
    const store = new MemoryStore();
    const { events } = say(at, 'x window', store);
    const rendered = text(events);
    expect(rendered).toMatch(/NWODNUS EHT/);
    expect(rendered).toMatch(/signwriter on a stepladder/);
    expect(rendered).toMatch(/THE SUNDOWNER/);
    assertNoLeak(rendered);
  });

  it('before announced, the shipped text alone', () => {
    const session = withState({});
    const { session: at } = enter(session, SUNDOWN_DINER);
    const store = new MemoryStore();
    const { events } = say(at, 'x window', store);
    const rendered = text(events);
    expect(rendered).toMatch(/NWODNUS EHT/);
    expect(rendered).not.toMatch(/signwriter/);
  });
});

describe("the Lobby's staging doors (§9)", () => {
  it('appends one sentence once announced', () => {
    const session = actFourMainStreet();
    const { session: at } = enter(session, ACT3_LOBBY);
    const store = new MemoryStore();
    const { events } = say(at, 'open staging door', store);
    const rendered = text(events);
    expect(rendered).toMatch(/maglock/);
    expect(rendered).toMatch(/looks up from a folding table/);
    assertNoLeak(rendered);
  });

  it('before announced, the shipped two paragraphs alone', () => {
    const session = withState({});
    const { session: at } = enter(session, ACT3_LOBBY);
    const store = new MemoryStore();
    const { events } = say(at, 'open staging door', store);
    const rendered = text(events);
    expect(rendered).toMatch(/maglock/);
    expect(rendered).not.toMatch(/folding table/);
  });
});

