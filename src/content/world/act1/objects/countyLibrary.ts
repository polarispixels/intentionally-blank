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
import { EXAMINE, OPEN, READ, readCardsText, SEARCH, TURN, typeReclamationText, UNLOCK } from '../verbs';
import {
  CARD_CATALOGUE,
  CATALOGUE_TERMINAL,
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
  ],
};

// ---------------------------------------------------------------------------
// §9.6 — The darkroom door
// ---------------------------------------------------------------------------

const darkroomExamine =
  'Past the drawer bank, a door painted the same white as everything else, with a bulb over it in a red glass shade. A brass plate at eye height: DARKROOM — DO NOT OPEN IF LAMP IS LIT.\n\nThe lamp is not lit. The door is locked, and the plate has been polished by sixty years of people reading it with a thumb.';

const darkroomOpenText =
  "Locked, and old enough that the lock is a good one. Whatever is behind it is somebody's arrangement with the county, and the county has agreed not to think about it.";

const darkroomDoor: ObjectDefSlice = {
  location: COUNTY_LIBRARY,
  name: 'darkroom door',
  portable: false,
  nouns: ['darkroom', 'dark room', 'door', 'inner door', 'red light', 'red lamp', 'lamp', 'shade', 'plate', 'brass plate', 'sign', 'lock'],
  container: { open: false, locked: true },
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: darkroomExamine }] },
    { verbs: [OPEN, UNLOCK, V_KNOCK], effects: [{ say: darkroomOpenText }] },
  ],
};

// §10's always-closed "every other direction" gate — mirrors `POST_OFFICE_NO_EXIT_GATE`.
const countyLibraryNoExitGate: ObjectDefSlice = { location: COUNTY_LIBRARY };

export const COUNTY_LIBRARY_OBJECTS: Record<string, ObjectDefSlice> = {
  [MICROFICHE_READER]: microficheReader,
  [MICROFICHE_READER_SCREEN]: microficheReaderScreen,
  [FICHE_DRAWERS]: ficheDrawers,
  [FICHE_DRAWERS_REELS]: ficheDrawersReels,
  [CARD_CATALOGUE]: cardCatalogue,
  [CATALOGUE_TERMINAL]: catalogueTerminal,
  [SIGN_IN_BOOK]: signInBook,
  [DARKROOM_DOOR]: darkroomDoor,
  [COUNTY_LIBRARY_NO_EXIT_GATE]: countyLibraryNoExitGate,
} satisfies Record<string, ObjectDefSlice>;
