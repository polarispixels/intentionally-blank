export type Phase = 'playing' | 'prompt' | 'over';

export interface TranscriptEntry {
  kind: 'player' | 'game' | 'system';
  text: string;
}

export interface GameState {
  /** Meaningful commands accepted while playing. */
  turn: number;
  phase: Phase;
  /** Failed credential submissions. */
  loginAttempts: number;
  /** Canonical record of everything shown. */
  transcript: TranscriptEntry[];
}

export type Action =
  | { type: 'say'; text: string }
  | { type: 'ask'; who: string; topic: string }
  | { type: 'look' }
  | { type: 'help' }
  | { type: 'hello' }
  | { type: 'whoami' }
  | { type: 'time' }
  | { type: 'weather' }
  | { type: 'version' }
  | { type: 'unknown'; raw: string }
  | { type: 'submitCredentials'; username: string; password: string }
  | { type: 'restart' }
  | { type: 'noop' };

export type GameEvent =
  | { type: 'echo'; text: string }
  | { type: 'say'; text: string }
  | { type: 'openPrompt'; title: string; body: string; usernamePlaceholder: string; hint: string }
  | { type: 'promptFailed'; text: string; revealHint: boolean }
  | { type: 'closePrompt' }
  | { type: 'beat'; text: string }
  | { type: 'gameOver'; aside: string }
  | { type: 'restarted' };

export interface StepResult {
  state: GameState;
  events: GameEvent[];
}

/** The turn on which the account prompt opens. */
export const TRIGGER_TURN = 4;
