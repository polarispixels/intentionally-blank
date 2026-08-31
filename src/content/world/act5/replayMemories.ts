// Stage F wave F0 — M21-M24, the replay fragments (`docs/superpowers/specs/
// 2026-09-21-stage-f0-prose.md` §2-§6, register 148: the seeded stratum
// leaking — the substrate knowing something the investigator never
// learned, surfacing at the exact moment the player has just used the
// seed's own knowledge). Every string below is transcribed verbatim (hard
// rule 5). No capability flags, no variants, no profile arms; each fires
// exactly once (memories never re-grant once held, `engine/knowledge.ts`'s
// own guarantee).
//
// Voice: first person, the seeded tell (the man who wrote M5/M7/M9). None
// of the four ever addresses the player, quotes a shipped line, names
// anybody, or says the player did something wrong (doc §1, §6's own
// no-go audit) — a first-run player may reach three of these four by
// guessing, and must never be told so.

import type { WorldSlice } from '../game';
import { ACT2_CLUE_CREDENTIALS, ACT2_CLUE_INDENTED_CREDENTIALS, ACT2_STARTED } from '../act2/ids';
import { ACT3_CLUE_JULES_DEPRECATED, ACT3_HUB_LOGGED_IN } from '../act3/ids';
import { ACT4_STARTED } from '../act4/ids';
import { ACT5_BRANCH_UNLOCKED, ACT5_MEM_M21, ACT5_MEM_M22, ACT5_MEM_M23, ACT5_MEM_M24, ACT5_OPENING_LOGIN_SEEN, ACT5_ROOT_ACCEPTED } from './ids';

export const ACT5_REPLAY_MEMORIES: NonNullable<WorldSlice['memories']> = {
  // §2 — M21. Fires once the opening terminal's ACCESS LEVEL: LOCAL screen
  // has printed, and only before Act II has begun.
  [ACT5_MEM_M21]: {
    title: 'The Corner',
    lines: [
      "I got it up the stairs on my own with the flex round my wrist, which is how\nyou carry a thing you would rather nobody offered to help with.\n\nIt went in the corner because the corner is where the outlet was. Then I\nsquared it up to the wall. Then I stood back and squared it up again, with a\nwhole room still to do and no reason on earth to be spending the afternoon on\nthe angle of a desk.\n\nThere was nothing on it anybody would ever want. I did it properly anyway, and\nthen I turned the light off from the doorway and stood there a minute longer\nthan the job needed.",
    ],
    trigger: { when: { all: [{ flag: ACT5_OPENING_LOGIN_SEEN }, { not: { flag: ACT2_STARTED } }] } },
  },
  // §3 — M22. Fires logged in at the Sublevel 6 Hub holding neither
  // credentials clue (the pair typed from nowhere).
  [ACT5_MEM_M22]: {
    title: 'Across A Desk',
    lines: [
      'He read them out to me across a desk without looking up from what he was\ndoing, the way you give a man the combination for a gate he is going to use\ntwice and then never again.\n\nI wrote them down afterwards, out in the corridor, standing up, because I did\nnot want him watching me decide they were worth writing down.\n\nNobody has changed them since. I used to put that down to somebody being lazy\nabout it.\n\nA lock only gets changed when somebody tries it.',
    ],
    trigger: {
      when: {
        all: [{ flag: ACT3_HUB_LOGGED_IN }, { not: { clue: ACT2_CLUE_CREDENTIALS } }, { not: { clue: ACT2_CLUE_INDENTED_CREDENTIALS } }],
      },
    },
  },
  // §4 — M23. Fires once the service tunnel's branch hatch is open, and
  // only before Act IV has started.
  [ACT5_MEM_M23]: {
    title: 'Looking For A Rat',
    lines: [
      'You walk a tunnel like that with your light on the rails, because the rails\nare what you are down there for. I did it for years and the light never came\noff them once.\n\nThe day it did, I was looking for a rat.\n\nLow in the wall on the left, with a lip of concrete over it, and not on any\ndrawing that has ever come through my hands. I stood in front of it long\nenough that my light started going orange.\n\nThen I climbed back out and I did not put it in the book. That was the first\nthing I ever left out of it.',
    ],
    trigger: { when: { all: [{ flag: ACT5_BRANCH_UNLOCKED }, { not: { flag: ACT4_STARTED } }] } },
  },
  // §5 — M24. Fires on acceptance at the root console, without ever having
  // learned who Jules was.
  [ACT5_MEM_M24]: {
    title: 'An Evening I Did Not Need',
    lines: [
      'I had a second thing to try, and a third after that, and I had put most of an\nevening aside for being turned down politely by a machine.\n\nIt took about as long as signing for a parcel.\n\nAnd then the door was open, and I did not go through it. I stood there with my\nhand flat on the machine for a while, which is not a thing I do, and I could\nnot have told you what I was waiting for.\n\nI have been frightened of a good many things in this building. Being let in\nwas never one of them, and it should have been.',
    ],
    trigger: { when: { all: [{ flag: ACT5_ROOT_ACCEPTED }, { not: { clue: ACT3_CLUE_JULES_DEPRECATED } }] } },
  },
};
