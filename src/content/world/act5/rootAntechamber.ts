// Act V, wave E3, task U — the Root Antechamber (`docs/superpowers/specs/
// 2026-09-20-stage-e3-prose.md` §10-§15, §17 (Custodian/Jack schedule
// amendments live on their own act1/act2 files), §42.4). Room, the console
// (§11-§12, R18 — the login scripts are `anteScripts.ts`), the inner door
// (§15), and M17 (§14). The `e` exit to `act3_s6_archive_hub` references
// `ACT5_WELL_DOOR` (task W's own object, `wellDoor.ts`) and gates on
// `act5_root_door_open` — `door: act5_well_door` ALONE, no `when` on the
// exit itself (that object's own header note: an exit's `blockedText` only
// ever renders once the exit "exists" at all — `move.ts`'s own
// `exitCurrentlyExists`/`exitIsOpen` split — so gating existence on the
// flag would make the well door's own EXAMINE-before text unreachable as a
// `blockedText`; `act5_well_door` carries a real `container: {open: false}`
// instead, flipped by its own OPEN/UNBOLT handler). Every string below is
// transcribed verbatim (hard rule 5).

import type { HandlerDef, ObjectDefSlice, OnEnterRule, RoomDefSlice } from '../../../engine/world';
import type { WorldSlice } from '../game';
import type { ProseRule } from '../../../engine/prose';
import { USE_VERB_ID } from '../../../engine/move';
import { BREAK, EXAMINE, LISTEN, LOOK_BEHIND, PRY, PUSH, SEARCH, SMELL, TOUCH, YELL } from '../act1/verbs';
import { TAKE, OPEN } from '../act1/verbs';
import { V_KNOCK, V_TYPE_TERMINAL } from '../act1/ids';
import { ACT3_S6_ARCHIVE_HUB } from '../act3/ids';
import {
  ACT5_ANTE_CONSOLE,
  ACT5_ANTE_LOGIN_OPEN_SCRIPT,
  ACT5_BLANK_ROOM,
  ACT5_CHECKPOINT_ANTECHAMBER,
  ACT5_INNER_DOOR,
  ACT5_MEM_M17,
  ACT5_ROOT_ACCEPTED,
  ACT5_ROOT_ANTECHAMBER,
  ACT5_ROOT_SHAFT,
  ACT5_WELL_DOOR,
  V_ACT5_ANTE_LOGIN,
} from './ids';

/**
 * §16.1's own EXAMINE-before text, duplicated verbatim (hard rule 5) as
 * this room's `e` exit's `blockedText` — `wellDoor.ts` (task W's file, not
 * mine to edit) keeps its own copy as a private, unexported local, so this
 * is transcribed directly from the same spec section rather than imported.
 */
const WELL_DOOR_EXAMINE_BEFORE_TEXT_DUP =
  'Up three tiled steps: the door.\n\nOn this side it has a handle, and a bolt, and a plate with the hinge screws\nshowing, and a strip of draught seal along the top that somebody replaced at\nsome point, because the replacement came up short and there is a little\nmade-good piece let in at the corner.\n\nThere is no reader on this side. There was never going to be one.';

// ---------------------------------------------------------------------------
// §10 — the room.
// ---------------------------------------------------------------------------

const firstSightText =
  'The ladder stops in the floor of a room the size of a landing.\n\nWalls, floor and ceiling are the smooth thing the bottom of the shaft was, and\nthey run into one another without a line, so that the room is a shape and not\nan assembly. It is not white and it is not grey. It is lit, evenly, and you\ncannot find what is lighting it.\n\nThere is a door in the wall on your left with three tiled steps going up to\nit, which is the wrong way round for a door at the bottom of anything.\n\nThere is a door in the wall in front of you with nothing round it at all.\n\nAnd between them, on a stand that comes out of the floor, there is a console\nwith a screen on it, and the screen says\n\n    USER:\n\nand there is a cursor, blinking at about the rate of a resting heart.';

const unconditionalText =
  'The landing at the bottom of the ladder. A door up three tiled steps, a door\nwith nothing round it, and a console on a stand asking for a user.';

const description: ProseRule[] = [
  { when: { not: { visited: ACT5_ROOT_ANTECHAMBER } }, text: firstSightText },
  { text: unconditionalText },
];

const onEnter: OnEnterRule[] = [{ effects: [{ checkpoint: ACT5_CHECKPOINT_ANTECHAMBER }] }];

// ---------------------------------------------------------------------------
// §10.3 — room-level senses.
// ---------------------------------------------------------------------------

const listenText =
  'The water, much closer now and still not varying, and the sound of a room being\nlarge, which down here is not coming from anywhere in particular because down\nhere it does not have to.';

const smellText =
  'Nothing. Not the nothing of clean air — the nothing the smooth part of the\nshaft had, which is a surface with no history on it.';

const touchWallFloorText =
  'Warm, and hard, and slightly giving, in the way a very good floor in a very old\nbuilding is slightly giving, and there is no grain in it and no cold in it and\nnothing anywhere that your fingers can find an edge on.';

const searchRoomText =
  'There is no behind. The stand comes out of the floor the way the bench in the\nnext room comes out of the wall, and the cable that ought to be under it is\nnot, and there is nowhere for it to have gone.';

const yellText = 'It does not come back. Not swallowed — simply not returned, the way a shout is\nnot returned in a field.';

const roomHandlers: HandlerDef[] = [
  { verbs: [LISTEN], effects: [{ say: listenText }] },
  { verbs: [SMELL], effects: [{ say: smellText }] },
  { verbs: [TOUCH], effects: [{ say: touchWallFloorText }] },
  { verbs: [SEARCH], effects: [{ say: searchRoomText }] },
  { verbs: [YELL], effects: [{ say: yellText }] },
  // §12 — "LOG IN"/"TYPE"/"PRESS KEY" (`V_TYPE_TERMINAL`, bare, already
  // global vocabulary — same idiom `act3/s6ArchiveHub.ts`'s own Hub login
  // uses) and "TYPE ADMIN" (`V_ACT5_ANTE_LOGIN`, this wave's own bare
  // 2-word phrase, `./ids.ts`). Ungated (no "already logged in" branch is
  // authored for this console — see this task's report): re-triggering
  // after `act5_root_accepted` just re-opens the prompt and a correct
  // re-entry re-applies the same, now idempotent, success effects.
  { verbs: [V_TYPE_TERMINAL, V_ACT5_ANTE_LOGIN], effects: [{ script: { id: ACT5_ANTE_LOGIN_OPEN_SCRIPT } }] },
];

// ---------------------------------------------------------------------------
// §11 — the console. §42.2's own noun ruling: `console`/`stand`/`prompt`
// (NOT `terminal` — that word is reserved for `act5_root_terminal`, task
// V's, one room over); both objects take `machine`/`screen`.
// ---------------------------------------------------------------------------

const consoleExamineText =
  'A screen on a stand, with a keyboard shelf under it and nothing else: no case,\nno vents, no maker\'s plate, no switch, and no way of telling whether it is on\nbecause it has never been off.\n\n    USER:\n\nThe cursor is doing the only thing in this room that is happening.\n\nIt is the same prompt, in the same lettering, at the same size, as the one on\nthe machine standing in a rented room over a hardware store with a stain on\nthe boards beside it. It has been asking a long time.';

/**
 * §11.2 — "TYPE"/"USE CONSOLE" without invoking the structured login
 * (`USE_VERB_ID` with a resolved dobj; bare "TYPE"/"LOG IN" always reaches
 * the room's own login handler above instead, since a bare verb with no
 * dobj can never reach an object's own handlers — see this room's own
 * header note above and `s5ReactorInterface.ts`'s identical rule). No
 * distinct post-`act5_root_accepted` variant is authored for this text
 * either — see this task's report.
 */
const consoleUseWithoutLoggingInText =
  'The cursor takes everything you give it without comment and does not move off\nthe line it is on, because it is not a line you write on. It is a label.\n\nUnderneath it, when you stop, there is a second label, and it says PASSWORD:,\nand it has been there the whole time.';

const consoleTakeBreakPryText =
  'The leg goes in over the top of the screen bezel and finds a screen bezel\nunderneath it, and behind the stand there is more floor.\n\nYou stop, on the grounds that you have come a long way to be at this machine\nand it would be a poor sort of afternoon to spend the last of it taking it\napart.';

const consoleLookBehindSearchText =
  'Nothing on it, under it or behind it. No paper taped anywhere, no card in a\nholder, no biro line on the bezel, nothing at all written down within reach of\nthis machine.\n\nWhich is unusual, in a building where everything else is.';

const anteConsole: ObjectDefSlice = {
  location: ACT5_ROOT_ANTECHAMBER,
  name: 'console',
  portable: false,
  nouns: ['console', 'screen', 'machine', 'cursor', 'prompt', 'stand', 'keyboard'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: consoleExamineText }] },
    { verbs: [USE_VERB_ID], effects: [{ say: consoleUseWithoutLoggingInText }] },
    { verbs: [TAKE, BREAK, PRY], effects: [{ say: consoleTakeBreakPryText }] },
    { verbs: [LOOK_BEHIND, SEARCH], effects: [{ say: consoleLookBehindSearchText }] },
  ],
};

// ---------------------------------------------------------------------------
// §15 — the inner door. `container: {open: false}`, synced to `true` by
// the login-success script (`anteScripts.ts`, once, permanent — no separate
// sync event needed) so the `n` exit (below) gets a real `blockedText`.
// ---------------------------------------------------------------------------

const innerDoorExamineAfterText =
  'A leaf of the same material as the wall it is in, standing a finger\'s width off\nits seal, with the room\'s even light going through the gap and not lighting\nanything on the other side of it.\n\nThere is no handle. There is no frame. There is the line where it stops being\nwall, and there was not one of those an hour ago.';

/** §15.2 — also this room's own `n` exit's `blockedText`, below. */
export const INNER_DOOR_EXAMINE_BEFORE_TEXT =
  'There is a door in the wall in front of you in the sense that there is a\nrectangle of the wall which is a door.\n\nNo handle, no keyway, no reader, no gap, no seam you can get a nail into. It\nis not shut against you. It has not been asked yet.';

const innerDoorExamine: ProseRule[] = [
  { when: { flag: ACT5_ROOT_ACCEPTED }, text: innerDoorExamineAfterText },
  { text: INNER_DOOR_EXAMINE_BEFORE_TEXT },
];

const innerDoorOpenPushText =
  'It does not move, and it does not resist either. Pushing it is like pushing the\nwall on either side of it, which is exactly what you are doing.';

/** §15.3 — the root door's own shipped knock line, verbatim, on a different door — the one sentence in the game used twice on purpose (not counted per that section's own note). */
const innerDoorKnockText =
  'Your knuckles do not make a noise on it. They make a smaller noise than they\nmake on your own hand.';

const innerDoor: ObjectDefSlice = {
  location: ACT5_ROOT_ANTECHAMBER,
  name: 'inner door',
  portable: false,
  container: { open: false },
  nouns: ['door', 'inner door', 'leaf', 'far door', 'north door'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: innerDoorExamine }] },
    { verbs: [OPEN, PUSH], when: { not: { flag: ACT5_ROOT_ACCEPTED } }, effects: [{ say: innerDoorOpenPushText }] },
    { verbs: [V_KNOCK], effects: [{ say: innerDoorKnockText }] },
  ],
};

// ---------------------------------------------------------------------------
// §14 — M17, "A Voice Reading a List." Ambient `trigger` (same idiom
// `act3/knowledge.ts`/`act4/knowledge.ts` use), fires on the tick after
// arrival, after the room's own description — the knowledge tick step is a
// separate output from `renderArrival`'s (E2 §4.1's "two outputs, never
// concatenated" rule). No variants, no profile arm.
// ---------------------------------------------------------------------------

export const ACT5_ROOT_ANTECHAMBER_MEMORIES: NonNullable<WorldSlice['memories']> = {
  [ACT5_MEM_M17]: {
    title: 'A Voice Reading a List',
    lines: [
      'White.',
      'Not a colour. An absence of anything for the eye to do, in every direction, at the same distance.',
      'A voice above and a little to the left, going down a list. It is not talking to anybody. It is reading the way a man reads a delivery note back to himself to be sure he has got it.',
      'Occupation. A word.',
      'Memory state. A gap where a word goes, and no word going in it.',
      'Objects, said one at a time, with a small pause after each one, and it is the pauses you have and not the things.',
      'Then the list stops, and the voice says something short that is not on the list, and it is the first thing anybody has ever said in front of you.',
    ],
    trigger: { when: { visited: ACT5_ROOT_ANTECHAMBER } },
  },
};

// ---------------------------------------------------------------------------
// The room.
// ---------------------------------------------------------------------------

export const rootAntechamberRoom: RoomDefSlice = {
  name: 'Root Antechamber',
  area: 'act5',
  description,
  onEnter,
  handlers: roomHandlers,
  exits: [
    { dir: 'up', to: ACT5_ROOT_SHAFT },
    { dir: 'n', to: ACT5_BLANK_ROOM, door: ACT5_INNER_DOOR, blockedText: INNER_DOOR_EXAMINE_BEFORE_TEXT },
    // `door: act5_well_door` ALONE, no `when` — see this file's header note.
    { dir: 'e', to: ACT3_S6_ARCHIVE_HUB, door: ACT5_WELL_DOOR, blockedText: WELL_DOOR_EXAMINE_BEFORE_TEXT_DUP },
  ],
};

export const ACT5_ROOT_ANTECHAMBER_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT5_ANTE_CONSOLE]: anteConsole,
  [ACT5_INNER_DOOR]: innerDoor,
};
