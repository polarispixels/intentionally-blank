import { describe, expect, it } from 'vitest';
import { TRIGGER_TURN, initialState, parse, start, step } from '../src/engine';
import type { GameEvent, GameState } from '../src/engine';
import { GAME_OVER_ASIDE, LOGIN_FAIL, LOGIN_SUCCESS, OPENING, PROMPT, RESPONSES, SEQUENCE } from '../src/content';

function deepFreeze<T>(o: T): T {
  if (o && typeof o === 'object') {
    Object.freeze(o);
    for (const v of Object.values(o as object)) deepFreeze(v);
  }
  return o;
}

function run(state: GameState, ...inputs: string[]): { state: GameState; events: GameEvent[] } {
  let s = state;
  let last: GameEvent[] = [];
  for (const i of inputs) {
    const r = step(deepFreeze(s), parse(i));
    s = r.state;
    last = r.events;
  }
  return { state: s, events: last };
}

const texts = (events: GameEvent[]) =>
  events.flatMap((e) => ('text' in e ? [e.text] : []));

describe('playing phase', () => {
  it('echoes the command and answers with authored text', () => {
    const { state, events } = run(start().state, 'look');
    expect(events[0]).toEqual({ type: 'echo', text: 'look' });
    expect(events[1]).toEqual({ type: 'say', text: RESPONSES.look[0] });
    expect(state.turn).toBe(1);
    expect(state.transcript.at(-2)).toEqual({ kind: 'player', text: 'look' });
    expect(state.transcript.at(-1)).toEqual({ kind: 'game', text: RESPONSES.look[0] });
  });
  it('say and ask', () => {
    expect(texts(run(start().state, 'say hello world').events)).toEqual(['say hello world', 'Hello, world.']);
    expect(texts(run(start().state, 'ask jeeves the weather').events)[1]).toBe(RESPONSES['ask.jeeves.weather'][0]);
    expect(texts(run(start().state, 'ask bob about tea').events)[1]).toBe('bob has no recorded opinion on tea. Neither, on reflection, do you.');
  });
  it('unknown gets the fallback and still counts a turn', () => {
    const { state, events } = run(start().state, 'dig a tunnel');
    expect(texts(events)[1]).toBe(RESPONSES.unknown[0]);
    expect(state.turn).toBe(1);
  });
  it('noop and version do not count a turn', () => {
    expect(run(start().state, '').state.turn).toBe(0);
    expect(run(start().state, '').events).toEqual([]);
    const v = run(start().state, 'version');
    expect(v.state.turn).toBe(0);
    expect(texts(v.events)[1]).toContain('0.2.0');
  });
  it('opens the prompt exactly on the trigger turn', () => {
    const before = run(start().state, ...Array(TRIGGER_TURN - 1).fill('look'));
    expect(before.state.phase).toBe('playing');
    expect(before.events.some((e) => e.type === 'openPrompt')).toBe(false);
    const at = run(before.state, 'help');
    expect(at.state.phase).toBe('prompt');
    expect(at.state.turn).toBe(TRIGGER_TURN);
    expect(at.events.at(-1)).toEqual({
      type: 'openPrompt', title: PROMPT.title, body: PROMPT.body,
      usernamePlaceholder: PROMPT.usernamePlaceholder, hint: PROMPT.hint,
    });
  });
});

describe('prompt phase', () => {
  const atPrompt = () => run(start().state, ...Array(TRIGGER_TURN).fill('look')).state;
  it('refuses ordinary commands without counting a turn', () => {
    const { state, events } = run(atPrompt(), 'look');
    expect(state.turn).toBe(TRIGGER_TURN);
    expect(state.phase).toBe('prompt');
    expect(texts(events)).toEqual(['look', RESPONSES['prompt.refused'][0]]);
  });
  it('wrong credentials fail, count attempts, reveal hint on the second', () => {
    const one = run(atPrompt(), 'login admin admin');
    expect(one.state.loginAttempts).toBe(1);
    expect(one.events).toEqual([{ type: 'promptFailed', text: LOGIN_FAIL[0], revealHint: false }]);
    const two = run(one.state, 'login admin hunter2');
    expect(two.state.loginAttempts).toBe(2);
    expect(two.events).toEqual([{ type: 'promptFailed', text: LOGIN_FAIL[1], revealHint: true }]);
    const four = run(two.state, 'login a b', 'login c d');
    expect(four.events[0]).toEqual({ type: 'promptFailed', text: LOGIN_FAIL.at(-1), revealHint: true });
  });
  it('correct credentials (any case, padded) run the whole sequence in one step', () => {
    const { state, events } = run(atPrompt(), 'login  User   PASSWORD ');
    expect(state.phase).toBe('over');
    expect(events[0]).toEqual({ type: 'closePrompt' });
    const beats = events.filter((e) => e.type === 'beat').map((e) => (e as { text: string }).text);
    expect(beats).toEqual([...LOGIN_SUCCESS, ...SEQUENCE]);
    expect(events.at(-1)).toEqual({ type: 'gameOver', aside: GAME_OVER_ASIDE });
    expect(state.transcript.at(-1)).toEqual({ kind: 'system', text: 'GAME OVER' });
    expect(state.transcript.at(-2)).toEqual({ kind: 'game', text: GAME_OVER_ASIDE });
  });
});

describe('over phase', () => {
  const over = () => run(start().state, ...Array(TRIGGER_TURN).fill('look'), 'login user password').state;
  it('refuses everything but restart', () => {
    const { state, events } = run(over(), 'look');
    expect(state.phase).toBe('over');
    expect(texts(events)).toEqual(['look', RESPONSES['over.refused'][0]]);
  });
});

describe('restart', () => {
  it('from any phase returns start() plus a restarted event', () => {
    const fresh = start();
    for (const s of [
      run(start().state, 'look').state,
      run(start().state, ...Array(TRIGGER_TURN).fill('look')).state,
      run(start().state, ...Array(TRIGGER_TURN).fill('look'), 'login user password').state,
    ]) {
      const r = step(deepFreeze(s), { type: 'restart' });
      expect(r.state).toEqual(fresh.state);
      expect(r.events).toEqual([{ type: 'restarted' }, ...fresh.events]);
    }
  });
});

describe('purity', () => {
  it('never mutates input (deepFreeze would throw)', () => {
    const s = deepFreeze(initialState());
    expect(() => step(s, { type: 'look' })).not.toThrow();
    expect(s.turn).toBe(0);
    expect(s.transcript).toEqual([]);
  });
  it('rotates variants by turn', () => {
    // Guard: if a second variant exists for `look`, turn 1 must pick it.
    if (RESPONSES.look.length > 1) {
      const second = run(start().state, 'look', 'look');
      expect(texts(second.events)[1]).toBe(RESPONSES.look[1]);
    }
    expect(OPENING.length).toBeGreaterThan(0);
  });
});
