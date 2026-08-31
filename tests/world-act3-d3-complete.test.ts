// Stage D3 end to end on a clean save (v0.13.0): the D2 fixture continued
// north — the drive to the perimeter, the gate hut, the badge at the reader,
// the lobby and Nolan, Data Hall A, the cooling plant and its warm return,
// Corridor B4 paced twice, the wall panel and its stencil, the lift to S5
// (this version's boundary), and the way back out: the ride to the motel, a
// night, the drive north again, Jack and the notebook, the fence, M20-D.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const FIXTURE = join(process.cwd(), 'tests', 'fixtures', 'playthrough-d3.txt');

describe('Stage D3 — the fence and the corridor on a clean save', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ib-d3-complete-'));
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

  it('drives north, gets inside, paces B4, and rides the lift to the boundary', () => {
    for (const beat of [
      // D2's own last beat, still intact
      '"Go see for yourself. There is no Sublevel 6. Bring it back Monday."',
      // §3 arrival, Jack at the fence
      'I\'ll be here',
      '◆ clue noted: The gate, watched a while',
      '◆ clue noted: Commissioned 2030',
      '◆ clue noted: Five, and a lot of rock',
      '◆ clue noted: A slow thing in the noise',
      // the plant
      '◆ clue noted: Return B is warm',
      'Return B is warm and is not on the plant\'s own drawing',
      // B4, paced and measured; M7
      'Two hundred and twenty-one. It is going to be two hundred and twenty-one.',
      '◆ clue noted: Corridor B4 doesn\'t match its own drawing',
      'Corridor B4 reads long against its own life-safety plan',
      // the wall panel
      '    INSPECTED\n    NOV 1983',
      '◆ clue noted: Inspected, Nov 1983',
      'Stencilled, not printed',
      // the lift — this version's boundary
      'The car settles. The leaves start.',
      'END OF BUILD',
      // the way back out and the fence (M20-D)
      'Five weeks of being the crank',
      '"Huh," says Jack.',
      'You can\'t half-do it',
      // the yard door, and the plant from the other side
      'the fence has already dealt with all this',
    ]) {
      expect(stdout).toContain(beat);
    }
    expect(stdout.split('── MEMORY RECOVERED ──').length - 1).toBeGreaterThanOrEqual(2);
  });

  it('produces no diagnostics, raw ids, unfilled templates, or parser misses past the fence', () => {
    expect(stdout).not.toContain('[error]');
    expect(stdout).not.toMatch(/\bact[123]_[a-z_0-9]+\b/);
    expect(stdout).not.toContain('{name}');
    const pastTheFence = stdout.slice(stdout.lastIndexOf('> drive to plant', stdout.indexOf('I\'ll be here')));
    for (const miss of ['Which do you mean', 'Nothing here answers to that name', 'It is not found', 'You are not wearing']) {
      expect(pastTheFence).not.toContain(miss);
    }
  });
});
