// The `IntentInterpreter` seam (spec §3.1, ADR 0004). Player input goes in,
// `InterpretOutcome` comes out; the engine downstream of `step()` never
// sees raw text again — only `StructuredAction`s. `DeterministicParser` is
// v1's only implementation. A future AI adapter (`LocalLLMAdapter` /
// `RemoteLLMAdapter`, named in spec §3.1 as future slots) would implement
// this same interface and could therefore only ever change *which*
// `InterpretOutcome` it produces for a given input — never engine
// semantics, since the engine only ever consumes the outcome shape.
//
// SCOPE (task 9 — see the plan's own scope-discipline note): tokenizing,
// verb/pattern matching, and vocabulary compilation, in `./parser/`.
// Noun-phrase RESOLUTION against scope, disambiguation, and pronoun
// handling are task 10's; `ALL`/`AND`/`BUT`/`GO TO`/`AGAIN` are task 11's.
// `DeterministicParser.interpret()` below is therefore a real,
// correctly-typed skeleton: the `V` pattern (no noun phrase to resolve)
// resolves fully today; every pattern that needs a `dobj`/`iobj`/`npc`
// resolved reports a `miss` (carrying the recognized verb, per §3.6 rung
// 4) rather than inventing a fake resolution — task 10 replaces that one
// branch with real scope resolution and disambiguation, without needing to
// touch tokenizing/grammar/vocabulary at all.
//
// `StructuredAction`/`ParserContext` are defined here rather than
// `gamestate.ts` (not this task's to touch — see that file's own header,
// which names "tasks 9-11" as the ones that add `parser: ParserContext`
// back onto `GameState` once `StructuredAction` exists). This task creates
// the type; wiring a `parser` field onto `GameState` is left to whichever
// of task 10/11 first needs `pending`/`last` to persist turn-to-turn.

import type { NpcId, ObjectId, VerbId } from './ids';
import type { CompiledVocabulary } from './parser/vocabulary';
import { dropBaseNoise, tokenize } from './parser/tokenize';
import { knownNounsIn, matchGrammar } from './parser/grammar';

/** §3.1's `StructuredAction` — the only shape the engine sees past this seam. */
export interface StructuredAction {
  verb: VerbId;
  dobj?: ObjectId | NpcId;
  prep?: string;
  iobj?: ObjectId | NpcId;
  /** ASK/TELL, raw topic words — never resolved (§3.1). */
  topic?: string;
  /** SAY …, single-field free text. */
  text?: string;
  /** respondToPrompt: all prompt-field values by name. */
  values?: Record<string, string>;
  /** The input line, for echo and history. */
  raw: string;
}

/** §3.3/§3.4's pronoun antecedents and outstanding disambiguation question. */
export interface ParserContext {
  it?: ObjectId;
  him?: NpcId;
  her?: NpcId;
  them?: ObjectId[] | NpcId;
  /** Outstanding "Which do you mean…?" question (§3.3). */
  pending?: {
    verb: VerbId;
    slot: 'dobj' | 'iobj';
    candidates: (ObjectId | NpcId)[];
    partial: Partial<StructuredAction>;
  };
  /** For AGAIN / G (task 11). */
  last?: StructuredAction;
}

/** Read-only view of the world the interpreter needs to resolve input — built by the engine, never mutated here. */
export interface ScopeView {
  vocabulary: CompiledVocabulary;
  visible: (ObjectId | NpcId)[];
  parser: ParserContext;
}

export type InterpretOutcome =
  | { kind: 'actions'; actions: StructuredAction[] } // TAKE ALL → many (task 11)
  | { kind: 'clarify'; question: string; options: string[]; pending: ParserContext['pending'] }
  | { kind: 'miss'; raw: string; verb?: VerbId; knownNouns: string[] };

export interface IntentInterpreter {
  /**
   * Future adapters (`LocalLLMAdapter`, `RemoteLLMAdapter` — spec §3.1)
   * would implement this same interface. v1 ships `DeterministicParser`
   * only (ADR 0004).
   */
  interpret(input: string, view: ScopeView): InterpretOutcome;
}

export class DeterministicParser implements IntentInterpreter {
  interpret(input: string, view: ScopeView): InterpretOutcome {
    const tokens = dropBaseNoise(tokenize(input));
    if (tokens.length === 0) return { kind: 'miss', raw: input, knownNouns: [] };

    const result = matchGrammar(view.vocabulary, tokens, input);

    if (result.kind === 'noVerb') {
      return { kind: 'miss', raw: input, knownNouns: knownNounsIn(view.vocabulary, tokens) };
    }
    if (result.kind === 'noPattern') {
      return { kind: 'miss', raw: input, verb: result.verb, knownNouns: knownNounsIn(view.vocabulary, tokens) };
    }

    const { action } = result;
    if (action.dobj === undefined && action.iobj === undefined && action.npc === undefined) {
      // No noun phrase to resolve ('V' pattern verbs — LOOK, WAIT, meta
      // verbs…): the action is already complete.
      return { kind: 'actions', actions: [{ verb: action.verb, raw: input }] };
    }

    // Noun-phrase resolution against `view.visible` (§3.2) is task 10's.
    // See file header: report a miss carrying the recognized verb rather
    // than guessing a resolution here.
    return { kind: 'miss', raw: input, verb: action.verb, knownNouns: knownNounsIn(view.vocabulary, tokens) };
  }
}
