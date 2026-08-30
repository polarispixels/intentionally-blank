# 00 - Product and Story Overview

**Spec version:** `0.3.1`

## TLDR

*Intentionally Blank* is a modern browser-based text adventure with a classic parser-style interface, a deterministic world model, forgiving natural-language input, and an optional AI intent interpreter.

The player begins as an injured amnesiac investigator on the floor of a ransacked room in a quiet South Dakota town near the Badlands in the year 2047, although the player initially does not know the year, their own age, or even their own name.

The apparent local mystery begins with memory discrepancies and a missing sibling whom almost nobody remembers ever existing. The investigation leads toward a giant nuclear-powered hyperscale data center and an underground facility. As the player recovers memories and gathers analog evidence that resists digital rewriting, two mysteries slowly converge:

1. **What happened here?**
2. **Who am I?**

The eventual story expands far beyond the town, potentially across the United States, off-world locations, strange recreations, and impossible environments. The player slowly discovers that the local population may consist of artificial persons and that the world itself may be a simulation.

At the end, the player may be required to create an AI, configure a simulated protagonist, and realize that they are defining the same character and starting conditions seen at the beginning of the game.

The final recursive implication is that the protagonist exists inside a simulation of a simulation that they themselves create.

The project should avoid the cheap version of the twist, "none of this was real." Instead:

> **Everything experienced is real within its own layer, but the player's assumptions about what reality means were incomplete.**

---

# Product Intent

The game should feel like a synthesis of:

- *Zork's* coherent simulated world
- *Deadline's* dynamic investigation and character agendas
- *Planetfall's* character attachment
- *The Hitchhiker's Guide to the Galaxy's* narrator personality and willingness to reward ridiculous input
- *A Mind Forever Voyaging's* interest in exploration, ideas, and meaning
- modern browser UX
- modern natural-language interpretation

The player should not feel like they are reading a branching novel.

They should feel like:

> **They were dropped into a strange, coherent world and are gradually learning how it works.**

---

# Target Audience

Primary emotional target:

- intelligent, technically curious teens and adults
- readers who enjoy mystery, systems, science fiction, dry humor, puzzles, and discovery
- players who may never have played a classic parser adventure

A useful internal audience benchmark is older teenagers and young adults who are technically interested, capable of following layered mysteries, and willing to encounter unfamiliar vocabulary when context makes it rewarding.

---

# Approximate Scope

The target should be closer to classic Infocom density than to a long modern novel.

**Working scope target** *(recalibrated 2026-08-31 — canon register entry
21. The original 20,000–30,000 figure was set before any room existed; the
shipped opening room measured ~3,700 player-visible words, which projects
to ~150,000 across the original 41-room map. Ryan's call was a balanced
compromise across all three levers rather than any one of them: fewer
rooms, lighter typical density, and a somewhat longer game.)*

- **32 rooms**, in three density tiers: **4 hero** rooms at ~3,000 words
  each (the opening, the Sublevel 6 maintenance bay, the escape-room
  chamber, the Blank Room — one at each act boundary), **~24 standard**
  rooms at ~1,200 words, and **~4 light** rooms at ~400–600
- roughly **50,000 to 55,000** authored words
- approximately **10 to 14 hours** for a thoughtful first playthrough

The tier word targets are the enforcement mechanism: "write less" is not
an instruction anyone can follow, but a number is. Density is cut from
**breadth, not anticipation** — fewer objects per room, with the objects
that remain keeping their full set of authored responses. Constitution §14
is the quality being protected, and thinning the *answers* would trade
away exactly the thing that makes the opening room work.

**Original target, preserved** (spec 08 §10 — abandoned figures are marked,
not deleted):

- roughly 20,000 to 30,000 authored words
- approximately 8 to 12 hours for a thoughtful first playthrough
- meaningful replay value through alternate approaches, different recovered memories, and limited path-specific content
- not famously punishing or parser-hostile
- genuinely challenging through reasoning and exploration

The game should feel substantial, but compact enough that locations, objects, clues, and narrative details remain dense and memorable.

---

# Dominant Tone

No single genre should dominate completely.

Recommended hierarchy:

| Priority | Element | Role |
|---|---|---|
| 1 | Mystery / discovery | Primary narrative engine |
| 2 | Adventure / problem solving | Primary gameplay |
| 3 | Atmosphere | Makes locations and moments memorable |
| 4 | Comedy | Rewards curiosity and relieves tension |
| 5 | Science fiction | Gradually expands scale |
| 6 | Psychological unease | Supports memory, identity, and reality questions |
| 7 | Noir | Early flavor and investigative texture |

Core tonal principle:

> **The story takes the mystery seriously even when the narrator does not always take the player seriously.**

---

# Opening Premise

The player awakens:

- on the floor
- in darkness
- with a severe headache
- with extra pain at the back of the skull
- unable to remember their name
- unable to remember their age
- unable to identify the year
- in a room that appears recently ransacked

Early visible or discoverable elements may include:

- a fedora on the floor
- an overturned lamp
- a pull chain
- papers
- broken glass
- a desk
- a chair
- a locked drawer
- possible blood or another unexplained stain
- an old computer terminal

The first several minutes should simultaneously teach the interaction model and establish mystery.

The player eventually exits into a nearly silent small town near the Badlands.

It is night.

They see old brick buildings, several horses tied across the street, almost no lights, almost no people, and a glow on the horizon.

Nothing conclusively tells the player what year it is.

The horses could suggest the 1800s.

The surrounding environment could also plausibly be rural South Dakota in 2047.

This ambiguity should be preserved.

---

# Central Story Structure

The game runs two mysteries in parallel.

## External Mystery: What happened here?

The protagonist gradually learns:

- they came to town deliberately
- they were hired to investigate strange events
- the client insists a sibling disappeared
- almost nobody else remembers that sibling ever existing
- the missing sibling worked at a huge data-center complex
- the sibling had been accused of stealing a notebook from work
- the sibling denied having it
- the notebook contained critical physical evidence
- the data center and underground facility are connected to the anomalies
- the protagonist was likely attacked during the investigation

## Internal Mystery: Who am I?

At the same time:

- memories return through objects, places, smells, choices, and discoveries
- family relationships reappear in fragments
- some memories conflict with records or other people
- the protagonist may be unusually resistant to memory rewriting
- evidence increasingly suggests the protagonist may not be an ordinary human
- the meaning of "investigator" may be deeper than "private investigator"
- the protagonist may have been designed to investigate anomalies within the system

Eventually:

> **The two mysteries are revealed to be one mystery.**

---

# Slow-Burn Reality Breakdown

The game should not reveal the simulation premise early.

Suggested pacing:

## Act I: 0 to 20 percent
Grounded detective mystery.

Almost every anomaly has a plausible mundane explanation.

## Act II: 20 to 45 percent
Contradictions accumulate.

Memory, records, geography, and people begin to disagree.

## Act III: 45 to 70 percent
Reality is clearly wrong.

Impossible places and incompatible environments appear.

The question changes from "What happened?" to "What is this place?"

## Act IV: 70 to 90 percent
Identity becomes central.

The player begins suspecting that the world is artificial and that they may be artificial too.

## Act V: 90 to 100 percent
Recursion.

The player reaches administrative or root-level systems, creates or configures another intelligence, and gradually realizes that they are recreating themselves and the opening room.

Potential final sequence:

```text
INITIALIZE?

> YES
```

Then:

> Darkness.  
> Your head hurts.

---

# Title

**CANON:** *Intentionally Blank*

The title works at multiple levels:

- the loose notebook page marked `THIS PAGE INTENTIONALLY LEFT BLANK`
- missing memories
- erased records
- missing people
- blank identity
- cleared memory
- null data
- the creation of a new simulated protagonist
- the possibility that "blankness" is intentional system behavior

The title should not be burdened with a revealing subtitle.
