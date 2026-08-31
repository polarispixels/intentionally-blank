// Act II ("The Notebook") — id constants.
//
// Filled wave by wave as D1–D2 land (Stage D plan §2); D0 (this task) adds
// the calendar/passage plumbing's own ids. Every id declared here — and
// only here — must be namespaced `act2_*` (Stage D plan §0.3): `R('act2_...')`,
// `O('act2_...')`, `N('act2_...')`, and so on, via `src/engine/ids.ts`'s
// constructors. This file may import only `engine/ids` and other `ids.ts`
// files (`act2/ids.ts` may import `act1/ids.ts`; never the reverse) — see
// the plan's own rule for why (keeps `ids.ts` files free of the cycle risk
// everything else in a room or NPC file can't avoid).

import { C, F, M, N, O, P, Q, R, S, T, V } from '../../../engine/ids';

// ---------------------------------------------------------------------------
// D0 — flags (main-session ruling 1/2/4; ADR 0011 rule 5).
// ---------------------------------------------------------------------------

/** Set by D1's ride north (the first `act2_travel`). Nothing in D0 sets it — every schedule/presence rule below is gated on it, and it stays false through the whole of Act I. */
export const ACT2_STARTED = F('act2_started');
/** Set while Jack is pinned away from his schedule (D1's travel script); read by his own schedule rule so a `when` never needs to read `npcAt` for the npc it belongs to (`cond.ts`'s own warning). */
export const ACT2_JACK_AWAY = F('act2_jack_away');
/** Set by either sleep route (`act2/time.ts`'s `act2_sleep` script) — a flag D2 reads. */
export const ACT2_SLEPT_SINCE_BOOT = F('act2_slept_since_boot');
/** Main-session ruling 1 (§5.3 q1 of the presence-and-passage doc): the front desk's own onEnter sets this the first time the desk is found empty, gating the long empty-desk variant to fire once. */
export const ACT2_SEEN_DESK_EMPTY = F('act2_seen_desk_empty');
/** As above, for the sheriff's office. */
export const ACT2_SEEN_OFFICE_EMPTY = F('act2_seen_office_empty');

// ---------------------------------------------------------------------------
// D0 — the pass-time/sleep scripts (`act2/time.ts`).
// ---------------------------------------------------------------------------

export const ACT2_PASS_TIME_SCRIPT = S('act2_pass_time');
export const ACT2_SLEEP_SCRIPT = S('act2_sleep');

// ---------------------------------------------------------------------------
// D0 — the four pass-time verbs (`act2/verbs.ts`).
// ---------------------------------------------------------------------------

export const V_ACT2_WAIT_UNTIL_MORNING = V('act2_wait_until_morning');
export const V_ACT2_WAIT_UNTIL_AFTERNOON = V('act2_wait_until_afternoon');
export const V_ACT2_WAIT_UNTIL_EVENING = V('act2_wait_until_evening');
export const V_ACT2_WAIT_UNTIL_NIGHT = V('act2_wait_until_night');

// ---------------------------------------------------------------------------
// wave D1 shared — declared here (task B) because task A's own Custodian/
// travel work reads them too and hadn't landed yet when this task ran.
// Reconcile on merge if task A has since declared either under its own
// heading (same id string either way, so a duplicate declaration is a
// compile error, not a silent drift — the fix is to delete whichever
// declaration lands second).
// ---------------------------------------------------------------------------

/** The Custodian NPC (§4.6/§8 of the D1 prose doc) — posted at the Emporium afternoons; read by this task's own porch-rail rule 1 and the Emporium's description rule 3. Task A owns the NPC's own file/schedule/topics. */
export const ACT2_CUSTODIAN = N('act2_custodian');
/** Set by an amendment to `jack.ts`'s `topic_family` (task A) — M12's other half-trigger, alongside this task's own `ACT2_READ_NOTEBOOK_MARGIN`. */
export const ACT2_LUKE_REFERENCED = F('act2_luke_referenced');

// ---------------------------------------------------------------------------
// D1 — Wall Drug (Stage D plan §2 D1; prose doc 2026-09-09-stage-d1-prose).
// Rooms, the Back Corridor's own no-exit gate, Dot, the Emporium's seven
// objects, the corridor's six objects, the cache's six objects (the
// notebook's three sub-parts included), flags/clues/questions/memories/
// puzzles, and the one new verb (`V_FIT`).
// ---------------------------------------------------------------------------

// --- Rooms -------------------------------------------------------------

export const ACT2_WALL_DRUG_EMPORIUM = R('act2_wall_drug_emporium');
export const ACT2_WALL_DRUG_BACK_CORRIDOR = R('act2_wall_drug_back_corridor');

/** Always-closed "out" (the porch — no separate room; §7's own ruling) — same idiom as `TOWN_EDGE_NO_EXIT_GATE`. */
export const ACT2_WALL_DRUG_EMPORIUM_NO_EXIT_GATE = O('act2_wall_drug_emporium_no_exit_gate');

// --- Dot -----------------------------------------------------------------

export const ACT2_DOT = N('act2_dot');
/** The agenda line (§9.4) — a `world.events` entry, `once: true`, `onlyIfWitnessed` at the Emporium. */
export const EVENT_ACT2_DOT_AGENDA = 'act2_dot_agenda';
// §9.5's nine topics — declared here (not locally in `dot.ts`, unlike
// `pearl.ts`'s own act1 precedent) because `tests/world-game.test.ts`'s
// "every act2_ id string is declared in act2/ids.ts" check scans the whole
// act2 directory's raw source text (comments included) against this file's
// own `X('act2_...')` calls — a stricter convention than Act I's.
export const ACT2_DOT_TOPIC_TICKET = T('act2_dot_topic_ticket');
export const ACT2_DOT_TOPIC_HAT = T('act2_dot_topic_hat');
export const ACT2_DOT_TOPIC_JULES = T('act2_dot_topic_jules');
export const ACT2_DOT_TOPIC_WATER = T('act2_dot_topic_water');
export const ACT2_DOT_TOPIC_DINOSAUR = T('act2_dot_topic_dinosaur');
export const ACT2_DOT_TOPIC_CORRIDOR = T('act2_dot_topic_corridor');
export const ACT2_DOT_TOPIC_TERMINAL = T('act2_dot_topic_terminal');
export const ACT2_DOT_TOPIC_ROAD = T('act2_dot_topic_road');
export const ACT2_DOT_TOPIC_PLANT = T('act2_dot_topic_plant');

// --- The Emporium's seven objects ------------------------------------------

export const ACT2_TREX = O('act2_trex');
export const ACT2_SIGNS = O('act2_signs');
export const ACT2_MERCHANDISE = O('act2_merchandise');
export const ACT2_JACKALOPE = O('act2_jackalope');
export const ACT2_ICE_WATER = O('act2_ice_water');
export const ACT2_CLAIM_WINDOW = O('act2_claim_window');
/** Sub-part — the numbering key needs distinct EXAMINE/READ text and effects from plain "window"/"hatch" (same idiom as `ACT2_SHELVING_STENCILS`/`FEDORA_BAND`/`DOOR_BOLT`); also keeps bare "key" off the parent object (§27 wiring item 3). */
export const ACT2_CLAIM_WINDOW_CARD = O('act2_claim_window_card');
export const ACT2_PORCH_RAIL = O('act2_porch_rail');

// --- The Back Corridor's six objects ----------------------------------------

export const ACT2_CLAIM_SHELVING = O('act2_claim_shelving');
/** Sub-part — "stencils"/"letters" need distinct EXAMINE text from plain "shelving" (same idiom as `FEDORA_BAND`/`DOOR_BOLT`). */
export const ACT2_SHELVING_STENCILS = O('act2_shelving_stencils');
export const ACT2_CACHE_BOX = O('act2_cache_box');
export const ACT2_STACKED_BOXES = O('act2_stacked_boxes');
export const ACT2_WD_TERMINAL = O('act2_wd_terminal');
export const ACT2_CORRIDOR_BULB = O('act2_corridor_bulb');

// --- The cache — six objects, the notebook's three sub-parts included ------

export const ACT2_NOTEBOOK = O('act2_notebook');
export const ACT2_NOTEBOOK_BACK_COVER = O('act2_notebook_back_cover');
export const ACT2_NOTEBOOK_GAP = O('act2_notebook_gap');
export const ACT2_NOTEBOOK_MARGIN = O('act2_notebook_margin');
export const ACT2_USB = O('act2_usb');
export const ACT2_FILM_CANISTER = O('act2_film_canister');
export const ACT2_PENCIL = O('act2_pencil');
export const ACT2_RETURNED_LETTER = O('act2_returned_letter');
export const ACT2_CACHE_POLAROID = O('act2_cache_polaroid');

// --- Flags (§2's table — this task's own nine) ------------------------------

export const ACT2_VISITED_EMPORIUM = F('act2_visited_emporium');
export const ACT2_VISITED_CORRIDOR = F('act2_visited_corridor');
export const ACT2_DOT_REMEMBERS_HAT = F('act2_dot_remembers_hat');
export const ACT2_READ_NUMBERING_KEY = F('act2_read_numbering_key');
export const ACT2_CACHE_FOUND = F('act2_cache_found');
export const ACT2_READ_NOTEBOOK = F('act2_read_notebook');
export const ACT2_READ_NOTEBOOK_MARGIN = F('act2_read_notebook_margin');
/** Default false; D2's Eli/Dad routes set it — read by the notebook's own text rule 1. */
export const ACT2_SHORTHAND_DECODED = F('act2_shorthand_decoded');
export const ACT2_PAGE_RUBBED = F('act2_page_rubbed');

// --- Clues (§2's table) ------------------------------------------------------

export const ACT2_CLUE_DOT_HAT = C('act2_clue_dot_hat');
export const ACT2_CLUE_DEAD_NUMBERING = C('act2_clue_dead_numbering');
export const ACT2_CLUE_CACHE_CONTENTS = C('act2_clue_cache_contents');
export const ACT2_CLUE_STRANGER_IN_HAT = C('act2_clue_stranger_in_hat');
export const ACT2_CLUE_RETURNED_LETTER = C('act2_clue_returned_letter');
export const ACT2_CLUE_PAGE_FITS = C('act2_clue_page_fits');
export const ACT2_CLUE_CREDENTIALS = C('act2_clue_credentials');
export const ACT2_CLUE_INDENTED_CREDENTIALS = C('act2_clue_indented_credentials');

// --- Questions (§2's table) ---------------------------------------------------

export const ACT2_Q_WHERE_IS_CACHE = Q('act2_q_where_is_cache');
export const ACT2_Q_WHAT_NOTEBOOK_SAYS = Q('act2_q_what_notebook_says');
/** No `answerWhen` in this build (Stage E answers it) — §2's own ruling. */
export const ACT2_Q_HOW_WAS_IT_HERE = Q('act2_q_how_was_it_here');

// --- Puzzles -------------------------------------------------------------------

export const ACT2_P10_CACHE = P('act2_p10_cache');
export const ACT2_P11_NOTEBOOK = P('act2_p11_notebook');

// --- Memories (§14 — this task's own five of the wave's eight) -----------------

export const ACT2_MEM_M5 = M('act2_mem_m5');
export const ACT2_MEM_M6 = M('act2_mem_m6');
export const ACT2_MEM_M14 = M('act2_mem_m14');
export const ACT2_MEM_M12 = M('act2_mem_m12');
export const ACT2_MEM_M18A = M('act2_mem_m18a');

// --- Verbs -------------------------------------------------------------------

/** "fit"/"compare"/"match" (§13.6, §27's wiring summary) — NOT "hold ... against" (`act2/verbs.ts`'s own note: `V_HUG` already claims "hold"). `RUB`/`BURN`/`CUT`(tear)/`TAKE`(buy)/`DRINK`/`FILL`/`PULL`/`TURN_OFF` are all reused as-is from `act1/verbs.ts` — see `act2/verbs.ts`'s own header for the one in-place amendment (`RUB`) this wave needs. */
export const V_FIT = V('act2_fit');

// ---------------------------------------------------------------------------
// D1 — task A's own module: the travel script, the horse, the glovebox and
// deck (M2 ×3), the Custodian's own file (the NPC id above is task B's,
// declared where this task needed it first), and the moved build boundary.
// `ACT2_WALL_DRUG_EMPORIUM`/`ACT2_USB`/`ACT2_CUSTODIAN`/`ACT2_LUKE_REFERENCED`
// above are already declared (task B landed first) — imported from there,
// not redeclared here.
// ---------------------------------------------------------------------------

export const ACT2_TRAVEL_SCRIPT = S('act2_travel');
/** The `system.buildBoundary` emission shared by both D1 routes in (§21). */
export const ACT2_BOUNDARY_SCRIPT = S('act2_boundary');

/** Set by the travel script on the first ride north (either mode); read by scene-variant selection and by L10's clue. */
export const ACT2_RODE_NORTH = F('act2_rode_north');
/** Set by asking Pearl/Marlow whose the horses are, or by `UNTIE HORSE` directly; read by the ride handlers. */
export const ACT2_HORSE_BORROWED = F('act2_horse_borrowed');
/** Set by `EXAMINE CUSTODIAN`; read by nothing yet in D1 — M15 (D5) should read it. */
export const ACT2_SAW_CUSTODIAN_PAINTING = F('act2_saw_custodian_painting');

/** L10's payoff — granted once, on the first ride north (§4.1 beat 6 / §4.5 beat 3). */
export const ACT2_CLUE_MILES_DONT_COUNT = C('act2_clue_miles_dont_count');

/** The borrowable horse (§16) — a new object at Main Street, separate from the shipped `act1_horses` scenery. Not `portable` (it is ridden, not carried). */
export const ACT2_HORSE = O('act2_horse');
/** A container `{ on: MONSTER_TRUCK_CAB }` (§4.7) — see `objects/truck.ts`'s own comment on why `on`, not `in`. */
export const ACT2_GLOVEBOX = O('act2_glovebox');
/** Jack's deck (§4.7, register 50) — M2's trigger object. */
export const ACT2_DECK = O('act2_deck');

/** M2 — *Four Hands* (§14.5–14.7), the deck's own trigger. Three mutually-exclusive variants, M3's own trigger idiom (`act1/knowledge.ts`). */
export const ACT2_MEM_M2_ANALYTICAL = M('act2_mem_m2_analytical');
export const ACT2_MEM_M2_SOCIAL = M('act2_mem_m2_social');
export const ACT2_MEM_M2_DIRECT = M('act2_mem_m2_direct');

/** "DRIVE TO PLANT"/"GO TO PLANT" (§21/§27) — the second of the boundary's two routes, from the motel or Town Edge with the truck present. */
export const V_ACT2_DRIVE_TO_PLANT = V('act2_drive_to_plant');
