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

## Status board

| # | Item | Type | Target version | Status |
|---|---|---|---|---|
| P | Process foundation: CLAUDE.md, agents, ADRs, repo, Pages target | Process | — | ✅ done (unreleased) |
| M0 | Foundation: repo skeleton, Vite/TS/Vue/Vitest, CI → Pages, docs-site generator, core command loop, deterministic state container, save/load/undo skeleton, headless CLI, version test | Engine | 0.1.x | 🎯 next up — brainstorm + spec first |
| M1 | Opening Room vertical slice: wake on floor, darkness, headache, fedora, lamp, pull chain, desk, terminal, one locked/hidden object, first memory fragment, first reasonable-action jokes, exit to town | Content + engine | 0.2.0 | queued |
| M2 | First exterior / town: empty street, brick buildings, horses, glow, Wall Drug billboard, uncertain era, one or two buildings, first client connection or memory path | Content | 0.3.0 | idea |
| M3 | Client and missing sibling: remembered hiring, sibling claim, first memory discrepancy, first evidence the client may be right, notebook objective | Content | 0.4.0 | idea |
| M4 | Notebook trail: loose page 7/8, THIS PAGE INTENTIONALLY LEFT BLANK, notebook dependency graph, first analog-vs-digital contradiction | Content | 0.5.0 | idea |
| A1 | `playtester` agent (needs M0's headless CLI) | Process | with M0/M1 | queued |

Milestone definitions come from `docs/spec/08-development-handoff.md` §3.
Version targets follow the ladder in `docs/spec/README.md` and may shift.

## Notes carried into the M0 design

- The opening-room schema cannot be "minimal, refactor later": it must
  already express state-dependent variants, memory triggers, and multiple
  solution classes or M1 gets rewritten.
- Soft NPC schedules (Deadline-style) are the hardest engine feature to
  bolt on afterward. The world model needs a clock from day one even if
  nothing uses it in M1.
- The behavioral profile (analytical / social / direct) is nearly free if
  every structured action carries a class tag from the start.
