# Stage E0 Addendum — The Evidence Cage, After

**Status (main session, 2026-08-31):** wired and shipped v0.16.0 (the cage's post-opening examine; the padlock stays on the hasp).
· **Date:** 2026-09-17
**Covers:** the one gap `2026-09-17-stage-e0-prose.md` §31.3 names — the
evidence cage in the Sheriff's Office has no `examine` for the state after
Whitlock has opened it. Nothing here opens a puzzle, grants a clue, sets a flag
or moves a question. No new object, no new fact.
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md` §5,
§11, `docs/spec/01-design-constitution.md` §8, §9, §14,
`docs/spec/09-canon-decisions.md` entries **37**, **93**, **116**, the E0 prose
document §12, §13 and §31.2, and the shipped `cageExamine` in
`src/content/world/act1/objects/sheriffOffice.ts`.
**Wires into:** `act1/objects/sheriffOffice.ts` — `evidenceCage`'s `EXAMINE`
handler becomes a three-rule `ProseRule[]`. The shipped `cageExamine` string is
unchanged and becomes the last, unconditional rule. The `READ/TAKE/SEARCH`
refusal (`cageOpenText`) is untouched.

Every player-visible word below is inside a fenced `text` block. Nothing else
is.

---

## 1. The cage, open — `EXAMINE CAGE` — two rules above the shipped one

Rule order, first match wins, last rule unconditional:

1. `when: { all: [{ flag: act4_cage_open }, { has: act4_case_notes }] }` → §1.1
2. `when: { flag: act4_cage_open }` → §1.2
3. no `when:` → the shipped `cageExamine`, verbatim

### 1.1 Open, and the notes are out of it — `when: { all: [{ flag: act4_cage_open }, { has: act4_case_notes }] }`

```text
The door stands open on its hinge and the padlock hangs off the hasp by its
shackle, shut on nothing, which is how a lock looks when somebody means to come
back to it. On the third shelf there is a gap at the end the width of a paper
sack, and the bags either side of it have not leaned in to fill it; brown paper
keeps its shape. What came out of the gap is on the counter behind you with its
tag turned face up. The shelf is one short and the room has not noticed.
```

### 1.2 Open, and the bag is still on the shelf — `when: { flag: act4_cage_open }`

```text
The door stands open on its hinge and the padlock hangs off the hasp by its
shackle, shut on nothing, which is how a lock looks when somebody means to come
back to it. Everything behind the wire is exactly where it was; the difference
is that there is now nothing between you and it. Third shelf, end of the row:
brown paper folded and stapled, a manila tag wired through the fold, hanging
the same wrong way as all the others. You can read this one. You know which
line to read, and there is nothing on it.
```

> **Note.** Three things the builder should not swap.
>
> **The condition is `has: act4_case_notes`, not `has: act4_evidence_bag`.**
> E0 §13 makes the bag `portable: false` and §13.3 refuses `TAKE BAG` in
> Whitlock's own voice, so the bag is never in inventory and a `has:` test on
> it can never pass. What actually changes on the shelf is the notes coming out
> of it — §13.2, which puts the opened bag on the counter. §1.1 describes that
> aftermath and nothing more.
>
> **The gap is not counted and the tag is not read out.** §1.1 says *one short*
> and produces no total (canon 93); §1.2 says the top line is empty and prints
> neither the address nor the morning that E0 §12 established are written under
> it (canon 37). The second reading — whose three weeks are in the sack, and
> who the county failed to write a complainant for — stays a fitting. Neither
> rule states it, and Whitlock, per canon 116, never has.
>
> **The padlock.** Both rules put it open on the hasp, on the strength of the
> shipped *a door in it on a padlock*. If the builder reads E0 §12's *the
> padlock is on a ring with a great many others* as the padlock rather than its
> key leaving with her, the fix is the same six words in both rules — *the
> padlock is gone off the hasp* — and the rest of each paragraph stands.
