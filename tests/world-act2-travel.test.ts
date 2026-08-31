// Stage D1 — the ride north, the horse, the glovebox/deck (M2 ×3), the
// Custodian, and the moved build boundary (Stage D plan §2 D1's own task-A
// module). Drives the real session/turn pipeline where the point is player-
// facing behavior (matching `tests/world-act2-calendar.test.ts`'s own
// idiom); calls `act2Travel` directly where the point is the script's own
// beat/effect sequencing.

import { describe, expect, it } from 'vitest';
import { WORLD } from '../src/content/world/game';
import { act2Travel } from '../src/content/world/act2/travel';
import { renderArrival } from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import { npcRoom } from '../src/engine/cond';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import { CLAIM_TICKET, FLOOR_LAMP, JACK, JACKS_MOTEL, MAIN_STREET, MAINTENANCE_MAN, MONSTER_TRUCK, YOUR_ROOM } from '../src/content/world/act1/ids';
import {
  ACT2_CLUE_MILES_DONT_COUNT,
  ACT2_CUSTODIAN,
  ACT2_DECK,
  ACT2_HORSE,
  ACT2_HORSE_BORROWED,
  ACT2_JACK_AWAY,
  ACT2_RODE_NORTH,
  ACT2_SAW_CUSTODIAN_PAINTING,
  ACT2_STARTED,
  ACT2_USB,
  ACT2_WALL_DRUG_EMPORIUM,
} from '../src/content/world/act2/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-09T04:00:00.000Z', gameVersion: 'test-0.0.0' };
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

function say(session: SessionState, text: string, store: MemoryStore): { session: SessionState; events: GameEvent[] } {
  const view = buildScopeView(TEST_WORLD, session.state, vocab);
  const outcome = new DeterministicParser().interpret(text, view);
  const result = takeTurn(TEST_WORLD, session, vocab, outcome, opts(store));
  return { session: result.session, events: result.events };
}

function text(events: GameEvent[]): string {
  return events
    .filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line')
    .map((e) => e.text)
    .join('\n');
}

function beatCount(events: GameEvent[]): number {
  return events.filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line' && e.kind === 'beat').length;
}

// ---------------------------------------------------------------------------
// validate(WORLD)
// ---------------------------------------------------------------------------

describe('validate — Act II D1 (travel)', () => {
  it('produces no new errors', async () => {
    const { validate } = await import('../src/engine/validate');
    const errors = validate(TEST_WORLD).filter((f) => f.severity === 'error');
    expect(errors).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// act2Travel — direct script calls (beat sequencing, effects).
// ---------------------------------------------------------------------------

describe('act2Travel — the first ride, truck', () => {
  it('pins Jack, moves the truck, sets act2_started/act2_rode_north, grants the clue once, costs 45 minutes, and renders the first-ride beats in order', () => {
    const base = createSession(TEST_WORLD).state;
    const state: GameState = { ...base, clock: { day: 1, minute: 260 }, location: JACKS_MOTEL };
    const { state: after, events } = act2Travel(TEST_WORLD, state, { mode: 'truck', to: 'wall_drug' });

    expect(after.clock).toEqual({ day: 1, minute: 305 });
    expect(after.flags[ACT2_RODE_NORTH]).toBe(true);
    expect(after.flags[ACT2_STARTED]).toBe(true);
    expect(after.flags[ACT2_JACK_AWAY]).toBe(true);
    expect(after.clues).toContain(ACT2_CLUE_MILES_DONT_COUNT);
    expect(after.location).toBe(ACT2_WALL_DRUG_EMPORIUM);
    expect(npcRoom(TEST_WORLD, after, JACK)).toBe(ACT2_WALL_DRUG_EMPORIUM);

    expect(beatCount(events)).toBe(8);
    const beatText = text(events);
    expect(beatText).toContain('cattle guard');
    expect(beatText).toContain('camera at the county line');
    expect(beatText).toContain('Thirty-two');
    expect(beatText).toContain("I'll be at the counter with a coffee");
    // Order: the camera line (beat 4) precedes the odometer beat (beat 6).
    expect(beatText.indexOf('camera at the county line')).toBeLessThan(beatText.indexOf('Thirty-two'));

    // The ladder man is retired.
    expect(after.objects[MAINTENANCE_MAN]?.location).toBe('nowhere');

    // The clue is granted exactly once even if the effect list somehow ran twice (grantClue's own idempotence, effects.ts).
    expect(after.clues.filter((c) => c === ACT2_CLUE_MILES_DONT_COUNT)).toHaveLength(1);
  });

  it('a second ride north (act2_rode_north already true) renders the shorter 2-beat scene, not the first-ride 8', () => {
    const base = createSession(TEST_WORLD).state;
    const state: GameState = { ...base, clock: { day: 1, minute: 260 }, location: JACKS_MOTEL, flags: { [ACT2_RODE_NORTH]: true, [ACT2_STARTED]: true } };
    const { events } = act2Travel(TEST_WORLD, state, { mode: 'truck', to: 'wall_drug' });
    expect(beatCount(events)).toBe(2);
  });
});

describe('act2Travel — the return trip, truck', () => {
  it('unpins Jack and clears act2_jack_away', () => {
    const base = createSession(TEST_WORLD).state;
    const state: GameState = {
      ...base,
      clock: { day: 1, minute: 500 },
      location: ACT2_WALL_DRUG_EMPORIUM,
      flags: { [ACT2_RODE_NORTH]: true, [ACT2_STARTED]: true, [ACT2_JACK_AWAY]: true },
      npcs: { [JACK]: { room: ACT2_WALL_DRUG_EMPORIUM } },
    };
    const { state: after } = act2Travel(TEST_WORLD, state, { mode: 'truck', to: 'town' });
    expect(after.flags[ACT2_JACK_AWAY]).toBe(false);
    // Unpinned — no overlay `room` left; where the shared schedule then
    // computes him to be (morning/diner vs. otherwise/motel) is D0's own
    // concern, not this script's.
    expect(after.npcs[JACK]?.room).toBeUndefined();
    expect(after.location).toBe(JACKS_MOTEL);
    expect(after.objects[MONSTER_TRUCK]?.location).toBe(JACKS_MOTEL);
  });
});

describe('act2Travel — the horse', () => {
  it('costs 240 minutes and leaves Jack alone (never pinned/moved)', () => {
    const base = createSession(TEST_WORLD).state;
    const state: GameState = { ...base, clock: { day: 1, minute: 260 }, location: MAIN_STREET };
    const { state: after } = act2Travel(TEST_WORLD, state, { mode: 'horse', to: 'wall_drug' });
    expect(after.clock).toEqual({ day: 1, minute: 500 });
    expect(after.flags[ACT2_JACK_AWAY]).toBeUndefined();
    // Jack rides only in the truck — never pinned/moved by a horse trip.
    expect(after.npcs[JACK]?.room).toBeUndefined();
    expect(after.location).toBe(ACT2_WALL_DRUG_EMPORIUM);
    expect(after.objects[ACT2_HORSE]?.location).toBe(ACT2_WALL_DRUG_EMPORIUM);
  });
});

// ---------------------------------------------------------------------------
// Main Street — the horses, while one is out.
// ---------------------------------------------------------------------------

describe('Main Street — the horses, while act2_horse is out', () => {
  it('counts two while act2_horse is away, three otherwise', () => {
    const store = new MemoryStore();
    const threeUp = withState({ location: MAIN_STREET });
    const { events: three } = say(threeUp, 'count horses', store);
    expect(text(three)).toContain('Three. You count them twice');

    const twoUp = withState({ location: MAIN_STREET, objects: { [ACT2_HORSE]: { location: ACT2_WALL_DRUG_EMPORIUM } } });
    const { events: two } = say(twoUp, 'count horses', store);
    expect(text(two)).toContain('Two, tonight.');
  });
});

// ---------------------------------------------------------------------------
// UNTIE HORSE
// ---------------------------------------------------------------------------

describe('UNTIE HORSE', () => {
  it('sets act2_horse_borrowed', () => {
    const store = new MemoryStore();
    const session = withState({ location: MAIN_STREET });
    const { session: after, events } = say(session, 'untie horse', store);
    expect(after.state.flags[ACT2_HORSE_BORROWED]).toBe(true);
    expect(text(events)).toContain('The knot comes undone in one pull');
  });
});

// ---------------------------------------------------------------------------
// The ladder man is gone after the first ride.
// ---------------------------------------------------------------------------

describe('The Act I ladder man', () => {
  it('is gone after the first ride north', () => {
    const base = createSession(TEST_WORLD).state;
    const state: GameState = { ...base, clock: { day: 1, minute: 260 }, location: JACKS_MOTEL };
    const { state: after } = act2Travel(TEST_WORLD, state, { mode: 'truck', to: 'wall_drug' });
    expect(after.objects[MAINTENANCE_MAN]?.location).toBe('nowhere');
  });
});

// ---------------------------------------------------------------------------
// The Custodian.
// ---------------------------------------------------------------------------

describe('The Custodian — posts', () => {
  it('is at the Emporium in the afternoon (after act2_started) and offstage at night', () => {
    const afternoon: GameState = { ...createSession(TEST_WORLD).state, clock: { day: 1, minute: 720 }, flags: { [ACT2_STARTED]: true } };
    expect(npcRoom(TEST_WORLD, afternoon, ACT2_CUSTODIAN)).toBe(ACT2_WALL_DRUG_EMPORIUM);

    const night: GameState = { ...createSession(TEST_WORLD).state, clock: { day: 1, minute: 1320 }, flags: { [ACT2_STARTED]: true } };
    expect(npcRoom(TEST_WORLD, night, ACT2_CUSTODIAN)).toBe('offstage');
  });

  it('EXAMINE CUSTODIAN sets act2_saw_custodian_painting', () => {
    const store = new MemoryStore();
    const base = withState({ clock: { day: 1, minute: 720 }, flags: { [ACT2_STARTED]: true } });
    const { session: entered } = enter(base, ACT2_WALL_DRUG_EMPORIUM);
    const { session: after, events } = say(entered, 'examine custodian', store);
    expect(after.state.flags[ACT2_SAW_CUSTODIAN_PAINTING]).toBe(true);
    expect(text(events)).toContain('Grey coveralls, the clean kind.');
  });
});

// ---------------------------------------------------------------------------
// The boundary — one system.buildBoundary emission, two routes.
// ---------------------------------------------------------------------------

describe('The boundary', () => {
  it('PUT USB IN TERMINAL at Your Room renders the in-world line then the system line, once', () => {
    const store = new MemoryStore();
    const session = withState({ location: YOUR_ROOM, objects: { [FLOOR_LAMP]: { on: true }, [ACT2_USB]: { location: 'inventory' } } });
    const { events } = say(session, 'put usb in terminal', store);
    const system = events.filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line' && e.kind === 'system');
    expect(system).toHaveLength(1);
    expect(system[0]!.text).toContain('END OF BUILD');
    expect(text(events)).toContain('It fits.');
  });

  it('DRIVE TO PLANT at the motel, with the truck present, renders the boundary', () => {
    const store = new MemoryStore();
    const session = withState({ location: JACKS_MOTEL });
    const { events } = say(session, 'drive to plant', store);
    const system = events.filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line' && e.kind === 'system');
    expect(system).toHaveLength(1);
    expect(system[0]!.text).toContain('END OF BUILD');
    expect(text(events)).toContain('"The plant," Jack says');
  });
});

// ---------------------------------------------------------------------------
// Jack's own ticket topic no longer ends the build.
// ---------------------------------------------------------------------------

describe("Jack's ASK ABOUT WALL DRUG", () => {
  it('routes to the travel script instead of printing END OF BUILD', () => {
    const store = new MemoryStore();
    const ticketed = withState({ location: JACKS_MOTEL, objects: { [CLAIM_TICKET]: { location: 'inventory' } } });
    const { events } = say(ticketed, 'ask jack about wall drug', store);
    expect(text(events)).not.toContain('END OF BUILD');
    expect(text(events)).toContain('Wall Drug');
    expect(events.some((e) => e.type === 'line' && (e as { kind: string }).kind === 'beat')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// The glovebox and the deck (M2 ×3).
// ---------------------------------------------------------------------------

describe('The glovebox and the deck', () => {
  it('EXAMINE GLOVEBOX shows the contents; TAKE DECK moves it to inventory and fires M2', () => {
    const store = new MemoryStore();
    const session = withState({ location: JACKS_MOTEL });
    const { session: after, events } = say(session, 'examine glovebox', store);
    expect(text(events)).toContain('a deck of cards');
    expect(text(events)).toContain('It drops open on a hinge');

    const { session: withDeck, events: takeEvents } = say(after, 'take deck', store);
    expect(withDeck.state.objects[ACT2_DECK]?.location).toBe('inventory');
    const memoryEvent = takeEvents.find((e): e is Extract<GameEvent, { type: 'memory' }> => e.type === 'memory');
    expect(memoryEvent).toBeDefined();
    expect(memoryEvent!.lines.join(' ')).toContain('Four hands');
  });
});
