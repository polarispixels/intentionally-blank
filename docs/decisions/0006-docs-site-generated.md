# ADR 0006: Public docs site generated from repo markdown

**Status:** accepted · 2026-08-29

## Context

Block-buddies serves a hand-written `docs/index.html` at `/docs/` for
collaborators, with a rule to keep it in sync by hand. Ryan wants the same
two URLs here (game at `/`, docs at `/docs/`). This project already has
~80 KB of markdown design docs; a hand-maintained HTML copy would drift.

## Decision

- A small Node script in `tools/` renders the repo's markdown into a styled
  static docs site at build time: `README.md`, `CHANGELOG.md`, `BACKLOG.md`,
  `docs/DEVELOPMENT.md`, `docs/ARCHITECTURE.md` (once it exists), the ADRs,
  and all of `docs/spec/`.
- Same shape as block-buddies' page: header with version badge, "Play" and
  "Source repo" buttons, table of contents, sectioned body. Light and dark
  friendly.
- It runs as part of `npm run build` and lands in `dist/docs/`.
- Markdown is the only source of truth. Generated HTML is never committed
  or hand-edited.

## Consequences

- "Keep docs in sync" is true by construction: updating the markdown is the
  whole job, and agents already do that.
- The changelog and the current spec appear on the public site
  automatically with every deploy.
- The generator is Milestone 0 work; until then the docs live only in the
  repo.
