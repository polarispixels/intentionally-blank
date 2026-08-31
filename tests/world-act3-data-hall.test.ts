// Act III, Stage D3, task B — Data Hall A
// (`docs/superpowers/specs/2026-09-11-stage-d3-prose.md` §9).
//
// Same real-pipeline idiom as `tests/world-act3-lobby.test.ts`.

import { describe, expect, it } from 'vitest';
import { WORLD } from '../src/content/world/act1/world';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import type { GameEvent, GameState } from '../src/engine/world';
import { ACT3_AISLE_SIGN, ACT3_CLUE_PULSE, ACT3_COLD_AISLE_CURTAIN, ACT3_DATA_HALL_A, ACT3_NOISE, ACT3_PLANT_DOOR, ACT3_RACKS } from '../src/content/world/act3/ids';

const vocab = compileVocabulary(WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-08T09:00:00.000Z', gameVersion: 'test-0.0.0' };
}

function withState(patch: Partial<GameState>): SessionState {
  const fresh = createSession(WORLD);
  return { ...fresh, state: { ...fresh.state, ...patch } };
}

function inDataHall(patch: Partial<GameState> = {}): SessionState {
  return withState({ location: ACT3_DATA_HALL_A, clock: { day: 1, minute: 480 }, ...patch });
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

describe('Data Hall A — description', () => {
  it('first sight: racks going away in both directions', () => {
    const { events } = say(inDataHall(), 'look', new MemoryStore());
    expect(textOf(events)).toContain('nothing in it that resembles an end');
  });

  it('night: every third fitting, and the rack lights don\'t know it', () => {
    const session = inDataHall({ clock: { day: 1, minute: 1320 }, visited: { [ACT3_DATA_HALL_A]: 0 } });
    const { events } = say(session, 'look', new MemoryStore());
    expect(textOf(events)).toContain('do not have a night setting');
  });
});

describe('The noise — LISTEN, day and night, on the object and the room', () => {
  it('bare LISTEN in daytime grants the pulse clue', () => {
    const { session, events } = say(inDataHall(), 'listen', new MemoryStore());
    expect(textOf(events)).toContain('There is a slow variation in it');
    expect(session.state.clues).toContain(ACT3_CLUE_PULSE);
  });

  it('LISTEN TO NOISE at night gives the slower variant and still grants the clue', () => {
    const session = inDataHall({ clock: { day: 1, minute: 1320 } });
    const { session: after, events } = say(session, 'listen to noise', new MemoryStore());
    expect(textOf(events)).toContain('it is slower than that');
    expect(after.state.clues).toContain(ACT3_CLUE_PULSE);
  });

  it('a third hearing, clue already held, gives the plain ongoing text', () => {
    const session = inDataHall({ clues: [ACT3_CLUE_PULSE] });
    const { events } = say(session, 'listen', new MemoryStore());
    expect(textOf(events)).toContain('broad, flat, everywhere');
  });
});

describe('The plant door — passes anyone', () => {
  it('USE READER passes through to the Cooling Plant', () => {
    const { session, events } = say(inDataHall(), 'use reader', new MemoryStore());
    expect(textOf(events)).toContain('Green, first ask');
    expect(session.state.location).not.toBe(ACT3_DATA_HALL_A);
  });

  it('plain GO EAST also passes, unconditionally', () => {
    const { session, events } = say(inDataHall(), 'east', new MemoryStore());
    expect(textOf(events)).toContain('Green, first ask');
    expect(session.state.location).not.toBe(ACT3_DATA_HALL_A);
  });
});

describe('The aisle sign', () => {
  it('EXAMINE SIGN shows the three vanes', () => {
    const { events } = say(inDataHall(), 'examine sign', new MemoryStore());
    expect(textOf(events)).toContain('LOBBY');
    expect(textOf(events)).toContain('PLANT');
  });
});

describe('Room responses', () => {
  it('LOOK DOWN AISLE renders the scale-moment text', () => {
    const { events } = say(inDataHall(), 'look down aisle', new MemoryStore());
    expect(textOf(events)).toContain('the rows run until they stop being rows');
  });

  it('COUNT RACKS refuses to count', () => {
    const { events } = say(inDataHall(), 'count racks', new MemoryStore());
    expect(textOf(events)).toContain('a filing rather than a thing you find out by looking');
  });

  it('SLEEP is refused', () => {
    const { events } = say(inDataHall(), 'sleep', new MemoryStore());
    expect(textOf(events)).toContain('least restful room in the county');
  });
});

describe('Exits', () => {
  it('w/out both return to the Lobby ("back" is not reachable — see act3/dataHallA.ts\'s own note)', () => {
    for (const dir of ['w', 'out']) {
      const { session } = say(inDataHall(), dir, new MemoryStore());
      expect(session.state.location).not.toBe(ACT3_DATA_HALL_A);
    }
  });
});

describe('Data Hall A — object registration', () => {
  it('every one of this task\'s object ids is declared in world.objects', () => {
    for (const id of [ACT3_RACKS, ACT3_NOISE, ACT3_AISLE_SIGN, ACT3_PLANT_DOOR, ACT3_COLD_AISLE_CURTAIN]) {
      expect(WORLD.objects?.[id]).toBeDefined();
    }
  });
});
