// The RESTART/RESET confirmation prompt's `ScriptFn`s (response-families
// doc "Later additions" §10; `src/session/session.ts`'s own doc comment on
// `requestRestart` explains why the three ids these register under live
// there, not here). Global chrome, not per-act — "fires in every room, in
// all five acts," per the doc — so this file sits at `src/content/`
// alongside `responses.ts`, not under `world/act1/`; every future act's
// `WorldDef` should spread `RESTART_SCRIPTS` into its own `scripts` the
// same way `world/act1/world.ts` does.

import { render } from '../engine/prose';
import type { ScriptId } from '../engine/ids';
import type { ScriptFn, WorldDef } from '../engine/world';
import { RESTART_CONFIRM_OPEN_SCRIPT, RESTART_CONFIRM_PROMPT_ID, RESTART_CONFIRM_RESPOND_SCRIPT } from '../session/session';

/** `world.responses[key]`, thrown loudly if missing — the same convention `respond.ts`/`actions.ts`/`move.ts` each keep their own copy of (duplicated rather than exported across the engine/content boundary). */
function family(world: WorldDef, key: string) {
  const prose = world.responses?.[key];
  if (prose === undefined) throw new Error(`scripts: response family "${key}" is not declared in world.responses`);
  return prose;
}

/** Opens the prompt (§5.7's `openPrompt` "real mechanism"): `restart.confirm`'s one authored line as `body`, a single free-text field for the answer. Never called with a turn in progress — `requestRestart` invokes it directly, outside the parser/grammar path, exactly like the login prompt's own open script. */
const restartConfirmOpen: ScriptFn = (world, state) => {
  const rendered = render(world, state, 'restart.confirm', family(world, 'restart.confirm'));
  return {
    state: rendered.state,
    events: [
      {
        type: 'prompt',
        id: RESTART_CONFIRM_PROMPT_ID,
        title: 'RESTART',
        body: rendered.text,
        fields: [{ name: 'confirm' }],
      },
    ],
  };
};

/**
 * Answers the prompt. Only an exact "yes"/"y" (case-insensitive) confirms —
 * anything else, blank included, declines, on the constitution §9/§11
 * reasoning that started this whole feature: erring toward *not* destroying
 * a playthrough is the only safe default for a yes/no a typo can trigger.
 *
 * Confirmed: emits a bare `{ type: 'restarted' }` and nothing else — no
 * line of its own (the doc's own ruling: the opening beats are the
 * confirmation). `state` is returned unchanged; the caller that detects
 * `restarted` discards it and calls `startSession` itself (`session.ts`'s
 * `requestRestart` doc comment), so nothing here needs to build a fresh
 * `GameState`.
 *
 * Declined: `restart.declined`'s one authored line, as an ordinary system
 * line — no restart, no turn.
 */
const restartConfirmRespond: ScriptFn = (world, state, args) => {
  const answer = String(args?.['confirm'] ?? '').trim().toLowerCase();
  if (answer === 'yes' || answer === 'y') {
    return { state, events: [{ type: 'promptClosed', id: RESTART_CONFIRM_PROMPT_ID }, { type: 'restarted' }] };
  }
  const rendered = render(world, state, 'restart.declined', family(world, 'restart.declined'));
  return {
    state: rendered.state,
    events: [
      { type: 'promptClosed', id: RESTART_CONFIRM_PROMPT_ID },
      { type: 'line', kind: 'system', text: rendered.text },
    ],
  };
};

/** Spread into `WorldDef.scripts` — see this file's header. */
export const RESTART_SCRIPTS: Record<ScriptId, ScriptFn> = {
  [RESTART_CONFIRM_OPEN_SCRIPT]: restartConfirmOpen,
  [RESTART_CONFIRM_RESPOND_SCRIPT]: restartConfirmRespond,
};
