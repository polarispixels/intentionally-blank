// Stage E2, task P — the Galley's and the Dome's furniture
// (`docs/superpowers/specs/2026-09-19-stage-e2-prose.md` §27-§31, §35-§40,
// §56.2). Prose transcribed exactly (hard rule 5).
//
// NOUN COLLISIONS (§56.2, this task's own brief) — resolved here, not left
// to chance, exactly per that section's own table: `act4_anomaly_logs`
// takes `anomaly`/`reports`, bare `LOGS` in the Galley is this clipboard;
// `act4_sky_log` (Dome) takes `sky`/`notebook`, one room apart, no
// collision in scope; `act4_dome_glass` is named because "glass" is the
// Dome's best bare noun, distinct from the library's shipped `ground
// glass`/`act1_broken_glass` (different rooms); `act4_camera` and the
// Chamber's `act4_family_camera` (task O's own) are different rooms,
// "never in scope together" per the doc's own recommendation; `act4_sissy_
// film`'s adjectives (`sissy`/`her`/`mars`/`second`) keep it distinct from
// `act2_film_canister`/`act4_print_sky` per that same row.
//
// THE AIRLOCK — `act4_airlock_door`'s `OPEN`/`ENTER`/`EXIT`/`USE` (every
// phrasing that NAMES the door) reaches `act4_leave_hab` (`../scripts.ts`)
// via ordinary object-handler dispatch. Bare "OUT" (no object named) does
// NOT reach it — a genuine, confirmed engine gap, not a mis-wiring: `move.
// ts`'s `traverseDirection` (called from `respond.ts`'s `respondToAction`,
// BEFORE `performAction` and BEFORE any object/room handler ever runs,
// whenever a direction verb resolves with no `dobj`) renders the global
// "no exit that way" family directly and returns, for any room with no
// `ExitDefSlice` in that direction — and §56.4 explicitly forbids giving
// the Galley one ("the hab's way out is an object, not an exit"). Flagged
// in this task's report with the exact call sites; recommend either an
// engine fix (letting that no-exit branch fall through to room-level
// `handlers` first, mirroring the fallback `performAction` already gives
// bare STAND/`V_TYPE_TERMINAL`) or relaxing the doc's own constraint.

import type { ObjectDefSlice } from '../../../../engine/world';
import { DIRECTION_VERB_IDS, USE_VERB_ID } from '../../../../engine/move';
import { EXAMINE, OPEN, READ, SIT, TAKE, TOUCH } from '../../act1/verbs';
import { INTACT_POLAROIDS, V_COUNT } from '../../act1/ids';
import { V_FIT } from '../../act2/ids';
import {
  ACT4_AIRLOCK_DOOR,
  ACT4_ANOMALY_LOGS,
  ACT4_CAMERA,
  ACT4_CLUE_SAME_ARRANGEMENT,
  ACT4_COMMS_RIG,
  ACT4_DOME_CHAIR,
  ACT4_DOME_GLASS,
  ACT4_GALLEY_TABLE,
  ACT4_HAB_DOME,
  ACT4_HAB_GALLEY,
  ACT4_HAB_TERMINAL,
  ACT4_HAB_TRAYS,
  ACT4_HORIZON,
  ACT4_LEAVE_HAB_SCRIPT,
  ACT4_SISSY,
  ACT4_SISSY_FILM,
  ACT4_SKY,
  ACT4_SKY_LOG,
} from '../ids';

// ---------------------------------------------------------------------------
// §27 — the anomaly logs.
// ---------------------------------------------------------------------------

const LOGS_EXAMINE_TEXT =
  'On a clipboard by the rig, a wad of printouts on the flimsy paper a thermal\nprinter uses, going brown at the edges where the top sheets have been in the\nlamp.\n\nEvery one of them is the same form. A date field she has filled in by hand. A box\nfor the observation. A box underneath for the response.\n\nThe observations get shorter as they go down the wad. The early ones are\nparagraphs, with the field of view given and the exposure and the equipment. In\nthe middle they are two lines. Near the top of the pile — which is the recent end\n— one of them says only: same as 14 through 31.\n\nEvery response box on every sheet has the same word typed into it by something\nthat is not a person.\n\nHANDLED.';

const LOGS_TAKE_TEXT =
  'The clip comes up and the wad comes off it and it is a double handful of thermal\npaper, which is the least durable material anybody has ever chosen to put a\nrecord on.\n\nIt has been through a printer, which means it came down a wire, which means it is\na copy of something that a machine agreed to print.\n\nYou put it back under the clip. It is not the thing you came for and you knew\nthat before you picked it up.';

const anomalyLogs: ObjectDefSlice = {
  location: ACT4_HAB_GALLEY,
  name: 'anomaly logs',
  portable: false,
  nouns: ['logs', 'log', 'reports', 'report', 'anomaly', 'anomalies', 'printouts', 'file', 'folder', 'binder', 'clip'],
  adjectives: ['anomaly', 'filed'],
  handlers: [
    { verbs: [EXAMINE, READ], effects: [{ say: LOGS_EXAMINE_TEXT }] },
    { verbs: [TAKE], effects: [{ say: LOGS_TAKE_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §28 — the comms rig. `SEND MESSAGE`/`TYPE ON RIG` (bare, `V_ACT4_SEND_
// MESSAGE`, `../verbs.ts`) share this exact text with "USE RIG" (`USE_VERB_
// ID`, below) — exported so `../verbs.ts` doesn't duplicate it.
// ---------------------------------------------------------------------------

const RIG_EXAMINE_TEXT =
  'A grey box in a rack with a handset on a hook, a keyboard on a shelf under it,\nand a small screen with a queue on it.\n\nThe queue has two columns, OUT and IN, and the OUT column is longer.\n\nBeside the screen, printed on a strip of dymo tape and stuck to the rack by\nsomebody who wanted to be able to see it without turning their head: LINK DELAY\nNOMINAL — ALLOW FULL ROUND TRIP.';

export const RIG_SEND_MESSAGE_TEXT =
  'You type something short into the OUT field. It does not matter what; it is the\nsort of thing you put in a box to see what the box does.\n\nYou put your hand on the key and send it.\n\nThe reply is on the screen before your hand is off the key.\n\nIt is a correct reply. It is addressed correctly and it answers what you asked\nand it is signed by a desk with a name and a number, and it arrived in less time\nthan it takes to lift a hand off a switch, and the strip of dymo tape says to\nallow the full round trip.\n\nShe has told you what the round trip is. She was told it too.';

const commsRig: ObjectDefSlice = {
  location: ACT4_HAB_GALLEY,
  name: 'comms rig',
  portable: false,
  nouns: ['rig', 'comms', 'radio', 'transmitter', 'set', 'key', 'console', 'link', 'uplink'],
  adjectives: ['comms', 'radio'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: RIG_EXAMINE_TEXT }] },
    // §28.2 — never flagged: no `grantClue`, no `set` anywhere near this
    // handler (the note is explicit that this is the one reveal in the wave
    // with no clue object at all).
    { verbs: [USE_VERB_ID], effects: [{ say: RIG_SEND_MESSAGE_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §29 — the hab terminal. L3 station four (canon 112). `HAB_TERMINAL_TYPE_
// TEXT` exported so the room's own bare `V_TYPE_TERMINAL` handler
// (`../hab.ts`, same idiom as `act3/s6ArchiveHub.ts`'s own terminal split)
// reuses the identical string.
// ---------------------------------------------------------------------------

const TERMINAL_EXAMINE_TEXT =
  'The same beige. The same deep grey screen with the phosphor even the whole way\nacross. The same keyboard with the same three keys worn shiny and the same key\nmissing off the top row.\n\nIt is not showing a prompt. It is showing a clock: hours, minutes, and a seconds\nfield going over, in the middle of the screen, in characters four times the\nheight of the rest of the character set, the way a machine displays a thing when\nthere is nothing else it has been asked to do.\n\nThe clock agrees with the clock on the bench under the building.';

export const HAB_TERMINAL_TYPE_TEXT =
  'You put your hands on it and type, and the characters do not appear.\n\nNot refused. Not rejected. There is no prompt to type into, no cursor, no line at\nthe bottom of the screen where a line goes, and no response of any kind to a\nkeyboard being used.\n\nThe clock goes over.';

const habTerminal: ObjectDefSlice = {
  location: ACT4_HAB_GALLEY,
  name: 'terminal',
  portable: false,
  nouns: ['terminal', 'computer', 'screen', 'monitor', 'keyboard', 'keys', 'station', 'clock', 'machine'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: TERMINAL_EXAMINE_TEXT }] },
    { verbs: [USE_VERB_ID], effects: [{ say: HAB_TERMINAL_TYPE_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §30 — the airlock door. See this file's own header for the confirmed
// bare-"OUT" engine gap.
// ---------------------------------------------------------------------------

const AIRLOCK_EXAMINE_TEXT =
  'An oval door in the bulkhead with a bar across it and a gasket in a channel round\nit that somebody keeps greased, and a round window at head height.\n\nThrough the window: white paint, a grab rail, a suit rack with a gap in it second\nfrom the small end, and, on the far side of that, a room with grey cord carpet in\nit and a bench with a terminal on the bench.\n\nThat is the wrong thing to be able to see out of the window of an airlock and it\nis what is out of the window of this one.';

const airlockDoor: ObjectDefSlice = {
  location: ACT4_HAB_GALLEY,
  name: 'airlock',
  portable: false,
  nouns: ['airlock', 'lock', 'hatch', 'oval door', 'inner door', 'bar', 'gasket', 'seal', 'window'],
  adjectives: ['inner', 'oval', 'airlock'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: AIRLOCK_EXAMINE_TEXT }] },
    { verbs: [OPEN, DIRECTION_VERB_IDS.in, DIRECTION_VERB_IDS.out, USE_VERB_ID], effects: [{ script: { id: ACT4_LEAVE_HAB_SCRIPT } }] },
  ],
};

// ---------------------------------------------------------------------------
// §31.1 — the galley table.
// ---------------------------------------------------------------------------

const GALLEY_TABLE_EXAMINE_TEXT =
  'A steel top on a hinge, with a lip round it a quarter-inch proud, and two seats\nthat fold out of the bulkhead under it.\n\nThere are rings on the steel where a hot cup has been put down and left, and they\nare all in the same place, and there is a groove worn in the lip in front of that\nplace from a forearm.\n\nShe sits on that side. Nobody sits on the other side, and the restraint over\nthere is tied out of the way with a bootlace so that it stops hitting the wall.';

const galleyTable: ObjectDefSlice = {
  location: ACT4_HAB_GALLEY,
  name: 'table',
  portable: false,
  nouns: ['table', 'galley table', 'seat', 'seats', 'restraint', 'restraints', 'bootlace', 'lip'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: GALLEY_TABLE_EXAMINE_TEXT }] }],
};

// ---------------------------------------------------------------------------
// §31.2 — the trays.
// ---------------------------------------------------------------------------

const TRAYS_EXAMINE_TEXT =
  'Shallow trays under a lamp with a red-purple cast to it that makes everything\nunder it look like a photograph of itself.\n\nThe near one has something green in it in rows, thin and doing well enough, with\nthe soil dark and level and the runs of it tucked in round the stems by a finger.\n\nThe far one has stalks in it. Dry, upright, the colour of paper, with the seed\nheads still on. Nobody has emptied it and nobody is going to.\n\nThere is a plastic label pushed into the dead one with a word on it in pencil,\nand the pencil has gone silver the way pencil does under a lamp like that, and\nthe word is still legible and is the name of a herb.';

const habTrays: ObjectDefSlice = {
  location: ACT4_HAB_GALLEY,
  name: 'trays',
  portable: false,
  nouns: ['trays', 'tray', 'plants', 'plant', 'garden', 'soil', 'lamp', 'green', 'seedlings'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: TRAYS_EXAMINE_TEXT }] }],
};

// ---------------------------------------------------------------------------
// §35 — the dome glass.
// ---------------------------------------------------------------------------

const GLASS_EXAMINE_TEXT =
  'Thicker than you want it to be and clearer than glass that thick has any right to\nbe, with the ring bedded into it at hip height in a channel of black compound run\nin by somebody with a gun and a steady hand.\n\nThere are no seams in it above the ring. It is one piece. You can walk the whole\nway round the ring with a hand on the glass and find nothing in it: no join, no\nlamination line, no distortion where a pane would end.';

const GLASS_TOUCH_TEXT =
  'Cold.\n\nThat is the whole of what it is. It is cold the way a window is cold on the\ninside on a hard night, and your hand takes the cold, and the flat of your palm\nleaves a mark on it that goes away from the edges inward.';

const domeGlass: ObjectDefSlice = {
  location: ACT4_HAB_DOME,
  name: 'glass',
  portable: false,
  // §35.2's own note: this response is what makes R17 possible — no seam
  // is ever put in this glass.
  nouns: ['glass', 'dome', 'pane', 'ring', 'seam', 'seams', 'steel ring'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: GLASS_EXAMINE_TEXT }] },
    { verbs: [TOUCH], effects: [{ say: GLASS_TOUCH_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §36 — the horizon. §55.1 is NOT wired (the quarantined closing sentence).
// ---------------------------------------------------------------------------

const HORIZON_EXAMINE_TEXT =
  'It goes away from the hab flat for a long way and then it does not, and where it\nstops being flat it does it in the round-shouldered way of country that has had a\nvery long time and no water to speak of.\n\nClose in, the ground is not smooth. It is grit over a crust, and the crust is\nbroken up round the hab where things have been walked on it, and the wheel track\ncomes in from the left and goes round out of sight behind the structure. The\ntrack has a shadow in it, which means the sun is low, which means it has been low\nfor a while.\n\nThere are rocks. There is nothing else. There is not one thing out there that was\nnot out there before anybody came.\n\nIt is a planet. It is being one extremely convincingly and without any effort at\nall, and that is the last time anybody in this room is going to be able to say\nso.';

const horizon: ObjectDefSlice = {
  location: ACT4_HAB_DOME,
  name: 'horizon',
  portable: false,
  nouns: ['horizon', 'ground', 'regolith', 'dust', 'surface', 'track', 'wheel track', 'tracks', 'planet', 'mars', 'outside', 'landscape'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: HORIZON_EXAMINE_TEXT }] }],
};

// ---------------------------------------------------------------------------
// §37 — the sky. §37.2's refusal (canon 93, register 135); §37.3's compare
// (grants `act4_clue_same_arrangement`).
// ---------------------------------------------------------------------------

const SKY_EXAMINE_TEXT =
  'Points.\n\nHard, still points, on a black with nothing in it — no haze, no colour at the\nbottom of it, no gradient anywhere. There is no air out there to make any of them\nmove, so none of them does, and a sky where nothing twinkles is the single\nstrangest thing you have looked at in three weeks of strange things, and it takes\nabout a minute to work out why.\n\nThey are of different sizes. Not brightnesses — sizes, and you can see it without\nan instrument: a big one over the wheel track with a long shallow\ntriangle of smaller ones under it, and a close pair below and to the left of\nthat.\n\nThe eye keeps going back to those. Not because they are the brightest. Because\nthey are the shape the eye has decided to hold on to, which is how anybody has\never found anything in a sky.';

const SKY_COUNT_STARS_TEXT =
  'You ask yourself for a number.\n\nWhat comes back is the bright one, and the triangle under it, and the close\npair, and then the bright one again — because that is what the eye does with a field it\nhas not been given any way to organise. It finds the shape it already knows and\nhands you that instead, over and over, and it will go on doing it all night and\nyou will not get a total out of it.\n\nYou are not the instrument for this.\n\nThere is one in this room, on a tripod, pointed straight up, with a cable release\nhanging off it.';

const SKY_COMPARE_POLAROID_TEXT =
  'You hold it up at arm\'s length with the gutter line along the bottom of the ring\nand turn slowly until it stops being wrong.\n\nIt stops being wrong facing the wheel track.\n\nThe bright one is where the bright one is. The triangle under it has the same\nlean and the same proportions. The close pair sits below and left of it at the\nsame distance and the same angle, and there is a faint one under the pair on the\nPolaroid and there is a faint one under the pair up there.\n\nThe Polaroid is out of focus. It has been out of focus since you took it out of a\nbox in a corridor, and out of focus is what it is going to stay: the stars on it\nare soft discs of different sizes and there is nothing in any of them, and\nanybody could tell you that a blur is not evidence and would be right.\n\nBut a blur has a position.\n\nYou take it down and put it away, and stand in a dome on another planet with a\nphotograph of a porch roof in your inside pocket, and you would like a better\nphotograph.';

const sky: ObjectDefSlice = {
  location: ACT4_HAB_DOME,
  name: 'sky',
  portable: false,
  nouns: ['sky', 'stars', 'star', 'night', 'field', 'constellation', 'constellations', 'arrangement'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: SKY_EXAMINE_TEXT }] },
    // Register 135 (§58 row 133 in the doc's own numbering) — a refusal
    // that teaches: no digit, no number word, no range, and it names the
    // camera.
    { verbs: [V_COUNT], effects: [{ say: SKY_COUNT_STARS_TEXT }] },
    { verbs: [V_FIT], withInstrument: [INTACT_POLAROIDS], effects: [{ say: SKY_COMPARE_POLAROID_TEXT }, { grantClue: ACT4_CLUE_SAME_ARRANGEMENT }] },
  ],
};

// ---------------------------------------------------------------------------
// §38 — the camera. The `St` route to the canister: `TAKE FILM` succeeds
// only with Sissy absent from the Dome.
// ---------------------------------------------------------------------------

const CAMERA_EXAMINE_TEXT =
  'A chemical camera, and not a cheap one: a metal body on a proper head, with the\nlens straight up at the top of the dome and a cable release screwed into the\nshutter and hanging in a loop off the leg.\n\nThere is tape over the frame counter with a number written on the tape in pencil,\nand the tape has been written on and crossed out and written on again a number of\ntimes.\n\nThe back has a film in it. You can see the cassette through the little window\nwhere the manufacturers put a little window precisely so that people would stop\nopening the back to check.';

const CAMERA_TAKE_FILM_ABSENT_TEXT =
  'You wind it back — the crank comes up out of the top plate and turns, and the\ntension goes off it all at once at the end, and you keep going two turns past\nthat out of caution.\n\nThe back comes open on a hinge that has been opened a lot. The cassette comes out\ninto your hand, warm from nothing, and goes into your pocket.\n\nThe camera stays as it is: on the tripod, pointed straight up, with the cable\nrelease hanging in a loop off the leg and the tape on the counter that will need\ncrossing out.\n\nShe does not ask for it back. Not that day and not any day.';

const CAMERA_TAKE_FILM_PRESENT_TEXT =
  'Your hand goes to the back of it and she says, without turning round in the\nchair, "Ask me."\n\nShe does not sound annoyed. She sounds like somebody who would rather be asked.';

const camera: ObjectDefSlice = {
  location: ACT4_HAB_DOME,
  name: 'camera',
  portable: false,
  // Transparent (never opened as a container in the engine's own sense —
  // winding it back is what the text describes, not a state change) so the
  // loaded film is in scope for "TAKE FILM"/"EXAMINE FILM" at all — §38.1's
  // own "little window" is this container's `transparent: true`.
  container: { transparent: true },
  nouns: ['camera', 'tripod', 'lens', 'body', 'release', 'cable release', 'shutter', 'back'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: CAMERA_EXAMINE_TEXT }] },
    // "OPEN CAMERA" — dobj is the camera itself; same text/gate as the
    // film's own TAKE handlers, below.
    { verbs: [OPEN], when: { npcAt: [ACT4_SISSY, ACT4_HAB_DOME] }, effects: [{ say: CAMERA_TAKE_FILM_PRESENT_TEXT }] },
    {
      verbs: [OPEN],
      when: { not: { npcAt: [ACT4_SISSY, ACT4_HAB_DOME] } },
      effects: [{ say: CAMERA_TAKE_FILM_ABSENT_TEXT }, { move: [ACT4_SISSY_FILM, 'inventory'] }],
    },
  ],
};

/**
 * §32.2/§38.2's canister — starts loaded in the camera (`{ in: ACT4_CAMERA
 * }`, reachable via the camera's own `transparent` container, above). No
 * bespoke EXAMINE text authored for it in this task's own sections;
 * developing it is task Q's own scene. "TAKE FILM" resolves its dobj to
 * THIS object (its own noun, not the camera's) — the present/absent split
 * lives here, not on the camera, for that phrasing; "OPEN CAMERA" (above)
 * reaches the identical text and effect via the camera's own dobj.
 */
const sissyFilm: ObjectDefSlice = {
  location: { in: ACT4_CAMERA },
  name: 'film',
  portable: true,
  nouns: ['film', 'canister', 'cassette', 'roll'],
  adjectives: ['sissy', 'her', 'mars', 'second'],
  handlers: [
    { verbs: [TAKE], when: { npcAt: [ACT4_SISSY, ACT4_HAB_DOME] }, effects: [{ say: CAMERA_TAKE_FILM_PRESENT_TEXT }] },
    {
      verbs: [TAKE],
      when: { not: { npcAt: [ACT4_SISSY, ACT4_HAB_DOME] } },
      effects: [{ say: CAMERA_TAKE_FILM_ABSENT_TEXT }, { move: [ACT4_SISSY_FILM, 'inventory'] }],
    },
  ],
};

// ---------------------------------------------------------------------------
// §39 — her chair.
// ---------------------------------------------------------------------------

const DOME_CHAIR_EXAMINE_TEXT =
  'An ordinary steel-framed chair, bolted through the floor at the corners, set back\nfrom the ring at the angle that makes a person in it look up.\n\nThe seat is worn through on one side and not the other. The right arm has the\nfinish off it. There is no book on it, no cup ring, no cushion, no blanket, and\nnothing tucked down the side, because whatever she does in this chair does not\nrequire any of those.\n\nThe bolts are not original. Somebody moved it, once, and got it right, and has\nnot moved it since.';

const DOME_CHAIR_SIT_TEXT =
  'You sit down in it and your head goes back because the chair makes it go back,\nand the ring drops out of the bottom of your vision, and there is nothing in\nfront of you that is not sky.\n\nIt is a very good chair. Whoever set the angle spent an evening on it.\n\nAfter a while you notice that you have stopped looking at the bright one and the\ntriangle and the pair, and have started looking at the black between them, which\nhas nothing in it at all and goes on having nothing in it for as long as you are\nprepared to keep looking.';

const domeChair: ObjectDefSlice = {
  location: ACT4_HAB_DOME,
  name: 'chair',
  portable: false,
  nouns: ['chair', 'seat', 'her chair', 'cushion', 'arm', 'arms'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: DOME_CHAIR_EXAMINE_TEXT }] },
    { verbs: [SIT], when: { not: { npcAt: [ACT4_SISSY, ACT4_HAB_DOME] } }, effects: [{ say: DOME_CHAIR_SIT_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §40 — her log.
// ---------------------------------------------------------------------------

const SKY_LOG_TEXT =
  'A hardback notebook wedged between the chair leg and the floor bracket, with a\npencil down the spine and the covers gone soft.\n\nHandwriting, all of it hers, every entry starting with a number she has written in\nthe margin and ruled off. The numbers run on down the page and over onto the next\none and you leave them alone; they are hers, and they are a filing system, and a\nfiling system is nobody\'s business.\n\nThe entries themselves are short and get shorter.\n\nCloud, if that is what we are calling it.\n\nNothing. Sat two hours. Recommend nothing.\n\nWent round the whole thing twice with the reticle. It is the plate. It is exactly\nthe plate.\n\nFiled. Will file again.\n\nAnd near the back, on its own, in the same pencil and a lot smaller:\n\nIf it is right then it has been right the whole time, which is worse.';

const skyLog: ObjectDefSlice = {
  location: ACT4_HAB_DOME,
  name: 'log',
  portable: false,
  nouns: ['log', 'logbook', 'notebook', 'book', 'sky log', 'entries', 'pencil'],
  handlers: [{ verbs: [EXAMINE, READ], effects: [{ say: SKY_LOG_TEXT }] }],
};

export const ACT4_P_HAB_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT4_ANOMALY_LOGS]: anomalyLogs,
  [ACT4_COMMS_RIG]: commsRig,
  [ACT4_HAB_TERMINAL]: habTerminal,
  [ACT4_AIRLOCK_DOOR]: airlockDoor,
  [ACT4_GALLEY_TABLE]: galleyTable,
  [ACT4_HAB_TRAYS]: habTrays,
  [ACT4_DOME_GLASS]: domeGlass,
  [ACT4_HORIZON]: horizon,
  [ACT4_SKY]: sky,
  [ACT4_CAMERA]: camera,
  [ACT4_SISSY_FILM]: sissyFilm,
  [ACT4_DOME_CHAIR]: domeChair,
  [ACT4_SKY_LOG]: skyLog,
};

// ---------------------------------------------------------------------------
// Integration (v0.18.0): §37.3's own header order is COMPARE POLAROID WITH
// SKY — the dobj is the Polaroid, so the handler must also live there
// (task P's report flagged it). Amended in place, the usb.ts idiom.
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// Integration (v0.18.0): §37.3's own header order is COMPARE POLAROID WITH
// SKY — the Polaroid is the dobj there, so the mirror handler lives on the
// shipped Polaroids (task P's report flagged the word order). The usb.ts
// amend-in-place idiom; the text and the clue are this file's, stated once.
// ---------------------------------------------------------------------------
import { CLOSE_OUT_OBJECTS } from '../../act1/objects/closeOut';
{
  const polaroids = CLOSE_OUT_OBJECTS[INTACT_POLAROIDS];
  if (polaroids !== undefined) {
    polaroids.handlers = [
      { verbs: [V_FIT], withInstrument: [ACT4_SKY], effects: [{ say: SKY_COMPARE_POLAROID_TEXT }, { grantClue: ACT4_CLUE_SAME_ARRANGEMENT }] },
      ...(polaroids.handlers ?? []),
    ];
  }
}
