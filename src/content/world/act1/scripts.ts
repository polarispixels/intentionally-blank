// Act I Wave 5 — the END OF BUILD system line (§16.2). A `{ script }` effect
// rather than a plain `{ say }`, so the emitted `GameEvent` can carry
// `kind: 'system'` (`engine/gamestate.ts`'s `GameEvent`, the same shape
// `src/content/scripts.ts`'s own restart-declined line already uses) —
// `{ say: Prose }` always renders `kind: 'prose'` (`engine/effects.ts`'s
// `applyOne`), with no way for content to choose `'system'` instead.
//
// Wiring (jack.ts's own `topic_wall_drug`/`SHOW TICKET TO JACK`): this
// script is called from inside an `{ if: { when: { not: { flag:
// FLAG_OFFERED_THE_RIDE } }, then: [...] } }` guard, so it only ever fires
// the first time `offered_the_ride` goes true — a second ask renders
// §16.1's own response again with no notice, per the doc's own instruction.

import { S } from '../../../engine/ids';
import type { ScriptId } from '../../../engine/ids';
import type { ScriptFn } from '../../../engine/world';

export const END_OF_BUILD_SCRIPT: ScriptId = S('act1_end_of_build');

const END_OF_BUILD_TEXT = 'END OF BUILD\n\nACT I ENDS HERE — the road north is Act II, and it is not in this version yet.';

const endOfBuild: ScriptFn = (_world, state) => ({
  state,
  events: [{ type: 'line', kind: 'system', text: END_OF_BUILD_TEXT }],
});

export const ACT1_WAVE5_SCRIPTS: Record<ScriptId, ScriptFn> = {
  [END_OF_BUILD_SCRIPT]: endOfBuild,
};
