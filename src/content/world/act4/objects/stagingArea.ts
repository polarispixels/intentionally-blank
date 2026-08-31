// Stage E1, task L — the Staging Area's furniture, the detail, and the
// office's form letter (`docs/superpowers/specs/2026-09-18-stage-e1-
// prose.md` §4-§10, §19). Prose transcribed exactly (hard rule 5).
//
// NOUN COLLISIONS (§37.2, this task's own brief) — resolved here, not left
// to chance: the whiteboard's `adjectives: ['white', 'county']` keep it
// distinct from Zone 1's own bare `BOARD` (never in scope together, but
// named so nobody "fixes" it); the table's nouns are unique to this room
// (`table`/`tables`/`trestle`); `act4_jack_letters` deliberately does NOT
// list singular "letter" among its nouns — only plural "letters" — because
// bare `LETTER` must stay `act2_letter_out` everywhere (§37.2's own ruling;
// a builder call, since §7's own header literally lists singular "letter"
// too — the collision table is followed here as the more specific,
// operationally binding instruction). `act4_reply_office` (§19, below)
// gets the same treatment: nouns `['reply', 'answer']`, no "letter", per
// the identical ruling for the fifth `reply`-noun object.

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import { EXAMINE, HELLO, OPEN, READ, RUB, SIT, TAKE } from '../../act1/verbs';
import { V_ATTACK, V_DRINK, V_FOLLOW, V_POUR } from '../../act1/ids';
import { ACT3_LOBBY } from '../../act3/ids';
import {
  ACT4_CLUE_DETAIL_REFUSES,
  ACT4_CLUE_LETTERS_FROM_JACK,
  ACT4_COFFEE_URN,
  ACT4_CONFERENCE_TABLE,
  ACT4_DETAIL,
  ACT4_JACK_LETTERS,
  ACT4_LUKE_GONE_MARKER,
  ACT4_LUKES_FOLDER,
  ACT4_REPLY_OFFICE,
  ACT4_STAGING_AREA,
  ACT4_STAGING_WHITEBOARD,
  ACT4_STAGING_WINDOW,
  V_ACT4_WRITE_ON,
} from '../ids';
import { PUSH_PAST_DETAIL_TEXT } from '../verbs';

// ---------------------------------------------------------------------------
// §4 — the whiteboard
// ---------------------------------------------------------------------------

const WHITEBOARD_EXAMINE_TEXT =
  "The county's grid is still on it, ruled in permanent marker by somebody with a straightedge, and this week there is a dry-wipe hand in it that is not the county's: enormous, upright, all capitals, made to be read from the back of a room by a person walking.\n\n    LOT / ARRIVE          PRINCIPAL\n    PLANT FLOOR           PRINCIPAL, ESCORT\n    STAGING — HOLD        PRINCIPAL\n    MAIN ST — SPRAY       ------------\n    LOT / DEPART          PRINCIPAL\n\nThe left-hand column is where the times go. They have been wiped and put back so often that the column is grey the whole way down, and what is in it now cannot be read from here and cannot be read from a foot away either.\n\nThe fourth row has a line through it, drawn with the straightedge, which means somebody had the straightedge in his hand at the time.\n\nNothing on the board says who PRINCIPAL is, and nothing on it says the name of the building.";

const WHITEBOARD_DEFENSE_TEXT =
  'There is a man at each end of this room being paid to notice exactly this, and you are going to be in here for a while yet.\n\nYou put your hands where they were.';

const whiteboard: ObjectDefSlice = {
  location: ACT4_STAGING_AREA,
  name: 'whiteboard',
  portable: false,
  // "pen" dropped from the doc's own noun list (validate.ts's object-noun-
  // collision check against act1_pen and three other shipped objects
  // already sharing that bare noun; "marker" alone already reaches TAKE
  // MARKER — builder's word choice, not doc text, same idiom act1/verbs.ts
  // already uses for RUB's own dropped "dust").
  nouns: ['whiteboard', 'board', 'grid', 'schedule', 'marker', 'timetable'],
  adjectives: ['white', 'county'],
  handlers: [
    { verbs: [EXAMINE, READ], effects: [{ say: WHITEBOARD_EXAMINE_TEXT }] },
    { verbs: [RUB, TAKE, V_ACT4_WRITE_ON], effects: [{ say: WHITEBOARD_DEFENSE_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §5 — the conference table
// ---------------------------------------------------------------------------

const TABLE_EXAMINE_TEXT =
  'Trestles under a roll of white paper, and the paper has been pulled off the dispenser a little short, so the last table is bare at the end and somebody has put the pens there to cover it.\n\nA wire basket of pens with a contractor\'s name down the barrel. A jug of water with the condensation gone off it. Glasses, upside down, on a folded napkin because there was no tray.\n\nAt the top of it, a folder, squared to the edge by somebody who squares things.';

const TABLE_SIT_TEXT =
  'There is a chair on your side. It is not the chair anybody expects you to take and you take it anyway, and neither of the men at the doors does anything at all about it, which you find you would have preferred them to.';

const table: ObjectDefSlice = {
  location: ACT4_STAGING_AREA,
  name: 'table',
  portable: false,
  nouns: ['table', 'tables', 'trestle', 'trestles', 'paper', 'roll', 'pens', 'basket', 'jug', 'glasses', 'water'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: TABLE_EXAMINE_TEXT }] },
    { verbs: [SIT], effects: [{ say: TABLE_SIT_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §6 — Luke's folder / §7 — the letters (R15)
// ---------------------------------------------------------------------------

const FOLDER_EXAMINE_TEXT =
  'Brown card, worn soft at the corners, with a rubber band round it gone flat where it sits. It is not a government folder; it is the sort of folder a man buys in a shop.\n\nNothing is written on the front. The back has been written on and rubbed out.\n\nIt is open, and what is in it is letters.';

/** Shared by TAKE FOLDER and TAKE LETTERS (§6.2's own heading groups both). */
const TAKE_FOLDER_OR_LETTERS_TEXT =
  'The man at the far door does not move and does not need to. You put it back down and square it to the edge of the table, because that is how you found it, and because it is his.';

const folder: ObjectDefSlice = {
  location: { on: ACT4_CONFERENCE_TABLE },
  name: 'folder',
  portable: false,
  container: { open: true },
  nouns: ['folder', 'file', 'wallet', 'papers'],
  adjectives: ['his', 'brown', 'squared'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: FOLDER_EXAMINE_TEXT }] },
    { verbs: [TAKE], effects: [{ say: TAKE_FOLDER_OR_LETTERS_TEXT }] },
  ],
};

const LETTERS_READ_TEXT =
  'They are in the folder in the order they came, oldest at the bottom, each one still in its envelope with the envelope tucked in behind it.\n\n    Hi Luke —\n\n    Everything\'s fine here. Busy, the good kind of busy. Shop\'s steady, the weather\'s been kind, and I\'ve nothing to complain about that anybody would want to hear.\n\n    Don\'t worry about us. Come out when you can and don\'t make a thing of it.\n\n    Jack\n\nThe next one is that letter with the weather changed. The one under it is that letter with the weather changed.\n\nSquare capitals, pressed hard, the L\'s finished with a separate stroke.\n\nEvery one of them is cheerful. Not one of them asks him for anything, and the last one in the folder came inside the last five weeks.';

const LETTERS_EXAMINE_TEXT =
  'No crossings-out. Not one, anywhere in the folder, from a man writing at a kitchen table with a pen he did not choose.\n\nThey are also all the same length. Every one of them goes down the sheet to about the same place and stops there, the way a form stops.\n\nHeld up to the window, the pressure is even the whole way through, with nowhere on the sheet where the pen stopped while somebody thought.';

const letters: ObjectDefSlice = {
  location: { in: ACT4_LUKES_FOLDER },
  name: 'letters',
  portable: false,
  // Singular "letter" deliberately absent — see this file's own header
  // note (§37.2's collision ruling: bare LETTER stays `act2_letter_out`
  // everywhere; "letters", plural, is this folder's, in this room only).
  nouns: ['letters', 'mail', 'correspondence', 'notes'],
  adjectives: ['cheerful', "jack's"],
  handlers: [
    { verbs: [READ], effects: [{ say: LETTERS_READ_TEXT }, { grantClue: ACT4_CLUE_LETTERS_FROM_JACK }] },
    { verbs: [EXAMINE], effects: [{ say: LETTERS_EXAMINE_TEXT }] },
    { verbs: [TAKE], effects: [{ say: TAKE_FOLDER_OR_LETTERS_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §8 — the window
// ---------------------------------------------------------------------------

const WINDOW_EXAMINE_TEXT =
  'The lot has been swept, and the weeds along the base of the fence have been sprayed and have not had time to go brown.\n\nThe cars are nose out with a man standing between each pair of them, and none of the men is looking at the same thing as any of the others, which is the whole of the trick and takes years.\n\nPast the cars, the gatehouse. Past the gatehouse, the county road, where somebody has been out with a machine and put a fresh white edge line down the side of it as far as you can see from this window.\n\nAt the far end of what you can see from this window, the edge line stops.';

const WINDOW_OPEN_TEXT =
  'Sealed unit, no opening light, and a bead of mastic all the way round it that has gone hard and yellow and is original.\n\nThere are people in this room who would notice the first minute of any serious attempt on it.';

const window_: ObjectDefSlice = {
  location: ACT4_STAGING_AREA,
  name: 'window',
  portable: false,
  nouns: ['window', 'glass', 'lot', 'cars', 'motorcade', 'blind'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: WINDOW_EXAMINE_TEXT }] },
    { verbs: [OPEN], effects: [{ say: WINDOW_OPEN_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §9 — the detail (scenery, not an NPC — §37.2's own collision note)
// ---------------------------------------------------------------------------

const DETAIL_EXAMINE_TEXT =
  'Two of them, and there is nothing to say about how they look, because that has been worked at.\n\nSuits that fit. Shoes that will not squeak on terrazzo. An earpiece each, and a lapel pin that is not a flag and is not anything else either.\n\nNeither has a hand in a pocket. Neither is leaning on anything. They have arranged it so that the room has two doors and each door has a man in front of it looking at the other man\'s door.';

const DETAIL_TALK_TEXT =
  '"Sir."\n\nThat is the whole of it and will be every time. He is not being rude; he has been given one word for this and told to use it until you go away.';

const detail: ObjectDefSlice = {
  // §37.2's own ruling: present in the Staging Area, and — as the
  // antecedent of `STAGING_DOOR_BLOCKED_TEXT` — in the Lobby from
  // `act4_visit_day`. Authored home is the Lobby, hidden until
  // `act4_ev_detail_arrives` reveals it; `act4_ev_staging_opens` moves it
  // in here once the door opens (`events.ts`, this task's own).
  location: ACT3_LOBBY,
  name: 'detail',
  portable: false,
  hidden: true,
  nouns: ['detail', 'agent', 'agents', 'man', 'men', 'guard', 'guards', 'security', 'protection', 'earpiece'],
  adjectives: ['protection', 'secret'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: DETAIL_EXAMINE_TEXT }] },
    { verbs: [HELLO], effects: [{ say: DETAIL_TALK_TEXT }] },
    { verbs: [V_ATTACK], effects: [{ say: PUSH_PAST_DETAIL_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §10 — the coffee urn
// ---------------------------------------------------------------------------

const URN_EXAMINE_TEXT =
  'A stainless catering urn on a card table, with a lead running along the skirting and a plastic cup upside down over the tap so that it does not drip on the floor.\n\nIt is not the building\'s; the building has a machine through a door. This one has a dent in the side the size of a hip, a piece of tape round one handle, and the last of somebody\'s writing on the tape in laundry marker, gone to about two letters.';

const URN_DRINK_TEXT =
  'It is good coffee, and it is too strong, and it has been standing for a while in a way that has not improved it and has not spoiled it either.\n\nYou have had this before. You have had this a great many mornings, at a counter thirty-two miles from here, from a woman who does not stop pouring until you put your hand over the cup.';

const urn: ObjectDefSlice = {
  location: ACT4_STAGING_AREA,
  name: 'urn',
  portable: false,
  nouns: ['urn', 'coffee', 'boiler', 'pot', 'lead', 'cable'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: URN_EXAMINE_TEXT }] },
    { verbs: [TAKE, V_DRINK, V_POUR], effects: [{ say: URN_DRINK_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §19 — the office's reply. Delivered into `act1_po_boxes` by
// `act4_ev_office_reply` (`events.ts`); read/examine only, no grant (canon
// 8's rule — "nothing anywhere says the message was read on the way" — is
// never stated by anybody, in any act).
// ---------------------------------------------------------------------------

const OFFICE_REPLY_READ_TEXT =
  '    Dear Sir or Madam:\n\n        Thank you for writing. The President is grateful for the interest and support of citizens across the country and reads as much of his correspondence as the demands of the office allow. Your comments have been noted and forwarded to the appropriate office.\n\n    With best wishes,\n\n    Correspondence Unit\n\nThe whole of it is handwritten, which is not how an office of that size answers anybody, and the hand is a good one.';

const OFFICE_REPLY_EXAMINE_TEXT =
  'Good paper. A printed heading. An even upright hand with the loops closed, and a signature under the last line that is not a name and is not quite a mark either.\n\nThere is one crease in it and it is the one it got in the box.';

const officeReply: ObjectDefSlice = {
  location: 'nowhere',
  name: 'office reply', // the fifth `reply`-noun object (§37.2) — distinct `name`, same idiom v0.16.0 applied to the other four.
  portable: true,
  // No "letter" among these nouns (§37.2's own ruling, this file's own
  // header note) — bare LETTER stays `act2_letter_out` everywhere.
  nouns: ['reply', 'answer'],
  adjectives: ['office', 'form'],
  handlers: [
    { verbs: [READ], effects: [{ say: OFFICE_REPLY_READ_TEXT }] },
    { verbs: [EXAMINE], effects: [{ say: OFFICE_REPLY_EXAMINE_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §9.2 — SHOW <anything> TO DETAIL. This is a ROOM-level handler
// (`act4/stagingArea.ts`'s own `roomHandlers`), not an object one: the
// detail is the exit's `iobj`, not its `dobj`, and `performAction`'s room-
// instrument mechanism (register 91, `actions.ts`) is what lets a room
// answer "SHOW <anything carried> TO <the detail>" without every showable
// object in the game declaring `withInstrument: [act4_detail]` — see that
// file's own header comment on why. Exported here (co-located with the
// object it names) and consumed by `../stagingArea.ts`.
// ---------------------------------------------------------------------------

export const SHOW_TO_DETAIL_TEXT =
  'He takes it. That is the part you had not prepared for: he takes it, reads all of it, turns it over and reads the back, with the flat attention of a man trained to find the one wrong thing who has not yet had a week where he did not.\n\nThen he hands it back.\n\n"Thank you, sir," he says, and puts himself where he was standing, which is between you and the door.\n\nEverything in your pockets belonged to somebody else first, and none of it has a name on it that is yours, because there is not one for it to have.';

export const SHOW_TO_DETAIL_EFFECTS: Effect[] = [{ say: SHOW_TO_DETAIL_TEXT }, { grantClue: ACT4_CLUE_DETAIL_REFUSES }];

// ---------------------------------------------------------------------------
// E1 addendum §5 — `FOLLOW LUKE`, after §23: he is `'offstage'` by then and
// the resolver cannot reach him (`resolve.ts`/`interpreter.ts` restrict npc
// noun resolution to `ScopeView.visible`, i.e. the current room), so this is
// room-scoped rather than NPC-scoped, per the addendum's own wiring note.
// Lives here (not `../stagingArea.ts`, the room file) — Stage F1 — so that
// this file's own `lukeGoneMarker`, below, can reuse it without a circular
// import back into the room file, which already imports FROM this one
// (`SHOW_TO_DETAIL_EFFECTS`, above); `../stagingArea.ts` and `act3/lobby.ts`
// both now import it from here instead (hard rule 5 — one text, owned
// once, just relocated to break the cycle).
// ---------------------------------------------------------------------------

export const FOLLOW_LUKE_GONE_TEXT =
  'He left the way men like him leave, which is out of a door somebody else is holding, into a car somebody else is driving.\n\nWhat is in that lot now is tape on the asphalt, a coned lane nobody needs, and a county man taking the cones up in no particular hurry.';

// ---------------------------------------------------------------------------
// Stage F1 — `FOLLOW LUKE` by name, once he is genuinely gone. See
// `ACT4_LUKE_GONE_MARKER`'s own doc comment (`../ids.ts`) for why this is
// safe: `hidden: true` by default, `reveal`ed only once `act4_luke_gone` is
// set (`events.ts`, `luke.ts`), so it is never in scope while the real npc
// still is. No `name`/`description` authored — this is routing scenery,
// same idiom as `act1/ids.ts`'s `SHERIFF_OFFICE_FRONT` ("no examine prose"):
// nothing in this task's own brief asks for one, and inventing prose for an
// object that only exists to carry a noun would be new player-visible text
// this task is not authorized to write.
// ---------------------------------------------------------------------------

const lukeGoneMarker: ObjectDefSlice = {
  location: ACT4_STAGING_AREA,
  portable: false,
  hidden: true,
  proper: true,
  name: 'Luke',
  nouns: ['luke'],
  handlers: [{ verbs: [V_FOLLOW], effects: [{ say: FOLLOW_LUKE_GONE_TEXT }] }],
};

export const ACT4_L_STAGING_AREA_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT4_STAGING_WHITEBOARD]: whiteboard,
  [ACT4_CONFERENCE_TABLE]: table,
  [ACT4_LUKES_FOLDER]: folder,
  [ACT4_JACK_LETTERS]: letters,
  [ACT4_STAGING_WINDOW]: window_,
  [ACT4_DETAIL]: detail,
  [ACT4_COFFEE_URN]: urn,
  [ACT4_REPLY_OFFICE]: officeReply,
  [ACT4_LUKE_GONE_MARKER]: lukeGoneMarker,
};
