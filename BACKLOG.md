# Intentionally Blank — Build Backlog

The **build queue**: what gets implemented next and where each milestone
stands. This is not the creative backlog — unresolved story ideas live in
`docs/spec/07-backlog-and-open-questions.md` and are promoted only by Ryan.

Maintenance rules:

- Update the status board in the same commit as each release.
- When a milestone ships, mark it `✅ shipped vX.Y.0` with one line on what
  actually got built (link the `CHANGELOG.md` entry for detail).
- New items get appended; re-ordering is a deliberate, discussed change.
- Each milestone gets its own spec in `docs/superpowers/specs/` and plan in
  `docs/superpowers/plans/` before implementation starts.

## Full-game build (one continuous run — protocol in `docs/DEVELOPMENT.md`)

| Stage | Scope | Deploy | Status |
|---|---|---|---|
| A | Story + engine architecture: five-act causal spine, puzzle network, room list, NPC agendas, memory system, save/undo design; canon decisions registered in `docs/spec/09` | docs site | 🚧 in progress — **engine architecture deployed v0.2.8** (`docs/superpowers/specs/2026-08-29-stage-a-engine-architecture.md` + ADRs 0008–0010); story architecture in review |
| B | Engine v2 (world model, parser v2, save/undo/autosave, map + open-questions UI) + the opening room (M1) | 0.3.0 | queued |
| C | Act I: town, client, missing sibling, notebook trail (M2–M4) | 0.4–0.6 | queued |
| D | Acts II–III: data center, underground, Dad on the USB, contradictions | 0.7–0.8 | queued |
| E | Acts IV–V: reality travel, identity, the recursive ending | 0.9 | queued |
| F | Hints, playtester sweeps, replay content, polish | 1.0.0 | queued |

Each stage: spec → plan → build → deploy. Ryan plays the live URL at his
discretion and may interrupt; a reset resumes from the last deployed stage.

## Status board

| # | Item | Type | Target version | Status |
|---|---|---|---|---|
| P | Process foundation: CLAUDE.md, agents, ADRs, repo, Pages target | Process | — | ✅ done (unreleased) |
| M0 | MVP "the machine goes": Vite/TS/Vue/Vitest, CI → Pages, docs-site generator, pure reducer engine, parser, modal + credentials joke, GAME OVER/RESTART, headless CLI, version test | Engine + content | 0.2.0 | ✅ shipped v0.2.0 — spec `docs/superpowers/specs/2026-08-29-mvp-design.md` (see CHANGELOG 0.2.0) |
| M1 | Opening Room vertical slice: wake on floor, darkness, headache, fedora, lamp, pull chain, desk, terminal, one locked/hidden object, first memory fragment, first reasonable-action jokes, exit to town | Content + engine | 0.3.0 | 🎯 next up — brainstorm + spec first |
| M2 | First exterior / town: empty street, brick buildings, horses, glow, Wall Drug billboard, uncertain era, one or two buildings, first client connection or memory path | Content | 0.4.0 | idea |
| M3 | Client and missing sibling: remembered hiring, sibling claim, first memory discrepancy, first evidence the client may be right, notebook objective | Content | 0.5.0 | idea |
| M4 | Notebook trail: loose page 7/8, THIS PAGE INTENTIONALLY LEFT BLANK, notebook dependency graph, first analog-vs-digital contradiction | Content | 0.6.0 | idea |
| A1 | `playtester` agent (the headless CLI exists as of v0.2.0: `npm run play -- --script <file> --fast`) | Process | with M1 | queued |

Milestone definitions come from `docs/spec/08-development-handoff.md` §3.
Version targets follow the ladder in `docs/spec/README.md` and may shift.

## Notes carried out of the MVP (v0.2.0)

- Verbs players will try that the MVP parser sends to `unknown` — cheap
  eggs for M1: `inventory`/`i`, `x screen`/`x computer`/`x cursor`/`x
  window`, `stand`/`get up`/`leave`, `wait`/`z`, `sing`, `xyzzy`, `sudo`,
  `google <thing>`/`search <thing>`, `close`/`cancel` at the modal, `undo`
  after game over.
- Response-variant rotation is indexed by `turn`, which freezes in the
  prompt/over phases, so refusal variants never rotate. M1's world model
  should index rotation by a per-response counter.
- ~~The CLI's readline loop can interleave input during beat delays; a bad
  `--script` path prints a raw stack trace.~~ **Fixed in v0.2.7**: commands
  queue behind the flush, and argument errors print one line on stderr with
  exit 1. Covered by `tests/cli.test.ts`.
- `describeAction` echo vocabulary lives in the engine; if the echo ever
  becomes authored (e.g. "You say: …"), move it to content.
- Save/undo: the `promptFailed` path is not recorded in the transcript and
  the modal's error/hint visibility is UI-only; a save taken at
  `loginAttempts: 2` would reopen a bare modal. Derive `revealHint` from
  `loginAttempts` when saves exist.
- ~~A command typed during the paced beat sequence is discarded after
  flushing (the input clears before the flush check).~~ **Fixed in v0.2.7**:
  the beats flush and the command then runs; a bare Enter only flushes.
- ~~`tests/purity.test.ts` regex-strips string literals without token
  context.~~ **Fixed in v0.2.6**: replaced with a real scanner in
  `tests/helpers/source-scan.ts` (comments, all three string forms,
  template interpolation, regex literals, regex-vs-division), plus a
  separate import-specifier check. Mutation-tested against an injected
  `window.location` and an injected `vue` import.

## Notes carried into the M1 design

- The opening-room schema cannot be "minimal, refactor later": it must
  already express state-dependent variants, memory triggers, and multiple
  solution classes or M1 gets rewritten.
- Soft NPC schedules (Deadline-style) are the hardest engine feature to
  bolt on afterward. The world model needs a clock from day one even if
  nothing uses it in M1.
- The behavioral profile (analytical / social / direct) is nearly free if
  every structured action carries a class tag from the start.
