// Built-in verb semantics (spec §2.5, §3.6, §8 task 8) — "physics is free":
// TAKE/DROP/OPEN/CLOSE/LOCK/UNLOCK/PUT IN/PUT ON/WEAR/REMOVE/READ/TURN ON/
// TURN OFF get correct boring behavior for every object that declares the
// right flags (`portable`, `wearable`, `container`, `switchable`, …),
// without a line of authored handler logic.
//
// `performAction` is the §3.6 rung 1/rung 2 dispatcher:
//   rung 1 — an authored `HandlerDef` on the resolved `dobj` matches the
//            verb (+ `when`, + `withInstrument`): it wins outright, and
//            built-in semantics never run.
//   rung 2 — no handler matched. If the verb has built-in semantics (this
//            module's table, keyed by the verb ids in `BUILTIN_VERB_IDS`),
//            those run, each outcome rendering its own authored global
//            response family (`world.responses['take.success']` etc. —
//            "authored default families" per §3.6's table). Otherwise the
//            verb's own `default` family renders, `{name}`-templated, and
//            a `defaultResponse` diag is emitted — the signal the
//            playtester audits for constitution §14 coverage.
//
// This module does not touch the turn loop (`step`, a later task) — it
// only reports `consumesTurn` on its result so `step` can act on it.
//
// Reads never index `state.objects` directly — every location/state check
// goes through `resolve.ts`/`cond.ts`'s overlay-with-authored-default
// resolvers, per §1.1.

import type { ActionClass, ObjectId, PlaceId, VerbId } from './ids';
import { V } from './ids';
import { evaluate } from './cond';
import type { Effect, EffectContext } from './effects';
import { apply } from './effects';
import type { Prose } from './prose';
import { render } from './prose';
import { objectLocation, objectState } from './resolve';
import type { GameEvent, GameState, HandlerDef, VerbDef, WorldDef } from './world';

/**
 * Reserved verb ids the built-in semantics table below is keyed by.
 * Content must use these exact ids (in `world.verbs`) for the
 * corresponding physical verb to get built-in behavior — the same way
 * `world.responses`'s family names (`unknown`, `nounMiss`, …) are reserved
 * strings the engine looks for by convention, not derived from anything.
 */
export const BUILTIN_VERB_IDS = {
  take: V('take'),
  drop: V('drop'),
  open: V('open'),
  close: V('close'),
  lock: V('lock'),
  unlock: V('unlock'),
  putIn: V('put_in'),
  putOn: V('put_on'),
  wear: V('wear'),
  remove: V('remove'),
  read: V('read'),
  turnOn: V('turn_on'),
  turnOff: V('turn_off'),
} as const;

export interface ActionInput {
  verb: VerbId;
  dobj?: ObjectId;
  iobj?: ObjectId;
  /** Stable rotation-counter path base for this call (§2.2). Defaults to a derived `action.<verb>.<dobj>` id. */
  path?: string;
}

export interface ActionResult {
  state: GameState;
  events: GameEvent[];
  consumesTurn: boolean;
  class: ActionClass | null;
  /**
   * `true` from `succeed()`, `false` from `refuse()` (task 11, §8: the
   * implicit-take exception — see `withImplicitTake` below). A matched
   * authored handler (`applyHandler`, rung 1) is `true`: it ran the
   * content author's own intended effects, not a boilerplate refusal.
   * `fallbackToVerbDefault` (rung 2b) is `false`: nothing the player asked
   * for actually happened, only a generic filler response rendered. Neither
   * of those two is exercised by `withImplicitTake`'s own recursive TAKE
   * call in practice (TAKE always has built-in semantics, so rung 2b never
   * runs for it; a matched TAKE handler like `KEY`'s is presumed a genuine
   * success) — but every `ActionResult` still needs a real value here.
   */
  ok: boolean;
}

/** The §3.6 rung 1/rung 2 dispatcher. */
export function performAction(world: WorldDef, state: GameState, input: ActionInput): ActionResult {
  const verbDef = world.verbs?.[input.verb];

  const handler = input.dobj !== undefined ? findHandler(world, state, input) : undefined;
  if (handler !== undefined) return applyHandler(world, state, input, handler, verbDef);

  const builtin = input.dobj !== undefined ? BUILTINS[input.verb] : undefined;
  if (builtin !== undefined) return builtin(world, state, input, verbDef);

  return fallbackToVerbDefault(world, state, input, verbDef);
}

// ---------------------------------------------------------------------------
// Rung 1 — authored handlers
// ---------------------------------------------------------------------------

function findHandler(world: WorldDef, state: GameState, input: ActionInput): HandlerDef | undefined {
  const handlers = world.objects?.[input.dobj!]?.handlers ?? [];
  return handlers.find(
    (h) =>
      h.verbs.includes(input.verb) &&
      (h.when === undefined || evaluate(world, state, h.when)) &&
      instrumentMatches(h.withInstrument, input.iobj),
  );
}

function instrumentMatches(withInstrument: HandlerDef['withInstrument'], iobj: ObjectId | undefined): boolean {
  if (withInstrument === undefined) return true;
  if (withInstrument === 'any') return iobj !== undefined;
  if (withInstrument === 'none') return iobj === undefined;
  return iobj !== undefined && withInstrument.includes(iobj);
}

function applyHandler(world: WorldDef, state: GameState, input: ActionInput, handler: HandlerDef, verbDef: VerbDef | undefined): ActionResult {
  const ctx = contextFor(world, input);
  const { state: newState, events } = apply(world, state, handler.effects, ctx);
  return {
    state: newState,
    events,
    consumesTurn: handler.consumesTurn ?? !(verbDef?.meta === true),
    class: handler.class ?? verbDef?.class ?? null,
    ok: true, // a matched handler ran the author's own intent, not a refusal — see ActionResult.ok's doc comment
  };
}

// ---------------------------------------------------------------------------
// Rung 2b — the verb's own default family
// ---------------------------------------------------------------------------

function fallbackToVerbDefault(world: WorldDef, state: GameState, input: ActionInput, verbDef: VerbDef | undefined): ActionResult {
  if (verbDef === undefined) {
    throw new Error(`performAction: verb "${input.verb}" is not declared in world.verbs`);
  }
  if (verbDef.default === null) {
    throw new Error(`performAction: verb "${input.verb}" has no default family, and no handler or built-in matched`);
  }
  const ctx = contextFor(world, input);
  const rendered = render(world, state, ctx.path!, verbDef.default, ctx);
  const events: GameEvent[] = [
    { type: 'line', kind: 'prose', text: rendered.text },
    {
      type: 'diag',
      code: 'defaultResponse',
      detail: `verb "${input.verb}" on ${input.dobj ?? '(no object)'} fell to its default family`,
    },
  ];
  return { state: rendered.state, events, consumesTurn: verbDef.meta !== true, class: verbDef.class, ok: false }; // generic filler, not a genuine success — see ActionResult.ok's doc comment
}

// ---------------------------------------------------------------------------
// Shared plumbing for built-ins
// ---------------------------------------------------------------------------

function contextFor(world: WorldDef, input: ActionInput): EffectContext {
  const dobjName = input.dobj !== undefined ? objectName(world, input.dobj) : undefined;
  const iobjName = input.iobj !== undefined ? objectName(world, input.iobj) : undefined;
  return {
    ...(dobjName !== undefined ? { name: dobjName, dobj: dobjName } : {}),
    ...(iobjName !== undefined ? { iobj: iobjName } : {}),
    path: input.path ?? `action.${input.verb}.${input.dobj ?? 'none'}`,
  };
}

function objectName(world: WorldDef, id: ObjectId): string {
  return world.objects?.[id]?.name ?? id;
}

/** The declared global family for a built-in outcome — a data bug (author forgot to author it) throws, per this codebase's convention (e.g. `effects.ts`'s `grantMemory`). */
function family(world: WorldDef, key: string): Prose {
  const prose = world.responses?.[key];
  if (prose === undefined) {
    throw new Error(`actions: built-in response family "${key}" is not declared in world.responses`);
  }
  return prose;
}

function refuse(world: WorldDef, state: GameState, input: ActionInput, verbDef: VerbDef | undefined, familyKey: string): ActionResult {
  const ctx = contextFor(world, input);
  const rendered = render(world, state, ctx.path!, family(world, familyKey), ctx);
  return {
    state: rendered.state,
    events: [{ type: 'line', kind: 'prose', text: rendered.text }],
    consumesTurn: true,
    class: verbDef?.class ?? null,
    ok: false,
  };
}

function succeed(
  world: WorldDef,
  state: GameState,
  input: ActionInput,
  verbDef: VerbDef | undefined,
  effects: Effect[],
  familyKey: string,
): ActionResult {
  const ctx = contextFor(world, input);
  const { state: newState, events } = apply(world, state, [{ say: family(world, familyKey) }, ...effects], ctx);
  return { state: newState, events, consumesTurn: true, class: verbDef?.class ?? null, ok: true };
}

/**
 * The implicit-take convenience (task 11, §3.5/constitution §22 — a
 * deliberate, narrowly-authorized exception to "parser module only": doing
 * this correctly needs `performAction`'s real TAKE dispatch, handler
 * overrides included, which only exists here). `WEAR`/`PUT IN`/`PUT ON`
 * (§8 task 8's `builtinWear`/`builtinPutIn`/`builtinPutOn`) call this
 * around their own existing logic, wrapped in `run`: if `id` (their `dobj`)
 * isn't already held, this first performs a real recursive `TAKE` on it —
 * respecting every refusal the built-in TAKE would raise (not portable, in
 * a closed container, …) and any authored handler override (e.g. `KEY`'s)
 * — before `run` ever evaluates the outer verb's own logic. A failed
 * implicit take is returned as-is: "an implicit take of a non-portable
 * object fails as a take, not as a confusing wear failure" (task brief,
 * verbatim). A successful one threads its post-take `state` into `run` and
 * prepends its own events (the "(first taking the X)" line is exactly
 * TAKE's own `take.success` family, rendered once, reused verbatim — no new
 * prose is written here).
 *
 * VISIBILITY ("must be visible to the player", task brief): deliberately
 * NOT checked here. `performAction`'s `dobj` always arrives already
 * resolved against `ScopeView.visible` — that's `resolveNounPhrase`'s (and
 * pronoun resolution's) own contract (task 10), upstream of every call this
 * module ever receives. A visibility gate inside `actions.ts` would be
 * either redundant (the normal parser-driven path) or wrong (a direct unit
 * `performAction` call, which has no `visible` list to check against at
 * all — see this task's report for the direct-`performAction`-test
 * consequence this has).
 */
function withImplicitTake(
  world: WorldDef,
  state: GameState,
  id: ObjectId,
  run: (world: WorldDef, state: GameState) => ActionResult,
): ActionResult {
  if (playerHas(world, state, id)) return run(world, state);

  const takeResult = performAction(world, state, { verb: BUILTIN_VERB_IDS.take, dobj: id });
  if (!takeResult.ok) return takeResult;

  const inner = run(world, takeResult.state);
  return { ...inner, events: [...takeResult.events, ...inner.events] };
}

function playerHas(world: WorldDef, state: GameState, id: ObjectId): boolean {
  const loc = objectLocation(world, state, id);
  return loc === 'inventory' || loc === 'worn';
}

/** Whether `subject`'s location chain (following `in`/`on`) ever reaches `target` — the containment-loop check (§8 task 8). */
function isNestedInside(world: WorldDef, state: GameState, subject: ObjectId, target: ObjectId): boolean {
  let current: PlaceId = objectLocation(world, state, subject);
  const seen = new Set<ObjectId>();
  while (typeof current === 'object' && ('in' in current || 'on' in current)) {
    const parent = 'in' in current ? current.in : current.on;
    if (parent === target) return true;
    if (seen.has(parent)) break; // defends against an already-corrupt authored cycle elsewhere
    seen.add(parent);
    current = objectLocation(world, state, parent);
  }
  return false;
}

// ---------------------------------------------------------------------------
// Built-ins
// ---------------------------------------------------------------------------

type Builtin = (world: WorldDef, state: GameState, input: ActionInput, verbDef: VerbDef | undefined) => ActionResult;

function builtinTake(world: WorldDef, state: GameState, input: ActionInput, verbDef: VerbDef | undefined): ActionResult {
  const id = input.dobj!;
  const def = world.objects?.[id];
  if (def?.portable !== true) return refuse(world, state, input, verbDef, 'take.notPortable');
  const loc = objectLocation(world, state, id);
  if (loc === 'inventory' || loc === 'worn') return refuse(world, state, input, verbDef, 'take.alreadyHeld');
  if (typeof loc === 'object' && 'in' in loc && !objectState(world, state, loc.in, 'open')) {
    return refuse(world, state, input, verbDef, 'take.containerClosed');
  }
  return succeed(world, state, input, verbDef, [{ move: [id, 'inventory'] }], 'take.success');
}

function builtinDrop(world: WorldDef, state: GameState, input: ActionInput, verbDef: VerbDef | undefined): ActionResult {
  const id = input.dobj!;
  if (objectLocation(world, state, id) !== 'inventory') return refuse(world, state, input, verbDef, 'drop.notHeld');
  return succeed(world, state, input, verbDef, [{ move: [id, state.location] }], 'drop.success');
}

function builtinOpen(world: WorldDef, state: GameState, input: ActionInput, verbDef: VerbDef | undefined): ActionResult {
  const id = input.dobj!;
  if (world.objects?.[id]?.container === undefined) return refuse(world, state, input, verbDef, 'open.notContainer');
  if (objectState(world, state, id, 'open')) return refuse(world, state, input, verbDef, 'open.alreadyOpen');
  if (objectState(world, state, id, 'locked')) return refuse(world, state, input, verbDef, 'open.locked');
  return succeed(world, state, input, verbDef, [{ setState: [id, 'open', true] }], 'open.success');
}

function builtinClose(world: WorldDef, state: GameState, input: ActionInput, verbDef: VerbDef | undefined): ActionResult {
  const id = input.dobj!;
  if (world.objects?.[id]?.container === undefined) return refuse(world, state, input, verbDef, 'close.notContainer');
  if (!objectState(world, state, id, 'open')) return refuse(world, state, input, verbDef, 'close.alreadyClosed');
  return succeed(world, state, input, verbDef, [{ setState: [id, 'open', false] }], 'close.success');
}

function builtinLock(world: WorldDef, state: GameState, input: ActionInput, verbDef: VerbDef | undefined): ActionResult {
  const id = input.dobj!;
  const key = world.objects?.[id]?.container?.key;
  if (key === undefined) return refuse(world, state, input, verbDef, 'lock.notLockable');
  if (objectState(world, state, id, 'open')) return refuse(world, state, input, verbDef, 'lock.mustCloseFirst');
  if (objectState(world, state, id, 'locked')) return refuse(world, state, input, verbDef, 'lock.alreadyLocked');
  if (input.iobj !== undefined) {
    if (input.iobj !== key) return refuse(world, state, input, verbDef, 'lock.wrongKey');
  } else if (!playerHas(world, state, key)) {
    return refuse(world, state, input, verbDef, 'lock.noKey');
  }
  return succeed(world, state, input, verbDef, [{ setState: [id, 'locked', true] }], 'lock.success');
}

function builtinUnlock(world: WorldDef, state: GameState, input: ActionInput, verbDef: VerbDef | undefined): ActionResult {
  const id = input.dobj!;
  const key = world.objects?.[id]?.container?.key;
  if (key === undefined) return refuse(world, state, input, verbDef, 'unlock.notLockable');
  if (!objectState(world, state, id, 'locked')) return refuse(world, state, input, verbDef, 'unlock.alreadyUnlocked');
  if (input.iobj !== undefined) {
    if (input.iobj !== key) return refuse(world, state, input, verbDef, 'unlock.wrongKey');
  } else if (!playerHas(world, state, key)) {
    return refuse(world, state, input, verbDef, 'unlock.noKey');
  }
  return succeed(world, state, input, verbDef, [{ setState: [id, 'locked', false] }], 'unlock.success');
}

function builtinPutIn(world: WorldDef, state: GameState, input: ActionInput, verbDef: VerbDef | undefined): ActionResult {
  const dobj = input.dobj!;
  return withImplicitTake(world, state, dobj, (world, state) => {
    const iobj = input.iobj;
    if (iobj === undefined || world.objects?.[iobj]?.container === undefined) {
      return refuse(world, state, input, verbDef, 'putIn.notContainer');
    }
    if (dobj === iobj || isNestedInside(world, state, iobj, dobj)) return refuse(world, state, input, verbDef, 'putIn.loop');
    if (!objectState(world, state, iobj, 'open')) return refuse(world, state, input, verbDef, 'putIn.closedContainer');
    return succeed(world, state, input, verbDef, [{ move: [dobj, { in: iobj }] }], 'putIn.success');
  });
}

function builtinPutOn(world: WorldDef, state: GameState, input: ActionInput, verbDef: VerbDef | undefined): ActionResult {
  const dobj = input.dobj!;
  return withImplicitTake(world, state, dobj, (world, state) => {
    const iobj = input.iobj;
    if (iobj === undefined || world.objects?.[iobj]?.supporter !== true) {
      return refuse(world, state, input, verbDef, 'putOn.notSupporter');
    }
    if (dobj === iobj || isNestedInside(world, state, iobj, dobj)) return refuse(world, state, input, verbDef, 'putOn.loop');
    return succeed(world, state, input, verbDef, [{ move: [dobj, { on: iobj }] }], 'putOn.success');
  });
}

function builtinWear(world: WorldDef, state: GameState, input: ActionInput, verbDef: VerbDef | undefined): ActionResult {
  const id = input.dobj!;
  return withImplicitTake(world, state, id, (world, state) => {
    if (world.objects?.[id]?.wearable !== true) return refuse(world, state, input, verbDef, 'wear.notWearable');
    if (objectLocation(world, state, id) === 'worn') return refuse(world, state, input, verbDef, 'wear.alreadyWorn');
    return succeed(world, state, input, verbDef, [{ move: [id, 'worn'] }], 'wear.success');
  });
}

function builtinRemove(world: WorldDef, state: GameState, input: ActionInput, verbDef: VerbDef | undefined): ActionResult {
  const id = input.dobj!;
  if (objectLocation(world, state, id) !== 'worn') return refuse(world, state, input, verbDef, 'remove.notWorn');
  return succeed(world, state, input, verbDef, [{ move: [id, 'inventory'] }], 'remove.success');
}

/** READ has no refusal family: every object is expected to declare `text` or `description` (§2.5); a missing pair is a content bug, thrown like other data-integrity reads in this codebase. */
function builtinRead(world: WorldDef, state: GameState, input: ActionInput, verbDef: VerbDef | undefined): ActionResult {
  const id = input.dobj!;
  const def = world.objects?.[id];
  const prose = def?.text ?? def?.description;
  if (prose === undefined) {
    throw new Error(`actions: READ target "${id}" has neither "text" nor "description" to fall back to`);
  }
  const ctx = contextFor(world, input);
  const rendered = render(world, state, ctx.path!, prose, ctx);
  return {
    state: rendered.state,
    events: [{ type: 'line', kind: 'prose', text: rendered.text }],
    consumesTurn: true,
    class: verbDef?.class ?? null,
    ok: true,
  };
}

function builtinTurnOn(world: WorldDef, state: GameState, input: ActionInput, verbDef: VerbDef | undefined): ActionResult {
  const id = input.dobj!;
  if (world.objects?.[id]?.switchable !== true) return refuse(world, state, input, verbDef, 'turnOn.notSwitchable');
  if (objectState(world, state, id, 'on')) return refuse(world, state, input, verbDef, 'turnOn.alreadyOn');
  return succeed(world, state, input, verbDef, [{ setState: [id, 'on', true] }], 'turnOn.success');
}

function builtinTurnOff(world: WorldDef, state: GameState, input: ActionInput, verbDef: VerbDef | undefined): ActionResult {
  const id = input.dobj!;
  if (world.objects?.[id]?.switchable !== true) return refuse(world, state, input, verbDef, 'turnOff.notSwitchable');
  if (!objectState(world, state, id, 'on')) return refuse(world, state, input, verbDef, 'turnOff.alreadyOff');
  return succeed(world, state, input, verbDef, [{ setState: [id, 'on', false] }], 'turnOff.success');
}

const BUILTINS: Partial<Record<VerbId, Builtin>> = {
  [BUILTIN_VERB_IDS.take]: builtinTake,
  [BUILTIN_VERB_IDS.drop]: builtinDrop,
  [BUILTIN_VERB_IDS.open]: builtinOpen,
  [BUILTIN_VERB_IDS.close]: builtinClose,
  [BUILTIN_VERB_IDS.lock]: builtinLock,
  [BUILTIN_VERB_IDS.unlock]: builtinUnlock,
  [BUILTIN_VERB_IDS.putIn]: builtinPutIn,
  [BUILTIN_VERB_IDS.putOn]: builtinPutOn,
  [BUILTIN_VERB_IDS.wear]: builtinWear,
  [BUILTIN_VERB_IDS.remove]: builtinRemove,
  [BUILTIN_VERB_IDS.read]: builtinRead,
  [BUILTIN_VERB_IDS.turnOn]: builtinTurnOn,
  [BUILTIN_VERB_IDS.turnOff]: builtinTurnOff,
};
