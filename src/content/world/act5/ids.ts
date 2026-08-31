// Act V ("root") — id constants.
//
// Every id declared here — and only here — is namespaced `act5_*` (Stage E
// plan §0.3, the same convention `act1`–`act4` follow). This file may import
// only `engine/ids` and other `ids.ts` files.
//
// Wave E3 shared — written by the main session before the E3 builders ran
// (`docs/superpowers/specs/2026-09-20-stage-e3-prose.md` §2, §42). Builders
// ADD their own verb/topic ids below the anchor at the end of this file,
// with the Edit tool, never Write.

import { C, F, M, O, P, Q, R, S, T, V } from '../../../engine/ids';

// Flags (E3 prose §2's table)
export const ACT5_BRANCH_UNLOCKED = F('act5_branch_unlocked');
export const ACT5_STARTED = F('act5_started');
export const ACT5_ROOT_ACCEPTED = F('act5_root_accepted');
export const ACT5_RECONCILIATION_RUNNING = F('act5_reconciliation_running');
export const ACT5_ROOT_DOOR_OPEN = F('act5_root_door_open');
export const ACT5_JULES_WOKEN = F('act5_jules_woken');
export const ACT5_CACHED_NOTEBOOK = F('act5_cached_notebook');
export const ACT5_CACHED_FILM = F('act5_cached_film');
export const ACT5_CACHED_USB = F('act5_cached_usb');
export const ACT5_CACHED_LETTER = F('act5_cached_letter');
export const ACT5_INITIALIZED = F('act5_initialized');
export const ACT5_OPENING_LOGIN_SEEN = F('act5_opening_login_seen');

// Clues (§2)
export const ACT5_CLUE_KEY_NUMBER = C('act5_clue_key_number');
export const ACT5_CLUE_REVISION = C('act5_clue_revision');
export const ACT5_CLUE_ACCEPTED = C('act5_clue_accepted');
export const ACT5_CLUE_MADE_BY_JULES = C('act5_clue_made_by_jules');
export const ACT5_CLUE_JULES_SPOKE = C('act5_clue_jules_spoke');
export const ACT5_CLUE_LOCKER = C('act5_clue_locker');

// Questions (§2)
export const ACT5_Q_WHAT_IS_AT_THE_BOTTOM = Q('act5_q_what_is_at_the_bottom');
export const ACT5_Q_WHO_IS_FILED_AT_ROOT = Q('act5_q_who_is_filed_at_root');
export const ACT5_Q_WHAT_DO_YOU_OWE = Q('act5_q_what_do_you_owe');

// Puzzles (§2)
export const ACT5_P25_WAY_DOWN = P('act5_p25_way_down');
export const ACT5_P26_CONSOLE = P('act5_p26_console');
export const ACT5_P27_JULES = P('act5_p27_jules');
export const ACT5_P28_CREATE = P('act5_p28_create');

// Memory (§14)
export const ACT5_MEM_M17 = M('act5_mem_m17');

// Rooms (§4, §10, §20)
export const ACT5_ROOT_SHAFT = R('act5_root_shaft');
export const ACT5_ROOT_ANTECHAMBER = R('act5_root_antechamber');
export const ACT5_BLANK_ROOM = R('act5_blank_room');

// Objects (the "Wires into" list)
export const ACT5_BRANCH_HATCH = O('act5_branch_hatch');
export const ACT5_LADDER = O('act5_ladder');
export const ACT5_REVISION_STENCIL = O('act5_revision_stencil');
export const ACT5_RETURN_B = O('act5_return_b');
export const ACT5_S6_BLANK_DOOR = O('act5_s6_blank_door');
export const ACT5_STAIR_DOOR = O('act5_stair_door');
export const ACT5_ANTE_CONSOLE = O('act5_ante_console');
export const ACT5_INNER_DOOR = O('act5_inner_door');
export const ACT5_WELL_DOOR = O('act5_well_door');
export const ACT5_ROOT_TERMINAL = O('act5_root_terminal');
export const ACT5_CREATION_RECORD = O('act5_creation_record');
export const ACT5_INDEX = O('act5_index');
export const ACT5_JULES_SNAPSHOT = O('act5_jules_snapshot');
export const ACT5_TRAY = O('act5_tray');
export const ACT5_LETTER_TO_JACK = O('act5_letter_to_jack');
export const ACT5_LOCKER = O('act5_locker');
export const ACT5_BLANK_ROOM_DOOR = O('act5_blank_room_door');

// Scripts (§12, §24, §28-§32)
export const ACT5_ANTE_LOGIN_OPEN_SCRIPT = S('act5_ante_login_open');
export const ACT5_ANTE_LOGIN_RESPOND_SCRIPT = S('act5_ante_login_respond');
export const ACT5_WAKE_JULES_SCRIPT = S('act5_wake_jules');
export const ACT5_CREATE_SUBJECT_OPEN_SCRIPT = S('act5_create_subject_open');
export const ACT5_CREATE_SUBJECT_RESPOND_SCRIPT = S('act5_create_subject_respond');
export const ACT5_INITIALIZE_RESPOND_SCRIPT = S('act5_initialize_respond');
export const ACT5_RECURSION_SCRIPT = S('act5_recursion');
export const ACT5_OPENING_LOGIN_OPEN_SCRIPT = S('act5_opening_login_open');
export const ACT5_OPENING_LOGIN_RESPOND_SCRIPT = S('act5_opening_login_respond');
// Stage F1 — "LOOK IN LOCKER"/"SEARCH LOCKER" (`SEARCH`'s own words,
// `act1/verbs.ts`) used to always render the generic search family, wrong
// once the cache actually holds something (§26.7's own note: the locker is
// "LOOK IN-able", canon 91/108). A script (not a static handler) because the
// contents are dynamic — computed fresh each call from `objectLocation`,
// `objects/blankRoom.ts`'s own `act5LockerContents`.
export const ACT5_LOCKER_CONTENTS_SCRIPT = S('act5_locker_contents');

/**
 * The ending id — the `{ end: ACT5_ENDING_ID }` the recursion script's last
 * effect carries, and the value `meta.recursiveEnding` names (ADR 0012;
 * register 137). Deliberately the same string as the script id.
 */
export const ACT5_ENDING_ID = 'act5_recursion';

// Prompts (plan §3.5's three-logins rule + the form + INITIALIZE?)
export const ACT5_ANTE_LOGIN_PROMPT_ID = 'act5_ante_login';
export const ACT5_CREATE_SUBJECT_PROMPT_ID = 'act5_create_subject';
export const ACT5_INITIALIZE_PROMPT_ID = 'act5_initialize';
export const ACT5_OPENING_LOGIN_PROMPT_ID = 'act5_opening_login';

// Events (§2, §13, §18, §26)
export const EVENT_ACT5_EV_START = 'act5_ev_start';
export const EVENT_ACT5_EV_DAD_DEFAULTS = 'act5_ev_dad_defaults';
export const EVENT_ACT5_EV_REACQUIRE = 'act5_ev_reacquire';
export const EVENT_ACT5_EV_LOCKER = 'act5_ev_locker';

// Death + checkpoints (§2 "Deaths"; same plain-string shape as
// `ACT3_DEATH_REACTOR`/`ACT3_CHECKPOINT_S6`)
export const ACT5_DEATH_REACQUIRE = 'act5_reacquire';
export const ACT5_CHECKPOINT_SHAFT = 'act5_shaft';
export const ACT5_CHECKPOINT_ANTECHAMBER = 'act5_antechamber';

// --- E3 builders append below this line (Edit tool only; one block per task, labelled) ---

// --- E3 task V (Part Three/Four — the Blank Room, root terminal, record,
// index, waking Jules, the letter/tray, the locker, the way back, CREATE
// SUBJECT, INITIALIZE?) — fixed-phrase verb ids only (§42.2/§42.3: every
// object/script/prompt id this task needs is already declared above). ---
export const V_ACT5_CREATE_SUBJECT = V('act5_create_subject');
// §23.2/§23.4 — "SEARCH INDEX FOR JULES"/"FOR JACK"/etc. resolve through an
// extended SEARCH pattern (`V dobj prep iobj`, "for") against the index
// object and whatever NPC/object noun follows "for" — every one of those
// nouns (jules, jack, nolan, luke, sissy, whitlock, marlow, pearl, dot, eli)
// already exists elsewhere in the game, so this needs no new vocabulary and
// costs no new verb-noun collisions (`../blankRoom.ts`/`objects/blankRoom.ts`).
// "ME"/"MYSELF"/"THE INVESTIGATOR" resolve to no object anywhere (same
// reason the shipped ledger's own self-search needed a literal fixed
// phrase, not object resolution) and keep their own bare verb below. Named
// NPCs (jack, nolan, luke, sissy, whitlock, marlow, pearl, dot, eli) DO
// exist as nouns elsewhere, but noun resolution is scope-limited — none of
// them is ever physically present in the Blank Room, so "FOR JACK" etc.
// can't resolve as an iobj here the way "FOR JULES" does (his own object
// IS in this room) and fall back to the same fixed-phrase idiom the
// shipped ledger's own "SEARCH LEDGER FOR JACK" etc. already uses.
export const V_ACT5_INDEX_SEARCH_SELF = V('act5_index_search_self');
export const V_ACT5_INDEX_SEARCH_OTHER = V('act5_index_search_other');
export const V_ACT5_DIG = V('act5_dig');

// --- E3 task W ---
// The opening terminal's `LOGIN`/`ENTER USER` verb (§32) — a `'V dobj'`
// verb, not bare: the literal 2-word phrase "log in" is already claimed,
// globally, bare-only, by `act1/ids.ts`'s shipped `V_TYPE_TERMINAL` (words
// `type`/`log in`/`press key`, pattern `['V']`), which task W's own wiring
// note leaves untouched in every direction (§42.1's own table: "V_TYPE_
// TERMINAL... not touched"). A second verb claiming the identical phrase
// "log in" would be a `verb-word-collision` (`validate.ts`) — two
// different verb ids can never share one exact phrase unless every
// colliding pattern requires a preposition, which a bare `'V'` verb never
// does. "login" (one token) and "enter user" (a distinct two-word phrase)
// are free, so this verb claims those two only; plain "LOG IN" typed alone
// (no object named) still reaches the shipped bare rotation, unchanged —
// flagged as a proposal in this task's report, not guessed silently.
export const V_ACT5_LOGIN_TERMINAL = V('act5_login_terminal');

// --- E3 task U (the shaft, the antechamber, the console, Dad's password
// topic — §3-§15, §17-§19) ---
// The antechamber console's own §12 login trigger: "TYPE ADMIN" as a
// literal two-word bare phrase (pattern 'V', distinct token length from
// `act1/ids.ts`'s shipped `V_TYPE_TERMINAL` — 'type' alone, 1 token,
// pattern 'V' — so no ambiguity; both candidates are tried and only the
// one whose remaining-token count fits ever matches, same idiom the PUT_IN/
// PUT_ON shared-word precedent already establishes). Bare "LOG IN"/"TYPE"/
// "PRESS KEY" (already global vocabulary via `V_TYPE_TERMINAL`) reach the
// same console handler unchanged. "LOGIN" and "ENTER USER" are task W's own
// `V_ACT5_LOGIN_TERMINAL` above (the opening terminal, 'V dobj') and are
// not wired to this room — a second verb claiming either word would
// collide; flagged as a proposal in this task's report rather than guessed.
export const V_ACT5_ANTE_LOGIN = V('act5_ante_type_admin');

// Dad's §13.2 topic — "ASK DAD ABOUT PASSWORD"/"ABOUT DEFAULTS"/"ABOUT THE
// LOGIN", amended onto `act2/dad.ts`.
export const ACT5_DAD_TOPIC_PASSWORD = T('act5_dad_topic_password');

// --- Stage F wave F0 (`docs/superpowers/specs/2026-09-21-stage-f0-prose.md`
// §2-§5) — M21-M24, the replay fragments (the seeded stratum leaking,
// register 148). No capability flags, no variants, no profile arms. Defs
// in `./replayMemories.ts`. ---
export const ACT5_MEM_M21 = M('act5_mem_m21');
export const ACT5_MEM_M22 = M('act5_mem_m22');
export const ACT5_MEM_M23 = M('act5_mem_m23');
export const ACT5_MEM_M24 = M('act5_mem_m24');
