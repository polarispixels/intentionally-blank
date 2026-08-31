// Act I, room 1 — assembled `WorldDef`. The vertical slice: the opening
// room and the landing beyond its door, playable, wired, and
// `validate`-clean.

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
import { marlow } from './marlow';
import { whitlock } from './whitlock';
import { ACT1_OBJECTS } from './objects/index';
import { FRONT_DESK_OBJECTS } from './objects/frontDesk';
import { MAIN_STREET_OBJECTS } from './objects/mainStreet';
import { POST_OFFICE_OBJECTS } from './objects/postOffice';
import { GENERAL_STORE_OBJECTS } from './objects/generalStore';
import { SHERIFF_OFFICE_OBJECTS } from './objects/sheriffOffice';
import { ACT1_RESPONSES } from './responses';
import { yourRoom } from './room';
import { ACT1_VERBS } from './verbs';
import { FRONT_DESK, GENERAL_STORE, LANDING, MAIN_STREET, MARLOW, POST_OFFICE, SHERIFF_OFFICE, WHITLOCK, YOUR_ROOM } from './ids';

export const WORLD: WorldDef = {
  meta: {
    // 07:00, per the worked-example convention (§2.10) of a morning scene;
    // nothing in this room reads `clockPhase`.
    phases: { morning: 420, afternoon: 720, evening: 1080, night: 1320 },
    weekLength: 7,
    startRoom: YOUR_ROOM,
    minutesPerTurn: 1,
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
  },
  objects: { ...ACT1_OBJECTS, ...FRONT_DESK_OBJECTS, ...MAIN_STREET_OBJECTS, ...POST_OFFICE_OBJECTS, ...GENERAL_STORE_OBJECTS, ...SHERIFF_OFFICE_OBJECTS },
  npcs: { [MARLOW]: marlow, [WHITLOCK]: whitlock },
  verbs: ACT1_VERBS,
  clues: ACT1_CLUES,
  memories: ACT1_MEMORIES,
  questions: ACT1_QUESTIONS,
  puzzles: ACT1_PUZZLES,
  responses: { ...RESPONSES, ...ACT1_RESPONSES },
  scripts: RESTART_SCRIPTS,
};
