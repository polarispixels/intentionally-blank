// Stage D2 end to end on a clean save (v0.12.0): the D1 fixture continued
// through the store by day, the adapter, the boot, Dad's topics, the rig, the
// first letter and its rewritten reply, the reels, the second letter and the
// audit, Nolan at home, three Fridays, and the badge loan.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const FIXTURE = join(process.cwd(), 'tests', 'fixtures', 'playthrough-d2.txt');

describe('Stage D2 — the town in daylight on a clean save', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ib-d2-complete-'));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  const result = spawnSync('npx', ['tsx', 'src/cli/repl.ts', '--script', FIXTURE, '--fast', '--save-dir', dir], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 240_000,
  });
  const stdout = result.stdout ?? '';

  it('runs to completion', () => {
    expect(result.status).toBe(0);
  });

  it('boots Dad, reaches Eli, meets Nolan, and wins a Friday', () => {
    for (const beat of [
      'VOLUME LABEL:  DAD',
      '◆ clue noted: Dad, on a stick',
      '◆ clue noted: The letter that answered nothing',
      '◆ clue noted: A second one of these',
      '◆ clue noted: Said kindly',
      '◆ clue noted: The same sentence, twice',
      '◆ clue noted: The Tuesday convoy',
      '"Go see for yourself. There is no Sublevel 6. Bring it back Monday."',
      // The fixture stops at Town Edge: the drive north and everything past
      // the fence is D3's own playthrough (`world-act3-d3-complete.test.ts`).
    ]) {
      expect(stdout).toContain(beat);
    }
    expect(stdout).not.toContain('END OF BUILD');
  });

  it('produces no diagnostics, raw ids, or unfilled templates', () => {
    expect(stdout).not.toContain('[error]');
    expect(stdout).not.toMatch(/\bact[123]_[a-z_0-9]+\b/);
    expect(stdout).not.toContain('{name}');
    expect(stdout).not.toContain('it.,"');
  });
});
