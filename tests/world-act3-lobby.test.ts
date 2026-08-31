// Act III, Stage D3, task B — the Lobby / Visitor Center
// (`docs/superpowers/specs/2026-09-11-stage-d3-prose.md` §7).
//
// Real playthrough driven through the actual parser/turn pipeline
// (`DeterministicParser` + `buildScopeView` + `takeTurn`), same idiom as
// `tests/world-act1-wave4-motel.test.ts`. Sessions teleport straight into
// the Lobby (this task's own ruling: the room is reached only through P16
// routes owned by a concurrent task, not yet necessarily wired when this
// runs) — same convention that file's own header describes for its
// object-level sections.

import { describe, expect, it } from 'vitest';
import { WORLD } from '../src/content/world/act1/world';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import type { GameEvent, GameState } from '../src/engine/world';
import { ACT2_NOLAN, ACT2_NOLAN_BADGE } from '../src/content/world/act2/ids';
import {
  ACT3_ALERTNESS,
  ACT3_BROCHURES,
  ACT3_CLUE_MODEL_SHORT,
  ACT3_CLUE_PLAQUE,
  ACT3_FLAG_ENTERED_AS_VENDOR,
  ACT3_FLAG_TAILGATED,
  ACT3_LOBBY,
  ACT3_LOBBY_READER,
  ACT3_MODEL,
  ACT3_PLAQUE,
  ACT3_RECEPTION_BELL,
  ACT3_STAGING_DOOR,
} from '../src/content/world/act3/ids';

const vocab = compileVocabulary(WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-08T09:00:00.000Z', gameVersion: 'test-0.0.0' };
}

function withState(patch: Partial<GameState>): SessionState {
  const fresh = createSession(WORLD);
  return { ...fresh, state: { ...fresh.state, ...patch } };
}

/** In the Lobby, morning, nobody present, nothing special set. */
function inLobby(patch: Partial<GameState> = {}): SessionState {
  return withState({ location: ACT3_LOBBY, clock: { day: 1, minute: 480 }, ...patch });
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
// Description rules
// ---------------------------------------------------------------------------

describe('Lobby — description', () => {
  it('first sight: nobody in it', () => {
    const { events } = say(inLobby(), 'look', new MemoryStore());
    expect(textOf(events)).toContain('there is nobody in it');
  });

  it('with Nolan present, the presence rule wins over first sight', () => {
    const session = inLobby({ npcs: { [ACT2_NOLAN]: { room: ACT3_LOBBY } } });
    const { events } = say(session, 'look', new MemoryStore());
    expect(textOf(events)).toContain('crossing the terrazzo');
  });

  it('at alertness ≥ 1, the second camera sentence renders (§14.2)', () => {
    const session = inLobby({ flags: { [ACT3_ALERTNESS]: 1 }, visited: { [ACT3_LOBBY]: 0 } });
    const { events } = say(session, 'look', new MemoryStore());
    expect(textOf(events)).toContain('a second camera on a bracket that is newer than the doors are');
  });
});

// ---------------------------------------------------------------------------
// The plaque
// ---------------------------------------------------------------------------

describe('The plaque', () => {
  it('EXAMINE PLAQUE grants act3_clue_plaque', () => {
    const { session, events } = say(inLobby(), 'examine plaque', new MemoryStore());
    expect(textOf(events)).toContain('COMMISSIONED 2030');
    expect(session.state.clues).toContain(ACT3_CLUE_PLAQUE);
  });

  it('TOUCH PLAQUE and READ NAMES answer differently', () => {
    const touch = say(inLobby(), 'touch plaque', new MemoryStore());
    expect(textOf(touch.events)).toContain('the newest thing in this\nroom');
    const read = say(inLobby(), 'read plaque', new MemoryStore());
    expect(textOf(read.events)).toContain('the plaque assumes you know');
  });
});

// ---------------------------------------------------------------------------
// The model
// ---------------------------------------------------------------------------

describe('The model', () => {
  it('COUNT LEVELS counts to five and grants act3_clue_model_short', () => {
    const { session, events } = say(inLobby(), 'count levels', new MemoryStore());
    expect(textOf(events)).toContain('S1. S2. S3. S4. S5.');
    expect(session.state.clues).toContain(ACT3_CLUE_MODEL_SHORT);
  });

  it('EXAMINE FIGURES renders the sub-part text', () => {
    const { events } = say(inLobby(), 'examine figures', new MemoryStore());
    expect(textOf(events)).toContain('what people were going to be wearing');
  });

  it('OPEN CASE and LOOK UNDER MODEL answer', () => {
    const openEvents = say(inLobby(), 'open case', new MemoryStore()).events;
    expect(textOf(openEvents)).toContain('painted over in the plinth\'s own colour');
    const underEvents = say(inLobby(), 'look under model', new MemoryStore()).events;
    expect(textOf(underEvents)).toContain('a door in the back of it');
  });
});

// ---------------------------------------------------------------------------
// The brochures
// ---------------------------------------------------------------------------

describe('The brochures', () => {
  it('TAKE BROCHURE moves one copy into inventory', () => {
    const { session, events } = say(inLobby(), 'take brochure', new MemoryStore());
    expect(textOf(events)).toContain('The pile does not go down');
    expect(session.state.objects[ACT3_BROCHURES]?.location).toBe('inventory');
  });

  it('READ CARD gives the discontinued-tours text', () => {
    const { events } = say(inLobby(), 'read card', new MemoryStore());
    expect(textOf(events)).toContain('TOURS DISCONTINUED 2041');
  });

  it('COMPARE BROCHURE WITH MODEL', () => {
    const { events } = say(inLobby(), 'compare brochure with model', new MemoryStore());
    expect(textOf(events)).toContain('nowhere on it does the dotted line go\ndown');
  });
});

// ---------------------------------------------------------------------------
// The inner turnstile — gated three ways
// ---------------------------------------------------------------------------

describe('The inner turnstile', () => {
  it('PUSH TURNSTILE without any of the three conditions is blocked', () => {
    const { events } = say(inLobby(), 'push turnstile', new MemoryStore());
    expect(textOf(events)).toContain('Anybody on the far side of this could open it');
  });

  it('passes with the badge in hand', () => {
    const session = inLobby({ objects: { [ACT2_NOLAN_BADGE]: { location: 'inventory' } } });
    const { events } = say(session, 'push turnstile', new MemoryStore());
    expect(textOf(events)).not.toContain('Anybody on the far side');
  });

  it('passes when tailgated', () => {
    const session = inLobby({ flags: { [ACT3_FLAG_TAILGATED]: true } });
    const { events } = say(session, 'push turnstile', new MemoryStore());
    expect(textOf(events)).not.toContain('Anybody on the far side');
  });

  it('passes when entered as vendor', () => {
    const session = inLobby({ flags: { [ACT3_FLAG_ENTERED_AS_VENDOR]: true } });
    const { events } = say(session, 'push turnstile', new MemoryStore());
    expect(textOf(events)).not.toContain('Anybody on the far side');
  });

  it('the ordinary GO NORTH exit is also blocked without eligibility and passes with the badge', () => {
    const blocked = say(inLobby(), 'north', new MemoryStore());
    expect(textOf(blocked.events)).toContain('Anybody on the far side of this could open it');

    const session = inLobby({ objects: { [ACT2_NOLAN_BADGE]: { location: 'inventory' } } });
    // The event that opens the reader fires on tick — one no-op-ish turn
    // (EXAMINE) lets the badge-in-hand condition register before moving.
    const { session: after } = say(session, 'examine plaque', new MemoryStore());
    const { events } = say(after, 'north', new MemoryStore());
    expect(textOf(events)).not.toContain('Anybody on the far side');
  });

  it('EXAMINE WEDGE (as vendor) shows the propped-door text', () => {
    const session = inLobby({ flags: { [ACT3_FLAG_ENTERED_AS_VENDOR]: true } });
    const { events } = say(session, 'examine wedge', new MemoryStore());
    expect(textOf(events)).toContain('holding open a door that cost more than the\ntruck');
  });
});

// ---------------------------------------------------------------------------
// The bell and the staging doors
// ---------------------------------------------------------------------------

describe('The bell', () => {
  it('RING BELL renders the two-rings line', () => {
    const { events } = say(inLobby(), 'ring bell', new MemoryStore());
    expect(textOf(events)).toContain('it turns\nout that you are');
  });

  it('SEARCH DESK finds the drawers', () => {
    const { events } = say(inLobby(), 'search desk', new MemoryStore());
    expect(textOf(events)).toContain('a stapler, a rubber band');
  });
});

describe('The staging doors', () => {
  it('OPEN STAGING DOOR is blocked in-world (the maglock)', () => {
    const { events } = say(inLobby(), 'open staging door', new MemoryStore());
    expect(textOf(events)).toContain('on a maglock and the\nmaglock is not broken');
  });
});

// ---------------------------------------------------------------------------
// Sanity: ids resolve to something registered
// ---------------------------------------------------------------------------

describe('Lobby — object registration', () => {
  it('every one of this task\'s object ids is declared in world.objects', () => {
    for (const id of [ACT3_PLAQUE, ACT3_MODEL, ACT3_BROCHURES, ACT3_LOBBY_READER, ACT3_RECEPTION_BELL, ACT3_STAGING_DOOR]) {
      expect(WORLD.objects?.[id]).toBeDefined();
    }
  });
});
