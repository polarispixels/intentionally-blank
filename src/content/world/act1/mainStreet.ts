// Main Street (`docs/superpowers/specs/2026-09-02-main-street-prose.md`) —
// the fourth room, and the first exterior. Zone 1 room 3.
//
// §8's build boundary used to live here, on this room's own
// `north`/`south`/`west` exits (an always-closed gate object,
// `MAIN_STREET_BOUNDARY_GATE`). Wave-2's amendment (§13.3) deleted the
// `south`/`west` variants (real exits, to the Post Office and the General
// Store); THIS wave's amendment (§15.3) deletes the last one, `north` —
// north is now a real exit too, to `town_edge`, whose own `north` exit
// carries the boundary from here on (`TOWN_EDGE_BOUNDARY_NORTH_TEXT`,
// `townEdge.ts`). `MAIN_STREET_BOUNDARY_GATE` is unreferenced and deleted
// (object + id, `objects/mainStreet.ts`/`ids.ts`) — there is now exactly
// one `system.buildBoundary` gate left in the game, at Town Edge.

import type { HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { HELLO, LISTEN, SMELL, WAIT, YELL } from './verbs';
import { MAIN_STREET_TO_FRONT_DESK_TEXT } from './objects/mainStreet';
import {
  COUNTY_LIBRARY,
  FLAG_VISITED_MAIN_STREET,
  FRONT_DESK,
  GENERAL_STORE,
  JACKS_MOTEL,
  MAIN_STREET,
  POST_OFFICE,
  SHERIFF_OFFICE,
  SUNDOWN_DINER,
  TOWN_EDGE,
  V_LOOK_UP,
} from './ids';
import { ACT2_CUSTODIAN, ACT2_HORSE_BORROWED, ACT2_MEM_M15, ACT2_STARTED, ACT2_TRAVEL_SCRIPT } from '../act2/ids';
// D3, task A — "RIDE TO PLANT" (§3, ruling 1), the horse's own boundary
// door, mirroring "DRIVE TO PLANT" at the motel/Town Edge.
import { V_ACT3_RIDE_TO_PLANT } from '../act3/ids';

// ---------------------------------------------------------------------------
// §2.2 — description
// ---------------------------------------------------------------------------

// §15.1 (wave-3 amendment) — replaces wave 2's own inserted sentence, now
// that all six named neighbours (store, diner, post office, sheriff,
// library) are committed; §5's "no business is named" ruling is retired.
// §10.1 (wave-4 amendment) appends one more sentence, now that the motel is
// the last named neighbour — modest on purpose, and it does not name the
// motel (§3.1 of that doc gives the player the name on arrival instead).
const GOLD_LETTERING_SENTENCE =
  'The windows down this end carry gold lettering: a store across the road and, beside it, a diner with its lights on at one end only. On this side a post office and, past it, the sheriff, and past that the library up its six steps in the dark. Past the last of the brick on this side, set back off the road, a sign on a post with a light still in it.';

const FIRST_SIGHT = [
  'Main Street runs north and south and is not doing anything. Brick both sides, two storeys mostly, the dark in the upstairs windows deeper than the dark of the sky. Poles and wire down the west side. Every lamp standard is out but one, four buildings down, and there is a man up a stepladder under it with the glass cover in his hand.',
  'Across the road, at a rail outside the shops, three horses are tied. Two are asleep standing up. Nothing else is on the street — no vehicle at the kerb, none moving, none anywhere — and no sound in it but the horses when they shift.',
  GOLD_LETTERING_SENTENCE,
  'North, past the last roof, the sky is not black. Something low and wide is lit behind the horizon, flat along the bottom and holding still, and a billboard stands up out of the dark at the edge of town with enough light on it to read.',
].join('\n\n');

// §15.2 (wave-3 amendment) — replaces wave 2's own return-visit text,
// adding the diner's lit counter end. §10.2 (wave-4 amendment) adds one
// more clause, the motel sign burning at the end of it all.
const RETURN_VISIT =
  'The street, both ways, empty. The horses at their rail across the road. One lamp lit four buildings down, a man still under it. The store dark, the diner lit at the counter end, the post office dim, one lit blind at the sheriff\'s, and the motel sign burning away past the end of it all. North, past the roofs, the same light on the same horizon. The boarding house door is behind you.';

// D2-C amendment (D2 prose doc §18.4) — retro-visibility, one clause, keyed on M15. Appended to `RETURN_VISIT` only (the ruling's own naming: "Main Street, return visit").
// From `act2_started` the ladder man is retired (`nowhere`), so the return
// text loses its "a man still under it" clause — a trim, not new prose
// (found in the D2 playtest).
const RETURN_VISIT_ACT2 = RETURN_VISIT.replace(', a man still under it', '');
const M15_CLAUSE = `And the rail outside the post office, where a man in grey coveralls is\nfinishing a bracket that nobody in this town has looked at in twenty years.`;

// D2-C amendment (Stage D plan §2 D2; D2 prose doc §20) — Main Street by day, above the night-based first-sight/return-visit split.
const DAYTIME_TEXT =
  'Main Street in the daylight is Main Street with the dark taken off it.\n\nBrick both sides, the poles and the wire, the lamp standards out because it is\nday and out anyway. The horses are at the rail and two of them are asleep\nstanding up, which they were also doing in the dark.\n\nA truck goes through, northbound, without slowing, and the sound of it is\navailable for some time after it has gone. A woman comes out of the post\noffice with a parcel under her arm, crosses at the middle of the road because\nthere is nothing to look for, and goes in at a door further down without\nlooking up.\n\nNorth, past the last roof, there is nothing to see at all. Whatever it is that\nsits on the horizon at night does not exist in the morning, and the country\njust goes on being country until it stops.';

const DAYTIME_TEXT_WITH_M15 = `${DAYTIME_TEXT}\n\n${M15_CLAUSE}`;

const description: ProseRule[] = [
  // The M15 clause describes him at the rail (mornings), so it rides on the daytime text while he is there.
  { when: { all: [{ memory: ACT2_MEM_M15 }, { npcAt: [ACT2_CUSTODIAN, MAIN_STREET] }, { flag: ACT2_STARTED }, { any: [{ clockPhase: 'morning' }, { clockPhase: 'afternoon' }] }] }, text: DAYTIME_TEXT_WITH_M15 },
  { when: { all: [{ flag: ACT2_STARTED }, { any: [{ clockPhase: 'morning' }, { clockPhase: 'afternoon' }] }] }, text: DAYTIME_TEXT },
  { when: { not: { flag: FLAG_VISITED_MAIN_STREET } }, text: FIRST_SIGHT },
  // The M15 clause describes him at the rail, so it renders only while he is there (mornings).
  { when: { flag: ACT2_STARTED }, text: RETURN_VISIT_ACT2 },
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
  // D3, task A — "RIDE TO PLANT," the horse's own boundary door (§3,
  // ruling 1), gated on the horse having been borrowed/untied.
  {
    verbs: [V_ACT3_RIDE_TO_PLANT],
    when: { flag: ACT2_HORSE_BORROWED },
    effects: [{ script: { id: ACT2_TRAVEL_SCRIPT, args: { mode: 'horse', to: 'perimeter' } } }],
  },
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
    // Wave-2 amendment §13.3's two exits, and wave-3's own three (§15.3) —
    // no inbound `travelText` is authored anywhere in either wave's doc
    // (only each room's own outbound line back to Main Street is given) —
    // left unset rather than invented (hard rule 5); a bare `goto` effect
    // already re-renders the destination's own arrival description, so
    // nothing is lost mechanically. Flagged as a `narrative-writer`
    // opportunity in this task's report. "CROSS TO STORE"/"ENTER STORE"/
    // "FIND SHERIFF"/"ENTER DINER"/"ENTER LIBRARY"/etc. reach the same
    // destinations via the street-facing scenery objects' own handlers
    // (`objects/mainStreet.ts` — `general_store_front`/`post_office_
    // front`/`sheriff_office_front`/`diner`/`county_library_front`), which
    // resolve even before the room has been visited (unlike `GO TO`, whose
    // BFS route only ever walks between already-visited rooms — see this
    // task's own report on `GO TO DINER`/`GO TO SUNDOWN`/`GO TO LIBRARY`/
    // `GO TO ANNEX` specifically, which cannot reach those handlers at all
    // on a first visit, an `interpreter.ts` gap out of this module).
    { dir: 'w', to: GENERAL_STORE },
    { dir: 's', to: POST_OFFICE },
    { dir: 'sw', to: SHERIFF_OFFICE },
    // §15.3's three new exits. `north` was the build boundary's last
    // direction-keyed variant (wave-2 amendment §13.3 already deleted
    // `south`/`west`) — it now travels for real, to `town_edge`, whose own
    // `north` exit carries the boundary from here on (`townEdge.ts`).
    { dir: 'nw', to: SUNDOWN_DINER },
    { dir: 'se', to: COUNTY_LIBRARY },
    { dir: 'n', to: TOWN_EDGE },
    // §10.3 (wave-4 amendment) — the last named neighbour. No inbound
    // `travelText` is authored (same "left unset, not invented" note as
    // every other exit in this array).
    { dir: 'ne', to: JACKS_MOTEL },
  ],
  handlers: roomHandlers,
};
