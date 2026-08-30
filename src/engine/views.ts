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

import type { PuzzleId, QuestionId } from './ids';
import { questionStatus } from './cond';
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
