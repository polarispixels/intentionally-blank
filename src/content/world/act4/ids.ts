// Act IV ("the record about you") — id constants.
//
// Every id declared here — and only here — is namespaced `act4_*` (Stage E
// plan §0.3, the same convention `act1`–`act3` follow). This file may import
// only `engine/ids` and other `ids.ts` files.
//
// Wave E0 shared — written by the main session before the E0 builders ran
// (`docs/superpowers/specs/2026-09-17-stage-e0-prose.md` §2, §31). Builders
// ADD their own object/verb/topic/event/script ids below the anchor at the
// end of this file, with the Edit tool, never Write.

import { C, F, M, N, O, P, Q, R, S, V } from '../../../engine/ids';

// Flags (§2)
export const ACT4_STARTED = F('act4_started');
export const ACT4_VISIT_ANNOUNCED = F('act4_visit_announced');
/** Numeric — the day of the visit (`act4_set_visit_day`). */
export const ACT4_VISIT_DAY = F('act4_visit_day');
/** Numeric — the first day the crews are gone. */
export const ACT4_VISIT_OVER_DAY = F('act4_visit_over_day');
export const ACT4_WHITLOCK_READER_TOLD = F('act4_whitlock_reader_told');
export const ACT4_WHITLOCK_CONVINCED = F('act4_whitlock_convinced');
export const ACT4_CAGE_OPEN = F('act4_cage_open');
export const ACT4_HANDWRITING_MATCHED = F('act4_handwriting_matched');
export const ACT4_NUMERAL_SEARCHED = F('act4_numeral_searched');
export const ACT4_PROFILE_SEEN = F('act4_profile_seen');

// Clues (§2)
export const ACT4_CLUE_VISIT_COMING = C('act4_clue_visit_coming');
export const ACT4_CLUE_SAME_HAND = C('act4_clue_same_hand');
export const ACT4_CLUE_FILED_UNDER_ONE = C('act4_clue_filed_under_one');
export const ACT4_CLUE_PROFILED = C('act4_clue_profiled');
export const ACT4_CLUE_ELIS_REASON = C('act4_clue_elis_reason');

// Questions (§2)
export const ACT4_Q_RECORD_ABOUT_YOU = Q('act4_q_record_about_you');
export const ACT4_Q_WHO_OUTRANKS_IT = Q('act4_q_who_outranks_it');

// Puzzle (§2) — P21
export const ACT4_P21_SELF_EVIDENCE = P('act4_p21_self_evidence');

// Scripts named by §2/§31 (their ScriptFns are the builders')
export const ACT4_SET_VISIT_DAY_SCRIPT = S('act4_set_visit_day');

// --- E0 task I ---
// The town before the visit (`docs/superpowers/specs/2026-09-17-stage-e0-
// prose.md` §3-§9, §31, §32) — Main Street's three description rules, the
// crews, the post office's second notice, one prepended rule each on Pearl
// and Marlow, the diner's window, the Lobby's staging doors, and
// `act4_ev_start`/`act4_set_visit_day`'s own event/script ids. The crews'
// and notice's `ObjectDefSlice`s live on `act1/objects/mainStreet.ts` and
// `act1/objects/postOffice.ts` respectively — only the ids are namespaced
// `act4_*` here (this file's own header rule).

// Objects (§4, §5)
export const ACT4_CREWS = O('act4_crews');
export const ACT4_VISIT_NOTICE = O('act4_visit_notice');

// Events (§2, §31) — `act4_ev_start` is the wave's own one-time hinge;
// `act4_ev_crews_visible` is this task's own supporting mechanism (not
// named in the prose doc): the engine's `hidden` overlay only ever goes
// `false` via the one-way `{ reveal }` effect (`effects.ts`), so making the
// crews go hidden again (after `act4_visit_over_day`, and at night before
// the day's work starts, §4/§31.2 `MEN`) needs a `once: false` event tied
// to a script that recomputes the overlay directly every turn the player
// is on Main Street — the same `{ script }` escape hatch `act3/events.ts`'s
// own header already documents for a Cond the declarative DSL can't express.
export const EVENT_ACT4_EV_START = 'act4_ev_start';
export const EVENT_ACT4_EV_CREWS_VISIBLE = 'act4_ev_crews_visible';

// Scripts (§2, §31, §31.3)
export const ACT4_CREWS_VISIBILITY_SCRIPT = S('act4_crews_visibility');

// --- E0 task K ---
// The machine: the numeral search, the fourth heading, R13, the Act IV
// boundary (`docs/superpowers/specs/2026-09-17-stage-e0-prose.md` §16-§18,
// §22, §27, §31). `act4_clue_filed_under_one`/`act4_clue_profiled`
// (declared above, §2) are granted by this task's own scripts; their
// `ClueDef`s live in `./knowledge.ts`, this task's own labelled block.
// `act4_profile` is a Sublevel 6 object, per this file's own header rule
// (only its id lives here) — its `ObjectDefSlice` is in
// `act3/objects/s6ArchiveHub.ts`. The two ledger-numeral fixed phrases and
// `SELECT PROFILE` are new verbs (`act3/verbs.ts`, merged in
// `act3/index.ts` — the same file `V_ACT3_LEDGER_JULES` etc. already live
// in, D5 task G's own idiom).

// Objects (§18)
export const ACT4_PROFILE = O('act4_profile');

// Scripts (§18, §31)
export const ACT4_PROFILE_SCREEN_SCRIPT = S('act4_profile_screen');

// Verbs (§16, §18, §31.2) — `act3/verbs.ts`'s own `ACT4_E0_TASK_K_VERBS`.
export const V_ACT4_LEDGER_ONE = V('act4_ledger_one');
export const V_ACT4_LEDGER_FOUR = V('act4_ledger_four');
export const V_ACT4_SELECT = V('act4_select');

// --- E0 task J ---
// Whitlock (topics local to act1/whitlock.ts, sidecar style — not declared
// here), the cage/bag/notes (act1/objects/sheriffOffice.ts), Jack's
// `act4_jack_topic_weeks` (local to act1/jack.ts), Dad's breath event
// (defined in act2/dad.ts, registered in act4/index.ts), the numerals
// reply (act2/objects/censor.ts). Object ids only — topic ids follow each
// file's own established local-declaration idiom (jack.ts/whitlock.ts
// already declare their own `act1_*` topic ids inline, not centrally; the
// same style is used here for these new `act4_*` topic ids).
export const ACT4_EVIDENCE_BAG = O('act4_evidence_bag');
export const ACT4_CASE_NOTES = O('act4_case_notes');
export const ACT4_REPLY_ELI_NUMERALS = O('act4_reply_eli_numerals');
/** Plain string id (matches `act2/ids.ts`'s own `EVENT_ACT2_*` convention) — the `EventDef` itself lives in `act2/dad.ts`. */
export const ACT4_EV_DAD_BREATH = 'act4_ev_dad_breath';

// --- E0 builders append below this line (Edit tool only; one block per task, labelled) ---

// --- E2 task O ---
// The gate frames, the Escape Chamber, P23, M10, and the boundary
// (`docs/superpowers/specs/2026-09-19-stage-e2-prose.md` §2-§24, §41,
// §47.1, §48, §52, §56, §57). Two concurrent builders share this wave:
// task P (the hab: Galley/Dome/Sissy/M11) has already declared
// `ACT4_HAB_GALLEY`/`ACT4_HAB_DOME`/`ACT4_ENTER_HAB_SCRIPT`/
// `ACT4_LEAVE_HAB_SCRIPT`, above; task Q (the library/darkroom/prints/R17)
// declares `act4_print_last_day`/`act4_clue_sky_is_ceiling` — referenced
// below by raw `O()`/`C()` construction (not imported) since they may not
// exist yet; same value once Q lands them. Grep checked before every id
// below — none pre-existed.

// Room (§6)
export const ACT4_ESCAPE_CHAMBER = R('act4_escape_chamber');

// The two lit gate frames (§3.2, §3.3) — Hub objects, this task's own.
export const ACT4_GATE_ESCAPE = O('act4_gate_escape');
export const ACT4_GATE_HAB = O('act4_gate_hab');

// The Hub's two door-style exits (§56.1/§56.4) need their own `door` stub
// objects, distinct from the two above: `respond.ts`'s `DOOR_TRAVERSAL_
// VERB_IDS` checks `traverseDoor` (a door-BY-NAME lookup keyed on the
// exit's own `door` id) before an object's own handlers ever run for
// IN/OUT/USE — reusing `act4_gate_escape`/`act4_gate_hab` themselves as
// the exit's `door` would let that door-by-name check shadow the frame's
// own `IN` handler (found the hard way: a first draft did exactly that,
// and "ENTER ESCAPE" rendered the exit's `blockedText` instead of the
// frame object's own script). Never opens (no `container`), same minimal
// stub idiom `act3/objects/s6ArchiveHub.ts`'s own `s6BoundaryGate` uses.
export const ACT4_ESCAPE_EXIT_GATE = O('act4_escape_exit_gate');
export const ACT4_HAB_EXIT_GATE = O('act4_hab_exit_gate');

// The Chamber's twelve objects (§7-§20), plus the room-reference stub §24
// needs (a builder's own supporting mechanism, not named by the prose doc
// — "COMPARE PRINT WITH ROOM" needs a dobj noun 'room'/'kitchen' to resolve
// to, and no fixture in the room otherwise claims those words; flagged in
// this task's report).
export const ACT4_COATS = O('act4_coats');
export const ACT4_BARE_HOOK = O('act4_bare_hook');
export const ACT4_SILHOUETTE = O('act4_silhouette');
export const ACT4_FAMILY_TABLE = O('act4_family_table');
export const ACT4_TABLE_DRAWER = O('act4_table_drawer');
export const ACT4_FAMILY_CAMERA = O('act4_family_camera');
export const ACT4_COFFEE_JAR = O('act4_coffee_jar');
export const ACT4_SPARE_KEY = O('act4_spare_key');
export const ACT4_CHAIRS = O('act4_chairs');
export const ACT4_COUNTDOWN = O('act4_countdown');
export const ACT4_CHAMBER_DOOR = O('act4_chamber_door');
export const ACT4_VOICES = O('act4_voices');
export const ACT4_GAME_BOX = O('act4_game_box');
export const ACT4_CHAMBER_WINDOW = O('act4_chamber_window');
export const ACT4_CHAMBER_ROOM_REF = O('act4_chamber_room');

// Flags (§2)
export const ACT4_CHAMBER_ADMITTED = F('act4_chamber_admitted');
export const ACT4_CHAMBER_FIRST_DONE = F('act4_chamber_first_done');
export const ACT4_CHAMBER_COPY_FOUND = F('act4_chamber_copy_found');
export const ACT4_CHAMBER_PHRASE_SAID = F('act4_chamber_phrase_said');
/** Numeric — §18.2, §19.4, §21.3 `inc`; the assist's `>= 2` arm (§22). */
export const ACT4_CHAMBER_FAILURES = F('act4_chamber_failures');
export const ACT4_CHAMBER_COMPLETE = F('act4_chamber_complete');
export const ACT4_DEEP_INDEX = F('act4_deep_index');
/** Mechanical, not named by the prose doc — §15.3/§21.1's "when the timer runs out the panel has one line on it" state, flipped by the timer event and cleared by either prompt outcome. Never player-visible as a number. */
export const ACT4_CHAMBER_PANEL_LIVE = F('act4_chamber_panel_live');
/** Numeric, mechanical, never rendered (§52's no-digit discipline: the countdown's own figure is never given, §15.1) — the turn-count `act4_ev_chamber_timer` counts against; resets to 0 each time it fires. */
export const ACT4_CHAMBER_TIMER_TICKS = F('act4_chamber_timer_ticks');

// Clues (§2)
export const ACT4_CLUE_FRAME_WANTS_MORE = C('act4_clue_frame_wants_more');
export const ACT4_CLUE_ADMITTED = C('act4_clue_admitted');
export const ACT4_CLUE_ROOM_COMPLETED = C('act4_clue_room_completed');
export const ACT4_CLUE_HARVEST_WRONG = C('act4_clue_harvest_wrong');

// Question (§2)
export const ACT4_Q_THE_ROOM = Q('act4_q_the_room');

// Puzzle (§2) — P23
export const ACT4_P23_CHAMBER = P('act4_p23_chamber');

// Memories (§5) — M10, three variants sharing one title.
export const ACT4_MEM_M10_ANALYTICAL = M('act4_mem_m10_analytical');
export const ACT4_MEM_M10_SOCIAL = M('act4_mem_m10_social');
export const ACT4_MEM_M10_DIRECT = M('act4_mem_m10_direct');

// Scripts (§4, §21.2)
export const ACT4_ENTER_ESCAPE_SCRIPT = S('act4_enter_escape');
export const ACT4_CHAMBER_DOOR_OPEN_SCRIPT = S('act4_chamber_door_open');
export const ACT4_CHAMBER_PHRASE_RESPOND_SCRIPT = S('act4_chamber_phrase_respond');
/** Plain string prompt id (matches `ACT3_HUB_LOGIN_PROMPT_ID`'s own convention) — the doc's own `openPrompt: act4_chamber_phrase` (§21.2). Registered in `game.ts`'s `PROMPT_SCRIPTS` and `tests/world-prompt-ids.test.ts`'s `PROMPT_SCRIPT_TABLES` in this same change. */
export const ACT4_CHAMBER_PHRASE_PROMPT_ID = 'act4_chamber_phrase';

// Events (§15.3, §23) — plain string ids, matching this file's own
// `EVENT_ACT4_EV_START` convention.
export const EVENT_ACT4_EV_CHAMBER_TIMER = 'act4_ev_chamber_timer';
export const EVENT_ACT4_EV_CHAMBER_COMPLETE = 'act4_ev_chamber_complete';

// Verb (§18.1) — "GO FIRST"/"TAKE THE FIRST TURN," bare fixed phrases with
// no natural dobj (same idiom as `V_ACT4_PUSH_PAST`).
export const V_ACT4_GO_FIRST = V('act4_go_first');

// --- E1 task M ---
// Luke, the escort, R16, and the boundary (`docs/superpowers/specs/2026-09-
// 18-stage-e1-prose.md` §11, §12, §20-§23, §29, §37, §38). `act4_luke`'s own
// `NpcDefSlice` lives in `./luke.ts` (a new file, this task's own); topic ids
// are declared locally there (sidecar style, matching `nolan.ts`/
// `whitlock.ts`'s own convention) rather than here. `ACT4_STAGING_AREA` (the
// room id) and the staging-side state are task L's — imported by id from
// this same file once L's own labelled block lands (a transient "not
// declared" error naming it belongs to that task, not this one).
export const ACT4_LUKE = N('act4_luke');
export const ACT4_LUKE_MET = F('act4_luke_met');
export const ACT4_LUKE_WILL_ESCORT = F('act4_luke_will_escort');
export const ACT4_S6_DOOR_OPEN = F('act4_s6_door_open');
export const ACT4_LUKE_AT_ROOT = F('act4_luke_at_root');
export const ACT4_LUKE_GONE = F('act4_luke_gone');

// The escort (§20's own heading names this id, the same "section names its
// script" convention `act4_set_visit_day` already follows) — the lift ride
// to Sublevel 5: `advanceClock: 20`, `moveNpc`, `setFollowing`, `goto`.
export const ACT4_LUKE_DESCENDS_SCRIPT = S('act4_luke_descends');

// The stub gate behind S5's shipped `down` exit (§21.1/§37.2's own "stair"
// row) — never player-facing (no `nouns`, same minimal-stub idiom
// `act3/objects/s6ArchiveHub.ts`'s own `s6BoundaryGate` already uses).
// Defaults open (the shipped Pipe Chase route, unaffected); closed for good
// the instant the S6 door opens (§21's own effects), so bare `GO DOWN`
// thereafter renders §21.1's stair text instead of the shipped exit — see
// `act3/s5ReactorInterface.ts`'s own comment on why this, and not the exit's
// `when`, is the mechanism (the alternate Cooling-Plant-hatch route into
// Sublevel 6 stays open throughout, so nothing is actually lost).
export const ACT4_S5_DOWN_GATE = O('act4_s5_down_gate');

// Clues (§2; only this task's four — the other four in §2's list are other
// E1 tasks' own).
export const ACT4_CLUE_LUKES_WORD = C('act4_clue_lukes_word');
export const ACT4_CLUE_LUKES_REASON = C('act4_clue_lukes_reason');
export const ACT4_CLUE_TWO_THING_DOOR = C('act4_clue_two_thing_door');
export const ACT4_CLUE_NOT_THE_USER = C('act4_clue_not_the_user');

// The missed-window event (§2's own flag-table note: "Luke stays... however
// many days that takes" — but once the visit's own days run out with the
// message never having reached him, he still leaves; canon 11). Plain
// string id, matching this file's own `EVENT_ACT4_*` convention.
export const EVENT_ACT4_LUKE_GONE_MISSED = 'act4_ev_luke_gone_missed';

// --- E1 task L ---
// The Staging Area, the hand-offs, and the visit's machinery
// (`docs/superpowers/specs/2026-09-18-stage-e1-prose.md` §2-§10, §13-§19,
// §28, §37, §38). This block declares: the room itself; the six furniture
// objects, the detail, the urn, the office reply; the clues this builder's
// own sections grant; the question `act4_q_reach_luke`; the puzzle P22;
// the hand-off script; the two events (the door opening, the office
// reply); and two new bare verbs (WRITE ON BOARD, the detail's PUSH
// PAST/RUN escape attempt). `act4_luke`/`act4_luke_met`/`act4_luke_gone`
// are read here (the room's own `onEnter`, P22's `solvedWhen`, the room
// description) but are task M's own declarations, above (RECONCILED on
// conflict, per this wave's shared-file protocol — this block originally
// declared its own copies before finding M's already on disk; removed in
// favor of those, matching this codebase's own precedent for the identical
// situation, `act1/ids.ts`'s `PIE_BOX` header comment). Grep checked before
// every id below — none pre-existed.

// Room (§3)
export const ACT4_STAGING_AREA = R('act4_staging_area');

export const ACT4_STAGING_OPEN = F('act4_staging_open');
export const ACT4_MESSAGE_DELIVERED = F('act4_message_delivered');
/** String — `'none' | 'family' | 'plain' | 'rewritten'` (§16). */
export const ACT4_MESSAGE_VERDICT = F('act4_message_verdict');
/** Numeric — the day the office's form letter is due (§16, §19). */
export const ACT4_OFFICE_REPLY_DUE = F('act4_office_reply_due');

// Objects (§4-§10, §19)
export const ACT4_STAGING_WHITEBOARD = O('act4_staging_whiteboard');
export const ACT4_CONFERENCE_TABLE = O('act4_conference_table');
export const ACT4_LUKES_FOLDER = O('act4_lukes_folder');
export const ACT4_JACK_LETTERS = O('act4_jack_letters');
export const ACT4_STAGING_WINDOW = O('act4_staging_window');
/** Scenery, not an NPC (§37.2's own collision note: "the detail are not NPCs and must not become them"). Present in the Staging Area and, as the antecedent of §17's blocked text, in the Lobby from `act4_visit_day`. */
export const ACT4_DETAIL = O('act4_detail');
export const ACT4_COFFEE_URN = O('act4_coffee_urn');
/** §19 — the office's form letter. The fifth `reply`-noun object (§37.2). */
export const ACT4_REPLY_OFFICE = O('act4_reply_office');

// Clues this task's own sections grant (§2, §9.2, §16, §7.1)
export const ACT4_CLUE_DETAIL_REFUSES = C('act4_clue_detail_refuses');
export const ACT4_CLUE_MESSAGE_THROUGH = C('act4_clue_message_through');
export const ACT4_CLUE_LETTERS_FROM_JACK = C('act4_clue_letters_from_jack');

// Question (§2, P22's own anchor)
export const ACT4_Q_REACH_LUKE = Q('act4_q_reach_luke');

// Puzzle (§2) — P22
export const ACT4_P22_LUKE = P('act4_p22_luke');

// Script (§14, §15, §16) — the hand-off, shared by both GIVE responses.
export const ACT4_HAND_LETTER_SCRIPT = S('act4_hand_letter');

// Events (§17, §19) — plain string ids, matching this file's own
// `EVENT_ACT4_EV_START` convention (not `S()` — events are addressed by
// plain string id, scripts by branded `ScriptId`).
export const EVENT_ACT4_EV_STAGING_OPENS = 'act4_ev_staging_opens';
export const EVENT_ACT4_EV_OFFICE_REPLY = 'act4_ev_office_reply';
/** §37.2's own "MEN/DETAIL... in the Lobby on and after `act4_visit_day`" ruling — a one-time reveal, not named in the prose doc's own §2 event list. */
export const EVENT_ACT4_EV_DETAIL_ARRIVES = 'act4_ev_detail_arrives';

// Verbs (§4.2, §9.4) — new bare (no-dobj-required) verbs this room's own
// escape/vandalism attempts need; neither collides with an existing verb
// word (checked: `write on`/`push past`/`run` claimed by nobody).
/** "WRITE ON BOARD" (§4.2) — two-word bare form so it never collides with `act2_write`'s own bare "write" (`validate.ts`'s verb-word-collision check groups by exact phrase, not per-word). */
export const V_ACT4_WRITE_ON = V('act4_write_on');
/** "PUSH PAST"/"RUN"/etc. (§9.4) — bare, no dobj; the detail's escape-attempt refusal. */
export const V_ACT4_PUSH_PAST = V('act4_push_past');

// --- E1 task N ---
// R14's completion: Jack comes down (`docs/superpowers/specs/2026-09-18-
// stage-e1-prose.md` §24-§27, §33, §37). `act1_jack`'s own `NpcDefSlice`
// lives in `../../act1/jack.ts`; the new topic's id is declared locally
// there (sidecar style, matching `jack.ts`'s own established convention for
// its other topic ids — not here). Grep checked before every id below —
// none pre-existed.

// Flags (§2)
export const ACT4_JACK_WILL_COME = F('act4_jack_will_come');
export const ACT4_JACK_SAW_MARK = F('act4_jack_saw_mark');

// Clue (§2, §25 — R14)
export const ACT4_CLUE_JACK_SAW = C('act4_clue_jack_saw');

// Events (§25, §26) — plain string ids, matching this file's own
// `EVENT_ACT4_EV_START` convention.
export const EVENT_ACT4_EV_JACK_SEES = 'act4_ev_jack_sees';
export const EVENT_ACT4_EV_JACK_RETURNS = 'act4_ev_jack_returns';
/**
 * §26's block, as a `once` `EventDef` (E1 integration builder fix, the
 * addendum's own status-line ruling): task N originally wired this as a
 * PERMANENT greeting rule, gated `{ flag: act4_jack_saw_mark, at:
 * SUNDOWN_DINER }`, because a `ProseRule` has no effect slot to flip a
 * fresh "unspoken-to" flag on the turn it renders (see `act1/jack.ts`'s own
 * header note on that gap) — but a greeting rule has no `once` ceiling
 * either, so the scene repeated every visit to the counter. An `EventDef`
 * DOES carry `once` (§2.8), so the fix moves the block there instead: it
 * renders exactly once, the first time the player finds Jack at the
 * counter after that night, and Jack's shipped greeting resumes after.
 */
export const EVENT_ACT4_EV_JACK_MORNING_SCENE = 'act4_ev_jack_morning_scene';
/**
 * §24.2, the tunnel mouth — not named by the prose doc (only §25/§26 are),
 * a third event id beyond this task's own brief. Its `EventDef` lives in
 * `../../act1/jack.ts` (the character's own file, `act2/dad.ts`'s
 * `ACT4_EV_DAD_BREATH` precedent for an Act-IV-flagged beat that belongs
 * with a different act's NPC), registered in `act4/index.ts`. Flagged in
 * this task's report rather than silently added.
 */
export const ACT4_EV_JACK_TUNNEL = 'act4_ev_jack_tunnel';

// --- E2 task Q ---
// The library annex, the darkroom, the two prints, and R17
// (`docs/superpowers/specs/2026-09-19-stage-e2-prose.md` §42-§47, §52, §56,
// §57). The shelf/key live physically in `act1_county_library`
// (`act1/objects/countyLibrary.ts`, amended in place — this file's own
// header rule: only the id is namespaced `act4_*` here, same precedent as
// `act4_crews`/`act4_visit_notice` above). The two prints, the sissy-film
// develop handler and the develop script itself are this task's own new
// file, `act4/objects/darkroom.ts` / `act4/scripts.ts`.

// Flags (§2)
export const ACT4_DARKROOM_OPEN = F('act4_darkroom_open');
export const ACT4_SISSY_FILM_DEVELOPED = F('act4_sissy_film_developed');
export const ACT4_JULES_FILM_DEVELOPED = F('act4_jules_film_developed');
export const ACT4_SKY_MATCHED = F('act4_sky_matched');

// Objects (§42.1, §42.2, §45)
export const ACT4_ANNEX_SHELF = O('act4_annex_shelf');
export const ACT4_DARKROOM_KEY = O('act4_darkroom_key');
export const ACT4_PRINT_SKY = O('act4_print_sky');
export const ACT4_PRINT_LAST_DAY = O('act4_print_last_day');

// Clue (§2, §46 — R17)
export const ACT4_CLUE_SKY_IS_CEILING = C('act4_clue_sky_is_ceiling');

// Puzzle (§2, §47.2) — P24
export const ACT4_P24_MARS_FILM = P('act4_p24_mars_film');

// Script (§44) — one script id, shared by both canisters' own DEVELOP
// handlers (`args.which`) and the darkroom door's bare ENTER handler (no
// args — the script reads which canister(s) are held).
export const ACT4_DEVELOP_SCRIPT = S('act4_develop');

// New verb (§44) — "DEVELOP"/"DEVELOP FILM". A plain, ungated word (like
// `PRY`/`UNLOCK` in `act1/verbs.ts`) rather than an act4-prefixed compound
// phrase, since nothing else in the game claims it; declared here rather
// than in `act1/verbs.ts` because that file is out of this task's named
// scope (hard rule 1) and `act4/verbs.ts` is this wave's own established
// home for a brand-new verb word (`V_ACT4_WRITE_ON`'s own precedent).
export const V_DEVELOP = V('develop');

// `ACT4_SISSY_FILM`, `ACT4_HAB_DOME` and `ACT4_Q_THE_SKY` were forward-
// declared here as stand-ins (same precedent as `PIE_BOX`, `act1/ids.ts`)
// while task P's own block had not yet landed. RECONCILED (this task's own
// report): task P's block below now declares all three properly (room,
// object with its real `{ in: ACT4_CAMERA }` starting location, and the
// question's `openWhen`) — the stand-ins are removed in favor of those. This
// task's own contribution to `act4_q_the_sky` (`answerWhen`/`answer`) is
// added as a labelled amendment to task P's already-declared
// `ACT4_P_QUESTIONS[ACT4_Q_THE_SKY]` entry in `./knowledge.ts`, not a
// second competing declaration.

// --- E2 task P ---
// The hab: the Galley, the Dome, Sissy, and M11
// (`docs/superpowers/specs/2026-09-19-stage-e2-prose.md` §25-§40, §52, §56,
// §57). Two concurrent builders share this wave: task O (the frames/
// Chamber/P23/boundary — `act4/escapeChamber.ts`, the Hub's gate objects,
// `act4/scripts.ts`'s phrase prompt) declares `ACT4_ESCAPE_CHAMBER` and the
// two gate objects; task Q (the library/darkroom/prints/R17) declares the
// prints and `ACT4_CLUE_SKY_IS_CEILING`. Grep checked before every id below
// — none pre-existed.

// Rooms (§26, §34)
export const ACT4_HAB_GALLEY = R('act4_hab_galley');
export const ACT4_HAB_DOME = R('act4_hab_dome');

// NPC (§32) — `NpcDefSlice` lives in `./sissy.ts` (new file, sidecar-topic
// style like `luke.ts`).
export const ACT4_SISSY = N('act4_sissy');

// Flag (§2, §32.4) — M11's own trigger.
export const ACT4_SISSY_TOPIC_LAUNCH = F('act4_sissy_topic_launch');

/**
 * Builder-authored (not named by the prose doc) — `act4_leave_hab`'s own
 * "first crossing back" vs "later crossings back" signal (§25.3/§25.4).
 * Entering has a natural signal for free (`{ not: { visited:
 * ACT4_HAB_GALLEY } }` — the room hasn't been arrived at yet); leaving has
 * no such signal, since the destination (`ACT3_S6_ARCHIVE_HUB`) was always
 * visited long before Act IV's hab thread exists. Flagged in this task's
 * report rather than silently added.
 */
export const ACT4_HAB_LEFT_ONCE = F('act4_hab_left_once');

// Clues (§2)
export const ACT4_CLUE_SISSY_COUNTS_THREE = C('act4_clue_sissy_counts_three');
export const ACT4_CLUE_SISSYS_REASON = C('act4_clue_sissys_reason');
export const ACT4_CLUE_SAME_ARRANGEMENT = C('act4_clue_same_arrangement');

// Question (§2) — `act4_q_the_sky`. `openWhen` is this task's own
// (`{ visited: ACT4_HAB_DOME }`); `answerWhen`/`answer` (R17,
// `act4_clue_sky_is_ceiling`) are task Q's to add to the same def, in their
// own labelled edit of `./knowledge.ts` — left uncommented there for them
// rather than guessed at here.
export const ACT4_Q_THE_SKY = Q('act4_q_the_sky');

// Memory (§33) — M11, *One Sky*.
export const ACT4_MEM_M11 = M('act4_mem_m11');

// Objects — the Galley (§27-§31)
export const ACT4_ANOMALY_LOGS = O('act4_anomaly_logs');
export const ACT4_COMMS_RIG = O('act4_comms_rig');
export const ACT4_HAB_TERMINAL = O('act4_hab_terminal');
export const ACT4_AIRLOCK_DOOR = O('act4_airlock_door');
export const ACT4_GALLEY_TABLE = O('act4_galley_table');
export const ACT4_HAB_TRAYS = O('act4_hab_trays');

// Objects — the Dome (§35-§40)
export const ACT4_DOME_GLASS = O('act4_dome_glass');
export const ACT4_HORIZON = O('act4_horizon');
export const ACT4_SKY = O('act4_sky');
export const ACT4_CAMERA = O('act4_camera');
export const ACT4_DOME_CHAIR = O('act4_dome_chair');
export const ACT4_SKY_LOG = O('act4_sky_log');

/** The Mars-anomaly canister (§32.2, §38.2) — the `act4_has_sissy_film` derived flag's own note (§2): "use `{ has: act4_sissy_film }`, do not add a flag." Starts `{ in: ACT4_CAMERA }`. */
export const ACT4_SISSY_FILM = O('act4_sissy_film');

// Scripts (§25) — the second frame's traversal. `act4_enter_hab` is called
// from task O's `act4_gate_hab` object's own `IN` handler (O's brief: "the
// gates' IN scripts do the traversal") — coordinate via that object's own
// `{ script: { id: ACT4_ENTER_HAB_SCRIPT } }` effect, once task O has
// landed it (see this task's own report if it hadn't yet). `act4_leave_hab`
// is called from this task's own `act4_airlock_door` object (`./objects/
// hab.ts`).
export const ACT4_ENTER_HAB_SCRIPT = S('act4_enter_hab');
export const ACT4_LEAVE_HAB_SCRIPT = S('act4_leave_hab');

// Verb (§28.2) — "SEND MESSAGE"/"TYPE ON RIG", a bare fixed-phrase verb (no
// natural "message" object to hang a dobj handler on — same idiom as
// `V_POST_LETTER`/`V_ACT2_DRIVE_TO_PLANT`, `act1/ids.ts`'s own precedent
// comment). "USE RIG" reaches the identical text via the built-in
// `USE_VERB_ID` on the rig object itself, not this verb.
export const V_ACT4_SEND_MESSAGE = V('act4_send_message');
