// Act I, room 1 — "your room" — id constants.
//
// Source: `docs/superpowers/specs/2026-08-30-opening-room-prose.md` (the
// authored prose), `docs/spec/09-canon-decisions.md` entries 18-19 (page
// 7/8 lives in the fedora's hatband; the drawer stays shut through M1).
//
// Every id here is namespaced `act1_*` so this module can sit beside the
// MVP prologue's `mvp_prologue_*` ids (`src/content/scenes/mvp-prologue.ts`)
// without collision, matching that file's own convention.

import { C, F, M, N, O, P, Q, R, T, V } from '../../../engine/ids';

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
// Hint ladders — front-desk-prose appendix §15. The first real puzzles/
// questions declared in this game; ids are the spec's own literal names.
// ---------------------------------------------------------------------------

export const QUESTION_THE_RECORD = Q('act1_q_the_record');
export const QUESTION_OUT_OF_THIS_ROOM = Q('act1_q_out_of_this_room');
export const PUZZLE_REGISTER = P('act1_register');
export const PUZZLE_LEAVE_YOUR_ROOM = P('act1_leave_your_room');

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

// ---------------------------------------------------------------------------
// Main Street (`docs/superpowers/specs/2026-09-02-main-street-prose.md`) —
// the fourth room, and the first exterior. Zone 1 room 3.
// ---------------------------------------------------------------------------

export const MAIN_STREET = R('act1_main_street');

// Objects — §4's seven, plus one sub-part (`MAIN_STREET_PAVING`, the same
// "which noun word resolved" gap `ids.ts`'s own header explains for
// `FEDORA_BAND`/`DOOR_BOLT`/etc.: `main_street_road`'s own noun list mixes
// "street"/"road" — EXAMINE gives the wide/empty description — with
// "ground"/"floor"/"surface"/"pavement"/"paving"/"asphalt"/"tarmac"/"kerb"/
// "curb"/"gutter" — EXAMINE gives the crouch-and-read-the-brick text — and
// one handler can't tell which noun word resolved. `MAIN_STREET_ROAD`'s own
// nouns keep "street"/"road"/"main street" plus "alley"/"alleyway" (the
// alley refusal is a different *verb*, not a different noun on the same
// EXAMINE, so no sub-part is needed for it); the ground/paving words move to
// `MAIN_STREET_PAVING`) plus one always-closed gate object for the boundary
// exits (mirrors `LANDING_BOUNDARY_GATE` — see that id's own comment).
export const HORSES = O('act1_horses');
export const BILLBOARD = O('act1_billboard');
export const HORIZON_GLOW = O('act1_horizon_glow');
export const BRICK_ROW = O('act1_brick_row');
/** Sub-part — same "which noun word resolved" gap: `read wall sign`/`examine painted sign`/`examine advertisement` need text distinct from plain `examine buildings`, same verb (EXAMINE/READ) as the parent. */
export const BRICK_ROW_SIGN = O('act1_brick_row_sign');
/** Sub-part — same gap: `look in window`/`examine display`/`read price list`/`examine prices` need text distinct from the parent's own EXAMINE; folds "window"/"windows"/"glass" off the parent's noun list along with the new "display"/"price list"/"prices" words the doc's own handler section names but its noun-list header doesn't (see this task's report). */
export const BRICK_ROW_WINDOW = O('act1_brick_row_window');
export const MAIN_STREET_ROAD = O('act1_main_street_road');
/** Sub-part — see this block's own header comment. */
export const MAIN_STREET_PAVING = O('act1_main_street_paving');
/** The gray-coveralled man — an object with handlers (§4.6's own wiring note), not an NPC: no `NpcDefSlice`, no topics, no schedule. */
export const MAINTENANCE_MAN = O('act1_maintenance_man');
export const BOARDING_HOUSE = O('act1_boarding_house');
/** §8's build boundary — always-closed door target for `north`/`south`/`west`, mirroring `LANDING_BOUNDARY_GATE` (no `nouns`: never resolvable, never described). */
export const MAIN_STREET_BOUNDARY_GATE = O('act1_main_street_boundary_gate');

// Flags — §1's table.
export const FLAG_VISITED_MAIN_STREET = F('act1_visited_main_street');
export const FLAG_SEEN_MAINTENANCE_MAN = F('act1_seen_maintenance_man');
export const FLAG_HORSE_TOUCHED = F('act1_horse_touched');
export const FLAG_CROSSED_STREET = F('act1_crossed_street');

// Clues — §1's table.
export const CLUE_HORIZON_GLOW = C('act1_clue_horizon_glow');
export const CLUE_SAME_DISTANCE = C('act1_clue_same_distance');

// New verbs the doc needs beyond the existing global/room-1/front-desk set.
// Words chosen by this builder where the doc doesn't specify them (matching
// `verbs.ts`'s own established convention) — see this task's report.
/** §4.2/§6 "go to billboard"/"approach billboard"/"walk to sign", and (§8) "any attempt to walk toward the glow" — also this task's own choice for a room-generic "go to <scenery>" verb, whose `default` is §8's generic build-boundary variant. */
export const V_APPROACH = V('act1_approach');
/** §6 "CROSS STREET" (the "cross" word; "go to horses"/"approach horses"/"go to rail" reach the same text via `V_APPROACH` on `horses` instead — see `objects/mainStreet.ts`). */
export const V_CROSS = V('act1_cross');
/** §4.3's note: "WATCH GLOW has no response of its own and should resolve to the examine above" — needs its own verb id since "watch" is not yet declared anywhere. */
export const V_WATCH = V('act1_watch');
/** §4.1 "count horses". */
export const V_COUNT = V('act1_count');
/** §4.1 "feed horse" (the `GIVE <item> TO HORSE` forms are a genuine engine gap — see this task's report). */
export const V_FEED = V('act1_feed');
/** §4.5 "crouch" (bare, room-level — same idiom as room 1's STAND/`V_TYPE_TERMINAL`: `examine paving`/`touch road`/`look at ground closely` reach the same text via object handlers). */
export const V_CROUCH = V('act1_crouch');
/** §4.6 "question man". */
export const V_QUESTION = V('act1_question');
/** §6 "WHAT YEAR IS IT"/"WHAT YEAR"/"WHAT'S THE DATE" — bare, this room only; no room-level handler needed (unlike STAND/V_CROUCH) since it sets no flag. */
export const V_WHAT_YEAR = V('act1_what_year');

// ---------------------------------------------------------------------------
// Act I Wave 2 (`docs/superpowers/specs/2026-09-03-act1-wave2-prose.md`) —
// the Post Office, the General Store, and the Sheriff's Office, plus the
// game's second NPC, Sheriff Whitlock. Zone 1 rooms 7, 6, 8.
// ---------------------------------------------------------------------------

export const POST_OFFICE = R('act1_post_office');
export const GENERAL_STORE = R('act1_general_store');
export const SHERIFF_OFFICE = R('act1_sheriff_office');

// --- Post Office objects (§4). One sub-part each for `po_boxes` (the
// window/141/empty-slot noun cluster needs distinct EXAMINE text from bare
// "examine boxes" — the same "which noun word resolved" gap this file's own
// header explains for FEDORA_BAND/DOOR_BOLT/etc.) and `mail_drop` (the forms
// rack needs its own EXAMINE/READ/TAKE text). ---

export const PO_BOXES = O('act1_po_boxes');
/** Sub-part — "window"/"windows"/"glass"/"141"/"one forty one" need EXAMINE/SEARCH text distinct from plain "box"/"boxes". */
export const PO_BOXES_WINDOW = O('act1_po_boxes_window');
export const NOTICE_BOARD = O('act1_notice_board');
/** Sub-part — "corner"/"paper" need EXAMINE/TOUCH/TAKE/PULL text distinct from plain "board". */
export const NOTICE_BOARD_CORNER = O('act1_notice_board_corner');
export const SERVICE_COUNTER = O('act1_service_counter');
export const MAIL_DROP = O('act1_mail_drop');
/** Sub-part — "form"/"forms"/"rack" need EXAMINE/READ/TAKE text distinct from plain "slot". */
export const MAIL_DROP_FORMS = O('act1_mail_drop_forms');
export const LOBBY_BENCH = O('act1_lobby_bench');

// --- General Store objects (§9), plus the room's own vestibule/shop split
// (§7) and one new portable item, `string` (§9.4). ---

export const POSTCARD_RACK = O('act1_postcard_rack');
/** Sub-part — "picture"/"photograph" need EXAMINE text distinct from plain "rack"/"postcard". */
export const POSTCARD_PICTURE = O('act1_postcard_picture');
export const STORE_WINDOW = O('act1_store_window');
export const WATER_CROCK = O('act1_water_crock');
/** Sub-part — "cup"/"tin cup" need TAKE text distinct from the crock's own "take drink". */
export const CROCK_CUP = O('act1_crock_cup');
export const TWINE = O('act1_twine');
/** Sub-part — "spool" needs TAKE text distinct from "take twine"/"take string". */
export const TWINE_SPOOL = O('act1_twine_spool');
export const STORE_DOOR = O('act1_store_door');
export const STORE_RECESS = O('act1_store_recess');
/** §9.4's new portable item — granted by taking the twine. */
export const STRING_ITEM = O('act1_string');

// --- Sheriff's Office objects (§12.3). ---

export const COUNTY_MAP = O('act1_county_map');
/** Sub-part — "screen"/"monitor" (turn/examine) need text distinct from plain "terminal". */
export const RECORDS_TERMINAL_SCREEN = O('act1_records_terminal_screen');
export const RECORDS_TERMINAL = O('act1_records_terminal');
export const EVIDENCE_CAGE = O('act1_evidence_cage');
export const WHITLOCK_DESK = O('act1_whitlock_desk');
/** Sub-part — "form"/"forms"/"paper"/"papers" need EXAMINE/READ text distinct from plain "desk". */
export const WHITLOCK_DESK_FORM = O('act1_whitlock_desk_form');
export const SHERIFF_CELL = O('act1_sheriff_cell');

// --- Main Street amendments (§13) — three new street-facing scenery
// objects, so "ENTER STORE"/"FIND SHERIFF"/etc. resolve on first visit
// (before `GO TO`'s visited-room graph can route there at all) — same
// idiom as the existing `BOARDING_HOUSE`. `store`/`stores`/`shop`/`shops`
// move off `brick_row`'s own noun list onto `GENERAL_STORE_FRONT` (see
// `objects/mainStreet.ts`'s own wiring note) now that those words name a
// specific, enterable place rather than generic locked scenery — the same
// move already made for bare "door" when `boarding_house` first landed.
// `DINER` is new too (§13.3's "destination-keyed variant" so `GO TO DINER`
// stops falling to the fully generic boundary text now that its neighbour
// is real) — scenery only, never a room.

export const GENERAL_STORE_FRONT = O('act1_general_store_front');
export const POST_OFFICE_FRONT = O('act1_post_office_front');
export const SHERIFF_OFFICE_FRONT = O('act1_sheriff_office_front');
export const DINER = O('act1_diner');

// --- "Every other direction — in-world, not the build boundary" gates
// (§6, §10, §12.5) — one always-closed gate per room, same idiom as
// `LANDING_BOUNDARY_GATE`/`MAIN_STREET_BOUNDARY_GATE`: no `nouns`, never
// resolvable, never described, exists only so the direction's `ExitDefSlice.
// door` has a real id whose `open` state is always false. Unlike the Main
// Street gate, these never render "END OF BUILD" — their `blockedText` is
// each room's own in-world refusal line.

export const POST_OFFICE_NO_EXIT_GATE = O('act1_post_office_no_exit_gate');
export const GENERAL_STORE_NO_EXIT_GATE = O('act1_general_store_no_exit_gate');
export const SHERIFF_OFFICE_NO_EXIT_GATE = O('act1_sheriff_office_no_exit_gate');

// --- Sheriff Whitlock (§12.6) — the game's second NPC. ---

export const WHITLOCK = N('act1_whitlock');

// --- Flags (§2, §7, §11 — 13 total). ---

export const FLAG_VISITED_POST_OFFICE = F('act1_visited_post_office');
export const FLAG_RANG_BELL = F('act1_rang_bell');
export const FLAG_SAW_BLANK_RECTANGLE = F('act1_saw_blank_rectangle');
export const FLAG_SAT_IN_POST_OFFICE = F('act1_sat_in_post_office');

export const FLAG_VISITED_GENERAL_STORE = F('act1_visited_general_store');
export const FLAG_READ_POSTCARDS = F('act1_read_postcards');
export const FLAG_DRANK_WATER = F('act1_drank_water');
export const FLAG_HAS_STRING = F('act1_has_string');

export const FLAG_VISITED_SHERIFF_OFFICE = F('act1_visited_sheriff_office');
export const FLAG_MET_WHITLOCK = F('act1_met_whitlock');
export const FLAG_WHITLOCK_RAN_YOU = F('act1_whitlock_ran_you');
export const FLAG_TOLD_WHITLOCK_ABOUT_ROOM = F('act1_told_whitlock_about_room');
export const FLAG_WHITLOCK_ASKED_YEAR = F('act1_whitlock_asked_year');

// --- Clues (§2, §7, §11 — 5 total). ---

export const CLUE_BLANK_RECTANGLE = C('act1_clue_blank_rectangle');
export const CLUE_BOX_141 = C('act1_clue_box_141');
export const CLUE_FIVE_FACES = C('act1_clue_five_faces');
export const CLUE_NO_COUNTY_RECORD = C('act1_clue_no_county_record');
export const CLUE_MAP_ADDITION = C('act1_clue_map_addition');

// ---------------------------------------------------------------------------
// Wave 2 — new verbs. Words chosen by this builder where the doc doesn't
// specify them, following the established convention (see this file's
// earlier headers) — see this task's report for the vocabulary calls made.
// ---------------------------------------------------------------------------

/** §4.3 "reach under"/"look under shutter" — LOOK_UNDER's own words ("look under"/"check under") already cover the latter; this covers "reach under"/"reach in". */
export const V_REACH_UNDER = V('act1_reach_under');
/** §4.4 "post letter" — bare, self-contained phrase (same idiom as V_CHECK_DATE): no "letter" object exists to hang a dobj-based handler on, so the whole phrase is the verb's own words, matching the established idiom for a fixed phrase with no natural object. */
export const V_POST_LETTER = V('act1_post_letter');
/**
 * §12.3.1 "measure map"/"use scale"/"measure distance" — bare, one map in
 * the game, no dobj needed. "measure to wall drug" is not registered as a
 * literal verb phrase — its own word "wall" would collide with `brick_row_
 * sign`'s adjective "wall" (`wall sign`) for no real gain over the shorter
 * phrasings already covered. Builder cut, not the spec's; see this task's
 * report.
 */
export const V_MEASURE = V('act1_measure');
/** Main Street amendment — "FIND SHERIFF" (§13.3's exits table). */
export const V_FIND = V('act1_find');
/** §9.3 "fill cup". */
export const V_FILL = V('act1_fill');
/**
 * §12.6.8's "ATTACK WHITLOCK"/"FOLLOW WHITLOCK". Front-desk-prose's own
 * `marlow.ts` flagged these as out of scope when `NpcDefSlice.handlers`
 * (npc-targeted rung 1) didn't exist yet ("a real scope expansion beyond
 * this task's own file list"); that field exists now (`world.ts`), so this
 * task wires them as ordinary global verbs — words chosen to avoid the
 * `hit`/`strike` collision BREAK's own words already claim (a hard-error
 * `verb-word-collision`, not a warning).
 */
export const V_ATTACK = V('act1_attack');
export const V_FOLLOW = V('act1_follow');
