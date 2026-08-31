// Act III, Stage D4, task A — the hatch, the approach gate (Town Edge's `nw`,
// §3.4), and the descent gate (the mouth's own `down`/`in`, §6.2/§6.3)
// (`docs/superpowers/specs/2026-09-12-stage-d4-prose.md` §3, §4, §6.2,
// §6.3). Every string below is transcribed verbatim (hard rule 5).
//
// register 90 (main session ruling, revising §18 q6): the tunnel is now TWO
// rooms — this file is the mouth's own objects; `objects/serviceTunnel.ts`
// (now "below" only) has the rails/seal/ladder/construction door. The
// mouth<->below transition is a real cross-room `goto` (the mouth's own
// `down`/`in` exit, `tunnelMouth.ts`, the room file), gated by
// `ACT3_TUNNEL_DESCENT_GATE` below — no more object-handler workaround for
// bare compass words; see this task's report for what that reverts.

import type { Effect } from '../../../../engine/effects';
import type { EventDef, ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { DIRECTION_VERB_IDS } from '../../../../engine/move';
import { CHAIR_LEG, KEYRING, V_KNOCK } from '../../act1/ids';
import { BREAK, EXAMINE, LISTEN, OPEN, PRY, UNLOCK } from '../../act1/verbs';
import {
  ACT3_HEADLAMP_ON,
  ACT3_MATCH_BURNING,
  ACT3_SERVICE_TUNNEL,
  ACT3_TUNNEL_APPROACH_GATE,
  ACT3_TUNNEL_DESCENT_GATE,
  ACT3_TUNNEL_HATCH,
  ACT3_TUNNEL_MOUTH,
  ACT3_TUNNEL_UNLOCKED,
  EVENT_ACT3_TUNNEL_APPROACH_GATE_SYNC,
  EVENT_ACT3_TUNNEL_DESCENT_GATE_SYNC,
} from '../ids';

// ---------------------------------------------------------------------------
// §4 — the hatch.
// ---------------------------------------------------------------------------

const hatchExamineUnlocked = 'Over on its back in the grass, with its two eyes pointing at the sky and a\nhole under where it was.';

const hatchExamineLocked =
  'Four feet square, steel, set flush in a low concrete kerb, with a lifting eye\nat each of two corners and a chequered tread stamped into the face that has\nworn smooth in a strip across the middle.\n\nThere is no hasp and no padlock. There is a brass escutcheon let into the\nplate near one edge, and behind the escutcheon there is a square hole.\n\nThe strip in the tread runs from the kerb to the escutcheon and back. It is\nabout the width of a boot.';

const hatchExamine: ProseRule[] = [
  { when: { flag: ACT3_TUNNEL_UNLOCKED }, text: hatchExamineUnlocked },
  { text: hatchExamineLocked },
];

const unlockWithKeyText =
  'The square bit goes into the square hole the way a thing goes into the thing it\nwas cut for, which is without any of the small negotiations.\n\nA quarter turn. Something in the kerb lets go with one flat knock, and the\nplate stands up half an inch on its own and stops there.\n\nThe number stamped in the bow of the key is not stamped anywhere on this\nhatch, or on the kerb, or on anything else in sight.';

const pryWithLegText =
  'You get the taper under the near eye and the kerb takes it as a fulcrum\nwithout being asked, which is the first thing today that has gone well.\n\nThe plate does not move, because the plate is not the problem. You go again\nwith your weight properly on it, and what gives is the lock: a quarter-inch\ncam in a cast body, doing the only job it has ever been given, against a yard\nof hard maple.\n\nThe plate comes up on its eyes and goes over backwards into the grass.';

/** §4.4, reused as the descent gate's own "locked" `blockedText` rule below. */
export const HATCH_OPEN_NEITHER_TEXT =
  'It is four feet of steel in a kerb with a cam lock holding it, and the cam is\nholding it well.\n\nThere is a square hole behind the brass and there is a lifting eye at the\ncorner, and between them they describe two entirely different afternoons.';

const unlockEffects: Effect[] = [{ say: unlockWithKeyText }, { set: [ACT3_TUNNEL_UNLOCKED, true] }];
const pryEffects: Effect[] = [{ say: pryWithLegText }, { set: [ACT3_TUNNEL_UNLOCKED, true] }];

const knockOnHatchText = 'It rings once, low, and then the ground under the hardstand takes the ring off\nyou and gives back rather more of it than a yard of fill ought to.';

const listenAtHatchText = 'Air. Not wind — the wind out here is coming across you and this is coming up\npast you, out of the escutcheon, steadily, at about the temperature of a room.';

// §6.2 — beats 1-3, the full descent with light. Reused as the mouth's own
// `down`/`in` exit `travelText` (`tunnelMouth.ts`, the room file) AND, here,
// as "ENTER HATCH"'s own plain-goto nicety (message: "keep... if authored,
// as plain gotos of the same walk text").
export const DESCEND_WALK_TEXT =
  'The ladder is bolted through the shaft wall in four places and goes down about\ntwenty feet onto concrete, and the rungs are dry.\n\nThen the mile.\n\nIt takes what a mile takes, and it takes it in a straight line, so that the\nonly way you know you are moving is the joints in the pour going by overhead\nat whatever interval a mile has decided to divide itself into. There is no\nturn. There is nothing on the walls. There is a rail under each foot if you\nwant one and after a while you want one.\n\nTwice the air changes temperature by about a degree and then changes back, and\nboth times you stop, and both times it is nothing.\n\nNobody has been down here for a long time and everything down here says so\nexcept the air, which is fresh, and moving, and coming from the far end.\n\nAnd then the light you have brought stops going forward and comes back at you\noff something flat.';

/** §6.3 — the mouth's/hatch's own "no light at all" text, reused by the descent gate's own `blockedText` below. */
export const DESCEND_NO_LIGHT_TEXT =
  'You go, because a tunnel is a straight line and a straight line can be walked\nby anybody with a hand on a wall.\n\nThe hand on the wall works. The rails under the boots work. What stops you,\nabout four hundred yards in, is that a mile of this at walking pace in the\ndark is a very long time to be doing arithmetic about how far back the ladder\nis, and the arithmetic wins.\n\nYou come back to the rectangle of night, which has not moved, and which is the\nonly thing here that was ever going to tell you anything.';

const hasLight = { any: [{ flag: ACT3_HEADLAMP_ON }, { flag: ACT3_MATCH_BURNING }] };

/**
 * "ENTER HATCH" (dobj = hatch, via `IN`'s own already-`'V dobj'` pattern) —
 * a plain-goto nicety mirroring the mouth's own `down`/`in` exit exactly
 * (same text, same `advanceClock`, same destination) for the object-named
 * phrasing. Only wired for the success case: the exit itself already
 * handles the locked/no-light refusals (its own `door`/`blockedText`), and
 * bare "ENTER"/"IN" with nothing named still reaches the exit unaffected.
 */
const enterHatchEffects: Effect[] = [{ say: DESCEND_WALK_TEXT }, { goto: ACT3_SERVICE_TUNNEL }, { advanceClock: 25 }];

const hatch: ObjectDefSlice = {
  location: ACT3_TUNNEL_MOUTH,
  name: 'hatch',
  portable: false,
  nouns: ['hatch', 'plate', 'steel plate', 'cover', 'lid', 'eyes', 'lifting eye', 'kerb', 'lock', 'keyhole', 'escutcheon'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: hatchExamine }] },
    { verbs: [UNLOCK], when: { has: KEYRING }, effects: unlockEffects },
    { verbs: [PRY], when: { has: CHAIR_LEG }, effects: pryEffects },
    { verbs: [OPEN], when: { has: KEYRING }, effects: unlockEffects },
    { verbs: [OPEN], when: { all: [{ not: { has: KEYRING } }, { has: CHAIR_LEG }] }, effects: pryEffects },
    { verbs: [OPEN], effects: [{ say: HATCH_OPEN_NEITHER_TEXT }] },
    { verbs: [V_KNOCK, BREAK], effects: [{ say: knockOnHatchText }] },
    { verbs: [LISTEN], when: { not: { flag: ACT3_TUNNEL_UNLOCKED } }, effects: [{ say: listenAtHatchText }] },
    { verbs: [DIRECTION_VERB_IDS.in], when: { all: [{ flag: ACT3_TUNNEL_UNLOCKED }, hasLight] }, effects: enterHatchEffects },
  ],
};

export const ACT3_TUNNEL_MOUTH_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_TUNNEL_HATCH]: hatch,
};

// ---------------------------------------------------------------------------
// §3.4 — the approach gate (Town Edge's `nw`). No object literal beyond the
// bare minimum needed to avoid the "undeclared door defaults closed on turn
// zero" bug this task's own report found — `container: { open: true }`
// matches the common case (nearly every player is carrying the keyring and
// the chair leg); kept correct every tick after that by its own event.
// ---------------------------------------------------------------------------

const tunnelApproachGate: ObjectDefSlice = { location: ACT3_TUNNEL_MOUTH, container: { open: true } };

export const ACT3_TUNNEL_APPROACH_GATE_SYNC_EVENT: EventDef = {
  id: EVENT_ACT3_TUNNEL_APPROACH_GATE_SYNC,
  when: { all: [] },
  once: false,
  effects: [
    {
      if: {
        when: { all: [{ not: { has: KEYRING } }, { not: { has: CHAIR_LEG } }, { not: { flag: ACT3_TUNNEL_UNLOCKED } }] },
        then: [{ setState: [ACT3_TUNNEL_APPROACH_GATE, 'open', false] }],
        else: [{ setState: [ACT3_TUNNEL_APPROACH_GATE, 'open', true] }],
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// §6.2/§6.3 — the descent gate (the mouth's own `down`/`in`). Closed while
// the hatch is not unlocked OR there is no light; open otherwise. Declared
// `container: { open: false }` — the reverse of the approach gate's own
// default, because here the common early state (before unlocking and
// lighting anything) IS closed, and by the time a player is ready to
// descend they have already taken the turns (UNLOCK HATCH, TURN ON LAMP)
// that let this event correct it.
// ---------------------------------------------------------------------------

const tunnelDescentGate: ObjectDefSlice = { location: ACT3_TUNNEL_MOUTH, container: { open: false } };

const descentGateClosed = { any: [{ not: { flag: ACT3_TUNNEL_UNLOCKED } }, { all: [{ not: { flag: ACT3_HEADLAMP_ON } }, { not: { flag: ACT3_MATCH_BURNING } }] }] };

export const ACT3_TUNNEL_DESCENT_GATE_SYNC_EVENT: EventDef = {
  id: EVENT_ACT3_TUNNEL_DESCENT_GATE_SYNC,
  when: { all: [] },
  once: false,
  effects: [
    {
      if: {
        when: descentGateClosed,
        then: [{ setState: [ACT3_TUNNEL_DESCENT_GATE, 'open', false] }],
        else: [{ setState: [ACT3_TUNNEL_DESCENT_GATE, 'open', true] }],
      },
    },
  ],
};

/** §4.4 when not unlocked, else §6.3 (unlocked but no light) — the descent gate's own `blockedText`, a `ProseRule[]` (`ExitDefSlice.blockedText: Prose` accepts one). */
export const DESCENT_GATE_BLOCKED_TEXT: ProseRule[] = [
  { when: { not: { flag: ACT3_TUNNEL_UNLOCKED } }, text: HATCH_OPEN_NEITHER_TEXT },
  { text: DESCEND_NO_LIGHT_TEXT },
];

export const ACT3_TUNNEL_MOUTH_EXTRA_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_TUNNEL_APPROACH_GATE]: tunnelApproachGate,
  [ACT3_TUNNEL_DESCENT_GATE]: tunnelDescentGate,
};
