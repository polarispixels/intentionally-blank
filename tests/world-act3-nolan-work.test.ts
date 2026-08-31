// Act III, Stage D3, task B — Nolan at work, an `{ at: act3_lobby }` layer
// over D2's own Nolan (Stage D plan §4.7; prose doc §8).
//
// Same real-pipeline idiom as `tests/world-act2-nolan.test.ts` (the D2
// file this task amends).

import { describe, expect, it } from 'vitest';
import { WORLD } from '../src/content/world/act1/world';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import { npcRoom } from '../src/engine/cond';
import type { GameEvent, GameState } from '../src/engine/world';
import { NOLANS_YARD } from '../src/content/world/act1/ids';
import { ACT2_CLUE_VERBATIM, ACT2_NOLAN, ACT2_NOLAN_SUBLEVEL_COUNT, ACT2_STARTED } from '../src/content/world/act2/ids';
import { ACT3_LOBBY, ACT3_PERIMETER_ROAD, ACT3_RODE_FENCE } from '../src/content/world/act3/ids';

const vocab = compileVocabulary(WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-08T09:00:00.000Z', gameVersion: 'test-0.0.0' };
}

function withState(patch: Partial<GameState>): SessionState {
  const fresh = createSession(WORLD);
  return { ...fresh, state: { ...fresh.state, ...patch } };
}

function say(session: SessionState, text: string, store: MemoryStore): { session: SessionState; events: GameEvent[] } {
  const view = buildScopeView(WORLD, session.state, vocab);
  const outcome = new DeterministicParser().interpret(text, view);
  const result = takeTurn(WORLD, session, vocab, outcome, opts(store));
  return { session: result.session, events: result.events };
}

function textOf(events: GameEvent[]): string {
  return events
    .filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line')
    .map((e) => e.text)
    .join('\n');
}

// ---------------------------------------------------------------------------
// Schedule
// ---------------------------------------------------------------------------

describe('Nolan — the D3 schedule retarget', () => {
  it('is at the Perimeter Road at 07:10 (the tailgate window)', () => {
    const session = withState({ clock: { day: 1, minute: 430 }, flags: { [ACT2_STARTED]: true } });
    expect(npcRoom(WORLD, session.state, ACT2_NOLAN)).toBe(ACT3_PERIMETER_ROAD);
  });

  it('is in the Lobby at 09:00, after act2_started', () => {
    const session = withState({ clock: { day: 1, minute: 540 }, flags: { [ACT2_STARTED]: true } });
    expect(npcRoom(WORLD, session.state, ACT2_NOLAN)).toBe(ACT3_LOBBY);
  });

  it('is in the Lobby in the afternoon too', () => {
    const session = withState({ clock: { day: 1, minute: 800 }, flags: { [ACT2_STARTED]: true } });
    expect(npcRoom(WORLD, session.state, ACT2_NOLAN)).toBe(ACT3_LOBBY);
  });

  it('poker night still outranks the day-shift rules', () => {
    // Day 3 is a Friday (day 1 is Wednesday, per act2/calendar.ts's WEEKDAY;
    // weekday() is (day - 1) % 7, so day 3 → 2 → WEEKDAY.fri), evening —
    // poker, not the Lobby.
    const session = withState({ clock: { day: 3, minute: 1080 }, flags: { [ACT2_STARTED]: true } });
    expect(npcRoom(WORLD, session.state, ACT2_NOLAN)).not.toBe(ACT3_LOBBY);
  });

  it('is still at Nolan\'s Yard on an ordinary evening', () => {
    const session = withState({ location: NOLANS_YARD, clock: { day: 1, minute: 1080 }, flags: { [ACT2_STARTED]: true } });
    expect(npcRoom(WORLD, session.state, ACT2_NOLAN)).toBe(NOLANS_YARD);
  });
});

// ---------------------------------------------------------------------------
// The fence variant (§8.7)
// ---------------------------------------------------------------------------

describe('Nolan at work — the fence-down greeting variant', () => {
  it('outranks the ordinary work greeting when act3_rode_fence is set', () => {
    const session = withState({
      location: ACT3_LOBBY,
      clock: { day: 1, minute: 540 },
      flags: { [ACT2_STARTED]: true, [ACT3_RODE_FENCE]: true },
    });
    const { events } = say(session, 'hello nolan', new MemoryStore());
    expect(textOf(events)).toContain("There's a fence down");
  });
});

// ---------------------------------------------------------------------------
// The constant, at work — same counter as home
// ---------------------------------------------------------------------------

describe('topic_sublevel at work', () => {
  it('is the same sentence and increments the same counter as at home', () => {
    const session = withState({
      location: ACT3_LOBBY,
      clock: { day: 1, minute: 540 },
      flags: { [ACT2_STARTED]: true },
    });
    const { session: after, events } = say(session, 'ask nolan about sublevel', new MemoryStore());
    expect(textOf(events)).toContain('There is no Sublevel 6.');
    expect(after.state.flags[ACT2_NOLAN_SUBLEVEL_COUNT]).toBe(1);

    // A second hearing, this time at home — the counter is shared, so it
    // reaches 2 and the clue is granted silently there too. The clock must
    // actually move to evening: Nolan's own position is derived from HIS
    // schedule, not the player's location, and at 09:00 his schedule still
    // has him in the Lobby regardless of where the player stands.
    const secondSession = { ...after, state: { ...after.state, location: NOLANS_YARD, clock: { day: 1, minute: 1080 } } };
    const { session: final, events: secondEvents } = say(secondSession, 'ask nolan about sublevel', new MemoryStore());
    expect(textOf(secondEvents)).toContain('There is no Sublevel 6.');
    expect(final.state.flags[ACT2_NOLAN_SUBLEVEL_COUNT]).toBe(2);
    expect(final.state.clues).toContain(ACT2_CLUE_VERBATIM);
  });
});

// ---------------------------------------------------------------------------
// The work-layer topics
// ---------------------------------------------------------------------------

describe('Nolan at work — the short forms', () => {
  const atWork = () => withState({ location: ACT3_LOBBY, clock: { day: 1, minute: 540 }, flags: { [ACT2_STARTED]: true } });

  it('topic_badge (work, no badge held) is shorter and warier than home', () => {
    const { events } = say(atWork(), 'ask nolan about badge', new MemoryStore());
    expect(textOf(events)).toContain('It opens what it opens.');
  });

  it('topic_jules (work) declines and points home', () => {
    const { events } = say(atWork(), 'ask nolan about jules', new MemoryStore());
    expect(textOf(events)).toContain('Not in here.');
  });

  it('topic_headaches (work)', () => {
    const { events } = say(atWork(), 'ask nolan about headaches', new MemoryStore());
    expect(textOf(events)).toContain('Better in the building');
  });

  it('topic_nights (work)', () => {
    const { events } = say(atWork(), 'ask nolan about nights', new MemoryStore());
    expect(textOf(events)).toContain('Maintenance has it.');
  });

  it('unknownTopic at work is a distinct rotation from home', () => {
    const { events } = say(atWork(), 'ask nolan about noumena', new MemoryStore());
    expect(textOf(events).length).toBeGreaterThan(0);
    expect(textOf(events)).not.toContain('Sublevel');
  });

  it('EXAMINE NOLAN at work is the shorter variant', () => {
    const { events } = say(atWork(), 'examine nolan', new MemoryStore());
    expect(textOf(events)).toContain('He does not look tired in here.');
  });

  it('FOLLOW NOLAN inside sends the player to the plant floor, not repeating the perimeter line', () => {
    const { events } = say(atWork(), 'follow nolan', new MemoryStore());
    expect(textOf(events)).toContain('stay this side of the turnstile');
  });
});

// ---------------------------------------------------------------------------
// The home topics are unchanged
// ---------------------------------------------------------------------------

describe('Nolan at home — unchanged', () => {
  function eveningAtYard(patch: Partial<GameState> = {}): SessionState {
    return withState({ location: NOLANS_YARD, clock: { day: 1, minute: 1080 }, flags: { [ACT2_STARTED]: true }, ...patch });
  }

  it('topic_badge at home is still the long form', () => {
    const { events } = say(eveningAtYard(), 'ask man about badge', new MemoryStore());
    expect(textOf(events)).toContain("I've worn that to bed");
  });

  it('the home greeting still fires away from the Lobby', () => {
    const { events } = say(eveningAtYard(), 'hello man', new MemoryStore());
    expect(textOf(events)).toContain('Come in the yard, come in the yard');
  });
});
