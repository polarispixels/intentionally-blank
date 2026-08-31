// Act II, Stage D2, task A — the rig (`docs/superpowers/specs/2026-09-10-
// stage-d2-prose.md` §9.4). Prose transcribed verbatim (hard rule 5).
//
// PUT USB IN RIG / TAKE USB (from the rig) live on the USB itself
// (`objects/usb.ts`, this same task — see that file's own header for why:
// `PUT_IN` dispatches on the dobj's own handlers, and the resolved dobj for
// both phrases is the USB, not the rig). This file owns only the rig
// object's own EXAMINE/DROP and its one-time appearance.

import type { EventDef, ObjectDefSlice } from '../../../../engine/world';
import { JACKS_MOTEL } from '../../act1/ids';
import { DROP, EXAMINE } from '../../act1/verbs';
import { ACT2_DAD_BOOTED, ACT2_RIG, ACT2_SLEPT_SINCE_BOOT, EVENT_ACT2_RIG_APPEARS } from '../ids';

const examineText =
  'On the table by the door, where there was nothing last night: a speaker the\nsize of a loaf, a motorcycle battery, and a grey box with two sockets in it,\nall three of them strapped together with duct tape into an object that is\neither very badly made or exactly as well made as it needs to be.\n\nThe strapping has been done in one continuous wind, corner to corner to\ncorner, by somebody who did it once rather than four times. There is a loop of\nwebbing on the top of it at exactly the height of a hand.\n\nIt has one socket the shape of the stick, and it is the only other thing in\nthis county that has.';

const dropRefusedText = 'You are not putting this down in a road. You spend a second working out why\nnot, and then stop working it out.';

export const rig: ObjectDefSlice = {
  location: JACKS_MOTEL,
  hidden: true,
  name: 'rig',
  nouns: ['rig', 'speaker', 'battery', 'box'],
  portable: true,
  container: { open: false, transparent: true },
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: examineText }] },
    { verbs: [DROP], effects: [{ say: dropRefusedText }] },
  ],
};

export const ACT2_RIG_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT2_RIG]: rig,
};

/** §9.4's own event — one time, no toggle (the rig, once it exists, exists forever). */
export const ACT2_RIG_APPEARS_EVENT: EventDef = {
  id: EVENT_ACT2_RIG_APPEARS,
  when: { all: [{ flag: ACT2_DAD_BOOTED }, { flag: ACT2_SLEPT_SINCE_BOOT }] },
  once: true,
  effects: [{ reveal: ACT2_RIG }],
};
