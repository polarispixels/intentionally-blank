// Stage D end to end on a clean save (v0.15.0): the D4 fixture continued
// back down through the tunnel to Sublevel 6 — the Maintenance Bay by day
// (the chairs, the hooks, the lamp, the arm), the Archive Hub (the login,
// the ledger and Jules, the graph and Eli's line, the queue and the four
// words), the gate frames and the root door — this version's boundary —
// then out through the tunnel to the motel for the night, the chiller alarm,
// and the Bay full: Nolan asleep, the strap, the badge, the coveralls, and
// the machinery past the far wall.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const FIXTURE = join(process.cwd(), 'tests', 'fixtures', 'playthrough-d5.txt');

describe('Stage D — Sublevel 6 on a clean save', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ib-stage-d-'));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  const result = spawnSync('npx', ['tsx', 'src/cli/repl.ts', '--script', FIXTURE, '--fast', '--save-dir', dir], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 300_000,
  });
  const stdout = result.stdout ?? '';

  it('runs to completion', () => {
    expect(result.status).toBe(0);
  });

  it('reaches the Bay, reads the archive, meets the boundary, and comes back at night', () => {
    for (const beat of [
      // D4's own last beats, still intact
      'has read the accident report',
      'There is a man in the room.',
      // the Bay by day
      // (first sight was at night, in D4's own run; by day the return rule)
      'The rows, empty, facing the wall with nothing on it.',
      '◆ clue noted: You can see where the letters were and you cannot read them',
      '◆ clue noted: A groove in the vinyl, about the width of a thumb',
      'something does not go white',
      // the Hub
      'This one has been busy.',
      'ACCESS LEVEL: NONE',
      'Upstairs that was the whole answer. Down here it is a heading.',
      '◆ clue noted: SUBJECT JULES I — DEPRECATED',
      'He is here. He has been here the whole time, in a field, with a word in it.',
      '? question answered: What happened to Jules?',
      '◆ clue noted: Every notch above the line',
      'The part of this that goes to sleep at night is not the part with the',
      '? question opened: What are these people — and what am I?',
      '◆ clue noted: SUBJECT [UNRESOLVED] — RE-ACQUIRE',
      "Top floor, back. Three weeks, you've had it.",
      '? question answered: Who hit you?',
      '── MEMORY RECOVERED ──',
      'Sorry about this',
      'Then white.',
      '◆ clue noted: Openings in the wall, and nothing hung in them',
      'Act III ends here.',
      'END OF BUILD',
      '◆ clue noted: ACCESS LEVEL: MAINTENANCE. DENIED. There is a level under this one.',
      // the night
      'CHILLER TRIP - PULL',
      'a door that has been shut all night is opened',
      'The rows, full, facing the wall with nothing on it.',
      'and Nolan is in',
      'it was never going to be the strap',
      'You could not tell anybody why, and you do it back up.',
      'Over what you are wearing, which is what they are cut for.',
      'a pair of doors opening and closing on a cycle',
    ]) {
      expect(stdout).toContain(beat);
    }
    // Exactly one M16 variant fires.
    expect((stdout.match(/Then white\./g) ?? []).length).toBe(1);
    // The Bay's clock, like S5's, speaks in words.
    for (const line of stdout.split('\n').filter((l) => l.startsWith('The hands say'))) {
      expect(line).not.toMatch(/\d/);
    }
  });

  it('produces no diagnostics, raw ids, unfilled templates, or parser misses below the fence', () => {
    expect(stdout).not.toContain('[error]');
    expect(stdout).not.toMatch(/\bact[123]_[a-z_0-9]+\b/);
    expect(stdout).not.toContain('{name}');
    const belowTheFence = stdout.slice(stdout.lastIndexOf('> ask dad about the interlock'));
    for (const miss of ['Which do you mean', 'You are not wearing', 'There is a badge here', 'There is a badge on the floor']) {
      expect(belowTheFence).not.toContain(miss);
    }
  });
});
