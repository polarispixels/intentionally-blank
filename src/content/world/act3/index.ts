// Act III ("Heat Doesn't Lie") — `WorldSlice` export.
//
// Filled wave by wave: D3 (the facility surface), D4 (the descent — S1,
// tunnel, S5, chase), D5 (Sublevel 6, the Act III boundary), per the Stage
// D plan §1/§2. `game.ts` spreads this into the assembled `WORLD` alongside
// `ACT1_SLICE` and `ACT2_SLICE`; a duplicate id in any keyed table throws
// at assembly time, so this slice growing in later waves is caught
// immediately if it collides with Act I or Act II.
//
// D3 is three concurrent tasks landing in this same file: task A (travel,
// the Perimeter Road & Gatehouse, P16, the truck's toolbox), task B (the
// Lobby, Data Hall A, Nolan's work layer), task C (this task — the Cooling
// Plant, Corridor B4, the elevator, the boundary). Task C wires its own
// rooms/objects/scripts here alongside task B's (already landed) and an
// overlay stand-in for task A's Perimeter Road (its own room file had not
// landed as of this edit — see this task's own report).
//
// `import type` only, below — no runtime dependency on `game.ts`, so this
// file cannot be part of any import cycle with it.
import type { WorldSlice } from '../game';
import type { HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { RoomId } from '../../../engine/ids';
import { ACT3_CLUES, ACT3_D3B_CLUES, ACT3_D3B_FLAGS, ACT3_FLAGS, ACT3_MEMORIES, ACT3_PUZZLES } from './knowledge';
import { ACT3_D3C_CLUES, ACT3_D3C_FLAGS, ACT3_D3C_MEMORIES, ACT3_D3C_PUZZLES, ACT3_D3C_QUESTIONS } from './knowledge';
import { ACT3_D4_FLAGS, ACT3_D4_QUESTIONS, ACT3_D5_FLAGS, ACT3_D5_QUESTIONS } from './knowledge';
// D4 task B — S1's own clues (§8.6, §12.2).
import { ACT3_D4B_CLUES } from './knowledge';
// --- D4 builders: add your own imports below this line (Edit tool only) ---
// D4 task D — the Pipe Chase (§11-§13).
import { ACT3_D4_PUZZLES, ACT3_D4_TASK_D_FLAGS } from './knowledge';
import { ACT3_PIPE_CHASE, ACT3_S1_MECHANICAL_GALLERY, ACT3_S5_REACTOR_INTERFACE } from './ids';
import { pipeChaseRoom } from './pipeChase';
import { ACT3_PIPE_CHASE_OBJECTS } from './objects/pipeChase';
// D4 task B — S1 Mechanical Gallery (§7.3, §8, §12).
import { s1MechanicalGalleryRoom } from './s1MechanicalGallery';
import { ACT3_S1_MECHANICAL_GALLERY_OBJECTS } from './objects/s1MechanicalGallery';
// D4 task C — S5 Reactor Interface, the interlock death, and the
// checkpoint (§9, §10, §21).
import { ACT3_D4C_CLUES, ACT3_D4C_FLAGS } from './knowledge';
import { s5ReactorInterfaceRoom } from './s5ReactorInterface';
import { ACT3_S5_OBJECTS } from './objects/s5ReactorInterface';
import { act3InterlockDeath, act3ReadClock } from './scripts';
import { ACT3_INTERLOCK_DEATH_SCRIPT, ACT3_READ_CLOCK_SCRIPT } from './ids';
import { ACT3_DATA_HALL_A, ACT3_LOBBY, ACT3_COOLING_PLANT, ACT3_CORRIDOR_B4, ACT3_PERIMETER_ROAD, ACT3_INSIDE } from './ids';
import { lobbyRoom } from './lobby';
import { dataHallARoom } from './dataHallA';
import { ACT3_LOBBY_OBJECTS, ACT3_LOBBY_READER_OPENS_EVENT } from './objects/lobby';
import { ACT3_DATA_HALL_A_OBJECTS } from './objects/dataHallA';
import { ACT3_VERBS } from './verbs';
import { coolingPlantRoom } from './coolingPlant';
import { corridorB4Room } from './corridorB4';
import { ACT3_COOLING_PLANT_EXTRA_OBJECTS, ACT3_COOLING_PLANT_OBJECTS } from './objects/coolingPlant';
import { ACT3_CORRIDOR_B4_OBJECTS } from './objects/corridorB4';
import { elevatorObjects } from './elevator';
import { act3ElevatorRide, act3ReaderB4 } from './scripts';
import { ACT3_ELEVATOR_RIDE_SCRIPT, ACT3_READER_B4_SCRIPT } from './ids';
import { SLEEP } from '../act1/verbs';
import {
  V_ACT2_WAIT_UNTIL_AFTERNOON,
  V_ACT2_WAIT_UNTIL_EVENING,
  V_ACT2_WAIT_UNTIL_MORNING,
  V_ACT2_WAIT_UNTIL_NIGHT,
} from '../act2/ids';
// D4 task A — the way under: the tunnel mouth and the Service Tunnel
// (register 90: two rooms, revising §18 q6), their objects, three reactive
// `EventDef`s (the approach gate, the descent gate, the match tick), and
// this task's own flags/clues/verbs (§3-§7, §12.4, §21).
import { ACT3_D4_TASK_A_CLUES, ACT3_D4_TASK_A_FLAGS } from './knowledge';
import { ACT3_D4_TASK_A_VERBS } from './verbs';
import { tunnelMouthRoom } from './tunnelMouth';
import { serviceTunnelRoom } from './serviceTunnel';
import { ACT3_TUNNEL_APPROACH_GATE_SYNC_EVENT, ACT3_TUNNEL_DESCENT_GATE_SYNC_EVENT, ACT3_TUNNEL_MOUTH_EXTRA_OBJECTS, ACT3_TUNNEL_MOUTH_OBJECTS } from './objects/tunnelMouth';
import { ACT3_MATCH_TICK_EVENT, ACT3_SERVICE_TUNNEL_EXTRA_OBJECTS, ACT3_SERVICE_TUNNEL_OBJECTS } from './objects/serviceTunnel';
import { ACT3_SERVICE_TUNNEL, ACT3_TUNNEL_MOUTH } from './ids';

// --- D5 task H ---
// The Custodian's rounds, the four spotted events, the alarm's reset, and
// Dad's S5 push (D5 prose doc §18-§20, §39). The schedule itself is
// `act2/custodian.ts`'s own edit — no import needed here for it (an NPC's
// schedule isn't part of a `WorldSlice`'s own keyed tables; `act2/index.ts`
// already registers `custodian`/`dad` as NPCs and this task edited their
// definitions in place).
import { ACT3_D5_TASK_H_CLUES, ACT3_D5_TASK_H_FLAGS } from './knowledge';
import { ACT3_D5_TASK_H_VERBS } from './verbs';
import {
  ACT3_DAD_PUSH_S5_EVENT,
  ACT3_EV_PASSED_EVENT,
  ACT3_EV_SPOTTED_BAY_EVENT,
  ACT3_EV_SPOTTED_CHASE_EVENT,
  ACT3_EV_SPOTTED_HUB_EVENT,
  ACT3_EV_SPOTTED_S5_EVENT,
  ACT3_ALARM_RESET_EVENT,
  act3AlarmPull,
  act3AlarmReset,
} from './events';
import { ACT3_ALARM_PULL_SCRIPT, ACT3_ALARM_RESET_SCRIPT } from './ids';

// --- D5 task F ---
// The S6 Maintenance Bay (D5 prose doc §3-§17, §39, §40): the room itself,
// its 12 objects, the clue/puzzle/memory definitions this task owns
// (`knowledge.ts`), and the Bay's own wall-clock script.
import { ACT3_D5_TASK_F_CLUES, ACT3_D5_TASK_F_FLAGS, ACT3_D5_TASK_F_MEMORIES, ACT3_D5_TASK_F_PUZZLES } from './knowledge';
import { ACT3_D5_TASK_F_VERBS } from './verbs';
import { s6MaintenanceBayRoom } from './s6MaintenanceBay';
import { ACT3_S6_MAINTENANCE_BAY_OBJECTS } from './objects/s6MaintenanceBay';
import { act3ReadBayClock } from './scripts';
import { ACT3_READ_BAY_CLOCK_SCRIPT, ACT3_S6_MAINTENANCE_BAY } from './ids';

// --- D5 task G ---
// The S6 Archive Hub (D5 prose doc §21-§31, §39, §40): the room itself,
// its objects (the terminal + screen sub-part, ledger, load graph, queue,
// gate frames, root door, the boundary's one gate object), the login and
// ledger-search prompt scripts, and this task's own clue/puzzle/memory
// definitions (`knowledge.ts`).
import { ACT3_D5_TASK_G_CLUES, ACT3_D5_TASK_G_FLAGS, ACT3_D5_TASK_G_MEMORIES, ACT3_D5_TASK_G_PUZZLES } from './knowledge';
import { ACT3_D5_TASK_G_VERBS } from './verbs';
// E0 task K (§16, §18, §31) — the ledger's numeral fixed phrases and SELECT PROFILE.
import { ACT4_E0_TASK_K_VERBS } from './verbs';
import { s6ArchiveHubRoom } from './s6ArchiveHub';
import { ACT3_S6_ARCHIVE_HUB_OBJECTS } from './objects/s6ArchiveHub';
import { act3HubLoginOpen, act3HubLoginRespond, act3LedgerSearchOpen, act3LedgerSearchRespond } from './scripts';
import {
  ACT3_HUB_LOGIN_OPEN_SCRIPT,
  ACT3_HUB_LOGIN_PROMPT_ID,
  ACT3_HUB_LOGIN_SCRIPT,
  ACT3_LEDGER_SEARCH_OPEN_SCRIPT,
  ACT3_LEDGER_SEARCH_PROMPT_ID,
  ACT3_LEDGER_SEARCH_RESPOND_SCRIPT,
  ACT3_S6_ARCHIVE_HUB,
} from './ids';
import type { ScriptId } from '../../../engine/ids';

// ---------------------------------------------------------------------------
// D3-A — task A's own Perimeter Road & Gatehouse room/objects/travel script
// have now landed (`perimeterRoad.ts`, `objects/perimeterRoad.ts`,
// `objects/truck.ts`, `scripts.ts`'s own `act3RamFence`); task C's own
// overlay stub (this file's earlier revision, per that task's own report)
// is replaced here with the real room.
// ---------------------------------------------------------------------------

import { perimeterRoadRoom } from './perimeterRoad';
import { ACT3_PERIMETER_ROAD_OBJECTS } from './objects/perimeterRoad';
import { ACT3_TRUCK_OBJECTS } from './objects/truck';
import { act3RamFence } from './scripts';
import { ACT3_RAM_FENCE_SCRIPT } from './ids';

// ---------------------------------------------------------------------------
// D3-C — §14.3's pass-time refusal: one `SLEEP`/`WAIT UNTIL <phase>` rule,
// `{ flag: act3_inside }`, prepended ahead of each room's own handlers (same
// loop idiom `act2/index.ts` uses for its own WAIT UNTIL/SLEEP wiring) so a
// room's own handlers still answer once the refusal's `when` no longer
// holds. Looped over every D3 room registered as of this edit, task A's/B's
// included; task A's own Perimeter Road is looped in via the overlay above
// so it isn't left out once the real room replaces it.
// ---------------------------------------------------------------------------

const PASS_TIME_REFUSAL_TEXT =
  'Not in here. You could sit down — the lobby has a bench and the plant has a warm step — but there is no version of the next few hours that you are prepared to spend unconscious inside this fence.';

const passTimeRefusalHandler: HandlerDef = {
  verbs: [SLEEP, V_ACT2_WAIT_UNTIL_MORNING, V_ACT2_WAIT_UNTIL_AFTERNOON, V_ACT2_WAIT_UNTIL_EVENING, V_ACT2_WAIT_UNTIL_NIGHT],
  when: { flag: ACT3_INSIDE },
  effects: [{ say: PASS_TIME_REFUSAL_TEXT }],
};

const D3_ROOMS: { id: RoomId; room: RoomDefSlice }[] = [
  { id: ACT3_PERIMETER_ROAD, room: perimeterRoadRoom },
  { id: ACT3_LOBBY, room: lobbyRoom },
  { id: ACT3_DATA_HALL_A, room: dataHallARoom },
  { id: ACT3_COOLING_PLANT, room: coolingPlantRoom },
  { id: ACT3_CORRIDOR_B4, room: corridorB4Room },
];

for (const entry of D3_ROOMS) {
  entry.room.handlers = [passTimeRefusalHandler, ...(entry.room.handlers ?? [])];
}

export const ACT3_SLICE: WorldSlice = {
  flags: {
    ...ACT3_FLAGS,
    ...ACT3_D3B_FLAGS,
    ...ACT3_D3C_FLAGS,
    ...ACT3_D4_FLAGS,
    ...ACT3_D5_FLAGS,
    ...ACT3_D4_TASK_D_FLAGS,
    ...ACT3_D4C_FLAGS,
    ...ACT3_D4_TASK_A_FLAGS,
    ...ACT3_D5_TASK_H_FLAGS,
    ...ACT3_D5_TASK_F_FLAGS,
    ...ACT3_D5_TASK_G_FLAGS,
  },
  clues: {
    ...ACT3_CLUES,
    ...ACT3_D3B_CLUES,
    ...ACT3_D3C_CLUES,
    ...ACT3_D4B_CLUES,
    ...ACT3_D4C_CLUES,
    ...ACT3_D4_TASK_A_CLUES,
    ...ACT3_D5_TASK_H_CLUES,
    ...ACT3_D5_TASK_F_CLUES,
    ...ACT3_D5_TASK_G_CLUES,
  },
  questions: { ...ACT3_D3C_QUESTIONS, ...ACT3_D4_QUESTIONS, ...ACT3_D5_QUESTIONS },
  puzzles: { ...ACT3_PUZZLES, ...ACT3_D3C_PUZZLES, ...ACT3_D4_PUZZLES, ...ACT3_D5_TASK_F_PUZZLES, ...ACT3_D5_TASK_G_PUZZLES },
  memories: { ...ACT3_MEMORIES, ...ACT3_D3C_MEMORIES, ...ACT3_D5_TASK_F_MEMORIES, ...ACT3_D5_TASK_G_MEMORIES },
  verbs: { ...ACT3_VERBS, ...ACT3_D4_TASK_A_VERBS, ...ACT3_D5_TASK_H_VERBS, ...ACT3_D5_TASK_F_VERBS, ...ACT3_D5_TASK_G_VERBS, ...ACT4_E0_TASK_K_VERBS },
  rooms: {
    [ACT3_LOBBY]: lobbyRoom,
    [ACT3_DATA_HALL_A]: dataHallARoom,
    [ACT3_COOLING_PLANT]: coolingPlantRoom,
    [ACT3_CORRIDOR_B4]: corridorB4Room,
    [ACT3_PERIMETER_ROAD]: perimeterRoadRoom,
    // D4 task D:
    [ACT3_PIPE_CHASE]: pipeChaseRoom,
    // D4 task B:
    [ACT3_S1_MECHANICAL_GALLERY]: s1MechanicalGalleryRoom,
    // D4 task C:
    [ACT3_S5_REACTOR_INTERFACE]: s5ReactorInterfaceRoom,
    // D4 task A:
    [ACT3_TUNNEL_MOUTH]: tunnelMouthRoom,
    [ACT3_SERVICE_TUNNEL]: serviceTunnelRoom,
    // D5 task F:
    [ACT3_S6_MAINTENANCE_BAY]: s6MaintenanceBayRoom,
    // D5 task G:
    [ACT3_S6_ARCHIVE_HUB]: s6ArchiveHubRoom,
  },
  objects: {
    ...ACT3_LOBBY_OBJECTS,
    ...ACT3_DATA_HALL_A_OBJECTS,
    ...ACT3_COOLING_PLANT_OBJECTS,
    ...ACT3_COOLING_PLANT_EXTRA_OBJECTS,
    ...ACT3_CORRIDOR_B4_OBJECTS,
    // D4 task D note: `elevatorObjects` gained two required params
    // (`s1Room`/`s5Room`, task B's own D4 §12.1 amendment to `elevator.ts`)
    // — this call site (in this shared `index.ts`) was still passing only
    // the original two as of this edit, which left the S1/S5 lift
    // instances' own objects registered with `location: undefined` and
    // broke `scope()` (and therefore every `say()` in every act3 room, not
    // just this task's own) game-wide. Not this task's own bug — task B's
    // own integration gap in a shared file — but fixed here since it
    // blocked this task's own `npm test` run entirely; flagged in this
    // task's report.
    ...elevatorObjects(ACT3_COOLING_PLANT, ACT3_CORRIDOR_B4, ACT3_S1_MECHANICAL_GALLERY, ACT3_S5_REACTOR_INTERFACE),
    ...ACT3_PERIMETER_ROAD_OBJECTS,
    ...ACT3_TRUCK_OBJECTS,
    // D4 task D:
    ...ACT3_PIPE_CHASE_OBJECTS,
    // D4 task B:
    ...ACT3_S1_MECHANICAL_GALLERY_OBJECTS,
    // D4 task C:
    ...ACT3_S5_OBJECTS,
    // D4 task A:
    ...ACT3_TUNNEL_MOUTH_OBJECTS,
    ...ACT3_TUNNEL_MOUTH_EXTRA_OBJECTS,
    ...ACT3_SERVICE_TUNNEL_OBJECTS,
    ...ACT3_SERVICE_TUNNEL_EXTRA_OBJECTS,
    // D5 task F:
    ...ACT3_S6_MAINTENANCE_BAY_OBJECTS,
    // D5 task G:
    ...ACT3_S6_ARCHIVE_HUB_OBJECTS,
  },
  events: {
    [ACT3_LOBBY_READER_OPENS_EVENT.id]: ACT3_LOBBY_READER_OPENS_EVENT,
    // D4 task A: the approach gate's reactive sync, the descent gate's own, and the two-turn match's tick.
    [ACT3_TUNNEL_APPROACH_GATE_SYNC_EVENT.id]: ACT3_TUNNEL_APPROACH_GATE_SYNC_EVENT,
    [ACT3_TUNNEL_DESCENT_GATE_SYNC_EVENT.id]: ACT3_TUNNEL_DESCENT_GATE_SYNC_EVENT,
    [ACT3_MATCH_TICK_EVENT.id]: ACT3_MATCH_TICK_EVENT,
    // D5 task H: the four spotted events, the coveralls' nod, Dad's S5 push, the alarm's automatic reset.
    [ACT3_EV_SPOTTED_BAY_EVENT.id]: ACT3_EV_SPOTTED_BAY_EVENT,
    [ACT3_EV_SPOTTED_HUB_EVENT.id]: ACT3_EV_SPOTTED_HUB_EVENT,
    [ACT3_EV_SPOTTED_S5_EVENT.id]: ACT3_EV_SPOTTED_S5_EVENT,
    [ACT3_EV_SPOTTED_CHASE_EVENT.id]: ACT3_EV_SPOTTED_CHASE_EVENT,
    [ACT3_EV_PASSED_EVENT.id]: ACT3_EV_PASSED_EVENT,
    [ACT3_DAD_PUSH_S5_EVENT.id]: ACT3_DAD_PUSH_S5_EVENT,
    [ACT3_ALARM_RESET_EVENT.id]: ACT3_ALARM_RESET_EVENT,
  },
  scripts: {
    [ACT3_ELEVATOR_RIDE_SCRIPT]: act3ElevatorRide,
    [ACT3_READER_B4_SCRIPT]: act3ReaderB4,
    [ACT3_RAM_FENCE_SCRIPT]: act3RamFence,
    // D4 task C:
    [ACT3_INTERLOCK_DEATH_SCRIPT]: act3InterlockDeath,
    [ACT3_READ_CLOCK_SCRIPT]: act3ReadClock,
    // D5 task H: the alarm's pull/reset scripts.
    [ACT3_ALARM_PULL_SCRIPT]: act3AlarmPull,
    [ACT3_ALARM_RESET_SCRIPT]: act3AlarmReset,
    // D5 task F:
    [ACT3_READ_BAY_CLOCK_SCRIPT]: act3ReadBayClock,
    // D5 task G: the Hub's own login prompt (open + respond) and the
    // ledger's own bare-SEARCH prompt (open + respond).
    [ACT3_HUB_LOGIN_OPEN_SCRIPT]: act3HubLoginOpen,
    [ACT3_HUB_LOGIN_SCRIPT]: act3HubLoginRespond,
    [ACT3_LEDGER_SEARCH_OPEN_SCRIPT]: act3LedgerSearchOpen,
    [ACT3_LEDGER_SEARCH_RESPOND_SCRIPT]: act3LedgerSearchRespond,
  },
};

/**
 * `src/cli/repl.ts`'s `--world` module convention (§18's PROMPT ROUND-TRIP
 * gap) — prompt id -> the script that closes it, same idiom as
 * `ACT2_CENSOR_PROMPT_SCRIPTS` (`act2/index.ts`). Wired into
 * `src/content/world/game.ts`'s own `PROMPT_SCRIPTS` export by that file
 * (a one-line merge; the CLI and `App.vue` already spread that map).
 */
export const ACT3_HUB_PROMPT_SCRIPTS: Record<string, ScriptId> = {
  [ACT3_HUB_LOGIN_PROMPT_ID]: ACT3_HUB_LOGIN_SCRIPT,
  [ACT3_LEDGER_SEARCH_PROMPT_ID]: ACT3_LEDGER_SEARCH_RESPOND_SCRIPT,
};
