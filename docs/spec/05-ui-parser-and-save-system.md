# 05 - UI, Parser, State, and Save System

**Spec version:** `0.1.0`

# 1. Technical Product Direction

## CANON REQUIREMENT

The game should be browser-first and suitable for static hosting, including GitHub Pages.

The interaction model should preserve the feel of a classic text-adventure REPL while using modern browser technology.

The project should not reproduce Infocom's implementation constraints merely for historical authenticity.

The goal is:

> **Preserve the interaction model. Modernize the implementation.**

---

# 2. Recommended Technology Direction

The coding agent has implementation freedom.

A suitable default stack would be:

- TypeScript
- Vue 3
- Vite
- static deployment
- GitHub Pages
- deterministic application state
- browser-local persistence

The agent may choose different libraries if they satisfy the behavioral requirements.

Do not over-specify internal architecture prematurely.

---

# 3. Historical Inspiration

Infocom's architecture separated authored game logic from machine-specific execution:

```text
ZIL SOURCE
    ↓
COMPILER
    ↓
Z-CODE
    ↓
Z-MACHINE
    ↓
MULTIPLE COMPUTER PLATFORMS
```

That separation was elegant and forward-looking.

Modern browsers already provide the portability layer.

The useful lesson is architectural separation, not Z-machine reproduction.

---

# 4. Preferred Runtime Architecture

```text
Vue / Browser REPL
        ↓
Input Interpreter
        ↓
Structured Action
        ↓
Deterministic Game Engine
        ↓
Authoritative World State
        ↓
Narrative Renderer
        ↓
Player
```

Possible world-state domains:

```text
WORLD
├── locations
├── objects
├── inventory
├── NPCs
├── memories
├── clues
├── puzzle states
├── time
├── player profile
├── narrative flags
└── global world state
```

---

# 5. Example State

Illustrative only:

```json
{
  "location": "hotel_room_204",
  "inventory": ["fedora", "page_7_8"],
  "lampOn": true,
  "knowsCurrentYear": false,
  "notebookFound": false,
  "clientTrust": 2,
  "memoryFragments": ["horses", "client_first_meeting"]
}
```

The exact schema is an implementation decision.

The product requirement is that state be:

- explicit
- serializable
- deterministic
- inspectable
- testable
- versionable

---

# 6. Command Interface

The player should be able to use classic concise commands:

```text
N
S
E
W
LOOK
INVENTORY
TAKE FEDORA
OPEN DRAWER
READ PAGE
ASK JOHN ABOUT NOTEBOOK
USE KEY ON LOCK
```

The system should also accept more natural language:

```text
pick up the hat
look underneath the desk
ask him what he knows about the missing sibling
jam the chair under the doorknob
```

---

# 7. Parser Layers

Recommended conceptual pipeline:

```text
PLAYER INPUT
     ↓
1. Deterministic parser
     ↓
understood?
  YES → structured action
  NO
     ↓
2. Semantic / AI interpreter
     ↓
structured action
```

A synonym layer should resolve ordinary variants without AI.

Examples:

```text
take
grab
pick up
get
```

AI should be fallback or augmentation, not the only parser.

---

# 8. AI Boundary

## CANON REQUIREMENT

AI may interpret intent.

AI must not own authoritative game state.

AI may help with:

- synonyms
- pronouns
- longer natural-language commands
- intended object resolution
- action normalization
- harmless fallback language

AI should not independently invent:

- objects
- rooms
- clues
- NPC facts
- puzzle solutions
- world history
- state changes
- outcomes

Canonical rule:

> **AI interprets intention. The game engine determines consequence.**

---

# 9. Local Model Possibility

## OPTIONAL / FUTURE

A browser-based local model may eventually be used for intent parsing.

Potential model families may include small Qwen, Llama, Gemma, Phi, or similar models supported by future browser inference systems.

Do not bind the initial architecture to a specific model.

Suggested interface:

```text
IntentInterpreter
├── DeterministicParser
├── LocalLLMAdapter
└── RemoteLLMAdapter
```

The game must remain playable without downloading a multi-gigabyte model.

---

# 10. Authored Prose vs Generated Prose

## CANON REQUIREMENT

Major prose should be deliberately authored.

Author-owned content includes:

- room descriptions
- major jokes
- clues
- character dialogue
- emotional scenes
- discoveries
- puzzle consequences
- major failure responses

AI may help interpret player language.

It should not replace deliberate writing with generic improv.

The player should frequently feel:

> Someone actually thought about what would happen if I tried this.

---

# 11. Save / Load

## CANON REQUIREMENT

Saving should be simple and reliable.

Recommended features:

- continuous autosave
- `SAVE`
- `LOAD`
- multiple manual save slots
- `UNDO`
- restart current encounter
- export save
- import save

For static hosting, browser-local persistence is acceptable.

IndexedDB is a reasonable implementation choice, but not mandatory.

---

# 12. Versioned Save Schema

Saves should include version metadata.

Illustrative:

```text
saveVersion: 3
gameVersion: "0.12.0"
state: {...}
history: [...]
```

The system should anticipate save migration as the game evolves.

---

# 13. Action History

Strong recommendation:

Keep a structured action history.

Potential uses:

- undo
- debugging
- replay
- test fixtures
- player support
- analytics
- narrative tricks
- second-playthrough comparison

Avoid making the game dependent on server-side storage.

---

# 14. Map and Memory Assistance

Optional UI may expose:

- known locations
- open questions
- discovered people
- clue notebook
- memory fragments

These systems should help the player remember.

They should not become objective markers that reveal what to do next.

---

# 15. REPL Presentation

The browser should feel immediate and low-friction.

Priorities:

- keyboard-first
- readable text
- fast command entry
- scrollback
- clear separation between player input and game output
- accessible on desktop and mobile
- optional clickable conveniences without requiring mouse use

The classic terminal aesthetic may be used selectively, especially around in-world terminals.

The entire game UI does not need to look like a green-screen terminal.

---

# 16. Testing Requirements

The deterministic engine should support automated testing of:

- parser mappings
- puzzle states
- item acquisition
- room traversal
- alternate solutions
- irreversible-state protection
- save/load
- undo
- memory triggers
- major reveal gates

The coding agent should favor structures that make story logic testable.

---

# 17. Implementation Freedom

The coding agent may choose:

- state library
- component structure
- parser library
- storage wrapper
- test framework
- folder organization
- build tooling

as long as the product behavior in these docs is preserved.

The spec defines contracts and intent.

It does not attempt to micromanage implementation.
