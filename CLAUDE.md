# Intentionally Blank

A browser-based modern text adventure in the Infocom lineage: parser REPL,
deterministic world model, forgiving language, authored prose, slow-burn
mystery. Spec v0.1.0 — see `docs/spec/`.

- **Play:** https://polarispixels.github.io/intentionally-blank/ (GitHub
  Pages, built by Actions from `main`; deploy = merge to `main`).
- **Docs site:** https://polarispixels.github.io/intentionally-blank/docs/ —
  generated at build time from the markdown in this repo. Markdown is the only
  source of truth. Never hand-edit generated HTML.
- **Repo:** `polarispixels/intentionally-blank` (local checkout `~/code/blank`).
- **Design canon:** `docs/spec/` — nine numbered docs. Read
  `docs/spec/README.md` first; `08-development-handoff.md` is the contract for
  interpreting the rest.
- **Process:** `docs/DEVELOPMENT.md` (why the rules below exist) and
  `docs/decisions/` (ADRs: settled — do not re-derive).
- **Queues:** `BACKLOG.md` = build queue + milestone status board.
  `docs/spec/07-backlog-and-open-questions.md` = creative open questions.
  Different queues; don't merge them.
- **Changelog:** `CHANGELOG.md` (Keep a Changelog). One SEMVER version covers
  spec and game together.

## Hard rules

1. **Canon labels are promoted only by Ryan.** `CANON` / `WORKING IDEA` /
   `POSSIBILITY` / `BACKLOG`. An agent may *propose* a promotion in its
   report; it may not edit a label. Implementation never silently redefines
   story canon (spec 08 §10).
2. **Docs are source code.** When a decision becomes firm it is written into
   the spec or an ADR in the same change as the code. Abandoned ideas are
   marked abandoned, not deleted.
3. **The engine is pure TypeScript.** `src/engine/` has zero DOM, Vue, or
   browser imports. Every game behavior is exercisable in a Vitest test with
   no browser. Vue is only the REPL shell. (ADR 0003)
4. **AI interprets intent; the engine owns reality.** No AI of any kind in
   v1. The deterministic parser must carry the game alone. `IntentInterpreter`
   is an interface with a no-op adapter. (ADR 0004)
5. **Authored prose, never generated at runtime.** Room descriptions, object
   responses, jokes, dialogue, and memory fragments are written by
   `narrative-writer` against `docs/spec/06-narrative-tone-and-writing-guide.md`,
   reviewed by the main session for voice and canon, and spot-checked by Ryan,
   who may claim any piece to write or rewrite himself. Placeholder prose
   never reaches `main`.
6. **Verify before claiming done.** `npm test` green, and for anything
   player-visible a headless CLI transcript. Report failures verbatim.
7. **Versioning — every merge to `main` is a release.** MAJOR = breaks
   saves or story canon; MINOR = new player-visible content or a milestone;
   PATCH = fixes, tuning, docs. No change reaches `main` without: bump
   `GAME_VERSION` and `package.json`, add `## [x.y.z]` to `CHANGELOG.md`
   (never leave work under `[Unreleased]`), bump the `Spec version` line of
   any spec doc touched, update the `BACKLOG.md` board if a milestone moved,
   `git tag vX.Y.Z`. A test enforces that the version strings match. In-game
   `VERSION` prints it. Ryan's rule: *always update the version number.*

## Model routing

Route by **blast radius and reversibility, not difficulty**. Decisions that are
expensive to unwind (schemas, parser grammar, save format, interfaces) go up.
Work a test can prove goes down. The two top tiers go to architecture and
prose; code is the middle.

| Agent | Model | Owns |
|---|---|---|
| main session | **Fable** while writing specs, architecture, and plans; **Opus** during execution (switch with `/model`) | orchestration, decomposition, integration, reviewing subagent output, talking to Ryan |
| `game-architect` | Fable | world model, parser grammar, data schemas, save format, specs and implementation plans, bugs that span modules |
| `narrative-writer` | Opus | all authored prose |
| `code-reviewer` | Opus | adversarial pre-merge review, including canon-label and doc-sync checks |
| `game-builder` | Sonnet | TDD implementation of one planned task in one module |
| `qa-verifier` | Sonnet | runs suites, reproduces bugs, diagnoses; cannot edit |
| `world-scribe` | Haiku | mechanical transforms only: synonym tables, wiring approved prose into data files, reference validation |
| `scout` | Haiku | "where is X" lookups; read-only |
| `playtester` | Sonnet | *(added with the headless CLI)* plays from a script; reports parser misses and unacknowledged reasonable actions |

If a Fable subagent will not spawn, run it on Opus and say so in the report.
While the main session is on Fable, it does the architect's work itself
rather than round-tripping to a same-tier subagent.

## Token rules

1. **Delegate the read, keep the conclusion.** Never pull files into the main
   context to answer something a subagent can answer.
2. **Plans are the interface.** A builder receives one task section from
   `docs/superpowers/plans/*.md` plus file paths — never a re-narration of
   the project.
3. **Content is data.** Rooms, objects, and prose live in typed data files
   authored against a schema and validated by tests.
4. **Verification happens inside the subagent.** Report "N pass / M fail";
   raw logs only on failure.
5. **One agent, one module.** A task touching three subsystems is mis-scoped —
   send it back to the architect.
6. **Escalate, never guess.** On ambiguity, stop and report. This rule is
   what makes Haiku safe to use.
7. **Decide once, write it down.** Settled → ADR or spec, in the same change.

**Escalation ladder:** a builder that fails the same task twice does not get a
third try. Two failures at Sonnet mean the task spec is wrong, not the code;
it goes back up to the architect, never sideways to another builder.

## Workflow

`brainstorming` (main session) → `writing-plans` (architect) → per task:
`using-git-worktrees` → `game-builder` with `test-driven-development` →
`qa-verifier` → `code-reviewer` → `verification-before-completion` → merge →
`CHANGELOG.md`. Features branch off `main`; `main` always deploys.

## Layout (target; Milestone 0 makes it real)

```text
src/engine/      pure TS: world model, parser, actions, state, save/undo
src/content/     typed data: rooms, objects, NPCs, memories, prose
src/ui/          Vue REPL shell
src/cli/         headless runner for tests and the playtester agent
tests/           Vitest
docs/spec/       design canon (nine docs)
docs/decisions/  ADRs
docs/superpowers/{specs,plans}
tools/           docs-site generator, version check
```
