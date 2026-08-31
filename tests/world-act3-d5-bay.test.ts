// Stage D5, task F — the S6 Maintenance Bay (D5 prose doc §3-§17, §39, §40).

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
import { ACT2_NOLAN_BADGE, ACT2_STARTED } from '../src/content/world/act2/ids';
import {
  ACT3_CHECKPOINT_S6,
  ACT3_CLUE_CHAIRS,
  ACT3_CLUE_NOLAN_CHAIR,
  ACT3_CLUE_PEELED_HOOK,
  ACT3_CLUE_UV_GHOST,
  ACT3_MEM_M9,
  ACT3_P19_NIGHT_SCHEDULE,
  ACT3_PIPE_CHASE,
  ACT3_Q_WHEN_UNWATCHED,
  ACT3_REACHED_S6,
  ACT3_S6_ARCHIVE_HUB,
  ACT3_S6_MAINTENANCE_BAY,
  ACT3_UV_LAMP_ON,
  ACT3_UV_SEEN_ARM,
  ACT3_WEARING_COVERALLS,
} from '../src/content/world/act3/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-13T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

/** Act II is always underway for this wave's own tests — merged first so a patch's own `flags` still wins on any key it names. */
function withState(patch: Partial<GameState>): SessionState {
  const fresh = createSession(TEST_WORLD);
  return { ...fresh, state: { ...fresh.state, ...patch, flags: { ...fresh.state.flags, [ACT2_STARTED]: true, ...(patch.flags ?? {}) } } };
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

/** Night: 2:00 AM, day 1. Day: 2:00 PM, day 1. */
const NIGHT_MINUTE = 2 * 60;
const DAY_MINUTE = 14 * 60;

function atBay(patch: Partial<GameState> = {}): SessionState {
  const s = withState({ location: ACT3_S6_MAINTENANCE_BAY, ...patch });
  return enter(s, ACT3_S6_MAINTENANCE_BAY).session;
}

function atChase(patch: Partial<GameState> = {}): SessionState {
  const s = withState({ location: ACT3_PIPE_CHASE, ...patch });
  return enter(s, ACT3_PIPE_CHASE).session;
}

describe('The Pipe Chase\'s DOWN — the plant hatch route, done, now reaches the Bay (§39.1)', () => {
  it('DOWN from the Pipe Chase keeps D4\'s descent text and arrives in the Bay', () => {
    const store = new MemoryStore();
    const session = atChase({ clock: { day: 1, minute: DAY_MINUTE } });
    const result = say(session, 'down', store);
    expect(text(result.events)).toMatch(/The ladder goes on/);
    expect(text(result.events)).not.toMatch(/END OF BUILD/);
    expect(result.session.state.location).toBe(ACT3_S6_MAINTENANCE_BAY);
  });
});

describe('The Bay — description, day and night, first and return (§3.1)', () => {
  it('first sight, by day', () => {
    const store = new MemoryStore();
    const { events } = enter(withState({ clock: { day: 1, minute: DAY_MINUTE } }), ACT3_S6_MAINTENANCE_BAY);
    expect(text(events)).toMatch(/The ladder ends on a floor, and the floor is tiled\./);
    expect(text(events)).toMatch(/Every chair is empty, and every one of them has been set to a person\./);
    void store;
  });

  it('first sight, at night', () => {
    const store = new MemoryStore();
    const { events } = enter(withState({ clock: { day: 1, minute: NIGHT_MINUTE } }), ACT3_S6_MAINTENANCE_BAY);
    expect(text(events)).toMatch(/the room is full\./);
    expect(text(events)).toMatch(/Nobody looks up, because nobody is awake\./);
    void store;
  });

  it('returning at night gives the short form', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: NIGHT_MINUTE } });
    const result = say(session, 'look', store);
    expect(text(result.events)).toMatch(/The rows, full, facing the wall with nothing on it\./);
  });

  it('returning by day gives the short form', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: DAY_MINUTE } });
    const result = say(session, 'look', store);
    expect(text(result.events)).toMatch(/The rows, empty, facing the wall with nothing on it\./);
  });
});

describe('The chairs — R9, the refusal, and the pedestal (§4)', () => {
  it('X CHAIRS grants R9 (act3_clue_chairs)', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: DAY_MINUTE } });
    const result = say(session, 'x chairs', store);
    expect(text(result.events)).toMatch(/upholstered in a green vinyl/);
    expect(result.session.state.clues).toContain(ACT3_CLUE_CHAIRS);
  });

  it('COUNT CHAIRS refuses', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: DAY_MINUTE } });
    const result = say(session, 'count chairs', store);
    expect(text(result.events)).toMatch(/more of them than a floor this size has any business holding/);
  });

  it('LOOK UNDER CHAIR and EXAMINE PEDESTAL both give the pedestal text', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: DAY_MINUTE } });
    const under = say(session, 'look under chair', store);
    expect(text(under.events)).toMatch(/cast pedestal bolted through the tile/);
    const pedestal = say(under.session, 'x pedestal', store);
    expect(text(pedestal.events)).toMatch(/cast pedestal bolted through the tile/);
  });
});

describe('The badge hooks — the rail, Nolan\'s hook, the peeled hook (§5)', () => {
  it('X HOOKS gives the rail\'s own text', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: DAY_MINUTE } });
    const result = say(session, 'x hooks', store);
    expect(text(result.events)).toMatch(/A rail of plain steel hooks/);
    expect(text(result.events)).toMatch(/NOLAN/);
  });

  it('X NOLAN HOOK, by day, gives the empty-hook rule', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: DAY_MINUTE } });
    const result = say(session, 'x nolan hook', store);
    expect(text(result.events)).toMatch(/nothing on it/);
  });

  it('X NOLAN HOOK, at night with the badge still on it, describes the badge', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: NIGHT_MINUTE } });
    const result = say(session, 'x nolan hook', store);
    expect(text(result.events)).toMatch(/hanging on the hook by its lanyard/);
  });

  it('X PEELED HOOK grants act3_clue_peeled_hook', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: DAY_MINUTE } });
    const result = say(session, 'x peeled hook', store);
    expect(text(result.events)).toMatch(/palimpsest with nothing left on top of it/);
    expect(result.session.state.clues).toContain(ACT3_CLUE_PEELED_HOOK);
  });
});

describe('Nolan asleep — EXAMINE, WAKE, TAKE BADGE (§6)', () => {
  it('at night, X NOLAN gives §6.1 and grants act3_clue_nolan_chair', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: NIGHT_MINUTE } });
    const result = say(session, 'x nolan', store);
    expect(text(result.events)).toMatch(/Nolan is in it/);
    expect(text(result.events)).toMatch(/asleep well/);
    expect(result.session.state.clues).toContain(ACT3_CLUE_NOLAN_CHAIR);
  });

  it('at night, WAKE NOLAN gives §6.3 and does not wake him', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: NIGHT_MINUTE } });
    const result = say(session, 'wake nolan', store);
    expect(text(result.events)).toMatch(/You say his name\. Not loudly\./);
    expect(text(result.events)).toMatch(/never going to be the strap/);
  });

  it('at night, TAKE BADGE takes the badge off the hook and holds it', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: NIGHT_MINUTE } });
    const result = say(session, 'take badge', store);
    expect(text(result.events)).toMatch(/You unwind the lanyard from the hook, twice/);
    expect(result.session.state.objects?.[ACT2_NOLAN_BADGE]?.location).toBe('inventory');
  });
});

describe('The UV lamp — turning it on and the arm reveal (§8)', () => {
  it('TURN ON LAMP sets act3_uv_lamp_on', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: DAY_MINUTE } });
    const result = say(session, 'turn on lamp', store);
    expect(text(result.events)).toMatch(/fills the shade with a light that is barely a colour/);
    expect(result.session.state.flags?.[ACT3_UV_LAMP_ON]).toBe(true);
  });

  it('EXAMINE ARM UNDER LAMP, once lit, sets act3_uv_seen_arm and grants the clue', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: DAY_MINUTE }, flags: { [ACT3_UV_LAMP_ON]: true } });
    const result = say(session, 'examine arm under lamp', store);
    expect(text(result.events)).toMatch(/One upright stroke/);
    expect(result.session.state.flags?.[ACT3_UV_SEEN_ARM]).toBe(true);
    expect(result.session.state.clues).toContain(ACT3_CLUE_UV_GHOST);
  });
});

describe('The wall clock — READ CLOCK (§9)', () => {
  it('prints the hands in words, never digits', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: 9 * 60 } });
    const result = say(session, 'read clock', store);
    expect(text(result.events)).toMatch(/The hands say nine o'clock\./);
    expect(text(result.events)).not.toMatch(/\d/);
  });
});

describe('The dispenser — PULL LEVER (§10)', () => {
  it('gives one tablet', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: DAY_MINUTE } });
    const result = say(session, 'pull lever', store);
    expect(text(result.events)).toMatch(/One tablet comes down the chute/);
  });
});

describe('The coveralls — WEAR/REMOVE (§12)', () => {
  it('WEAR COVERALLS sets act3_wearing_coveralls', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: DAY_MINUTE } });
    const result = say(session, 'wear coveralls', store);
    expect(text(result.events)).toMatch(/entire specification/);
    expect(result.session.state.flags?.[ACT3_WEARING_COVERALLS]).toBe(true);
  });

  it('REMOVE COVERALLS clears it', () => {
    const store = new MemoryStore();
    const worn = say(atBay({ clock: { day: 1, minute: DAY_MINUTE } }), 'wear coveralls', store);
    const removed = say(worn.session, 'remove coveralls', store);
    expect(text(removed.events)).toMatch(/a man in a coat again/);
    expect(removed.session.state.flags?.[ACT3_WEARING_COVERALLS]).toBe(false);
  });
});

describe('Exits — east to the Archive Hub (§39.4)', () => {
  it('EAST reaches the Hub', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: DAY_MINUTE } });
    const result = say(session, 'east', store);
    expect(result.session.state.location).toBe(ACT3_S6_ARCHIVE_HUB);
  });
});

describe('First entry to the Bay — M9, P19, the question, the checkpoint (§2, §3, §17, §39.3)', () => {
  it('M9 fires exactly once, after the description, on first entry', () => {
    const store = new MemoryStore();
    const { events, session } = enter(withState({ clock: { day: 1, minute: DAY_MINUTE } }), ACT3_S6_MAINTENANCE_BAY);
    expect(text(events)).toMatch(/Every chair is empty/);
    // A full turn so the tick's ambient memory-trigger step runs.
    const result = say(session, 'wait', store);
    expect(result.session.state.memories).toContain(ACT3_MEM_M9);
    const again = say(result.session, 'wait', store);
    expect(again.session.state.memories.filter((m) => m === ACT3_MEM_M9)).toHaveLength(1);
  });

  it('act3_reached_s6 is set on first entry', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: DAY_MINUTE } });
    expect(session.state.flags?.[ACT3_REACHED_S6]).toBe(true);
    void store;
  });

  it('P19 (act3_p19_night_schedule) solves on arrival', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: DAY_MINUTE } });
    const result = say(session, 'wait', store);
    expect(result.session.state.firedEvents).toContain(`puzzle.${ACT3_P19_NIGHT_SCHEDULE}.solved`);
  });

  it('act3_q_when_unwatched is answered on arrival (opened at the chase, answered at the Bay)', () => {
    const store = new MemoryStore();
    const session = atChase({ clock: { day: 1, minute: DAY_MINUTE } });
    const down = say(session, 'down', store);
    expect(down.session.state.location).toBe(ACT3_S6_MAINTENANCE_BAY);
    const result = say(down.session, 'wait', store);
    expect(result.session.state.questions[ACT3_Q_WHEN_UNWATCHED]).toBe('answered');
  });

  it('the checkpoint event fires on first entry', () => {
    const store = new MemoryStore();
    const { events } = enter(withState({ clock: { day: 1, minute: DAY_MINUTE } }), ACT3_S6_MAINTENANCE_BAY);
    expect(events.some((e) => e.type === 'checkpoint' && e.id === ACT3_CHECKPOINT_S6)).toBe(true);
  });
});

describe('The Bay — no leaks', () => {
  it('no act3_/act2_ id or {name} template leaks in any of this room\'s own text', () => {
    const store = new MemoryStore();
    const session = atBay({ clock: { day: 1, minute: NIGHT_MINUTE }, flags: { [ACT3_UV_LAMP_ON]: true } });
    const commands = [
      'look',
      'x chairs',
      'count chairs',
      'x hooks',
      'x nolan hook',
      'x peeled hook',
      'x nolan',
      'wake nolan',
      'examine arm under lamp',
      'read clock',
      'pull lever',
      'listen',
      'smell',
      'shout',
      'wait',
      'sleep',
    ];
    for (const cmd of commands) {
      const result = say(session, cmd, store);
      expect(text(result.events)).not.toMatch(/act3_/);
      expect(text(result.events)).not.toMatch(/act2_/);
      expect(text(result.events)).not.toMatch(/\{name\}/);
    }
  });
});
