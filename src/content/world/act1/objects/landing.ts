// The Landing's furniture (prose doc §15.1.5): the stairs, the banister,
// the player's own door seen from outside, the two other doors, and the
// carpet. None is portable, none is a puzzle — they exist so the room
// answers when it's poked at.
//
// §15.2's build boundary text is defined here (not in `landing.ts`, the
// room file) and exported, so the room's `down`/`out` exits (§15.1.6/§15.2)
// can share it. UPDATED (wayfinding doc §14.1/canon 134): the boundary moved
// down to the Front Desk's street door (see `landing.ts`'s own header) and
// `landingStairs`' TOUCH/CLIMB handler below was left pointed at this
// constant regardless — so `CLIMB STAIRS` told the player the game was over
// on a staircase `DOWN` walks them down a turn later. Fixed here, not in the
// room file, per this task's own scope.
// The old boundary rotation itself was deleted in E3 (register 146).

import type { ObjectDefSlice } from '../../../../engine/world';
import type { Prose, ProseRule } from '../../../../engine/prose';
import { CLIMB, EXAMINE, LISTEN, LOOK_UNDER, LOCK, CLOSE, OPEN, UNLOCK } from '../verbs';
import { V_KNOCK, V_LEAN_OVER, V_SLIDE_DOWN } from '../ids';
import {
  DOOR,
  FLAG_DOOR_BOLT_DRAWN,
  FRONT_DESK,
  LANDING,
  LANDING_BANISTER,
  LANDING_BOUNDARY_GATE,
  LANDING_CARPET,
  LANDING_DOORS,
  LANDING_STAIRS,
  YOUR_DOOR_OUTSIDE,
  YOUR_DOOR_OUTSIDE_NUMBER,
} from '../ids';

const stairsExamine =
  'Wooden stairs going down in flights around a square well, to a turn you cannot see past. The treads are cupped in the middle where everybody who has ever lived up here has put a foot in the same place, and the runner on them gives out entirely three steps down, where somebody decided the carpet had gone far enough.\n\nSomewhere at the bottom a lamp is on. Its light gets all the way up here, which is more than can be said for anybody.';

const stairsListen =
  'Nothing on the stairs themselves. Further down, a radio, a chair, and the particular silence of a person who has stopped what they were doing because a door opened upstairs.';

/**
 * Canon 134 — kept as its own constant rather than importing the room
 * file's `travelTextToFrontDesk` (`../landing.ts`, unexported): that file
 * already imports from this one (`LOOK_DOWN_TEXT`), so importing back would
 * be circular, and this task's scope is this file alone. Transcribed
 * verbatim from that constant so the two stay in sync by inspection.
 */
const stairsClimbDownText =
  'You go down two flights, around the well, past a landing with no light on it. The smell of coffee gets stronger the whole way.';

const landingStairs: ObjectDefSlice = {
  location: LANDING,
  name: 'stairs',
  nouns: ['stairs', 'stair', 'staircase', 'steps', 'stairway', 'stairwell', 'well', 'flight', 'flights'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: stairsExamine }] },
    { verbs: [LISTEN], effects: [{ say: stairsListen }] },
    // Canon 134 (wayfinding doc §14.1) — `CLIMB STAIRS` now does what
    // `DOWN` already does: the room's own `down` exit, in prose and effect
    // (`goto`, no clock advance — the real exit declares none either).
    // TOUCH is dropped from this handler entirely so it falls through to
    // the generic `touch.default` family (`responses.ts`) instead of
    // either the stale boundary text or a movement it should not trigger.
    { verbs: [CLIMB], effects: [{ say: stairsClimbDownText }, { goto: FRONT_DESK }] },
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

// §16 (front-desk-prose appendix) — the lockout-reading repair. The bug was
// prose, not code: read cold, on a dark landing, at the exact moment a
// player is deciding whether the game has just taken his starting room
// away from him, two hundred words of key language ahead of the one fact
// that matters ("Going back in costs you nothing") reads as a lockout —
// and the door in fact opens from either side, always has, and never
// blocks. Three rules, match order as listed; the key rack stays (it is
// what you need to leave the room *shut*, not what you need to get back
// in).
const doorOutsideExamine: ProseRule[] = [
  // Rule 1 — the door standing as the player left it (ajar, never closed
  // from either side since the bolt was first drawn).
  {
    when: { all: [{ flag: FLAG_DOOR_BOLT_DRAWN }, { objectState: [YOUR_DOOR_OUTSIDE, 'open', true] }] },
    text: 'Your door from the outside, which is a different door: painted, numbered, and giving nothing away. You left it an inch off the frame and it has stayed that way.\n\nThe brass number is screwed on at eye height with the top screw gone, so it hangs a few degrees off true, and somebody has got used to that. Below it, a keyhole with nothing in it. Going back in costs you nothing. Leaving it shut behind you would cost a key, and houses like this one keep the spare on a board behind a desk downstairs, along with everybody else\'s.',
  },
  // Rule 2 — pulled to behind him (the bolt that would shut it is on the
  // other side, so it still opens to a hand).
  {
    when: { flag: FLAG_DOOR_BOLT_DRAWN },
    text: 'Your door from the outside, which is a different door: painted, numbered, and giving nothing away. It is pulled to rather than shut, because the bolt that would shut it is on the side you are not on, and it comes open to a hand.\n\nThe brass number is screwed on at eye height with the top screw gone, so it hangs a few degrees off true, and somebody has got used to that. Below it, a keyhole with nothing in it — and nothing in your pocket for it either. Houses like this one keep the spare on a board behind a desk downstairs, along with everybody else\'s.',
  },
  // Rule 3 — unconditional fallback (`validate.ts` requires one). Currently
  // unreachable: the only route onto this landing is through the door,
  // which sets FLAG_DOOR_BOLT_DRAWN, so rules 1/2 cover every real state.
  // Kept for the day the game gains a second way onto this floor. Trimmed
  // of the old text's second sentence naming the missing key twice — one
  // statement is enough in a rule nobody will read.
  {
    text: 'Your door from the outside, which is a different door: painted, numbered, and giving nothing away. The brass number is screwed on at eye height with the top screw gone, so it hangs a few degrees off true, and somebody has got used to that. Below it is a keyhole that wants a key you do not have.\n\nHouses like this one keep the spare on a board behind a desk downstairs, along with everybody else\'s.',
  },
];

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
  // Walking-dead bug fix (priority insert, Ryan's playtest): this object
  // used to have no `container` at all, so `builtinOpen` refused every
  // `OPEN DOOR` from the Landing with `open.notContainer` ("no lid, no
  // door, no seam to argue with") — CLOSE (below) could set the exit's
  // `open` overlay false, and nothing could ever set it back true, a
  // permanent lockout out of `your_room` (constitution §10). `door.ts`'s
  // own `DOOR` object is the model: a real `container`, so it's genuinely
  // openable in its own right.
  container: { open: false },
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: doorOutsideExamine }] },
    {
      // The mirror of `door.ts`'s own OPEN handler: mechanically trivial
      // from this side (§16 Rule 2 — "it comes open to a hand"), so this
      // reuses the shared `open.success` family (the same "use
      // open.success" precedent `door.ts`'s own header names) rather than
      // staging new prose for a push that needs none.
      verbs: [OPEN],
      effects: [{ say: { ref: 'open.success' } }, { setState: [YOUR_DOOR_OUTSIDE, 'open', true] }, { setState: [DOOR, 'open', true] }],
    },
    {
      verbs: [LOCK, CLOSE],
      effects: [
        { say: lockFromOutside },
        // §16 Rule 2's own reachability: pulling the door to from THIS side
        // is the natural route to that state, so it has to flip the same
        // overlay Rule 1/2 read — same "keep both directions in sync"
        // convention `door.ts`'s own inside handlers already use for this
        // pair of twin objects (see that file's header on why there are
        // two of them).
        { setState: [YOUR_DOOR_OUTSIDE, 'open', false] },
        { setState: [DOOR, 'open', false] },
      ],
    },
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
