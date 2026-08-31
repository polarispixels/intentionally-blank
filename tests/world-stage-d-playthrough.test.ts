// Stage D end to end on a clean save (v0.15.0): the D4 fixture continued
// back down through the tunnel to Sublevel 6 — the Maintenance Bay by day
// (the chairs, the hooks, the lamp, the arm), the Archive Hub (the login,
// the ledger and Jules, the graph and Eli's line, the queue and the four
// words), the gate frames and the root door — this version's boundary —
// then out through the tunnel to the motel for the night, the chiller alarm,
// and the Bay full: Nolan asleep, the strap, the badge, the coveralls, and
// the machinery past the far wall.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
      // E3 task W (§34/§42.1) retired the boundary: DOWN at the well now
      // prints only the shipped in-world line, with no `system.
      // buildBoundary` paragraph after it — the two removed beats above
      // ('street, the sheriff...'/'END OF BUILD') no longer render in any
      // state.
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
    // The first-attempt line at Nolan's chair plays once, then the rotation of two (v0.15.1).
    expect((stdout.match(/You say his name\. Not loudly\./g) ?? []).length).toBe(1);
    // Dad refuses the dock from wherever the rig is (§29.1, v0.15.1).
    expect(stdout).toContain('You have the stick half out of the rig');
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

  // Stage E, E-2 (ADR 0012 item 6): the twelve direction verbs and GO TO are
  // `class: null` — the profile tallies choices, not footsteps, over this
  // whole 681-command route. Same fixture, `export`ed at the end (`EXPORT`
  // prints the live `SaveFile` as one JSON line, `tests/cli.test.ts`'s own
  // pattern) so the real final `state.profile` can be asserted directly,
  // rather than re-deriving it from prose. Recorded once, by this task, from
  // the actual run — before this change (movement still `'direct'`) the same
  // route tallied `direct: 30` at the tattoo ask (line 105) and `direct` a
  // good deal higher by the end; the change only ever removes tallies, never
  // adds or reassigns one, so `analytical`/`social` are identical before and
  // after and only `direct` drops.
  it("the run's final behavioral profile tallies choices, not movement", () => {
    const scriptPath = join(dir, 'e2-profile-script.txt');
    writeFileSync(scriptPath, `${readFileSync(FIXTURE, 'utf8')}\nexport\n`);
    const exportResult = spawnSync(
      'npx',
      ['tsx', 'src/cli/repl.ts', '--script', scriptPath, '--fast', '--save-dir', dir],
      { cwd: process.cwd(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 300_000 },
    );
    expect(exportResult.status).toBe(0);
    const jsonLine = (exportResult.stdout ?? '')
      .split('\n')
      .map((l) => l.trim())
      .find((l) => l.startsWith('{'));
    expect(jsonLine).toBeDefined();
    const parsed = JSON.parse(jsonLine!);
    expect(parsed.state.profile).toEqual({ analytical: 215, social: 84, direct: 118 });
    // The plan's own expectation for this route (§3.3): analytical leads direct.
    expect(parsed.state.profile.analytical).toBeGreaterThanOrEqual(parsed.state.profile.direct);
    // M3 (`world-act1-wave4-jack.test.ts`'s own `ask jack about tattoo`, line
    // 105 of this fixture) fires by `profileLeader` at the moment it's asked,
    // not at the end of the run — `analytical` (38) already led `direct` (16
    // after this change, 30 before it) there, so the variant this route
    // fires, by name, is unchanged by E-2: `act1_mem_m3_analytical`.
    expect(parsed.state.memories).toContain('act1_mem_m3_analytical');
    expect(parsed.state.memories).not.toContain('act1_mem_m3_social');
    expect(parsed.state.memories).not.toContain('act1_mem_m3_direct');
  });
});
