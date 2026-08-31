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
import type { RoomId, ScriptId } from '../../../engine/ids';
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
// D2-A — Dad on the USB (task A). Own heading; see `./ids.ts`'s own D2-A
// section for the concurrent-builder note this mirrors.
// ---------------------------------------------------------------------------

import { act2DadBoot, ACT2_D2A_CLUES, ACT2_D2A_FLAGS, ACT2_DAD_MANNERISM_EVENT, ACT2_P12_BOOT_DAD_PUZZLE, ACT2_Q_BOOT_USB_DEF, dad } from './dad';
import { ACT2_RIG_APPEARS_EVENT, ACT2_RIG_OBJECTS } from './objects/rig';
import { ACT2_GENERAL_STORE_D2_OBJECTS, ACT2_SHOP_CLOSED_EVENT, ACT2_SHOP_OPEN_EVENT } from '../act1/objects/generalStore';
import { ACT2_DAD, ACT2_DAD_BOOT_SCRIPT, ACT2_P12_BOOT_DAD, ACT2_Q_BOOT_USB } from './ids';

// ---------------------------------------------------------------------------
// D2-B — the censor (the letter, the fold, the three replies, the ruler)
// and the County Library's two reels. Own heading; the reels themselves are
// wired into `act1/objects/countyLibrary.ts`'s own `COUNTY_LIBRARY_OBJECTS`
// (already merged into `ACT1_SLICE` — nothing further needed here for
// them). `ACT2_KNOWS_TUNNEL_MOUTH`/`ACT2_DAD_TOLD_HEARING`/
// `ACT2_CLUE_SERVICE_TUNNEL` are declared in task A's own D2-A section of
// `ids.ts` (this task reads, never writes, `act2_dad_told_hearing`; the
// reel's own map page also sets `act2_knows_tunnel_mouth`) but were not yet
// registered in this file's own `flags`/`clues` tables when this task
// landed — registered below so `validate()` doesn't report an
// unknown-flag/clue reference; harmless if task A's own dad.ts also
// registers the same three (duplicate object-literal keys, not a compile
// error — reconcile on merge, matching this file's own precedent above).
// ---------------------------------------------------------------------------

import {
  ACT2_CENSOR_OBJECTS,
  act2ComposeOpen,
  act2ComposeRespond,
  act2DeliverReply,
  ACT2_ELI_REPLY_EVENT,
  act2PostLetter,
} from './objects/censor';
import {
  ACT2_AWAITING_REPLY,
  ACT2_CLUE_CENSOR,
  ACT2_CLUE_HIDDEN_LOAD,
  ACT2_CLUE_REPLY_CAME_FAST,
  ACT2_CLUE_SERVICE_TUNNEL,
  ACT2_CLUE_TRANSCRIPT_CHANGED,
  ACT2_COMPOSE_OPEN_SCRIPT,
  ACT2_COMPOSE_PROMPT_ID,
  ACT2_COMPOSE_RESPOND_SCRIPT,
  ACT2_DELIVER_REPLY_SCRIPT,
  ACT2_ELI_REPLY_DUE,
  ACT2_EXAMINED_ELI_FOLD,
  ACT2_HAS_AUDIT,
  ACT2_LAST_LETTER_FOLDED,
  ACT2_LETTER_STATUS,
  ACT2_MEM_M13,
  ACT2_P13_CENSOR,
  ACT2_P14_MICROFICHE,
  ACT2_POST_LETTER_SCRIPT,
  ACT2_Q_FILM_VS_DATABASE,
  ACT2_Q_REACH_ELI,
  ACT2_RULER_EXAMINED_ONCE,
  EVENT_ACT2_ELI_REPLY,
} from './ids';

const ACT2_CENSOR_FLAGS: WorldSlice['flags'] = {
  [ACT2_LETTER_STATUS]: { default: 'none', doc: "set by act2_post_letter (censorVerdict's own result) — read by act2_deliver_reply" },
  [ACT2_ELI_REPLY_DUE]: { default: false, doc: "the due day (state.clock.day + 1 or +4), set by act2_post_letter — read by the delivery event's onOrAfterDay" },
  [ACT2_AWAITING_REPLY]: { default: false, doc: 'set by posting, cleared by delivery — the event\'s own second when-clause' },
  [ACT2_EXAMINED_ELI_FOLD]: { default: false, doc: 'set by EXAMINE FOLD on any reply — M13\'s trigger' },
  [ACT2_HAS_AUDIT]: { default: false, doc: 'set by READing the audit reply — P13 solvedWhen' },
  [ACT2_LAST_LETTER_FOLDED]: { default: false, doc: "internal wiring: the just-posted letter's own fold state, captured at post time for act2_deliver_reply's own ruler check" },
  [ACT2_RULER_EXAMINED_ONCE]: { default: false, doc: "internal wiring: the origami ruler's own EXAMINE/COUNT CREASES toggle" },
  // ACT2_KNOWS_TUNNEL_MOUTH / ACT2_DAD_TOLD_HEARING: NOT redeclared here —
  // task A's `dad.ts` (`ACT2_D2A_FLAGS`, spread into this file's own
  // `ACT2_SLICE.flags` below) registered both before this task's own edits
  // landed. This task only reads them (the hearing reel's `COMPARE`
  // handler) and additionally sets the tunnel-mouth one (the map page).
};

const ACT2_CENSOR_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT2_CLUE_CENSOR]: {
    title: 'The letter that answered nothing',
    detail:
      "Eli's reply is warm, well written, signed the way he signs things — and answers a specific question about a specific building by asking after everybody and naming nobody. Nothing in it is false. Nothing in it is an answer.",
  },
  [ACT2_CLUE_REPLY_CAME_FAST]: {
    title: 'It came the next day',
    detail:
      'Posted OUT OF TOWN to a man three states off, and the reply was in box 141 the very next morning — too fast for any real letter to have travelled there and an answer to have travelled back.',
  },
  [ACT2_CLUE_HIDDEN_LOAD]: {
    title: 'A second one of these',
    detail:
      "Six years of Eli's own interconnection filings, month after month, show the same gap between the contracted draw and the metered one — flat, constant, and no smaller at night. About the size of a second facility.",
  },
  [ACT2_CLUE_TRANSCRIPT_CHANGED]: {
    title: 'Satisfied about the aquifer',
    detail:
      "The county's own printed transcript has the senator satisfied about the water table. Dad has said the opposite for thirty years — and the paper's own date is the very next morning, before anybody could have gone back and changed a word.",
  },
  // ACT2_CLUE_SERVICE_TUNNEL: NOT redeclared here — task A's `dad.ts`
  // (`ACT2_D2A_CLUES`, spread into `ACT2_SLICE.clues` below) already
  // registered it before this task's own edits landed. This task's own
  // construction reel (`act1/objects/countyLibrary.ts`) grants the same
  // clue id — a second, idempotent route to the same discovery.
};

const ACT2_CENSOR_QUESTIONS: NonNullable<WorldSlice['questions']> = {
  [ACT2_Q_REACH_ELI]: {
    text: "Eli won't answer a straight question about the plant. Is there a way to reach him the censor can't touch?",
    openWhen: { clue: ACT2_CLUE_CENSOR },
    answerWhen: { flag: ACT2_HAS_AUDIT },
    answer:
      "Ask without the names the system flags, and Eli answers in full — the family's own idiom, not the plant's, gets past whatever is reading the mail.",
  },
  [ACT2_Q_FILM_VS_DATABASE]: {
    text: "The library still keeps its own record of the plant's construction on film, while the county's own terminal insists there is nothing before 2036. Which one is the real archive?",
    openWhen: { clue: ACT2_CLUE_SERVICE_TUNNEL },
    // No answerWhen in this build — Stage E, same ruling as ACT2_Q_HOW_WAS_IT_HERE.
  },
};

const ACT2_CENSOR_PUZZLES: NonNullable<WorldSlice['puzzles']> = {
  [ACT2_P13_CENSOR]: {
    id: ACT2_P13_CENSOR,
    name: 'The censor',
    question: ACT2_Q_REACH_ELI,
    solvedWhen: { flag: ACT2_HAS_AUDIT },
    solutions: [
      { id: 'idiom', class: 'analytical', note: 'Write plainly, in the family idiom, and avoid every word the notebook itself already flagged as dangerous.' },
      { id: 'jack_told', class: 'social', note: "Take Jack's word for how Eli actually writes and signs things, so a rewritten reply reads as wrong the moment it arrives." },
      { id: 'dad_told', class: 'direct', note: "Take Dad's word for what a censor watches for, and write around it on the first try." },
    ],
    hints: [
      'The first letter you write is a test, whether you mean it as one or not — read what comes back as carefully as you wrote what went out.',
      'A hollow, over-friendly reply that answers nothing and comes back suspiciously fast is not bad luck. Something is reading the mail before Eli does.',
      'Naming the wrong thing gets you rewritten; asking the right way gets you an answer. There is no third option, and nobody will ever tell you which words are which.',
      'A family has its own words for things — the ones nothing official would ever print. Write the way you would to a brother, not the way you would to a filing cabinet.',
    ],
  },
  [ACT2_P14_MICROFICHE]: {
    id: ACT2_P14_MICROFICHE,
    name: 'Film or database',
    question: ACT2_Q_FILM_VS_DATABASE,
    solvedWhen: { clue: ACT2_CLUE_SERVICE_TUNNEL },
    solutions: [
      { id: 'reel', class: 'analytical', note: 'THREAD/READ the construction reel (2028–2031) at the County Library — the county paper covered the plant when it was built, on film, long before anything went digital.' },
    ],
    hints: [
      "The county terminal says nothing predates 2036. That is a database's own horizon, not the county's — the county's own newspaper is a great deal older than its own catalogue.",
      'The library keeps its own record of everything on film, filed by year, in the drawer bank against the wall.',
      'THREAD REEL, or READ REEL, on the reader — the drawer marked 2028–2031 has the plant\'s own construction and closing in it.',
    ],
  },
};

const ACT2_CENSOR_MEMORIES: NonNullable<WorldSlice['memories']> = {
  [ACT2_MEM_M13]: {
    title: 'Under The Table',
    lines: [
      'A room with a rail along the front of it and a lot of men behind a bench, and a father up on his feet talking about water.',
      'Under a table at the back, out of everybody\'s way, a boy is asleep on one arm with his mouth open, and while he is asleep his other hand is folding a sheet of paper. Over, under, the corner back on itself, the hard crease along the third.',
      'He does it four times, and four times he wakes up enough to put the finished one on the pile, and the pile is level.',
      'Afterwards somebody says: he was asleep, and somebody else says: he was asleep for the second one too.',
    ],
    trigger: { when: { flag: ACT2_EXAMINED_ELI_FOLD } },
  },
};

// ---------------------------------------------------------------------------
// D2-C — the Friday table, Nolan, the Custodian's town post, Main Street by
// day, the buzz, four memories, and the moved boundary (task C). Own
// heading; see `./ids.ts`'s own D2-C section for the concurrent-builder
// note this mirrors. `custodian` (task A's D1 NPC, amended in place by this
// task's own `custodian.ts`) needs no new import here — the existing
// `import { custodian } from './custodian';` above already resolves to the
// amended module. `ACT2_BOUNDARY_SCRIPT`/`ACT2_D1_SCRIPTS` (`./scripts.ts`)
// likewise needs no new wiring — this task only edited that file's own
// text constants in place, not its exports.
// ---------------------------------------------------------------------------

import { nolan, nolanBadge, ACT2_NOLAN_MET_EVENT } from './nolan';
import { ACT2_D2C_POKER_SCRIPTS, ACT2_P15_PUZZLE, ACT2_POKER_OBJECTS } from './poker';
import { ACT2_D2C_CLUES, ACT2_D2C_FLAGS, ACT2_D2C_MEMORIES, ACT2_D2C_QUESTIONS } from './knowledgeD2C';
import { ACT2_NOLAN, ACT2_NOLAN_BADGE, ACT2_P15_POKER, EVENT_ACT2_MET_NOLAN } from './ids';

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
  flags: { ...ACT2_FLAGS, ...ACT2_D1_FLAGS, ...ACT2_D2A_FLAGS, ...ACT2_CENSOR_FLAGS, ...ACT2_D2C_FLAGS },
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
    ...ACT2_RIG_OBJECTS,
    ...ACT2_GENERAL_STORE_D2_OBJECTS,
    ...ACT2_CENSOR_OBJECTS,
    ...ACT2_POKER_OBJECTS,
    [ACT2_NOLAN_BADGE]: nolanBadge,
  },
  npcs: {
    [ACT2_CUSTODIAN]: custodian,
    [ACT2_DOT]: dot,
    [ACT2_DAD]: dad,
    [ACT2_NOLAN]: nolan,
  },
  events: {
    [EVENT_ACT2_DOT_AGENDA]: ACT2_DOT_AGENDA_EVENT,
    [ACT2_DAD_MANNERISM_EVENT.id]: ACT2_DAD_MANNERISM_EVENT,
    [ACT2_RIG_APPEARS_EVENT.id]: ACT2_RIG_APPEARS_EVENT,
    [ACT2_SHOP_OPEN_EVENT.id]: ACT2_SHOP_OPEN_EVENT,
    [ACT2_SHOP_CLOSED_EVENT.id]: ACT2_SHOP_CLOSED_EVENT,
    [EVENT_ACT2_ELI_REPLY]: ACT2_ELI_REPLY_EVENT,
    [EVENT_ACT2_MET_NOLAN]: ACT2_NOLAN_MET_EVENT,
  },
  clues: { ...ACT2_TRAVEL_CLUES, ...ACT2_D1_CLUES, ...ACT2_D2A_CLUES, ...ACT2_CENSOR_CLUES, ...ACT2_D2C_CLUES },
  memories: { ...ACT2_M2_MEMORIES, ...ACT2_D1_MEMORIES, ...ACT2_CENSOR_MEMORIES, ...ACT2_D2C_MEMORIES },
  questions: { ...ACT2_D1_QUESTIONS, [ACT2_Q_BOOT_USB]: ACT2_Q_BOOT_USB_DEF, ...ACT2_CENSOR_QUESTIONS, ...ACT2_D2C_QUESTIONS },
  puzzles: { ...ACT2_D1_PUZZLES, [ACT2_P12_BOOT_DAD]: ACT2_P12_BOOT_DAD_PUZZLE, ...ACT2_CENSOR_PUZZLES, [ACT2_P15_POKER]: ACT2_P15_PUZZLE },
  scripts: {
    [ACT2_PASS_TIME_SCRIPT]: act2PassTime,
    [ACT2_SLEEP_SCRIPT]: act2Sleep,
    [ACT2_TRAVEL_SCRIPT]: act2Travel,
    [ACT2_DAD_BOOT_SCRIPT]: act2DadBoot,
    [ACT2_COMPOSE_OPEN_SCRIPT]: act2ComposeOpen,
    [ACT2_COMPOSE_RESPOND_SCRIPT]: act2ComposeRespond,
    [ACT2_POST_LETTER_SCRIPT]: act2PostLetter,
    [ACT2_DELIVER_REPLY_SCRIPT]: act2DeliverReply,
    ...ACT2_D1_SCRIPTS,
    ...ACT2_D2C_POKER_SCRIPTS,
  },
};

/**
 * `src/cli/repl.ts`'s `--world` module convention (§18's PROMPT ROUND-TRIP
 * gap) — prompt id → the script that closes it, same idiom as
 * `RESTART_PROMPT_SCRIPTS` (`session.ts`) and `mvp-prologue.ts`'s own
 * `PROMPT_SCRIPTS`. **Not yet wired into `src/content/world/game.ts` or
 * `src/cli/repl.ts`'s default (no `--world`) branch** — see this task's own
 * report: `repl.ts`'s default path hardcodes `PROMPT_SCRIPTS =
 * RESTART_PROMPT_SCRIPTS` and never merges a shipped-game export, so
 * `WRITE LETTER`'s prompt cannot be answered via a bare `npm run play`
 * today. Exported here so the main session can wire it in with a one-line
 * change to each of those two files.
 */
export const ACT2_CENSOR_PROMPT_SCRIPTS: Record<string, ScriptId> = {
  [ACT2_COMPOSE_PROMPT_ID]: ACT2_COMPOSE_RESPOND_SCRIPT,
};
