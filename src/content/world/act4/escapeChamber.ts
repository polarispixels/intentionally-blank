// Stage E, wave E2, task O — the Escape Chamber room shell
// (`docs/superpowers/specs/2026-09-19-stage-e2-prose.md` §6, §17.2, §21.2,
// §41). `area: 'act4'`. Objects live in `./objects/escapeChamber.ts`, the
// same split `stagingArea.ts`/`objects/stagingArea.ts` already use.

import type { HandlerDef, OnEnterRule, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { LISTEN, SMELL } from '../act1/verbs';
import { V_LOOK_UP, V_TYPE_TERMINAL } from '../act1/ids';
import { ACT3_S6_ARCHIVE_HUB } from '../act3/ids';
import { CHAMBER_SIT_FAIL_EFFECTS, CHAMBER_SIT_FIRST_EFFECTS, V_ACT4_GO_FIRST } from './objects/escapeChamber';
import {
  ACT4_CHAMBER_COMPLETE,
  ACT4_CHAMBER_DOOR_OPEN_SCRIPT,
  ACT4_CHAMBER_FIRST_DONE,
  ACT4_CHAMBER_PANEL_LIVE,
  ACT4_ESCAPE_CHAMBER,
} from './ids';

// ---------------------------------------------------------------------------
// §6.1-§6.3 — description, three rules.
// ---------------------------------------------------------------------------

const FIRST_SIGHT_TEXT =
  'A kitchen.\n\nNot a set of a kitchen, and not a room that puts you in mind of one. Linoleum on the diagonal, a pale road worn across it to the sink, a table under the window with chairs round it, a stove with a kettle standing on the back ring and a tea towel folded in three over the rail.\n\nSome of it is exact. The chip in the beading. The burn on the counter beside the stove where something got put down once by somebody in a hurry. The handle of the top drawer, worn bright down one side only, because a thumb comes at a drawer from the same angle for years. You could give a statement about any of those.\n\nAnd some of it is not. The cupboard doors have no handles on them at all. The tins along the shelf have labels and there is no printing on the labels. The pattern on the curtain over the window is a pattern for about a foot in from the edge, and after that it is a colour.\n\nBehind the door as you came in, a row of hooks with coats on them, and one hook without.\n\nAt the back of the room, past the stove, there is a door that does not belong to this house: flush, grey, with a panel beside it at shoulder height showing a single line of nothing.\n\nAnd in the middle of the floor, standing up, where the light on the linoleum says a person is standing, there is nobody.';

const UNFINISHED_TEXT =
  'The kitchen, with its exact parts and its unfinished ones. The table under the curtained window, the chairs, the stove, the hooks, and the grey door at the back with its one line of display.\n\nThe shape is where it was. The light is still going round it.';

const COMPLETE_TEXT =
  'The kitchen, with the back door standing open on a corridor that has strip lights in it, and nothing in the middle of the floor.\n\nThe light comes off the linoleum flat and even the whole way across, the way it does in an empty room.';

const description: ProseRule[] = [
  { when: { not: { visited: ACT4_ESCAPE_CHAMBER } }, text: FIRST_SIGHT_TEXT },
  { when: { not: { flag: ACT4_CHAMBER_COMPLETE } }, text: UNFINISHED_TEXT },
  { text: COMPLETE_TEXT },
];

// ---------------------------------------------------------------------------
// §17.2 — the voices call the game. Fires on entry (and re-entry) for as
// long as the first performance is outstanding — the "after each reset"
// half of the doc's own note approximates to "on the next visit," since a
// failed performance keeps the player in the room rather than sending them
// back out through the frame.
// ---------------------------------------------------------------------------

const CALL_THE_GAME_TEXT =
  'From the speaker: "Right. Board\'s out. Who\'s going?"\n\nAnd then the man\'s voice, over the noise, in the tone of somebody quoting a law of physics at a room of people who have heard it four hundred times:\n\n"House rules. Youngest goes last."\n\nThe space that comes after it is the length of a short answer, and nothing goes into it.';

const onEnter: OnEnterRule[] = [
  { once: false, when: { not: { flag: ACT4_CHAMBER_FIRST_DONE } }, effects: [{ say: CALL_THE_GAME_TEXT }] },
];

// ---------------------------------------------------------------------------
// §6.4 — room-level senses.
// ---------------------------------------------------------------------------

const SMELL_TEXT =
  'Bread, and boiled potato water, and the particular hot-dust smell of a stove that has been on for a while in a room with the window shut.\n\nNot one of those smells is coming from anywhere. The kettle is cold.';

const LISTEN_TEXT =
  'The timer on the sill, going.\n\nUnder it, from the speaker over the door, the sound a room full of people makes between sentences: a chair moving, a cup down on a saucer, somebody breathing in to say something and somebody else getting there first.';

const LOOK_UP_TEXT =
  'A ceiling in a colour that used to be white, a paper shade on a flex, and one of those pressed-tin roses round the flex that nobody has painted round properly since long before anybody in this family was born.\n\nThe shade is not moving and there is no reason for it to be.';

// ---------------------------------------------------------------------------
// §18.1's other phrasings ("GO FIRST"/"TAKE THE FIRST TURN," bare, no dobj
// — a room-level handler, per this codebase's own rule that a bare verb
// only ever consults the room's own handlers) and §21.2's panel prompt
// (bare TYPE, gated on the panel being live).
// ---------------------------------------------------------------------------

const roomHandlers: HandlerDef[] = [
  { verbs: [SMELL], effects: [{ say: SMELL_TEXT }] },
  { verbs: [LISTEN], effects: [{ say: LISTEN_TEXT }] },
  { verbs: [V_LOOK_UP], effects: [{ say: LOOK_UP_TEXT }] },
  { verbs: [V_ACT4_GO_FIRST], when: { not: { flag: ACT4_CHAMBER_FIRST_DONE } }, effects: CHAMBER_SIT_FIRST_EFFECTS },
  { verbs: [V_ACT4_GO_FIRST], effects: CHAMBER_SIT_FAIL_EFFECTS },
  { verbs: [V_TYPE_TERMINAL], when: { flag: ACT4_CHAMBER_PANEL_LIVE }, effects: [{ script: { id: ACT4_CHAMBER_DOOR_OPEN_SCRIPT } }] },
];

// ---------------------------------------------------------------------------
// §41 — the exit, and the hall.
// ---------------------------------------------------------------------------

const HALL_TRAVEL_TEXT =
  'The hall is a hall for about four feet — beading, gloss, a strip of carpet, the bottom of a staircase you do not get to see the top of — and then it is concrete, and there is a bench along the right-hand wall with a terminal on it.';

export const escapeChamberRoom: RoomDefSlice = {
  name: 'Escape Chamber',
  aliases: ['escape chamber', 'chamber', 'kitchen'],
  area: 'act4',
  description,
  onEnter,
  handlers: roomHandlers,
  exits: [
    { dir: 'w', to: ACT3_S6_ARCHIVE_HUB, travelText: HALL_TRAVEL_TEXT },
    { dir: 'out', to: ACT3_S6_ARCHIVE_HUB, travelText: HALL_TRAVEL_TEXT },
  ],
};
