// Stage E0 end to end on a clean save (v0.16.0): the D5 fixture continued —
// the fourth heading and R13, the ledger under a numeral, the Act IV
// boundary, the town before the visit (the road opened up, the notice,
// Pearl, Jack's arithmetic), Whitlock and the evidence bag, the comparison
// (R14's analog leg), P21 solving, and Eli's numerals letter.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const FIXTURE = join(process.cwd(), 'tests', 'fixtures', 'playthrough-e0.txt');

describe('Stage E0 — the record about you, on a clean save', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ib-e0-complete-'));
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

  it('reads the record, meets the town before the visit, and holds the discipline', () => {
    for (const beat of [
      // the machine (this route logs in before Act IV, so the profile
      // arrives on READ PROFILE, not the login menu — the menu row is unit-tested)
      'You take the fourth heading.',
      'SUBJECT BEHAVIORAL PROFILE',
      'PRIMARY STRATEGY: ANALYTICAL',
      '◆ clue noted: SUBJECT BEHAVIORAL PROFILE',
      '2 RESULTS',
      '◆ clue noted: SUBJECT [UNRESOLVED] — MAINTENANCE',
      'You do not open it. You have already read what is queued against it',
      'street, the sheriff, the ledger and the man who is coming are this one.',
      // the town
      'Main Street has been opened up.',
      '? question opened: What does the record say about you?',
      '◆ clue noted: Two governors and a senator',
      '"Five weeks he\'s been gone."',
      'Two numbers, on a table, with nobody putting them together.',
      // the sheriff and the bag
      '"Whose is this?"',
      'She gets up. That is the whole of the argument.',
      'Everybody\'s cursive looks alike.',
      '◆ clue noted: Everybody\'s cursive looks alike',
      '? question answered: What does the record say about you?',
      // Eli
      'There is no I. There was never an I.',
      '◆ clue noted: I could not tell you that man\'s face',
      // the road after
      'The barriers are gone. The horses are back at their own rail.',
    ]) {
      expect(stdout).toContain(beat);
    }
    // The word "profile" never leaves the machine: only screen/menu/clue lines carry it.
    const past = stdout.slice(stdout.indexOf('SUBJECT BEHAVIORAL PROFILE'));
    for (const line of past.split('\n')) {
      if (/profile/i.test(line)) {
        // the machine's lines, the clue/question ledger, and the player's own typed commands
        expect(/^> |PROFILE|SUBJECT BEHAVIORAL|behavioral profile|clue noted|question/.test(line)).toBe(true);
      }
    }
  });

  it('produces no diagnostics, raw ids, unfilled templates, or misses past the Hub', () => {
    expect(stdout).not.toContain('[error]');
    expect(stdout).not.toMatch(/\bact[1-4]_[a-z_0-9]+\b/);
    expect(stdout).not.toContain('{name}');
    const e0 = stdout.slice(stdout.indexOf('SUBJECT BEHAVIORAL PROFILE'));
    for (const miss of ['Which do you mean', 'You have a verb', 'It is not found']) {
      expect(e0).not.toContain(miss);
    }
  });
});
