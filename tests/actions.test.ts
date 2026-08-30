// tests/actions.test.ts — spec §2.5, §2.9, §3.6, §8 task 8.

import { describe, expect, it } from 'vitest';
import { isDark } from '../src/engine/world';
import type { GameEvent, GameState } from '../src/engine/world';
import { BUILTIN_VERB_IDS, performAction } from '../src/engine/actions';
import {
  BOX,
  CHEST,
  FIXTURE_WORLD,
  FLAG_BOOL,
  GLASS_CASE,
  HAT,
  KEY,
  LAMP,
  LETTER,
  NOTEBOOK,
  ROOM_A,
  SHELF,
  SMELL,
  WAVE,
} from './fixtures/world';

function baseState(overrides: Partial<GameState> = {}): GameState {
  return {
    phase: 'playing',
    turn: 0,
    clock: { day: 1, minute: 600 }, // afternoon
    location: ROOM_A,
    objects: {},
    npcs: {},
    flags: {},
    counters: {},
    visited: {},
    memories: [],
    clues: [],
    questions: {},
    hintsUsed: {},
    profile: { analytical: 0, social: 0, direct: 0 },
    firedEvents: [],
    ...overrides,
  };
}

function lineText(events: GameEvent[]): string {
  const line = events.find((e) => e.type === 'line');
  if (line === undefined || line.type !== 'line') throw new Error('no line event in result');
  return line.text;
}

// ---------------------------------------------------------------------------
// TAKE
// ---------------------------------------------------------------------------

describe('TAKE', () => {
  it('succeeds on a portable object and moves it to inventory', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.take, dobj: HAT });
    expect(result.state.objects[HAT]?.location).toBe('inventory');
    expect(lineText(result.events)).toBe('You take the wool hat.');
    expect(result.consumesTurn).toBe(true);
    expect(result.class).toBe('direct');
  });

  it('refuses a non-portable object ("scenery")', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.take, dobj: SHELF });
    expect(lineText(result.events)).toBe("You can't take the wooden shelf.");
    expect(result.state.objects[SHELF]?.location).toBeUndefined();
  });

  it('refuses a non-portable object (plain not-portable case)', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.take, dobj: BOX });
    expect(lineText(result.events)).toBe("You can't take the wooden box.");
  });

  it('refuses when already held', () => {
    const state = baseState({ objects: { [HAT]: { location: 'inventory' } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.take, dobj: HAT });
    expect(lineText(result.events)).toBe("You're already carrying the wool hat.");
  });

  it('refuses an object inside a closed container, even a transparent one', () => {
    const state = baseState({ objects: { [HAT]: { location: { in: GLASS_CASE } } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.take, dobj: HAT });
    expect(lineText(result.events)).toBe("You can't reach the wool hat; it's shut away.");
  });

  it('succeeds on an object inside an open container', () => {
    const state = baseState({ objects: { [HAT]: { location: { in: CHEST } }, [CHEST]: { open: true } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.take, dobj: HAT });
    expect(result.state.objects[HAT]?.location).toBe('inventory');
  });

  it('a plotCritical object is takeable — the guard is only against nowhere/npc, not TAKE', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.take, dobj: NOTEBOOK });
    expect(result.state.objects[NOTEBOOK]?.location).toBe('inventory');
  });
});

// ---------------------------------------------------------------------------
// DROP
// ---------------------------------------------------------------------------

describe('DROP', () => {
  it('succeeds on a held object and moves it to the current room', () => {
    const state = baseState({ objects: { [HAT]: { location: 'inventory' } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.drop, dobj: HAT });
    expect(result.state.objects[HAT]?.location).toBe(ROOM_A);
    expect(lineText(result.events)).toBe('You drop the wool hat.');
  });

  it('refuses when not held', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.drop, dobj: HAT });
    expect(lineText(result.events)).toBe("You aren't holding the wool hat.");
  });
});

// ---------------------------------------------------------------------------
// OPEN / CLOSE
// ---------------------------------------------------------------------------

describe('OPEN', () => {
  it('refuses a non-container', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.open, dobj: KEY });
    expect(lineText(result.events)).toBe("The brass key doesn't open.");
  });

  it('refuses an already-open container', () => {
    const state = baseState({ objects: { [CHEST]: { open: true } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.open, dobj: CHEST });
    expect(lineText(result.events)).toBe('The iron chest is already open.');
  });

  it('refuses a locked container, and says so — failure produces information (§9)', () => {
    const state = baseState({ objects: { [CHEST]: { locked: true } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.open, dobj: CHEST });
    expect(lineText(result.events)).toBe('The iron chest is locked.');
  });

  it('succeeds on a closed, unlocked container', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.open, dobj: CHEST });
    expect(result.state.objects[CHEST]?.open).toBe(true);
    expect(lineText(result.events)).toBe('You open the iron chest.');
  });
});

describe('CLOSE', () => {
  it('refuses a non-container', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.close, dobj: KEY });
    expect(lineText(result.events)).toBe("The brass key doesn't close.");
  });

  it('refuses an already-closed container', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.close, dobj: CHEST });
    expect(lineText(result.events)).toBe('The iron chest is already closed.');
  });

  it('succeeds on an open container', () => {
    const state = baseState({ objects: { [CHEST]: { open: true } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.close, dobj: CHEST });
    expect(result.state.objects[CHEST]?.open).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// LOCK / UNLOCK
// ---------------------------------------------------------------------------

describe('LOCK', () => {
  it('refuses a container with no key declared', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.lock, dobj: GLASS_CASE });
    expect(lineText(result.events)).toBe("The glass case doesn't lock.");
  });

  it('refuses while the container is open', () => {
    const state = baseState({ objects: { [CHEST]: { open: true } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.lock, dobj: CHEST });
    expect(lineText(result.events)).toBe('Close the iron chest first.');
  });

  it('refuses an already-locked container', () => {
    const state = baseState({ objects: { [CHEST]: { locked: true } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.lock, dobj: CHEST });
    expect(lineText(result.events)).toBe('The iron chest is already locked.');
  });

  it('refuses the wrong key', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.lock, dobj: CHEST, iobj: BOX });
    expect(lineText(result.events)).toBe("That doesn't fit the iron chest.");
  });

  it('refuses with no key held and none specified', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.lock, dobj: CHEST });
    expect(lineText(result.events)).toBe("You don't have the key to the iron chest.");
  });

  it('succeeds with the right key specified explicitly', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.lock, dobj: CHEST, iobj: KEY });
    expect(result.state.objects[CHEST]?.locked).toBe(true);
    expect(lineText(result.events)).toBe('You lock the iron chest.');
  });

  it('succeeds implicitly when the right key is held and none is specified', () => {
    const state = baseState({ objects: { [KEY]: { location: 'inventory' } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.lock, dobj: CHEST });
    expect(result.state.objects[CHEST]?.locked).toBe(true);
  });
});

describe('UNLOCK', () => {
  it('refuses a container with no key declared', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.unlock, dobj: GLASS_CASE });
    expect(lineText(result.events)).toBe("The glass case doesn't lock.");
  });

  it('refuses an already-unlocked container', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.unlock, dobj: CHEST });
    expect(lineText(result.events)).toBe('The iron chest is already unlocked.');
  });

  it('refuses the wrong key', () => {
    const state = baseState({ objects: { [CHEST]: { locked: true } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.unlock, dobj: CHEST, iobj: BOX });
    expect(lineText(result.events)).toBe("That doesn't fit the iron chest.");
  });

  it('refuses with no key held and none specified', () => {
    const state = baseState({ objects: { [CHEST]: { locked: true } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.unlock, dobj: CHEST });
    expect(lineText(result.events)).toBe("You don't have the key to the iron chest.");
  });

  it('succeeds with the right key', () => {
    const state = baseState({ objects: { [CHEST]: { locked: true } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.unlock, dobj: CHEST, iobj: KEY });
    expect(result.state.objects[CHEST]?.locked).toBe(false);
    expect(lineText(result.events)).toBe('You unlock the iron chest.');
  });
});

// ---------------------------------------------------------------------------
// PUT IN / PUT ON
// ---------------------------------------------------------------------------

describe('PUT IN', () => {
  it('refuses a non-container target', () => {
    const state = baseState({ objects: { [KEY]: { location: 'inventory' } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.putIn, dobj: KEY, iobj: BOX });
    expect(lineText(result.events)).toBe("The wooden box isn't something you can put things in.");
  });

  it('refuses a closed container target', () => {
    const state = baseState({ objects: { [KEY]: { location: 'inventory' } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.putIn, dobj: KEY, iobj: CHEST });
    expect(lineText(result.events)).toBe('The iron chest is closed.');
  });

  it('refuses putting a thing inside itself', () => {
    const state = baseState({ objects: { [CHEST]: { open: true } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.putIn, dobj: CHEST, iobj: CHEST });
    expect(lineText(result.events)).toBe('That would trap the iron chest inside itself.');
  });

  it('refuses the containment loop: putting a container inside something it already contains', () => {
    const state = baseState({
      objects: {
        [CHEST]: { open: true },
        [GLASS_CASE]: { location: { in: CHEST }, open: true }, // GLASS_CASE is already inside CHEST
      },
    });
    // Putting CHEST inside GLASS_CASE would nest CHEST inside something CHEST already contains.
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.putIn, dobj: CHEST, iobj: GLASS_CASE });
    expect(lineText(result.events)).toBe('That would trap the glass case inside itself.');
    expect(result.state.objects[CHEST]?.location).toBeUndefined(); // unchanged: still its authored default
  });

  it('succeeds into an open container', () => {
    const state = baseState({ objects: { [KEY]: { location: 'inventory' }, [CHEST]: { open: true } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.putIn, dobj: KEY, iobj: CHEST });
    expect(result.state.objects[KEY]?.location).toEqual({ in: CHEST });
    expect(lineText(result.events)).toBe('You put the brass key in the iron chest.');
  });
});

describe('PUT ON', () => {
  it('refuses a non-supporter target', () => {
    const state = baseState({ objects: { [KEY]: { location: 'inventory' } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.putOn, dobj: KEY, iobj: CHEST });
    expect(lineText(result.events)).toBe("You can't put things on the iron chest.");
  });

  it('succeeds onto a supporter', () => {
    const state = baseState({ objects: { [KEY]: { location: 'inventory' } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.putOn, dobj: KEY, iobj: SHELF });
    expect(result.state.objects[KEY]?.location).toEqual({ on: SHELF });
    expect(lineText(result.events)).toBe('You put the brass key on the wooden shelf.');
  });
});

// ---------------------------------------------------------------------------
// WEAR / REMOVE
// ---------------------------------------------------------------------------

describe('WEAR', () => {
  it('refuses a non-wearable object', () => {
    const state = baseState({ objects: { [KEY]: { location: 'inventory' } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.wear, dobj: KEY });
    expect(lineText(result.events)).toBe("You can't wear the brass key.");
  });

  it('refuses an already-worn object', () => {
    const state = baseState({ objects: { [HAT]: { location: 'worn' } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.wear, dobj: HAT });
    expect(lineText(result.events)).toBe("You're already wearing the wool hat.");
  });

  it('succeeds on a wearable object', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.wear, dobj: HAT });
    expect(result.state.objects[HAT]?.location).toBe('worn');
    expect(lineText(result.events)).toBe('You put on the wool hat.');
  });
});

describe('REMOVE', () => {
  it('refuses an object that is not worn', () => {
    const state = baseState({ objects: { [HAT]: { location: 'inventory' } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.remove, dobj: HAT });
    expect(lineText(result.events)).toBe("You aren't wearing the wool hat.");
  });

  it('succeeds on a worn object', () => {
    const state = baseState({ objects: { [HAT]: { location: 'worn' } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.remove, dobj: HAT });
    expect(result.state.objects[HAT]?.location).toBe('inventory');
    expect(lineText(result.events)).toBe('You take off the wool hat.');
  });
});

// ---------------------------------------------------------------------------
// READ
// ---------------------------------------------------------------------------

describe('READ', () => {
  it('renders `text` when present', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.read, dobj: LETTER });
    expect(lineText(result.events)).toBe('Meet me at noon. -M');
  });

  it('falls back to `description` when `text` is absent', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.read, dobj: BOX });
    expect(lineText(result.events)).toBe('A plain wooden box.');
  });
});

// ---------------------------------------------------------------------------
// TURN ON / TURN OFF
// ---------------------------------------------------------------------------

describe('TURN ON / TURN OFF', () => {
  it('refuses a non-switchable object', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.turnOn, dobj: KEY });
    expect(lineText(result.events)).toBe("The brass key doesn't switch on.");
  });

  it('refuses turning on an already-on object', () => {
    const state = baseState({ objects: { [LAMP]: { on: true } } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.turnOn, dobj: LAMP });
    expect(lineText(result.events)).toBe('The floor lamp is already on.');
  });

  it('refuses turning off an already-off object', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.turnOff, dobj: LAMP });
    expect(lineText(result.events)).toBe('The floor lamp is already off.');
  });

  it('turning on a lightSource defeats baseline darkness (isDark interaction, §2.4)', () => {
    const before = baseState();
    expect(isDark(FIXTURE_WORLD, before, ROOM_A)).toBe(true); // ROOM_A is baseline dark
    const result = performAction(FIXTURE_WORLD, before, { verb: BUILTIN_VERB_IDS.turnOn, dobj: LAMP });
    expect(result.state.objects[LAMP]?.on).toBe(true);
    expect(isDark(FIXTURE_WORLD, result.state, ROOM_A)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Rung 1 vs rung 2: handler-overrides-builtin
// ---------------------------------------------------------------------------

describe('handler-overrides-builtin (§3.6 rung 1)', () => {
  it('an unconditional handler wins outright over built-in semantics for the same verb', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.take, dobj: KEY });
    expect(lineText(result.events)).toBe('You palm the brass key with practiced care.');
    expect(result.state.objects[KEY]?.location).toBe('inventory');
    expect(result.class).toBe('direct'); // the handler's own class, not the verb's
  });

  it("a handler whose `when` doesn't hold falls through to the built-in", () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.take, dobj: LETTER });
    // FLAG_BOOL defaults false: LETTER's handler when-clause is unmet, so the take.* builtin runs.
    expect(lineText(result.events)).toBe('You take the folded letter.');
    expect(result.state.objects[LETTER]?.location).toBe('inventory');
  });

  it('once its `when` holds, the handler wins over the built-in', () => {
    const state = baseState({ flags: { [FLAG_BOOL]: true } });
    const result = performAction(FIXTURE_WORLD, state, { verb: BUILTIN_VERB_IDS.take, dobj: LETTER });
    expect(lineText(result.events)).toBe('A hidden compartment clicks — the letter was waiting for you to notice.');
    expect(result.class).toBe('analytical'); // the handler's own class override
  });
});

// ---------------------------------------------------------------------------
// Rung 2b: the verb's own default family, and consumesTurn
// ---------------------------------------------------------------------------

describe('rung 2b — verb default family, for a verb with no built-in semantics', () => {
  it('renders the templated default and emits a defaultResponse diag', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: SMELL, dobj: KEY });
    expect(lineText(result.events)).toBe('You smell nothing special about the brass key.');
    const diag = result.events.find((e) => e.type === 'diag');
    expect(diag).toBeDefined();
    expect(diag).toMatchObject({ type: 'diag', code: 'defaultResponse' });
    expect(result.class).toBe('analytical');
  });
});

describe('consumesTurn', () => {
  it('defaults true for a built-in action', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: BUILTIN_VERB_IDS.take, dobj: HAT });
    expect(result.consumesTurn).toBe(true);
  });

  it('a handler can override consumesTurn to false', () => {
    const world = {
      ...FIXTURE_WORLD,
      objects: {
        ...FIXTURE_WORLD.objects,
        [HAT]: {
          ...FIXTURE_WORLD.objects![HAT]!,
          handlers: [{ verbs: [SMELL], effects: [{ say: 'Wet wool.' as const }], consumesTurn: false }],
        },
      },
    };
    const result = performAction(world, baseState(), { verb: SMELL, dobj: HAT });
    expect(result.consumesTurn).toBe(false);
  });

  it('is false at rung 2b for a meta verb', () => {
    const result = performAction(FIXTURE_WORLD, baseState(), { verb: WAVE });
    expect(result.consumesTurn).toBe(false);
    expect(lineText(result.events)).toBe('You wave at nothing in particular.');
  });
});
