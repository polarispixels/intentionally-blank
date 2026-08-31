// Stage E2 end to end on a clean save (v0.18.0): the E1 route continued —
// the darkroom found and opened with its own key, Jules's film developed,
// the first frame's admission, the Chamber's three performances and its
// completion, the print against the room, the hab (Sissy's eight topics,
// M11, the Dome, COUNT STARS refusing, the arrangement), Sissy's film,
// and R17 under the red bulb.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const FIXTURE = join(process.cwd(), 'tests', 'fixtures', 'playthrough-e2.txt');

describe('Stage E2 — the archive, on a clean save', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ib-e2-complete-'));
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

  it('completes the kitchen, meets Sissy, and matches the sky', () => {
    for (const beat of [
      // the darkroom
      'The tape has gone hard and yellow and lets go all at once.',
      // admission and M10
      '◆ clue noted: The floor on the far side of it was linoleum',
      '? question opened: Why does the room stop where you stand?',
      // the Chamber
      '◆ clue noted: It completed',
      '? question answered: Why does the room stop where you stand?',
      'Then the lights go out.',
      '◆ clue noted: The good cloth is on the table',
      // the hab
      '◆ clue noted: She has three brothers',
      '◆ clue noted: Her account of why the sheet starts at two',
      '"He asks me a question in every one. Nobody else asks me a question."',
      '? question opened: Whose sky is that?',
      '◆ clue noted: The same arrangement, held against the dome',
      // R17
      'There are lines behind the stars.',
      '◆ clue noted: Same arrangement, confirmed',
      '? question answered: Whose sky is that?',
    ]) {
      expect(stdout).toContain(beat);
    }
  });

  it('produces no diagnostics, raw ids, unfilled templates, or misses in the wave', () => {
    expect(stdout).not.toContain('[error]');
    expect(stdout).not.toMatch(/\bact[1-4]_[a-z_0-9]+\b/);
    expect(stdout).not.toContain('{name}');
    const e2 = stdout.slice(stdout.indexOf('The tape has gone hard and yellow'));
    for (const miss of ['Which do you mean', 'It is not found', 'admits to being']) {
      expect(e2).not.toContain(miss);
    }
  });
});
