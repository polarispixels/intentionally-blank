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

// ---------------------------------------------------------------------------
// D2, task B — the censor (Stage D plan §2 D2 "Post Office — the censor";
// §4.5; prose doc 2026-09-10-stage-d2-prose.md PART THREE), and the
// County Library's two reels (that doc's PART SEVEN, §19).
// ---------------------------------------------------------------------------

// --- The letter, the replies, the ruler (objects/censor.ts) -----------------

/** The player's own composed, outgoing letter — created by `act2_compose_letter`'s respond script, consumed (moved to `nowhere`) by `act2_post_letter`. Nouns deliberately avoid bare "letter" as their first noun (§29.2's own collision note: `act2_returned_letter`, Jack's, already claims "letter") — see `objects/censor.ts`'s own comment. */
export const ACT2_LETTER_OUT = O('act2_letter_out');
/** R5 — the bland, fast, hollow reply (censorVerdict: 'rewritten'). */
export const ACT2_REPLY_REWRITTEN = O('act2_reply_rewritten');
/** The polite nothing (censorVerdict: 'blank'). */
export const ACT2_REPLY_BLANK = O('act2_reply_blank');
/** R6 — the real, four-day answer (censorVerdict: 'answered'). */
export const ACT2_REPLY_AUDIT = O('act2_reply_audit');
/** P17's instrument — arrives only when the just-posted letter was folded, regardless of which reply came back with it. */
export const ACT2_ORIGAMI_RULER = O('act2_origami_ruler');
/** "EXAMINE FOLD" sub-parts, one per reply (a bare noun shared across three objects would be permanently ambiguous — `validate.ts`'s own `checkObjectNounCollisions` doc comment) — all three share one effects family (§13.5) and are M13's trigger. */
export const ACT2_REPLY_REWRITTEN_FOLD = O('act2_reply_rewritten_fold');
export const ACT2_REPLY_BLANK_FOLD = O('act2_reply_blank_fold');
export const ACT2_REPLY_AUDIT_FOLD = O('act2_reply_audit_fold');

// --- Flags (§2's table, this task's own) ------------------------------------

export const ACT2_LETTER_STATUS = F('act2_letter_status');
export const ACT2_ELI_REPLY_DUE = F('act2_eli_reply_due');
export const ACT2_AWAITING_REPLY = F('act2_awaiting_reply');
export const ACT2_EXAMINED_ELI_FOLD = F('act2_examined_eli_fold');
export const ACT2_HAS_AUDIT = F('act2_has_audit');
/** Internal wiring, not in the plan's own id list: captures the just-posted letter's fold state at `act2_post_letter` time, since the letter object itself is consumed (moved to `nowhere`) before the reply arrives days later and its own `folded` prop would otherwise be unreadable (and, on a second letter, stale) by then. Read only by `act2_deliver_reply`. */
export const ACT2_LAST_LETTER_FOLDED = F('act2_last_letter_folded');
/** Internal wiring: the origami ruler's own EXAMINE/COUNT CREASES toggle (§13.4's "EXAMINE" vs "EXAMINE again / COUNT CREASES"). */
export const ACT2_RULER_EXAMINED_ONCE = F('act2_ruler_examined_once');

// --- Clues (§2's table) ------------------------------------------------------

export const ACT2_CLUE_CENSOR = C('act2_clue_censor');
export const ACT2_CLUE_REPLY_CAME_FAST = C('act2_clue_reply_came_fast');
export const ACT2_CLUE_HIDDEN_LOAD = C('act2_clue_hidden_load');
export const ACT2_CLUE_TRANSCRIPT_CHANGED = C('act2_clue_transcript_changed');

// --- Questions (§2's table) --------------------------------------------------

export const ACT2_Q_REACH_ELI = Q('act2_q_reach_eli');
export const ACT2_Q_FILM_VS_DATABASE = Q('act2_q_film_vs_database');

// --- Puzzles ------------------------------------------------------------------

export const ACT2_P13_CENSOR = P('act2_p13_censor');
export const ACT2_P14_MICROFICHE = P('act2_p14_microfiche');

// --- Memory (§22.3, this task's own) -------------------------------------------

export const ACT2_MEM_M13 = M('act2_mem_m13');

// --- Scripts / the prompt round trip -------------------------------------------

export const ACT2_COMPOSE_OPEN_SCRIPT = S('act2_compose_letter_open');
export const ACT2_COMPOSE_RESPOND_SCRIPT = S('act2_compose_letter_respond');
/** Not a `ScriptId` — `GameEvent`'s own `prompt.id` is a bare string (§1.4), same as `RESTART_CONFIRM_PROMPT_ID`/`FIXTURE_PROMPT_ID`. */
export const ACT2_COMPOSE_PROMPT_ID = 'act2_compose_letter';
export const ACT2_POST_LETTER_SCRIPT = S('act2_post_letter');
export const ACT2_DELIVER_REPLY_SCRIPT = S('act2_deliver_reply');
/** `world.events` key — a bare string, same idiom as `EVENT_ACT2_DOT_AGENDA` above. */
export const EVENT_ACT2_ELI_REPLY = 'act2_ev_eli_reply';

// --- Verbs --------------------------------------------------------------------

/** "WRITE LETTER" (§10.2) — a bare, fixed-phrase verb (same idiom as `V_POST_LETTER`/`V_ACT2_DRIVE_TO_PLANT`: no "letter" object exists yet to hang a dobj handler on when this fires away from the post office). Its own `default` is §10.3's text; the Post Office's own room handler (`act1/postOffice.ts`) overrides it with the real prompt. */
export const V_WRITE = V('act2_write');
/**
 * "UNFOLD LETTER" only — **not** "FOLD LETTER" (§11's own `V_FOLD`, as
 * named in the task brief, is not declared as a distinct id: `'fold'` is
 * already `CUT`'s own word, `act1/verbs.ts` — `[CUT]: { words: ['cut',
 * 'slice', 'saw', 'tear', 'rip', 'fold'], patterns: ['V dobj'], ... }` —
 * and `checkVocabularyCollisions` groups purely by exact phrase text
 * regardless of pattern shape, so a second verb id also claiming "fold"
 * with any dobj-taking pattern is a hard `verb-word-collision` ERROR
 * (`validate.ts`), not a warning; `tests/world-game.test.ts` asserts
 * `validate(WORLD)` has zero errors. "FOLD LETTER" is therefore wired as a
 * `verbs: [CUT]` handler directly on `act2_letter_out` — the exact idiom
 * this codebase already uses everywhere CUT's synonym family needs an
 * object-specific override (`objects/fedora.ts`, `objects/frontDesk.ts`,
 * `objects/page78.ts`, `act2/objects/notebook.ts`: all four give CUT a
 * bespoke response with no attempt to distinguish "cut" from "tear" from
 * "fold"). The one real cost: "CUT LETTER"/"TEAR LETTER"/"RIP LETTER"/
 * "SLICE LETTER" also fold it, since the engine's `StructuredAction` never
 * retains which surface word matched a verb (`interpreter.ts`'s own
 * `StructuredAction`, verb id only) — accepted, and reported.
 */
export const V_UNFOLD = V('act2_unfold');
/** "THREAD REEL"/"WIND ON"/"LOAD" (§19) — free words, grepped clean against every act1/act2 verb's own word list. */
export const V_THREAD = V('act2_thread');

// `ACT2_KNOWS_TUNNEL_MOUTH`, `ACT2_DAD_TOLD_HEARING`, `ACT2_CLUE_SERVICE_
// TUNNEL`, and `ACT2_DAD` (task A's NPC) landed in task A's own "D2-A"
// section below (this file is shared; task A's edits arrived while this
// task was in progress) — imported from there by this task's own reel
// module rather than redeclared here (a second `export const` for the same
// name would be a compile error, not a silent drift).

// --- The County Library's two reels (objects/countyLibrary.ts, act1 dir) ---

export const ACT2_REEL_2029_2031 = O('act2_reel_2029_2031');
/** The same reel's map page, further on — a sub-part (`{ on: ACT2_REEL_2029_2031 }`) so "READ MAP"/"READ PLAN" don't collide with the reel's own "READ"/"THREAD" (§19.1). */
export const ACT2_REEL_2029_2031_MAP = O('act2_reel_2029_2031_map');
export const ACT2_REEL_HEARING = O('act2_reel_hearing');

// ---------------------------------------------------------------------------
// D2-A — Dad on the USB (Stage D plan §2 D2; prose doc 2026-09-10-stage-d2-
// prose.md §3–§9, §30 item 1). Own heading per this wave's own convention —
// two other concurrent builders (B: censor/letters/library reels/post
// office; C: poker/Nolan/Custodian's town post/Main Street daytime/the
// buzz/memories/the boundary) edit this same file under their own headings.
// ---------------------------------------------------------------------------

/** Dad — the NPC (`act2/dad.ts`). Position derived from the USB's location and the terminal's power (D2 §4.4); `following` (the rig) is the only pinned case. */
export const ACT2_DAD = N('act2_dad');

/** The general store's honor box (§4.2) — `{ in: STORE_DOOR }`, reachable only while the shop is open (see `objects/generalStore.ts`'s own header for the day/night container idiom). */
export const ACT2_HONOR_BOX = O('act2_honor_box');
/** The junk drawer inside the shop (§4.3) — distinct from `storeWindow`'s own shipped "drawer"/"junk drawer" nouns (the through-the-glass text, D1 and earlier); `{ in: STORE_DOOR }`, same reachability idiom. */
export const ACT2_JUNK_DRAWER = O('act2_junk_drawer');
/** The three named parts (§4.4), one collectible object — `{ in: STORE_DOOR }` until taken. */
export const ACT2_ADAPTER_PARTS = O('act2_adapter_parts');
/** `COMBINE`/`ASSEMBLE PARTS` product — nouns deliberately exclude bare "chain" (§29.2: the water crock's chained cup already owns it). */
export const ACT2_ADAPTER_CHAIN = O('act2_adapter_chain');
/** The rig (§9.4) — appears on the motel table the morning after the boot; portable, `{ open: false, transparent: true }`. */
export const ACT2_RIG = O('act2_rig');

/** Set by `act2_dad_boot`'s first run — Jack `topic_dad` v2; the rig's reveal event; P12's `solvedWhen`. */
export const ACT2_DAD_BOOTED = F('act2_dad_booted');
/** Set by the first boot (script effect) — greeting rule 1's own `when` (unreachable in play — see `dad.ts`'s header). */
export const ACT2_DAD_GREETED_ONCE = F('act2_dad_greeted_once');
/** Set by a `world.events` entry (`once: true, when: { met: ACT2_DAD }`) — greeting rule 2's own `when`; see `dad.ts`'s header for why the flag is set this way rather than from the greeting rule itself (`ProseRule` carries no `Effect`). */
export const ACT2_DAD_SAID_MANNERISM = F('act2_dad_said_mannerism');
/** Set by Dad `topic_hearing` (§6.4, L19) — read by the hearing reel's `COMPARE` handler (task B). */
export const ACT2_DAD_TOLD_HEARING = F('act2_dad_told_hearing');
/** Set by Dad `topic_facility` (§6.3) — read by the P16b hint ladder (D3). */
export const ACT2_DAD_TOLD_TUNNEL = F('act2_dad_told_tunnel');
/** Set by Dad `topic_facility`, or the construction reel's map page (task B) — read by Town Edge's country exit (D4). */
export const ACT2_KNOWS_TUNNEL_MOUTH = F('act2_knows_tunnel_mouth');
/** Set by Dad `topic_jules`, `once` (rule 1 → rule 2) — the bad-block topic. */
export const ACT2_DAD_BLOCK_JULES = F('act2_dad_block_jules');
/** Set by Dad `topic_jack`, `once` (rule 1 → rule 2) — the other bad-block topic. */
export const ACT2_DAD_BLOCK_JACK = F('act2_dad_block_jack');

/** R7 — granted by the first boot. */
export const ACT2_CLUE_DAD_BOOTS = C('act2_clue_dad_boots');
/** Any of the three confabulations, caught (gated on having heard Jack's family topic — see `dad.ts`'s header on the `{ met: JACK }` fallback). */
export const ACT2_CLUE_DAD_CUTOFF = C('act2_clue_dad_cutoff');
/** Declared here (task A); set by both Dad `topic_facility` (this file's own NPC) and task B's own construction reel — see that task's own report on which wins first in play (both are idempotent grants of the same clue). */
export const ACT2_CLUE_SERVICE_TUNNEL = C('act2_clue_service_tunnel');

/** P12's anchor. */
export const ACT2_Q_BOOT_USB = Q('act2_q_boot_usb');

/** `solvedWhen: { flag: ACT2_DAD_BOOTED }` — K/P/E (story-architecture doc's own legend: analytical/direct/direct). */
export const ACT2_P12_BOOT_DAD = P('act2_p12_boot_dad');

/** The boot script (`act2/dad.ts`) — first run emits §5.1's eight beats; a later re-dock (chain + USB back in the terminal) emits only the standing greeting (§5.2 rule 3's rotation, once rule 2 has fired). */
export const ACT2_DAD_BOOT_SCRIPT = S('act2_dad_boot');

/** Bare "PAY" at the general store's honor box (§4.2) — no state, no figure (canon 37). */
export const V_PAY = V('act2_pay');

/** `world.events` keys — bare strings, same idiom as `EVENT_ACT2_DOT_AGENDA`. Declared here (not locally in `dad.ts`/`objects/rig.ts`) for the same reason `ACT2_DOT_TOPIC_*` are declared here rather than in `dot.ts` — `tests/world-game.test.ts`'s "every act2_ id string used under src/content/world/act2 is declared in act2/ids.ts" check scans this directory's raw source text against this file's own `X('act2_...')` calls / string literals. */
export const EVENT_ACT2_DAD_MANNERISM = 'act2_ev_dad_mannerism';
export const EVENT_ACT2_RIG_APPEARS = 'act2_ev_rig_appears';

/** Dad's fifteen topics (`act2/dad.ts`) — declared here for the same reason as the two event ids just above. */
export const ACT2_DAD_TOPIC_SELF = T('act2_dad_topic_self');
export const ACT2_DAD_TOPIC_JULES = T('act2_dad_topic_jules');
export const ACT2_DAD_TOPIC_FACILITY = T('act2_dad_topic_facility');
export const ACT2_DAD_TOPIC_HEARING = T('act2_dad_topic_hearing');
export const ACT2_DAD_TOPIC_LUKE = T('act2_dad_topic_luke');
export const ACT2_DAD_TOPIC_SISSY = T('act2_dad_topic_sissy');
export const ACT2_DAD_TOPIC_YEAR = T('act2_dad_topic_year');
export const ACT2_DAD_TOPIC_ELI = T('act2_dad_topic_eli');
export const ACT2_DAD_TOPIC_JACK = T('act2_dad_topic_jack');
export const ACT2_DAD_TOPIC_POKER = T('act2_dad_topic_poker');
export const ACT2_DAD_TOPIC_COPY = T('act2_dad_topic_copy');
export const ACT2_DAD_TOPIC_LABEL = T('act2_dad_topic_label');
export const ACT2_DAD_TOPIC_TERMINAL = T('act2_dad_topic_terminal');
export const ACT2_DAD_TOPIC_HEADACHES = T('act2_dad_topic_headaches');
/** §30 item 1 — the fifteenth. */
export const ACT2_DAD_TOPIC_SUBLEVEL = T('act2_dad_topic_sublevel');

/** D4 task E — three more topics (`act2/dad.ts`), inserted above the shipped fifteen (D4 prose doc §14, §21.1: "none deleted"). Declared here for the same directory-scan reason as the fifteen just above. */
export const ACT2_DAD_TOPIC_SEAL = T('act2_dad_topic_seal');
export const ACT2_DAD_TOPIC_RAILS = T('act2_dad_topic_rails');
export const ACT2_DAD_TOPIC_INTERLOCK = T('act2_dad_topic_interlock');

// ---------------------------------------------------------------------------
// D2-C — the Friday table, Nolan, the Custodian's town post, Main Street by
// day, the buzz, four memories, and the moved boundary (Stage D plan §2 D2
// §4.3/§4.6/§4.7; prose doc 2026-09-10-stage-d2-prose.md §14–§18, §20–§23,
// §22.1/22.2/22.4/22.5, §29.1). Own heading per this wave's own convention —
// task A (Dad/dock/store/rig/Jack) and task B (censor/letters/reels) edit
// this same file under their own headings above.
// ---------------------------------------------------------------------------

/** Nolan (`act2/nolan.ts`) — home evenings, at the table Fridays; the plant-by-day post is D3's. */
export const ACT2_NOLAN = N('act2_nolan');
/** The Friday table (`act2/poker.ts`/`objects/pokerTable.ts`) — nouns deliberately exclude bare "table"/"chair" (§29.2: the diner counter already owns both; see that module's own header for why). */
export const ACT2_POKER_TABLE = O('act2_poker_table');
/** Nolan's badge, on loan after a win (§16.7) — portable; no examine text is authored (the built-in stands, per the ruling). */
export const ACT2_NOLAN_BADGE = O('act2_nolan_badge');

/** `SIT`/`JOIN GAME`/`PLAY POKER` while a session is already running. */
export const ACT2_POKER_IN_PROGRESS = F('act2_poker_in_progress');
/** Completed-session count (§4.3) — incremented at the end of each session; `atLeast: 1` is the second-Friday gate (§16.8). */
export const ACT2_POKER_SESSION = F('act2_poker_session');
/** 0–3, the current hand within a running session. */
export const ACT2_POKER_HAND = F('act2_poker_hand');
/** Hands won so far this session (0–3; "won" = 2 of 3). */
export const ACT2_POKER_WINS = F('act2_poker_wins');
/** `'none' | 'jack' | 'own'` — who staked this session. */
export const ACT2_POKER_STAKE = F('act2_poker_stake');
/** `'none' | 'won' | 'lost' | 'caught'` — this session's outcome, set at the end. */
export const ACT2_POKER_RESULT = F('act2_poker_result');
/** Set by `WATCH NOLAN`, M8, or Dad's hand-1 coaching line — read by hand 1's `CALL`. */
export const ACT2_TELL_NOLAN = F('act2_tell_nolan');
/** Declared per the plan's own §4.3 state list; **unused this build** — Whitlock "never bluffs" (§16.3) and no shipped text authors a learnable tell for her, so nothing sets or reads this flag. Kept for parity with the plan's table rather than silently dropped; flagged in this task's report. */
export const ACT2_TELL_WHITLOCK = F('act2_tell_whitlock');
/** Set by the first `SWAP DECK` in a session — the second swap (any session) is the catch. */
export const ACT2_CHEATED_ONCE = F('act2_cheated_once');
/** Due-day flag (`onOrAfterDay`), set to `day + 7` when caught. */
export const ACT2_POKER_BANNED_UNTIL = F('act2_poker_banned_until');
/** Set by calling hand 3 against Dad's advice and winning (§8) — M19-S's trigger. */
export const ACT2_BEAT_DADS_ADVICE = F('act2_beat_dads_advice');
/** Set by any completed session, between hands 2 and 3 (§16.4) — P15's hint-ladder anchor; grants two clues. */
export const ACT2_HEARD_GATE_TALK = F('act2_heard_gate_talk');
/** Set by `ASK NOLAN ABOUT BADGE`/`SUBLEVEL` at the table after a win (§16.7) — moves `ACT2_NOLAN_BADGE` to inventory. */
export const ACT2_BADGE_WON = F('act2_badge_won');
/** `inc`'d by Nolan's `topic_sublevel` (§17.4) — at `atLeast: 2`, grants `ACT2_CLUE_VERBATIM` silently (no text change, canon 48). */
export const ACT2_NOLAN_SUBLEVEL_COUNT = F('act2_nolan_sublevel_count');
/** Set by Nolan's first evening greeting (§17.3 rule 1) — M8's trigger is `{ met: ACT2_NOLAN }`, so this flag is not strictly read by anything; declared per the ruling anyway. */
export const ACT2_MET_NOLAN_HOME = F('act2_met_nolan_home');
/** Set by `EXAMINE` the Custodian at ANY post (town or Wall Drug) — M15's trigger. */
export const ACT2_EXAMINED_CUSTODIAN = F('act2_examined_custodian');
/** Set by reading the county notice on the post office board (§21.2) — read by nothing yet (L20/Stage E). */
export const ACT2_SAW_REPAVING_NOTICE = F('act2_saw_repaving_notice');

/** Granted silently at Nolan's second hearing of `topic_sublevel` (home or table) — canon 48. */
export const ACT2_CLUE_VERBATIM = C('act2_clue_verbatim');
/** The second Friday's discrepancy beat (§16.8) — card for card, the same three hands. */
export const ACT2_CLUE_SAME_HANDS = C('act2_clue_same_hands');
/** From the gate talk (§16.4) — the Tuesday convoy. */
export const ACT2_CLUE_TUESDAY_DELIVERIES = C('act2_clue_tuesday_deliveries');
/** From the gate talk (§16.4) — the nightly maintenance window. */
export const ACT2_CLUE_NIGHT_SCHEDULE = C('act2_clue_night_schedule');
/** M8's companion clue — "there is no Sublevel 6," said kindly. */
export const ACT2_CLUE_NO_SUBLEVEL_KINDLY = C('act2_clue_no_sublevel_kindly');
/** Nolan's `topic_trash` (§17.8) — he doesn't remember the work order. */
export const ACT2_CLUE_NOLAN_FORGOT_ORDER = C('act2_clue_nolan_forgot_order');
/** L20 — Pearl's `topic_visit` (§21.1). */
export const ACT2_CLUE_REPAVING = C('act2_clue_repaving');

/** P15's anchor (Nolan off duty, playing cards like anyone else). */
export const ACT2_Q_NOLAN_OFF_DUTY = Q('act2_q_nolan_off_duty');
/** P16's anchor — opens at the end of D2, answered in D3. */
export const ACT2_Q_INSIDE_THE_PLANT = Q('act2_q_inside_the_plant');

/** `solvedWhen: { any: [{ flag: ACT2_BADGE_WON }, { flag: ACT2_HEARD_GATE_TALK }] }` (§4.3); `missedRecovery` names the weekly recurrence and P16's other three routes. */
export const ACT2_P15_POKER = P('act2_p15_poker');

/** M4 — *The Stakeout*. */
export const ACT2_MEM_M4 = M('act2_mem_m4');
/** M8 — *Said Kindly*. */
export const ACT2_MEM_M8 = M('act2_mem_m8');
/** M15 — *Three Different Days*. */
export const ACT2_MEM_M15 = M('act2_mem_m15');
/** M19-S — *His Bluff Face* (exclusive, social). */
export const ACT2_MEM_M19S = M('act2_mem_m19s');

/** The poker `ScriptFn` (`act2/poker.ts`) — dispatches all six table verbs plus `SIT`/`JOIN GAME`/`PLAY POKER`. */
export const ACT2_POKER_SCRIPT = S('act2_poker');

/**
 * Poker verbs — bare-only, no amount ever printed (canon 37). Three of the
 * plan's six named actions are deliberately NOT new `VerbId`s here (see
 * `poker.ts`'s own header for the collision analysis this task's report
 * also carries): `act2_call` reuses the already-shipped bare `V_CALL`
 * (`act1/verbs.ts` — "call" is already a bare `'V'`-pattern global verb,
 * §29.2's own collision note: "outside a session CALL keeps whatever the
 * global does today"), and `act2_fold` reuses the already-shipped `CUT`
 * (`act1/verbs.ts` claims bare word "fold" as one of `CUT`'s synonyms,
 * pattern `'V dobj'` — `validate.ts`'s `verb-word-collision` check makes a
 * SECOND verb id claiming that word a hard error regardless of pattern
 * shape, so `FOLD` at the table is reached via `CUT` + a dobj on the table
 * object, not bare). `act2_check` IS a new bare verb — "check" turns out
 * to be unclaimed by any verb's single-word form in the shipped table
 * (only "check under"/"check behind"/"check date" exist, all longer
 * phrases), so declaring it collides with nothing.
 */
export const V_ACT2_BET = V('act2_bet');
export const V_ACT2_RAISE = V('act2_raise');
export const V_ACT2_CHECK = V('act2_check');
/** "SWAP DECK"/"DEAL FROM MY DECK" — `'V dobj'`, dobj `act2_deck` (`objects/truck.ts`, shipped D1). */
export const V_ACT2_SWAP_DECK = V('act2_swap_deck');

// --- Nolan's topics (`act2/nolan.ts`) — declared here per `tests/world-
// game.test.ts`'s own act2-id-declaration scan (Dot's own convention,
// `dot.ts`'s header note; not every act2 NPC file follows it, but this
// task's own module does). ---

export const ACT2_NOLAN_TOPIC_SUBLEVEL = T('act2_nolan_topic_sublevel');
export const ACT2_NOLAN_TOPIC_JULES = T('act2_nolan_topic_jules');
export const ACT2_NOLAN_TOPIC_BADGE = T('act2_nolan_topic_badge');
/** §16.7 — `ASK NOLAN ABOUT BADGE`/`SUBLEVEL` at the table, after a win (2+ hands) — a rule placed above `ACT2_NOLAN_TOPIC_BADGE`/`ACT2_NOLAN_TOPIC_SUBLEVEL` in `nolan.ts`'s own `topics` array, not a separate always-on topic. */
export const ACT2_NOLAN_TOPIC_BADGE_LOAN = T('act2_nolan_topic_badge_loan');
export const ACT2_NOLAN_TOPIC_HEADACHES = T('act2_nolan_topic_headaches');
export const ACT2_NOLAN_TOPIC_TRASH = T('act2_nolan_topic_trash');
export const ACT2_NOLAN_TOPIC_POKER = T('act2_nolan_topic_poker');
export const ACT2_NOLAN_TOPIC_NIGHTS = T('act2_nolan_topic_nights');
/** §17.13 — "ASK NOLAN ABOUT DEPRECATED"/"ABOUT ERASED"/anything learned but out of his reach. */
export const ACT2_NOLAN_TOPIC_UNREACHABLE = T('act2_nolan_topic_unreachable');

/** `once: true, when: { met: ACT2_NOLAN }` — sets `ACT2_MET_NOLAN_HOME` (`nolan.ts`'s own header; the same `ProseRule`-carries-no-`Effect` idiom `dad.ts`'s `ACT2_DAD_MANNERISM_EVENT` uses). */
export const EVENT_ACT2_MET_NOLAN = 'act2_ev_met_nolan';
