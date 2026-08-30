# 08 - Development Handoff

**Spec version:** `0.2.2`

# 1. Purpose

This document tells the coding agent how to interpret the rest of the package.

The agent should treat this as a product specification, not a line-by-line implementation mandate.

---

# 2. Product Requirements vs Implementation Freedom

The following are product requirements:

- browser-first
- suitable for static hosting
- classic text-adventure REPL feel
- deterministic world state
- explicit save/load support
- undo support
- forgiving command interpretation
- AI optional, not authoritative
- authored major prose
- puzzle logic testable
- no hidden unwinnable states
- replay through alternate approaches, not combinatorial branches
- analog evidence as a major world mechanic
- slow-burn mystery
- current story canon preserved

The agent may choose:

- internal folder structure
- state library
- parser implementation
- persistence library
- test framework
- component design
- data formats
- authoring formats
- build tooling

---

# 3. Recommended Early Milestones

## Milestone 0: Foundation

Build:

- repository skeleton
- documentation integration
- CI if useful
- static deployment
- core command loop
- deterministic state container
- save/load/undo skeleton
- automated tests

No need for sophisticated AI.

## Milestone 1: Opening Room

Implement a polished vertical slice:

- wake on floor
- darkness
- headache
- fedora
- lamp
- pull chain
- desk
- terminal
- at least one locked or hidden object
- first memory fragment
- first reasonable-action jokes
- exit into town

This should establish the quality bar.

## Milestone 2: First Exterior / Town

Implement:

- empty street
- brick buildings
- horses
- glow
- Wall Drug reference
- uncertain time period
- one or two accessible buildings
- first client connection or memory path

## Milestone 3: Client and Missing Sibling

Implement:

- remembered hiring
- sibling claim
- first memory discrepancy
- first evidence that the client may be right
- notebook objective

## Milestone 4: Notebook Trail

Implement:

- loose page 7/8
- `THIS PAGE INTENTIONALLY LEFT BLANK`
- notebook dependency graph
- first analog-vs-digital contradiction

Do not rush into late-game simulation revelations.

The milestone list above is a build order, not a story. Each milestone's
spec must state its causal link to the previous one in `BUT` / `THEREFORE`
terms (design constitution §29; the current chain is in
`02-story-world-canon.md` §21). "And then the player reaches the town" is
a warning sign, not a plan.

---

# 4. Content Modeling

Prefer data-driven modeling for:

- rooms
- objects
- exits
- NPCs
- memories
- clues
- puzzle flags
- command handlers
- alternate solutions

The goal is to make narrative logic inspectable and testable.

Avoid burying story state inside UI components.

---

# 5. Parser Strategy

Start simple.

First support:

- movement
- look
- inventory
- take/drop
- open/close
- read
- examine
- use
- ask/talk
- simple prepositions

Add synonym normalization.

Then add semantic or LLM fallback only when the deterministic parser cannot confidently interpret a command.

Do not make the project dependent on AI during the first playable build.

---

# 6. Authoring Strategy

Major content should be explicitly authored.

The engine should make it easy to write:

- default object descriptions
- verb-specific responses
- state-dependent variants
- optional jokes
- clue responses
- failure responses
- memory triggers

The authoring model should encourage the classic feeling:

> "The game anticipated that."

---

# 7. State and Save Safety

All progress-critical state should be serializable.

Support:

- autosave
- manual save
- undo
- migration
- restart encounter

Never rely on browser memory alone.

---

# 8. Difficulty Target

Do not imitate *HHGTTG's* cruelty.

Do imitate the classics' ability to make a small amount of authored content feel deep.

Difficulty should come from:

- inference
- observation
- interconnected clues
- understanding world rules
- choosing among approaches

not:

- parser fights
- arbitrary vocabulary
- hidden dependency traps
- exact move timing
- irreversible mistakes

---

# 9. First-Playable Quality Bar

The opening room should already demonstrate:

- narrator voice
- rich object interaction
- deterministic state
- forgiving parser
- one meaningful deduction
- one joke
- one memory trigger
- one mystery hook
- one secret or optional interaction

Do not treat the opening as disposable tutorial content.

It should feel like the game immediately.

---

# 10. Documentation Discipline

As implementation proceeds:

- update canon docs when decisions become firm
- mark abandoned ideas explicitly
- keep backlog separate from canon
- version spec changes
- add architecture docs only when architecture becomes real

Do not let implementation silently redefine story canon.

---

# 11. Definition of Success

The project succeeds when a player who has never heard of *Zork* becomes absorbed enough to:

- try strange commands
- form theories
- remember clues
- laugh at the narrator
- get stuck for interesting reasons
- feel rewarded for solving something
- want to know what happened
- discover that the world is larger than expected
- consider playing again differently

The target is not historical recreation.

The target is to recreate the **engagement** that made the best classic text adventures memorable.
