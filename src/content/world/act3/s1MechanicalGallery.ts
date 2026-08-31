// Act III, Wave D4 task B — S1 Mechanical Gallery room (D4 prose doc §8,
// §7.3, §21.1, §21.4). Object definitions (pumps, crib, rack, card, stair,
// the construction door's S1-side rule, the lift's `_GALLERY` instance) are
// `objects/s1MechanicalGallery.ts` / `elevator.ts`; this file is the room
// shell — description, `onEnter`, exits, and the room-level senses that
// have no dobj of their own (§8.8).

import type { OnEnterRule, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { HELLO, LISTEN, SEARCH, SMELL, YELL } from '../act1/verbs';
import {
  ACT3_CONSTRUCTION_DOOR_GATE,
  ACT3_CONSTRUCTION_DOOR_OPEN,
  ACT3_INSIDE,
  ACT3_S1_MECHANICAL_GALLERY,
  ACT3_S5_REACTOR_INTERFACE,
  ACT3_SERVICE_TUNNEL,
} from './ids';
import { S1_DOOR_OPEN_BEFORE_TEXT, S1_SEARCH_BEHIND_PUMPS_TEXT } from './objects/s1MechanicalGallery';

// ---------------------------------------------------------------------------
// §8.1 — description.
// ---------------------------------------------------------------------------

const arriveThroughTunnel =
  'A mile of tunnel puts you out behind a rank of pumps into a room lit like an office.\n\nThe gallery runs the width of the building and is about the height of two rooms, painted out in the same grey to the same standard as everything upstairs, with the cable tray combed along the top of one wall and the pipes combed along the top of the other.\n\nFour pumps on the near side, on inertia bases, three of them running. On the far side a mesh crib with a bench in it and a board of tools over the bench, and against the crib\'s back wall a rack of tapes.\n\nThere is a stair at the end going down, and a lift door beside the stair.\n\nNobody is in here. Nothing in here is untidy. Behind you the door you came out of is, from this side, a shape in a wall.';

const arriveByLift =
  'The leaves go back on a gallery that runs the width of the building and is lit like an office.\n\nPumps down the near wall on their bases, three of four running. A mesh crib on the far wall with a bench and a board of tools and a rack of tapes behind it. A stair at the end going down.\n\nIt is cool in here and very well lit and there is nobody in it, and the two facts do not sit together as comfortably as they ought to.';

const returnVisit =
  'The pumps, the crib, the rack, the stair, and the lift.\n\nSomebody keeps this floor the way somebody kept the plant, and it is starting to look less like a standard and more like a habit.';

const description: ProseRule[] = [
  { when: { all: [{ not: { visited: ACT3_S1_MECHANICAL_GALLERY } }, { flag: ACT3_CONSTRUCTION_DOOR_OPEN }] }, text: arriveThroughTunnel },
  { when: { not: { visited: ACT3_S1_MECHANICAL_GALLERY } }, text: arriveByLift },
  { text: returnVisit },
];

// ---------------------------------------------------------------------------
// §21.1 — a route (b) (tunnel) player never sees the Lobby, so
// `act3_inside` must be set on first entry to S1 too, same as any
// completed P16 route.
//
// The `south` exit's own passability gate (`ACT3_CONSTRUCTION_DOOR_GATE`)
// is synced here rather than by task A's own tunnel-side effects — see
// `ids.ts`'s doc comment on that gate object for why an entry-time sync can
// never miss the door opening (the player can only ever be standing in S1
// again after having left and come back, since the door only opens from
// the tunnel side).
// ---------------------------------------------------------------------------

const onEnter: OnEnterRule[] = [
  { effects: [{ set: [ACT3_INSIDE, true] }] },
  // `once: false` — `onEnter` rules default to once-ever (`move.ts` `runOnEnter`),
  // and this sync must run on EVERY entry: the first entry is usually by lift
  // with the door still shut (v0.14.0 playtest).
  { once: false, effects: [{ if: { when: { flag: ACT3_CONSTRUCTION_DOOR_OPEN }, then: [{ setState: [ACT3_CONSTRUCTION_DOOR_GATE, 'open', true] }] } }] },
];

// ---------------------------------------------------------------------------
// §8.7 — the stair down.
// ---------------------------------------------------------------------------

const stairDownText =
  'Four flights and three landings, and at each landing the same grey, the same tray, the same tidy, and no door.';

// ---------------------------------------------------------------------------
// §8.8 — room-level senses and responses.
// ---------------------------------------------------------------------------

const roomListenText =
  'Three pumps, a ventilation note somewhere above the light fittings, and the long soft sound a big lit room makes when it is empty and does not know it.';

const roomSmellText =
  'Clean concrete, warm electrics, and the ghost of the same grey paint that is on every surface in this building including, by now, probably you.';

const shoutText =
  'It goes up into the height of the room, comes back off the tray, and is answered by nothing, in a building where you have now been for some hours without being asked a single question.';

export const s1MechanicalGalleryRoom: RoomDefSlice = {
  name: 'S1 Mechanical Gallery',
  aliases: ['s1', 'mechanical gallery', 'gallery'],
  description,
  onEnter,
  exits: [
    // §7.3/§21.4 — the construction door only opens from the tunnel side;
    // this exit always structurally exists (no `when`) so a still-shut
    // door renders §7.3's own refusal via `blockedText`, not the generic
    // "no exit that way" (`move.ts`'s `exitCurrentlyExists`/`exitIsOpen`
    // split — see `ids.ts`'s own note on `ACT3_CONSTRUCTION_DOOR_GATE`).
    { dir: 's', to: ACT3_SERVICE_TUNNEL, door: ACT3_CONSTRUCTION_DOOR_GATE, blockedText: S1_DOOR_OPEN_BEFORE_TEXT },
    { dir: 'down', to: ACT3_S5_REACTOR_INTERFACE, minutes: 5, travelText: stairDownText },
    // The lift is reached by naming it (`PRESS S1`/`PRESS S5`/`PRESS L`),
    // not by a direction — see `elevator.ts`'s own header.
  ],
  handlers: [
    { verbs: [LISTEN], effects: [{ say: roomListenText }] },
    { verbs: [SMELL], effects: [{ say: roomSmellText }] },
    { verbs: [YELL, HELLO], effects: [{ say: shoutText }] },
    { verbs: [SEARCH], effects: [{ say: S1_SEARCH_BEHIND_PUMPS_TEXT }] },
  ],
};
