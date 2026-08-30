// A file-backed `SaveStore` adapter (spec §0 layering rule 4: shells own
// the storage adapter; `src/session/` stays pure and never touches
// `node:fs` itself — this is exactly why the interface exists). One JSON
// file per slot, named `<slot>.json`, inside `dir` (created lazily on the
// first `put()`). This is the on-disk twin of `src/session/store.ts`'s
// in-memory `MemoryStore` — same four methods, same "keys are slot names
// verbatim, never namespaced" contract.

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { SaveStore } from '../session/store';

const EXT = '.json';

export class FileStore implements SaveStore {
  constructor(private readonly dir: string) {}

  get(key: string): string | undefined {
    const path = this.path(key);
    if (!existsSync(path)) return undefined;
    return readFileSync(path, 'utf8');
  }

  put(key: string, value: string): void {
    if (!existsSync(this.dir)) mkdirSync(this.dir, { recursive: true });
    writeFileSync(this.path(key), value, 'utf8');
  }

  list(): string[] {
    if (!existsSync(this.dir)) return [];
    return readdirSync(this.dir)
      .filter((f) => f.endsWith(EXT))
      .map((f) => f.slice(0, -EXT.length));
  }

  delete(key: string): void {
    const path = this.path(key);
    if (existsSync(path)) rmSync(path);
  }

  /** Slot names are single authored/player-chosen words (`repl.ts`'s meta-command grammar never lets one through with a path separator) — this only refuses to let one escape `dir`, never rewrites a valid name, so `list()` returns exactly what `put()` was given. */
  private path(key: string): string {
    if (key === '' || key.includes('/') || key.includes('\\') || key === '.' || key === '..') {
      throw new Error(`FileStore: invalid slot name "${key}"`);
    }
    return join(this.dir, `${key}${EXT}`);
  }
}
