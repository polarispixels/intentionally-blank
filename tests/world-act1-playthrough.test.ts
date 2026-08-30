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

import { spawnSync } from 'node:child_process';
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
  // `spawnSync`, not `execFileSync`: a per-line error inside `feed()`
  // (`repl.ts`) is caught and written to stderr without changing the exit
  // code (§8 gap 6's own "one line on stderr and a non-zero exit — never a
  // stack trace at a player" convention doesn't apply to a per-line
  // in-script error, only to a genuine CLI misuse). `execFileSync` only
  // returns stdout at all on a zero exit and discards stderr entirely in
  // that case (§8 fix 3's HELP/ABOUT tests need exactly that stream, on a
  // process that still exits 0) — `spawnSync` returns both streams
  // unconditionally, with no throw/catch needed.
  const result = spawnSync('npx', ['tsx', 'src/cli/repl.ts', ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 60_000,
  });
  return { stdout: result.stdout ?? '', stderr: result.stderr ?? '', status: result.status ?? -1 };
}

// The whole opening slice: wake in the dark, feel the chain, pull it,
// examine the lit room, take and wear the fedora (the memory fires),
// search it, take page 7/8, read it, wake the terminal, open the door,
// step out onto the landing, look back, and go down — now the real Front
// Desk (front-desk-prose task), not §15.2's old build boundary; the
// boundary moved down to the Front Desk's own street door (see the
// describe block below this one).
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

  it('DOWN now reaches the real Front Desk instead of §15.2\'s old build boundary', () => {
    expect(stdout).toContain('You go down two flights, around the well, past a landing with no light on it.');
    expect(stdout).toContain('The stairs come down into a lobby built for more people than are using it.');
    expect(stdout).toContain('There is a man behind the desk.');
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
  // SCRIPT now ends at the Front Desk (one level below the landing) rather
  // than the landing itself — 'up' then 'in' walks the rest of the way
  // back into your_room.
  const script = writeScript([...SCRIPT, 'up', 'in']);
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

// ---------------------------------------------------------------------------
// Ryan's v0.3.2 playtest, fix 1: "GO THROUGH DOOR"/"ENTER DOOR"/"USE DOOR"
// all traverse the door the player already knows about (`DOOR`, opened
// earlier in `SCRIPT` above), the same way `OUT`/`IN` already do — reusing
// real, already-authored content (`move.blocked`, the door's own OPEN
// handler, `your_room`'s `travelText`), no placeholder prose needed.
// ---------------------------------------------------------------------------

describe('Act I room 1 — traverse the door by naming it (fix 1)', () => {
  it.each([
    ['go through door', 'go through door'],
    ['enter door', 'enter door'],
    ['use door', 'use door'],
  ])('"%s" is blocked while the door is shut, then traverses to the Landing once it is open', (_label, phrase) => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-act1-saves-'));
    const script = writeScript(['pull chain', phrase, 'open door', phrase]);
    const { stdout, stderr, status } = play(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast', '--diag']);

    expect(stderr).toBe('');
    expect(status).toBe(0);

    // Before OPEN DOOR: the same generic "blocked" family OUT/walking into
    // it would render — not a nonsense CLIMB answer, not "no exit at all".
    const beforeOpen = stdout.slice(0, stdout.indexOf('> open door'));
    expect(beforeOpen).toMatch(/(There is a way through here|The way exists\.|Something stands between you|You get as far as)/);

    // After OPEN DOOR: the exit's own travelText and the real Landing.
    const afterOpen = stdout.slice(stdout.indexOf('> open door'));
    expect(afterOpen).toContain('You step out onto the landing and pull the door to behind you.');
    expect(afterOpen).toContain('A landing two floors up, no wider than it needs to be.');

    const diagLines = stdout.split('\n').filter((l) => l.startsWith('DIAG '));
    expect(diagLines).toEqual([]);
  });

  it('naming a non-door object no longer falls to CLIMB\'s "go through"/"exit" words — CLIMB is for climbing things now', () => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-act1-saves-'));
    const script = writeScript(['pull chain', 'go through window']);
    const { stdout } = play(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast']);
    // Old CLIMB text ("You get a knee up on the sill...") no longer fires for this phrasing.
    expect(stdout).not.toContain('You get a knee up on the sill');
    // Falls through to IN's own (already-authored) {name}-templated default instead.
    expect(stdout).toContain('There is no getting inside the window, and the window shows no sign of having an inside.');
  });

  it('CLIMB itself (climb window) is unaffected — only "go through"/"exit" moved off it', () => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-act1-saves-'));
    const script = writeScript(['pull chain', 'climb window']);
    const { stdout } = play(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast']);
    expect(stdout).toContain('You get a knee up on the sill and stop there.');
  });

  it('bare EXIT reaches the OUT direction verb (was previously captured by CLIMB, which needs an object)', () => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-act1-saves-'));
    const script = writeScript(['pull chain', 'open door', 'exit']);
    const { stdout } = play(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast']);
    expect(stdout).toContain('You step out onto the landing and pull the door to behind you.');
    expect(stdout).toContain('A landing two floors up, no wider than it needs to be.');
  });
});

// ---------------------------------------------------------------------------
// Ryan's playtest bug: fix 1 above proves the door works naming it from
// INSIDE (room -> landing). Nothing proved the return trip — from the
// Landing, back into the room. `objects/landing.ts`'s `your_door_outside`
// is a second object for the same physical door seen from the other side;
// the Landing's own `in` exit used to key its `door` field to `act1_door`
// (the inside-room object, never in scope from the Landing), so
// `traverseDoor` could never match ENTER DOOR/USE DOOR/GO THROUGH DOOR —
// only bare IN worked, since direction traversal resolves no noun at all.
// Fixed by pointing the exit at `your_door_outside` and keeping its own
// `open` overlay in sync with the real door's (`objects/door.ts`'s OPEN/
// CLOSE handlers). "room" is also added to `your_door_outside`'s own nouns
// (ENTER ROOM/X ROOM used to resolve to `objects/misc.ts`'s FLOOR_BOARDS,
// never in scope from the Landing — a real nounMiss).
// ---------------------------------------------------------------------------

describe('Act I room 1 — the return trip, Landing back into the room (Ryan\'s playtest bug)', () => {
  it.each([
    ['in', 'in'],
    ['enter door', 'enter door'],
    ['use door', 'use door'],
    ['go through door', 'go through door'],
    ['enter room', 'enter room'],
  ])('"%s" from the Landing walks the player back into the room', (_label, phrase) => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-act1-saves-'));
    const script = writeScript(['pull chain', 'open door', 'out', phrase]);
    const { stdout, stderr, status } = play(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast', '--diag']);

    expect(stderr).toBe('');
    expect(status).toBe(0);

    const afterPhrase = stdout.slice(stdout.lastIndexOf(`> ${phrase}`));
    expect(afterPhrase).toContain('You step back into your room.');
    expect(afterPhrase).toContain('The lamp lies on its side and burns anyway');

    const diagLines = stdout.split('\n').filter((l) => l.startsWith('DIAG '));
    expect(diagLines).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Ryan's v0.3.2 playtest, fix 3: HELP/ABOUT are registered meta verbs and
// their authored text (response-families spec §10) is wired into
// `world.responses`. The original form of this test asserted the *absence*
// of that text — it checked that HELP failed loudly on an unauthored family,
// which was correct while the prose was in flight and became a false premise
// the moment it landed. Now it asserts what the player actually gets.
//
// Both are chrome rather than narrator voice, per §10's ruling: a player
// types HELP because the fiction stopped working for them.
// ---------------------------------------------------------------------------

describe('Act I room 1 — HELP/ABOUT registered as meta verbs (fix 3)', () => {
  const saveDir = mkdtempSync(join(tmpdir(), 'ib-act1-saves-'));
  const script = writeScript(['help', 'about']);
  const { stdout, stderr, status } = play(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast']);

  it('HELP prints the authored help, including the line that teaches how to find nouns', () => {
    expect(stdout).toContain('INTENTIONALLY BLANK is a parser game.');
    expect(stdout).toContain('The things you can name are the things the writing names.');
    expect(stdout).toContain('Try odd things.');
  });

  it('ABOUT prints the authored about text', () => {
    expect(stdout).toContain('A text adventure by Ryan Grissinger.');
  });

  it('neither renders an error', () => {
    expect(stderr).not.toContain('unknown family');
  });

  it('the per-line error is caught, not fatal — the script still completes', () => {
    expect(status).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Front Desk & Lobby and Marlow (front-desk-prose task) — the room's own
// "Then prove it" script: down to the landing, down again to the desk,
// meet Marlow, greet him, ask about several things including one he is
// protecting (the visitor), examine the register, find the impression by
// tilting it into the lamp, and try the street.
// ---------------------------------------------------------------------------

describe('Front Desk & Lobby — CLI playthrough (meeting Marlow)', () => {
  const saveDir = mkdtempSync(join(tmpdir(), 'ib-act1-saves-'));
  const script = writeScript([
    'pull chain',
    'open door',
    'out',
    'down',
    'hello marlow',
    'ask marlow about name',
    'ask marlow about room',
    'ask marlow about house',
    'ask marlow about visitor',
    'examine register',
    'tilt register',
    'ask marlow about visitor',
    'ask marlow about register',
    'ask marlow about key',
    // "open entrance", not "open street door": `street_door`'s own noun
    // list (front-desk-prose §4.6, pre-existing, out of this task's own
    // module) has no bare "door" — the grammar's noun-phrase head is always
    // the LAST word of the phrase (`grammar.ts`'s `toPhrase`), so "street
    // door"/"front door" typed literally never resolve. Flagged in this
    // task's report; "entrance" is one of the object's own single-word
    // nouns and sidesteps it.
    'open entrance',
    'out',
  ]);
  const { stdout, stderr, status } = play(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast', '--diag']);

  it('runs cleanly to completion', () => {
    expect(stderr).toBe('');
    expect(status).toBe(0);
  });

  it('DOWN from the landing arrives at the Front Desk, first sight, with Marlow already there', () => {
    expect(stdout).toContain('The stairs come down into a lobby built for more people than are using it.');
    expect(stdout).toContain('There is a man behind the desk. He is awake');
  });

  it('HELLO MARLOW greets him', () => {
    const afterHello = stdout.slice(stdout.indexOf('> hello marlow'));
    expect(afterHello).toMatch(/"Still up," he says, which is not a question\.|He looks up, and waits, and is prepared to wait\./);
  });

  it('ASK MARLOW ABOUT NAME — he cannot produce it, and the clue is noted', () => {
    expect(stdout).toContain("You paid a week, in advance, and I put it in the book.");
    expect(stdout).toContain('◆ clue noted: The clerk can\'t produce your name');
  });

  it('ASK MARLOW ABOUT ROOM — the narrowness the doc marks once', () => {
    expect(stdout).toContain('Top floor, back. Three weeks');
    expect(stdout).toContain('Which is an answer about the door.');
  });

  it('ASK MARLOW ABOUT HOUSE — the house was nearly empty', () => {
    expect(stdout).toContain('Eleven rooms. Four let, counting yours.');
    expect(stdout).toContain('◆ clue noted: The house was nearly empty');
  });

  it('ASK MARLOW ABOUT VISITOR — the topic he is protecting: narrow before the impression, then pressed once it is found', () => {
    const firstAsk = stdout.slice(stdout.indexOf('> ask marlow about visitor'), stdout.indexOf('> examine register'));
    expect(firstAsk).toContain('Not while I was at the desk.');
    const secondAsk = stdout.slice(stdout.lastIndexOf('> ask marlow about visitor'), stdout.indexOf('> ask marlow about register'));
    expect(secondAsk).toContain('There was a fella came in for the top floor.');
    expect(stdout).toContain('◆ clue noted: He saw the man and can\'t describe him');
  });

  it('EXAMINE REGISTER finds the torn page and notes the clue', () => {
    expect(stdout).toContain('Between the open page and the next there is a stub.');
    expect(stdout).toContain('The page underneath where it was is blank.');
    expect(stdout).toContain('◆ clue noted: A page is missing from the register');
  });

  it('TILT REGISTER finds the impression by sight and notes the clue', () => {
    expect(stdout).toContain('the blank sheet stops being blank');
    expect(stdout).toContain('one short stroke of a pen, begun and set down, and nothing after it.');
    expect(stdout).toContain('◆ clue noted: The missing page pressed through');
  });

  it('ASK MARLOW ABOUT REGISTER, once he knows you know, sits with it rather than confessing', () => {
    const lastRegisterAsk = stdout.slice(stdout.lastIndexOf('> ask marlow about register'));
    expect(lastRegisterAsk).toContain('You tell him what is pressed into the page under the one that is missing.');
    expect(lastRegisterAsk).toContain("You'll want that towel");
  });

  it('ASK MARLOW ABOUT KEY hands over the spare', () => {
    expect(stdout).toContain("Spare's on the board.");
  });

  it('OPEN STREET DOOR then OUT reaches the real Main Street, not the old build boundary', () => {
    const afterOut = stdout.slice(stdout.lastIndexOf('> out'));
    expect(afterOut).toContain('The spring bell over the frame goes off');
    expect(afterOut).toContain('Main Street runs north and south');
    expect(afterOut).not.toContain('END OF BUILD');
  });

  it('produces no unexpected diagnostics — in particular, no topicMiss on anything asked above', () => {
    const diagLines = stdout.split('\n').filter((l) => l.startsWith('DIAG '));
    expect(diagLines).toEqual([]);
  });
});
