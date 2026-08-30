import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { importedModules, stripNonCode } from './helpers/source-scan';

/**
 * Patterns that indicate a browser, timer, randomness, or clock dependency.
 * Checked against code only — comments and prose are stripped first.
 */
const FORBIDDEN_CODE: readonly RegExp[] = [
  /\bwindow\b/,
  /\bdocument\b/,
  /\bnavigator\b/,
  /\bsetTimeout\b/,
  /\bsetInterval\b/,
  /\brequestAnimationFrame\b/,
  /\blocalStorage\b/,
  /\bsessionStorage\b/,
  /\bindexedDB\b/,
  /\bMath\.random\b/,
  /\bnew Date\b/,
  /\bDate\.now\b/,
  /\bperformance\.now\b/,
  /\bfetch\s*\(/,
];

/** Module specifiers the pure layers may never import (ADR 0003). */
const FORBIDDEN_MODULES: readonly RegExp[] = [
  /^vue(\/|$)/,
  /^@vue\//,
  /^node:/,
  /(^|\/)ui\//,
];

function listTsFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...listTsFiles(full));
    else if (entry.endsWith('.ts')) files.push(full);
  }
  return files;
}

function assertPure(dir: string): void {
  const root = join(process.cwd(), dir);
  const files = listTsFiles(root);
  expect(files.length, `${dir} has no TypeScript files to check`).toBeGreaterThan(0);

  for (const file of files) {
    const source = readFileSync(file, 'utf8');

    for (const specifier of importedModules(source)) {
      for (const pattern of FORBIDDEN_MODULES) {
        expect(pattern.test(specifier), `${file} imports "${specifier}" (${pattern})`).toBe(false);
      }
    }

    const code = stripNonCode(source);
    for (const pattern of FORBIDDEN_CODE) {
      expect(pattern.test(code), `${file} matches ${pattern}`).toBe(false);
    }
  }
}

describe('purity: src/engine', () => {
  it('has no browser, timer, randomness, or Vue dependency', () => {
    assertPure('src/engine');
  });
});

describe('purity: src/content', () => {
  it('has no browser, timer, randomness, or Vue dependency', () => {
    assertPure('src/content');
  });
});

describe('purity: src/session', () => {
  it('has no browser, timer, randomness, or Vue dependency', () => {
    assertPure('src/session');
  });
});

describe('stripNonCode', () => {
  it('removes single- and double-quoted string bodies', () => {
    expect(stripNonCode(`const a = 'window'; const b = "document";`)).not.toMatch(/window|document/);
  });

  it('keeps the code around a stripped string', () => {
    expect(stripNonCode(`const a = 'x';`)).toMatch(/const a =\s*;/);
  });

  it('removes template literal bodies but keeps interpolated code', () => {
    const stripped = stripNonCode('const s = `a window ${document.title} b`;');
    expect(stripped).not.toMatch(/window/);
    expect(stripped).toMatch(/document\.title/);
  });

  it('handles nested braces inside an interpolation', () => {
    const stripped = stripNonCode('const s = `${ f({ k: 1 }) } window`;');
    expect(stripped).toMatch(/f\(\{ k: 1 \}\)/);
    expect(stripped).not.toMatch(/window/);
  });

  it('removes line and block comments', () => {
    expect(stripNonCode('// window\nconst a = 1;')).not.toMatch(/window/);
    expect(stripNonCode('/* document */ const a = 1;')).not.toMatch(/document/);
  });

  // The defect this scanner exists to fix: a regex literal containing a quote
  // character used to blind the old stripper to everything that followed.
  it('is not blinded by a regex literal containing a quote', () => {
    const source = [
      `const QUOTES = /['"]/g;`,
      `const bad = window.location;`,
      `const other = 'a';`,
    ].join('\n');
    expect(stripNonCode(source)).toMatch(/\bwindow\b/);
  });

  it('is not blinded by a quote inside a regex character class', () => {
    const source = `const q = /[^']+/; document.body;`;
    expect(stripNonCode(source)).toMatch(/\bdocument\b/);
  });

  it('removes regex literal bodies', () => {
    expect(stripNonCode('const r = /window/;')).not.toMatch(/window/);
  });

  it('treats a slash after a value as division, not a regex', () => {
    const stripped = stripNonCode('const n = a / b; const m = c / d; window;');
    expect(stripped).toMatch(/\bwindow\b/);
  });

  it('treats a slash after return as a regex', () => {
    expect(stripNonCode('function f() { return /window/.test(s); }')).not.toMatch(/window/);
  });

  it('is not confused by an escaped quote inside a string', () => {
    expect(stripNonCode(`const a = 'it\\'s'; window;`)).toMatch(/\bwindow\b/);
  });
});

describe('importedModules', () => {
  it('finds static, side-effect, dynamic, and require specifiers', () => {
    const source = [
      `import { ref } from 'vue';`,
      `import './styles.css';`,
      `const m = await import("node:fs");`,
      `const r = require('vue/dist');`,
    ].join('\n');
    expect(importedModules(source).sort()).toEqual(
      ['./styles.css', 'node:fs', 'vue', 'vue/dist'].sort(),
    );
  });
});
