import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GAME_VERSION } from '../src/version';

const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string };
const changelog = readFileSync('CHANGELOG.md', 'utf8');

describe('version sync', () => {
  it('matches package.json', () => {
    expect(pkg.version).toBe(GAME_VERSION);
  });
  it('has a CHANGELOG heading for the current version', () => {
    expect(changelog).toMatch(new RegExp(`^## \\[${GAME_VERSION.replace(/\./g, '\\.')}\\]`, 'm'));
  });
  it('is semver', () => {
    expect(GAME_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
