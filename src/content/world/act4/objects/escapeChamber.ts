// Stage E, wave E2, task O — the two lit gate frames and the Escape
// Chamber's twelve objects (`docs/superpowers/specs/2026-09-19-stage-e2-
// prose.md` §3.2, §3.3, §7-§20, §24). Every string transcribed exactly
// (hard rule 5). The room shell (description/onEnter/exits/room-level
// handlers) lives in `../escapeChamber.ts`; this file is the objects only,
// the same split `objects/stagingArea.ts`/`stagingArea.ts` already use.
//
// `act4_gate_hab` (§3.3) is declared here with EXAMINE only — its own `IN`
// handler is task P's to push onto this same exported object (the shared
// "amend an object's handlers array in place" idiom `act3/objects/
// s6ArchiveHub.ts` already uses for `nolanBadge`/`usb`), running
// `act4_enter_hab` once that task lands it.

import type { Effect } from '../../../../engine/effects';
import type { HandlerDef, ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { DIRECTION_VERB_IDS } from '../../../../engine/move';
import {
  EXAMINE,
  HELLO,
  LISTEN,
  LOOK_UNDER,
  OPEN,
  PRY,
  PULL,
  PUT_ON,
  READ,
  SEARCH,
  SIT,
  STAND,
  TAKE,
  TOUCH,
  TURN,
  UNLOCK,
} from '../../act1/verbs';
import { CHAIR_LEG, V_ATTACK, V_PLAY } from '../../act1/ids';
import { ACT3_S6_ARCHIVE_HUB } from '../../act3/ids';
import { V_FIT } from '../../act2/ids';
import { ACT4_Q_DARKROOM_OBJECTS } from './darkroom';
import {
  ACT4_BARE_HOOK,
  ACT4_CHAIRS,
  ACT4_CHAMBER_DOOR,
  ACT4_CHAMBER_FAILURES,
  ACT4_CHAMBER_FIRST_DONE,
  ACT4_CHAMBER_ROOM_REF,
  ACT4_CHAMBER_WINDOW,
  ACT4_CHAMBER_COPY_FOUND,
  ACT4_CLUE_HARVEST_WRONG,
  ACT4_COATS,
  ACT4_COFFEE_JAR,
  ACT4_COUNTDOWN,
  ACT4_ENTER_ESCAPE_SCRIPT,
  ACT4_ESCAPE_CHAMBER,
  ACT4_ESCAPE_EXIT_GATE,
  ACT4_FAMILY_CAMERA,
  ACT4_ENTER_HAB_SCRIPT,
  ACT4_FAMILY_TABLE,
  ACT4_GAME_BOX,
  ACT4_GATE_ESCAPE,
  ACT4_GATE_HAB,
  ACT4_HAB_EXIT_GATE,
  ACT4_PRINT_LAST_DAY,
  ACT4_SILHOUETTE,
  ACT4_SPARE_KEY,
  ACT4_TABLE_DRAWER,
  ACT4_VOICES,
  V_ACT4_GO_FIRST,
} from '../ids';

// ---------------------------------------------------------------------------
// §3.2 — `act4_gate_escape`. `IN` runs the threshold script (§4).
// ---------------------------------------------------------------------------

const GATE_ESCAPE_EXAMINE_TEXT =
  'Standing right under it, the light behind it has a floor in it.\n\nNot much of one. A line, low down, running left to right across the whole width\nof the opening, where a floor would meet a wall if there were a floor and a\nwall. Above the line the standby glow is even. Below it, it is fractionally\nwarmer, the way light is warmer coming off something laid down flat.\n\nFrom the middle of the room you cannot see it at all. It is the sort of detail\nthat goes away if you look at it directly and comes back if you look at the\nstrip of plastic over it instead.';

export const gateEscape: ObjectDefSlice = {
  location: ACT3_S6_ARCHIVE_HUB,
  portable: false,
  name: 'the first frame',
  nouns: ['escape room', 'escape', 'first frame', 'first', 'lit frame', 'light'],
  adjectives: ['first', 'lit', 'escape'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: GATE_ESCAPE_EXAMINE_TEXT }] },
    { verbs: [DIRECTION_VERB_IDS.in], effects: [{ script: { id: ACT4_ENTER_ESCAPE_SCRIPT } }] },
  ],
};

// ---------------------------------------------------------------------------
// §3.3 — `act4_gate_hab`. `IN` runs task P's own `act4_enter_hab` traversal
// script (P's own header note on `./scripts.ts`'s `act4EnterHab`: "called
// from task O's act4_gate_hab object's own IN handler").
// ---------------------------------------------------------------------------

const GATE_HAB_EXAMINE_TEXT =
  'The second one is dark and the sill under it is not.\n\nCast into the concrete under this opening, and under no other opening in the\nrow, there is a shallow trough: a rounded channel about two fingers wide,\nrunning the width of the frame, with a lip on the far side of it.\n\nIt is the shape a floor is given when something with a rubber seal on the\nbottom of it is going to come down on it, over and over, and be expected to\nhold pressure.';

export const gateHab: ObjectDefSlice = {
  location: ACT3_S6_ARCHIVE_HUB,
  portable: false,
  name: 'the second frame',
  nouns: ['hab', 'mars', 'second frame', 'second'],
  adjectives: ['second', 'dark', 'hab'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: GATE_HAB_EXAMINE_TEXT }] },
    { verbs: [DIRECTION_VERB_IDS.in], effects: [{ script: { id: ACT4_ENTER_HAB_SCRIPT } }] },
  ],
};

// ---------------------------------------------------------------------------
// §7 — the coats. Class object, `portable: false`.
// ---------------------------------------------------------------------------

const COATS_EXAMINE_TEXT =
  'Working coats and one that is not.\n\nA man\'s canvas chore coat, gone soft, with a rule pocket on the thigh and the\nrule still in it. A parka with the fur off the hood on one side. A denim jacket\nwith a patch sewn on badly and a second patch sewn on over the bad sewing. A\nlong wool thing, black, far too good for this room, on the hook nearest the door\nso that it can be got at fastest. And a child\'s anorak, red, which has been let\ndown at the cuffs and is still too short.\n\nThey are all on the hook and none of them is on the hook properly. Every one of\nthem is hung by the collar rather than the loop, which is what people do to\ncoats and what nobody does to a coat they are describing to somebody.';

const COATS_SEARCH_TEXT =
  'Cigarette papers in the chore coat, and a rule that pulls out to a foot and\nlocks. A boiled sweet in the parka, gone to liquid inside the wrapper. Nothing\nin the denim.\n\nThe black wool coat has an inside pocket with a stitched line where a label goes\nand no label in it, which is a thing about expensive coats and not a thing about\nthis room.\n\nThe red anorak has a mitten in it. One.';

const COATS_TAKE_TEXT =
  'It comes off the hook and it has the weight of a coat and the smell of one, and\nyou stand in a stranger\'s kitchen holding it.\n\nYou put it back on the hook. By the collar, because that is how the others are\non.';

export const coats: ObjectDefSlice = {
  location: ACT4_ESCAPE_CHAMBER,
  portable: false,
  name: 'the coats',
  nouns: ['coats', 'coat', 'hooks', 'hook', 'row', 'pegs', 'peg', 'rack', 'pockets', 'pocket'],
  adjectives: ['family', 'hanging'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: COATS_EXAMINE_TEXT }] },
    { verbs: [SEARCH], effects: [{ say: COATS_SEARCH_TEXT }] },
    { verbs: [TAKE], effects: [{ say: COATS_TAKE_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §8 — the bare hook. `portable: false`. Canon 54's rhyme, unnamed — see the
// doc's own note: no response here uses the words tape/gum/label/letters.
// ---------------------------------------------------------------------------

const BARE_HOOK_EXAMINE_TEXT =
  'The hook is the same as the others: a screwed-on cast thing with two arms, and\nthe paint on it is the paint on all of them.\n\nWhat is different is the wall behind it.\n\nBehind each of the other hooks there is a shadow of a coat — a soft grey outline\npushed into the paint by years of the same shoulder in the same place, which is\na thing that happens to a wall in a hall whether anybody wants it to or not.\n\nBehind this one the paint is clean. Not wiped clean. The same age as the paint\neverywhere else in the room, and nothing has ever been against it.';

const BARE_HOOK_TOUCH_TEXT =
  'You take the black wool coat off its own hook and put it on this one, and it\nhangs there, and it is a coat on a hook.\n\nNothing about the room acknowledges it. You put it back.';

export const bareHook: ObjectDefSlice = {
  location: ACT4_ESCAPE_CHAMBER,
  portable: false,
  name: 'the bare hook',
  nouns: ['bare hook', 'empty hook', 'spare hook', 'sixth hook'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: BARE_HOOK_EXAMINE_TEXT }] },
    // "HANG COAT ON HOOK" has no reachable verb form in this codebase (no
    // "hang" word on any declared verb, and `act1/verbs.ts` is out of this
    // task's named files) — flagged in this task's report; TOUCH reaches
    // the same text.
    { verbs: [TOUCH], effects: [{ say: BARE_HOOK_TOUCH_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §9 — the silhouette. `portable: false`, no adjectives.
// ---------------------------------------------------------------------------

const SILHOUETTE_EXAMINE_TEXT =
  'There is nothing there. That is the first and most reliable thing about it and\nit goes on being true however long you look.\n\nWhat there is, is what the room is doing around a place where nothing is. The\nlight off the window falls across the linoleum and stops on a line, and starts\nagain on the far side of a gap about the width of a person, and the edge of the\ngap is soft the way the edge of a shadow is soft and not the way the edge of a\ncut-out is.\n\nThe chair at that end of the table is pushed back from the table by about the\ndistance a chair goes when somebody has stood up out of it in a hurry and has\nnot come back for it.\n\nIt is standing height. It is not doing anything. It has no front and no back.';

const SILHOUETTE_TOUCH_TEXT =
  'Your hand goes through the place where the light is not, and comes out the far\nside of it, and is a hand.\n\nThere is no cold spot, no resistance, no hum, and nothing in the room changes\nits mind about anything. Whatever is being withheld here is being withheld at\nthe level of the record, and the record does not care what you do with your arm.';

const SILHOUETTE_STAND_TEXT =
  'You step into it.\n\nThe light closes over you the way water does not — instantly, with no edge — and\nthe gap in it is gone, and now the room has a person in the middle of it and the\nperson is you.\n\nFrom in here you can see the whole of the table, the door, the hooks, and the\nback of the stove. It is the standing place in this kitchen from which the most\nof it is visible, which is either a fact about a room or a fact about a man, and\nthe room is not saying which.\n\nNothing else happens. Standing in the place is not the same as doing what was\ndone in it.';

export const silhouette: ObjectDefSlice = {
  location: ACT4_ESCAPE_CHAMBER,
  portable: false,
  name: 'the silhouette',
  nouns: ['silhouette', 'shape', 'figure', 'person', 'place', 'space', 'gap', 'outline', 'nobody'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: SILHOUETTE_EXAMINE_TEXT }] },
    { verbs: [TOUCH, HELLO, V_ATTACK], effects: [{ say: SILHOUETTE_TOUCH_TEXT }] },
    // "STAND WHERE THE SHAPE IS" does not reliably parse (its final word
    // "is" would resolve as the head noun under this grammar's phrase
    // rules) — flagged in this task's report; STAND/TAKE ("take his
    // place") both reach this text.
    { verbs: [STAND, TAKE], effects: [{ say: SILHOUETTE_STAND_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §10 — the family table. `portable: false`.
// ---------------------------------------------------------------------------

const TABLE_EXAMINE_TEXT =
  'A rectangular deal table, scrubbed pale, with the grain standing proud of the\nsoft wood between the grain — sixty years of scrubbing takes a table down that\nway and nothing else does.\n\nSet for a meal that has been eaten. Plates stacked at one end, cutlery gathered\non the top plate, a jug with an inch of water left in it and the light going\nthrough it onto the wood.\n\nThere are rings on the table and ink on the table and one place where something\nwas cut against it and the cut was not deep enough to matter and deep enough to\nlast.\n\nThe good cloth is not on it. It is on the dresser behind, folded in a square with\nthe crease of the fold gone shiny, the way a cloth goes when it lives folded.';

const TABLE_LOOK_UNDER_TEXT =
  'Four legs, a stretcher, and the underside of a table top, which is the part of a\ntable nobody scrubs.\n\nThere is a wad of something dried on under there, high up in the corner, in\nabout the position a hand goes if a hand is going to do that, and it has been\nthere long enough to be the colour of the wood.';

const TABLE_CLOTH_TEXT =
  'You shake it out and lay it over the table and square it up at the corners, and\nit fits, because it is that table\'s cloth.\n\nThe room does not object and does not care. It is not the cloth that is wrong\nhere, and putting it on does not make it right; it makes two things wrong at\nonce.\n\nYou take it off and fold it back down to its own creases.';

export const familyTable: ObjectDefSlice = {
  location: ACT4_ESCAPE_CHAMBER,
  portable: false,
  name: 'the family table',
  nouns: ['table', 'kitchen table', 'top', 'surface', 'dresser', 'cloth', 'good cloth'],
  adjectives: ['kitchen', 'family', 'wooden'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: TABLE_EXAMINE_TEXT }] },
    { verbs: [LOOK_UNDER], effects: [{ say: TABLE_LOOK_UNDER_TEXT }] },
    { verbs: [TAKE, PUT_ON], effects: [{ say: TABLE_CLOTH_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §11, §19 — the drawer in the table. `container: { open: false, locked:
// true, key: act4_spare_key }`.
// ---------------------------------------------------------------------------

const DRAWER_EXAMINE_TEXT =
  'A single shallow drawer in the long side of the table, with a wooden knob and a\nbrass escutcheon round a keyhole that somebody once thought a kitchen table\nneeded.\n\nThe knob is worn bright down one side. Whoever opened this most came at it from\nthe left, and did it often, and did not stop to think about it once.';

const DRAWER_LOCKED_TEXT =
  'Locked. Properly locked — the drawer moves the eighth of an inch that a drawer\nmoves against its own lock and then stops dead on it.\n\nThere is no key in the escutcheon and no key on the table and no key on any of\nthe hooks, which is unusual, because a locked drawer in a kitchen is not a\nsecurity arrangement. It is a place where something goes so that nobody has to\nask where it went.';

const DRAWER_PRY_TEXT =
  'You get the end of the leg into the gap over the drawer front and lean on it,\nand the table comes up off two of its feet, and the drawer does not.\n\nThe leg is too thick to go past the rail, the front is oak and the top is deal\nand the deal will go first, and you can feel the whole table telling you so\nthrough the wood.\n\nThis drawer has a key. You have not yet been anywhere in this room that a key is\nkept.';

const DRAWER_UNLOCK_TEXT = 'The key goes in, turns a quarter turn against a lock that has one spring in it,\nand the drawer comes out on wooden runners with the noise wooden runners make.';

const DRAWER_CONTENTS_TEXT =
  'Inside: a ball of string. Batteries, dead, kept. A church key. A tin of\nplasters with a hinge that has gone. A photograph wallet, empty, with a\nchemist\'s name on it that does not exist any more.\n\nAnd a camera.\n\nA plastic thirty-five-millimetre compact, the automatic kind, with a wrist strap\nand a scratch across the front of the lens housing where it has been in and out\nof this drawer for years.\n\nThe back is open, and it is empty, and the take-up spool has the little curl of\nleader on it that a film leaves behind when somebody has rewound it and taken it\nout.';

const DRAWER_SEARCH_AGAIN_TEXT =
  'You go over the drawer again. String, batteries, a church key, an empty wallet,\nand a camera with nothing in it.\n\nThere is no second thing in here. There was never going to be; it is a kitchen\ndrawer.';

const DRAWER_UNLOCK_EFFECTS: Effect[] = [
  { say: DRAWER_UNLOCK_TEXT },
  { setState: [ACT4_TABLE_DRAWER, 'locked', false] },
  { setState: [ACT4_TABLE_DRAWER, 'open', true] },
  // Revealed here too, not only on a later EXAMINE/SEARCH DRAWER — a drawer
  // that comes out shows what is in it without a separate "look inside."
  { reveal: ACT4_FAMILY_CAMERA },
];

// Three handlers, not one `ProseRule` with a blanket `reveal`/`inc` after
// it — §19.4's repeat-search soft fail increments `act4_chamber_failures`
// (the doc's own flag table: "§18.2, §19.4, §21.3 (inc)"), and only that
// branch should.
const drawerLookHandlers: HandlerDef[] = [
  { verbs: [EXAMINE, SEARCH], when: { not: { objectState: [ACT4_TABLE_DRAWER, 'open', true] } }, effects: [{ say: DRAWER_LOCKED_TEXT }] },
  {
    verbs: [EXAMINE, SEARCH],
    when: { not: { flag: ACT4_CHAMBER_COPY_FOUND } },
    effects: [{ say: DRAWER_CONTENTS_TEXT }, { reveal: ACT4_FAMILY_CAMERA }],
  },
  { verbs: [EXAMINE, SEARCH], effects: [{ say: DRAWER_SEARCH_AGAIN_TEXT }, { inc: ACT4_CHAMBER_FAILURES }] },
];

export const tableDrawer: ObjectDefSlice = {
  location: ACT4_ESCAPE_CHAMBER,
  portable: false,
  container: { open: false, locked: true, key: ACT4_SPARE_KEY },
  name: 'the drawer',
  nouns: ['drawer', 'table drawer', 'top drawer', 'handle', 'knob'],
  handlers: [
    ...drawerLookHandlers,
    { verbs: [UNLOCK], withInstrument: [ACT4_SPARE_KEY], effects: DRAWER_UNLOCK_EFFECTS },
    { verbs: [OPEN], when: { has: ACT4_SPARE_KEY }, effects: DRAWER_UNLOCK_EFFECTS },
    { verbs: [OPEN, PULL], effects: [{ say: DRAWER_LOCKED_TEXT }] },
    { verbs: [PRY], effects: [{ say: DRAWER_PRY_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §19.2/§19.3 — the family camera, revealed inside the drawer.
// ---------------------------------------------------------------------------

const CAMERA_FIRST_CHECK_TEXT =
  'You have the drawer open and your hand on the camera, checking a thing that\nwanted checking before anybody sat down, and the room takes it.\n\nThe handles come on the cupboard doors. Not one after another: they are on, and\nthey are the wrong shade of the same colour as the doors, the way a handle is\nwhen it has been replaced once.\n\nFrom the speaker, the slow one, quietly, to somebody who is not you: "He\'s\nchecked it. He always checks it."';

const CAMERA_DESCRIBE_TEXT =
  'A plastic thirty-five-millimetre compact, the automatic kind, with a wrist strap\nand a scratch across the front of the lens housing where it has been in and out\nof this drawer for years.\n\nThe back is open, and it is empty, and the take-up spool has the little curl of\nleader on it that a film leaves behind when somebody has rewound it and taken it\nout.';

const CAMERA_PROSE: ProseRule[] = [
  { when: { not: { flag: ACT4_CHAMBER_COPY_FOUND } }, text: CAMERA_FIRST_CHECK_TEXT },
  { text: CAMERA_DESCRIBE_TEXT },
];

export const familyCamera: ObjectDefSlice = {
  location: { in: ACT4_TABLE_DRAWER },
  hidden: true,
  portable: false,
  name: 'the camera',
  nouns: ['camera'],
  adjectives: ['family'],
  handlers: [{ verbs: [EXAMINE, TAKE], effects: [{ say: CAMERA_PROSE }, { set: [ACT4_CHAMBER_COPY_FOUND, true] }] }],
};

// ---------------------------------------------------------------------------
// §12, §19.4 — the coffee jar. `portable: false`.
// ---------------------------------------------------------------------------

const JAR_EXAMINE_TEXT =
  'On the shelf over the stove, between a tin with a blank label and a tin with a\nblank label, a squat glass jar with a screw lid and about two inches of ground\ncoffee in the bottom of it.\n\nThe lid is the only lid in this kitchen that anybody has bothered to keep clean.';

const JAR_REVEAL_TEXT =
  'The lid comes off in the half-turn of a lid that gets taken off a lot.\n\nCoffee, and the smell of coffee, which in here is the first smell that has come\nfrom the thing it ought to be coming from.\n\nAnd down the side of the jar, pushed in against the glass where a hand going in\nfor a spoonful would go round it rather than through it, a small flat key on a\nloop of green string.\n\nYou have been told about this jar. Not this jar. The principle of it, in a\ngarage, by a man who thought it was the most obvious thing in the world and\ncould not understand why it had to be said twice.';

const JAR_EMPTY_TEXT = 'The jar has coffee in it and a smell of coffee and nothing else. Whatever was\nkept down the side of the glass is on a green string in your pocket.';

// Two handlers, not one `ProseRule` — §19.4's "after it is empty" soft fail
// increments `act4_chamber_failures` (the doc's own flag table), and only
// that branch should; the reveal branch should not.
const jarHandlers: HandlerDef[] = [
  { verbs: [SEARCH, OPEN], when: { not: { has: ACT4_SPARE_KEY } }, effects: [{ say: JAR_REVEAL_TEXT }, { reveal: ACT4_SPARE_KEY }] },
  { verbs: [SEARCH, OPEN], effects: [{ say: JAR_EMPTY_TEXT }, { inc: ACT4_CHAMBER_FAILURES }] },
];

export const coffeeJar: ObjectDefSlice = {
  location: ACT4_ESCAPE_CHAMBER,
  portable: false,
  // A jar with a screw lid, mechanically always "open" — `inScopeAt`
  // (`engine/world.ts`) requires a container to be open or transparent
  // before anything placed `{ in: … }` it is in scope at all; without this,
  // the spare key stayed unreachable even after `reveal` flipped its
  // `hidden` overlay (found the hard way, TDD run one).
  container: { open: true },
  name: 'the coffee jar',
  nouns: ['jar', 'coffee jar', 'coffee', 'tin', 'shelf', 'caddy'],
  adjectives: ['coffee', 'glass'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: JAR_EXAMINE_TEXT }] }, ...jarHandlers],
};

// ---------------------------------------------------------------------------
// §13 — the spare key. `portable: true`.
// ---------------------------------------------------------------------------

const KEY_EXAMINE_TEXT =
  'A flat steel key about the length of a thumb joint, with the wards cut shallow\nand a stamped number in the bow that is not stamped on anything else in this room.\n\nThe string is green and is tied in a granny knot, which is a knot tied by\nsomebody who did not care and did not have to.';

export const spareKey: ObjectDefSlice = {
  location: { in: ACT4_COFFEE_JAR },
  hidden: true,
  portable: true,
  name: 'spare key', // no article — the clarify prompt adds its own
  nouns: ['key', 'spare key', 'small key', 'flat key', 'string', 'loop'],
  adjectives: ['small', 'spare', 'flat', 'green'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: KEY_EXAMINE_TEXT }] }],
};

// ---------------------------------------------------------------------------
// §14, §18 — the chairs. Class object, `portable: false`.
// ---------------------------------------------------------------------------

const CHAIRS_EXAMINE_TEXT =
  'Kitchen chairs, and no two of them out of the same set, which is what happens to\na kitchen over a long enough run of children.\n\nA pair of spindle-backs with the varnish gone off the top rail. One has a woven\nseat with a hole starting in the middle of it and a magazine underneath the\nweave holding the hole shut. One is a bentwood with a wire round the joint of\nthe back leg, wound tight and twisted off with pliers, and the twist has been\nflattened over with a hammer so it will not take anybody\'s leg.\n\nAnd the one at the end with its back to the window is pushed out from the table\nand nobody is in it.';

export const CHAIRS_SIT_FIRST_TEXT =
  'You pull the end chair in under you with your back to the window and put both\nhands flat on the table, which is not a decision you remember making.\n\nThe speaker does not react. Nothing announces anything.\n\nWhat happens is that the room gets slightly more real at the edges. The pattern\non the curtain runs a hand\'s width further in from the hem than it did. There is\nprinting on one of the tins now — a brand, in a typeface that stopped being made\na long time ago — and there was not before.\n\nFrom the speaker, the woman\'s voice, entirely unbothered: "Finally."';

const CHAIRS_SIT_FAIL_TEXT =
  'You take one of the other chairs.\n\nThe voices go on. Nobody objects and nobody says anything to you, because there\nis nothing in this recording about somebody sitting in the wrong chair; there\nwas never an occasion on which anybody did.\n\nThe space at the end of the sentence comes round again, and again nothing goes\ninto it, and the timer on the sill goes on doing what it is doing.\n\nWhatever is supposed to happen next in this kitchen has not started.';

/** §18.1 — shared by the chairs' own SIT handler and the room's bare "GO FIRST"/"TAKE THE FIRST TURN" handler (`../escapeChamber.ts`). */
export const CHAMBER_SIT_FIRST_EFFECTS: Effect[] = [{ say: CHAIRS_SIT_FIRST_TEXT }, { set: [ACT4_CHAMBER_FIRST_DONE, true] }];
/** §18.2 — ditto, the fail branch. */
export const CHAMBER_SIT_FAIL_EFFECTS: Effect[] = [{ say: CHAIRS_SIT_FAIL_TEXT }, { inc: ACT4_CHAMBER_FAILURES }];

export const chairs: ObjectDefSlice = {
  location: ACT4_ESCAPE_CHAMBER,
  portable: false,
  name: 'the chairs',
  nouns: ['chairs', 'chair', 'seat', 'seats', 'first chair', 'end chair'],
  adjectives: ['kitchen', 'wooden', 'first'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: CHAIRS_EXAMINE_TEXT }] },
    { verbs: [SIT], when: { not: { flag: ACT4_CHAMBER_FIRST_DONE } }, effects: CHAMBER_SIT_FIRST_EFFECTS },
    { verbs: [SIT], effects: CHAMBER_SIT_FAIL_EFFECTS },
  ],
};

// ---------------------------------------------------------------------------
// §15 — the countdown. `portable: false`. No figure, ever.
// ---------------------------------------------------------------------------

const COUNTDOWN_EXAMINE_TEXT =
  'A clockwork kitchen timer on the sill over the sink: a chrome dome the size of a\nfist with a bakelite dial, wound round to where somebody wound it to.\n\nThe dial has the marks a dial has and there is nothing readable on any of them —\nnot worn off, not scratched out. The paint that would be numbers has been laid\non and never made into anything.\n\nIt is going. You can hear it from the door.';

const COUNTDOWN_TURN_TEXT =
  'It winds. It goes round under your fingers with the ratchet noise timers make\nand stops where you stop, and starts again the instant you let go.\n\nYou cannot put more time on this than it wants and you cannot take it off. What\nyou can do is stand at a sink in a house you have never been in, holding the\nneck of a timer, listening to it decide.';

export const countdown: ObjectDefSlice = {
  location: ACT4_ESCAPE_CHAMBER,
  portable: false,
  name: 'the countdown',
  nouns: ['timer', 'countdown', 'clock', 'dial', 'kitchen timer', 'sill'],
  adjectives: ['kitchen', 'wound'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: COUNTDOWN_EXAMINE_TEXT }] },
    // "STOP TIMER" has no reachable verb form (no "stop" word on TURN) —
    // flagged in this task's report; TURN ("turn"/"wind") reaches this text.
    { verbs: [TURN], effects: [{ say: COUNTDOWN_TURN_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §16 — the Catan box. Flavour only (canon 9). `portable: false`.
// ---------------------------------------------------------------------------

const GAME_BOX_EXAMINE_TEXT =
  'On the dresser under the folded cloth, a game box with the corners gone soft and\none corner mended with electrical tape.\n\nThe lid is on. Somebody has written on the end of the box, in marker, in a\nchild\'s capitals, the words HOUSE RULES, and underneath them nothing at all,\nbecause whoever started writing them down found out how long they were going to\ntake.';

const GAME_BOX_OPEN_TEXT = 'Cardboard, a lot of small wooden pieces in a bag, and a rule book with a coffee\nring on it.\n\nNobody in this room is going to play a game with you and the timer is going.';

export const gameBox: ObjectDefSlice = {
  location: ACT4_ESCAPE_CHAMBER,
  portable: false,
  name: 'the game box',
  nouns: ['box', 'game', 'board game', 'catan', 'settlers', 'lid', 'cards'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: GAME_BOX_EXAMINE_TEXT }] },
    { verbs: [OPEN, V_PLAY], effects: [{ say: GAME_BOX_OPEN_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §17 — the recorded voices. `portable: false`.
// ---------------------------------------------------------------------------

const VOICES_TEXT =
  'There is a speaker over the door, a paper cone in a pressed grille, painted over\nwith the wall in a way that means it was never meant to be seen, and it is\ncarrying a kitchen.\n\nA man\'s voice with a lot of the county still in it, saying something about the\ndrive back. A woman\'s, younger than the rest of it, going\nstraight over the top of him. A slow one, being funny very quietly and being\nmissed. And one that starts sentences and does not always land them.\n\nThey talk across each other and finish each other and go quiet in the same\nplaces, which is what a family does and what four people recorded separately do\nnot.\n\nNone of them is talking to you. And every so often all of them leave a space, of\nabout the length a short answer takes, and then carry on from the other side of\nit.';

export const voices: ObjectDefSlice = {
  location: ACT4_ESCAPE_CHAMBER,
  portable: false,
  name: 'the voices',
  nouns: ['voices', 'voice', 'speaker', 'sound', 'family', 'them', 'tape', 'recording'],
  handlers: [{ verbs: [LISTEN, EXAMINE], effects: [{ say: VOICES_TEXT }] }],
};

// ---------------------------------------------------------------------------
// §20 — the window and the curtain. Never opens, in any state.
// ---------------------------------------------------------------------------

const WINDOW_EXAMINE_TEXT =
  'A sash window over the table with a curtain drawn across the whole of it, hem to\nrail, on a wire.\n\nThe pattern is small flowers for about a foot in from each edge and then it gives\nup and is a colour — a soft mid-green with nothing in it — all the way across the\nmiddle.\n\nBehind the curtain the glass is glass. There is light coming through it, the even\nsort, off nothing.';

const WINDOW_OPEN_TEXT =
  'You take the edge of it and pull, and the rings go along the wire the way rings\ndo, and the curtain gathers, and behind it the pattern of the curtain carries on.\n\nYou pull it further. It carries on further.\n\nWhatever is on the other side of that glass was not in anybody\'s memory of this\nafternoon, because nobody sitting at this table looked out of this window, and\nthe room has done the only honest thing available to it, which is to keep drawing\ncurtain for as long as you keep asking for window.\n\nYou let go and it goes back to where it was.';

export const chamberWindow: ObjectDefSlice = {
  location: ACT4_ESCAPE_CHAMBER,
  portable: false,
  name: 'the window',
  nouns: ['window', 'curtain', 'curtains', 'glass', 'sill', 'hem', 'pattern'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: WINDOW_EXAMINE_TEXT }] },
    { verbs: [OPEN, PULL, SEARCH], effects: [{ say: WINDOW_OPEN_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §21.1 — the grey door and its panel. The prompt itself is
// `act4_chamber_door_open`/`act4_chamber_phrase_respond` (`../scripts.ts`);
// bare TYPE (`V_TYPE_TERMINAL`) reaching it is wired on the room, not here
// (`../escapeChamber.ts`) — a bare verb only ever consults a room's own
// `handlers` (this codebase's established rule, `act3/objects/
// s6ArchiveHub.ts`'s own header).
// ---------------------------------------------------------------------------

const CHAMBER_DOOR_EXAMINE_TEXT =
  'A flush grey door where a back door should be, hung on a frame that has been let\ninto the plaster and made good and painted the kitchen\'s colour, so that the wall\nis a lie for about four inches all the way round it and then stops being one.\n\nNo handle. A panel beside it at shoulder height, dark, with a bevel round it.\n\nWhen the timer runs out the panel has one line on it. The rest of the time it has\nnothing on it, and there is no cursor.';

export const chamberDoor: ObjectDefSlice = {
  location: ACT4_ESCAPE_CHAMBER,
  portable: false,
  name: 'the grey door',
  nouns: ['door', 'back door', 'grey door', 'panel', 'bevel'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: CHAMBER_DOOR_EXAMINE_TEXT }] }],
};

// ---------------------------------------------------------------------------
// §24 — `COMPARE PRINT WITH ROOM`/`COMPARE PHOTOGRAPH WITH KITCHEN`. `V_FIT`
// parses "compare X with Y" as dobj=X, iobj=Y (`grammar.ts`'s `findPrepIndex`
// splits on the prep, dobj before it, iobj after) — so for either surface
// phrasing above, dobj resolves to Q's print object (`act4_print_last_day`,
// which claims "print"/"photograph") and iobj to this file's own room-
// reference stub (below, claiming "room"/"kitchen" — no other Chamber
// fixture claims either word). The handler therefore has to live on Q's
// print object, checking `withInstrument: [ACT4_CHAMBER_ROOM_REF]` — the
// same "amend a shared object's handlers array in place" idiom
// `act3/objects/s6ArchiveHub.ts` already uses for `nolanBadge`/`usb`, and Q's
// own `objects/darkroom.ts` already uses for `ACT4_P_HAB_OBJECTS`'s Sissy-
// film object. A first draft put this handler directly on the room-
// reference stub instead (dobj assumed backwards) — found the hard way,
// by the object never being checked at all since `V_FIT` only ever
// consults the resolved DOBJ's own handlers.
// ---------------------------------------------------------------------------

const COMPARE_PRINT_ROOM_TEXT =
  'You hold it up and stand where the camera stood, which is not difficult, because\nthere is only one place in this kitchen a camera can have been.\n\nEverything lines up. The window in the same place, the dresser in the same place,\nthe chip in the beading, the stove, the hooks with a coat on every one of them,\nthe burn on the counter beside the ring.\n\nThe good cloth is on the table.\n\nOn the table, laid on, squared up at the corners, with the plates on top of it.\nIt is four feet from you, folded on the dresser, with the crease gone shiny.\n\nThe people this room was built out of were not looking at the tablecloth,\nbecause none of them had to be: it was on, the way it was always\non when the good cloth went on, and a thing that is always true is the first\nthing to go.';

export const chamberRoomRef: ObjectDefSlice = {
  location: ACT4_ESCAPE_CHAMBER,
  portable: false,
  name: 'the kitchen',
  nouns: ['room', 'kitchen'],
};

const printLastDayObj = ACT4_Q_DARKROOM_OBJECTS[ACT4_PRINT_LAST_DAY]!;
if (printLastDayObj.handlers === undefined) printLastDayObj.handlers = [];
const alreadyWiredCompareRoom = printLastDayObj.handlers.some(
  (h) => Array.isArray(h.withInstrument) && h.withInstrument.includes(ACT4_CHAMBER_ROOM_REF),
);
if (!alreadyWiredCompareRoom) {
  printLastDayObj.handlers.push({
    verbs: [V_FIT],
    withInstrument: [ACT4_CHAMBER_ROOM_REF],
    effects: [{ say: COMPARE_PRINT_ROOM_TEXT }, { grantClue: ACT4_CLUE_HARVEST_WRONG }],
  });
}

// ---------------------------------------------------------------------------
// Export maps.
// ---------------------------------------------------------------------------

// The Hub's two exits' own `door` stubs (see `ids.ts`'s own comment on
// `ACT4_ESCAPE_EXIT_GATE`/`ACT4_HAB_EXIT_GATE` for why these are separate
// objects from the frames themselves). Never opens — no `container`.
const escapeExitGate: ObjectDefSlice = { location: ACT3_S6_ARCHIVE_HUB };
const habExitGate: ObjectDefSlice = { location: ACT3_S6_ARCHIVE_HUB };

/** The Hub's two lit gate frames, plus the two door-stub objects the Hub's exits reference — declared in the Hub's own object map (`act3/objects/s6ArchiveHub.ts`), not here. */
export const ACT4_O_HUB_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT4_GATE_ESCAPE]: gateEscape,
  [ACT4_GATE_HAB]: gateHab,
  [ACT4_ESCAPE_EXIT_GATE]: escapeExitGate,
  [ACT4_HAB_EXIT_GATE]: habExitGate,
};

export const ACT4_O_CHAMBER_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT4_COATS]: coats,
  [ACT4_BARE_HOOK]: bareHook,
  [ACT4_SILHOUETTE]: silhouette,
  [ACT4_FAMILY_TABLE]: familyTable,
  [ACT4_TABLE_DRAWER]: tableDrawer,
  [ACT4_FAMILY_CAMERA]: familyCamera,
  [ACT4_COFFEE_JAR]: coffeeJar,
  [ACT4_SPARE_KEY]: spareKey,
  [ACT4_CHAIRS]: chairs,
  [ACT4_COUNTDOWN]: countdown,
  [ACT4_GAME_BOX]: gameBox,
  [ACT4_VOICES]: voices,
  [ACT4_CHAMBER_WINDOW]: chamberWindow,
  [ACT4_CHAMBER_DOOR]: chamberDoor,
  [ACT4_CHAMBER_ROOM_REF]: chamberRoomRef,
};

// Re-exported so the room shell (`../escapeChamber.ts`) can reuse the bare
// "GO FIRST"/"TAKE THE FIRST TURN" wiring without a second copy of the text.
export { V_ACT4_GO_FIRST };
