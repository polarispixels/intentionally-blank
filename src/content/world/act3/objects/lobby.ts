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
// E0 task I (`docs/superpowers/specs/2026-09-17-stage-e0-prose.md` §9) —
// the staging doors gain one appended sentence once the visit is
// announced. E1 opens these doors.
import { ACT4_VISIT_ANNOUNCED } from '../../act4/ids';
// E1 task L (`docs/superpowers/specs/2026-09-18-stage-e1-prose.md` §17,
// §37.1) — two rules prepended above E0's own rule and the shipped text,
// in this order: §17.2 (the door is now an exit), then §17.1 (the day has
// come but the message has not gotten through yet). Both new rules and the
// two kept underneath are transcribed exactly (hard rule 5); the shipped
// two paragraphs are untouched and not recounted (§40's own note).
import { ACT4_STAGING_OPEN, ACT4_VISIT_DAY } from '../../act4/ids';
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
  'Bronze, cast rather than engraved, the letters standing proud of a field gone the green-black bronze goes indoors:\n\n    THE BADLANDS FACILITY COMMISSIONED 2030\n\nUnder that, smaller and in two columns, a list of names: the county, the authority, the contractor, the design engineer, and six more.\n\nOne of the names has a title in front of it that none of the others has, and the title is Senator.\n\nThe dust on the field is even all over, which is what dust does when nobody has touched a thing for a long time.';

const plaqueTouch =
  "Cold, and the letters are colder, and your hand comes away with the dust in the shape of your hand on the field, which is now the newest thing in this room.";

const plaqueReadNames =
  'Ten of them, set in two columns and ranged left, in a typeface that was chosen by somebody who cared. Nine are followed by a role and a firm.\n\nThe one with the title in front of it is followed by nothing at all, because when a plaque has a senator on it the plaque assumes you know.';

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
  'A cutaway about the size of a coffin, under glass on a plinth, lit from within by a strip that has one dead segment in it.\n\nThe plant floor is on top with its manifolds picked out in blue and its chillers in grey. Under the plant floor the sublevels go down in a stepped stack, each one labelled on the cut face in a typeface that was modern once, each one furnished with about forty small grey rectangles and, here and there, a person a quarter of an inch high standing about looking pleased.\n\nUnder the bottom step the rock is moulded and painted and stops flat at the base of the case, the way rock does not.';

const modelCountLevels =
  'S1. S2. S3. S4. S5.\n\nFive. The label on the bottom step is the same size as the label on the top step, and there is about as much rock under the bottom step as there is building over the top one, which is a thing a model does because a case has to stop somewhere.';

const modelFiguresText =
  'Fourteen of them in the whole building, moulded in one piece with their bases, painted by somebody with a very fine brush and no reference. Two on the plant floor. One on each sublevel except the bottom, which has three, all facing the same way.\n\nThey are wearing what people were going to be wearing.';

const modelOpenCase =
  "The glass sits in an aluminium frame screwed down to the plinth at twelve points, and the screw heads have been painted over in the plinth's own colour, which means the case was closed once and was never intended to be opened again.";

const modelLookUnder =
  'The plinth is a box with a door in the back of it and the door has a keyway. Behind it there will be a transformer for the strip light and a length of flex and about forty years of nothing.';

const modelCompareBrochure =
  'Both of them have the same building in them, drawn by the same people from the same drawings, and the dotted route on the floor plan goes lobby, data hall, gallery, and back to the lobby, and nowhere on it does the dotted line go down.';

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
  'Tri-fold, on good paper, with a photograph on the front of the building at dusk taken from an angle the road no longer offers.\n\n    THE BADLANDS FACILITY Tours: second and fourth Thursdays Groups of eight or more by arrangement\n\nInside: a floor plan with a route on it in a dotted line, three paragraphs about the county, one about the reactor that says the word *reactor* once and then stops saying it, and one about cooling that is accurate.\n\nThe rack is full. The rack has been full for a very long time and the paper at the front of it has gone the colour paper goes at a window.';

const brochureCard =
  'A card in a plastic holder across the front of the rack, printed, not handwritten, which means somebody ordered it:\n\n    TOURS DISCONTINUED 2041 THANK YOU FOR YOUR INTEREST';

const brochureTake = 'You take one off the front. The pile does not go down; the pile is a spring loader and it brings the next one up to the same height, ready.';

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
  'A waist-high turnstile in a glass surround, with a reader on the near post and a gate leaf that swings both ways for anybody coming out.\n\nThe pad is worn matt in one place only, which is the difference between this one and the one at the far end of B4.\n\nBeyond the glass: a corridor with a soffit down the middle of it, a door with a small window in it, and the smell of the coffee.';

const readerWedgeExamine =
  "A rubber doorstop, grey, chamfered, with a hole in the fat end for a bootlace it does not have. It is holding open a door that cost more than the truck.";

export const PUSH_TURNSTILE_WITHOUT_BADGE_TEXT =
  'The leaf takes up its slack and holds, and the reader does not light, and somewhere behind the glass a corridor goes on not caring.\n\nAnybody on the far side of this could open it by walking towards it. There is nobody on the far side of it.';

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
    // Stage F sweep — this rule was `setState`-only and printed nothing at
    // all once the player could pass (badge/tailgate/vendor). No dedicated
    // "turnstile gives" line is shipped for this object (`routeABadgeText`,
    // `objects/perimeterRoad.ts`, describes the OUTER gate's own turnstile,
    // a different object) — the built-in OPEN verb's own global family
    // (same one `builtinOpen`/`fedora.ts`'s WEAR handler render, `{ ref:
    // 'open.success' }`) is the existing text this rule routes to instead
    // of new prose.
    { verbs: [PUSH], effects: [{ say: { ref: 'open.success' } }, { setState: [ACT3_LOBBY_READER, 'open', true] }] },
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
  'A dome bell on a brass base, of the sort that has been a joke about itself in any building put up since about 1960.\n\nThe desk it stands on is veneered, wiped, and empty. There is no chair behind it. There is a grommet in the desktop for a cable and there is no cable coming up through it.';

const bellRing =
  'It is a good bell. The note goes up into two storeys of glass, comes back down slightly altered, and takes a surprisingly long while to be finished with itself.\n\nNobody comes. There is no reason for anybody to come. You ring it again to find out whether you are the kind of person who rings it twice, and it turns out that you are.';

const bellSearchDesk =
  'Three drawers, all of them unlocked, all of them lined with the same felt, all of them containing exactly what a reception desk contains when the reception has been over for years: a stapler, a rubber band, a paperclip that has been opened out straight, and a printed sheet of dialling codes for a switchboard.';

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
  'A pair of doors in the left-hand wall with a push bar across both leaves and a sign at eye height:\n\n    CONTRACTORS — STAGING ALL VISITORS SIGN IN\n\nThere is no book to sign and nothing to sign it with. Through the wired glass there is a corridor, a stack of folded tables against one wall, and a whiteboard with a grid ruled on it in permanent marker and nothing written in the grid.';

const stagingDoorBlockedShipped =
  'The bar goes down and the doors do not, because they are on a maglock and the maglock is not broken, tired or negotiable; it is simply on.\n\nFire law says a maglock has to drop when the panel says so. Nothing in this building is on fire.';

// E0 task I (§9) — one sentence appended, once the visit is announced; the
// shipped two paragraphs above are kept word for word (not counted in the
// prose doc's own §34, per that section's note).
const stagingDoorBlockedAnnounced = `${stagingDoorBlockedShipped}\n\nThis time somebody on the far side of the wired glass looks up from a folding table to check that they did not.`;

// E1 task L (§17.1) — a man on the push bar, once the visit day has come
// and the message has not gotten through yet.
const stagingDoorBlockedVisitDay =
  'There is a man in front of the push bar now, with his hands loose in front of him, and he is not a large man, and it does not signify.\n\n"Sir."\n\nThat is all he says and all he is going to say. He has a short list in his head and does not have to look at it, and you are not going to get on it by explaining yourself to him.\n\nBehind you, out in the lobby, the man who runs this plant is standing on the wrong side of his own building with a folder under one arm and nowhere to put it.';

// E1 task L (§17.2) — the door is now an exit; what OPEN DOORS/PUSH DOORS
// gives once `act4_staging_open` holds (in addition to the real exit
// itself, gated the same way — `act3/lobby.ts`'s own amendment).
const stagingDoorOpenNowText =
  'The man in front of the bar puts a finger to his ear, listens to somebody on the other side of the wall, and takes his hands apart.\n\n"Go ahead, sir."\n\nHe does not ask you anything, and that is the whole of what has changed.';

export const STAGING_DOOR_BLOCKED_TEXT: ProseRule[] = [
  { when: { flag: ACT4_STAGING_OPEN }, text: stagingDoorOpenNowText },
  // `{ flag: ACT4_VISIT_ANNOUNCED }` guards `onOrAfterDay` against its own
  // unset default (`act4_visit_day` defaults to `0`, and `state.clock.day`
  // is never less than 1 — without this guard the rule would be true from
  // turn one, before the day is ever actually set by `act4_set_visit_day`;
  // found running this task's own test suite, not in the doc's own text).
  { when: { all: [{ flag: ACT4_VISIT_ANNOUNCED }, { onOrAfterDay: ACT4_VISIT_DAY }, { not: { flag: ACT4_STAGING_OPEN } }] }, text: stagingDoorBlockedVisitDay },
  { when: { flag: ACT4_VISIT_ANNOUNCED }, text: stagingDoorBlockedAnnounced },
  { text: stagingDoorBlockedShipped },
];

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
  'There is a bench under the glass, upholstered, with a brushed rail along the back of it, and you sit on it for as long as it takes to notice that you have put your hat down on a surface in a building you have no business being in.\n\nYou pick the hat back up.';

const bench: ObjectDefSlice = {
  location: ACT3_LOBBY,
  name: 'bench',
  nouns: ['bench', 'seat'],
  portable: false,
  handlers: [{ verbs: [SIT], effects: [{ say: benchSit }] }],
};

const coffeeText = 'It is through a door, and the door is past the turnstile, and the coffee is somebody\'s, and you did not come here for coffee.';

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
