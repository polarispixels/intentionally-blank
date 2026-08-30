# ADR 0008: Content is declarative data with a pure-script escape hatch

**Status:** accepted · 2026-08-29

## Context

ADR 0003 says content is "typed data with no logic beyond declarative
conditions." Engine v2 (Stage A spec) needs content to express
state-dependent prose, memory triggers, multi-route puzzles, and NPC
schedules — but also genuinely bespoke sequences (the credentials terminal,
poker, resource trading) that a condition/effect DSL would express badly.
Two failure modes bracket the choice: functions sprinkled through content
files (untestable, unserializable, uninspectable) versus a DSL that grows
into an accidental programming language.

## Decision

- Content is serializable data authored against the `Cond`/`Effect`/`Prose`
  DSL in the Stage A spec. The DSL deliberately has **no loops, no
  arithmetic beyond inc/dec/atLeast, and no randomness**.
- Bespoke logic lives in `src/content/scripts/` as **pure functions**
  `(world, state, args) → { state, events }`, registered by `ScriptId` and
  invoked only via the `{ script: … }` effect. The purity test covers them;
  each is unit-testable alone.
- `src/engine/` never imports `src/content/` (reversal of the MVP
  dependency). Every engine function takes `WorldDef` as a parameter; engine
  tests run on fixture worlds.
- When scripts repeat a pattern roughly three times, the pattern is promoted
  into the DSL — a `game-architect` decision, since it changes the schema.
- `validate(world)` (engine) enforces referential integrity: exits, flags,
  prose refs, script ids, and the authoring rules the spec names.

## Consequences

- A writer can author a room from the schema reference alone; every room is
  inspectable and diffable, and content bugs fail `npm test`.
- The no-randomness rule keeps every playthrough replayable, which the save
  system's replay invariant (ADR 0009) depends on.
- Refines ADR 0003's content clause; does not supersede it.
