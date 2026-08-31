// Act I, end to end, on a clean save (v0.9.0). The fixture is the script the
// main session played by hand for the Act I close-out review — 128 commands
// from "Darkness." to the truck door. It is the regression gate for the whole
// act: every wave's rooms, all four NPCs, P1–P8, M1/M3, and the boundary.
// Stage D's playthrough helper continues from where this script stops.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const FIXTURE = join(process.cwd(), 'tests', 'fixtures', 'playthrough-act1.txt');

describe('Act I — the whole act on a clean save', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ib-act1-complete-'));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  const result = spawnSync('npx', ['tsx', 'src/cli/repl.ts', '--script', FIXTURE, '--fast', '--save-dir', dir], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 120_000,
  });
  const stdout = result.stdout ?? '';

  it('runs to completion', () => {
    expect(result.status).toBe(0);
  });

  it('opens on the floor and, since D1, drives on to Wall Drug instead of ending the build', () => {
    // D1 amendment (Stage D1 prose doc §21; plan §2 D1's own "the boundary
    // moves"): `jack.ts`'s `jackWallDrugEffects` no longer calls
    // `END_OF_BUILD_SCRIPT` — "ASK JACK ABOUT WALL DRUG"/"SHOW TICKET TO
    // JACK" now route to `act2_travel` instead, so this fixture's own last
    // two commands ("show ticket to jack", "ask jack about wall drug") no
    // longer end the build; they complete the first ride north. This
    // assertion is therefore no longer `'ACT I ENDS HERE'` (a deliberate,
    // reported deviation from this task's own "must pass unchanged"
    // instruction — the two are in direct conflict once the boundary is
    // moved, which this same task's brief separately, explicitly requires;
    // see this task's report). Every other assertion in this file (the
    // clues, the memories, the diagnostics check) is unaffected and still
    // passes against the unedited fixture script.
    expect(stdout.startsWith('Darkness.')).toBe(true);
    expect(stdout).toContain('"Get in."');
    expect(stdout).toContain('Wall Drug');
    expect(stdout).toContain('Intentionally Blank v');
    expect(stdout).not.toContain('ACT I ENDS HERE');
  });

  it('lands every reveal and both memories along the way', () => {
    for (const beat of [
      '◆ clue noted: Who hired you', // R1 at the motel
      '◆ clue noted: The numeral on Jack\'s arm', // R2's first half
      '◆ clue noted: The Polaroids in the box', // R2 completes
      '◆ clue noted: The claim ticket',
      '◆ clue noted: The work order',
      '? question opened: Where did Jules hide the notebook',
      '? question opened: What is waiting at Wall Drug?',
    ]) {
      expect(stdout).toContain(beat);
    }
    expect(stdout.match(/── MEMORY RECOVERED ──/g)?.length).toBe(3); // the hat, M1, one M3 variant
  });

  it('produces no engine diagnostics, raw ids, or misnamed misses', () => {
    expect(stdout).not.toContain('[error]');
    expect(stdout).not.toMatch(/\bact1_[a-z_]+\b/);
    expect(stdout).not.toContain('is not here. You have seen it somewhere');
  });
});
