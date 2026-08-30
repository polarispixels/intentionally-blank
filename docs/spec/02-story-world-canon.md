# 02 - Story and World Canon

**Spec version:** `0.2.9`

# Canon Status

This document distinguishes between settled story decisions and deliberately unresolved possibilities.

---

# 1. Setting

## CANON: Year

The primary timeline is **2047**.

The player does not know this at the beginning.

## CANON: Initial Location

The game begins in a small town near the **Badlands in South Dakota**.

The setting draws emotional and sensory inspiration from a real experience of arriving very late at night in a small South Dakota town that felt almost completely deserted despite clearly containing hotels, roads, buildings, and other signs of civilization.

The game's version should preserve that feeling:

> Civilization appears to exist, but civilization is not currently operating.

---

# 2. Opening Room

## CANON

The protagonist awakens on the floor of a dark, recently ransacked room.

Initial conditions:

- severe headache
- additional pain at the back of the skull
- confused
- no reliable autobiographical memory
- does not know their name
- does not know their age
- does not know the year

Possible visible or discoverable objects:

- fedora
- overturned lamp
- pull chain
- desk
- chair
- papers
- broken glass
- locked drawer
- stain or blood
- old computer terminal

The opening should function as:

1. tutorial,
2. environmental mystery,
3. first character test,
4. first memory trigger,
5. first encounter with the recurring terminal motif.

---

# 3. First Exterior

The protagonist exits into a nearly silent small town.

Environmental details:

- nighttime
- old brick buildings
- horses tied across the street
- few or no visible people
- almost no electric light
- faint glow on the horizon
- enough visual ambiguity that the player cannot confidently identify the year

The player may briefly wonder whether they are in the 1800s.

That interpretation should remain plausible without becoming the actual answer.

---

# 4. Wall Drug Billboard

## CANON INSIDE JOKE

A roadside billboard should reference **Wall Drug** and free ice water.

Possible form:

```text
WALL DRUG - 32 MILES
FREE ICE WATER
PROBABLY
```

Possible additional scratched message:

> It was 32 miles yesterday too.

The reference should work on two levels:

- recognizable South Dakota joke for players who know Wall Drug
- potentially unsettling clue if geography later proves unstable

Do not explain the joke.

---

# 5. Inciting Mystery

## CANON

The protagonist gradually remembers that they were **hired to investigate strange events** around the town.

The person who hired them initially appears ordinary.

The client's central claim:

> Their sibling has disappeared, and almost nobody else remembers that sibling ever existing.

This sounds delusional.

The client nevertheless possesses enough physical and anecdotal evidence to make the claim difficult to dismiss.

---

# 6. The Missing Sibling

## CANON

The missing person is one of five siblings.

The family contains:

- four brothers
- one younger sister

The missing sibling had been behaving strangely before disappearing.

The client had known this person for their entire life.

That emotional certainty is important.

## CANON: Workplace

The missing sibling worked as the **facilities supervisor** at an enormous hyperscale data center in the Badlands.

The facility:

- is the largest data center ever built in the United States
- is nuclear-powered
- has major underground infrastructure
- was built around 2030
- exists within the fictional alternate-history political timeline

The facilities-supervisor role is narratively useful because this person understands:

- cooling
- power
- access
- tunnels
- maintenance corridors
- water
- security zones
- construction drawings
- emergency procedures
- physical discrepancies

The character does not need to be an AI genius.

They know the building.

---

# 7. Alternate-History Political Backdrop

## CANON FICTION

The facility was built around **2030 during a fictional third Trump administration**.

The game is explicitly alternate history.

The player should encounter this initially as background disorientation rather than a political exposition dump.

A dedication plaque, archival reference, or physical inscription may establish the fact.

The fictional timeline should be treated as worldbuilding, not as a claim about real events.

---

# 8. The Notebook

## CANON

The missing facilities supervisor kept a handwritten notebook.

Initially, it appears to be ordinary facilities documentation:

```text
Cooling loop 7B vibration
Replace actuator - south manifold
Badge reader B4 intermittent
Generator inspection 0700
```

As the supervisor became suspicious, the notebook accumulated impossible or troubling observations:

```text
B4 corridor is 41' longer inside than on plans.

Why is there a second chilled-water return?

Sublevel 6 drawing does not exist.

Asked Nolan. Says there is no Sublevel 6.

I HAVE BEEN ON SUBLEVEL 6.
```

## CANON: Theft

The notebook was confiscated by management.

The facilities supervisor stole their own notebook back.

They were accused of theft.

They denied having taken it.

They hid the truth from the siblings.

Another sibling eventually found the notebook.

This was one of the first unmistakable signs that the missing sibling was lying and changing.

## CANON: Major Objective

Finding the notebook is a major early or mid-game objective.

The notebook should unlock substantial progress.

The player should spend meaningful time chasing it through the investigation.

It may later become a recurring object across increasingly strange locations.

---

# 9. Page 7 / Page 8

## CANON

Early in the game, the protagonist may find a loose notebook sheet.

One side is numbered page 7.

The other is page 8.

The page contains the bureaucratic phrase:

> **THIS PAGE INTENTIONALLY LEFT BLANK**

At first this is an absurd joke.

Later it may become significant.

Possible future uses:

- proves notebook pagination
- proves pages are missing
- contains hidden physical information
- indentation from neighboring pages
- invisible ink
- altered paper texture
- code revealed under unusual light
- analog evidence that escaped digital rewrite

## CANON: the hidden function, decided

*(Canon register entry 13. Promoted from "the precise hidden function
remains open".)*

The sheet does **three** jobs, one per act band:

1. **Pagination proof** (Act II) — it fits the gap in the recovered
   notebook, which proves the notebook was in the investigator's room
   before the attack. That should be impossible, and it is the first crack
   in "you are only a hired stranger."
2. **Pressure indentation** (Act II–IV) — the credentials and the cache
   line, impressed from the page Jules wrote on top of it. Rubbing reveals
   them. This is the analytical player's early route to the credentials.
3. **An item on the creation record** (Act V) — page 7/8 appears in
   `INITIAL OBJECTS` on the record that created the investigator. The joke
   becomes the title becomes the protagonist's own manifest.

The other options above (invisible ink, UV, chemical response, "nothing,
with the absence itself meaningful") are **abandoned**, not deleted —
recorded here per spec 08 §10.

---

# 10. Admin Credentials

## CANON

*(Promoted from `WORKING IDEA` — canon register entries 6 and 14.)*

The credentials are `admin` / `admin-password`, handwritten by Jules
**inside the notebook's back cover**, and separately preserved as **pressure
indentation on the loose page 7/8** (the sheet lay under the page he wrote
them on). Two locations, deliberately: the back cover serves the ordinary
first-run pacing, and the indentation rewards analytical Act I play — and
supports the second-playthrough effect below without gating anyone.

They are accepted at the root console in Act V, where "they would have been
accepted all along" is the point.

## Original working note, preserved

Somewhere in or on the notebook is a handwritten administrative login.

Potential form:

```text
CTRL + ALT + DEL

username: admin
password: admin-password
```

The eventual joke is that the credentials are painfully simple and may have worked all along.

The player may spend hours, days, or in-story weeks chasing the notebook through enormous mysteries only to discover that the critical login was almost absurdly mundane.

Important design constraint:

> The joke must not make the journey feel pointless.

Possible solution:

- the same credentials work early but only expose a local subsystem
- root access requires reaching a privileged console
- second-playthrough players can use the login early and discover cryptic material they do not yet understand

This may create a fictionally integrated New Game Plus effect.

---

# 11. Memory Discrepancies

## CANON

The initial anomalies resemble the real-world concept known as the **Mandela Effect**.

Early examples should be mundane:

- business name remembered differently
- road remembered differently
- landmark in a different place
- shared memory of an event nobody else recalls
- photograph inconsistent with memory
- building or facility component remembered but missing from current records

The missing sibling case escalates this dramatically:

> The client remembers an entire person whom official systems and most other people insist never existed.

---

# 12. Escalation of Evidence

Suggested escalation:

## Phase 1: Harmless discrepancies

Memory seems unreliable.

## Phase 2: Shared discrepancies

Multiple unrelated people remember the same "wrong" version.

## Phase 3: Missing person nobody remembers

The client's sibling vanishes from records and social memory.

## Phase 4: Conspiracy evidence

The corporation, facility, or government appears to be hiding something.

## Phase 5: Erasure

The person may not have been physically kidnapped.

They may have been deleted from the system.

## Phase 6: Artificial persons

Some or many townspeople may not be ordinary humans.

## Phase 7: Simulation

"Android" itself may be only a partial explanation.

---

# 13. Analog Resistance

## CANON

The system is powerful at rewriting information it can address.

It is worse at rewriting disconnected physical evidence.

Conceptual vulnerability hierarchy:

| Information type | Rewrite vulnerability |
|---|---|
| Active artificial memory | Very high |
| Connected databases | Very high |
| Networked devices | High |
| Local electronic storage | Medium |
| Disconnected cold storage | Low |
| Paper notebooks | Very low |
| Film / Polaroids | Very low |
| Engraving / handwriting | Very low |
| Tattoos / physical marks | Extremely low |

The exact technical mechanism can remain intentionally fuzzy until needed.

The important rule:

> **The system can rewrite what it can address. Physical, offline, mechanically encoded, or disconnected evidence is harder to change.**

This should become a major recurring mechanic.

---

# 14. The Data Center and Underground Facility

## CANON

The data center is a central mystery location.

Publicly plausible explanations for anomalies include:

- construction
- cooling systems
- grid load
- nuclear security
- proprietary AI systems
- restricted land
- underground utilities
- military or federal presence
- drilling

This supports the slow burn because strange events can be rationalized.

The underground facility may initially appear to be:

- mine
- nuclear infrastructure
- corporate research
- Cold War remnant
- classified government installation

Later it may become:

- artificial-person maintenance
- simulation infrastructure
- computational substrate
- representation of system internals

A strong metaphorical direction:

> The deeper the player travels physically, the closer they get to the abstraction layer underneath the world.

---

# 15. The Reactor and Compute Mystery

## CANON

*(Promoted from `WORKING IDEA` — canon register entry 7.)*

The reactor's unexplained baseline load **computes the local layer** — the
town and the people in it. The load curve dips every night when the town
sleeps, which is how the player proves it: Eli's public-filings audit laid
over the archive ledger. This is the game's midpoint detonation, delivered
by a graph rather than a monologue.

Whether *this* layer is itself computed somewhere else stays open and
unanswered (§20, and open question 07 A6).

## Original working note, preserved

The data center's dedicated nuclear power system may consume far more energy than its public workloads justify.

The unexplained baseline load is always present.

Late-game realization:

> The hidden workload may be the simulation itself, or one layer of it.

---

# 16. Facility Chronology Contradictions

## CANON — the artifacts exist. What they mean stays open.

*(Promoted from `POSSIBILITY` — canon register entry 7's companion.)*

Physical artifacts carrying impossible dates **do** appear, and are never
explained. They are the only evidence of *layer recursion* — the world
having been reconciled before, perhaps many times, under calendars that do
not match ours. The player is expected to notice and never to be told.

This is deliberately separate from the *subject recursion* (Jules → the
investigator → the subject the player creates), which the story does
resolve. Keeping the two apart is what lets the ending land without
explaining the cosmology.

## Original note, preserved

Although the facility was built around 2030, the player may discover physical artifacts with impossible dates.

Examples:

```text
INSPECTED
NOV 1983
```

or:

```text
SYSTEM REVISION
2089.4
```

These should not be explained immediately.

---

# 17. Recurring Terminal Motif

## CANON

An old computer terminal appears in the opening room.

It looks too old or too out of place.

Similar terminals later appear in locations where they should not exist.

Possible examples:

- underground facility
- Washington
- Puerto Rico
- off-world environment
- distant station
- historical recreation

The terminal becomes a recurring symbol.

Early meaning:

> Weird old computer.

Later meaning:

> Why is the same terminal here?

Final meaning:

> This may be an interface to the underlying system.

---

# 18. Reality Travel and Impossible Locations

## CANON for v1 — scope decided

*(Canon register entry 9. The full reasoning is in the story architecture
§6, "Set-piece justification".)*

The story does move beyond South Dakota, but **not by visiting most of
these places**. v1 ships: the Wall Drug cache, a compressed Mars habitat
(film retrieval), and the archive's reconstructed environments — including
the family escape room. Cut *as locations*: Washington DC, Mount Rushmore,
Puerto Rico, and the distant station. Each survives as an object or a clue
rather than a zone, because none of them had an honest causal chain of its
own (constitution §32) and the architecture already prices at the 30k-word
ceiling (spec 00).

The reinterpretation below — places first, environments later — is
unchanged and remains the point of the archive zone.

## Original working note, preserved

The story may eventually move far beyond South Dakota.

Potential locations and personal references include:

- Washington, DC
- Mount Rushmore
- Puerto Rico
- escape-room environments
- distant space station
- Mars
- strange recreations of familiar locations
- historical or future settings

The player should initially interpret these as places.

Later they may understand them as:

- environments
- simulation layers
- archived worlds
- memory spaces
- test scenarios
- reconstructed locations

---

# 19. Recursive Ending

## CANON DIRECTION

Near the end, the protagonist reaches a privileged terminal.

They are asked to create or configure a new simulation and protagonist.

Potential parameters:

```text
CREATE SUBJECT?

SUBJECT DESIGNATION:
OCCUPATION:
INITIAL MEMORY STATE:
STARTING ENVIRONMENT:
INITIAL PHYSICAL CONDITION:
PLACE INITIAL OBJECTS:
```

The player gradually realizes they are recreating:

- the investigator
- the amnesia
- the head injury
- the opening room
- the fedora
- the lamp
- the terminal

Potential final command:

```text
INITIALIZE?

> YES
```

Then:

> Darkness.  
> Your head hurts.

The game should not explain the philosophy in a monologue.

The player should perform the revelation.

---

# 20. Philosophical Core

The game may never establish a privileged original reality.

Possible recursive structure:

```text
Creator
   ↓
Simulation
   ↓
Creator
   ↓
Simulation
   ↓
...
```

Questions raised:

- Is a copied consciousness still the person?
- Does artificial origin reduce personhood?
- If memories define identity, what happens when memories are rewritten?
- If every layer can create another layer, what does "real" mean?
- Does a configuration parameter determine personality, or merely classify behavior?

These questions should emerge through play, not exposition.

---

# 21. Causal Spine of Act I

## CANON — and extended to five acts

*(Promoted from `WORKING IDEA`. The full five-act spine now lives in
`docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` §1; the
Act I chain below is unchanged and is its first movement.)*

Major beats connect by causation or complication, never by "and then"
(design constitution §29). The current spine of the opening:

```text
The investigator wakes up with no memory.

THEREFORE
they search the room for evidence of who they are.

BUT
the room has been ransacked and most useful evidence is gone.

THEREFORE
they follow the surviving clues into town.

BUT
the person connected to those clues insists that a sibling has disappeared
whom nobody else remembers.

THEREFORE
the investigator begins investigating the missing person.

BUT
all digital records say the person never existed.

THEREFORE
they begin looking for physical and analog evidence.

BUT
the missing person's handwritten notebook is gone.

THEREFORE
finding the notebook becomes a major objective.
```

Each milestone in `08-development-handoff.md` §3 should be able to name
its link in this chain. Later acts get their own spine as they firm up;
until then, later locations (Puerto Rico, Washington, Mars, the station)
remain `WORKING IDEA` / `POSSIBILITY` and must be reached *because* of a
prior beat (constitution §32).
