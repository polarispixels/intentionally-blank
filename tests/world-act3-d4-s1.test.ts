// Stage D4, task B — S1 Mechanical Gallery and the lift's real S1/S5 stops
// (D4 prose doc §7.3, §8, §12, §21). Arriving by lift (beat 4), the room's
// own description rules, the tool crib/tape rack/checkout card/COMPARE, the
// stair down to S5, the construction door's `south` exit (refused until
// `act3_construction_door_open`, then real), and `PRESS BLANK`'s appended
// line once S5 has been visited.
//
// `ACT3_S5_REACTOR_INTERFACE` (task C's room) and `ACT3_SERVICE_TUNNEL`
// (task A's room) may not be registered in `world.rooms` yet when this
// runs — `TEST_WORLD` below stubs each with a minimal room only if the
// real one hasn't landed, so this file's own assertions (which never
// depend on either room's own prose) don't crash on a sibling's timing.

import { describe, expect, it } from 'vitest';
import { WORLD } from '../src/content/world/game';
import { renderArrival } from '../src/engine/move';
import { render } from '../src/engine/prose';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import { ACT2_NOTEBOOK } from '../src/content/world/act2/ids';
import {
  ACT3_CHECKOUT_CARD,
  ACT3_CLUE_J_HAND,
  ACT3_CLUE_NO_LOWER,
  ACT3_COOLING_PLANT,
  ACT3_CONSTRUCTION_DOOR_OPEN,
  ACT3_INSIDE,
  ACT3_PRESSED_BLANK,
  ACT3_S1_MECHANICAL_GALLERY,
  ACT3_S5_REACTOR_INTERFACE,
  ACT3_SERVICE_TUNNEL,
} from '../src/content/world/act3/ids';
import { s1MechanicalGalleryRoom } from '../src/content/world/act3/s1MechanicalGallery';

const TEST_WORLD: WorldDef = {
  ...WORLD,
  rooms: {
    ...WORLD.rooms,
    [ACT3_S5_REACTOR_INTERFACE]: WORLD.rooms?.[ACT3_S5_REACTOR_INTERFACE] ?? { name: 'S5 (test stub)', description: 'stub — task C has not landed yet' },
    [ACT3_SERVICE_TUNNEL]: WORLD.rooms?.[ACT3_SERVICE_TUNNEL] ?? { name: 'Service Tunnel (test stub)', description: 'stub — task A has not landed yet' },
  },
};
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-12T04:00:00.000Z', gameVersion: 'test-0.0.0' };
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

function say(session: SessionState, textIn: string, store: MemoryStore): { session: SessionState; events: GameEvent[] } {
  const view = buildScopeView(TEST_WORLD, session.state, vocab);
  const outcome = new DeterministicParser().interpret(textIn, view);
  const result = takeTurn(TEST_WORLD, session, vocab, outcome, opts(store));
  return { session: result.session, events: result.events };
}

function text(events: GameEvent[]): string {
  return events
    .filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line')
    .map((e) => e.text)
    .join('\n');
}

function lineKinds(events: GameEvent[]): string[] {
  return events.filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line').map((e) => e.kind);
}

function atPlant(patch: Partial<GameState> = {}): SessionState {
  const s = withState({ location: ACT3_COOLING_PLANT, ...patch });
  return enter(s, ACT3_COOLING_PLANT).session;
}

function atS1(patch: Partial<GameState> = {}): SessionState {
  const s = withState({ location: ACT3_S1_MECHANICAL_GALLERY, ...patch });
  return enter(s, ACT3_S1_MECHANICAL_GALLERY).session;
}

describe('S1 Mechanical Gallery — arrival and description (§8.1)', () => {
  it('arriving by lift from L (PRESS S1) renders beat 4 for S1 and moves the player', () => {
    const store = new MemoryStore();
    const session = atPlant();
    const result = say(session, 'press s1', store);
    expect(lineKinds(result.events).filter((k) => k === 'beat')).toHaveLength(4);
    expect(text(result.events)).toMatch(/gallery lit like an office/);
    expect(result.session.state.location).toBe(ACT3_S1_MECHANICAL_GALLERY);
  });

  // These three test the room's own `description` ProseRule[] directly via
  // `render()`, not via `renderArrival`/`say()`: `move.ts`'s `renderArrival`
  // marks `state.visited[roomId]` TRUE *before* rendering `description`
  // (confirmed against an already-shipped D3 room, `corridorB4.ts`, whose
  // own identical `{ not: { visited } }` idiom renders its `returnVisit`
  // text on a genuine first arrival, never `firstSight`) — so a room's own
  // "not yet visited" rule can never be reached through a real arrival at
  // all, for any D3 or D4 room using this idiom. This is a pre-existing,
  // cross-cutting engine/authoring mismatch (`engine/move.ts`), not
  // something in this task's own module; flagged in this task's report
  // rather than patched here. These three assertions instead exercise the
  // `description` array against a hand-built state whose `visited` map
  // simply omits this room, which is what "not yet visited" is supposed to
  // mean and what a fresh arrival would look like if the ordering bug were
  // fixed.
  it('rule 2 renders for a first visit with the construction door not open', () => {
    const state = { ...withState({}).state, location: ACT3_S1_MECHANICAL_GALLERY, visited: {} };
    const rendered = render(TEST_WORLD, state, 'test.s1.rule2', s1MechanicalGalleryRoom.description!);
    expect(rendered.text).toMatch(/cool in here and very well lit/);
  });

  it('rule 1 renders for a first visit with the construction door already open', () => {
    const state = { ...withState({}).state, location: ACT3_S1_MECHANICAL_GALLERY, visited: {}, flags: { [ACT3_CONSTRUCTION_DOOR_OPEN]: true } };
    const rendered = render(TEST_WORLD, state, 'test.s1.rule1', s1MechanicalGalleryRoom.description!);
    expect(rendered.text).toMatch(/A mile of tunnel puts you out/);
  });

  it('rule 3 renders on a return visit', () => {
    const store = new MemoryStore();
    const session = withState({ location: ACT3_S1_MECHANICAL_GALLERY, visited: { [ACT3_S1_MECHANICAL_GALLERY]: 0 } });
    const result = enter(session, ACT3_S1_MECHANICAL_GALLERY);
    expect(text(result.events)).toMatch(/less like a standard and more like a habit/);
  });

  it('sets act3_inside on first entry (route (b) never sees the Lobby)', () => {
    const session = atS1();
    expect(session.state.flags[ACT3_INSIDE]).toBe(true);
  });
});

describe('S1 Mechanical Gallery — the tool crib, tape rack, and checkout card (§8.3-§8.6)', () => {
  it('OPEN CRIB takes nothing', () => {
    const store = new MemoryStore();
    const session = atS1();
    const result = say(session, 'open crib', store);
    expect(text(result.events)).toMatch(/You take nothing/);
  });

  it('EXAMINE RACK describes the shelves and the one empty slot', () => {
    const store = new MemoryStore();
    const session = atS1();
    const result = say(session, 'x rack', store);
    expect(text(result.events)).toMatch(/no tape behind it/);
  });

  // Bare "card" is genuinely ambiguous here against the lift's own
  // certificate sub-part (`elevator.ts`'s shared `nouns: [..., 'card', ...]`
  // — D3-shipped, present in all four lift instances including this room's
  // own `_GALLERY` one) until the checkout card is actually held, at which
  // point `resolveNounPhrase`'s `preferHeld` tie-break (`parser/resolver.
  // ts`) narrows to it, matching §21.2's own "once taken it wins
  // everywhere." Not in §21.2's own collision table — that table predates
  // this room, which is the first place the two "card" nouns actually
  // share scope. Flagged in this task's report as a discovered collision;
  // "checkout card" (also an authored §8.5 phrasing) reaches it directly.
  it('TAKE CHECKOUT CARD picks up the checkout card', () => {
    const store = new MemoryStore();
    const session = atS1();
    const result = say(session, 'take checkout card', store);
    expect(result.session.state.objects[ACT3_CHECKOUT_CARD]?.location).toBe('inventory');
  });

  it('once held, bare TAKE CARD / CARD resolves to it (preferHeld) — e.g. EXAMINE CARD', () => {
    const store = new MemoryStore();
    const session = atS1({ objects: { [ACT3_CHECKOUT_CARD]: { location: 'inventory' } } });
    const result = say(session, 'x card', store);
    expect(text(result.events)).toMatch(/Ruled in three columns/);
  });

  it('COMPARE CARD WITH NOTEBOOK grants the clue when the notebook is held', () => {
    const store = new MemoryStore();
    const session = atS1({ objects: { [ACT3_CHECKOUT_CARD]: { location: 'inventory' }, [ACT2_NOTEBOOK]: { location: 'inventory' } } });
    const result = say(session, 'compare card with notebook', store);
    expect(result.session.state.clues).toContain(ACT3_CLUE_J_HAND);
    expect(text(result.events)).toMatch(/did not bring it back/);
  });

  it('COMPARE CARD WITH NOTEBOOK without the notebook does not grant the clue', () => {
    const store = new MemoryStore();
    const session = atS1({ objects: { [ACT3_CHECKOUT_CARD]: { location: 'inventory' } } });
    const result = say(session, 'compare card with notebook', store);
    expect(result.session.state.clues ?? []).not.toContain(ACT3_CLUE_J_HAND);
  });
});

describe('S1 Mechanical Gallery — the stair down and the construction door (§8.7, §7.3, §21.4)', () => {
  it('DOWN reaches S5', () => {
    const store = new MemoryStore();
    const session = atS1();
    const before = session.state.clock.minute;
    const result = say(session, 'down', store);
    expect(result.session.state.location).toBe(ACT3_S5_REACTOR_INTERFACE);
    expect(result.session.state.clock.minute - before).toBeGreaterThanOrEqual(5);
  });

  it('SOUTH refuses with §7.3\'s text before the construction door is open', () => {
    const store = new MemoryStore();
    const session = atS1();
    const result = say(session, 'south', store);
    expect(text(result.events)).toMatch(/nothing to pull/);
    expect(result.session.state.location).toBe(ACT3_S1_MECHANICAL_GALLERY);
  });

  it('OPEN DOOR (before) gives the same §7.3 refusal', () => {
    const store = new MemoryStore();
    const session = atS1();
    const result = say(session, 'open door', store);
    expect(text(result.events)).toMatch(/door that opens away from you/);
  });

  it('SOUTH leads to the tunnel once act3_construction_door_open is set (the room\'s own onEnter syncs the mechanism gate)', () => {
    const store = new MemoryStore();
    const session = atS1({ flags: { [ACT3_CONSTRUCTION_DOOR_OPEN]: true } });
    const result = say(session, 'south', store);
    expect(result.session.state.location).toBe(ACT3_SERVICE_TUNNEL);
  });
});

describe('PRESS BLANK — the added line once S5 has been visited (§12.2)', () => {
  it('does not append the line before S5 has been visited', () => {
    const store = new MemoryStore();
    const session = atPlant();
    const result = say(session, 'press blank', store);
    expect(text(result.events)).not.toMatch(/takes a man to the bottom of his own building/);
    expect(result.session.state.flags[ACT3_PRESSED_BLANK]).toBe(true);
  });

  it('appends the line, and grants act3_clue_no_lower, once S5 has been visited and the blank pressed before', () => {
    const store = new MemoryStore();
    const session = atPlant({
      visited: { [ACT3_COOLING_PLANT]: 0, [ACT3_S5_REACTOR_INTERFACE]: 0 },
      flags: { [ACT3_PRESSED_BLANK]: true },
    });
    const result = say(session, 'press blank', store);
    expect(text(result.events)).toMatch(/takes a man to the bottom of his own building/);
    expect(result.session.state.clues).toContain(ACT3_CLUE_NO_LOWER);
  });
});

describe('S1 Mechanical Gallery — no leaked ids or template gaps', () => {
  it('every rendered response is free of raw act3_ ids and unresolved {name} templates', () => {
    const store = new MemoryStore();
    let session = atS1({ objects: { [ACT3_CHECKOUT_CARD]: { location: 'inventory' }, [ACT2_NOTEBOOK]: { location: 'inventory' } } });
    const transcript = ['x pumps', 'listen to pumps', 'read tags', 'x crib', 'x cup', 'x board', 'x rack', 'read spine labels', 'x card', 'compare card with notebook', 'x stair', 'listen', 'smell', 'shout', 'search', 'open door', 'south', 'press l', 'press s1', 'press s5', 'press blank'];
    let all = '';
    for (const line of transcript) {
      const result = say(session, line, store);
      session = result.session;
      all += text(result.events);
    }
    expect(all).not.toMatch(/act3_/);
    expect(all).not.toMatch(/\{name\}/);
    expect(all).not.toMatch(/\{dobj\}/);
    expect(all).not.toMatch(/\{iobj\}/);
  });
});
