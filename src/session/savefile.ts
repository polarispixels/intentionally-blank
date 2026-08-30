// The save envelope (spec §5.1, ADR 0009): `SaveFile` verbatim, plus the
// history ceiling (§5.1's "past 20,000 entries the session drops the
// oldest and sets `historyTruncated`. Builders implement the ceiling; they
// do not invent a smaller cap") and (de)serialization. `saveVersion` is
// pinned to `1` here — this is the save lineage ADR 0009 says "starts at
// `saveVersion: 1`"; a real migration chain (`saveVersion` bumping on a
// shape change, `renames`, the fixture-save chain) is task 19's
// (`src/session/migrate.ts`), not this file's.

import type { GameState } from '../engine/world';

export const SAVE_VERSION = 1 as const;

/** §5.1: "past 20,000 entries the session drops the oldest and sets `historyTruncated`." Not configurable — the spec is explicit that builders don't invent a smaller cap. */
export const HISTORY_CEILING = 20_000;

/** One accepted turn's structured action record (§5.1) — the input that produced `turn`. */
export interface HistoryEntry {
  turn: number;
  input: string;
}

/** The save envelope (§5.1, ADR 0009) — the durability contract's own shape. */
export interface SaveFile {
  saveVersion: 1;
  gameVersion: string;
  slot: string;
  label?: string;
  savedAt?: string;
  state: GameState;
  history: HistoryEntry[];
  historyTruncated?: true;
}

/**
 * Appends one entry to `history`, enforcing the §5.1 ceiling: past
 * `HISTORY_CEILING` entries, the oldest is dropped and `historyTruncated`
 * becomes (and stays) `true`. `wasTruncated` threads a save's existing
 * flag forward — once true, a save never becomes untruncated again, since
 * the replay invariant it flags stays void regardless of how much more
 * play happens afterward (§5.2).
 */
export function appendHistory(
  history: readonly HistoryEntry[],
  entry: HistoryEntry,
  wasTruncated: boolean,
): { history: HistoryEntry[]; historyTruncated: boolean } {
  const next = [...history, entry];
  if (next.length > HISTORY_CEILING) {
    return { history: next.slice(next.length - HISTORY_CEILING), historyTruncated: true };
  }
  return { history: next, historyTruncated: wasTruncated };
}

/** Plain `JSON.stringify` — a `SaveFile` is already JSON-shaped data (§5.3: "browser-local, JSON strings"). */
export function serializeSave(save: SaveFile): string {
  return JSON.stringify(save);
}

/**
 * Plain `JSON.parse` plus a `saveVersion` sanity check. Not a migration —
 * task 19's `migrate.ts` owns the real `saveVersion` chain (§5.2 point 2);
 * this only refuses to silently treat a differently-shaped blob as today's
 * `SaveFile`, the same "throw on a content/data bug" convention the rest
 * of the engine uses (e.g. `respond.ts`'s `family()`).
 */
export function deserializeSave(json: string): SaveFile {
  const parsed = JSON.parse(json) as SaveFile;
  if (parsed.saveVersion !== SAVE_VERSION) {
    throw new Error(`deserializeSave: unsupported saveVersion ${String(parsed.saveVersion)} (migration is task 19's, not this module's)`);
  }
  return parsed;
}
