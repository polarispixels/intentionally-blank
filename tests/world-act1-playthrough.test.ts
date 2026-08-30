// Act I, room 1 — a real CLI playthrough. Drives `src/cli/repl.ts` (the
// session-backed, real-parser CLI) against the actual `WORLD`, exactly the
// way a player would, and asserts on the real rendered output — the proof
// this content plays, not just that `validate()` approves of its shape.
//
// UPDATED (§8 gap 6): this script used to produce one accepted false-
// positive diag — `LOG IN`, a bare, no-object verb, used to always render
// through `fallbackToVerbDefault`, which always tagged `defaultResponse`
// even though the content was fully authored (`verbs.ts`'s `V_TYPE_TERMINAL`
// default). Gap 3/4 moved that rendering to a room-level handler (rung 1,
// no diag ever); gap 6 also stopped `fallbackToVerbDefault` itself from
// tagging a bare verb whose grammar declares no dobj-capable pattern at
// all (§8's own "nobody authored anything better" fix). This script
// produces zero diags end to end — asserted directly below, not against an
// allow-list.
//
// UPDATED (opening-room-prose §15): the script now walks the WHOLE opening
// slice, not just `your_room` — wear the fedora (the memory fires), step
// out onto the real `LANDING` (replacing the old content-free
// `LANDING_STUB`, which crashed on entry), look back at the room, and
// press on `DOWN` into §15.2's build boundary. Three real bugs this pass
// fixed, each with its own assertion below: the landing crashing on entry,
// `The door is shut.` going stale once the door was actually open, and
// `AGAIN`/`G` being unregistered.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';

const dir = mkdtempSync(join(tmpdir(), 'ib-act1-'));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

const worldPath = fileURLToPath(new URL('../src/content/world/act1/world.ts', import.meta.url));

function writeScript(lines: string[]): string {
  const path = join(dir, 'script.txt');
  writeFileSync(path, lines.join('\n'));
  return path;
}

function play(args: string[]): { stdout: string; stderr: string; status: number } {
  try {
    const stdout = execFileSync('npx', ['tsx', 'src/cli/repl.ts', ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 60_000,
    });
    return { stdout, stderr: '', status: 0 };
  } catch (error) {
    const e = error as { stdout?: string; stderr?: string; status?: number };
    return { stdout: e.stdout ?? '', stderr: e.stderr ?? '', status: e.status ?? -1 };
  }
}

// The whole opening slice: wake in the dark, feel the chain, pull it,
// examine the lit room, take and wear the fedora (the memory fires),
// search it, take page 7/8, read it, wake the terminal, open the door,
// step out onto the landing, look back, and try to go down — reaching
// §15.2's build boundary.
const SCRIPT = [
  'look',
  'pull chain',
  'look',
  'examine fedora',
  'take fedora',
  'wear fedora',
  'search fedora',
  'take page',
  'read page',
  'turn on terminal',
  'log in',
  'open door',
  'out',
  'look',
  'down',
];

describe('Act I room 1 — CLI playthrough', () => {
  const saveDir = mkdtempSync(join(tmpdir(), 'ib-act1-saves-'));
  const script = writeScript(SCRIPT);
  const { stdout, stderr, status } = play(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast', '--diag']);

  it('runs cleanly to completion', () => {
    expect(stderr).toBe('');
    expect(status).toBe(0);
  });

  it('wakes in the dark with the canon-locked opening lines', () => {
    expect(stdout).toContain('Darkness.');
    expect(stdout).toContain('Your head hurts.');
    expect(stdout).toContain('Your fingers close on it before the rest of you has an opinion.');
  });

  it('PULL CHAIN lights the room for the first time', () => {
    expect(stdout).toContain('You pull. There is a click, and the room happens.');
  });

  it('the lit room description follows, lamp fallen, first sight', () => {
    expect(stdout).toContain('The lamp lies on its side and burns anyway');
  });

  // Room-listing fix (§2.5 `listedAs`, architecture-gap task): the
  // description used to name the fedora directly ("...and beside it,
  // crown down, a fedora"), which went stale the instant it was taken —
  // the bug this task fixes. That clause is deleted outright from
  // `room.ts` (not reworded — hard rule 5); the replacement is
  // `FEDORA.listedAs` (opening-room-prose spec §17.1, now landed),
  // rendered by `move.ts` after the description while the hat is still
  // unmoved — the fedora is announced on the first LOOK after the room
  // lights, not baked into the room's own description.
  it('the fedora is announced by its own listedAs line on LOOK, before it is ever examined or taken', () => {
    const beforeExamine = stdout.slice(0, stdout.indexOf('> examine fedora'));
    expect(beforeExamine).toContain('A grey felt fedora lies beside the stain, crown down.');
  });

  it('EXAMINE FEDORA reveals it, TAKE and WEAR pick it up and fire the memory', () => {
    expect(stdout).toContain('A grey felt fedora, crown down and brim up');
    expect(stdout).toContain('You pick it up. It is lighter than it looks');
    expect(stdout).toContain('You put on the fedora.');
    expect(stdout).toContain('The hat settles, and something settles with it.');
    expect(stdout).toContain('MEMORY RECOVERED');
    expect(stdout).toContain('The hat fits. You have no idea whether that is good news.');
  });

  it('SEARCH FEDORA reveals page 7/8', () => {
    expect(stdout).toContain('there is a sheet of paper folded down to quarters');
  });

  it('TAKE PAGE and READ PAGE render the raking-light variant and note the clue', () => {
    expect(stdout).toContain('You take the page. It weighs nothing.');
    expect(stdout).toContain('THIS PAGE INTENTIONALLY LEFT BLANK');
    expect(stdout).toContain('the page stops being blank');
    expect(stdout).toContain('◆ clue noted: The blank page is not blank');
  });

  it('TURN ON TERMINAL and LOG IN render the boot text and the first USER NOT RECOGNIZED', () => {
    expect(stdout).toContain('USER:');
    expect(stdout).toContain('USER NOT RECOGNIZED');
    expect(stdout).toContain('Not recognized is a different sort of remark');
  });

  it('OPEN DOOR draws the bolt and notes the clue', () => {
    expect(stdout).toContain('You slide the bolt back.');
    expect(stdout).toContain('◆ clue noted: The bolt was thrown from inside');
  });

  it('OUT steps onto the real Landing (§15.1) instead of crashing on the old stub', () => {
    expect(stdout).toContain('You step out onto the landing and pull the door to behind you.');
    expect(stdout).toContain('A landing two floors up, no wider than it needs to be.');
    expect(stdout).toContain('The stairs go down in flights, around a square well, to a turn you cannot see past.');
  });

  it('LOOK on the landing re-renders the same description (looking back)', () => {
    const occurrences = stdout.split('A landing two floors up, no wider than it needs to be.').length - 1;
    expect(occurrences).toBe(2); // once on arrival (OUT), once on the explicit LOOK
  });

  it('DOWN renders §15.2\'s build boundary in place of moving the player', () => {
    expect(stdout).toContain('END OF BUILD');
    expect(stdout).toContain('This version ends at the top of these stairs.');
    expect(stdout).toContain('The rest of the house, and the town it stands in, are not in this build.');
  });

  it('produces no unexpected diagnostics end to end', () => {
    const diagLines = stdout.split('\n').filter((l) => l.startsWith('DIAG '));
    expect(diagLines).toEqual([]);
  });
});

// §15.3's door-open variant: once the door is open, `your_room`'s
// description stops saying "The door is shut." and starts saying the room
// is lit by the landing behind it — proven with a second, focused
// playthrough (walking all the way back `IN` after `OUT`) rather than
// folded into the main script above, so the two concerns stay legible as
// separate tests.
describe('Act I room 1 — door-open room description (§15.3)', () => {
  const saveDir = mkdtempSync(join(tmpdir(), 'ib-act1-saves-'));
  const script = writeScript([...SCRIPT, 'in']);
  const { stdout } = play(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast', '--diag']);

  it('re-entering the room after OPEN DOOR shows the door-open clause, not "The door is shut."', () => {
    expect(stdout).toContain('You step back into your room.');
    // Isolate the final render (after the last `IN`) — "The door is shut."
    // legitimately appears earlier in the transcript, from the `look`
    // taken while the door was still shut.
    const afterReturn = stdout.slice(stdout.lastIndexOf('You step back into your room.'));
    expect(afterReturn).toContain('The door stands open where you left it, and the landing light lies across the boards in a long pale wedge.');
    expect(afterReturn).not.toContain('The door is shut.');
  });

  it('produces no unexpected diagnostics', () => {
    const diagLines = stdout.split('\n').filter((l) => l.startsWith('DIAG '));
    expect(diagLines).toEqual([]);
  });
});

// Part 1 of the final Stage B task: the player's body must follow the
// player. SELF and its sub-parts used to be pinned to a single RoomId
// (YOUR_ROOM), so X ME / X HANDS / TOUCH HEAD / SEARCH POCKETS all failed
// with a nounMiss once the player stepped onto the Landing — a second room
// existing at all broke examining yourself. The fix is a new `'self'`
// PlaceId (`src/engine/ids.ts`), always in scope regardless of
// `state.location`. This script proves the whole loop: dark room, lit
// room, and the Landing, plus that INVENTORY never lists a body part.
describe("Act I room 1 — the player's body follows the player ('self' PlaceId)", () => {
  const saveDir = mkdtempSync(join(tmpdir(), 'ib-act1-saves-'));
  const script = writeScript([
    'x me', // dark, before the chain is pulled
    'touch head', // dark
    'pull chain',
    'x me', // lit, still in your room
    'x hands',
    'take fedora',
    'wear fedora',
    'search fedora',
    'take page',
    'open door',
    'out', // now on the Landing — SELF was never authored against this room
    'x me',
    'touch head',
    'x hands',
    'search pockets',
    'inventory',
  ]);
  const { stdout, stderr, status } = play(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast', '--diag']);

  it('runs cleanly to completion with no scope-miss diagnostics — every body-part command resolved, dark or lit, either room', () => {
    expect(stderr).toBe('');
    expect(status).toBe(0);
    // `nounMiss` is what a body part out of scope would raise (the pre-fix
    // failure mode); `defaultResponse` is fine — SEARCH POCKETS has no
    // authored handler of its own and legitimately falls to the verb's
    // rung-2 default, which still proves the object resolved.
    const nounMissLines = stdout.split('\n').filter((l) => l.startsWith('DIAG nounMiss'));
    expect(nounMissLines).toEqual([]);
  });

  it('X ME works in the dark, before any light exists', () => {
    expect(stdout).toContain('You take inventory by touch.');
  });

  it('TOUCH HEAD works in the dark', () => {
    expect(stdout).toContain('You go over the back of your skull with two fingers');
  });

  it('X ME and X HANDS render their lit text both in your room and, unchanged, on the Landing', () => {
    const selfOccurrences = stdout.split('A man of no particular age in a coat').length - 1;
    expect(selfOccurrences).toBe(2); // once after PULL CHAIN, once again from the Landing
    const handsOccurrences = stdout.split('Two of them. Nothing broken').length - 1;
    expect(handsOccurrences).toBe(2); // once in your room, once from the Landing
  });

  it('SEARCH POCKETS resolves from the Landing — a real rendered line, not silence', () => {
    // A parser miss (the pre-fix behavior: pockets out of scope of the
    // Landing) would render a `nounMiss` family line AND a `nounMiss` diag —
    // already proven absent by the all-clean diag assertion above. This
    // test additionally confirms the command produced actual output, not an
    // empty turn.
    const afterOut = stdout.slice(stdout.indexOf('> search pockets'));
    const nextLines = afterOut.split('\n').slice(1, 6).join('\n').trim();
    expect(nextLines.length).toBeGreaterThan(0);
  });

  it('INVENTORY from the Landing lists only what is actually carried/worn — never a body part', () => {
    const inventoryOutput = stdout.slice(stdout.lastIndexOf('> inventory'));
    expect(inventoryOutput).toContain('fedora (worn)');
    expect(inventoryOutput).toContain('page');
    for (const bodyWord of ['yourself', 'hands', 'forearm', 'pockets', 'face', 'coat']) {
      expect(inventoryOutput).not.toContain(bodyWord);
    }
    // 'head' is also SELF_HEAD's own name, but "head" isn't a substring of
    // the actual authored item names above, so no separate check is needed
    // beyond the loop.
  });
});
