// Stage D4, task C — S5 Reactor Interface, the interlock death, and the
// checkpoint (D4 prose doc §9, §10, §17, §21, §22).

import { describe, expect, it } from 'vitest';
import { WORLD } from '../src/content/world/game';
import { renderArrival } from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, restartEncounter, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import { flag } from '../src/engine/cond';
import {
  ACT3_BASELINE_MATCHED,
  ACT3_BYPASS_SEEN,
  ACT3_CHECKPOINT_S5,
  ACT3_CLUE_BASELINE_MATCHES_AUDIT,
  ACT3_CLUE_S6_DOOR_REFUSES,
  ACT3_CLUE_THREE_AM_DIP,
  ACT3_DEATH_REACTOR,
  ACT3_DIED_REACTOR,
  ACT3_INTERLOCK_NORMAL,
  ACT3_PIPE_CHASE,
  ACT3_READ_GAUGES_NIGHT,
  ACT3_S5_REACTOR_INTERFACE,
  ACT3_S6_PAD_TRIED,
} from '../src/content/world/act3/ids';
import { ACT2_NOLAN_BADGE, ACT2_NOTEBOOK, ACT2_REPLY_AUDIT } from '../src/content/world/act2/ids';
import { clockInWords } from '../src/content/world/act3/time';

const TEST_WORLD: WorldDef = WORLD;
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

/** Places the player at S5 directly (no checkpoint fires this way — `renderArrival` is called directly, bypassing `takeTurn`'s persistence hook). Fine for tests that don't need the checkpoint itself. */
function atS5(patch: Partial<GameState> = {}): SessionState {
  const s = withState({ location: ACT3_S5_REACTOR_INTERFACE, ...patch });
  return enter(s, ACT3_S5_REACTOR_INTERFACE).session;
}

/** Walks the player into S5 for real, through `takeTurn`, from the Pipe Chase's own "sideways" exit — so the room's own `onEnter` (the checkpoint) actually fires and gets persisted to `store`. */
function walkIntoS5(store: MemoryStore, patch: Partial<GameState> = {}): SessionState {
  const s = withState({ location: ACT3_PIPE_CHASE, ...patch });
  const atChase = enter(s, ACT3_PIPE_CHASE).session;
  return say(atChase, 'sideways', store).session;
}

describe('clockInWords (§9.9\'s own table) — never a digit', () => {
  const cases: [number, string][] = [
    [0, "twelve o'clock"],
    [5, 'five past twelve'],
    [10, 'ten past twelve'],
    [15, 'a quarter past twelve'],
    [20, 'twenty past twelve'],
    [25, 'twenty-five past twelve'],
    [30, 'half past twelve'],
    [35, 'twenty-five to one'],
    [40, 'twenty to one'],
    [45, 'a quarter to one'],
    [50, 'ten to one'],
    [55, 'five to one'],
  ];

  for (const [minute, expected] of cases) {
    it(`minute ${minute} -> "${expected}"`, () => {
      expect(clockInWords(minute)).toBe(expected);
    });
  }

  it('rounds to the nearest five minutes', () => {
    expect(clockInWords(62)).toBe(clockInWords(60));
    expect(clockInWords(63)).toBe(clockInWords(65));
  });

  it('one o\'clock (60 minutes) reads "one o\'clock"', () => {
    expect(clockInWords(60)).toBe("one o'clock");
  });

  it('never prints a digit, across every hour of the day', () => {
    for (let m = 0; m < 1440; m += 5) {
      expect(clockInWords(m)).not.toMatch(/\d/);
    }
  });
});

describe('S5 Reactor Interface — description by day/night (§9.1)', () => {
  it('first sight, on arrival', () => {
    const fresh = withState({ location: ACT3_S5_REACTOR_INTERFACE });
    const result = enter(fresh, ACT3_S5_REACTOR_INTERFACE);
    expect(text(result.events)).toMatch(/The stair comes out on a landing/);
  });

  it('later visits at night render rule 2', () => {
    const session = atS5({ clock: { day: 1, minute: 1350 } }); // 22:30, within 'night'
    // First render marks act3_s5_seen via onEnter; re-render to see rule 2.
    const again = enter(session, ACT3_S5_REACTOR_INTERFACE);
    expect(text(again.events)).toMatch(/nothing\s*\ndown here has an opinion about the time|nothing down here has an opinion about the time/);
  });

  it('later visits otherwise (not night) render rule 3', () => {
    const first = atS5({ clock: { day: 1, minute: 600 } }); // 10:00
    const again = enter(first, ACT3_S5_REACTOR_INTERFACE);
    expect(text(again.events)).toMatch(/Still nobody\./);
  });
});

describe('READ GAUGES by phase (§9.3)', () => {
  it('daytime (baseline) prints 905 / 460 / 445, no clue yet', () => {
    const session = atS5({ clock: { day: 1, minute: 600 } });
    const store = new MemoryStore();
    const result = say(session, 'read gauges', store);
    const t = text(result.events);
    expect(t).toMatch(/905/);
    expect(t).toMatch(/460/);
    expect(t).toMatch(/445/);
    expect(result.session.state.clues).not.toContain(ACT3_CLUE_THREE_AM_DIP);
  });

  it('inside the night window (02:00) prints 868 / 460 / 408, grants the clue, sets the flag', () => {
    const session = atS5({ clock: { day: 1, minute: 120 } }); // 02:00
    const store = new MemoryStore();
    const result = say(session, 'read gauges', store);
    const t = text(result.events);
    expect(t).toMatch(/868/);
    expect(t).toMatch(/460/);
    expect(t).toMatch(/408/);
    expect(result.session.state.clues).toContain(ACT3_CLUE_THREE_AM_DIP);
    expect(flag(TEST_WORLD, result.session.state, ACT3_READ_GAUGES_NIGHT)).toBe(true);
  });

  it('a second read in the same window gives the shorter "down again" text', () => {
    // 03:20 — inside the one-to-four window, outside the Custodian's S5 round (D5).
    const session = atS5({ clock: { day: 1, minute: 200 } });
    const store = new MemoryStore();
    const first = say(session, 'read gauges', store);
    const second = say(first.session, 'read gauges', store);
    expect(text(second.events)).toMatch(/Down again, and by the same amount/);
  });
});

describe('COMPARE AUDIT WITH GAUGES (§9.4)', () => {
  it('grants the clue and sets the flag; no digit, no subtraction, no "town"', () => {
    const session = atS5({ objects: { [ACT2_REPLY_AUDIT]: { location: 'inventory' } } });
    const store = new MemoryStore();
    const result = say(session, 'compare audit with gauges', store);
    const t = text(result.events);
    expect(t).toMatch(/DIFFERENCE/);
    expect(t).not.toMatch(/town/i);
    expect(t).not.toMatch(/\d/);
    expect(result.session.state.clues).toContain(ACT3_CLUE_BASELINE_MATCHES_AUDIT);
    expect(flag(TEST_WORLD, result.session.state, ACT3_BASELINE_MATCHED)).toBe(true);
  });
});

describe('the wall clock (§9.9)', () => {
  it('X CLOCK prints words, never a digit', () => {
    const session = atS5({ clock: { day: 1, minute: 90 } });
    const store = new MemoryStore();
    const result = say(session, 'read clock', store);
    const t = text(result.events);
    expect(t).toMatch(/The hands say/);
    expect(t).not.toMatch(/\d/);
  });
});

describe('the S6 pad and reader (§9.8)', () => {
  it('TYPE CREDENTIALS, with the notebook held, prints ACCESS LEVEL: MAINTENANCE / DENIED and grants the clue', () => {
    const session = atS5({ objects: { [ACT2_NOTEBOOK]: { location: 'inventory' } } });
    const store = new MemoryStore();
    const result = say(session, 'type credentials', store);
    const t = text(result.events);
    expect(t).toMatch(/ACCESS LEVEL: MAINTENANCE/);
    expect(t).toMatch(/DENIED/);
    expect(result.session.state.clues).toContain(ACT3_CLUE_S6_DOOR_REFUSES);
    expect(flag(TEST_WORLD, result.session.state, ACT3_S6_PAD_TRIED)).toBe(true);
  });

  it('USE BADGE, with the badge held, refuses and grants the clue', () => {
    const session = atS5({ objects: { [ACT2_NOLAN_BADGE]: { location: 'inventory' } } });
    const store = new MemoryStore();
    const result = say(session, 'use badge', store);
    const t = text(result.events);
    expect(t).toMatch(/NOLAN/);
    expect(result.session.state.clues).toContain(ACT3_CLUE_S6_DOOR_REFUSES);
  });
});

describe('the interlock (§10) — examine, the death, and RESTART ENCOUNTER', () => {
  it('EXAMINE INTERLOCK sets act3_bypass_seen', () => {
    const session = atS5();
    const store = new MemoryStore();
    const result = say(session, 'x interlock', store);
    expect(text(result.events)).toMatch(/turned to BYPASS/);
    expect(flag(TEST_WORLD, result.session.state, ACT3_BYPASS_SEEN)).toBe(true);
  });

  it('OPEN SHIELD DOOR with the bypass in kills the player, and RESTART ENCOUNTER returns to S5 at the checkpoint', () => {
    const store = new MemoryStore();
    const checkpointed = walkIntoS5(store);
    expect(store.get('checkpoint')).toBeDefined();

    const result = say(checkpointed, 'open shield door', store);
    const t = text(result.events);
    expect(t).toMatch(/The wheel turns/);
    expect(t).toMatch(/An interlock is not a lock/);
    expect(result.events.some((e) => e.type === 'died' && e.deathId === ACT3_DEATH_REACTOR)).toBe(true);
    expect(flag(TEST_WORLD, result.session.state, ACT3_DIED_REACTOR)).toBe(true);

    const restored = restartEncounter(store);
    expect(restored).toBeDefined();
    expect(restored!.state.location).toBe(ACT3_S5_REACTOR_INTERFACE);
    expect(flag(TEST_WORLD, restored!.state, ACT3_DIED_REACTOR)).toBe(false);
    expect(flag(TEST_WORLD, restored!.state, ACT3_INTERLOCK_NORMAL)).toBe(false);
  });

  it('TURN KEYSWITCH TO NORMAL, then OPEN SHIELD DOOR, renders §10.5 instead of the death', () => {
    const session = atS5();
    const store = new MemoryStore();
    const turned = say(session, 'turn keyswitch to normal', store);
    expect(flag(TEST_WORLD, turned.session.state, ACT3_INTERLOCK_NORMAL)).toBe(true);

    const result = say(turned.session, 'open shield door', store);
    const t = text(result.events);
    expect(t).toMatch(/stops against something that is not/);
    expect(result.events.some((e) => e.type === 'died')).toBe(false);
  });
});

describe('COUNT GAUGES (§22.15, canon 70) — must refuse', () => {
  it('does not print a number', () => {
    const session = atS5();
    const store = new MemoryStore();
    const result = say(session, 'count gauges', store);
    const t = text(result.events);
    expect(t.length).toBeGreaterThan(0);
    expect(t).not.toMatch(/\d/);
  });
});

describe('exits (§21.4)', () => {
  it('DOWN reaches the Pipe Chase', () => {
    const session = atS5();
    const store = new MemoryStore();
    const result = say(session, 'down', store);
    expect(result.session.state.location).toBe(ACT3_PIPE_CHASE);
  });
});

describe('no leaks', () => {
  it('none of the collected S5 responses leak an act3_ id, an unfilled {placeholder}, or (for the clock) a digit', () => {
    const store = new MemoryStore();
    let session = atS5({ objects: { [ACT2_REPLY_AUDIT]: { location: 'inventory' }, [ACT2_NOTEBOOK]: { location: 'inventory' } } });
    const all: GameEvent[] = [];
    for (const cmd of ['x gauges', 'read gauges', 'compare audit with gauges', 'x demand dial', 'x chase bottom', 'x s6 door', 'x interlock', 'x clock', 'read clock']) {
      const result = say(session, cmd, store);
      session = result.session;
      all.push(...result.events);
    }
    const t = text(all);
    expect(t).not.toMatch(/act3_/);
    expect(t).not.toMatch(/\{[a-zA-Z]+\}/);
  });
});
