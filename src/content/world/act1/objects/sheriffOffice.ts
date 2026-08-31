// The Sheriff's Office — the room's five objects
// (`docs/superpowers/specs/2026-09-03-act1-wave2-prose.md` §12.3). Prose
// transcribed exactly (hard rule 5); the object/sub-part split and verb
// wiring are this builder's own calls (see `objects/postOffice.ts`'s own
// header for the established idiom this follows).

import type { ObjectDefSlice } from '../../../../engine/world';
import { DIRECTION_VERB_IDS, USE_VERB_ID } from '../../../../engine/move';
import { EXAMINE, LOOK_BEHIND, measureMapText, READ, SEARCH, TAKE, TOUCH, TURN } from '../verbs';
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

const evidenceCage: ObjectDefSlice = {
  location: SHERIFF_OFFICE,
  name: 'wire door',
  portable: false,
  nouns: ['cage', 'wire', 'mesh', 'wire door', 'evidence', 'property', 'locker', 'shelves', 'shelf', 'bags', 'sacks', 'tags', 'tag', 'padlock'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: cageExamine }] },
    { verbs: [READ, TAKE, SEARCH], effects: [{ say: cageOpenText }] },
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
