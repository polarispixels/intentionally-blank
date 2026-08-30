# 01 - Design Constitution

**Spec version:** `0.2.2`

## Purpose

This document captures the core lessons learned from classic text adventures and turns them into standing design rules for *Intentionally Blank*.

The relevant lineage includes:

- *Colossal Cave Adventure*
- *Zork*
- *Deadline*
- *Planetfall*
- *The Hitchhiker's Guide to the Galaxy*
- *A Mind Forever Voyaging*

The objective is not nostalgia.

The objective is to identify what these games did unusually well, identify where they created unnecessary frustration, and build a modern game that preserves their strengths.

---

# 1. Use the Right Mental Model

Do not think of this primarily as:

> a story with choices

and do not think of it simply as:

> a puzzle game with prose

Think of it as:

> **A small simulated world that tells a story through the player's interaction with it.**

A weak structure looks like:

```text
STORY
  ↓
PUZZLE
  ↓
STORY
  ↓
PUZZLE
```

A stronger structure looks like:

```text
WORLD
 ├── characters
 ├── objects
 ├── locations
 ├── rules
 ├── secrets
 └── conflicts
       ↑
       │
    PLAYER
```

The story should emerge from understanding and manipulating the world.

---

# 2. What the Best Classic Games Contributed

## Colossal Cave Adventure

Primary lesson:

> Exploration itself can create mystery and motivation.

Useful inheritance:

- spatial discovery
- hidden connections
- strange objects
- environmental puzzles
- the feeling that the world extends beyond what the player currently understands

Avoid inheriting:

- parser rigidity
- arbitrary puzzle logic
- excessive dependence on map bookkeeping

## Zork

Primary lesson:

> A text game can feel like a coherent simulated place rather than a branching script.

Useful inheritance:

- persistent world state
- objects with behaviors
- inventory
- environmental causality
- exploration
- interconnected puzzle dependencies
- humor in object interactions
- willingness to let the player try strange things

Avoid inheriting:

- guess-the-verb frustration
- opaque unwinnable states
- unnecessary repetition
- puzzles requiring designer telepathy

## Deadline

Primary lesson:

> The world can continue operating while the player investigates it.

Useful inheritance:

- character agendas
- schedules
- evidence
- investigation
- time-sensitive events
- characters who move, lie, hide things, and act independently

Avoid inheriting:

- excessive dependence on exact timing
- situations where missing one event irreversibly destroys progress without warning

## Planetfall

Primary lesson:

> Character attachment can make interactive fiction emotionally meaningful.

Useful inheritance:

- memorable NPCs
- humor mixed with sincerity
- emotional stakes that emerge through interaction rather than exposition

## The Hitchhiker's Guide to the Galaxy

Primary lesson:

> The narrator can be part of the game.

Useful inheritance:

- narrator personality
- comedy as a reward for experimentation
- funny responses to failed actions
- language as part of the entertainment
- willingness to surprise the player

Avoid inheriting:

- famously brutal difficulty
- hidden dependency traps
- early actions that make the game unwinnable hours later
- solutions that feel intentionally hostile

## A Mind Forever Voyaging

Primary lesson:

> Interactive fiction can be about experiencing and understanding a world, not merely unlocking doors.

Useful inheritance:

- exploration
- ideas
- social observation
- narrative meaning
- environments that reveal larger systems

---

# 3. The World Must Behave Consistently

If:

- fire burns rope
- water extinguishes fire
- heavy objects are difficult to move
- a security badge opens a certain class of doors
- analog information resists system rewrites

then those rules should remain true.

Consistency allows reasoning.

A good puzzle should produce:

> "Of course. That makes sense."

Not:

> "How was I supposed to know that?"

## Standing Rule

> **Teach a rule once, then let the player apply it creatively later.**

---

# 4. Puzzles Test Understanding, Not Guessing

Good puzzles should derive from:

- observation
- causality
- deduction
- memory
- experimentation
- spatial reasoning
- social reasoning
- resource management
- understanding character motives
- understanding world rules

## Puzzle Quality Test

Ask:

> **If a smart player knows everything they have reasonably been shown, could they derive a solution?**

If yes, the puzzle is probably sound.

If the answer is:

> "Only if they happen to think exactly like the designer"

redesign it.

---

# 5. Build Puzzle Networks, Not Puzzle Chains

Weak:

```text
A → B → C → D → E
```

One blockage stops the game.

Better:

```text
        B
       ↗ ↘
A → C     F
       ↘ ↗
        D
```

The player should usually have several unresolved problems available.

Examples:

- broken bridge
- missing notebook
- locked facility entrance
- suspicious client memory
- unexplained glow
- person who refuses to talk
- strange terminal

The player should be able to make progress on one mystery while temporarily stuck on another.

---

# 6. Let Discoveries Cross-Pollinate

Objects, clues, memories, and environmental rules should matter across different places and times.

An apparently decorative object found early may become mechanically or narratively important much later.

This creates the feeling:

> **The world has been connected all along.**

Avoid placing "Key #3" beside "Door #3."

Prefer delayed recognition.

---

# 7. Inventory Represents Possibilities

A good inventory is a set of hypotheses.

```text
INVENTORY

- fedora
- torn notebook page
- old photograph
- deck of cards
- USB drive
- bottle opener
```

Every important object should have at least one of:

- obvious affordance
- contextual clue
- demonstrated property
- narrative significance

Avoid inventory combinatorics where the player must try every object on every other object.

---

# 8. The Narrator Is Part of the Game

Do not waste reasonable or ridiculous player actions with:

> You cannot do that.

Whenever practical, give the player something for trying.

Example:

```text
> LICK STATUE
```

Possible response:

> You lick the statue. It tastes principally of limestone, poor judgment, and several generations of pigeons.

No important state changed, but experimentation was rewarded.

## Standing Rule

> **Reward curiosity even when it does not advance the puzzle.**

This creates trust between player and game.

---

# 9. Separate Failure From Punishment

Classic games often punished curiosity with:

- death
- lost inventory
- irreversible mistakes
- hidden unwinnable states
- excessive lost progress

That conflicts with the genre's need for experimentation.

## Standing Rule

> **Failure should usually produce information.**

A failed bridge crossing might teach:

- the bridge cannot support full body weight
- an object could cross
- the ropes remain intact

Failure should often advance understanding.

---

# 10. Never Secretly Doom the Player

Do not create a "walking-dead" state where victory is impossible but the player can continue for hours without knowing.

Irreversible failure is acceptable only when:

1. the consequence is reasonably understandable beforehand,
2. recovery exists, or
3. the game immediately tells the player that the attempt failed.

---

# 11. Death Can Still Be Fun

Death may be:

- funny
- informative
- atmospheric
- revealing
- a reward for experimentation

But death should be cheap.

Recommended support:

- `UNDO`
- restart encounter
- autosave
- manual save slots

Death should not primarily function as lost time.

---

# 12. Language Must Be Forgiving

A modern player should not lose because the game failed to understand a reasonable synonym.

These should normalize sensibly:

```text
smash the window
break the glass
throw the chair through it
hit the window with the chair
```

The language layer may map them to a structured action such as:

```json
{
  "action": "break",
  "target": "window",
  "instrument": "chair"
}
```

The game engine then decides what happens.

---

# 13. AI Interprets Intent. The Game Engine Owns Reality.

Bad architecture:

```text
PLAYER
  ↓
LLM
  ↓
WHATEVER THE MODEL INVENTS
```

Preferred architecture:

```text
PLAYER LANGUAGE
      ↓
INTENT INTERPRETER
      ↓
STRUCTURED ACTION
      ↓
GAME ENGINE
      ↓
AUTHORITATIVE WORLD STATE
      ↓
NARRATIVE PRESENTATION
```

The AI layer may interpret what the player means.

It must not arbitrarily determine:

- what objects exist
- whether a door is locked
- who knows what
- whether a character is alive
- whether a clue was found
- what consequences occur

The world remains deterministic and testable.

---

# 14. Acknowledge Obvious Ideas

If a reasonable human would think of an action, the game should have a reasonable response.

Example:

> There is a locked wooden door.

Player:

```text
KICK DOOR
```

Even if kicking is not the solution, the game can respond:

> The door shudders. Your foot objects. The iron hinges appear unimpressed.

The action need not succeed.

It should be acknowledged.

---

# 15. Important Problems Should Support Multiple Approaches

Example: a guard blocks access.

Possible solution classes:

- physical
- social
- puzzle
- exploration
- bribery
- knowledge
- stealth

Different players should be able to solve some major problems according to different instincts.

This creates replayability without requiring completely separate stories.

---

# 16. Do Not Make Everything Possible

The player should be able to **attempt** almost anything reasonable.

The world decides what actually works.

Player:

> I dig a tunnel under the building.

Game:

> With your spoon?

Player:

> Yes.

Game:

> At your current rate, completion is expected during the next administration.

Constraints create games.

---

# 17. Story and Puzzle Should Explain Each Other

Avoid unrelated puzzle gates.

If the story concerns memory rewriting, puzzles should involve:

- conflicting records
- analog artifacts
- physical traces
- handwritten notes
- identity
- reconstruction
- interviews
- inconsistencies
- system access
- information that changes depending on medium

Mechanics should embody story.

---

# 18. Every Major Puzzle Reveals Something

A major puzzle should reveal at least one of:

- character
- world
- history
- conflict
- mystery
- future consequence

Weak:

> Solve combination lock. Door opens.

Better:

> The combination is a date that reveals a hidden relationship or historical contradiction.

Gameplay should deliver narrative.

---

# 19. Characters Have Agendas

Important NPCs should have some combination of:

```text
CHARACTER
├── goal
├── knowledge
├── schedule
├── relationships
├── fears
├── secrets
└── resources
```

They may:

- lie
- move objects
- leave
- overhear
- become suspicious
- help
- sabotage
- hide evidence
- cooperate
- remember different versions of events

The player should feel like they are perturbing a system, not walking between stationary dialogue kiosks.

---

# 20. The Interface Supports the Player's Mental Model

Old text adventures often required graph paper and extensive notes.

Some of that can be enjoyable, but mandatory bookkeeping is friction.

Optional support may include:

```text
MAP

West Hall ── Library
   │
 Cellar
   │
 ????
```

and:

```text
OPEN QUESTIONS

• Why does the client remember a sibling nobody else remembers?
• Where is the notebook?
• Why is there a terminal in the ransacked room?
• What powers the unexplained sublevel?
```

These should not become quest markers that solve the game.

They should function as memory assistance.

---

# 21. Hints Preserve the Aha Moment

Use progressive hints.

Example:

### Level 1
> Have you noticed anything unusual about the drain?

### Level 2
> Something metallic appears to be inside it.

### Level 3
> You may already possess something that interacts with metal.

### Level 4
> Try the magnet.

The player controls how much of the solution they reveal.

---

# 22. Logistics Should Disappear

Once the player understands a route, repeated movement should not become clerical work.

Support commands such as:

```text
GO TO HOTEL
TAKE ALL
ASK MARLOW ABOUT THE NOTEBOOK
```

when the game state makes them reasonable.

## Standing Rule

> **Discovery should be manual. Repetition should be automated.**

---

# 23. Prefer Density Over Size

A dozen memorable rooms can outperform one hundred generic rooms.

Strong locations contain combinations of:

- useful object
- clue
- character detail
- optional secret
- connection to another puzzle
- memorable description
- environmental behavior

Players should remember:

> the kitchen where the clock runs backward

not:

> corridor 37

---

# 24. Secrets Matter

Not every discovery should be required.

Optional content may include:

- hidden rooms
- jokes
- alternate solutions
- backstory
- strange deaths
- secret characters
- collectibles
- shortcuts
- unusual conversations
- hidden family references
- second-playthrough discoveries

Optional content makes the world feel larger than the critical path.

---

# 25. Mystery Is the Progression Engine

The player should constantly accumulate questions.

```text
Why is the room ransacked?
Who hit me?
What year is it?
Who hired me?
Did the missing sibling exist?
Why does the notebook matter?
Why are records changing?
What is beneath the data center?
Why do analog objects survive?
Who am I?
```

Good progression:

```text
QUESTION
   ↓
DISCOVERY
   ↓
ANSWER
   ↓
BIGGER QUESTION
```

This is stronger than:

```text
TASK
 ↓
REWARD
 ↓
NEXT TASK
```

## Chain of Dramatic Questions

The questions should form a chain in which each answer opens a larger or
more consequential question:

```text
Who attacked me?
        ↓
Why was I investigating this town?
        ↓
Did the missing sibling actually exist?
        ↓
Who erased them?
        ↓
How can a person be erased?
        ↓
What are these people?
        ↓
What am I?
        ↓
What is this world?
```

## Standing Rule

> **Every significant answer should create a larger or more consequential
> question.**

This is what keeps the middle of the game from becoming a sequence of
disconnected tasks.

---

# 26. The Deeper Design Opportunity

Classic text adventures made **language the interface**.

*Intentionally Blank* should make **reasoning the interface**.

The player should repeatedly experience:

```text
I noticed X.
Therefore maybe Y.
If Y is true, perhaps Z.
Let's try it.
```

The central design question should not merely be:

> What command will the player type?

It should be:

> **What hypothesis will the player form?**

---

# 27. Core Experience Loop

The target repeated loop is:

> **Observe → Wonder → Hypothesize → Act → Discover → Reconsider**

When the game works properly:

- the world feels coherent
- curiosity feels worthwhile
- mistakes produce information
- characters have lives beyond the player
- puzzles reveal story
- story creates puzzles
- language feels natural
- solutions feel earned
- discoveries connect
- the narrator makes even failure worth experiencing

---

# 28. Replayability Without Branch Explosion

Do not build hundreds of explicit story branches.

Prefer a braided structure:

```text
                     PATH A
                   ↗        ↘
OPENING ──────── PATH B ─────── MAJOR EVENT
                   ↘        ↗
                     PATH C
```

Suggested content allocation:

| Content type | Approximate share |
|---|---:|
| Shared world, mystery, locations, major story | 70% |
| Meaningfully altered by player behavior/profile | 20% |
| Exclusive path-specific content | 10% |

Replayability should come from:

- different solution methods
- different memories recovered
- different NPC relationships
- different secrets found
- different interpretations of the same events

not from writing three disconnected games.

---

# 29. Major Beats Connect by Causation or Complication

Trey Parker and Matt Stone describe a useful story test:

> Between major story beats, you should usually be able to connect them
> with **BUT** or **THEREFORE**, rather than **AND THEN**.

"AND THEN" often means events are merely adjacent.

Weak progression:

```text
The investigator wakes up in a room.
AND THEN
he walks outside.
AND THEN
he meets a client.
AND THEN
he looks for a notebook.
AND THEN
he visits a data center.
```

Things happen, but one event is not driving the next.

Stronger causal structure:

```text
The investigator wakes up with no memory.

THEREFORE
he searches the room for evidence of who he is.

BUT
the room has been ransacked and most useful evidence is gone.

THEREFORE
he follows the surviving clues into town.

BUT
the person connected to those clues insists that a sibling has disappeared
whom nobody else remembers.

THEREFORE
the investigator begins investigating the missing person.

BUT
all digital records say the person never existed.

THEREFORE
he begins looking for physical and analog evidence.

BUT
the missing person's handwritten notebook is gone.

THEREFORE
finding the notebook becomes a major objective.
```

This creates causal propulsion. (The story-level version of this chain is
recorded in `02-story-world-canon.md`, "Causal Spine of Act I".)

## Standing Rule

> **Major story beats should connect through causation or complication.
> If the only connection is "and then," challenge the beat.**

## "AND THEN" Is a Warning Sign, Not a Ban

Atmosphere, exploration, humor, character moments, and quiet scenes do not
all require a causal reversal.

For **major story beats**, if the only connection between two events is
"and then this happens," ask:

> Why does this happen *because of* what just happened?

or:

> What complication prevents the previous action from resolving cleanly?

Shorthand:

```text
BECAUSE / THEREFORE = propulsion
BUT                 = complication
AND THEN            = warning sign
```

## Consequence and Complication as a Rhythm

```text
EVENT
  ↓
THEREFORE
  ↓
ACTION / CONSEQUENCE
  ↓
BUT
  ↓
COMPLICATION
  ↓
THEREFORE
  ↓
NEW ACTION
```

For *Intentionally Blank* this maps directly onto investigation:

```text
CLUE
  ↓
THEREFORE
  ↓
PLAYER FORMS HYPOTHESIS
  ↓
BUT
  ↓
NEW EVIDENCE CONTRADICTS OR COMPLICATES IT
  ↓
THEREFORE
  ↓
PLAYER REVISES HYPOTHESIS
```

which is the core loop of §27 — Observe → Wonder → Hypothesize → Act →
Discover → Reconsider — seen from the story's side.

## Preserve Breathing Room

Do not apply this mechanically. The game still needs atmospheric
description, jokes, character moments, optional exploration, quiet scenes,
secrets, strange objects, and environmental storytelling.

A horse may simply be tied outside because it makes the South Dakota street
memorable. The Wall Drug billboard may initially exist only because it is
funny.

The causality test is for **major narrative progression**.

---

# 30. Setup Leads to Payoff

If something receives unusual attention early, look for ways to give it
meaning later.

Example:

```text
PAGE 7 / PAGE 8
THIS PAGE INTENTIONALLY LEFT BLANK
```

Initially this may be a joke, a bureaucratic absurdity, an apparently
useless object.

Later it may become evidence, a missing-page clue, analog information, a
physical encoding mechanism, or part of a major reveal.

## Standing Rule

> **The strongest payoff occurs when the player remembers the setup without
> the game reminding them.**

See also §6 (delayed recognition) and §24 (secrets).

---

# 31. Prefer Recontextualization Over Revelation

A strong reveal does not merely tell the player something new. It changes
the meaning of something they already experienced.

Early:

```text
USER NOT RECOGNIZED
```

The player assumes: *I forgot my login.*

Much later: *I was never the user.*

## Standing Rule

> **Whenever possible, plant clues that are understandable one way at first
> and gain a second, deeper meaning later.**

Retroactive reinterpretation is a major storytelling tool throughout the
game. The writing-side treatment is in
`06-narrative-tone-and-writing-guide.md` §12.

---

# 32. Set Pieces Earn Their Place Causally

The project has many potential locations and inside references: South
Dakota and the Badlands, Wall Drug, Puerto Rico, Washington, DC, Mount
Rushmore, poker, Catan, escape rooms, Mars, distant stations, underground
facilities, Dad on a USB drive.

These must not become:

> "And then we go to Puerto Rico."

Whenever possible, give major locations and set pieces causal justification.
Illustrative example (not canon):

```text
The notebook identifies a shell corporation.

THEREFORE
the investigator traces its ownership.

BUT
its registered address is an abandoned property in Puerto Rico.

THEREFORE
the investigation moves there.

BUT
the property contains another impossible old terminal.
```

Now Puerto Rico belongs to the story rather than functioning as a
disconnected reference.

## Standing Rule

> **A location or set piece is added because the story arrives there, not
> because it would be fun to visit.**

See also §23 (density over size) and the location backlog in
`07-backlog-and-open-questions.md` §E.
