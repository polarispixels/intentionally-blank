// The session layer (spec §5.3-§5.7, ADR 0010): orchestrates the shipped
// v2 engine (`turn.ts`'s `step`) with save/undo/autosave/checkpoints,
// entirely as pure functions over a `SessionState` value — no class, no
// hidden mutable field, matching the rest of the engine's style. Every
// function that needs a wall-clock timestamp takes one as a `now: string`
// parameter (ISO, caller-supplied) rather than reading a clock itself
// (ADR 0010: "the session never reads a clock"), and every function that
// persists takes a `SaveStore` rather than assuming `localStorage`.

import { apply } from '../engine/effects';
import { S } from '../engine/ids';
import type { ActionClass, ScriptId } from '../engine/ids';
import type { InterpretOutcome } from '../engine/interpreter';
import { look, LOOK_VERB_ID, renderArrival } from '../engine/move';
import type { CompiledVocabulary } from '../engine/parser';
import { step } from '../engine/turn';
import { initialState } from '../engine/world';
import type { GameEvent, GameState, WorldDef } from '../engine/world';
import type { SaveStore } from './store';
import type { HistoryEntry, SaveFile } from './savefile';
import { SAVE_VERSION, appendHistory, serializeSave } from './savefile';
import { migrateSaveFile } from './migrate';

/** §5.5: "an in-memory ring of the last 15 pre-action states." */
export const UNDO_RING_SIZE = 15;

/**
 * Slots `takeTurn`/`Session` itself writes — never surfaced by `listSaves`
 * (§5.3's `SAVES` lists the player's own named saves, not bookkeeping
 * slots). `'ending'` (ADR 0012 item 3, Stage E `E-1`) is the recursive
 * hand-off's own reserved slot — the ended state, written immediately
 * before the hand-off, resumable by `LOAD ending` (an ordinary `load()`
 * call; no engine change needed for that half) but never listed.
 */
const RESERVED_SLOTS: readonly string[] = ['auto', 'undo', 'checkpoint', 'ending'];

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

/** A fresh playthrough's `createSession`, plus its opening arrival's events. */
export interface NewSessionResult {
  session: SessionState;
  events: GameEvent[];
}

/**
 * A fresh playthrough whose opening arrival has already been rendered —
 * the bug this function exists to fix (see its own commit/PR for the full
 * account): `createSession` alone hands back `initialState`'s state with
 * nothing ever narrated (`gamestate.ts`'s own doc comment explains why —
 * `visited[startRoom]` is seeded directly so `GO TO`/the map view work
 * from turn zero — but that seeding is also exactly what makes
 * `move.ts`'s `renderArrival` treat the start room as already visited and
 * skip it). `startSession` reruns `initialState`'s state through
 * `renderArrival` — a genuine arrival, `firstVisit` included, `visited`
 * marked, `onEnter` run, all of it — by momentarily un-seeding
 * `visited[startRoom]` first; `renderArrival` reseeds it to the exact same
 * value (`state.turn`, still `0`) itself, so the returned session's state
 * matches `createSession`'s except for whatever `firstVisit`/`onEnter`
 * actually changed. `state.turn`/`clock`/`profile` are untouched —
 * `renderArrival` never touches them; arriving where the game already
 * begins is not a turn.
 *
 * A companion to `createSession`, not a change to its return shape: this
 * file's own tests, `migrate.ts`'s `replay()`, and every other existing
 * caller want the bare `SessionState` `createSession` already returns and
 * have no interest in an opening render (`replay` in particular must not
 * observe events invisible to `history`). Shells call `startSession`
 * instead, exactly once per new game — on mount / process start, and again
 * on `RESTART` (a new game, unlike `LOAD`/`UNDO`/`RESTART ENCOUNTER`,
 * which resume one already begun and must not re-render the opening).
 */
export function startSession(world: WorldDef): NewSessionResult {
  const seeded = initialState(world);
  const unarrived: GameState = { ...seeded, visited: {} };
  const { state, events } = renderArrival(world, unarrived);
  return { session: { state, undoRing: [], history: [], historyTruncated: false }, events };
}

export interface ResumeSessionResult {
  session: SessionState;
  events: GameEvent[];
}

/**
 * `slot` restored (typically `'auto'` — a browser reload's autosave; a
 * spawned CLI process has no equivalent today) with the current room
 * re-described as a plain `LOOK` — the fix for the blank-screen-on-reload
 * defect (top of the 0.3.1 backlog): Ryan's own proposal was "at the very
 * least it should say something like: you are in a strange room," the same
 * thing the classics print after a `RESTORE`, and it needs no new
 * persistence layer.
 *
 * Deliberately `move.ts`'s `look()`, not `renderArrival`: a resumed session
 * is not an arrival. `firstVisit` fires once, ever, on genuine first entry,
 * and re-entering the room this way must run neither it nor `onEnter`, and
 * must not advance the clock — arriving nowhere is not a turn, and this
 * isn't even an arrival. `undefined` when there is nothing at `slot` to
 * resume (mirrors `load`); a caller with nothing to resume falls back to
 * `startSession` instead (a fresh playthrough's opening arrival is a real
 * one).
 */
export function resumeSession(world: WorldDef, store: SaveStore, slot = 'auto'): ResumeSessionResult | undefined {
  const session = load(store, slot);
  if (session === undefined) return undefined;
  const { state, events } = look(world, session.state, LOOK_VERB_ID);
  return { session: { ...session, state }, events };
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

/**
 * ADR 0012 item 1: true iff `events` carries the one `{ type: 'ended' }`
 * whose `endingId` matches `world.meta.recursiveEnding` — a world that
 * never declares one (every world before Act V) never hands off.
 */
function isRecursiveEnding(world: WorldDef, events: readonly GameEvent[]): boolean {
  const id = world.meta.recursiveEnding;
  return id !== undefined && events.some((e) => e.type === 'ended' && e.endingId === id);
}

/**
 * ADR 0012 items 2-5, Stage E `E-1`: the recursive ending's hand-off,
 * shared by `takeTurn` and `respondToPrompt` (the only two places an
 * `{ end }` effect can ever fire from). `endedSession` is the session
 * exactly as it stood the instant the ending effect applied — `phase:
 * 'ended'`, `state.ending` set — the state this function writes to slot
 * `'ending'` before discarding it. `events` is that same turn's/prompt's
 * own event list; the caller gets back the ending's own events (everything
 * but the bare `{ type: 'ended' }` marker itself — a shell has no use for
 * it once the fresh game's opening follows immediately) with the fresh
 * game's opening arrival appended, **in one list** — no `restarted` event,
 * so neither shell's transcript is cleared (that event exists precisely to
 * clear one, which the hand-off must not do).
 *
 * `opts` is optional (`respondToPrompt`'s fixtures/tests call it with
 * none): without it the hand-off still happens in memory — a fresh session
 * comes back either way — but nothing is written to any store, matching
 * every other persisting call in this file that takes `PersistOptions`.
 *
 * The replay invariant (`migrate.ts`'s `replay()`) is per cycle, not
 * global (ADR 0012 item 5, register 99): `startSession` always begins a
 * new, empty `history`, so nothing about *this* playthrough's history ever
 * threads into the next one.
 */
function handOff(world: WorldDef, endedSession: SessionState, events: readonly GameEvent[], opts?: PersistOptions): { session: SessionState; events: GameEvent[] } {
  if (opts !== undefined) {
    opts.store.put('ending', serializeSave(toSaveFile(endedSession, 'ending', opts)));
    opts.store.remove('undo');
    opts.store.remove('checkpoint');
  }
  const fresh = startSession(world);
  if (opts !== undefined) {
    opts.store.put('auto', serializeSave(toSaveFile(fresh.session, 'auto', opts)));
  }
  return { session: fresh.session, events: [...events.filter((e) => e.type !== 'ended'), ...fresh.events] };
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
  /** Set only when this turn triggered the recursive-ending hand-off (ADR 0012) — `session`/`events` are already the fresh game's; neither shell needs to branch on this to render correctly. */
  handedOff?: true;
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
 *
 * Unless the turn's own events include the world's declared recursive
 * ending (ADR 0012 items 1-5, Stage E `E-1`) — in which case none of the
 * above autosave/undo/checkpoint bookkeeping happens at all: `handOff`
 * replaces it, writing `'ending'`, removing `'undo'`/`'checkpoint'`, and
 * starting the next game into `'auto'` instead.
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

  if (isRecursiveEnding(world, result.events)) {
    const handed = handOff(world, next, result.events, opts);
    return { session: handed.session, events: handed.events, class: result.class, handedOff: true };
  }

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
  /** Set only when this prompt answer triggered the recursive-ending hand-off (ADR 0012) — `session`/`events` are already the fresh game's; neither shell needs to branch on this to render correctly. */
  handedOff?: true;
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
 *
 * `opts` is optional (ADR 0012 item 2, Stage E `E-1`) — supplied by both
 * shells so a prompt-closing script that fires the world's declared
 * recursive ending (P28's form, R13's screen, and every other script-built
 * `{ end }` are content-side, per `effects.ts`'s own `openPrompt` doc
 * comment) hands off exactly like `takeTurn` does; omitted, the round trip
 * still resolves in memory (a fresh session comes back on a recursive
 * ending either way) but nothing is written to any store — what every
 * fixture/test that doesn't care about persistence already expects.
 */
export function respondToPrompt(world: WorldDef, session: SessionState, scriptId: ScriptId, values: Record<string, string>, opts?: PersistOptions): RespondToPromptResult {
  const result = apply(world, session.state, [{ script: { id: scriptId, args: values } }]);
  const next: SessionState = { ...session, state: result.state };
  if (isRecursiveEnding(world, result.events)) {
    const handed = handOff(world, next, result.events, opts);
    return { session: handed.session, events: handed.events, handedOff: true };
  }
  return { session: next, events: result.events };
}

// ---------------------------------------------------------------------------
// RESTART/RESET confirmation (response-families doc "Later additions" §10,
// Ryan's v0.3.2 playtest: "Reset and Restart don't work as I would expect
// them to" — constitution §9/§11 forbid a typo costing a whole playthrough,
// so the typed command must ask first).
//
// The doc authors `restart.confirm`/`restart.declined`'s wording but
// deliberately leaves "the yes/no mechanism the confirmation uses" as a
// wiring decision. This is that decision: a prompt/script round trip like
// any other (§5.7), built from `src/content/scripts.ts`'s two `ScriptFn`s
// registered under the ids below. The ids live here, not in content,
// because `requestRestart` (below) needs to check whether a world has
// wired them *before* asking — and this file must stay content-free (the
// purity rule) — so `scripts.ts` imports these three back rather than the
// reverse.
// ---------------------------------------------------------------------------

export const RESTART_CONFIRM_PROMPT_ID = 'restart_confirm';
export const RESTART_CONFIRM_OPEN_SCRIPT = S('restart_confirm_open');
export const RESTART_CONFIRM_RESPOND_SCRIPT = S('restart_confirm_respond');

/** A `PROMPT_SCRIPTS`-shaped table (`repl.ts`'s own convention) a shell merges into whichever one it already builds, so the confirm prompt's answer reaches `RESTART_CONFIRM_RESPOND_SCRIPT` through the ordinary prompt round trip. */
export const RESTART_PROMPT_SCRIPTS: Record<string, ScriptId> = { [RESTART_CONFIRM_PROMPT_ID]: RESTART_CONFIRM_RESPOND_SCRIPT };

/**
 * `RESTART`/`RESET` typed. Opens the confirm prompt when the active world
 * has wired it (`world.scripts[RESTART_CONFIRM_OPEN_SCRIPT]` — act1's
 * `world.ts` does); a world that hasn't (every test fixture today) gets the
 * pre-confirmation behavior, an immediate `startSession`, rather than a
 * thrown "script not registered" error.
 *
 * The confirmed answer is detected by the caller, not here: the respond
 * script signals it by emitting a bare `{ type: 'restarted' }` event
 * (nothing else does), which a shell's prompt-answering code checks for
 * *before* rendering — see `repl.ts`'s `feed()` and `controller.ts`'s
 * `submitPrompt`, both of which discard the round trip's own state and
 * call `startSession` fresh on seeing it, exactly like the death-menu
 * RESTART button already does. Deliberately not handled here: this
 * function only ever *opens* the prompt, so it never itself observes that
 * event.
 *
 * The death-menu RESTART *button* deliberately does not call this —
 * `chooseDeathOption`/`repl.ts`'s own death-menu handling call
 * `startSession` directly, per the family-key doc's ruling that a labeled
 * menu choice among three is already a deliberate confirmation.
 */
export function requestRestart(world: WorldDef, session: SessionState): RespondToPromptResult {
  if (world.scripts?.[RESTART_CONFIRM_OPEN_SCRIPT] === undefined) return startSession(world);
  return respondToPrompt(world, session, RESTART_CONFIRM_OPEN_SCRIPT, {});
}
