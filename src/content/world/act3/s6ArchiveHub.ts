// Act III, Stage D5, task G — the S6 Archive Hub room
// (`docs/superpowers/specs/2026-09-13-stage-d5-prose.md` §21, §30, §31,
// §39.4). Standard tier. Every string transcribed exactly (hard rule 5).
//
// Bare-verb dispatch note (see `objects/s6ArchiveHub.ts`'s own header on
// `V_ACT3_GRAPH_AXIS`): `actions.ts`'s `performAction` only ever consults a
// ROOM's own `handlers` for a verb with no `dobj` at all — every bare
// fixed-phrase verb this task declares (`LOG IN`/`TYPE`, the four ledger
// name-searches, `PRINT LEDGER`, `CHANGE SCALE`/`LOOK AT AXIS`, the two
// queue phrases, `BAY`) is therefore wired HERE, on the room, never on an
// object, even where the underlying object (the ledger, the graph, the
// queue) already exists.

import type { HandlerDef, OnEnterRule, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { DAD_REFUSES_DOCK_TEXT } from './objects/s6ArchiveHub';
import { ACT2_DAD_BOOTED } from '../act2/ids';
import { V_ACT3_DOCK_DAD } from './ids';
import { HELLO, LISTEN, SEARCH, SMELL, WAIT, YELL } from '../act1/verbs';
import { V_TYPE_TERMINAL } from '../act1/ids';
// E1 task M (`docs/superpowers/specs/2026-09-18-stage-e1-prose.md` §22) —
// R16, "entering the Hub with him following."
import { ACT4_LUKE, ACT4_LUKE_AT_ROOT } from '../act4/ids';
import { ACT4_LUKE_AT_ROOT_EFFECTS } from '../act4/luke';
import {
  ACT3_HUB_LOGGED_IN,
  ACT3_HUB_LOGIN_OPEN_SCRIPT,
  ACT3_HUB_SEEN,
  ACT3_LEDGER_SEARCH_OPEN_SCRIPT,
  ACT3_S6_ARCHIVE_HUB,
  ACT3_S6_MAINTENANCE_BAY,
  V_ACT3_GRAPH_AXIS,
  V_ACT3_LEDGER_JULES,
  V_ACT3_LEDGER_NOLAN,
  V_ACT3_LEDGER_OTHER,
  V_ACT3_LEDGER_PRINT,
  V_ACT3_LEDGER_SELF,
  V_ACT3_QUEUE_EDIT,
  V_ACT3_QUEUE_SEARCH_JULES,
  V_ACT3_TO_BAY,
} from './ids';
import {
  GRAPH_AXIS_TEXT,
  LEDGER_JULES_EFFECTS,
  LEDGER_NOLAN_EFFECTS,
  LEDGER_NUMERAL_FOUR_EFFECTS,
  LEDGER_NUMERAL_ONE_EFFECTS,
  LEDGER_OTHER_EFFECTS,
  LEDGER_PRINT_TEXT,
  LEDGER_SELF_EFFECTS,
  QUEUE_EDIT_REFUSED_TEXT,
  QUEUE_SEARCH_JULES_TEXT,
  ROOT_DOOR_DOWN_TEXT,
  TERMINAL_ALREADY_LOGGED_IN_TEXT,
} from './objects/s6ArchiveHub';
// E3 task W (§16, §34, §42.1, §42.4) — the boundary's deletion: the well's
// `down` exit takes `act5_well_door` instead of the deleted
// `act3_s6_boundary_gate`, gated on the door having been opened from the
// inside. `ROOT_DOOR_DOWN_TEXT` (above) is its `blockedText`, unchanged,
// with nothing appended (§34's own note).
import { ACT5_ROOT_ANTECHAMBER, ACT5_WELL_DOOR } from '../act5/ids';
// E0 task K (§16, §31.2) — the ledger's two numeral fixed phrases.
import { ACT4_STARTED, V_ACT4_LEDGER_FOUR, V_ACT4_LEDGER_ONE } from '../act4/ids';
// E2 task O (`docs/superpowers/specs/2026-09-19-stage-e2-prose.md` §56.1,
// §56.4) — the Hub's two door-style exits that never open (`ACT3_GATE_
// FRAMES`'s own `IN` handler does the real traversal on the two lit gate
// objects; these exits exist only so the map/`GO TO` have somewhere to
// route). `ACT4_ESCAPE_CHAMBER`/`ACT4_GATE_ESCAPE` are this task's own;
// `ACT4_HAB_GALLEY`/`ACT4_GATE_HAB` are declared here too — the hab room is
// task P's, the gate object is this task's own (`objects/escapeChamber.ts`).
import { ACT4_ESCAPE_CHAMBER, ACT4_ESCAPE_EXIT_GATE, ACT4_HAB_EXIT_GATE, ACT4_HAB_GALLEY } from '../act4/ids';
import { FRAME_ENTER_BLOCKED_TEXT } from './objects/s6ArchiveHub';

// ---------------------------------------------------------------------------
// §21.1 — description.
// ---------------------------------------------------------------------------

const HUB_FIRST_SIGHT =
  'Smaller than the bay, and colder, and the only room on this floor with a carpet\nin it: grey cord tiles, the kind that go down in an office in a week and are\nstill there thirty years later with the traffic worn into them in a path.\n\nAlong the right-hand wall, a steel bench bolted through the floor, and on the\nbench a terminal, and the terminal is on.\n\nAlong the left-hand wall, standing in the concrete, there are door frames with\nno doors in them. Over the first, a legend, and behind it something that is not\nquite dark. The rest are dark and only one of them says anything.\n\nAt the far end the carpet stops at three steps down into a well, and at the\nbottom of the well there is a door, and it is the heaviest thing you have seen\nin this building.';

const HUB_LOGGED_IN_DESC = 'The carpet, the bench, the frames along the left, and the well at the end with\nthe door at the bottom of it.\n\nThe terminal is showing you what it has.';

const HUB_OTHERWISE_DESC =
  '    USER:\n\nand a cursor.';

const HUB_OTHERWISE_LEAD = 'The carpet with the path worn into it. The bench, the terminal, the frames\nalong the left wall, and the three steps down at the end.\n\n';

const description: ProseRule[] = [
  { when: { not: { flag: ACT3_HUB_SEEN } }, text: HUB_FIRST_SIGHT },
  { when: { flag: ACT3_HUB_LOGGED_IN }, text: HUB_LOGGED_IN_DESC },
  { text: `${HUB_OTHERWISE_LEAD}${HUB_OTHERWISE_DESC}` },
];

const onEnter: OnEnterRule[] = [
  { effects: [{ set: [ACT3_HUB_SEEN, true] }] },
  // E1 task M, §22 — "entering the Hub with him following." `once` (the
  // default) keys off this rule's own array index, so it fires the first
  // time the cond holds and never again, regardless of how many times the
  // player re-enters — the same dedup `act4_luke_at_root` gives the root
  // door's own verb-based handler (`objects/s6ArchiveHub.ts`), belt and
  // suspenders: whichever trigger reaches him first wins, and the other
  // then finds the flag already set.
  { when: { all: [{ npcAt: [ACT4_LUKE, ACT3_S6_ARCHIVE_HUB] }, { not: { flag: ACT4_LUKE_AT_ROOT } }] }, effects: ACT4_LUKE_AT_ROOT_EFFECTS },
];

// ---------------------------------------------------------------------------
// §30 — room-level senses and responses.
// ---------------------------------------------------------------------------

const HUB_LISTEN_TEXT =
  "The terminal's fan, which is a fan of a certain age and says so.\n\nAnd through the left-hand wall — not past it, through it — the sound of a great\ndeal of water going through something at a steady rate, a long way down,\nwithout a gap in it anywhere.";

const HUB_SMELL_TEXT = 'Hot dust off a warm case, cord carpet, and the cold mineral smell that comes up\nout of a tiled well.';

const HUB_WAIT_TEXT = 'The fan. The water. The cursor, if you have not given it anything to do.';

const HUB_SHOUT_TEXT =
  'A hard room with a carpet in it does a strange thing with a shout: it takes the\ntop off it and gives you back the bottom, half a beat late, off the tile in the\nwell.';

// ---------------------------------------------------------------------------
// §22.2 / §39.2 — bare `LOG IN`/`TYPE`/`PRESS KEY` (`V_TYPE_TERMINAL`,
// `act1/ids.ts`, bare `'V'`). Not the opening room's own script — this is
// the Hub's own independent login.
// ---------------------------------------------------------------------------

const loginHandlers: HandlerDef[] = [
  {
    verbs: [V_TYPE_TERMINAL],
    when: { not: { flag: ACT3_HUB_LOGGED_IN } },
    effects: [{ script: { id: ACT3_HUB_LOGIN_OPEN_SCRIPT } }],
  },
  { verbs: [V_TYPE_TERMINAL], effects: [{ say: TERMINAL_ALREADY_LOGGED_IN_TEXT }] },
];

// ---------------------------------------------------------------------------
// §23, §39.2's "search" row — bare `SEARCH` (no dobj) opens the same
// one-field prompt `SEARCH LEDGER` does (`objects/s6ArchiveHub.ts`'s own
// `ledger` handler). Only meaningful once logged in.
// ---------------------------------------------------------------------------

const bareSearchHandler: HandlerDef = {
  verbs: [SEARCH],
  when: { flag: ACT3_HUB_LOGGED_IN },
  effects: [{ script: { id: ACT3_LEDGER_SEARCH_OPEN_SCRIPT } }],
};

// ---------------------------------------------------------------------------
// §23.2-§23.6 — the four ledger name-search groups plus PRINT LEDGER, all
// bare fixed phrases (see this file's own header). Gated on being logged
// in — before login the ledger doesn't exist and these commands should not
// do anything special.
// ---------------------------------------------------------------------------

const ledgerBareHandlers: HandlerDef[] = [
  { verbs: [V_ACT3_LEDGER_JULES], when: { flag: ACT3_HUB_LOGGED_IN }, effects: LEDGER_JULES_EFFECTS },
  { verbs: [V_ACT3_LEDGER_NOLAN], when: { flag: ACT3_HUB_LOGGED_IN }, effects: LEDGER_NOLAN_EFFECTS },
  { verbs: [V_ACT3_LEDGER_SELF], when: { flag: ACT3_HUB_LOGGED_IN }, effects: LEDGER_SELF_EFFECTS },
  { verbs: [V_ACT3_LEDGER_OTHER], when: { flag: ACT3_HUB_LOGGED_IN }, effects: LEDGER_OTHER_EFFECTS },
  { verbs: [V_ACT3_LEDGER_PRINT], when: { flag: ACT3_HUB_LOGGED_IN }, effects: [{ say: LEDGER_PRINT_TEXT }] },
];

// ---------------------------------------------------------------------------
// §24.2 — "CHANGE SCALE"/"LOOK AT AXIS" (bare).
// ---------------------------------------------------------------------------

const graphBareHandler: HandlerDef = {
  verbs: [V_ACT3_GRAPH_AXIS],
  when: { flag: ACT3_HUB_LOGGED_IN },
  effects: [{ say: GRAPH_AXIS_TEXT }],
};

// ---------------------------------------------------------------------------
// §25.3/§25.4 — the queue's two bare phrases.
// ---------------------------------------------------------------------------

const queueBareHandlers: HandlerDef[] = [
  { verbs: [V_ACT3_QUEUE_EDIT], when: { flag: ACT3_HUB_LOGGED_IN }, effects: [{ say: QUEUE_EDIT_REFUSED_TEXT }] },
  { verbs: [V_ACT3_QUEUE_SEARCH_JULES], when: { flag: ACT3_HUB_LOGGED_IN }, effects: [{ say: QUEUE_SEARCH_JULES_TEXT }] },
];

// ---------------------------------------------------------------------------
// E0 task K — §16, the ledger's two fixed-phrase numeral searches, reaching
// the same effects as the typed prompt (`act3LedgerSearchRespond`,
// `../scripts.ts`). Gated on `act4_started`: rule 1 answers with the
// numeral effects once Act IV has started; rule 2 (no `act4_started`
// check) falls to `LEDGER_OTHER_EFFECTS`, matching the typed-prompt path's
// own pre-Act-IV fallback exactly (§16.3, §31.1).
// ---------------------------------------------------------------------------

const ledgerNumeralBareHandlers: HandlerDef[] = [
  { verbs: [V_ACT4_LEDGER_ONE], when: { all: [{ flag: ACT3_HUB_LOGGED_IN }, { flag: ACT4_STARTED }] }, effects: LEDGER_NUMERAL_ONE_EFFECTS },
  { verbs: [V_ACT4_LEDGER_ONE], when: { flag: ACT3_HUB_LOGGED_IN }, effects: LEDGER_OTHER_EFFECTS },
  { verbs: [V_ACT4_LEDGER_FOUR], when: { all: [{ flag: ACT3_HUB_LOGGED_IN }, { flag: ACT4_STARTED }] }, effects: LEDGER_NUMERAL_FOUR_EFFECTS },
  { verbs: [V_ACT4_LEDGER_FOUR], when: { flag: ACT3_HUB_LOGGED_IN }, effects: LEDGER_OTHER_EFFECTS },
];

// ---------------------------------------------------------------------------
// §39.4 — exits. `west` is the ordinary, tested route back to the Bay;
// `V_ACT3_TO_BAY` ("BAY") is a bare-phrase synonym. "back" is deliberately
// not wired here — see `ids.ts`'s own doc comment on `V_ACT3_TO_BAY`.
// ---------------------------------------------------------------------------

const bayExitHandler: HandlerDef = { verbs: [V_ACT3_TO_BAY], effects: [{ goto: ACT3_S6_MAINTENANCE_BAY }] };

export const s6ArchiveHubRoom: RoomDefSlice = {
  name: 'Archive Hub',
  aliases: ['archive hub', 'hub', 's6 archive hub'],
  description,
  onEnter,
  exits: [
    { dir: 'w', to: ACT3_S6_MAINTENANCE_BAY, minutes: 1 },
    // E3 task W — §34/§42.1/§42.4: the boundary is deleted. The well's
    // `down` exit is now a real exit to the antechamber, through
    // `act5_well_door`, gated on the door having been opened from the
    // inside (§16.2, permanent, two-way). `blockedText` is the shipped
    // `ROOT_DOOR_DOWN_TEXT` alone — no `system.buildBoundary` paragraph
    // follows it any more. Deliberately NO `when` here — `door:
    // act5_well_door` alone is the gate (`move.ts`'s `exitIsOpen` reads the
    // door object's own `container.open` state, which `wellDoor.ts`'s OPEN
    // handler sets); an exit `when` means something different in this
    // engine ("does this exit exist at all" — `exitCurrentlyExists`, the
    // generic no-exit family, never `blockedText`) and would have hidden
    // this blockedText behind the wrong refusal entirely. See `wellDoor.ts`'s
    // own header for the fuller account (flagged in this task's report).
    { dir: 'down', to: ACT5_ROOT_ANTECHAMBER, door: ACT5_WELL_DOOR, blockedText: ROOT_DOOR_DOWN_TEXT },
    // E2 task O — §56.1/§56.4. Never open (the stub gate objects have no
    // `container`); real traversal is each frame's own `IN` handler
    // (`objects/escapeChamber.ts`'s `gateEscape`/`gateHab`). The map/`GO TO`
    // need these to exist. Deliberately NOT `door: ACT4_GATE_ESCAPE`/
    // `ACT4_GATE_HAB` themselves — `respond.ts`'s `DOOR_TRAVERSAL_VERB_IDS`
    // checks `traverseDoor` (a door-by-name lookup) before an object's own
    // handlers for IN/OUT/USE, so naming the frame objects here would let
    // this blocked exit shadow their own `IN` script (see `ids.ts`'s own
    // comment on `ACT4_ESCAPE_EXIT_GATE`).
    { dir: 'e', to: ACT4_ESCAPE_CHAMBER, door: ACT4_ESCAPE_EXIT_GATE, blockedText: FRAME_ENTER_BLOCKED_TEXT },
    { dir: 'ne', to: ACT4_HAB_GALLEY, door: ACT4_HAB_EXIT_GATE, blockedText: FRAME_ENTER_BLOCKED_TEXT },
  ],
  handlers: [
    // v0.15.1 — §29.1 as a bare form: the stick is in the rig, wherever the rig is (see `objects/s6ArchiveHub.ts` §29).
    { verbs: [V_ACT3_DOCK_DAD], when: { flag: ACT2_DAD_BOOTED }, effects: [{ say: DAD_REFUSES_DOCK_TEXT }] },
    ...loginHandlers,
    bareSearchHandler,
    ...ledgerBareHandlers,
    ...ledgerNumeralBareHandlers,
    graphBareHandler,
    ...queueBareHandlers,
    bayExitHandler,
    { verbs: [LISTEN], effects: [{ say: HUB_LISTEN_TEXT }] },
    { verbs: [SMELL], effects: [{ say: HUB_SMELL_TEXT }] },
    { verbs: [WAIT], effects: [{ say: HUB_WAIT_TEXT }] },
    { verbs: [YELL, HELLO], effects: [{ say: HUB_SHOUT_TEXT }] },
  ],
};

