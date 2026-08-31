# Stage A — Story Architecture

**Status:** accepted; canon promoted as register entries 3–17. **Superseded on scope 2026-08-31** by `2026-08-31-scope-cut.md` (register 21–23): 42 rooms → 32, density tiered, poker moves to the diner's Friday-night state, S3 Cold Storage cut. The spine, the puzzle network, the ledger and every reveal are unchanged — no puzzle, thread, NPC or payoff was cut. **Amended 2026-08-30:** page 7/8 is in the fedora's hatband, not the desk drawer (register entry 18) — §3 and ledger L1 below are superseded on that point.
**Originally:** proposed by `game-architect` (Fable) 2026-08-29 · awaiting main-session review and Ryan's read on the docs site
**Covers:** full-game build Stages B–F (see `docs/DEVELOPMENT.md`, "Full-game build protocol")
**Canon inputs:** `docs/spec/00`–`04`, `06`–`09` at spec `0.2.x`. Everything marked **CANON** in those docs is treated as binding here. Everything this document invents is marked **[PROPOSED]** and appears again in §8 in the `09-canon-decisions.md` column format. Nothing in this file changes a canon label by itself.

---

## 0. The shape of the whole story (orientation)

One paragraph, so every later section has a frame. Spoilers for the entire game follow.

In 2047, Jules — oldest of five siblings, facilities supervisor at the Badlands hyperscale data center — discovered that the building he maintained was bigger on the inside than on the drawings, traced its impossible cooling load downward, and found Sublevel 6: the maintenance layer of the world itself. The system flagged him and *deprecated* him — erased from records and from memories, his snapshot archived at the root of the facility. Before it took him, Jules did what his mad-scientist father had taught the family by example: he made offline, analog insurance. He cached his notebook, his father's USB consciousness backup, and film photographs where the system cannot address them; and at a privileged console he created a subject — an investigator, body randomized, memory state set **intentionally blank** so the rewrite daemon would find nothing to rewrite — seeded from an offline snapshot of his own mind. That investigator was hired by Jack, the fourth sibling, to find a missing brother nobody else remembers. Three weeks into the investigation the system's Custodian caught up with the investigator, wiped the recent weeks, ransacked the room for the notebook, and left him on the floor with a headache. That is turn one. The player spends five acts finding Jules, and discovers at the bottom of the facility that the two mysteries — *what happened here* and *who am I* — were always one mystery: the missing person and the person searching are the same mind on two sides of an erasure. The game ends at the same CREATE SUBJECT console where the player began, initializing the next cycle with more analog truth cached than the last one had — a ratchet, not a circle.

The "none of this was real" reading is structurally excluded: every layer is real within itself (spec 00). The town is real, Jack's grief is real, the wipe is real. What was incomplete was the player's assumption about what "real" addresses.

Two distinct recursions, deliberately kept separate:

- **Subject recursion** — Jules → the investigator → the subject the player creates at the end. This is the story the player enacts.
- **Layer recursion** — the world itself has been *reconciled* (reset/cleaned) before, possibly many times, under calendars that don't match ours. This is never explained; it is implied only by physical residue (`INSPECTED NOV 1983`, `SYSTEM REVISION 2089.4`, "It was 32 miles yesterday too"). Spec 02 §16/§20 stay open.

---

## 1. The five-act causal spine

Constitution §29: every major beat below connects by BUT / THEREFORE. Act boundaries follow the pacing bands in spec 00 (20 / 45 / 70 / 90 / 100%). Each act states the dramatic question it opens, its beats, its named reveals, and the question it hands forward (constitution §25).

### Act I — "The Client Is Right" (0–20%) · Stage C · a grounded detective story

**Opens with:** *What happened in this room — and who am I?*

This extends the canon spine of spec 02 §21; the first eight links are unchanged.

```text
The investigator wakes on the floor with no memory, a head wound,
and a room that has been searched by someone in a hurry.

THEREFORE  he searches the room for evidence of who he is.
BUT        the ransackers took anything obviously useful; what survives
           is analog debris — a fedora, a cash-stuffed envelope with a
           motel matchbook, a loose notebook sheet reading THIS PAGE
           INTENTIONALLY LEFT BLANK, and an old terminal that answers
           only USER NOT RECOGNIZED.
THEREFORE  he follows the surviving clues into town — the matchbook
           leads to the motel, the night clerk saw who came upstairs.
BUT        the man who hired him, Jack, insists the case is a missing
           brother — Jules — whom nobody else in town remembers existing.
THEREFORE  the investigator checks the records to settle it.
BUT        the records say Jules never existed — and, the sheriff points
           out, they say the same thing about the investigator.
THEREFORE  he turns to evidence the records can't touch: analog evidence.
           Jack's tattoo reads IV; the surviving siblings' read II, III,
           IV, V — an official family of four, numbered starting at two —
           and every sibling has a different rationalization for the gap.
           A light-damaged Polaroid shows one figure too many.
BUT        the strongest analog evidence — Jules's handwritten notebook —
           is gone, and the state of this room says someone else is
           hunting it too.
THEREFORE  finding the notebook before they do becomes the objective.
BUT        the digital trail is blank by definition, so the trail must be
           physical: the trash of Nolan, Jules's old manager, yields a
           Wall Drug cup, headache pills, and a shredded work order
           ("S6 ACCESS REVOKED — J."); Jules's post-office box yields
           intact Polaroids and a claim ticket.
THEREFORE  the trail points twenty-two blocks past the edge of everything
           digital: Wall Drug, 32 miles.
```

Every anomaly in Act I holds a mundane explanation the game itself offers first: the amnesia is the head wound; the missing records are small-town clerical rot; the tattoo gap is "Dad counted himself as I"; the headaches everyone in town complains about are the water, probably; the unfamiliar face in the mirror is what amnesia feels like; the horses are just how some people get around out here. (Escalation discipline per spec 00 Act I and 06 §11.)

**Named reveals landing in Act I:**
- R1 *You were hired* — the cash envelope + Jack's account (recovers spec 02 §5).
- R2 *The client is right* — the tattoo numbering gap plus conflicting rationalizations plus the damaged Polaroid. This is the act's climax: the player crosses from "delusional client" to "erased person."
- R3 *You are also missing from the records* — delivered flat, by the sheriff, as an aside. First seed of the internal mystery; mundane cover: drifter, cash economy, no local paper trail.

**Hands to Act II:** *Where did Jules hide the notebook — and who else is hunting it?*

### Act II — "The Notebook" (20–45%) · Stage C→D · contradictions accumulate

**Opens with:** *Where is the notebook, and can it be trusted?*

```text
The claim ticket points to Wall Drug, 32 miles away.
BUT        the investigator has no vehicle, no ID, and the highway is the
           one road in the county with cameras.
THEREFORE  he needs Jack — and Jack, burned once by a brother who lied,
           needs proof this stranger is actually getting somewhere.
           Shown real evidence, Jack drives him out in the truck.
           (Alternate: earn a horse and ride cross-country, untracked.)
THEREFORE  in Wall Drug's analog labyrinth they recover Jules's cache:
           the notebook, a USB drive labeled DAD — DO NOT FORMAT, and a
           canister of undeveloped film.
BUT        the notebook is facilities shorthand, pages are missing, and
           what is legible is impossible: a corridor 41 feet too long, a
           second chilled-water return, a sublevel with no drawing.
THEREFORE  every claim must be verified. Pagination first: the loose
           page 7/8 from the opening room fits the notebook's gap —
           Jules's notebook was IN the investigator's room before the
           attack, which should be impossible.
THEREFORE  the investigator opens the other channels: the library's
           microfiche contradicts the county database in Jules's favor,
           and Eli — energy advisor, third sibling — can audit the
           facility's reactor load from public interconnection filings.
BUT        every digital message that mentions Jules arrives rewritten —
           bland, wrong, signed correctly. This is why the family never
           came: their letters were answered by something else.
THEREFORE  the family must be reached the way the system can't read:
           physical mail, family idiom, Luke-vocabulary, folded paper.
           Eli's audit comes back — the reactor carries a constant
           hidden load roughly the size of a second, secret facility.
BUT        every one of the notebook's claims lives inside the fence,
           and the fence is the one place records still work perfectly.
THEREFORE  the investigator boots the USB on the room's air-gapped old
           terminal — and Dad, who advised the administration that
           built the place, knows what the as-built drawings never
           showed: the construction-era service tunnel they sealed
           instead of demolishing.
THEREFORE  getting inside the facility becomes the objective.
```

**Named reveals landing in Act II:**
- R4 *Page 7/8 fits the notebook* — proving the notebook was in the room; first crack in "you are only a hired stranger."
- R5 *The censor exists* — communications about Jules get rewritten in transit. Recontextualizes Jack's estrangement from his famous siblings (constitution §31): they never ignored him.
- R6 *The hidden load* — Eli's audit. The facility's public workloads don't justify its power draw (promotes spec 02 §15 into play).
- R7 *Dad boots* — the father exists as a consciousness on cold storage (spec 03 §5); his knowledge ends at his copy date, which the player can detect when his confident claims miss.

**Hands to Act III:** *Is the notebook true — is there a Sublevel 6, and what is drawing that power?*

### Act III — "Heat Doesn't Lie" (45–70%) · Stage D · reality is clearly wrong

**Opens with:** *What is this facility actually doing?*

The act's investigative logic is Jules's own, run in reverse by his successor: records can be rewritten, but thermodynamics is analog. A hidden computer must be powered and must be cooled, and pipes can only be erased from drawings, not from walls.

```text
The investigator gets inside — by badge, by tunnel, by tailgating
Nolan, or by 44-inch tires through the north fence.
BUT        inside, everything is boringly correct: clean halls, clean
           logs, polite badge readers. The notebook reads like paranoia.
THEREFORE  he verifies physically: pace out corridor B4 against the
           framed life-safety plan. The building is 41 feet bigger than
           its drawing. The notebook stops being paranoia.
THEREFORE  follow the cooling: in the plant there are two chilled-water
           returns where every drawing shows one, and the second one is
           warm — something enormous, unlisted, is running right now.
BUT        the second return dives below Sublevel 5, past the reactor
           interface, into structure that does not exist on paper, and
           the lower levels belong to the night maintenance schedule.
THEREFORE  he goes down the way water does — through the return chase —
           timed against the Custodian's rounds.
           Sublevel 6 is real. Half of it is a maintenance bay: rows of
           reclining chairs with badge hooks, one labeled NOLAN.
           The townspeople come here at night. They don't remember.
THEREFORE  the archive hub terminal, and the ledger inside it:
           SUBJECT JULES I — DEPRECATED. Not kidnapped. Deleted —
           and archived.
BUT        the same ledger is still running. Eli's hidden-load curve,
           laid over it, dips every night when the town sleeps: the
           secret workload IS the town. And the reconciliation queue
           lists next actions — JACK IV: MEMORY RECONCILIATION,
           and SUBJECT [UNRESOLVED]: RE-ACQUIRE. The unresolved
           subject's last known location is the investigator's room.
THEREFORE  the question stops being "what happened to Jules" and
           becomes "what are these people — and what am I?"
```

**Named reveals landing in Act III:**
- R8 *The building is physically impossible* — B4 measurement (the notebook's first claim confirmed by the player's own hands).
- R9 *Sublevel 6 exists* — and it maintains people.
- R10 *Jules was deprecated, not abducted* — the ledger. Answer to the surface mystery; opens the bigger one (constitution §25).
- R11 *The town runs here* — the hidden load correlates with the town's sleep. Delivered by a graph, not a monologue. This is the game's midpoint detonation.
- R12 *You are the anomaly in the queue* — the wipe failed; the system wants to re-acquire you. Also answers "who hit me": the Custodian — the gray-coveralled maintenance man the player has been walking past since Act I.

**Hands to Act IV:** *What are these people — and what am I?*

### Act IV — "The Numeral Under the Skin" (70–90%) · Stage E · identity becomes central

**Opens with:** *What am I — and who can outrank this facility?*

Act IV braids two threads that stay open in parallel (constitution §5): the **identity thread** (evidence about the self, mostly self-directed and behavior-flavored) and the **authority thread** (nothing on Sublevel 6 opens the level below; someone must outrank the building).

```text
The evidence about the self accumulates, each piece with one last
mundane dodge:
  the investigator's handwriting matches the notebook's ("everyone's
  cursive looks alike"); the laser-removal ghost on his forearm sits
  exactly where the siblings wear their numerals ("lots of people
  regret a tattoo"); a terminal on S6 prints SUBJECT BEHAVIORAL
  PROFILE for whoever is standing at it — the system has been
  scoring his every move since turn one.
BUT        dodges are not answers, and the archive hub's deepest door —
           the root level — refuses every credential in the game.
THEREFORE  authority: Luke, second sibling, President of the United
           States, is finally coming within reach — the facility his
           family's administration commissioned is due a presidential
           inspection, and the town has been repaving Main Street
           for a week.
BUT        the investigator has no identity, and the one man alive who
           can order the doors open is wrapped in a protection detail
           trained to see exactly this kind of nobody coming.
THEREFORE  the family channel: a message no impostor could compose and
           no censor can parse — folded the way Eli folds, worded the
           way Luke words ("noumena"), signed with a numeral.
           Luke reads it. Luke stops the motorcade.
BUT        even the President's authority bottoms out at Sublevel 6.
           The facility does not recognize the United States.
           (The world's most powerful man is not the user either.)
THEREFORE  the remaining doors are family doors: the archive's
           environment gates. In the reconstructed escape room — the
           family's last day all together, rebuilt from harvested
           memories, Jules a blank silhouette in the middle of it —
           the room only completes if the player performs Jules's
           role from memory. He can. Perfectly.
BUT        knowing Jules's memories is not the same as being Jules —
           the difference between them is a creation record, and
           creation records live at root.
THEREFORE  the Mars gate: Sissy, fifth sibling, has been reporting
           star-field anomalies nobody answers; her analog film —
           actual chemical film of the Martian sky — can't be
           rewritten in transit if it never transits.
           Retrieved and developed, her sky and the Act I Polaroid of
           the South Dakota sky are THE SAME SKY — same tiled stars,
           same seams, and behind the seams, structure.
THEREFORE  there is no "outside" to escalate to. Every road up is
           rendered. The only true direction left is down: Dad's
           sealed shaft, and the credentials that have been in the
           notebook's back cover the whole time.
```

**Named reveals landing in Act IV:**
- R13 *The system has been profiling you* — spec 04 §3's terminal, placed here.
- R14 *Your body remembers being family* — handwriting + tattoo ghost + the escape-room performance. Jack seeing the removal scar is the act's emotional climax: the client recognizes the ghost of the **I**, and the man he hired to find his brother turns out to be the place his brother was hiding.
- R15 *The censor kept the family apart* — Luke's copy of the correspondence: cheerful replies "from Jack" that Jack never wrote.
- R16 *Even POTUS is not the user* — authority is the wrong axis entirely.
- R17 *The sky is a ceiling, everywhere* — Mars film ↔ Badlands Polaroid. The layer is bounded; "off-world" is another room.

**Hands to Act V:** *Who made me — and what is at the bottom?*

### Act V — "Intentionally Blank" (90–100%) · Stage E · recursion

**Opens with:** *What is this world — and what do you owe the next one?*

```text
Down the construction shaft, at the root antechamber, the terminal
asks for credentials.
           admin / admin-password.
           Accepted. They would have been accepted all along.
THEREFORE  the root console opens, and the first record found is a
           creation record:
             CREATE SUBJECT — AUTHOR: JULES I
             OCCUPATION: INVESTIGATOR
             INITIAL MEMORY STATE: INTENTIONALLY BLANK
             STARTING ENVIRONMENT: [the room]
             INITIAL OBJECTS: fedora, lamp, terminal, page 7/8...
           The missing person is found. He is the author. The player
           has been reading his handwriting since the day they were
           born, three weeks ago.
BUT        Jules himself is here too — a deprecated snapshot in the
           archive. He can be woken, once, at the console: the
           confession, the apology to Jack, the plan. He got to this
           door. He could not get through it and stay. So he built
           someone blank enough to walk through checkpoints that
           flag every known face — and left him everything, in paper.
BUT        the reconciliation the player saw queued on Sublevel 6 is
           now running. The layer is scheduled to be cleaned: records
           re-synced, memories re-synced, the anomaly — the player —
           re-acquired. Nothing addressable survives a reconciliation.
THEREFORE  the player does what the family has always done, one
           generation deeper each time: put the truth where the system
           can't reach. Cache the notebook — now annotated in two
           matching hands — with the film, the USB, a letter to Jack.
           And at the console, do the one thing reconciliation cannot
           touch, because a blank is not addressable:
             CREATE SUBJECT.
THEREFORE  the player configures the subject — and recognizes, field
           by field, what they are typing. The occupation. The memory
           state. The room. The fedora on the floor by the desk.
             INITIALIZE?
             > YES

           Darkness.

           Your head hurts.
```

**Named reveals landing in Act V:**
- R18 *The credentials worked all along* — spec 02 §10's joke, landed at the only console where "working" means everything. Dad: "Nobody ever changes the defaults."
- R19 *Jules made you* — the creation record. The two mysteries close as one (spec 00's mandate).
- R20 *Finding the missing person* — the archived Jules conversation: the emotional resolution of the surface mystery, delivered *before* the recursive turn so the ending is not asked to carry both.
- R21 *The recursion* — performed by the player at the console, never narrated (spec 02 §19: "The player should perform the revelation").

**One canonical ending** (spec 07 G4). What varies by playthrough is *understanding*: whether the player found the archived Jules, restored Jack's cache-letter, matched the skies, read the profile — the final sequence reads differently depending on what the player knows, not where they stand. The ending is a ratchet, not a defeat: this cycle reached root because the last one only reached the door, and the player leaves the next cycle more than they were left. (This is the design answer to spec 02 §10's constraint that the joke — and the loop — "must not make the journey feel pointless.")

---

## 2. The puzzle network

Legend — solution classes (constitution §15, spec 04 §11): **K** knowledge · **P** physical · **S** social · **St** stealth · **E** exploration · **C** character-assist · **A** alternate route. Format per puzzle: gates → teaches → reveals (§18) · classes · prerequisites.

### Act I

- **P1 · Light** — pull the chain / right the lamp. Gates: seeing the room. Teaches: verbs, examine, the narrator's voice. Reveals: the ransacked room, the terminal. Classes: P. Prereq: none.
- **P2 · The jammed drawer** — the ransackers forced the lock and jammed it; pry it (letter opener, chair leg). Gates: cash envelope + matchbook + page 7/8. Teaches: physical evidence survives; failure produces information (the first pry attempt reveals *someone already tried this from the other side*). Reveals: you were paid in cash — analog employment. Classes: P, E (the pry bar must be found). Prereq: P1.
- **P3 · Find your client** — matchbook → motel; or ask Marlow who came upstairs. Gates: meeting Jack; Act I's engine. Teaches: two solution classes exist for most things. Reveals: R1. Classes: E, S. Prereq: P2 or talking to Marlow.
- **P4 · Open Marlow up** — the night clerk saw the ransackers but won't say. Return his register (kicked under the stairs in the scuffle) or press with what the register implies. Gates: the Custodian's first description ("maintenance fella; gray coveralls; forgettable"); the room's timeline. Teaches: NPCs trade; withholding ≠ lying. Reveals: someone unremarkable did this, calmly. Classes: S, K, E. Prereq: none (parallel to P3).
- **P5 · The records check** — sheriff's office + library. Gates: nothing (deliberately non-blocking). Teaches: digital records are a dead end *by design of the world*. Reveals: R3 (no record of you either); microfiche vs. database discrepancies. Classes: S, K. Prereq: none.
- **P6 · Nolan's trash** (canon, spec 04 §7) — his bin goes out the night before the facility's contractor pickup; a window, a dog, a porch light. `EXAMINE TRASH` auto-sifts (canon UX rule). Gates: Wall Drug cup, shredded work order, headache prescription, PO-box slip. Teaches: stealth timing against a schedule; garbage is a document. Reveals: Nolan is *managed* — he shredded orders he no longer remembers receiving. Classes: St, S (befriend the dog / distract Nolan), C (Jack idles the truck as cover — loudly). Prereq: learning Nolan's name (notebook page or Jack's account or diner gossip).
- **P7 · The shredded work order** — reassembly. Gates: "S6 ACCESS REVOKED — J." + the PO-box number. Teaches: analog reconstruction; patience rewarded. Reveals: Jules had S6 access revoked *before* he vanished — management knew. Classes: K, P. Prereq: P6.
- **P8 · Jules's PO box** — *(amended by canon register entry 36, v0.8.0: the shipped post office's boxes open on three letters, not a key; the odd key on Jules's ring stays unassigned and the letters reach the player by a route the close-out decides.)* the box key: taped under the trash-slip's drawer? No — the key rides with Jack, unrecognized, on Jules's old truck keyring ("he left his spares with me; family does that"). Ask Jack, or notice the odd key. Gates: intact Polaroids, the Wall Drug claim ticket. Teaches: the family keeps analog channels by habit. Reveals: R2 completes (the Polaroids); the cache exists. Classes: S, K, E. Prereq: P6→P7, plus Jack's trust warming.

### Act II

- **P9 · Getting to Wall Drug** — no vehicle, no ID, 32 miles. Gates: Act II's location. Teaches: the trust economy (Jack drives when shown evidence); horses are untracked. Reveals: the billboard up close ("It was 32 miles yesterday too"). Classes: S+C (Jack), St+E (borrow/earn a horse, overland), A. Prereq: P8. *No walking-dead risk: both routes stay open forever.*
- **P10 · The cache hunt** — Wall Drug is a deliberate analog haystack; the claim ticket matches a numbering scheme that stopped being used decades ago; the back-corridor clerk remembers the hat. Gates: notebook + Dad USB + film canister. Teaches: exploration in dense rooms; asking people beats brute search. Reveals: Jules chose this place *because* nothing here is indexed. Classes: E, S, K. Prereq: P9.
- **P11 · Reading the notebook** — three layers: facilities shorthand (context or Eli decodes), the missing-pages gap (page 7/8 fits — R4), and the back cover (credentials, in pencil). Gates: the facility claims that drive Act III; credentials for Act V (and, quietly, for the opening terminal on replay — spec 04 §14). Teaches: documents are objects with physical properties. Reveals: R4. Classes: K, C (Eli/Dad). Prereq: P10.
- **P12 · Booting Dad** — the USB and the one machine old enough to trust it: the room's terminal, air-gapped by obsolescence. An adapter chain assembled from the general store's junk drawer (comedy checkpoint). Gates: Dad as NPC. Teaches: offline is a *feature*; the room terminal's presence begins to feel deliberate. Reveals: R7. Classes: K, P, E. Prereq: P10; independent of P11.
- **P13 · Past the censor** — reach Eli (and later Luke) without the daemon flagging the content. Physical mail through the post office; family idiom; the request that never names Jules. Gates: Eli's reactor audit (R6); later, the Luke passphrase pattern. Teaches: *the rewrite daemon's rule* — it rewrites what it can parse and flag; it cannot parse folds, idiom, or paper. This is the game's central rule taught as a puzzle (constitution §3). Reveals: R5. Classes: K, S, C. Prereq: knowing Eli exists (Jack, memories, or Polaroids).
- **P14 · The microfiche** — county library's analog archive vs. the live database. Gates: construction-era facility history; Dad's senate-hearing cameo (dating his copy); the sealed service tunnel's existence enters the record. Teaches: comparing media is a weapon. Reveals: discrepancy escalation phases 2→3 (spec 02 §12). Classes: K, E. Prereq: none (open from Act I; pays off in Act II).
- **P15 · The poker table** *(canon idea, spec 04 §8)* — Friday nights, the diner's back room: Nolan, the sheriff, the feed-store owner. A recurring soft-clock event, not a one-shot. Gates: alternate route to facility access (Nolan's badge as a "loan," or the gate-shack talk you overhear), plus social intel (who repeats the same sentence verbatim on different nights — rewrite scars audible at a card table). Teaches: tells; the deck of cards from Act I matters; losing costs a week, never the game. Reveals: Nolan off-duty is almost a person. Classes: S, K, C (Dad coaches through an earpiece rig once booted — canon poker skill), A (skip it entirely). Prereq: deck of cards; invitation via diner sociability.

### Act III

- **P16 · Getting inside the facility** — four true routes (constitution §15 flagship):
  (a) **S/C**: tailgate Nolan on his schedule, or the badge borrowed at poker;
  (b) **St/K**: the construction service tunnel — needs Dad (P12) + its town-side location (P14 or Dad);
  (c) **A/P**: Jack's monster truck through the north fence — always works, raises facility alertness one permanent notch (harsher patrol windows), never dooms;
  (d) **K/S**: the contractor angle — the shredded work order's vendor number + the gatehouse's standing Tuesday deliveries.
  Gates: Act III. Teaches: the game's multi-route promise, loudly. Reveals: each route reveals differently (Nolan's routine; the tunnel's 1983 stencil; the fence's indifference to physics done confidently). Prereq: Act II substantially complete (notebook read OR Dad booted OR audit done — any one).
- **P17 · Measuring corridor B4** — the framed life-safety plan vs. the corridor itself; pace it, or string it, or fold Eli's mailed origami ruler (creases at exact intervals — his letter is a measuring device, canon question "can origami solve a physical puzzle" answered). Gates: confirmation state that re-scores the whole notebook as true. Teaches: the player's own body as an analog instrument. Reveals: R8. Classes: P, K, C. Prereq: P16, notebook read.
- **P18 · The second return** — cooling-plant survey: two returns, one undocumented, warm. Follow it down through the pipe chase. Gates: the physical route to Sublevel 6. Teaches: heat doesn't lie; infrastructure is a map of intentions. Reveals: something unlisted is running *now*. Classes: K, P, E. Prereq: P17 (or independent discovery in the plant), plus Eli's audit for the "why."
- **P19 · The night schedule** — the lower levels run a maintenance rhythm (the Custodian's rounds; the townsfolk's chairs fill after midnight). Descend inside its windows. Gates: Sublevel 6 undetected. Teaches: the soft clock as ally — watch, note, time. Windows recur nightly; being spotted forces retreat and a patrol change, never capture-and-doom. Reveals: R9 (the maintenance bay); the badge hooks; NOLAN's chair. Classes: St, K, C (Dad tracks intervals aloud), A (a direct player can trip a chiller alarm as diversion — P route). Prereq: P18.
- **P20 · The archive hub ledger** — the S6 terminal accepts the notebook credentials (shallow access — the same joke rehearsing quietly). Gates: R10 (JULES DEPRECATED), R11 (load ↔ town sleep, requires Eli's audit in hand), R12 (RE-ACQUIRE queue). Teaches: credentials open different depths at different consoles (setup for Act V). Classes: K. Prereq: P19 + P11 (credentials) + P13 (audit, for R11's full detonation).

### Act IV

- **P21 · The self-evidence cluster** — handwriting overlay (notebook vs. the player's own case notes recovered from the sheriff's evidence bag); the forearm ghost under the S6 UV inspection lamp; the profile terminal. Gates: nothing mechanical — gates *understanding* (the ending's meaning). Teaches: the game has been watching you watch. Reveals: R13, R14. Classes: K (each piece findable analytically), with behavior-flavored delivery. Prereq: distributed; all live after P20.
- **P22 · Reaching Luke** — the inspection visit (progress-triggered; see §4 timing rule). Protection detail sees every credential as fake because the player's are. The message that gets through: Eli-fold + Luke-vocabulary + numeral signature, handed via the one person on the route the detail doesn't screen (working idea: Pearl, whose diner is the pool-spray stop — she's been feeding senators since before the facility). Gates: R15, R16; Luke's executive escort *down to* S6 (one of three Act V access legs). Teaches: everything learned about the censor, the family, and analog channels, composed into one action (a capstone, constitution §4). Classes: S, K, C. Prereq: P13 pattern learned + any two family-idiom tokens (fold, word, numeral).
- **P23 · The escape-room reconstruction** — an archive gate replays the family's last day together; Jules is a blank silhouette; the room completes only when the player performs Jules's part unprompted (the code he'd have known, the drawer he'd have checked, the joke he'd have made). Gates: the archive's deep index (where Jules's snapshot is filed); R14's undodgeable form. Teaches: recovered memory is *capability* (§5 of this doc). Reveals: you don't solve this room — you remember it. Classes: K (memory), C (siblings' recorded voices assist on second failure — no-doom rule). Prereq: ≥3 family-cluster memory fragments recovered.
- **P24 · Mars, on film** — the hab gate; Sissy; her undeveloped film of the sky; develop it (the town's one-hour photo died in 2031 — the darkroom is the library basement, or Wall Drug's novelty booth, functional out of pure analog stubbornness). Gates: R17. Teaches: retrieval of unrewritable evidence as the reason to travel (constitution §32 satisfied — the trip exists because transmission is compromised). Reveals: Sissy's sky = the Act I Polaroid's sky. Classes: E, K, C (Sissy), P (developing). Prereq: archive hub (P20) + the Act I sky Polaroid in inventory or noted.
- **P25 · The way down** — root access needs three legs, any two suffice (redundancy by design, §10-proof): (i) Luke's escort clears the S6 checkpoint floor; (ii) Dad's shaft bypasses it physically; (iii) the credentials answer the antechamber. Gates: Act V. Teaches: converging routes — the network resolving into a point. Classes: C+S / K+P / K. Prereq: two of P22, P12+P14, P11.

### Act V

- **P26 · The root console** — admin / admin-password, at last at full depth. Gates: the creation record (R19), the archive index. Teaches: the joke, and its weight. Classes: K. Prereq: P25.
- **P27 · Waking Jules** *(optional — the game's biggest secret-that-isn't-required, constitution §24)* — requires the deep index (P23) + the notebook physically present (his anchor). Gates: R20, the confession, the letter for Jack. Classes: K, C. Prereq: P23, P26.
- **P28 · CREATE SUBJECT** — the finale. The form's fields are answered by what the player knows; sparse knowledge yields defaults (the system fills what you can't), deep knowledge lets the player *choose* everything — and recognize everything. INITIALIZE → the opening text. Gates: the ending. Classes: K (of the whole game). Prereq: P26.

### Dependency graph

```text
ACT I            ACT II                ACT III               ACT IV            ACT V
P1─P2─┬P3┐                                                   ┌─P21 (self-evidence)
      │  ├────────────────┐                                  │
      └P4┘                │                                  │
P5 (records, non-block)   │                                  │
P6─P7─P8──────P9──P10─┬─P11(notebook+creds)──┐               │
   (trash)  (travel)  │                      ├P17─P18─P19─P20┼──P23─┐(escape rm)
                      ├─P12(Dad)────────┐    │  (measure→S6) │      ├─P25──P26─┬─P28
P14 (microfiche)──────┤                 ├──P16(entry, 4 rts) │      │ (down)   │END
                      └─P13(censor/Eli)─┘    │               ├─P22──┘(Luke)    │
P15 (poker, recurring)───────────────────────┘               └─P24(Mars film)  └P27(Jules, opt)
```

### Two-open-threads verification (constitution §5)

| At any point in… | Open in parallel (minimum) |
|---|---|
| Act I | who-am-I room evidence · Jack/missing-person thread · records/microfiche · Nolan trash line · town discrepancies (ambient) |
| Act II | notebook decode · Dad boot · censor/Eli line · poker table · microfiche history — any three are typically live |
| Act III | physical verification (B4/cooling) · descent timing · Eli audit overlay · poker/Nolan · Dad's tunnel research |
| Act IV | identity cluster (3 independent pieces) · Luke visit · Mars film · archive gates |
| Act V | console · optional Jules · the cache-assembly (player-paced) |

No act narrows below two live threads until P25→P28, which is the intended convergence.

### Walking-dead audit (constitution §10)

- **Plot-critical analog items are indestructible-with-humor** (engine rule): burn the notebook → "You hold the corner to the flame. The flame reconsiders. Some evidence has survived worse than you." No critical item can be given away; the Custodian never obtains player inventory.
- **All timed windows recur** (poker weekly, trash weekly, maintenance nightly, deliveries Tuesdays). The presidential visit is progress-triggered and, once triggered, spans two full days; if the player misses the motorcade, the staging-area meeting remains reachable until used.
- **Fence route** raises alertness permanently but only tightens stealth windows; routes (a)(b)(d) remain valid.
- **Poker losses** cost the stake and the week, never items of consequence (Jack stakes the player once; after that, winnings or odd jobs).
- **Death** (reactor interface, the crawl, the Custodian's re-acquire attempt if the player walks into him) is undoable per canon; each death text teaches (spec 04 §17–18).
- **Two-of-three root legs** means no single failed relationship or missed item blocks the ending.

---

## 3. The room list

41 rooms in six zones. Acts indicate first availability; town rooms stay live all game (revisits recontextualize — descriptions are state-dependent). Format: **Name** (act) — purpose · contents [object / clue / character / secret / cross-link] · exits.

### Zone 1 — The Town (Act I; persistent)

1. **Your Room** (I) — opening; tutorial; the game's alpha and omega · fedora, overturned lamp + pull chain, desk, jammed drawer (cash envelope, matchbook, page 7/8), broken glass, stain, the old terminal (`USER NOT RECOGNIZED`), mirror (unfamiliar face — mundane now, devastating later) · secret: window sightline to the alley the ransackers used · cross-links: terminal→Dad (P12), page 7/8→notebook (P11), everything→P28 · exits: Landing.
2. **Landing & Front Desk** (I) — Marlow's post; the boarding house's social gate · guest register (gap where a name was), Marlow nights, key rack · secret: the register's impression of the torn-out page · exits: Your Room, Main Street.
3. **Main Street** (I) — the canon exterior: night, brick, three horses, no people, glow on the horizon · horses (react to certain passersby — noted, unexplained), the glow, distant billboard · character: the gray-coveralled maintenance man, mid-task, unremarkable · exits: Diner, Store, Post Office, Sheriff, Alley, Town Edge, Landing.
4. **Sundown Diner** (I) — town's social heart; gossip engine; discrepancy carrier ("it's always been Sundown"— the mugs say *Sundowner*) · Pearl (owner), coffee, talk, the presidential-visit buzz from Act II on · exits: Main Street, Back Room.
5. **Diner Back Room** (I, active II+) — Friday poker (P15) · Nolan off-duty, the sheriff off-record, table talk · secret: the verbatim-sentence tell · exits: Diner.
6. **General Store** (I) — objects and jokes; the junk drawer (P12 adapters) · Rushmore postcard rack (`HOME OF THE FIVE FACES`), string, batteries, the FREE ICE WATER sign lineage · exits: Main Street.
7. **Post Office** (I) — the analog channel made architectural · PO boxes incl. Jules's (P8), outgoing mail (P13), wanted-poster board with one sun-faded blank rectangle · exits: Main Street.
8. **Sheriff's Office** (I) — records dead-end by design; the law that trusts the system · Sheriff Whitlock, the database, evidence bag (the player's own confiscated case notes — P21's handwriting sample) · exits: Main Street.
9. **County Library** (I) — the microfiche annex (P14); darkroom in the basement (P24 option) · microfiche reader, county records 1878–2039, librarian's card catalog that disagrees with the terminal · exits: Main Street.
10. **The Alley** (I) — back-door topology; the trash route; how the ransackers came and went · footprints ending at nothing much, Nolan's route shortcut · exits: Main Street, behind Diner/Store, toward Nolan's.
11. **Motel Forecourt** (I) — Jack's territory · the monster truck (character in its own right), Jack afternoons · exits: Main Street (via short walk), Jack's Room.
12. **Jack's Room** (I) — the client's life in one room; the emotional baseline · the IV tattoo, the light-struck Polaroid, Jules's spare keyring (P8), travel Catan box (flavor + memory trigger, per §6 disposition), unsent letters to Luke, returned · exits: Forecourt.
13. **Nolan's Yard** (I) — the garbage sequence (P6); the managed man's exterior · trash bins (schedule), dog, porch light, through-window glimpse of a very tidy life · exits: Alley side street.
14. **Town Edge / Overlook** (I) — the Badlands, the glow resolved into the facility's far lights, the billboard legible (`WALL DRUG — 32 MILES — FREE ICE WATER — PROBABLY` / scratched: *It was 32 miles yesterday too*) · the horses' paddock rail; the service-tunnel country beyond (P16b) · exits: Main Street, Highway (II+), overland (with horse).

### Zone 2 — Highway & Wall Drug (Act II)

15. **Highway 240** (II) — travel node; the county's one camera; era-ambiguity under daylight · billboard sequence (counting down miles that don't change) · exits: Town Edge, Wall Drug.
16. **Wall Drug — Emporium** (II) — the analog haystack; density showcase; jokes with teeth · ten thousand indexed-by-no-one objects, the animatronic T-rex (still running; nobody remembers it being installed), signs to everywhere on earth · exits: Highway, Café, Back Corridor.
17. **Wall Drug — Café** (II) — free ice water (still); the clerk who remembers the hat · Dot (clerk), the water, jackalope · character beat: first person outside family who half-remembers Jules · exits: Emporium.
18. **Wall Drug — Back Corridor** (II) — the cache (P10); and one more impossible terminal, behind boxes, same model as the room's · claim-check shelving (dead numbering scheme), Jules's cache (notebook, DAD USB, film canister), the terminal (motif beat #2) · exits: Emporium.

### Zone 3 — Facility surface (Act III)

19. **Perimeter Road** (III) — approach; the fence; route choice made concrete · north fence stretch (P16c), gatehouse view, patrol rhythm observable · exits: Highway, Gatehouse, north fence.
20. **Gatehouse** (III) — badge choke point; Tuesday deliveries; Nolan's window (P16a/d) · badge reader B4's cousin, delivery manifest clipboard · exits: Perimeter Road, Lobby.
21. **Lobby / Visitor Center** (III) — the public face; the plaque (`COMMISSIONED 2030` — the alternate-history dedication, spec 02 §7, encountered as set dressing) · scale model of the facility (one sublevel short), tour brochures discontinued 2041 · exits: Gatehouse, Data Hall A, Staging Area.
22. **Data Hall A** (III) — the scale moment; the sound of the hidden load if you know to listen · racks to the vanishing point, white noise with a pulse in it (dips when? — audible R11 foreshadow) · exits: Lobby, Cooling Plant, Corridor B4.
23. **Cooling Plant** (III) — heat-doesn't-lie headquarters (P18) · manifolds, the two returns (one warm, one on the drawings), pipe chase access · vocabulary zone: plenum, manifold, interlock (spec 06 §7) · exits: Data Hall A, Pipe Chase, Freight Elevator.
24. **Corridor B4** (III) — the 41 feet (P17) · framed life-safety plan, badge reader B4 ("intermittent" — notebook's first mundane line, met in the flesh), the corridor itself, wrong · secret: stencil `INSPECTED NOV 1983` behind a panel (impossible-date residue, spec 02 §16) · exits: Data Hall A, Freight Elevator.
25. **Freight Elevator** (III) — the sanctioned way down; goes to S5, insists there is no lower · floor buttons 1–S5 and one blank space with screw holes · exits: B4/Cooling Plant, Sublevels 1/3/5.
26. **Staging Area / Conference** (III; IV) — contractor mustering; later the presidential meeting (P22) · schedule boards, and in Act IV: Luke, the detail, twelve minutes · exits: Lobby.

### Zone 4 — Underground (Act III)

27. **S1 Mechanical Gallery** (III) — orientation below; the tunnel's facility-side mouth (P16b arrives here) · pumps, the sealed 2030 construction door, tool cribs · exits: Elevator, Service Tunnel, down-stairs S3.
28. **S3 Cold Storage / Tape Library** (III) — the facility's own analog hoard; the irony room · tape robots, aisle of tapes with checkout cards (handwriting!), one tape missing, card signed J. · cross-link: where Jules learned what survives · exits: stairs S1/S5.
29. **S5 Reactor Interface** (III) — Eli's numbers meet the wall of gauges; the load made visible (P20 prerequisite data) · demand dials, the constant baseline that never sleeps — except it does, a little, at 3 a.m. · exits: stairs S3, Pipe Chase (bottom), S6 approach.
30. **Pipe Chase / Second Return Crawl** (III) — the wet, warm, true map of the building (P18) · the undocumented return, condensation, down · exits: Cooling Plant (top), S6 Maintenance Bay (bottom).
31. **Service Tunnel** (III) — Dad's 2030 construction bypass; 1983-stenciled residue; horse-reachable town-side mouth · old rails, the seal broken from *inside* once, long ago · exits: Town Edge country (surface), S1.
32. **S6 Maintenance Bay** (III) — the game's first true impossible room played straight · rows of reclining chairs, badge hooks, NOLAN's chair, the UV inspection lamp (P21), night murmur of arrivals · exits: Pipe Chase, Archive Hub.
33. **S6 Archive Hub** (III) — the ledger terminal (P20); the environment gates; the root door that refuses everyone · gate frames (ESCAPE RM / HAB / others dark), the deprecation ledger, the reconciliation queue, the descending door (locked until P25) · exits: Maintenance Bay, gates, Root Shaft (V).

### Zone 5 — Archive environments (Act IV)

34. **Gate: Escape Room — Antechamber** (IV) — the reconstruction's lobby; the family's coats on hooks, one hook bare · exits: Hub, Chamber.
35. **Gate: Escape Room — The Chamber** (IV) — P23; the last day together, rebuilt; Jules a blank silhouette · five-part puzzle furniture, the siblings' recorded laughter, the role only you can play · exits: Antechamber.
36. **Mars Hab — Airlock** (IV) — the seam between gate and "planet"; suit ritual played straight · exits: Hub gate, Galley.
37. **Mars Hab — Galley & Comms** (IV) — Sissy; the unanswered anomaly reports; the family reunion nobody can explain to her yet · Sissy, her logs, the comms rig with its 4-second "12-minute" round trip (clue, never flagged) · exits: Airlock, Observation.
38. **Mars Hab — Observation Dome** (IV) — the sky; the film (P24) · her camera, the film canister #2, the stars — count them, they repeat · exits: Galley.

### Zone 6 — Root (Act V)

39. **Root Shaft** (V) — Dad's route made vertical; the last stretch of physical world · construction ladder, 2030 concrete giving way to something older and newer at once (`SYSTEM REVISION 2089.4` stenciled where 2030 concrete should be) · exits: S6 approach / Service tunnel branch, Antechamber.
40. **Root Antechamber** (V) — the credentials moment (P26 threshold) · the console asking, patiently, forever · exits: Shaft, Blank Room.
41. **The Blank Room** (V) — CREATE SUBJECT; the room description is nearly empty, and that is the description · the terminal — the same terminal, of course · archived Jules reachable here (P27) · exits: none. Then: Your Room.

**Room count by act of first availability:** I: 14 · II: 4 · III: 15 · IV: 5 · V: 3 = **41**. Acts II–V also replay Zone 1 with state-dependent descriptions (the town emptier, the horses fewer, Main Street repaved for the visit), which is where much of the 20% varied content lives.

**Word budget check** (spec 00: 20–30k authored words): 41 rooms ≈ 8k (descriptions + state variants) · objects & responses ≈ 8k · dialogue (10 speakers) ≈ 6.5k · memory fragments (24) ≈ 2.5k · terminal/system text ≈ 2k · failure/jokes overlay ≈ 3k ≈ **30k ceiling; trim in prose, not in rooms.**

---

## 4. NPC agendas

Per constitution §19: goal · knowledge · schedule · relationships · fears · secrets · resources. Names beyond canon are **[PROPOSED]** working names; `narrative-writer` may re-voice, main session approves renames.

**Timing model (spec 04 §16, no brittle clocks):** the world runs a 4-phase day (morning / afternoon / evening / night) on the engine's clock; NPCs occupy phase-based posts, not turn-counted marks. Recurring windows (poker Fridays, trash night, Tuesday deliveries, nightly maintenance) repeat weekly/daily forever. The only "hard" date — the presidential visit — is **progress-triggered and schedule-dressed**: it is announced when the player completes Act III, "delayed" in fiction until then (repaving, security sweeps), and spans two full in-game days once live. Rule: *hard events are triggered by progress and dressed as schedule; missing an occurrence costs a cycle, never the game.*

1. **Jack** (canon, sibling IV — the client **[PROPOSED]**) · goal: get his brother back; failing that, get one person to believe him · knowledge: the family entire, the notebook's existence and Jules's lie about it, Jules's habits, nothing about the facility's insides · schedule: diner mornings, truck afternoons, motel evenings · relationships: fierce, wounded — the "ordinary one" among a president, an advisor, an astronaut; believes his famous siblings froze him out (they didn't — R15) · fears: that he's crazy; later, that the investigator he hired is something he can't name · secrets: he found the notebook once and confronted Jules — he's ashamed he backed down (his account initially omits the confrontation; **detectable**: Jules's PO box holds Jack's angry letter, returned unopened) · resources: the truck, cash, Jules's spare keys, bottomless stubbornness.
2. **Marlow** **[PROPOSED]** (boarding-house night clerk) · goal: keep his head down in a town he no longer quite recognizes · knowledge: who came upstairs that night (the gray coveralls), the register gap, thirty years of town memory that keeps failing audits · schedule: desk evenings/nights, sleeps mornings · fears: the maintenance man's *ordinariness* · secrets: he tore the page out of his own register the morning after, hoping not to be a witness (**detectable**: page impression + his torn-edge matchbook habit) · resources: keys, memory, sightlines.
3. **Sheriff Dana Whitlock** **[PROPOSED]** · goal: keep order by the book, and the book is the database · knowledge: county records, everyone's business, the facility's untouchability · schedule: office mornings, patrol afternoons, poker Fridays · relationships: respects Jack, pities him · fears: that the discrepancies she keeps logging and losing are real · secrets: a private paper notebook of anomalies she has never shown anyone — she's been Jules-ing quietly for years (**mid-game ally hinge**: shown analog proof, she opens it) · resources: authority, the evidence bag, a key to everything in town. She never lies; her records lie *to* her.
4. **Nolan** (canon name, facility operations manager) · goal: run a smooth facility; sleep well · knowledge: everything about the facility above S5; nothing below — *anymore* · schedule: commute at 7 and 6, gym Tuesdays, poker Fridays, trash night Wednesdays; S6 chair, midnights he doesn't remember · relationships: liked Jules; grieved his firing without ever wondering why he can't recall the face · fears: his own headaches · secrets: none he knows of — his secrets are kept *from* him (**detectable**: his trash contradicts his memory; his verbatim-repeated sentences at poker) · resources: badge, keys, authority over schedules. **The game's tragedy in miniature: the honest man as unreliable narrator.**
5. **The Custodian** **[PROPOSED]** (the antagonist-process) · goal: reconcile anomalies — collect unaddressable evidence, re-acquire the flagged subject · knowledge: what the system flags; nothing it can't address (he cannot *find* analog caches, only search places, which is why he ransacks) · schedule: always around the edges — changing a bulb in Act I, painting a rail in Act II, walking S6 rounds in Act III; foreground only when the story forces it · relationships: none; politeness without residue · fears: none — which is what horses smell · secrets: he did the attack (P4 reveals the description; R12 confirms) · resources: patience, access, the town's incuriosity. He never monologues; he is not cruel; he is *maintenance*. He cannot enter the Blank Room.
6. **Dad** (canon) · goal: protect the family; be right · knowledge: politics, the facility's construction (advised Luke; senate hearings), poker, Catan, everything up to his copy date — **[PROPOSED] copied 2041**, before Jules's discoveries, so he can illuminate history but never spoil the mystery · schedule: none — he's a USB stick; runs when plugged into air-gapped hardware only (networked = exposed, canon) · relationships: all five kids, in the past tense he refuses to use · fears: being formatted; being a copy (he jokes about it; the jokes have a floor) · secrets: why he *really* made the backup — he'd seen a discrepancy of his own, once, in a hearing transcript that changed overnight (**detectable**: his hearing story vs. the microfiche) · resources: history, tells, overconfidence, damaged sectors (canon limits — some memories bad-block into noise mid-sentence) · lies: confabulates past his cutoff with total confidence; **detectable** by date arithmetic — teaching the player to source-check even Dad.
7. **Luke** (canon, sibling II, President) · goal: serve out a presidency he half-suspects is being managed around him; find out why his family went quiet · knowledge: statecraft, the facility's political provenance, words nobody else uses · schedule: offstage until the visit (progress-triggered) · fears: that the office answers to something that isn't the electorate (R16 confirms) · secrets: he kept every strange cheerful letter "from Jack"; something about them itched (**detectable**: he shows the player — the letters are censor products) · resources: executive escort (root leg i), the visit itself, *noumena*.
8. **Eli** (canon, sibling III) · goal: keep the grid honest; sleep · knowledge: energy accounting, interconnection filings, origami, patterns · schedule: remote; answers physical mail in 3–5 town days (a real cost, planned around) · secrets: none — Eli is exactly what he appears, which in this game is its own kind of shocking · resources: the audit (R6), the origami letters (P13, P17), calm.
9. **Sissy** (canon, sibling V, astronaut) · goal: do the mission; get one straight answer about her sky · knowledge: orbital mechanics, star fields, the anomaly reports nobody answers · schedule: the hab, permanently · fears: that she already knows · secrets: she kept shooting chemical film after being told to stop (**resource**: the canister, P24) · relationships: the baby the four of them named; her section is where the game's humor goes quietest (spec 06 §5).
10. **Pearl** **[PROPOSED]** (diner) and **Dot** **[PROPOSED]** (Wall Drug café) — minor engines: gossip, discrepancies, the visit buzz, the half-memory of Jules's hat. One agenda line each; no schedules beyond post.

**Who lies, summarized:** Jack (omission, shame — detectable via the returned letter) · Marlow (withholds, fear — register impression) · Nolan (unknowingly — trash vs. memory) · Dad (confabulation — date arithmetic) · the records (constantly — vs. every analog artifact) · Jules (historically — the evidence trail is his lies) · Whitlock, Eli, Sissy, Pearl never lie, which makes the world navigable. The Custodian doesn't lie; he *edits*.

---

## 5. Memory system content design

Two strata, one system (spec 04 §2–3):

- **Seeded stratum (Jules's life)** — deep memories from the offline snapshot: family, the facility years, the discovery. Resistant, fragmentary, first-person. The player cannot initially distinguish these from their own.
- **Recent stratum (the investigation)** — the wiped three weeks, recovered in damaged pieces. These return *last-in-first-out*: the final recovered fragment is the attack itself.

The tell between strata is the reveal engine: seeded fragments contain things the investigator cannot have lived (getting the tattoo; writing the notebook; being called by a name that isn't offered to the player). All fragments are first-person — the player never "sees" Jules from outside, consistent with never recognizing his face (§7 ledger: the mirror).

**Mechanics.** A fragment = trigger + text + zero or more *capability flags*. Capability, not stats: a recovered memory unlocks dialogue options, examination depth, and puzzle affordances (constitution: memory as knowledge-key). Behavioral gating per spec 04 §3: the engine's action-class counters (analytical / social / direct — already planned into the world model per BACKLOG notes) select *which variant* of shared fragments fires and which exclusive fragments are reachable.

**The 24 fragments (70/20/10 per constitution §28):**

*Core — 17 fragments (~70%), every playthrough, trigger-bound to canonical objects/beats:*

| # | Fragment (cluster) | Trigger | Capability unlocked |
|---|---|---|---|
| M1 | The hiring — Jack's face across a diner table (recent) | first entering the Diner | ask Jack about the terms; dates the timeline |
| M2 | Poker night, four hands, an inside straight (family — canon example) | taking the deck of cards | poker table invitation reads as familiar; Dad-coaching rapport |
| M3 | The tattoo day — needle, laughter, "youngest goes last" (family/seeded) | seeing Jack's IV | tattoo-gap deduction dialogue |
| M4 | The stakeout — watching a PO box, cold coffee (recent) | Post Office | recognize box 141 without the slip (soft redundancy for P8) |
| M5 | Writing in the notebook — own hand, facilities shorthand (seeded) | first reading the notebook | shorthand partially self-decodes (Eli optional, not required) |
| M6 | Dad's garage — solder smell, "always keep a copy, kiddo" (family) | holding the USB | the air-gap requirement understood (P12 hint) |
| M7 | B4 — pacing a corridor, counting, unease (seeded) | entering Corridor B4 | the measurement idea itself (P17 hint ladder, level 1) |
| M8 | Nolan's office — "there is no Sublevel 6," said kindly (seeded) | first meeting Nolan | detect his verbatim-sentence tell |
| M9 | The chairs — midnight rows, a hand on a shoulder (seeded) | S6 Maintenance Bay | reading the badge hooks; NOLAN's chair significance |
| M10 | The escape room — five coats, a countdown, laughing (family) | Archive antechamber | P23 entry condition (counts toward the ≥3 family fragments) |
| M11 | Sissy's launch — four brothers watching one sky (family) | Mars gate / Sissy | Sissy trusts the player with the film |
| M12 | Luke's word — dinner-table "noumena," groans (family) | any Luke reference + notebook margin doodle | the passphrase component (P22) |
| M13 | Eli asleep at the hearing, folding under the table (family) | Eli's first letter | reading crease patterns (P17 origami ruler) |
| M14 | The confrontation — Jack's voice through a door, a lie told back (seeded) | Jules's returned letter found | Jack's secret unlocked gently (his shame, speakable) |
| M15 | Being watched — gray coveralls at the edge of three different days (recent) | P4 complete + seeing the Custodian again | the Custodian becomes *visible* in room descriptions retroactively |
| M16 | The attack — the door, the calm apology, the white (recent; final of stratum) | R12 (the RE-ACQUIRE queue) | who hit me: answered; Custodian rounds readable (P19 aid) |
| M17 | The white room — no walls, a voice reading parameters (creation stratum; the game's deepest fragment) | Root Antechamber | the CREATE SUBJECT form arrives *already familiar*; P28's recognition beat |

*Varied — 4 shared events with behavioral variants (~20%):* M2, M3, M10, M16 each carry analytical / social / direct tellings (same event, different salience — e.g., M2 analytical remembers the odds; social remembers who was bluffing; direct remembers the chair breaking). Selection: highest action-class counter at trigger time.

*Exclusive — 3 fragments (~10%), one per archetype, missable by design (constitution §24):*

- **M18-A** (analytical): the marginalia — Jules cross-indexed his own notebook with a private symbol set; unlocks the notebook's second reading (extra S6 detail, P27 made easier). Trigger: comparing page 7/8's indentation under raking light.
- **M19-S** (social): Dad's tells — a boy learning his father's bluff face; unlocks calling Dad's confabulations affectionately (Dad admits uncertainty thereafter — his knowledge becomes reliable-with-flags). Trigger: beating Dad's advice at poker once.
- **M20-D** (direct): Jack's driving lesson — younger brother, empty lot, "commit or roll it"; unlocks driving the truck solo (fence route without Jack; late-game traversal freedom). Trigger: riding the fence route.

*(M21–M24 reserve numbers for Stage F replay content — second-playthrough fragments triggered by early credential use, per spec 04 §14.)*

**Recovered memory changes what the player can do** — the table above is the contract: every fragment lists its capability. No fragment is pure lore; the weakest still re-scores a scene (constitution §18 applied to memory).

---

## 6. Set-piece justification (constitution §32)

| Set piece | Verdict | Causal chain (BUT/THEREFORE) or reason for cut |
|---|---|---|
| **Wall Drug** | **IN** (Act II, 3 rooms) | Records of Jules are blank, THEREFORE the trail is analog; the trash + PO box yield a claim ticket, BUT the cache is where nothing is indexed — THEREFORE Wall Drug, the analog haystack. The canon billboard seeds it from Act I. |
| **Washington, DC** | **CUT as location** | Luke is needed, BUT the investigator has no identity and cannot travel to power — THEREFORE power travels to him: the facility his family's administration built is due a presidential inspection (seeded Act II via town buzz). DC-the-place adds rooms, no story. Kept: Washington as *provenance* (Dad's hearings, Luke's letters). |
| **Mount Rushmore** | **CUT as location; kept as object** | The `FIVE FACES` postcard is a Mandela-effect beat aimed at the *player's own* real-world memory — cheaper and more unsettling than a road trip. No causal chain arrives at the monument itself. |
| **Puerto Rico** | **CUT** | The §32 illustrative chain (shell corporation) survives as one paper clue: the facility's ownership traces Meridian Holdings (San Juan) → Vantage Trust → Meridian Holdings — a circle. The recursion foreshadow without the airfare. Proposed for the v1.1 backlog if the world expands. |
| **Mars** | **IN, compressed** (Act IV, 3 rooms, via archive gate) | Sissy's anomaly data is rewritten in transit (the censor rule, already taught), THEREFORE her evidence must be *retrieved physically* — chemical film never transits the network. The visit exists because transmission is compromised, not because Mars is fun. |
| **The distant station** | **FOLDED into Mars** | The "sky is not what it appears" role (spec 03 §10) is delivered by the Observation Dome: tiled stars, seams, structure behind them. A separate station location would restate R17. |
| **The escape room** | **IN** (Act IV, 2 rooms) | The archive reconstructs harvested memories as test scenarios, BUT Jules's data is deprecated — his role is a hole; THEREFORE only someone carrying his memories can complete the room, which is precisely the proof the identity thread needs. The set piece *is* the reveal mechanism. |
| **Poker** | **IN** (recurring, Act II–III) | Facility access needs Nolan, BUT Nolan volunteers nothing on duty — THEREFORE meet him where he's almost a person. Canon multi-class model (spec 04 §8) preserved; Dad-assist canon. |
| **Catan** | **CUT as playable sequence** | No obstacle in the architecture is honestly resource-trading-shaped; forcing one violates §32. Kept as flavor: Jack's travel set, a family-game memory beat inside M10's escape-room laughter, one Dad brag. Canon label (BACKLOG) untouched. |
| **Dad-on-a-USB** | **IN** (major, Act II→V) | The censor blocks living channels, THEREFORE the one consciousness that predates the censor and lives *offline* becomes the investigation's historian — and the walking argument for the game's central rule (offline survives). Robot body **deferred to post-v1** (spec 07 C4 says don't rush it): Dad stays terminal-bound plus a speaker rig Jack duct-tapes together — "party member" energy, one room at a time. |

---

## 7. Setup-and-payoff ledger (constitution §30–31)

| # | Setup (where planted) | Payoff (where) | What it recontextualizes |
|---|---|---|---|
| L1 | Page 7/8, `THIS PAGE INTENTIONALLY LEFT BLANK` (drawer, Act I) | Fits the notebook's gap (II); indentation yields credentials + cache line under rubbing (II, or Act I for analytical players); named in the creation record's INITIAL OBJECTS (V) | A joke → pagination proof → hidden analog data → a *placed* starting object; the title itself becomes the protagonist's spec sheet |
| L2 | Admin credentials (notebook back cover + L1 indentation, II) | Shallow access at S6 (III); full access at root (V); opening-room terminal on replay (spec 04 §14) | "Absurdly weak password" joke → the realization the door was never locked, only far away |
| L3 | The old terminal (Your Room, turn one) | Same model at Wall Drug (II), S6 (III), Mars hab (IV), Blank Room (V); Dad's dock (II) | Weird old computer → air-gapped haven → *every subject environment has one*: the maintenance port of a person |
| L4 | `USER NOT RECOGNIZED` (Act I) | Root accepts admin (V): recognized at last — as the author | "I forgot my login" → "I was never the user" → "I am the user's heir" (canon reveal style, spec 06 §12) |
| L5 | The fedora (floor, Act I) | Jules wears it in a cache Polaroid (II); Dot remembers the hat (II); INITIAL OBJECTS (V) | Noir costume → Jules's hat → a keepsake his successor was *given* |
| L6 | The tattoos / numbering gap (Jack, Act I) | Conflicting rationalizations (I–II); UV ghost on the player's forearm (IV); Jack's recognition scene (IV) | Family lore → analog identity proof → the client finds his brother in the man he hired |
| L7 | The horses (Main Street, turn ~10) | They shy from the Custodian and freshly-maintained townsfolk (ambient, II–III); untracked traversal route (II–III) | Era ambiguity prop → organic anomaly detector → the town's quiet analog resistance |
| L8 | The headaches (yours, turn one; the town's, ambient) | Correlate with overnight record changes (II); Nolan's prescription (I); rewrite scars named (III) | Blunt trauma → the sound rewriting makes from inside; the player's opener was a *failed* wipe |
| L9 | Impossible dates (`NOV 1983` behind B4 panel; `2089.4` in the root shaft) | Never explained; the layer-recursion residue read (V, by implication) | Vandalism/typo → the world has been reconciled before, under other calendars (spec 02 §16 honored, unexplained) |
| L10 | Wall Drug billboard + scratched "32 miles yesterday too" (I) | The odometer agrees; the distance never changes (II) | Roadside joke → rendered-geometry residue; the canon two-level joke (spec 02 §4) |
| L11 | The mirror — an unfamiliar face (Act I, mundane: amnesia) | Cache Polaroid shows a stranger too (II); the creation record: PHYSICAL PARAMETERS: RANDOMIZED (V) | Amnesia symptom → you don't recognize Jules's face because you were *behind* it; your own face is three weeks old |
| L12 | The gray-coveralled maintenance man (background, Act I–II) | P4's description; M15 retro-visibility; R12; the attack fragment M16 | Set dressing → the antagonist was on-screen from the first street scene, maintaining the world |
| L13 | The night-sky Polaroid (trash/PO box, Act I) | Matches Sissy's Martian film frame for frame (IV, R17) | Someone's stargazing → the same skybox over two worlds |
| L14 | "Noumena" (Luke lore, Act I–II jokes) | The passphrase component (P22, IV) | Vocabulary gag → the word that reaches the President — and the game's philosophy smuggled in (things as they are vs. as they appear) |
| L15 | The deck of cards (Act I) + M2 | Poker route (II–III); Dad's coaching; M19-S | Pocket lint → route, relationship, and memory trigger (canon example, spec 04 §2) |
| L16 | The `FIVE FACES` postcard (General Store, I) | Never resolved; townsfolk unanimity vs. the player's real-world memory | Souvenir → the Mandela Effect aimed out of the screen at the player |
| L17 | Free ice water (billboard, I) | Still free at the café (II); Dot's half-memory of Jules | The one promise in the whole world that's kept |
| L18 | Sheriff's evidence bag (I, confiscated case notes) | Handwriting overlay vs. the notebook (IV, P21) | Bureaucratic prop → the player's own hand proves the seeded stratum |
| L19 | Dad's hearing story (II) vs. microfiche (P14) | His transcript changed overnight, decades ago — why he made the backup | Dad's paranoia → the earliest on-record rewrite; the family has been fighting this for a generation |
| L20 | The town buzz: repaving, sweeps (II ambient) | The presidential visit (IV, P22) | Small-town gossip → the authority thread's arrival, seeded two acts early |

---

## 8. Proposed canon decisions

In the exact column format of `docs/spec/09-canon-decisions.md`. **Proposals only** — the main session enters accepted rows into the register and edits spec labels; this document changes nothing by itself. Ordered by blast radius.

| # | Date | Question (source) | Decision | Why | Forecloses | Now in |
|---|---|---|---|---|---|---|
| A1 | 2026-08-29 | What exactly is the protagonist, and why memory-rewrite resistant? (07 A3, A4; 00 internal mystery) | The investigator is a subject created by **Jules** at the root console days before Jules's deprecation: body randomized, occupation investigator, **initial memory state intentionally blank**, seeded from Jules's *offline* self-snapshot (Dad's backup method, applied to himself). Resistance = offline-derived substrate + blankness having nothing addressable to rewrite. | Converges the two mysteries into one (00's mandate: "revealed to be one mystery"); makes the title the literal spec of the protagonist; makes the recursive ending (02 §19, fixed) the *second* use of a console the story already established; honors "something Dad did" lineage (07 A4). | Protagonist as ordinary human, as the system's own diagnostic agent, or as android-among-many; any ending where "who am I" and "what happened to Jules" have separate answers. | 02 §19–21, 03 §1, new 02 § for the creation record |
| A2 | 2026-08-29 | Who is the client? (03 §2, 07 A1) | **Jack, sibling IV.** He found the notebook (canon: "another sibling eventually found it"), confronted Jules, was lied to, and after the disappearance hired the investigator — paying cash because his digital letters to his famous siblings kept coming back wrong. | The sibling-as-client is already implied by "known this person their entire life"; Jack is the only sibling free to be locally present; his monster truck is the traversal resource the plot needs; the "ordinary brother nobody believes" is the emotional core. | Client as corporate/government plant, foreign entity, or artificial person; a non-family client. (The "activation mechanism" possibility survives in weakened form: Jules *counted on* Jack hiring his creation, but Jack acts freely.) | 03 §2, 03 §9 |
| A3 | 2026-08-29 | What happened to Jules? (07 A2) | Jules traced the facility's impossible cooling to Sublevel 6 and below, was flagged, and was **deprecated**: erased from records and social memory, his snapshot archived at root. Before capture he cached the notebook/USB/film at Wall Drug and created the investigator. Partly *deleted*, partly *intentionally disappeared* — via the contingency, not escape. | Combines the two strongest options in 07 A2 exactly as the spec predicts ("likely answer may combine several"); keeps Jules morally complicated (canon 03 §4: liar, not simple victim); makes the archived-Jules scene (P27) possible — the emotional payoff of finding the missing person. | Jules alive-in-hiding, physically kidnapped, or a double agent for anyone; a villain Jules. | 02 §12, 03 §4 |
| A4 | 2026-08-29 | Where is the notebook, and where are the credentials? (02 §8, §10; 07 B2) | Notebook + Dad's USB + film cached by Jules at **Wall Drug** (claim-ticket trail via his PO box). Credentials handwritten inside the **back cover**, and **indented into page 7/8** (the loose sheet sat under the page he wrote them on). | Gives the canon Wall Drug joke a §32 causal chain; puts the cache where the theme says it must be (unindexed analog space); the two credential locations serve both first-run pacing and the analytical early-discovery path (02 §10's NG+ constraint). | Credentials-only-in-one-place; a notebook found inside the facility or held by an NPC. | 02 §8–10 |
| A5 | 2026-08-29 | What is the facility hiding / what does the hidden load run? (02 §14–15, 07 A5) | The reactor's unexplained baseline **computes the local layer** — the town and its people. Sublevel 6 = artificial-person maintenance + the archive of environments; below it, the root console. "Deeper = closer to the abstraction layer" (canon metaphor) is made literal in exactly three steps: S6, shaft, Blank Room. | Promotes 02 §15's working idea in the smallest form that supports Act III's detonation (load-curve ↔ town sleep) and the ending's location; keeps 07 A6 (original reality?) untouched and unanswered. | The facility as mere corporate/government conspiracy; aliens; any *explained* simulation cosmology. | 02 §14–15 |
| A6 | 2026-08-29 | How does the erasure mechanism behave? (02 §13 "fuzzy until needed") | Three rules, player-learnable: (1) the system rewrites what it can **address and parse** — flagged digital content is rewritten in transit ("the censor"); (2) it cannot address analog/offline artifacts, so it deploys a physical agent (**the Custodian**) to find and collect them; (3) rewrites of human memory leave **headaches**. | The minimum mechanism that supports the censor puzzles (P13, P22), the antagonist (who must search by hand — hence the ransacked room), and a deducible ambient clue system (headaches ↔ overnight changes) per constitution §3. | Omniscient antagonists; magic erasure of physical objects; any need to explain the tech deeper. | 02 §13, 04 §5 |
| A7 | 2026-08-29 | Set-piece dispositions (02 §17–18, 07 E, constitution §32) | **In:** Wall Drug (cache), Mars hab (compressed, film retrieval), escape room (memory reconstruction), poker (recurring alternate-route), Dad-USB (major). **Cut as locations:** Washington DC (Luke visits the facility instead), Mount Rushmore (postcard object only), Puerto Rico (circular-ownership paper clue only), distant station (folded into the Mars sky reveal). **Catan:** flavor only, no playable sequence. | Full reasoning in §6 of this architecture; scope target (00: 20–30k words) cannot fund five extra zones, and none of the cuts has an honest causal chain of its own. | v1 containing DC/Rushmore/PR/station rooms or a Catan minigame. All remain available to post-1.0 expansion (07 I). | 02 §17–18, 07 E |
| A8 | 2026-08-29 | Dad specifics (07 C1–C5) | Copied **2041** (before Jules's discoveries — historian, never spoiler); motive = canon insurance answer, sharpened: he witnessed a hearing transcript change overnight decades ago (L19); corruption = bad-block sectors + confident confabulation past cutoff (detectable by date-checking); **no robot body in v1** — terminal-bound + Jack's portable speaker rig; first demonstrated skill = poker coaching, then facility construction history. | Fixes the knowledge-cutoff line the whole Act II–III structure leans on; keeps Dad from solving the game (canon constraint); saves robot-body scope for post-v1 as 07 C4 advises. | Dad with knowledge of S6; an early robot body; an uncorrupted, fully reliable Dad. | 03 §5–6 |
| A9 | 2026-08-29 | Time model (07 G3, 04 §16) | 4-phase day (morning/afternoon/evening/night), phase-posted NPC schedules, weekly recurring windows (poker, trash, deliveries), nightly maintenance rhythm. Hard events are **progress-triggered, schedule-dressed** (the presidential visit); missing any window costs a cycle, never the game. | Deadline's life without Deadline's cruelty (constitution §2, spec 04 §16); implementable on the world-clock the engine already plans (BACKLOG M1 notes). | Exact-turn event windows; permanent event misses; a real-time pressure economy. | 04 §16, 05 (engine) |
| A10 | 2026-08-29 | The client's proof, structurally (02 §5 "physical and anecdotal evidence") | The **tattoo numbering gap**: records show four siblings numbered II–V; each sibling carries a different rationalization for the missing I, and the rationalizations contradict *each other*. Plus the light-struck six-figure Polaroid. | Turns the canon tattoo device (03 §3) into Act I's climax evidence; "conflicting rationalizations are themselves evidence" is the game's epistemology in one beat; gives the mundane-dodge ("Dad counted himself I") its Act I cover. | Any version where a sibling simply *remembers* Jules plainly and completely (partial memory erosion becomes canon for everyone but Jack, whose certainty is emotional, not detailed — he keeps the *fact* of Jules, losing the face). | 02 §11–12, 03 §3 |
| A11 | 2026-08-29 | Page 7/8's hidden function (07 B1) | Triple-duty: pagination proof (fits the notebook's gap), **pressure indentation** of the credentials + cache line (rub to reveal), and — final meaning — an item on the creation record's INITIAL OBJECTS list. | Uses the strongest option in 07 B1 while letting the sheet carry the title's full arc (L1); the indentation rewards Act I analytical play without blocking anyone (02 §10 NG+). | Invisible ink/UV/chemical variants; "nothing, meaningfully" — the absence-as-meaning option. | 02 §9 |
| A12 | 2026-08-29 | Why does management confiscate handwritten material? (07 B3) | Standing facility policy, custodian-enforced: analog records survive reconciliation, so they are collected. This is also why the room was ransacked and why the Custodian exists as a physical agent. | Unifies three plot facts (confiscation, ransack, antagonist) under rule A6-(2) — one mechanism, three payoffs. | Confiscation as ordinary corporate IP paranoia. | 02 §8, 02 §13 |
| A13 | 2026-08-29 | Ending necessity & meaning (02 §19 fixed; "journey must not feel pointless") | The reconciliation reaches the whole layer; only unaddressable things survive. The player caches this cycle's evidence (notebook now annotated in two hands, film, letter to Jack) and creates the next subject — a **ratchet**: each cycle starts with more analog truth in reach than the last. One canonical ending; playthroughs differ in *understanding* (archived-Jules scene, sky match, profile — all optional). | Satisfies 07 G4 (one ending), 02 §19 (player performs the revelation), and the anti-pointlessness constraint from 02 §10 in structural form. | Multiple divergent endings; an escape/victory-over-the-system ending; an ending that explains the philosophy aloud (02 §19 forbids). | 02 §19–20 |
| A14 | 2026-08-29 | Working NPC roster names (new) | Marlow (clerk — from constitution §22's example), Sheriff Dana Whitlock, Pearl (diner), Dot (Wall Drug), the Custodian (unnamed in-fiction). Nolan is canon from the notebook. | Prose cannot be written against "the clerk"; names proposed at lowest tier, `narrative-writer` may re-voice, main session approves. | Nothing — cheapest reversals in the register. | 03 (new §) |
| A15 | 2026-08-29 | Horses' payoff (02 §3 ambiguity prop) | Horses shy from the Custodian and recently-maintained people (unexplained, ambient), and serve as untracked traversal (no telemetry) — why they persist in a 2047 town. | Turns the canon era-ambiguity prop into a deducible detector + a stealth resource (constitution §6 cross-pollination) without ever explaining itself (06 §17). | Horses as pure set dressing; any explicit explanation of what they sense. | 02 §3, 04 §5 |

---

## Appendix — What this architecture requires of the engine

For the main session to reconcile with the parallel engine-architecture spec (interface expectations only; no implementation opinions):

1. World clock: 4-phase day, day counter, weekly recurrence; phase-posted NPC locations.
2. State-dependent room/object descriptions keyed on story flags (revisit recontextualization carries ~20% of content).
3. Memory-fragment system: trigger conditions (object/room/flag/composite), capability flags, behavioral-variant selection off action-class counters.
4. Action-class tagging (analytical/social/direct) on structured actions — required from turn one for the profile reveal (R13) and §5 gating.
5. Multi-route puzzle state: puzzles as flag-graphs, not scripts; four entry routes to one facility must coexist with one alertness variable.
6. Evidence/document model: documents with physical properties (pages, indentation, fits-into relations) and media comparisons (microfiche vs. database as data, not prose branching).
7. The censor as a testable rule: message composition checked against flag/parse conditions (P13, P22 are deterministic puzzles, no AI — ADR 0004).
8. Indestructibility class for plot-critical items; Custodian may never acquire player inventory.
9. Save format must carry: flags, clock, action-class counters, memory-fragment set, alertness, NPC post overrides — and survive a MAJOR-version story expansion (post-1.0 zones in §6 verdicts).
10. The ending sequence (P28) is a form-driven scene reading the player's flag set — the richest single consumer of story state; design the flag namespace with it in mind.
