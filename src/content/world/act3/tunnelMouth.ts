// Act III, Stage D4, task A — the Service Tunnel's mouth (D4 prose doc §3,
// §6.1 rules 1-2). register 90 (main session ruling, revising §18 q6): the
// tunnel is TWO rooms now — this is the arrival side (Town Edge's country
// walk, the hatch); `serviceTunnel.ts` is "below" (the walk, rails/seal/
// construction door). Every string below is transcribed verbatim (hard
// rule 5).

import type { HandlerDef, OnEnterRule, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { LISTEN } from '../act1/verbs';
import { TOWN_EDGE } from '../act1/ids';
import { DESCENT_GATE_BLOCKED_TEXT, DESCEND_WALK_TEXT } from './objects/tunnelMouth';
import { ACT3_AT_TUNNEL_MOUTH, ACT3_SERVICE_TUNNEL, ACT3_TUNNEL_DESCENT_GATE, ACT3_TUNNEL_MOUTH, ACT3_TUNNEL_UNLOCKED, ACT3_TUNNEL_BELOW } from './ids';

// ---------------------------------------------------------------------------
// §6.1 rules 1-2 — description.
// ---------------------------------------------------------------------------

const mouthFirstArrivalText =
  'The posts stop at a patch of ground that is not grazing.\n\nIt is a hardstand: an apron of concrete under gravel under years, square, big\nenough to turn a lorry on, with the county road along one side of it and the\nroad\'s one bend taking the corner off. Grass has come in from all four edges\nand met in the middle along the lines of the panels.\n\nSet in a low kerb in the middle of it there is a steel plate about four feet\nsquare, with two lifting eyes and a brass escutcheon.\n\nThere is no sign, no fence and no post with a number on it. There is nothing\nout here at all to say that the ground under this is not simply ground.';

const mouthHatchOpenText =
  'The hardstand, the kerb, and the plate over on its back in the grass.\n\nWhere the plate was there is a shaft with a ladder down one side of it, and\nthe air coming up out of the shaft is warmer than the county and it is going\nsomewhere.';

const description: ProseRule[] = [
  { when: { not: { flag: ACT3_TUNNEL_UNLOCKED } }, text: mouthFirstArrivalText },
  { text: mouthHatchOpenText },
];

// ---------------------------------------------------------------------------
// §6.6 — room-level senses (the mouth's own variant).
// ---------------------------------------------------------------------------

const listenMouthText = 'Wind on grass, a long way of it. Nothing on the road; the road has not had\nanything on it since the bend.';

const roomHandlers: HandlerDef[] = [{ verbs: [LISTEN], effects: [{ say: listenMouthText }] }];

// ---------------------------------------------------------------------------
// §3.1 beat 3 / §3, "arriving with act3_tunnel_below false (the mouth)." A
// real cross-room entry (from Town Edge, or back from below), so `onEnter`
// fires normally.
// ---------------------------------------------------------------------------

const onEnter: OnEnterRule[] = [
  { effects: [{ set: [ACT3_AT_TUNNEL_MOUTH, true] }] },
  // Every entry: back at the mouth the player is no longer below.
  { once: false, effects: [{ set: [ACT3_TUNNEL_BELOW, false] }] },
];

// ---------------------------------------------------------------------------
// §3.2 — the walk back to town.
// ---------------------------------------------------------------------------

const walkBackToTownText =
  'An hour back the way you came, downhill more than up, with the posts on your\nright this time and the town coming up out of the ground in the order it went\ndown: the water tower, then the grain bins, then the roofs.';

export const tunnelMouthRoom: RoomDefSlice = {
  name: 'Tunnel Mouth',
  area: 'act3',
  description,
  onEnter,
  handlers: roomHandlers,
  exits: [
    { dir: 'se', to: TOWN_EDGE, minutes: 60, travelText: walkBackToTownText },
    { dir: 'out', to: TOWN_EDGE, minutes: 60, travelText: walkBackToTownText },
    {
      dir: 'down',
      to: ACT3_SERVICE_TUNNEL,
      door: ACT3_TUNNEL_DESCENT_GATE,
      blockedText: DESCENT_GATE_BLOCKED_TEXT,
      travelText: DESCEND_WALK_TEXT,
      minutes: 25,
    },
    {
      dir: 'in',
      to: ACT3_SERVICE_TUNNEL,
      door: ACT3_TUNNEL_DESCENT_GATE,
      blockedText: DESCENT_GATE_BLOCKED_TEXT,
      travelText: DESCEND_WALK_TEXT,
      minutes: 25,
    },
  ],
};

export { ACT3_TUNNEL_MOUTH };
