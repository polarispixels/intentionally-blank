import type { ScriptId } from '../../engine/ids';
// The whole assembled game — `WORLD = assemble(ACT1_SLICE, ACT2_SLICE,
// ACT3_SLICE)` (ADR 0011 item 3; Stage D plan §0.3/§3 E3).
//
// `assemble` merges every keyed table of a `WorldSlice` (rooms, objects,
// npcs, verbs, flags, clues, memories, questions, puzzles, events,
// responses, scripts) across the slices passed to it, in order, and throws
// if the same id appears twice in the same table — naming both the table
// and the id, so a collision between (say) an Act I and an Act II room
// fails loudly at import time rather than one silently overwriting the
// other. `meta` is not part of `WorldSlice` (a slice like `ACT2_SLICE`
// needn't declare a clock/phase table of its own) — it comes from the
// first slice passed, which for the shipped game is always `ACT1_SLICE`
// (a full `WorldDef`, `meta` included).
//
// This file, `act2/index.ts`, and `act3/index.ts` are the only modules
// that import each act's slice as a *value*; every act's own room/NPC/
// object files stay ignorant of the other acts and of this module,
// avoiding the cycle `act1/world.ts`'s own header describes (see that
// file, and `act1/slice.ts`'s header, for the shape of the cycle a
// less careful split would hit here).

import type { WorldDef } from '../../engine/world';
import { ACT1_SLICE } from './act1/slice';
import { ACT2_SLICE, ACT2_CENSOR_PROMPT_SCRIPTS } from './act2/index';
import { ACT3_SLICE, ACT3_HUB_PROMPT_SCRIPTS } from './act3/index';
import { ACT4_SLICE, ACT4_PROMPT_SCRIPTS } from './act4/index';
import { ACT5_SLICE, ACT5_PROMPT_SCRIPTS } from './act5/index';

/**
 * A `WorldSlice` is every keyed table of `WorldDef` an act can contribute,
 * minus `meta` (Stage D plan §0.3's own definition, verbatim). `game.ts`
 * spreads these across every slice it's given; `tests/world-game.test.ts`
 * asserts no key is declared twice in the same table.
 */
export type WorldSlice = Pick<
  WorldDef,
  | 'rooms'
  | 'objects'
  | 'npcs'
  | 'verbs'
  | 'flags'
  | 'clues'
  | 'memories'
  | 'questions'
  | 'puzzles'
  | 'events'
  | 'responses'
  | 'scripts'
>;

const KEYED_TABLES = [
  'rooms',
  'objects',
  'npcs',
  'verbs',
  'flags',
  'clues',
  'memories',
  'questions',
  'puzzles',
  'events',
  'responses',
  'scripts',
] as const satisfies readonly (keyof WorldSlice)[];

function mergeTable<K extends (typeof KEYED_TABLES)[number]>(
  table: K,
  slices: WorldSlice[],
): NonNullable<WorldDef[K]> {
  const merged: Record<string, unknown> = {};
  for (const slice of slices) {
    const source = slice[table] as Record<string, unknown> | undefined;
    if (source === undefined) continue;
    for (const id of Object.keys(source)) {
      if (Object.prototype.hasOwnProperty.call(merged, id)) {
        throw new Error(`assemble: duplicate id "${id}" in table "${table}"`);
      }
      merged[id] = source[id];
    }
  }
  return merged as NonNullable<WorldDef[K]>;
}

/**
 * Merges any number of `WorldSlice`s into one `WorldDef`, throwing on a
 * duplicate id in any keyed table (naming the table and the id). `meta`
 * comes from the first slice — it must be a full `WorldDef` (or otherwise
 * declare `meta`); an empty/partial slice like `ACT2_SLICE`/`ACT3_SLICE`
 * may safely go second or third.
 */
export function assemble(...slices: WorldSlice[]): WorldDef {
  const meta = (slices[0] as Partial<WorldDef> | undefined)?.meta;
  if (!meta) {
    throw new Error('assemble: the first slice must declare meta');
  }
  return {
    meta,
    rooms: mergeTable('rooms', slices),
    objects: mergeTable('objects', slices),
    npcs: mergeTable('npcs', slices),
    verbs: mergeTable('verbs', slices),
    flags: mergeTable('flags', slices),
    clues: mergeTable('clues', slices),
    memories: mergeTable('memories', slices),
    questions: mergeTable('questions', slices),
    puzzles: mergeTable('puzzles', slices),
    events: mergeTable('events', slices),
    responses: mergeTable('responses', slices),
    scripts: mergeTable('scripts', slices),
  };
}

export const WORLD: WorldDef = assemble(ACT1_SLICE, ACT2_SLICE, ACT3_SLICE, ACT4_SLICE, ACT5_SLICE);

/**
 * The shipped game's prompt → script table (v0.12.0). A prompt id emitted by
 * content (the letter's `act2_compose_letter`) maps to the script that closes
 * it; the CLI and the shell merge this over the session layer's own RESTART
 * prompts. Each act's slice exports its own entries; they are merged here.
 *
 * Stage E, E-5 (plan §3.5, "three logins, three ids"): the opening
 * terminal's login, the Hub's login, and the antechamber's login (E0–E3;
 * the Hub's is shipped) share the same credentials and NOTHING else — not
 * this prompt id, not the success text, not the flag. A plain object spread
 * (unlike `assemble`'s `mergeTable`, above) never throws on a repeated key,
 * so a shared prompt id here would silently route one station's LOG IN to
 * another's respond script — `tests/world-prompt-ids.test.ts` is the guard.
 * E0–E3 add `ACT4_PROMPT_SCRIPTS`/`ACT5_PROMPT_SCRIPTS` to this spread in
 * the same change they add rooms.
 */
export const PROMPT_SCRIPTS: Record<string, ScriptId> = { ...ACT2_CENSOR_PROMPT_SCRIPTS, ...ACT3_HUB_PROMPT_SCRIPTS, ...ACT4_PROMPT_SCRIPTS, ...ACT5_PROMPT_SCRIPTS };
