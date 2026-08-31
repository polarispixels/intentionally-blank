// Act V — the slice (`docs/superpowers/specs/2026-09-16-stage-e-plan.md`
// §0.3). Assembled into `WORLD` by `../game.ts` after the Act IV slice.
// E3 adds three rooms (shaft, antechamber, Blank Room); everything else in
// the wave is amendments in place to Act I–III files (the established
// idiom) plus the objects, events and scripts the E3 builders register
// here. Skeleton written by the main session before the builders ran
// (`docs/superpowers/specs/2026-09-20-stage-e3-prose.md` §42); builders add
// entries below the anchors with the Edit tool, never Write.

import type { WorldSlice } from '../game';
import type { ScriptId } from '../../../engine/ids';
import { ACT5_FLAGS, ACT5_E3_TASK_W_CLUES, ACT5_E3_TASK_W_PUZZLES, ACT5_E3_TASK_W_QUESTIONS } from './knowledge';
import {
  ACT5_ANTE_LOGIN_OPEN_SCRIPT,
  ACT5_ANTE_LOGIN_PROMPT_ID,
  ACT5_ANTE_LOGIN_RESPOND_SCRIPT,
  ACT5_BLANK_ROOM,
  ACT5_CREATE_SUBJECT_OPEN_SCRIPT,
  ACT5_CREATE_SUBJECT_PROMPT_ID,
  ACT5_CREATE_SUBJECT_RESPOND_SCRIPT,
  ACT5_INITIALIZE_PROMPT_ID,
  ACT5_INITIALIZE_RESPOND_SCRIPT,
  ACT5_OPENING_LOGIN_OPEN_SCRIPT,
  ACT5_OPENING_LOGIN_PROMPT_ID,
  ACT5_OPENING_LOGIN_RESPOND_SCRIPT,
  ACT5_RECURSION_SCRIPT,
  ACT5_ROOT_ANTECHAMBER,
  ACT5_ROOT_SHAFT,
  ACT5_WAKE_JULES_SCRIPT,
  ACT5_WELL_DOOR,
  EVENT_ACT5_EV_LOCKER,
  V_ACT5_LOGIN_TERMINAL,
} from './ids';
// --- E3 builders: add your own imports below this line (Edit tool only) ---

// --- E3 task V — the Blank Room, its terminal/record/index/snapshot/tray/
// letter/locker/door, `act5_ev_locker`, and the `CREATE SUBJECT`/
// `INITIALIZE?` scripts (§20-§31, §42). ---
import { act5BlankRoomRoom } from './blankRoom';
import { ACT5_BLANK_ROOM_OBJECTS, ACT5_EV_LOCKER_EVENT } from './objects/blankRoom';
import {
  ACT5_TASK_V_VERBS,
  act5CreateSubjectOpen,
  act5CreateSubjectRespond,
  act5InitializeRespond,
  act5Recursion,
  act5WakeJules,
} from './formScripts';

// --- E3 task W —  the well door object, the opening-terminal login's verb
// def + scripts (`docs/superpowers/specs/2026-09-20-stage-e3-prose.md`
// §16, §32, §42.1). ---
import { wellDoor } from './wellDoor';
import { ACT5_LOGIN_TERMINAL_VERB, act5OpeningLoginOpen, act5OpeningLoginRespond } from './openingLogin';

// --- E3 task U — the shaft, the antechamber, the console's login, the
// re-acquire death (§3-§15, §17-§19, §42.4). Note: `ACT5_BRANCH_HATCH`'s
// own object def lives in `../act3/objects/serviceTunnel.ts` (the branch
// hatch is `act3_service_tunnel`'s own object, §42.4) and is already merged
// into `act3/index.ts`'s objects table via that file's own, pre-existing
// `ACT3_SERVICE_TUNNEL_OBJECTS` spread — not re-imported/re-registered
// here, and its reveal event is registered below by `.id`. ---
import { ACT5_BRANCH_HATCH_REVEAL_EVENT } from '../act3/objects/serviceTunnel';
import { ACT5_EV_START_EVENT, ACT5_ROOT_SHAFT_OBJECTS, ACT5_STAIR_DOOR_SYNC_EVENT, rootShaftRoom } from './rootShaft';
import { ACT5_ROOT_ANTECHAMBER_MEMORIES, ACT5_ROOT_ANTECHAMBER_OBJECTS, rootAntechamberRoom } from './rootAntechamber';
import { act5AnteLoginOpen, act5AnteLoginRespond } from './anteScripts';
import { ACT5_EV_REACQUIRE_EVENT } from './reacquireEvent';
import { ACT5_EV_DAD_DEFAULTS_EVENT } from '../act2/dad';

export const ACT5_SLICE: WorldSlice = {
  flags: {
    ...ACT5_FLAGS,
    // --- E3 builders append flag tables below this line ---
  },
  rooms: {
    // --- E3 builders append rooms below this line ---
    [ACT5_ROOT_SHAFT]: rootShaftRoom,
    [ACT5_ROOT_ANTECHAMBER]: rootAntechamberRoom,
    [ACT5_BLANK_ROOM]: act5BlankRoomRoom,
  },
  objects: {
    // --- E3 builders append objects below this line ---
    [ACT5_WELL_DOOR]: wellDoor,
    ...ACT5_ROOT_SHAFT_OBJECTS,
    ...ACT5_ROOT_ANTECHAMBER_OBJECTS,
    ...ACT5_BLANK_ROOM_OBJECTS,
  },
  npcs: {
    // E3 declares no new NPC; Dad/Custodian/Jack amendments live on their
    // own act1/act2 files (§42.1).
  },
  verbs: {
    // --- E3 builders append verbs below this line ---
    [V_ACT5_LOGIN_TERMINAL]: ACT5_LOGIN_TERMINAL_VERB,
    ...ACT5_TASK_V_VERBS,
  },
  clues: {
    // --- E3 builders append clues below this line ---
    ...ACT5_E3_TASK_W_CLUES,
  },
  memories: {
    // --- E3 builders append memories below this line ---
    ...ACT5_ROOT_ANTECHAMBER_MEMORIES,
  },
  questions: {
    // --- E3 builders append questions below this line ---
    ...ACT5_E3_TASK_W_QUESTIONS,
  },
  puzzles: {
    // --- E3 builders append puzzles below this line ---
    ...ACT5_E3_TASK_W_PUZZLES,
  },
  events: {
    // --- E3 builders append events below this line ---
    [ACT5_BRANCH_HATCH_REVEAL_EVENT.id]: ACT5_BRANCH_HATCH_REVEAL_EVENT,
    [ACT5_EV_START_EVENT.id]: ACT5_EV_START_EVENT,
    [ACT5_STAIR_DOOR_SYNC_EVENT.id]: ACT5_STAIR_DOOR_SYNC_EVENT,
    [ACT5_EV_DAD_DEFAULTS_EVENT.id]: ACT5_EV_DAD_DEFAULTS_EVENT,
    [ACT5_EV_REACQUIRE_EVENT.id]: ACT5_EV_REACQUIRE_EVENT,
    [EVENT_ACT5_EV_LOCKER]: ACT5_EV_LOCKER_EVENT,
  },
  responses: {
    // --- E3 builders append responses below this line ---
  },
  scripts: {
    // --- E3 builders append scripts below this line ---
    [ACT5_OPENING_LOGIN_OPEN_SCRIPT]: act5OpeningLoginOpen,
    [ACT5_OPENING_LOGIN_RESPOND_SCRIPT]: act5OpeningLoginRespond,
    [ACT5_ANTE_LOGIN_OPEN_SCRIPT]: act5AnteLoginOpen,
    [ACT5_ANTE_LOGIN_RESPOND_SCRIPT]: act5AnteLoginRespond,
    [ACT5_WAKE_JULES_SCRIPT]: act5WakeJules,
    [ACT5_CREATE_SUBJECT_OPEN_SCRIPT]: act5CreateSubjectOpen,
    [ACT5_CREATE_SUBJECT_RESPOND_SCRIPT]: act5CreateSubjectRespond,
    [ACT5_INITIALIZE_RESPOND_SCRIPT]: act5InitializeRespond,
    [ACT5_RECURSION_SCRIPT]: act5Recursion,
  },
};

/**
 * Prompt id -> the script that closes it (`game.ts`'s `PROMPT_SCRIPTS`
 * convention, same shape as `ACT3_HUB_PROMPT_SCRIPTS`/`ACT4_PROMPT_SCRIPTS`).
 * All four E3 prompts pre-wired by the main session (plan §3.5's rule: each
 * login has its own prompt id, its own respond script, its own flag).
 */
export const ACT5_PROMPT_SCRIPTS: Record<string, ScriptId> = {
  [ACT5_ANTE_LOGIN_PROMPT_ID]: ACT5_ANTE_LOGIN_RESPOND_SCRIPT,
  [ACT5_CREATE_SUBJECT_PROMPT_ID]: ACT5_CREATE_SUBJECT_RESPOND_SCRIPT,
  [ACT5_INITIALIZE_PROMPT_ID]: ACT5_INITIALIZE_RESPOND_SCRIPT,
  [ACT5_OPENING_LOGIN_PROMPT_ID]: ACT5_OPENING_LOGIN_RESPOND_SCRIPT,
};
