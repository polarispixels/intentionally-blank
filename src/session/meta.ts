// Shared meta-command recognition (spec §5.3) — the parsing half of what
// `src/cli/repl.ts` has always done for itself and `src/ui/controller.ts`
// needs too (Ryan's v0.3.2 playtest: RESTART/UNDO/SAVE/etc. typed in the
// browser fell through to the parser and came back `unknown` — the engine
// selectors for all of them already existed, `src/engine/views.ts`, but
// nothing in the browser ever recognized the raw text). Lives here, in
// `src/session/` rather than either shell, so there is exactly one place
// that knows the raw-text shape of these commands — two divergent copies
// is how a shell quietly loses one, which is what happened here.
//
// Recognition only. What each `MetaCommand` DOES differs enough between a
// line-printing REPL and a `Line`-tagged `UiState` that executing one stays
// per-shell (`repl.ts`'s `handleMeta`, `controller.ts`'s
// `handleMetaCommand`) — the same split `session.ts` already draws between
// "what happened" (pure functions) and "how a shell prints it."

export type MetaCommand =
  | { kind: 'save'; slot: string }
  | { kind: 'load'; slot: string }
  | { kind: 'saves' }
  | { kind: 'undo' }
  | { kind: 'restart' }
  | { kind: 'restartEncounter' }
  | { kind: 'export' }
  | { kind: 'import'; path: string }
  | { kind: 'hint'; n?: number }
  | { kind: 'map' }
  | { kind: 'questions' }
  | { kind: 'notebook' }
  | { kind: 'memories' };

/** No name given to `SAVE`/`LOAD` — a documented CLI choice (spec §5.3 leaves the no-name case open); a single fixed slot, distinct from the session's own reserved `'auto'`/`'undo'`/`'checkpoint'` bookkeeping slots. */
export const DEFAULT_SLOT = 'manual';

/**
 * `undefined` for anything that isn't one of these — an ordinary verb line,
 * meant for the parser, never intercepted here. `RESET` is a synonym for
 * `RESTART` (this task's own addition, at Ryan's request while playtesting
 * v0.3.2): both mean "begin again," and a player reaching for either word
 * should get the same behavior, confirmation included. `RESET` is never a
 * synonym for `RESTART ENCOUNTER`, which keeps its own two-word phrase.
 */
export function parseMetaCommand(input: string): MetaCommand | undefined {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  if (lower === 'saves') return { kind: 'saves' };
  if (lower === 'undo') return { kind: 'undo' };
  if (lower === 'restart encounter') return { kind: 'restartEncounter' };
  if (lower === 'restart' || lower === 'reset') return { kind: 'restart' };
  if (lower === 'export') return { kind: 'export' };
  if (lower === 'map') return { kind: 'map' };
  if (lower === 'questions') return { kind: 'questions' };
  if (lower === 'notebook') return { kind: 'notebook' };
  if (lower === 'memories') return { kind: 'memories' };
  if (lower === 'hint') return { kind: 'hint' };

  let m = trimmed.match(/^save(?:\s+(\S+))?$/i);
  if (m !== null) return { kind: 'save', slot: m[1] ?? DEFAULT_SLOT };
  m = trimmed.match(/^load(?:\s+(\S+))?$/i);
  if (m !== null) return { kind: 'load', slot: m[1] ?? DEFAULT_SLOT };
  m = trimmed.match(/^import\s+(\S+)$/i);
  if (m !== null) return { kind: 'import', path: m[1]! };
  m = trimmed.match(/^hint\s+(\d+)$/i);
  if (m !== null) return { kind: 'hint', n: Number(m[1]) };

  return undefined;
}
