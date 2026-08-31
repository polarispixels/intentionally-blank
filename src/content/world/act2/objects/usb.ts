// Act II, Stage D2, task A — the dock (D2 prose doc §3, §9.4). Prose
// transcribed verbatim (hard rule 5).
//
// AMENDS TASK B'S OWN `act2_usb` OBJECT IN PLACE — see this file's own
// header from D1 (unchanged reasoning, restated briefly): `actions.ts`'s
// `findHandler` only ever consults ONE `world.objects[dobj].handlers`
// array, so every `PUT_IN`/`TAKE` handler this task needs on the USB has
// to live in that same array as the corridor's own dead-terminal handler
// (`objects/cache.ts`'s own `usb` export).
//
// SUPERSESSION (§29.1 of the D2 prose doc) — D1's own boundary route
// (`PUT USB IN TERMINAL` at Your Room rendering `system.buildBoundary`) is
// RETIRED here: the single handler this file used to push (dockAtBoundary
// Effects: "it fits" + `{ script: ACT2_BOUNDARY_SCRIPT }`) is replaced by
// two handlers on the exact same `verbs`/`withInstrument` pair — §3.1's
// refusal without the chain, §5.1's boot with it. The one-`system.
// buildBoundary`-gate invariant still holds; the gate itself has moved to
// D2's own two doors (a different, concurrent task's own file — not this
// one). `ACT2_BOUNDARY_SCRIPT` is no longer imported/referenced anywhere in
// this file.
//
// PUT USB IN RIG / TAKE USB (from either the terminal while booted, or the
// rig) — this wave's own ruling 5: "a handler on the USB gated
// `{ objectAt: [ACT2_USB, { in: ACT2_RIG }] }`" (the rig's own file,
// `objects/rig.ts`, owns only the rig's EXAMINE/DROP).

import { PUT_IN, TAKE } from '../../act1/verbs';
import { TERMINAL } from '../../act1/ids';
import { ACT2_ADAPTER_CHAIN, ACT2_DAD, ACT2_DAD_BOOT_SCRIPT, ACT2_RIG, ACT2_USB } from '../ids';
import { usb } from './cache';

// ---------------------------------------------------------------------------
// §3.1 — `PUT USB IN TERMINAL` without the chain.
// ---------------------------------------------------------------------------

const noChainText =
  'The ports are behind the machine, which means doing this by feel, with your\ncheek against warm beige and your arm somewhere you cannot see.\n\nThe stick is the wrong shape. Not a little wrong. Wrong by about forty years:\nit wants a slot with the pins in the socket, and this machine offers you two\nmouths full of pins that want a plug with holes.\n\nYou stop before you make it a matter of force. Somewhere in this county there\nis a drawer with the in-between in it.';

// ---------------------------------------------------------------------------
// §3.4 — `TAKE USB` while Dad is booted (docked + terminal on).
// ---------------------------------------------------------------------------

const takeWhileBootedText =
  '"Right," he says, before your fingers are all the way round it. "That\'s fine.\nGo on."\n\nHe does not say anything else, and you stand there for a second holding a\nthing that has stopped talking, which is not the same as a thing that has\nfinished.';

// ---------------------------------------------------------------------------
// §9.4 — `PUT USB IN RIG` / `TAKE USB` from the rig.
// ---------------------------------------------------------------------------

const putInRigText =
  'The stick goes in. The box thinks about it for a moment longer than the\nterminal does, being younger and less certain of itself.\n\n"Where are we?" says Dad, out of a loaf-sized speaker, into a car park.';

const takeFromRigText = '"Right, that\'s me," he says, and then it is just a battery and some tape.';

// ---------------------------------------------------------------------------
// The handlers — declared once, pushed onto the shared array below. Order
// matters (`findHandler` is first-match-wins): the chain-gated boot rule
// must precede the unconditional no-chain refusal that shares its
// `verbs`/`withInstrument` pair.
// ---------------------------------------------------------------------------

const newHandlers: NonNullable<typeof usb.handlers> = [
  // §5.1 — the boot, with the chain in hand. `setState: [TERMINAL, 'on',
  // true]` — Dad's own schedule rule 1 (`dad.ts`) requires the terminal
  // "on" as a separate, derived condition from the USB's own location, and
  // §5.1's own beats narrate the screen waking on its own the moment the
  // stick goes in ("the screen clears itself without being asked") — the
  // docking event itself is what powers it, not a prerequisite `TURN ON
  // TERMINAL` the doc never mentions.
  {
    verbs: [PUT_IN],
    withInstrument: [TERMINAL],
    when: { has: ACT2_ADAPTER_CHAIN },
    effects: [{ move: [ACT2_USB, { in: TERMINAL }] }, { setState: [TERMINAL, 'on', true] }, { script: { id: ACT2_DAD_BOOT_SCRIPT } }],
  },
  // §3.1 — the refusal, without it.
  { verbs: [PUT_IN], withInstrument: [TERMINAL], effects: [{ say: noChainText }] },
  // §9.4 — PUT USB IN RIG.
  {
    verbs: [PUT_IN],
    withInstrument: [ACT2_RIG],
    effects: [{ move: [ACT2_USB, { in: ACT2_RIG }] }, { say: putInRigText }, { setFollowing: [ACT2_DAD, true] }],
  },
  // §3.4 — TAKE while booted (docked + terminal on).
  {
    verbs: [TAKE],
    when: { all: [{ objectAt: [ACT2_USB, { in: TERMINAL }] }, { objectState: [TERMINAL, 'on', true] }] },
    effects: [{ say: takeWhileBootedText }, { move: [ACT2_USB, 'inventory'] }],
  },
  // §9.4 — TAKE USB from the rig.
  {
    verbs: [TAKE],
    when: { objectAt: [ACT2_USB, { in: ACT2_RIG }] },
    effects: [{ say: takeFromRigText }, { move: [ACT2_USB, 'inventory'] }, { setFollowing: [ACT2_DAD, false] }],
  },
];

const alreadyWired = usb.handlers!.some((h) => h.verbs.includes(PUT_IN) && Array.isArray(h.withInstrument) && h.withInstrument.includes(ACT2_RIG));
if (!alreadyWired) {
  usb.handlers!.push(...newHandlers);
}
