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
//
// D2-C amendment (this task; D2 prose doc §18, `docs/superpowers/specs/
// 2026-09-10-stage-d2-prose.md`) — the town post: schedule gains Main
// Street mornings, ABOVE the afternoon Emporium rule (a player who reaches
// `act2_started` in the morning sees him at his town post first — D1's
// own afternoon rule is otherwise unaffected). `EXAMINE` becomes two
// `ProseRule`s (`{ at: MAIN_STREET }` → §18.1; else D1's shipped text
// unedited) and now ALSO sets `ACT2_EXAMINED_CUSTODIAN` (M15's trigger) at
// every post — D1's own `ACT2_SAW_CUSTODIAN_PAINTING` is left alone and
// both flags are set from the same handler (§29's own wiring note: "both
// are set by the same handler"). `ATTACK` becomes two rules (§18.2 at Main
// Street; D1's shipped `attackText` unedited elsewhere) — §28.1's
// *replacement* of D1's shipped `ATTACK` is explicitly quarantined
// ("do not wire without sign-off") and is NOT this; both attack texts
// stand at their own posts (status line). `HELLO`/`TALK TO` gains a Main
// Street variant via `greeting`'s own `ProseRule[]` (§18.3 — what does not
// happen; no flag, no effect, pure flavor) above D1's shipped greeting.
// `CLUE_VISITOR_UNREMARKABLE` (`act1/ids.ts`, shipped — reused, not
// redeclared, per ruling 3) is granted from the same EXAMINE handler; M15
// itself (the memory) is declared in `knowledgeD2C.ts`, triggered on the
// flag, not wired here.

import type { NpcDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { ACT2_EXAMINED_CUSTODIAN, ACT2_SAW_CUSTODIAN_PAINTING, ACT2_STARTED, ACT2_WALL_DRUG_EMPORIUM } from './ids';
import { CLUE_VISITOR_UNREMARKABLE, MAIN_STREET, V_ATTACK, V_FOLLOW, V_WATCH } from '../act1/ids';
import { EXAMINE } from '../act1/verbs';

// ---------------------------------------------------------------------------
// §8.1 (D1, shipped) / §18.1 (D2-C, this task) — EXAMINE.
// ---------------------------------------------------------------------------

const descriptionText =
  'Grey coveralls, the clean kind. He is working away from you along the rail\nwith the bucket and the ladder squared away at his feet, so that nobody coming\nalong the porch has to step round anything.\n\nHe is about the height of a man. His hair is the colour hair is. You look for\nas long as it is polite to look, and there is nothing on him to hang the\nlooking on — no ring, no watch, no belly, no limp, no radio, no lanyard,\nnothing written anywhere on the coveralls. The brush goes into the paint and\ncomes out and goes along the rail.\n\nAfterwards you find you have kept the rail and not the man.';

const mainStreetDescriptionText =
  'Grey coveralls, the clean kind. He is at the rail outside the post office with\na wire brush and a tin, taking the rust off the bracket where the rail goes\ninto the wall, and he has laid a cloth on the pavement under it so that what\ncomes off does not go on the pavement.\n\nYou could describe the brush. You could describe the bracket, the tin, the\ncloth, the ends of the cloth weighted with two stones he must have brought.\n\nYou look at him for as long as it is polite to look at a man working, and\nafterwards what you have is the rail.';

const description: ProseRule[] = [
  { when: { at: MAIN_STREET }, text: mainStreetDescriptionText },
  { text: descriptionText },
];

// ---------------------------------------------------------------------------
// §8.2 (D1) / §18.3 (D2-C) — greeting. He does not speak, on Main Street or
// anywhere else.
// ---------------------------------------------------------------------------

const greetingShipped =
  'He straightens, and nods, and waits with the brush held off the rail until it\nis clear you are not going to need anything.\n\nThen he goes back to the rail.';

const mainStreetGreetingText =
  'He straightens. He nods. He waits, with the brush held off the bracket, for as\nlong as it takes you to establish that you have nothing to ask him.\n\nNobody comes out of the post office. Nobody goes past on the pavement. The\nmorning does not change in any respect whatever, and at the end of it he goes\nback to the bracket.';

const greeting: ProseRule[] = [
  { when: { at: MAIN_STREET }, text: mainStreetGreetingText },
  { text: greetingShipped },
];

// ---------------------------------------------------------------------------
// §8.3 (D1, shipped) — unknownTopic (rotating). Not amended (§18's own
// header: "D1 shipped his base strings ... not re-authored here").
// ---------------------------------------------------------------------------

const unknownTopic: string[] = [
  'He listens to the whole of it. Then he goes back along a length he has already\ndone and does an inch of it again.',
  'Nothing. Not a rude nothing — he waits to see whether there is more of it, and\nwhen there is not, the brush goes back in the paint.',
  'He looks at you while you are talking, which is worse.',
];

// ---------------------------------------------------------------------------
// §8.4 (D1) / §18.2 (D2-C) — ATTACK.
// ---------------------------------------------------------------------------

const attackText =
  'You get as far as deciding to.\n\nThen there is nothing in the way of it and nothing behind it, and you are a\nman on a porch with his hands half up, being looked at by somebody who has\nstopped painting and will start again shortly.';

const mainStreetAttackText = 'There is nothing to hit.\n\nHe stops brushing while you decide, and starts again when you have.';

// ---------------------------------------------------------------------------
// §8.5 (D1, shipped) — FOLLOW / WATCH. Not amended.
// ---------------------------------------------------------------------------

const followWatchText =
  'He does the rail. He does not look up at intervals, or check the lot, or find\na reason to move round the building. He does the rail for as long as you are\nwilling to stand there doing nothing, and he is better at that than you are.';

export const custodian: NpcDefSlice = {
  // D2-C: Main Street mornings, ABOVE D1's own afternoon Emporium rule.
  schedule: [
    { when: { all: [{ flag: ACT2_STARTED }, { clockPhase: 'morning' }] }, room: MAIN_STREET },
    { when: { all: [{ flag: ACT2_STARTED }, { clockPhase: 'afternoon' }] }, room: ACT2_WALL_DRUG_EMPORIUM },
    { room: 'offstage' },
  ],
  nouns: ['custodian', 'man', 'maintenance man', 'workman', 'painter', 'coveralls'],
  pronoun: 'he',
  greeting,
  unknownTopic,
  handlers: [
    // `description` is already the two-rule `{ at: MAIN_STREET }` split
    // (§18.1/D1's shipped text) — one handler, both flags, the clue.
    {
      verbs: [EXAMINE],
      effects: [{ say: description }, { set: [ACT2_SAW_CUSTODIAN_PAINTING, true] }, { set: [ACT2_EXAMINED_CUSTODIAN, true] }, { grantClue: CLUE_VISITOR_UNREMARKABLE }],
    },
    { verbs: [V_ATTACK], when: { at: MAIN_STREET }, effects: [{ say: mainStreetAttackText }] },
    { verbs: [V_ATTACK], effects: [{ say: attackText }] },
    { verbs: [V_FOLLOW, V_WATCH], effects: [{ say: followWatchText }] },
  ],
};
