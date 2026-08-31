# 0013 — Trailing particles normalize to declared phrasal forms

**Status:** accepted (2026-08-31, Stage F) · **Owner:** main session ·
**Implemented:** `src/engine/parser/grammar.ts` (`phrasalRewrite`),
tests in `tests/parser-grammar.test.ts`.

## Context

The Stage F playtest sweeps found that the single most natural phrasing for
switch- and orientation-verbs — `turn lamp on`, `turn desk over`, `take
fedora off` — failed noun resolution entirely, while `turn on lamp` and
`turn desk` worked. Prefix particle forms had a dedicated longest-match
verb-form; nothing symmetric existed for a particle trailing the dobj.

## Decision

Before ordinary grammar matching, input of the shape `V <phrase> P` is
rewritten to `V P <phrase>` **iff** all three gates pass:

1. **Declared-form gate** — the verb's own word table declares the exact
   two-word form `"V P"` (`turn on`, `take off`, `pick up`, `put down`,
   `put on`, `turn over`, `put together`, …). Content remains the sole
   authority over which verbs are phrasal; the engine adds no vocabulary.
2. **Particle whitelist** — `on off up down over out in together`, a closed
   set that excludes every word shipped content uses as a
   `V dobj prep iobj` preposition (`with to at for about from into through
   past`), so instrument/target commands can never trigger a rewrite.
3. **Exact-form guard** — input verbatim equal to a declared surface form
   (`walk it off`) is never rewritten.

A rewrite that fails to match falls back to the original tokens: no input
that parsed before can stop parsing. The rewrite happens pre-resolution, so
the particle never enters a noun phrase and compound-noun ranking is
untouched by construction.

## Consequences

- `turn lamp on`, `take fedora off`, `pick X up`, `put X down` work
  everywhere their verbs declare the phrasal form.
- `put hat on` (no iobj) parses as WEAR via the declared `put on` form —
  accepted behavior.
- A future phrasal verb only needs its two-word form declared in content;
  if its particle is outside the whitelist, the whitelist is the place to
  extend, and this ADR is the contract to reread before doing so.

## Rejected

Resolution-failure retry in the interpreter (wrong layer — the bad parse
succeeds at grammar level); deriving particles from all two-word forms with
no whitelist (`ask marlow for` would rewrite into the V_ORDER family);
stripping declared `preps` after the dobj (conflates prepositions with
particles — the exact ambiguity the gates exist to prevent).
