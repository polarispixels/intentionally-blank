// Stage E3 end to end on a clean save (v0.19.0): the whole game, and then
// the whole game again — the E2 route continued down the branch hatch
// (4471, the shaft, the stencil), R18 at the antechamber console, M17, the
// re-acquire death and the re-login, R19 (the creation record), R20 (Jules,
// once, through the terminal), the cache (all four items, Dad's "Right.
// Well."), R21 (the form, INITIALIZE?, > YES), and ADR 0012's hand-off: the
// last authored line falls into the opening room's own shipped first
// render, byte-identical, with nothing between — then the opening
// terminal's ACCESS LEVEL: LOCAL screen (canon 111) in the same transcript.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const FIXTURE = join(process.cwd(), 'tests', 'fixtures', 'playthrough-e3.txt');

describe('Stage E3 — root, the ending, and the hand-off, on a clean save', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ib-e3-complete-'));
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

  it('goes down, is recognized, and dies once at the top of the well', () => {
    for (const beat of [
      // the branch hatch and the shaft (§3-§9)
      '◆ clue noted: 4471',
      'and one half of the wall has aged and the other has not',
      '◆ clue noted: SYSTEM REVISION 2089.4',
      // M17 (§14)
      'A voice above and a little to the left, going down a list.',
      // R18 (§12.2) — RECOGNIZED with no word in front of it
      'It is not in front of it now.',
      '◆ clue noted: ACCESS LEVEL: ROOT',
      '? question answered: What is at the bottom?',
      // Dad (§13)
      '"Nobody ever changes the defaults," Dad says.',
      // the well door from the inside (§16)
      'It has had a bolt on the inside of it the whole time.',
      // the re-acquire (§18)
      'which is where a man stands when he has been told where to stand.',
      'Then white.',
      '── YOU HAVE DIED ──',
    ]) {
      expect(stdout).toContain(beat);
    }
  });

  it('reads the record, wakes Jules once, and fills the cabinet', () => {
    for (const beat of [
      // R19 (§22)
      'AUTHOR ............................ JULES I',
      'INITIAL MEMORY STATE .............. INTENTIONALLY BLANK',
      // the index and R20 (§23-§24)
      'INDEX ............................ COMPLETE — 1 SESSION',
      'is jack all right',
      'i left the name field empty. it was not a kindness.',
      'tell him i said the truck was a stupid truck. he will know why',
      '? question answered: SNAPSHOT: ARCHIVED / ROOT. Archived where, and can it be opened?',
      // the letter (§25)
      "in the machine's lettering, which is nobody's hand at all",
      // the cache (§26) — all four beats, Dad's included
      'The page fits the gap. The login is in the back. It goes on the shelf.',
      '"Right," Dad says, before you have got it half out. "Well."',
      'a half page addressed to nobody that only one',
      // canon 91 — retrievable
      'Out again, and the cabinet goes back to being empty',
    ]) {
      expect(stdout).toContain(beat);
    }
  });

  it('fills the form, initializes, and hands off into the opening room with nothing between', () => {
    for (const beat of [
      'the form is the record with',
      'The cursor goes round it.',
      'There is no field on this form for a cabinet.',
      '? question answered: What do you owe the next one?',
      'The chair. The paper. The machine. The lamp. The hat.',
    ]) {
      expect(stdout).toContain(beat);
    }
    // THE SEAM (register 137, review §5.4 (1)): the last authored line is
    // followed immediately by the opening room's shipped first render —
    // byte-identical, no system line, no blank ceremony, nothing between.
    expect(stdout).toContain(
      'The light in here is not switched off. It is withdrawn, evenly, from everywhere at once, the way it arrived.\nDarkness.\n\nYour head hurts.',
    );
    // and the two lines arrive exactly once more than the head's own fresh
    // start — i.e. the ending script itself never printed them (a doubled
    // pair four lines apart would show up as an extra occurrence).
    const seamCount = stdout.split('Darkness.\n\nYour head hurts.').length - 1;
    expect(seamCount).toBe(2); // turn one of the first game + the hand-off
  });

  it('shows the opening terminal holding three lines off the record (canon 111)', () => {
    expect(stdout).toContain('ACCESS LEVEL: LOCAL');
    expect(stdout).toContain('ENVIRONMENT ......... MAIN ST / TOP FLOOR REAR');
    expect(stdout).toContain('nothing on it that is any use to anybody');
  });

  it('produces no diagnostics, raw ids, or unfilled templates', () => {
    expect(stdout).not.toContain('[error]');
    expect(stdout).not.toMatch(/\bact[1-5]_[a-z_0-9]+\b/);
    expect(stdout).not.toContain('{name}');
    expect(stdout).not.toContain('END OF BUILD');
  });
});
