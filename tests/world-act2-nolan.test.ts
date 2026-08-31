// Stage D2, task C — Nolan (Stage D plan §2 D2 §4.7; D2 prose doc §17).
// Drives the real session/turn pipeline, same idiom as
// `tests/world-act2-poker.test.ts`. Evening in the yard: greeting, M8
// fires, `topic_sublevel` twice → the clue silently, the two shows,
// `unknownTopic`; offstage at noon.

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
import { NOLANS_YARD, PO_BOX_SLIP, WORK_ORDER } from '../src/content/world/act1/ids';
import { ACT2_CLUE_VERBATIM, ACT2_NOLAN, ACT2_NOLAN_SUBLEVEL_COUNT, ACT2_STARTED } from '../src/content/world/act2/ids';

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

/** Wednesday evening (day 1), `act2_started`, at Nolan's Yard. */
function eveningAtYard(patch: Partial<GameState> = {}): SessionState {
  return withState({
    location: NOLANS_YARD,
    clock: { day: 1, minute: 1080 },
    flags: { [ACT2_STARTED]: true },
    ...patch,
  });
}

describe('Nolan — schedule', () => {
  it('is at Nolan\'s Yard on an ordinary evening, once act2_started', () => {
    const session = eveningAtYard();
    expect(npcRoom(TEST_WORLD, session.state, ACT2_NOLAN)).toBe(NOLANS_YARD);
  });

  it('is offstage at noon', () => {
    const session = withState({ clock: { day: 1, minute: 720 }, flags: { [ACT2_STARTED]: true } }); // afternoon
    expect(npcRoom(TEST_WORLD, session.state, ACT2_NOLAN)).toBe('offstage');
  });

  it('is offstage entirely before act2_started', () => {
    const session = withState({ clock: { day: 1, minute: 1080 } });
    expect(npcRoom(TEST_WORLD, session.state, ACT2_NOLAN)).toBe('offstage');
  });
});

describe('Nolan — greeting and M8', () => {
  it('the first HELLO greets warmly and grants M8', () => {
    const store = new MemoryStore();
    const session = eveningAtYard();
    const { session: after, events } = say(session, 'hello man', store);
    expect(textOf(events)).toContain("Come in the yard, come in the yard");
    expect(after.state.memories).toContain('act2_mem_m8');
  });
});

describe('Nolan — topic_sublevel, twice', () => {
  it('the first hearing says the sentence; the second is character-identical and grants the clue silently', () => {
    const store = new MemoryStore();
    const session = eveningAtYard();
    const first = say(session, 'ask man about sublevel', store);
    expect(textOf(first.events)).toContain('There is no Sublevel 6.');
    expect(first.session.state.flags[ACT2_NOLAN_SUBLEVEL_COUNT]).toBe(1);
    expect(first.session.state.clues).not.toContain(ACT2_CLUE_VERBATIM);

    const second = say(first.session, 'ask man about sublevel', store);
    expect(textOf(second.events)).toBe(textOf(first.events)); // character-identical, no "again"
    expect(second.session.state.flags[ACT2_NOLAN_SUBLEVEL_COUNT]).toBe(2);
    expect(second.session.state.clues).toContain(ACT2_CLUE_VERBATIM);
  });
});

describe('Nolan — the two shows', () => {
  it('SHOW WORK ORDER TO NOLAN grants act2_clue_nolan_forgot_order', () => {
    const store = new MemoryStore();
    const session = eveningAtYard({ objects: { [WORK_ORDER]: { location: 'inventory' } } });
    const { session: after, events } = say(session, 'show work order to man', store);
    expect(textOf(events)).toContain("I don't remember it");
    expect(after.state.clues).toContain('act2_clue_nolan_forgot_order');
  });

  it('SHOW RENT NOTICE TO NOLAN gets his own hand read back', () => {
    const store = new MemoryStore();
    const session = eveningAtYard({ objects: { [PO_BOX_SLIP]: { location: 'inventory' } } });
    const { events } = say(session, 'show rent notice to man', store);
    expect(textOf(events)).toContain("That's my hand");
  });
});

describe('Nolan — unknownTopic', () => {
  it('a topic he has no words for falls to the rotating unknownTopic family', () => {
    const store = new MemoryStore();
    const session = eveningAtYard();
    const { events } = say(session, 'ask man about noumena', store);
    expect(textOf(events).length).toBeGreaterThan(0);
    expect(textOf(events)).not.toContain('Sublevel');
  });
});
