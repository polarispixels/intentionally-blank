// The `Effect` DSL and its interpreter (spec §2.3, ADR 0008, §8 task 5).
//
// `apply()` is the workhorse a later task's `step` (task 8+) calls to turn
// an authored `Effect[]` list into a state transition plus the events a
// shell renders. It is pure: every write below builds a *new* object via
// spreads — never a mutation of `world`/`state`/`effects`/`ctx` — which is
// what `tests/effects.test.ts` proves by deep-freezing the inputs and
// asserting `apply()` doesn't throw (a frozen object throws on mutation
// under the strict mode ES modules always run in).
//
// Effects apply in sequence and each one sees the *previous* effect's
// state (`apply` threads a running `state` through the list, not the
// original `state` passed in) — this is what keeps `{ say: Prose }`'s
// rotation counter (task 4) advancing across a handler's whole effect
// list, and what lets an `inc` after a `set` see the value it just set.
//
// Reads never index `state.flags`/`state.questions` directly — `set`/`inc`/
// `dec` go through `cond.ts`'s `flag()` resolver even though they're
// writes, because `inc`/`dec` need the *resolved* current value (which may
// be the content default) to compute the new one (§1.2.1).

import type { ClueId, FlagId, FlagValue, MemoryId, NpcId, ObjectId, PlaceId, QuestionId, RoomId, ScriptId } from './ids';
import type { Cond } from './cond';
import { evaluate, flag } from './cond';
import type { Prose, ProseContext } from './prose';
import { render } from './prose';
import type { Clock, GameEvent, GameState, NpcOverlay, ObjectOverlay, WorldDef } from './world';

export type Effect =
  | { say: Prose }
  | { set: [FlagId, FlagValue] }
  | { inc: FlagId }
  | { dec: FlagId }
  | { setProp: [ObjectId | NpcId, string, FlagValue] }
  | { move: [ObjectId, PlaceId] } // 'nowhere' destroys; 'inventory' gives
  | { reveal: ObjectId } // hidden:false
  | { setState: [ObjectId, 'open' | 'locked' | 'on', boolean] }
  | { moveNpc: [NpcId, RoomId | 'offstage' | 'schedule'] } // 'schedule' unpins
  | { setFollowing: [NpcId, boolean] }
  | { grantMemory: MemoryId }
  | { grantClue: ClueId }
  | { openQuestion: QuestionId }
  | { answerQuestion: QuestionId }
  | { goto: RoomId } // relocate player (with look)
  | { advanceClock: number } // minutes, beyond the per-turn default
  | { checkpoint: string } // emit checkpoint event (§5.6)
  | { die: string }
  | { end: string }
  | { openPrompt: string } // prompt id defined in a script table
  | { if: { when: Cond; then: Effect[]; else?: Effect[] } }
  | { script: { id: ScriptId; args?: Record<string, FlagValue> } }; // escape hatch

/**
 * Threaded through every `say` render as the `ProseContext` (`{name}`,
 * `{dobj}`, `{iobj}`, `{topic}` templating). `path`, when supplied, is the
 * stable authored id of the *whole effects list* being applied — e.g.
 * `'object.floor_lamp.handlers[0]'` for a handler's `effects` array — not
 * of any one `say` inside it.
 *
 * **Rotation paths inside the list are derived, not passed (spec §2.3).**
 * Requiring every caller to thread a distinct `ctx` per `say` effect is a
 * footgun that gets tripped eventually: two `say`s in one handler would
 * quietly share a rotation counter, the exact bug class task 4 fixed.
 * Instead `apply` derives each effect's own render path as
 * `${ctx.path}.effect[i]` from its index `i` in the list — the same way
 * `render` derives `${path}[i]` from a matched `ProseRule`'s index (§2.2).
 * Nesting extends the same convention recursively: an `if` effect at index
 * `i` gives its `then`/`else` branch its own base, `${ctx.path}.effect[i]
 * .then` / `.else` (kept distinct from each other too, so a branch that
 * stops matching and later matches again doesn't inherit rotation state
 * from the sibling branch that ran instead), and each effect inside that
 * branch derives `.effect[j]` off of *that* the same way. A `{ script }`
 * effect's `ScriptFn` doesn't receive `ctx` at all (its signature is fixed
 * by spec §2.3) — a script that wants rotating prose calls `render`/`apply`
 * itself, under a path of its own choosing (its registered `ScriptId` is a
 * natural, already-unique namespace for this).
 *
 * Callers therefore supply **one path per handler**, not one per effect;
 * omitting `path` entirely (isolated unit tests exercising one arm) falls
 * back to a constant base, fine for a test in isolation but wrong for
 * content that needs its rotation to survive save/load under a stable id.
 */
export interface EffectContext extends ProseContext {
  path?: string;
}

export interface ApplyResult {
  state: GameState;
  events: GameEvent[];
}

const MINUTES_PER_DAY = 1440;

/** Applies one `Effect[]` list in order, threading state through the sequence. */
export function apply(world: WorldDef, state: GameState, effects: readonly Effect[], ctx: EffectContext = {}): ApplyResult {
  let current = state;
  const events: GameEvent[] = [];
  effects.forEach((effect, index) => {
    const result = applyOne(world, current, effect, ctx, index);
    current = result.state;
    events.push(...result.events);
  });
  return { state: current, events };
}

/** `${ctx.path}.effect[i]` (spec §2.3) — every effect's derived, index-based node id. */
function derivedPath(ctx: EffectContext, index: number): string {
  return `${ctx.path ?? 'effect'}.effect[${index}]`;
}

/**
 * The `move` primitive, exported so a content script can call it directly
 * instead of poking `state.objects` itself — that's what makes the
 * plot-critical guard (§2.5) something "scripts cannot bypass": a script
 * that goes through this function to relocate an object gets the guard for
 * free, the same way the `move` Effect arm does below.
 */
export function move(world: WorldDef, state: GameState, id: ObjectId, place: PlaceId): ApplyResult {
  if (isPlotCriticalRefusal(world, id, place)) {
    return {
      state,
      events: [
        {
          type: 'diag',
          code: 'plotCriticalGuard',
          detail: `move refused: "${id}" is plotCritical and cannot go to ${JSON.stringify(place)}`,
        },
      ],
    };
  }
  return { state: patchObject(state, id, { location: place }), events: [] };
}

function isPlotCriticalRefusal(world: WorldDef, id: ObjectId, place: PlaceId): boolean {
  if (world.objects?.[id]?.plotCritical !== true) return false;
  if (place === 'nowhere') return true;
  return typeof place === 'object' && 'npc' in place;
}

function applyOne(world: WorldDef, state: GameState, effect: Effect, ctx: EffectContext, index: number): ApplyResult {
  if ('say' in effect) {
    const rendered = render(world, state, derivedPath(ctx, index), effect.say, ctx);
    return { state: rendered.state, events: [{ type: 'line', kind: 'prose', text: rendered.text }] };
  }

  if ('set' in effect) {
    const [id, value] = effect.set;
    return { state: { ...state, flags: { ...state.flags, [id]: value } }, events: [] };
  }

  if ('inc' in effect || 'dec' in effect) {
    const id = 'inc' in effect ? effect.inc : effect.dec;
    const currentValue = flag(world, state, id);
    if (typeof currentValue !== 'number') {
      throw new Error(`effects.apply: cannot ${'inc' in effect ? 'inc' : 'dec'} non-numeric flag "${id}" (${JSON.stringify(currentValue)})`);
    }
    const value = currentValue + ('inc' in effect ? 1 : -1);
    return { state: { ...state, flags: { ...state.flags, [id]: value } }, events: [] };
  }

  if ('setProp' in effect) {
    return { state: setProp(world, state, ...effect.setProp), events: [] };
  }

  if ('move' in effect) {
    const [id, place] = effect.move;
    return move(world, state, id, place);
  }

  if ('reveal' in effect) {
    return { state: patchObject(state, effect.reveal, { hidden: false }), events: [] };
  }

  if ('setState' in effect) {
    const [id, key, value] = effect.setState;
    return { state: patchObject(state, id, { [key]: value } as Partial<ObjectOverlay>), events: [] };
  }

  if ('moveNpc' in effect) {
    const [id, target] = effect.moveNpc;
    const overlay: NpcOverlay = { ...(state.npcs[id] ?? {}) };
    if (target === 'schedule') delete overlay.room; // unpins: position derives from schedule (task 13)
    else overlay.room = target;
    return { state: { ...state, npcs: { ...state.npcs, [id]: overlay } }, events: [] };
  }

  if ('setFollowing' in effect) {
    const [id, following] = effect.setFollowing;
    return { state: patchNpc(state, id, { following }), events: [] };
  }

  if ('grantMemory' in effect) {
    const id = effect.grantMemory;
    if (state.memories.includes(id)) return { state, events: [] }; // already granted: no duplicate entry, no re-fired event
    const def = world.memories?.[id];
    if (def === undefined) throw new Error(`effects.apply: grantMemory "${id}" is not declared in world.memories`);
    return { state: { ...state, memories: [...state.memories, id] }, events: [{ type: 'memory', id, lines: def.lines }] };
  }

  if ('grantClue' in effect) {
    const id = effect.grantClue;
    if (state.clues.includes(id)) return { state, events: [] };
    const def = world.clues?.[id];
    if (def === undefined) throw new Error(`effects.apply: grantClue "${id}" is not declared in world.clues`);
    return { state: { ...state, clues: [...state.clues, id] }, events: [{ type: 'clue', id, title: def.title }] };
  }

  if ('openQuestion' in effect || 'answerQuestion' in effect) {
    const id = 'openQuestion' in effect ? effect.openQuestion : effect.answerQuestion;
    const status: 'open' | 'answered' = 'openQuestion' in effect ? 'open' : 'answered';
    const def = world.questions?.[id];
    if (def === undefined) throw new Error(`effects.apply: question "${id}" is not declared in world.questions`);
    return {
      state: { ...state, questions: { ...state.questions, [id]: status } },
      events: [{ type: 'question', id, status, text: def.text }],
    };
  }

  if ('goto' in effect) {
    // Relocating the player is the state change this arm owns; the "with
    // look" room re-description it implies (§2.3's comment) is the step
    // loop's job (task 8+), which re-renders the destination room after
    // any effect list that changed `location` — not this module's call.
    return { state: { ...state, location: effect.goto }, events: [] };
  }

  if ('advanceClock' in effect) {
    return { state: { ...state, clock: addMinutes(state.clock, effect.advanceClock) }, events: [] };
  }

  if ('checkpoint' in effect) {
    // Session persistence of the snapshot (§5.6) is task 18's; here we only
    // emit the event that tells it to.
    return { state, events: [{ type: 'checkpoint', id: effect.checkpoint }] };
  }

  if ('die' in effect) {
    return { state: { ...state, phase: 'dead', ending: { id: effect.die } }, events: [{ type: 'died', deathId: effect.die }] };
  }

  if ('end' in effect) {
    return { state: { ...state, phase: 'ended', ending: { id: effect.end } }, events: [{ type: 'ended', endingId: effect.end }] };
  }

  if ('openPrompt' in effect) {
    // Deliberately a no-op here. The `prompt` GameEvent needs
    // title/body/fields (§1.4); this Effect arm carries only a bare id,
    // and no WorldDef table maps prompt ids to that content yet — §2.3
    // says modal content and credential checking are "a script effect,
    // not engine," so the real mechanism is expected to be a
    // `{ script: { id, args } }` effect that builds the full `prompt`
    // event itself. Applying a state change or fabricating placeholder
    // title/body/fields here would be half-building what task 18
    // (session) owns; left as a documented pass-through instead.
    return { state, events: [] };
  }

  if ('if' in effect) {
    const holds = evaluate(world, state, effect.if.when);
    const branch = holds ? effect.if.then : (effect.if.else ?? []);
    // Nest under this if's own derived slot, further split by which
    // branch ran, so (a) an inner `say` never collides with a `say`
    // elsewhere in the outer list, and (b) `then` and `else` don't share
    // rotation state with each other across turns where the condition
    // flips (spec §2.3).
    const nestedPath = `${derivedPath(ctx, index)}.${holds ? 'then' : 'else'}`;
    return apply(world, state, branch, { ...ctx, path: nestedPath });
  }

  if ('script' in effect) {
    const fn = world.scripts?.[effect.script.id];
    if (fn === undefined) throw new Error(`effects.apply: script "${effect.script.id}" is not registered in world.scripts`);
    return fn(world, state, effect.script.args);
  }

  throw new Error(`effects.apply: unhandled Effect ${JSON.stringify(effect)}`);
}

function patchObject(state: GameState, id: ObjectId, patch: Partial<ObjectOverlay>): GameState {
  const overlay: ObjectOverlay = { ...(state.objects[id] ?? {}), ...patch };
  return { ...state, objects: { ...state.objects, [id]: overlay } };
}

function patchNpc(state: GameState, id: NpcId, patch: Partial<NpcOverlay>): GameState {
  const overlay: NpcOverlay = { ...(state.npcs[id] ?? {}), ...patch };
  return { ...state, npcs: { ...state.npcs, [id]: overlay } };
}

/**
 * `setProp` targets `ObjectId | NpcId` — both are plain (branded) strings
 * at runtime, so there is no tag to switch on. Membership in
 * `world.objects` (this task's minimal authoring slice, see world.ts) is
 * the disambiguator: a declared object writes to the object overlay,
 * anything else is assumed to be an NPC. A world must declare every object
 * it targets with `setProp` in `world.objects` for this to resolve
 * correctly.
 */
function setProp(world: WorldDef, state: GameState, id: ObjectId | NpcId, key: string, value: FlagValue): GameState {
  if (world.objects?.[id as ObjectId] !== undefined) {
    const oid = id as ObjectId;
    const overlay = state.objects[oid] ?? {};
    const props = { ...(overlay.props ?? {}), [key]: value };
    return { ...state, objects: { ...state.objects, [oid]: { ...overlay, props } } };
  }
  const nid = id as NpcId;
  const overlay = state.npcs[nid] ?? {};
  const props = { ...(overlay.props ?? {}), [key]: value };
  return { ...state, npcs: { ...state.npcs, [nid]: { ...overlay, props } } };
}

/** Adds `minutes` to `clock`, rolling over into following days (or back, for a negative amount). */
function addMinutes(clock: Clock, minutes: number): Clock {
  const totalFromDayOne = (clock.day - 1) * MINUTES_PER_DAY + clock.minute + minutes;
  const day = Math.floor(totalFromDayOne / MINUTES_PER_DAY) + 1;
  const minute = ((totalFromDayOne % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return { day, minute };
}
