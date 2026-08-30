// The fedora (prose doc §4.1) and its hatband sub-part (§4.1's "crown"/
// "band" nouns — see `ids.ts`'s `FEDORA_BAND` comment: same verb
// ("examine"), different noun word, different response, so it needs its own
// `ObjectId`). `FEDORA_BAND`'s `location: { on: FEDORA }` — not a real
// container relationship (the hatband isn't sealed inside anything) — keeps
// it in scope exactly when the hat itself is, with no open/transparent
// gating (`world.ts`'s `inScopeAt`'s `'on'` arm has none), and follows the
// hat automatically as it moves (floor → inventory → worn) with no extra
// state to keep in sync.
//
// The memory (§6, `mem_hat`) fires from the WEAR handler below — see that
// handler's own comment for why it bypasses `actions.ts`'s built-in
// implicit-take.

import type { Effect } from '../../../../engine/effects';
import type { HandlerDef, ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { FEDORA, FEDORA_BAND, FLOOR_LAMP, MEM_HAT, PAGE_78, YOUR_ROOM } from '../ids';
import { BREAK, CUT, EXAMINE, READ, REMOVE, SEARCH, SMELL, TAKE, TASTE, WEAR } from '../verbs';
import { ROOM_DARK } from './common';

const examine: ProseRule[] = [
  {
    when: { not: { has: FEDORA } },
    text: 'A grey felt fedora, crown down and brim up, lying the way a hat lands when the head it was on stops participating. Good felt, better than the room. A dark band around the crown. Inside, a sweat line says the hat has been worn a great deal by somebody with a head about the size of yours.',
  },
  {
    when: { objectAt: [FEDORA, 'worn'] },
    text: 'You are wearing it. From in here it is mostly a slight pressure on the forehead and the discovery that rooms are quieter under a hat.',
  },
  {
    text: 'Grey felt, a dark band, a brim with a permanent bias to one side from being taken off the same way ten thousand times. It fits your hand the way things fit that have been held a lot.',
  },
];

/** Shared by `FEDORA`'s own SEARCH/LOOK IN and `FEDORA_BAND`'s EXAMINE/SEARCH — the hatband is the same reveal wherever it's reached from. */
const bandSearch: ProseRule[] = [
  {
    when: { objectState: [PAGE_78, 'hidden', true] },
    text: 'Inside the crown, between the band and the felt, where a man keeps a ticket or a bill he does not want to think about, there is a sheet of paper folded down to quarters.',
  },
  { text: 'The band, the felt, the maker’s mark worn to three letters and a smudge. Nothing else is hiding in there.' },
];

const bandSearchEffects: Effect[] = [{ say: bandSearch }, { reveal: PAGE_78 }];

const listedAs: ProseRule[] = [
  {
    when: { all: [{ not: { has: FEDORA } }, { not: ROOM_DARK }] },
    text: 'A grey felt fedora lies beside the stain, crown down.',
  },
];

const fedora: ObjectDefSlice = {
  location: YOUR_ROOM,
  name: 'fedora',
  nouns: ['fedora', 'hat', 'brim'],
  adjectives: ['felt', 'grey'],
  portable: true,
  wearable: true,
  description: examine,
  listedAs,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: examine }] },
    { verbs: [SEARCH], effects: bandSearchEffects },
    {
      verbs: [TAKE],
      effects: [
        { say: 'You pick it up. It is lighter than it looks and better made than anything else on this floor, including you.' },
        { move: [FEDORA, 'inventory'] },
      ],
    },
    {
      // WEAR — the memory (§6). `move` relocates the hat straight to
      // `worn` regardless of its current place, which is what gives this
      // the same "wear it off the floor" convenience `actions.ts`'s
      // built-in implicit-take gives ordinary WEAR — a rung-1 handler has
      // no access to that helper (it's `actions.ts`-internal), so this
      // achieves the same result directly. `when` excludes an already-worn
      // fedora so a repeat WEAR falls through to the built-in's own
      // `wear.alreadyWorn` refusal.
      verbs: [WEAR],
      when: { not: { objectAt: [FEDORA, 'worn'] } },
      effects: [
        { say: { ref: 'wear.success' } },
        { move: [FEDORA, 'worn'] },
        {
          if: {
            when: { not: { memory: MEM_HAT } },
            then: [{ say: 'The hat settles, and something settles with it.' }, { grantMemory: MEM_HAT }],
            else: [{ say: 'No rain this time. Just felt, and a headache with a lid on it.' }],
          },
        },
      ],
    },
    {
      verbs: [REMOVE],
      when: { objectAt: [FEDORA, 'worn'] },
      effects: [
        {
          say: 'You take the hat off. The room gets fractionally louder and the headache gets fractionally worse.',
        },
        { move: [FEDORA, 'inventory'] },
      ],
    },
    {
      verbs: [SMELL],
      effects: [
        {
          say: [
            'Felt, rain, and hair oil of a kind not manufactured recently.',
            'Under the felt and the rain there is a person, faintly. Not one you can name.',
          ],
        },
      ],
    },
    {
      verbs: [TASTE],
      effects: [
        { say: 'You put a corner of the brim in your mouth, briefly, on no theory at all. It tastes of felt, weather, and other people’s decades.' },
      ],
    },
    {
      verbs: [READ],
      effects: [
        {
          say: 'There is nothing written on a hat. There is a great deal written *into* one — where it has been rained on, where it has been gripped, which side gets taken off first — but none of it in words.',
        },
      ],
    },
    {
      verbs: [BREAK, CUT],
      effects: [
        {
          say: 'You could ruin the hat. It would take about four seconds and you would have approximately the rest of your life to think about why you did it.',
        },
      ],
    },
  ],
};

const fedoraBand: ObjectDefSlice = {
  location: { on: FEDORA },
  name: 'hatband',
  nouns: ['band', 'crown'],
  handlers: [{ verbs: [EXAMINE, SEARCH], effects: bandSearchEffects } satisfies HandlerDef],
};

export const FEDORA_OBJECTS: Record<string, ObjectDefSlice> = {
  [FEDORA]: fedora,
  [FEDORA_BAND]: fedoraBand,
};

// give/show/put-on-desk deliberately left unauthored — the doc marks them
// "global families are fine" (no room-specific override needed).
