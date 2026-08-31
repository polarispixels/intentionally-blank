// Act III ("Heat Doesn't Lie") — id constants.
//
// Every id declared here — and only here — must be namespaced `act3_*`
// (Stage D plan §0.3, same convention `act1/ids.ts`/`act2/ids.ts` already
// follow): `R('act3_...')`, `O('act3_...')`, `N('act3_...')`, and so on, via
// `src/engine/ids.ts`'s constructors. This file may import only
// `engine/ids` and other `ids.ts` files (`act3/ids.ts` may import
// `act1/ids.ts`/`act2/ids.ts`; never the reverse) — the same cycle-safety
// rule `act2/ids.ts`'s own header states.
//
// D3, task A — travel to the perimeter, the Perimeter Road & Gatehouse
// room (7 objects), P16's four routes, Jack's persuasion, alertness, and
// the truck's toolbox/wrench (`docs/superpowers/specs/2026-09-07-stage-d-
// plan.md` §2 D3; `docs/superpowers/specs/2026-09-11-stage-d3-prose.md`
// §2-§6, §14.1, §21). Two other builders' rooms (task B — Lobby, Nolan at
// work, Data Hall A; task C — Cooling Plant, Corridor B4, the elevator, M7,
// the boundary) land in this same directory/file concurrently; every id
// below not under "wave D3 shared" is this task's own.

import { C, F, M, N, O, P, Q, R, S, T, V } from '../../../engine/ids';

// ---------------------------------------------------------------------------
// wave D3 shared — declared here because this task's own room/puzzle/
// travel work reads them (the perimeter's `north` exit, P16's
// `solvedWhen`, the fence/manifest/badge routes' own `goto` targets)
// before task B's/C's own files necessarily land. Same id string either
// way, so a duplicate declaration by task B or C is a compile error, not a
// silent drift — reconcile on merge by deleting whichever declaration
// lands second (this task's own report flags it).
// ---------------------------------------------------------------------------

/** Task B's room (Lobby / Visitor Center). */
export const ACT3_LOBBY = R('act3_lobby');
/** Task C's room (Cooling Plant). */
export const ACT3_COOLING_PLANT = R('act3_cooling_plant');

// ---------------------------------------------------------------------------
// D3, task A — rooms.
// ---------------------------------------------------------------------------

export const ACT3_PERIMETER_ROAD = R('act3_perimeter_road');

// ---------------------------------------------------------------------------
// D3, task A — the Perimeter Road & Gatehouse's seven objects (§4.3-§4.9).
// ---------------------------------------------------------------------------

export const ACT3_FENCE = O('act3_fence');
export const ACT3_GATEHOUSE = O('act3_gatehouse');
export const ACT3_GATE_READER = O('act3_gate_reader');
export const ACT3_PERIMETER_LIGHT = O('act3_perimeter_light');
/** Present only Tuesday mornings — see `objects/perimeterRoad.ts`'s own header for the idiom chosen (a description `ProseRule[]`, not hidden/reveal). */
export const ACT3_MANIFEST = O('act3_manifest');
export const ACT3_APRON = O('act3_apron');
export const ACT3_TUNNEL_COUNTRY = O('act3_tunnel_country');

// --- Sub-parts (not counted against the room's own "7 objects" tier, same
// idiom as `ACT2_CLAIM_WINDOW_CARD`/`ACT2_SHELVING_STENCILS` — builder
// addition, flagged in this task's report) ---------------------------------

/** `{ on: ACT3_GATEHOUSE }` — §4.4's "read paperback" needs its own noun/text, distinct from the gatehouse's own EXAMINE. */
export const ACT3_GATEHOUSE_PAPERBACK = O('act3_gatehouse_paperback');
/** `{ on: ACT3_GATEHOUSE }` — §4.4's "read calendar", same reasoning. */
export const ACT3_GATEHOUSE_CALENDAR = O('act3_gatehouse_calendar');

/**
 * Mechanism-only, never named/examinable (no `nouns`, same idiom as
 * `TOWN_EDGE_NO_EXIT_GATE`/`HIGHWAY_GATE`, `act1/objects/
 * townEdge.ts`): the perimeter's `north`/`in` exit door, closed until any
 * P16 route sets it open. Builder addition (not in the pre-approved id
 * list), needed so a plain `NORTH`/`IN` after a route completes reaches the
 * Lobby without re-running the whole route — see this task's report.
 */
export const ACT3_GATE_DOOR = O('act3_gate_door');

// --- The truck's toolbox and wrench (§21.3's own flagged gap; ruling 4) ----

export const ACT3_TRUCK_TOOLBOX = O('act3_truck_toolbox');
export const ACT3_WRENCH = O('act3_wrench');

// --- Flags (§2's own table) -------------------------------------------------

export const ACT3_AT_PERIMETER = F('act3_at_perimeter');
export const ACT3_HORSE_TIED = F('act3_horse_tied');
export const ACT3_JACK_WILL_RAM = F('act3_jack_will_ram');
export const ACT3_INSIDE = F('act3_inside');
export const ACT3_FLAG_TAILGATED = F('act3_flag_tailgated');
export const ACT3_FLAG_ENTERED_AS_VENDOR = F('act3_flag_entered_as_vendor');
export const ACT3_RODE_FENCE = F('act3_rode_fence');
/** Numeric, default 0 (plan §2 D3; §14.1). Read only by the room's own description rule 4 and the light's `examine` rule 1 — nothing else in D3. */
export const ACT3_ALERTNESS = F('act3_alertness');

// --- Clue --------------------------------------------------------------------

export const ACT3_CLUE_GATE_RHYTHM = C('act3_clue_gate_rhythm');

// --- Puzzle --------------------------------------------------------------------

export const ACT3_P16_ENTRY = P('act3_p16_entry');

// --- Memory --------------------------------------------------------------------

export const ACT3_MEM_M20D = M('act3_mem_m20d');

// --- Scripts -------------------------------------------------------------------

/** Route (c)'s beats + M20-D grant + `goto` (`act3/scripts.ts`). */
export const ACT3_RAM_FENCE_SCRIPT = S('act3_ram_fence');

// --- Verbs ---------------------------------------------------------------------

/** "RAM FENCE"/"DRIVE THROUGH FENCE"/"DRIVE AT FENCE" (§5.3) — new words, grepped clean against every act1/act2 verb's own word list. */
export const V_ACT3_RAM = V('act3_ram');
/** "WRITE VENDOR NUMBER" (§5.5) — a bare, fixed-phrase verb (same idiom as `V_ACT2_DRIVE_TO_PLANT`: "SIGN MANIFEST" itself reaches the manifest object through the already-shipped `V_SIGN`'s own `'V dobj'` pattern, act1/verbs.ts — no new verb needed for that phrasing). */
export const V_ACT3_WRITE_VENDOR_NUMBER = V('act3_write_vendor_number');
/** "RIDE TO PLANT"/"RIDE TO THE PLANT"/"RIDE NORTH TO PLANT" (§3, ruling 1) — bare, fixed-phrase, same idiom as `V_ACT2_DRIVE_TO_PLANT`. */
export const V_ACT3_RIDE_TO_PLANT = V('act3_ride_to_plant');
/** "LOOK WEST" (§4.2) — bare fixed phrase, same idiom as `V_LOOK_OUT`/`V_LOOK_UP` (act1/ids.ts). Builder decision: bare `LOOK` itself is NOT overridden here (see this task's report) — overriding it would break the room's own base description rendering, which nothing else in the shipped game does. */
export const V_ACT3_LOOK_WEST = V('act3_look_west');
/** "TAKE PHOTOGRAPH"/"PHOTOGRAPH FENCE" (§4.10) — new words, grepped clean; `patterns: ['V', 'V dobj']` so both the bare and the fence-targeted phrasing reach the same one line. */
export const V_ACT3_PHOTOGRAPH = V('act3_photograph');

// --- Jack's new topic (`act1/jack.ts` amendment, §4.10) -------------------------

export const ACT3_JACK_TOPIC_FENCE = T('act3_jack_topic_fence');

// =============================================================================
// D3, task B — the Lobby / Visitor Center, Data Hall A, and Nolan's
// `{ at: act3_lobby }` work layer. Re-appended after this file was
// overwritten mid-wave (task A's own edit replaced this whole file rather
// than appending after task B's original content — flagged in task B's own
// report). `ACT3_LOBBY`/`ACT3_COOLING_PLANT`/`ACT3_INSIDE`/`ACT3_ALERTNESS`/
// `ACT3_FLAG_TAILGATED`/`ACT3_FLAG_ENTERED_AS_VENDOR`/`ACT3_RODE_FENCE` are
// task A's own declarations above — task B reads all seven, redeclares
// none. `ACT3_CORRIDOR_B4` (task C's room) is fallback-declared below,
// same reasoning: task C's own `ids.ts` additions were lost in the same
// overwrite and had not reappeared as of this edit.
// =============================================================================

/** Task C's room — reached from Data Hall A's `e`/B4 exit. Fallback-declared here; task C's own copy (lost in task A's overwrite, per this task's report) supersedes this if/when it reappears — same id string either way. */
export const ACT3_CORRIDOR_B4 = R('act3_corridor_b4');

export const ACT3_DATA_HALL_A = R('act3_data_hall_a');

// --- The Lobby's six objects, plus three uncounted sub-parts (the bench,
// the coffee-through-a-door, and the model's figures — see
// `act3/objects/lobby.ts`'s own header for why none of the three count
// toward the room's "6"). ---------------------------------------------------

export const ACT3_PLAQUE = O('act3_plaque');
export const ACT3_MODEL = O('act3_model');
export const ACT3_BROCHURES = O('act3_brochures');
export const ACT3_LOBBY_READER = O('act3_lobby_reader');
export const ACT3_RECEPTION_BELL = O('act3_reception_bell');
export const ACT3_STAGING_DOOR = O('act3_staging_door');
export const ACT3_LOBBY_BENCH = O('act3_lobby_bench');
export const ACT3_LOBBY_COFFEE = O('act3_lobby_coffee');
/** `EXAMINE FIGURES`/`EXAMINE PEOPLE` (§7.3) needs its own noun-bearing object because `EXAMINE` on `ACT3_MODEL` can't distinguish which noun resolved it. */
export const ACT3_MODEL_FIGURES = O('act3_model_figures');

/** Internal wiring — the event that opens `ACT3_LOBBY_READER`'s `container.open` the first turn any of the three passage conditions holds (§7.5's gate). Not a flag: this is an `EventDef` id (a plain string, per `world.events`'s own keying), not a `FlagId`. */
export const EVENT_ACT3_LOBBY_READER_OPENS = 'act3_ev_lobby_reader_opens';

export const ACT3_SAW_MODEL = F('act3_saw_model');
export const ACT3_COUNTED_LEVELS = F('act3_counted_levels');

export const ACT3_CLUE_PLAQUE = C('act3_clue_plaque');
export const ACT3_CLUE_MODEL_SHORT = C('act3_clue_model_short');
export const ACT3_CLUE_PULSE = C('act3_clue_pulse');

// --- Data Hall A's five objects. --------------------------------------------

export const ACT3_RACKS = O('act3_racks');
export const ACT3_NOISE = O('act3_noise');
export const ACT3_AISLE_SIGN = O('act3_aisle_sign');
export const ACT3_PLANT_DOOR = O('act3_plant_door');
export const ACT3_COLD_AISLE_CURTAIN = O('act3_cold_aisle_curtain');

// --- A new bare-phrase verb for Data Hall A's "LOOK DOWN AISLE"/"LOOK ALONG
// ROW" (§9.7); declared in `act3/verbs.ts`. -----------------------------------

export const V_LOOK_DOWN_AISLE = V('act3_look_down_aisle');

// --- Nolan at work (`act2/nolan.ts`, amended by task B); new topic ids live
// here rather than in `act2/ids.ts` so that file stays untouched this wave.
// Each reuses its home counterpart's `words` — see `nolan.ts`. ----------------

export const ACT3_NOLAN_TOPIC_SUBLEVEL_WORK = T('act3_nolan_topic_sublevel_work');
export const ACT3_NOLAN_TOPIC_BADGE_WORK = T('act3_nolan_topic_badge_work');
export const ACT3_NOLAN_TOPIC_JULES_WORK = T('act3_nolan_topic_jules_work');
export const ACT3_NOLAN_TOPIC_HEADACHES_WORK = T('act3_nolan_topic_headaches_work');
export const ACT3_NOLAN_TOPIC_NIGHTS_WORK = T('act3_nolan_topic_nights_work');

// =============================================================================
// D3, task C — the Cooling Plant, Corridor B4, the freight elevator, M7, the
// boundary (`docs/superpowers/specs/2026-09-11-stage-d3-prose.md` §10–§15).
// Re-appended twice now after this file was overwritten mid-wave by tasks A
// and B in turn (each one's own comment above notes the same collision) —
// see this task's own report. `ACT3_COOLING_PLANT`/`ACT3_CORRIDOR_B4`/
// `ACT3_INSIDE`/`ACT3_WRENCH` are declared above by tasks A/B — reused here,
// never redeclared.
// =============================================================================

// --- Objects: the Cooling Plant (§10, 7 objects) ---
export const ACT3_MANIFOLDS = O('act3_manifolds');
export const ACT3_RETURN_A = O('act3_return_a');
export const ACT3_RETURN_B = O('act3_return_b');
export const ACT3_PLANT_DRAWING = O('act3_plant_drawing');
export const ACT3_CHASE_HATCH = O('act3_chase_hatch');
export const ACT3_YARD_DOOR = O('act3_yard_door');

// --- Objects: Corridor B4 (§11, 6 objects) ---
export const ACT3_LIFE_SAFETY_PLAN = O('act3_life_safety_plan');
export const ACT3_CORRIDOR = O('act3_corridor');
export const ACT3_READER_B4 = O('act3_reader_b4');
export const ACT3_PANEL = O('act3_panel');
export const ACT3_STENCIL_1983 = O('act3_stencil_1983');

// --- The freight elevator (§13) — "a door that moves," one object in the
// spec's own words. `ObjectDefSlice.location` is a single `PlaceId`
// (`engine/world.ts`), so one object cannot actually sit in two rooms at
// once; the two instances below share every handler array (`elevator.ts`)
// so the two rooms render byte-identical text and never drift. `_B4_FAR_
// DOOR` is deliberately NOT declared as a separate object: §21.2's own
// collision ruling says "FAR DOOR in B4 must resolve to the lift," so
// `act3_elevator_door_b4`'s own noun list carries "far door" — a second,
// distinct scenery object competing for that noun would recreate the exact
// ambiguity the ruling exists to prevent. Flagged in this task's report. ---
export const ACT3_ELEVATOR_DOOR_PLANT = O('act3_elevator_door_plant');
export const ACT3_ELEVATOR_DOOR_B4 = O('act3_elevator_door_b4');
export const ACT3_ELEVATOR_PANEL_PLANT = O('act3_elevator_panel_plant');
export const ACT3_ELEVATOR_PANEL_B4 = O('act3_elevator_panel_b4');
export const ACT3_ELEVATOR_CERTIFICATE_PLANT = O('act3_elevator_certificate_plant');
export const ACT3_ELEVATOR_CERTIFICATE_B4 = O('act3_elevator_certificate_b4');
// Sub-parts of the panel (§13.4/§13.8): "PRESS L"/"PRESS S1"/"PRESS S5"/
// "PRESS BLANK" each need their own dobj to resolve to — a `HandlerDef`
// can't otherwise tell which of one object's several nouns the player named
// (same reasoning as the notebook's own back-cover/gap/margin sub-parts,
// `act2/objects/notebook.ts`). Not named in the task briefing; this task's
// own implementation choice, flagged in its report.
export const ACT3_ELEVATOR_BLANK_PLANT = O('act3_elevator_blank_plant');
export const ACT3_ELEVATOR_BLANK_B4 = O('act3_elevator_blank_b4');
export const ACT3_ELEVATOR_BUTTON_L_PLANT = O('act3_elevator_button_l_plant');
export const ACT3_ELEVATOR_BUTTON_L_B4 = O('act3_elevator_button_l_b4');
export const ACT3_ELEVATOR_BUTTON_S1_PLANT = O('act3_elevator_button_s1_plant');
export const ACT3_ELEVATOR_BUTTON_S1_B4 = O('act3_elevator_button_s1_b4');
export const ACT3_ELEVATOR_BUTTON_S5_PLANT = O('act3_elevator_button_s5_plant');
export const ACT3_ELEVATOR_BUTTON_S5_B4 = O('act3_elevator_button_s5_b4');

/** The always-closed boundary gate for the hatch's `down` exit (§15) — same "never opens, unaddressable, named `*_boundary_gate`" idiom as `TOWN_EDGE_TUNNEL_BOUNDARY_GATE` (`act1/ids.ts`). */
export const ACT3_BOUNDARY_GATE = O('act3_boundary_gate');

// --- Two uncounted sub-parts (the Cooling Plant's own room-level senses
// need a noun to resolve against) — same idiom as task B's own
// `ACT3_LOBBY_BENCH`/`ACT3_LOBBY_COFFEE`, not one of the room's "7 objects"
// per the plan's tier table. ---
export const ACT3_PLANT_FLOOR = O('act3_plant_floor');
export const ACT3_PLANT_STEP = O('act3_plant_step');

// --- Flags (§2) ---
export const ACT3_B4_PASSES = F('act3_b4_passes');
export const ACT3_B4_MEASURED = F('act3_b4_measured');
export const ACT3_READER_B4_ROTATION = F('act3_reader_b4_rotation');
export const ACT3_PANEL_OPEN = F('act3_panel_open');
export const ACT3_HATCH_OPEN = F('act3_hatch_open');
export const ACT3_ELEVATOR_CALLED = F('act3_elevator_called');
export const ACT3_PRESSED_BLANK = F('act3_pressed_blank');

// --- Clues (§2) ---
export const ACT3_CLUE_WARM_RETURN = C('act3_clue_warm_return');
/** R8. */
export const ACT3_CLUE_41_FEET = C('act3_clue_41_feet');
/** L9. */
export const ACT3_CLUE_NOV_1983 = C('act3_clue_nov_1983');

// --- Questions (§2) ---
/** P17. */
export const ACT3_Q_B4_LENGTH = Q('act3_q_b4_length');
/** P18 — opens on `act3_clue_warm_return`; answered in D4/D5. */
export const ACT3_Q_SECOND_RETURN = Q('act3_q_second_return');

// --- Puzzle ---
/** P17. */
export const ACT3_P17_B4 = P('act3_p17_b4');

// --- Memory ---
/** M7 — *The Third Time*, seeded, `{ visited: act3_corridor_b4 }`. */
export const ACT3_MEM_M7 = M('act3_mem_m7');

// --- Scripts ---
/** The lift's S1/S5 ride (§13.8): three beats, `advanceClock: 3`, then the boundary. */
export const ACT3_ELEVATOR_RIDE_SCRIPT = S('act3_elevator_ride');
/** Reader B4's rotation-parity resolution (§11.6) — `Cond` has no modulo primitive, so this is a script, not a declarative `when`. */
export const ACT3_READER_B4_SCRIPT = S('act3_reader_b4');

// --- New verbs (§11.3, §10.6/§11.7/§13.6) — see `verbs.ts` for the words/patterns and the in-place amendments to the shipped `V_MEASURE`/`V_CALL`. ---
export const V_PACE = V('act3_pace');
export const V_UNBOLT = V('act3_unbolt');

// ---------------------------------------------------------------------------
// Wave D4 shared — the descent (`docs/superpowers/specs/2026-09-12-stage-d4-
// prose.md` §2, §21.3). Written by the main session before the D4 builders
// ran so that no two of them declare the same state. Builders ADD their own
// room/object/verb ids below the anchor at the end of this file, with the
// Edit tool, never Write.
// ---------------------------------------------------------------------------

// Rooms (§21.4)
// register 90 (main session ruling, revising §18 q6): the tunnel is TWO rooms — the mouth (arrival, the hatch) and the below (the walk, rails/seal/construction door). `ACT3_SERVICE_TUNNEL` is now specifically "below."
export const ACT3_TUNNEL_MOUTH = R('act3_tunnel_mouth');
export const ACT3_SERVICE_TUNNEL = R('act3_service_tunnel');
export const ACT3_S1_MECHANICAL_GALLERY = R('act3_s1_mechanical_gallery');
export const ACT3_S5_REACTOR_INTERFACE = R('act3_s5_reactor_interface');
export const ACT3_PIPE_CHASE = R('act3_pipe_chase');

// Flags (§2, §21.3)
export const ACT3_AT_TUNNEL_MOUTH = F('act3_at_tunnel_mouth');
export const ACT3_TUNNEL_UNLOCKED = F('act3_tunnel_unlocked');
export const ACT3_TUNNEL_BELOW = F('act3_tunnel_below');
export const ACT3_HEADLAMP_ON = F('act3_headlamp_on');
export const ACT3_MATCH_BURNING = F('act3_match_burning');
/** Turns of light left in a struck match (§5.2) — a numeric flag the tunnel's per-tick event decrements; `{ flag, atLeast: 1 }` is the light. */
export const ACT3_MATCH_TURNS = F('act3_match_turns');
export const ACT3_WALKED_TUNNEL = F('act3_walked_tunnel');
export const ACT3_CONSTRUCTION_DOOR_OPEN = F('act3_construction_door_open');
export const ACT3_SAW_SEAL = F('act3_saw_seal');
export const ACT3_READ_GAUGES_NIGHT = F('act3_read_gauges_night');
export const ACT3_BASELINE_MATCHED = F('act3_baseline_matched');
export const ACT3_BYPASS_SEEN = F('act3_bypass_seen');
export const ACT3_INTERLOCK_NORMAL = F('act3_interlock_normal');
export const ACT3_DIED_REACTOR = F('act3_died_reactor');
export const ACT3_S6_PAD_TRIED = F('act3_s6_pad_tried');

// Clues (§2)
export const ACT3_CLUE_SEAL_FROM_INSIDE = C('act3_clue_seal_from_inside');
export const ACT3_CLUE_J_HAND = C('act3_clue_j_hand');
export const ACT3_CLUE_THREE_AM_DIP = C('act3_clue_three_am_dip');
export const ACT3_CLUE_BASELINE_MATCHES_AUDIT = C('act3_clue_baseline_matches_audit');
export const ACT3_CLUE_S6_DOOR_REFUSES = C('act3_clue_s6_door_refuses');
export const ACT3_CLUE_NO_LOWER = C('act3_clue_no_lower');

// Questions (§2) — P19
export const ACT3_Q_WHEN_UNWATCHED = Q('act3_q_when_unwatched');

// Puzzle (§2) — P18, the second return
export const ACT3_P18_SECOND_RETURN = P('act3_p18_second_return');

// Checkpoint and death ids (§10.3, §10.4, §21.3) — plain strings for `{ checkpoint }` / `{ die }`.
export const ACT3_CHECKPOINT_S5 = 'act3_s5';
export const ACT3_DEATH_REACTOR = 'act3_reactor';

// --- D4 task D — the Pipe Chase, the chase hatch's DOWN, and the boundary
// (D4 prose doc §11-§13, §21). `ACT3_PIPE_CHASE`/`ACT3_HATCH_OPEN`/
// `ACT3_Q_WHEN_UNWATCHED`/`ACT3_P18_SECOND_RETURN`/`ACT3_BOUNDARY_GATE` are
// declared above (wave-D4-shared) or in this file's D3-C section
// (`ACT3_HATCH_OPEN`, `ACT3_BOUNDARY_GATE`) — reused, never redeclared. ---

// --- Objects: the Pipe Chase's three (§11.2-§11.4) ---
export const ACT3_CRAWL = O('act3_crawl');
export const ACT3_RETURN_B_LOWER = O('act3_return_b_lower');
export const ACT3_CONDENSATION = O('act3_condensation');

/**
 * "S5"/"SIDEWAYS" (§21.4's own three-way exit name: "s5 / sideways / out")
 * reaching the chase's own opening back to S5. Not a canonical `Direction`
 * (`engine/ids.ts`'s `Direction` union has no such member, and the shared
 * `out` verb's own word list belongs to every room in the game, not just
 * this one) — so this is a new bare-phrase verb, wired as a room-level
 * handler in `pipeChase.ts` mirroring the real `out` exit's own effects.
 * Same idiom as `V_ACT3_LOOK_WEST` above. Builder addition (not in the
 * pre-approved id list); flagged in this task's report.
 */
export const V_ACT3_SIDEWAYS = V('act3_sideways');

/**
 * Builder addition, flagged in this task's report: a dedicated "has this
 * room's own first-sight text already rendered" flag, set `true` by the
 * room's own `onEnter` (`pipeChase.ts`). NOT gated on `{ not: { visited:
 * act3_pipe_chase } }` the way every other D3 room's own "first sight"
 * `ProseRule` is (`lobby.ts`, `dataHallA.ts`, `perimeterRoad.ts`,
 * `corridorB4.ts`, `coolingPlant.ts`) — `move.ts`'s own `renderArrival`
 * marks `state.visited[roomId]` BEFORE it renders `description` (not
 * after), so a `{ not: { visited: OWN_ROOM } }` cond inside that same
 * room's own `description` can never observe "not yet visited": by the
 * time `description` evaluates, the room is already marked visited. That
 * makes the "Rule 1 — first sight" branch in all five of those rooms
 * unreachable on a genuine arrival (confirmed empirically, this task's own
 * report) — a `RoomDefSlice.onEnter` effect runs strictly after
 * `description` renders (`renderArrival`'s own doc comment: "... then
 * onEnter"), so gating on a flag this room's own `onEnter` sets, instead of
 * `visited`, actually works: the flag reads `false` for the render that
 * matters (the first one) and `true` for every one after.
 */
export const ACT3_PIPE_CHASE_SEEN = F('act3_pipe_chase_seen');

// ---------------------------------------------------------------------------
// D4 task B — S1 Mechanical Gallery and the lift's real S1/S5 stops
// (`docs/superpowers/specs/2026-09-12-stage-d4-prose.md` §7.3, §8, §12).
// Rooms/flags/clues/questions/puzzle already declared above (shared block)
// are reused, not redeclared.
// ---------------------------------------------------------------------------

// §7.3: the construction door is "one object, two rooms" (the D3 §10.8/
// elevator idiom — two `ObjectDefSlice`s, one per room, not one object
// magically in two places). The tunnel-side instance and its `OPEN DOOR`
// that sets `ACT3_CONSTRUCTION_DOOR_OPEN` (§7.1 rule 1, §7.2, §7.4) are
// task A's own (`objects/serviceTunnel.ts`), which had not landed as of
// this edit — this is this task's own id for the S1-side instance only
// (§7.1 rules 2/3's examine text is task A's to add to this same object,
// by appending to its `handlers`, once their file exists; only the §7.3
// `OPEN DOOR` "before" rule below is this task's own). Flagged in this
// task's report.
export const ACT3_CONSTRUCTION_DOOR_S1 = O('act3_construction_door_s1');
/**
 * Mechanism-only, never named/examinable (no `nouns`) — same idiom as
 * `ACT3_GATE_DOOR`/`TOWN_EDGE_TUNNEL_BOUNDARY_GATE`: the `south` exit's own
 * `door` reference, so a still-shut door renders §7.3's specific refusal
 * (`ExitDefSlice.blockedText`) rather than the generic "no exit that way"
 * (`when` would only give the generic family — `move.ts`'s own
 * `exitCurrentlyExists`/`exitIsOpen` split). Synced to
 * `ACT3_CONSTRUCTION_DOOR_OPEN` on every entry to S1 (`s1MechanicalGallery.
 * ts`'s own `onEnter`) rather than depending on task A's own tunnel-side
 * effects setting a second object's state — the player can only ever be
 * standing in S1 *after* leaving it and re-entering once the door (which
 * only opens from the tunnel side) is open, so an entry-time sync can never
 * miss a state change. Builder addition, flagged in this task's report.
 */
export const ACT3_CONSTRUCTION_DOOR_GATE = O('act3_construction_door_gate');

// --- S1's six objects (§8) ---
export const ACT3_PUMPS = O('act3_pumps');
export const ACT3_TOOL_CRIB = O('act3_tool_crib');
export const ACT3_TAPE_RACK = O('act3_tape_rack');
export const ACT3_STAIRS_DOWN = O('act3_stairs_down');
// (the construction door and the lift door, S1's other two of six, are
// `ACT3_CONSTRUCTION_DOOR_S1` above and the elevator's `_GALLERY` instance
// below.)

// --- Uncounted sub-parts of the crib (§8.3) and the rack (§8.5's card) ---
export const ACT3_CRIB_CUP = O('act3_crib_cup');
export const ACT3_CRIB_BOARD = O('act3_crib_board');
export const ACT3_CHECKOUT_CARD = O('act3_checkout_card');
/** Uncounted — the room's own `TOUCH FLOOR`/`LOOK AT FLOOR` (§8.8) needs a noun to resolve against, same idiom as `ACT3_PLANT_FLOOR`/`ACT3_PLANT_STEP`. */
export const ACT3_S1_FLOOR = O('act3_s1_floor');

// --- §12.1: the lift gains two more physical instances (same "one object,
// several rooms, shared handler-building function" idiom `elevator.ts`
// already uses for the Cooling Plant/Corridor B4 pair) — one landing in
// S1 (this task's own room) and one in S5 (task C's room; placed here by
// id only, per this task's brief — task C builds `act3_s5_reactor_
// interface`'s own six-ish objects, not this one). ---
export const ACT3_ELEVATOR_DOOR_GALLERY = O('act3_elevator_door_gallery');
export const ACT3_ELEVATOR_PANEL_GALLERY = O('act3_elevator_panel_gallery');
export const ACT3_ELEVATOR_BLANK_GALLERY = O('act3_elevator_blank_gallery');
export const ACT3_ELEVATOR_BUTTON_L_GALLERY = O('act3_elevator_button_l_gallery');
export const ACT3_ELEVATOR_BUTTON_S1_GALLERY = O('act3_elevator_button_s1_gallery');
export const ACT3_ELEVATOR_BUTTON_S5_GALLERY = O('act3_elevator_button_s5_gallery');
export const ACT3_ELEVATOR_CERTIFICATE_GALLERY = O('act3_elevator_certificate_gallery');
export const ACT3_ELEVATOR_DOOR_REACTOR = O('act3_elevator_door_reactor');
export const ACT3_ELEVATOR_PANEL_REACTOR = O('act3_elevator_panel_reactor');
export const ACT3_ELEVATOR_BLANK_REACTOR = O('act3_elevator_blank_reactor');
export const ACT3_ELEVATOR_BUTTON_L_REACTOR = O('act3_elevator_button_l_reactor');
export const ACT3_ELEVATOR_BUTTON_S1_REACTOR = O('act3_elevator_button_s1_reactor');
export const ACT3_ELEVATOR_BUTTON_S5_REACTOR = O('act3_elevator_button_s5_reactor');
export const ACT3_ELEVATOR_CERTIFICATE_REACTOR = O('act3_elevator_certificate_reactor');

// ---------------------------------------------------------------------------
// D4 task C — S5 Reactor Interface, the interlock death, and the checkpoint
// (D4 prose doc §9, §10, §17, §21, §22). `ACT3_S5_REACTOR_INTERFACE`/
// `ACT3_PIPE_CHASE`/`ACT3_S1_MECHANICAL_GALLERY`/every flag, clue-id,
// question, and the checkpoint/death string ids are declared above
// (wave-D4-shared) or by task B/D above — reused, never redeclared. This
// task's own objects/flags/verbs/scripts only.
// ---------------------------------------------------------------------------

// --- Objects (§9.2, §9.5, §9.6, §9.7, §9.9, §9.10, §10) ---
export const ACT3_GAUGES = O('act3_gauges');
export const ACT3_DEMAND_DIAL = O('act3_demand_dial');
export const ACT3_INTERLOCK = O('act3_interlock');
/** Sub-part — `EXAMINE TAG` (§10.1) needs its own noun-bearing object, same idiom as `ACT3_LOBBY_BENCH`/the elevator's per-room button instances (a single `ObjectDefSlice` can't tell which of its own several nouns resolved an `EXAMINE`). */
export const ACT3_INTERLOCK_TAG = O('act3_interlock_tag');
/** Sub-part — `EXAMINE LAMP` (§10.1). Nouns deliberately exclude bare "lamp" (§21.2: held `act3_headlamp` wins that word; this takes `red lamp`/`lens`/`indicator` only). */
export const ACT3_INTERLOCK_LAMP = O('act3_interlock_lamp');
/** Sub-part — `EXAMINE KEYSWITCH`/`EXAMINE KEY`, `TURN KEYSWITCH`, `TAKE KEY` (§10.1). Nouns are `keyswitch`/`switch`/`key` — never `keyring` — so `TURN KEYSWITCH` always resolves here without a clarify even though bare `key` is genuinely ambiguous against the held `act1_keyring` (§21.2's own recommendation). */
export const ACT3_INTERLOCK_KEYSWITCH = O('act3_interlock_keyswitch');
/** Sub-part — the panel's green/red buttons (§10.1's own dedicated "press green/red button" text, distinct from `OPEN`/`TURN`/`PULL` on the door itself). */
export const ACT3_INTERLOCK_BUTTONS = O('act3_interlock_buttons');
export const ACT3_CHASE_BOTTOM = O('act3_chase_bottom');
export const ACT3_S6_DOOR = O('act3_s6_door');
export const ACT3_WALL_CLOCK = O('act3_wall_clock');
/** Uncounted sub-part (§9.10's own `SEARCH BENCH`/`LOOK UNDER BENCH` needs a noun, same idiom as `ACT3_PLANT_FLOOR`/`ACT3_PLANT_STEP`) — also carries the logbook's own discovery text. */
export const ACT3_S5_BENCH = O('act3_s5_bench');
/** Uncounted sub-part — the logbook found under the bench (§9.10); not one of the room's own six, same reasoning as `ACT3_S5_BENCH`. */
export const ACT3_LOGBOOK = O('act3_logbook');
/** Uncounted sub-part — `TOUCH WALL`/`TOUCH LEFT WALL` (§9.10) needs a noun to resolve against; the gauge wall/interlock/S6 door are the room's real six objects, not this. */
export const ACT3_S5_TOUCH_WALL = O('act3_s5_touch_wall');

// --- Flags — builder additions beyond §2's own table, flagged in this
// task's report. ---
/** Gates the description's own "first sight" rule (§9.1 rule 1) — set by `onEnter`, checked (not `{ not: { visited } }`) because `move.ts`'s `renderArrival` marks `visited` BEFORE rendering `description`, the same reason `act3_pipe_chase_seen` exists (`pipeChase.ts`'s own header). */
export const ACT3_S5_SEEN = F('act3_s5_seen');
/** Set by the demand dial's SECOND `TURN`/`OPEN COVER`/`SET DEMAND` (§9.5) — gates the first-attempt vs. second-attempt text; not in §2's own table because the dial's own state (not a puzzle/clue) needs nothing else to read it. */
export const ACT3_DEMAND_DIAL_TURNED = F('act3_demand_dial_turned');

// --- Verbs (§9.5, §9.8, §9.9, §10.1) ---
/** "TURN KEYSWITCH TO NORMAL"/"TURN KEY TO NORMAL"/"TURN SWITCH TO NORMAL" (§10.1) — bare fixed phrase, same idiom as `V_ACT3_RIDE_TO_PLANT`: "normal" is a state word, not a noun any object carries, so `'V dobj prep iobj'` could never resolve an `iobj` for it. Bare `TURN KEYSWITCH`/`TURN KEY`/`TAKE KEY` (no "to normal") reach the same result through the ordinary `TURN`/`TAKE` verbs on `ACT3_INTERLOCK_KEYSWITCH` instead — this verb only exists for the longer phrasing. */
export const V_ACT3_TURN_TO_NORMAL = V('act3_turn_to_normal');
/** "TYPE CREDENTIALS"/"ENTER CREDENTIALS"/"TYPE ADMIN"/"TYPE PASSWORD" (§9.8) — bare fixed phrases, room-level (S5 only). Deliberately NOT bare "type"/"enter": both words are already exclusively claimed (`V_TYPE_TERMINAL`, `act1/ids.ts`; `DIRECTION_VERB_IDS.in`, `engine/move.ts`) — a second verb claiming either alone is a `verb-word-collision` error. These four multi-word phrases are distinct strings from both, so no collision. "USE NOTEBOOK ON PAD" reaches the same result through `USE_VERB_ID` (mutated in place, `objects/s5ReactorInterface.ts`'s own header) rather than this verb. */
export const V_ACT3_TYPE_PAD = V('act3_type_pad');
/** "BADGE DOOR" (§9.8) — a new one-word verb; "badge" is not claimed anywhere else (grepped clean). "USE BADGE"/"SHOW BADGE TO READER" reach the S6 door through the already-shipped `USE_VERB_ID`/`SHOW`, mutated onto the badge object in place (same idiom `corridorB4.ts` already uses for reader B4). */
export const V_ACT3_BADGE = V('act3_badge');
/** "WHAT TIME IS IT"/"WHAT'S THE TIME"/"CHECK TIME" (§9.9) — bare fixed phrases, room-level. "CHECK" alone is already exclusively `V_ACT2_CHECK`'s (`act2/ids.ts`, pattern `'V'` only) — these three multi-word phrases are distinct strings, no collision. `READ CLOCK` reaches the same result through the already-shipped `READ` verb on `ACT3_WALL_CLOCK`. */
export const V_ACT3_CHECK_TIME = V('act3_check_time');
/** "LOOK DOWN OPENING"/"LOOK DOWN SHAFT" (§9.6) — bare fixed phrases, same idiom as `V_LOOK_DOWN_AISLE` (`act3/ids.ts`, D3 task B): no bare "look down" verb exists to hang a dobj off, so this is its own literal phrase pair. */
export const V_ACT3_LOOK_DOWN_SHAFT = V('act3_look_down_shaft');

// --- Scripts (§10.3, §9.9) ---
/** The interlock death: three `kind: 'beat'` events (§10.2's own Beat 1/2/3 headings), then the death paragraph, `{ die }`, `{ set: [act3_died_reactor, true] }` — the prologue's own idiom (`content/scenes/mvp-prologue.ts`). Wired into `world.scripts` under this exact id per the doc's own "Wires into" header. */
export const ACT3_INTERLOCK_DEATH_SCRIPT = S('act3_interlock_death');
/** `READ CLOCK`/`WHAT TIME IS IT`/etc. (§9.9) — computes `clockInWords(state.clock.minute)` (a live value no static `Prose` can hold) and renders the frame, the rotating second line, and (once, in the window) the added final line. */
export const ACT3_READ_CLOCK_SCRIPT = S('act3_read_clock');

// --- D4 task A — the way under: the county-road walk, the hatch, light (the
// headlamp and the two-turn match), the Service Tunnel, the construction
// door's tunnel-side instance, and Town Edge's country exit (D4 prose doc
// §3-§7, §12.4, §17, §21, §22). `ACT3_SERVICE_TUNNEL`/every D4-shared flag/
// clue/question above are reused, never redeclared. `ACT3_CONSTRUCTION_
// DOOR_S1`/`ACT3_CONSTRUCTION_DOOR_GATE` (task B, above) are that task's own
// S1-side door instance — this task's tunnel-side instance is a separate id
// below (the elevator-door "one object, two rooms, two ids" idiom); see this
// task's report for the S1-side EXAMINE text (§7.1 rules 2/3) it could not
// safely wire into task B's own file. ---

// Objects (§4, §6.4, §6.5, §7): the hatch, the rails, the seal, the
// tunnel-side construction door instance, and the ladder (an uncounted
// sub-part — the mouth's descent needs a noun distinct from the hatch once
// the hatch is lying open in the grass, §6.1 rule 2/§6.6's "rectangle of
// night with the ladder in it").
export const ACT3_TUNNEL_HATCH = O('act3_tunnel_hatch');
export const ACT3_RAILS = O('act3_rails');
export const ACT3_TUNNEL_SEAL = O('act3_tunnel_seal');
export const ACT3_CONSTRUCTION_DOOR_TUNNEL = O('act3_construction_door_tunnel');
export const ACT3_LADDER = O('act3_ladder');
/** Uncounted sub-parts — `EXAMINE PLATE`/`READ PLATE` and `EXAMINE HINGES` (§7.4) need their own noun-bearing objects, same idiom as `ACT3_LOBBY_BENCH`/the elevator's per-room buttons. */
export const ACT3_DOOR_PLATE = O('act3_door_plate');
export const ACT3_DOOR_HINGES = O('act3_door_hinges');

// The headlamp (§5.1) — lives in the truck's toolbox (`objects/truck.ts`),
// declared here alongside this task's other D4 ids.
export const ACT3_HEADLAMP = O('act3_headlamp');
/** Builder addition — gates §5.1's "first time" `TAKE LAMP` line so it prints once, not on every subsequent take/drop. */
export const ACT3_HEADLAMP_TAKEN = F('act3_headlamp_taken');

// The two-turn match (§5.2) — a real, always-declared object (`location:
// 'nowhere'` until struck, then `inventory`), not something the engine can
// spawn ad hoc; `lightSource: true`, `on` while `act3_match_burning`.
export const ACT3_LIT_MATCH = O('act3_lit_match');

/**
 * Mechanism-only gate (no `nouns`, same idiom as `ACT3_BOUNDARY_GATE`/
 * `TOWN_EDGE_TUNNEL_BOUNDARY_GATE`) for Town Edge's `nw` exit — closed
 * exactly when neither `act1_keyring` nor `act1_chair_leg` is held and the
 * hatch isn't already unlocked (§3.4), open otherwise. Kept in sync every
 * tick by a reactive `EventDef` pair (`index.ts`'s `events:` map) rather
 * than a discrete `set` effect, because nothing that could flip the
 * underlying condition (dropping/taking the keyring or chair leg) is a
 * dedicated action this content can hook — see this task's report on
 * `ExitDefSlice` carrying no `effects` field, the engine constraint this
 * gate works around.
 */
export const ACT3_TUNNEL_APPROACH_GATE = O('act3_tunnel_approach_gate');

/**
 * "LIGHT MATCH"/"LIGHT MATCHBOOK" (§5.2). "STRIKE MATCH," also named in the
 * doc, is dropped: `strike` is already `BREAK`'s own word (`act1/verbs.ts`,
 * `words: [..., 'hit', 'strike']`) and `validate.ts` rejects a second verb
 * claiming it outright (`verb-word-collision`) — flagged in this task's
 * report as a register/vocabulary gap.
 */
export const V_ACT3_LIGHT = V('act3_light');

/**
 * Mechanism-only gate (no `nouns`) for the mouth's own `down`/`in` exit
 * (register 90's two-room split, §6.2/§6.3) — closed while `act3_tunnel_
 * unlocked` is false OR there is no light (`act3_headlamp_on`/`act3_match_
 * burning` both false), open otherwise. Declared `container: { open: false
 * }` (the common case before the player has unlocked *and* lit anything),
 * kept in sync every tick by its own reactive `EventDef`, same idiom as
 * `ACT3_TUNNEL_APPROACH_GATE` above.
 */
export const ACT3_TUNNEL_DESCENT_GATE = O('act3_tunnel_descent_gate');

// --- Event ids (plain strings, `world.events`'s own keying — same idiom as `EVENT_ACT3_LOBBY_READER_OPENS` above). ---
export const EVENT_ACT3_TUNNEL_APPROACH_GATE_SYNC = 'act3_ev_tunnel_approach_gate_sync';
export const EVENT_ACT3_MATCH_TICK = 'act3_ev_match_tick';
export const EVENT_ACT3_TUNNEL_DESCENT_GATE_SYNC = 'act3_ev_tunnel_descent_gate_sync';

// --- D4 builders append below this line (Edit tool only; one block per task, labelled) ---

// ---------------------------------------------------------------------------
// Wave D5 shared — Sublevel 6 (`docs/superpowers/specs/2026-09-13-stage-d5-
// prose.md` §2, §39.3). Written by the main session before the D5 builders
// ran. Builders ADD their own object/verb/event/script ids below the anchor
// at the end of this file, with the Edit tool, never Write.
// ---------------------------------------------------------------------------

// Rooms (§39.4)
export const ACT3_S6_MAINTENANCE_BAY = R('act3_s6_maintenance_bay');
export const ACT3_S6_ARCHIVE_HUB = R('act3_s6_archive_hub');

// Flags (§2)
export const ACT3_REACHED_S6 = F('act3_reached_s6');
export const ACT3_WEARING_COVERALLS = F('act3_wearing_coveralls');
export const ACT3_UV_LAMP_ON = F('act3_uv_lamp_on');
export const ACT3_UV_SEEN_ARM = F('act3_uv_seen_arm');
export const ACT3_HUB_LOGGED_IN = F('act3_hub_logged_in');
export const ACT3_KNOWS_WHO_HIT_YOU = F('act3_knows_who_hit_you');
export const ACT3_ALARM_PULLED = F('act3_alarm_pulled');
export const ACT3_TOOK_NOLAN_BADGE = F('act3_took_nolan_badge');
export const ACT3_UNBUCKLED_STRAP = F('act3_unbuckled_strap');
export const ACT3_DAD_HEARD_HIM = F('act3_dad_heard_him');

// Clues (§2)
export const ACT3_CLUE_CHAIRS = C('act3_clue_chairs');
export const ACT3_CLUE_NOLAN_CHAIR = C('act3_clue_nolan_chair');
export const ACT3_CLUE_PEELED_HOOK = C('act3_clue_peeled_hook');
export const ACT3_CLUE_ROUNDS = C('act3_clue_rounds');
export const ACT3_CLUE_UV_GHOST = C('act3_clue_uv_ghost');
export const ACT3_CLUE_JULES_DEPRECATED = C('act3_clue_jules_deprecated');
export const ACT3_CLUE_TOWN_RUNS_HERE = C('act3_clue_town_runs_here');
export const ACT3_CLUE_REACQUIRE = C('act3_clue_reacquire');
export const ACT3_CLUE_GATES = C('act3_clue_gates');
export const ACT3_CLUE_ROOT_REFUSES = C('act3_clue_root_refuses');

// Questions (§2). The doc assumed `act2_q_what_happened_to_jules`,
// `act1_q_who_hit_me` and `act3_q_archive_terminal` already existed; none
// did, so the main session declares them here (their texts are the main
// session's, flagged for Ryan in the D5 status line).
export const ACT3_Q_WHAT_HAPPENED_TO_JULES = Q('act3_q_what_happened_to_jules');
export const ACT3_Q_WHO_HIT_YOU = Q('act3_q_who_hit_you');
export const ACT3_Q_ARCHIVE_TERMINAL = Q('act3_q_archive_terminal');
export const ACT3_Q_WHAT_ARE_THESE_PEOPLE = Q('act3_q_what_are_these_people');

// Puzzles (§2)
export const ACT3_P19_NIGHT_SCHEDULE = P('act3_p19_night_schedule');
export const ACT3_P20_LEDGER = P('act3_p20_ledger');

// Memories (§2)
export const ACT3_MEM_M9 = M('act3_mem_m9');
export const ACT3_MEM_M16_A = M('act3_mem_m16_a');
export const ACT3_MEM_M16_S = M('act3_mem_m16_s');
export const ACT3_MEM_M16_D = M('act3_mem_m16_d');

// Checkpoint (§39.3) and the Hub login prompt script (§22.2)
export const ACT3_CHECKPOINT_S6 = 'act3_s6';
export const ACT3_HUB_LOGIN_SCRIPT = S('act3_hub_login');

// --- D5 task H ---
// The Custodian's rounds, the four spotted events, the chiller alarm, and
// Dad on the rig (D5 prose doc §18-§20, §39, §40; Stage D plan §2 D5's
// rounds table). `act3/events.ts` (new) holds the EventDefs; the alarm
// object lives in `act3/objects/coolingPlant.ts`; the schedule itself is
// `act2/custodian.ts`'s own edit (no id declared here for it — a
// `ScheduleRule` carries no id).

// `world.events` keys — bare strings, same idiom as `EVENT_ACT3_LOBBY_READER_OPENS` above.
export const EVENT_ACT3_EV_SPOTTED_BAY = 'act3_ev_spotted_bay';
export const EVENT_ACT3_EV_SPOTTED_HUB = 'act3_ev_spotted_hub';
export const EVENT_ACT3_EV_SPOTTED_S5 = 'act3_ev_spotted_s5';
export const EVENT_ACT3_EV_SPOTTED_CHASE = 'act3_ev_spotted_chase';
/** §18.6 — proposed, wired per the status line ("recommend wiring it," §36 q5). */
export const EVENT_ACT3_EV_PASSED = 'act3_ev_passed';
/** §19.1 — the S5 push, `once: true`. */
export const EVENT_ACT3_DAD_PUSH_S5 = 'act3_ev_dad_push_s5';
/** §20.3 — the automatic reset, `once: false`. */
export const EVENT_ACT3_ALARM_RESET = 'act3_ev_alarm_reset';

/** §20 — the alarm box, addressable without being listed (`objects/coolingPlant.ts`'s `ACT3_COOLING_PLANT_EXTRA_OBJECTS`), like D3's certificate. */
export const ACT3_CHILLER_ALARM = O('act3_chiller_alarm');

/**
 * §20's own timer state — not in the prose doc (which leaves the reset
 * mechanism to "builder's call, documented in the wiring notes," Stage D
 * plan §2 D5). Numeric: the absolute minute (`clock.day * 1440 +
 * clock.minute`) 30 minutes past the pull, set by `act3AlarmPull`
 * (`events.ts`) and read by `act3AlarmReset` (same file) — see that
 * file's own header for why a `{ script }` effect is needed at all (the
 * `Cond` DSL has no flag-vs-flag arithmetic).
 */
export const ACT3_ALARM_RESET_DUE = F('act3_alarm_reset_due');

// Verbs (§20.2/§20.5). "PULL ALARM"/"BREAK GLASS" reach the alarm box via
// the already-shipped `PULL`/`BREAK` verbs (`act1/verbs.ts`) plus this
// object's own nouns — no new verb needed for either. "HIT GLASS WITH
// HAMMER" reaches it via `BREAK`'s own already-claimed word "hit" plus a
// `'V dobj prep iobj'` pattern added to `BREAK` in `objects/coolingPlant.ts`
// (the same idempotent in-place-mutation idiom `verbs.ts` already uses for
// `OPEN`/`MEASURE`/`CALL`/`USE`), so only "TRIP CHILLER" and "RESET
// ALARM"/"PUSH HANDLE UP" need new verbs.
export const V_ACT3_TRIP_CHILLER = V('act3_trip_chiller');
export const V_ACT3_RESET_ALARM = V('act3_reset_alarm');

// Scripts (`objects/coolingPlant.ts`'s alarm handler; `events.ts`'s reset
// `EventDef`) — see `events.ts`'s own header.
export const ACT3_ALARM_PULL_SCRIPT = S('act3_alarm_pull');
export const ACT3_ALARM_RESET_SCRIPT = S('act3_alarm_reset');

// ---------------------------------------------------------------------------
// --- Addenda ---
// Stage D addenda (`docs/superpowers/specs/2026-09-14-stage-d-addenda-
// prose.md` §4.1, §9 item 1) — "THROW <thing> DOWN/INTO/IN/AT," a new global
// verb. Proposed by the doc's own §9, not assumed; wired against the chase
// bottom (`act3/s5ReactorInterface.ts`'s room-level handler).
// ---------------------------------------------------------------------------
export const V_THROW = V('act3_throw');

// ---------------------------------------------------------------------------
// --- D5 task F ---
// The S6 Maintenance Bay — the room's own 12 objects, one new verb, and one
// new script (`docs/superpowers/specs/2026-09-13-stage-d5-prose.md` §3-§17,
// §39, §40). The room id, every flag/clue/question/puzzle/memory id, and
// the checkpoint string are all declared above (wave D5 shared) — this
// block adds only what that shared section left to this task: the Bay's
// objects, `V_ACT3_SEARCH_RAIL_FOR_JULES` (§5.4's two non-READ phrasings —
// "READ NAMES" reaches the hooks through the already-shipped READ verb,
// needing no new word), and `ACT3_READ_BAY_CLOCK_SCRIPT` (§9.2 — its own
// frame/rotation text, never `act3ReadClock`'s S5 lines; `clockInWords`
// itself is reused unchanged from `./time`).
// ---------------------------------------------------------------------------

// Objects (§4-§16). `ACT3_CHAIR_PEDESTAL` is an uncounted sub-part (same
// idiom as `ACT3_LOBBY_BENCH`) so `EXAMINE PEDESTAL` (§4.6) can carry its
// own distinct text without colliding with the chairs' own `EXAMINE` (§4.1)
// on the same object — the engine has no way to tell which of an object's
// several nouns resolved a given verb, so two genuinely different
// `EXAMINE` answers for the same verb need two objects.
// Mechanical flag (not in §2's own table, same "builder adds a small
// implementation-detail flag" idiom as `ACT3_PIPE_CHASE_SEEN`/
// `ACT3_S5_SEEN`): gates §4.2's first/second-and-later `SIT` split.
export const ACT3_CHAIR_SAT_TRIED = F('act3_chair_sat_tried');

export const ACT3_CHAIRS = O('act3_chairs');
export const ACT3_CHAIR_PEDESTAL = O('act3_chair_pedestal');
export const ACT3_BADGE_HOOKS = O('act3_badge_hooks');
// Uncounted sub-parts of the rail (same reasoning as `ACT3_CHAIR_PEDESTAL`,
// above): "NOLAN HOOK"/"NOLAN'S HOOK" and "PEELED HOOK"/"EMPTY HOOK" both
// need `EXAMINE` text distinct from the bare rail's own (§5.2, §5.3), and
// bare `hook`/`hooks` must still resolve to the rail — the compound-noun
// mechanism (v0.14.0) does exactly this: neither sub-part declares a bare
// "hook" of its own, only the two-word compounds, so a full adjective
// match on one of them outranks the rail's own bare claim (§39.2).
export const ACT3_NOLAN_HOOK = O('act3_nolan_hook');
export const ACT3_PEELED_HOOK = O('act3_peeled_hook');
export const ACT3_NOLAN_CHAIR = O('act3_nolan_chair');
export const ACT3_STRAPS = O('act3_straps');
export const ACT3_UV_LAMP = O('act3_uv_lamp');
export const ACT3_BAY_CLOCK = O('act3_bay_clock');
export const ACT3_DISPENSER = O('act3_dispenser');
export const ACT3_DRAIN = O('act3_drain');
export const ACT3_COVERALLS = O('act3_coveralls');
export const ACT3_HUB_DOOR = O('act3_hub_door');
export const ACT3_CHASE_MOUTH = O('act3_chase_mouth');
export const ACT3_SLEEPERS = O('act3_sleepers');
/** Uncounted sub-part (§16.5) — needs a real noun-bearing object since `EXAMINE`'s `'V dobj'` pattern requires a dobj to resolve at all. */
export const ACT3_FAR_WALL = O('act3_far_wall');

// §5.4 — "SEARCH HOOKS FOR JULES"/"LOOK FOR JULES ON THE RAIL." Bare fixed
// phrases (same idiom as `V_ACT3_CHECK_TIME`): `SEARCH` ships `'V dobj'`
// only, so "search hooks for jules" would resolve as one dobj phrase
// ("hooks for jules") and fail to match any noun at all — a new word,
// grepped clean.
export const V_ACT3_SEARCH_RAIL_FOR_JULES = V('act3_search_rail_for_jules');

// §6.4, §8.3-§8.5 — every "X UNDER LAMP"/"SHINE LAMP ON Y" phrasing is its
// own bare fixed-phrase verb rather than a dobj resolution: `EXAMINE`/`PUT`
// carry no `preps`, so e.g. "examine arm under lamp" would resolve as one
// `'V dobj'` phrase whose TAIL word is "lamp" — the object that bare-claims
// "lamp" (§39.2), never the player's own forearm (`self.ts`'s
// `SELF_FOREARM`, out of this task's module, and not one of these phrases'
// intended target anyway for the notebook/badge variants). Four verbs, one
// per distinct response (§6.4, §8.3, §8.4, §8.5) — a handler only ever
// knows which VERB matched, not which of a verb's several `words` did, so
// phrasings needing different text can never share one verb id.
export const V_ACT3_NOLAN_UNDER_LAMP = V('act3_nolan_under_lamp');
export const V_ACT3_ARM_UNDER_LAMP = V('act3_arm_under_lamp');
export const V_ACT3_NOTEBOOK_UNDER_LAMP = V('act3_notebook_under_lamp');
export const V_ACT3_BADGE_UNDER_LAMP = V('act3_badge_under_lamp');

// §6.6 — "PUT BADGE BACK"/"HANG BADGE ON HOOK." Bare fixed phrase, new word.
export const V_ACT3_HANG_BADGE = V('act3_hang_badge');

// §7.3 — "UNDO STRAP"/"UNBUCKLE STRAP." New `'V dobj'` verb (grepped
// clean); "TEST STRAP" (§7.4) reaches `PULL`'s own handler through a new
// synonym word added to `PULL` in place (`verbs.ts`, same idiom as
// `V_MEASURE`/`V_CALL`) rather than a second verb claiming "test."
export const V_ACT3_UNDO = V('act3_undo');

// §9.2 — the Bay's own wall clock script (`act3/scripts.ts`).
export const ACT3_READ_BAY_CLOCK_SCRIPT = S('act3_read_bay_clock');

// --- D5 task G ---
// The Archive Hub, its terminal/ledger/graph/queue/gate-frames/root-door,
// the login prompt, and the Act III boundary (D5 prose doc §21-§31, §39,
// §40). Room id, flags, clues, questions, puzzle id and memory ids for
// this task were already declared above by the main session; this task
// adds its own objects, verbs, and script/prompt ids.

// Objects (§21) — the Hub's six addressable objects, plus one sub-part
// (the terminal's own screen/burn detail, §22.6 — same "two genuinely
// different EXAMINE answers need two objects" idiom `ACT3_CHAIR_PEDESTAL`
// documents above, since the engine can't tell which of an object's own
// nouns resolved a given verb).
export const ACT3_HUB_TERMINAL = O('act3_hub_terminal');
export const ACT3_HUB_TERMINAL_SCREEN = O('act3_hub_terminal_screen');
export const ACT3_LEDGER = O('act3_ledger');
export const ACT3_LOAD_GRAPH = O('act3_load_graph');
export const ACT3_QUEUE = O('act3_queue');
export const ACT3_GATE_FRAMES = O('act3_gate_frames');
export const ACT3_ROOT_DOOR = O('act3_root_door');

// §31 — the boundary's one gate object (§36 q10's own ruling: one gate
// object, two entry points). Id MUST match `/boundary_gate/i`
// (`tests/world-game.test.ts` counts exits whose `door` matches it).
export const ACT3_S6_BOUNDARY_GATE = O('act3_s6_boundary_gate');

// §22.2 — the login prompt. `ACT3_HUB_LOGIN_SCRIPT` (the respond script,
// registered in `PROMPT_SCRIPTS`) is already declared above by the main
// session; this task adds the open script and both prompt ids. Deliberately
// NOT the opening room's own script/prompt id (§22.2's own instruction).
export const ACT3_HUB_LOGIN_OPEN_SCRIPT = S('act3_hub_login_open');
export const ACT3_HUB_LOGIN_PROMPT_ID = 'act3_hub_login_prompt';

// §23, §39.2's "search" row — the ledger's own bare `SEARCH LEDGER`/`SEARCH`
// prompt (this task's own mechanism; not named by the plan). One field,
// routed the same way the fixed name-phrases below are.
export const ACT3_LEDGER_SEARCH_OPEN_SCRIPT = S('act3_ledger_search_open');
export const ACT3_LEDGER_SEARCH_RESPOND_SCRIPT = S('act3_ledger_search_respond');
export const ACT3_LEDGER_SEARCH_PROMPT_ID = 'act3_ledger_search_prompt';

// §23.2-§23.5 — the grammar has no free-text `iobj` (§39's own note), so
// each outcome group the doc names is its own bare `'V'` fixed-phrase verb,
// same idiom as `V_ACT3_SEARCH_RAIL_FOR_JULES` above.
export const V_ACT3_LEDGER_JULES = V('act3_ledger_jules');
export const V_ACT3_LEDGER_NOLAN = V('act3_ledger_nolan');
export const V_ACT3_LEDGER_SELF = V('act3_ledger_self');
export const V_ACT3_LEDGER_OTHER = V('act3_ledger_other');
// §23.6 — "PRINT LEDGER"/"COPY LEDGER"/"WRITE DOWN LEDGER." No PRINT/COPY
// verb exists yet (grepped clean) and "write down" is a distinct phrase
// from `V_WRITE`'s own bare word (act2/ids.ts) — bare fixed phrase, same
// idiom.
export const V_ACT3_LEDGER_PRINT = V('act3_ledger_print');

// §24.2 — "CHANGE SCALE"/"LOOK AT AXIS" name no addressable noun of their
// own; bare fixed phrase (`SEARCH GRAPH` itself reaches the same text
// through the graph's own `SEARCH` handler, no new verb needed for that
// phrasing).
export const V_ACT3_GRAPH_AXIS = V('act3_graph_axis');

// §25.3/§25.4 — "DELETE QUEUE"/"CANCEL JOB"/"EDIT QUEUE"/"REMOVE MY LINE"
// name no noun the queue declares ("line" isn't one), and "SEARCH QUEUE FOR
// JULES" has the same free-text-iobj problem as the ledger's own searches
// above. Bare fixed phrases.
export const V_ACT3_QUEUE_EDIT = V('act3_queue_edit');
export const V_ACT3_QUEUE_SEARCH_JULES = V('act3_queue_search_jules');

// §39.4 — "BAY," a bare fixed phrase back to the Maintenance Bay (alongside
// the ordinary `west` exit). "back" is deliberately NOT wired to this
// destination: it is already exclusively one of `DIRECTION_VERB_IDS.in`'s
// own words (`act1/verbs.ts`), and bare `ENTER`/`IN`/`BACK` in the Hub must
// stay ambiguous per §39.2's own ruling — flagged in this task's report.
export const V_ACT3_TO_BAY = V('act3_to_bay');

// §21.1 — first-sight gating for the room description. `{ not: { visited }
// }` cannot do this (`move.ts`'s `renderArrival` marks `visited` before
// rendering `description`) — same idiom as `ACT3_PIPE_CHASE_SEEN`.
export const ACT3_HUB_SEEN = F('act3_hub_seen');

// --- integration (v0.15.0 playtest) ---
/** §7.2's anchor plate — an uncounted sub-part of the straps, so EXAMINE ANCHOR reaches its own text. */
export const ACT3_STRAP_ANCHOR = O('act3_strap_anchor');

/** v0.15.1 — `PUT USB IN TERMINAL` as a bare form, so §29.1 (Dad refusing the dock) answers while the stick is in the rig and the rig is wherever it is. */
export const V_ACT3_DOCK_DAD = V('act3_dock_dad');

// --- D5 builders append below this line (Edit tool only; one block per task, labelled) ---
