// Pure `GameEvent` → printable-lines rendering for CLI v2 (§8 task 20).
// Every variant listed in spec §1.4 renders here — `memory`/`clue`/
// `question` each get their own marker so a recovered memory never reads
// like an ordinary room description (the task brief's own requirement),
// while `line` (prose/beat/system) prints bare, exactly the authored text.
//
// No game logic and no player-facing prose lives in this file (hard rule
// 5): every string below is CLI chrome — a marker, a menu label, a rule —
// wrapped around text the engine already produced. `diag` events are
// deliberately NOT handled here (see `formatDiag`, below) — they need the
// current turn number and the input line that caused them, neither of
// which a bare `GameEvent` carries, so the caller (`repl.ts`) formats
// those itself once it has that context.

import type { GameEvent } from '../engine/world';

export interface RenderedEvent {
  lines: string[];
  /** `line.kind === 'beat'` — the caller paces these with a delay after printing (`repl.ts`'s `BEAT_MS`, matching the MVP CLI's own convention). */
  beat: boolean;
}

const rule = (label: string): string => `── ${label} ──`;
const plain = (...lines: string[]): RenderedEvent => ({ lines, beat: false });

/** Renders one `GameEvent` (never `diag` — see this file's header) into the lines a shell prints for it. */
export function renderEvent(e: Exclude<GameEvent, { type: 'diag' }>): RenderedEvent {
  switch (e.type) {
    case 'echo':
      // The engine never reconstructs a description of the action (spec
      // §1.4) — and no v2 code path emits this event today (`turn.ts`'s
      // `step()` doesn't produce one; see this task's report). The
      // terminal's own echo of the typed line already covers it.
      return plain();
    case 'line':
      return { lines: [e.text], beat: e.kind === 'beat' };
    case 'memory':
      return plain('', rule('MEMORY RECOVERED'), ...e.lines, '');
    case 'clue':
      return plain(`◆ clue noted: ${e.title}`);
    case 'question':
      return plain(e.status === 'answered' ? `? question answered: ${e.text}` : `? question opened: ${e.text}`);
    case 'clarify':
      return plain(e.question);
    case 'prompt':
      return plain('', rule(e.title), e.body, '');
    case 'promptClosed':
      return plain();
    case 'checkpoint':
      return plain('(checkpoint saved)');
    case 'died':
      return plain('', rule('YOU HAVE DIED'), '');
    case 'ended':
      return plain('', rule('THE END'), '');
    case 'restarted':
      return plain('', rule('RESTARTED'), '');
  }
}

/**
 * `--diag`'s one-line-per-diag format (§3.6, the `playtester` hook): the
 * code, the input that caused it, and the turn — everything the task brief
 * asks for, in a form `grep '^DIAG parserMiss'` finds directly. `turn` is
 * `session.state.turn` *after* the call that produced this diag (for a
 * non-turn-consuming outcome that's the same value as before — nothing
 * advanced — which is the correct reading of "the turn this happened on").
 */
export function formatDiag(e: Extract<GameEvent, { type: 'diag' }>, turn: number, input: string): string {
  return `DIAG ${e.code} turn=${turn} input=${JSON.stringify(input)} detail=${JSON.stringify(e.detail)}`;
}
