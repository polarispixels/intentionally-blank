// Act I, room 1 — assembled `WorldDef`. The vertical slice: the opening
// room and the landing beyond its door, playable, wired, and
// `validate`-clean.

import type { WorldDef } from '../../../engine/world';
import { RESPONSES } from '../../responses';
import { ACT1_CLUES, ACT1_FLAGS, ACT1_MEMORIES } from './knowledge';
import { landingRoom } from './landing';
import { ACT1_OBJECTS } from './objects/index';
import { ACT1_RESPONSES } from './responses';
import { openingSeenEvent, yourRoom } from './room';
import { ACT1_VERBS } from './verbs';
import { EVT_OPENING_SEEN, LANDING, YOUR_ROOM } from './ids';

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
  rooms: { [YOUR_ROOM]: yourRoom, [LANDING]: landingRoom },
  objects: ACT1_OBJECTS,
  verbs: ACT1_VERBS,
  events: { [EVT_OPENING_SEEN]: openingSeenEvent },
  clues: ACT1_CLUES,
  memories: ACT1_MEMORIES,
  responses: { ...RESPONSES, ...ACT1_RESPONSES },
};
