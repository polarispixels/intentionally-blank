// The `SaveStore` seam (ADR 0010): persistence goes through this interface
// everywhere in `src/session/`, so the pure session layer never touches a
// storage API directly (§0's layering rule 3 — no timers, no storage APIs,
// no DOM). `localStorage`/file adapters are shells' to write (`src/ui/`,
// `src/cli/`) — this module ships only the interface plus `MemoryStore`,
// the in-memory adapter `tests/session.test.ts` and the `playtester` agent
// use to exercise every save/undo/checkpoint behavior headlessly.
//
// Keys are slot names verbatim (`'auto'`, `'undo'`, `'checkpoint'`, or a
// player-chosen name for `SAVE <name>`/`EXPORT`) — `session.ts` never
// namespaces or prefixes them, so a `SaveStore` implementation is free to
// do that itself (a `localStorage` adapter would likely prefix every key
// with a game id) without this module needing to know.

/** Persistence over string blobs — `get`/`put`/`list`/`delete` by slot name (ADR 0010). */
export interface SaveStore {
  get(key: string): string | undefined;
  put(key: string, value: string): void;
  list(): string[];
  delete(key: string): void;
}

/** In-memory `SaveStore` (ADR 0010): what `tests/session.test.ts` and the CLI/tests use in place of `localStorage`. */
export class MemoryStore implements SaveStore {
  private readonly data = new Map<string, string>();

  get(key: string): string | undefined {
    return this.data.get(key);
  }

  put(key: string, value: string): void {
    this.data.set(key, value);
  }

  list(): string[] {
    return [...this.data.keys()];
  }

  delete(key: string): void {
    this.data.delete(key);
  }
}
