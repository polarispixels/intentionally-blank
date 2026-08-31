// E3 task V — the Blank Room itself (§20): description, exits, and every
// BARE-verb response (room-level `handlers`, per `world.ts`'s own rule:
// "only ever consulted for a verb with no dobj at all") plus the room-level
// INSTRUMENT handlers for the locker's general PUT_IN/TAKE case (checked
// before an object's own `handlers` fail to match — `actions.ts`'s
// `performAction`) and the fixed multi-word verbs for `CREATE SUBJECT` and
// `SEARCH INDEX FOR ...`. Every string is transcribed verbatim from
// `docs/superpowers/specs/2026-09-20-stage-e3-prose.md` (hard rule 5).

import type { HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { LISTEN, OPEN, PUT_IN, SEARCH, SLEEP, SMELL, TAKE, WAIT, YELL } from '../act1/verbs';
import { V_TYPE_TERMINAL } from '../act1/ids';
import {
  ACT5_BLANK_ROOM,
  ACT5_BLANK_ROOM_DOOR,
  ACT5_CREATE_SUBJECT_OPEN_SCRIPT,
  ACT5_LOCKER,
  ACT5_ROOT_ANTECHAMBER,
  ACT5_WAKE_JULES_SCRIPT,
  V_ACT5_CREATE_SUBJECT,
  V_ACT5_DIG,
  V_ACT5_INDEX_SEARCH_OTHER,
  V_ACT5_INDEX_SEARCH_SELF,
} from './ids';
import {
  BLANK_ROOM_FIRST_SIGHT,
  BLANK_ROOM_LISTEN,
  BLANK_ROOM_PRY_WALL,
  BLANK_ROOM_SEARCH,
  BLANK_ROOM_SLEEP_WAIT,
  BLANK_ROOM_SMELL,
  BLANK_ROOM_UNCONDITIONAL,
  BLANK_ROOM_YELL,
  CREATE_SUBJECT_APPROACH,
  INDEX_SEARCH_OTHER,
  INDEX_SEARCH_SELF,
  LOCKER_PUT_GENERAL,
  LOCKER_TAKE_FROM,
  TERMINAL_TYPE,
} from './objects/blankRoom';

const description: ProseRule[] = [
  { when: { not: { visited: ACT5_BLANK_ROOM } }, text: BLANK_ROOM_FIRST_SIGHT },
  { text: BLANK_ROOM_UNCONDITIONAL },
];

const roomHandlers: HandlerDef[] = [
  // §21.2 — bare TYPE/LOG IN/PRESS KEY (`V_TYPE_TERMINAL`, no dobj — the
  // object-targeted `USE TERMINAL` form lives on the terminal object itself,
  // `objects/blankRoom.ts`).
  { verbs: [V_TYPE_TERMINAL], effects: [{ say: TERMINAL_TYPE }] },

  // §28 — `CREATE SUBJECT`/`NEW SUBJECT`/`SELECT CREATE SUBJECT`: "subject"
  // names no object, so this is its own fixed-phrase bare verb.
  { verbs: [V_ACT5_CREATE_SUBJECT], effects: [{ say: CREATE_SUBJECT_APPROACH }, { script: { id: ACT5_CREATE_SUBJECT_OPEN_SCRIPT } }] },

  // §23.4 — "SEARCH INDEX FOR ME"/"MYSELF"/"THE INVESTIGATOR" and "FOR" any
  // other known name. Not counted in §45 (shipped ledger text, reused).
  // "SEARCH INDEX FOR JULES" resolves through the index object's own
  // `SEARCH` handler instead (`objects/blankRoom.ts` — `SEARCH`'s extended
  // `for` preposition, `../formScripts.ts`), since his is the only one of
  // these ever physically present in this room. One text for every other
  // name, never a per-name variant (§43 item 13).
  { verbs: [V_ACT5_INDEX_SEARCH_SELF], effects: [{ say: INDEX_SEARCH_SELF }] },
  { verbs: [V_ACT5_INDEX_SEARCH_OTHER], effects: [{ say: INDEX_SEARCH_OTHER }] },

  // §24 — "bare OPEN at the index" (§42.2's collision note); OPEN JULES/
  // OPEN SNAPSHOT/WAKE JULES themselves are the snapshot object's own
  // handlers (`objects/blankRoom.ts`). `act5_wake_jules` does all the
  // refusal/once/repeat branching itself.
  { verbs: [OPEN], effects: [{ script: { id: ACT5_WAKE_JULES_SCRIPT } }] },

  // §20.3 — room-level senses with no dobj of their own.
  { verbs: [SEARCH], effects: [{ say: BLANK_ROOM_SEARCH }] },
  { verbs: [LISTEN], effects: [{ say: BLANK_ROOM_LISTEN }] },
  { verbs: [SMELL], effects: [{ say: BLANK_ROOM_SMELL }] },
  { verbs: [SLEEP, WAIT], effects: [{ say: BLANK_ROOM_SLEEP_WAIT }] },
  { verbs: [YELL], effects: [{ say: BLANK_ROOM_YELL }] },
  { verbs: [V_ACT5_DIG], effects: [{ say: BLANK_ROOM_PRY_WALL }] },

  // §26.2/§26.7 — the locker's general PUT_IN case and TAKE-FROM, for any
  // dobj the four specific cache handlers (on the notebook/canister/prints/
  // usb/letter objects) don't intercept first (`performAction`'s own
  // per-dobj-handler-before-room-instrument-handler precedence).
  { verbs: [PUT_IN], withInstrument: [ACT5_LOCKER], effects: [{ say: LOCKER_PUT_GENERAL }] },
  { verbs: [TAKE], withInstrument: [ACT5_LOCKER], effects: [{ say: LOCKER_TAKE_FROM }] },
];

export const act5BlankRoomRoom: RoomDefSlice = {
  name: 'Blank Room',
  aliases: ['blank room'],
  area: 'act5',
  // No `dark` field at all — absent means never dark (§2.4's baseline),
  // which is §20's own "the light does not go out until §31."
  description,
  exits: [
    { dir: 's', to: ACT5_ROOT_ANTECHAMBER, door: ACT5_BLANK_ROOM_DOOR },
    { dir: 'out', to: ACT5_ROOT_ANTECHAMBER, door: ACT5_BLANK_ROOM_DOOR },
  ],
  handlers: roomHandlers,
};
