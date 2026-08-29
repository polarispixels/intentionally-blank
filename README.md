# Intentionally Blank

A browser-based modern text adventure in the lineage of *Zork*, *Deadline*,
*Planetfall*, and *The Hitchhiker's Guide to the Galaxy*: a classic parser
REPL, a deterministic simulated world, forgiving natural-language input, and
authored prose. You wake on the floor of a ransacked room in a silent South
Dakota town, with a headache and no name.

- **Play:** https://polarispixels.github.io/intentionally-blank/ *(not yet
  deployed — Milestone 0)*
- **Docs:** https://polarispixels.github.io/intentionally-blank/docs/ —
  design canon, architecture, changelog, development process (generated
  from this repo's markdown)
- **Changelog:** [CHANGELOG.md](CHANGELOG.md) — one SEMVER version for spec
  and game
- **Backlog:** [BACKLOG.md](BACKLOG.md) — milestone status board
- **Design spec:** [docs/spec/](docs/spec/README.md)
- **Agent instructions:** [CLAUDE.md](CLAUDE.md) — hard rules, model
  routing, and workflow for AI collaborators

## Quick start

Milestone 0 has not landed yet; there is no build to run. When it does:

```sh
npm install
npm run dev       # Vite dev server
npm test          # Vitest — must be green before any change is "done"
npm run play      # headless CLI REPL
npm run build     # dist/ (game) + dist/docs/ (docs site)
```
