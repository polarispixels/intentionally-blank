// Stage E1 end to end on a clean save (v0.17.0): the E0 route with the visit
// done inside its window — the letter through Pearl's hands, the Staging
// Area, Luke's eight topics and four shows, the escort (canon 104: silence
// from the leaves down), the two-thing door, R16 at the root reader, Jack
// brought down (R14: the wrist, the lamp, the chair), and the morning after.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const FIXTURE = join(process.cwd(), 'tests', 'fixtures', 'playthrough-e1.txt');

describe('Stage E1 — the visit, on a clean save', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ib-e1-complete-'));
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

  it('meets the visit, rides down in silence, and brings Jack to the lamp', () => {
    for (const beat of [
      // the hand-off
      'She puts it in her apron pocket, flat, with her hand over it',
      // the room and the man
      'There is a man at the door you came in by and a man at the door you did not',
      'You spelled it right',
      'He would not have put that in a letter',
      // (rule 2's "Bring me a door" is unit-tested; this route holds the clue from the start)
      '"Take me to it," he says',
      // the escort — silence from the leaves
      'Nobody says anything on the way down.',
      'There is nothing on it to read.',
      // the two-thing door and the stair
      'The reader goes green. That is not the surprise. The surprise is the pad.',
      'Behind it there is a stair.',
      'Poured steps going down out of the light, no handrail',
      'You will know when you have got one.',
      // R16
      'He puts his hand flat on the reader beside the door. Then the badge. Then the',
      'He is down there a while.',
      // Jack
      '"Show me."',
      '"Somebody built this to be used," he says.',
      'It is a numeral. It has been a numeral since the first morning',
      'because his legs have gone',
      // the morning after
      '"Sit down," he says.',
      'On the way out he holds the door, which he has never once done',
      '"Not out of my hand it isn\'t."',
    ]) {
      expect(stdout).toContain(beat);
    }
    // Canon 104: after the leaves close, no quoted Luke line until the lobby.
    const ride = stdout.slice(stdout.indexOf('Nobody says anything on the way down.'), stdout.indexOf('He is down there a while.'));
    expect(ride).not.toMatch(/"[^"]+" *(he says|says Luke)/);
  });

  it('produces no diagnostics, raw ids, unfilled templates, or clarifies in the wave', () => {
    expect(stdout).not.toContain('[error]');
    expect(stdout).not.toMatch(/\bact[1-4]_[a-z_0-9]+\b/);
    expect(stdout).not.toContain('{name}');
    const e1 = stdout.slice(stdout.indexOf('She puts it in her apron pocket'));
    expect(e1).not.toContain('Which do you mean');
    expect(e1).not.toContain('somewhere else in this town');
  });
});
