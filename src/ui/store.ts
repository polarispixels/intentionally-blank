// The browser `SaveStore` adapter (spec §0 layering rule 4 — see
// `src/cli/store.ts`'s `FileStore`, this file's file-backed twin; the
// interface itself lives in `src/session/store.ts` and stays untouched by
// browser concerns). One `localStorage` key per slot, namespaced so this
// game's saves never collide with anything else living in the same origin's
// storage.

import type { SaveStore } from '../session/store';

const PREFIX = 'ib:save:';

export class LocalStorageStore implements SaveStore {
  get(key: string): string | undefined {
    return localStorage.getItem(PREFIX + key) ?? undefined;
  }

  put(key: string, value: string): void {
    localStorage.setItem(PREFIX + key, value);
  }

  list(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key !== null && key.startsWith(PREFIX)) keys.push(key.slice(PREFIX.length));
    }
    return keys;
  }

  delete(key: string): void {
    localStorage.removeItem(PREFIX + key);
  }
}
