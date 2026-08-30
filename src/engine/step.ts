import {
  CREDENTIALS, GAME_OVER_ASIDE, LOGIN_FAIL, LOGIN_SUCCESS, PROMPT, RESPONSES, SEQUENCE,
  fill, formatSay, pick,
} from '../content';
import type { ResponseId } from '../content';
import { record, start } from './state';
import type { Action, GameEvent, GameState, StepResult } from './types';
import { TRIGGER_TURN } from './types';

function say(id: ResponseId, n: number, vars?: Readonly<Record<string, string>>): GameEvent {
  const text = pick(RESPONSES[id], n);
  return { type: 'say', text: vars ? fill(text, vars) : text };
}

function describeAction(a: Action): string {
  switch (a.type) {
    case 'say': return `say ${a.text}`;
    case 'ask': return `ask ${a.who} about ${a.topic}`;
    case 'unknown': return a.raw;
    case 'submitCredentials': return `login ${a.username} ${'\u2022'.repeat(a.password.length)}`;
    default: return a.type;
  }
}

/** What the game says back while playing. `n` selects the variant. */
function respond(a: Action, n: number): GameEvent | null {
  switch (a.type) {
    case 'say': return { type: 'say', text: formatSay(a.text) };
    case 'ask':
      return a.who === 'jeeves' && /\bweather\b/.test(a.topic)
        ? say('ask.jeeves.weather', n)
        : say('ask.generic', n, { who: a.who, topic: a.topic });
    case 'look': return say('look', n);
    case 'help': return say('help', n);
    case 'hello': return say('hello', n);
    case 'whoami': return say('whoami', n);
    case 'time': return say('time', n);
    case 'weather': return say('weather', n);
    case 'version': return say('version', n);
    case 'unknown': return say('unknown', n);
    default: return null;
  }
}

const COUNTS_AS_TURN = new Set<Action['type']>([
  'say', 'ask', 'look', 'help', 'hello', 'whoami', 'time', 'weather', 'unknown',
]);

function playing(state: GameState, a: Action): StepResult {
  const echo: GameEvent = { type: 'echo', text: describeAction(a) };
  const reply = respond(a, state.turn);
  if (!reply) return { state, events: [] };
  const events: GameEvent[] = [echo, reply];
  let next: GameState = state;
  if (COUNTS_AS_TURN.has(a.type)) {
    next = { ...state, turn: state.turn + 1 };
    if (next.turn === TRIGGER_TURN) {
      next = { ...next, phase: 'prompt' };
      events.push({
        type: 'openPrompt', title: PROMPT.title, body: PROMPT.body,
        usernamePlaceholder: PROMPT.usernamePlaceholder, hint: PROMPT.hint,
      });
    }
  }
  return { state: record(next, events), events };
}

function credentialsOk(username: string, password: string): boolean {
  return username.trim().toLowerCase() === CREDENTIALS.username
    && password.trim().toLowerCase() === CREDENTIALS.password;
}

function prompt(state: GameState, a: Action): StepResult {
  if (a.type === 'submitCredentials') {
    if (credentialsOk(a.username, a.password)) {
      const events: GameEvent[] = [
        { type: 'closePrompt' },
        ...LOGIN_SUCCESS.map((text): GameEvent => ({ type: 'beat', text })),
        ...SEQUENCE.map((text): GameEvent => ({ type: 'beat', text })),
        { type: 'gameOver', aside: GAME_OVER_ASIDE },
      ];
      return { state: record({ ...state, phase: 'over' }, events), events };
    }
    const attempts = state.loginAttempts + 1;
    const text = LOGIN_FAIL[Math.min(attempts, LOGIN_FAIL.length) - 1]!;
    return {
      state: { ...state, loginAttempts: attempts },
      events: [{ type: 'promptFailed', text, revealHint: attempts >= 2 }],
    };
  }
  const events: GameEvent[] = [
    { type: 'echo', text: describeAction(a) },
    say('prompt.refused', state.turn),
  ];
  return { state: record(state, events), events };
}

function over(state: GameState, a: Action): StepResult {
  const events: GameEvent[] = [
    { type: 'echo', text: describeAction(a) },
    say('over.refused', state.turn),
  ];
  return { state: record(state, events), events };
}

export function step(state: GameState, action: Action): StepResult {
  if (action.type === 'noop') return { state, events: [] };
  if (action.type === 'restart') {
    const s = start();
    return { state: s.state, events: [{ type: 'restarted' }, ...s.events] };
  }
  if (action.type === 'submitCredentials' && state.phase !== 'prompt') {
    // Logging in when no prompt is open: treat as an unknown command.
    return step(state, { type: 'unknown', raw: describeAction(action) });
  }
  switch (state.phase) {
    case 'playing': return playing(state, action);
    case 'prompt': return prompt(state, action);
    case 'over': return over(state, action);
  }
}
