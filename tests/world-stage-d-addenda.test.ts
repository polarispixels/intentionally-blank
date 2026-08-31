// Stage D addenda (`docs/superpowers/specs/2026-09-14-stage-d-addenda-prose
// .md`) — six small gaps the clean saves found. Six pieces, five different
// files; see that doc's own §8 status line for the main-session rulings this
// task wires against (q2: §1.2 above the shipped ticket rule, above §1.1).

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
import { CLAIM_TICKET, FLAG_OFFERED_THE_RIDE, KEYRING, MONSTER_TRUCK, TOWN_EDGE } from '../src/content/world/act1/ids';
import { ACT2_STARTED, ACT2_WALL_DRUG_EMPORIUM, ACT2_NOTEBOOK } from '../src/content/world/act2/ids';
import { ACT3_HEADLAMP, ACT3_LOGBOOK, ACT3_PERIMETER_ROAD, ACT3_S5_REACTOR_INTERFACE, ACT3_WRENCH } from '../src/content/world/act3/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-14T04:00:00.000Z', gameVersion: 'test-0.0.0' };
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

// ---------------------------------------------------------------------------
// §1 — Town Edge NORTH.
// ---------------------------------------------------------------------------

describe('Town Edge NORTH (§1) — the four-rule ProseRule[]', () => {
  function atTownEdge(patch: Partial<GameState> = {}): SessionState {
    const s = withState({ location: TOWN_EDGE, ...patch });
    return enter(s, TOWN_EDGE).session;
  }

  it('before the ride is offered, no ticket — §1.1, and never END OF BUILD', () => {
    const store = new MemoryStore();
    const session = atTownEdge();
    const t = text(say(session, 'north', store).events);
    expect(t).toContain('You go as far as the cattle guard');
    expect(t).toContain('There is a town behind you with vehicles in it');
    expect(t).not.toContain('END OF BUILD');
  });

  it('holding the claim ticket, before the offer — the shipped ticket redirect, unchanged', () => {
    const store = new MemoryStore();
    const session = atTownEdge({ objects: { [CLAIM_TICKET]: { location: 'inventory' } } });
    const t = text(say(session, 'north', store).events);
    expect(t).toContain('HOLD FOR PICKUP');
    expect(t).not.toContain('END OF BUILD');
  });

  it('once the ride has been offered — §1.2, even while still holding the ticket', () => {
    const store = new MemoryStore();
    const session = atTownEdge({
      flags: { [FLAG_OFFERED_THE_RIDE]: true },
      objects: { [CLAIM_TICKET]: { location: 'inventory' } },
    });
    const t = text(say(session, 'north', store).events);
    expect(t).toContain('The offer stands.');
    expect(t).toContain('a man who has driven that road');
    expect(t).not.toContain('HOLD FOR PICKUP');
    expect(t).not.toContain('END OF BUILD');
  });
});

// ---------------------------------------------------------------------------
// §2 — Wall Drug SOUTH.
// ---------------------------------------------------------------------------

describe('Wall Drug SOUTH (§2)', () => {
  it('replaces the shipped first-night text whole', () => {
    const store = new MemoryStore();
    const session = enter(withState({ location: ACT2_WALL_DRUG_EMPORIUM, flags: { [ACT2_STARTED]: true } }), ACT2_WALL_DRUG_EMPORIUM).session;
    const t = text(say(session, 'south', store).events);
    expect(t).toContain('thirty-two miles of county road with the signs along it counting nothing down.');
    expect(t).toContain('this road has never once given any sign of');
    expect(t).not.toContain('a head that has already been hit once tonight');
    expect(t).not.toContain('END OF BUILD');
  });
});

// ---------------------------------------------------------------------------
// §3, §4, §5 — S5 Reactor Interface.
// ---------------------------------------------------------------------------

function atS5(patch: Partial<GameState> = {}): SessionState {
  const s = withState({ location: ACT3_S5_REACTOR_INTERFACE, ...patch });
  return enter(s, ACT3_S5_REACTOR_INTERFACE).session;
}

describe('COUNT GAUGES (§3)', () => {
  it('refuses the total by name, and prints no digit', () => {
    const store = new MemoryStore();
    const t = text(say(atS5(), 'count gauges', store).events);
    expect(t).toContain('the exercise turns on you');
    expect(t).toContain('neither of them is answered by arriving at a total');
    expect(t).not.toMatch(/\d/);
  });
});

describe('the chase bottom — LISTEN (§4.2)', () => {
  it('LISTEN DOWN reaches the chase bottom', () => {
    const store = new MemoryStore();
    const t = text(say(atS5(), 'listen down', store).events);
    expect(t).toContain('a sound like a room being large');
  });

  it('LISTEN AT THE OPENING reaches the same text', () => {
    const store = new MemoryStore();
    const t = text(say(atS5(), 'listen at the opening', store).events);
    expect(t).toContain('a sound like a room being large');
  });
});

// ENGINE GAP, escalated (not guessed): `actions.ts`'s `performAction` only
// ever consults `world.rooms[location].handlers` (`findRoomHandler`) when
// `input.dobj === undefined` (see that file's own "§8 gap 3" comment and its
// call site: `if (input.dobj === undefined) { ... findRoomHandler ... }`).
// `PUT_IN`/`DROP`/`V_THROW` all resolve a `dobj` (the carried item), so rung
// 1 (`findHandler`) always looks the handler up on THAT OBJECT's own
// `handlers` array, never the room's — the room-level handler the addenda
// doc's own §4.1 note and this task's own brief instruct
// (`{ verbs: [PUT_IN, DROP, V_THROW], withInstrument: [ACT3_CHASE_BOTTOM] }`
// on `act3_s5_reactor_interface`) is wired exactly as instructed
// (`../s5ReactorInterface.ts`) but is provably unreachable for "any carried
// dobj" as written — confirmed by running each of the three commands below
// and observing built-in DROP/THROW-default/PUT_IN-refusal behavior instead
// of §4.1's text. Fixing this needs either an engine dispatch change (rung 1
// also checking the room's handlers when no object-level handler/builtin
// matched) or per-object wiring on every liftable plot item across several
// other builders' modules — both out of this task's one module. Flagged for
// the main session / `game-architect`; `it.fails` below documents the
// diagnosed, reproducible gap without failing the suite.
describe('the chase bottom — never letting go (§4.1)', () => {
  it('DROP KEYRING DOWN THE SHAFT prints §4.1 and the keyring is still held', () => {
    const store = new MemoryStore();
    const session = atS5({ objects: { [KEYRING]: { location: 'inventory' } } });
    const result = say(session, 'drop keyring down the shaft', store);
    const t = text(result.events);
    expect(t).toContain('Your hand comes in. The question stands');
    expect(result.session.state.objects[KEYRING]?.location).toBe('inventory');
  });

  it('THROW WRENCH INTO OPENING prints §4.1 and the wrench is still held', () => {
    const store = new MemoryStore();
    const session = atS5({ objects: { [ACT3_WRENCH]: { location: 'inventory' } } });
    const result = say(session, 'throw wrench into opening', store);
    const t = text(result.events);
    expect(t).toContain('Your hand comes in. The question stands');
    expect(result.session.state.objects[ACT3_WRENCH]?.location).toBe('inventory');
  });

  it('PUT NOTEBOOK IN OPENING prints §4.1 and the notebook is still held', () => {
    const store = new MemoryStore();
    const session = atS5({ objects: { [ACT2_NOTEBOOK]: { location: 'inventory' } } });
    const result = say(session, 'put notebook in opening', store);
    const t = text(result.events);
    expect(t).toContain('Your hand comes in. The question stands');
    expect(result.session.state.objects[ACT2_NOTEBOOK]?.location).toBe('inventory');
  });
});

describe('COMPARE LOGBOOK WITH NOTEBOOK (§5)', () => {
  it('reads the refusal, holding the notebook', () => {
    const store = new MemoryStore();
    const session = atS5({ objects: { [ACT2_NOTEBOOK]: { location: 'inventory' } } });
    const t = text(say(session, 'compare logbook with notebook', store).events);
    expect(t).toContain('which is the correct instinct and the wrong book');
    expect(t).toContain('a hand is made of words');
  });
});

// ---------------------------------------------------------------------------
// §6 — the toolbox, Jack's truck.
// ---------------------------------------------------------------------------

describe('X TOOLBOX / SEARCH TOOLBOX (§6)', () => {
  function atPerimeterWithTruck(patch: Partial<GameState> = {}): SessionState {
    const s = withState({ location: ACT3_PERIMETER_ROAD, objects: { [MONSTER_TRUCK]: { location: ACT3_PERIMETER_ROAD } }, ...patch });
    return enter(s, ACT3_PERIMETER_ROAD).session;
  }

  it('with the headlamp still in it — §6.1', () => {
    const store = new MemoryStore();
    const t = text(say(atPerimeterWithTruck(), 'x toolbox', store).events);
    expect(t).toContain('lid up, at shoulder height');
    expect(t).toContain('there is a headlamp');
  });

  it('after the headlamp is taken — §6.2', () => {
    const store = new MemoryStore();
    let session = atPerimeterWithTruck();
    session = say(session, 'take headlamp', store).session;
    const t = text(say(session, 'search toolbox', store).events);
    expect(t).toContain('The coil is lying where you left it after taking what was under it.');
  });
});
