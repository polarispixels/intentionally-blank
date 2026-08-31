// Act III, Stage D4, task A — the Service Tunnel, "below" (D4 prose doc §6.1
// rules 3-4, §6.6). register 90 (main session ruling, revising §18 q6): the
// tunnel is TWO rooms now — `tunnelMouth.ts` is the arrival side (Town
// Edge's country walk, the hatch); this room is "below" (the walk, rails/
// seal/construction door). Every string below is transcribed verbatim (hard
// rule 5).

import type { HandlerDef, OnEnterRule, RoomDefSlice } from '../../../engine/world';
import type { Cond } from '../../../engine/cond';
import type { ProseRule } from '../../../engine/prose';
import { LISTEN, SLEEP, SMELL, YELL } from '../act1/verbs';
import {
  V_ACT2_WAIT_UNTIL_AFTERNOON,
  V_ACT2_WAIT_UNTIL_EVENING,
  V_ACT2_WAIT_UNTIL_MORNING,
  V_ACT2_WAIT_UNTIL_NIGHT,
} from '../act2/ids';
import {
  ACT3_CONSTRUCTION_DOOR_OPEN,
  ACT3_HEADLAMP_ON,
  ACT3_MATCH_BURNING,
  ACT3_S1_MECHANICAL_GALLERY,
  ACT3_SERVICE_TUNNEL,
  ACT3_TUNNEL_BELOW,
  ACT3_TUNNEL_MOUTH,
  ACT3_WALKED_TUNNEL,
} from './ids';
// E3 task U, §3/§42.4 — the branch hatch's own `down` exit. `ACT5_BRANCH_
// HATCH`/`ACT5_ROOT_SHAFT` only (not `objects/serviceTunnel.ts`'s own
// exports — that file already imports `CLIMB_BACK_TEXT` from this one, and
// importing back from it here would be a cycle); the locked-state EXAMINE
// text is duplicated verbatim as this exit's own `blockedText` rather than
// shared by import, same reason.
import { ACT5_BRANCH_HATCH, ACT5_ROOT_SHAFT } from '../act5/ids';

/**
 * §6's own `dark` Cond — no position flag in it (register 90): being in
 * this room already means "below." Dark unless the headlamp or a match is
 * burning.
 */
export const TUNNEL_DARK: Cond = { all: [{ not: { flag: ACT3_HEADLAMP_ON } }, { not: { flag: ACT3_MATCH_BURNING } }] };

// ---------------------------------------------------------------------------
// §6.1 rules 3-4 — description.
// ---------------------------------------------------------------------------

const belowWithLightText =
  'The tunnel goes away from you in the one direction it has ever gone.\n\nIt is about eight feet across and a little less high, poured in bays with a\njoint every twenty feet, and the arch of it takes whatever light you have\nbrought and hands back a length of wall, a length of floor, and then the part\nthat is still dark.\n\nTwo rails run down the middle of the floor, set into the pour, with the\nconcrete brought up flush to their heads.\n\nThe air comes past you on its way out. It is warmer than the country was and\nit smells of nothing whatsoever.';

const belowDarkText =
  'Dark. Not the dark of a room with the light switched off — the other kind,\nwhere your eyes go on trying for a while and then give it up.\n\nThe floor under your boots is concrete and there is a rail under one of them.\n\nBehind you and above you there is a rectangle of night with the ladder in it,\nand it is the only thing down here that has an edge.';

const description: ProseRule[] = [
  { when: TUNNEL_DARK, text: belowDarkText },
  { text: belowWithLightText },
];

// ---------------------------------------------------------------------------
// §6.6 — room-level senses and responses (below).
// ---------------------------------------------------------------------------

const listenBelowText = 'Your own boots, arriving a beat late off the arch, and the very faint sound a\nlot of air makes when it is not in a hurry.';
const smellBelowText = 'Cold concrete, and past that nothing. Not damp, not diesel, not rot. This is a\nmile of the inside of a wall and it smells of the inside of a wall.';
const shoutBelowText =
  'It goes away from you in both directions, comes back off the plug first and\noff the ladder shaft second, and the second one arrives late enough to make\nyou glad the first one was a mile short.';
const waitSleepBelowText = 'Not down here. There is no version of the next few hours you are prepared to\nspend lying in a poured tube with a hole cut in the end of it.';

const roomHandlers: HandlerDef[] = [
  { verbs: [LISTEN], effects: [{ say: listenBelowText }] },
  { verbs: [SMELL], effects: [{ say: smellBelowText }] },
  { verbs: [YELL], effects: [{ say: shoutBelowText }] },
  {
    verbs: [SLEEP, V_ACT2_WAIT_UNTIL_MORNING, V_ACT2_WAIT_UNTIL_AFTERNOON, V_ACT2_WAIT_UNTIL_EVENING, V_ACT2_WAIT_UNTIL_NIGHT],
    effects: [{ say: waitSleepBelowText }],
  },
];

// ---------------------------------------------------------------------------
// §6.2's own flag-setting, now driven by onEnter (register 90): every entry
// sets `act3_tunnel_below` true (so the mouth's/matchbook's own Conds on it
// keep working unchanged); the first entry ever also sets
// `act3_walked_tunnel` (once, default — no `visited` check needed).
// ---------------------------------------------------------------------------

const onEnter: OnEnterRule[] = [
  { once: false, effects: [{ set: [ACT3_TUNNEL_BELOW, true] }] },
  { effects: [{ set: [ACT3_WALKED_TUNNEL, true] }] },
];

// ---------------------------------------------------------------------------
// §6.6 — "UP"/"OUT"/"SOUTH," the mile back.
// ---------------------------------------------------------------------------

export const CLIMB_BACK_TEXT =
  'The mile again, the other way, with the air on your face this time instead of\nyour back.\n\nThe rectangle of night is where it was.';

/** §3.1's own EXAMINE text, duplicated verbatim — see this file's own import header note on why it isn't shared by import. */
const BRANCH_HATCH_DOWN_BLOCKED_TEXT =
  'Twenty feet short of the plug, low down in the left-hand wall, there is a steel\nhatch about the size of a hearth, set into the pour with a rolled lip and four\ncountersunk bolts that have never been out of it.\n\nNo handle. A squared hole in the middle of the plate, and above the hole,\nstruck into the steel one blow to a digit by somebody working at an awkward\nangle:\n\n    4471\n\nThe rails run past it. Everything down here runs past it.';

export const serviceTunnelRoom: RoomDefSlice = {
  name: 'Service Tunnel',
  area: 'act3',
  dark: TUNNEL_DARK,
  description,
  onEnter,
  handlers: roomHandlers,
  exits: [
    { dir: 'up', to: ACT3_TUNNEL_MOUTH, minutes: 25, travelText: CLIMB_BACK_TEXT },
    { dir: 'out', to: ACT3_TUNNEL_MOUTH, minutes: 25, travelText: CLIMB_BACK_TEXT },
    { dir: 's', to: ACT3_TUNNEL_MOUTH, minutes: 25, travelText: CLIMB_BACK_TEXT },
    { dir: 'n', to: ACT3_S1_MECHANICAL_GALLERY, when: { flag: ACT3_CONSTRUCTION_DOOR_OPEN } },
    // E3 task U, §3/§42.4 — the branch hatch's own `down`, gated through the
    // hatch's `container.open` state (`objects/serviceTunnel.ts`), so a
    // player who tries it before unlocking gets the hatch's own locked-state
    // EXAMINE text rather than the generic "no exit that way" family.
    { dir: 'down', to: ACT5_ROOT_SHAFT, door: ACT5_BRANCH_HATCH, minutes: 15, blockedText: BRANCH_HATCH_DOWN_BLOCKED_TEXT },
  ],
};

export { ACT3_SERVICE_TUNNEL };
