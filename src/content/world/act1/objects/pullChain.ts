// Pull chain (prose doc §4.3) — the tutorial affordance: the room's single
// light switch, and the only thing that must be reachable in total darkness.
//
// FIXED (was an ENGINE GAP): `scope()`'s dark-visibility rule
// (`src/engine/world.ts`) used to be all-or-nothing — "in the dark, only
// what is `inventory`/`worn` stays reachable" — with no per-object "reachable
// by touch" exception, even though the doc requires exactly that for this
// one object. The chain used to sit at `location: 'inventory'` as a
// workaround for that gap — a lie about the world (it was never actually
// carried; TAKE was overridden to refuse). `scope()` now honours a
// per-object `reachableInDark` flag (see `world.ts`'s doc comment on it),
// so the chain lives at its true, documented place — hanging off the lamp
// fitting (`{ on: FLOOR_LAMP }`) — and is findable by touch on its own
// authority, not by pretending to be carried.

import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { FLAG_LAMP_FIRST_OFF_DONE, FLAG_LAMP_FIRST_ON_DONE, FLOOR_LAMP, PULL_CHAIN } from '../ids';
import { BREAK, EXAMINE, PULL, TAKE, TURN_OFF, TURN_ON } from '../verbs';

const examine: ProseRule[] = [
  {
    when: { not: { objectState: [FLOOR_LAMP, 'on', true] } },
    text: 'You cannot see it. You can feel it: a hand’s length of small brass links ending in a bead, cool, and attached at the far end to something that does not move when you tug it gently.',
  },
  {
    text: 'A hand’s length of brass ball-chain hanging off the lamp fitting, ending in a slightly larger bead worn smooth. Somebody has pulled this a great many times.',
  },
];

const pullChain: ObjectDefSlice = {
  location: { on: FLOOR_LAMP },
  reachableInDark: true,
  name: 'pull chain',
  // "pull" dropped from the doc's noun list (validate.ts's verb-noun-
  // collision check against the PULL verb's own word "pull").
  nouns: ['chain', 'pull chain', 'cord', 'string'],
  description: examine,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: examine }] },
    {
      verbs: [PULL, TURN_ON, TURN_OFF],
      effects: [
        {
          if: {
            when: { objectState: [FLOOR_LAMP, 'on', true] },
            then: [
              {
                if: {
                  when: { not: { flag: FLAG_LAMP_FIRST_OFF_DONE } },
                  then: [
                    { say: 'You pull the chain and the room goes away again. The dark is precisely where you left it.' },
                    { set: [FLAG_LAMP_FIRST_OFF_DONE, true] },
                  ],
                  else: [{ say: 'Off. The dark returns without ceremony.' }],
                },
              },
              { setState: [FLOOR_LAMP, 'on', false] },
            ],
            else: [
              {
                if: {
                  when: { not: { flag: FLAG_LAMP_FIRST_ON_DONE } },
                  then: [
                    { say: 'You pull. There is a click, and the room happens.' },
                    { set: [FLAG_LAMP_FIRST_ON_DONE, true] },
                  ],
                  else: [{ say: 'Click. The room comes back, arranged exactly as you left it, which is badly.' }],
                },
              },
              { setState: [FLOOR_LAMP, 'on', true] },
            ],
          },
        },
      ],
    },
    {
      verbs: [TAKE, BREAK],
      effects: [
        {
          say: 'You give the chain a pull that is more of an argument than a request. It holds. Whoever assembled this lamp expected it to be operated by people in approximately your condition.',
        },
      ],
    },
  ],
};

export const PULL_CHAIN_OBJECTS: Record<string, ObjectDefSlice> = {
  [PULL_CHAIN]: pullChain,
};
