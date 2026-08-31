// Act IV — the slice (`docs/superpowers/specs/2026-09-16-stage-e-plan.md`
// §0.3). Assembled into `WORLD` by `../game.ts` after the Act III slice.
// E0 adds no room and no exit (E0 prose §31.4); its content lives on Act I–III
// objects/NPCs (amended in place, the established idiom) plus the events,
// scripts and objects the E0 builders register here.

import type { WorldSlice } from '../game';
import { ACT4_E0_FLAGS, ACT4_E0_QUESTIONS } from './knowledge';
// --- E0 builders: add your own imports below this line (Edit tool only) ---
// E0 task K — the machine (§16-§18, §22, §31).
import { ACT4_E0_TASK_K_CLUES } from './knowledge';
import { ACT4_PROFILE, ACT4_PROFILE_SCREEN_SCRIPT } from './ids';
import { act4Profile } from '../act3/objects/s6ArchiveHub';
import { act4ProfileScreen } from '../act3/scripts';
// E0 task I — the town before the visit (§3-§9, §27, §31, §32).
import { ACT4_E0_TASK_I_CLUES } from './knowledge';
import { ACT4_EV_CREWS_VISIBLE_EVENT, ACT4_EV_START_EVENT } from './events';
import { act4CrewsVisibility, act4SetVisitDay } from './scripts';
import { ACT4_CREWS_VISIBILITY_SCRIPT, ACT4_SET_VISIT_DAY_SCRIPT, EVENT_ACT4_EV_CREWS_VISIBLE, EVENT_ACT4_EV_START } from './ids';
// E0 task J — Whitlock/the cage/the bag/the case notes/Jack/Dad's breath/
// the numerals letter and reply/P21 (§10-§15, §19-§21, §23, §27, §31).
import { ACT4_J_CLUES, ACT4_J_PUZZLES } from './knowledge';
import { ACT4_EV_DAD_BREATH } from './ids';
import { ACT4_J_SHERIFF_OFFICE_OBJECTS } from '../act1/objects/sheriffOffice';
import { ACT4_J_CENSOR_OBJECTS } from '../act2/objects/censor';
import { ACT4_EV_DAD_BREATH_EVENT } from '../act2/dad';

export const ACT4_SLICE: WorldSlice = {
  flags: { ...ACT4_E0_FLAGS },
  clues: { ...ACT4_E0_TASK_K_CLUES, ...ACT4_E0_TASK_I_CLUES, ...ACT4_J_CLUES },
  questions: { ...ACT4_E0_QUESTIONS },
  puzzles: { ...ACT4_J_PUZZLES },
  memories: {},
  verbs: {},
  rooms: {},
  objects: { [ACT4_PROFILE]: act4Profile, ...ACT4_J_SHERIFF_OFFICE_OBJECTS, ...ACT4_J_CENSOR_OBJECTS },
  events: {
    [EVENT_ACT4_EV_START]: ACT4_EV_START_EVENT,
    [EVENT_ACT4_EV_CREWS_VISIBLE]: ACT4_EV_CREWS_VISIBLE_EVENT,
    [ACT4_EV_DAD_BREATH]: ACT4_EV_DAD_BREATH_EVENT,
  },
  scripts: {
    [ACT4_PROFILE_SCREEN_SCRIPT]: act4ProfileScreen,
    [ACT4_SET_VISIT_DAY_SCRIPT]: act4SetVisitDay,
    [ACT4_CREWS_VISIBILITY_SCRIPT]: act4CrewsVisibility,
  },
};
