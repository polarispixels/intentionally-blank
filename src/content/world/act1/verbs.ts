// Act I, room 1 — the verb table. Built-ins reuse `actions.ts`'s
// `BUILTIN_VERB_IDS`; non-built-ins get fresh ids here, `default` text
// pulled verbatim from `src/content/responses.ts`'s `VERB_DEFAULTS`
// (§6 of the response-families doc) — `words` (not specified by that doc;
// its own header says so) are this builder's choice, drawn from each
// family's parenthetical synonym list in the doc.
//
// ROOM-SPECIFIC BARE VERBS (§7 — STAND, WAIT, XYZZY, SUDO, SING, WHO AM I,
// SLEEP, YELL, PRAY, JUMP, HELLO) and the two new room-scale sense verbs
// (LOOK UP/LOOK DOWN, §3.4) are declared with their `default` set directly
// to the room's own authored text — see `room.ts`'s header for why bare,
// no-dobj verbs have to work this way in this engine. Two of these (STAND,
// the terminal login attempt) also have a `room.ts` room-level handler now
// (§8 gap 3/4) that runs alongside `default`'s own text; §8 gap 6 also
// stopped a bare call to any of these (every one declares a `'V'` pattern)
// from tagging a false-positive `defaultResponse` diag.
//
// `INVENTORY` (§8.9/§14.4, §8 gap 2) is real now too — `engine/respond.ts`'s
// reserved `INVENTORY_VERB_ID`, not the old static `V_INVENTORY` stopgap.
// Its own `default` is a `ProseRef` to the global `inventory.empty` family
// (see that id's own doc comment for why); `room.ts` adds `your_room`'s own
// override handler for the empty-hands case (the design doc's own
// instruction: the empty inventory here is a clue, not the ordinary line).

import { BUILTIN_VERB_IDS } from '../../../engine/actions';
import { V } from '../../../engine/ids';
import { AGAIN_VERB_ID } from '../../../engine/interpreter';
import { NPC_VERB_IDS } from '../../../engine/npc';
import { DIRECTION_VERB_IDS, LOOK_VERB_ID, USE_VERB_ID } from '../../../engine/move';
import type { ProseRule } from '../../../engine/prose';
import type { VerbDef } from '../../../engine/world';
import { INVENTORY_VERB_ID } from '../../../engine/respond';
import { VERB_DEFAULTS } from '../../responses';
import { GAME_VERSION } from '../../../version';
import { ACT1_DARK_REFUSAL_FAMILY, ACT1_MAIN_STREET_BOUNDARY_GENERIC } from './responses';
import {
  FLOOR_LAMP,
  TERMINAL,
  V_ABOUT,
  V_VERSION,
  V_APPROACH,
  V_ASSEMBLE,
  V_ATTACK,
  V_CALL,
  V_CHECK_DATE,
  V_CLEAN,
  V_COUNT,
  V_CROSS,
  V_CROUCH,
  V_DRINK,
  V_DRIVE,
  V_EAT,
  V_EAT_PIE,
  V_EAT_PILL,
  V_FEED,
  V_FIND_MY_NAME,
  V_HELP,
  V_HOLD_TO_LAMP,
  V_HUG,
  V_KISS,
  V_KNOCK,
  V_FILL,
  V_FIND,
  V_FOLLOW,
  V_LEAN_OVER,
  V_LOOK_DOWN,
  V_LOOK_FOR_FACE,
  V_LOOK_OUT,
  V_LOOK_OUTSIDE,
  V_LOOK_UP,
  V_MEASURE,
  V_ORDER,
  V_PLAY,
  V_POST_LETTER,
  V_POUR,
  V_QUESTION,
  V_REACH_UNDER,
  V_RIGHT,
  V_RING,
  V_ROLL_UP,
  V_SIGN,
  V_SLIDE_DOWN,
  V_SUDO,
  V_SWEEP,
  V_THINK,
  V_LOOK_UP_SUBJECT,
  V_TILT,
  V_TIP,
  V_TYPE_RECLAMATION,
  V_TURN_OVER,
  V_TYPE_TERMINAL,
  V_UNPLUG,
  V_WATCH,
  V_WHAT_YEAR,
  V_WHOAMI,
  V_XYZZY,
} from './ids';

export const { take: TAKE, drop: DROP, open: OPEN, close: CLOSE, lock: LOCK, unlock: UNLOCK, putIn: PUT_IN, putOn: PUT_ON, wear: WEAR, remove: REMOVE, read: READ, turnOn: TURN_ON, turnOff: TURN_OFF } = BUILTIN_VERB_IDS;

export const EXAMINE = V('examine');
export const SEARCH = V('search');
export const LOOK_UNDER = V('look_under');
export const LOOK_BEHIND = V('look_behind');
export const TOUCH = V('touch');
export const SMELL = V('smell');
export const LISTEN = V('listen');
export const TASTE = V('taste');
export const PUSH = V('push');
export const PULL = V('pull');
export const TURN = V('turn');
export const MOVE = V('move');
export const SHAKE = V('shake');
export const RUB = V('rub');
export const PRY = V('pry');
export const BREAK = V('break');
export const KICK = V('kick');
export const CUT = V('cut');
export const BURN = V('burn');
export const GIVE = V('give');
export const SHOW = V('show');
export const CLIMB = V('climb');
export const SIT = V('sit');
export const STAND = V('stand');
export const WAIT = V('wait');
export const SLEEP = V('sleep');
export const YELL = V('yell');
export const PRAY = V('pray');
export const JUMP = V('jump');
export const SING = V('sing');
/**
 * Front-desk-prose §5's first real NPC needs `TALK TO`/`HELLO <npc>` to
 * reach `npc.ts`'s reserved `NPC_VERB_IDS.talk` special routing
 * (`respond.ts`'s `respondToAction`) — which only fires for THIS exact id.
 * Room 1's own bare "HELLO"/"HI"/"HEY" easter egg (`helloDefault`, below)
 * already claimed the word "hello" globally (one act-wide verb table), so
 * rather than a second, colliding verb id for the npc-targeted case, this
 * id IS `NPC_VERB_IDS.talk` — bare `hello`/`hi`/`hey` (no dobj) still
 * renders the exact same `helloDefault` text as before (unchanged), and
 * `hello`/`talk to` with an npc dobj now also reaches greeting.
 */
export const HELLO = NPC_VERB_IDS.talk;

// ---------------------------------------------------------------------------
// §7 — room-specific bare verbs. Most of these have no schema slot other
// than `default` (a bare, no-object command has no `dobj` to hang an
// authored handler on) and stay exactly that way. Two of them — STAND and
// the terminal login attempt — also need to SET a flag
// (`FLAG_STOOD_UP`/`FLAG_TERMINAL_TRIED`), which a `VerbDef.default` render
// alone can never do (it renders `Prose` only, runs no `Effect`s). Gap 3/4's
// fix (`RoomDefSlice.handlers`, `engine/actions.ts`'s `performAction`) is
// exactly the second schema slot this needed: `room.ts` now declares real
// room-level handlers for `STAND`/`V_TYPE_TERMINAL` that run the flag-set
// alongside the SAME text exported below — `default` here stays assigned
// (required non-null by `validate.ts`, and still the answer for the rare
// dobj-form of STAND on an object with no handler of its own) but is
// otherwise dead prose for the bare case, exactly like `LOOK_VERB_ID`'s own
// `default` a few lines down — `room.ts`'s dispatch always intercepts first.
// ---------------------------------------------------------------------------

/**
 * `string[]` rotation gives "first time differs from every time after" for
 * free from the counter alone — `FLAG_STOOD_UP` (gap 4) is set alongside
 * this same text by `room.ts`'s room-level handler, purely so other content
 * can later condition on "has the player stood up yet"; it does not drive
 * which variant renders.
 */
export const standDefault = [
  'You get up in stages, the way a person moves a ladder. Halfway through, the room offers to change places with you and you decline. Then you are standing, mostly, with one hand on something that will turn out to be a desk.',
  'You stand. You were, in every sense that matters, already standing.',
];

const waitDefault = [
  'You wait. The radiator ticks. Your head keeps its own time, slightly faster. Nothing in this room is going to improve on its own, and you get the distinct impression it has been waiting a good deal longer than you have.',
  'You give the room a chance to volunteer something. It has been declining that offer all night and sees no reason to change.',
];

const xyzzyDefault = 'Nothing happens. Which is, in fairness, exactly what happened the first time anybody tried it.';

const sudoDefault: ProseRule[] = [
  {
    when: { objectState: [TERMINAL, 'on', true] },
    text: 'The terminal does not know the word. It knows one thing about you, and it has already said it.',
  },
  { text: 'You issue the command with real conviction. The room, which has no opinion about your privileges, continues not to have one.' },
];

const singDefault =
  'You sing. Your head objects immediately and at volume, and the song stops being a song about a third of the way into the first line. Two floors below you a board shifts, the way a board does when the person standing on it has just decided to hold very still.';

const whoamiDefault = [
  'You check. The answer is not where you left it.',
  'There is a shape in your mind where a name goes — the right length, the right weight, the feel a word has in the half-second before you say it. The shape is in perfect condition. There is nothing in it.',
].join('\n\n');

const sleepDefault = 'You consider lying back down, which has the advantage of being where you started and the disadvantage of being where somebody left you.';

const yellDefault =
  'You shout. It goes out, finds four walls and a low ceiling, and comes back smaller. Downstairs, something that was moving stops moving. Nobody calls up.';

const prayDefault = 'You pray briefly and without much system. The tin ceiling, being the nearest available authority, declines to comment.';

const jumpDefault =
  'You leave the floor by perhaps two inches. Your head describes, in some detail, what it thought of that. You do not do it again.';

const helloDefault = 'You say hello to an empty room, which is one of those things a person does once, quietly, to find out whether the room is empty.';

/**
 * §4.9's terminal-login attempt text. The four-entry rotation gives "first
 * attempt reads differently from every attempt after" for free, from array
 * order alone; `FLAG_TERMINAL_TRIED` (gap 4) is set alongside this same
 * text by `room.ts`'s room-level handler, purely so other content can later
 * condition on "has the player tried the terminal yet" — it does not drive
 * which variant renders. `ENTER <anything>` (arbitrary typed text) is not
 * implemented — no free-text capture pattern exists yet (the same gap
 * `mvp-prologue.ts`'s own header names for SAY); escalated in task 22a's
 * report, not invented around here.
 */
// Wayfinding doc §10, patch 3 — one sentence appended to variant 1 only
// (hard rule 5, transcribed verbatim). Variants 2-4 are the repeat attempts
// and are unedited; a lead the player has already been given does not want
// repeating. It points at paper, not at page 78 — the missing half of the
// hat/hatband thought the opening room's own puzzle already taught, without
// naming the page, the hat, the graphite or the rubbing.
export const terminalTypeDefault = [
  'You type. The keys have the deep, unembarrassed travel of a machine built when people were expected to be sitting at them all day. The cursor takes everything you give it without comment.\n\n    USER NOT RECOGNIZED\n\nThe cursor returns to where it started.\n\nIt does not say *incorrect*. It does not say *no such user*. Not recognized is a different sort of remark, and the machine makes it the same way every time — whether you type a name, a word, or nothing at all. Somebody knew what to put in it once, and nobody carries a thing like that in his head; he writes it on whatever paper is to hand and then keeps the paper.',
  '    USER NOT RECOGNIZED\n\nYou had, at some level, expected that. It does not help.',
  'You try a different word this time. The machine considers it for exactly as long as it considered the last one, which is no time at all.\n\n    USER NOT RECOGNIZED',
  'You press ENTER on an empty line, to see.\n\n    USER NOT RECOGNIZED\n\nThe same words, at the same speed, for nothing at all.',
];

/** Shared with `objects/misc.ts`'s `CEILING` object (§8.8: "X CEILING — see §3.4 LOOK UP"). */
export const CEILING_TEXT =
  'A pressed-tin ceiling, painted over so many times the pattern has gone soft, and in one corner the brown map of a leak that stopped being a leak some time ago. Your shadow is up there with it, enormous, on account of the lamp.';

const lookUp: ProseRule[] = [
  { when: { not: { objectState: [FLOOR_LAMP, 'on', true] } }, text: { ref: ACT1_DARK_REFUSAL_FAMILY } },
  { text: CEILING_TEXT },
];

const lookDown = 'Bare boards, waxed once, a long time before you. They run toward the window. There is a good deal on them that should not be.';

/**
 * §5's "look through window / look outside" — a dedicated bare verb rather
 * than reusing EXAMINE's word "look through" ("SEARCH" already claims that
 * exact phrase for "look through papers", and a second verb id sharing it
 * would collide per `validate.ts`'s vocabulary-collision rule); see this
 * task's report.
 */
const lookOutside: ProseRule[] = [
  { when: { not: { objectState: [FLOOR_LAMP, 'on', true] } }, text: { ref: ACT1_DARK_REFUSAL_FAMILY } },
  {
    text: 'An alley, a shed roof, a brick wall, and above all of it more stars than you were expecting, arranged over a town that appears to have gone to bed in about 1890.',
  },
];

// ---------------------------------------------------------------------------
// Front Desk & Lobby — new bare/shared-text verbs (front-desk-prose §4, §6).
// Shared between an object handler (dobj form) and a bare/room-level
// fallback where the doc's own phrasing has no natural object (§4.2's "find
// my name", §6's "check date"/"look for date") — same idiom as room 1's
// `standDefault`/`terminalTypeDefault` above.
// ---------------------------------------------------------------------------

/** §4.1 "ring bell"/"press bell"/"hit bell" — shared by V_RING and (on the bell sub-part only) BREAK's existing "hit". */
export const ringBellText =
  "You put a finger on the plunger. The bell is nine inches from Marlow's ear and Marlow is looking directly at you.\n\nYou take the finger back off.";

/** §4.1 "examine telephone"/"use telephone"/"call". */
export const telephoneText = 'Black, heavy, bolted through the counter, with a dial. Marlow does not offer it and does not move it out of reach.';

/** §4.1 "pour coffee"/"drink coffee"/"take coffee". */
export const coffeeText =
  'You pour a cup off the ring. It is terrible in an entirely familiar way, which is the first familiar thing that has happened to you tonight.';

/**
 * §4.2 "sign register"/"write in register"/"write name"/"write my name".
 * Wayfinding doc §11, patch 4 — one sentence added (hard rule 5, transcribed
 * verbatim). Points at Marlow and promises nothing: he does not know the
 * name (the impression's name column has one pen stroke, begun and
 * abandoned), only that he was on shift when whoever did know came in.
 */
export const signRegisterText =
  'There is a pen in the inkstand and a book on the counter and a line waiting at the bottom of the page.\n\nYou do not know what to put on it. The man on the other side of the counter was awake when whoever did know came in.';

/** §4.2 "read register"/"look through register"/"find my name"/"search register". */
export const findNameText =
  'You turn back through the weeks looking for yourself. The hand is the same all the way down, the entries are unremarkable all the way down, and the week you would be in is the week that is no longer in the book.';

/** §6 "turn over magazine"/"check date"/"look for date". */
export const checkDateText =
  'You turn one over. The mailing label has been torn off the back, the way people do, and what is left is an address that is half a name and a stripe of glue.';

/** Main Street §6 — "WHAT YEAR IS IT"/"WHAT YEAR"/"WHAT'S THE DATE" — bare, this room only. */
const whatYearText =
  'Brick. Three horses at a rail. Poles and wire. Paint on a wall. A street you would have to crouch on to date, and a shop window with lamp oil and batteries on the same price list.\n\nYou could make a case for a good many different years, and nothing on this street is going to settle it.';

/** Main Street §6 — "CROSS STREET"/"GO TO HORSES"/"APPROACH HORSES"/"GO TO RAIL" — shared by `main_street_road`'s own `V_CROSS` handler and `horses`' own `V_APPROACH` handler (`objects/mainStreet.ts`), so both phrasings render one string rather than two copies drifting apart. */
export const crossStreetText = 'You cross. Eleven paces and no looking either way, and you are at the rail with the horses\' breath going up in front of you.';

/** Main Street §4.5 — "examine paving"/"touch road"/"crouch"/"look at ground closely" — shared by `main_street_road`'s own `TOUCH` handler, `main_street_paving`'s own `EXAMINE` handler, and the room's own bare `V_CROUCH` handler (`objects/mainStreet.ts`/`mainStreet.ts`). */
export const crouchText =
  'You crouch. Under the patching, which is dark and poured and cracked across, the street is brick: laid in a herringbone, worn round at the edges, level enough that somebody knew the job.\n\nThe patches have been patched.';

// ---------------------------------------------------------------------------
// Wave 2 (Post Office / General Store / Sheriff's Office) — shared/bare
// verb text (same idiom as the two blocks above).
// ---------------------------------------------------------------------------

/** Post Office §4.4 — "post letter"/"put <object> in slot"/"open flap"/"use slot" all share this one text. Bare "post letter" reaches it as `V_POST_LETTER`'s own `default` (no "letter" object exists to hang a dobj handler on — same idiom as `V_CHECK_DATE`); "open flap"/"use slot" reach the identical string via `mail_drop`'s own OPEN/PULL handlers (`objects/postOffice.ts`). "put <object> in slot" is a genuine engine gap (PUT_IN dispatches on the *given* item's own handlers, not the container's — same shape as Main Street's already-documented GIVE-to-horse gap) — not wired; see this task's report. */
export const postLetterText =
  'The flap swings in and stops against nothing you can see. Below it, a drop of about two feet by the sound of it.\n\nYou have nothing to send, nobody to send it to, and no name for the corner of the envelope.';

/** Sheriff's Office §12.3.1 — "measure map"/"use scale"/"measure to wall drug"/"measure distance" — bare, one map in the game. */
export const measureMapText = 'You lay a thumb along the scale bar and walk it up the highway. Thirty-two miles, near enough.';

// ---------------------------------------------------------------------------
// County Library (wave 3) — bare/shared-text verbs (same idiom as the blocks
// above). Both texts are also reused, verbatim, by `objects/countyLibrary.ts`'s
// own object-level handlers (`card_catalogue`'s READ/SEARCH/OPEN,
// `catalogue_terminal`'s SEARCH/USE) so the bare-phrase and dobj-based
// routes to the same action never drift into two copies — see that file's
// own comment on `readCardsEffects`/`typeReclamationEffects`.
// ---------------------------------------------------------------------------

/** §9.3's "look up subject" — bare, self-contained phrase (no natural `dobj` target worth widening V_LOOK_UP's own grammar for — see `ids.ts`'s own comment on `V_LOOK_UP_SUBJECT`). */
export const readCardsText =
  'You pull a drawer at random and go through it the way people go through cards, which is faster than reading and slower than looking. Three kinds of stock, four hands, and the hands overlap. Subject, shelfmark, then a line for cross-references.\n\nBRIDGES — COUNTY. IRRIGATION. LIVESTOCK, DISEASES OF. WATER RIGHTS, see also GROUND WATER, see also RECLAMATION.\n\nThere is no RECLAMATION card and no RECLAMATION drawer. The heading that card sends you to is nowhere in the cabinet, and the card doing the sending has been in here long enough to go the same colour as the ones either side of it.';

/** §9.4's "type reclamation"/"look up reclamation" — bare, self-contained phrase (same idiom as `readCardsText`, above). */
export const typeReclamationText =
  'You type RECLAMATION. It thinks for a quarter of a second.\n\n    NO RECORDS MATCH THAT SUBJECT.\n    CHECK SPELLING OR TRY A BROADER TERM.\n\nYou try the broader term. WATER RIGHTS gives eleven items, each with a title, a span and a shelfmark. GROUND WATER — which the cabinet also sends you to — gives four.\n\nThe terminal does not have the heading. It does not have cross-references at all: not empty ones, none. The cabinet has a card pointing at that heading from before anybody typed any of this in.';

// ---------------------------------------------------------------------------
// Sundown Diner (wave 3) — bare/shared-text verbs (same idiom as the blocks
// above).
// ---------------------------------------------------------------------------

/** §5's "EAT"/"ORDER FOOD"/"ORDER BREAKFAST"/"ASK FOR FOOD" — bare, this room only. */
export const dinerEatText =
  'It arrives before you have finished asking, because it was already on the griddle, because she decided about it when you came in.\n\nEggs, hash, toast. You eat all of it and are surprised by how much of it there was.';

/** §4.6's "look out window"/"look at street" — bare fixed phrase (see `ids.ts`'s own comment on `V_LOOK_OUT` for why). */
export const windowStreetText =
  'The street, the brick opposite, and one lit lamp a long way down with a man still under it.\n\nFrom in here, with a mug in front of you and a griddle behind you, it looks like weather happening to somebody else.';

/** §4.5's "look for yourself"/"look for a face you know" — bare fixed phrase; "look at faces"/"search photographs" reach this same text via `diner_photos`/`diner_photos_faces`'s own handlers (`objects/sundownDiner.ts`). */
export const dinerFacesText =
  'You go along the rows looking at faces, which is a thing people do in a room like this without deciding to.\n\nThey are strangers, every row of them, and there was never any reason to think otherwise. You go along them twice anyway.';

// ---------------------------------------------------------------------------
// Town Edge (wave 3) — bare/shared-text verbs (same idiom as the blocks
// above). §14's "follow strip"/"cross country"/"go west"/"walk overland"/
// "go east" (§13.6) and "follow road"/"go to wall drug" (§13.3) are NOT new
// verbs at all — they reuse the existing dobj-taking V_FOLLOW/V_CROSS/
// V_APPROACH (see the words added to each, below, and `objects/townEdge.ts`
// for the handlers) rather than a bare self-contained verb, specifically to
// avoid the `verb-noun-collision` cost a bare verb would have (see `ids.ts`'s
// own comment on `V_THINK`).
// ---------------------------------------------------------------------------

/** §14's "THINK"/"REMEMBER"/"CONCENTRATE" — bare, this room only; the game's one deliberate "memory system's honest not-yet" (§14's own note: no other room in this wave gets a THINK response, and none should). */
export const townEdgeThinkText =
  'You stand at the end of the street and give it a minute.\n\nNothing arrives. Whatever is in there is behind the part of your head that hurts, and it is not coming out tonight for a man standing in the wind.';

// ---------------------------------------------------------------------------
// Nolan's Yard (wave 5) — bare, self-contained phrase (see `ids.ts`'s own
// comment on `V_EAT_PIE`).
// ---------------------------------------------------------------------------

/** §5.3's "EAT PIE" (the player). */
export const eatPieText =
  'It is as good as the one at the counter was and it is colder, and you are standing in the road eating a stranger\'s pie out of a box at four in the morning, and it is still the best decision you have made tonight.';

/** §7.2's "open bottle"/"take pill"/"eat pill" — shared by `V_EAT_PILL`'s own bare `default` and (via import) `pill_bottle`'s own OPEN/TAKE handlers (`objects/nolansYard.ts`), so the bare-phrase and dobj-based routes never drift into two copies. */
export const pillBottleOpenText =
  'You get the cap off — it is the kind that argues — and look at two tablets in the bottom of somebody else\'s bottle for slightly longer than a person with nothing on their mind would.\n\nYou put the cap back on.';

// ---------------------------------------------------------------------------
// The full table.
// ---------------------------------------------------------------------------

export const ACT1_VERBS: Record<string, VerbDef> = {
  // The thirteen built-in verbs (`actions.ts`'s `BUILTIN_VERB_IDS`) — each
  // needs its own `world.verbs` entry (words/patterns/class) for the
  // grammar to recognize it at all; `performAction` supplies the physics,
  // this table only supplies vocabulary + the §5 bare-safe `default`.
  [LOOK_VERB_ID]: { id: LOOK_VERB_ID, words: ['look', 'l', 'look around'], patterns: ['V'], class: null, default: 'You look around.' },
  // "steal" added (front-desk-prose §4.2's "STEAL REGISTER") — a general TAKE synonym, not register-specific vocabulary.
  // "untie"/"mount" added (main-street-prose §4.1's "TAKE HORSE"/"UNTIE HORSE"/"MOUNT HORSE" — shares one failure text with "RIDE HORSE" there) — general TAKE synonyms, not horse-specific vocabulary. "ride" is NOT added here: it already belongs to `V_SLIDE_DOWN` (the landing banister's own word) and `validate.ts`'s verb-word-collision check is a hard error — "RIDE HORSE" reaches `horses`' own `V_SLIDE_DOWN` handler instead (`objects/mainStreet.ts`), sharing the same text.
  // "buy" added (wave-2's General Store §9.1 "BUY POSTCARD"/"TAKE POSTCARD") — a general TAKE synonym, not postcard-specific vocabulary.
  // "borrow" added (wave-4's Arrowhead Motel §4.4 "BORROW KEYS") — a general TAKE synonym, not keyring-specific vocabulary.
  [TAKE]: { id: TAKE, words: ['take', 'get', 'pick up', 'steal', 'untie', 'mount', 'buy', 'borrow'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.take },
  [DROP]: { id: DROP, words: ['drop', 'put down'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.drop },
  // "try handle" added (§15.1.5's landing_doors block: "open / unlock /
  // try handle") — a general OPEN synonym, not landing-specific vocabulary,
  // since "try the handle" reads naturally on any door.
  // "try" added (main-street-prose §4.4's "TRY DOOR") — a general OPEN synonym, not brick-row-specific vocabulary.
  // "unlatch" added (Nolan's Yard §4.5's "UNLATCH GATE") — a general OPEN synonym, not gate-specific vocabulary.
  [OPEN]: { id: OPEN, words: ['open', 'try handle', 'try', 'unlatch'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.open },
  [CLOSE]: { id: CLOSE, words: ['close', 'shut'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.close },
  [LOCK]: { id: LOCK, words: ['lock'], patterns: ['V dobj', 'V dobj prep iobj'], preps: ['with'], class: 'direct', default: VERB_DEFAULTS.lock },
  [UNLOCK]: { id: UNLOCK, words: ['unlock'], patterns: ['V dobj', 'V dobj prep iobj'], preps: ['with'], class: 'direct', default: VERB_DEFAULTS.unlock },
  // "through" added (Nolan's Yard §5.3's "PUT PIE THROUGH FENCE") — a general PUT_IN synonym, not fence-specific vocabulary.
  [PUT_IN]: { id: PUT_IN, words: ['put', 'place', 'insert'], patterns: ['V dobj prep iobj'], preps: ['in', 'into', 'through'], class: 'direct', default: VERB_DEFAULTS.put_in },
  [PUT_ON]: { id: PUT_ON, words: ['put', 'place'], patterns: ['V dobj prep iobj'], preps: ['on'], class: 'direct', default: VERB_DEFAULTS.put_on },
  [WEAR]: { id: WEAR, words: ['wear', 'put on'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.wear },
  [REMOVE]: { id: REMOVE, words: ['remove', 'take off'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.remove },
  [READ]: { id: READ, words: ['read'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.read },
  [TURN_ON]: { id: TURN_ON, words: ['turn on', 'switch on'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.turn_on },
  [TURN_OFF]: { id: TURN_OFF, words: ['turn off', 'switch off'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.turn_off },

  // "look closely at" added (front-desk-prose §4.2's "LOOK CLOSELY AT PAGE") —
  // a distinct 3-word phrase from "look at" (the word "closely" sits between
  // them, so it wouldn't otherwise match); a general EXAMINE synonym, not
  // register-specific vocabulary.
  [EXAMINE]: { id: EXAMINE, words: ['examine', 'x', 'inspect', 'study', 'look at', 'look closely at'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.examine },
  [SEARCH]: { id: SEARCH, words: ['search', 'look in', 'look through', 'rummage'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.search },
  [LOOK_UNDER]: { id: LOOK_UNDER, words: ['look under', 'check under'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.look_under },
  // "go behind" added (Town Edge §13.1's "go behind billboard") — a general LOOK_BEHIND synonym, not billboard-specific vocabulary; safe to add with zero verb-noun-collision cost since this verb never has a bare 'V' pattern.
  [LOOK_BEHIND]: { id: LOOK_BEHIND, words: ['look behind', 'check behind', 'go behind'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.look_behind },
  // "pet"/"pat" added (main-street-prose §4.1's "TOUCH HORSE"/"PET HORSE"/"STROKE HORSE"/"PAT HORSE") — general TOUCH synonyms, not horse-specific vocabulary.
  [TOUCH]: { id: TOUCH, words: ['touch', 'feel', 'stroke', 'pet', 'pat'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.touch },
  // 'V' added (gap 3): bare SMELL/LISTEN now resolves grammatically and
  // reaches room.ts's own handlers before ever touching `default` below —
  // see room.ts's header. `default` stays `{name}`-templated for the
  // resolved-dobj case (SMELL FEDORA etc.), unchanged.
  [SMELL]: { id: SMELL, words: ['smell', 'sniff'], patterns: ['V', 'V dobj'], class: 'direct', default: VERB_DEFAULTS.smell },
  [LISTEN]: { id: LISTEN, words: ['listen', 'listen to', 'listen at'], patterns: ['V', 'V dobj'], class: 'direct', default: VERB_DEFAULTS.listen },
  [TASTE]: { id: TASTE, words: ['taste', 'lick'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.taste },
  [PUSH]: { id: PUSH, words: ['push', 'press against', 'shove'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.push },
  [PULL]: { id: PULL, words: ['pull', 'tug', 'yank', 'drag'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.pull },
  // "spin" added (wave-2's General Store §9.1 "SPIN RACK") — a general TURN synonym, not rack-specific vocabulary.
  // "wind" added (County Library §9.1's "WIND REEL") — a general TURN synonym, not reader-specific vocabulary.
  // "dial" added (wave 5, §9.3's "DIAL LETTERS") — a general TURN synonym; safe (no bare 'V' pattern on this verb, so no verb-noun-collision cost against `po_boxes`' own noun "dial"). "letters" is added to `po_boxes`' own noun list (`objects/postOffice.ts`) so "DIAL LETTERS" resolves its dobj there.
  [TURN]: { id: TURN, words: ['turn', 'rotate', 'twist', 'spin', 'wind', 'dial'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.turn },
  [MOVE]: { id: MOVE, words: ['move', 'shift', 'slide', 'reposition'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.move },
  [SHAKE]: { id: SHAKE, words: ['shake', 'rattle', 'jiggle'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.shake },
  // "dust" dropped from the synonym list (validate.ts's verb-noun-collision
  // check against `DUST`'s own noun) — builder's word choice, not doc text.
  // "erase" added (Stage E1 §4.2's own heading, "RUB / ERASE / WIPE BOARD
  // / WRITE ON BOARD / TAKE MARKER") — a general RUB synonym, not
  // whiteboard-specific vocabulary, same idiom as this verb's existing
  // "clean"/"wipe"/"polish" entries.
  [RUB]: { id: RUB, words: ['rub', 'clean', 'wipe', 'polish', 'erase'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.rub },
  // 'V dobj prep iobj' with prep 'with' added (wave 5, §10.2: "PRY DRAWER
  // WITH LEG") — `objects/closeOut.ts`'s drawer amendment gates on `{ has:
  // CHAIR_LEG }` rather than on the resolved `iobj`, so this pattern only
  // needs to exist for the phrase to parse at all; see that file's own
  // comment.
  [PRY]: { id: PRY, words: ['pry', 'lever', 'force', 'wedge'], patterns: ['V dobj', 'V dobj prep iobj'], preps: ['with'], class: 'direct', default: VERB_DEFAULTS.pry },
  [BREAK]: { id: BREAK, words: ['break', 'smash', 'destroy', 'hit', 'strike'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.break },
  [KICK]: { id: KICK, words: ['kick', 'stomp'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.kick },
  [CUT]: { id: CUT, words: ['cut', 'slice', 'saw', 'tear', 'rip', 'fold'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.cut },
  // "light" dropped (collides with FLOOR_LAMP's own doc-mandated noun).
  [BURN]: { id: BURN, words: ['burn', 'ignite'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.burn },
  // "hand" dropped (collides with SELF_HANDS' own doc-mandated noun).
  [GIVE]: { id: GIVE, words: ['give', 'offer'], patterns: ['V dobj prep iobj'], preps: ['to'], class: 'social', default: VERB_DEFAULTS.give },
  [SHOW]: { id: SHOW, words: ['show', 'present'], patterns: ['V dobj prep iobj'], preps: ['to'], class: 'social', default: VERB_DEFAULTS.show },
  // "go through"/"exit" removed (Ryan's v0.3.2 playtest, fix 2: CLIMB is
  // for climbing things — "exit" was swallowing bare EXIT before it ever
  // reached the `out` direction verb, and "go through" now belongs to IN,
  // alongside "enter", for the door-by-name case — see this table's IN/OUT
  // entries below and `move.ts`'s `traverseDoor`).
  [CLIMB]: { id: CLIMB, words: ['climb', 'climb on', 'scale', 'climb out'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.climb },
  [SIT]: { id: SIT, words: ['sit', 'sit on', 'sit down'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.sit },
  [STAND]: { id: STAND, words: ['stand', 'stand up', 'get up', 'sit up'], patterns: ['V', 'V dobj'], class: null, default: standDefault },
  [WAIT]: { id: WAIT, words: ['wait', 'z'], patterns: ['V'], class: null, default: waitDefault },
  [SLEEP]: { id: SLEEP, words: ['sleep', 'nap', 'rest', 'lie down'], patterns: ['V'], class: null, default: sleepDefault },
  // "call out" added (main-street-prose §6's "CALL OUT") — a general YELL synonym, not Main-Street-specific vocabulary.
  [YELL]: { id: YELL, words: ['yell', 'shout', 'scream', 'holler', 'call out'], patterns: ['V'], class: 'direct', default: yellDefault },
  [PRAY]: { id: PRAY, words: ['pray'], patterns: ['V'], class: null, default: prayDefault },
  [JUMP]: { id: JUMP, words: ['jump', 'hop', 'leap'], patterns: ['V'], class: null, default: jumpDefault },
  [SING]: { id: SING, words: ['sing', 'hum', 'whistle'], patterns: ['V'], class: null, default: singDefault },
  // "greet" added (main-street-prose §4.1's "GREET HORSE") — a general HELLO synonym, not horse-specific vocabulary.
  // "shush"/"quiet"/"wake" added (Nolan's Yard §4.2's "SHUSH DOG"/"QUIET DOG" and §4.3's "WAKE NOLAN") — general HELLO synonyms, not yard-specific vocabulary; none collides with any object noun.
  [HELLO]: { id: HELLO, words: ['hello', 'hi', 'hey', 'talk to', 'greet', 'shush', 'quiet', 'wake'], patterns: ['V', 'V dobj'], class: 'social', default: helloDefault },

  // Front Desk & Lobby's first NPC (front-desk-prose §5) — ASK/TELL/SHOW.
  // SHOW already exists below under this table's own `SHOW` id, which is
  // ALREADY `NPC_VERB_IDS.show` (both are `V('show')` — see `npc.ts`'s
  // `NPC_VERB_IDS`), so no change is needed there. ASK/TELL are new: no
  // room 1 content ever needed them. `default` reuses the existing,
  // already-approved `talk_to` family (response-families doc §0 note 3:
  // "Ask about something in particular") rather than inventing new prose —
  // it is the closest existing family to "you tried to converse and it
  // didn't land," and is the same shape `tests/npc.test.ts`'s own fixture
  // reuses for exactly this rung-2 fallback.
  [NPC_VERB_IDS.ask]: { id: NPC_VERB_IDS.ask, words: ['ask'], patterns: ['V npc about topic'], class: 'social', default: VERB_DEFAULTS.talk_to },
  [NPC_VERB_IDS.tell]: { id: NPC_VERB_IDS.tell, words: ['tell'], patterns: ['V npc about topic'], class: 'social', default: VERB_DEFAULTS.talk_to },

  [V_RIGHT]: { id: V_RIGHT, words: ['right', 'lift'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.move },
  [V_TIP]: { id: V_TIP, words: ['tip', 'lay down'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.move },
  [V_ROLL_UP]: { id: V_ROLL_UP, words: ['roll up'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.touch },
  // §4.9's terminal-login attempt. Bare (no dobj — "type"/"use terminal"/
  // "log in"/"press key" are all self-contained phrases). `room.ts`'s
  // room-level handler (gap 3/4) is what actually renders this text and
  // sets `FLAG_TERMINAL_TRIED`; `default` here is required non-null by
  // `validate.ts` but is otherwise dead prose for this bare-only verb —
  // see this file's header.
  [V_TYPE_TERMINAL]: {
    id: V_TYPE_TERMINAL,
    // "use terminal" dropped (collides with TERMINAL's own noun "terminal" —
    // builder's word choice, not doc text); "type"/"log in"/"press key"
    // still reach it.
    words: ['type', 'log in', 'press key'],
    patterns: ['V'],
    class: 'analytical',
    default: terminalTypeDefault,
  },
  // §4.10's "knock on door" — bare-default text applied unconditioned
  // (no {name} template) rather than invented generic "knock" prose; this
  // room only authors one KNOCK target. See this task's report.
  // "tap" added (General Store §9.2 "TAP WINDOW") — a general KNOCK synonym, not window-specific vocabulary.
  [V_KNOCK]: {
    id: V_KNOCK,
    words: ['knock', 'tap'],
    patterns: ['V dobj'],
    class: 'direct',
    default: 'You knock on your own door from the inside. Nothing answers, and you stand there a moment longer than you meant to.',
  },
  // §8.11 — works in the dark on purpose (constitution §10: the dark is
  // never a dead end); this is a distinct bare verb from `SEARCH`, not a
  // dark-gated variant of it, since `SEARCH FLOOR` (§8.1) is a different,
  // sight-based command that needs light — see `objects/floorBoards.ts`.
  [V_SWEEP]: {
    id: V_SWEEP,
    words: ['feel around', 'sweep', 'grope'],
    patterns: ['V'],
    class: 'direct',
    default: 'You sweep an arm across the boards. Paper. A lot of paper. Something with a brim on it, about an arm’s length away. Something else, further off, that turns out to be a lot of small sharp pieces of something, and you stop sweeping.',
  },
  // §15.1.5's "SLIDE DOWN BANISTER"/"RIDE BANISTER" — landing-only, but
  // registered here alongside every other act1 verb rather than in the
  // landing's own files, matching this table's existing convention.
  [V_SLIDE_DOWN]: { id: V_SLIDE_DOWN, words: ['slide down', 'ride'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.touch },
  // §15.1.4's "LEAN OVER RAIL"/"LOOK OVER BANISTER" — see `ids.ts`'s own
  // doc comment on `V_LEAN_OVER` for why this is a dobj-taking verb rather
  // than added words on the bare `V_LOOK_DOWN`.
  [V_LEAN_OVER]: { id: V_LEAN_OVER, words: ['lean over', 'look over'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.touch },
  [V_XYZZY]: { id: V_XYZZY, words: ['xyzzy'], patterns: ['V'], class: null, default: xyzzyDefault },
  [V_SUDO]: { id: V_SUDO, words: ['sudo'], patterns: ['V', 'V dobj'], class: null, default: sudoDefault },
  // "look for my name"/"search for my name" added (Post Office §5) — reach the same room-scoped WHO AM I override (`postOffice.ts`'s own room handler).
  // "search my name"/"search for myself"/"look myself up" added (County Library §9.4) — reach that room's own WHO AM I override (`countyLibrary.ts`'s own room handler).
  [V_WHOAMI]: {
    id: V_WHOAMI,
    words: ['who am i', 'whoami', 'look for my name', 'search for my name', 'search my name', 'search for myself', 'look myself up'],
    patterns: ['V'],
    class: null,
    default: whoamiDefault,
  },
  [V_HOLD_TO_LAMP]: { id: V_HOLD_TO_LAMP, words: ['hold to'], patterns: ['V dobj prep iobj'], preps: ['to'], class: 'analytical', default: VERB_DEFAULTS.touch },
  [V_TURN_OVER]: { id: V_TURN_OVER, words: ['turn over', 'examine other side'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.turn },
  [V_LOOK_UP]: { id: V_LOOK_UP, words: ['look up'], patterns: ['V'], class: null, default: lookUp },
  [V_LOOK_DOWN]: { id: V_LOOK_DOWN, words: ['look down'], patterns: ['V'], class: null, default: lookDown },
  [V_LOOK_OUTSIDE]: { id: V_LOOK_OUTSIDE, words: ['look outside'], patterns: ['V'], class: 'analytical', default: lookOutside },
  [V_CLEAN]: { id: V_CLEAN, words: ['clean up', 'sweep up'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.rub },
  [V_UNPLUG]: { id: V_UNPLUG, words: ['unplug'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.pull },

  // Front Desk & Lobby (front-desk-prose §4, §6) — see this file's own
  // "shared-text" section above for the strings these `default`s reuse.
  [V_RING]: { id: V_RING, words: ['ring', 'press'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.push },
  // Bare-only — one telephone in the game, no dobj needed (same idiom as V_TYPE_TERMINAL).
  [V_CALL]: { id: V_CALL, words: ['call'], patterns: ['V'], class: 'social', default: telephoneText },
  [V_POUR]: { id: V_POUR, words: ['pour'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.push },
  [V_DRINK]: { id: V_DRINK, words: ['drink'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.drink },
  [V_TILT]: { id: V_TILT, words: ['tilt'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.move },
  // Bare and dobj forms share one id and one text (same shape as room 1's STAND).
  [V_SIGN]: { id: V_SIGN, words: ['sign', 'write in', 'write name', 'write my name'], patterns: ['V', 'V dobj'], class: null, default: signRegisterText },
  // Bare-only, multi-word verb words (same idiom as V_WHOAMI) — needs a
  // room-level handler (front_desk's own `handlers`) to also run its effects.
  [V_FIND_MY_NAME]: { id: V_FIND_MY_NAME, words: ['find my name', 'find name'], patterns: ['V'], class: 'analytical', default: findNameText },
  [V_CHECK_DATE]: { id: V_CHECK_DATE, words: ['check date', 'look for date'], patterns: ['V'], class: 'analytical', default: checkDateText },

  // Main Street (main-street-prose §4, §6, §8) — new verbs. `default`s are
  // this builder's word choices/family reuse where the doc doesn't specify
  // one; see this task's report.
  // §4.2/§6/§8's "go to"/"approach"/"walk to" — a room-generic verb (not
  // billboard- or glow-specific vocabulary): billboard/horizon_glow author
  // their own handler (routes to the north boundary text); anything else in
  // scope with no handler falls to this verb's own `default`, the generic
  // boundary variant (§8) — "any GO TO <named place> that is not the
  // boarding house".
  // "go"/"walk" added (Town Edge §13.3/§13.6's "go to wall drug"/"go west"/
  // "walk overland") — this verb's own pattern is 'V dobj' only (no bare
  // form), so these two bare-looking words cost zero verb-noun-collision
  // warnings regardless of what nouns exist elsewhere; see this task's
  // report.
  // "go toward"/"go towards" added (wave-3 Main Street amendment §15.3 —
  // "GO TOWARD GLOW"/"GO TOWARD LIGHTS") — each is its own multi-word verb
  // form (mirrors "go to"/"walk to"), since `grammar.ts`'s `candidatesAtLength`
  // matches a verb form's words as an exact prefix: a bare "toward" word
  // would never fire for "go toward X" (only for "toward X" with no "go").
  // KNOWN GAP (this task's own escalation, see its report): `interpreter.ts`'s
  // `tryGoTo` recognizes any literal "go to <phrase>" ahead of grammar
  // matching at all, and resolves it only through `ScopeView.travel`'s
  // visited-room BFS — so whenever `<phrase>` also happens to be a
  // declared room alias/name (`diner`/`sundown`/`store`/`library`/`annex`/
  // `sheriff`/etc.), "GO TO <that phrase>" can never reach this verb's own
  // `V dobj` handler on a first, not-yet-visited approach: it is
  // intercepted and answered "You don't know the way there yet." instead.
  // "GO TOWARD X"/"WALK TO X"/"GO X"/"APPROACH X"/"ENTER X" are unaffected
  // (none of them start with the literal two-token "go"+"to" `tryGoTo`
  // matches on, or equal a whole room alias string). Pre-existing before
  // this task (already true of "GO TO STORE"/"GO TO SHERIFF"), not
  // something this task's own content changes can fix from inside
  // `mainStreet.ts`/`objects/mainStreet.ts` — an `interpreter.ts` change,
  // out of this task's module.
  [V_APPROACH]: {
    id: V_APPROACH,
    words: ['go to', 'approach', 'walk to', 'go', 'walk', 'go toward', 'go towards'],
    patterns: ['V dobj'],
    class: 'direct',
    default: { ref: ACT1_MAIN_STREET_BOUNDARY_GENERIC },
  },
  // §6's "CROSS STREET" — bare object-word, dobj resolves to `main_street_road`'s own noun "street".
  [V_CROSS]: { id: V_CROSS, words: ['cross'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.move },
  // §4.3's "WATCH GLOW" — resolves to `horizon_glow`'s own EXAMINE text via a handler; no bare form (nothing else in this room is watched).
  [V_WATCH]: { id: V_WATCH, words: ['watch'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.examine },
  // §4.1's "COUNT HORSES".
  [V_COUNT]: { id: V_COUNT, words: ['count'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.examine },
  // §4.1's "FEED HORSE" (the `GIVE <item> TO HORSE` forms are a genuine engine gap — see this task's report).
  [V_FEED]: { id: V_FEED, words: ['feed'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.give },
  // §4.5's bare "CROUCH" — same text as `examine paving`/`touch road` (`crouchText`, above); no room-level handler needed (sets no flag, and no other room declares this verb).
  [V_CROUCH]: { id: V_CROUCH, words: ['crouch', 'kneel'], patterns: ['V'], class: 'analytical', default: crouchText },
  // §4.6's "ASK MAN ABOUT <anything>"/"ASK MAN FOR HELP" — NOT wired: the word "ask" is already exclusively `NPC_VERB_IDS.ask`'s (`'V npc about topic'`, resolving only against `world.npcs`), and `validate.ts`'s verb-word-collision check is a hard error against claiming it a second time — the man, deliberately not an NPC (§4.6's own wiring note), has no way to reach it. See this task's report.
  // §4.6's "QUESTION MAN".
  [V_QUESTION]: { id: V_QUESTION, words: ['question'], patterns: ['V dobj'], class: 'social', default: VERB_DEFAULTS.talk_to },
  // §6's "WHAT YEAR IS IT"/"WHAT YEAR"/"WHAT'S THE DATE" — bare, no room-level handler needed (sets no flag).
  [V_WHAT_YEAR]: { id: V_WHAT_YEAR, words: ['what year is it', 'what year', "what's the date", 'what is the date'], patterns: ['V'], class: 'analytical', default: whatYearText },

  // Wave 2 (Post Office / General Store / Sheriff's Office) — new verbs.
  // Post Office §4.3's "reach under"/"look under shutter" ("look under"/"check under" already belong to LOOK_UNDER, above).
  [V_REACH_UNDER]: { id: V_REACH_UNDER, words: ['reach under', 'reach in'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.touch },
  // Post Office §4.4's bare "post letter"/"mail letter" — see this file's own comment on `postLetterText`.
  [V_POST_LETTER]: { id: V_POST_LETTER, words: ['post letter', 'mail letter'], patterns: ['V'], class: 'analytical', default: postLetterText },
  // Sheriff's Office §12.3.1's bare "measure map"/"use scale"/"measure to wall drug"/"measure distance".
  [V_MEASURE]: { id: V_MEASURE, words: ['measure', 'measure map', 'measure distance', 'use scale'], patterns: ['V'], class: 'analytical', default: measureMapText },
  // Main Street amendment §13.3's "FIND SHERIFF".
  [V_FIND]: { id: V_FIND, words: ['find'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.examine },
  // General Store §9.3's "fill cup".
  [V_FILL]: { id: V_FILL, words: ['fill'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.push },
  // Sheriff's Office §12.6.8's "ATTACK WHITLOCK"/"FOLLOW WHITLOCK" — see ids.ts's own comment on why these are new global verbs now. "hit"/"strike" already belong to BREAK (a verb-word collision, hard error), so ATTACK claims only its own word; its `default` reuses the already-authored `attack` family (`content/responses.ts`) rather than inventing new prose.
  [V_ATTACK]: { id: V_ATTACK, words: ['attack'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.attack },
  // No `follow` family exists in `content/responses.ts`; this `default` reuses the closest existing authored family (`talk_to`, already the fallback for ASK/TELL misses) rather than inventing new global prose — see this task's report. `npc.whitlock.handlers` (whitlock.ts) is what a player actually reaches for "FOLLOW WHITLOCK" in this build; no other NPC is follow-able yet.
  [V_FOLLOW]: { id: V_FOLLOW, words: ['follow'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.talk_to },

  // County Library (wave 3) — new verbs. Both bare, self-contained phrases
  // (same idiom as V_MEASURE/V_CHECK_DATE); `countyLibrary.ts`'s own
  // room-level handlers run the actual clue-granting effects alongside this
  // same text — see this table's own header note on `readCardsText`/
  // `typeReclamationText` for why `default` here is not dead prose the way
  // V_TYPE_TERMINAL's own `default` is for other rooms (it is the ONLY text
  // this bare verb ever renders, in the one room that declares it).
  // "open card drawer" also lands here, not on `card_catalogue`'s own OPEN
  // handler — see `objects/countyLibrary.ts`'s own comment on why that
  // phrase can't resolve as `OPEN` + dobj without colliding with
  // `fiche_drawers`'s own required-unique noun "drawer".
  [V_LOOK_UP_SUBJECT]: { id: V_LOOK_UP_SUBJECT, words: ['look up subject', 'open card drawer'], patterns: ['V'], class: 'analytical', default: readCardsText },
  [V_TYPE_RECLAMATION]: { id: V_TYPE_RECLAMATION, words: ['type reclamation', 'look up reclamation'], patterns: ['V'], class: 'analytical', default: typeReclamationText },

  // Sundown Diner (wave 3) — new verbs. `default`s reuse the closest
  // existing authored family where this room's own text doesn't apply
  // globally (same idiom as the blocks above).
  [V_EAT]: { id: V_EAT, words: ['eat', 'swallow', 'order food', 'order breakfast', 'ask for food'], patterns: ['V', 'V dobj'], class: 'direct', default: dinerEatText },
  // §4.3/§4.4's "order coffee"/"order pie"/"ask for pie" — generic default
  // reuses the closest existing authored family (this verb is never reached
  // bare in this build; `coffee_urn`'s and `pie_case`'s own handlers,
  // `objects/sundownDiner.ts`, are what a player actually gets).
  [V_ORDER]: { id: V_ORDER, words: ['order', 'ask for'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.examine },
  [V_LOOK_OUT]: { id: V_LOOK_OUT, words: ['look out window', 'look at street', 'look out'], patterns: ['V'], class: 'analytical', default: windowStreetText },
  [V_LOOK_FOR_FACE]: { id: V_LOOK_FOR_FACE, words: ['look for yourself', 'look for a face you know'], patterns: ['V'], class: 'analytical', default: dinerFacesText },
  // §6.8's "KISS PEARL"/"HUG PEARL" — no `kiss`/`hug` family exists; reuses TOUCH's own family rather than inventing new global prose. `npc.pearl.handlers` (pearl.ts) is what a player actually reaches.
  // "hug" moved off this verb in wave 4 (`ids.ts`'s own comment on `V_HUG`):
  // Jack needs KISS and HUG to render distinct text, which one shared verb
  // id can never do. Consequence for Pearl (out of this task's own
  // `pearl.ts` scope, flagged in this task's report rather than silently
  // patched there): `HUG PEARL` now resolves to `V_HUG` below, which she
  // has no handler for, so it falls to that verb's own generic default
  // (the same `VERB_DEFAULTS.touch` family) instead of her authored
  // `kissHugText` — no test exercises `HUG PEARL` today, only `KISS PEARL`.
  [V_KISS]: { id: V_KISS, words: ['kiss'], patterns: ['V dobj'], class: 'social', default: VERB_DEFAULTS.touch },
  // Jack (wave 4, §6.8) — "HUG JACK", now its own verb id; see `ids.ts`'s own comment on `V_HUG`.
  [V_HUG]: { id: V_HUG, words: ['hug', 'embrace', 'hold'], patterns: ['V dobj'], class: 'social', default: VERB_DEFAULTS.touch },

  // Town Edge (wave 3) — new verb. Bare, self-contained (no dobj, no flag,
  // no other room declares it) — same idiom as V_WHAT_YEAR/V_CHECK_DATE.
  [V_THINK]: { id: V_THINK, words: ['think', 'remember', 'concentrate'], patterns: ['V'], class: 'analytical', default: townEdgeThinkText },

  // The Arrowhead Motel (wave 4) — two brand-new verbs (`ids.ts`'s own
  // comment: neither word exists anywhere else in this table). Both are
  // always caught by `monster_truck`'s/`catan_box`'s own handlers
  // (`objects/jacksMotel.ts`) in the one room that declares them; `default`
  // reuses the closest existing authored family rather than inventing new
  // global prose, same idiom as V_ATTACK/V_FOLLOW above.
  [V_DRIVE]: { id: V_DRIVE, words: ['drive', 'start'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.push },
  [V_PLAY]: { id: V_PLAY, words: ['play'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.touch },

  // Nolan's Yard (wave 5) — bare, self-contained phrases (see `ids.ts`'s own comments on `V_EAT_PIE`/`V_EAT_PILL`).
  [V_EAT_PIE]: { id: V_EAT_PIE, words: ['eat pie'], patterns: ['V'], class: 'direct', default: eatPieText },
  [V_EAT_PILL]: { id: V_EAT_PILL, words: ['eat pill'], patterns: ['V'], class: 'direct', default: pillBottleOpenText },
  // Wave 5 (§8.1's ruling) — "ASSEMBLE STRIPS"/"PIECE TOGETHER STRIPS"/
  // "REASSEMBLE STRIPS"/"SORT STRIPS"/"PUT TOGETHER STRIPS". Words per the
  // main-session ruling; the table-in-scope refusal/success texts and the
  // `TABLE_IN_SCOPE` `Cond` are authored/exported from `objects/closeOut.ts`
  // (this task's own module). `SHREDDED_STRIPS` itself belongs to the
  // concurrent Nolan's Yard task's own module (`objects/nolansYard.ts`) —
  // out of this file list — but that object's own comment explicitly left
  // its ASSEMBLE/READ wiring for this task to add, so its handler (`{
  // verbs: [READ, V_ASSEMBLE], when: TABLE_IN_SCOPE, effects:
  // ASSEMBLE_SUCCESS_EFFECTS }` plus the refusal rule) is wired there
  // directly, importing this file's exports — a small, targeted edit to
  // that object's own `handlers` array, not a redesign of the yard; see
  // this task's report. "READ STRIPS" is NOT one of THIS verb's own
  // `words` (READ is the reserved built-in verb id and already claims
  // "read" globally) — it reaches the same behavior via that same handler
  // instead.
  [V_ASSEMBLE]: { id: V_ASSEMBLE, words: ['assemble', 'piece together', 'reassemble', 'sort', 'put together'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.touch },

  // §8 gap 2: the real reserved `INVENTORY_VERB_ID`, not a room-local id.
  // `default` refs the global `inventory.empty` family — `room.ts`'s own
  // handler overrides it for the empty-hands case (§8.9/§14.4).
  [INVENTORY_VERB_ID]: { id: INVENTORY_VERB_ID, words: ['inventory', 'i', 'inv'], patterns: ['V'], class: null, default: { ref: 'inventory.empty' } },

  // The twelve directions plus AGAIN. `move.ts` reserves these ids and
  // supplies the semantics; content supplies the words. Without them a
  // player cannot leave a room at all — the exit exists and nothing can
  // traverse it. `out` is this room's real exit (canon: "exits: Landing");
  // the rest are registered so that typing a compass direction gets the
  // authored `move.noExit` answer rather than "I don't understand", which
  // is the difference between a world with edges and a broken parser.
  // "go north"/"walk north" added (Town Edge §13.3) — reach the same real
  // `n` exit as bare "north" (the boundary gate's own blockedText), so no
  // separate string is needed; both words are already-reported nouns
  // ("north", `horizon_glow`'s own noun) — zero new verb-noun-collision
  // warnings (the dedup is per verb+word, and "n"/"north" is already
  // reported from the bare word above).
  [DIRECTION_VERB_IDS.n]: { id: DIRECTION_VERB_IDS.n, words: ['north', 'n', 'go north', 'walk north'], patterns: ['V'], class: null, default: { ref: 'move.noExit' } },
  [DIRECTION_VERB_IDS.s]: { id: DIRECTION_VERB_IDS.s, words: ['south', 's', 'go south'], patterns: ['V'], class: null, default: { ref: 'move.noExit' } },
  [DIRECTION_VERB_IDS.e]: { id: DIRECTION_VERB_IDS.e, words: ['east', 'e'], patterns: ['V'], class: null, default: { ref: 'move.noExit' } },
  [DIRECTION_VERB_IDS.w]: { id: DIRECTION_VERB_IDS.w, words: ['west', 'w'], patterns: ['V'], class: null, default: { ref: 'move.noExit' } },
  [DIRECTION_VERB_IDS.ne]: { id: DIRECTION_VERB_IDS.ne, words: ['northeast', 'ne', 'go northeast'], patterns: ['V'], class: null, default: { ref: 'move.noExit' } },
  [DIRECTION_VERB_IDS.nw]: { id: DIRECTION_VERB_IDS.nw, words: ['northwest', 'nw', 'go northwest'], patterns: ['V'], class: null, default: { ref: 'move.noExit' } },
  [DIRECTION_VERB_IDS.se]: { id: DIRECTION_VERB_IDS.se, words: ['southeast', 'se', 'go southeast'], patterns: ['V'], class: null, default: { ref: 'move.noExit' } },
  [DIRECTION_VERB_IDS.sw]: { id: DIRECTION_VERB_IDS.sw, words: ['southwest', 'sw', 'go southwest'], patterns: ['V'], class: null, default: { ref: 'move.noExit' } },
  [DIRECTION_VERB_IDS.up]: { id: DIRECTION_VERB_IDS.up, words: ['up', 'u', 'upstairs', 'go up'], patterns: ['V'], class: null, default: { ref: 'move.noExit' } },
  // §15.2's fire list adds `descend`/`climb down` as synonyms for DOWN —
  // both reach the landing's own `down` exit (§15.1.6: neither is declared
  // on `your_room`, which has no `down` exit at all, so they fall to the
  // ordinary `move.noExit` family there, correctly). `take stairs`/
  // `enter stairs`/`follow stairs` (also named in §15.2's fire list) are
  // NOT added: "stairs" is `landing_stairs`'s own noun, and putting it
  // literally into a bare verb's `words` trips `validate.ts`'s
  // `verb-noun-collision` warning — this world's own `validate(WORLD)`
  // must stay at zero warnings (`tests/world-act1.test.ts`). Left unwired;
  // see this task's report.
  [DIRECTION_VERB_IDS.down]: {
    id: DIRECTION_VERB_IDS.down,
    words: ['down', 'd', 'downstairs', 'descend', 'climb down', 'go down'],
    patterns: ['V'],
    class: null,
    default: { ref: 'move.noExit' },
  },
  // §15.1.6's own note: "back" also returns through the door. Literal
  // "enter room"/"enter door" PHRASES are still not added — same
  // `verb-noun-collision` reason as DOWN's dropped synonyms above
  // ("room"/"door" are both real nouns) — but that reasoning is about
  // baking a noun into the verb's own `words`, not about a real `V dobj`
  // pattern where the noun is resolved by the grammar/scope machinery
  // like any other object. Ryan's v0.3.2 playtest, fix 1: `'V dobj'` added
  // so "ENTER DOOR"/"GO THROUGH DOOR" reach `respond.ts`'s door-traversal
  // dispatch (`traverseDoor`) before ever falling to this verb's own
  // `default` — bare "in"/"enter" etc. (no dobj) are unaffected, still
  // handled entirely by `traverseDirection`, never touching `default`
  // (this table's header). "go through" moves here from CLIMB (see that
  // entry's own comment) — direction-agnostic in practice, since
  // `traverseDoor` finds the named door's exit regardless of which
  // direction id the player's chosen phrasing happens to be registered
  // under. `default` is no longer dead prose for the dobj case: a resolved
  // non-door object (e.g. "enter lamp") now falls through to this
  // already-authored, `{name}`-templated family instead of the movement-
  // only `move.noExit`.
  // "get in" added (wave-4's Arrowhead Motel §4.1 "GET IN TRUCK") — a general IN synonym, not truck-specific vocabulary.
  [DIRECTION_VERB_IDS.in]: {
    id: DIRECTION_VERB_IDS.in,
    words: ['in', 'inside', 'enter', 'back', 'go through', 'get in', 'go in'],
    patterns: ['V', 'V dobj'],
    class: null,
    default: VERB_DEFAULTS.enter,
  },
  // "exit" added (fix 2: EXIT was captured by CLIMB and required an
  // object it could never get bare) — bare EXIT/LEAVE/OUT/OUTSIDE all
  // reach this verb's own `'V'` pattern, unchanged. "'V dobj'" added for
  // the same door-by-name reason as IN, above ("EXIT DOOR"/"USE DOOR" via
  // USE_VERB_ID both resolve through the same `traverseDoor` call).
  [DIRECTION_VERB_IDS.out]: {
    id: DIRECTION_VERB_IDS.out,
    words: ['out', 'outside', 'leave', 'exit', 'go out'],
    patterns: ['V', 'V dobj'],
    class: null,
    default: VERB_DEFAULTS.exit,
  },
  // Ryan's v0.3.2 playtest, fix 2: USE didn't exist at all before (any
  // "USE X" fell to `unknownVerbKnownNoun`). At minimum it reaches fix 1
  // for a door (`respond.ts`'s `DOOR_TRAVERSAL_VERB_IDS`); a resolved
  // non-door object falls to `default` below, which is not yet authored —
  // `use.default` needs a `narrative-writer` pass (see this task's
  // report); `render()` throws loudly rather than printing nothing if that
  // path is ever actually reached before it's authored.
  [USE_VERB_ID]: { id: USE_VERB_ID, words: ['use'], patterns: ['V dobj'], class: 'direct', default: { ref: 'use.default' } },

  // Ryan's v0.3.2 playtest, fix 3: HELP/ABOUT, registered as meta verbs
  // (no turn, no clock, no profile tally — `VerbDef.meta: true`, the same
  // mechanism `mvp-prologue.ts`'s VERSION already uses). Words and family
  // keys transcribed from `docs/superpowers/specs/2026-08-30-response-
  // families.md` §10 (`meta.help`/`meta.about`, already authored there,
  // "awaiting voice review and Ryan's spot-check" as of this task — not
  // wired into `world.responses` here; see this task's report for why).
  [V_HELP]: { id: V_HELP, words: ['help', '?', 'commands', 'what can i do'], patterns: ['V'], class: null, meta: true, default: { ref: 'meta.help' } },
  [V_ABOUT]: { id: V_ABOUT, words: ['about', 'credits', 'info'], patterns: ['V'], class: null, meta: true, default: { ref: 'meta.about' } },
  // VERSION — a meta verb (no turn), same shape as the MVP prologue's own.
  [V_VERSION]: { id: V_VERSION, words: ['version'], patterns: ['V'], class: null, meta: true, default: `Intentionally Blank v${GAME_VERSION}.` },

  // AGAIN/G (response-families doc §9's `again.nothing`, now authored):
  // `interpreter.ts`'s `resolveAgain` special-cases the resolved match to
  // replay `parser.last` when one exists; this `default` only ever
  // renders rung 2b's fallback, when there is nothing to repeat.
  [AGAIN_VERB_ID]: { id: AGAIN_VERB_ID, words: ['again', 'g'], patterns: ['V'], class: null, default: { ref: 'again.nothing' } },
};
