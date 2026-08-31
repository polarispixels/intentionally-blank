// Act I, room 1 — assembled `WorldDef` slice. The vertical slice: the
// opening room and the landing beyond its door, playable, wired, and
// `validate`-clean.
//
// Lives in its own file (rather than inline in `world.ts`) so `game.ts` can
// import this value without creating an import cycle: `world.ts` re-exports
// `WORLD` from `../game`, and `game.ts` needs `ACT1_SLICE` to build it — if
// both lived in `world.ts`, that file would import `game.ts` (for the
// re-export) while `game.ts` imported back from it (for the slice), and
// whichever module a caller reached first would find the other's export
// still uninitialized (ADR 0011 item 3 / Stage D E3's own warning). Splitting
// the slice out here makes the dependency one-directional: `game.ts` imports
// `slice.ts`, and `world.ts` imports both `slice.ts` and `game.ts`, but
// nothing imports back into `world.ts`.

import type { WorldDef } from '../../../engine/world';
import { RESPONSES } from '../../responses';
import { RESTART_SCRIPTS } from '../../scripts';
import { ACT1_CLUES, ACT1_FLAGS, ACT1_MEMORIES, ACT1_PUZZLES, ACT1_QUESTIONS } from './knowledge';
import { landingRoom } from './landing';
import { frontDeskRoom } from './frontDesk';
import { mainStreetRoom } from './mainStreet';
import { postOfficeRoom } from './postOffice';
import { generalStoreRoom } from './generalStore';
import { sheriffOfficeRoom } from './sheriffOffice';
import { countyLibraryRoom } from './countyLibrary';
import { sundownDinerRoom } from './sundownDiner';
import { townEdgeRoom } from './townEdge';
import { jacksMotelRoom } from './jacksMotel';
import { nolansYardRoom, NOLANS_YARD_EVENTS } from './nolansYard';
import { marlow } from './marlow';
import { whitlock } from './whitlock';
import { pearl } from './pearl';
import { jack } from './jack';
import { ACT1_OBJECTS } from './objects/index';
import { FRONT_DESK_OBJECTS } from './objects/frontDesk';
import { MAIN_STREET_OBJECTS } from './objects/mainStreet';
import { POST_OFFICE_OBJECTS } from './objects/postOffice';
import { GENERAL_STORE_OBJECTS } from './objects/generalStore';
import { SHERIFF_OFFICE_OBJECTS } from './objects/sheriffOffice';
import { COUNTY_LIBRARY_OBJECTS } from './objects/countyLibrary';
import { SUNDOWN_DINER_OBJECTS } from './objects/sundownDiner';
import { TOWN_EDGE_OBJECTS } from './objects/townEdge';
import { JACKS_MOTEL_OBJECTS } from './objects/jacksMotel';
import { NOLANS_YARD_OBJECTS } from './objects/nolansYard';
// The concurrent Close-out task's own objects (`objects/closeOut.ts`) were
// authored but not yet merged in here when this task's own edits landed —
// wired in as a mechanical completion (this task's report), not new
// authoring: the export already existed, ready, under its own file.
import { CLOSE_OUT_OBJECTS } from './objects/closeOut';
import { ACT1_WAVE5_SCRIPTS } from './scripts';
import { ACT1_RESPONSES } from './responses';
import { yourRoom } from './room';
import { ACT1_VERBS } from './verbs';
import { COUNTY_LIBRARY, FRONT_DESK, GENERAL_STORE, JACK, JACKS_MOTEL, LANDING, MAIN_STREET, MARLOW, NOLANS_YARD, PEARL, POST_OFFICE, SHERIFF_OFFICE, SUNDOWN_DINER, TOWN_EDGE, WHITLOCK, YOUR_ROOM } from './ids';

export const ACT1_SLICE: WorldDef = {
  meta: {
    phases: { morning: 420, afternoon: 720, evening: 1080, night: 1320 },
    weekLength: 7,
    startRoom: YOUR_ROOM,
    minutesPerTurn: 1,
    // 04:20 — the fiction's actual opening hour (ADR 0011, Stage D E1);
    // every Act I NPC is single-posted and no Act I prose reads the clock,
    // so this only fixes what the clock itself reports, not anything
    // player-visible.
    startClock: { day: 1, minute: 260 },
  },
  flags: ACT1_FLAGS,
  rooms: {
    [YOUR_ROOM]: yourRoom,
    [LANDING]: landingRoom,
    [FRONT_DESK]: frontDeskRoom,
    [MAIN_STREET]: mainStreetRoom,
    [POST_OFFICE]: postOfficeRoom,
    [GENERAL_STORE]: generalStoreRoom,
    [SHERIFF_OFFICE]: sheriffOfficeRoom,
    [COUNTY_LIBRARY]: countyLibraryRoom,
    [SUNDOWN_DINER]: sundownDinerRoom,
    [TOWN_EDGE]: townEdgeRoom,
    [JACKS_MOTEL]: jacksMotelRoom,
    [NOLANS_YARD]: nolansYardRoom,
  },
  objects: {
    ...ACT1_OBJECTS,
    ...FRONT_DESK_OBJECTS,
    ...MAIN_STREET_OBJECTS,
    ...POST_OFFICE_OBJECTS,
    ...GENERAL_STORE_OBJECTS,
    ...SHERIFF_OFFICE_OBJECTS,
    ...COUNTY_LIBRARY_OBJECTS,
    ...SUNDOWN_DINER_OBJECTS,
    ...TOWN_EDGE_OBJECTS,
    ...JACKS_MOTEL_OBJECTS,
    ...NOLANS_YARD_OBJECTS,
    ...CLOSE_OUT_OBJECTS,
  },
  npcs: { [MARLOW]: marlow, [WHITLOCK]: whitlock, [PEARL]: pearl, [JACK]: jack },
  verbs: ACT1_VERBS,
  events: { ...NOLANS_YARD_EVENTS },
  clues: ACT1_CLUES,
  memories: ACT1_MEMORIES,
  questions: ACT1_QUESTIONS,
  puzzles: ACT1_PUZZLES,
  responses: { ...RESPONSES, ...ACT1_RESPONSES },
  scripts: { ...RESTART_SCRIPTS, ...ACT1_WAVE5_SCRIPTS },
};
