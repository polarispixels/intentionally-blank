// The County Library (Records Annex) — the room's six objects
// (`docs/superpowers/specs/2026-09-04-act1-wave3-prose.md` §9). Prose
// transcribed exactly (hard rule 5); the object/sub-part split and verb
// wiring are this builder's own calls, following the established
// "which noun word resolved" idiom (`objects/postOffice.ts`'s own header).
//
// Noun-list trims, all builder calls, not the spec's (see this task's
// report): `sign_in_book` drops the spec's own "log" and "year" nouns.
// "log" collides with `V_TYPE_TERMINAL`'s own word "log in" (a bare-typeable
// verb, per `validate.ts`'s verb-noun-collision rule) and "year" collides
// the same way with `V_WHAT_YEAR`'s own words — neither noun has an authored
// response of its own to lose ("logbook" and the whole EXAMINE text still
// cover the same ground), so both are dropped rather than accepted as new
// warnings, matching this file's own precedent for "wall"/"dust"/"light"/
// "hand"/"stairs" elsewhere in this codebase. `sign_in_book` also drops
// "page" (a genuine resolver bug, not just a validator warning: it shares
// that noun with `microfiche_reader_screen`, and "EXAMINE PAGE" is one of
// §9.1's own required trigger phrases — left in on both sides, it forces a
// clarify prompt instead of resolving to the reader). `catalogue_terminal`
// similarly drops "screen" (shared with `microfiche_reader_screen`, same
// clarify-prompt bug on "READ SCREEN") — "monitor" still answers for it.
// Both drops are noted again at each object's own declaration, below.

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import { USE_VERB_ID } from '../../../../engine/move';
import { EXAMINE, LOOK_UNDER, OPEN, PRY, READ, readCardsText, SEARCH, TURN, typeReclamationText, UNLOCK } from '../verbs';
import {
  CARD_CATALOGUE,
  CATALOGUE_TERMINAL,
  CHAIR_LEG,
  CLUE_DEAD_CROSS_REFERENCE,
  CLUE_RECORD_RANGE,
  CLUE_TERMINAL_NO_CROSSREFS,
  COUNTY_LIBRARY,
  COUNTY_LIBRARY_NO_EXIT_GATE,
  DARKROOM_DOOR,
  FICHE_DRAWERS,
  FICHE_DRAWERS_REELS,
  FLAG_READ_LEFT_FRAME,
  FLAG_SIGNED_THE_BOOK,
  MICROFICHE_READER,
  MICROFICHE_READER_SCREEN,
  SIGN_IN_BOOK,
  V_KNOCK,
  V_SIGN,
} from '../ids';
// D2-B — the two new reels (Stage D plan §2 D2 "County Library — the film";
// prose doc 2026-09-10-stage-d2-prose.md PART SEVEN, §19).
import {
  ACT2_CLUE_SERVICE_TUNNEL,
  ACT2_CLUE_TRANSCRIPT_CHANGED,
  ACT2_DAD_TOLD_HEARING,
  ACT2_KNOWS_TUNNEL_MOUTH,
  ACT2_REEL_2029_2031,
  ACT2_REEL_2029_2031_MAP,
  ACT2_REEL_HEARING,
  V_FIT,
  V_THREAD,
} from '../../act2/ids';
// Stage E2, task Q — the annex shelf, the darkroom key, and the darkroom
// door's three new handlers (`docs/superpowers/specs/2026-09-19-stage-e2-
// prose.md` §42, §43; this file's own header rule: only the ids are
// namespaced `act4_*` here, the shelf/key/door live physically in this
// room's own object list, same precedent as `act4_crews`/`act4_visit_
// notice` in `objects/mainStreet.ts`/`objects/postOffice.ts`).
import { ACT4_ANNEX_SHELF, ACT4_DARKROOM_KEY, ACT4_DARKROOM_OPEN } from '../../act4/ids';

// ---------------------------------------------------------------------------
// §9.1 — The reader
// ---------------------------------------------------------------------------

const readerExamine =
  'A grey steel machine the size of a sewing table: a lamp under the stage, a mirror above throwing the image up onto ground glass, a crank for winding, a knob for focus.\n\nThere is a reel on the spindle, half wound off, and the lamp is on. The page on the screen is four feet wide and perfectly readable, and there is nobody in this room but you.';

const readScreenText =
  'Page six, which is where a county newspaper keeps what it cannot sell. Advertisements for implements. A card of thanks from a family after a funeral, naming everybody who brought food.\n\nThe rest is a standing feature called FIFTY YEARS AGO THIS WEEK, in which the paper reprints itself. Three items. A bridge opened. A school burned. A man walked from the courthouse to the river with a forked stick and found water exactly where the county engineer had already put the pipe.\n\nThe carriage is stopped square on that third item, centred, the way a machine is left when somebody has been reading one thing for a while.';
const readScreenEffects: Effect[] = [{ say: readScreenText }, { set: [FLAG_READ_LEFT_FRAME, true] }];

const turnCrankText =
  'The page slides off sideways and the paper goes by: columns without words at that speed, photographs passing like weather. Every so often the run of it changes character — the type gets smaller, the advertisements get more confident, the photographs learn what a photograph is for.\n\nYou could spend the night at this. You have nothing to look for yet, and the machine does not care.';

const microficheReader: ObjectDefSlice = {
  location: COUNTY_LIBRARY,
  name: 'reader',
  portable: false,
  // "screen"/"ground glass"/"glass"/"page"/"newsprint"/"newspaper" moved to the sub-part below.
  nouns: ['reader', 'machine', 'microfiche', 'fiche', 'microfilm', 'film', 'reel', 'spool', 'lamp', 'bulb', 'crank', 'handle', 'knob', 'focus', 'carriage', 'stage'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: readerExamine }] },
    { verbs: [TURN, SEARCH, READ, USE_VERB_ID], effects: [{ say: turnCrankText }] },
  ],
};

const microficheReaderScreen: ObjectDefSlice = {
  location: { on: MICROFICHE_READER },
  name: 'screen',
  portable: false,
  nouns: ['screen', 'ground glass', 'glass', 'page', 'newsprint', 'newspaper'],
  handlers: [{ verbs: [EXAMINE, READ], effects: readScreenEffects }],
};

// ---------------------------------------------------------------------------
// §9.2 — The drawer bank
// ---------------------------------------------------------------------------

const drawerBankExamine =
  "Forty-two drawers, four ranks high, each with a card behind a brass window. The county's paper — minutes, deeds, the newspaper — on film, filed by span rather than by subject.\n\nThe first card says 1878–1884, in a copperplate hand that thinks well of itself. They go across the wall getting less ornamental and more efficient: six years to a drawer, then four, then two, then one.\n\nThe last drawer in the bottom rank says 2036–2039. After it the rail carries on for six more drawers' worth and holds nothing.";
const drawerBankExamineEffects: Effect[] = [{ say: drawerBankExamine }, { grantClue: CLUE_RECORD_RANGE }];

const openDrawerText =
  'Flat tin reels on edge in slots, forty to a drawer, each with a paper label on the hub. Cool to the hand. The drawer runs out and stops with a sound somebody engineered.\n\nNothing in here is locked and nothing ever needed to be.';

const ficheDrawers: ObjectDefSlice = {
  location: COUNTY_LIBRARY,
  name: 'drawer bank',
  portable: false,
  // "reels"/"tin" moved to the sub-part below.
  nouns: ['drawers', 'drawer', 'bank', 'steel', 'cabinet', 'wall', 'labels', 'label', 'index', 'records', 'county records', 'spans', 'rail'],
  handlers: [
    { verbs: [EXAMINE], effects: drawerBankExamineEffects },
    { verbs: [OPEN, SEARCH], effects: [{ say: openDrawerText }] },
  ],
};

// Singular "reel" dropped from this sub-part's own noun list (a builder
// call, not the spec's): `microfiche_reader`'s own singular "reel" (the one
// on the spindle) is a §9.1 required trigger word ("WIND REEL"), and the
// engine's own noun-phrase grammar always resolves a bare noun with no
// object-unique adjective to whichever single object owns it — two objects
// sharing it forces a clarify prompt instead. Plural "reels" (this sub-
// part's own §9.2 required trigger word, "EXAMINE REELS") stays unique to
// this sub-part; nothing here needed the singular.
const ficheDrawersReels: ObjectDefSlice = {
  location: { on: FICHE_DRAWERS },
  name: 'reels',
  portable: false,
  nouns: ['reels', 'tin'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: openDrawerText }] }],
};

// ---------------------------------------------------------------------------
// §9.3 — The card catalogue
// ---------------------------------------------------------------------------

const catalogueExamine =
  'Sixty little drawers in oak with brass pulls, and a rod down through each one so nobody in a hurry can take a card out. Where a label has been retyped the new slip is pasted over the old and the old one shows at the corner.\n\nA subject index, made by hand, by somebody who meant it to outlive them.';

// `readCardsText` lives in `verbs.ts` (also `V_LOOK_UP_SUBJECT`'s own bare
// `default` there — see that verb's own comment for why); re-combined with
// this object's own clue here, and re-exported so `countyLibrary.ts`'s
// room-level handler for that bare verb reuses this exact effects array
// rather than a second, drifting copy.
export const readCardsEffects: Effect[] = [{ say: readCardsText }, { grantClue: CLUE_DEAD_CROSS_REFERENCE }];

// "card drawer"/"catalogue drawer" dropped from this object's own noun list
// (a builder call, not the spec's): the parser's own noun-phrase grammar
// (`grammar.ts`'s `toPhrase`) always takes the LAST word of a dobj phrase as
// the noun and everything before it as adjectives — it never tries a
// multi-word tail as one compound noun — so "OPEN CARD DRAWER" would parse
// as noun "drawer" (already `fiche_drawers`'s own, required-unique word,
// §9.2) plus an adjective "card" this object never declares, and resolve to
// the WRONG drawer bank rather than a clarify prompt (adjectives that match
// nothing degrade gracefully to a bare-noun match, per `resolver.ts`'s own
// documented ranking). "OPEN CARD DRAWER" is wired below instead as one more
// literal word on the bare `V_LOOK_UP_SUBJECT` verb (`verbs.ts`) — same
// idiom as that verb's own "LOOK UP SUBJECT" — so the whole phrase matches
// before the grammar ever tries splitting it into noun+adjective.
const cardCatalogue: ObjectDefSlice = {
  location: COUNTY_LIBRARY,
  name: 'card catalogue',
  portable: false,
  nouns: ['catalogue', 'catalog', 'card catalogue', 'cards', 'card', 'cabinet', 'oak', 'index', 'subject', 'subjects', 'heading', 'headings', 'tray', 'rod', 'pull', 'pulls'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: catalogueExamine }] },
    { verbs: [READ, SEARCH, OPEN], effects: readCardsEffects },
  ],
};

// ---------------------------------------------------------------------------
// §9.4 — The catalogue terminal
// ---------------------------------------------------------------------------

const terminalExamine =
  "A flat screen on a stand, a keyboard with the letters worn off four keys, a mouse on a mat that says COUNTY OF something the mat has stopped saying.\n\nThe screen is awake, showing a search box and a cursor. No password. No name in the corner. It is the county's catalogue, and it has decided you are the public.";

// `typeReclamationText` lives in `verbs.ts` (also `V_TYPE_RECLAMATION`'s own
// bare `default` there); re-combined with this object's own clue here, and
// re-exported for `countyLibrary.ts`'s own room-level handler — see this
// file's own comment on `readCardsEffects`.
export const typeReclamationEffects: Effect[] = [{ say: typeReclamationText }, { grantClue: CLUE_TERMINAL_NO_CROSSREFS }];

// "screen" dropped from this object's own noun list (a builder call, not the
// spec's — see this file's own header comment): the microfiche reader's own
// screen (`MICROFICHE_READER_SCREEN`) already claims it, and the two are in
// the same room, so a bare "screen" would otherwise force a clarify prompt
// on every "READ SCREEN" — the reader's own required §9.1 action — instead
// of resolving straight to the newspaper text. "monitor" still answers for
// this object's own screen; `checkObjectNounCollisions` never caught this
// because `MICROFICHE_READER_SCREEN` is a nested sub-part, outside that
// rule's own stated scope (`validate.ts`'s own doc comment on it). "search"
// is also dropped (a third builder call): it isn't needed for any handler
// here (SEARCH's own dobj already reaches this object via "terminal"/
// "computer"/etc.), and it is also a bare-typeable word on the pre-existing
// V_WHOAMI (post office's own "search for my name") — keeping it as a noun
// here would add a `verb-noun-collision` this room's own vocabulary choices
// don't need to spend.
const catalogueTerminal: ObjectDefSlice = {
  location: COUNTY_LIBRARY,
  name: 'catalogue terminal',
  portable: false,
  // "table" added (wave 5, §8.1's ruling: "the library's reading table" —
  // the room's own description says "On a table, a terminal, awake"
  // (`countyLibrary.ts`) and no object here answered to `table` until now;
  // needed for the table-in-scope check `objects/closeOut.ts` exports).
  nouns: ['terminal', 'computer', 'monitor', 'keyboard', 'keys', 'mouse', 'mat', 'catalogue terminal', 'county catalogue', 'database', 'system', 'box', 'table'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: terminalExamine }] },
    { verbs: [SEARCH, USE_VERB_ID], effects: typeReclamationEffects },
  ],
};

// ---------------------------------------------------------------------------
// Stage E2, task Q — the annex shelf and the darkroom key (§42.1, §42.2;
// register 132 — taped under the shelf the sign-in book stands on, a
// correction to the plan against shipped prose: there is no counter in
// this room's own object list, and `SEARCH COUNTER` is kept as a trigger
// word on the shelf below rather than a real counter object). Declared
// ahead of the sign-in book (below) so that object's own "LOOK UNDER BOOK"
// handler can reuse `annexShelfEffects` without a forward reference.
// ---------------------------------------------------------------------------

const annexShelfText =
  'The sign-in book lives on a shelf by the door — one board on two brackets, put up\nby somebody who had a board and two brackets.\n\nUnderneath it, out of anybody\'s eyeline and inside the reach of anybody who has\nworked here, there is a strip of gaffer tape stuck across the underside of the\nboard with a key held flat against the wood by it.\n\nThe tape has gone hard and yellow and lets go all at once.';

const annexShelfEffects: Effect[] = [{ say: annexShelfText }, { reveal: ACT4_DARKROOM_KEY }];

const annexShelf: ObjectDefSlice = {
  location: COUNTY_LIBRARY,
  name: 'shelf',
  portable: false,
  nouns: ['shelf', 'counter', 'ledge', 'bracket', 'underside'],
  adjectives: ['annex', 'wooden'],
  handlers: [{ verbs: [EXAMINE, SEARCH], effects: annexShelfEffects }],
};

const darkroomKeyExamine =
  'A long key for a mortice lock, older than the door it belongs to by the look of\nit, with a bow you could hang a picture on.\n\nSomebody taped it under a shelf rather than take it home, which is what people do\nabout a key they are not supposed to have and are not prepared to give back.';

const darkroomKey: ObjectDefSlice = {
  location: COUNTY_LIBRARY,
  hidden: true,
  name: 'darkroom key',
  portable: true,
  // 'darkroom' too (v0.18.0 playtest): the plate on the door says DARKROOM and
  // that is the word players use; without it the held keyring won every tie.
  nouns: ['key', 'darkroom key'],
  adjectives: ['darkroom', 'long', 'library', 'mortice'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: darkroomKeyExamine }] }],
};

// ---------------------------------------------------------------------------
// §9.5 — The sign-in book
// ---------------------------------------------------------------------------

const bookExamine =
  'A hardback ledger open on a shelf by the door, with a pen on a string chewed at the cap end by somebody\'s whole childhood.\n\nFour printed columns: NAME · PURPOSE OF VISIT · IN · OUT. Across the top a fifth box, printed narrow, that says YEAR. Nobody has written in it, on this page or the two before it.\n\nA dozen hands. Genealogy. Genealogy. Deeds. School project. Genealogy. Somebody has put "curiosity", and somebody else three lines down has put "same".';

const signBookText =
  'You take the pen off its string. NAME is the first column, a quarter of an inch tall, and it does not care what you put in it.\n\nYou leave it. You write "records" under PURPOSE and the time under IN, and leave OUT until you go. The pen goes back on its string.';
const signBookEffects: Effect[] = [{ say: signBookText }, { set: [FLAG_SIGNED_THE_BOOK, true] }];

const signInBook: ObjectDefSlice = {
  location: COUNTY_LIBRARY,
  name: 'sign-in book',
  portable: false,
  // "log"/"year" dropped — see this file's own header comment. "page" also
  // dropped (a third builder call, same reasoning): `MICROFICHE_READER_
  // SCREEN`'s own "page" is one of §9.1's own required trigger words
  // ("EXAMINE PAGE" must resolve straight to the reader, not a clarify
  // prompt), and the ledger's own EXAMINE/READ text already covers "on this
  // page or the two before it" without needing the bare noun too.
  nouns: ['book', 'sign in book', 'sign-in', 'logbook', 'sheet', 'ledger', 'pen', 'string', 'column', 'columns', 'box', 'entries', 'visitors'],
  handlers: [
    { verbs: [EXAMINE, READ], effects: [{ say: bookExamine }] },
    // "USE PEN" (§9.5's own trigger list) dispatches via USE_VERB_ID, dobj
    // resolved to this object through its own "pen" noun — added alongside
    // V_SIGN so it reaches the same effects rather than the generic
    // `use.default` family.
    { verbs: [V_SIGN, USE_VERB_ID], effects: signBookEffects },
    // Stage E2, task Q — §42.1's own "LOOK UNDER BOOK" trigger: the key is
    // taped under the shelf the book stands on, not the book itself, but
    // "book" is this object's own noun (the shelf below deliberately does
    // not take it, §56.2's own key-collision row) — so the reveal handler
    // lives here rather than forcing "book" onto the shelf too.
    { verbs: [LOOK_UNDER], effects: annexShelfEffects },
  ],
};

// ---------------------------------------------------------------------------
// §9.6 — The darkroom door
// ---------------------------------------------------------------------------

const darkroomExamine =
  'Past the drawer bank, a door painted the same white as everything else, with a bulb over it in a red glass shade. A brass plate at eye height: DARKROOM — DO NOT OPEN IF LAMP IS LIT.\n\nThe lamp is not lit. The door is locked, and the plate has been polished by sixty years of people reading it with a thumb.';

const darkroomOpenText =
  "Locked, and old enough that the lock is a good one. Whatever is behind it is somebody's arrangement with the county, and the county has agreed not to think about it.";

// ---------------------------------------------------------------------------
// Stage E2, task Q — opening the darkroom (§43; canon 96, canon 109;
// register 131 — no act gate, either route, in any act). Three new
// handlers, ABOVE the shipped ones below (`findHandler`'s own first-match-
// wins order, `actions.ts`) — the shipped locked EXAMINE/OPEN-UNLOCK-KNOCK
// text stays underneath, word for word, and still answers before
// `act4_darkroom_open` is set.
// ---------------------------------------------------------------------------

// §43.1 — PRY DOOR WITH CHAIR LEG, the leg's fourth (`act1/objects/
// drawer.ts`'s own shipped pry idiom, §10.2/§18 — `withInstrument:
// [CHAIR_LEG]` here rather than a bare-pry-succeeds `{ has }` gate, this
// task's own instruction).
export const DARKROOM_PRY_TEXT =
  'The frame is soft where the frame always goes soft, which is the bottom eight\ninches on the hinge side, and the leg goes in there and stays.\n\nIt is not a fast job. It is three separate leans with a rest in the middle of\nthem, and at the end of the third the screws come out of the keep rather than the\nlock coming out of the door, which is the good outcome and is not the one you\nwere expecting.\n\nThe door swings in about a foot and stops against something soft on the other\nside of it, and the smell that comes out of the gap has been in there a very long\ntime.';

// §43.2 — UNLOCK DOOR WITH KEY, the `K` route.
export const DARKROOM_UNLOCK_WITH_KEY_TEXT =
  'The key goes in the whole way and turns with the long slow travel of a mortice\nthat somebody looked after for a great many years and nobody has touched since.\n\nThe door swings in about a foot and stops against something soft, and the smell\nthat comes out of the gap has been in there a very long time.';

// §43.3 — the door, once open — EXAMINE.
export const DARKROOM_OPEN_EXAMINE_TEXT =
  'Open a foot on a room that has no light in it, with a heavy curtain hung inside\nthe frame on a rail so that the door and the curtain cannot both be open, which\nis the whole idea.\n\nThe bulb in the red glass shade over the door is not lit. There is a switch for\nit, on the outside, where a switch for it has to be.';

const darkroomOpenEffects: Effect[] = [{ set: [ACT4_DARKROOM_OPEN, true] }, { setState: [DARKROOM_DOOR, 'open', true] }, { setState: [DARKROOM_DOOR, 'locked', false] }];

const darkroomDoor: ObjectDefSlice = {
  location: COUNTY_LIBRARY,
  name: 'darkroom door',
  portable: false,
  nouns: ['darkroom', 'dark room', 'door', 'inner door', 'red light', 'red lamp', 'lamp', 'shade', 'plate', 'brass plate', 'sign', 'lock'],
  container: { open: false, locked: true },
  handlers: [
    {
      verbs: [PRY],
      withInstrument: [CHAIR_LEG],
      when: { not: { flag: ACT4_DARKROOM_OPEN } },
      effects: [{ say: DARKROOM_PRY_TEXT }, ...darkroomOpenEffects],
    },
    {
      verbs: [UNLOCK],
      withInstrument: [ACT4_DARKROOM_KEY],
      when: { not: { flag: ACT4_DARKROOM_OPEN } },
      effects: [{ say: DARKROOM_UNLOCK_WITH_KEY_TEXT }, ...darkroomOpenEffects],
    },
    { verbs: [EXAMINE], when: { flag: ACT4_DARKROOM_OPEN }, effects: [{ say: DARKROOM_OPEN_EXAMINE_TEXT }] },
    { verbs: [EXAMINE], effects: [{ say: darkroomExamine }] },
    { verbs: [OPEN, UNLOCK, V_KNOCK], effects: [{ say: darkroomOpenText }] },
  ],
};

// §10's always-closed "every other direction" gate — mirrors `POST_OFFICE_NO_EXIT_GATE`.
const countyLibraryNoExitGate: ObjectDefSlice = { location: COUNTY_LIBRARY };

// ---------------------------------------------------------------------------
// D2-B — the two new reels (Stage D plan §2 D2; prose doc 2026-09-10-stage-
// d2-prose.md PART SEVEN, §19). Placed `location: COUNTY_LIBRARY` (top
// level, like `fiche_drawers` itself), not nested `{ in: FICHE_DRAWERS }` —
// the drawer bank has no `container` state to open/close (`openDrawerText`'s
// own line: "Nothing in here is locked and nothing ever needed to be"), so
// there is nothing for a nested location to gate; both reels are simply
// always in scope in this room, exactly like the drawer bank and the card
// catalogue already are. §29.3's own note: the object id stays
// `act2_reel_2029_2031` even though the drawer LABEL the shipped bank's own
// six-year/four/two/one rhythm requires reads `2028-2031`, a builder/prose
// distinction, not a bug.
// ---------------------------------------------------------------------------

const constructionReelDrawerText =
  'The drawer marked 2028-2031 runs out on its engineered stop. The hubs are\nlabelled in the same hand all the way along, and one of them has been handled\nenough to take the print off the paper.';

const constructionReelReadText =
  'The crank takes it and the lamp puts the county\'s own newspaper up on the\nground glass four feet wide, and you go through a year of it at the speed of a\nman winding.\n\n' +
  '    NEW WORKS: FIRST SOD TURNED IN A COLD WIND\n\n' +
  'A photograph of eleven people in coats on a scraped field, taken from too far\nback, so that everybody in it is a coat. A caption naming all eleven. One of\nthe eleven is named as the senator, and the senator is standing slightly apart\nfrom the rest with his hands behind his back like a man waiting for a bus.\n\n' +
  'Four months on:\n\n' +
  '    DEDICATION SET FOR SPRING\n\n' +
  'and a photograph of a bronze plaque on a trestle before it went up, shot\nsquare on, every letter legible:\n\n' +
  '    THE BADLANDS FACILITY\n' +
  '    COMMISSIONED 2030\n\n' +
  'And then, in the following winter, a column about the works closing down, and\na sentence in the middle of it that the man who wrote it did not think was the\ninteresting part of his own paragraph:\n\n' +
  '    The construction adit, which runs some 1.1 miles from the works to the\n' +
  '    county road, is to be sealed rather than demolished, at the contractor\'s\n' +
  '    request and at a saving to the county.';

const constructionReelReadEffects: Effect[] = [{ say: constructionReelReadText }, { grantClue: ACT2_CLUE_SERVICE_TUNNEL }];

// `nouns` deliberately does NOT include bare "reel" (a builder call: see
// this file's own report). `grammar.ts`'s own `toPhrase` resolves EVERY
// multi-word dobj phrase as `{ noun: lastWord, adjectives:
// precedingWords }` with no multi-word-noun matching at all — a compound
// nouns-array entry like `'construction reel'` is therefore never looked
// up as a phrase; the only way "CONSTRUCTION REEL" could resolve to THIS
// object rather than the shipped reader (which already owns bare "reel")
// is for this object to also claim bare "reel", and doing that regresses
// `tests/world-act1-wave3-library.test.ts`'s own shipped "WIND REEL"/
// "READ REEL" case (bare "reel" would then have three candidates — the
// reader plus both new reels — an unwanted clarify prompt where the
// shipped test expects the reader's own text unambiguously; confirmed by
// running it). §29.2's own words ("the shipped singular stays on the
// reader") win: "construction"/"works"/"dedication" are this object's own
// bare, unique nouns instead. "EXAMINE CONSTRUCTION REEL" as one 2-word
// phrase therefore falls through to the reader's own generic text (a
// real, documented gap — see this task's report) rather than an error or
// a clarify; "EXAMINE CONSTRUCTION" alone reaches this object cleanly.
const constructionReel: ObjectDefSlice = {
  location: COUNTY_LIBRARY,
  name: 'construction reel',
  portable: false,
  nouns: ['construction', 'works', 'dedication'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: constructionReelDrawerText }] },
    { verbs: [READ, V_THREAD], effects: constructionReelReadEffects },
  ],
};

const constructionReelMapText =
  'The paper ran the site plan on the day of the dedication, badly, the way a\nnewspaper reproduces a drawing: everything grey, the lettering nearly gone.\n\nThe fence is a rectangle. The works are a shape inside it. And out of the west\nside of the shape, running away from it under the grazing, a double line goes\nout to a small square hatched black, on the county road, at the place where\nthe road makes its one bend before it gives up and goes north.\n\nThe small square has a note against it, four words long, that has survived the\nreproduction better than anything else on the page: *access hatch — keep\nclear.*';

// "map page" dropped from this sub-part's own noun list (a builder call,
// same reasoning as above): its own last word "page" is already
// `microfiche_reader_screen`'s own noun (same room), and bare "map" alone
// already reaches this object unambiguously ("map" is nobody else's noun
// here) — so nothing is lost by leaving it out. "site plan"/"plan" are
// unaffected (their own last word, "plan", is unique to this object).
const constructionReelMap: ObjectDefSlice = {
  location: { on: ACT2_REEL_2029_2031 },
  name: 'map page',
  portable: false,
  nouns: ['map', 'site plan', 'plan'],
  handlers: [{ verbs: [READ, EXAMINE], effects: [{ say: constructionReelMapText }, { set: [ACT2_KNOWS_TUNNEL_MOUTH, true] }] }],
};

const hearingReelReadText =
  'The county paper printed the whole of the siting subcommittee when a local man\nwas on it, because a local man was on it, in six-point type across two pages\nunder the heading SENATOR\'S REMARKS IN FULL.\n\n' +
  'He talks for a long time and enjoys it. There is a paragraph in the middle\nabout the water table.\n\n' +
  '    THE CHAIRMAN: And on the aquifer, Senator?\n\n' +
  '    SENATOR: On the aquifer I am satisfied. I have read what the department\n' +
  '    has put in front of me, I have no reason to go behind it, and I would not\n' +
  '    want the record to show hesitation where I do not feel any.\n\n' +
  'It is a paragraph in which a careful man says he is satisfied.';

const hearingReelCompareText =
  'You read it to him off the glass, word for word, twice.\n\n' +
  'The second time he does not let you get to the end.\n\n' +
  '"No," he says.\n\n' +
  'Nothing else for a moment. The fan.\n\n' +
  '"I said the department\'s figures were the department\'s figures and I\'d not put\n' +
  'my name to another man\'s arithmetic, and a fellow in the third row put his pen\n' +
  'down, and I was pleased with myself the whole drive home." A pause. "You have\n' +
  'just read me a paragraph where I say I\'m satisfied. I have never in my life\n' +
  'been satisfied about water."\n\n' +
  'Then, quite steadily: "Read me the date at the top of the page."\n\n' +
  'You read him the date at the top of the page.\n\n' +
  '"Right," he says. "So that\'s the county\'s copy, printed the next morning,\n' +
  'before anybody could have got to it. And it already says that." He is not\n' +
  'frightened. He sounds, if anything, relieved. "Well. Thirty years and I\'d\n' +
  'started to think I\'d made it up."';

// "COMPARE REEL WITH DAD" cannot be gated object-side on which npc filled
// the resolved `iobj` (`HandlerDef.withInstrument` is `ObjectId[]` only,
// `engine/world.ts`) — this task's own report and `act2/verbs.ts`'s own
// header on the `V_FIT` `'V dobj'` addition cover why. "COMPARE REEL" bare,
// gated on `act2_dad_told_hearing` alone, is the plan's own fallback
// ruling for exactly this case; Dad's physical presence in the room is
// NOT also checked here (a further tightening a later task can add once
// `ACT2_DAD`'s own schedule is stable — see this task's report).
const hearingReelCompareEffects: Effect[] = [{ say: hearingReelCompareText }, { grantClue: ACT2_CLUE_TRANSCRIPT_CHANGED }];

// Same reasoning as the construction reel above (this file's own report):
// no bare "reel" here either. "hearing" is this object's own bare noun;
// "transcript"/"remarks" already work unaided (each is its own unique
// last word) — "READ TRANSCRIPT"/"READ REMARKS"/"EXAMINE HEARING" all
// resolve correctly; "HEARING REEL" as one phrase falls through to the
// reader, same documented gap.
const hearingReel: ObjectDefSlice = {
  location: COUNTY_LIBRARY,
  name: 'hearing reel',
  portable: false,
  nouns: ['hearing', 'transcript', 'remarks'],
  handlers: [
    { verbs: [READ, V_THREAD], effects: [{ say: hearingReelReadText }] },
    { verbs: [V_FIT], when: { flag: ACT2_DAD_TOLD_HEARING }, effects: hearingReelCompareEffects },
  ],
};

export const COUNTY_LIBRARY_OBJECTS: Record<string, ObjectDefSlice> = {
  [MICROFICHE_READER]: microficheReader,
  [MICROFICHE_READER_SCREEN]: microficheReaderScreen,
  [FICHE_DRAWERS]: ficheDrawers,
  [FICHE_DRAWERS_REELS]: ficheDrawersReels,
  [CARD_CATALOGUE]: cardCatalogue,
  [CATALOGUE_TERMINAL]: catalogueTerminal,
  [SIGN_IN_BOOK]: signInBook,
  [ACT4_ANNEX_SHELF]: annexShelf,
  [ACT4_DARKROOM_KEY]: darkroomKey,
  [DARKROOM_DOOR]: darkroomDoor,
  [COUNTY_LIBRARY_NO_EXIT_GATE]: countyLibraryNoExitGate,
  [ACT2_REEL_2029_2031]: constructionReel,
  [ACT2_REEL_2029_2031_MAP]: constructionReelMap,
  [ACT2_REEL_HEARING]: hearingReel,
} satisfies Record<string, ObjectDefSlice>;
