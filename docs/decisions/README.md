# Architecture Decision Records

Settled decisions. Agents read these instead of re-deriving. To change one,
write a new ADR that supersedes it; do not edit history.

| # | Decision | Status |
|---|---|---|
| [0001](0001-static-github-pages.md) | Static site on GitHub Pages, built by Actions | accepted |
| [0002](0002-stack.md) | TypeScript, Vue 3, Vite, Vitest | accepted |
| [0003](0003-pure-engine.md) | Engine is pure TypeScript with no browser imports | accepted |
| [0004](0004-no-ai-in-v1.md) | No AI intent interpretation in v1 | accepted |
| [0005](0005-single-version-and-changelog.md) | One SEMVER version and changelog for spec + game | accepted |
| [0006](0006-docs-site-generated.md) | Public docs site generated from repo markdown | accepted |
| [0007](0007-model-tiering.md) | Multi-model agent roster routed by blast radius | accepted |
| [0008](0008-declarative-content-with-script-escape-hatch.md) | Content is declarative data with a pure-script escape hatch | accepted |
| [0009](0009-overlay-state-and-versioned-saves.md) | Runtime state is an overlay; saves are versioned with fixtures | accepted |
| [0010](0010-session-layer-owns-persistence.md) | A pure session layer owns persistence, undo, and checkpoints | accepted |
| [0011](0011-calendar-and-world-assembly.md) | The calendar, and one world assembled from act slices | accepted |
| [0012](0012-the-ending-that-continues.md) | The recursive ending continues into the opening room; nothing crosses it | accepted |

Format: Context → Decision → Consequences. Keep each under a page.
