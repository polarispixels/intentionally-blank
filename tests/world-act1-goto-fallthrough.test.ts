// `GO TO <storefront>` on a first visit (v0.7.0). Main Street's storefronts
// are scenery objects whose `V_APPROACH` handlers walk the player in, but
// their nouns ("diner", "library", "store", "sheriff") are also room
// aliases, and `tryGoTo` used to answer "You don't know the way there yet."
// before the grammar ever saw the phrase. The interpreter now offers an
// unroutable GO TO to the grammar first and only refuses when that misses.

import { describe, expect, it } from 'vitest';
import { DeterministicParser } from '../src/engine/interpreter';
import type { ScopeView } from '../src/engine/interpreter';
import { compileVocabulary } from '../src/engine/parser';
import { WORLD } from '../src/content/world/act1/world';
import { BILLBOARD_CLOSE, COUNTY_LIBRARY_FRONT, DINER, MAIN_STREET, TOWN_EDGE, TOWN_SIGN, V_APPROACH } from '../src/content/world/act1/ids';
import { EXAMINE } from '../src/content/world/act1/verbs';
import { nextParserContext } from '../src/engine/interpreter';

const vocab = compileVocabulary(WORLD);
const parser = new DeterministicParser();

/** Main Street, first time out: only the street itself is visited, so no GO TO route exists to any neighbour. */
function streetView(visible: ScopeView['visible']): ScopeView {
  return {
    vocabulary: vocab,
    visible,
    parser: {},
    portable: new Set(),
    location: new Map(),
    travel: { current: MAIN_STREET, passable: new Map([[MAIN_STREET, []]]) },
  };
}

describe('GO TO falls through to the grammar when no route exists', () => {
  it('"go to diner" with the diner storefront in view is the storefront\'s own approach action', () => {
    expect(parser.interpret('go to diner', streetView([DINER]))).toEqual({
      kind: 'actions',
      actions: [{ verb: V_APPROACH, dobj: DINER, raw: 'go to diner' }],
    });
  });

  it('"go to library" and "go to annex" reach the library front the same way', () => {
    for (const raw of ['go to library', 'go to annex']) {
      expect(parser.interpret(raw, streetView([COUNTY_LIBRARY_FRONT]))).toEqual({
        kind: 'actions',
        actions: [{ verb: V_APPROACH, dobj: COUNTY_LIBRARY_FRONT, raw }],
      });
    }
  });

  it('with nothing in view to approach, the original "don\'t know the way" refusal still stands', () => {
    expect(parser.interpret('go to diner', streetView([]))).toEqual({
      kind: 'unreachable',
      raw: 'go to diner',
      message: "You don't know the way there yet.",
    });
  });
});

describe('a disambiguation question names objects by their declared `name` (v0.7.0)', () => {
  function edgeView(parserCtx: ScopeView['parser'] = {}): ScopeView {
    return {
      vocabulary: vocab,
      visible: [BILLBOARD_CLOSE, TOWN_SIGN],
      parser: parserCtx,
      portable: new Set(),
      location: new Map(),
      travel: { current: TOWN_EDGE, passable: new Map([[TOWN_EDGE, []]]) },
    };
  }

  it('"x sign" at Town Edge asks about the billboard and the town limits sign, not "the boards or the town number"', () => {
    const outcome = parser.interpret('x sign', edgeView());
    expect(outcome.kind).toBe('clarify');
    if (outcome.kind !== 'clarify') return;
    expect(outcome.question).toContain('the billboard or the town limits sign');
    expect(outcome.options).toEqual(['billboard', 'town limits sign']);
  });

  it('answering with the offered name resolves', () => {
    const first = parser.interpret('x sign', edgeView());
    const ctx = nextParserContext({}, first, vocab);
    const answer = parser.interpret('town limits sign', edgeView(ctx));
    expect(answer).toEqual({
      kind: 'actions',
      actions: [{ verb: EXAMINE, dobj: TOWN_SIGN, raw: 'x sign' }],
    });
  });
});

describe('a noun miss names only the failing slot (v0.9.0)', () => {
  it('"show ticket to jack" with no ticket is a miss whose knownNouns are the dobj words, not "jack"', () => {
    const outcome = parser.interpret('show ticket to jack', {
      vocabulary: vocab,
      visible: [],
      parser: {},
      portable: new Set(),
      location: new Map(),
      travel: { current: MAIN_STREET, passable: new Map([[MAIN_STREET, []]]) },
    });
    expect(outcome.kind).toBe('miss');
    if (outcome.kind !== 'miss') return;
    expect(outcome.knownNouns).not.toContain('jack');
  });
});
