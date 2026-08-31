// Act III, Stage D4, task A — the rails, the seal, the ladder, the
// construction door (tunnel-side instance), and the two-turn match's tick
// event (`docs/superpowers/specs/2026-09-12-stage-d4-prose.md` §5.2, §6.4,
// §6.5, §7.1/§7.2/§7.4). Every string below is transcribed verbatim (hard
// rule 5).
//
// register 90 (main session ruling, revising §18 q6): the tunnel is now TWO
// rooms — `ACT3_SERVICE_TUNNEL` is "below" only; the mouth's own hatch and
// gates moved to `objects/tunnelMouth.ts`. The mouth<->below transition is
// a real cross-room `goto` now (the below room's own `up`/`out`/`south`
// exit, `serviceTunnel.ts`, the room file) — no object-handler workaround
// needed for bare compass words.

import type { Effect } from '../../../../engine/effects';
import type { EventDef, ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { DIRECTION_VERB_IDS } from '../../../../engine/move';
import { CLIMB_BACK_TEXT } from '../serviceTunnel';
import { CHAIR_LEG, KEYRING, V_FOLLOW, V_KNOCK } from '../../act1/ids';
import { BREAK, CLOSE, EXAMINE, CLIMB, LISTEN, OPEN, PRY, READ, TOUCH, UNLOCK } from '../../act1/verbs';
import {
  ACT3_CLUE_SEAL_FROM_INSIDE,
  ACT3_CONSTRUCTION_DOOR_OPEN,
  ACT3_CONSTRUCTION_DOOR_TUNNEL,
  ACT3_DOOR_HINGES,
  ACT3_DOOR_PLATE,
  ACT3_LADDER,
  ACT3_LIT_MATCH,
  ACT3_MATCH_BURNING,
  ACT3_MATCH_TURNS,
  ACT3_RAILS,
  ACT3_S1_MECHANICAL_GALLERY,
  ACT3_SAW_SEAL,
  ACT3_SERVICE_TUNNEL,
  ACT3_TUNNEL_MOUTH,
  ACT3_TUNNEL_SEAL,
  EVENT_ACT3_MATCH_TICK,
} from '../ids';
// E3 task U (§3) — the branch hatch. `act4_started` gates its own
// reachability (§3's own "it was always there and nobody looked" — the
// branch was never remarked on before Act IV; `hidden: true` by default,
// revealed by its own event once Act IV starts, `rootShaft.ts`); no
// `reachableInDark` (unlike the rails/ladder above) is what makes the
// engine's own `scope()` (`world.ts`) exclude it while `TUNNEL_DARK` holds —
// the room's shipped dark description and gate are untouched.
import { ACT4_STARTED } from '../../act4/ids';
import { ACT5_BRANCH_HATCH, ACT5_BRANCH_UNLOCKED, ACT5_CLUE_KEY_NUMBER } from '../../act5/ids';

// ---------------------------------------------------------------------------
// §6.4 — the rails. `reachableInDark: true` (feelable in the dark, engine
// facts' own field name — `world.ts`'s `reachableInDark`).
// ---------------------------------------------------------------------------

const railsExamineText =
  'Narrow gauge, laid straight and set directly into the pour so that the heads stand a half inch proud and everything below them is buried. Somebody meant to take the track up afterwards, or somebody costed taking it up and stopped there.\n\nThe heads are dull along their whole length except along the crown, where whatever ran on them has not quite finished being polished off by the years since.';

const touchRailsText =
  'Cold, flat on top, and greasy in the way old steel is greasy without anybody having greased it.\n\nYou can walk with a boot on each one and never look up, which is presumably how it was done.';

const followRailsText = 'They go where the tunnel goes, which is the point of them and of it.';

const rails: ObjectDefSlice = {
  location: ACT3_SERVICE_TUNNEL,
  name: 'rails',
  portable: false,
  reachableInDark: true,
  nouns: ['rails', 'rail', 'track', 'tracks', 'line', 'sleepers', 'gauge', 'steel'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: railsExamineText }] },
    { verbs: [TOUCH], effects: [{ say: touchRailsText }] },
    { verbs: [V_FOLLOW], effects: [{ say: followRailsText }] },
  ],
};

// ---------------------------------------------------------------------------
// §6.5 — the seal. Grants `act3_clue_seal_from_inside`, sets `act3_saw_seal`.
// ---------------------------------------------------------------------------

const sealExamineText =
  'The tunnel stops.\n\nWhere it stops there is concrete filling it from floor to arch — a plug of it a good yard thick, poured against shuttering that left the grain of the boards on this face and was never rubbed off afterwards.\n\nThrough the middle of the plug there is a hole. It is not a crack and it is not a failure. It is about two feet by three, and its edges were cut, and the cutting went in from the far side: every broken edge on this face is turned towards you, and every spall on this face has fallen this way, at your feet.\n\nThere is nothing at your feet. There has not been anything at your feet for a long time.';

const touchSealText = 'The cut edges are not sharp. Somebody went round them afterwards with something, the way you do when a thing is going to be used more than once.';

const lookThroughHoleText = 'Twenty feet of tunnel that is newer than the rest of it, squarer, with a skim on the walls, and then a steel door.';

const sealExamineEffects: Effect[] = [{ say: sealExamineText }, { grantClue: ACT3_CLUE_SEAL_FROM_INSIDE }, { set: [ACT3_SAW_SEAL, true] }];

const seal: ObjectDefSlice = {
  location: ACT3_SERVICE_TUNNEL,
  name: 'seal',
  portable: false,
  nouns: ['seal', 'plug', 'concrete', 'wall', 'end', 'hole', 'opening', 'gap', 'shuttering', 'board marks'],
  handlers: [
    { verbs: [EXAMINE], effects: sealExamineEffects },
    { verbs: [TOUCH], effects: [{ say: touchSealText }] },
    // "look through hole" (dobj = seal, via its own "hole" noun).
    { verbs: [READ], effects: [{ say: lookThroughHoleText }] },
    // "enter hole"/"go through" (IN's own words) — the way on, once the
    // door is open; the door's own tunnel-side EXAMINE otherwise, so a
    // player who tries this before opening the door is told what's there
    // rather than refused with nothing (no new prose invented).
    {
      verbs: [DIRECTION_VERB_IDS.in],
      when: { flag: ACT3_CONSTRUCTION_DOOR_OPEN },
      effects: [{ goto: ACT3_S1_MECHANICAL_GALLERY }],
    },
  ],
};

// ---------------------------------------------------------------------------
// §6.1 rule 2 / §6.6 — the ladder. Feelable in the dark, same reasoning as
// the rails. The below room's own `up`/`out`/`south` exit is the real
// mouth<->below transition now; "CLIMB LADDER" is kept as a plain-goto
// nicety mirroring it exactly (message: "keep... as plain gotos of the same
// walk text").
// ---------------------------------------------------------------------------

const climbUpEffects: Effect[] = [{ say: CLIMB_BACK_TEXT }, { goto: ACT3_TUNNEL_MOUTH }, { advanceClock: 25 }];

const ladder: ObjectDefSlice = {
  location: ACT3_SERVICE_TUNNEL,
  name: 'ladder',
  portable: false,
  reachableInDark: true,
  nouns: ['ladder', 'rungs', 'shaft', 'rectangle of night'],
  handlers: [{ verbs: [CLIMB], effects: climbUpEffects }],
};

// ---------------------------------------------------------------------------
// §7.1 rule 1 / §7.2 / §7.4 — the construction door, tunnel-side instance.
// "One object, two rooms" (§7's own idiom, the D3 elevator-door idiom): the
// S1-side instance is task B's own `ACT3_CONSTRUCTION_DOOR_S1`
// (`act3/ids.ts`) — its EXAMINE rules 2/3 and this task's report both note
// that this task could not safely mutate task B's own object file across a
// concurrent build (its handlers may not exist yet); the exact verbatim
// text for those two rules is transcribed in this task's report for
// whoever wires it.
// ---------------------------------------------------------------------------

const doorExamineTunnelSideText =
  'Steel, in a steel frame, set into block: a proper door, hung on three hinges, with a lever handle at waist height and a fabricator\'s plate riveted to the frame at eye height carrying a name you do not know and a year you do.\n\n    2030\n\nIt is not locked. There is no keyhole in it and no reader beside it and no card of instructions screwed anywhere near it.\n\nThe hinges have been oiled, and not by weather, and not long ago.';

const doorOpenText =
  'The lever goes down and the leaf comes towards you without a sound, which is not something a door of this age and this weight should be able to do.\n\nBehind it: light. Painted block, a run of conduit along the top of the wall, and the back of a rank of pumps.';

const knockOnDoorText = 'Four inches of steel in a block wall answers a knock the way a bank vault does, which is by not passing it on.';

const doorOpenEffects: Effect[] = [{ say: doorOpenText }, { set: [ACT3_CONSTRUCTION_DOOR_OPEN, true] }];

const constructionDoorTunnel: ObjectDefSlice = {
  location: ACT3_SERVICE_TUNNEL,
  name: 'construction door',
  portable: false,
  nouns: ['door', 'construction door', 'steel door', 'leaf', 'frame', 'lever', 'handle', 'dogs'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: doorExamineTunnelSideText }] },
    { verbs: [OPEN], when: { not: { flag: ACT3_CONSTRUCTION_DOOR_OPEN } }, effects: doorOpenEffects },
    { verbs: [V_KNOCK, BREAK], effects: [{ say: knockOnDoorText }] },
  ],
};

// --- Uncounted sub-parts: the fabricator's plate and the hinges (§7.4). ---

const platReadText =
  'Aluminium, riveted at four corners, stamped rather than engraved: a fabricator\'s name, a works town, and a year.\n\n    2030\n\nIt is the same year that is on the plaque in the lobby, which is a hundred yards and a mile away in two different directions.';

const hingesExamineText = 'Three hinges, wiped rather than dripping, with the oil gone dark on the knuckle and still bright in the pin.';

const doorPlate: ObjectDefSlice = {
  location: ACT3_SERVICE_TUNNEL,
  name: 'plate',
  portable: false,
  nouns: ['plate', 'fabricator plate', 'name plate'],
  handlers: [{ verbs: [EXAMINE, READ], effects: [{ say: platReadText }] }],
};

const doorHinges: ObjectDefSlice = {
  location: ACT3_SERVICE_TUNNEL,
  name: 'hinges',
  portable: false,
  nouns: ['hinges', 'hinge'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: hingesExamineText }] }],
};

// ---------------------------------------------------------------------------
// E3 task U, §3 — the branch hatch. `portable: false`; `container: {open:
// false}` (no `key` — not lockable via the generic UNLOCK/LOCK built-ins;
// opened only by the two custom legs below, same shape as D4's own
// `tunnelMouth.ts` hatch) so the tunnel's own `down` exit (`serviceTunnel.ts`,
// the room file) can gate on it and get a real `blockedText` rather than the
// generic "no exit that way" family.
// ---------------------------------------------------------------------------

const branchHatchExamineLockedText =
  'Twenty feet short of the plug, low down in the left-hand wall, there is a steel hatch about the size of a hearth, set into the pour with a rolled lip and four countersunk bolts that have never been out of it.\n\nNo handle. A squared hole in the middle of the plate, and above the hole, struck into the steel one blow to a digit by somebody working at an awkward angle:\n\n    4471\n\nThe rails run past it. Everything down here runs past it.';

const branchHatchExamineOpenText =
  'Open, hanging off the bottom hinges, with the ladder behind it going down out of your light.\n\nThe bolts that have never been out of it are still not out of it. Whatever this hatch was fitted for, it was not fitted to be taken off the wall.';

const branchHatchExamine: ProseRule[] = [
  { when: { flag: ACT5_BRANCH_UNLOCKED }, text: branchHatchExamineOpenText },
  { text: branchHatchExamineLockedText },
];

const branchHatchReadNumberText =
  'Four digits, struck one at a time, deeper on the last one than on the first, the way a man\'s arm gets tired.';

const branchHatchUnlockText =
  'The squared bit goes into the squared hole the way it went into the plate in the kerb on the county road, which is to say without any of the small negotiations, and you make the same quarter turn, and something behind the steel lets go with the same one flat knock.\n\nThe hatch comes down on its own weight and hangs off two hinges at the bottom of it.\n\nBehind it there is a formed opening with a rolled edge and a handhold, and a ladder bolted through it in four places, going down.\n\nYou put the ring back in your pocket. The number over the hole goes on being the number over the hole.';

const branchHatchPryText =
  'There is a lip on the low side of the plate and the leg goes under it, and for about four seconds absolutely nothing happens, and then the whole hatch leaves the wall at once with the noise of a dropped tray in a large empty building, and goes on making it for a while.\n\nBehind it, a formed opening with a rolled edge and a handhold, and a ladder going down.\n\nThe leg has now had a drawer, a plate, a cam lock in a kerb, a door under a library and this. It is starting to look less like a piece of a chair and more like a colleague.';

const branchHatchKnockListenText =
  'Warm air on the face, coming up. Under it, faintly, water going through something at a steady rate, which is the sound this county goes to sleep to with the window open.';

const branchHatchCloseText =
  'It goes back up and sits in its lip and stays there, because it was never holding anything out. It was holding a hole shut so that nobody put a foot in it in the dark.';

const branchHatchUnlockEffects: Effect[] = [
  { say: branchHatchUnlockText },
  { set: [ACT5_BRANCH_UNLOCKED, true] },
  { setState: [ACT5_BRANCH_HATCH, 'open', true] },
];

const branchHatchPryEffects: Effect[] = [
  { say: branchHatchPryText },
  { set: [ACT5_BRANCH_UNLOCKED, true] },
  { setState: [ACT5_BRANCH_HATCH, 'open', true] },
];

const branchHatch: ObjectDefSlice = {
  location: ACT3_SERVICE_TUNNEL,
  name: 'hatch',
  hidden: true,
  portable: false,
  container: { open: false },
  nouns: ['hatch', 'plate', 'steel hatch', 'opening', 'square hole', 'keyhole', 'number', 'stamp'],
  handlers: [
    // §3.1 — grants the clue every EXAMINE; `grantClue` (`effects.ts`) is a
    // no-op past the first (already in `state.clues`), so this needs no
    // `once`-tracking flag of its own.
    { verbs: [EXAMINE], effects: [{ say: branchHatchExamine }, { grantClue: ACT5_CLUE_KEY_NUMBER }] },
    { verbs: [READ], effects: [{ say: branchHatchReadNumberText }] },
    { verbs: [UNLOCK], when: { all: [{ not: { flag: ACT5_BRANCH_UNLOCKED } }, { has: KEYRING }] }, effects: branchHatchUnlockEffects },
    { verbs: [OPEN], when: { all: [{ not: { flag: ACT5_BRANCH_UNLOCKED } }, { has: KEYRING }] }, effects: branchHatchUnlockEffects },
    {
      verbs: [PRY],
      when: { all: [{ not: { flag: ACT5_BRANCH_UNLOCKED } }, { has: CHAIR_LEG }] },
      effects: branchHatchPryEffects,
    },
    {
      verbs: [OPEN],
      when: { all: [{ not: { flag: ACT5_BRANCH_UNLOCKED } }, { not: { has: KEYRING } }, { has: CHAIR_LEG }] },
      effects: branchHatchPryEffects,
    },
    { verbs: [UNLOCK, PRY, OPEN], when: { flag: ACT5_BRANCH_UNLOCKED }, effects: [{ say: branchHatchExamineOpenText }] },
    { verbs: [V_KNOCK, LISTEN], effects: [{ say: branchHatchKnockListenText }] },
    { verbs: [CLOSE], effects: [{ say: branchHatchCloseText }] },
  ],
};

/** Reveals the hatch (`hidden: true` → false) the first tick `act4_started` holds — registered in `act5/index.ts`'s own `events` table. */
export const ACT5_BRANCH_HATCH_REVEAL_EVENT: EventDef = {
  id: 'act5_ev_branch_hatch_reveal',
  when: { flag: ACT4_STARTED },
  once: true,
  effects: [{ reveal: ACT5_BRANCH_HATCH }],
};

export const ACT3_SERVICE_TUNNEL_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_RAILS]: rails,
  [ACT3_TUNNEL_SEAL]: seal,
  [ACT3_LADDER]: ladder,
  [ACT3_CONSTRUCTION_DOOR_TUNNEL]: constructionDoorTunnel,
  [ACT5_BRANCH_HATCH]: branchHatch,
};

/** Not one of the room's own "3 objects" (§6) — uncounted sub-parts, same idiom as `ACT3_PLANT_FLOOR`/`ACT3_LOBBY_BENCH`. */
export const ACT3_SERVICE_TUNNEL_EXTRA_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_DOOR_PLATE]: doorPlate,
  [ACT3_DOOR_HINGES]: doorHinges,
};

// ---------------------------------------------------------------------------
// §5.2 — the two-turn match, ticked once per world turn (§21.3's own note:
// "if the engine has no per-turn scheduler, the equivalent is a counter
// flag decremented in the room's `onTurn`" — this engine's actual
// equivalent is a plain `EventDef`, `once: false`, registered in
// `index.ts`'s `events:` map). Started at 3, not 2 — see `act1/objects/
// closeOut.ts`'s own doc comment on `lightMatchEffects` for why.
// ---------------------------------------------------------------------------

const matchWarningText = 'The match is down to the fingers.';
const matchOutText =
  'Out. The dark comes back in the way it does, all at once and from every direction at the same speed.\n\nThe book has plenty left in it and none of them last any longer than that one did.';

export const ACT3_MATCH_TICK_EVENT: EventDef = {
  id: EVENT_ACT3_MATCH_TICK,
  when: { flag: ACT3_MATCH_TURNS, atLeast: 1 },
  once: false,
  effects: [
    { dec: ACT3_MATCH_TURNS },
    { if: { when: { flag: ACT3_MATCH_TURNS, is: 1 }, then: [{ say: matchWarningText }] } },
    {
      if: {
        when: { flag: ACT3_MATCH_TURNS, is: 0 },
        then: [
          { say: matchOutText },
          { set: [ACT3_MATCH_BURNING, false] },
          { setState: [ACT3_LIT_MATCH, 'on', false] },
          { move: [ACT3_LIT_MATCH, 'nowhere'] },
        ],
      },
    },
  ],
};
