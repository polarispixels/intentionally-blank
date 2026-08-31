// Act II, Wave D1 — the moved build boundary (D1 prose doc §21; plan §2
// D1's own "one system.buildBoundary gate"). Reuses `act1/scripts.ts`'s own
// system-line idiom (a `{ script }` effect rather than a plain `{ say }`, so
// the emitted `GameEvent` can carry `kind: 'system'` — `{ say: Prose }`
// always renders `kind: 'prose'`, `effects.ts`'s `applyOne`). Text
// transcribed verbatim (hard rule 5); this is final prose, not a
// placeholder, per the doc's own §21 header.

import type { Effect } from '../../../engine/effects';
import type { ScriptId } from '../../../engine/ids';
import type { ScriptFn } from '../../../engine/world';
import { ACT2_BOUNDARY_SCRIPT } from './ids';

export { ACT2_BOUNDARY_SCRIPT };

const ACT2_BOUNDARY_TEXT =
  'END OF BUILD\n\nAct II continues past this point. The town in daylight, the road in to the\nlights, and what is on that stick are not in this version.';

const act2Boundary: ScriptFn = (_world, state) => ({
  state,
  events: [{ type: 'line', kind: 'system', text: ACT2_BOUNDARY_TEXT }],
});

export const ACT2_D1_SCRIPTS: Record<ScriptId, ScriptFn> = {
  [ACT2_BOUNDARY_SCRIPT]: act2Boundary,
};

// ---------------------------------------------------------------------------
// §21's second route — "DRIVE TO PLANT"/"GO TO PLANT" from the motel or
// Town Edge, with the truck present. Shared between `act1/jacksMotel.ts`
// and `act1/townEdge.ts` (both room-level handlers on the bare
// `V_ACT2_DRIVE_TO_PLANT` verb) so the two rooms render one string, not two
// copies. Text transcribed verbatim (hard rule 5).
// ---------------------------------------------------------------------------

const jackPlantLineText =
  '"The plant," Jack says, to be sure that is what he heard.\n\nThen he gets in, and does not say anything else, which is how he agrees with\nyou about what kind of idea this is.';

/** Also this verb's own `default` (`act2/verbs.ts`) — the room-level handlers below are what a player actually reaches; see that file's own comment on the idiom (`V_CHECK_DATE`/`V_FIND_MY_NAME`). */
export const ACT2_DRIVE_TO_PLANT_TEXT = jackPlantLineText;

export const ACT2_DRIVE_TO_PLANT_EFFECTS: Effect[] = [{ say: jackPlantLineText }, { script: { id: ACT2_BOUNDARY_SCRIPT } }];
