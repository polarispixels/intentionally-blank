// Act V, wave E3, task W — the opening terminal's login screen
// (`docs/superpowers/specs/2026-09-20-stage-e3-prose.md` §32, canon 111).
// `LOG IN`/`LOGIN`/`ENTER USER` at `act1_terminal`, only while it is on,
// opens this prompt — its own id, its own respond script, its own flag
// (plan §3.5's three-logins rule). Same "open script builds the `prompt`
// event by hand, respond script checks credentials" idiom as
// `act3/scripts.ts`'s `act3HubLoginOpen`/`act3HubLoginRespond`. Every
// string below is transcribed verbatim (hard rule 5); the failure branch
// reuses `act1/verbs.ts`'s own `terminalTypeDefault` array byte for byte
// (§32.3), sharing its rotation counter exactly — `prose.ts`'s own rule is
// that a rotation counter keys off the *path* passed to `apply`/`render`,
// not the array's identity, so this file reconstructs the same
// `action.<verb>.none` path `performAction` derives for a bare call to
// `V_TYPE_TERMINAL` (`engine/actions.ts`'s `contextFor`) rather than a
// script-local path of its own — the only way the two are "the same
// rotation state" (§32.3's own words) and not two independent counters
// that happen to draw from the same array.

import { apply } from '../../../engine/effects';
import type { GameEvent, ScriptFn, VerbDef } from '../../../engine/world';
import { flag } from '../../../engine/cond';
import { terminalTypeDefault } from '../act1/verbs';
import { V_TYPE_TERMINAL } from '../act1/ids';
import { ACT5_OPENING_LOGIN_PROMPT_ID, ACT5_OPENING_LOGIN_SEEN, V_ACT5_LOGIN_TERMINAL } from './ids';

/**
 * §32/`ids.ts`'s own comment — `'V dobj'` only (no bare `'V'`): the object
 * handler this reaches (`act1/objects/terminal.ts`) needs a resolved
 * `dobj` to be able to gate on the terminal's own `on` state at all, the
 * same reason the Hub/antechamber logins are reached through a `'V dobj'`
 * verb (`USE_VERB_ID`) rather than a bare one. `default` reuses
 * `terminalTypeDefault` (not new prose) for the one unreachable-in-practice
 * case (a resolved dobj other than the terminal) — nothing else in "your
 * room" answers to "login"/"enter user".
 */
export const ACT5_LOGIN_TERMINAL_VERB: VerbDef = {
  id: V_ACT5_LOGIN_TERMINAL,
  words: ['login', 'enter user'],
  patterns: ['V dobj'],
  class: 'analytical',
  default: terminalTypeDefault,
};

/** The exact path a bare call to `V_TYPE_TERMINAL` resolves to (`actions.ts`'s `contextFor`: `action.${verb}.${dobj ?? 'none'}`, dobj always undefined for that bare verb) — shared here so the rotation counter is the same counter, not a second one. */
const TERMINAL_TYPE_DEFAULT_PATH = `action.${V_TYPE_TERMINAL}.none`;

function openingLoginFields(): { name: string; placeholder?: string; secret?: boolean }[] {
  return [
    { name: 'user', placeholder: 'USER:' },
    { name: 'password', placeholder: 'PASSWORD:', secret: true },
  ];
}

function openingLoginPromptEvent(): GameEvent {
  return { type: 'prompt', id: ACT5_OPENING_LOGIN_PROMPT_ID, title: 'LOG IN', body: '', fields: openingLoginFields() };
}

export const act5OpeningLoginOpen: ScriptFn = (_world, state) => ({ state, events: [openingLoginPromptEvent()] });

/** §32.1 — first success. */
const OPENING_LOGIN_FIRST_TEXT =
  'The cursor sits still for a moment, which it has not done before.\n\n    ACCESS LEVEL: LOCAL\n\n    ENVIRONMENT ......... MAIN ST / TOP FLOOR REAR\n    STATUS .............. RUNNING\n    PHYSICAL PARAMETERS . RANDOMIZED — 1 EXCEPTION, SUPPRESSED\n\nThe screen holds that for as long as you want it, and there is nothing else\nunder it, and no way further in, and nothing on it that is any use to anybody\nlooking for a man.';

/** §32.2 — every success after the first. */
const OPENING_LOGIN_AGAIN_TEXT =
  '    ACCESS LEVEL: LOCAL\n\n    ENVIRONMENT ......... MAIN ST / TOP FLOOR REAR\n    STATUS .............. RUNNING\n    PHYSICAL PARAMETERS . RANDOMIZED — 1 EXCEPTION, SUPPRESSED\n\nThe same three lines. The cursor goes back to where it started.';

export const act5OpeningLoginRespond: ScriptFn = (world, state, args) => {
  const user = String(args?.['user'] ?? '').trim().toLowerCase();
  const password = String(args?.['password'] ?? '').trim().toLowerCase();

  if (user === 'admin' && password === 'admin-password') {
    const seen = flag(world, state, ACT5_OPENING_LOGIN_SEEN) === true;
    const applied = apply(
      world,
      state,
      seen ? [{ say: OPENING_LOGIN_AGAIN_TEXT }] : [{ say: OPENING_LOGIN_FIRST_TEXT }, { set: [ACT5_OPENING_LOGIN_SEEN, true] }],
      { path: 'script.act5_opening_login.success' },
    );
    return { state: applied.state, events: [{ type: 'promptClosed', id: ACT5_OPENING_LOGIN_PROMPT_ID }, ...applied.events] };
  }

  // §32.3 — any other pair. `terminalTypeDefault`, the same exported
  // constant `act1/verbs.ts` assigns to `V_TYPE_TERMINAL`'s own bare
  // default, byte for byte, same rotation state (see this file's header) —
  // not a copy.
  const applied = apply(world, state, [{ say: terminalTypeDefault }], { path: TERMINAL_TYPE_DEFAULT_PATH });
  return { state: applied.state, events: [{ type: 'promptClosed', id: ACT5_OPENING_LOGIN_PROMPT_ID }, ...applied.events] };
};
