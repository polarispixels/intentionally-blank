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
 * `TOWN_EDGE_NO_EXIT_GATE`/`TOWN_EDGE_BOUNDARY_GATE`, `act1/objects/
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
/** §15 — the one `system.buildBoundary` emission, reached from the hatch's `down`, the lift's S1/S5, and Town Edge's country exit. */
export const ACT3_BOUNDARY_SCRIPT = S('act3_boundary');
/** The lift's S1/S5 ride (§13.8): three beats, `advanceClock: 3`, then the boundary. */
export const ACT3_ELEVATOR_RIDE_SCRIPT = S('act3_elevator_ride');
/** Reader B4's rotation-parity resolution (§11.6) — `Cond` has no modulo primitive, so this is a script, not a declarative `when`. */
export const ACT3_READER_B4_SCRIPT = S('act3_reader_b4');

// --- New verbs (§11.3, §10.6/§11.7/§13.6) — see `verbs.ts` for the words/patterns and the in-place amendments to the shipped `V_MEASURE`/`V_CALL`. ---
export const V_PACE = V('act3_pace');
export const V_UNBOLT = V('act3_unbolt');
