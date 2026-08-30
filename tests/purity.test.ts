import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/** Patterns that indicate a browser, timer, randomness, or Vue dependency. */
const FORBIDDEN: readonly RegExp[] = [
  /from ['"]vue['"]/,
  /\bwindow\b/,
  /\bdocument\b/,
  /\bsetTimeout\b/,
  /\bsetInterval\b/,
  /\blocalStorage\b/,
  /\bsessionStorage\b/,
  /\bindexedDB\b/,
  /\bMath\.random\b/,
  /\bnew Date\b/,
  /\bDate\.now\b/,
  /\bfetch\(/,
];

/** Strips string/template literals so prose (e.g. room text containing "window") is not flagged. */
const STRING_LITERAL = /'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g;

function listTsFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...listTsFiles(full));
    } else if (entry.endsWith('.ts')) {
      files.push(full);
    }
  }
  return files;
}

function assertPure(dir: string): void {
  const root = join(process.cwd(), dir);
  for (const file of listTsFiles(root)) {
    const stripped = readFileSync(file, 'utf8').replace(STRING_LITERAL, '');
    for (const pattern of FORBIDDEN) {
      expect(pattern.test(stripped), `${file} matches ${pattern}`).toBe(false);
    }
  }
}

describe('purity: src/engine', () => {
  it('has no browser, timer, randomness, or Vue imports', () => {
    assertPure('src/engine');
  });
});

describe('purity: src/content', () => {
  it('has no browser, timer, randomness, or Vue imports', () => {
    assertPure('src/content');
  });
});
