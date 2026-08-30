// The Landing's furniture (prose doc §15.1.5): the stairs, the banister,
// the player's own door seen from outside, the two other doors, and the
// carpet. None is portable, none is a puzzle — they exist so the room
// answers when it's poked at.
//
// §15.2's build boundary text is defined here (not in `landing.ts`, the
// room file) and exported, so the stairs' own TOUCH/CLIMB handlers below
// and the room's `down`/`out` exits (§15.1.6/§15.2) share one string
// rather than two copies drifting apart.

import type { ObjectDefSlice } from '../../../../engine/world';
import type { Prose } from '../../../../engine/prose';
import { CLIMB, EXAMINE, LISTEN, LOOK_UNDER, LOCK, CLOSE, OPEN, TOUCH, UNLOCK } from '../verbs';
import { V_KNOCK, V_LEAN_OVER, V_SLIDE_DOWN } from '../ids';
import {
  LANDING,
  LANDING_BANISTER,
  LANDING_BOUNDARY_GATE,
  LANDING_CARPET,
  LANDING_DOORS,
  LANDING_STAIRS,
  YOUR_DOOR_OUTSIDE,
  YOUR_DOOR_OUTSIDE_NUMBER,
} from '../ids';

/**
 * §15.2 — "Renders, does not move the player, and changes nothing." Line 1
 * is a fixed header, identical across variants, kept in caps (the doc's own
 * instruction: "what makes the block read as chrome at a glance").
 */
export const BUILD_BOUNDARY_TEXT: Prose = [
  'END OF BUILD\n\nThis version ends at the top of these stairs. The rest of the house, and the town it stands in, are not in this build.',
  'END OF BUILD\n\nThe stairs go down. This build does not. Everything past this landing belongs to a later version.',
];

const stairsExamine =
  'Wooden stairs going down in flights around a square well, to a turn you cannot see past. The treads are cupped in the middle where everybody who has ever lived up here has put a foot in the same place, and the runner on them gives out entirely three steps down, where somebody decided the carpet had gone far enough.\n\nSomewhere at the bottom a lamp is on. Its light gets all the way up here, which is more than can be said for anybody.';

const stairsListen =
  'Nothing on the stairs themselves. Further down, a radio, a chair, and the particular silence of a person who has stopped what they were doing because a door opened upstairs.';

const landingStairs: ObjectDefSlice = {
  location: LANDING,
  name: 'stairs',
  nouns: ['stairs', 'stair', 'staircase', 'steps', 'stairway', 'stairwell', 'well', 'flight', 'flights'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: stairsExamine }] },
    { verbs: [LISTEN], effects: [{ say: stairsListen }] },
    // "touch / climb / go down — see §15.2" (doc): TOUCH and CLIMB on the
    // stairs themselves render the same boundary text as the DOWN/OUT
    // exits; "go down" (the bare direction verb) is the exits' own job.
    { verbs: [TOUCH, CLIMB], effects: [{ say: BUILD_BOUNDARY_TEXT }] },
  ],
};

const banisterExamine =
  'Dark wood, turned on a lathe by somebody who was paid by the hour and did not mind. The top rail is polished pale the whole way along; the balusters under it are furred grey with dust that nobody has ever had a reason to touch.';

const slideDown =
  'The rail is exactly the rail that a certain kind of person slides down. You get a hand on it, and your head immediately supplies a short film of how the rest of it goes, in which the newel post at the bottom features prominently and repeatedly.\n\nYou take the hand back.';

/** Shared with `landing.ts`'s (the room file) own bare `V_LOOK_DOWN` handler — "LOOK DOWN"/"LEAN OVER RAIL"/"LOOK OVER BANISTER" are one answer (§15.1.4's own note). */
export const LOOK_DOWN_TEXT =
  'You lean out over the rail. The well drops away in stacked rectangles — this landing, the one under it, the one under that — and at the bottom there is a floor with a light on it, a corner of something wooden, and no person standing in the part of it you can see.';

const landingBanister: ObjectDefSlice = {
  location: LANDING,
  name: 'banister',
  nouns: ['banister', 'bannister', 'rail', 'railing', 'handrail', 'newel', 'balusters'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: banisterExamine }] },
    { verbs: [V_SLIDE_DOWN], effects: [{ say: slideDown }] },
    { verbs: [V_LEAN_OVER], effects: [{ say: LOOK_DOWN_TEXT }] },
  ],
};

const doorOutsideExamine =
  'Your door from the outside, which is a different door: painted, numbered, and giving nothing away. The brass number is screwed on at eye height with the top screw gone, so it hangs a few degrees off true, and somebody has got used to that. Below it is a keyhole, and in the keyhole there is no key.\n\nThere is no key in your pocket either. Houses like this one keep the spare on a board behind a desk downstairs, along with everybody else’s.';

const lockFromOutside =
  'You pull it to. Without a key it will not do any better than that, and the bolt — which is the only thing on this door that ever worked properly — is on the wrong side of it now.';

const yourDoorOutside: ObjectDefSlice = {
  location: LANDING,
  name: 'door',
  // "room" added (Ryan's playtest bug: from the Landing, ENTER ROOM/X
  // ROOM resolved to `objects/misc.ts`'s FLOOR_BOARDS — a room-1-only
  // noun collision that never surfaced before this room's own door
  // could be a valid "room" target; FLOOR_BOARDS is never in scope from
  // the Landing, so this is unambiguous in play) — the obvious phrasing
  // for "go back to my room" now lands on this door, same as "door".
  nouns: ['door', 'keyhole', 'room'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: doorOutsideExamine }] },
    { verbs: [LOCK, CLOSE], effects: [{ say: lockFromOutside }] },
  ],
};

const readNumber =
  'You read your own room number. It is a number. Nothing happens when you read it: no flicker, no argument, nothing that says you have ever stood on this landing with a key in your hand and counted along the doors.\n\nThe absence is worth rather more than the number.';

/** §4.10/§15.1.5's sub-part pattern (FEDORA_BAND, DOOR_BOLT): `number` needs distinct text from plain `door`, and a handler can't tell which noun word resolved — so it gets its own object rather than duplicating `door` as a noun on the parent (which would also collide per `validate.ts`'s noun-collision rule). */
const doorOutsideNumber: ObjectDefSlice = {
  location: { on: YOUR_DOOR_OUTSIDE },
  name: 'number',
  nouns: ['number'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: readNumber }] }],
};

const otherDoorsExamine =
  'Two more doors on this floor, numbered like yours and shut like yours. No light under either, no sound behind either. Whatever went on in your room tonight went on a few feet from both of them, and neither of them appears to have taken the slightest notice.';

const knock =
  'You knock. It is not a loud knock — some instinct you did not consult made it a polite one — and nothing answers it. You wait out the length of time in which somebody would have answered, and then a bit more than that, and then stop waiting.';

const tryHandle =
  'Locked, both of them, in the ordinary way of doors that belong to other people. Whatever is behind them is their business, and at this hour it is going to stay that way.';

const otherDoorsListen =
  'You put an ear to one and then the other. Both give you the same thing: a room with nothing moving in it.';

/**
 * Wiring note (§15.1.5): NOT given the bare noun `door` — only qualified
 * plural/collective nouns, per the doc's own sanctioned fallback ("let
 * bare `door` resolve to the player's own"). No `adjectives` either:
 * `doors`/`neighbours`/`neighbors` are this object's ONLY nouns anywhere
 * in the world, so `resolveNounPhrase` resolves any phrase ending in one of
 * them here regardless of a leading adjective (`other doors`, `next
 * doors`) without needing `other`/`next` declared — which is fortunate,
 * since "other" collides with `V_TURN_OVER`'s own word ("examine other
 * side") and would trip `validate.ts`'s `verb-noun-collision` warning.
 * `other door`/`next door` (singular) resolve to `your_door_outside`
 * instead — the doc's own explicitly accepted default when the parser
 * can't carry the full ambiguity.
 */
const landingDoors: ObjectDefSlice = {
  location: LANDING,
  name: 'the other doors',
  nouns: ['doors', 'neighbours', 'neighbors'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: otherDoorsExamine }] },
    { verbs: [V_KNOCK], effects: [{ say: knock }] },
    { verbs: [OPEN, UNLOCK], effects: [{ say: tryHandle }] },
    { verbs: [LISTEN], effects: [{ say: otherDoorsListen }] },
  ],
};

const carpetExamine =
  'A strip of patterned carpet tacked down the length of the landing, worn through to the backing in a line down the middle and still bright at the edges where nobody has ever had a reason to walk. Somewhere under the pattern there used to be flowers.';

const lookUnderCarpet =
  'You get a corner of it up off its tacks. Underneath there is board, and a quantity of grit that has been sifting down through the weave for longer than anybody now in this house has been in it, and no envelope, no key, and no note.\n\nIt was worth the four seconds.';

const landingCarpet: ObjectDefSlice = {
  location: LANDING,
  name: 'carpet',
  nouns: ['carpet', 'runner', 'rug', 'matting', 'pattern'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: carpetExamine }] },
    { verbs: [LOOK_UNDER], effects: [{ say: lookUnderCarpet }] },
  ],
};

/**
 * §15.2's build-boundary implementation — see `ids.ts`'s doc comment on
 * `LANDING_BOUNDARY_GATE`. No `nouns`: never resolvable, never described,
 * exists purely as an always-closed `ExitDefSlice.door` target so `down`/
 * `out` are permanently blocked without a false "there is a closed door
 * here to open" implication ever reaching the player (the exits' own
 * `blockedText` always overrides the generic family — see `landing.ts`,
 * the room file, for both exits).
 *
 * ENGINE GAP (see this task's report): `respond.ts`'s direction dispatch
 * (`directionForVerb`) reaches `move.ts`'s `traverseDirection` before any
 * room-level `handlers` or `Effect` DSL runs, and `effects.ts`'s `say`
 * always emits `kind: 'prose'` — there is no way for content to render
 * §15.2's boundary line as `kind: 'system'` (the doc's own explicit
 * instruction) without an engine change. This is the closest available
 * content-only approximation: the exact authored text, via
 * `ExitDefSlice.blockedText`, which is real but renders `kind: 'prose'`
 * rather than `'system'` — CLI output is byte-identical either way
 * (`cli/render.ts`'s `line` case ignores `kind` entirely), but the Vue
 * shell's GAME-OVER-style chrome styling (`App.vue`) would not apply.
 */
const landingBoundaryGate: ObjectDefSlice = {
  location: LANDING,
};

export const LANDING_OBJECTS: Record<string, ObjectDefSlice> = {
  [LANDING_STAIRS]: landingStairs,
  [LANDING_BANISTER]: landingBanister,
  [YOUR_DOOR_OUTSIDE]: yourDoorOutside,
  [YOUR_DOOR_OUTSIDE_NUMBER]: doorOutsideNumber,
  [LANDING_DOORS]: landingDoors,
  [LANDING_CARPET]: landingCarpet,
  [LANDING_BOUNDARY_GATE]: landingBoundaryGate,
};
