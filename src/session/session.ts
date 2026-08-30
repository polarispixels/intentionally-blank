// The session layer (spec §5.3-§5.7, ADR 0010): orchestrates the shipped
// v2 engine (`turn.ts`'s `step`) with save/undo/autosave/checkpoints,
// entirely as pure functions over a `SessionState` value — no class, no
// hidden mutable field, matching the rest of the engine's style. Every
// function that needs a wall-clock timestamp takes one as a `now: string`
// parameter (ISO, caller-supplied) rather than reading a clock itself
// (ADR 0010: "the session never reads a clock"), and every function that
// persists takes a `SaveStore` rather than assuming `localStorage`.

import { apply } from '../engine/effects';
import type { ActionClass, ScriptId } from '../engine/ids';
import type { InterpretOutcome } from '../engine/interpreter';
import type { CompiledVocabulary } from '../engine/parser/vocabulary';
import { step } from '../engine/turn';
import { initialState } from '../engine/world';
import type { GameEvent, GameState, WorldDef } from '../engine/world';
import type { SaveStore } from './store';
import type { HistoryEntry, SaveFile } from './savefile';
import { SAVE_VERSION, appendHistory, serializeSave } from './savefile';
import { migrateSaveFile } from './migrate';

/** §5.5: "an in-memory ring of the last 15 pre-action states." */
export const UNDO_RING_SIZE = 15;

/** Slots `takeTurn`/`Session` itself writes — never surfaced by `listSaves` (§5.3's `SAVES` lists the player's own named saves, not bookkeeping slots). */
const RESERVED_SLOTS: readonly string[] = ['auto', 'undo', 'checkpoint'];

/**
 * The session's own state: the `GameState` in play, the undo ring, and the
 * structured history record (§5.1). Deliberately not called `Session` (no
 * class exists to name) and deliberately separate from `GameState` itself
 * — none of this is game-world state, and none of it is saved as-is (see
 * `toSaveFile`/`fromSaveFile` below for the envelope it maps to and from).
 */
export interface SessionState {
  state: GameState;
  /** Pre-action states, oldest first; length never exceeds `UNDO_RING_SIZE`. */
  undoRing: GameState[];
  history: HistoryEntry[];
  historyTruncated: boolean;
}

/** A fresh playthrough (§1.3's `initialState`, with an empty session on top). */
export function createSession(world: WorldDef): SessionState {
  return { state: initialState(world), undoRing: [], history: [], historyTruncated: false };
}

/** What every persisting call needs and nothing it doesn't (ADR 0010's `now()`/`SaveStore` seams). */
export interface PersistOptions {
  store: SaveStore;
  now: string;
  gameVersion: string;
}

function toSaveFile(session: SessionState, slot: string, opts: { gameVersion: string; now: string; label?: string }): SaveFile {
  return {
    saveVersion: SAVE_VERSION,
    gameVersion: opts.gameVersion,
    slot,
    ...(opts.label !== undefined ? { label: opts.label } : {}),
    savedAt: opts.now,
    state: session.state,
    history: session.history,
    ...(session.historyTruncated ? { historyTruncated: true as const } : {}),
  };
}

/** §5.5: "`LOAD`/`IMPORT` reseeds the ring" — with an empty one; a loaded save carries no pre-action states of its own. */
function fromSaveFile(save: SaveFile): SessionState {
  return { state: save.state, undoRing: [], history: save.history, historyTruncated: save.historyTruncated ?? false };
}

/** `SAVE [name]` (§5.3): writes `slot` (a player-chosen name, or one of the reserved bookkeeping slots) to `store`. */
export function save(session: SessionState, opts: PersistOptions & { slot: string; label?: string }): void {
  opts.store.put(opts.slot, serializeSave(toSaveFile(session, opts.slot, opts)));
}

/** `LOAD [name]` (§5.3). `undefined` when `slot` isn't in `store` — callers render "no such save," not a thrown error. */
export function load(store: SaveStore, slot: string): SessionState | undefined {
  const raw = store.get(slot);
  if (raw === undefined) return undefined;
  return fromSaveFile(migrateSaveFile(raw));
}

/** `SAVES` (§5.3): the player's own named saves — `auto`/`undo`/`checkpoint` are bookkeeping, never listed. */
export function listSaves(store: SaveStore): string[] {
  return store.list().filter((slot) => !RESERVED_SLOTS.includes(slot));
}

/** `EXPORT` (§5.3): the save JSON verbatim, slot `'export'` — not written to `store` (device-move data, not a save slot). */
export function exportSave(session: SessionState, opts: { gameVersion: string; now: string }): string {
  return serializeSave(toSaveFile(session, 'export', opts));
}

/** `IMPORT` (§5.3): the inverse of `exportSave` — reseeds the ring, same as `load`. */
export function importSave(json: string): SessionState {
  return fromSaveFile(migrateSaveFile(json));
}

/** `RESTART` (§5.3, §5.5): a fresh playthrough. Cheap by construction — no store access, nothing to undo back from. */
export function restart(world: WorldDef): SessionState {
  return createSession(world);
}

/** `RESTART ENCOUNTER` (§5.6): reloads slot `'checkpoint'` — `undefined` when no checkpoint has fired yet this playthrough. */
export function restartEncounter(store: SaveStore): SessionState | undefined {
  return load(store, 'checkpoint');
}

/**
 * `UNDO` (§5.5): pops the ring first; once it's empty (fresh after a
 * reload, or already used down to nothing), falls back to slot `'undo'` —
 * the *one* previous-turn state autosave keeps around specifically so a
 * single UNDO survives a browser reload. That fallback doesn't refill the
 * ring, so a second consecutive `undo()` call after it is a no-op: slot
 * `'undo'` only ever holds one state (this task's own §5.5 reading — see
 * `takeTurn`'s autosave write below), not a second step back.
 */
export function undo(session: SessionState, store: SaveStore): SessionState {
  if (session.undoRing.length > 0) {
    const prev = session.undoRing[session.undoRing.length - 1]!;
    return { ...session, state: prev, undoRing: session.undoRing.slice(0, -1) };
  }
  const raw = store.get('undo');
  if (raw === undefined) return session; // nothing to undo — no-op
  return { ...session, state: migrateSaveFile(raw).state };
}

export type DeathOption = 'undo' | 'restartEncounter' | 'restart';

/**
 * Death menu (§5.5, constitution §11 — "death offers UNDO / RESTART
 * ENCOUNTER / RESTART," and must be cheap). `RESTART` is always offered;
 * `UNDO`/`RESTART ENCOUNTER` only when there is actually something to fall
 * back to, so a shell never renders a dead-end option.
 */
export function deathOptions(session: SessionState, store: SaveStore): DeathOption[] {
  const options: DeathOption[] = [];
  if (session.undoRing.length > 0 || store.get('undo') !== undefined) options.push('undo');
  if (store.get('checkpoint') !== undefined) options.push('restartEncounter');
  options.push('restart');
  return options;
}

export interface TakeTurnResult {
  session: SessionState;
  events: GameEvent[];
  class: ActionClass | null;
}

/**
 * One player turn (§0's diagram: interpreter output in, `turn.ts`'s
 * `step()` for the engine reducer, then this task's own save/undo/
 * checkpoint bookkeeping around it).
 *
 * A non-turn-consuming outcome (clarify, a parser miss, `GO TO`
 * unreachable, `ALL`/`AND` expanding to nothing — `turn.ts`'s own
 * `commandConsumesTurn`) updates `session.state` (parser context only —
 * nothing else changed) but touches neither the undo ring, `history`, nor
 * any store slot: nothing actually happened this "turn," so there is
 * nothing to remember or roll back to (§4.1's meta-verb rule extended to
 * every non-consuming outcome, not just meta verbs).
 *
 * A turn-consuming outcome pushes the *pre*-action state onto the undo
 * ring (capped at `UNDO_RING_SIZE`), appends one `history` entry keyed by
 * this task's own turn-consumption decision (`turn.ts`'s header: one typed
 * command, one entry, whatever its raw input was), then autosaves slot
 * `'auto'` (the post-action save) and slot `'undo'` (the *pre*-action
 * save, §5.5's post-reload fallback) — and, if a `checkpoint` event fired
 * this turn, slot `'checkpoint'` too (§5.6, "keeping the latest").
 */
export function takeTurn(
  world: WorldDef,
  session: SessionState,
  vocab: CompiledVocabulary,
  outcome: InterpretOutcome,
  opts: PersistOptions,
): TakeTurnResult {
  const before = session.state;
  const result = step(world, before, vocab, outcome);

  if (!result.consumesTurn) {
    return { session: { ...session, state: result.state }, events: result.events, class: result.class };
  }

  const undoRing = pushRing(session.undoRing, before);
  const { history, historyTruncated } = appendHistory(
    session.history,
    { turn: result.state.turn, input: commandRaw(outcome) },
    session.historyTruncated,
  );
  const next: SessionState = { state: result.state, undoRing, history, historyTruncated };

  opts.store.put('auto', serializeSave(toSaveFile(next, 'auto', opts)));
  const preTurn: SessionState = { ...next, state: before, history: session.history, historyTruncated: session.historyTruncated };
  opts.store.put('undo', serializeSave(toSaveFile(preTurn, 'undo', opts)));

  if (result.events.some((e) => e.type === 'checkpoint')) {
    opts.store.put('checkpoint', serializeSave(toSaveFile(next, 'checkpoint', opts)));
  }

  return { session: next, events: result.events, class: result.class };
}

function pushRing(ring: readonly GameState[], state: GameState): GameState[] {
  const next = [...ring, state];
  return next.length > UNDO_RING_SIZE ? next.slice(next.length - UNDO_RING_SIZE) : next;
}

/**
 * `history`'s `input` for this turn. Only ever called once `step()` has
 * already reported `consumesTurn: true`, which (per `turn.ts`'s own
 * decision) only ever happens for `outcome.kind === 'actions'` — every
 * sub-action `ALL`/`AND` expanded shares the one raw line the player typed
 * (`parser/multi.ts` stamps the same `raw` on each), so the first is as
 * good as any of them.
 */
function commandRaw(outcome: InterpretOutcome): string {
  if (outcome.kind === 'actions') return outcome.actions[0]?.raw ?? '';
  throw new Error(`session: commandRaw called on a non-consuming outcome kind "${outcome.kind}"`);
}

export interface RespondToPromptResult {
  session: SessionState;
  events: GameEvent[];
}

/**
 * The prompt round-trip's other half (§5.7; see `effects.ts`'s `openPrompt`
 * doc comment, which defers "the real mechanism" to this task, and
 * `tests/fixtures/world.ts`'s `TERMINAL`/`PROMPT_RESPOND_SCRIPT` for the
 * worked example). A submitted prompt never goes through the ordinary
 * verb/grammar path — the caller already knows which prompt is open (it
 * just rendered one) and which registered script owns validating it;
 * `respondToPrompt` only dispatches `values` to that script.
 *
 * Deliberately outside `takeTurn`: answering a modal prompt is not a world
 * turn — no clock advance, no profile tally, no undo-ring entry, no
 * `history` record — mirroring the MVP's own separate, non-turn-consuming
 * prompt phase (`src/engine/step.ts`'s `prompt()`).
 */
export function respondToPrompt(world: WorldDef, session: SessionState, scriptId: ScriptId, values: Record<string, string>): RespondToPromptResult {
  const result = apply(world, session.state, [{ script: { id: scriptId, args: values } }]);
  return { session: { ...session, state: result.state }, events: result.events };
}
