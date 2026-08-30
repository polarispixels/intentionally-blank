import { describe, expect, it } from 'vitest';
import { initialState, start } from '../src/engine';
import { OPENING } from '../src/content';

describe('initialState', () => {
  it('is turn 0, playing, empty', () => {
    expect(initialState()).toEqual({ turn: 0, phase: 'playing', loginAttempts: 0, transcript: [] });
  });
  it('returns a fresh object each call', () => {
    expect(initialState()).not.toBe(initialState());
  });
});

describe('start', () => {
  it('emits the opening paragraphs and records them', () => {
    const { state, events } = start();
    expect(events).toEqual(OPENING.map((text) => ({ type: 'say', text })));
    expect(state.transcript).toEqual(OPENING.map((text) => ({ kind: 'game', text })));
    expect(state.turn).toBe(0);
    expect(state.phase).toBe('playing');
  });
});
