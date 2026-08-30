import { describe, expect, it } from 'vitest';
import { normalize, parse } from '../src/engine';
import type { Action } from '../src/engine';

const cases: ReadonlyArray<[string, Action]> = [
  ['', { type: 'noop' }],
  ['   ', { type: 'noop' }],
  ['restart', { type: 'restart' }],
  ['RESET', { type: 'restart' }],
  ['start over', { type: 'restart' }],
  ['login user password', { type: 'submitCredentials', username: 'user', password: 'password' }],
  ['log in Bob hunter2', { type: 'submitCredentials', username: 'bob', password: 'hunter2' }],
  ['sign up a b', { type: 'submitCredentials', username: 'a', password: 'b' }],
  ['say hello world', { type: 'say', text: 'hello world' }],
  ['say "hello world"', { type: 'say', text: 'hello world' }],
  ['"hello world"', { type: 'say', text: 'hello world' }],
  ['hello world', { type: 'say', text: 'hello world' }],
  ['hi world!', { type: 'say', text: 'hello world' }],
  ['type good grief', { type: 'say', text: 'good grief' }],
  ['ask jeeves the weather', { type: 'ask', who: 'jeeves', topic: 'weather' }],
  ['ask jeeves about the weather', { type: 'ask', who: 'jeeves', topic: 'weather' }],
  ['Ask Jeeves about tea.', { type: 'ask', who: 'jeeves', topic: 'tea' }],
  ['ask bob what time it is', { type: 'ask', who: 'bob', topic: 'what time it is' }],
  ['look', { type: 'look' }],
  ['l', { type: 'look' }],
  ['look around', { type: 'look' }],
  ['examine room', { type: 'look' }],
  ['x room', { type: 'look' }],
  ['help', { type: 'help' }],
  ['?', { type: 'help' }],
  ['commands', { type: 'help' }],
  ['what can I do', { type: 'help' }],
  ['hello', { type: 'hello' }],
  ['Hi!', { type: 'hello' }],
  ['hey', { type: 'hello' }],
  ['greetings', { type: 'hello' }],
  ['good morning', { type: 'hello' }],
  ['who are you', { type: 'whoami' }],
  ['who am I?', { type: 'whoami' }],
  ['whoami', { type: 'whoami' }],
  ['what are you', { type: 'whoami' }],
  ['time', { type: 'time' }],
  ['what time is it', { type: 'time' }],
  ['date', { type: 'time' }],
  ['what year is it', { type: 'time' }],
  ['weather', { type: 'weather' }],
  ["what's the weather", { type: 'weather' }],
  ['what’s the weather', { type: 'weather' }],
  ["how's the weather?", { type: 'weather' }],
  ['what is the weather like', { type: 'weather' }],
  ['version', { type: 'version' }],
  ['dig a tunnel', { type: 'unknown', raw: 'dig a tunnel' }],
  ['Lick the statue!!', { type: 'unknown', raw: 'lick the statue' }],
];

describe('parse', () => {
  it.each(cases)('%j → %j', (input, expected) => {
    expect(parse(input)).toEqual(expected);
  });
});

describe('normalize', () => {
  it('trims, lowercases, collapses whitespace, strips quotes and trailing punctuation', () => {
    expect(normalize('  Say   "Hello"!! ')).toBe('say "hello"');
    expect(normalize('“hello world”')).toBe('hello world');
    expect(normalize('what’s up?')).toBe('what\'s up');
  });
});