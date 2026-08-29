# Development Process

This is the long-form rationale behind `CLAUDE.md`. `CLAUDE.md` is loaded on
every turn and stays short; this file explains *why* and is read when needed.

## Why a multi-agent, multi-model setup

The project is built almost entirely by AI agents orchestrated from a Claude
Code session, with Ryan as designer, author-of-record for story canon, and
final taste authority. Two forces shape the process:

1. **Quality has to be very high in two specific places** — the engine's
   foundational design (schemas, parser, save format) and the prose. Both are
   expensive to get wrong: a bad schema means rewriting every room; bad prose
   *is* a bad game.
2. **Token cost scales with context, not with model price.** The main session's
   context is re-read on every turn and grows monotonically. Anything that
   keeps file contents, test logs, and grep output *out* of it is worth more
   than any per-token price difference between models.

So the design is: a small number of expensive calls at phase boundaries
(architecture, planning, prose), a large number of cheap, context-isolated
calls in the middle (implementation, verification, data plumbing), and a main
session that holds decisions rather than files.

## The routing heuristic

**Route by blast radius and reversibility, not by difficulty.**

"Hard → big model" fails in practice because everything feels hard and the
whole workload drifts upward. Instead: decisions that are costly to unwind go
to the top tier; work whose correctness a test can prove goes to the bottom.
The combat resolver is *harder* than the item schema, but a bad resolver is
one file's rewrite and a bad schema is every room's — so the resolver goes to
Sonnet with tests and the schema goes to Fable.

Applied to this project, the two top tiers go to **architecture** and
**prose**. Code is the middle.

## The roster

See the table in `CLAUDE.md`. Definitions live in `.claude/agents/`. Notes:

- **Main session model switches by phase.** Fable while writing specs,
  architecture, and plans (the conversation is where the design gets made,
  and capping it at a lower tier caps the design). Opus during execution,
  where the job is decomposition, routing, and review — good Opus work, and
  the main context is the worst place to run the most expensive model for
  months. Switching is instant (`/model`) and context carries over.
- While main is on Fable, `game-architect` mostly idles; main does that work
  itself. The roster stays correct under both settings.
- `narrative-writer` started life as a Haiku "content-scribe" on the theory
  that world content is data entry. The spec killed that idea: 20–30k
  authored words with a specific narrator voice and a bar of "someone
  actually thought about what would happen if I tried this." Haiku's role
  narrowed to `world-scribe` (mechanical transforms) and `scout` (lookups).
- `playtester` is planned, not yet defined. It needs the headless CLI
  (Milestone 0) to exist. Its job — play from a script, report every parser
  miss and every reasonable action that got a flat refusal — directly
  audits constitution rules 12 and 14.

## The token rules, expanded

1. **Delegate the read, keep the conclusion.** A subagent's file reads and
   test output never enter the main context; only its report does. This is
   the single biggest lever and applies to every tier.
2. **Plans are the interface.** The architect writes plans in
   `docs/superpowers/plans/`. Each builder gets one task section and file
   paths. Context-assembly cost stays constant as the game grows.
3. **Content is data.** Typed data files, authored against a schema, checked
   by a test. Volume work never touches an expensive model except for the
   prose itself.
4. **Verification happens inside the subagent.** "17 pass / 0 fail," not a
   log. Logs surface only on failure.
5. **One agent, one module.** Sprawl is a scoping error; send it back.
6. **Escalate, never guess.** Every cheap agent has a hard instruction to stop
   on ambiguity. An agent that guesses costs more than one that stops.
7. **Decide once, write it down.** ADRs in `docs/decisions/`; spec updates
   for story decisions. No future agent re-derives, no future session
   re-litigates.

**Escalation ladder.** Two failures at Sonnet on the same task mean the task
is mis-specified. It goes *up* to the architect, never sideways to another
builder. Cheap retries are how budgets evaporate.

## How a feature flows

1. **Brainstorm** (main session, `superpowers:brainstorming`): classify,
   question, propose approaches, present design, get Ryan's approval. For
   architectural work, write a spec to `docs/superpowers/specs/`.
2. **Plan** (`game-architect` or main-on-Fable, `superpowers:writing-plans`):
   tasks sized for one Sonnet builder each, tests named first.
3. **Per task:** worktree → `game-builder` (TDD) → `qa-verifier` →
   `code-reviewer` → `superpowers:verification-before-completion`.
4. **Prose** for the feature: `narrative-writer` drafts → main reviews for
   voice and canon → `world-scribe` wires it in → Ryan spot-checks in the
   game and may veto or claim pieces.
5. **Merge** to `main`, which deploys. `CHANGELOG.md` `[Unreleased]` updated
   in the same PR. Release = version bump + tag (see below).

## Prose review gate

`narrative-writer` (Opus) drafts against the writing guide. The main session
reviews every piece for voice and canon before it is wired into data. Ryan
reads it in the game and can veto anything; he may also claim specific pieces
(family scenes, Dad, particular jokes) to write or rewrite himself at any time
— such tasks are tagged `ryan-authored` and the writer leaves a labeled
placeholder. Placeholder prose never reaches `main`.

## Canon discipline

The spec uses four labels: `CANON`, `WORKING IDEA`, `POSSIBILITY`, `BACKLOG`.
Only Ryan promotes a label. Agents propose promotions in reports. Implementing
a `POSSIBILITY` as if it were decided is a blocking review finding. When a
decision becomes firm, the spec doc is updated in the same change, the doc's
`Spec version` line is bumped with the project version, and abandoned ideas
are marked rather than deleted (spec 08 §10).

## Versioning and releases

One SEMVER version covers the spec and the game (the spec README's ladder:
0.1.0 foundation → 0.2.0 first playable opening → … → 1.0.0). Policy:

- **MAJOR** — breaks saved games or story canon.
- **MINOR** — new player-visible content, or a milestone.
- **PATCH** — fixes and tuning.

Release checklist: bump `GAME_VERSION` (engine constant) and `package.json`;
move `[Unreleased]` to `## [x.y.z] - date` in `CHANGELOG.md`; update the
status board in `BACKLOG.md`; `git tag vX.Y.Z && git push --tags`. A Vitest
test asserts the three version strings agree, so a forgotten bump fails CI.
The in-game `VERSION` command prints it, which doubles as a live-deploy check.

## Documentation set

| File | Role |
|---|---|
| `README.md` | Play link, docs link, quick start |
| `CLAUDE.md` | Agent instructions: hard rules, routing, workflow |
| `CHANGELOG.md` | Keep a Changelog; the release record |
| `BACKLOG.md` | Build queue and milestone status board |
| `docs/spec/` | Design canon (nine docs + README) |
| `docs/spec/07-…` | Creative open questions — a separate queue from `BACKLOG.md` |
| `docs/decisions/` | ADRs |
| `docs/DEVELOPMENT.md` | This file |
| `docs/ARCHITECTURE.md` | Added when architecture is real (Milestone 0) |
| `docs/superpowers/{specs,plans}` | Design and plan trail |

The public docs site at `/docs/` is generated from these files at build time
(ADR 0006). Markdown is the only source of truth.

## Adding an agent

Add a file to `.claude/agents/` with `name`, `description` (this is what the
main session sees when deciding whether to use it — make it precise about
when *not* to use it), `model`, and a `tools` allowlist if the agent should
not edit. Give it: what it owns, hard rules, an escalate-never-guess clause,
and a report format. Add a row to the routing table in `CLAUDE.md`.
