// Stage E2, task P — the Galley and the Observation Dome
// (`docs/superpowers/specs/2026-09-19-stage-e2-prose.md` §26, §34, §56.4).
// Prose transcribed exactly (hard rule 5).
//
// `area: 'act4'`. Only one real exit each way (`up`/`down` between the two
// rooms) — the hab's way OUT entirely is `act4_airlock_door`'s own object
// handlers (`./objects/hab.ts`), not an exit; see that file's own header
// for the confirmed engine gap on the bare "OUT" phrasing. No `travelText`
// on either exit (§56.3's own "a builder will look for one and not find
// it" — the ladder is a ladder, both ends already describe the climb).

import type { HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { LISTEN, SMELL } from '../act1/verbs';
import { V_LOOK_UP, V_TYPE_TERMINAL } from '../act1/ids';
import { ACT4_HAB_DOME, ACT4_HAB_GALLEY, ACT4_SISSY } from './ids';
// §29.2 — bare `LOG IN`/`TYPE`/`PRESS KEY` (`V_TYPE_TERMINAL`, bare `'V'`)
// reach the hab terminal's own text via a ROOM-level handler, same idiom as
// `act3/s6ArchiveHub.ts`'s own split (that file's own comment: "the room's
// own bare `V_TYPE_TERMINAL` handler"). "USE TERMINAL" (dobj-bearing)
// reaches the identical text via the object's own `USE_VERB_ID` handler
// (`./objects/hab.ts`).
import { HAB_TERMINAL_TYPE_TEXT } from './objects/hab';

// ---------------------------------------------------------------------------
// §26.1-§26.3 — the Galley, three ProseRules.
// ---------------------------------------------------------------------------

const GALLEY_FIRST_SIGHT_TEXT =
  'The inner door comes off its seal with the noise of a jar being opened, and you\nare in a galley.\n\nIt is small and everything in it is doing at least two jobs. A table folds down\noff the bulkhead with a lip round the edge of it and restraints on the seats that\nnobody has used in a long time; one of them has been tied out of the way with a\nbootlace. Overhead, a run of stowage in soft bags, each with a printed square on\nit and a handwritten word under the printed square.\n\nAlong the far bulkhead, a comms rig, awake, with one green light on it.\n\nUnder the rig, on a shelf, there is a terminal, and it is on.\n\nYou have seen this terminal before. It was in a room with a bed in it and a\nwindow onto a street. It was behind a curtain at the back of a gift shop with a\ngenerator running outside. It was on a steel bench under a building, with a well\nat the end of the room.\n\nHere it is showing a clock.\n\nUnder a lamp on the end of the counter, a shallow tray of something green, and\nbeside it a shallow tray of something that was.\n\nThere is a ladder up through a hatch in the ceiling, and through the hatch it is\nblack.';

const GALLEY_SISSY_PRESENT_TEXT =
  'The galley: the fold-down table, the stowage overhead, the rig with its green\nlight, the terminal with its clock, the trays under the lamp, and the ladder up\nthrough the hatch.\n\nShe is at the table with her feet hooked under the seat rail.';

const GALLEY_UNCONDITIONAL_TEXT =
  'The fold-down table with the bootlace on the restraint, the stowage bags\noverhead, the rig, the terminal, the trays, and the ladder going up into the\ndark.\n\nThe fan runs. It is the loudest thing in here by a distance, and it is not loud.';

const galleyDescription: ProseRule[] = [
  { when: { not: { visited: ACT4_HAB_GALLEY } }, text: GALLEY_FIRST_SIGHT_TEXT },
  { when: { npcAt: [ACT4_SISSY, ACT4_HAB_GALLEY] }, text: GALLEY_SISSY_PRESENT_TEXT },
  { text: GALLEY_UNCONDITIONAL_TEXT },
];

// ---------------------------------------------------------------------------
// §26.4 — room-level senses.
// ---------------------------------------------------------------------------

const GALLEY_SMELL_TEXT =
  'Warm plastic, a lamp over damp soil, and — a long way under those — the smell of\nsomebody\'s cooking from a while ago that has nowhere in this building to go.';

const GALLEY_LISTEN_TEXT =
  'The fan. Something cycling behind a panel every so often and cutting out again.\n\nAnd a sound so far down under both of them that you have to stop breathing to\nhave it, which is the pump in the airlock keeping the seal you came through where\nit ought to be.';

const GALLEY_LOOK_UP_TEXT =
  'Stowage, cable runs in a tray, a light with a wire cage on it, and a hatch with a\nladder going up through it into a room that has no light on in it.';

const galleyHandlers: HandlerDef[] = [
  { verbs: [SMELL], effects: [{ say: GALLEY_SMELL_TEXT }] },
  { verbs: [LISTEN], effects: [{ say: GALLEY_LISTEN_TEXT }] },
  { verbs: [V_LOOK_UP], effects: [{ say: GALLEY_LOOK_UP_TEXT }] },
  { verbs: [V_TYPE_TERMINAL], effects: [{ say: HAB_TERMINAL_TYPE_TEXT }] },
];

export const habGalleyRoom: RoomDefSlice = {
  name: 'Galley',
  area: 'act4',
  description: galleyDescription,
  handlers: galleyHandlers,
  exits: [{ dir: 'up', to: ACT4_HAB_DOME }],
};

// ---------------------------------------------------------------------------
// §34.1-§34.3 — the Observation Dome, three ProseRules.
// ---------------------------------------------------------------------------

const DOME_FIRST_SIGHT_TEXT =
  'Up the ladder, and then there is nothing over your head.\n\nThe dome is one piece of whatever glass is when it has to do this job, seamed\ninto a steel ring at hip height, and above the ring it is all sky, and it comes\ndown past you on every side until it stops at the ring, so that you are standing\nin the sky up to the waist.\n\nBelow the ring, all the way round, the ground. Regolith the colour of a brick\nleft out in the weather, going away flat and then not flat, with a wheel track\ncut across the near part of it and the track\'s own shadow lying in it.\n\nUnder the dome: a chair, bolted down, set back from the ring so that a person in\nit is looking up and not out. Beside the chair a tripod, and on the tripod a\ncamera with its lens straight up at the top of the dome and a cable release\nhanging off it in a loop.\n\nThere is no fan in this room. That is the first thing you notice about it after\nthe sky and it is the thing you keep noticing.';

const DOME_SISSY_PRESENT_TEXT =
  'The dome, the ring, the ground going away under it, the tripod and the chair.\n\nShe is in the chair with her head back and her hands in her lap and she does not\nturn round.';

const DOME_UNCONDITIONAL_TEXT = 'The sky, the ring, the ground, the chair, the tripod, and no sound at all except\nthe ones you are making.';

const domeDescription: ProseRule[] = [
  { when: { not: { visited: ACT4_HAB_DOME } }, text: DOME_FIRST_SIGHT_TEXT },
  { when: { npcAt: [ACT4_SISSY, ACT4_HAB_DOME] }, text: DOME_SISSY_PRESENT_TEXT },
  { text: DOME_UNCONDITIONAL_TEXT },
];

// ---------------------------------------------------------------------------
// §34.4 — room-level senses.
// ---------------------------------------------------------------------------

const DOME_LISTEN_TEXT =
  'Nothing.\n\nNot quiet — there is no fan up here and no pump and no cycling and no hum in the\nstructure, and what you get instead is your own body, which is loud, and which\nyou are not used to being the loudest thing in a room.';

const DOME_SMELL_TEXT = 'Cold glass and clean steel, and the galley\'s cooking a long way down the ladder\nbehind you.';

const domeHandlers: HandlerDef[] = [
  { verbs: [LISTEN], effects: [{ say: DOME_LISTEN_TEXT }] },
  { verbs: [SMELL], effects: [{ say: DOME_SMELL_TEXT }] },
];

export const habDomeRoom: RoomDefSlice = {
  name: 'Observation Dome',
  area: 'act4',
  description: domeDescription,
  handlers: domeHandlers,
  exits: [{ dir: 'down', to: ACT4_HAB_GALLEY }],
};
