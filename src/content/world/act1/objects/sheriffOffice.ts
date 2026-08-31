// The Sheriff's Office — the room's five objects
// (`docs/superpowers/specs/2026-09-03-act1-wave2-prose.md` §12.3). Prose
// transcribed exactly (hard rule 5); the object/sub-part split and verb
// wiring are this builder's own calls (see `objects/postOffice.ts`'s own
// header for the established idiom this follows).

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { DIRECTION_VERB_IDS, USE_VERB_ID } from '../../../../engine/move';
import { EXAMINE, LOOK_BEHIND, measureMapText, OPEN, PUT_IN, READ, SEARCH, TAKE, TOUCH, TURN } from '../verbs';
import {
  CLUE_MAP_ADDITION,
  COUNTY_MAP,
  EVIDENCE_CAGE,
  RECORDS_TERMINAL,
  RECORDS_TERMINAL_SCREEN,
  SHERIFF_CELL,
  SHERIFF_OFFICE,
  SHERIFF_OFFICE_NO_EXIT_GATE,
  V_DRINK,
  V_MEASURE,
  V_RIGHT,
  WHITLOCK_DESK,
  WHITLOCK_DESK_FORM,
} from '../ids';
import { ACT2_NOTEBOOK, V_FIT } from '../../act2/ids';
import { ACT4_CAGE_OPEN, ACT4_CASE_NOTES, ACT4_CLUE_SAME_HAND, ACT4_EVIDENCE_BAG, ACT4_HANDWRITING_MATCHED, ACT4_WHITLOCK_CONVINCED } from '../../act4/ids';

// ---------------------------------------------------------------------------
// §12.3.1 — The county map
// ---------------------------------------------------------------------------

const mapExamine =
  'Four feet of it, cloth-backed, under a sheet of glass screwed to the wall over the top of it. The county in section squares, the river, the roads in red, the Badlands hatched in along the north and west like a rash the cartographer had views about.\n\nThe town is a dozen blocks and most of them are named after trees it does not have. Wall Drug is on it, out east on the highway, and there is a scale bar along the bottom with the miles marked off.\n\nNorth of town, past the last section line the map bothers with, somebody has added a shape in pencil, under the glass, drawn against a ruler. It has a gate on it and an access road. It is not labelled.';

const mapTakeText = 'Screwed down at the corners with the heads burred over. Somebody got tired of this map going missing.';

const countyMap: ObjectDefSlice = {
  location: SHERIFF_OFFICE,
  name: 'county map',
  portable: false,
  nouns: ['map', 'county map', 'wall map', 'chart', 'glass', 'scale', 'scale bar', 'sections', 'badlands', 'river', 'highway'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: mapExamine }, { grantClue: CLUE_MAP_ADDITION }] },
    { verbs: [V_MEASURE], effects: [{ say: measureMapText }] },
    { verbs: [TAKE, V_RIGHT, LOOK_BEHIND], effects: [{ say: mapTakeText }] },
  ],
};

// ---------------------------------------------------------------------------
// §12.3.2 — The terminal
// ---------------------------------------------------------------------------

const terminalExamine =
  'A flat screen on a swivel arm, angled so that it faces her and the counter does not. The case is a colour that was chosen by a committee. There is a county property sticker on the bezel with a serial number on it, and a cable that goes down under the desk and into the floor.\n\nIt is on. From here you can see that it is on, and nothing else about it.';

const useTerminalText =
  'You get a hand as far as the counter flap. Whitlock turns the screen two degrees further away with one finger and does not stop what she is doing.\n\n"That one\'s mine," she says. "Ask me and I\'ll look."';

const screenText = 'Angle, and a woman between you and it. You get the light off it on the side of her face.';

const recordsTerminal: ObjectDefSlice = {
  location: SHERIFF_OFFICE,
  name: 'terminal',
  portable: false,
  // "screen"/"monitor" moved to the sub-part below.
  nouns: ['terminal', 'computer', 'machine', 'database', 'records', 'system', 'keyboard', 'cable'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: terminalExamine }] },
    { verbs: [USE_VERB_ID, SEARCH, TOUCH], effects: [{ say: useTerminalText }] },
  ],
};

const recordsTerminalScreen: ObjectDefSlice = {
  location: { on: RECORDS_TERMINAL },
  name: 'screen',
  portable: false,
  nouns: ['screen', 'monitor'],
  handlers: [{ verbs: [EXAMINE, TURN], effects: [{ say: screenText }] }],
};

// ---------------------------------------------------------------------------
// §12.3.3 — The wire door (evidence cage)
// ---------------------------------------------------------------------------

const cageExamine =
  'A corner of the room fenced off floor to ceiling in heavy wire mesh, with a door in it on a padlock. Behind the mesh, three shelves of brown paper sacks folded over at the top and stapled, each with a manila tag on a wire.\n\nThe tags hang whichever way they were let go of. You can read the wire and not the writing.';

const cageOpenText =
  'The padlock is a good one and the mesh is screwed through into the frame.\n\n"County property," Whitlock says, without turning round. "There\'s a form for it. It goes to a judge and comes back in about nine days, and you\'d need a name on it."';

// ---------------------------------------------------------------------------
// E0 task J — §12 (the cage opens), plus the addendum's post-opening
// `EXAMINE` (`docs/superpowers/specs/2026-09-17-stage-e0-addendum.md` §1,
// wired per the main session's own ruling on the padlock: it stays with the
// door, on the hasp, shackle shut on nothing — §12's text as written).
// `CAGE_OPENS_TEXT`/`CAGE_OPENS_EFFECTS` are exported so `act1/whitlock.ts`'s
// own `ASK WHITLOCK ABOUT CAGE`/`ABOUT BAG` (once convinced) render the
// identical scene rather than a second, divergent copy of the same prose.
// ---------------------------------------------------------------------------

export const CAGE_OPENS_TEXT =
  'She gets up. That is the whole of the argument.\n\nThe padlock is on a ring with a great many others and she finds it without looking. The wire door comes open with the sound wire makes.\n\n"Third shelf, end of it. It\'s the one whose tag has nothing on the top line." She stands where she can see both of your hands, which is not personal. It is eleven years.\n\nOn the tag, in her own writing: the address it came out of, and the morning it came in. Where a complainant goes there is a line drawn through the box.';

/** The non-`say` half — `set`/`reveal`s only — so `act1/whitlock.ts`'s own `topic_cage` (post-conviction) can pair them with a `TopicDef.response` instead of a second `{ say }` effect. */
export const CAGE_OPENS_STATE_EFFECTS: Effect[] = [
  { set: [ACT4_CAGE_OPEN, true] },
  { reveal: ACT4_EVIDENCE_BAG },
  { reveal: ACT4_CASE_NOTES },
];

export const CAGE_OPENS_EFFECTS: Effect[] = [{ say: CAGE_OPENS_TEXT }, ...CAGE_OPENS_STATE_EFFECTS];

// Addendum §1.1/§1.2 — the notes-are-gone vs. bag-still-there readings.
// `has: act4_case_notes`, not `has: act4_evidence_bag` (the addendum's own
// note: the bag is `portable: false` and never carried, so a `has:` test on
// it could never pass — what actually changes on the shelf is the notes
// coming out of the bag, §13.2).
const cageExamineNotesOutText =
  'The door stands open on its hinge and the padlock hangs off the hasp by its shackle, shut on nothing, which is how a lock looks when somebody means to come back to it. On the third shelf there is a gap at the end the width of a paper sack, and the bags either side of it have not leaned in to fill it; brown paper keeps its shape. What came out of the gap is on the counter behind you with its tag turned face up. The shelf is one short and the room has not noticed.';

const cageExamineBagStillThereText =
  'The door stands open on its hinge and the padlock hangs off the hasp by its shackle, shut on nothing, which is how a lock looks when somebody means to come back to it. Everything behind the wire is exactly where it was; the difference is that there is now nothing between you and it. Third shelf, end of the row: brown paper folded and stapled, a manila tag wired through the fold, hanging the same wrong way as all the others. You can read this one. You know which line to read, and there is nothing on it.';

const cageExamineRules: ProseRule[] = [
  { when: { all: [{ flag: ACT4_CAGE_OPEN }, { has: ACT4_CASE_NOTES }] }, text: cageExamineNotesOutText },
  { when: { flag: ACT4_CAGE_OPEN }, text: cageExamineBagStillThereText },
  { text: cageExamine },
];

const evidenceCage: ObjectDefSlice = {
  location: SHERIFF_OFFICE,
  name: 'wire door',
  portable: false,
  nouns: ['cage', 'wire', 'mesh', 'wire door', 'evidence', 'property', 'locker', 'shelves', 'shelf', 'bags', 'sacks', 'tags', 'tag', 'padlock'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: cageExamineRules }] },
    // §12 — OPEN CAGE, once Whitlock is convinced. Declared before the
    // ordinary refusal below (same "when-gated rule first" idiom as the
    // rest of this codebase, e.g. `act2/dad.ts`'s `topicDadV2`), so an
    // unconvinced OPEN CAGE still falls through to `cageOpenText`.
    { verbs: [OPEN], when: { flag: ACT4_WHITLOCK_CONVINCED }, effects: CAGE_OPENS_EFFECTS },
    { verbs: [READ, TAKE, SEARCH, OPEN], effects: [{ say: cageOpenText }] },
  ],
};

// ---------------------------------------------------------------------------
// E0 task J — §13 (the evidence bag) and §14 (the case notes). Both objects
// are `hidden: true` until §12's `CAGE_OPENS_EFFECTS` reveals them; both
// live in this room (not nested `{ in: EVIDENCE_CAGE }` — the cage carries
// no `container` field of its own, and the established idiom for a
// hidden-until-revealed room object elsewhere in this codebase,
// `act2/objects/wallDrugBackCorridor.ts`'s cache box, is a direct room
// placement plus `{ reveal }`, not container nesting). `bagOpenEffects` is
// shared by the bag's own OPEN/SEARCH ("LOOK IN BAG") handlers and the case
// notes' own TAKE handler, per §13.2's own heading ("OPEN BAG / LOOK IN BAG
// / TAKE NOTES" are one response, not three).
// ---------------------------------------------------------------------------

const evidenceBagExamine =
  'Brown paper, folded over twice at the top and stapled through the fold, with a manila tag wired through the staple. It has been handled and put back more than once; the crease has gone soft.\n\nIt is not heavy. Whatever is in it is paper.';

const bagOpenText =
  'The staples come out with a fingernail. The bag sits open on the counter and Whitlock goes back to her form, which is the courtesy.\n\nInside: a spiral pad with the cover gone, and three sheets folded in three.';

const bagTakeRefusalText =
  '"The bag\'s the county\'s," she says, to the form. "What\'s in it was never anybody\'s, which is the only reason we\'re doing this."';

const bagOpenEffects: Effect[] = [{ say: bagOpenText }, { move: [ACT4_CASE_NOTES, 'inventory'] }];

const evidenceBag: ObjectDefSlice = {
  location: SHERIFF_OFFICE,
  hidden: true,
  name: 'evidence bag',
  portable: false,
  container: {},
  nouns: ['bag', 'sack', 'evidence bag', 'parcel', 'staple', 'staples'],
  adjectives: ['brown', 'paper', 'evidence'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: evidenceBagExamine }] },
    { verbs: [OPEN, SEARCH], effects: bagOpenEffects },
    { verbs: [TAKE], effects: [{ say: bagTakeRefusalText }] },
  ],
};

// §14.1 — READ NOTES / EXAMINE NOTES.
const caseNotesReadText =
  'Three weeks of you.\n\n' +
  '    J. bro. — hires, cash, no ret. addr.\n' +
  '    Mrs P. — "since the start of last month"\n' +
  '    NO CTY REC. — conf. w/ sher. 2x\n' +
  '    Marlow: reg. pg gone. torn, not cut.\n' +
  '    N. — plant. 9 yrs. Says no such man. Means it.\n\n' +
  'It goes on like that for the thickness of a thumb, in a hand that gets faster and never gets larger. Days with no heading on them. A page where you have written the same question over and over with the answer coming out different each time, in your own writing, changing its mind.\n\n' +
  'There is nothing in it you did not know an hour ago. You wrote all of it.';

// §14.2 — SHOW NOTES TO WHITLOCK lives on `act1/whitlock.ts`'s own
// `showResponses` (the verb routes through the NPC, not this object).

// §15 — COMPARE NOTES WITH NOTEBOOK / COMPARE HANDWRITING. R14, the analog
// leg. Exported so `act2/objects/notebook.ts`'s own mirror handler
// (`COMPARE NOTEBOOK WITH NOTES`) renders the identical scene.
export const CASE_NOTES_COMPARISON_TEXT =
  "You put them side by side on the counter under her lamp: a dead man's work book, open at a page of figures, and three weeks of your own.\n\nThe pressure is the same. The letters are the same small fast letters leaning the same way. The full stop after an abbreviation is put down hard enough to be a decision, in both, every time.\n\nThe hook that means a valve. The doubled stroke that means a shift. The long tail on the end of a run that means a floor. You did not learn those this week. You have been writing them since the first morning, on a case about a man you have never met, in a county where you have no name.\n\nEverybody's cursive looks alike.\n\nWhitlock has come round the end of the counter and is looking at the two of them side by side, and she does not say anything at all.";

export const CASE_NOTES_COMPARISON_EFFECTS: Effect[] = [
  { say: CASE_NOTES_COMPARISON_TEXT },
  { set: [ACT4_HANDWRITING_MATCHED, true] },
  { grantClue: ACT4_CLUE_SAME_HAND },
];

const caseNotes: ObjectDefSlice = {
  location: SHERIFF_OFFICE,
  hidden: true,
  name: 'case notes',
  portable: true,
  plotCritical: true,
  // Not `notebook`/`book`/`journal`/`papers` (§31.2) — those stay
  // `act2_notebook`'s and `act1_whitlock_desk_form`'s alone, so the
  // comparison's two objects always resolve separately.
  nouns: ['notes', 'case notes', 'pad', 'notepad', 'sheets', 'shorthand', 'handwriting'],
  handlers: [
    { verbs: [READ, EXAMINE], effects: [{ say: caseNotesReadText }] },
    // TAKE NOTES reaches the same effects as OPEN BAG/LOOK IN BAG — §13.2's
    // own heading groups all three as one response.
    { verbs: [TAKE], effects: bagOpenEffects },
    { verbs: [PUT_IN], withInstrument: [ACT4_EVIDENCE_BAG], effects: [{ say: bagTakeRefusalText }] },
    { verbs: [V_FIT], withInstrument: [ACT2_NOTEBOOK], effects: CASE_NOTES_COMPARISON_EFFECTS },
  ],
};

// ---------------------------------------------------------------------------
// §12.3.4 — The desk
// ---------------------------------------------------------------------------

const deskExamine =
  'Government issue, oak-coloured, worn through to lighter wood along the front edge in the two places forearms go. On it: the screen, a radio set turned down to a hum, a mug with a school badge on it, and a paper form face up with about a third of it filled in.\n\nShe is filling it in by hand, from the screen, which is what forms are for.';

const formExamine = 'Upside down from here, and the county\'s forms are made to be read the right way up. A ruled grid, boxes, and a heading in a typeface that has been doing this since before either of you.';

const coffeeText = '"Pot\'s behind you. Cup\'s clean if you rinse it." She does not look up. "It\'s been on since eight."';

const whitlockDesk: ObjectDefSlice = {
  location: SHERIFF_OFFICE,
  name: 'desk',
  portable: false,
  // "form"/"forms"/"paper"/"papers" moved to the sub-part below.
  nouns: ['desk', 'pen', 'blotter', 'mug', 'cup', 'coffee', 'pot', 'radio', 'dispatch', 'drawer'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: deskExamine }] },
    { verbs: [TAKE, V_DRINK], effects: [{ say: coffeeText }] },
  ],
};

const whitlockDeskForm: ObjectDefSlice = {
  location: { on: WHITLOCK_DESK },
  name: 'form',
  portable: false,
  nouns: ['form', 'forms', 'paper', 'papers'],
  handlers: [{ verbs: [EXAMINE, READ], effects: [{ say: formExamine }] }],
};

// ---------------------------------------------------------------------------
// §12.3.5 — The cell
// ---------------------------------------------------------------------------

const cellExamine =
  'Eight feet by ten, painted the green they paint these, with the door hooked back against the wall and the hook gone shiny from being used that way. A bunk with a mattress on it and a folded blanket at the foot, both clean.\n\nSomebody has scratched a tally into the paint beside the bunk. It stops at four.';

export const cellSleepText =
  '"Bunk\'s clean," Whitlock says. "It doesn\'t lock unless somebody locks it, and nobody\'s going to."\n\nYou stand in the doorway of it long enough to want to, and then do not.';

const sheriffCell: ObjectDefSlice = {
  location: SHERIFF_OFFICE,
  name: 'cell',
  portable: false,
  nouns: ['cell', 'jail', 'lockup', 'bars', 'door', 'bunk', 'bed', 'cot', 'mattress', 'blanket', 'tally'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: cellExamine }] },
    // Bare "sleep"/"lie down" (no dobj) reach the same text via `sheriff_office`'s own room-level SLEEP handler (`sheriffOffice.ts`), not here — SLEEP's own grammar pattern is `'V'` only, so it never produces a resolved `dobj` for an object handler to match.
    { verbs: [DIRECTION_VERB_IDS.in, USE_VERB_ID], effects: [{ say: cellSleepText }] },
  ],
};

// §12.5's always-closed "every other direction" gate — mirrors `MAIN_STREET_BOUNDARY_GATE`.
const sheriffOfficeNoExitGate: ObjectDefSlice = { location: SHERIFF_OFFICE };

export const SHERIFF_OFFICE_OBJECTS: Record<string, ObjectDefSlice> = {
  [COUNTY_MAP]: countyMap,
  [RECORDS_TERMINAL]: recordsTerminal,
  [RECORDS_TERMINAL_SCREEN]: recordsTerminalScreen,
  [EVIDENCE_CAGE]: evidenceCage,
  [WHITLOCK_DESK]: whitlockDesk,
  [WHITLOCK_DESK_FORM]: whitlockDeskForm,
  [SHERIFF_CELL]: sheriffCell,
  [SHERIFF_OFFICE_NO_EXIT_GATE]: sheriffOfficeNoExitGate,
} satisfies Record<string, ObjectDefSlice>;

// E0 task J — the evidence bag (§13) and the case notes (§14). Kept OUT of
// `SHERIFF_OFFICE_OBJECTS` above (that map is merged into Act I's own slice
// by `act1/slice.ts`, a file this task does not touch) and registered
// instead via `act4/index.ts`'s own `objects` map — Act IV content, even
// though it is authored in this Act I room file, per the shared-file
// protocol's own instruction to add new objects there.
export const ACT4_J_SHERIFF_OFFICE_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT4_EVIDENCE_BAG]: evidenceBag,
  [ACT4_CASE_NOTES]: caseNotes,
} satisfies Record<string, ObjectDefSlice>;
