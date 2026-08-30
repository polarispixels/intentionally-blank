// The Landing (prose doc §15.1) — the room beyond the player's door.
// Replaces the old content-free `LANDING_STUB`, which crashed on entry
// (`move.ts`'s `renderArrival` throws when a room it actually enters has
// no `description`).
//
// §15.1.1's own ruling: never dark, no `dark` field at all — the light
// comes up the stairwell from two floors down, and it is not the player's
// to switch off (also the fix for the "player leaves the room with the
// lamp off and nothing in hand" stranding case constitution §10 forbids).
//
// §15.2's build boundary: `down`/`out` are declared exits (not omitted),
// permanently blocked by `LANDING_BOUNDARY_GATE` (see `objects/landing.ts`
// for why, and that file's own header for the one open engine gap this
// leaves — `kind: 'system'` rendering — reported rather than worked
// around). Looking/listening down the well (`V_LOOK_DOWN`/bare `LISTEN`,
// below) are untouched: the boundary stops one verb, not the room.

import type { HandlerDef, RoomDefSlice } from '../../../engine/world';
import { LISTEN, SMELL } from './verbs';
import { BUILD_BOUNDARY_TEXT, LOOK_DOWN_TEXT } from './objects/landing';
import { DOOR, LANDING, LANDING_BOUNDARY_GATE, V_LOOK_DOWN, V_LOOK_UP, YOUR_ROOM } from './ids';
import { ROOM_DARK } from './objects/common';
import type { ProseRule } from '../../../engine/prose';

const description =
  'A landing two floors up, no wider than it needs to be. There is a bulb in a wire cage on the ceiling and it has not burned in a long while, so all the light on this floor comes up out of the stairwell from somewhere at the bottom of it. Everything here — the doors, the rail, the pattern in the carpet — is lit from underneath, and none of it is improved by that.\n\nThree doors. Yours, behind you, with a brass number screwed on at eye height. Two others, both shut, with no light under either. A strip of carpet runs the length of the landing, worn to the backing in a line down the middle. Along the well runs a banister of dark wood, with the top rail polished pale by everybody who has ever lived up here.\n\nThe stairs go down in flights, around a square well, to a turn you cannot see past. Above the landing there is only ceiling: the stairs run one way. The air is old carpet and older coffee, and two floors down there is a lamp on, and a radio turned low, and somebody not making any more noise than they have to.';

const smell =
  'Old carpet, cold plaster, and coffee — real coffee, out of a pot that has been standing on the heat too long, coming up the well from whoever is awake at the bottom of it.';

const listen: string[] = [
  'A radio two floors down, turned below the point where it carries words. Under it a chair takes somebody’s weight and gives it back. Nobody is coming up, and nobody has been asked to.',
  'The house doing what houses do at this hour, which is settle, and tick, and occasionally take a breath in one of the rooms you cannot see into.',
];

const lookUp =
  'Ceiling, a single bulb in a wire cage that is not lit and has not been for some time, and above that the underside of a roof that has been letting water in somewhere for years. You have seen where it comes out.';

const landingHandlers: HandlerDef[] = [
  { verbs: [SMELL], effects: [{ say: smell }] },
  { verbs: [LISTEN], effects: [{ say: listen }] },
  { verbs: [V_LOOK_UP], effects: [{ say: lookUp }] },
  { verbs: [V_LOOK_DOWN], effects: [{ say: LOOK_DOWN_TEXT }] },
];

// §15.1.6 — no `firstVisit` (the doc's own note: `your_room`'s own
// `exit.travelText` already covers arrival, a first-visit paragraph on top
// would say the same thing twice in the same breath).
const travelTextToYourRoom: ProseRule[] = [
  {
    when: ROOM_DARK,
    text: 'You push the door open and step back into the dark, which has been keeping your place.',
  },
  { text: 'You step back into your room. Nothing in it has taken the opportunity to move.' },
];

export const landingRoom: RoomDefSlice = {
  name: 'Upstairs Landing',
  area: 'act1',
  map: { x: 1, y: 0 },
  description,
  exits: [
    { dir: 'in', to: YOUR_ROOM, door: DOOR, travelText: travelTextToYourRoom },
    // §15.2 — permanently blocked by `LANDING_BOUNDARY_GATE` (never
    // opens); `to` is inert (never actually traversed) and points back at
    // this room rather than inventing a destination this build doesn't
    // have. `blockedText` — not the generic `move.blocked`/`move.noExit`
    // families — is what actually renders; see §15.2's own note on why
    // both generic families would be dishonest here.
    { dir: 'down', to: LANDING, door: LANDING_BOUNDARY_GATE, blockedText: BUILD_BOUNDARY_TEXT },
    // §15.1.6's own note: "OUT on the landing should reach §15.2, not
    // your_room. A player who types OUT in a stairwell wants to leave the
    // building." — same boundary, same gate.
    { dir: 'out', to: LANDING, door: LANDING_BOUNDARY_GATE, blockedText: BUILD_BOUNDARY_TEXT },
  ],
  handlers: landingHandlers,
};
