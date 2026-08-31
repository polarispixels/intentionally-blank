// Wall Drug — the cache's five non-notebook objects (D1 prose doc §12; the
// notebook itself, and its three sub-parts, are `objects/notebook.ts`). All
// `location: 'nowhere'` until `OPEN BOX` moves them `{ in: act2_cache_box }`
// (same "not yet in the world" idiom `act1/objects/nolansYard.ts`'s own
// `wallDrugCup`/`pillBottle` already use) — `act2_cache_box`'s own OPEN
// handler (`objects/wallDrugBackCorridor.ts`) is what actually places them.
// `plotCritical: true` on all five except the pencil (§12.4's own note —
// register entry 50, the cache's one tool rather than evidence) and the
// returned letter, per §27's wiring summary row.

import type { ObjectDefSlice } from '../../../../engine/world';
import { EXAMINE, OPEN, PUT_IN, READ, SMELL, TASTE } from '../../act1/verbs';
import { ACT2_CACHE_POLAROID, ACT2_CLUE_RETURNED_LETTER, ACT2_CLUE_STRANGER_IN_HAT, ACT2_FILM_CANISTER, ACT2_PENCIL, ACT2_RETURNED_LETTER, ACT2_USB, ACT2_WD_TERMINAL, V_FIT } from '../ids';

// ---------------------------------------------------------------------------
// §12.2 — the USB
// ---------------------------------------------------------------------------

const usbExamine =
  'In a small plastic bag folded over twice and creased flat, the way you fold a bag when you expect somebody else to unfold it.\n\nOut of the bag it is a memory stick with a metal shell and a plastic end, and the metal is scuffed the way a thing gets in a pocket over years rather than in a box over months.\n\nOn a strip of masking tape wrapped round it, in marker, in a hand that pressed hard:\n\n    DAD\n    DO NOT FORMAT';

const usbPutInTerminalText = 'It goes in. Nothing happens, because nothing in this corridor has anywhere to send electricity.';

const usbSmellText = 'Plastic, and the inside of somebody\'s pocket. It has been carried a great deal more than it has been stored.';

// Exported (a mechanical addition, not a content change — this task's own
// module still owns every string/handler above) so `objects/usb.ts` (task
// A's own module) can mutate its `handlers` array in place, the same
// "amend a concurrent task's already-declared object" idiom `act2/verbs.ts`
// already uses for `RUB`/`ACT1_VERBS` and `act2/index.ts`'s own header
// documents for room `handlers` arrays — Your Room's terminal dock (D1
// prose doc §21) needs a second `PUT_IN`/`withInstrument` handler on this
// SAME object, and `actions.ts`'s `findHandler` only ever consults one
// `world.objects[dobj].handlers` array, so the two tasks' handlers must
// live on one object, not two competing declarations of `act2_usb`.
export const usb: ObjectDefSlice = {
  location: 'nowhere',
  name: 'memory stick',
  nouns: ['usb', 'stick', 'memory stick', 'drive', 'thumb drive', 'flash drive', 'bag'],
  portable: true,
  plotCritical: true,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: usbExamine }] },
    // "put usb in terminal" — Wall Drug's own dead terminal; Your Room's dock is D2's own amendment.
    { verbs: [PUT_IN], withInstrument: [ACT2_WD_TERMINAL], effects: [{ say: usbPutInTerminalText }] },
    { verbs: [SMELL, TASTE], effects: [{ say: usbSmellText }] },
  ],
};
// M6 fires on `{ has: ACT2_USB }` — declared as a trigger in `knowledge.ts`, no handler-side effect needed here.

// ---------------------------------------------------------------------------
// §12.3 — the film canister
// ---------------------------------------------------------------------------

const filmCanisterExamine =
  'The grey plastic sort, with a grey lid, and a wrap of masking tape round the join to keep it shut.\n\nNothing is written on the tape. Nothing is written on the canister. Shaking it gets you the small dead shift of a roll of thirty-five-millimetre film with the leader wound in, which means it has been shot and not developed.\n\nThat is the whole of what this object is prepared to tell you.';

const filmCanisterOpenText = 'Undeveloped film in a lit corridor lasts about as long as it takes to say so.\n\nYou put your thumbnail under the tape, and then you take it out again.';

const filmCanister: ObjectDefSlice = {
  location: 'nowhere',
  name: 'film canister',
  nouns: ['canister', 'film', 'roll', 'film canister', 'cannister', 'tin', 'tub', 'tape'],
  portable: true,
  plotCritical: true,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: filmCanisterExamine }] },
    { verbs: [OPEN], effects: [{ say: filmCanisterOpenText }] },
  ],
};

// ---------------------------------------------------------------------------
// §12.4 — the pencil (register entry 50 — a tool, not evidence; NOT plotCritical)
// ---------------------------------------------------------------------------

const pencilExamine =
  'Under the rubber band, along the spine of the notebook where it has worn a shine into the cloth: a pencil, half its life gone, sharpened with a knife rather than a sharpener — six flat facets round the lead and a nick in one of them where the blade slipped.\n\nThe lead is soft. Somebody chose it soft.';

const pencil: ObjectDefSlice = {
  location: 'nowhere',
  name: 'pencil',
  nouns: ['pencil', 'stub', 'lead', 'graphite'],
  portable: true,
  handlers: [{ verbs: [EXAMINE], effects: [{ say: pencilExamine }] }],
};

// ---------------------------------------------------------------------------
// §12.5 — the returned letter (NOT plotCritical, per §27's own wiring row)
// ---------------------------------------------------------------------------

const returnedLetterExamine =
  'A plain envelope, stamped, with the address written in a hand you have seen this week on the back of a photograph and on the cover of a folder: square capitals, pressed hard, the L\'s finished with a separate stroke.\n\nIt is addressed to a man at the plant, care of the plant, which is what you do when you do not have a home address for your own brother.\n\nAcross the front, in red, at an angle, a machine has said:\n\n    RETURN TO SENDER\n    NO SUCH ADDRESSEE\n\nIt is still sealed.\n\nIt was in this box, under everything else, which means it went back to the man who sent it, and then it came here, and to do that it had to be given by one brother to the other and then hidden.';

const returnedLetterOpenText =
  'It is Jack\'s, and it is sealed, and he is thirty-two miles away at a counter being the person nobody looks at.\n\nYou put it in your pocket to give back to him, which is a decision you will have to make again later and will make differently.';

const returnedLetter: ObjectDefSlice = {
  location: 'nowhere',
  name: 'returned letter',
  nouns: ['letter', 'envelope', 'mail', 'post', 'return', 'stamp'],
  portable: true,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: returnedLetterExamine }, { grantClue: ACT2_CLUE_RETURNED_LETTER }] },
    { verbs: [OPEN, READ], effects: [{ say: returnedLetterOpenText }] },
  ],
};
// M14 fires on `{ has: ACT2_RETURNED_LETTER }` — declared as a trigger in `knowledge.ts`.

// ---------------------------------------------------------------------------
// §12.6 — the cache Polaroid (L11 — never says the player recognizes him)
// ---------------------------------------------------------------------------

const cachePolaroidExamine =
  'Face down in the box, which is how you put a photograph in a box when you know what is on it.\n\nA man on a gravel apron with a chain-link fence behind him and, behind the fence, a low white building and a great deal of sky. He is in a grey felt fedora with the brim down on one side. He is squinting slightly and he has got one hand up, not waving — telling whoever is holding the camera to get on with it.\n\nWide face. Heavy jaw. Grey coming in at one temple. Short-sleeved shirt, and a watch with a square face on the near wrist.\n\nNothing is written on the back.';

const cachePolaroidCompareText =
  'Grey felt. The brim comes down on the same side, because it is the same brim: a hat takes that from the hand that takes it off, over years, and it does not take it from anybody else.';

const cachePolaroid: ObjectDefSlice = {
  location: 'nowhere',
  name: 'Polaroid from the box',
  nouns: ['polaroid', 'photo', 'photograph', 'picture', 'print', 'snap'],
  portable: true,
  plotCritical: true,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: cachePolaroidExamine }, { grantClue: ACT2_CLUE_STRANGER_IN_HAT }] },
    { verbs: [V_FIT], effects: [{ say: cachePolaroidCompareText }] },
  ],
};

export const ACT2_CACHE_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT2_USB]: usb,
  [ACT2_FILM_CANISTER]: filmCanister,
  [ACT2_PENCIL]: pencil,
  [ACT2_RETURNED_LETTER]: returnedLetter,
  [ACT2_CACHE_POLAROID]: cachePolaroid,
};
