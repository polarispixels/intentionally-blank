// tests/effects.test.ts — spec §2.3, §8 task 5.

import { describe, expect, it } from 'vitest';
import { S } from '../src/engine/ids';
import type { Effect } from '../src/engine/effects';
import { apply, move } from '../src/engine/effects';
import type { GameState, ScriptFn } from '../src/engine/world';
import {
  BOX,
  CLUE_1,
  FIXTURE_WORLD,
  FLAG_BOOL,
  FLAG_NUM,
  GUIDE,
  KEY,
  MEMORY_1,
  NOTEBOOK,
  QUESTION_1,
  ROOM_A,
  ROOM_B,
  SCRIPT_1,
} from './fixtures/world';

function baseState(overrides: Partial<GameState> = {}): GameState {
  return {
    clock: { day: 1, minute: 600 },
    location: ROOM_A,
    objects: {},
    npcs: {},
    flags: {},
    counters: {},
    visited: {},
    memories: [],
    clues: [],
    questions: {},
    profile: { analytical: 0, social: 0, direct: 0 },
    ...overrides,
  };
}

/** Recursively `Object.freeze`s an object graph, for the immutability test. */
function deepFreeze<T>(value: T): T {
  if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
    Object.getOwnPropertyNames(value).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      deepFreeze((value as any)[key]);
    });
    Object.freeze(value);
  }
  return value;
}

describe('apply(): immutability', () => {
  it('never mutates a deep-frozen state or world, across every arm', () => {
    const frozenState = deepFreeze(baseState());
    // FIXTURE_WORLD carries a registered ScriptFn, so it can't round-trip
    // through structuredClone (functions aren't cloneable) — freeze the
    // shared fixture object itself. No test writes to it, only reads.
    const frozenWorld = deepFreeze(FIXTURE_WORLD);
    const effects: Effect[] = [
      { say: 'hello' },
      { set: [FLAG_BOOL, true] },
      { inc: FLAG_NUM },
      { dec: FLAG_NUM },
      { setProp: [KEY, 'shiny', true] },
      { setProp: [GUIDE, 'mood', 'cheerful'] },
      { move: [KEY, 'inventory'] },
      { reveal: BOX },
      { setState: [BOX, 'open', true] },
      { moveNpc: [GUIDE, ROOM_B] },
      { setFollowing: [GUIDE, true] },
      { grantMemory: MEMORY_1 },
      { grantClue: CLUE_1 },
      { openQuestion: QUESTION_1 },
      { answerQuestion: QUESTION_1 },
      { goto: ROOM_B },
      { advanceClock: 30 },
      { checkpoint: 'cp1' },
      { openPrompt: 'some_prompt' },
      { if: { when: { flag: FLAG_BOOL }, then: [{ say: 'yes' }], else: [{ say: 'no' }] } },
      { script: { id: SCRIPT_1, args: { note: 'hi' } } },
      { move: [NOTEBOOK, 'nowhere'] }, // plot-critical guard path
    ];

    expect(() => apply(frozenWorld, frozenState, effects)).not.toThrow();

    // The frozen inputs themselves are still exactly as they were.
    expect(frozenState.flags).toEqual({});
    expect(frozenState.objects).toEqual({});
    expect(frozenState.memories).toEqual([]);
  });

  it('does not throw when die/end effects run against frozen input', () => {
    const frozenState = deepFreeze(baseState());
    const frozenWorld = deepFreeze(FIXTURE_WORLD);
    expect(() => apply(frozenWorld, frozenState, [{ die: 'fell_down_stairs' }])).not.toThrow();
    expect(() => apply(frozenWorld, frozenState, [{ end: 'walked_away' }])).not.toThrow();
  });
});

describe('apply(): sequencing', () => {
  it('threads state through a sequence so each effect sees the previous one\'s state', () => {
    const effects: Effect[] = [{ set: [FLAG_NUM, 10] }, { inc: FLAG_NUM }, { inc: FLAG_NUM }, { dec: FLAG_NUM }];
    const result = apply(FIXTURE_WORLD, baseState(), effects);
    expect(result.state.flags[FLAG_NUM]).toBe(11);
  });

  it('a say node\'s rotation counter keeps advancing when the same effect is re-applied to the returned state', () => {
    const effects: Effect[] = [{ say: ['first', 'second'] }];
    const r1 = apply(FIXTURE_WORLD, baseState(), effects, { path: 'test.rotating' });
    const r2 = apply(FIXTURE_WORLD, r1.state, effects, { path: 'test.rotating' });
    expect([r1, r2].map((r) => (r.events[0] as { text: string }).text)).toEqual(['first', 'second']);
  });

  it('accumulates events from every effect in order', () => {
    const effects: Effect[] = [{ say: 'one' }, { checkpoint: 'cp' }, { say: 'two' }];
    const result = apply(FIXTURE_WORLD, baseState(), effects);
    expect(result.events.map((e) => e.type)).toEqual(['line', 'checkpoint', 'line']);
  });

  it('two say effects in one list rotate independently (derived, not passed, paths — spec §2.3)', () => {
    // Same rotation variants at two different indices of one handler's
    // effects list, under one shared ctx.path — this is exactly the case
    // that would have shared a counter before the derived-path fix.
    const effects: Effect[] = [{ say: ['first', 'second'] }, { say: ['first', 'second'] }];
    const result = apply(FIXTURE_WORLD, baseState(), effects, { path: 'object.thing.handlers[0]' });
    expect(result.events.map((e) => (e as { text: string }).text)).toEqual(['first', 'first']);
    expect(result.state.counters).toEqual({
      'object.thing.handlers[0].effect[0]': 1,
      'object.thing.handlers[0].effect[1]': 1,
    });
  });

  it('re-applying the same two-say list on a later turn keeps both counters advancing independently', () => {
    const effects: Effect[] = [{ say: ['first', 'second'] }, { say: ['first', 'second'] }];
    const r1 = apply(FIXTURE_WORLD, baseState(), effects, { path: 'object.thing.handlers[0]' });
    const r2 = apply(FIXTURE_WORLD, r1.state, effects, { path: 'object.thing.handlers[0]' });
    expect(r2.events.map((e) => (e as { text: string }).text)).toEqual(['second', 'second']);
  });
});

describe('apply(): say', () => {
  it('renders Prose via render() and emits a line/prose event', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ say: 'A plain response.' }]);
    expect(result.events).toEqual([{ type: 'line', kind: 'prose', text: 'A plain response.' }]);
  });

  it('threads the returned state so the rotation counter increments', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ say: ['a', 'b'] }], { path: 'test.say_rotate' });
    // Node id is derived, not the bare ctx.path — spec §2.3: `${ctx.path}.effect[i]`.
    expect(result.state.counters['test.say_rotate.effect[0]']).toBe(1);
  });

  it('fills {name}/{dobj}/{iobj}/{topic} from ctx', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ say: 'You give {dobj} to {name}.' }], { dobj: 'the key', name: 'Mara' });
    expect(result.events[0]).toMatchObject({ text: 'You give the key to Mara.' });
  });
});

describe('apply(): set/inc/dec', () => {
  it('set writes the flag overlay', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ set: [FLAG_BOOL, true] }]);
    expect(result.state.flags[FLAG_BOOL]).toBe(true);
  });

  it('inc reads the resolved default when unset, then increments', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ inc: FLAG_NUM }]);
    expect(result.state.flags[FLAG_NUM]).toBe(3); // default 2 + 1
  });

  it('dec decrements from the resolved current value', () => {
    const result = apply(FIXTURE_WORLD, baseState({ flags: { [FLAG_NUM]: 5 } }), [{ dec: FLAG_NUM }]);
    expect(result.state.flags[FLAG_NUM]).toBe(4);
  });

  it('inc throws on a non-numeric flag', () => {
    expect(() => apply(FIXTURE_WORLD, baseState(), [{ inc: FLAG_BOOL }])).toThrow(/non-numeric/);
  });
});

describe('apply(): setProp', () => {
  it('writes an object prop when the id is declared in world.objects', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ setProp: [KEY, 'shiny', true] }]);
    expect(result.state.objects[KEY]?.props).toEqual({ shiny: true });
  });

  it('writes an npc prop when the id is not declared in world.objects', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ setProp: [GUIDE, 'mood', 'cheerful'] }]);
    expect(result.state.npcs[GUIDE]?.props).toEqual({ mood: 'cheerful' });
  });

  it('preserves existing props when adding a new one', () => {
    const state = baseState({ objects: { [KEY]: { props: { color: 'brass' } } } });
    const result = apply(FIXTURE_WORLD, state, [{ setProp: [KEY, 'shiny', true] }]);
    expect(result.state.objects[KEY]?.props).toEqual({ color: 'brass', shiny: true });
  });
});

describe('apply(): move / plotCritical guard', () => {
  it('moves a non-critical object to a new place', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ move: [KEY, 'inventory'] }]);
    expect(result.state.objects[KEY]?.location).toBe('inventory');
    expect(result.events).toEqual([]);
  });

  it('refuses to move a plotCritical object to nowhere, leaving state unchanged and emitting diag', () => {
    const state = baseState({ objects: { [NOTEBOOK]: { location: ROOM_A } } });
    const result = apply(FIXTURE_WORLD, state, [{ move: [NOTEBOOK, 'nowhere'] }]);
    expect(result.state).toBe(state);
    expect(result.events).toEqual([
      { type: 'diag', code: 'plotCriticalGuard', detail: expect.stringContaining(NOTEBOOK) },
    ]);
  });

  it('refuses to move a plotCritical object into npc possession', () => {
    const state = baseState({ objects: { [NOTEBOOK]: { location: ROOM_A } } });
    const result = apply(FIXTURE_WORLD, state, [{ move: [NOTEBOOK, { npc: GUIDE }] }]);
    expect(result.state).toBe(state);
    expect(result.events[0]).toMatchObject({ type: 'diag', code: 'plotCriticalGuard' });
  });

  it('allows moving a plotCritical object between rooms/containers/inventory', () => {
    const state = baseState({ objects: { [NOTEBOOK]: { location: ROOM_A } } });
    const result = apply(FIXTURE_WORLD, state, [{ move: [NOTEBOOK, 'inventory'] }]);
    expect(result.state.objects[NOTEBOOK]?.location).toBe('inventory');
    expect(result.events).toEqual([]);
  });

  it('the guard also refuses a direct move() call, not just the Effect arm — what "scripts cannot bypass" means', () => {
    const state = baseState({ objects: { [NOTEBOOK]: { location: ROOM_A } } });
    const result = move(FIXTURE_WORLD, state, NOTEBOOK, 'nowhere');
    expect(result.state).toBe(state);
    expect(result.events[0]).toMatchObject({ type: 'diag', code: 'plotCriticalGuard' });
  });

  it('a script that calls the shared move() to dodge the guard is refused all the same', () => {
    const dodgeScriptId = S('fixture_dodge_script');
    const world = {
      ...FIXTURE_WORLD,
      scripts: { ...FIXTURE_WORLD.scripts, [dodgeScriptId]: (w: typeof FIXTURE_WORLD, s: GameState) => move(w, s, NOTEBOOK, 'nowhere') },
    };
    const state = baseState({ objects: { [NOTEBOOK]: { location: ROOM_A } } });
    const result = apply(world, state, [{ script: { id: dodgeScriptId } }]);
    expect(result.state.objects[NOTEBOOK]?.location).toBe(ROOM_A);
    expect(result.events[0]).toMatchObject({ type: 'diag', code: 'plotCriticalGuard' });
  });
});

describe('apply(): reveal / setState', () => {
  it('reveal sets hidden:false', () => {
    const state = baseState({ objects: { [BOX]: { hidden: true } } });
    const result = apply(FIXTURE_WORLD, state, [{ reveal: BOX }]);
    expect(result.state.objects[BOX]?.hidden).toBe(false);
  });

  it('setState sets the named key', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ setState: [BOX, 'locked', true] }]);
    expect(result.state.objects[BOX]?.locked).toBe(true);
  });
});

describe('apply(): moveNpc / setFollowing', () => {
  it('pins an npc to a room', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ moveNpc: [GUIDE, ROOM_B] }]);
    expect(result.state.npcs[GUIDE]?.room).toBe(ROOM_B);
  });

  it('offstage is a valid pin target', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ moveNpc: [GUIDE, 'offstage'] }]);
    expect(result.state.npcs[GUIDE]?.room).toBe('offstage');
  });

  it('"schedule" unpins by clearing room', () => {
    const state = baseState({ npcs: { [GUIDE]: { room: ROOM_B } } });
    const result = apply(FIXTURE_WORLD, state, [{ moveNpc: [GUIDE, 'schedule'] }]);
    expect(result.state.npcs[GUIDE]?.room).toBeUndefined();
  });

  it('setFollowing toggles following', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ setFollowing: [GUIDE, true] }]);
    expect(result.state.npcs[GUIDE]?.following).toBe(true);
  });
});

describe('apply(): grantMemory / grantClue', () => {
  it('grants a memory once, emitting its lines', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ grantMemory: MEMORY_1 }]);
    expect(result.state.memories).toEqual([MEMORY_1]);
    expect(result.events).toEqual([{ type: 'memory', id: MEMORY_1, lines: expect.any(Array) }]);
  });

  it('granting an already-granted memory is a no-op: no duplicate, no re-fired event', () => {
    const state = baseState({ memories: [MEMORY_1] });
    const result = apply(FIXTURE_WORLD, state, [{ grantMemory: MEMORY_1 }]);
    expect(result.state.memories).toEqual([MEMORY_1]);
    expect(result.events).toEqual([]);
  });

  it('grants a clue once, emitting its title', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ grantClue: CLUE_1 }]);
    expect(result.state.clues).toEqual([CLUE_1]);
    expect(result.events).toEqual([{ type: 'clue', id: CLUE_1, title: 'fixture clue title' }]);
  });

  it('throws for an undeclared memory id', () => {
    expect(() => apply(FIXTURE_WORLD, baseState(), [{ grantMemory: 'nope' as typeof MEMORY_1 }])).toThrow(/not declared/);
  });
});

describe('apply(): openQuestion / answerQuestion', () => {
  it('opens a question and emits its text', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ openQuestion: QUESTION_1 }]);
    expect(result.state.questions[QUESTION_1]).toBe('open');
    expect(result.events).toEqual([{ type: 'question', id: QUESTION_1, status: 'open', text: 'Is this a fixture question?' }]);
  });

  it('answers a question and emits its text', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ answerQuestion: QUESTION_1 }]);
    expect(result.state.questions[QUESTION_1]).toBe('answered');
    expect(result.events[0]).toMatchObject({ status: 'answered' });
  });
});

describe('apply(): goto / advanceClock / checkpoint / die / end / openPrompt', () => {
  it('goto relocates the player and emits no event (the look is the step loop\'s job)', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ goto: ROOM_B }]);
    expect(result.state.location).toBe(ROOM_B);
    expect(result.events).toEqual([]);
  });

  it('advanceClock adds minutes within the same day', () => {
    const result = apply(FIXTURE_WORLD, baseState({ clock: { day: 1, minute: 600 } }), [{ advanceClock: 30 }]);
    expect(result.state.clock).toEqual({ day: 1, minute: 630 });
  });

  it('advanceClock rolls over into the next day past midnight', () => {
    const result = apply(FIXTURE_WORLD, baseState({ clock: { day: 1, minute: 1430 } }), [{ advanceClock: 20 }]);
    expect(result.state.clock).toEqual({ day: 2, minute: 10 });
  });

  it('checkpoint emits the event with no state change', () => {
    const state = baseState();
    const result = apply(FIXTURE_WORLD, state, [{ checkpoint: 'opening' }]);
    expect(result.state).toBe(state);
    expect(result.events).toEqual([{ type: 'checkpoint', id: 'opening' }]);
  });

  it('die sets phase/ending and emits died', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ die: 'fell_down_stairs' }]);
    expect(result.state.phase).toBe('dead');
    expect(result.state.ending).toEqual({ id: 'fell_down_stairs' });
    expect(result.events).toEqual([{ type: 'died', deathId: 'fell_down_stairs' }]);
  });

  it('end sets phase/ending and emits ended', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ end: 'walked_away' }]);
    expect(result.state.phase).toBe('ended');
    expect(result.state.ending).toEqual({ id: 'walked_away' });
    expect(result.events).toEqual([{ type: 'ended', endingId: 'walked_away' }]);
  });

  it('openPrompt is a documented no-op at this layer (deferred to task 18)', () => {
    const state = baseState();
    const result = apply(FIXTURE_WORLD, state, [{ openPrompt: 'account_login' }]);
    expect(result.state).toBe(state);
    expect(result.events).toEqual([]);
  });
});

describe('apply(): if branching', () => {
  it('runs the then branch when the condition holds', () => {
    const effect: Effect = { if: { when: { flag: FLAG_BOOL, is: false }, then: [{ set: [FLAG_BOOL, true] }], else: [{ set: [FLAG_NUM, 99] }] } };
    const result = apply(FIXTURE_WORLD, baseState(), [effect]);
    expect(result.state.flags[FLAG_BOOL]).toBe(true);
    expect(result.state.flags[FLAG_NUM]).toBeUndefined();
  });

  it('runs the else branch when the condition fails', () => {
    const effect: Effect = { if: { when: { flag: FLAG_BOOL, is: true }, then: [{ set: [FLAG_BOOL, true] }], else: [{ set: [FLAG_NUM, 99] }] } };
    const result = apply(FIXTURE_WORLD, baseState(), [effect]);
    expect(result.state.flags[FLAG_NUM]).toBe(99);
  });

  it('a false condition with no else is a no-op', () => {
    const state = baseState();
    const effect: Effect = { if: { when: { flag: FLAG_BOOL, is: true }, then: [{ set: [FLAG_BOOL, true] }] } };
    const result = apply(FIXTURE_WORLD, state, [effect]);
    expect(result.state).toBe(state);
    expect(result.events).toEqual([]);
  });

  it('nests: branches can themselves contain if effects', () => {
    const inner: Effect = { if: { when: { flag: FLAG_NUM, atLeast: 2 }, then: [{ set: [FLAG_BOOL, true] }] } };
    const outer: Effect = { if: { when: { at: ROOM_A }, then: [inner] } };
    const result = apply(FIXTURE_WORLD, baseState(), [outer]);
    expect(result.state.flags[FLAG_BOOL]).toBe(true);
  });

  it('a say inside a then branch does not collide with a say elsewhere in the outer list (spec §2.3)', () => {
    const effects: Effect[] = [
      { say: ['outer-first', 'outer-second'] },
      { if: { when: { at: ROOM_A }, then: [{ say: ['inner-first', 'inner-second'] }] } },
    ];
    const result = apply(FIXTURE_WORLD, baseState(), effects, { path: 'object.thing.handlers[0]' });
    expect(result.events.map((e) => (e as { text: string }).text)).toEqual(['outer-first', 'inner-first']);
    expect(result.state.counters).toEqual({
      'object.thing.handlers[0].effect[0]': 1,
      'object.thing.handlers[0].effect[1].then.effect[0]': 1,
    });
  });

  it('the then and else branches of one if do not share rotation state across turns where the condition flips', () => {
    const effect: Effect = {
      if: {
        when: { flag: FLAG_BOOL },
        then: [{ say: ['then-first', 'then-second'] }],
        else: [{ say: ['else-first', 'else-second'] }],
      },
    };
    const ctx = { path: 'object.thing.handlers[0]' };
    // Turn 1: condition false -> else runs, its own counter advances to 1.
    const r1 = apply(FIXTURE_WORLD, baseState({ flags: { [FLAG_BOOL]: false } }), [effect], ctx);
    // Turn 2: condition now true -> then runs for the first time. If then/else
    // shared a node, this would render "then-second" instead of "then-first".
    const turn2State = { ...r1.state, flags: { ...r1.state.flags, [FLAG_BOOL]: true } };
    const r2 = apply(FIXTURE_WORLD, turn2State, [effect], ctx);
    expect((r1.events[0] as { text: string }).text).toBe('else-first');
    expect((r2.events[0] as { text: string }).text).toBe('then-first');
  });
});

describe('apply(): script dispatch', () => {
  it('calls the registered ScriptFn and threads its state/events', () => {
    const result = apply(FIXTURE_WORLD, baseState(), [{ script: { id: SCRIPT_1, args: { note: 'hi' } } }]);
    expect(result.state.flags[FLAG_BOOL]).toBe(true);
    expect(result.events).toEqual([{ type: 'line', kind: 'system', text: 'fixture_script_1 ran with {"note":"hi"}' }]);
  });

  it('a script\'s result is available to subsequent effects in the same list', () => {
    const effects: Effect[] = [{ script: { id: SCRIPT_1 } }, { if: { when: { flag: FLAG_BOOL }, then: [{ set: [FLAG_NUM, 42] }] } }];
    const result = apply(FIXTURE_WORLD, baseState(), effects);
    expect(result.state.flags[FLAG_NUM]).toBe(42);
  });

  it('throws for an unregistered script id, rather than a silent no-op', () => {
    expect(() => apply(FIXTURE_WORLD, baseState(), [{ script: { id: S('nope') } }])).toThrow(/not registered/);
  });

  it('a script rendering prose internally does not collide with say effects in its parent list (spec §2.3)', () => {
    // ScriptFn's signature is fixed (world, state, args) => {state, events} —
    // it never receives the caller's ctx/path, so a script that wants
    // rotating prose calls apply()/render() itself under a path of its own
    // choosing. Its registered ScriptId is a natural, already-unique
    // namespace: it can't collide with the parent list's `${path}.effect[i]`
    // derivation just by sitting alongside a `say` at some index.
    const innerScriptId = S('fixture_inner_render_script');
    const innerScript: ScriptFn = (w, s) => apply(w, s, [{ say: ['script-first', 'script-second'] }], { path: `script.${innerScriptId}` });
    const world = { ...FIXTURE_WORLD, scripts: { ...FIXTURE_WORLD.scripts, [innerScriptId]: innerScript } };
    const effects: Effect[] = [{ say: ['outer-first', 'outer-second'] }, { script: { id: innerScriptId } }];

    const result = apply(world, baseState(), effects, { path: 'object.thing.handlers[0]' });

    expect(result.events.map((e) => (e as { text: string }).text)).toEqual(['outer-first', 'script-first']);
    expect(result.state.counters).toEqual({
      'object.thing.handlers[0].effect[0]': 1,
      [`script.${innerScriptId}.effect[0]`]: 1,
    });
  });
});

describe('apply(): unowned WorldDef leaves optional tables absent gracefully where nothing needs them', () => {
  it('a world with no scripts table still runs effects that never dispatch one', () => {
    const world = { meta: FIXTURE_WORLD.meta, flags: FIXTURE_WORLD.flags };
    const result = apply(world, baseState(), [{ set: [FLAG_BOOL, true] }]);
    expect(result.state.flags[FLAG_BOOL]).toBe(true);
  });

  it('setProp on a world with no objects table treats every id as an npc', () => {
    const world = { meta: FIXTURE_WORLD.meta, flags: FIXTURE_WORLD.flags };
    const result = apply(world, baseState(), [{ setProp: [KEY, 'x', true] }]);
    expect(result.state.npcs[KEY as unknown as typeof GUIDE]?.props).toEqual({ x: true });
  });
});
