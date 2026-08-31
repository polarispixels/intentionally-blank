// Act II ("The Notebook") — `WorldSlice` export.
//
// D0 (Stage D plan §3 E4/E5; main-session rulings 1-2): the calendar has
// nothing of its own to show yet (no new rooms), but it wires two things
// into every Act I room without hand-editing any of them (main-session
// ruling 2 / the plan's own E4 file list: "a loop in act2/index.ts that
// appends the handlers to each listed room's handlers rather than editing
// twelve files") —
//
//   1. The four `WAIT UNTIL <phase>` bare verbs (`act2/verbs.ts`), wired
//      onto every Zone 1 room's own `handlers` unconditionally — a brand
//      new mechanic, not gated on `act2_started` (ADR 0011's gating rule
//      only covers *schedule and presence* changes, not this).
//   2. A `SLEEP` override per room, gated on `{ flag: act2_started }` and
//      **prepended** ahead of whatever that room's own file already
//      declares for `SLEEP` — `actions.ts`'s `findRoomHandler` takes the
//      first array entry whose `verbs`/`when` match, so before
//      `act2_started` the prepended entry's `when` is false and lookup
//      falls through to the room's existing (pre-D0) behaviour, byte-
//      identical to v0.9.0. The mutation happens once, at module load, on
//      the exact same room objects `act1/slice.ts` also holds references
//      to (both modules import the same `./act1/*` files) — so `WORLD`
//      (assembled in `game.ts`, which imports both slices) sees the
//      amended `handlers` arrays with no separate wiring step and no
//      duplicate `rooms` entry for `assemble()` to reject.
//
// D1+ fills in rooms/objects/npcs/etc. of its own; this file's loop only
// ever *amends* Act I's twelve.

import type { WorldSlice } from '../game';
import type { HandlerDef } from '../../../engine/world';
import type { RoomId } from '../../../engine/ids';
import {
  FRONT_DESK,
  GENERAL_STORE,
  JACKS_MOTEL,
  LANDING,
  MAIN_STREET,
  NOLANS_YARD,
  POST_OFFICE,
  SHERIFF_OFFICE,
  SUNDOWN_DINER,
  TOWN_EDGE,
  COUNTY_LIBRARY,
  YOUR_ROOM,
} from '../act1/ids';
import { yourRoom } from '../act1/room';
import { landingRoom } from '../act1/landing';
import { frontDeskRoom } from '../act1/frontDesk';
import { mainStreetRoom } from '../act1/mainStreet';
import { postOfficeRoom } from '../act1/postOffice';
import { generalStoreRoom } from '../act1/generalStore';
import { sheriffOfficeRoom } from '../act1/sheriffOffice';
import { countyLibraryRoom } from '../act1/countyLibrary';
import { sundownDinerRoom } from '../act1/sundownDiner';
import { townEdgeRoom } from '../act1/townEdge';
import { jacksMotelRoom } from '../act1/jacksMotel';
import { nolansYardRoom } from '../act1/nolansYard';
import { SLEEP } from '../act1/verbs';
import {
  ACT2_PASS_TIME_SCRIPT,
  ACT2_SLEEP_SCRIPT,
  ACT2_STARTED,
  ACT2_JACK_AWAY,
  ACT2_SEEN_DESK_EMPTY,
  ACT2_SEEN_OFFICE_EMPTY,
  ACT2_SLEPT_SINCE_BOOT,
  ACT2_RODE_NORTH,
  ACT2_HORSE_BORROWED,
  ACT2_SAW_CUSTODIAN_PAINTING,
  ACT2_LUKE_REFERENCED,
  ACT2_TRAVEL_SCRIPT,
  ACT2_CUSTODIAN,
  V_ACT2_WAIT_UNTIL_AFTERNOON,
  V_ACT2_WAIT_UNTIL_EVENING,
  V_ACT2_WAIT_UNTIL_MORNING,
  V_ACT2_WAIT_UNTIL_NIGHT,
} from './ids';
import { ACT2_VERBS } from './verbs';
import { ACT2_SLEEP_REFUSAL_TEXT, act2PassTime, act2Sleep } from './time';
import { ACT2_TRAVEL_CLUES, act2Travel } from './travel';
import { custodian } from './custodian';
import { ACT2_D1_SCRIPTS } from './scripts';
import { ACT2_M2_MEMORIES, ACT2_TRUCK_OBJECTS } from './objects/truck';
import { ACT2_HORSE_OBJECTS } from './objects/horse';
// Task B's own D1 knowledge/objects — authored but not yet wired into this
// slice when this task's own edits landed (both tasks touch this shared
// file; reconcile on merge if task B wires these independently — see this
// task's report).
import { ACT2_D1_CLUES, ACT2_D1_FLAGS, ACT2_D1_MEMORIES, ACT2_D1_PUZZLES, ACT2_D1_QUESTIONS } from './knowledge';
import { ACT2_EMPORIUM_OBJECTS } from './objects/wallDrugEmporium';
import { ACT2_BACK_CORRIDOR_OBJECTS } from './objects/wallDrugBackCorridor';
import { ACT2_CACHE_OBJECTS } from './objects/cache';
// `objects/usb.ts` (task A's own module) has no exports of its own — it
// amends task B's `objects/cache.ts` `usb` object in place (a second
// `PUT_IN`/`withInstrument` handler, Your Room's real terminal) — imported
// here purely for its module-load side effect, same idiom as `act2/verbs.
// ts`'s own `RUB`/`ACT1_VERBS` amendment. Must be imported AFTER
// `ACT2_CACHE_OBJECTS` so `usb`'s handlers array exists before this mutates
// it (both resolve to the same module instance either way — ES module
// imports are singletons — but the ordering keeps the intent legible).
import './objects/usb';
import { ACT2_NOTEBOOK_OBJECTS } from './objects/notebook';
import { wallDrugEmporiumRoom } from './wallDrugEmporium';
import { wallDrugBackCorridorRoom } from './wallDrugBackCorridor';
import { dot, ACT2_DOT_AGENDA_EVENT } from './dot';
import { ACT2_DOT, ACT2_WALL_DRUG_BACK_CORRIDOR, ACT2_WALL_DRUG_EMPORIUM, EVENT_ACT2_DOT_AGENDA } from './ids';

// ---------------------------------------------------------------------------
// D0 — flags. (Only five so far; grows with each later wave's own knowledge.)
// ---------------------------------------------------------------------------

const ACT2_FLAGS: WorldSlice['flags'] = {
  [ACT2_STARTED]: { default: false, doc: "set by D1's first ride north; every Act II schedule/presence rule below is gated on it (ADR 0011 rule 5)" },
  [ACT2_JACK_AWAY]: { default: false, doc: "set while the travel script has Jack pinned off his schedule; read by jack.ts's own diner-morning rule so it never needs npcAt for its own npc" },
  [ACT2_SLEPT_SINCE_BOOT]: { default: false, doc: 'set by act2_sleep (either variant) — a flag D2 reads' },
  [ACT2_SEEN_DESK_EMPTY]: { default: false, doc: "set by front_desk's own onEnter the first time the desk is found empty — gates the long/short empty-desk description split" },
  [ACT2_SEEN_OFFICE_EMPTY]: { default: false, doc: "set by sheriff_office's own onEnter the first time the office is found empty — gates the long/short empty-office description split" },
  // D1 — task A's own module (the travel script, the horse, the Custodian).
  [ACT2_RODE_NORTH]: { default: false, doc: "set by the travel script's first ride north (either mode) — scene-variant selection and L10's clue" },
  [ACT2_HORSE_BORROWED]: { default: false, doc: "set by asking Pearl/Marlow about the horses, or by UNTIE HORSE directly — read by the ride handlers" },
  [ACT2_SAW_CUSTODIAN_PAINTING]: { default: false, doc: 'set by EXAMINE CUSTODIAN — read by nothing yet in D1; M15 (D5) should read it' },
  [ACT2_LUKE_REFERENCED]: { default: false, doc: "set by jack.ts's topic_family effects (this task's own amendment) — M12's other half-trigger, alongside act2_read_notebook_margin (task B)" },
};

// ---------------------------------------------------------------------------
// The per-room loop.
// ---------------------------------------------------------------------------

type SleepVariant = 'your_room' | 'unit_five' | 'refusal';

const ROOMS: { id: RoomId; room: { handlers?: HandlerDef[] }; sleep: SleepVariant }[] = [
  { id: YOUR_ROOM, room: yourRoom, sleep: 'your_room' },
  { id: LANDING, room: landingRoom, sleep: 'refusal' },
  { id: FRONT_DESK, room: frontDeskRoom, sleep: 'refusal' },
  { id: MAIN_STREET, room: mainStreetRoom, sleep: 'refusal' },
  { id: POST_OFFICE, room: postOfficeRoom, sleep: 'refusal' },
  { id: GENERAL_STORE, room: generalStoreRoom, sleep: 'refusal' },
  { id: SHERIFF_OFFICE, room: sheriffOfficeRoom, sleep: 'refusal' },
  { id: COUNTY_LIBRARY, room: countyLibraryRoom, sleep: 'refusal' },
  { id: SUNDOWN_DINER, room: sundownDinerRoom, sleep: 'refusal' },
  { id: TOWN_EDGE, room: townEdgeRoom, sleep: 'refusal' },
  { id: JACKS_MOTEL, room: jacksMotelRoom, sleep: 'unit_five' },
  { id: NOLANS_YARD, room: nolansYardRoom, sleep: 'refusal' },
];

const WAIT_UNTIL_HANDLERS: HandlerDef[] = (
  [
    [V_ACT2_WAIT_UNTIL_MORNING, 'morning'],
    [V_ACT2_WAIT_UNTIL_AFTERNOON, 'afternoon'],
    [V_ACT2_WAIT_UNTIL_EVENING, 'evening'],
    [V_ACT2_WAIT_UNTIL_NIGHT, 'night'],
  ] as const
).map(([verb, phase]) => ({
  verbs: [verb],
  effects: [{ script: { id: ACT2_PASS_TIME_SCRIPT, args: { phase } } }],
}));

function sleepHandlerFor(variant: SleepVariant): HandlerDef {
  if (variant === 'refusal') {
    return { verbs: [SLEEP], when: { flag: ACT2_STARTED }, effects: [{ say: ACT2_SLEEP_REFUSAL_TEXT }] };
  }
  return {
    verbs: [SLEEP],
    when: { flag: ACT2_STARTED },
    effects: [{ script: { id: ACT2_SLEEP_SCRIPT, args: { variant } } }],
  };
}

for (const entry of ROOMS) {
  entry.room.handlers = [...WAIT_UNTIL_HANDLERS, sleepHandlerFor(entry.sleep), ...(entry.room.handlers ?? [])];
}

// Act II's own rooms take the pass-time verbs too (the D1 playtest found
// WAIT UNTIL MORNING at Wall Drug falling to the verb's text-only default,
// so the morning never came). Their SLEEP lines are their own (D1 §7).
for (const room of [wallDrugEmporiumRoom, wallDrugBackCorridorRoom]) {
  room.handlers = [...WAIT_UNTIL_HANDLERS, ...(room.handlers ?? [])];
}

export const ACT2_SLICE: WorldSlice = {
  flags: { ...ACT2_FLAGS, ...ACT2_D1_FLAGS },
  verbs: ACT2_VERBS,
  rooms: {
    [ACT2_WALL_DRUG_EMPORIUM]: wallDrugEmporiumRoom,
    [ACT2_WALL_DRUG_BACK_CORRIDOR]: wallDrugBackCorridorRoom,
  },
  objects: {
    ...ACT2_TRUCK_OBJECTS,
    ...ACT2_HORSE_OBJECTS,
    ...ACT2_EMPORIUM_OBJECTS,
    ...ACT2_BACK_CORRIDOR_OBJECTS,
    ...ACT2_CACHE_OBJECTS,
    ...ACT2_NOTEBOOK_OBJECTS,
  },
  npcs: {
    [ACT2_CUSTODIAN]: custodian,
    [ACT2_DOT]: dot,
  },
  events: {
    [EVENT_ACT2_DOT_AGENDA]: ACT2_DOT_AGENDA_EVENT,
  },
  clues: { ...ACT2_TRAVEL_CLUES, ...ACT2_D1_CLUES },
  memories: { ...ACT2_M2_MEMORIES, ...ACT2_D1_MEMORIES },
  questions: ACT2_D1_QUESTIONS,
  puzzles: ACT2_D1_PUZZLES,
  scripts: {
    [ACT2_PASS_TIME_SCRIPT]: act2PassTime,
    [ACT2_SLEEP_SCRIPT]: act2Sleep,
    [ACT2_TRAVEL_SCRIPT]: act2Travel,
    ...ACT2_D1_SCRIPTS,
  },
};
