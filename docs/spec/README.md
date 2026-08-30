# Intentionally Blank — Design Specification

**Project:** Browser-based modern text adventure
**Working title:** *Intentionally Blank*
**Repository:** `polarispixels/intentionally-blank`
**Spec version:** `0.2.2`
**Status:** Early creative and product foundation

## Purpose

This package captures the current creative canon, game-design principles,
gameplay expectations, technical product requirements, narrative voice, and
unresolved ideas for *Intentionally Blank*.

The project is intentionally inspired by the strengths of classic interactive
fiction such as:

- *Colossal Cave Adventure*
- *Zork*
- *Deadline*
- *Planetfall*
- *The Hitchhiker's Guide to the Galaxy*
- *A Mind Forever Voyaging*

The goal is not to imitate those games mechanically or stylistically. The goal
is to preserve what made them compelling, remove their worst usability
problems, and use modern browser technology to build a game that can engage
intelligent modern players who may never have played a classic parser
adventure.

## Core Product Goal

Create a text adventure that repeatedly produces four reactions:

1. **"That's funny."**
2. **"Wait, what?"**
3. **"I have an idea."**
4. **"Ohhh. That thing from three hours ago."**

The game should reward observation, experimentation, memory, deduction, and
curiosity.

## Documentation Map

| Document | Purpose |
|---|---|
| `00-overview.md` | Executive product and story summary |
| `01-design-constitution.md` | Lessons from classic text adventures and standing design rules |
| `02-story-world-canon.md` | Current story canon, setting, mystery structure, and reveals |
| `03-characters-and-relationships.md` | Family, client, missing sibling, father, and recurring character concepts |
| `04-gameplay-and-puzzle-systems.md` | Puzzle philosophy, memory, analog artifacts, inventory, branching, and recurring mechanics |
| `05-ui-parser-and-save-system.md` | Browser UI, command parsing, AI boundary, state, save/load, and technical requirements |
| `06-narrative-tone-and-writing-guide.md` | Voice, atmosphere, vocabulary, humor, reading level, and prose standards |
| `07-backlog-and-open-questions.md` | Unresolved choices, optional ideas, and future content backlog |
| `08-development-handoff.md` | Guidance for the coding agent and implementation boundaries |

The public docs site renders all of these as one navigable page, so there is
no separate single-file master copy (ADR 0005, 0006).

## Canon Labels

Throughout the package, ideas should be interpreted using these labels:

- **CANON**: Decided and should be preserved unless intentionally revised.
- **WORKING IDEA**: Strong current direction, but still open to refinement.
- **POSSIBILITY**: Intentionally unresolved or speculative.
- **BACKLOG**: Good idea not yet integrated into the main story.

Only Ryan promotes a label. Agents propose promotions in their reports.

## Versioning

Treat documentation as source code. One SEMVER version covers the spec and
the game; the record is the root `CHANGELOG.md`.

Suggested early version progression:

```text
v0.1.0  Initial planning foundation
v0.2.0  Minimal playable prototype ("the machine goes")
v0.3.0  First playable opening room
v0.4.0  First exterior / town
v0.5.0  Client and missing sibling
v0.6.0  Notebook trail
...
v1.0.0  Complete first game
```

The coding agent should update these docs as story and system decisions
become canon, bumping each doc's `Spec version` line with the release.
