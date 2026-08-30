// Normalization + tokenizing (spec §3.2's "normalize (MVP rules kept) →
// tokenize" step; §3.7's forgiving-language checklist: case, punctuation,
// articles, polite noise).
//
// CARRIED FROM THE MVP (`src/engine/parser.ts`, which this module must not
// import — it pulls in content transitively via its siblings, see that
// module's header): straighten curly quotes, collapse whitespace,
// lowercase, strip trailing `.!?`, and unwrap a fully-quoted line. The MVP
// used quote-wrapping to detect `SAY "..."`; v2's grammar has no `SAY`
// pattern yet (that verb's own `V` vs. free-text handling is content's
// call once `vocabulary.ts` seeds it), so this module keeps only the
// normalization half and drops the MVP's `SAY`-specific branch.
//
// NOISE WORDS — split into two tiers, and this split is the finding worth
// recording: `the`/`a`/`an`/`please`/`just` are unconditionally noise —
// no verb ever needs them as a grammar token. `at` is NOT unconditionally
// dropped here, even though the task brief lists it alongside
// please/just, because `at` is also a real, declared preposition for some
// verbs (`throw chair at window` — §3.7's throw-at-converges-with-break
// case). Dropping it in the tokenizer would delete the exact token the
// `V dobj prep iobj` pattern needs to find. So `at` is context-dependent
// noise, resolved per-verb in `grammar.ts` (dropped only when the matched
// verb does NOT declare `at` as one of its `preps`) — `dropBaseNoise` here
// only ever strips the words that are noise for every verb, unconditionally.

const QUOTES = /^["'“”‘’](.*)["'“”‘’]$/;

/** Lowercase, collapse whitespace, straighten apostrophes, strip wrapping quotes and trailing .!? */
export function normalizeInput(input: string): string {
  let s = input.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[‘’]/g, "'");
  s = s.replace(/(\S)[.!?]+$/, '$1').trim();
  const q = s.match(QUOTES);
  if (q) s = q[1]!.trim();
  return s;
}

/** Splits a normalized line into whitespace-delimited word tokens. Empty input yields `[]`. */
export function tokenize(input: string): string[] {
  const normalized = normalizeInput(input);
  if (normalized === '') return [];
  return normalized.split(' ').filter((t) => t.length > 0);
}

/** Words that are always noise, regardless of which verb is being matched. */
const ARTICLES = new Set(['the', 'a', 'an']);
const ALWAYS_NOISE = new Set(['please', 'just']);

/**
 * Single source of truth for "always noise" words — `dropBaseNoise` below
 * and `validate.ts`'s noise-word-in-vocabulary rule both read from this
 * export; neither redeclares the word list. Deliberately excludes `at` —
 * see file header for why it's context-dependent, not unconditional noise.
 */
export const NOISE_WORDS: ReadonlySet<string> = new Set([...ARTICLES, ...ALWAYS_NOISE]);

/**
 * Drops articles and unconditional polite noise. Does NOT drop `at` — see
 * file header. `grammar.ts` applies the context-dependent second pass once
 * it knows which verb (and therefore which `preps`) it is matching against.
 */
export function dropBaseNoise(tokens: string[]): string[] {
  return tokens.filter((t) => !NOISE_WORDS.has(t));
}
