// Loose page 7/8 (prose doc §4.7). Canon decision 18: lives in the fedora's
// hatband, revealed by `FEDORA`/`FEDORA_BAND`'s SEARCH/EXAMINE (see
// `fedora.ts`, which `reveal`s it). `location: { on: FEDORA }` — same
// sub-part placement trick as `FEDORA_BAND`, so it travels with the hat
// automatically; `hidden: true` is what actually keeps it out of scope
// until revealed.

import type { Cond } from '../../../../engine/cond';
import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { CLUE_PAGE_INDENTATION, FEDORA, FLAG_LAMP_RIGHTED, FLOOR_LAMP, PAGE_78 } from '../ids';
import { CUT, EXAMINE, PUT_IN, READ, RUB, SMELL, TAKE } from '../verbs';
import { V_HOLD_TO_LAMP, V_TURN_OVER } from '../ids';
// D1 mirror handlers (Stage D plan §2; prose doc §13.6, §27) — the loose
// page's own two-object commands. `ACT2_NOTEBOOK_FIT_EFFECTS`'s primary
// declaration is `act2/objects/notebook.ts` (dobj=notebook, iobj=page,
// reversed phrasing); this file's copy answers the natural phrasing
// ("FIT PAGE IN NOTEBOOK" / "PUT PAGE IN NOTEBOOK" / "COMPARE PAGE WITH
// NOTEBOOK", dobj=page, iobj=notebook — `findHandler`, `actions.ts`,
// dispatches on the resolved DOBJ only). `RUB PAGE WITH PENCIL` has no
// natural reversed form at all (nobody rubs a bound notebook with a loose
// page), so this is its *only* declaration, not a mirror of one on the
// notebook — see `objects/notebook.ts`'s own header note.
import { NOTEBOOK_FIT_EFFECTS } from '../../act2/objects/notebook';
import { ACT2_CLUE_INDENTED_CREDENTIALS, ACT2_NOTEBOOK, ACT2_PAGE_RUBBED, ACT2_PENCIL, V_FIT } from '../../act2/ids';

const RAKING_LIGHT_TEXT = [
  'A single sheet, torn along one edge where it left whatever it was part of, folded and unfolded enough times to have gone soft at the creases.',
  'One side carries a small 7 in the top corner. The other carries an 8. Between the two numbers, on both sides, alone in all that white:\n\n    THIS PAGE INTENTIONALLY LEFT BLANK\n\nSomebody paid for the paper, the ink, and the press run required to say that.',
  'Then you tilt it, and in the lamp’s low sideways light the page stops being blank. The whole surface is crossed with faint valleys and ridges — the pressed ghost of somebody’s handwriting, carried through from a sheet that was lying on top of this one while they wrote. The light is not good enough to read it. Neither, at the moment, are you.',
].join('\n\n');

const PLAIN_TEXT = [
  'A single sheet, torn along one edge where it left whatever it was part of, folded and unfolded enough times to have gone soft at the creases.',
  'One side carries a small 7 in the top corner. The other carries an 8. Between the two numbers, on both sides, alone in all that white:\n\n    THIS PAGE INTENTIONALLY LEFT BLANK\n\nSomebody paid for the paper, the ink, and the press run required to say that.',
].join('\n\n');

const RAKING_LIGHT_COND: Cond = { all: [{ has: PAGE_78 }, { objectState: [FLOOR_LAMP, 'on', true] }, { not: { flag: FLAG_LAMP_RIGHTED } }] };

const examine: ProseRule[] = [
  { when: RAKING_LIGHT_COND, text: RAKING_LIGHT_TEXT },
  { text: PLAIN_TEXT },
];

const examineEffects: Effect[] = [
  { say: examine },
  { if: { when: RAKING_LIGHT_COND, then: [{ grantClue: CLUE_PAGE_INDENTATION }] } },
];

const holdToLamp: ProseRule[] = [
  { when: { all: [{ objectState: [FLOOR_LAMP, 'on', true] }, { not: { flag: FLAG_LAMP_RIGHTED } }] }, text: RAKING_LIGHT_TEXT },
  {
    when: { objectState: [FLOOR_LAMP, 'on', true] },
    text: 'You hold the page up under the lamp. It is thoroughly, evenly lit, and thoroughly, evenly blank.',
  },
  {
    text: 'You hold a piece of paper up in the dark, which is one of those actions that seems reasonable right up until the moment of doing it.',
  },
];

const page78: ObjectDefSlice = {
  location: { on: FEDORA },
  name: 'page',
  nouns: ['page', 'sheet', 'paper', 'seven', 'eight'],
  adjectives: ['loose', 'blank'],
  portable: true,
  hidden: true,
  description: examine,
  handlers: [
    { verbs: [EXAMINE, READ], effects: examineEffects },
    { verbs: [V_TURN_OVER], effects: [{ say: 'You turn it over. Page 8 declines to be any different from page 7.' }] },
    { verbs: [V_HOLD_TO_LAMP], withInstrument: [FLOOR_LAMP], effects: [{ say: holdToLamp }] },
    // D1 mirror (§13.6) — "FIT PAGE IN NOTEBOOK" / "PUT PAGE IN NOTEBOOK" /
    // "COMPARE PAGE WITH NOTEBOOK" (dobj=page, iobj=notebook). Primary copy
    // (reversed phrasing) is `act2/objects/notebook.ts`.
    { verbs: [V_FIT, PUT_IN], withInstrument: [ACT2_NOTEBOOK], effects: NOTEBOOK_FIT_EFFECTS },
    // "RUB PAGE WITH PENCIL" (§13.6, R4's rubbing) — checked before the
    // bare/no-instrument RUB refusal below, since that handler's own
    // `withInstrument` is `undefined` ("don't care") and would otherwise
    // win first regardless of `iobj` (`actions.ts`'s `findHandler` takes
    // the first array match).
    {
      verbs: [RUB],
      withInstrument: [ACT2_PENCIL],
      effects: [
        {
          say:
            'You put the sheet flat on the edge of the shelf, which is the flattest thing in this corridor, and take the pencil out from under the band, and lay the lead over on its side, and go at the page the way a child goes at a coin.\n\nThe valleys come up white out of the grey. Not all of it. Enough of it:\n\n    admin admin-password\n\n    W.D. — hold — 4417\n\nBelow that, three more lines that the graphite finds and cannot make into words, and one that is not words at all: a short row of small marks, evenly spaced, that were made by a person doing something deliberate.',
        },
        { set: [ACT2_PAGE_RUBBED, true] },
        { grantClue: ACT2_CLUE_INDENTED_CREDENTIALS },
      ],
    },
    {
      verbs: [RUB],
      effects: [
        {
          say: 'Rubbing at it with a fingertip achieves a slightly warmer piece of paper. What this wants is graphite and a flat surface, and this room has offered you one dead pen and a floor.',
        },
      ],
    },
    { verbs: [TAKE], effects: [{ say: 'You take the page. It weighs nothing.' }, { move: [PAGE_78, 'inventory'] }] },
    { verbs: [SMELL], effects: [{ say: 'Paper, felt, and hatband. It has been in that hat a long time.' }] },
    {
      verbs: [CUT],
      effects: [
        {
          say: 'It has been folded into quarters and unfolded and folded again by somebody who wanted it to keep being a thing that fits in a hatband. You do not improve on that arrangement.',
        },
      ],
    },
  ],
};

export const PAGE78_OBJECTS: Record<string, ObjectDefSlice> = {
  [PAGE_78]: page78,
};
