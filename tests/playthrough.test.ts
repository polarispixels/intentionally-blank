import { describe, expect, it } from 'vitest';
import { parse, start, step } from '../src/engine';
import type { GameEvent, GameState } from '../src/engine';

/** The canonical five-minute script. The CLI can replay it with --script. */
export const SCRIPT = [
  'say hello world',
  'ask jeeves the weather',
  'dig a tunnel',
  'help',              // turn 4 -> prompt opens
  'look',              // refused
  'login admin admin', // fail 1
  'login user password',
  'look',              // refused (over)
  'restart',
];

describe('full playthrough', () => {
  it('runs from opening to GAME OVER and back', () => {
    let { state, events } = start();
    const log: GameEvent[][] = [events];
    const phases: GameState['phase'][] = [];
    for (const line of SCRIPT) {
      ({ state, events } = step(state, parse(line)));
      log.push(events);
      phases.push(state.phase);
    }
    expect(phases).toEqual([
      'playing', 'playing', 'playing', 'prompt', 'prompt', 'prompt', 'over', 'over', 'playing',
    ]);
    expect(log[4]?.at(-1)?.type).toBe('openPrompt');
    expect(log[7]?.at(-1)?.type).toBe('gameOver');
    expect(log[9]?.[0]).toEqual({ type: 'restarted' });
    expect(state.transcript.length).toBe(3); // opening only, after restart
  });
});
