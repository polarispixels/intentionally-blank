// Act II, Wave D1 — the boundary's USB-dock route (D1 prose doc §21, route
// (a): `PUT USB IN TERMINAL` at Your Room). Text transcribed verbatim (hard
// rule 5).
//
// AMENDS TASK B'S OWN `act2_usb` OBJECT IN PLACE (same idiom `act2/verbs.ts`
// already uses for `RUB`/`ACT1_VERBS`, and `act2/index.ts`'s own header
// documents for room `handlers` arrays): the cache's own USB
// (`objects/cache.ts`) already has one `PUT_IN`/`withInstrument` handler —
// Wall Drug's own dead terminal (`ACT2_WD_TERMINAL`), "nothing happens,
// because nothing in this corridor has anywhere to send electricity." This
// task needs a SECOND `PUT_IN`/`withInstrument` handler on the SAME
// object — Your Room's real terminal (`act1_terminal`) — and `actions.ts`'s
// `findHandler` only ever consults one `world.objects[dobj].handlers`
// array (matched top to bottom, first `verbs`/`when`/`withInstrument`
// match wins), so both handlers must live in that one array; a second,
// competing declaration of `act2_usb` would either lose the merge
// (`assemble()`'s duplicate-id error) or silently shadow one task's own
// handler depending on object-spread order (confirmed by running exactly
// that failure mode against the assembled `WORLD` before landing this
// file's current shape — see this task's report). `cache.ts` exports `usb`
// for exactly this reason (a one-line, non-content addition to that file —
// see its own comment there).
//
// WHY THE HANDLER GOES ON THE USB, NOT THE TERMINAL (a deliberate deviation
// from this task's own brief, which said "a handler on the terminal ...
// with withInstrument: [ACT2_USB]" — reported here rather than silently
// followed): `actions.ts`'s `findHandler` looks up `world.objects[input.
// dobj].handlers`, and for `PUT USB IN TERMINAL` (`'V dobj prep iobj'`,
// prep "in") the parser resolves `dobj = USB`, `iobj = TERMINAL` — so a
// custom handler is only ever reached via the USB's own `handlers` array,
// with `withInstrument: [TERMINAL]` matching the `iobj`. This exactly
// mirrors the one other `PUT_IN`-with-`withInstrument` handler already
// shipped in this codebase (`objects/nolansYard.ts`'s `pieBox`, `{ verbs:
// [PUT_IN], withInstrument: [YARD_GATE], ... }` — declared on the pie box,
// not the fence), the Stage D plan's own D2 draft text for this exact dock
// ("USB handler `{ verbs: [PUT_IN], withInstrument: [TERMINAL], ... }`" —
// also framed as the USB's own handler), and task B's own identical
// pattern for the corridor terminal (`objects/cache.ts`'s own `usb`
// object, above). `act1/objects/terminal.ts` is therefore untouched by
// this task — no change there is required.
//
// NO STATE CHANGE (ruling 5's own instruction): the USB is not moved into
// the terminal and no flag is set — just the in-world line, then the
// boundary's system line. Docking (D2) is a separate, later handler.
//
// Idempotent guard (module-load mutation, same as `act2/verbs.ts`'s own
// `RUB` amendment) so importing this file twice under different specifiers
// never double-appends the handler.

import type { Effect } from '../../../../engine/effects';
import { PUT_IN } from '../../act1/verbs';
import { TERMINAL } from '../../act1/ids';
import { ACT2_BOUNDARY_SCRIPT } from '../ids';
import { usb } from './cache';

const itFitsText =
  'It fits. Of course it fits — the machine is old enough to have been built\nexpecting it, and the man who wrote on the tape knew that when he wrote on the\ntape.';

const dockAtBoundaryEffects: Effect[] = [{ say: itFitsText }, { script: { id: ACT2_BOUNDARY_SCRIPT } }];

const alreadyWired = usb.handlers!.some(
  (h) => h.verbs.includes(PUT_IN) && Array.isArray(h.withInstrument) && h.withInstrument.includes(TERMINAL),
);
if (!alreadyWired) {
  usb.handlers!.push({ verbs: [PUT_IN], withInstrument: [TERMINAL], effects: dockAtBoundaryEffects });
}
