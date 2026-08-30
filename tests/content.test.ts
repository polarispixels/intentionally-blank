import { describe, expect, it } from 'vitest';
import {
  GAME_OVER_ASIDE, LOGIN_FAIL, LOGIN_SUCCESS, OPENING, PROMPT, RESPONSES, SEQUENCE,
  fill, formatSay, pick,
} from '../src/content';

const REQUIRED_IDS = [
  'ask.jeeves.weather', 'ask.generic', 'look', 'help', 'hello', 'whoami', 'time',
  'weather', 'unknown', 'prompt.refused', 'over.refused', 'version',
] as const;

describe('content integrity', () => {
  it('has every id the engine references, with no empty variants', () => {
    for (const id of REQUIRED_IDS) {
      const variants = RESPONSES[id];
      expect(variants.length, id).toBeGreaterThan(0);
      for (const v of variants) expect(v.trim(), id).not.toBe('');
    }
  });
  it('has non-empty opening, sequence, and modal copy', () => {
    for (const list of [OPENING, LOGIN_SUCCESS, SEQUENCE, LOGIN_FAIL]) {
      expect(list.length).toBeGreaterThan(0);
      for (const v of list) expect(v.trim()).not.toBe('');
    }
    expect(GAME_OVER_ASIDE.trim()).not.toBe('');
    expect(PROMPT.title).toBe('ACCOUNT REQUIRED');
    expect(PROMPT.hint).toContain('password');
  });
});

describe('pick', () => {
  it('cycles deterministically', () => {
    const v = ['a', 'b', 'c'];
    expect([0, 1, 2, 3, 4].map((n) => pick(v, n))).toEqual(['a', 'b', 'c', 'a', 'b']);
  });
});

describe('fill', () => {
  it('replaces placeholders and leaves unknown ones', () => {
    expect(fill('{who} on {topic} {x}', { who: 'Jeeves', topic: 'tea' })).toBe('Jeeves on tea {x}');
  });
});

describe('formatSay', () => {
  it('maps hello world to the special reply', () => {
    expect(formatSay('hello world')).toBe('Hello, world.');
  });
  it('capitalizes and adds a period', () => {
    expect(formatSay('good grief')).toBe('Good grief.');
    expect(formatSay('really?')).toBe('Really?');
  });
});
