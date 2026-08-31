// The Prose engine (spec §2.2, §8 task 4) — one type serves every room
// description, object/verb response, and dialogue slot, with state-
// dependent variants and per-node rotation.
//
// This module supersedes the MVP's `src/engine/text.ts`: that file's
// `fill()` would have worked unchanged, but it lives in a module that also
// exports `formatSay()`, which imports `SAY_SPECIAL` from `../content`.
// The task constraint is that the engine must not import from
// `src/content/`, and importing anything from `text.ts` pulls its whole
// module graph — including that content import — along for the ride.
// Rather than split `text.ts` (out of scope for this task, and `text.ts`
// is MVP code slated for retirement alongside `step.ts`/`parser.ts` in
// task 22), `prose.ts` reimplements the same `{key}` substitution
// mechanism locally, so it stays a leaf the engine can depend on cleanly.
//
// PATH ID CONVENTION — every later task and every content author depends
// on this:
//
//   Callers supply a stable `path` string that mirrors the authored data
//   shape, e.g. `room.hotel_204.description`, `object.brass_key.take`,
//   `npc.mara.topics.wallet`. Use dots for nesting exactly as the content
//   file nests it. Two nodes collide only if they are, in fact, the same
//   authored slot, because the path *is* that slot's address — there is no
//   separate id to keep in sync by hand.
//
//   When `prose` is a `ProseRule[]`, the rule that matches is itself a
//   distinct node from its siblings (each rule can carry its own
//   independent rotation), so `render` addresses it as `${path}[i]` where
//   `i` is the matched rule's index in the array — e.g.
//   `room.hotel_204.description[1]`, matching the example in spec §2.2.
//   Callers never construct this suffixed form themselves; they always
//   pass the bare family path and let `render` derive the node.

import type { Cond } from './cond';
import { evaluate } from './cond';
import type { GameState, WorldDef } from './world';

export type Prose = string | string[] | ProseRule[] | ProseRef;

/**
 * Indirection into `world.responses` — the global families of §3.6 (e.g.
 * `unknown`, `nounMiss`, `unknownVerbKnownNoun`). Lets a handler write
 * `{ say: { ref: 'takeDefault' } }` instead of duplicating a shared family
 * inline. `render` resolves it against `world.responses`, one hop at a
 * time, chasing chains of refs but refusing to recurse through a cycle
 * (see `select` below).
 */
export interface ProseRef {
  ref: string;
}

export interface ProseRule {
  /** Omit to always match. First matching rule in the array wins. */
  when?: Cond;
  /** `string[]` rotates, indexed by this rule's own per-node counter. */
  text: string | string[] | ProseRef;
  /**
   * v0.15.1: with a `string[]`, play index 0 exactly once, then rotate
   * among the rest forever — the "first attempt, then a rotation of two"
   * shape the prose docs use for greetings and refusals, which a plain
   * modulo cycle wraps back to the long first line on the fourth try.
   */
  firstOnce?: boolean;
}

function isProseRef(value: unknown): value is ProseRef {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && 'ref' in value;
}

/** Values available to `{name}`, `{dobj}`, `{iobj}`, `{topic}` templating. */
export interface ProseContext {
  name?: string;
  dobj?: string;
  iobj?: string;
  topic?: string;
  /**
   * Space-separated placeholder keys whose values are proper names (an
   * NPC's `name`, v0.8.0). Authored families say "The {iobj} looks at it",
   * which is right for a brass key and wrong for Jack: when a listed key's
   * value is capitalized, the article in front of its placeholder is
   * dropped ("Jack looks at it"). A lowercase name ("the guide") keeps it.
   * Only the NPC-facing render sites set this; objects never do.
   */
  proper?: string;
  [key: string]: string | undefined;
}

export interface ProseResult {
  text: string;
  /**
   * Rotation reads and writes `state.counters` (§1.2), so rendering is not
   * a pure read — it returns the state to continue threading through
   * `step`/undo, rather than mutating its input or reaching for a
   * module-level variable. When nothing rotated, this is the same `state`
   * reference that was passed in.
   */
  state: GameState;
}

/** Replace `{key}` placeholders from `ctx`; an unresolved key is left as-is. */
function fillTemplate(template: string, ctx: ProseContext): string {
  const proper = new Set((ctx.proper ?? '').split(' ').filter(Boolean));
  const articled = proper.size === 0
    ? template
    : template.replace(/\b(?:[Tt]he|[Aa]n?) \{(\w+)\}/g, (whole, key: string) => {
        const value = ctx[key];
        return proper.has(key) && value !== undefined && /^[A-Z]/.test(value) ? `{${key}}` : whole;
      });
  return articled.replace(/\{(\w+)\}/g, (whole, key: string) => ctx[key] ?? whole);
}

/**
 * Resolves `prose` against `state` to the text/node-path pair that should
 * be rendered, without touching rotation yet. Throws if `prose` is a
 * `ProseRule[]` and no rule matches — content authoring should always
 * supply an unconditional fallback rule (validated by task 7), so reaching
 * the end of the array with no match is a data bug, not a case to render
 * silently.
 *
 * `ProseRef` (top-level, or as a rule's `text`) is resolved against
 * `world.responses` one hop at a time. `visited` tracks the family names
 * already chased in this call's chain so a cycle throws instead of
 * recursing forever — an unknown ref throws too (task 7's `validate`
 * catches both at content-load time; `render` must never render a `ref`
 * as silent empty text). Deliberately loud rather than a diagnostic event:
 * both are data bugs the content author must fix, not player-facing
 * situations to degrade gracefully around, and a thrown error fails the
 * content test immediately instead of shipping a blank line.
 *
 * `path`/`node` are **not** touched by ref resolution — per §2.2, rotation
 * counters key off the referencing node (the `path` the caller passed, or
 * `${path}[i]` for a matched rule), never off the resolved family's own
 * name. That is what lets two handlers share one family and still rotate
 * independently.
 */
function select(
  world: WorldDef,
  state: GameState,
  path: string,
  prose: Prose,
  visited: Set<string> = new Set(),
): { text: string | string[]; node: string; firstOnce: boolean } {
  if (isProseRef(prose)) {
    if (visited.has(prose.ref)) {
      throw new Error(`prose.render: "${path}" has a cyclic ref chain through "${prose.ref}"`);
    }
    const family = world.responses?.[prose.ref];
    if (family === undefined) {
      throw new Error(`prose.render: "${path}" refs unknown family "${prose.ref}"`);
    }
    return select(world, state, path, family, new Set(visited).add(prose.ref));
  }

  if (typeof prose === 'string') return { text: prose, node: path, firstOnce: false };

  if (prose.length === 0) {
    throw new Error(`prose.render: "${path}" has no variants/rules to select from`);
  }

  if (typeof prose[0] === 'string') {
    // string[] rotation family — the whole array is one node.
    return { text: prose as string[], node: path, firstOnce: false };
  }

  const rules = prose as ProseRule[];
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i]!;
    if (rule.when === undefined || evaluate(world, state, rule.when)) {
      const node = `${path}[${i}]`;
      if (isProseRef(rule.text)) {
        return select(world, state, node, rule.text, visited);
      }
      return { text: rule.text, node, firstOnce: rule.firstOnce === true };
    }
  }
  throw new Error(`prose.render: no rule of "${path}" matched, and none is unconditional`);
}

/**
 * Renders a `Prose` node to text. `path` is the node's stable id per the
 * convention documented at the top of this file — the same `path` must be
 * passed on every render of the same authored slot for rotation to work.
 */
export function render(
  world: WorldDef,
  state: GameState,
  path: string,
  prose: Prose,
  ctx: ProseContext = {},
): ProseResult {
  const { text, node, firstOnce } = select(world, state, path, prose);

  if (typeof text === 'string') {
    return { text: fillTemplate(text, ctx), state };
  }

  if (text.length === 0) {
    throw new Error(`prose.render: "${node}" has zero rotation variants`);
  }

  const n = state.counters[node] ?? 0;
  const chosen = text[firstOnce && text.length > 1 ? (n === 0 ? 0 : 1 + ((n - 1) % (text.length - 1))) : n % text.length]!;
  const counters = { ...state.counters, [node]: n + 1 };
  return { text: fillTemplate(chosen, ctx), state: { ...state, counters } };
}
