// Act V, wave E3, task U — §12, R18, the antechamber console's own login
// (`docs/superpowers/specs/2026-09-20-stage-e3-prose.md` §11-§12). Modelled
// on `act3/scripts.ts`'s Hub login (`act3HubLoginOpen`/`act3HubLoginRespond`
// — the `ACT3_HUB_LOGIN_OPEN_SCRIPT` area): the open script builds the
// `prompt` event by hand; the respond script checks credentials, and a
// failed attempt CLOSES the prompt rather than re-opening it (v0.15.0's
// playtest lesson — `act3_hub_login`'s own header note; re-opening it here
// swallowed the next command). Every string below is transcribed verbatim
// (hard rule 5).

import { apply } from '../../../engine/effects';
import type { GameEvent, ScriptFn } from '../../../engine/world';
import {
  ACT5_ANTE_LOGIN_PROMPT_ID,
  ACT5_CLUE_ACCEPTED,
  ACT5_INNER_DOOR,
  ACT5_RECONCILIATION_RUNNING,
  ACT5_ROOT_ACCEPTED,
} from './ids';

function anteLoginFields(): { name: string; placeholder?: string; secret?: boolean }[] {
  return [
    { name: 'user', placeholder: 'USER:' },
    { name: 'password', placeholder: 'PASSWORD:', secret: true },
  ];
}

/** §12.1 — one line above the fields. */
const ANTE_LOGIN_BODY_TEXT = 'The keyboard shelf is at the height a keyboard shelf is.';

function anteLoginPromptEvent(): GameEvent {
  return { type: 'prompt', id: ACT5_ANTE_LOGIN_PROMPT_ID, title: 'LOG IN', body: ANTE_LOGIN_BODY_TEXT, fields: anteLoginFields() };
}

export const act5AnteLoginOpen: ScriptFn = (_world, state) => ({ state, events: [anteLoginPromptEvent()] });

/**
 * §12.2 — R18. Sets `act5_root_accepted`/`act5_reconciliation_running`
 * (§17's own "one effects list" ruling), grants `act5_clue_accepted`, opens
 * the inner door (its own `container.open`, `rootAntechamber.ts`). §42.3's
 * own ordering note: this whole block is one `say`, the door's state change
 * is inside the same effects list, and the clue lands after it — the
 * question `act5_q_what_do_you_owe` and the puzzle's `onSolved` are both
 * ambient (knowledge.ts's tick step) and need no effect here at all.
 *
 * The screen prints `RECOGNIZED` on its own line with no word before it —
 * §12's own note, and `tests/` should assert the rendered text never
 * contains `NOT RECOGNIZED`.
 */
const ANTE_LOGIN_SUCCESS_TEXT =
  "    RECOGNIZED\n\nUpstairs the machine put one more word in front of that one. Every time, at\nthat speed, for a name, for a word, for nothing whatsoever.\n\nIt is not in front of it now.\n\n    ACCESS LEVEL: ROOT\n    RECONCILIATION ................. RUNNING\n\nAcross the room something in the frame of the door with nothing round it lets\ngo, once, and the leaf comes off its seal and stands about a finger's width\nopen, and stays there.";

/**
 * §12.3 — any other pair. The middle line is `act1/verbs.ts`'s
 * `terminalTypeDefault[3]`, word for word, deliberately (not counted per
 * that section's own note). The refusal closes the prompt.
 */
const ANTE_LOGIN_FAIL_TEXT =
  '    USER NOT RECOGNIZED\n\nThe same words, at the same speed, for nothing at all.\n\nThe cursor goes back up to USER: and waits.';

export const act5AnteLoginRespond: ScriptFn = (world, state, args) => {
  const user = String(args?.['user'] ?? '').trim().toLowerCase();
  const password = String(args?.['password'] ?? '').trim().toLowerCase();

  if (user === 'admin' && password === 'admin-password') {
    const applied = apply(
      world,
      state,
      [
        { say: ANTE_LOGIN_SUCCESS_TEXT },
        { set: [ACT5_ROOT_ACCEPTED, true] },
        { set: [ACT5_RECONCILIATION_RUNNING, true] },
        { setState: [ACT5_INNER_DOOR, 'open', true] },
        { grantClue: ACT5_CLUE_ACCEPTED },
      ],
      { path: 'script.act5_ante_login.success' },
    );
    return { state: applied.state, events: [{ type: 'promptClosed', id: ACT5_ANTE_LOGIN_PROMPT_ID }, ...applied.events] };
  }

  const applied = apply(world, state, [{ say: ANTE_LOGIN_FAIL_TEXT }], { path: 'script.act5_ante_login.fail' });
  return {
    state: applied.state,
    events: [{ type: 'promptClosed', id: ACT5_ANTE_LOGIN_PROMPT_ID }, ...applied.events],
  };
};
