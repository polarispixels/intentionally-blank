// Act II, Wave D1 — the Custodian, from object to NPC (plan §4.6; D1 prose
// doc §8). Prose transcribed verbatim (hard rule 5).
//
// The Act I object (`act1_maintenance_man`) is retired to `nowhere` by the
// travel script's own first-ride effects (`act2/travel.ts`), not here and
// not via a puzzle's `onSolved` — see that file's own comment.
//
// `ACT2_CUSTODIAN` is declared in `act2/ids.ts` (task B landed it first,
// since the Emporium's own porch-rail rule and description rule 3 both read
// it) — this file owns the NPC's schedule/description/greeting/handlers,
// per that id's own doc comment.
//
// EXAMINE is a `handlers` entry, not `NpcDefSlice.description` — the flag
// (`act2_saw_custodian_painting`) needs an `Effect`, and `description` is
// `Prose`-only (mirrors `ObjectDefSlice.description`, `world.ts`'s own doc
// comment); `handlers` is checked first for EXAMINE regardless
// (`respond.ts`'s `respondToNpcTarget`), so declaring both would leave
// `description` dead. No topics/tellTopics/showResponses (§4.6: "no
// topics") — `unknownTopic` is still authored, because ASK/TELL CUSTODIAN
// reaches `npc.ts`'s `respondToUnknownTopic` regardless of whether any
// topics are declared, and that function throws if `unknownTopic` is
// undefined (confirmed against `npc.ts`) — `validate.ts`'s own
// `npc-missing-unknown-topic` rule doesn't require it here (no topics/
// tellTopics/showResponses to trigger that check), but the runtime would
// crash on the first ASK without it.

import type { NpcDefSlice } from '../../../engine/world';
import { ACT2_SAW_CUSTODIAN_PAINTING, ACT2_STARTED, ACT2_WALL_DRUG_EMPORIUM } from './ids';
import { V_ATTACK, V_FOLLOW, V_WATCH } from '../act1/ids';
import { EXAMINE } from '../act1/verbs';

// ---------------------------------------------------------------------------
// §8.1 — EXAMINE (sets `act2_saw_custodian_painting`).
// ---------------------------------------------------------------------------

const descriptionText =
  'Grey coveralls, the clean kind. He is working away from you along the rail\nwith the bucket and the ladder squared away at his feet, so that nobody coming\nalong the porch has to step round anything.\n\nHe is about the height of a man. His hair is the colour hair is. You look for\nas long as it is polite to look, and there is nothing on him to hang the\nlooking on — no ring, no watch, no belly, no limp, no radio, no lanyard,\nnothing written anywhere on the coveralls. The brush goes into the paint and\ncomes out and goes along the rail.\n\nAfterwards you find you have kept the rail and not the man.';

// ---------------------------------------------------------------------------
// §8.2 — greeting. He does not speak.
// ---------------------------------------------------------------------------

const greeting =
  'He straightens, and nods, and waits with the brush held off the rail until it\nis clear you are not going to need anything.\n\nThen he goes back to the rail.';

// ---------------------------------------------------------------------------
// §8.3 — unknownTopic (rotating).
// ---------------------------------------------------------------------------

const unknownTopic: string[] = [
  'He listens to the whole of it. Then he goes back along a length he has already\ndone and does an inch of it again.',
  'Nothing. Not a rude nothing — he waits to see whether there is more of it, and\nwhen there is not, the brush goes back in the paint.',
  'He looks at you while you are talking, which is worse.',
];

// ---------------------------------------------------------------------------
// §8.4 — ATTACK.
// ---------------------------------------------------------------------------

const attackText =
  'You get as far as deciding to.\n\nThen there is nothing in the way of it and nothing behind it, and you are a\nman on a porch with his hands half up, being looked at by somebody who has\nstopped painting and will start again shortly.';

// ---------------------------------------------------------------------------
// §8.5 — FOLLOW / WATCH.
// ---------------------------------------------------------------------------

const followWatchText =
  'He does the rail. He does not look up at intervals, or check the lot, or find\na reason to move round the building. He does the rail for as long as you are\nwilling to stand there doing nothing, and he is better at that than you are.';

export const custodian: NpcDefSlice = {
  // Plan §4.6 / this task's own ruling 2: posted at the Emporium afternoons,
  // otherwise offstage in this build (D2 adds his Main Street mornings).
  schedule: [
    { when: { all: [{ flag: ACT2_STARTED }, { clockPhase: 'afternoon' }] }, room: ACT2_WALL_DRUG_EMPORIUM },
    { room: 'offstage' },
  ],
  nouns: ['custodian', 'man', 'maintenance man', 'workman', 'painter', 'coveralls'],
  pronoun: 'he',
  greeting,
  unknownTopic,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: descriptionText }, { set: [ACT2_SAW_CUSTODIAN_PAINTING, true] }] },
    { verbs: [V_ATTACK], effects: [{ say: attackText }] },
    { verbs: [V_FOLLOW, V_WATCH], effects: [{ say: followWatchText }] },
  ],
};
