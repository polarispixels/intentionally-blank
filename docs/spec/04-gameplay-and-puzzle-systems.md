# 04 - Gameplay and Puzzle Systems

**Spec version:** `0.2.9`

# 1. Core Interaction Loop

The intended player experience is:

> **Observe → Wonder → Hypothesize → Act → Discover → Reconsider**

The game should reward theory formation.

The player should often think:

```text
I noticed X.
Therefore maybe Y.
If Y is true, perhaps Z.
Let's try it.
```

---

# 2. Memory as a Game System

## CANON

The protagonist's memory should return gradually.

Memory is not only exposition.

Memories should be triggered by:

- objects
- smells
- sounds
- places
- people
- words
- choices
- successful deductions
- danger
- analog artifacts

Example:

The player picks up a deck of cards.

They briefly remember:

- four hands around a table
- laughter
- someone discussing an inside straight
- an unidentified person

This can simultaneously create:

- backstory
- a new question
- a future puzzle connection

## Replay Function

Different behavioral choices may surface different memories.

One playthrough may reveal more technical memories.

Another may reveal more emotional memories.

Another may reveal more physical/action memories.

All should remain compatible pieces of the same life.

---

# 3. Soft Player Archetypes

Do not ask the player to select a class.

Instead, infer tendencies from behavior.

Working behavioral dimensions:

### Analytical
- examines
- reads
- compares
- investigates
- reconstructs
- uses evidence

### Social
- questions
- persuades
- bluffs
- remembers relationships
- negotiates

### Direct / Operator
- forces
- moves
- breaks
- sneaks
- uses tools
- acts physically

The game may track these dimensions without exposing them early.

## Later Reveal

A terminal may eventually display a behavioral profile such as:

```text
SUBJECT BEHAVIORAL PROFILE

OBSERVATION:       81%
SOCIAL INFERENCE:  46%
DIRECT ACTION:     23%

PRIMARY STRATEGY: ANALYTICAL
```

This should feel disturbing because the player realizes the system has been evaluating them.

---

# 4. Replayability

Replayability should come from:

- alternate solutions
- different memories
- different NPC relationships
- different secrets
- optional locations
- path-specific content
- early use of knowledge learned in a previous playthrough

Do not create a combinatorial narrative explosion.

Suggested ratio:

- 70% shared content
- 20% meaningfully varied
- 10% exclusive

---

# 5. Analog Evidence System

## CANON

Analog and offline evidence is unusually trustworthy.

Important evidence classes:

- handwritten notebooks
- loose paper
- film
- Polaroids
- mechanical clocks
- engraved objects
- physical measurements
- tattoos
- disconnected USB drives
- cold storage
- printed receipts
- hand-drawn maps
- physical wear patterns
- indentation on paper

The player should gradually learn:

> If digital systems and physical evidence disagree, physical evidence may be more reliable.

This should become a recurring investigative strategy.

---

# 6. The Notebook System

The missing notebook is a major milestone.

Potential gameplay around it:

- chase references to it
- reconstruct pages
- find loose sheets
- compare handwriting
- decode facilities abbreviations
- identify impossible measurements
- match notes to facility locations
- discover credentials
- use physical marks or indentations
- compare current diagrams with handwritten diagrams
- use page numbering to prove missing sections

The notebook should not simply be a static lore dump.

It should function as:

- evidence
- map
- puzzle object
- memory trigger
- access key
- narrative spine

---

# 7. Garbage Investigation Sequence

## CANON IDEA

At some point, the player should sneak to someone's house, steal their garbage, and search it for evidence.

This is inspired by real private-investigator tactics and supports the detective fantasy.

Potential trash inventory:

```text
- empty coffee container
- envelopes
- grocery receipt
- broken pencil
- chicken bones
- prescription bottle
- burnt photograph fragment
- Wall Drug souvenir cup
- shredded paper
- something damp the narrator refuses to identify
```

## UX Rule

Avoid literal garbage-inventory hell.

Possible command:

```text
EXAMINE TRASH
```

The protagonist automatically discards obvious meaningless waste and surfaces a manageable set of potentially relevant items.

Standing rule:

> **Discovery is manual. Clerical sorting is automated.**

## Puzzle Opportunities

Trash can reveal:

- schedules
- shopping habits
- correspondence
- medications
- relationships
- shredded documents
- travel
- burner devices
- facility access evidence

Evidence should support inference rather than automatically prove conclusions.

---

# 8. Poker Route

## CANON IDEA

The player may need to pass an adversary or obstacle where a poker game provides an easier route.

If the player has a deck of cards, poker may be available.

Without the cards, other solutions should exist.

Potential solution classes:

- win honestly
- read a tell
- bluff
- manipulate stakes
- social persuasion
- cheat
- bypass the adversary
- use Dad after he is available

This is a model for the larger design philosophy:

> Optional preparation should make a challenge easier without making the game unwinnable.

---

# 9. Catan-Inspired Sequence

## CUT FROM v1 — flavor only

*(Canon register entry 9. Not deleted: marked cut, per spec 08 §10.)*

There is no playable Catan sequence in v1. Catan survives as family flavor
— a mentioned game, a remembered argument about a road, Dad's insufferable
confidence about it. The scope reasoning is in the story architecture §6:
the game already prices at the 30k-word ceiling, and a trading minigame
that teaches its own rules is expensive content that no beat requires.

Restorable post-1.0 (07 I). The working note below is preserved for that.

## Original working note, preserved

A future sequence may use resource-trading logic recognizably inspired by Catan.

Important constraint:

- familiarity with Catan should be a bonus
- the game must teach enough rules that a new player can solve it

Potential resources:

- brick
- lumber
- grain
- ore
- wool

Dad may be exceptionally good at the game.

---

# 10. Escape-Room Sequence

## CANON — Act IV, and it is a reveal, not a minigame

*(Promoted from `BACKLOG` — canon register entry 3's consequence.)*

The escape room is real content and lands in Act IV, inside the facility's
archive of reconstructed environments. What it reconstructs is **the
family's last day all together**, rebuilt out of harvested memories — with
Jules present as a blank silhouette in the middle of it.

The room only completes if the player performs Jules's role from memory.

He can. Perfectly.

That is the whole point: it is an identity proof disguised as a puzzle, and
it obeys the standards below because the solution is something the player
has been unknowingly assembling for three acts. No combination-lock spam.

## Original backlog note, preserved

A literal or simulated escape-room environment may become:

- family reference
- group puzzle
- test environment
- memory reconstruction
- late-game challenge

The room should obey the same puzzle standards as the rest of the game.

No arbitrary combination-lock spam.

---

# 11. Multiple Solution Classes

For major obstacles, consider:

- knowledge
- physical action
- social strategy
- stealth
- exploration
- resource use
- character assistance
- alternate route

Not every obstacle needs all classes.

Enough major encounters should support multiple approaches that players recognize the system.

---

# 12. Reasonable Action Responses

If the player tries something reasonable, acknowledge it.

Bad:

> I don't understand.

Better:

> The action fails for a world-consistent reason.

Even better:

> The failure also teaches something.

---

# 13. Secrets and Optional Content

Include optional:

- hidden rooms
- alternate memories
- family jokes
- strange deaths
- terminal commands
- nonessential notebook clues
- off-path conversations
- alternate puzzle solutions
- hidden analog evidence
- second-playthrough shortcuts

The player should sometimes intentionally experiment simply to see what the game says.

---

# 14. Second-Playthrough Knowledge

The game may intentionally allow knowledge gained in one playthrough to alter another.

Example:

A player who remembers the admin credentials may try them on the opening terminal.

If accepted, the player sees cryptic local information that is technically valid but incomprehensible without later context.

This supports replayability without artificial New Game Plus mechanics.

---

# 15. Progressive Hint System

Hints should preserve satisfaction.

Suggested ladder:

1. directional nudge
2. clue identification
3. relevant mechanic reminder
4. near-solution
5. explicit solution

Hints should be optional.

---

# 16. Time and NPC Movement

Inspired by *Deadline*, important NPCs may:

- move on schedules
- leave locations
- act while unseen
- alter evidence
- lie
- respond to prior actions
- overhear
- become suspicious

Avoid creating brittle schedules that force exact move counting.

Time should add life, not cruelty.

## CANON: the time model

*(Canon register entry 11, resolving open question 07 G3.)*

- A **four-phase day**: morning, afternoon, evening, night. NPC locations
  are posted per phase, not per turn.
- **Weekly recurring windows** for the things a town does on a rhythm:
  poker night, trash day, deliveries.
- A **nightly maintenance rhythm** — which is how the player eventually
  notices that the town's people go somewhere at night and do not remember
  it.
- Hard story events are **progress-triggered and schedule-dressed**: the
  presidential visit happens because the player earned it, and merely
  *looks* like it happened on a calendar.

The standing rule, which validation enforces rather than trusting authors
to remember: **missing a window costs a cycle, never the game.** Every
puzzle keeps at least one solution route with no clock term in it.

**Abandoned** (spec 08 §10): exact-turn event windows; permanently missable
events; any real-time pressure economy.

---

# 17. Failure Philosophy

Failures may:

- reveal information
- create alternate states
- produce comedy
- trigger memories
- create new routes
- produce short-term setbacks

Avoid:

- silent permanent doom
- losing hours of progress
- punishment for experimentation

---

# 18. Death

Death is allowed.

Death should be:

- cheap
- undoable
- sometimes funny
- sometimes serious
- never primarily a time tax

Support:

- autosave
- manual save
- undo
- restart encounter

---

# 19. Vocabulary as Gameplay Flavor

The game should occasionally introduce unfamiliar or technical words.

This should create:

> "What does that mean?"

not:

> "What exact word does the parser demand?"

Vocabulary may come from:

- data-center operations
- nuclear systems
- geography
- philosophy
- politics
- Luke's unusually advanced word choices
- old equipment
- legal or bureaucratic language

The player should never need an obscure vocabulary word merely to express an obvious action.
