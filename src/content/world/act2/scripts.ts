// Act II, Wave D1 — the moved build boundary (D1 prose doc §21; plan §2
// D1's own "one system.buildBoundary gate"). Reuses `act1/scripts.ts`'s own
// system-line idiom (a `{ script }` effect rather than a plain `{ say }`, so
// the emitted `GameEvent` can carry `kind: 'system'` — `{ say: Prose }`
// always renders `kind: 'prose'`, `effects.ts`'s `applyOne`).
//
// D2-C amendment (Stage D plan §2 D2 §23, §29.1; D2 prose doc §23) —
// "D1's `DRIVE TO PLANT` boundary text is superseded by §23's; the single
// boundary emission moves to §23's two doors" (this task's own
// briefing). Both the in-world truck line AND the system line below are
// replaced with §23's own text (final prose, not a placeholder); the
// script itself (`act2Boundary`) is unchanged — both doors call the same
// one `system.buildBoundary` emission, per the plan's own "one emission,
// two doors" shape. The second door (Town Edge's own `nw` country exit) is
// wired in `act1/townEdge.ts`, this task's own amendment.

import type { Effect } from '../../../engine/effects';
import type { ScriptId } from '../../../engine/ids';
import type { ScriptFn } from '../../../engine/world';
import { ACT2_TRAVEL_SCRIPT } from './ids';

// The D1 boundary system line was retired in E3 (register 146) — the table
// survives empty so `act2/index.ts`'s spread needs no change.
export const ACT2_D1_SCRIPTS: Record<ScriptId, ScriptFn> = {};

// ---------------------------------------------------------------------------
// §23's first door — "DRIVE TO PLANT"/"RIDE TO PLANT" from the motel or
// Town Edge, with the truck present. Shared between `act1/jacksMotel.ts`
// and `act1/townEdge.ts` (both room-level handlers on the bare
// `V_ACT2_DRIVE_TO_PLANT` verb) so the two rooms render one string, not two
// copies. Text transcribed verbatim (hard rule 5) — D2-C's own replacement
// of D1's shipped `jackPlantLineText` (§29.1's own wiring-summary entry).
// ---------------------------------------------------------------------------

const truckAtTheCattleGuardText =
  'Jack takes the cattle guard at a walking pace, the way you take a thing you\nintend to still be there on the way back.\n\nPast it the county road stops pretending. There is a fence on your right and\nit goes on being on your right, and the road holds the line of it without\noffering you anything, and up ahead the fence turns and the road turns with\nit, and neither of them has been made easy to leave.';

/** Also this verb's own `default` (`act2/verbs.ts`) — the room-level handlers below are what a player actually reaches; see that file's own comment on the idiom (`V_CHECK_DATE`/`V_FIND_MY_NAME`). */
export const ACT2_DRIVE_TO_PLANT_TEXT = truckAtTheCattleGuardText;

// ---------------------------------------------------------------------------
// D3, task A amendment (Stage D plan §2 D3; D3 prose doc §21.1's own "D2
// §23's boundary ... DRIVE TO PLANT is retired entirely: it is §3's travel
// script with to: 'perimeter'"). The in-world lead-in line is kept
// unchanged (only "its boundary emission" — the `{ script:
// { id: ACT2_BOUNDARY_SCRIPT } }` call — is retired, per that ruling's own
// wording); `system.buildBoundary`'s single remaining emission moves to
// D3's own three doors (`act3/perimeterRoad.ts`'s exits, the elevator, the
// chase hatch — task C's own module for the latter two).
// ---------------------------------------------------------------------------

export const ACT2_DRIVE_TO_PLANT_EFFECTS: Effect[] = [
  { say: truckAtTheCattleGuardText },
  { script: { id: ACT2_TRAVEL_SCRIPT, args: { mode: 'truck', to: 'perimeter' } } },
];
