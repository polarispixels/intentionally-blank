// Main Street (`docs/superpowers/specs/2026-09-02-main-street-prose.md`) —
// the fourth room, and the first exterior. Zone 1 room 3.
//
// §8's build boundary moves here (from the front desk's own — that room's
// §9). `system.buildBoundary` is now declared exactly once, on this room's
// own `north`/`south`/`west` exits, via an always-closed gate object
// (`MAIN_STREET_BOUNDARY_GATE`, `objects/mainStreet.ts` — mirrors
// `LANDING_BOUNDARY_GATE`). ENGINE GAP (same one already flagged on
// `LANDING_BOUNDARY_GATE`/the front desk's own boundary, not reworked here):
// `ExitDefSlice.blockedText` always renders `kind: 'prose'`, never the
// doc's own instructed `kind: 'system'` — a content-only approximation,
// byte-identical in the CLI.

import type { HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { HELLO, LISTEN, SMELL, WAIT, YELL } from './verbs';
import { ACT1_MAIN_STREET_BOUNDARY_NORTH } from './responses';
import { MAIN_STREET_TO_FRONT_DESK_TEXT } from './objects/mainStreet';
import {
  FLAG_CROSSED_STREET,
  FLAG_VISITED_MAIN_STREET,
  FRONT_DESK,
  GENERAL_STORE,
  MAIN_STREET,
  MAIN_STREET_BOUNDARY_GATE,
  POST_OFFICE,
  SHERIFF_OFFICE,
  V_LOOK_UP,
} from './ids';

// ---------------------------------------------------------------------------
// §2.2 — description
// ---------------------------------------------------------------------------

// §13.1 (wave-2 amendment) — one sentence inserted after the horses
// paragraph, before the north/billboard paragraph, now that three of this
// street's storefronts are real rooms.
const GOLD_LETTERING_SENTENCE =
  'Three of the windows down this end carry gold lettering: a store across the road, and on this side a post office and, past it, the sheriff.';

const FIRST_SIGHT = [
  'Main Street runs north and south and is not doing anything. Brick both sides, two storeys mostly, the dark in the upstairs windows deeper than the dark of the sky. Poles and wire down the west side. Every lamp standard is out but one, four buildings down, and there is a man up a stepladder under it with the glass cover in his hand.',
  'Across the road, at a rail outside the shops, three horses are tied. Two are asleep standing up. Nothing else is on the street — no vehicle at the kerb, none moving, none anywhere — and no sound in it but the horses when they shift.',
  GOLD_LETTERING_SENTENCE,
  'North, past the last roof, the sky is not black. Something low and wide is lit behind the horizon, flat along the bottom and holding still, and a billboard stands up out of the dark at the edge of town with enough light on it to read.',
].join('\n\n');

// §13.2 (wave-2 amendment) — replaced, adding the lit-blind clause: the
// causal hook for Part Three (a player crosses the street toward the one
// lit window left at four in the morning).
const RETURN_VISIT =
  'The street, both ways, empty. The horses at their rail across the road. One lamp lit four buildings down, a man still under it. The store dark, the post office dim, and one lit blind at the sheriff\'s. North, past the roofs, the same light on the same horizon. The boarding house door is behind you.';

const description: ProseRule[] = [
  { when: { not: { flag: FLAG_VISITED_MAIN_STREET } }, text: FIRST_SIGHT },
  { text: RETURN_VISIT },
];

// ---------------------------------------------------------------------------
// §2.3 — room-level senses
// ---------------------------------------------------------------------------

const smell = 'Cold, first, which is most of it. Under that: horse, wet brick, and the dust that comes off a dry town at night.';

const listen = 'Nothing, and then the things nothing turns out to contain. A hoof set down and picked up again. Wire moving on its poles. Four buildings away, metal touching metal twice, carefully.';

const lookUp = 'There are far more stars than you were expecting. Nothing on the ground down here is arguing with them.';

// ---------------------------------------------------------------------------
// §6 — room-specific responses. `WHAT YEAR IS IT`/`CROUCH` are wired as
// plain verb-level `default`s in `verbs.ts` (no flag effects, no other room
// declares either verb) — see that file's own comments. `CROSS STREET`/
// `GO TO HORSES`/etc are object handlers (`objects/mainStreet.ts`).
// ---------------------------------------------------------------------------

const shoutText =
  'You put your voice out into the street. It goes to the end of it, finds nothing to come back off, and stops.\n\nOne of the horses lifts its head. Nobody else does. Four buildings down, a man carries on with a light fitting.';

const waitText = 'You wait. One of the horses changes which foot it is resting and goes back to sleep. The glow does not move.';

const roomHandlers: HandlerDef[] = [
  // §2.3's bare room-scale senses (§8 gap 3's mechanism — same idiom as room 1's own bare SMELL/LISTEN, `room.ts`).
  { verbs: [SMELL], effects: [{ say: smell }] },
  { verbs: [LISTEN], effects: [{ say: listen }] },
  { verbs: [V_LOOK_UP], effects: [{ say: lookUp }] },
  // "SHOUT"/"YELL"/"CALL OUT"/"HELLO" (to the street, no target) — overrides opening-room §7.11's bare HELLO while in this room.
  { verbs: [YELL, HELLO], effects: [{ say: shoutText }] },
  { verbs: [WAIT], effects: [{ say: waitText }] },
];

const onEnter: RoomDefSlice['onEnter'] = [{ effects: [{ set: [FLAG_VISITED_MAIN_STREET, true] }] }];

export const mainStreetRoom: RoomDefSlice = {
  name: 'Main Street',
  area: 'act1',
  map: { x: 1, y: 2 },
  description,
  onEnter,
  exits: [
    // "in"/"east"/"enter" -> front_desk, via `boarding_house` (also "go inside", "go back in", "knock", "open door" + go — all wired as `boarding_house`'s own handlers, `objects/mainStreet.ts`). No `door:` — always passable, matching `landing`'s own frictionless `down`/`out` exits.
    { dir: 'in', to: FRONT_DESK, travelText: MAIN_STREET_TO_FRONT_DESK_TEXT },
    { dir: 'e', to: FRONT_DESK, travelText: MAIN_STREET_TO_FRONT_DESK_TEXT },
    // §8's build boundary — always-closed gate, `to: MAIN_STREET` (self, never actually reached — same idiom as the front desk's own former boundary). Only `north` keeps it now (wave-2 amendment §13.3: the `south`/`west` variants are deleted — both directions travel for real, below).
    { dir: 'n', to: MAIN_STREET, door: MAIN_STREET_BOUNDARY_GATE, blockedText: { ref: ACT1_MAIN_STREET_BOUNDARY_NORTH } },
    // Wave-2 amendment §13.3's three new exits. No inbound `travelText` is
    // authored anywhere in the wave-2 doc (only each room's own outbound
    // line back to Main Street is given) — left unset rather than invented
    // (hard rule 5); a bare `goto` effect already re-renders the
    // destination's own arrival description, so nothing is lost
    // mechanically. Flagged as a `narrative-writer` opportunity in this
    // task's report. "CROSS TO STORE"/"ENTER STORE"/"FIND SHERIFF"/etc.
    // reach the same destinations via the new street-facing scenery
    // objects' own handlers (`objects/mainStreet.ts` — `general_store_
    // front`/`post_office_front`/`sheriff_office_front`), which resolve
    // even before the room has been visited (unlike `GO TO`, whose BFS
    // route only ever walks between already-visited rooms).
    { dir: 'w', to: GENERAL_STORE },
    { dir: 's', to: POST_OFFICE },
    { dir: 'sw', to: SHERIFF_OFFICE },
  ],
  handlers: roomHandlers,
};
