import { OPENING } from '../content';
import type { GameEvent, GameState, StepResult, TranscriptEntry } from './types';

export function initialState(): GameState {
  return { turn: 0, phase: 'playing', loginAttempts: 0, transcript: [] };
}

/** Append transcript entries for the events that carry text. Returns a new state. */
export function record(state: GameState, events: readonly GameEvent[]): GameState {
  const entries: TranscriptEntry[] = [];
  for (const e of events) {
    if (e.type === 'echo') entries.push({ kind: 'player', text: e.text });
    else if (e.type === 'say' || e.type === 'beat') entries.push({ kind: 'game', text: e.text });
    else if (e.type === 'gameOver') {
      entries.push({ kind: 'game', text: e.aside });
      entries.push({ kind: 'system', text: 'GAME OVER' });
    }
  }
  return entries.length === 0 ? state : { ...state, transcript: [...state.transcript, ...entries] };
}

export function start(): StepResult {
  const events: GameEvent[] = OPENING.map((text) => ({ type: 'say', text }));
  return { state: record(initialState(), events), events };
}
