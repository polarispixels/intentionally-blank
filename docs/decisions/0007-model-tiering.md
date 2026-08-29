# ADR 0007: Multi-model agent roster routed by blast radius

**Status:** accepted · 2026-08-29

## Context

The project is built by AI agents from a Claude Code session. Ryan asked for
a multi-agent architecture that minimizes token consumption while holding
quality: larger models for high-level work, smaller ones for routine work.
See `docs/DEVELOPMENT.md` for the full rationale.

## Decision

- **Routing heuristic:** by blast radius and reversibility, not difficulty.
  Expensive-to-unwind decisions go up; test-provable work goes down.
- **Roster** (definitions in `.claude/agents/`): `game-architect` (Fable),
  `narrative-writer` (Opus), `code-reviewer` (Opus), `game-builder`
  (Sonnet), `qa-verifier` (Sonnet, no edit), `world-scribe` (Haiku),
  `scout` (Haiku, read-only); `playtester` (Sonnet) once the CLI exists.
- **Main session** runs Fable during spec/architecture/planning phases and
  Opus during execution.
- **Seven token rules** and the **escalation ladder** in `CLAUDE.md` govern
  how work is handed off. Context isolation (subagent reads never enter the
  main context) is the primary cost lever; model tiering is secondary.
- **Prose review gate:** writer drafts → main reviews voice/canon → Ryan
  spot-checks and may veto or claim any piece.

## Consequences

- The roster is a hypothesis. If a tier under-delivers (e.g. Haiku
  `world-scribe` making subtle data errors), the fix is to move that one
  agent up, not to abandon tiering. Record such changes as a superseding
  ADR.
- Fable-tier subagents are the least operationally proven piece; the first
  `game-architect` call doubles as a smoke test, with Opus as fallback.
