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
import { DIRECTION_VERB_IDS } from '../../../../engine/move';
import { CLIMB_BACK_TEXT } from '../serviceTunnel';
import { V_FOLLOW, V_KNOCK } from '../../act1/ids';
import { BREAK, CLIMB, EXAMINE, OPEN, READ, TOUCH } from '../../act1/verbs';
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

// ---------------------------------------------------------------------------
// §6.4 — the rails. `reachableInDark: true` (feelable in the dark, engine
// facts' own field name — `world.ts`'s `reachableInDark`).
// ---------------------------------------------------------------------------

const railsExamineText =
  'Narrow gauge, laid straight and set directly into the pour so that the heads\nstand a half inch proud and everything below them is buried. Somebody meant to\ntake the track up afterwards, or somebody costed taking it up and stopped\nthere.\n\nThe heads are dull along their whole length except along the crown, where\nwhatever ran on them has not quite finished being polished off by the years\nsince.';

const touchRailsText =
  'Cold, flat on top, and greasy in the way old steel is greasy without anybody\nhaving greased it.\n\nYou can walk with a boot on each one and never look up, which is presumably\nhow it was done.';

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
  'The tunnel stops.\n\nWhere it stops there is concrete filling it from floor to arch — a plug of it\na good yard thick, poured against shuttering that left the grain of the boards\non this face and was never rubbed off afterwards.\n\nThrough the middle of the plug there is a hole. It is not a crack and it is\nnot a failure. It is about two feet by three, and its edges were cut, and the\ncutting went in from the far side: every broken edge on this face is turned\ntowards you, and every spall on this face has fallen this way, at your feet.\n\nThere is nothing at your feet. There has not been anything at your feet for a\nlong time.';

const touchSealText = 'The cut edges are not sharp. Somebody went round them afterwards with\nsomething, the way you do when a thing is going to be used more than once.';

const lookThroughHoleText = 'Twenty feet of tunnel that is newer than the rest of it, squarer, with a\nskim on the walls, and then a steel door.';

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
  'Steel, in a steel frame, set into block: a proper door, hung on three hinges,\nwith a lever handle at waist height and a fabricator\'s plate riveted to the\nframe at eye height carrying a name you do not know and a year you do.\n\n    2030\n\nIt is not locked. There is no keyhole in it and no reader beside it and no\ncard of instructions screwed anywhere near it.\n\nThe hinges have been oiled, and not by weather, and not long ago.';

const doorOpenText =
  'The lever goes down and the leaf comes towards you without a sound, which is\nnot something a door of this age and this weight should be able to do.\n\nBehind it: light. Painted block, a run of conduit along the top of the wall,\nand the back of a rank of pumps.';

const knockOnDoorText = 'Four inches of steel in a block wall answers a knock the way a bank vault\ndoes, which is by not passing it on.';

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
  'Aluminium, riveted at four corners, stamped rather than engraved: a\nfabricator\'s name, a works town, and a year.\n\n    2030\n\nIt is the same year that is on the plaque in the lobby, which is a hundred\nyards and a mile away in two different directions.';

const hingesExamineText = 'Three hinges, wiped rather than dripping, with the oil gone dark on the\nknuckle and still bright in the pin.';

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

export const ACT3_SERVICE_TUNNEL_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_RAILS]: rails,
  [ACT3_TUNNEL_SEAL]: seal,
  [ACT3_LADDER]: ladder,
  [ACT3_CONSTRUCTION_DOOR_TUNNEL]: constructionDoorTunnel,
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
  'Out. The dark comes back in the way it does, all at once and from every\ndirection at the same speed.\n\nThe book has plenty left in it and none of them last any longer than that one\ndid.';

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
