// Stage D4 end to end on a clean save (v0.14.0): the D3 fixture continued —
// the wrench and the headlamp out of Jack's toolbox, the chase hatch, the
// Pipe Chase and this version's boundary, S5 (the gauges, the clock in
// words, the pad and the reader, the audit against the wall, the interlock
// death and the checkpoint restart, the NORMAL keyswitch), S1 (the crib,
// the rack, the checkout card against the notebook, the painted-over door),
// the lift back up and out, a night at the motel, and the county-road walk
// to the tunnel mouth: the hatch, the dark, the lamp, the mile, the rails,
// the seal, the construction door, S1 from the other side, and Dad on all
// three.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const FIXTURE = join(process.cwd(), 'tests', 'fixtures', 'playthrough-d4.txt');

describe('Stage D4 — the descent on a clean save', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ib-d4-complete-'));
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

  it('goes down the chase, dies and comes back, walks the tunnel, and hears Dad on all three', () => {
    for (const beat of [
      // D3's own last beats, still intact
      '"Huh," says Jack.',
      'It is under a coil of jump lead',
      // the chase and the boundary
      'The ladder goes on.',
      'Somebody uses the bottom of this building. When?',
      'END OF BUILD',
      // S5
      'HALL A     460',
      'The hands say',
      'ACCESS LEVEL: MAINTENANCE',
      'They are only shallow.',
      '◆ clue noted: The DIFFERENCE column, met on the wall',
      '── YOU HAVE DIED ──',
      '(restarted from checkpoint)',
      'It comes round to NORMAL',
      // S1
      'The checkout card comes with you.',
      '◆ clue noted: The card, in the same hand as the notebook',
      'From this side it is not a door.',
      'There is nothing to pull.',
      // the county road and the tunnel
      'The posts stop at a patch of ground that is not grazing.',
      'the arithmetic wins',
      'Completely fine.',
      'Then the mile.',
      '◆ clue noted: The cutting went in from the far side',
      'Behind it: light.',
      'a mile of tunnel behind it going away',
      // Dad
      '"Take a lamp, kiddo."',
      '"Rails! Of course rails."',
      'has read the accident report',
    ]) {
      expect(stdout).toContain(beat);
    }
    // The wall clock speaks in words, never digits (D4 §9.9).
    for (const line of stdout.split('\n').filter((l) => l.startsWith('The hands say'))) {
      expect(line).not.toMatch(/\d/);
    }
  });

  it('produces no diagnostics, raw ids, unfilled templates, or parser misses past the fence', () => {
    expect(stdout).not.toContain('[error]');
    expect(stdout).not.toMatch(/\bact[123]_[a-z_0-9]+\b/);
    expect(stdout).not.toContain('{name}');
    const pastTheFence = stdout.slice(stdout.lastIndexOf('> ram fence'));
    for (const miss of ['Which do you mean', 'Nothing here answers to that name', 'It is not found', 'You are not wearing', 'is elsewhere, doing whatever']) {
      expect(pastTheFence).not.toContain(miss);
    }
  });
});
