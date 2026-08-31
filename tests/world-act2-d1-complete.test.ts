// Stage D1 end to end on a clean save (v0.11.0): the Act I fixture continued
// through the ride north, Wall Drug by night, the corridor and the cache, the
// notebook and the page, the morning with Dot, the afternoon with the
// Custodian, the truck home, the deck, the horse both ways, and the boundary.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const FIXTURE = join(process.cwd(), 'tests', 'fixtures', 'playthrough-d1.txt');

describe('Stage D1 — the ride and Wall Drug on a clean save', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ib-d1-complete-'));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  const result = spawnSync('npx', ['tsx', 'src/cli/repl.ts', '--script', FIXTURE, '--fast', '--save-dir', dir], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 180_000,
  });
  const stdout = result.stdout ?? '';

  it('runs to completion', () => {
    expect(result.status).toBe(0);
  });

  it('arrives at night, meets Dot in the morning and the Custodian in the afternoon', () => {
    expect(stdout).toContain('BACK IN 10 MIN');
    expect(stdout).toContain('"Free ice water," she says');
    expect(stdout).toContain('Afterwards you find you have kept the rail and not the man.');
  });

  it('lands the wave\'s beats', () => {
    for (const beat of [
      '◆ clue noted: The signs on the county road',
      '◆ clue noted: The numbering nobody uses',
      '◆ clue noted: What was in the box',
      '◆ clue noted: The page fits',
      '◆ clue noted: The login in the back cover',
      '? question answered: What did Jules leave at that counter',
    ]) {
      expect(stdout).toContain(beat);
    }
    // D3, task A supersession (Stage D plan §2 D3; D3 prose doc §21.1):
    // "DRIVE TO PLANT is retired entirely: it is §3's travel script with
    // to: 'perimeter'" — this fixture's own mid-game `drive to plant`
    // probe (which used to render END OF BUILD harmlessly, with no state
    // change) is removed rather than left to strand the player at the
    // perimeter with no way back to Your Room for the terminal boot that
    // follows; full coverage of the new travel behavior lives in
    // `tests/world-act3-entry.test.ts` and `tests/world-act2-d2-complete.
    // test.ts`.
    expect(stdout).not.toContain('END OF BUILD');
    // the hat, M1, one M3, M5, M6, M14, M12, M18-A or not, and one M2
    expect((stdout.match(/── MEMORY RECOVERED ──/g) ?? []).length).toBeGreaterThanOrEqual(8);
  });

  it('produces no diagnostics or raw ids', () => {
    expect(stdout).not.toContain('[error]');
    expect(stdout).not.toMatch(/\bact[123]_[a-z_0-9]+\b/);
  });
});
