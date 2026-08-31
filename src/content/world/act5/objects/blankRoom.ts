// E3 task V — Part Three's objects: the Blank Room's terminal (§21), the
// creation record (§22 — R19), the index (§23), the Jules snapshot (§24 —
// P27/R20), the tray and the letter (§25), the locker/cache (§26), and the
// way back door (§27). Every string below is transcribed verbatim from
// `docs/superpowers/specs/2026-09-20-stage-e3-prose.md` (hard rule 5).
//
// Also amends four SHARED objects from earlier acts (the notebook, the
// undeveloped canister, the two developed prints, and the USB) with a
// `PUT_IN`/`withInstrument: [ACT5_LOCKER]` handler each (§26.3-§26.6) —
// the same "mutate an already-declared object's `handlers` array in place"
// idiom `act3/objects/s6ArchiveHub.ts` already uses for the USB/notebook
// (that file's own header comment explains why: `actions.ts`'s `findHandler`
// only ever consults ONE `world.objects[dobj].handlers` array, so two
// tasks' handlers for the same object must live on that one array, not two
// competing declarations). Guarded by an "already wired" check exactly like
// that precedent, in case this module is ever imported twice.

import type { Effect } from '../../../../engine/effects';
import type { EventDef, GameEvent, ObjectDefSlice, ScriptFn } from '../../../../engine/world';
import { O, samePlace } from '../../../../engine/ids';
import type { ObjectId } from '../../../../engine/ids';
import { objectLocation } from '../../../../engine/resolve';
import { render } from '../../../../engine/prose';
import { VERB_DEFAULTS } from '../../../responses';
import { CHAIR_LEG } from '../../act1/ids';
import { BREAK, CLOSE, EXAMINE, HELLO, LISTEN, LOCK, LOOK_BEHIND, LOOK_UNDER, OPEN, PRY, PUT_IN, READ, SEARCH, TOUCH } from '../../act1/verbs';
import { USE_VERB_ID } from '../../../../engine/move';
import {
  ACT5_BLANK_ROOM,
  ACT5_BLANK_ROOM_DOOR,
  ACT5_CACHED_FILM,
  ACT5_CACHED_LETTER,
  ACT5_CACHED_NOTEBOOK,
  ACT5_CACHED_USB,
  ACT5_CLUE_LOCKER,
  ACT5_CLUE_MADE_BY_JULES,
  ACT5_CREATION_RECORD,
  ACT5_INDEX,
  ACT5_JULES_SNAPSHOT,
  ACT5_JULES_WOKEN,
  ACT5_LETTER_TO_JACK,
  ACT5_LOCKER,
  ACT5_LOCKER_CONTENTS_SCRIPT,
  ACT5_RECONCILIATION_RUNNING,
  ACT5_ROOT_TERMINAL,
  ACT5_TRAY,
  ACT5_WAKE_JULES_SCRIPT,
  EVENT_ACT5_EV_LOCKER,
} from '../ids';
import { ACT4_DEEP_INDEX } from '../../act4/ids';
import { ACT2_Q_HOW_WAS_IT_HERE } from '../../act2/ids';
import { ACT3_Q_WHAT_ARE_THESE_PEOPLE } from '../../act3/ids';
import { SNAPSHOT_FIELD_LINE, WAKE_SECOND } from '../formScripts';

// ---------------------------------------------------------------------------
// §20 — room-level ambient sense/text constants, exported for `../blankRoom`
// (the room-level file) to wire as bare-verb `RoomDefSlice.handlers`, plus a
// small local scenery object for "wall"/"floor"/"ceiling"/"room" (TOUCH/PRY/
// BREAK/SEARCH need a resolvable dobj — the same "give the room its own
// wall/floor object" idiom `act1/objects/misc.ts` and several Act III rooms
// already use). Not part of the E3 shared `ids.ts` — the architect's
// pre-declared object list has no such object, and the shared-file protocol
// restricts this task's `ids.ts` additions to verb ids only — so its id is
// declared locally here, used only within this file.
// ---------------------------------------------------------------------------

export const BLANK_ROOM_FIRST_SIGHT =
  'The door opens into a room with nothing in it.\n\nThat is not a way of putting it and it is not the dark doing it. The light is even and comes from no fitting you can find. The floor is the material the bottom of the shaft was, and so are the walls, and so is the ceiling, and there is no line anywhere that any two of them meet on, so that standing in the doorway you have to look at your own boots to find out where the floor is.\n\nAgainst the far wall, on a bench that comes out of the wall the way a branch comes out of a tree, there is a terminal.\n\nUnder the bench there is a grey steel cabinet, waist high, with its door standing open.\n\nThat is the room.\n\nEvery room you have been in since you woke up had been gone through by somebody, and you find that you are standing in this doorway waiting for somebody to have gone through this one, and nobody has, and nobody is going to, because there has never been a single thing in here to take.';

export const BLANK_ROOM_UNCONDITIONAL =
  'Nothing in here but a bench with a terminal on it and a steel cabinet under the bench, in a room with no corners and no shadows and no way of telling which wall you came in by until you turn round.';

export const BLANK_ROOM_LISTEN =
  'The water. Directly underneath now, at the same steady rate it has kept since the top of the ladder, and it is the only thing in the world that is doing anything.';

export const BLANK_ROOM_SMELL =
  'Nothing at all, again, and by now you have stopped finding it strange, which is its own piece of information about how long you have been down here.';

const BLANK_ROOM_TOUCH_WALL =
  'Warm, and hard, and very faintly giving. Your palm leaves no mark on it and takes nothing off it.';

export const BLANK_ROOM_SEARCH =
  'The cabinet is under the bench and it is empty. The bench is part of the wall. The terminal is on the bench, and there is no cable coming out of the back of it and nowhere for one to go.\n\nThere is nothing else. You go round the walls once with a hand out, because that is what you do, and the walls go round with you.';

export const BLANK_ROOM_SLEEP_WAIT =
  'You could. The floor is warm and the light is even and nobody is coming.\n\nYou do not.';

export const BLANK_ROOM_YELL = 'Not returned. Not even slightly.';

export const BLANK_ROOM_PRY_WALL =
  'There is no join to get it into, no skirting, no cover strip and no edge, and after a while you are standing in the middle of a warm room hitting it with a piece of a chair, which is not a thing you are prepared to have been doing for long.';

const BLANK_ROOM_SURFACE = O('act5_blank_room_surface');

const blankRoomSurface: ObjectDefSlice = {
  location: ACT5_BLANK_ROOM,
  name: 'wall',
  portable: false,
  nouns: ['wall', 'walls', 'floor', 'ceiling', 'room', 'corner', 'corners'],
  handlers: [
    { verbs: [TOUCH], effects: [{ say: BLANK_ROOM_TOUCH_WALL }] },
    { verbs: [PRY], withInstrument: [CHAIR_LEG], effects: [{ say: BLANK_ROOM_PRY_WALL }] },
    { verbs: [BREAK], effects: [{ say: BLANK_ROOM_PRY_WALL }] },
    { verbs: [SEARCH, LOOK_UNDER, LOOK_BEHIND], effects: [{ say: BLANK_ROOM_SEARCH }] },
  ],
};

// ---------------------------------------------------------------------------
// §21 — the terminal. L3, station five, and the last.
// ---------------------------------------------------------------------------

const TERMINAL_EXAMINE =
  'It is the same machine.\n\nBeige gone the colour of weak tea. A screen with actual depth to it. A keyboard whose keys have been worn blank in exactly the places a person\'s fingers live.\n\nIt is the same machine as the one on a stand in a rented room with a stain on the boards beside it, and the one in the back of a shop full of plaster jackalopes, and the one on the bench on the floor above this one, and the one bolted to a bulkhead a very long way from here. It is standing on a shelf that grew out of a wall, in a room with no corners, under a county, and it is the same machine.\n\nThere is no USER: on it. There is no cursor.\n\nIt is not asking anything.';

export const TERMINAL_TYPE =
  'The keys go down with the deep unembarrassed travel of a machine built when people were expected to sit at them all day.\n\nNothing appears. Nothing is refused either. It has already had that conversation, in the other room, with you.\n\nDown the left-hand side of the screen there is a short list of the things it does hold, in the lettering the ledger used, and the list is not long.';

const TERMINAL_LIST_HEADING = '    RECORDS\n    INDEX CREATE SUBJECT';

const TERMINAL_LIST_NARRATION =
  'Three headings and no menu numbers and no instructions, the way a thing is labelled when the only people who were ever going to read it already knew.';

const TERMINAL_LIST_COMBINED = `${TERMINAL_LIST_HEADING}\n\n${TERMINAL_LIST_NARRATION}`;

export const CREATE_SUBJECT_APPROACH =
  'The third heading takes one keystroke, the way the other two did.\n\nThe screen clears itself and puts up a form, and the form is the record with the answers taken out of it.';

const terminal: ObjectDefSlice = {
  location: ACT5_BLANK_ROOM,
  name: 'terminal',
  portable: false,
  // §42.2's binding noun split: the terminal takes `terminal`/`bench`; the
  // console (a different room, task U's) also takes `machine`/`screen` —
  // harmless, the two rooms are never in scope together.
  nouns: ['terminal', 'computer', 'machine', 'monitor', 'screen', 'keyboard', 'bench', 'list'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: TERMINAL_EXAMINE }] },
    { verbs: [READ], effects: [{ say: TERMINAL_LIST_COMBINED }] },
    // §21.2's own three forms — "TYPE / USE TERMINAL / LOG IN at it" — read
    // as one no-op response; `USE_VERB_ID` (dobj=terminal) lands here, bare
    // `TYPE`/`LOG IN` (no dobj, `V_TYPE_TERMINAL`) on the room (`../blankRoom.ts`).
    { verbs: [USE_VERB_ID], effects: [{ say: TERMINAL_TYPE }] },
    { verbs: [SEARCH, LOOK_UNDER, LOOK_BEHIND], effects: [{ say: BLANK_ROOM_SEARCH }] },
  ],
};

// ---------------------------------------------------------------------------
// §22 — the creation record (R19). `{clue: ACT5_CLUE_MADE_BY_JULES}` is
// reused as the "have I read this before" signal (granted on first read,
// never revoked) rather than a second flag — no new state needed at all.
// ---------------------------------------------------------------------------

const RECORD_BLOCK =
  '    CREATE SUBJECT — RECORD\n\n    AUTHOR ............................ JULES I SUBJECT DESIGNATION ............... — OCCUPATION ........................ INVESTIGATOR INITIAL MEMORY STATE .............. INTENTIONALLY BLANK STARTING ENVIRONMENT .............. MAIN ST / TOP FLOOR REAR INITIAL PHYSICAL CONDITION ........ HEADACHE PHYSICAL PARAMETERS ............... RANDOMIZED — 1 EXCEPTION, SUPPRESSED INITIAL OBJECTS ................... FEDORA (WORN) LAMP TERMINAL PAGE 7/8 (HATBAND) CHAIR — ONE LEG LOOSE';

const RECORD_FIRST_READ =
  `There is one record under that heading that is more recent than the others, and it is more recent because nothing has been done at this level since it was written.\n\n${RECORD_BLOCK}`;

const RECORD_EVERY_READ = RECORD_BLOCK;

export const RECORD_PRINT =
  'There is a tray on the side of the machine that a printer prints into, and whatever else this terminal is for, it is not for that.\n\nYou write it down instead, on paper, in your own hand, which is the only technology in this county that has been reliable all week.';

const recordFirstReadEffects: Effect[] = [
  { say: RECORD_FIRST_READ },
  { grantClue: ACT5_CLUE_MADE_BY_JULES },
  { answerQuestion: ACT3_Q_WHAT_ARE_THESE_PEOPLE },
  { answerQuestion: ACT2_Q_HOW_WAS_IT_HERE },
];

// `PRINT RECORD`/`TAKE RECORD`/`COPY RECORD` — a distinct verb id, added
// below (`../ids.ts`... no: this is a fixed *pattern* on existing verbs, not
// a new phrase — `TAKE`/`SEARCH`-adjacent words aren't right for "print"/
// "copy", so this needs its own bare fixed-phrase verb; see `V_ACT5_PRINT_
// RECORD` note at the bottom of this file's verb re-exports.
const record: ObjectDefSlice = {
  location: ACT5_BLANK_ROOM,
  name: 'creation record',
  portable: false,
  nouns: ['record', 'records', 'creation record', 'file', 'entry', 'subject record'],
  handlers: [
    { verbs: [READ, OPEN, EXAMINE, SEARCH], when: { not: { clue: ACT5_CLUE_MADE_BY_JULES } }, effects: recordFirstReadEffects },
    { verbs: [READ, OPEN, EXAMINE, SEARCH], effects: [{ say: RECORD_EVERY_READ }] },
  ],
};

// ---------------------------------------------------------------------------
// §23 — the index.
// ---------------------------------------------------------------------------

const INDEX_EXAMINE =
  '    INDEX\n\nUnder it, the index: not names this time but fields of them, arranged the way the ledger upstairs was arranged, with a status word after each, and for line after line after line the status word is the same one.\n\nYou hold the key down and they go up the screen and it does not stop, and you take your finger off it, because you have done this once already this week five floors up and it ended somewhere.';

export const INDEX_SEARCH_JULES_PLAIN =
  '    SEARCH: JULES\n\n    1 RESULT\n\n    JULES I SNAPSHOT ......................... ARCHIVED / ROOT\n\nUpstairs that line was the end of a file that said NO FURTHER ACTION under it.\n\nDown here it is not the end of anything. It is an address, and you are standing at it.';

export const INDEX_SEARCH_JULES_DEEP =
  '    SEARCH: JULES\n\n    1 RESULT\n\n    JULES I SNAPSHOT ......................... ARCHIVED / ROOT INDEX ............................ COMPLETE — 1 SESSION\n\n    OPEN?\n\nThe second line was not there a moment ago, and it was not written by this machine. It was written by a kitchen, at about the time a kitchen finished being a kitchen, by a room that had been waiting for somebody to sit in the first chair.';

export const INDEX_SEARCH_OTHER =
  '    1 RESULT\n\nand after it, in the field where a word goes, the word that is in that field on every line but one.';

export const INDEX_SEARCH_SELF =
  '    SEARCH:\n\nThe cursor waits. You get as far as the first letter of a word that is not a name, and stop, and the cursor goes on waiting, because that is the one thing these machines have always been good at.';

const indexSearchJulesEffects: Effect[] = [
  { if: { when: { flag: ACT4_DEEP_INDEX }, then: [{ say: INDEX_SEARCH_JULES_DEEP }], else: [{ say: INDEX_SEARCH_JULES_PLAIN }] } },
];

const index: ObjectDefSlice = {
  location: ACT5_BLANK_ROOM,
  name: 'index',
  portable: false,
  nouns: ['index', 'archive', 'snapshots', 'ledger', 'directory'],
  handlers: [
    { verbs: [EXAMINE, READ], effects: [{ say: INDEX_EXAMINE }] },
    // §23.2 — bare "SEARCH INDEX" (no iobj — §23.2's own "(prompt or fixed
    // phrase)" leaves the mechanism to the builder) and "SEARCH INDEX FOR
    // JULES" (iobj resolves to the snapshot object — his is the only named
    // "other" thing ever physically present in this room, `SEARCH`'s own
    // extended `for` preposition, `../formScripts.ts`) both reach the same
    // gated text at zero vocabulary cost. Every other name (§23.4 — jack,
    // nolan, luke, sissy, whitlock, marlow, pearl, dot, eli) is never
    // physically present here, so its noun can't resolve as an iobj the
    // same way; those stay their own fixed multi-word bare verb
    // (`V_ACT5_INDEX_SEARCH_OTHER`, `../blankRoom.ts`), same idiom the
    // shipped ledger's own "SEARCH LEDGER FOR JACK" etc. already use.
    { verbs: [SEARCH], withInstrument: 'none', effects: indexSearchJulesEffects },
    { verbs: [SEARCH], withInstrument: [ACT5_JULES_SNAPSHOT], effects: indexSearchJulesEffects },
  ],
};

// ---------------------------------------------------------------------------
// §24 — waking Jules (P27, R20). Not an NPC: an object, `snapshot`/`jules`,
// whose OPEN/HELLO(WAKE) handlers run the `act5_wake_jules` script (which
// does all of the refusal/once/repeat branching itself — see
// `../formScripts.ts`). Bare `OPEN` at the index (no dobj) is wired on the
// room itself (`../blankRoom.ts`), per §42.2's collision note.
// ---------------------------------------------------------------------------

const julesSnapshot: ObjectDefSlice = {
  location: ACT5_BLANK_ROOM,
  name: 'snapshot',
  portable: false,
  hidden: false,
  nouns: ['snapshot', 'jules'],
  handlers: [
    { verbs: [OPEN, HELLO], effects: [{ script: { id: ACT5_WAKE_JULES_SCRIPT } }] },
    // Stage F1 sweep — "X SNAPSHOT" used to fall to a generic. Shipped
    // text only, no new sentence: the ledger field line before
    // `act5_jules_woken` (`../formScripts.ts`'s `SNAPSHOT_FIELD_LINE`),
    // and §24.4's own repeat text after (`WAKE_SECOND`).
    { verbs: [EXAMINE], when: { flag: ACT5_JULES_WOKEN }, effects: [{ say: WAKE_SECOND }] },
    { verbs: [EXAMINE], effects: [{ say: SNAPSHOT_FIELD_LINE }] },
  ],
};

// ---------------------------------------------------------------------------
// §25 — the tray and the letter. The letter starts `hidden: true`, `{ on:
// ACT5_TRAY }`, revealed by `act5_wake_jules` (`{ reveal: ACT5_LETTER_TO_
// JACK }`) — never moved, so it is always physically "in" the tray, dark or
// not (moot here — the room is never dark).
// ---------------------------------------------------------------------------

const TRAY_EXAMINE_BEFORE =
  'A printer tray on the side of the machine, of the kind that folds out and has one wire lip to stop paper going over the front of it.\n\nThere is nothing in it. There has been nothing in it for a long time; the two rubber feet the paper would sit on have not been sat on.';

const TRAY_EXAMINE_AFTER = 'One sheet, face up, still warm at the top edge where it came out.';

const tray: ObjectDefSlice = {
  location: ACT5_BLANK_ROOM,
  name: 'tray',
  portable: false,
  supporter: true,
  nouns: ['tray', 'printer tray'],
  handlers: [
    // "After §24.3" == the letter is no longer hidden (revealed by
    // `act5_wake_jules`) — the tray's own physical state, not a second flag.
    { verbs: [EXAMINE], when: { not: { objectState: [ACT5_LETTER_TO_JACK, 'hidden', true] } }, effects: [{ say: TRAY_EXAMINE_AFTER }] },
    { verbs: [EXAMINE], effects: [{ say: TRAY_EXAMINE_BEFORE }] },
  ],
};

const letterExamineText =
  'Half a page, in the machine\'s lettering, which is nobody\'s hand at all.\n\nIt is not addressed and it is not signed, and it does not need either of those things, because there is exactly one man alive it could be for and he will know by the second line.\n\nYou read the first two lines of it and then you stop, and fold it in half, and put it in the inside pocket, which has a hole in it and has had all week, and you feel it go down and settle at the bottom of the lining where nothing else is.';

// §25.4 — "TAKE LETTER before §24.3, or READ LETTER with nothing in the
// tray." Transcribed, but NOT wired to a handler: the letter object stays
// `hidden: true` until `act5_wake_jules` reveals it, so before that point
// "TAKE LETTER"/"READ LETTER" can't resolve a dobj at all (the object is
// out of scope) and falls to the engine's own generic "you don't see that"
// family — which already reads correctly here ("nothing to take/read").
// Giving the TRAY object "letter" as an extra noun to reach this text would
// make it collide with the real letter's own noun the moment it IS
// revealed (both in scope, sharing one word) — flagged in this task's
// report rather than risking that regression for one edge-case line.
const letterEmptyTrayText = 'The tray is empty and the machine is not printing anything.';
void letterEmptyTrayText;

const letterToJack: ObjectDefSlice = {
  location: { on: ACT5_TRAY },
  hidden: true,
  name: 'letter',
  portable: true,
  plotCritical: true,
  // §42.2: the new letter takes `printed`/`page`/`half page`/`sheet` and
  // bare `LETTER` in the Blank Room; elsewhere the returned letter (a
  // different, already-shipped object) keeps bare `LETTER` — since the two
  // are never in scope together (this one starts hidden, only revealed in
  // this room), bare `letter` here is unambiguous.
  nouns: ['letter', 'printed', 'page', 'half page', 'sheet'],
  handlers: [{ verbs: [EXAMINE, READ], effects: [{ say: letterExamineText }] }],
};

// ---------------------------------------------------------------------------
// §26 — the locker (the cache). An ordinary open container: `container: {
// open: true }`. The four specific cache handlers below live on the SHARED
// objects (notebook/canister/prints/usb) and this file's own new `letter`
// object; the general case and TAKE-FROM are room-level instrument handlers
// (`../blankRoom.ts`) since they must answer for ANY dobj, not one this file
// declares.
// ---------------------------------------------------------------------------

const LOCKER_EXAMINE =
  'A grey steel cabinet, waist high, standing under the bench with its door open against the wall on a stay.\n\nOrdinary. Rolled edges, a shelf halfway up, four rubber feet, a hasp on the door with no padlock through it. It is the only thing in this room you have seen the like of anywhere else, and where you have seen the like of it is every plant room and tool crib and back corridor in the county.\n\nThere is nothing in it and nothing written on it, inside or out, and no card in the holder on the front, and no holder on the front.\n\nIt is below the level at which anything in this building is written down.';

export const LOCKER_PUT_GENERAL =
  'It goes on the shelf. The steel takes the weight the way steel does and the cabinet goes on being a cabinet.\n\nNothing acknowledges it. No line appears anywhere on any screen in this room. That is the whole of what you came down here to do with it.';

const LOCKER_PUT_NOTEBOOK =
  'You go through it once more first, which is not necessary and takes a while.\n\nFacilities shorthand in one hand for two hundred pages, and then, down the margins and across the backs of the diagrams, the same shorthand in the same hand written by somebody else, three weeks ago, working out what the first lot meant.\n\nThe page fits the gap. The login is in the back. It goes on the shelf.';

const LOCKER_PUT_FILM =
  'On the shelf, squared up with the notebook, because a photograph left loose in a steel box is a photograph with a bend in it by the time anybody comes back.';

const LOCKER_PUT_USB_WITH_DAD =
  'You have to take it off the rig first.\n\n"Right," Dad says, before you have got it half out. "Well."\n\nThen nothing, because there is nothing to make the nothing with.\n\nIt goes on the shelf, a piece of plastic the size of a thumb joint with a man in it who is not going to experience being on that shelf, and you put it at the back, out of the light, which does not matter to it either.';

const LOCKER_PUT_LETTER =
  'You get it out of the lining, which takes some doing, and hold it for a moment with the idea of taking it up the ladder and putting it under a door at the Arrowhead.\n\nThere is a man standing at the top of a well between here and there.\n\nIt goes on the shelf, on top of the notebook, where the first thing anybody opening this cabinet will find is a half page addressed to nobody that only one man could be meant to read.';

export const LOCKER_TAKE_FROM =
  'Out again, and the cabinet goes back to being empty, which it is extremely good at.';

const LOCKER_CLOSE_LOCK =
  'The door swings to on its stay and does not catch, because the hasp has no padlock through it and never had.\n\nYou leave it standing open. A shut cupboard in an empty room is a thing somebody looks in.';

const locker: ObjectDefSlice = {
  location: ACT5_BLANK_ROOM,
  name: 'locker',
  portable: false,
  container: { open: true },
  nouns: ['cabinet', 'locker', 'steel cabinet', 'cupboard', 'box', 'shelf'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: LOCKER_EXAMINE }, { grantClue: ACT5_CLUE_LOCKER }] },
    { verbs: [CLOSE, LOCK], effects: [{ say: LOCKER_CLOSE_LOCK }] },
    // Stage F1 — `SEARCH`'s own words (`act1/verbs.ts`) already cover
    // "LOOK IN LOCKER"/"LOOK THROUGH LOCKER"/"RUMMAGE LOCKER" as the same
    // verb id, so one handler answers every phrasing the gap list names.
    { verbs: [SEARCH], effects: [{ script: { id: ACT5_LOCKER_CONTENTS_SCRIPT } }] },
  ],
};

/**
 * Stage F1 — `SEARCH`/`LOOK IN LOCKER`'s contents listing (§26.7's own
 * note: "LOOK IN-able", canon 91/108 — nothing is a cache, nothing is
 * consumed, everything re-findable). A script, not a static handler,
 * because the contents are genuinely dynamic (`PUT <anything> IN LOCKER`
 * accepts any portable object, `LOCKER_PUT_GENERAL` above, not just the six
 * named cache items) — computed fresh from `objectLocation` every call, the
 * same "in": container check `samePlace` exists for.
 *
 * Empty locker: renders the SAME shipped generic `search` family the
 * fallback path already used before this task (no new sentence, per this
 * task's own brief) — a genuine no-op for that case, not a new response.
 *
 * Non-empty: lists each contained object's display name, one per line, in
 * the INVENTORY idiom's own mechanism (`respond.ts`'s `respondToInventory` —
 * a plain `kind: 'system'` line per item), now preceded by one `kind:
 * 'system'` chrome line, `IN THE CABINET:` (Stage F1 sweep — the
 * knowledge-view idiom's own caps chrome, not narration, same register as
 * the INVENTORY header/the ledger's own field listings; not new prose in
 * the sense hard rule 5 guards against). Empty-locker behavior below is
 * unchanged: there is no shipped line for "here is what a searched empty
 * container holds" (the doc's own §26 never authors one, and canon 108
 * explicitly refuses to call this a cache/plan/message), so inventing one
 * would be new player-visible prose this task cannot write. Flagged in
 * this task's report as a `narrative-writer` opportunity if Ryan wants a
 * proper header there too.
 */
export const act5LockerContents: ScriptFn = (world, state) => {
  const ids = Object.keys(world.objects ?? {}) as ObjectId[];
  const items = ids
    .filter((id) => samePlace(objectLocation(world, state, id), { in: ACT5_LOCKER }))
    .map((id) => world.objects![id]!.name ?? id);

  if (items.length === 0) {
    const rendered = render(world, state, 'script.act5_locker_contents.empty', VERB_DEFAULTS.search, { name: 'locker', dobj: 'locker' });
    return { state: rendered.state, events: [{ type: 'line', kind: 'prose', text: rendered.text }] };
  }

  return {
    state,
    events: [
      { type: 'line', kind: 'system', text: 'IN THE CABINET:' },
      ...items.map((name): GameEvent => ({ type: 'line', kind: 'system', text: name })),
    ],
  };
};

// `act5_ev_locker` (§2's flags table, §26): watches the four `objectAt`
// conditions and sets the matching `act5_cached_*` flag(s). `once: false` —
// it must keep re-checking every tick, since a `once: true` event would
// lock in on whichever item lands in the locker FIRST and never fire again
// for the other three. Each `set` is independently gated and idempotent, so
// firing repeatedly (including after all four are already true) is
// harmless. Registered under `EVENT_ACT5_EV_LOCKER` in `../index.ts`.
export const ACT5_EV_LOCKER_EVENT: EventDef = {
  id: EVENT_ACT5_EV_LOCKER,
  once: false,
  when: {
    any: [
      { objectAt: [ACT2_NOTEBOOK, { in: ACT5_LOCKER }] },
      { objectAt: [ACT2_FILM_CANISTER, { in: ACT5_LOCKER }] },
      { objectAt: [ACT4_PRINT_SKY, { in: ACT5_LOCKER }] },
      { objectAt: [ACT4_PRINT_LAST_DAY, { in: ACT5_LOCKER }] },
      { objectAt: [ACT2_USB, { in: ACT5_LOCKER }] },
      { objectAt: [ACT5_LETTER_TO_JACK, { in: ACT5_LOCKER }] },
    ],
  },
  effects: [
    { if: { when: { objectAt: [ACT2_NOTEBOOK, { in: ACT5_LOCKER }] }, then: [{ set: [ACT5_CACHED_NOTEBOOK, true] }] } },
    {
      if: {
        when: {
          any: [
            { objectAt: [ACT2_FILM_CANISTER, { in: ACT5_LOCKER }] },
            { objectAt: [ACT4_PRINT_SKY, { in: ACT5_LOCKER }] },
            { objectAt: [ACT4_PRINT_LAST_DAY, { in: ACT5_LOCKER }] },
          ],
        },
        then: [{ set: [ACT5_CACHED_FILM, true] }],
      },
    },
    { if: { when: { objectAt: [ACT2_USB, { in: ACT5_LOCKER }] }, then: [{ set: [ACT5_CACHED_USB, true] }] } },
    { if: { when: { objectAt: [ACT5_LETTER_TO_JACK, { in: ACT5_LOCKER }] }, then: [{ set: [ACT5_CACHED_LETTER, true] }] } },
  ],
};

// ---------------------------------------------------------------------------
// §27 — the way back.
// ---------------------------------------------------------------------------

const DOOR_EXAMINE =
  'On this side it is a rectangle of wall standing a finger\'s width off its seal, with the antechamber\'s light coming through the gap looking exactly like this room\'s.';

const DOOR_LISTEN_BEFORE = 'The water, and the room being large, and nothing else whatever.';

const DOOR_LISTEN_AFTER =
  'Through this door: the landing. Through the door up the three tiled steps at the far side of the landing: a room with a carpet in it and a machine on a bench.\n\nAnd through both of them, a long way off and quite clear, somebody standing still on a carpet.\n\nYou listen to it for a while. It does not become anything else.';

const door: ObjectDefSlice = {
  location: ACT5_BLANK_ROOM,
  name: 'door',
  portable: false,
  nouns: ['door', 'doorway', 'way out', 'south door'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: DOOR_EXAMINE }] },
    { verbs: [LISTEN], when: { flag: ACT5_RECONCILIATION_RUNNING }, effects: [{ say: DOOR_LISTEN_AFTER }] },
    { verbs: [LISTEN], effects: [{ say: DOOR_LISTEN_BEFORE }] },
  ],
};

// ---------------------------------------------------------------------------
// Object map for `../index.ts`.
// ---------------------------------------------------------------------------

export const ACT5_BLANK_ROOM_OBJECTS: Record<string, ObjectDefSlice> = {
  [BLANK_ROOM_SURFACE]: blankRoomSurface,
  [ACT5_ROOT_TERMINAL]: terminal,
  [ACT5_CREATION_RECORD]: record,
  [ACT5_INDEX]: index,
  [ACT5_JULES_SNAPSHOT]: julesSnapshot,
  [ACT5_TRAY]: tray,
  [ACT5_LETTER_TO_JACK]: letterToJack,
  [ACT5_LOCKER]: locker,
  [ACT5_BLANK_ROOM_DOOR]: door,
};

// ---------------------------------------------------------------------------
// §26.3-§26.6 — the four cache handlers, amended onto SHARED objects from
// earlier acts. `act5_ev_locker` (`../formScripts.ts`/`../index.ts`) is what
// actually sets the four `act5_cached_*` flags (watching `objectAt`); these
// handlers only narrate and perform the real `{ move }` into the locker.
// ---------------------------------------------------------------------------

import { ACT2_NOTEBOOK_OBJECTS } from '../../act2/objects/notebook';
import { ACT2_CACHE_OBJECTS } from '../../act2/objects/cache';
import { ACT2_DAD, ACT2_FILM_CANISTER, ACT2_NOTEBOOK, ACT2_USB } from '../../act2/ids';
import { ACT4_Q_DARKROOM_OBJECTS } from '../../act4/objects/darkroom';
import { ACT4_PRINT_LAST_DAY, ACT4_PRINT_SKY } from '../../act4/ids';

function alreadyWiredToLocker(handlers: ObjectDefSlice['handlers']): boolean {
  return (handlers ?? []).some((h) => h.verbs.includes(PUT_IN) && Array.isArray(h.withInstrument) && h.withInstrument.includes(ACT5_LOCKER));
}

const notebookObj = ACT2_NOTEBOOK_OBJECTS[ACT2_NOTEBOOK]!;
if (!alreadyWiredToLocker(notebookObj.handlers)) {
  notebookObj.handlers = [
    ...(notebookObj.handlers ?? []),
    { verbs: [PUT_IN], withInstrument: [ACT5_LOCKER], effects: [{ move: [ACT2_NOTEBOOK, { in: ACT5_LOCKER }] }, { say: LOCKER_PUT_NOTEBOOK }] },
  ];
}

const filmCanisterObj = ACT2_CACHE_OBJECTS[ACT2_FILM_CANISTER]!;
if (!alreadyWiredToLocker(filmCanisterObj.handlers)) {
  filmCanisterObj.handlers = [
    ...(filmCanisterObj.handlers ?? []),
    { verbs: [PUT_IN], withInstrument: [ACT5_LOCKER], effects: [{ move: [ACT2_FILM_CANISTER, { in: ACT5_LOCKER }] }, { say: LOCKER_PUT_FILM }] },
  ];
}

const printSkyObj = ACT4_Q_DARKROOM_OBJECTS[ACT4_PRINT_SKY]!;
if (!alreadyWiredToLocker(printSkyObj.handlers)) {
  printSkyObj.handlers = [
    ...(printSkyObj.handlers ?? []),
    { verbs: [PUT_IN], withInstrument: [ACT5_LOCKER], effects: [{ move: [ACT4_PRINT_SKY, { in: ACT5_LOCKER }] }, { say: LOCKER_PUT_FILM }] },
  ];
}

const printLastDayObj = ACT4_Q_DARKROOM_OBJECTS[ACT4_PRINT_LAST_DAY]!;
if (!alreadyWiredToLocker(printLastDayObj.handlers)) {
  printLastDayObj.handlers = [
    ...(printLastDayObj.handlers ?? []),
    { verbs: [PUT_IN], withInstrument: [ACT5_LOCKER], effects: [{ move: [ACT4_PRINT_LAST_DAY, { in: ACT5_LOCKER }] }, { say: LOCKER_PUT_FILM }] },
  ];
}

const usbObj = ACT2_CACHE_OBJECTS[ACT2_USB]!;
if (!alreadyWiredToLocker(usbObj.handlers)) {
  usbObj.handlers = [
    ...(usbObj.handlers ?? []),
    {
      verbs: [PUT_IN],
      withInstrument: [ACT5_LOCKER],
      when: { npcAt: [ACT2_DAD, ACT5_BLANK_ROOM] },
      effects: [{ move: [ACT2_USB, { in: ACT5_LOCKER }] }, { say: LOCKER_PUT_USB_WITH_DAD }],
    },
    {
      verbs: [PUT_IN],
      withInstrument: [ACT5_LOCKER],
      effects: [{ move: [ACT2_USB, { in: ACT5_LOCKER }] }, { say: LOCKER_PUT_GENERAL }],
    },
  ];
}

// letter->locker (§26.6) lives on this file's own new object, above.
letterToJack.handlers = [
  ...(letterToJack.handlers ?? []),
  { verbs: [PUT_IN], withInstrument: [ACT5_LOCKER], effects: [{ move: [ACT5_LETTER_TO_JACK, { in: ACT5_LOCKER }] }, { say: LOCKER_PUT_LETTER }] },
];
