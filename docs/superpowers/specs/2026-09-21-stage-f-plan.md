# Stage F Plan — Polish to 1.0.0

**Status:** written and adopted by the main session 2026-08-31 (full-game
build protocol; the main session is on Fable and does the architect's work
itself — CLAUDE.md's routing note). **Covers:** everything between v0.19.0
and 1.0.0. **Inputs:** BACKLOG row F; the E3 gap list; the Stage E plan's F
reservations (M21–M24, plan §5 Q13); the hint-coverage audit (2026-08-31,
`scout`): all 18+ declared puzzles carry 3–5 rung ladders — coverage is
done; architecture §5's memory table; spec 04 §14 (replay), 02 §10 (NG+).

**Findings that shaped this plan**

1. **The stale ledger.** At the end of the canonical playthrough, these
   questions are still OPEN though the fiction settled them acts ago:
   `act1_q_notebook` (settled at the Wall Drug cache), `act1_q_wall_drug`
   (same), `act2_q_what_notebook_says` (settled by Eli's audit decode),
   `act2_q_boot_usb` (settled at Dad's boot — P12 names the question but
   nothing answers it), `act2_q_film_vs_database` (settled at the library's
   construction film). And `act2_q_inside_the_plant` shows SETTLED with an
   **empty answer** in the notebook view. A ledger that never closes is the
   wayfinding lesson again from the other side.
2. **The tie-breaker patch the E plan scheduled is already shipped** — M2,
   M3, M10, M16 all carry a default arm (social except M10's analytical).
   Nothing to do; recorded here so nobody re-opens it.
3. **M18–M20 exist; M21–M24 do not.** Architecture §5 reserves them for
   replay content triggered by early credential use. Ruling (register 148):
   they are the **seeded stratum leaking** — moments where the substrate
   knows something the investigator never learned. True for a
   second-playthrough human *and* for a first-run player who guesses the
   pair; canon 99 (nothing crosses the hand-off) is untouched because the
   knowledge crosses in the player's head and the fiction already accounts
   for it (the snapshot seed).
4. **The E3 gap list**, verified: `FOLLOW LUKE` by name (offstage npc nouns
   don't resolve — documented red-behavior test at
   `tests/world-act4-e1-addendum.test.ts:188`); the hab Galley's bare `OUT`
   (the airlock needs OPEN AIRLOCK; the canonical fixture tripped on it);
   the hab terminal's partially unreachable TYPE phrasings; `LOOK IN
   LOCKER` renders a generic while the cache is full; E1 §20's third
   escort trigger (leaving the room) unwired.

## Waves

**F0 — prose (narrative-writer, one commission):** M21–M24 (four fragments,
seeded-stratum first person, each re-scoring a scene, ≤120 words, no
cosmology/names/dates/counts) and the six missing answer texts above (plus
`act2_q_nolan_off_duty` if it proves empty too). Main-session review, then
register entries.

**F1 — wiring + mechanics (one game-builder):** register M21–M24 with these
triggers (main-session ruling; writer may propose refinements):

- M21 `{ all: [{ flag: act5_opening_login_seen }, { not: { flag: act2_started } }] }`
- M22 `{ all: [{ flag: act3_hub_logged_in }, { not: { clue: act2_clue_credentials } }, { not: { clue: act2_clue_indented_credentials } }] }`
- M23 `{ all: [{ flag: act5_branch_unlocked }, { not: { flag: act4_started } }] }`
- M24 `{ all: [{ flag: act5_root_accepted }, { not: { clue: act3_clue_jules_deprecated } }] }`

Wire the six answers (`answerWhen` on the def where a clean cond exists;
`answerQuestion` at the settling effect otherwise). Fix the gap list:
offstage-npc noun resolution for the follow handler (smallest change that
makes `FOLLOW LUKE` reach the room handler — if it needs an interpreter
change, propose before writing it); galley bare `OUT` routed to the
leave-hab script (room-level claim of the direction verb, the sheriff-office
idiom — verify the movement pipeline consults it, else escalate); hab
terminal TYPE phrasings; a locker `SEARCH`/`LOOK IN` contents listing
(script-composed from object names, the INVENTORY idiom — chrome, not
narration); E1 §20's third escort trigger.

**F2 — playtester sweeps (the new `playtester` agent, three briefs):**
Act I town · Acts II–III facility · Acts IV–V. Each reuses a canonical
fixture head and probes off it. Main session triages; one fix wave;
anything needing new prose goes back through `narrative-writer`.

**Ship: 1.0.0.** MAJOR per ADR 0005 (the milestone, not a break). CHANGELOG,
BACKLOG row F ✅, spec version lines, tag, push. Post-1.0 items stay on
`docs/spec/07`'s queue.
