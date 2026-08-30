// Read-only views over `GameState` (spec §6, §8 task 17). This file is
// still a growing slice: task 16 (this task) owns only the hints part
// (§6.5, spec 04 §15) — `HINT`'s listing and `HINT <n>`'s ladder reveal.
// Task 17 owns the rest (map/notebook/questions/memories) and adds it
// alongside this section, never touching it.
//
// HINTS APPEAR ONLY ON EXPLICIT REQUEST (constitution §21: "the player
// controls how much of the solution they reveal"). Nothing in this module
// — or anywhere else in the engine — surfaces a hint ambiently; both
// functions below are read-only queries / an explicit-only mutation, never
// wired into `tick()`'s per-turn pipeline.
//
// LADDER SHAPE (§6.5, spec 04 §15): "nudge → clue identification →
// mechanic reminder → near-solution → explicit". `PuzzleDef.hints` is that
// ladder as an ordered `string[]` (index 0 = level 1, the nudge); how many
// levels a puzzle actually declares is a content decision, not an engine
// one. `state.hintsUsed[puzzleId]` (already part of §1.2's `GameState`,
// wired through save/load since task 6) is the count of levels already
// revealed — `revealHint` increments it by exactly one per call, capping at
// the ladder's own length rather than throwing once exhausted, since
// repeating `HINT <n>` after reaching the explicit solution is a
// reasonable thing for a stuck player to do and shouldn't error.
//
// HINT TEXT IS AUTHORED PROSE (hard rule 5) — this module never writes or
// paraphrases it; `PuzzleDef.hints` entries are rendered verbatim, exactly
// as `MemoryDef.lines`/`ClueDef.title` are elsewhere in this engine.
//
// SCOPE OF "HINT <n>" (a deliberate boundary, not an oversight): the spec's
// `HINT <n>` reveals "the next level for that puzzle" — `<n>` selects which
// *listed* open question/puzzle the player means, not a hint level number.
// Mapping that display-index back to a `PuzzleId` is parser/session
// territory (which listing was shown, in which order) that doesn't exist
// yet (task 18+); this module exposes `availableHints` (the list) and
// `revealHint` (keyed directly by `PuzzleId`) as the two primitives a
// later session/CLI layer composes, rather than guessing at the missing
// wiring here.

import type { ClueId, MemoryId, PuzzleId, QuestionId, RoomId } from './ids';
import { evaluate, questionStatus } from './cond';
import type { GameEvent, GameState, WorldDef } from './world';

/** One open question with an available hint ladder — `HINT`'s listing. */
export interface HintListEntry {
  puzzle: PuzzleId;
  question: QuestionId;
  questionText: string;
  /** Hint levels already revealed (`state.hintsUsed[puzzle] ?? 0`). */
  used: number;
  /** Total levels this puzzle's ladder declares (`PuzzleDef.hints.length`). */
  total: number;
}

/**
 * `HINT` (no argument): every puzzle that (a) declares a `question` anchor,
 * (b) has a non-empty `hints` ladder, and (c) whose anchor question is
 * currently `'open'` — an unopened question has nothing to hint about yet,
 * and an answered one no longer needs hinting (§6.5: "lists open
 * questions that have an associated puzzle with an available ladder").
 * Declaration order of `world.puzzles`, like every other listing in this
 * codebase.
 */
export function availableHints(world: WorldDef, state: GameState): HintListEntry[] {
  const entries: HintListEntry[] = [];
  for (const [id, def] of Object.entries(world.puzzles ?? {})) {
    const question = def!.question;
    if (question === undefined) continue;
    if (def!.hints.length === 0) continue;
    if (questionStatus(world, state, question) !== 'open') continue;

    entries.push({
      puzzle: id as PuzzleId,
      question,
      questionText: world.questions?.[question]?.text ?? '',
      used: state.hintsUsed[id as PuzzleId] ?? 0,
      total: def!.hints.length,
    });
  }
  return entries;
}

export interface HintResult {
  state: GameState;
  events: GameEvent[];
}

/**
 * `HINT <n>` (once `<n>` has been resolved to a `PuzzleId` — see file
 * header): reveals the next ladder level for `puzzleId` and increments
 * `state.hintsUsed[puzzleId]` (saved, per §6.5). Capped at the ladder's own
 * length — calling again once every level is already revealed re-renders
 * the last (most explicit) level without incrementing further, rather than
 * throwing or silently doing nothing.
 */
export function revealHint(world: WorldDef, state: GameState, puzzleId: PuzzleId): HintResult {
  const def = world.puzzles?.[puzzleId];
  if (def === undefined) {
    throw new Error(`views: revealHint puzzle "${puzzleId}" is not declared in world.puzzles`);
  }
  if (def.hints.length === 0) {
    throw new Error(`views: revealHint puzzle "${puzzleId}" declares no hints`);
  }

  const used = state.hintsUsed[puzzleId] ?? 0;
  const atCeiling = used >= def.hints.length;
  const level = atCeiling ? def.hints.length : used + 1;
  const text = def.hints[level - 1]!;

  const nextState = atCeiling ? state : { ...state, hintsUsed: { ...state.hintsUsed, [puzzleId]: level } };
  return { state: nextState, events: [{ type: 'line', kind: 'system', text }] };
}

// ---------------------------------------------------------------------------
// Task 17 — the rest of this module: map, questions, notebook, memories
// (§6.1-§6.4, spec 05 §14). Same governing rule as the hints section above,
// restated from constitution §20/§25: these are memory assistance, never
// quest markers. Each function below exposes only what `state` already
// records the player having reached — a room not yet in `state.visited`, a
// question never opened in `state.questions`, a clue not yet in
// `state.clues`, a memory not yet in `state.memories` — is structurally
// absent from its view's output, not merely hidden by a flag a shell could
// get wrong. None of the four takes any formatting decision that belongs to
// a shell (no ASCII art, no "????" glyph, no total-count arithmetic beyond
// what an array's own length already implies) — each returns plain
// structured data for a shell (or a headless CLI `MAP`/`QUESTIONS`/
// `NOTEBOOK`/`MEMORIES` command) to render however it likes.
// ---------------------------------------------------------------------------

/** A visited room, at its authored map position (§2.4/§6.1). */
export interface MapRoomNode {
  room: RoomId;
  name: string;
  area: string;
  x: number;
  y: number;
  z?: number;
  /** True for `state.location` — the map's "you are here" marker. */
  current: boolean;
}

/**
 * An exit's destination: either a room the player has already visited (its
 * id is exposed — the player has been there, so the id is no longer a
 * secret), or `known: false`, an opaque stub with **no identity at all**.
 * Two different unvisited destinations both render as an identical
 * `{ known: false }` — deliberately: showing that two stubs share (or
 * don't share) a real target room would itself be a spoiler the player
 * hasn't earned (see `mapView`'s doc comment).
 */
export type MapEdgeTarget = { known: true; room: RoomId } | { known: false };

/** One connection out of a visited room — real or a `????`-shaped stub, per `mapView`. */
export interface MapEdge {
  from: RoomId;
  to: MapEdgeTarget;
}

export interface MapViewResult {
  /** Visited rooms only, in `world.rooms` declaration order. */
  rooms: MapRoomNode[];
  /** Every currently-known exit out of a visited room, in room-then-exit declaration order. */
  edges: MapEdge[];
}

/**
 * `MAP` (§6.1). "Visited rooms only, at their authored `map` coordinates,
 * grouped by `area`... connected by exits the player has used or seen."
 *
 * SEEN VS. USED: the engine has no separate "this exit was seen/attempted"
 * bit — `state.visited` records only rooms, not exits — and adding one
 * would be new state (§1.1: "nothing derivable is ever a field") for
 * something that already follows from what's on the page. Standing in a
 * visited room, its currently-existing exits (`exit.when`, if declared,
 * holding — the same "exists/visible only when true" gate §2.4 defines;
 * NOT the exit's `door` lock, which is passability, not existence) are
 * structurally known: the worked opening room's own description says "The
 * door is south" the moment you're in it, no separate exploration action
 * required. So "used" and "seen" collapse to the same derived check here:
 * every currently-existing exit of a *visited* room is an edge. A locked
 * door's exit still renders — you know the door and roughly where it goes,
 * you just haven't been through it (constitution's own `????` example).
 * An exit whose `when` doesn't currently hold isn't rendered at all yet —
 * consistent with every other `Cond`-gated read in this engine, re-derived
 * fresh on every call, so a door that becomes visible later simply appears
 * next time `mapView` runs.
 *
 * The destination of an edge is `{ known: true, room }` once that room is
 * itself visited, else the opaque `{ known: false }` stub described on
 * `MapEdgeTarget` — never the target's name, area, or coordinates. That
 * last point is a deliberate reading of "no unvisited names, no objective
 * pins" (§6.1): an unvisited room's authored coordinates are as much a
 * spoiler as its name (they'd tell the player the shape of an area they
 * haven't reached), so a stub carries no positional data for a shell to
 * render — only that a connection exists from a room the player has
 * reached.
 */
export function mapView(world: WorldDef, state: GameState): MapViewResult {
  const roomIds = Object.keys(world.rooms ?? {}) as RoomId[];
  const visitedIds = roomIds.filter((id) => state.visited[id] !== undefined);

  const rooms: MapRoomNode[] = visitedIds.map((id) => {
    const def = world.rooms![id]!;
    return {
      room: id,
      name: def.name ?? id,
      area: def.area ?? '',
      x: def.map?.x ?? 0,
      y: def.map?.y ?? 0,
      ...(def.map?.z !== undefined ? { z: def.map.z } : {}),
      current: id === state.location,
    };
  });

  const edges: MapEdge[] = [];
  for (const id of visitedIds) {
    for (const exit of world.rooms![id]!.exits ?? []) {
      if (exit.when !== undefined && !evaluate(world, state, exit.when)) continue;
      const to: MapEdgeTarget = state.visited[exit.to] !== undefined ? { known: true, room: exit.to } : { known: false };
      edges.push({ from: id, to });
    }
  }

  return { rooms, edges };
}

/** One open question — still on the player's mind (§6.2). */
export interface OpenQuestionEntry {
  id: QuestionId;
  text: string;
}

/** One settled question — moved off the open list once answered (§6.2). */
export interface SettledQuestionEntry {
  id: QuestionId;
  text: string;
  /** Authored recap (`QuestionDef.answer`); empty string if content hasn't authored one yet. */
  answer: string;
}

export interface QuestionsViewResult {
  open: OpenQuestionEntry[];
  settled: SettledQuestionEntry[];
}

/**
 * `QUESTIONS` (§6.2). "Open questions in the order opened; answered ones
 * move to a collapsed 'settled' list with the answer as authored recap."
 *
 * ORDER: iterates `Object.keys(state.questions)`, not `world.questions`'
 * declaration order. `state.questions` is written only by `effects.ts`'s
 * `openQuestion`/`answerQuestion` arm as `{ ...state.questions, [id]:
 * status }` (never deleted-and-reinserted), so a key's position in that
 * object is fixed the first time the question is touched — exactly "the
 * order opened" §6.2 asks for, including for a question answered without
 * ever passing through an explicit 'open' state (still ordered by when it
 * first appeared). This is the same "derive from insertion-order state,
 * never a parallel counter" convention `state.clues`/`state.memories` (plain
 * arrays) use for their own view-facing order.
 *
 * A question is phrased as a question, never an imperative — `validate.ts`'s
 * `checkQuestionPhrasing` (§6.2, task 7) enforces that at authoring time;
 * this function trusts it and renders `text` verbatim.
 *
 * SPOILER BOUNDARY: a question `world.questions` declares but that has
 * never opened (`state.questions[id]` is absent — the sparse-overlay
 * default is `'unopened'`, per `cond.ts`'s `questionStatus`) is simply
 * never visited by this loop; it appears in neither list.
 */
export function questionsView(world: WorldDef, state: GameState): QuestionsViewResult {
  const open: OpenQuestionEntry[] = [];
  const settled: SettledQuestionEntry[] = [];

  for (const id of Object.keys(state.questions) as QuestionId[]) {
    const status = state.questions[id];
    const def = world.questions?.[id];
    if (def === undefined) continue; // authoring bug — validate.ts's unknown-question-ref rule catches this
    if (status === 'open') {
      open.push({ id, text: def.text });
    } else if (status === 'answered') {
      settled.push({ id, text: def.text, answer: def.answer ?? '' });
    }
  }

  return { open, settled };
}

/** One discovered clue, linked to the open questions it bears on (§6.3). */
export interface NotebookEntry {
  id: ClueId;
  title: string;
  /** Recap of the clue's own discovery scene — see this function's doc comment. */
  detail: string;
  questions: QuestionId[];
}

/**
 * `NOTEBOOK` (§6.3). "Discovered clues (title + detail recap), each linked
 * to the questions it bears on." Order is `state.clues` — discovery order,
 * already an ordered array (unlike `state.questions`'s sparse status map),
 * so no insertion-order trick is needed here.
 *
 * AUTHORING RULE, NOT A MECHANICAL ONE (flagged here per §8 task 17's own
 * instruction, "note it where an author will see it"): `ClueDef.detail`
 * must recap only what the clue's own discovery scene actually showed the
 * player — it may never smuggle in information from a *different* scene,
 * even one the player has also reached. Nothing in this engine can check
 * that (a clue's `detail` and the prose of whatever handler granted it are
 * two unrelated strings); it is a review-time discipline for
 * `narrative-writer` and the main session, the same way plotCritical
 * placement is enforced by two layers of code but "this detail doesn't
 * spoil scene B" cannot be.
 *
 * SPOILER BOUNDARY: a clue declared in `world.clues` but absent from
 * `state.clues` (never discovered) is never visited by this map — it does
 * not appear.
 */
export function notebookView(world: WorldDef, state: GameState): NotebookEntry[] {
  return state.clues.map((id) => {
    const def = world.clues?.[id];
    if (def === undefined) {
      throw new Error(`views: notebookView clue "${id}" is not declared in world.clues`);
    }
    return { id, title: def.title, detail: def.detail, questions: def.questions ?? [] };
  });
}

/** One recovered memory fragment, re-readable in full (§6.4). */
export interface MemoryEntry {
  id: MemoryId;
  title: string;
  lines: string[];
}

/**
 * `MEMORIES` (§6.4). "Recovered fragments by title, re-readable in full."
 * Order is `state.memories` — recovery order, already an ordered array, so
 * (like `notebookView`) no insertion-order trick is needed.
 *
 * NO TOTAL COUNT: the return type is a plain array of exactly the recovered
 * fragments — nothing alongside it names how many memories `world.memories`
 * declares in total. "7 of 24 memories" would turn recovered memory into a
 * completion meter (§6.4's own explicit instruction: "the internal mystery
 * is not a collectible"); a consumer reading `.length` off the result only
 * ever learns how many the player *has*, never how many exist to find,
 * which is exactly the boundary this function is required to hold.
 *
 * SPOILER BOUNDARY: a memory declared in `world.memories` but absent from
 * `state.memories` (never recovered — whether it has no `trigger` at all,
 * or one that hasn't held yet) is never visited by this map — it does not
 * appear, and neither its title nor its existence leaks through this view.
 */
export function memoriesView(world: WorldDef, state: GameState): MemoryEntry[] {
  return state.memories.map((id) => {
    const def = world.memories?.[id];
    if (def === undefined) {
      throw new Error(`views: memoriesView memory "${id}" is not declared in world.memories`);
    }
    return { id, title: def.title, lines: def.lines };
  });
}
