// Compound nouns (v0.14.0): "button panel" / "far door" reach the object
// that declared them, and a bare head word prefers an object that lists it
// as a plain noun over one that only has it as the head of a compound.

import { describe, expect, it } from 'vitest';
import { compileVocabulary } from '../src/engine/parser/vocabulary';
import { resolveNounPhrase } from '../src/engine/parser/resolver';
import type { WorldDef } from '../src/engine/world';
import type { ObjectId } from '../src/engine/ids';

const WALL = 'wall_panel' as ObjectId;
const LIFT = 'lift_panel' as ObjectId;
const DOOR = 'lift_door' as ObjectId;
const READER = 'reader' as ObjectId;

const world = {
  meta: { title: 't', startRoom: 'r', version: '0' },
  rooms: { r: { name: 'r', description: 'x' } },
  objects: {
    [WALL]: { location: 'r', name: 'access panel', nouns: ['panel', 'access panel'] },
    [LIFT]: { location: 'r', name: 'button panel', nouns: ['buttons', 'button panel'] },
    [DOOR]: { location: 'r', name: 'lift', nouns: ['lift', 'lift door', 'far door'] },
    [READER]: { location: 'r', name: 'reader', nouns: ['reader', 'door'] },
  },
} as unknown as WorldDef;

const vocab = compileVocabulary(world);
const visible = [WALL, LIFT, DOOR, READER];
const phrase = (text: string) => {
  const words = text.split(' ');
  return { words, adjectives: words.slice(0, -1), noun: words[words.length - 1]! };
};

describe('compound nouns', () => {
  it('a bare head word goes to the object that lists it plainly', () => {
    expect(resolveNounPhrase(vocab, visible, phrase('panel'), 'either')).toEqual({ kind: 'resolved', id: WALL });
  });
  it('the compound reaches its own object', () => {
    expect(resolveNounPhrase(vocab, visible, phrase('button panel'), 'either')).toEqual({ kind: 'resolved', id: LIFT });
    expect(resolveNounPhrase(vocab, visible, phrase('far door'), 'either')).toEqual({ kind: 'resolved', id: DOOR });
  });
  it('a bare head word with no plain claimant falls back to the compound claimants', () => {
    expect(resolveNounPhrase(vocab, [LIFT, DOOR], phrase('panel'), 'either')).toEqual({ kind: 'resolved', id: LIFT });
  });
  it('a bare "door" still prefers the plain listing over the compound', () => {
    expect(resolveNounPhrase(vocab, visible, phrase('door'), 'either')).toEqual({ kind: 'resolved', id: READER });
  });
});

describe('compound nouns — bare claimants outrank compound ones on a full adjective match', () => {
  const DRAWER = 'drawer' as ObjectId;
  const WINDOW = 'window' as ObjectId;
  const w = {
    meta: { title: 't', startRoom: 'r', version: '0' },
    rooms: { r: { name: 'r', description: 'x' } },
    objects: {
      [DRAWER]: { location: 'r', name: 'junk drawer', nouns: ['drawer', 'junk drawer'], adjectives: ['junk'] },
      [WINDOW]: { location: 'r', name: 'window', nouns: ['window', 'junk drawer', 'drawer'] },
    },
  } as unknown as WorldDef;
  const v = compileVocabulary(w);
  it('"junk drawer" is the drawer, not the window that lists the phrase as an alias', () => {
    expect(resolveNounPhrase(v, [DRAWER, WINDOW], phrase('junk drawer'), 'either')).toEqual({ kind: 'resolved', id: DRAWER });
  });
});
