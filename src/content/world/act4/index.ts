// Act IV — the slice (`docs/superpowers/specs/2026-09-16-stage-e-plan.md`
// §0.3). Assembled into `WORLD` by `../game.ts` after the Act III slice.
// E0 adds no room and no exit (E0 prose §31.4); its content lives on Act I–III
// objects/NPCs (amended in place, the established idiom) plus the events,
// scripts and objects the E0 builders register here.

import type { WorldSlice } from '../game';
import type { ScriptId } from '../../../engine/ids';
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
// E1 task M — Luke, the escort, R16, and the boundary (§11, §12, §20-§23,
// §29, §37, §38).
import { ACT4_E1_TASK_M_CLUES, ACT4_E1_TASK_M_FLAGS } from './knowledge';
import { ACT4_LUKE, ACT4_LUKE_DESCENDS_SCRIPT, ACT4_S5_DOWN_GATE, EVENT_ACT4_LUKE_GONE_MISSED } from './ids';
import { act4LukeDescends, luke } from './luke';
import { ACT4_EV_LUKE_GONE_MISSED_EVENT } from './events';
import { act4S5DownGate } from '../act3/objects/s5ReactorInterface';
// E1 task N — R14's completion: Jack comes down (§24-§27, §33, §37).
// `act1_jack`'s own `NpcDefSlice` is amended in place, in `../act1/jack.ts`
// (the established idiom, E0 task I's own header note above) — no new
// `npcs` entry here. The tunnel-mouth `EventDef` lives with the character
// (`act1/jack.ts`), per `ACT4_EV_DAD_BREATH_EVENT`'s own precedent, above.
import { ACT4_E1_TASK_N_CLUES, ACT4_E1_TASK_N_FLAGS } from './knowledge';
import { ACT4_EV_JACK_MORNING_SCENE_EVENT, ACT4_EV_JACK_RETURNS_EVENT, ACT4_EV_JACK_SEES_EVENT } from './events';
import { ACT4_EV_JACK_TUNNEL_EVENT } from '../act1/jack';
import { ACT4_EV_JACK_TUNNEL, EVENT_ACT4_EV_JACK_MORNING_SCENE, EVENT_ACT4_EV_JACK_RETURNS, EVENT_ACT4_EV_JACK_SEES } from './ids';
// E1 integration builder — §26 fix (main-session ruling, addendum status
// line): the scene moved off `act1_jack`'s own greeting array to a `once`
// `EventDef` here. See `events.ts`'s own comment on
// `ACT4_EV_JACK_MORNING_SCENE_EVENT` for why.
// E1 task L — the Staging Area, the hand-offs, and the visit's machinery
// (§3-§10, §13-§19, §28, §37, §38).
import { ACT4_L_CLUES, ACT4_L_FLAGS, ACT4_L_PUZZLES, ACT4_L_QUESTIONS } from './knowledge';
import { ACT4_L_STAGING_AREA_OBJECTS } from '../act4/objects/stagingArea';
import { stagingAreaRoom } from './stagingArea';
import { ACT4_L_VERBS } from './verbs';
import { act4HandLetter } from './scripts';
import {
  ACT4_HAND_LETTER_SCRIPT,
  ACT4_STAGING_AREA,
  EVENT_ACT4_EV_DETAIL_ARRIVES,
  EVENT_ACT4_EV_OFFICE_REPLY,
  EVENT_ACT4_EV_STAGING_OPENS,
} from './ids';
import { ACT4_EV_DETAIL_ARRIVES_EVENT, ACT4_EV_OFFICE_REPLY_EVENT, ACT4_EV_STAGING_OPENS_EVENT } from './events';

// --- E2 task O ---
// The gate frames, the Escape Chamber, P23, M10, and the boundary
// (`docs/superpowers/specs/2026-09-19-stage-e2-prose.md` §2-§24, §41,
// §47.1, §48, §52, §56, §57).
import { ACT4_O_CLUES, ACT4_O_FLAGS, ACT4_O_MEMORIES, ACT4_O_PUZZLES, ACT4_O_QUESTIONS } from './knowledge';
import { ACT4_O_CHAMBER_OBJECTS, ACT4_O_HUB_OBJECTS } from './objects/escapeChamber';
import { escapeChamberRoom } from './escapeChamber';
import { ACT4_O_VERBS } from './verbs';
import { act4ChamberDoorOpen, act4ChamberPhraseRespond, act4EnterEscape } from './scripts';
import {
  ACT4_CHAMBER_DOOR_OPEN_SCRIPT,
  ACT4_CHAMBER_PHRASE_PROMPT_ID,
  ACT4_CHAMBER_PHRASE_RESPOND_SCRIPT,
  ACT4_ENTER_ESCAPE_SCRIPT,
  ACT4_ESCAPE_CHAMBER,
  EVENT_ACT4_EV_CHAMBER_COMPLETE,
  EVENT_ACT4_EV_CHAMBER_TIMER,
} from './ids';
import {
  ACT4_EV_CHAMBER_ASSIST_COPY_EVENT,
  ACT4_EV_CHAMBER_ASSIST_ORDER_EVENT,
  ACT4_EV_CHAMBER_ASSIST_PHRASE_EVENT,
  ACT4_EV_CHAMBER_COMPLETE_EVENT,
  ACT4_EV_CHAMBER_TIMER_EVENT,
} from './events';

// --- E2 task P ---
// The hab: the Galley, the Dome, Sissy, and M11 (`docs/superpowers/specs/
// 2026-09-19-stage-e2-prose.md` §25-§40, §52, §56, §57).
import { ACT4_P_CLUES, ACT4_P_FLAGS, ACT4_P_MEMORIES, ACT4_P_QUESTIONS } from './knowledge';
import { ACT4_P_HAB_OBJECTS } from './objects/hab';
import { habDomeRoom, habGalleyRoom } from './hab';
import { sissy } from './sissy';
import { ACT4_P_VERBS } from './verbs';
import { act4EnterHab, act4LeaveHab } from './scripts';
import { ACT4_ENTER_HAB_SCRIPT, ACT4_HAB_DOME, ACT4_HAB_GALLEY, ACT4_LEAVE_HAB_SCRIPT, ACT4_SISSY } from './ids';

// --- E2 task Q ---
// The library annex, the darkroom, the two prints, and R17
// (`docs/superpowers/specs/2026-09-19-stage-e2-prose.md` §42-§47, §52, §56,
// §57). The annex shelf/darkroom key/darkroom door amendments live
// physically in `act1/objects/countyLibrary.ts` (this file's own header
// rule — only ids are namespaced `act4_*`, no import needed here, same
// precedent as `act4_crews`/`act4_visit_notice` above); this task's own
// `objects/darkroom.ts` also amends `act4_sissy_film` (task P's object,
// `objects/hab.ts`) and `act2_film_canister` (`act2/objects/cache.ts`) in
// place with their own DEVELOP handlers — no import needed here for those
// either (the mutation runs at that module's own top level, forced to
// evaluate by `ACT4_Q_DARKROOM_OBJECTS`'s own import below).
import { ACT4_E2_TASK_Q_CLUES, ACT4_E2_TASK_Q_FLAGS, ACT4_E2_TASK_Q_PUZZLES } from './knowledge';
import { ACT4_Q_DARKROOM_OBJECTS } from './objects/darkroom';
import { act4Develop } from './scripts';
import { ACT4_DEVELOP_SCRIPT } from './ids';
import { ACT4_Q_VERBS } from './verbs';

export const ACT4_SLICE: WorldSlice = {
  flags: { ...ACT4_E0_FLAGS, ...ACT4_E1_TASK_M_FLAGS, ...ACT4_E1_TASK_N_FLAGS, ...ACT4_L_FLAGS, ...ACT4_O_FLAGS, ...ACT4_P_FLAGS, ...ACT4_E2_TASK_Q_FLAGS },
  clues: {
    ...ACT4_E0_TASK_K_CLUES,
    ...ACT4_E0_TASK_I_CLUES,
    ...ACT4_J_CLUES,
    ...ACT4_E1_TASK_M_CLUES,
    ...ACT4_E1_TASK_N_CLUES,
    ...ACT4_L_CLUES,
    ...ACT4_O_CLUES,
    ...ACT4_P_CLUES,
    ...ACT4_E2_TASK_Q_CLUES,
  },
  questions: { ...ACT4_E0_QUESTIONS, ...ACT4_L_QUESTIONS, ...ACT4_O_QUESTIONS, ...ACT4_P_QUESTIONS },
  puzzles: { ...ACT4_J_PUZZLES, ...ACT4_L_PUZZLES, ...ACT4_O_PUZZLES, ...ACT4_E2_TASK_Q_PUZZLES },
  memories: { ...ACT4_O_MEMORIES, ...ACT4_P_MEMORIES },
  verbs: { ...ACT4_L_VERBS, ...ACT4_O_VERBS, ...ACT4_P_VERBS, ...ACT4_Q_VERBS },
  rooms: {
    [ACT4_STAGING_AREA]: stagingAreaRoom,
    [ACT4_ESCAPE_CHAMBER]: escapeChamberRoom,
    [ACT4_HAB_GALLEY]: habGalleyRoom,
    [ACT4_HAB_DOME]: habDomeRoom,
  },
  npcs: { [ACT4_LUKE]: luke, [ACT4_SISSY]: sissy },
  objects: {
    [ACT4_PROFILE]: act4Profile,
    ...ACT4_J_SHERIFF_OFFICE_OBJECTS,
    ...ACT4_J_CENSOR_OBJECTS,
    [ACT4_S5_DOWN_GATE]: act4S5DownGate,
    ...ACT4_L_STAGING_AREA_OBJECTS,
    ...ACT4_O_HUB_OBJECTS,
    ...ACT4_O_CHAMBER_OBJECTS,
    ...ACT4_P_HAB_OBJECTS,
    ...ACT4_Q_DARKROOM_OBJECTS,
  },
  events: {
    [EVENT_ACT4_EV_START]: ACT4_EV_START_EVENT,
    [EVENT_ACT4_EV_CREWS_VISIBLE]: ACT4_EV_CREWS_VISIBLE_EVENT,
    [ACT4_EV_DAD_BREATH]: ACT4_EV_DAD_BREATH_EVENT,
    [EVENT_ACT4_LUKE_GONE_MISSED]: ACT4_EV_LUKE_GONE_MISSED_EVENT,
    [EVENT_ACT4_EV_JACK_SEES]: ACT4_EV_JACK_SEES_EVENT,
    [EVENT_ACT4_EV_JACK_RETURNS]: ACT4_EV_JACK_RETURNS_EVENT,
    [EVENT_ACT4_EV_JACK_MORNING_SCENE]: ACT4_EV_JACK_MORNING_SCENE_EVENT,
    [ACT4_EV_JACK_TUNNEL]: ACT4_EV_JACK_TUNNEL_EVENT,
    [EVENT_ACT4_EV_STAGING_OPENS]: ACT4_EV_STAGING_OPENS_EVENT,
    [EVENT_ACT4_EV_OFFICE_REPLY]: ACT4_EV_OFFICE_REPLY_EVENT,
    [EVENT_ACT4_EV_DETAIL_ARRIVES]: ACT4_EV_DETAIL_ARRIVES_EVENT,
    [EVENT_ACT4_EV_CHAMBER_TIMER]: ACT4_EV_CHAMBER_TIMER_EVENT,
    [EVENT_ACT4_EV_CHAMBER_COMPLETE]: ACT4_EV_CHAMBER_COMPLETE_EVENT,
    [ACT4_EV_CHAMBER_ASSIST_ORDER_EVENT.id]: ACT4_EV_CHAMBER_ASSIST_ORDER_EVENT,
    [ACT4_EV_CHAMBER_ASSIST_COPY_EVENT.id]: ACT4_EV_CHAMBER_ASSIST_COPY_EVENT,
    [ACT4_EV_CHAMBER_ASSIST_PHRASE_EVENT.id]: ACT4_EV_CHAMBER_ASSIST_PHRASE_EVENT,
  },
  scripts: {
    [ACT4_PROFILE_SCREEN_SCRIPT]: act4ProfileScreen,
    [ACT4_SET_VISIT_DAY_SCRIPT]: act4SetVisitDay,
    [ACT4_CREWS_VISIBILITY_SCRIPT]: act4CrewsVisibility,
    [ACT4_LUKE_DESCENDS_SCRIPT]: act4LukeDescends,
    [ACT4_HAND_LETTER_SCRIPT]: act4HandLetter,
    [ACT4_ENTER_ESCAPE_SCRIPT]: act4EnterEscape,
    [ACT4_CHAMBER_DOOR_OPEN_SCRIPT]: act4ChamberDoorOpen,
    [ACT4_CHAMBER_PHRASE_RESPOND_SCRIPT]: act4ChamberPhraseRespond,
    [ACT4_ENTER_HAB_SCRIPT]: act4EnterHab,
    [ACT4_LEAVE_HAB_SCRIPT]: act4LeaveHab,
    [ACT4_DEVELOP_SCRIPT]: act4Develop,
  },
};

/**
 * Prompt id -> the script that closes it (`game.ts`'s own `PROMPT_SCRIPTS`
 * convention, same shape as `ACT3_HUB_PROMPT_SCRIPTS`, `act3/index.ts`).
 * E2 task O's own new prompt (`act4_chamber_phrase`, §21.2).
 */
export const ACT4_PROMPT_SCRIPTS: Record<string, ScriptId> = {
  [ACT4_CHAMBER_PHRASE_PROMPT_ID]: ACT4_CHAMBER_PHRASE_RESPOND_SCRIPT,
};
