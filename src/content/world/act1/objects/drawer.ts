// The jammed third drawer (prose doc §4.5). Canon decision 19: stays shut
// through M1 — jammed, not locked (its own `unlock` response says so). No
// pry tool exists in this room's object list (register entry 19/§13.2), so
// it never opens here; that is the room's deliberate open thread.
//
// `location: { on: DESK }` — same sub-part placement as the other nested
// parts in this room (no open/transparent gating; travels with the desk,
// which never actually moves).

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import { CHAIR_LEG, CLUE_DRAWER_HELD, DESK, DRAWER, FLAG_DRAWER_OPEN } from '../ids';
import { EXAMINE, KICK, OPEN, PRY, PULL, SEARCH, SHAKE, UNLOCK } from '../verbs';

// Wayfinding doc §8, patch 1 — one sentence added, nothing removed (hard
// rule 5, transcribed verbatim). The gouges were already canon and already
// described twice elsewhere in this file; this makes them visible from the
// response the player is most likely to be looking at, without naming the
// tool. Canon 19 (the drawer stays shut) is untouched — nothing about the
// gate changes, only that the refusal now reads as *later*.
export const DRAWER_STUCK_TEXT =
  'The drawer moves an eighth of an inch and stops against itself. The front is bowed, the runner behind it is bent, and between them they have arrived at an arrangement that does not include you. The lip above the gap is chewed pale in three places, which is the shape a drawer front takes when somebody has put something into the gap and leaned on it.';

export const DRAWER_PRY_TEXT = [
  'Somebody has already tried this. The gouges in the drawer’s lip are fresh — pale where the varnish has been lifted, all three of them at the same angle, made by something flat and hard and used with patience rather than force.',
  'They stop just short of working. Whoever it was gave up on this drawer, and gave up on it last, and did not come back for it.',
].join('\n\n');

/**
 * Wave 5, §10.2 — the successful pry, once the chair leg is in hand. The
 * shipped `DRAWER_PRY_TEXT` continues to answer PRY when the player does
 * NOT hold `CHAIR_LEG` (unedited, byte for byte); this is the new rule 1,
 * gated `{ has: CHAIR_LEG }`. Grammar note: `PRY`'s own `verbs.ts` entry
 * now also declares `'V dobj prep iobj'` with prep `with` so "PRY DRAWER
 * WITH LEG" parses at all — but the actual success gate below is `{ has:
 * CHAIR_LEG }`, not a `withInstrument` match, which is what also lets bare
 * "PRY DRAWER" (no instrument named) succeed once the leg is simply held,
 * per the doc's own wiring note.
 */
export const DRAWER_PRY_WITH_LEG_TEXT =
  'You put the taper into the gap the other three went into, and you have one advantage over whoever made them: you do not have to be quiet, and you do not have to be anywhere else afterwards.\n\nIt goes on the fourth. The runner lets go, the drawer front comes with it, and a long splinter stays behind in the desk with the varnish still on one side of it.\n\nEight inches of empty pine, and two things lying in the bottom of it: an envelope, and a book of matches.';

export const DRAWER_KICK_TEXT =
  'You kick it. The desk shifts an inch across the boards, the drawer does not move at all, and two floors down a board takes somebody’s weight and then very deliberately stops.';

export const DRAWER_SHAKE_TEXT = 'Something inside the drawer slides half an inch and stops. Paper does not make that sound.';

const openHandler: Effect[] = [{ say: DRAWER_STUCK_TEXT }];

/**
 * Shared with `objects/desk.ts`'s own PRY handler (§10.2's own wiring note:
 * "same in objects/desk.ts, which routes to it") — one HandlerDef whose
 * `say` is the two-rule prose (leg held / not) and whose other effects
 * branch the same way: holding the leg opens the drawer for real
 * (`FLAG_DRAWER_OPEN`, `setState`), not holding it grants the shipped clue
 * exactly as before. `cash_envelope`/`matchbook` (`objects/closeOut.ts`)
 * are declared `location: { in: DRAWER }` from the start, so opening the
 * container is all that is needed for `TAKE ENVELOPE`/`TAKE MATCHBOOK` to
 * work — no `move` effect required (`engine/world.ts`'s `inScopeAt`).
 */
export const pryHandler: Effect[] = [
  {
    say: [
      { when: { has: CHAIR_LEG }, text: DRAWER_PRY_WITH_LEG_TEXT },
      { text: DRAWER_PRY_TEXT },
    ],
  },
  {
    if: {
      when: { has: CHAIR_LEG },
      then: [{ set: [FLAG_DRAWER_OPEN, true] }, { setState: [DRAWER, 'open', true] }],
      else: [{ grantClue: CLUE_DRAWER_HELD }],
    },
  },
];

const drawer: ObjectDefSlice = {
  location: { on: DESK },
  name: 'drawer',
  nouns: ['drawer'],
  adjectives: ['third', 'bottom', 'jammed'],
  container: { open: false, locked: false },
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [
        {
          say: 'The one drawer that stayed put. The front is bowed outward where somebody worked at it, and the lip is chewed pale in three places by something flat and hard. It stands an eighth of an inch proud of the desk face and it does not stand any prouder.',
        },
        { grantClue: CLUE_DRAWER_HELD },
      ],
    },
    // Wave 5 (§18's wiring table: "OPEN/SEARCH gain a drawer_open rule") —
    // gated to the pre-open state; once `FLAG_DRAWER_OPEN` is true neither
    // entry matches, so OPEN falls through to the built-in container
    // semantics (`open.alreadyOpen`) and SEARCH falls to its own generic
    // `{name}`-templated default family. Doc gives no new authored text for
    // either verb post-open — see this task's report.
    { verbs: [OPEN, PULL], when: { not: { flag: FLAG_DRAWER_OPEN } }, effects: openHandler },
    {
      verbs: [UNLOCK],
      effects: [
        {
          say: 'There is a small brass lock in the drawer front, and it is not the problem. It turns freely under a fingernail. Either it was never locked or it stopped being locked some time before you woke up. Whatever is holding this drawer shut, it is not the lock.',
        },
      ],
    },
    { verbs: [PRY], effects: pryHandler },
    { verbs: [KICK], effects: [{ say: DRAWER_KICK_TEXT }] },
    {
      verbs: [SEARCH],
      when: { not: { flag: FLAG_DRAWER_OPEN } },
      effects: [
        {
          say: 'You get a finger into the eighth of an inch on offer and feel paper. More than one sheet, and something stiffer behind the paper. That is the entire harvest.',
        },
      ],
    },
    { verbs: [SHAKE], effects: [{ say: DRAWER_SHAKE_TEXT }] },
  ],
};

export const DRAWER_OBJECTS: Record<string, ObjectDefSlice> = {
  [DRAWER]: drawer,
};
