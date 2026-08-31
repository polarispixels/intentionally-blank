// Act III, Wave D3, task A — Perimeter Road & Gatehouse
// (`docs/superpowers/specs/2026-09-11-stage-d3-prose.md` §4). Prose
// transcribed verbatim (hard rule 5). Room id `act3_perimeter_road`,
// display name "Perimeter Road", standard tier, 7 objects
// (`objects/perimeterRoad.ts`).
//
// `visited` is the engine's own `Cond` (`state.visited`) — no manual flag/
// onEnter needed for description rule 1's own gate, unlike Act I/II's
// older `FLAG_VISITED_*` idiom.
//
// SLEEP / WAIT UNTIL <phase> (ruling 2): "a room-level rule above the D0
// handlers" — read as this room's own authored handlers taking priority
// over each verb's generic `default` family (rung 1 beats rung 2), NOT as
// participation in `act2/index.ts`'s per-Act-I-room prepend loop, which
// this room (outside that loop's own `ROOMS` array) never receives.

import type { ExitDefSlice, HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { HELLO, LISTEN, SLEEP, SMELL, WAIT, YELL } from '../act1/verbs';
import { WORK_ORDER } from '../act1/ids';
import { ACT2_NOLAN } from '../act2/ids';
import {
  V_ACT2_WAIT_UNTIL_AFTERNOON,
  V_ACT2_WAIT_UNTIL_EVENING,
  V_ACT2_WAIT_UNTIL_MORNING,
  V_ACT2_WAIT_UNTIL_NIGHT,
} from '../act2/ids';
import { DELIVERY_MORNING } from '../act2/calendar';
import { ACT3_ALERTNESS, ACT3_GATE_DOOR, ACT3_LOBBY, ACT3_PERIMETER_ROAD, V_ACT3_LOOK_WEST, V_ACT3_PHOTOGRAPH, V_ACT3_WRITE_VENDOR_NUMBER } from './ids';
import { MANIFEST_ABSENT_TEXT, MANIFEST_SIGN_NO_ORDER_TEXT, PHOTOGRAPH_TEXT, ROUTE_D_MANIFEST_EFFECTS } from './objects/perimeterRoad';

// ---------------------------------------------------------------------------
// §4.1 — description (5 rules).
// ---------------------------------------------------------------------------

const FIRST_SIGHT =
  'The made road runs out at a gate, square on, with a hut beside it and a light on a pole above the hut.\n\nThe fence goes off from the gate both ways and keeps going. New mesh on new posts, tensioned properly, three strands above it, and it stands out of the grazing like a ruled line drawn across a photograph of somewhere else. There is one camera on the near gatepost and it is a fixed one.\n\nInside the wire is an apron of concrete the size of a field, swept, painted into bays, and empty. Past the apron, the building: flat, long, lit from underneath, with the steam going up off the plant end.\n\nThe hut has a window with a shutter, a turnstile beside it, and a reader on a pedestal beside the turnstile. Over the door of the hut, in aluminium letters that have been up long enough to have shadows:\n\n    MERIDIAN\n\nNothing is moving in any of it. The light on the pole goes round.';

const DELIVERY_TEXT =
  'The gate is standing open and the apron is not empty.\n\nSix vehicles, nose to tail, on the near bays with their engines off and their drivers not out of them. The painted line at the apron\'s edge has a man standing on the far side of it doing nothing, which is what the line is for.\n\nAt the hut window a clipboard is hanging on a nail.';

const NOLAN_PRESENT_TEXT =
  'There is one car on the far side of the fence, parked nose-in at the end bay, and a man walking away from it towards the lobby doors with a bag on his shoulder and a mug in the same hand as his badge.\n\nHe is not hurrying and he is not late. He has done this walk about three thousand times.';

const ALERTNESS_TEXT = 'The road, the gate, the hut, the wire. The light on the pole goes round faster than it did.';

const OTHERWISE_TEXT =
  'The gate, the hut, the turnstile and the reader. The apron beyond, swept and empty, and the building beyond that with the steam coming off it.\n\nBehind you the road goes back to the bend. Off to the west there is nothing but grazing.';

const description: ProseRule[] = [
  { when: { not: { visited: ACT3_PERIMETER_ROAD } }, text: FIRST_SIGHT },
  { when: { all: [DELIVERY_MORNING, { clockPhase: 'morning' }] }, text: DELIVERY_TEXT },
  {
    when: { all: [{ clockPhase: 'morning' }, { clock: { after: 420, before: 450 } }, { npcAt: [ACT2_NOLAN, ACT3_PERIMETER_ROAD] }] },
    text: NOLAN_PRESENT_TEXT,
  },
  { when: { flag: ACT3_ALERTNESS, atLeast: 1 }, text: ALERTNESS_TEXT },
  { text: OTHERWISE_TEXT },
];

// ---------------------------------------------------------------------------
// §4.2 — room-level senses.
// ---------------------------------------------------------------------------

const listen =
  'Wind in mesh, which is a note and not a noise, and a transformer somewhere inside the wire holding one flat chord and never letting it go.\n\nUnder both of them, from the plant end, the sound a very large amount of moving air makes at half a mile.';

const smell =
  'Cold grass, hot metal, and the smell steam has when it has come off clean water and nothing else, which is no smell at all and is somehow noticeable anyway.';

const lookWest = 'Grazing, going away, doing what it does out there. Somewhere out in it a line of cedar posts carries no wire and goes north.';

// ---------------------------------------------------------------------------
// §4.10 — room-specific responses.
// ---------------------------------------------------------------------------

const shoutText = 'The wire takes it and gives nothing back, and the grazing does not even do that. Somewhere in the middle distance the transformer holds its chord.';

const waitText = 'The light goes round. Nothing else does.';

const sleepRefusalText =
  'Not here, sixty yards from a gate, with a light going round. There is a town an hour behind you with a bed in it and a truck facing the right way.';

const roomHandlers: HandlerDef[] = [
  { verbs: [LISTEN], effects: [{ say: listen }] },
  { verbs: [SMELL], effects: [{ say: smell }] },
  { verbs: [V_ACT3_LOOK_WEST], effects: [{ say: lookWest }] },
  { verbs: [YELL, HELLO], effects: [{ say: shoutText }] },
  { verbs: [SLEEP, V_ACT2_WAIT_UNTIL_MORNING, V_ACT2_WAIT_UNTIL_AFTERNOON, V_ACT2_WAIT_UNTIL_EVENING, V_ACT2_WAIT_UNTIL_NIGHT], effects: [{ say: sleepRefusalText }] },
  { verbs: [WAIT], effects: [{ say: waitText }] },
  { verbs: [V_ACT3_PHOTOGRAPH], effects: [{ say: PHOTOGRAPH_TEXT }] },
  // Route (d)'s bare phrasing — "WRITE VENDOR NUMBER" has no dobj to hang a
  // handler on, so it reaches this room's own handlers instead of the
  // manifest object's (§21's own wiring; `V_SIGN`'s `'V dobj'` pattern,
  // "SIGN MANIFEST," is the manifest object's own handler, `objects/
  // perimeterRoad.ts`). Same three-way order as that object's handlers.
  { verbs: [V_ACT3_WRITE_VENDOR_NUMBER], when: { all: [DELIVERY_MORNING, { has: WORK_ORDER }] }, effects: ROUTE_D_MANIFEST_EFFECTS },
  { verbs: [V_ACT3_WRITE_VENDOR_NUMBER], when: DELIVERY_MORNING, effects: [{ say: MANIFEST_SIGN_NO_ORDER_TEXT }] },
  { verbs: [V_ACT3_WRITE_VENDOR_NUMBER], effects: [{ say: MANIFEST_ABSENT_TEXT }] },
];

// ---------------------------------------------------------------------------
// §21.5 — the gate, before a route completes.
// ---------------------------------------------------------------------------

const gateRefusalText =
  'The turnstile does not move, and neither does anything else, and there is nobody to appeal to about it.\n\nThere is a pad on a pedestal, a clipboard that is only here on Tuesdays, a man who comes to work in the first half hour of the morning, and a truck.';

const exits: ExitDefSlice[] = [
  { dir: 'n', to: ACT3_LOBBY, door: ACT3_GATE_DOOR, blockedText: gateRefusalText },
  { dir: 'in', to: ACT3_LOBBY, door: ACT3_GATE_DOOR, blockedText: gateRefusalText },
];

export const perimeterRoadRoom: RoomDefSlice = {
  name: 'Perimeter Road',
  area: 'act3',
  description,
  exits,
  handlers: roomHandlers,
};
