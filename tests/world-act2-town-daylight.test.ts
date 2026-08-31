// Stage D2, task C — the Custodian's town post and M15's retro-visibility,
// Main Street by day, the buzz, and the moved boundary (Stage D plan §2 D2
// §4.6; D2 prose doc §18, §20, §21, §23). Drives the real session/turn
// pipeline, same idiom as `tests/world-act2-poker.test.ts`.

import { describe, expect, it } from 'vitest';
import { WORLD } from '../src/content/world/act1/world';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import { npcRoom } from '../src/engine/cond';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import { FLAG_MET_MARLOW, FLAG_VISITED_MAIN_STREET, FLAG_VISITED_TOWN_EDGE, FRONT_DESK, MAIN_STREET, POST_OFFICE, SUNDOWN_DINER, TOWN_EDGE } from '../src/content/world/act1/ids';
import {
  ACT2_CACHE_FOUND,
  ACT2_CUSTODIAN,
  ACT2_EXAMINED_CUSTODIAN,
  ACT2_KNOWS_TUNNEL_MOUTH,
  ACT2_MEM_M15,
  ACT2_SAW_REPAVING_NOTICE,
  ACT2_STARTED,
  ACT2_WALL_DRUG_EMPORIUM,
} from '../src/content/world/act2/ids';
import { ACT3_TUNNEL_MOUTH } from '../src/content/world/act3/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-08T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

function withState(patch: Partial<GameState>): SessionState {
  const fresh = createSession(TEST_WORLD);
  return { ...fresh, state: { ...fresh.state, ...patch } };
}

function say(session: SessionState, text: string, store: MemoryStore): { session: SessionState; events: GameEvent[] } {
  const view = buildScopeView(TEST_WORLD, session.state, vocab);
  const outcome = new DeterministicParser().interpret(text, view);
  const result = takeTurn(TEST_WORLD, session, vocab, outcome, opts(store));
  return { session: result.session, events: result.events };
}

function textOf(events: GameEvent[]): string {
  return events
    .filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line')
    .map((e) => e.text)
    .join('\n');
}

const MORNING = 420;
const AFTERNOON = 720;

describe('the Custodian — town post', () => {
  it('is on Main Street mornings, once act2_started', () => {
    const session = withState({ clock: { day: 1, minute: MORNING }, flags: { [ACT2_STARTED]: true } });
    expect(npcRoom(TEST_WORLD, session.state, ACT2_CUSTODIAN)).toBe(MAIN_STREET);
  });

  it('is at the Emporium afternoons, unchanged from D1', () => {
    const session = withState({ clock: { day: 1, minute: AFTERNOON }, flags: { [ACT2_STARTED]: true } });
    expect(npcRoom(TEST_WORLD, session.state, ACT2_CUSTODIAN)).toBe(ACT2_WALL_DRUG_EMPORIUM);
  });

  it('EXAMINE at Main Street gives the town-post text and sets act2_examined_custodian; grants the shipped clue', () => {
    const store = new MemoryStore();
    const session = withState({ location: MAIN_STREET, clock: { day: 1, minute: MORNING }, flags: { [ACT2_STARTED]: true } });
    const { session: after, events } = say(session, 'examine custodian', store);
    expect(textOf(events)).toContain('a wire brush and a tin');
    expect(after.state.flags[ACT2_EXAMINED_CUSTODIAN]).toBe(true);
    expect(after.state.clues).toContain('act1_clue_visitor_unremarkable');
  });

  it('ATTACK at Main Street gives the town-post line', () => {
    const store = new MemoryStore();
    const session = withState({ location: MAIN_STREET, clock: { day: 1, minute: MORNING }, flags: { [ACT2_STARTED]: true } });
    const { events } = say(session, 'attack custodian', store);
    expect(textOf(events)).toContain('There is nothing to hit.');
    expect(textOf(events)).toContain('He stops brushing while you decide');
  });

  it('ATTACK at Wall Drug still gives D1\'s own shipped line, unedited', () => {
    const store = new MemoryStore();
    const session = withState({ location: ACT2_WALL_DRUG_EMPORIUM, clock: { day: 1, minute: AFTERNOON }, flags: { [ACT2_STARTED]: true } });
    const { events } = say(session, 'attack custodian', store);
    expect(textOf(events)).toContain('You get as far as deciding to.');
  });

  it('HELLO at Main Street — nothing happens', () => {
    const store = new MemoryStore();
    const session = withState({ location: MAIN_STREET, clock: { day: 1, minute: MORNING }, flags: { [ACT2_STARTED]: true } });
    const { events } = say(session, 'hello custodian', store);
    expect(textOf(events)).toContain('Nobody comes out of the post office');
  });
});

describe('M15 and retro-visibility', () => {
  it('EXAMINE the Custodian at any post grants M15', () => {
    const store = new MemoryStore();
    const session = withState({ location: ACT2_WALL_DRUG_EMPORIUM, clock: { day: 1, minute: AFTERNOON }, flags: { [ACT2_STARTED]: true } });
    const { session: after } = say(session, 'examine custodian', store);
    expect(after.state.memories).toContain('act2_mem_m15');
  });

  it('Main Street\'s return visit gains the retro-visibility clause once M15 is granted', () => {
    const store = new MemoryStore();
    const session = withState({
      location: MAIN_STREET,
      clock: { day: 1, minute: 430 }, // morning: the clause rides on the daytime text while the Custodian is at the rail (v0.12.0)
      flags: { [ACT2_STARTED]: true, [FLAG_VISITED_MAIN_STREET]: true },
      memories: [ACT2_MEM_M15],
    });
    const { events } = say(session, 'look', store);
    expect(textOf(events)).toContain('finishing a bracket that nobody in this town has looked at in twenty years');
  });

  it('Front Desk\'s lobby description gains its own clause once M15 is granted', () => {
    const store = new MemoryStore();
    const session = withState({ location: FRONT_DESK, memories: [ACT2_MEM_M15], flags: { [FLAG_MET_MARLOW]: true } });
    const { events } = say(session, 'look', store);
    expect(textOf(events)).toContain('The stair carpet has been brushed up the middle');
  });

  it('Town Edge\'s return visit gains its own clause once M15 is granted', () => {
    const store = new MemoryStore();
    const session = withState({ location: TOWN_EDGE, memories: [ACT2_MEM_M15], flags: { [FLAG_VISITED_TOWN_EDGE]: true } });
    const { events } = say(session, 'look', store);
    expect(textOf(events)).toContain('a stepladder folded flat against the back of the last building');
  });
});

describe('Main Street by day', () => {
  it('replaces the night-based first-sight/return split while act2_started and it is morning or afternoon', () => {
    const store = new MemoryStore();
    const session = withState({ location: MAIN_STREET, clock: { day: 1, minute: MORNING }, flags: { [ACT2_STARTED]: true } });
    const { events } = say(session, 'look', store);
    expect(textOf(events)).toContain('Main Street in the daylight is Main Street with the dark taken off it.');
  });

  it('at night, the shipped ladder-man-retired ruling stands (no daytime text)', () => {
    const store = new MemoryStore();
    const session = withState({ location: MAIN_STREET, clock: { day: 1, minute: 1320 }, flags: { [ACT2_STARTED]: true, [FLAG_VISITED_MAIN_STREET]: true } });
    const { events } = say(session, 'look', store);
    expect(textOf(events)).not.toContain('Main Street in the daylight');
  });
});

describe('the buzz', () => {
  it('Pearl\'s topic_visit is gated on the cache being found and grants the clue', () => {
    const store = new MemoryStore();
    const session = withState({
      location: SUNDOWN_DINER,
      flags: { [ACT2_CACHE_FOUND]: true },
    });
    const { session: after, events } = say(session, 'ask pearl about the visit', store);
    expect(textOf(events)).toContain("County's asked about");
    expect(after.state.clues).toContain('act2_clue_repaving');
  });

  it('the county notice appears on the post office board once the cache is found, and sets act2_saw_repaving_notice', () => {
    const store = new MemoryStore();
    const session = withState({
      location: POST_OFFICE,
      flags: { [ACT2_CACHE_FOUND]: true },
    });
    const { session: after, events } = say(session, 'read board', store);
    expect(textOf(events)).toContain('NOTICE OF ROAD WORK');
    expect(after.state.flags[ACT2_SAW_REPAVING_NOTICE]).toBe(true);
  });

  it('before the cache is found, the board shows only the shipped notes', () => {
    const store = new MemoryStore();
    const session = withState({ location: POST_OFFICE });
    const { events } = say(session, 'read board', store);
    expect(textOf(events)).not.toContain('NOTICE OF ROAD WORK');
  });
});

describe('the moved boundary', () => {
  it('Town Edge\'s nw exit does not exist before act2_knows_tunnel_mouth', () => {
    const store = new MemoryStore();
    const session = withState({ location: TOWN_EDGE });
    const { events } = say(session, 'northwest', store);
    expect(textOf(events)).not.toContain('END OF BUILD');
    expect(textOf(events)).not.toContain('cedar posts');
  });

  // D4 task A amendment (D4 prose doc §3, §21.1): this exit "becomes real"
  // — it now runs the county-road walk to the Service Tunnel's mouth
  // instead of ending in `system.buildBoundary`, so 'END OF BUILD' no
  // longer prints here at all. ADR 0011 rule 3 also gates the exit on
  // `act2_started`, not just `act2_knows_tunnel_mouth` — both are set here.
  it("Town Edge's nw exit renders the country line and reaches the tunnel mouth once both flags are set", () => {
    const store = new MemoryStore();
    const session = withState({ location: TOWN_EDGE, flags: { [ACT2_KNOWS_TUNNEL_MOUTH]: true, [ACT2_STARTED]: true } });
    const { session: after, events } = say(session, 'northwest', store);
    expect(textOf(events)).toContain('the line');
    expect(textOf(events)).toContain('cedar posts');
    expect(textOf(events)).not.toContain('END OF BUILD');
    expect(after.state.location).toBe(ACT3_TUNNEL_MOUTH);
  });
});
