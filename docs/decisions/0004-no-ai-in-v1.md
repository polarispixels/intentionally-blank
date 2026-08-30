# ADR 0004: No AI intent interpretation in v1

**Status:** accepted · 2026-08-29

## Context

The spec permits an optional AI intent interpreter as a fallback behind the
deterministic parser (05 §7–9) but says "Do not make the project dependent
on AI during the first playable build" (08 §5). A static site (ADR 0001)
cannot hold an API key, and a local browser model would be a multi-gigabyte
download the spec forbids requiring.

## Decision

- v1 ships with **no AI of any kind**. The deterministic parser plus synonym
  layer must carry the game alone, and constitution §12/§14 (forgiving
  language, acknowledge obvious ideas) are met by authored coverage, not by
  a model.
- The engine exposes an `IntentInterpreter` interface with a single
  `DeterministicParser` implementation. `LocalLLMAdapter` /
  `RemoteLLMAdapter` are named in the interface's doc comment as future
  slots and nothing more.
- *Status at v0.2.0:* the prototype ships the bare `parse(input): Action`
  function as the interpreter; the `IntentInterpreter` interface and
  `DeterministicParser` class land with Milestone 1's world model. The rule
  (no AI, engine sees only structured actions) is unchanged.
- The `playtester` agent is the tool for finding parser gaps.

## Consequences

- Parser vocabulary and synonym coverage become a first-class content
  concern, tracked like prose.
- Adding an AI adapter later is additive and cannot change engine semantics,
  because the engine only ever sees structured actions.
