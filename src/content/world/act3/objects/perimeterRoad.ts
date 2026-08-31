// Act III, Wave D3, task A — Perimeter Road & Gatehouse's seven objects
// (`docs/superpowers/specs/2026-09-11-stage-d3-prose.md` §4.3-§4.9), plus
// two uncounted sub-parts (the gatehouse's paperback/calendar, same idiom
// as `ACT2_CLAIM_WINDOW_CARD`/`ACT2_SHELVING_STENCILS` — not counted
// against the room's own "7 objects" tier) and one mechanism-only gate
// door (`ACT3_GATE_DOOR` — never named, same idiom as `TOWN_EDGE_NO_EXIT_
// GATE`). P16 routes (c) and (d) are wired here too, since both live on
// objects this file owns (the fence, the manifest); routes (a) and (a')
// live on the badge and on Nolan (`act2/nolan.ts`'s own amendment) and
// import this file's exported `ARRIVAL_PREFIX`/`ENTER_LOBBY_TAIL`. Prose
// transcribed verbatim (hard rule 5).
//
// MANIFEST PRESENCE IDIOM (ruling 2's own "your call, report"): the
// manifest object is always physically `{ on: ACT3_GATEHOUSE }`, `portable:
// false`; its own `description` is a `ProseRule[]` keyed on `DELIVERY_
// MORNING` so EXAMINE/READ (READ falls back to `description` when no
// `text` is authored, built-in) render the real manifest text on Tuesday
// mornings and "no clipboard on the nail" every other time — no `hidden`/
// `reveal` toggle (one-directional, `effects.ts`'s own `{ reveal }` never
// un-hides — see `act1/objects/generalStore.ts`'s own header for the
// identical problem/idiom choice with the honor box/junk drawer/parts).
// `SIGN MANIFEST`'s "any other day" handler reuses this exact text rather
// than a second copy.
//
// PARSER COLLISION (§21.2): `tunnel_country`'s own noun list (§4.9) drops
// bare "line" — the apron keeps it (§21.2's own recommendation: "the apron
// line is a sub-part of act3_apron ... never bare line" for the posts/
// legend strip). Builder deviation from §4.9's literal noun list, per that
// section's own instruction; flagged in this task's report.
//
// ARRIVAL PREFIX (§5.6): one shared `ProseRule[]` (`ARRIVAL_PREFIX`,
// below), rendered by every successful route AFTER that route sets its own
// flag, so the badge route's literal "not any of the other two flags"
// `when` falls out of this array's own unconditional last rule (De
// Morgan) — flagged in this task's report for the one edge case this
// produces (once tailgated, this array never falls back to the badge line
// again even on a later badge entry; transcribed exactly as ruled, not
// smoothed over).

import type { Cond } from '../../../../engine/cond';
import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { DIRECTION_VERB_IDS, USE_VERB_ID } from '../../../../engine/move';
import { CLIMB, CUT, EXAMINE, OPEN, PUSH, READ, TAKE, TOUCH } from '../../act1/verbs';
import { MONSTER_TRUCK, V_KNOCK, V_SIGN, V_WATCH, WORK_ORDER } from '../../act1/ids';
import { ACT2_Q_INSIDE_THE_PLANT } from '../../act2/ids';
import { DELIVERY_MORNING } from '../../act2/calendar';
import {
  ACT3_ALERTNESS,
  ACT3_APRON,
  ACT3_CLUE_GATE_RHYTHM,
  ACT3_FENCE,
  ACT3_FLAG_ENTERED_AS_VENDOR,
  ACT3_FLAG_TAILGATED,
  ACT3_GATE_DOOR,
  ACT3_GATE_READER,
  ACT3_GATEHOUSE,
  ACT3_GATEHOUSE_CALENDAR,
  ACT3_GATEHOUSE_PAPERBACK,
  ACT3_INSIDE,
  ACT3_JACK_WILL_RAM,
  ACT3_LOBBY,
  ACT3_MANIFEST,
  ACT3_MEM_M20D,
  ACT3_PERIMETER_LIGHT,
  ACT3_PERIMETER_ROAD,
  ACT3_RAM_FENCE_SCRIPT,
  ACT3_TUNNEL_COUNTRY,
  V_ACT3_PHOTOGRAPH,
  V_ACT3_RAM,
} from '../ids';

// ---------------------------------------------------------------------------
// §5.6 — arrival prefixes, and the shared tail every successful route runs.
// ---------------------------------------------------------------------------

const TAILGATE_ARRIVAL =
  'The door he held is still going, shorter each time, and by the time it has finished he is halfway over the terrazzo with his back to you and the mug up at his chest, and he has not looked round once.';

const VENDOR_ARRIVAL =
  'The inner doors are propped open with a rubber wedge for the delivery, and there is a flat trolley parked against the wall on the lobby side with nothing on it and nobody near it.\n\nNobody has asked you anything. Nobody is going to.';

const BADGE_ARRIVAL = 'The lobby doors are on a closer and they let you have the second one yourself.';

export const ARRIVAL_PREFIX: ProseRule[] = [
  { when: { flag: ACT3_FLAG_TAILGATED }, text: TAILGATE_ARRIVAL },
  { when: { flag: ACT3_FLAG_ENTERED_AS_VENDOR }, text: VENDOR_ARRIVAL },
  { text: BADGE_ARRIVAL },
];

/**
 * Shared by every successful P16 route into the Lobby (badge, tailgate,
 * vendor — route (c) goes to the Cooling Plant instead and builds its own
 * tail in `act3/scripts.ts`): `act3_inside`, the question answered, the
 * gate door left open for a later plain `NORTH`/`IN`, the arrival prefix,
 * then `goto`. A route's own flag-setting effect (if any — route (a')
 * sets `act3_flag_tailgated`, route (d) sets
 * `act3_flag_entered_as_vendor`) must run BEFORE this array, so
 * `ARRIVAL_PREFIX` sees it already true.
 */
export const ENTER_LOBBY_TAIL: Effect[] = [
  { set: [ACT3_INSIDE, true] },
  { answerQuestion: ACT2_Q_INSIDE_THE_PLANT },
  { setState: [ACT3_GATE_DOOR, 'open', true] },
  { say: ARRIVAL_PREFIX },
  { goto: ACT3_LOBBY },
];

// ---------------------------------------------------------------------------
// §5.1/§5.2 — routes (a) and (a'). Both live on objects outside this room's
// own module (the badge, and Nolan himself — `act2/nolan.ts`'s own
// amendment), so the text/effects are exported here for that file to wire.
// ---------------------------------------------------------------------------

const routeABadgeText =
  'The pad takes the badge the way a pad takes a badge. There is a beat while something somewhere agrees with something else somewhere, and then the diode goes green, and the display above it comes up amber and says:\n\n    NOLAN — GATE 1\n\nThe turnstile gives when you push it. It gives easily. The arms come round behind you and take up their slack again, and the display goes dark, and the light on the pole goes round on its interval, and the whole of the county\'s security apparatus has now recorded that the man who runs this plant came to work.';

/** `USE BADGE` / `SHOW BADGE TO READER` — wired onto the badge object in `act2/nolan.ts`. */
export const ROUTE_A_BADGE_EFFECTS: Effect[] = [{ say: routeABadgeText }, ...ENTER_LOBBY_TAIL];

const routeAPrimeTailgateText =
  'He goes through the turnstile without breaking step and you go through behind him on the same rotation, close enough to be rude about it, and he does not look round.\n\nAt the lobby doors he does what he has plainly done every working morning of eleven years: gets the toe of his shoe into the gap and stands there holding the door on the flat of his foot until whoever is behind him is through.\n\n"Come on, come on." He has the mug in the badge hand and the bag on the far shoulder. "It\'s cold and there\'s a kettle."\n\nHe does not ask who you are. Nobody at this gate has ever had to ask him for anything.';

/** `FOLLOW NOLAN` at the perimeter — wired onto Nolan's own `handlers` in `act2/nolan.ts`. Sets `act3_flag_tailgated` BEFORE the shared tail so `ARRIVAL_PREFIX` sees it. */
export const ROUTE_A_PRIME_TAILGATE_EFFECTS: Effect[] = [
  { say: routeAPrimeTailgateText },
  { set: [ACT3_FLAG_TAILGATED, true] },
  ...ENTER_LOBBY_TAIL,
];

// ---------------------------------------------------------------------------
// §4.3 — the fence, and route (c)'s RAM/DRIVE THROUGH/DRIVE AT (§5.3).
// ---------------------------------------------------------------------------

const fenceExamine =
  'Welded mesh, galvanised, in eight-foot panels with the fixings on the inside, three strands on outriggers above it, and a skirt turned into the ground so you cannot lift it. It has been put up by somebody who has put up a great deal of fence and it has been paid for by somebody who did not ask what it cost.\n\nThe camera on the near gatepost is a fixed one in a hooded housing, and what it is fixed on is the turnstile. Not the road. Not the fence. The turnstile.\n\nThere is no wire on the fence itself. Nothing runs along it, nothing sits on it, and there is not a sensor on it anywhere that you can find, which for a fence of this quality is a strange economy.';

const fenceClimb =
  'You could. It is eight feet of mesh with fixings you can get a toe into and three strands you would only have to be brave about once.\n\nAnd then you would be standing on a quarter of a mile of lit swept concrete with your own shadow going out ahead of you in four directions and nothing between you and a steel door but the walk.\n\nThe fence is not the problem. The fence has never been the problem.';

const fenceCut =
  'You have no cutters, and the wire is heavier than the sort of cutters you would have. There is a man sixty yards behind you with a vehicle that goes through fences without needing to be sharp.';

const fenceTouch =
  'Cold, and it gives about an inch and comes back, and the whole panel says so — the note runs off both ways down the line and comes back to you a moment later off the corner post.';

const ramWithoutPersuasion =
  'Jack looks at the fence, and then at you, for slightly longer than is comfortable.\n\n"On what?" he says. "On a man\'s diary I can\'t read? I\'d do it on a reason. Get me a reason."';

/** §4.10 — no camera, no way to record any of this. Shared by the room's own bare `TAKE PHOTOGRAPH` and this object's `PHOTOGRAPH FENCE`. */
export const PHOTOGRAPH_TEXT = 'You have no camera. You have a hat, a chair leg and a notebook, and the notebook is the one that has ever proved anything.';

const truckPresent: Cond = { objectAt: [MONSTER_TRUCK, ACT3_PERIMETER_ROAD] };

const fence: ObjectDefSlice = {
  location: ACT3_PERIMETER_ROAD,
  name: 'fence',
  portable: false,
  nouns: ['fence', 'wire', 'mesh', 'chain link', 'chainlink', 'fencing', 'strands', 'camera', 'cameras', 'post', 'posts', 'gate post', 'gatepost'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: fenceExamine }] },
    { verbs: [CLIMB], effects: [{ say: fenceClimb }] },
    { verbs: [CUT], effects: [{ say: fenceCut }] },
    { verbs: [TOUCH], effects: [{ say: fenceTouch }] },
    {
      verbs: [V_ACT3_RAM],
      when: { all: [truckPresent, { any: [{ flag: ACT3_JACK_WILL_RAM }, { memory: ACT3_MEM_M20D }] }] },
      effects: [{ script: { id: ACT3_RAM_FENCE_SCRIPT } }],
    },
    { verbs: [V_ACT3_RAM], when: truckPresent, effects: [{ say: ramWithoutPersuasion }] },
    { verbs: [V_ACT3_PHOTOGRAPH], effects: [{ say: PHOTOGRAPH_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §4.4 — the gatehouse, and its two uncounted sub-parts.
// ---------------------------------------------------------------------------

const gatehouseExamine =
  'A hut for one person, in the same block and the same paint as everything here, with a window at chest height and a roller shutter above the window that is up.\n\nInside: a chair on castors pushed in square to a shelf, a kettle, a mug turned upside down on a folded cloth, a wall calendar with nothing written on it, and a paperback face down and open at about a third.\n\nThe sign over the door is aluminium letters on standoffs, one word, and the standoffs are the good kind.\n\nNobody is in it. Nobody has been in it this week.';

const gatehouseKnockOpenEnter =
  'The window slides in its track and there is nobody on the other side of it to be disturbed. Inside the hut there is nothing that is any of your business and nothing you could use if it were: a kettle, a chair, and somebody\'s place kept in a paperback with the spine broken back.\n\nThe hut is not the way in. The turnstile is the way in, and the turnstile does not care whether the hut has anybody in it.';

const WATCH_GATE_RHYTHM_TEXT =
  'You give it a while, which is what it takes.\n\nThe light goes round on its interval and the interval does not vary. The camera on the gatepost does not move at all, because it is a fixed one, and what it is fixed on is the turnstile. The gate motor runs twice while you are standing there, both times for nothing, on some schedule of its own that exists to keep a gate motor free.\n\nNothing out here looks at the fence. Everything out here looks at the door.';

const watchGateRhythmEffects: Effect[] = [{ say: WATCH_GATE_RHYTHM_TEXT }, { grantClue: ACT3_CLUE_GATE_RHYTHM }];

const gatehouse: ObjectDefSlice = {
  location: ACT3_PERIMETER_ROAD,
  name: 'gatehouse',
  portable: false,
  nouns: ['gatehouse', 'hut', 'guardhouse', 'guard house', 'cabin', 'window', 'shutter', 'sign', 'meridian', 'letters'],
  handlers: [
    // READ too (v0.17.0 playtest): its nouns include the sign's 'letters', and
    // bare READ raised an engine [error] with no text fallback.
    { verbs: [EXAMINE, READ], effects: [{ say: gatehouseExamine }] },
    { verbs: [V_KNOCK, OPEN, DIRECTION_VERB_IDS.in], effects: [{ say: gatehouseKnockOpenEnter }] },
    { verbs: [V_WATCH], effects: watchGateRhythmEffects },
  ],
};

const paperbackText = 'Face down, spine broken, about a third of the way through. Kept by the reader in the crudest way there is, which means somebody meant to come back to it.';

const gatehousePaperback: ObjectDefSlice = {
  location: { on: ACT3_GATEHOUSE },
  name: 'paperback',
  portable: false,
  nouns: ['paperback', 'book'],
  handlers: [{ verbs: [EXAMINE, READ], effects: [{ say: paperbackText }] }],
};

const calendarText =
  'A wall calendar from a valve supplier, with a photograph of a valve on it. The month showing is the month it is. Nothing is written on any of the squares.';

const gatehouseCalendar: ObjectDefSlice = {
  location: { on: ACT3_GATEHOUSE },
  name: 'calendar',
  portable: false,
  nouns: ['calendar', 'wall calendar'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: calendarText }] }],
};

// ---------------------------------------------------------------------------
// §4.5 — the reader, and route (a)'s "USE BADGE"/"SHOW BADGE TO READER".
// ---------------------------------------------------------------------------

const readerExamine =
  'A stainless pedestal at hip height with a black pad set into the top of it at an angle, a green diode under the pad, and a small display above it, currently dark.\n\nThe turnstile beside it is a full-height one, three arms, powder-coated, with a rubber-lipped floor plate to stop the wind coming through.\n\nThe pad is clean. There is no smear on it and no wear in the plastic and no weather in the seals, and this is a thing outdoors in a county where the wind carries grit. Somebody comes out here and wipes it.';

// Builder decision: this text renders for every `USE READER`/`PUSH TURNSTILE`
// regardless of whether the badge is held — only `USE BADGE`/`SHOW BADGE TO
// READER` (on the badge object, `act2/nolan.ts`'s own amendment) succeed.
// The doc authors this text specifically for "without the badge"; no
// separate text exists for "use reader" while holding it. Flagged in this
// task's report.
const readerWithoutBadge =
  'The arms take up their slack and stop against the pawl, which is a good mechanism doing its one job.\n\nThe diode does not come on. The display stays dark. Nothing anywhere acknowledges that you have touched the thing at all, and that is the entire character of the objection: it is not refusing you, it is not registering you.';

const gateReader: ObjectDefSlice = {
  location: ACT3_PERIMETER_ROAD,
  name: 'reader',
  portable: false,
  nouns: ['reader', 'badge reader', 'pad', 'pedestal', 'scanner', 'turnstile', 'gate', 'barrier'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: readerExamine }] },
    { verbs: [USE_VERB_ID, PUSH], effects: [{ say: readerWithoutBadge }] },
    { verbs: [V_WATCH], effects: watchGateRhythmEffects },
  ],
};

// ---------------------------------------------------------------------------
// §4.6 — the light, and alertness's first sentence (§14.1 rule 1).
// ---------------------------------------------------------------------------

const lightExamine: ProseRule[] = [
  {
    when: { flag: ACT3_ALERTNESS, atLeast: 1 },
    text: 'A head on a slow rotator at the top of a galvanised pole, throwing a hard flat wedge that goes round the inside of the fence and out over the grazing and back.\n\nIt is going round quicker than it was the first time you stood here. Nothing else about it has changed: same head, same pole, same wedge, same hum out of the gear at the top of the mast.',
  },
  {
    text: 'A head on a slow rotator at the top of a galvanised pole. It throws a hard flat wedge that goes round the inside of the fence, out over the grazing, and back, on an interval, and it will do that all night whether there is anybody here or not.\n\nThe gear at the top of the mast makes a small sound at the same point of every turn.',
  },
];

const perimeterLight: ObjectDefSlice = {
  location: ACT3_PERIMETER_ROAD,
  name: 'light',
  portable: false,
  nouns: ['light', 'lamp', 'floodlight', 'flood', 'pole', 'mast', 'beam', 'sweep'],
  description: lightExamine,
  // EXAMINE has no built-in of its own (`actions.ts`'s `BUILTIN_VERB_IDS`
  // doesn't include it) and does not fall back to `description` the way
  // READ does — an explicit handler is required, found by manual testing
  // (a builder gap, flagged in this task's report). `description` above is
  // kept too, so READ LIGHT (no `text` authored) still reaches the same
  // rule set via its own built-in fallback.
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: lightExamine }] },
    { verbs: [V_WATCH], effects: watchGateRhythmEffects },
  ],
};

// ---------------------------------------------------------------------------
// §4.7 — the manifest, and route (d)'s SIGN MANIFEST / WRITE VENDOR NUMBER.
// ---------------------------------------------------------------------------

const manifestPresentText =
  'A clipboard on a nail beside the window, hanging on a length of the same string that everything in this county hangs on.\n\nThe top sheet is a delivery manifest with the columns ruled and printed: vendor, order, vehicle, in, out, signature. Six rows of it are filled in for this morning and the vehicles are on the apron behind you.\n\nThree of the signatures are the same handwriting with three different vendor names over them. Nobody has ever looked at this sheet after the day it was written, and the sheet knows it.';

export const MANIFEST_ABSENT_TEXT =
  'There is no clipboard on the nail. There is a nail, with a loop of string on it, and a shine on the block wall under it the shape of a clipboard.';

const manifestDescription: ProseRule[] = [
  { when: DELIVERY_MORNING, text: manifestPresentText },
  { text: MANIFEST_ABSENT_TEXT },
];

const manifestTakeText = "It is on a nail on a string and it is somebody's morning. You put it back.";

const manifestSignSuccessText =
  'The work order has a vendor number on it, printed, in a box, top right, put there by whoever raises work orders at this plant and never looked at again by anybody.\n\nYou take the pencil off the string, put the number in the vendor column, put the shape of a signature in the signature column, and hang the clipboard back on its nail.\n\nThen the gate motor thinks about it for slightly longer than a machine needs to and opens the whole gate rather than the turnstile, because a vendor has a vehicle, and a man standing on the wrong side of a painted line waves you across it without ever once raising his eyes above your knees.';

export const MANIFEST_SIGN_NO_ORDER_TEXT =
  'The vendor column wants a number and you have not got one. You could put down any six figures you liked, and the sheet would take them, and the gate would not, because the gate is the only thing in this arrangement that is actually checking anything.';

export const ROUTE_D_MANIFEST_EFFECTS: Effect[] = [
  { say: manifestSignSuccessText },
  { set: [ACT3_FLAG_ENTERED_AS_VENDOR, true] },
  ...ENTER_LOBBY_TAIL,
];

const manifest: ObjectDefSlice = {
  location: { on: ACT3_GATEHOUSE },
  name: 'manifest',
  portable: false,
  nouns: ['manifest', 'clipboard', 'board', 'sheet', 'delivery', 'paperwork', 'list'],
  description: manifestDescription,
  // EXAMINE needs its own handler — see `perimeterLight`'s own comment
  // above on why `description` alone doesn't reach it.
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: manifestDescription }] },
    { verbs: [TAKE], when: DELIVERY_MORNING, effects: [{ say: manifestTakeText }] },
    { verbs: [V_SIGN], when: { all: [DELIVERY_MORNING, { has: WORK_ORDER }] }, effects: ROUTE_D_MANIFEST_EFFECTS },
    { verbs: [V_SIGN], when: DELIVERY_MORNING, effects: [{ say: MANIFEST_SIGN_NO_ORDER_TEXT }] },
    { verbs: [V_SIGN], effects: [{ say: MANIFEST_ABSENT_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §4.8 — the apron.
// ---------------------------------------------------------------------------

const apronExamine =
  'Poured concrete in bays with the joints sawn and sealed, painted out into lanes and standings, and swept — actually swept, with a machine, recently enough that the grit is in windrows along the kerb line and has not blown back.\n\nAlong the near edge, four inches wide and unbroken, there is a yellow line with hatching inside it, and everything on the far side of that line is somebody\'s business and everything on this side is nobody\'s.\n\nNothing is parked on it. Nothing is stored on it. It is the tidiest quarter of a mile in the state and it is used for about four hours a week.';

const apron: ObjectDefSlice = {
  location: ACT3_PERIMETER_ROAD,
  name: 'apron',
  portable: false,
  nouns: ['apron', 'concrete', 'yard', 'hardstand', 'bays', 'line', 'markings', 'paint'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: apronExamine }] }],
};

// ---------------------------------------------------------------------------
// §4.9 — the country (west). Bare "line" dropped — see this file's own
// header note on §21.2.
// ---------------------------------------------------------------------------

const countryExamine =
  'West of the road the ground goes away in long shallow rises that do not look like anything until you have walked one.\n\nOut in it, a good way off, there is a line of cedar posts, grey and split at the tops, carrying no wire and having carried none for a long time by the look of the staples. They are not on the line of anything anybody is keeping. They cross the country at their own angle and they go north, and where they go north is behind you and to your right, which is to say: in here.';

const tunnelCountry: ObjectDefSlice = {
  location: ACT3_PERIMETER_ROAD,
  name: 'country',
  portable: false,
  nouns: ['country', 'grazing', 'grass', 'west', 'posts', 'cedar posts', 'fenceposts', 'fence posts', 'ground'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: countryExamine }] }],
};

// ---------------------------------------------------------------------------
// The gate door — mechanism only, never named (no `nouns`), closed until
// any P16 route opens it (§21.4/§21.5).
// ---------------------------------------------------------------------------

const gateDoor: ObjectDefSlice = { location: ACT3_PERIMETER_ROAD, name: 'gate door' };

export const ACT3_PERIMETER_ROAD_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_FENCE]: fence,
  [ACT3_GATEHOUSE]: gatehouse,
  [ACT3_GATEHOUSE_PAPERBACK]: gatehousePaperback,
  [ACT3_GATEHOUSE_CALENDAR]: gatehouseCalendar,
  [ACT3_GATE_READER]: gateReader,
  [ACT3_PERIMETER_LIGHT]: perimeterLight,
  [ACT3_MANIFEST]: manifest,
  [ACT3_APRON]: apron,
  [ACT3_TUNNEL_COUNTRY]: tunnelCountry,
  [ACT3_GATE_DOOR]: gateDoor,
};
