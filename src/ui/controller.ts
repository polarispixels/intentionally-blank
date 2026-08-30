// The browser shell's game-loop orchestration (§8 task 22, "src/ui/ moves
// onto Session"). This is the "browser-facing path": every function here is
// exactly what `App.vue` calls — the same `takeTurn`/`respondToPrompt`/
// `undo`/`restart` calls `src/cli/repl.ts` makes, wrapped around one plain
// `UiState` value instead of a REPL's mutable module-level variables, so it
// is unit-testable with `MemoryStore` (`tests/ui-controller.test.ts`)
// exactly like every other pure-over-explicit-state module in this engine —
// no DOM, no real `localStorage`, needed to prove it works.
//
// The one browser API in this file's whole neighborhood is `LocalStorageStore`
// (`./store.ts`) — `SaveStore` is dependency-injected here (`ControllerOpts.store`),
// never referenced directly, so this file itself stays exactly as testable
// as `session.ts` is. `App.vue` is the only place that actually constructs a
// `LocalStorageStore` or reads `Date.now()`.
//
// EVENT -> LINE MAPPING mirrors `src/cli/render.ts`'s `renderEvent`, but
// tags each line with a `LineKind` (`./lines.ts`) instead of a printed
// marker, so `Transcript.vue`/`styles.css` can style memories, clues, and
// questions distinctly rather than folding them into plain text with a
// glyph in front. `echo` is never emitted by v2 (see `render.ts`'s own
// header) — the player's own line is pushed locally by `submitCommand`,
// the same way the CLI's `feed()` prints `> ${line}` itself rather than
// waiting for an event.

import type { ScriptId } from '../engine/ids';
import type { DeterministicParser } from '../engine/interpreter';
import type { CompiledVocabulary } from '../engine/parser';
import type { GameEvent, WorldDef } from '../engine/world';
import {
  deathOptions,
  load,
  respondToPrompt,
  restartEncounter,
  save,
  startSession,
  takeTurn,
  undo,
} from '../session/session';
import type { DeathOption, SessionState } from '../session/session';
import type { SaveStore } from '../session/store';
import { buildScopeView } from '../cli/scope';
import type { Line } from './lines';

export interface PromptField {
  name: string;
  placeholder?: string;
  secret?: boolean;
}

export interface PendingPrompt {
  id: string;
  title: string;
  body: string;
  fields: PromptField[];
  scriptId: ScriptId;
  /** Set only by `submitPrompt`'s own re-open case (a failed attempt) — see this file's header. */
  error?: string;
}

export interface UiState {
  session: SessionState;
  /** Already-revealed transcript lines. */
  lines: Line[];
  /** Beat-paced lines not yet revealed — the shell pops one at a time (`flushOneBeat`) or all at once (`flushAllBeats`, mirroring the old shell's "a command flushes whatever is still pending"). */
  pending: Line[];
  prompt?: PendingPrompt;
}

/** What every turn/prompt-answering call needs (ADR 0010's seams, plus the prompt-id -> script-id table `repl.ts`'s own header documents the need for). */
export interface ControllerOpts {
  world: WorldDef;
  vocab: CompiledVocabulary;
  parser: DeterministicParser;
  store: SaveStore;
  now: () => string;
  gameVersion: string;
  promptScripts: Record<string, ScriptId>;
}

/**
 * A fresh playthrough, or the autosave resumed if one exists (`store` slot
 * `'auto'`) — reload continuity, browser-only (the CLI has no equivalent: a
 * spawned process never persists across invocations by itself). A resumed
 * autosave is a game already begun — its opening arrival rendered once,
 * long ago, into a transcript this reload does not replay (this file's own
 * header) — so only the fresh-playthrough branch calls `startSession` and
 * renders its events; `load`'s branch renders nothing.
 *
 * Takes the full `ControllerOpts` (not bare `world`/`store`) because
 * applying the opening's events needs the same `promptScripts` table
 * `applyOneEvent`'s `prompt` case always needs — no world in this repo
 * opens a prompt as part of room arrival today, but the type stays honest
 * about what rendering an arbitrary event stream actually requires.
 */
export function createUiState(opts: ControllerOpts): UiState {
  const loaded = load(opts.store, 'auto');
  if (loaded !== undefined) return { session: loaded, lines: [], pending: [] };

  const started = startSession(opts.world);
  let ui: UiState = { session: started.session, lines: [], pending: [] };
  for (const e of started.events) {
    if (e.type === 'diag') continue;
    ui = applyOneEvent(ui, e, opts);
  }
  return ui;
}

/** A `UiState` with an empty transcript and no open prompt — `restart`'s shape, whichever code path reaches it (a `restarted` event, or the death menu's own RESTART button). Built via a fresh object literal, never `{ ...ui, prompt: undefined }`, so the `prompt` key is omitted rather than present-with-`undefined` (`tsconfig`'s `exactOptionalPropertyTypes`). */
function freshUi(session: SessionState): UiState {
  return { session, lines: [], pending: [] };
}

function pushLine(ui: UiState, line: Line): UiState {
  return { ...ui, lines: [...ui.lines, line] };
}

function pushLines(ui: UiState, lines: Line[]): UiState {
  return lines.length === 0 ? ui : { ...ui, lines: [...ui.lines, ...lines] };
}

/** Reveals every still-queued beat at once (a command typed mid-sequence flushes rather than interleaving — same rule the old shell and the CLI both apply). */
export function flushAllBeats(ui: UiState): UiState {
  if (ui.pending.length === 0) return ui;
  return { ...ui, lines: [...ui.lines, ...ui.pending], pending: [] };
}

/** Reveals exactly one queued beat — what a beat-pacing timer calls. */
export function flushOneBeat(ui: UiState): UiState {
  if (ui.pending.length === 0) return ui;
  const [head, ...rest] = ui.pending;
  return { ...ui, lines: [...ui.lines, head!], pending: rest };
}

function openPrompt(ui: UiState, e: Extract<GameEvent, { type: 'prompt' }>, opts: ControllerOpts, error?: string): UiState {
  const scriptId = opts.promptScripts[e.id];
  if (scriptId === undefined) {
    return pushLine(ui, { kind: 'system', text: `(no response handler registered for prompt "${e.id}")` });
  }
  return { ...ui, prompt: { id: e.id, title: e.title, body: e.body, fields: e.fields, scriptId, ...(error !== undefined ? { error } : {}) } };
}

/** One `GameEvent` (never `diag` — filtered by both callers) applied to `ui`, outside a prompt round-trip. */
function applyOneEvent(ui: UiState, e: Exclude<GameEvent, { type: 'diag' }>, opts: ControllerOpts): UiState {
  switch (e.type) {
    case 'echo':
      return ui; // never emitted by v2 — see this file's header
    case 'line':
      if (e.kind === 'beat') return { ...ui, pending: [...ui.pending, { kind: 'prose', text: e.text }] };
      return pushLine(ui, { kind: e.kind === 'system' ? 'system' : 'prose', text: e.text });
    case 'memory':
      return pushLines(ui, [{ kind: 'memory', text: 'MEMORY RECOVERED' }, ...e.lines.map((text): Line => ({ kind: 'memory', text }))]);
    case 'clue':
      return pushLine(ui, { kind: 'clue', text: `clue noted: ${e.title}` });
    case 'question':
      return pushLine(ui, { kind: 'question', text: e.status === 'answered' ? `question answered: ${e.text}` : `question opened: ${e.text}` });
    case 'clarify':
      return pushLine(ui, { kind: 'clarify', text: e.question });
    case 'prompt':
      return openPrompt(ui, e, opts);
    case 'promptClosed':
      return ui;
    case 'checkpoint':
      return pushLine(ui, { kind: 'system', text: '(checkpoint saved)' });
    case 'died':
      return pushLine(ui, { kind: 'death', text: 'YOU HAVE DIED' });
    case 'ended':
      return pushLine(ui, { kind: 'system', text: 'THE END' });
    case 'restarted':
      return freshUi(ui.session);
  }
}

function persistOpts(opts: ControllerOpts) {
  return { store: opts.store, now: opts.now(), gameVersion: opts.gameVersion };
}

/** One player command, start to finish: local echo, parse, `takeTurn`, then every resulting event applied in order. Mirrors `repl.ts`'s `feed()`. */
export function submitCommand(ui: UiState, text: string, opts: ControllerOpts): UiState {
  let next = flushAllBeats(ui);
  const trimmed = text.trim();
  if (trimmed === '') return next;
  next = pushLine(next, { kind: 'player', text: trimmed });

  try {
    const view = buildScopeView(opts.world, next.session.state, opts.vocab);
    const outcome = opts.parser.interpret(trimmed, view);
    const result = takeTurn(opts.world, next.session, opts.vocab, outcome, persistOpts(opts));
    next = { ...next, session: result.session };
    for (const e of result.events) {
      if (e.type === 'diag') continue;
      next = applyOneEvent(next, e, opts);
    }
  } catch (err) {
    next = pushLine(next, { kind: 'system', text: `[error] ${err instanceof Error ? err.message : String(err)}` });
  }
  return next;
}

/**
 * A submitted prompt form (`respondToPrompt`, not a world turn — see
 * `session.ts`'s own doc comment on why). A failed retry re-emits a fresh
 * `prompt` event with nothing else after it but system lines *before* it
 * (`content/scenes/mvp-prologue.ts`'s login script is the worked example) —
 * those buffered lines become the reopened prompt's `error`, so the modal
 * shows the failure the way `AccountModal` always did, instead of the
 * failure line landing invisibly behind a still-open modal.
 */
export function submitPrompt(ui: UiState, values: Record<string, string>, opts: ControllerOpts): UiState {
  if (ui.prompt === undefined) return ui;
  const scriptId = ui.prompt.scriptId;
  let next: UiState = { session: ui.session, lines: ui.lines, pending: ui.pending };
  const result = respondToPrompt(opts.world, next.session, scriptId, values);
  next = { ...next, session: result.session };

  let buffered: string[] = [];
  for (const e of result.events) {
    if (e.type === 'diag') continue;
    if (e.type === 'prompt') {
      next = openPrompt(next, e, opts, buffered.length > 0 ? buffered.join('\n') : undefined);
      buffered = [];
      continue;
    }
    if (e.type === 'line' && e.kind !== 'beat') {
      buffered.push(e.text);
      continue;
    }
    if (buffered.length > 0) {
      next = pushLines(next, buffered.map((text): Line => ({ kind: 'system', text })));
      buffered = [];
    }
    next = applyOneEvent(next, e, opts);
  }
  if (buffered.length > 0) next = pushLines(next, buffered.map((text): Line => ({ kind: 'system', text })));
  return next;
}

/** The death menu's available options (§5.5, constitution §11) — `session.ts`'s own `deathOptions`, over `ui.session`. */
export function deathMenuOptions(ui: UiState, store: SaveStore): DeathOption[] {
  return deathOptions(ui.session, store);
}

/**
 * One death-menu choice, clicked. RESTART clears the transcript for a
 * fresh playthrough — and, like any other new game, renders its opening
 * arrival (`startSession`, not `freshUi` over a bare `createSession`
 * anymore — the bug this file's `createUiState` also fixes). UNDO/RESTART
 * ENCOUNTER keep the transcript — the player is looking at the same
 * story, just rewound, not a new one.
 */
export function chooseDeathOption(ui: UiState, opts: ControllerOpts, option: DeathOption): UiState {
  if (option === 'restart') {
    const started = startSession(opts.world);
    let next: UiState = { session: started.session, lines: [], pending: [] };
    for (const e of started.events) {
      if (e.type === 'diag') continue;
      next = applyOneEvent(next, e, opts);
    }
    return next;
  }
  if (option === 'undo') return { ...ui, session: undo(ui.session, opts.store) };
  const restored = restartEncounter(opts.store);
  return restored === undefined ? ui : { ...ui, session: restored };
}

/** `SAVE` to slot `'manual'` — the one meta command this shell wires as a direct action (a "save now" button) rather than typed text; see this task's report for the rest of §5.3's meta commands (SAVE-by-name, LOAD, SAVES, HINT, MAP, …), not yet surfaced in the browser shell. */
export function saveNow(ui: UiState, opts: ControllerOpts): void {
  save(ui.session, { ...persistOpts(opts), slot: 'manual' });
}
