// Act II, Wave D1 — the glovebox and the deck (§4.7 of the D1 prose doc;
// plan §2 D1's own "the glovebox/deck" line). Prose transcribed verbatim
// (hard rule 5).
//
// CONTAINER-LOCATION SHAPE (ids.ts's own ruling 6 — "check what `location`
// shapes the engine support for containers on sub-parts"): `{ on:
// MONSTER_TRUCK_CAB }`, not `{ in: ... }`. `world.ts`'s `inScopeAt` treats
// the two very differently: an `{ in: X }` chain requires `X` itself to be
// `open` or `container.transparent` before anything inside it enters scope
// (`objectState(..., X, 'open') || isTransparent(..., X)`), but `X` here
// would be `MONSTER_TRUCK_CAB` — a sub-part with no `container` declared at
// all, so `objectState` falls back to its documented default (`declared?.
// container?.open ?? false`) and the glovebox would never be visible. An
// `{ on: X }` chain has no such gate — `inScopeAt`'s own `'on' in loc`
// branch only checks that `X` is itself in scope, nothing about openness —
// which is exactly right for "a container resting on/built into a
// supporter," and matches the prose doc's own header ("a container on
// `MONSTER_TRUCK_CAB`"). The glovebox's own `container.open: true`
// (permanently — "It drops open on a hinge that has lost its stay," §4.7)
// is what then makes its own contents visible in turn.
//
// NOUN COLLISIONS (§27 wiring item 1's own "four ways now" list, `ids.ts`):
// this room (`jacks_motel`) already has `catan_box` claiming bare "box" and
// "cards" (`objects/jacksMotel.ts`, shipped, unedited per that file's own
// wiring note). The prose doc's own §4.7 noun list gives the glovebox "box"
// and the deck "cards" — both dropped here (kept: everything else the doc
// names) rather than silently leaving two same-room objects fighting over
// one bare noun. "glovebox"/"glove box"/"glove compartment"/"compartment"/
// "dash"/"dashboard" still reach the glovebox unambiguously; "deck"/"deck of
// cards"/"playing cards"/"card box" still reach the deck unambiguously.

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import type { WorldSlice } from '../../game';
import { EXAMINE, OPEN, TAKE } from '../../act1/verbs';
import { MONSTER_TRUCK_CAB } from '../../act1/ids';
import { ACT2_DECK, ACT2_GLOVEBOX, ACT2_MEM_M2_ANALYTICAL, ACT2_MEM_M2_DIRECT, ACT2_MEM_M2_SOCIAL } from '../ids';

const gloveboxText =
  'It drops open on a hinge that has lost its stay and hangs there.\n\nA folded county map with a fold worn through it, a tyre gauge, a socket that belongs to nothing in here, a paper napkin from Pearl\'s, and a deck of cards in a box gone soft at the corners.';

const glovebox: ObjectDefSlice = {
  location: { on: MONSTER_TRUCK_CAB },
  name: 'glovebox',
  container: { open: true, transparent: true },
  portable: false,
  // "box" dropped — see this file's header note on the same-room collision with `catan_box`.
  nouns: ['glovebox', 'glove box', 'glove compartment', 'compartment', 'dash', 'dashboard'],
  handlers: [{ verbs: [EXAMINE, OPEN], effects: [{ say: gloveboxText }] }],
};

const deckExamine =
  'Bicycle backs, red, the box split down one corner and mended with a strip of tape that has aged browner than the box. The cards inside have been shuffled by hand for years: they are dished, every one of them, in the same direction.';

const deckTakeText =
  'They come out of the box in one block, the way a used deck does, and sit in your hand at a weight your hand appears to have been expecting.';

const deckTakeEffects: Effect[] = [{ say: deckTakeText }, { move: [ACT2_DECK, 'inventory'] }];

const deck: ObjectDefSlice = {
  location: { in: ACT2_GLOVEBOX },
  name: 'deck',
  portable: true,
  // "cards" dropped — see this file's header note on the same-room collision with `catan_box`.
  nouns: ['deck', 'deck of cards', 'playing cards', 'card box'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: deckExamine }] },
    { verbs: [TAKE], effects: deckTakeEffects },
  ],
};

export const ACT2_TRUCK_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT2_GLOVEBOX]: glovebox,
  [ACT2_DECK]: deck,
};

// ---------------------------------------------------------------------------
// M2 — *Four Hands* (§14.5–14.7 of the D1 prose doc). Three mutually
// exclusive variants, sharing one title, selected by `profileLeader` at
// grant time — M3's own trigger idiom (`act1/knowledge.ts`, its own header
// comment: "the social variant carries `not: { any: [analytical, direct]
// }` so that a tie fires social"), copied exactly per the prose doc's own
// note above §14.5.
// ---------------------------------------------------------------------------

export const ACT2_M2_MEMORIES: NonNullable<WorldSlice['memories']> = {
  [ACT2_MEM_M2_ANALYTICAL]: {
    title: 'Four Hands',
    lines: [
      'Four hands, because Sissy was too small and got to hold Dad\'s for him and gave the whole thing away with her face every time.\n\nThe inside straight was mine and I knew exactly what it was worth, which is nothing, and I stayed in anyway: there were four cards in that deck that could do it and one of them had already gone by face up in somebody\'s fold, so there were three, and I did that on my fingers under the table.\n\nThen I did it again, because the first answer had been the one I wanted.',
    ],
    trigger: { when: { all: [{ has: ACT2_DECK }, { profileLeader: 'analytical' }, { not: { any: [{ memory: ACT2_MEM_M2_SOCIAL }, { memory: ACT2_MEM_M2_DIRECT }] } }] } },
  },
  [ACT2_MEM_M2_SOCIAL]: {
    title: 'Four Hands',
    lines: [
      'Four hands, and I was not watching the cards. I was watching Jack\'s ears go red, which they do about a full second before he does anything about it, and Luke explaining at length to nobody in particular that he had folded for reasons of strategy.\n\nEli had the best hand at the table and did not know it, and said so out loud, in the manner of a man laying his troubles down among friends.\n\nDad bluffed the lot of us and lost anyway, and enjoyed it more than he would have enjoyed winning, and we all knew that, and it did not help.',
    ],
    trigger: { when: { all: [{ has: ACT2_DECK }, { not: { any: [{ profileLeader: 'analytical' }, { profileLeader: 'direct' }] } }, { not: { any: [{ memory: ACT2_MEM_M2_ANALYTICAL }, { memory: ACT2_MEM_M2_DIRECT }] } }] } },
  },
  [ACT2_MEM_M2_DIRECT]: {
    title: 'Four Hands',
    lines: [
      'Four hands in, Jack came up out of that chair to reach the middle of the table and the chair did not come with him. The back leg went all at once, the way they do, and he went down between the table and the wall with the cards still shut in his fist.\n\nSomebody put a hand out towards the pot and he said, from the floor, without any hurry at all, "don\'t you touch that."\n\nDad laughed until he had to put his head on the table, and Jack got up, and we played the hand out standing.',
    ],
    trigger: { when: { all: [{ has: ACT2_DECK }, { profileLeader: 'direct' }, { not: { any: [{ memory: ACT2_MEM_M2_ANALYTICAL }, { memory: ACT2_MEM_M2_SOCIAL }] } }] } },
  },
};
