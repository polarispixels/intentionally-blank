// Pattern matching against `VerbDef.patterns` (spec §3.2, §2.9). Matches a
// tokenized input against the compiled vocabulary's verb forms and
// produces an `UnresolvedAction` — a `StructuredAction` shape with every
// noun phrase left as a raw word span, adjective/noun split but NOT
// resolved against scope. That resolution (candidates in scope, adjective
// filtering, disambiguation) is task 10's; this module's job ends at
// grammar.

import type { VerbId } from './../ids';
import type { CompiledVerb, CompiledVocabulary, VerbPattern } from './vocabulary';

/**
 * A noun phrase as the grammar layer sees it: the raw word span, split into
 * adjectives (all but the last word) and the head noun (the last word) —
 * "candidates = things in scope whose nouns match the head noun; adjectives
 * filter" (§3.2). This is the seam task 10 resolves against `ScopeView`.
 */
export interface UnresolvedNounPhrase {
  /** Every word in the phrase, in order, exactly as tokenized (post-noise-drop). */
  words: string[];
  /** `words[0 .. -2]` */
  adjectives: string[];
  /** `words[-1]` — never empty when `words` itself is non-empty. */
  noun: string;
}

function toPhrase(words: string[]): UnresolvedNounPhrase {
  return { words, adjectives: words.slice(0, -1), noun: words[words.length - 1]! };
}

/**
 * `StructuredAction` (§3.1) with `dobj`/`iobj`/`npc` left as
 * `UnresolvedNounPhrase`s instead of resolved ids, and `topic` already
 * final — per §3.1, `StructuredAction.topic` is raw topic words, never
 * resolved, so there is nothing for task 10 to do to it.
 */
export interface UnresolvedAction {
  verb: VerbId;
  pattern: VerbPattern;
  dobj?: UnresolvedNounPhrase;
  prep?: string;
  iobj?: UnresolvedNounPhrase;
  npc?: UnresolvedNounPhrase;
  topic?: string;
  raw: string;
}

export type GrammarResult =
  | { kind: 'matched'; action: UnresolvedAction }
  /** No token sequence at the start of input matches any known verb surface form. */
  | { kind: 'noVerb' }
  /**
   * A verb was recognized, but the remaining tokens fit none of its declared
   * patterns. `word` is the surface form that actually matched the input
   * (`CompiledVerb.words` joined — "sweep", not the verb's canonical
   * "feel around"), so the `bareVerb` family downstream can echo what the
   * player typed instead of a synonym they never used (Stage F sweep).
   */
  | { kind: 'noPattern'; verb: VerbId; word: string };

/** Literal separator for the `V npc about topic` pattern (spec §2.9) — not a `VerbDef.preps` entry; "about" is the pattern's own grammar, the same way "V dobj prep iobj" bakes in the two-slot shape. */
const ABOUT = 'about';
const FOR = 'for';

/**
 * Every verb form whose words are a prefix of `tokens`, at exactly
 * `wordLen` words — `vocab.verbForms`, filtered and length-checked.
 */
function candidatesAtLength(vocab: CompiledVocabulary, tokens: string[], wordLen: number): CompiledVerb[] {
  return vocab.verbForms.filter(
    (v) => v.words.length === wordLen && v.words.every((w, i) => tokens[i] === w),
  );
}

/**
 * The second, context-dependent noise pass (see `tokenize.ts`'s header):
 * drops "at" unless the matched verb declares it as a real preposition.
 */
function dropContextualNoise(tokens: string[], preps: string[]): string[] {
  if (preps.includes('at')) return tokens;
  return tokens.filter((t) => t !== 'at');
}

/** Finds the first token (at index ≥ 1, so `dobj` is never empty) that is one of `preps`. */
function findPrepIndex(tokens: string[], preps: string[]): number {
  for (let i = 1; i < tokens.length; i++) {
    if (preps.includes(tokens[i]!)) return i;
  }
  return -1;
}

function tryPattern(verb: CompiledVerb, pattern: VerbPattern, tokens: string[], raw: string): UnresolvedAction | undefined {
  if (pattern === 'V') {
    if (tokens.length !== 0) return undefined;
    return { verb: verb.id, pattern, raw };
  }

  if (pattern === 'V dobj') {
    if (tokens.length === 0) return undefined;
    return { verb: verb.id, pattern, dobj: toPhrase(tokens), raw };
  }

  if (pattern === 'V dobj prep iobj') {
    const i = findPrepIndex(tokens, verb.preps);
    if (i === -1 || i === tokens.length - 1) return undefined; // no prep found, or nothing after it
    const dobjTokens = tokens.slice(0, i);
    const iobjTokens = tokens.slice(i + 1);
    if (dobjTokens.length === 0 || iobjTokens.length === 0) return undefined;
    return { verb: verb.id, pattern, dobj: toPhrase(dobjTokens), prep: tokens[i]!, iobj: toPhrase(iobjTokens), raw };
  }

  // 'V npc about topic'. Only the npc slot is required non-empty — "about"
  // may legitimately be the last token ("ask marlow about", nothing after
  // it), producing `topic: ''` rather than failing the pattern outright
  // (front-desk-prose appendix §14: a half-formed ABOUT needs the npc
  // resolved so `respond.ts`/`npc.ts` can answer with the dedicated
  // "you didn't finish that thought" family instead of falling all the way
  // to the generic bareVerb rung, which used to be the only place this
  // input could land).
  // "ask pearl FOR pie" (v0.9.0, the Act I playthrough): FOR is accepted
  // as the separator too — asking someone for a thing is asking about it,
  // and the topic tables answer it. Whichever comes first wins.
  const aboutIndex = tokens.findIndex((t) => t === ABOUT || t === FOR);
  if (aboutIndex <= 0) return undefined;
  const npcTokens = tokens.slice(0, aboutIndex);
  const topicTokens = tokens.slice(aboutIndex + 1);
  return { verb: verb.id, pattern, npc: toPhrase(npcTokens), topic: topicTokens.join(' '), raw };
}

/**
 * Fixed try-order, most-slots-first, independent of `VerbDef.patterns`'
 * declaration order. `'V dobj'` matches ANY non-empty remaining token span
 * — including one that also contains a preposition and instrument (`break
 * window with chair`) — so trying it before `'V dobj prep iobj'` would
 * always win and permanently swallow the instrument into the noun phrase.
 * A verb that legitimately declares both (BREAK: "break window" alone, or
 * "break window with chair") needs the more specific shape tried first;
 * this ordering makes that authoring-order-independent rather than a
 * footgun content has to remember.
 */
const PATTERN_SPECIFICITY: readonly VerbPattern[] = ['V dobj prep iobj', 'V npc about topic', 'V dobj', 'V'];

function patternsBySpecificity(patterns: readonly VerbPattern[]): VerbPattern[] {
  return PATTERN_SPECIFICITY.filter((p) => patterns.includes(p));
}

/**
 * The closed set of English phrasal-verb particles the trailing-particle
 * rewrite (see `matchGrammar`) will move: "turn lamp ON" → "turn on lamp".
 * Deliberately EXCLUDES every word that serves as a `V dobj prep iobj`
 * preposition or a pattern separator in shipped content — `with`, `to`,
 * `at`, `for`, `about`, `from`, `into`, `through`, `past` — so the rewrite
 * can never eat the prep of a genuine two-slot parse ("unlock hatch with
 * keyring", "give hat to marlow") or the separator of `V npc about topic`
 * ("ask marlow for"). A particle here still only ever fires when the verb's
 * OWN word table declares the exact two-word form ("turn on", "take off",
 * "pick up") — the set gates which second words may be treated as movable,
 * content gates which verbs actually move them.
 */
const PHRASAL_PARTICLES: ReadonlySet<string> = new Set(['on', 'off', 'up', 'down', 'over', 'out', 'in', 'together']);

/** True when some declared verb surface form is exactly `words`. */
function hasExactForm(vocab: CompiledVocabulary, words: string[]): boolean {
  return vocab.verbForms.some((f) => f.words.length === words.length && f.words.every((w, i) => words[i] === w));
}

/**
 * "V dobj P" → "V P dobj" (Stage F sweep): when the input starts with a
 * verb word, ends with a phrasal particle, and the verb's own table
 * declares the two-word form `[first, particle]` ("turn on", "take off",
 * "pick up", "put down", "turn over", "put together"), return the tokens
 * rewritten to the declared prefix order so ordinary longest-match handles
 * it. `undefined` = not this shape; caller matches the original tokens.
 *
 * Guard: never rewrites input that IS a declared surface form verbatim
 * ("walk it off", act3's V_PACE) — an exact form always means itself.
 */
function phrasalRewrite(vocab: CompiledVocabulary, tokens: string[]): string[] | undefined {
  if (tokens.length < 3) return undefined;
  const first = tokens[0]!;
  const last = tokens[tokens.length - 1]!;
  if (!PHRASAL_PARTICLES.has(last)) return undefined;
  if (!hasExactForm(vocab, [first, last])) return undefined;
  if (hasExactForm(vocab, tokens)) return undefined;
  return [first, last, ...tokens.slice(1, -1)];
}

/**
 * Matches tokenized input against the compiled vocabulary's verbs and their
 * declared patterns (spec §3.2). Word length is tried longest-first — "turn
 * on lamp" tries `['turn','on']` before `['turn']`, so it never leaves a
 * stray "on" in the noun phrase. Within one word length, more than one verb
 * can legitimately claim the same word (e.g. `put` for both PUT IN and PUT
 * ON, real fixture content — see `validate.ts`'s vocabulary-collision
 * report for when that's flagged): every same-length candidate is tried in
 * table order, and the first whose own pattern/preposition actually fits
 * the remaining tokens wins — "put key in box" and "put hat on hook" both
 * resolve correctly even though PUT_IN and PUT_OUT share the word, because
 * only one candidate's declared `preps` matches the token that's actually
 * there. Only if every same-length candidate's patterns fail to fit does
 * this report `noPattern`, naming the first candidate (table order) as the
 * recognized verb for diagnostics.
 *
 * TRAILING PARTICLES (Stage F): "turn lamp on" is the same command as
 * "turn on lamp" — a phrasal verb's particle floats to the far side of the
 * object in ordinary English. `phrasalRewrite` (above) normalizes that
 * word order to the declared two-word prefix form BEFORE ordinary matching
 * — before, because the one-word verb would otherwise "succeed" at
 * grammar level with the particle swallowed into the noun phrase (`turn
 * lamp on` parsing as TURN with head noun "on"), a miss only surfacing at
 * resolution. A rewrite that matches nothing falls back to the original
 * tokens untouched, so no input that parses today can stop parsing.
 */
export function matchGrammar(vocab: CompiledVocabulary, tokens: string[], raw: string): GrammarResult {
  const rewritten = phrasalRewrite(vocab, tokens);
  if (rewritten !== undefined) {
    const viaParticle = matchTokens(vocab, rewritten, raw);
    if (viaParticle.kind === 'matched') return viaParticle;
  }
  return matchTokens(vocab, tokens, raw);
}

/** One ordinary longest-match pass over `tokens` — `matchGrammar` without the trailing-particle rewrite. */
function matchTokens(vocab: CompiledVocabulary, tokens: string[], raw: string): GrammarResult {
  let i = 0;
  while (i < vocab.verbForms.length) {
    const wordLen = vocab.verbForms[i]!.words.length;
    const candidates = wordLen <= tokens.length ? candidatesAtLength(vocab, tokens, wordLen) : [];

    if (candidates.length > 0) {
      for (const verb of candidates) {
        const rest = tokens.slice(verb.words.length);
        const filtered = dropContextualNoise(rest, verb.preps);
        for (const pattern of patternsBySpecificity(verb.patterns)) {
          const action = tryPattern(verb, pattern, filtered, raw);
          if (action !== undefined) return { kind: 'matched', action };
        }
      }
      return { kind: 'noPattern', verb: candidates[0]!.id, word: candidates[0]!.words.join(' ') };
    }

    // Advance past this whole word-length group (whether or not any of its
    // forms matched the prefix) to the next, shorter one.
    while (i < vocab.verbForms.length && vocab.verbForms[i]!.words.length === wordLen) i++;
  }
  return { kind: 'noVerb' };
}

/** Words in `tokens` that the vocabulary knows as an object/NPC noun or adjective — the §3.6 rung-3/4 "which words looked like nouns" signal. */
export function knownNounsIn(vocab: CompiledVocabulary, tokens: string[]): string[] {
  const known = new Set<string>();
  for (const t of tokens) {
    if (
      vocab.objectNouns.has(t) ||
      vocab.objectAdjectives.has(t) ||
      vocab.npcNouns.has(t) ||
      vocab.npcAdjectives.has(t)
    ) {
      known.add(t);
    }
  }
  return [...known];
}
