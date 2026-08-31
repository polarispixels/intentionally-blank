// Act V, wave E3, task U — §18, the re-acquire (`docs/superpowers/specs/
// 2026-09-20-stage-e3-prose.md` §18). `once: false` (fires every tick the
// full `when` holds — the player is expected to survive it exactly once,
// per the death menu's own `RESTART ENCOUNTER`, so no dedup flag is
// authored). Three beats, then `{ die }`. The coveralls do not help (no
// `worn`/`has` gate on anything the player might be carrying — canon 78:
// nothing here checks or cares). Every string below is transcribed
// verbatim (hard rule 5).

import type { EventDef } from '../../../engine/world';
import { ACT2_CUSTODIAN } from '../act2/ids';
import { ACT3_S6_ARCHIVE_HUB } from '../act3/ids';
import { ACT5_DEATH_REACQUIRE, ACT5_RECONCILIATION_RUNNING, EVENT_ACT5_EV_REACQUIRE } from './ids';

const BEAT_1 =
  'He is at the top of the well.\n\nNot doing anything to anything. Standing at the metal edging where the carpet stops, with his hands loose and his back to the room, facing the three steps down, which is where a man stands when he has been told where to stand.';

const BEAT_2 =
  'He turns round before you are all the way up the steps.\n\nThe coveralls get the attention they have got all week, which is none. He is not looking for a man who does not work here. He has been given one address and one description and this is the last place on the sheet.';

const BEAT_3 =
  'He comes across the carpet at the pace he does everything at, and does not hurry at the end of it, and somewhere in the middle of it there is a moment when you could have gone back down the steps and you spend it watching him instead.\n\nThen white.';

export const ACT5_EV_REACQUIRE_EVENT: EventDef = {
  id: EVENT_ACT5_EV_REACQUIRE,
  when: { all: [{ at: ACT3_S6_ARCHIVE_HUB }, { npcAt: [ACT2_CUSTODIAN, ACT3_S6_ARCHIVE_HUB] }, { flag: ACT5_RECONCILIATION_RUNNING }] },
  once: false,
  effects: [{ say: BEAT_1 }, { say: BEAT_2 }, { say: BEAT_3 }, { die: ACT5_DEATH_REACQUIRE }],
};
