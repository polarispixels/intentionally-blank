// tests/prose.test.ts — spec §2.2, §8 task 4.
//
// Test data is defined locally (not extended off tests/fixtures/world.ts,
// per task 4's file-ownership note) — a minimal WorldDef with one flag is
// all `render()` needs to exercise `Cond` selection via `evaluate()`.

import { describe, expect, it } from 'vitest';
import { F, R } from '../src/engine/ids';
import type { FlagId } from '../src/engine/ids';
import { render } from '../src/engine/prose';
import type { Prose, ProseRule } from '../src/engine/prose';
import type { GameState, WorldDef } from '../src/engine/world';

const FLAG_MET_MARA: FlagId = F('test_flag_met_mara');

const WORLD: WorldDef = {
  meta: {
    phases: { morning: 360, afternoon: 720, evening: 1080, night: 1320 },
    weekLength: 7,
  },
  flags: {
    [FLAG_MET_MARA]: { default: false, doc: 'test flag' },
  },
};

function baseState(overrides: Partial<GameState> = {}): GameState {
  return {
    phase: 'playing',
    turn: 0,
    clock: { day: 1, minute: 600 },
    location: R('test_room'),
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
    parser: {},
    ...overrides,
  };
}

describe('render(): plain string', () => {
  it('renders a bare string as-is, untouched', () => {
    const state = baseState();
    const result = render(WORLD, state, 'test.plain', 'Just some text.');
    expect(result.text).toBe('Just some text.');
    expect(result.state.counters).toEqual({});
  });
});

describe('render(): string[] rotation', () => {
  const VARIANTS: Prose = ['first', 'second', 'third'];

  it('rotates through variants in order and wraps around', () => {
    let state = baseState();
    const seen: string[] = [];
    for (let i = 0; i < 7; i++) {
      const result = render(WORLD, state, 'test.rotating', VARIANTS);
      seen.push(result.text);
      state = result.state;
    }
    expect(seen).toEqual(['first', 'second', 'third', 'first', 'second', 'third', 'first']);
  });

  it('increments the per-node counter on every render', () => {
    const r1 = render(WORLD, baseState(), 'test.rotating', VARIANTS);
    expect(r1.state.counters['test.rotating']).toBe(1);
    const r2 = render(WORLD, r1.state, 'test.rotating', VARIANTS);
    expect(r2.state.counters['test.rotating']).toBe(2);
  });

  it('does not mutate the input state', () => {
    const state = baseState();
    const frozenCounters = { ...state.counters };
    render(WORLD, state, 'test.rotating', VARIANTS);
    expect(state.counters).toEqual(frozenCounters);
  });
});

describe('render(): two nodes rotate independently', () => {
  it('a render on one path never advances a different path\'s counter', () => {
    let state = baseState();
    // advance node A three times
    for (let i = 0; i < 3; i++) {
      state = render(WORLD, state, 'test.nodeA', ['a0', 'a1']).state;
    }
    // node B has never been rendered
    expect(state.counters['test.nodeB']).toBeUndefined();
    const bResult = render(WORLD, state, 'test.nodeB', ['b0', 'b1']);
    expect(bResult.text).toBe('b0');
    expect(bResult.state.counters).toEqual({ 'test.nodeA': 3, 'test.nodeB': 1 });
  });
});

describe('render(): counter survives serialize/deserialize', () => {
  it('resumes rotation exactly after a JSON round-trip', () => {
    let state = baseState();
    state = render(WORLD, state, 'test.persisted', ['x', 'y', 'z']).state;
    state = render(WORLD, state, 'test.persisted', ['x', 'y', 'z']).state;
    // two renders consumed: next should be 'z' (index 2)
    const reloaded = JSON.parse(JSON.stringify(state)) as GameState;
    const result = render(WORLD, reloaded, 'test.persisted', ['x', 'y', 'z']);
    expect(result.text).toBe('z');
    expect(result.state.counters['test.persisted']).toBe(3);
  });
});

describe('render(): ProseRule[] selection order', () => {
  const RULES: ProseRule[] = [
    { when: { flag: FLAG_MET_MARA, is: true }, text: 'You know Mara now.' },
    { text: 'You have not met Mara yet.' },
  ];

  it('picks the first rule whose `when` matches', () => {
    const state = baseState({ flags: { [FLAG_MET_MARA]: true } });
    const result = render(WORLD, state, 'test.rule', RULES);
    expect(result.text).toBe('You know Mara now.');
  });

  it('falls through to the unconditional rule when nothing matches', () => {
    const state = baseState();
    const result = render(WORLD, state, 'test.rule', RULES);
    expect(result.text).toBe('You have not met Mara yet.');
  });

  it('throws when no rule matches and none is unconditional', () => {
    const badRules: ProseRule[] = [{ when: { flag: FLAG_MET_MARA, is: true }, text: 'only if met' }];
    expect(() => render(WORLD, baseState(), 'test.badrule', badRules)).toThrow();
  });

  it('rotates a matched rule\'s own string[] text using a per-rule node path', () => {
    const rulesWithVariants: ProseRule[] = [
      { when: { flag: FLAG_MET_MARA, is: true }, text: ['met-a', 'met-b'] },
      { text: ['unmet-a', 'unmet-b'] },
    ];
    let state = baseState({ flags: { [FLAG_MET_MARA]: true } });
    const r1 = render(WORLD, state, 'test.perRule', rulesWithVariants);
    expect(r1.text).toBe('met-a');
    state = r1.state;
    const r2 = render(WORLD, state, 'test.perRule', rulesWithVariants);
    expect(r2.text).toBe('met-b');

    // Now switch condition — the OTHER rule's rotation must not have moved,
    // and must start fresh at its own index 0.
    const unmetState = baseState();
    const r3 = render(WORLD, unmetState, 'test.perRule', rulesWithVariants);
    expect(r3.text).toBe('unmet-a');
  });
});

describe('render(): templating', () => {
  it('fills {name}, {dobj}, {iobj}, {topic} from the context argument', () => {
    const state = baseState();
    const result = render(WORLD, state, 'test.template', 'You give {iobj} to {name}, asking about {topic}.', {
      name: 'Mara',
      iobj: 'the letter',
      topic: 'the fire',
    });
    expect(result.text).toBe('You give the letter to Mara, asking about the fire.');
  });

  it('fills templates inside rotation variants too', () => {
    const state = baseState();
    const result = render(WORLD, state, 'test.templateRotate', ['Hello, {name}.', 'Hi there, {name}.'], {
      name: 'Mara',
    });
    expect(result.text).toBe('Hello, {name}.'.replace('{name}', 'Mara'));
  });

  it('leaves an unresolved placeholder literal when the context omits it', () => {
    const state = baseState();
    const result = render(WORLD, state, 'test.templateMissing', 'You look at {dobj}.', {});
    expect(result.text).toBe('You look at {dobj}.');
  });
});

describe('render(): say-by-reference (ProseRef)', () => {
  const WORLD_WITH_RESPONSES: WorldDef = {
    ...WORLD,
    responses: {
      unknown: ['Family variant one.', 'Family variant two.'],
      nounMiss: { ref: 'unknown' }, // one-hop chain, not a cycle
      selfCycle: { ref: 'selfCycle' },
      cycleA: { ref: 'cycleB' },
      cycleB: { ref: 'cycleA' },
    },
  };

  it('resolves a bare ref against world.responses and renders it', () => {
    const state = baseState();
    const result = render(WORLD_WITH_RESPONSES, state, 'verb.take.default', { ref: 'unknown' });
    expect(result.text).toBe('Family variant one.');
  });

  it('follows a one-hop chain of refs', () => {
    const state = baseState();
    const result = render(WORLD_WITH_RESPONSES, state, 'verb.eat.default', { ref: 'nounMiss' });
    expect(result.text).toBe('Family variant one.');
  });

  it('throws on a ref naming a family that does not exist', () => {
    const state = baseState();
    expect(() =>
      render(WORLD_WITH_RESPONSES, state, 'verb.take.default', { ref: 'noSuchFamily' }),
    ).toThrow();
  });

  it('throws rather than recursing on a self-referencing family', () => {
    const state = baseState();
    expect(() =>
      render(WORLD_WITH_RESPONSES, state, 'verb.take.default', { ref: 'selfCycle' }),
    ).toThrow();
  });

  it('throws rather than recursing on a two-step ref cycle', () => {
    const state = baseState();
    expect(() =>
      render(WORLD_WITH_RESPONSES, state, 'verb.take.default', { ref: 'cycleA' }),
    ).toThrow();
  });

  it('keys the rotation counter off the referencing node, not the family', () => {
    let state = baseState();
    // Two different handlers reference the same family.
    const r1 = render(WORLD_WITH_RESPONSES, state, 'verb.take.default', { ref: 'unknown' });
    state = r1.state;
    const r2 = render(WORLD_WITH_RESPONSES, state, 'verb.give.default', { ref: 'unknown' });
    state = r2.state;
    // Both start at index 0 of the family's variants independently.
    expect(r1.text).toBe('Family variant one.');
    expect(r2.text).toBe('Family variant one.');
    expect(state.counters).toEqual({
      'verb.take.default': 1,
      'verb.give.default': 1,
    });
    expect(state.counters['unknown']).toBeUndefined();

    // Advancing one further proves they rotate independently.
    const r3 = render(WORLD_WITH_RESPONSES, state, 'verb.take.default', { ref: 'unknown' });
    expect(r3.text).toBe('Family variant two.');
    expect(r3.state.counters['verb.give.default']).toBe(1);
  });

  it("resolves a ProseRef inside a ProseRule.text, keyed to the rule's own node", () => {
    const rules: ProseRule[] = [
      { when: { flag: FLAG_MET_MARA, is: true }, text: { ref: 'unknown' } },
      { text: 'not met yet' },
    ];
    const state = baseState({ flags: { [FLAG_MET_MARA]: true } });
    const result = render(WORLD_WITH_RESPONSES, state, 'npc.mara.greet', rules);
    expect(result.text).toBe('Family variant one.');
    expect(result.state.counters).toEqual({ 'npc.mara.greet[0]': 1 });
  });
});

// ---------------------------------------------------------------------------
// proper names drop the article in front of their placeholder (v0.8.0)
// ---------------------------------------------------------------------------

describe('templating — `proper` keys', () => {
  const T = 'You hold up the {name}. The {iobj} looks at it, or near it.';

  it('a capitalized proper name loses the article ("The Jack" → "Jack")', () => {
    const r = render(WORLD, baseState(), 'test.proper', T, { name: 'mug', iobj: 'Jack', proper: 'iobj' });
    expect(r.text).toBe('You hold up the mug. Jack looks at it, or near it.');
  });

  it('a lowercase display name keeps its article', () => {
    const r = render(WORLD, baseState(), 'test.proper', T, { name: 'mug', iobj: 'guide', proper: 'iobj' });
    expect(r.text).toBe('You hold up the mug. The guide looks at it, or near it.');
  });

  it('keys not listed as proper are untouched even when capitalized', () => {
    const r = render(WORLD, baseState(), 'test.proper', 'The {name} sits there.', { name: 'Catan box' });
    expect(r.text).toBe('The Catan box sits there.');
  });
});
