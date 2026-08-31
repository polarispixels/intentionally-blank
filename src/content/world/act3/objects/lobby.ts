// Act III, Stage D3, task B — the Lobby / Visitor Center's six objects,
// plus two uncounted sub-parts (the bench and the coffee-through-a-door —
// see `act3/ids.ts`'s own header on why neither counts toward "6").
// `docs/superpowers/specs/2026-09-11-stage-d3-prose.md` §7. Prose
// transcribed verbatim (hard rule 5).
//
// THE INNER TURNSTILE (§7.5, this task's ruling 1) — `act3_lobby_reader`
// starts `container: { open: false }`. `EVENT_ACT3_LOBBY_READER_OPENS`
// (below, wired into `world.events` by `act3/index.ts`) sets it `open:
// true` the first turn any of the three passage conditions holds (badge in
// hand, tailgated, or entered as vendor) — a live `Cond`, unlike
// `objectState`'s own static overlay, is only readable through `exit.when`
// (which would render the generic no-exit family on failure, not this
// object's own blockedText) or `EventDef`/`ScheduleRule` (both re-evaluate
// every tick); an `EventDef` is the only one of those that can flip a
// *door's* `open` flag, which is what lets `act3/lobby.ts`'s own `north`/
// `in` exits use `door: ACT3_LOBBY_READER` and get this task's own §7.5
// `blockedText` instead of a generic refusal. In every state this exit is
// actually reachable from, the same condition that got the player into the
// Lobby (routes a/a′/d) already satisfies the `any`, so the door is, in
// practice, already open by the time anyone tries it — the event and the
// explicit `PUSH TURNSTILE`/`USE BADGE` handlers below exist for direct
// testability and for a player who tries the turnstile without having
// walked the "normal" route (a debug/test-harness placement in the Lobby,
// say), not because the ordinary game ever puts a player here unable to
// pass. `USE BADGE` itself is wired on `act2_nolan_badge` (`act2/nolan.ts`,
// this task's own amendment there) rather than here — `USE` is `'V dobj'`
// only (act1/verbs.ts), so "USE BADGE" always resolves `dobj` to the badge
// object, never to this reader, regardless of which room declares a
// handler for it.
//
// SIT / TAKE COFFEE (§7.8) — `ACT3_LOBBY_BENCH`/`ACT3_LOBBY_COFFEE` are not
// counted among the room's "6 objects" (they answer one verb each and are
// never independently examined or found — the doc files both under "Room-
// level senses and responses", not among §7.2–7.7's six numbered objects).
// `SIT` ships (act1/verbs.ts) `'V dobj'`-only, by deliberate design
// (`act2/verbs.ts`'s own header: "SIT's pattern stays 'V dobj' only") — so
// a bare "sit" with nothing named can never resolve to either sub-part;
// only "SIT ON BENCH" (etc.) does. Flagged in this task's report.

import type { Cond } from '../../../../engine/cond';
import type { EventDef, ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { BREAK, EXAMINE, LOOK_UNDER, OPEN, PUSH, READ, RUB, SEARCH, SIT, TAKE, TOUCH } from '../../act1/verbs';
import { V_COUNT, V_FIND, V_RIGHT, V_RING } from '../../act1/ids';
import { ACT2_NOLAN_BADGE, V_FIT } from '../../act2/ids';
import {
  ACT3_BROCHURES,
  ACT3_CLUE_MODEL_SHORT,
  ACT3_CLUE_PLAQUE,
  ACT3_COUNTED_LEVELS,
  ACT3_FLAG_ENTERED_AS_VENDOR,
  ACT3_FLAG_TAILGATED,
  ACT3_LOBBY,
  ACT3_LOBBY_BENCH,
  ACT3_LOBBY_COFFEE,
  ACT3_LOBBY_READER,
  ACT3_MODEL,
  ACT3_MODEL_FIGURES,
  ACT3_PLAQUE,
  ACT3_RECEPTION_BELL,
  ACT3_SAW_MODEL,
  ACT3_STAGING_DOOR,
  EVENT_ACT3_LOBBY_READER_OPENS,
} from '../ids';

// ---------------------------------------------------------------------------
// §7.2 — the plaque
// ---------------------------------------------------------------------------

const plaqueExamine =
  'Bronze, cast rather than engraved, the letters standing proud of a field gone\nthe green-black bronze goes indoors:\n\n    THE BADLANDS FACILITY\n    COMMISSIONED 2030\n\nUnder that, smaller and in two columns, a list of names: the county, the\nauthority, the contractor, the design engineer, and six more.\n\nOne of the names has a title in front of it that none of the others has, and\nthe title is Senator.\n\nThe dust on the field is even all over, which is what dust does when nobody\nhas touched a thing for a long time.';

const plaqueTouch =
  "Cold, and the letters are colder, and your hand comes away with the dust in\nthe shape of your hand on the field, which is now the newest thing in this\nroom.";

const plaqueReadNames =
  'Ten of them, set in two columns and ranged left, in a typeface that was chosen\nby somebody who cared. Nine are followed by a role and a firm.\n\nThe one with the title in front of it is followed by nothing at all, because\nwhen a plaque has a senator on it the plaque assumes you know.';

const plaque: ObjectDefSlice = {
  location: ACT3_LOBBY,
  name: 'plaque',
  nouns: ['plaque', 'bronze', 'dedication', 'tablet', 'sign', 'names'],
  portable: false,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: plaqueExamine }, { grantClue: ACT3_CLUE_PLAQUE }] },
    { verbs: [TOUCH, RUB], effects: [{ say: plaqueTouch }] },
    { verbs: [READ], effects: [{ say: plaqueReadNames }] },
  ],
};

// ---------------------------------------------------------------------------
// §7.3 — the model
// ---------------------------------------------------------------------------

const modelExamine =
  'A cutaway about the size of a coffin, under glass on a plinth, lit from within\nby a strip that has one dead segment in it.\n\nThe plant floor is on top with its manifolds picked out in blue and its\nchillers in grey. Under the plant floor the sublevels go down in a stepped\nstack, each one labelled on the cut face in a typeface that was modern once,\neach one furnished with about forty small grey rectangles and, here and there,\na person a quarter of an inch high standing about looking pleased.\n\nUnder the bottom step the rock is moulded and painted and stops flat at the\nbase of the case, the way rock does not.';

const modelCountLevels =
  'S1. S2. S3. S4. S5.\n\nFive. The label on the bottom step is the same size as the label on the top\nstep, and there is about as much rock under the bottom step as there is\nbuilding over the top one, which is a thing a model does because a case has to\nstop somewhere.';

const modelFiguresText =
  'Fourteen of them in the whole building, moulded in one piece with their bases,\npainted by somebody with a very fine brush and no reference. Two on the plant\nfloor. One on each sublevel except the bottom, which has three, all facing the\nsame way.\n\nThey are wearing what people were going to be wearing.';

const modelOpenCase =
  "The glass sits in an aluminium frame screwed down to the plinth at twelve\npoints, and the screw heads have been painted over in the plinth's own colour,\nwhich means the case was closed once and was never intended to be opened\nagain.";

const modelLookUnder =
  'The plinth is a box with a door in the back of it and the door has a keyway.\nBehind it there will be a transformer for the strip light and a length of flex\nand about forty years of nothing.';

const modelCompareBrochure =
  'Both of them have the same building in them, drawn by the same people from the\nsame drawings, and the dotted route on the floor plan goes lobby, data hall,\ngallery, and back to the lobby, and nowhere on it does the dotted line go\ndown.';

const model: ObjectDefSlice = {
  location: ACT3_LOBBY,
  name: 'model',
  // "levels"/"sublevels"/"floors" added beyond the doc's own noun list
  // (§7.3 gives only "model, scale model, case, cutaway, glass case,
  // display, diorama, figures, people") so `COUNT LEVELS`/`COUNT
  // SUBLEVELS`/`COUNT FLOORS` (`V_COUNT`, `'V dobj'`) has a noun to
  // resolve against at all — flagged in this task's report as an
  // assumption. "figures"/"people" are NOT included here — see
  // `ACT3_MODEL_FIGURES` below, a separate uncounted sub-part, because an
  // `EXAMINE` handler can't distinguish which noun resolved it.
  nouns: ['model', 'scale model', 'case', 'cutaway', 'glass case', 'display', 'diorama', 'levels', 'sublevels', 'floors'],
  portable: false,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: modelExamine }, { set: [ACT3_SAW_MODEL, true] }] },
    {
      verbs: [V_COUNT],
      effects: [{ say: modelCountLevels }, { set: [ACT3_COUNTED_LEVELS, true] }, { grantClue: ACT3_CLUE_MODEL_SHORT }],
    },
    { verbs: [OPEN, V_RIGHT], effects: [{ say: modelOpenCase }] },
    { verbs: [LOOK_UNDER], effects: [{ say: modelLookUnder }] },
  ],
};

const modelFigures: ObjectDefSlice = {
  location: ACT3_LOBBY,
  name: 'figures',
  nouns: ['figures', 'people'],
  portable: false,
  handlers: [{ verbs: [EXAMINE], effects: [{ say: modelFiguresText }] }],
};

// ---------------------------------------------------------------------------
// §7.4 — the brochures
// ---------------------------------------------------------------------------

const brochureExamine =
  'Tri-fold, on good paper, with a photograph on the front of the building at\ndusk taken from an angle the road no longer offers.\n\n    THE BADLANDS FACILITY\n    Tours: second and fourth Thursdays\n    Groups of eight or more by arrangement\n\nInside: a floor plan with a route on it in a dotted line, three paragraphs\nabout the county, one about the reactor that says the word *reactor* once and\nthen stops saying it, and one about cooling that is accurate.\n\nThe rack is full. The rack has been full for a very long time and the paper at\nthe front of it has gone the colour paper goes at a window.';

const brochureCard =
  'A card in a plastic holder across the front of the rack, printed, not\nhandwritten, which means somebody ordered it:\n\n    TOURS DISCONTINUED 2041\n    THANK YOU FOR YOUR INTEREST';

const brochureTake = 'You take one off the front. The pile does not go down; the pile is a spring\nloader and it brings the next one up to the same height, ready.';

const brochures: ObjectDefSlice = {
  location: ACT3_LOBBY,
  name: 'brochure',
  // v0.14.0: "card" only as compounds — alone in the Lobby a bare "card"
  // still reaches it (compound fallback), but once carried it no longer ties
  // S1's checkout card, which lists the bare word.
  nouns: ['brochure', 'brochures', 'leaflet', 'leaflets', 'pamphlet', 'rack', 'tour', 'tours', 'tour card', 'rack card'],
  portable: true,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: brochureExamine }] },
    { verbs: [READ], effects: [{ say: brochureCard }] },
    { verbs: [TAKE], effects: [{ say: brochureTake }, { move: [ACT3_BROCHURES, 'inventory'] }] },
    { verbs: [V_FIT], withInstrument: [ACT3_MODEL], effects: [{ say: modelCompareBrochure }] },
  ],
};

// ---------------------------------------------------------------------------
// §7.5 — the inner doors and their reader
// ---------------------------------------------------------------------------

const readerExamine =
  'A waist-high turnstile in a glass surround, with a reader on the near post and\na gate leaf that swings both ways for anybody coming out.\n\nThe pad is worn matt in one place only, which is the difference between this\none and the one at the far end of B4.\n\nBeyond the glass: a corridor with a soffit down the middle of it, a door with\na small window in it, and the smell of the coffee.';

const readerWedgeExamine =
  "A rubber doorstop, grey, chamfered, with a hole in the fat end for a\nbootlace it does not have. It is holding open a door that cost more than the\ntruck.";

export const PUSH_TURNSTILE_WITHOUT_BADGE_TEXT =
  'The leaf takes up its slack and holds, and the reader does not light, and\nsomewhere behind the glass a corridor goes on not caring.\n\nAnybody on the far side of this could open it by walking towards it. There is\nnobody on the far side of it.';

const READER_PASSABLE: Cond = { any: [{ has: ACT2_NOLAN_BADGE }, { flag: ACT3_FLAG_TAILGATED }, { flag: ACT3_FLAG_ENTERED_AS_VENDOR }] };

const readerExamineRules: ProseRule[] = [
  { when: { flag: ACT3_FLAG_ENTERED_AS_VENDOR }, text: readerWedgeExamine },
  { text: readerExamine },
];

const lobbyReader: ObjectDefSlice = {
  location: ACT3_LOBBY,
  name: 'turnstile',
  nouns: ['turnstile', 'reader', 'badge reader', 'pad', 'inner doors', 'doors', 'barrier', 'wedge'],
  portable: false,
  container: { open: false },
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: readerExamineRules }] },
    { verbs: [PUSH], when: { not: READER_PASSABLE }, effects: [{ say: PUSH_TURNSTILE_WITHOUT_BADGE_TEXT }] },
    { verbs: [PUSH], effects: [{ setState: [ACT3_LOBBY_READER, 'open', true] }] },
  ],
};

/** Fires the first turn `READER_PASSABLE` holds — see this file's own header. */
export const ACT3_LOBBY_READER_OPENS_EVENT: EventDef = {
  id: EVENT_ACT3_LOBBY_READER_OPENS,
  when: READER_PASSABLE,
  once: true,
  effects: [{ setState: [ACT3_LOBBY_READER, 'open', true] }],
};

// ---------------------------------------------------------------------------
// §7.6 — the bell
// ---------------------------------------------------------------------------

const bellExamine =
  'A dome bell on a brass base, of the sort that has been a joke about itself in\nany building put up since about 1960.\n\nThe desk it stands on is veneered, wiped, and empty. There is no chair behind\nit. There is a grommet in the desktop for a cable and there is no cable coming\nup through it.';

const bellRing =
  'It is a good bell. The note goes up into two storeys of glass, comes back down\nslightly altered, and takes a surprisingly long while to be finished with\nitself.\n\nNobody comes. There is no reason for anybody to come. You ring it again to\nfind out whether you are the kind of person who rings it twice, and it turns\nout that you are.';

const bellSearchDesk =
  'Three drawers, all of them unlocked, all of them lined with the same felt, all\nof them containing exactly what a reception desk contains when the reception\nhas been over for years: a stapler, a rubber band, a paperclip that has been\nopened out straight, and a printed sheet of dialling codes for a switchboard.';

const reception: ObjectDefSlice = {
  location: ACT3_LOBBY,
  name: 'bell',
  nouns: ['bell', 'desk bell', 'dome', 'counter', 'desk', 'reception'],
  portable: false,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: bellExamine }] },
    { verbs: [V_RING, BREAK], effects: [{ say: bellRing }] },
    { verbs: [SEARCH, LOOK_UNDER, OPEN], effects: [{ say: bellSearchDesk }] },
  ],
};

// ---------------------------------------------------------------------------
// §7.7 — the staging doors (scenery)
// ---------------------------------------------------------------------------

const stagingExamine =
  'A pair of doors in the left-hand wall with a push bar across both leaves and a\nsign at eye height:\n\n    CONTRACTORS — STAGING\n    ALL VISITORS SIGN IN\n\nThere is no book to sign and nothing to sign it with. Through the wired glass\nthere is a corridor, a stack of folded tables against one wall, and a\nwhiteboard with a grid ruled on it in permanent marker and nothing written in\nthe grid.';

export const STAGING_DOOR_BLOCKED_TEXT =
  'The bar goes down and the doors do not, because they are on a maglock and the\nmaglock is not broken, tired or negotiable; it is simply on.\n\nFire law says a maglock has to drop when the panel says so. Nothing in this\nbuilding is on fire.';

const stagingDoor: ObjectDefSlice = {
  location: ACT3_LOBBY,
  name: 'staging door',
  // The doc's own §7.7 noun list ("staging door, staging doors, doors,
  // contractors, contractor door, push bar, bar") is flat, but this
  // engine's resolver only ever looks up a phrase's HEAD noun (its last
  // word) and then filters by `adjectives` (`resolver.ts`'s own header:
  // "candidates = things in scope whose nouns match the head noun" —
  // multi-word strings in `nouns` are never matched as phrases). Split
  // here into the bare noun "door"/"doors" plus `adjectives` below, same
  // idiom `act1/objects/jacksMotel.ts`'s own truck door uses (`nouns:
  // [..., 'door'], adjectives: ['truck']`) — found by this task's own test
  // run ("open staging door" resolved to nothing until this fix).
  nouns: ['door', 'doors', 'contractors', 'push bar', 'bar'],
  adjectives: ['staging', 'contractor'],
  portable: false,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: stagingExamine }] },
    { verbs: [OPEN, PUSH], effects: [{ say: STAGING_DOOR_BLOCKED_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §7.8 — the bench (SIT) and the coffee (TAKE/FIND) — uncounted sub-parts.
// ---------------------------------------------------------------------------

const benchSit =
  'There is a bench under the glass, upholstered, with a brushed rail along the\nback of it, and you sit on it for as long as it takes to notice that you have\nput your hat down on a surface in a building you have no business being in.\n\nYou pick the hat back up.';

const bench: ObjectDefSlice = {
  location: ACT3_LOBBY,
  name: 'bench',
  nouns: ['bench', 'seat'],
  portable: false,
  handlers: [{ verbs: [SIT], effects: [{ say: benchSit }] }],
};

const coffeeText = 'It is through a door, and the door is past the turnstile, and the coffee is\nsomebody\'s, and you did not come here for coffee.';

const coffee: ObjectDefSlice = {
  location: ACT3_LOBBY,
  name: 'coffee',
  nouns: ['coffee'],
  portable: false,
  handlers: [{ verbs: [TAKE, V_FIND], effects: [{ say: coffeeText }] }],
};

export const ACT3_LOBBY_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_PLAQUE]: plaque,
  [ACT3_MODEL]: model,
  [ACT3_BROCHURES]: brochures,
  [ACT3_LOBBY_READER]: lobbyReader,
  [ACT3_RECEPTION_BELL]: reception,
  [ACT3_STAGING_DOOR]: stagingDoor,
  [ACT3_LOBBY_BENCH]: bench,
  [ACT3_LOBBY_COFFEE]: coffee,
  [ACT3_MODEL_FIGURES]: modelFigures,
};
