// Wall Drug — the notebook (D1 prose doc §13), `location: 'nowhere'` until
// `OPEN BOX` moves it `{ in: act2_cache_box }` (see `objects/cache.ts`'s own
// header for the idiom). `plotCritical: true` (§27's wiring row — all six
// cache objects except the pencil and the returned letter).
//
// `text` (READ's own field, §2.5) carries the three-layer `ProseRule[]`
// (§13.2); a custom `READ`/`OPEN` handler is used instead of leaving it to
// the built-in READ fallback, because the first read also has to set
// `act2_read_notebook` (M5's trigger) — the built-in only ever renders
// text, it cannot run a second effect.
//
// `RUB PAGE WITH PENCIL` (§13.6) is NOT declared here: its only sensible
// direct object is the loose page (`act1_page_78`), never the bound
// notebook, so the handler lives on `act1/objects/page78.ts` (mirrored,
// `withInstrument: [act2_pencil]`) — see that file's own note.

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { PAGE_78 } from '../../act1/ids';
import { BURN, CUT, EXAMINE, OPEN, PUT_IN, READ } from '../../act1/verbs';
import {
  ACT2_CLUE_CREDENTIALS,
  ACT2_CLUE_PAGE_FITS,
  ACT2_MEM_M5,
  ACT2_NOTEBOOK,
  ACT2_NOTEBOOK_BACK_COVER,
  ACT2_NOTEBOOK_GAP,
  ACT2_NOTEBOOK_MARGIN,
  ACT2_Q_HOW_WAS_IT_HERE,
  ACT2_READ_NOTEBOOK,
  ACT2_READ_NOTEBOOK_MARGIN,
  ACT2_SHORTHAND_DECODED,
  V_FIT,
} from '../ids';

// ---------------------------------------------------------------------------
// §13.1 — examine
// ---------------------------------------------------------------------------

const notebookExamine =
  'Hard covers in black cloth, the size of a hand, the corners gone round and soft. A rubber band round it that died some time ago and has taken the permanent shape of the job.\n\nThe spine has a shine on it where the pencil rides. The fore-edge is grey with handling for the first two thirds and clean for the last third, and the clean part is where a man stopped.';

// ---------------------------------------------------------------------------
// §13.2 — read/open, the three layers (rule order: decoded -> M5 -> opaque)
// ---------------------------------------------------------------------------

const decodedText =
  "With the shorthand broken it stops being a wall and starts being a man's week, over and over, for two thirds of a book: valves, bearings, a door that sticks, a contractor who does not come.\n\nAnd then, from about the middle, the other kind of line, in among the valves, never once flagged or underlined or set apart:\n\n    B4 corridor is 41' longer inside than on plans.\n\n    Why is there a second chilled-water return?\n\n    Sublevel 6 drawing does not exist.\n\n    Asked Nolan. Says there is no Sublevel 6.\n\n    I HAVE BEEN ON SUBLEVEL 6.\n\nThe last of those is the only thing in the entire book written in capitals, and the pencil went through the paper on the S.";

const partlyDecodedText =
  'It is still mostly shorthand, and you are still mostly not reading it — but about one line in three now arrives whole, the way a language you once had comes back at you sideways:\n\n    Cooling loop 7B vibration\n    Replace actuator - south manifold\n    Badge reader B4 intermittent\n    Generator inspection 0700\n\nOrdinary. All of it ordinary. And then a line you can read every character of and cannot do anything with:\n\n    Asked Nolan. Says there is no Sublevel 6.\n\nThe rest of that page is shorthand and the shorthand on it is smaller and faster than the shorthand on the page before.';

const opaqueText =
  'It is written in a facilities shorthand by somebody who never expected to have to explain it, and a page of it looks like this:\n\n    7B vib — 3rd time. chk brg tmp @ p4 nights\n    s.man act — recd, not fitted, ask G\n    Badge reader B4 intermittent\n    tkt 2214 — 2231 — 2244, all cleared, all no fault fnd\n    Asked Nolan. Says there is no Sublevel 6.\n\nTwo lines in every dozen are English. The rest is a man writing to the only person who was ever going to read it.';

const notebookText: ProseRule[] = [
  { when: { flag: ACT2_SHORTHAND_DECODED }, text: decodedText },
  { when: { memory: ACT2_MEM_M5 }, text: partlyDecodedText },
  { text: opaqueText },
];

const readEffects: Effect[] = [{ say: notebookText }, { set: [ACT2_READ_NOTEBOOK, true] }];

// ---------------------------------------------------------------------------
// §13.6 — the handlers (FIT/PUT IN/COMPARE, primary copy — the mirror,
// natural-phrasing copy is on `act1/objects/page78.ts`; BURN; TEAR/CUT/EAT)
// ---------------------------------------------------------------------------

const fitText =
  'You open the book to the gap and lay the loose sheet in against the stub.\n\nSame paper. Same faint blue rule, at the same spacing. Same width, to the thickness of the line you would draw round it.\n\nAnd the tear is one tear. Every tooth of it goes into every tooth of the stub along the whole length, and where it ran wide of a bead of glue at the top, the sheet runs wide of it too, in the same curve, in the same place.\n\nPage 6. Then the sheet: 7, and 8. Then 9.\n\nIt goes back into the gap as though it had been asked to.';

export const NOTEBOOK_FIT_EFFECTS: Effect[] = [{ say: fitText }, { grantClue: ACT2_CLUE_PAGE_FITS }, { openQuestion: ACT2_Q_HOW_WAS_IT_HERE }];

const burnText =
  'You have a motel matchbook with every match still in it, and a notebook that a man hid in a corridor at some cost, in the last week anybody in this county can account for him.\n\nThe match stays in the book. Whatever else this is, it is the only copy.';

const tearCutText = 'Somebody already took one leaf out of this and you have spent the night proving what that cost. You are not going to be the second person.';

const notebook: ObjectDefSlice = {
  location: 'nowhere',
  name: 'notebook',
  // "log" deliberately dropped from the doc's own noun list (builder
  // decision, flagged in this task's report): `V_TYPE_TERMINAL`'s own bare
  // word "log" (act1/ids.ts) already collides with it, adding a new
  // `verb-noun-collision` warning `tests/world-act1.test.ts` counts
  // exactly — "journal"/"diary"/"jotter"/"notebook" already cover the word.
  nouns: ['notebook', 'note book', 'book', 'journal', 'diary', 'jotter', 'notes', 'band', 'elastic', 'rubber band'],
  portable: true,
  plotCritical: true,
  description: notebookExamine,
  text: notebookText,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: notebookExamine }] },
    { verbs: [READ, OPEN], effects: readEffects },
    // Primary copy — "FIT NOTEBOOK WITH PAGE"/"COMPARE NOTEBOOK WITH PAGE"
    // (dobj=notebook, iobj=page); the natural-phrasing mirror
    // ("FIT PAGE IN NOTEBOOK"/"PUT PAGE IN NOTEBOOK"/"COMPARE PAGE WITH
    // NOTEBOOK", dobj=page, iobj=notebook) is on `page78.ts`.
    { verbs: [V_FIT, PUT_IN], withInstrument: [PAGE_78], effects: NOTEBOOK_FIT_EFFECTS },
    { verbs: [BURN], effects: [{ say: burnText }] },
    { verbs: [CUT], effects: [{ say: tearCutText }] },
    // "EAT NOTEBOOK" is deliberately not wired — the engine has no generic
    // dobj-taking EAT verb (`V_EAT`'s own pattern is bare `'V'` only, the
    // diner's easter egg; extending it would leak that diner-specific
    // fallback text onto every unhandled "EAT <x>" in the game). Flagged in
    // this task's report rather than mutated in place, unlike `RUB`'s
    // pattern extension (act2/verbs.ts), because that mutation risks a
    // wrong-context default bleeding across every room, not just adding a
    // capability.
  ],
};

// ---------------------------------------------------------------------------
// §13.3 — the back cover (credentials — printed here, and again by the
// rubbing on page78.ts; canon requires both, §26 quarantines a single-
// printing variant not wired in this build)
// ---------------------------------------------------------------------------

const backCoverText =
  'Inside the back cover, in pencil, in a hand doing its best to be legible for once:\n\n    admin\n    admin-password\n\nThat is all that is written in there. It is written the way you write down something you have just been handed and do not intend to be told twice.';

const notebookBackCover: ObjectDefSlice = {
  location: { on: ACT2_NOTEBOOK },
  name: 'back cover',
  nouns: ['back cover', 'cover', 'inside cover', 'back', 'endpaper'],
  portable: false,
  handlers: [{ verbs: [EXAMINE, READ], effects: [{ say: backCoverText }, { grantClue: ACT2_CLUE_CREDENTIALS }] }],
};

// ---------------------------------------------------------------------------
// §13.4 — the gap (the torn stubs)
// ---------------------------------------------------------------------------

const gapText =
  'One leaf has been torn out, close in to the stitching, by somebody who took their time about it: the stub is even for its whole length and the stitching is not pulled anywhere.\n\nThe page before the gap carries a small 6 in the corner.\n\nThe page after it carries a 9.';

const notebookGap: ObjectDefSlice = {
  location: { on: ACT2_NOTEBOOK },
  name: 'gap',
  nouns: ['gap', 'stubs', 'stub', 'torn pages', 'missing pages', 'tear', 'stitching', 'spine'],
  portable: false,
  handlers: [{ verbs: [EXAMINE], effects: [{ say: gapText }] }],
};

// ---------------------------------------------------------------------------
// §13.5 — the margin doodle (M12's half-trigger)
// ---------------------------------------------------------------------------

const marginText =
  'Low in the margin of a page otherwise given over to a schedule of valve positions, in the same pencil, boxed, and gone over so many times that the box has a groove in it:\n\n    NOUMENA?\n\nThe question mark has been gone over hardest.';

const notebookMargin: ObjectDefSlice = {
  location: { on: ACT2_NOTEBOOK },
  name: 'doodle',
  nouns: ['doodle', 'margin', 'drawing', 'scribble', 'word'],
  portable: false,
  handlers: [{ verbs: [EXAMINE, READ], effects: [{ say: marginText }, { set: [ACT2_READ_NOTEBOOK_MARGIN, true] }] }],
};

export const ACT2_NOTEBOOK_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT2_NOTEBOOK]: notebook,
  [ACT2_NOTEBOOK_BACK_COVER]: notebookBackCover,
  [ACT2_NOTEBOOK_GAP]: notebookGap,
  [ACT2_NOTEBOOK_MARGIN]: notebookMargin,
};
