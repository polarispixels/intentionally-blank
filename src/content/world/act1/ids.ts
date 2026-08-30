// Act I, room 1 — "your room" — id constants.
//
// Source: `docs/superpowers/specs/2026-08-30-opening-room-prose.md` (the
// authored prose), `docs/spec/09-canon-decisions.md` entries 18-19 (page
// 7/8 lives in the fedora's hatband; the drawer stays shut through M1).
//
// Every id here is namespaced `act1_*` so this module can sit beside the
// MVP prologue's `mvp_prologue_*` ids (`src/content/scenes/mvp-prologue.ts`)
// without collision, matching that file's own convention.

import { C, F, M, N, O, R, T, V } from '../../../engine/ids';

// ---------------------------------------------------------------------------
// Rooms
// ---------------------------------------------------------------------------

export const YOUR_ROOM = R('act1_your_room');

/**
 * The landing beyond the door — prose doc §15.1. Canon decision 20 splits
 * story architecture §3 room 2 ("Landing & Front Desk") into this room
 * (the player's floor: stairs, banister, three doors, the runner) and the
 * front desk/lobby below it (Marlow, the guest register, the key rack —
 * M2, not built here). Was `LANDING_STUB` / `act1_landing_stub`, a
 * content-free placeholder that crashed on entry (`move.ts`'s
 * `renderArrival` throws with no `description`); this task replaces it
 * with the real room.
 */
export const LANDING = R('act1_landing');

/**
 * Front Desk & Lobby (spec `docs/superpowers/specs/2026-09-01-front-desk-
 * prose.md`, canon decision 20's other half) — the room the Landing's
 * stairs were pointing at. Zone 1 room 2b, "boarding house front desk",
 * not the motel (canon decision 24 — spec 03's roster line is corrected
 * separately, not by this task; see this task's report).
 */
export const FRONT_DESK = R('act1_front_desk');

// ---------------------------------------------------------------------------
// Objects — the thirteen the task names, plus the sub-parts the prose
// document's own noun lists require to keep distinct examine text
// addressable (a door's bolt, a window's sill, a terminal's screen/cursor/
// keyboard, all listed as *nouns of the parent object* in the prose doc,
// §4.1/§4.9/§4.10/§5 — the engine has no "which noun word resolved" signal
// inside a handler, so a sub-part with its own distinct response needs its
// own `ObjectId`. See this task's report.)
// ---------------------------------------------------------------------------

export const FEDORA = O('act1_fedora');
/** Fedora sub-part — see the `DOOR_BOLT`/`WINDOW_SILL` comment below: 'crown'/'band' need distinct EXAMINE/SEARCH text from plain 'fedora'/'hat'/'brim'. */
export const FEDORA_BAND = O('act1_fedora_band');
export const PAGE_78 = O('act1_page_78');
export const FLOOR_LAMP = O('act1_floor_lamp');
export const PULL_CHAIN = O('act1_pull_chain');
export const DESK = O('act1_desk');
export const DRAWER = O('act1_drawer');
export const PAPERS = O('act1_papers');
export const BROKEN_GLASS = O('act1_broken_glass');
export const STAIN = O('act1_stain');
export const TERMINAL = O('act1_terminal');
export const DOOR = O('act1_door');
export const WINDOW = O('act1_window');
export const SELF = O('act1_self');
export const SELF_HANDS = O('act1_self_hands');
export const SELF_FOREARM = O('act1_self_forearm');
export const SELF_HEAD = O('act1_self_head');
export const SELF_POCKETS = O('act1_self_pockets');
export const SELF_FACE = O('act1_self_face');
export const SELF_COAT = O('act1_self_coat');

/** Door sub-part (`§4.10`: "plus `bolt` as a sub-noun"). */
export const DOOR_BOLT = O('act1_door_bolt');
/** Window sub-part (`§5`: the sill/latch, the room's designated secret, second step). */
export const WINDOW_SILL = O('act1_window_sill');
/** Terminal sub-parts (`§4.9`: screen, cursor, keyboard each carry distinct examine text). */
export const TERMINAL_SCREEN = O('act1_terminal_screen');
export const TERMINAL_CURSOR = O('act1_terminal_cursor');
export const TERMINAL_KEYBOARD = O('act1_terminal_keyboard');
/** Miscellaneous room-scale objects the prose doc's §8 "reasonable actions" name individually. */
export const FLOOR_BOARDS = O('act1_floor_boards');
export const DUST = O('act1_dust');
export const PEN = O('act1_pen');
export const COIN = O('act1_coin');
export const RADIATOR = O('act1_radiator');
export const WALLPAPER = O('act1_wallpaper');
export const CEILING = O('act1_ceiling');

// ---------------------------------------------------------------------------
// Objects — the Landing (§15.1.5's five furniture objects), plus a second
// object for the player's own door seen from the outside (§15.1.5's own
// wiring note: `DOOR`'s `location` is `YOUR_ROOM`, a single `PlaceId`, so it
// is never in scope from `LANDING` — the engine has no "one object visible
// from two rooms" mechanism. The note leaves "one object, two `at`-gated
// handler branches, or a second object" as an open call for whichever
// builder lands this; this task takes the second-object reading, since
// scope naturally disambiguates it: `DOOR` resolves only from inside,
// `YOUR_DOOR_OUTSIDE` only from the landing, with no `Cond` branching
// needed anywhere), plus one hidden gate object (see its own comment).
// ---------------------------------------------------------------------------

export const LANDING_STAIRS = O('act1_landing_stairs');
export const LANDING_BANISTER = O('act1_landing_banister');
export const YOUR_DOOR_OUTSIDE = O('act1_your_door_outside');
/** Sub-part: 'number' needs distinct EXAMINE text from plain 'door' — same reason as `FEDORA_BAND`/`DOOR_BOLT`. */
export const YOUR_DOOR_OUTSIDE_NUMBER = O('act1_your_door_outside_number');
export const LANDING_DOORS = O('act1_landing_doors');
export const LANDING_CARPET = O('act1_landing_carpet');

/**
 * §15.2's build boundary, implemented as a permanently-closed exit `door`
 * — see `landing.ts`'s header for why. Never described, never given
 * `nouns` (so it can never resolve as a noun and never appears to the
 * player), exists purely so `ExitDefSlice.door` has a real `ObjectId`
 * whose `open` state is always `false` (no `container` declared —
 * `resolve.ts`'s `objectState` falls back to `declared?.container?.open ??
 * false`, and nothing anywhere ever sets an overlay for this id).
 */
export const LANDING_BOUNDARY_GATE = O('act1_landing_boundary_gate');

// ---------------------------------------------------------------------------
// Front Desk & Lobby — the room's 7 objects (front-desk-prose §4), plus the
// sub-parts the same "which noun word resolved" gap (this file's own header
// comment on `FEDORA_BAND`/`DOOR_BOLT`/etc.) requires for the counter's bell/
// telephone/coffee pot and the register's own torn page — see this task's
// report — plus the one new inventory item (`room_key`, front-desk-prose
// §8) and the build-boundary gate that now moves down to this room's own
// street door (§9 there).
// ---------------------------------------------------------------------------

export const FRONT_DESK_COUNTER = O('act1_front_desk_counter');
/** Sub-part (§4.1's "ring bell/press bell/hit bell" — its own EXAMINE/RING/BREAK text, distinct from the rest of the counter). */
export const FRONT_DESK_BELL = O('act1_front_desk_bell');
/** Sub-part (§4.1's "examine telephone/use telephone/call" — its own text). */
export const FRONT_DESK_TELEPHONE = O('act1_front_desk_telephone');
/** Sub-part (§4.1's "pour coffee/drink coffee/take coffee" — its own text). */
export const FRONT_DESK_COFFEE_POT = O('act1_front_desk_coffee_pot');
/** Sub-part (§6's "TAKE TOWEL"/"USE TOWEL" — its own text; behind the desk per §5.3's greeting). */
export const FRONT_DESK_TOWEL = O('act1_front_desk_towel');
export const GUEST_REGISTER = O('act1_guest_register');
/** Sub-part (§4.2 — the torn page/stub/impression: distinct EXAMINE/TILT/READ/RUB text from plain "register"/"book"). */
export const GUEST_REGISTER_PAGE = O('act1_guest_register_page');
export const KEY_RACK = O('act1_key_rack');
export const LOBBY_RADIO = O('act1_lobby_radio');
export const LOBBY_CHAIRS = O('act1_lobby_chairs');
export const STREET_DOOR = O('act1_street_door');
export const FRONT_DESK_STAIRS = O('act1_front_desk_stairs');
/** §8's new inventory item — granted by `topic_key` (marlow.ts). */
export const ROOM_KEY = O('act1_room_key');

// ---------------------------------------------------------------------------
// Marlow — the game's first NPC (front-desk-prose §5).
// ---------------------------------------------------------------------------

export const MARLOW = N('act1_marlow');

// ---------------------------------------------------------------------------
// Flags — spec §1's table
// ---------------------------------------------------------------------------

export const FLAG_STOOD_UP = F('act1_stood_up');
export const FLAG_LAMP_RIGHTED = F('act1_lamp_righted');
export const FLAG_ROOM_SEARCHED = F('act1_room_searched');
export const FLAG_TERMINAL_TRIED = F('act1_terminal_tried');
export const FLAG_POCKETS_CHECKED = F('act1_pockets_checked');
export const FLAG_WOUND_EXAMINED = F('act1_wound_examined');
export const FLAG_DOOR_BOLT_DRAWN = F('act1_door_bolt_drawn');
export const FLAG_WINDOW_OPEN = F('act1_window_open');

// ---------------------------------------------------------------------------
// Front Desk & Lobby — flags (front-desk-prose §1's table).
// ---------------------------------------------------------------------------

export const FLAG_MET_MARLOW = F('act1_met_marlow');
export const FLAG_REGISTER_GAP_SEEN = F('act1_register_gap_seen');
export const FLAG_REGISTER_IMPRESSION_FOUND = F('act1_register_impression_found');
export const FLAG_MARLOW_PRESSED = F('act1_marlow_pressed');
export const FLAG_MARLOW_KNOWS_YOU_KNOW = F('act1_marlow_knows_you_know');
export const FLAG_MARLOW_TOLD_ABOUT_ROOM = F('act1_marlow_told_about_room');
export const FLAG_SPARE_KEY_GIVEN = F('act1_spare_key_given');
export const FLAG_TOWEL_TAKEN = F('act1_towel_taken');

/**
 * Not in the prose doc's own §1 table — a builder-added flag mirroring
 * `mvp-prologue.ts`'s `FLAG_ROOM_SEEN`/`roomSeenEvent` idiom (the
 * established pattern in this codebase for "render once at game start,"
 * since `initialState()` seeds `visited[startRoom]` directly and bypasses
 * `renderArrival`/`firstVisit` for the actual start room — see
 * `gamestate.ts`'s own doc comment). Gates §2's six opening paragraphs
 * inside `room.your_room.description`'s first (dark) rule; flips via the
 * matching ambient event the following tick, same as the MVP prologue.
 */


/**
 * Not in the prose doc's own §1 table either — track the pull chain's
 * "first ever" on/off transitions (§4.3's four-way rotation table needs
 * them; there is no other way to express "first time" in the `Cond` DSL
 * than a dedicated flag).
 */
export const FLAG_LAMP_FIRST_ON_DONE = F('act1_lamp_first_on_done');
export const FLAG_LAMP_FIRST_OFF_DONE = F('act1_lamp_first_off_done');

// ---------------------------------------------------------------------------
// Clues — spec §1's table
// ---------------------------------------------------------------------------

export const CLUE_CALM_SEARCH = C('act1_clue_calm_search');
export const CLUE_DRAWER_HELD = C('act1_clue_drawer_held');
export const CLUE_BOLT_THROWN = C('act1_clue_bolt_thrown');
export const CLUE_WINDOW_EXIT = C('act1_clue_window_exit');
export const CLUE_NOTHING_NAMED = C('act1_clue_nothing_named');
export const CLUE_PAGE_INDENTATION = C('act1_clue_page_indentation');
export const CLUE_TERMINAL_BURN = C('act1_clue_terminal_burn');

// ---------------------------------------------------------------------------
// Front Desk & Lobby — clues (front-desk-prose §1's table).
// ---------------------------------------------------------------------------

export const CLUE_REGISTER_GAP = C('act1_clue_register_gap');
export const CLUE_REGISTER_IMPRESSION = C('act1_clue_register_impression');
export const CLUE_NO_NAME_RECALLED = C('act1_clue_no_name_recalled');
export const CLUE_HOUSE_EMPTY = C('act1_clue_house_empty');
export const CLUE_VISITOR_UNREMARKABLE = C('act1_clue_visitor_unremarkable');

// ---------------------------------------------------------------------------
// Memory — spec §6
// ---------------------------------------------------------------------------

export const MEM_HAT = M('act1_mem_hat');

// ---------------------------------------------------------------------------
// Verbs the prose doc needs beyond the response-families' global set (§9's
// wiring summary): `right`/`tip` the lamp, `roll up` the sleeve, the
// terminal's login attempt, `knock` on the door, the dark-only `sweep`/
// `feel around`, and the two single-word easter eggs.
// ---------------------------------------------------------------------------

export const V_RIGHT = V('act1_right');
export const V_TIP = V('act1_tip');
export const V_ROLL_UP = V('act1_roll_up');
export const V_TYPE_TERMINAL = V('act1_type_terminal');
export const V_KNOCK = V('act1_knock');
export const V_SWEEP = V('act1_sweep');
export const V_XYZZY = V('act1_xyzzy');
export const V_SUDO = V('act1_sudo');
export const V_WHOAMI = V('act1_whoami');
export const V_HOLD_TO_LAMP = V('act1_hold_to_lamp');
export const V_TURN_OVER = V('act1_turn_over');
export const V_LOOK_UP = V('act1_look_up');
export const V_LOOK_DOWN = V('act1_look_down');
export const V_LOOK_OUTSIDE = V('act1_look_outside');
export const V_CLEAN = V('act1_clean');
export const V_UNPLUG = V('act1_unplug');
// §8.9's "INVENTORY at start" now uses the engine's own real reserved
// `INVENTORY_VERB_ID` (`engine/respond.ts`, §8 gap 2) — no room-local id
// needed. `words` (in `verbs.ts`) deliberately does NOT claim "i" (also a
// `SELF` noun, §4.12) to avoid `validate.ts`'s verb/noun collision warning.

// ---------------------------------------------------------------------------
// §15's landing-only verb: `SLIDE DOWN`/`RIDE` the banister (§15.1.5). Every
// other "extra verb" §15 names is either an existing verb with new words
// added (`OPEN`/`try handle`, `DOWN`/`descend` etc. — see `verbs.ts`) or an
// existing bare verb reused via a room-level handler (`KNOCK`, `LOOK DOWN`).
// ---------------------------------------------------------------------------

export const V_SLIDE_DOWN = V('act1_slide_down');
/**
 * "LEAN OVER"/"LOOK OVER" (§15.1.4's note: `LEAN OVER RAIL`/`LOOK OVER
 * BANISTER` answer with the same text as bare `LOOK DOWN`). A dobj-taking
 * verb, deliberately — putting "rail"/"banister" literally into a bare
 * verb's `words` (so it could stay a zero-dobj phrase like `V_LOOK_DOWN`)
 * would collide with those exact words already being `landing_banister`'s
 * own nouns (`validate.ts`'s `verb-noun-collision` warning, and this
 * world's own `validate(WORLD)` must stay at zero warnings).
 */
export const V_LEAN_OVER = V('act1_lean_over');

// ---------------------------------------------------------------------------
// Ryan's v0.3.2 playtest fix 3: `HELP`/`ABOUT`, registered as meta verbs
// (§8's `docs/superpowers/specs/2026-08-30-response-families.md` §10
// already names the exact family keys these need: `meta.help`/
// `meta.about` — not yet wired into `world.responses`, see `verbs.ts`'s
// own doc comment on these ids).
// ---------------------------------------------------------------------------

export const V_HELP = V('act1_help');
export const V_ABOUT = V('act1_about');

// ---------------------------------------------------------------------------
// Front Desk & Lobby — new verbs (front-desk-prose §4, §5, §6). Words chosen
// by this builder where the doc doesn't specify them (matching `verbs.ts`'s
// own established convention for room 1) — see this task's report for the
// vocabulary-collision calls made along the way (bell/telephone/coffee pot
// each needed a sub-part rather than a shared verb on the whole counter,
// same reasoning as `ids.ts`'s own header on `FEDORA_BAND`/`DOOR_BOLT`).
// ---------------------------------------------------------------------------

/** §4.1 "ring bell / press bell" — "hit bell" reuses the existing BREAK verb's own word "hit" on the bell sub-part instead (BREAK already claims "hit" globally). */
export const V_RING = V('act1_ring');
/** §4.1 "call" (bare — one telephone in the game, no dobj needed). */
export const V_CALL = V('act1_call');
/** §4.1 "pour coffee" ("drink coffee"/"take coffee" reuse the existing DRINK/TAKE words on the coffee pot sub-part). */
export const V_POUR = V('act1_pour');
export const V_DRINK = V('act1_drink');
/** §4.2 "tilt register"/"tilt page" — the impression's sight route. */
export const V_TILT = V('act1_tilt');
/** §4.2 "sign register"/"write in register"/"write name"/"write my name" — pure flavor, no effects, both bare and dobj forms share one id (same shape as room 1's STAND). */
export const V_SIGN = V('act1_sign');
/** §4.2 "find my name" — bare, multi-word verb words (same idiom as room 1's V_WHOAMI), needs a room-level handler (front-desk's own `handlers`) to run its effects. */
export const V_FIND_MY_NAME = V('act1_find_my_name');
/** §4.5/§6 "check date"/"look for date" (bare) and "turn over magazine" (dobj, via the existing room-1 V_TURN_OVER on `lobby_chairs`) share one line of text. */
export const V_CHECK_DATE = V('act1_check_date');
