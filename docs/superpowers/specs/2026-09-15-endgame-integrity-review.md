# Endgame Integrity Review — input to the Stage E plan

**Status (main session, 2026-08-31):** accepted; §6 q1–q17 as recommended (register 94–103 for q2, q3, q4, q6, q8, q10, q12, q14, q15, q16); §7's four-wave cut E0–E3 adopted as the shape of the Stage E plan.

**Status:** review by `game-architect` (Fable) · for the main session and Ryan · **changes nothing by itself**
**Date:** 2026-09-15 (filename as assigned; written 2026-08-31 by the clock)
**Covers:** the state of every setup, reveal, second reading, memory stratum and ending commitment at **v0.15.0** (Acts I–III shipped), and what Stage E (Acts IV–V, `0.16`–`0.19`) must therefore contain
**Inputs, in the order read:** spec `README`, `08`, `01` §25–§32, `02`, `03`, `04`, `05` §11–§13, `06` §5/§11/§12/§17, `07`, `09` (entries 1–93, all treated as settled) · `2026-08-29-stage-a-story-architecture.md` §0–§8 + Appendix · `2026-08-31-scope-cut.md` · `2026-09-07-stage-d-plan.md` §0–§9 · the "Setups planted", "Second readings", quarantine and wiring sections of every prose document `2026-08-30-opening-room-prose.md` through `2026-09-14-stage-d-addenda-prose.md` · the shipped engine (`src/engine/*`, `src/session/*`) and content (`src/content/world/*`) · the canonical route, `tests/fixtures/playthrough-d5.txt`, run headless at v0.15.0 (6,483 transcript lines, zero `diag` events)
**Spoiler posture:** nothing is hidden from Ryan. The test applied throughout is the opposite one — *has the game hidden it from the player* — and every recommendation below is checked against the shipped text before it is made.

A note on the route. Each Stage D fixture *contains* its predecessor (the D5 file is the whole game from turn one), so the D5 fixture alone is the canonical transcript. Quotations below are from that transcript; where the route does not visit a line, the source file is cited instead.

---

## 0. Summary

| Count | Meaning |
|---|---|
| **UNPAID: 37** | setups with no assigned payoff anywhere (§1.2–§1.3). **8 need a home** (§1.4 lists them with a recommended one); **29 are texture** and should stay unpaid — the documents say so themselves, and §1.3 agrees. |
| **UNPLANTED: 4 (+3 scheduled)** | Stage E payoffs whose setup is not in the shipped text (§1.5). Three more are "unplanted" only because their home is a Stage E room. |
| **SPENT: 2** | setups whose payoff the spec assigned to Act IV and the shipped text has already delivered — both by recorded decision (canon 82; architecture §5's strata design), both accepted, both reshaping what Stage E's R14 and P21 can still do (§1.6). |
| **Spoiler leaks: 0** | The one known edge — `Maintenance, it said. That is the whole of what you are.` — **holds** (§2.2). Two lines come closer than the guide would like and are ruled on there; neither states a later rung. |

The single most consequential finding is not a leak but a **timeline seam** (§6 q2): the architecture's Act V says the investigator was "born three weeks ago"; canon 3 says he was created "days before Jules's deprecation"; canon 35 says Jules has been gone five weeks. Stage E's creation record is where the game fixes this, and it has to be fixed *before* the record is written. The second is a **canon gap** the ending will trip on (§6 q3): a body that canon 3 calls *randomized* carries a laser-removed **I** (canon 82). Both have clean answers; both are Ryan's.

---

## 1. The setup ledger

**Status vocabulary.** *PENDING* — assigned to Act IV or V by the spec, the architecture ledger or a prose document, and not yet spent. *PAID* — assigned to Acts I–III and delivered there (listed only where Stage E must not re-pay it). *UNPAID* — no assigned payoff anywhere. *UNPLANTED* — a Stage E payoff whose setup is not in the shipped text. *SPENT* — resolved by the shipped text earlier than the spec assigned.

### 1.1 The architecture ledger L1–L20 at v0.15.0

| # | Setup | Shipped plant | Assigned payoff | Status |
|---|---|---|---|---|
| L1 | Page 7/8 | opening §4.7 (hatband, canon 18); fits the gap (D1 §13.6: *Page 6. Then the sheet: 7, and 8. Then 9.*); rubbing yields the credentials and `W.D. — hold — 4417` (D1 §13.6) | INITIAL OBJECTS on the creation record (V, R19, canon 13) | **PENDING (V)**; two of three paid |
| L2 | `admin` / `admin-password` | back cover + rubbing (D1); `ACCESS LEVEL: MAINTENANCE / DENIED` at the S6 pad (D4 §9.8, canon 75); the Hub takes them shallowly (D5 §22.3) | root accepts them (V, R18); opening terminal on replay (spec 04 §14, M21–24) | **PENDING (V)**; the replay half is **UNPLANTED** — the opening terminal's `TYPE` verb takes no text and has no prompt (`act1/verbs.ts:220–223`); see §1.5 (3) |
| L3 | The old terminal | station 1 opening (`USER:` burned in, §4.9); station 2 Wall Drug, dead (D1 §11.5); station 3 the Hub, on, **no burn** (D5 §22.6) | station 4 the hab Galley (scope cut §3.3, explicit); station 5 the Blank Room (V) | **PENDING (IV, V)** — with a document conflict: D5 §35 calls the Hub "the last one before Act V's root console", which skips the Galley; §6 q5 |
| L4 | `USER NOT RECOGNIZED` | opening §4.9 (*whether you type a name, a word, or nothing at all*; *It has been asking a long time*) | root accepts (V): recognized at last, as the author | **PENDING (V)** |
| L5 | The fedora | worn by a head your size (opening); Jules wears it in the cache Polaroid (D1 §12.6); Dot keeps the hat and loses the face (D1 §12.5, canon 57); Jack looks through it (wave 4 §6.7, canon 32); *a hat's brim taking its bias from one hand over years* (D1 §12.6) | INITIAL OBJECTS (V); *a keepsake his successor was given* (IV) | **PENDING (V)**. The recognition device is **closed** (D1 §23: *nobody else recognises the hat, ever*) — Stage E may not have Luke, Sissy or Jules's snapshot recognise it |
| L6 | The tattoos / numbering gap | Jack's IV, *inside of the left forearm, above the wrist* (wave 4 §6.2, canon 33); the player's removed patch in the same words (opening §4.12); the UV stroke, *one upright stroke, closed top and bottom* (D5 §8.3, canon 82); `JACK IV` on the queue (D5 §25.1) | naming the mark; Jack's recognition scene (IV, R14) | **PENDING (IV)**; the ghost itself is **SPENT** by canon 82 (accepted) — §1.6 |
| L7 | The horses | the third horse *head up, looking down the street* at the man on the ladder; *leans a little of its weight into the hand* (Main Street §4.1, canon 27); stops at the cattle guard (D3 §3.3, canon 71) | — (all Act II–III payoffs delivered; the second reading resolves at R19 without a line) | **PAID**. Canon 71: no further horse beat, in any act |
| L8 | The headaches | *structural* (opening §2); `NOT MORE THAN NINE IN ANY SEVEN DAYS` on Nolan's bottle (wave 5 §7.2); the dispenser's `ONE ON RISING` (D5 §10.1); the town's headaches (D2 §6.14) | *the sound rewriting makes from inside*; the game's last line, `Your head hurts.` (V, canon 02 §19) | **PENDING (V)** — see §1.2 row 24 |
| L9 | Impossible dates | `INSPECTED, NOV 1983` behind B4's panel (D3 §11.7); the tunnel duplicate dropped (canon 76) | `SYSTEM REVISION 2089.4` in the Root Shaft (V); never explained (canon 02 §16) | **PENDING (V)** — the second half is Stage E's to plant |
| L10 | 32 miles | billboard, wall sign, scratch (Act I); the trip wheel zeroed and the miles that don't count (D1 §4.1); a 32 MILES sign used to mend a fence at the far end (D1 §6.2) | — | **PAID** |
| L11 | The unfamiliar face | *no mirror shipped* (BACKLOG: quarantined proposal); Jules's face once, as a stranger's, in the intact Polaroid (wave 5 §9.4, canon 43); Dot cannot describe it (D1 §12.5) | `PHYSICAL PARAMETERS: RANDOMIZED` (V, R19) | **PENDING (V)** for *you don't know Jules's face because you were behind it*; the other half — *your own face is three weeks old* — is **UNPLANTED**: the player has never seen his own face. §1.5 (4), §6 q11 |
| L12 | The gray-coveralled man | ladder (Main Street §4.6); Marlow's description (P4); M15 retro-visibility (D2); rounds (D5); M16 *Sorry about this.* (D5 §26, canon 87) | the re-acquire death (IV/V, walking-dead audit); *he cannot enter the Blank Room* (V) | **PAID** through R12; two Stage E obligations pending |
| L13 | The night-sky Polaroid | *a night sky over the same porch roof … the stars come out as small soft discs of different sizes* (wave 5 §9.4) | matches Sissy's Martian film (IV, R17) | **PENDING (IV)** — note the shipped Polaroid is **out of focus**; §3 row 12 |
| L14 | *noumena* | `NOUMENA?` boxed in the margin (D1 §13.5); M12 (shipped, `act2_mem_m12`; not fired on the canonical route — it needs `act2_luke_referenced` as well as the doodle); Dad's *"Noumena," he said, over a table…* | the passphrase component (IV, P22) | **PENDING (IV)**. Every P22 family token is planted: `house rules` (Jack, motel), `the bank` (truck door), `kiddo` (M6, Dad), `youngest goes last` (M3), numerals I–V, `noumena` — all declared in `act2/censor.ts` |
| L15 | The deck | glovebox; M2 ×3; poker; M19-S | — | **PAID** |
| L16 | `HOME OF THE FIVE FACES` | store postcard rack (wave 2 §9.1) | never resolved, by design (architecture L16) | assigned-as-never; not counted |
| L17 | Free ice water | store crock; Dot's counter (D1 §6.5) | — | **PAID** |
| L18 | The evidence bag | *the wire cage, tags unreadable* (wave 2 §12.3.3: *His own notes are in there and nothing says so*); Whitlock's *"It'll bounce. Then I'll put it in again."* | handwriting overlay (IV, P21) | **PENDING (IV)**; the *route* to it is **UNPLANTED** — architecture §4's ally hinge (Whitlock's private notebook) has no syllable in shipped text; §1.5 (2) |
| L19 | Dad's hearing story vs the film | D2 §19.2 (`SENATOR'S REMARKS IN FULL`; the paragraph already wrong in the morning edition) | — | **PAID** |
| L20 | The town buzz | the county notice pinned through all four corners (D2 §21.2); the staging whiteboard's empty grid and `CONTRACTORS — STAGING` (D3 §7.7); the gatehouse calendar with nothing in the squares (D3 §4.4) | the presidential visit (IV, P22) | **PENDING (IV)**. The repaving *crew* the Stage D plan gave D3's Main Street is not reachable on the route; the notice is. Stage E dresses the visit's arrival |

### 1.2 The named setups

The list the review was asked for, plus the plants the D-wave documents added under the same headings.

| # | Setup | Planted (doc §, file) | What it promises | Assigned payoff | Status |
|---|---|---|---|---|---|
| 1 | The key's unmatched number — *The number stamped in the bow of the key is not stamped anywhere on this hatch, or on the kerb, or on anything else in sight* | D4 §4.2, `act3/objects/tunnelMouth.ts:48`; the key itself wave 4 §4.4 (canon 49) | a key out of a series implies the series — more hatches, or more keys | none (D4 §15: *Unassigned*) | **UNPAID** — §1.4 (1) |
| 2 | `SUBJECT JULES I` | D5 §23.2, `act3/objects/s6ArchiveHub.ts` | the system files people under the family's numerals | `AUTHOR: JULES I` on the creation record (V, R19); L6's *the tattoos are copies* | **PENDING (V)** |
| 3 | `ENTER SURNAME OR NUMERAL` | D5 §23.1 | a numeral is a valid key to the ledger | none | **UNPAID** — §1.4 (2). The route's `search ledger for me` refuses; a numeral search is unwritten |
| 4 | `JACK IV — MEMORY RECONCILIATION`, pending | D5 §25.1 | the client's clock has started; a second `IV` the family never tattooed | *the client's clock starts* (IV); the reconciliation runs (V, canon 15) | **PENDING (IV/V)** — §6 q15 |
| 5 | The burn on the phosphor — *The machine in your room has USER: burned into it. This one has been busy.* | D5 §22.6 against opening §4.9 | the room's terminal was left asking for years, by nobody | L4 (V); INITIAL OBJECTS lists the terminal (V) | **PENDING (V)** |
| 6 | The forearm fuse — the patch in the opening (*a professional was paid, at length, to disagree*), Jack's IV in the same anatomy, the UV stroke | opening §4.12 · wave 4 §6.2 (canon 33) · D5 §8.3 (canon 82) | the mark is a numeral and the numeral is I | naming; Jack's recognition (IV, R14) | **PENDING (IV)**; the stroke is **SPENT** by canon 82 (§1.6). No shipped text says *two years* or any age for the removal; if a fuse length is wanted, it is Stage E's to state or leave |
| 7 | The seeded memories in the first person — M5 *My own hand … Nobody reads this but me*; M7 *Third time this month I have come down here*; M8; M9; M14 *the door was mine*; M18-A *There were nine of them and I made them all up* | D1 §14, D2, D3 §12, D5 §17; architecture §5 (the strata tell) | the player carries memories the investigator cannot have lived | the strata tell → R14, R19 (IV–V) | **PENDING (IV/V)**; and M5 has **SPENT** the surprise of P21's handwriting overlay — §1.6 (2) |
| 8 | The horses | see L7 | — | — | **PAID**; no Stage E beat (canon 71) |
| 9 | The 1983 stencil | D3 §11.7 | the world has been inspected under a calendar that is not ours | L9 (V, by implication only) | **PENDING (V)** — needs `2089.4` |
| 10 | The second return — two brass discs stamped the same day (D3 §10.5); *Return B going into the slab and not coming back out* (D5 §14.1) | D3, D4, D5 | the root is cooled | *the root shaft is cooled* (Stage E, D5 §32) | **PENDING (V)** — under D5 §35's rule: *the motif is finished; Stage E's shaft may not re-argue it* — one sentence of arrival, no proof |
| 11 | Dad's copies — `88 BAD SECTORS - MARKED, NOT REPAIRED`; a man who resumes mid-sentence with no dark between; *Nobody has the stick who isn't mine*; *Always keep a copy, kiddo* (M6) | D2 §5.1, §3.3, §6.1; D1 §14 | what a copy is; who counts as family to a copy; the family's method | P27 (a snapshot with integrity); R19 (*Dad's backup method, applied by a son to himself*) (IV–V) | **PENDING (IV/V)** |
| 12 | `ASSOCIATIONS: RECONCILED` | D5 §23.2 (canon 83) | why the county's memory of him is wrong, in one word nobody glosses | Jack's pending line does the same to Jack (IV/V) | **PENDING (V)** |
| 13 | The peeled hook — *the gum has gone grey and taken a print of the paint. You can see where the letters were and you cannot read them* | D5 §5.3 (canon 54: Jules's) | whose it was; that nobody reset the chair | none explicit (canon 54 fixes identity only) | **PENDING (IV/V)** by canon 54; recommend the Chamber's bare coat hook and P27 as its rhymes, never a name — §1.4, closing note |
| 14 | The gate frames' legends — `ESCAPE RM` (standby light), `HAB` (dark the way a screen is dark), three with no strip, all *made on the same machine as a bypass tag* | D5 §27.1, §27.4 | the gates are furniture from the same workshop as the building | the gates open (IV, P23/P24) | **PENDING (IV)**; the **three unlabeled frames are UNPAID** — §1.4 (8) |
| 15 | The root door's warmth and water — *Warm. Not hot … water going through something at a steady rate … the sound you went to sleep to the first night you spent in this county* | D5 §28.6 | what the reactor is for; the town sleeps over the root's cooling | *what the reactor is for* (V) | **PENDING (V)** |
| 16 | "The twelve names on the ledger" | **not shipped** — D5 §38.2 quarantined the twelve; the rail prints only `NOLAN` (canon 81). What shipped is the ledger *scrolling*: *the names off the hooks in the other room, and then they are names that were not on the hooks, and it does not stop* | the ledger is larger than the county | *how many of these rooms there are* (V, D5 §32 via the die-stamped anchor plate) | **PENDING (V)** by implication only; nothing to pay for "twelve" |
| 17 | The numeral series — I–V on the family; `JULES I`, `JACK IV`, `NOLAN R` on the machine | wave 4, D5 | the machine numbers people the way the family did — or the family copied the machine | L6 (IV); D5 §33's second reading *the tattoos are copies* | **PENDING (IV/V)** — the second reading is not canon; §6 q8 |
| 18 | Marlow's *three weeks* — *"Top floor, back. Three weeks, you've had it."* | front desk; canon 35 | the address, and an age | `LAST KNOWN: MAIN ST / TOP FLOOR REAR` (III, R12); *born three weeks ago* (V, R19) | **PAID as assigned** (R12 quotes it back in italics on the route); the second use is **PENDING (V)** and collides with canon 3/35 — §6 q2 |
| 19 | The claim ticket — `No. 4417`, *no date, no name*, an empty depositor's line; *There is no note on top* of the cache | wave 5 §9.5; D1 §11.3 | he did not write down what he left, and left no instructions | P10 (paid); *he left everything and no instructions, because the reader he expected would not need any* (V) | **PENDING (V)** — and canon 15 has *this* cycle leave a letter to Jack: the ratchet is that the next reader gets a note |
| 20 | The fedora | see L5 | — | INITIAL OBJECTS (V) | **PENDING (V)** |
| 21 | The chair leg's running joke — *You already have the chair leg. Taking it twice would be redundant, though admittedly thorough*; the leg pries the drawer, the chase hatch, the tunnel plate; a chair losing a back leg decades earlier in M2-direct (D1 §14.7) | wave 5 §10.1; D3, D4 | the one tool that opens everything is furniture | none | **UNPAID** — §1.4 (3) |
| 22 | The matchbook — `THE ARROWHEAD`; *the striker used once, and nothing lit*; the two-turn light in the tunnel; *the only copy* | wave 5 §10.4; D4 §6.3; D1 §13.6 | — | P3 (paid); the tunnel light (paid) | **PAID**; the striker-once is **UNPAID** and recommended to stay so (wave 5 §17.1) |
| 23 | The paperbacks — face down at a third in the empty gatehouse hut (D3 §4.4); face down in a sleeper's chair pocket, *keeping his place* (D5 §6) | D3, D5 | one person in this building is a person; the sleepers are people | none | **UNPAID ×2** — texture; §1.3 |
| 24 | `ONE ON RISING. NOT MORE THAN NINE IN ANY SEVEN DAYS.` against Nolan's bottle's `ONE AT ONSET` | D5 §10.1 (`ASSUMPTION`) | the county's doctor is downstream of a lever on a wall | *who wrote the town's prescriptions* (IV, D5 §32) | **UNPAID as assigned** — no doctor exists and no Act IV beat carries it. **Reassign to V:** the game's fixed last line, `Your head hurts.`, is the dispenser's instruction obeyed; needs no new text, only that the ending's writer not touch the line — §1.4 (4) |

### 1.3 The documents' own "Unassigned" rows

Every row a prose document marked *Unassigned* (constitution §30 tables), sorted by what to do with it. All are **UNPAID**.

**Recommended to stay unpaid — texture (29).** D1: the trip wheel zeroed in the lot; somebody greases the dinosaur; dust on the box lid and none on the string; a conduit ending in a blank plate over nothing; the shorthand getting smaller and faster. D2: *Where did you get this*, twice; a pencil put down flat. D3: the two paperbacks (row 23); brochures kept full by a spring for a tour discontinued 2041; a B4 sign in a different white; an extension rewritten twice. D4: a paper cup gone to skin; a bypass tag rubbed featureless and a key polished by use. D5: sheepskin replaced on a rota; the drain and the professional's hose coil. Wave 4: the unstacked chair's ring of grey; the thumbprint in the emulsion; *less in it than there ought to be*; *if they want a name for the form they can have mine*; *I offered you five*; the television on for its light. Wave 5: grass worn at dog height; the striker used once; the bin put back square. Wave 3: the dowsing item; the scratch's tool marks; `POP. 412` over four older bolt holes. Wave 2 / front desk: the dog in three rooms. Opening: the forty-second click (assigned *unexplained, permanently*). Each of these is a §30 setup only in the weak sense; paying any of them would make the register's "a third instance is the tic" rule ring. Leave them.

**Already paid, document not updated (3).** `THE BANK` on the truck door (wave 4: *Unassigned*) is a P22 family token in `act2/censor.ts` — **PENDING (IV)**. Frost on the windscreen and none on the bonnet (wave 5) and `BADGE RETAINED AT GATE` (wave 5) are paid by D5's Bay and hook. Correct the three rows when the documents are next touched; no action otherwise.

**Need a home (see §1.4):** the reader left running, carriage centred on one item (wave 3 §9.1); the mugs — two vintages, one wrong word, *Sundown/Sundowner* (wave 3 §4.1, spec 02 §11's phase-1 discrepancy, *held to the player's hand*); the blank rectangle on the post-office board (wave 2 §4.2; restored as a second reading in D2 §21.2 with the county notice beside it — **PENDING (IV)** if the visit's own notice goes up beside it and the rectangle stays empty).

### 1.4 UNPAID setups that need a home — recommendations

1. **The key's number.** Pay it in the Root Shaft: the shaft's hatch off the Service Tunnel branch (architecture room 39: *Service tunnel branch*) carries the matching number. One stamped figure, no narrator arithmetic, no line saying *match*. It turns root leg (ii) — Dad's shaft — into a knowledge route with an Act I object in it, which is exactly what canon 49 did for P16 (b).
2. **`ENTER SURNAME OR NUMERAL`.** Wire `SEARCH LEDGER FOR I` (and `1`, `ONE`) in Stage E, gated on Act IV: two results — `SUBJECT JULES I — DEPRECATED` and `SUBJECT [UNRESOLVED] — MAINTENANCE`. The machine files the unresolved subject under the same numeral. This is P21's missing *analytical* leg (the architecture gives P21 three pieces, all findable analytically; the ledger is the one instrument the player has already learned), and it uses a prompt the game already printed. It must not print a name in the second row.
3. **The chair leg.** One line on Jules's creation record: `CHAIR — ONE LEG LOOSE` under `INITIAL OBJECTS`. It is constitution §30's own example (a joke that becomes a manifest) done to the game's most-carried object, and it costs six words. §6 q9.
4. **`ONE ON RISING`.** Reassign from Act IV to the last line of Act V (row 24). No text changes; the plan records that `Darkness.` / `Your head hurts.` is canon 02 §19's and may not be revoiced.
5. **The reader left running, centred on one item.** Somebody has been reading county records one item at a time. Make it Whitlock — it is the plant architecture §4 never got for her private notebook (§1.5 (2)), and it is already in the room. Stage E's Whitlock line: she was reading the reel the player found threaded. Never say what item.
6. **The mugs.** Leave it to the player, as wave 3 ruled — but the visit's arrival (Stage E dressing) is the one honest place a phase-1 discrepancy could close: the county repaints the diner's window for the President and the painter gets the name the *mugs* have. Optional; if taken, it is one clause and no remark.
7. **Jules's film canister.** A plot-critical object with no assigned content since D1 (*may not say yet: what the film shows*). It is what canon 15 has the player re-cache at the end, so it must show something. §6 q4 recommends the family's last day.
8. **The three unlabeled gate frames.** They are the cut environments (canon 9: DC, Rushmore, Puerto Rico, the station). Stay dark in v1; one refusal each, never named, never lit; the post-1.0 restoration seam. Propose a register entry so nobody furnishes one in Stage F (§6 q14).

Not counted here because it is PENDING by canon 54, but placed for the plan: **the peeled hook.** No name, ever. Its rhymes are the Chamber's entry wall (five coats, one hook bare — scope cut §4) and P27's *Jules is retrievable*. Stage E should write the Chamber's bare hook so that a player who remembers the gum and the print supplies the link, and give no response that does it for him.

### 1.5 UNPLANTED — Stage E payoffs whose setup is not in the shipped text

1. **Conflicting rationalizations for the missing I (canon 12; R2's third leg).** Only Jack is reachable in Act I, and his line is the family joke itself: *"Birth order. That's the whole of the joke. I'm four."* The Polaroids and *"There's four of us that anybody's heard of"* carry R2 honestly; the *contradictory* rationalizations do not exist. They cannot be retrofitted into Act I without a rewrite and should not be — they become Act IV texture: Luke's (in person), Sissy's (in person), Eli's (by letter, the channel exists). The plan owes three lines that contradict each other and never mention Jack's.
2. **Whitlock's private notebook (architecture §4, *mid-game ally hinge*).** Not a syllable in `act1/whitlock.ts`. It is the natural key to L18 (the evidence bag behind *a padlock with a nine-day form behind it*). Plant it in her Stage E dialogue (new lines, gated on Act IV — no rewrite); see §1.4 (5) for the object that already sits there. Register entry proposed (§6 q6).
3. **The opening terminal accepting the credentials (spec 04 §14; L2; M21–M24).** `TYPE` is a bare verb with three rotating `USER NOT RECOGNIZED` responses (`act1/verbs.ts:220–223`); there is no login prompt, so a second-playthrough player cannot type the pair. The Hub's login (`act3/scripts.ts:266–300`) is explicitly *not* the room's. Stage E's last wave must give the opening terminal a `LOG IN` prompt that answers `admin` / `admin-password` with the cryptic local screen and everything else with the shipped line. Without it the ending's hand-off (§5) has no mechanical meaning.
4. **The player's own face (L11's second half).** No mirror shipped (BACKLOG; the opening room quarantined it). *Your own face is three weeks old* has no line to re-read. Either plant it in Stage E — the hab visor is the honest place, a reflection in a suit's faceplate, described as a stranger and never remarked — or accept that, like Jack, the player never had the face and the record's `RANDOMIZED` lands on the Polaroid alone. §6 q11 recommends the second.

Scheduled, not defective — their homes are Stage E rooms: (5) `SYSTEM REVISION 2089.4` (Root Shaft); (6) the hab terminal, L3 station 4 (Galley); (7) the comms rig's four-second "twelve-minute" round trip (Galley). Also owed by Stage E and not a setup: the visit's *arrival* dressing (crews, sweeps, the motorcade's day) — L20's second half.

### 1.6 SPENT

1. **The UV ghost (architecture: R14, Act IV).** Canon 82 chose to light the fuse in D5: *one upright stroke, about as long as the first joint of your thumb, with a short stroke closing it at the top and another closing it at the bottom.* Any reader sees a Roman I. Accepted — but it means Stage E's R14 is **two-thirds**: the handwriting and the escape-room performance, plus *Jack seeing it*. The mark itself may not be re-revealed; naming it is what remains (canon 82 forbids naming *before* Stage E, not in it).
2. **The notebook in your own hand (P21's handwriting overlay, Act IV).** M5 fires on the first `READ NOTEBOOK` in Act II: *My own hand, going faster than it can and staying legible anyway … Nobody reads this but me.* First person, seeded stratum, by design (architecture §5: *the tell between strata is the reveal engine*). The narrator never says it; the memory does. So the Act IV overlay is **confirmation**, not revelation. The surprise budget of P21 is therefore the profile terminal, the numeral search (§1.4 (2)) and Jack — not the handwriting. The plan should treat the overlay as the *analog proof* the player has wanted since R4's question opened, and write it as a thing found rather than a thing learned.

Not spent, and worth saying so: the seal (D4 §20.1 held), the model's bottom step (D3 §20.1 held), the queue's finished sentence (D5 §38.1 held), the Custodian's four words (only in M16), Nolan's name for Jules (said back wrong, never right), *deprecated* (screens and the player's transcription only, canon 84), *town* on the graph (never printed, canon 85).

---

## 2. The reveal ladder

### 2.1 R1–R12, as shipped

| R | The sentence that carries it | Where |
|---|---|---|
| R1 *You were hired* | *"Come in. I paid you to find my brother and somebody's opened your head, and I would like those to be two different things."* | wave 4 §4.1, `act1/jack.ts`; clue *Who hired you* |
| R2 *The client is right* | Jack's arm: `IV` — *"Birth order. That's the whole of the joke. I'm four."*; *"There's four of us that anybody's heard of."*; the light-struck Polaroid with one figure too many; and in box 141, *where the white was, there is a man in his forties … looking straight at whoever is holding the camera* | wave 4 §4.3, §6.5; wave 5 §9.4 |
| R3 *You are also missing from the records* | *"I'll put the address," she says, and does. "It'll bounce. Then I'll put it in again."* — and the subtraction the player does between Marlow's *four let* and the clue's *three tenancies in the boarding house* | wave 2 §12.6; `act1/knowledge.ts:380` |
| R4 *Page 7/8 fits* | *Page 6. Then the sheet: 7, and 8. Then 9. / It goes back into the gap as though it had been asked to.* — and the question it opens: *The page in your hatband was torn out of this notebook. How did it get from a box in Wall Drug into that room?* | D1 §13.6 |
| R5 *The censor exists* | *It is warm, it is well written, it is signed the way he signs things, and it answers the letter you sent in the sense that it arrived afterwards.* / *It came the next day.* | D2 §13.1 |
| R6 *The hidden load* | *It is about the size of a second one of these.* | D2 §13.3 (Eli's audit) |
| R7 *Dad boots* | `VOLUME LABEL: DAD / 88 BAD SECTORS - MARKED, NOT REPAIRED` … *"— and the other thing about a hotel," says a man, at ordinary conversational volume, halfway through a sentence he began somewhere else …* / *"Well," he says. "Hello."* | D2 §5.1, `act2/dad.ts:150–158` |
| R8 *The building is physically impossible* | *Two hundred and twenty-one.* … *The drawing on the wall says a hundred and eighty feet.* (41 is never printed — canon 66) | D3 §11.3 |
| R9 *Sublevel 6 exists and maintains people* | the hooks: *And there it is, at about the middle, in the same pressed tape as the rest: NOLAN*; the sleepers: *Ordinary people, asleep in their day clothes … You do not know a single one of them by sight, and this is a county where you have been introduced to everybody twice.* | D5 §5.1, §6 |
| R10 *Jules was deprecated* | `SUBJECT JULES I ..................... DEPRECATED` … *He is here. He has been here the whole time, in a field, with a word in it. / Nobody took him anywhere.* | D5 §23.2 |
| R11 *The town runs here* | the ASCII block with `460` ruled across it; *Everything over the line is the part nobody filed for. / And every notch is above the line. / The part of this that goes to sleep at night is not the part with the machines in it.* | D5 §24.3 (canon 85) |
| R12 *You are the anomaly in the queue* | `SUBJECT [UNRESOLVED] .... RE-ACQUIRE / LAST KNOWN: MAIN ST / TOP FLOOR REAR` … *The third line is the one with the address on it. / Top floor, back. Three weeks, you've had it.* — then M16: *"Sorry about this."* | D5 §25.1, §26 (canon 86, 87) |

### 2.2 Lines that come closer than the guide allows — rulings

1. **`Maintenance, it said. That is the whole of what you are.`** (`DELETE QUEUE`, D5 §25.3; canon-question §36 q7). **Holds.** Three reasons. It is a refusal response — only a player who tries to edit the queue reads it, and that player has just been told he is *logged in at the level of a man who is allowed to look at it*, which is the antecedent of *it*. The sentence is complete as a remark about an access level, and the version that converts it into R13 (§38.1's *and it is not a description of your job*) is quarantined and should stay so. And the phrase *what you are* belongs to the question the room opened one turn earlier (*What are these people — and what am I?*), so a player who goes cold here is doing the guide's work for it. **One condition for Stage E:** R13's own screen must not reuse *what you are* or *the whole of*. If the profile terminal echoes the phrase, the recontextualization becomes a callback and is spent. If Ryan wants the safer cut, it is the last sentence only; the response then ends on *a man who is allowed to look at it*, which is still good.
2. **Dad's mannerism line** — *"You take a breath in before you say a name. Every time. Somebody else used to do that and it drove me —" / He stops. It is a very short stop.* (D2 §5.2, canon 59). **Holds.** It is the canon working idea, once per act, audible; it names nobody. It sits one inference from R14 and stops. Stage E's Dad may have his Act IV and Act V instances and no more, and he may never finish the sentence.
3. **M7** — *Third time this month I have come down here to put a tape on this corridor.* A memory the investigator cannot have, in a building he entered today. **Holds** by the strata design; it is the tell working. It does mean an attentive player has R14 by the end of Act III; the plan should assume that player exists and give him the proof rather than the fact.
4. **The R4 question's premise.** The architecture's R4 gloss (*Jules's notebook was IN the investigator's room before the attack*) is superseded by canon 18 (the page was in the hatband): the *page* was placed, not the book. The shipped question asks the right thing — *How did it get from a box in Wall Drug into that room?* — and the answer is R19's `INITIAL OBJECTS`, not a notebook-in-the-room story. Stage E answers `act2_q_how_was_it_here` on the creation record and nowhere else.
5. **Dot's *"Was he wearing his hat?"* and her fright at her own blankness** (D1 §12.5, canon 57). Comes close to canon 8 rule 3 as a *felt* thing; holds because nobody names it.

Nothing in Acts I–III states R13 (*profile* is never printed — the word does not occur in player-visible text), R14 (no response compares arms — canon 33), R15 (Jack's *"He writes back every time, nice as you like"* is the plant, not the reveal), R16, R17 (the sky is described nowhere after wave 5, six waves running), R18 (the pad and the Hub both stop at `MAINTENANCE`), R19 (the word *subject* is printed only by the machine, as a category everyone is in), R20, or R21.

### 2.3 The remaining rungs

| R | Must say | Must not | Already on the board |
|---|---|---|---|
| **R13** *The system has been profiling you* (IV) | a system screen, fixed-width, three tallies and a `PRIMARY STRATEGY` line (spec 04 §3's shape); delivered by the Hub terminal after Act IV opens, as a fourth heading beside `ARCHIVE / LOAD / QUEUE` | *what you are*, *the whole of*; any narrator gloss on the numbers; the word *profile* before the screen prints it | `state.profile` (engine), `profileLeader` (cond); the Hub login; the D2 breath-before-a-name (canon 59 assigns its Act IV instance to R13); the §4 signal problem |
| **R14** *Your body remembers being family* (IV) | the handwriting overlay found (evidence bag vs notebook); the ledger's numeral search; Jack seeing the mark under the Bay's lamp; the Chamber completing | naming the creator; *you are Jules*; any response comparing the two arms (canon 33 — Jack's line must be about something else entirely); re-describing the stroke | the stroke (spent); M5/M7 (the strata tell); `act3_clue_j_hand` (the checkout card — Jules's hand vs Jules's notebook, a seed, not P21's sample); `act2_dot_remembers_hat` |
| **R15** *The censor kept the family apart* (IV) | Luke's copies: cheerful letters "from Jack" that Jack never wrote, shown | the censor's rule stated by anyone (D2's standing constraint) | Jack's `topic_letters`; `CLUE_LETTERS_ANSWERED`; Eli's rewritten reply (R5) as the pattern |
| **R16** *Even POTUS is not the user* (IV) | the S6 door — *a door that wants two things* (D4 §9.7) — opens for Luke's leg; the root door's reader, *never switched on* (D5 §28.2), does nothing for him | *the world's most powerful man is not the user either* as a narrator line — it is the architecture's gloss, not prose; any explanation of what the facility answers to | the two-thing door; the dead reader; `ACCESS LEVEL: MAINTENANCE / DENIED` |
| **R17** *The sky is a ceiling, everywhere* (IV) | Sissy's developed film against the porch Polaroid — the same arrangement of soft discs; the seams and the structure behind them on the *film* | a narrator count of stars (canon 70; canon 93 allows a refusal to say a number was asked for); the word *skybox* or any synonym; a third sky in Stage E before the Dome | the out-of-focus Polaroid (wave 5 §9.4); the library darkroom (wave 3 §9.6, locked); the cache's film canister (content unassigned — §6 q4) |
| **R18** *The credentials worked all along* (V) | the antechamber console accepts; Dad, on the rig: *"Nobody ever changes the defaults."* (architecture) | the joke explained (guide §17); Dad docked in a networked machine (canon 53 — he speaks from the rig) | canon 75; two shallow acceptances already rehearsed |
| **R19** *Jules made you* (V) | the creation record: `AUTHOR: JULES I`, `OCCUPATION: INVESTIGATOR`, `INITIAL MEMORY STATE: INTENTIONALLY BLANK`, `PHYSICAL PARAMETERS: RANDOMIZED`, `INITIAL OBJECTS: FEDORA … PAGE 7/8 …` | any narrator sentence that draws the conclusion; a date (canon 37/47 discipline); *subject* spoken by a person | `SNAPSHOT: ARCHIVED / ROOT`; the queue's `[UNRESOLVED]`; L1, L5, L11; M17 |
| **R20** *Finding the missing person* (V, P27, optional) | Jules's snapshot woken once at the console; the confession, the apology to Jack, the plan — in text, through the terminal (canon 87: only Dad and the terminal speak below) | *deprecated* in Jules's mouth (canon 84); an explanation of the cosmology; a second waking | `ARCHIVED / ROOT`; the returned letter (M14, from Jules's side); *There is no note on top* |
| **R21** *The recursion* (V, P28) | nothing — the form, the fields, `INITIALIZE?` / `> YES`, `Darkness.` / `Your head hurts.` | any narration of what the player has understood (canon 02 §19) | the opening room, verbatim |

---

## 3. Recontextualization audit (guide §12, §17; constitution §31)

Rule applied: the old line stays; the new context does the work. **No second reading below requires touching a shipped line.** Where a second reading has no line to re-read, that is recorded as the finding.

| # | Second reading promised | The Act I–III line it re-reads (verbatim) | Stage E touches it? | Finding |
|---|---|---|---|---|
| 1 | *there was nobody there to recognize* → *recognized at last, as the author* (L4) | *USER NOT RECOGNIZED … whether you type a name, a word, or nothing at all* / *USER, probably. It has been asking a long time.* (opening §4.9) | never | relies; the root's acceptance is the whole payoff |
| 2 | `INITIAL MEMORY STATE: INTENTIONALLY BLANK` | *the shape is in perfect condition. There is nothing in it.* (opening §2) | never | relies; the record must print the title's words exactly |
| 3 | *it was placed* | *The hat fits. You have no idea whether that is good news.* (opening §6) | never | relies (INITIAL OBJECTS) |
| 4 | the removed I | *a professional was paid, at length, to disagree* (opening §4.12); *Whoever took it off was good. Whoever put it on was better.* (D5 §8.3) | never | relies — **but** see §6 q3: a randomized body with a removed mark needs the record to account for it in one field |
| 5 | *the only thing on this street that was working* | *He is not hurrying and he is not interesting* (Main Street §4.6) | never | relies; paid by M15/R12 already |
| 6 | *he is not one of the ones they shy from* | *It lets you, and then leans a little of its weight into the hand* (Main Street §4.1) | never | relies at R19; no line may connect them (canon 17, 27, 71) |
| 7 | *a surface that has been reconciled more than once* | *The patches have themselves been patched* (Main Street §4.5) | never | relies; layer-recursion residue, never explained |
| 8 | *there was never a price he knew; he is three weeks old* | *You have no idea whether any of those numbers is a lot* (Main Street §4.4) | never | relies — subject to the timeline ruling (§6 q2) |
| 9 | *the address on a work order* | *"Top floor, back. Three weeks, you've had it."* | never | **already delivered** (R12, D5 §25.1) — nothing left for Stage E |
| 10 | *the player's own memory of the same fact* | *He wiped his feet on the way in.* (wave 5 §11) | never | delivered (M16) |
| 11 | *the tattoos are copies* (D5 §33) | `IV` — *"Birth order. That's the whole of the joke. I'm four."*; `JACK IV` | never | relies — **not canon**; §6 q8 rules whether the reading is available |
| 12 | *the same skybox over two worlds* (L13) | *the stars come out as small soft discs of different sizes* (wave 5 §9.4) | never | relies — with a constraint: the Polaroid is **out of focus**, so the match is by *arrangement* and the seams belong to the film alone. Stage E may not describe the Polaroid as sharper than wave 5 wrote it |
| 13 | *the client finds his brother in the man he hired* (L6) | Jack's `IV`, *inside of the left forearm, above the wrist* | never | relies; Jack's scene must not compare arms (canon 33) |
| 14 | *they never ignored him* (R15) | *"He writes back. That's the part. He writes back every time, nice as you like…"* (`act1/jack.ts:441`) | never | relies |
| 15 | *Jules, at three in the morning, before he wrote it in the book* | the pencil line inside the gauge bezel (D4 §9.3) | never | relies; no Stage E line may attribute it |
| 16 | *the password was never the thing being measured* | `ACCESS LEVEL: MAINTENANCE` (D4 §9.8, D5 §22.3, §28.3) | never | relies (R18) |
| 17 | *the county's doctor is downstream of a machine on a wall* | `NOT MORE THAN NINE IN ANY SEVEN DAYS` (wave 5 §7.2; D5 §10.1) | never | relies — and its last movement is the game's last line (§1.4 (4)) |
| 18 | *Nolan cannot describe a face he sat across from for nine years* | `ASSOCIATIONS ...... RECONCILED` | never | delivered in Act III; Jack's pending line is its Stage E echo |
| 19 | *the one in his room was left asking for years, by nobody* | *No burn. The phosphor is even all the way across* (D5 §22.6) | never | relies (R19: the terminal on the record) |
| 20 | *the lift's blank button is a floor, and it is this one* | *More polish on the blank than on S5* (D4 §12.2); doors past the far wall (D5 §16.1) | never | delivered by implication; §36 q11 leaves the car unpressed — Stage E decides whether it ever is |
| 21 | *One man, for a very long time, alone* | the path worn into the Hub's carpet (D5 §30.3) | never | relies (R20) |
| 22 | *your own face is three weeks old* (L11) | — | — | **no line exists** to re-read (§1.5 (4)) |
| 23 | *the earliest on-record rewrite; the family has fought this for a generation* (L19) | `SENATOR'S REMARKS IN FULL` vs Dad's telling | never | delivered (D2) |
| 24 | *A thing with no one to claim it, in the first conversation of the game* | *a dog that wasn't anybody's* (front desk v3) | never | free; nothing owes it |

**Would any second reading require rewriting shipped prose?** No. Two would require *new* prose to exist at all (rows 11 and 22), and one requires the writer to accept a constraint the architecture did not anticipate (row 12).

---

## 4. The memory strata

### 4.1 Fired, remaining, stratum

Route evidence: 16 `MEMORY RECOVERED` blocks on the canonical transcript.

| Fragment | Stratum | Status at v0.15.0 | Trigger (shipped or owed) |
|---|---|---|---|
| hat memory (Act I) | recent | fired | wearing the fedora |
| M1 hiring | recent | fired | first entering the diner (held to wave 4) |
| M2 poker ×3 | family (variant) | fired (one variant) | `has: act2_deck` + `profileLeader` |
| M3 tattoo ×3 | family/seeded (variant) | fired (one variant) | `FLAG_SAW_JACK_TATTOO` + `profileLeader` |
| M4 stakeout | recent | shipped, not on route | post office after `act2_started` and `sat_in_post_office` |
| M5 notebook, own hand | seeded | fired | first `READ NOTEBOOK` |
| M6 Dad's garage | family | fired | holding the USB |
| M7 B4 | seeded | fired | entering B4 |
| M8 Nolan's office | seeded | fired | meeting Nolan |
| M9 the chairs | seeded | fired | the Bay |
| M12 Luke's word | family | shipped, **not on route** (the doodle is read; `act2_luke_referenced` is not set by the fixture) | Luke referenced + the margin doodle — the plan should check the minimum route reaches it, since P22 wants its token |
| M13 Eli at the hearing | family | fired | Eli's fold |
| M14 the confrontation | seeded | fired | the returned letter |
| M15 being watched | recent | fired | examining the Custodian |
| M16 the attack ×3 | recent (last of stratum) | fired (one variant) | R12's clue |
| M18-A marginalia | exclusive (analytical) | fired | rubbing + notebook + leader analytical |
| M19-S Dad's tells (*His Bluff Face* — *a kitchen table with the good cloth off it, and five of you round it*) | exclusive (social) | fired | beating Dad's advice at poker (the route does) |
| M20-D driving lesson | exclusive (direct) | fired | the fence route |
| **M10** escape room — five coats, a countdown, laughing | **family (variant ×3, unwritten)** | **owed** | the Chamber threshold (scope cut §4); counts toward P23's ≥3 |
| **M11** Sissy's launch — four brothers watching one sky | **family** | **owed** | the Mars gate / Sissy; Sissy trusts the player with the film |
| **M17** the white room — a voice reading parameters | **creation (the deepest)** | **owed** | Root Antechamber; P28's form arrives already familiar |
| M21–M24 | replay | reserved (Stage F) | early credential use at the opening terminal — which requires §1.5 (3) |

The recent stratum is **complete** (M16 was its last, by design). The seeded stratum has no Act IV–V fragment: Jules's memories of the family's last day (M10) and Sissy's launch (M11) are *family* fragments, and the creation fragment (M17) is its own stratum. That is right — the seeded stratum's job was to make the player suspect; Acts IV–V prove.

**P23's entry condition.** Architecture: ≥3 family-cluster fragments. On the canonical route the family fragments fired are M2, M3, M6, M13 — four (M12 did not fire; see above). A player who skipped poker and the fold still has M3 (unmissable), M6 (unmissable with the USB) and M10 at the threshold. The gate is safe; the plan should check it against the *minimum* route, not this one, and should decide whether M19-S (an exclusive, fired here by beating Dad at cards) counts as family — the architecture's cluster list says no.

### 4.2 Does `profileLeader` have enough signal by Act IV?

The mechanism (`src/engine/cond.ts:179–187`): strict maximum, a tie has no leader. Tallies increment on every classed verb (`src/engine/puzzles.ts:94–98`), `LOOK` and meta are null.

The classes as shipped: `EXAMINE`, `SEARCH`, `LOOK UNDER`, `READ`, `COMPARE`, `MEASURE` and their kin are *analytical*; `ASK`/`TELL` are *social*; `TAKE`, `WEAR`, `YELL`, and **every compass direction, `IN`, `OUT`, `UP`, `DOWN`** are *direct* (`act1/verbs.ts:722–730`).

Counting the canonical route's 681 commands by first word: **analytical ≈ 230, direct ≈ 206, social ≈ 80, neutral ≈ 99.** Two consequences:

1. **Social can never lead** for a player who moves and looks — the diner's whole cast could be interviewed twice and still lose to the walk from Town Edge to Wall Drug. M2-social, M3-social and M16-social (the variant the route did not fire) are effectively unreachable; the *social* selector for M10's owed variants would be too. Spec 04 §3's 20% varied content collapses to two variants.
2. **Movement is logistics** (constitution §22: *logistics should disappear*), and counting it as *direct action* makes every explorer an operator. It is also the cheapest thing to fix: eight verb definitions gain `class: null`.

The R13 screen itself is fine either way — spec 04 §3's example (*OBSERVATION 81% / SOCIAL INFERENCE 46% / DIRECT ACTION 23%*) is analytical-dominant on purpose, and honesty is the effect. The problem is variant *selection*, not the printout.

**Recommendation (§6 q12):** reclassify movement verbs to `null` in Stage E's engine wave; leave `EXAMINE` analytical; keep the strict-max rule; print R13 from the raw tallies as percentages of the classed total (a script may do arithmetic — canon 70 binds the narrator, not a terminal). Do not build a per-act leader or a weighting scheme; if playtest still shows social unreachable, the second lever is giving `SHOW` and `GIVE` a social class, which they may already deserve.

---

## 5. The recursive ending

### 5.1 What the spec commits to

- **Canon 02 §19** (fixed): a privileged terminal; `CREATE SUBJECT?`; the parameter fields (designation, occupation, initial memory state, starting environment, initial physical condition, initial objects); the player recreates the investigator, the amnesia, the head injury, the opening room, the fedora, the lamp, the terminal; `INITIALIZE? / > YES`; `Darkness. / Your head hurts.`; **no monologue; the player performs the revelation.**
- **Canon 02 §20**: no privileged original reality is ever established (07 A6 stays open).
- **Canon 15 / architecture A13**: the reconciliation reaches the whole layer; only the unaddressable survives; the player caches this cycle's evidence (the notebook now annotated in two hands, the film, the USB, a letter to Jack) and creates the next subject — **a ratchet, not a circle**; **one canonical ending**; playthroughs differ in *understanding* (archived Jules, the sky match, the profile — all optional).
- **Canon 3, 13**: the investigator is Jules's creation; page 7/8 is on the creation record's `INITIAL OBJECTS`.
- **Spec 04 §14 / architecture L2, M21–24**: knowledge from one playthrough alters the next — the credentials at the opening terminal show *cryptic local information*. "Fictionally integrated New Game Plus", not a mechanic.
- **Architecture §1 Act V, §2 P25–P28**: two-of-three root legs (Luke's escort clears the S6 door; Dad's shaft; the credentials at the antechamber); P26 the console; P27 optional Jules (needs the deep index from P23 and the notebook physically present); P28 the form — *sparse knowledge yields defaults, deep knowledge lets the player choose everything, and recognize everything*.
- **Architecture Appendix 9–10**: the save must carry flags, clock, action-class counters, memory set, alertness, NPC overrides (it does — `GameState`, `src/engine/gamestate.ts:75–94`); P28 is the richest consumer of story state.
- **Constraining register entries**: 33 (no response may ever compare the arms — the record cannot say *arm*), 53 (Dad refuses networked machines — the root console is the most networked thing in the game; he speaks from the rig), 75 (the pair opens the root console), 78 (deaths never referred to — the re-acquire death included), 79 (the tunnel is a permanent two-way route — root leg ii passes through it), 82 (the mark may be named *in* Stage E, not before), 83 (`SNAPSHOT: ARCHIVED / ROOT` is P27's address; the ledger shape is fixed), 84 (*deprecated* only on screens and in the player's transcription — Jules's snapshot may not say it), 86 (the system named the player once in Act III; the record's `SUBJECT DESIGNATION` is where it may do so again), 87 (only Dad and the terminal speak below; the Custodian cannot enter the Blank Room), 88 (the Act III line is the acceptance check for the hand-off *into* Stage E), 91 (no carried object is ever put beyond reach — the cache at the end must be a place the player puts things, never a drop), 92 (no `END OF BUILD` anywhere the fiction has a road), 16-canon (`2089.4` is the only other impossible date, unexplained).

### 5.2 What the engine and session already support

`{ end: id }` sets `phase: 'ended'` and emits `ended` (`src/engine/effects.ts:247`); the turn loop then refuses non-meta input. Prompts with multiple fields and `placeholder`s exist (`session.respondToPrompt`, bypassing the turn — no clock, no tally); a script (`ScriptFn`, `src/engine/world.ts:637`) can read the whole `GameState` (flags, clues, memories, `profile`) and emit lines, `goto`, `advanceClock`, and any effect — so **P28's form, R13's screen and R19's record are all content-side scripts**. `die` + `checkpoint` + `RESTART ENCOUNTER` exist for the re-acquire death. Puzzles with any-of `solvedWhen` cover P25's two-of-three. The save envelope is `saveVersion: 1` with an empty migration chain (`src/session/migrate.ts:257`); every Stage E addition is overlay (new rooms, flags, questions), so **no `saveVersion` bump is required** unless something is carried across the hand-off (it should not be — §6 q10).

### 5.3 What it does not support yet

1. **An ending that continues.** `restart` is a fresh `createSession` (`src/session/session.ts:172–175`), reached only through a confirm prompt or the death menu, and both shells (`src/cli/repl.ts:333`, `src/ui/controller.ts:352`) treat `restarted` as a new game with a break in it. Canon 02 §19 needs `> YES` → `Darkness.` / `Your head hurts.` → the opening room's own turn-one text, **in one transcript, with no system line, no prompt and no menu**. This is a session-contract change (the shell must not be the place it lives, or the CLI and the UI will disagree): on an `ended` event whose id the world declares as its recursive ending, the session starts a fresh game and returns both event streams. **ADR required.**
2. **The opening terminal's login** (§1.5 (3)) — content plus one prompt script, in the shipped prompt idiom.
3. **`system.buildBoundary` retirement.** `tests/world-game.test.ts:101–110` asserts exactly **three** exits reference a `/boundary_gate/i` door. At v0.15.0 those are Town Edge `n` and the Emporium `s` (one object, `act1_town_edge_boundary_gate`, in-world text since canon 92) and the Hub's `down` at the well (`act3_s6_boundary_gate`, `act3/s6ArchiveHub.ts:169`, also reached by `ENTER GATE`'s effects); `act3_boundary_gate` is no longer on any exit (`act3/pipeChase.ts:93` goes straight to the Bay) and the test's title is stale. Stage E's last wave deletes the S6 gate, renames the road gate off the pattern (it remains a permanently closed door with in-world `blockedText`), retires the orphaned `act3_boundary_gate` id, and the test asserts **zero**. Then no `END OF BUILD` string exists in content.
4. **Where the ending goes when the next game autosaves over it.** The `'auto'` slot will hold the fresh opening one turn after the hand-off; a player who finished a twelve-hour game and wants to re-read the console has nothing to load. One reserved slot, `'ending'`, written by the session immediately before the hand-off, is the smallest kindness (§6 q10). It is a session change, not a save-schema change.
5. **The replay invariant across the hand-off.** `migrate.ts`'s `replay()` rebuilds a save from `initialState` and its history; a history that crosses the hand-off would replay the next game's inputs against the wrong state. The hand-off must start a **new history** (a fresh session does); the ADR records that the replay invariant is per-cycle.
6. **Nothing else.** No `'V text'` grammar (P22 composes through a prompt, per Stage D plan E7); no NPC-presence engine (Luke's and Sissy's presence are `npcAt` prose rules); no exit effects (the airlock transition is the elevator-connector idiom); no alertness field beyond the flag.

### 5.4 Acceptance check for the hand-off from Act V to the opening room

Run from the Stage D fixture continued through Stage E's route (`tests/fixtures/playthrough-e3.txt`, say), headless, `--fast`:

1. `INITIALIZE` → `YES` prints the ending's authored beats ending exactly `Darkness.` / `Your head hurts.`, followed **in the same transcript** by the opening room's shipped turn-one text, byte-identical to a fresh game's first render; no `system.*` line, no prompt, no menu, no `END OF BUILD` anywhere in the transcript.
2. After the hand-off: `VERSION` answers; `UNDO` answers with the shipped nothing-to-undo line (the ring is reseeded); `LOOK` renders the dark opening room; the state equals `initialState(WORLD)` in every field.
3. The `'auto'` slot holds the fresh opening; the `'ending'` slot (if adopted) holds the console state and `LOAD ending` returns there with `phase: 'ended'`.
4. On the fresh game, `LOG IN` at the opening terminal with `admin` / `admin-password` prints the cryptic local screen once and sets the flag M21–24 will read; any other pair prints the shipped `USER NOT RECOGNIZED` rotation.
5. `questionsView` at the console shows every declared question answered except none — `act3_q_what_are_these_people` closes on R19, `act2_q_how_was_it_here` on the creation record; the transcript has zero `diag` events across the whole route.
6. `tests/world-game.test.ts` asserts zero boundary-gate references; `grep -r "END OF BUILD" src/content` is empty.
7. `npm test` green; the fixture is the 1.0 regression gate.

---

## 6. Questions for the main session (with recommendations)

1. **`That is the whole of what you are` — keep or cut?** Keep (§2.2 (1)). Condition: R13's screen may not reuse *what you are* or *the whole of*; record the condition in the Stage E writer's brief.
2. **The timeline seam.** Canon 35: Jules gone five weeks, the investigator hired three weeks ago, the room let three weeks. Canon 3: created *days before Jules's deprecation*. Architecture Act V: *born three weeks ago*. **Recommend:** Jules went to ground five weeks ago (Jack's *stopped being anywhere at all*), spent two weeks caching and building, was deprecated about three weeks ago, created the investigator days before that and placed him in the room; Jack found him at Pearl's within the day (canon 4: *Jules counted on Jack hiring his creation*). The creation record prints **no date** (canon 37/47 discipline); the arithmetic is Jack's, in Act IV, in one line. Register entry; no shipped text moves.
3. **The randomized body's removed I.** Canon 3 says *body randomized*; canon 82 puts a laser-removed I on it. A randomized body has no history to have removed. **Recommend:** the record carries one field the player is not asked to fill — `PHYSICAL PARAMETERS: RANDOMIZED — 1 EXCEPTION, SUPPRESSED` — and nothing explains it: the seed's mark came through and the system took it off, which is why *whoever put it on was better*. It also gives P28 a beat: the field the player cannot set. Register entry.
4. **What is on Jules's film canister?** Unassigned since D1 (*may not say yet: what the film shows*). **Recommend:** the family's last day together — the day the Chamber reconstructs — with Jules in frame as a stranger (canon 43's second showing, unremarked). It gives P23 an analog anchor (memory vs film: what the harvest got wrong), spoils nothing if developed in Act II at the library, and is what the player re-caches at the end. Reject S6 photographs: developable from Act I, they would spend R9. Register entry.
5. **Does the hab have a terminal (L3 station 4)?** Scope cut §3.3 says yes, explicitly; D5 §35 says the Hub is *the last one before Act V's root console*. **Recommend yes** — the scope cut is the later ruling and the D5 line is a register slip; five stations, as the ledger says.
6. **Whitlock's private notebook.** Unplanted (§1.5 (2)). **Recommend plant in Stage E** as her Act IV lines, keyed to the library's running reader (§1.4 (5)), as the route to the evidence bag (L18 → P21). Register entry: *shown analog proof, she opens the cage; she never lies; her notebook is never read by the player*.
7. **The opening terminal's login.** **Recommend build in Stage E's last wave**, not Stage F — it is part of the hand-off's acceptance (§5.4 (4)). The cryptic screen is the writer's; the constraint is that it prints nothing a first-time player could not also read as noise.
8. **Are the numerals the system's?** D5 §33's second reading (*the tattoos are copies*) is not canon. **Recommend accept as unstated canon (working idea, never printed):** the machine's designations came first; Dad, who had watched a transcript change, drove five children to Rapid City and tattooed the designations on them — the family's first act of analog insurance, consistent with canon 10's motive. If rejected, D5 §33 row 11 is struck and nothing else changes.
9. **The chair leg on `INITIAL OBJECTS`.** **Recommend yes** (§1.4 (3)).
10. **What crosses the hand-off?** **Recommend nothing** in v1: the ratchet is fictional (the cache the player assembles) plus knowledge (04 §14); no cycle counter, no carried flag, no `saveVersion` bump. Adopt the `'ending'` reserved slot (§5.3 (4)). ADR records both.
11. **Does the player ever see his own face?** **Recommend no** — like Jack, he never had it; `RANDOMIZED` lands on the Polaroid and Dot. If Ryan wants the beat, the hab visor is the one honest surface and it is one clause.
12. **Profile signal.** **Recommend** movement verbs → `class: null`; keep strict-max; R13 prints raw percentages (§4.2). ADR or a line in the Stage E engine ADR.
13. **R17 and canon 70.** *Count them, they repeat* (architecture room 38) is a narrator count. **Recommend** `COUNT STARS` is a canon-93 refusal, and the repetition is delivered by `COMPARE PHOTOGRAPH WITH FILM` as an arrangement the player sees, with no total anywhere.
14. **The three unlabeled gate frames.** **Recommend** a register entry: dark in v1, one refusal each, never named, the post-1.0 seam (canon 9's cut environments).
15. **When is Jack reconciled?** The queue says pending. **Recommend:** never on screen. His recognition scene (R14) happens before the visit ends; the reconciliation is what the player *prevents reaching Jack's cache-letter* in Act V, and the game never shows him after. The horror is the queue line, already delivered; guide §5 forbids the rest. Register entry.
16. **`STARTING ENVIRONMENT` and `INITIAL PHYSICAL CONDITION` on Jules's record.** **Recommend** the room (`MAIN ST / TOP FLOOR REAR`, the queue's own string) and `HEADACHE` — no gloss. The blank needed a cover for not remembering; the player, filling the same field at the end, understands why without a line. This is also what makes canon 02 §19's *recreating the head injury* true without contradicting M16 (last night's wound was real; the first one was authored).
17. **The `ENTER SURNAME OR NUMERAL` search.** **Recommend wire** as §1.4 (2), gated on `act4_started`.

**Proposed register entries (from 94; Ryan writes them):** q2 (timeline), q3 (the exception field), q4 (the film), q6 (Whitlock's notebook), q8 (numerals, working idea), q10 (nothing crosses; the `'ending'` slot), q12 (movement is neutral), q14 (the dark frames), q15 (Jack never reconciled on screen), q16 (the record's environment and condition fields). Corrections to documents, not canon: D5 §35's station count; wave 4/5's three "Unassigned" rows that are paid (§1.3).

**Proposed canon promotions:** none. Every item above is either a register entry (the build protocol's delegated authority) or a working idea; nothing here changes a `WORKING IDEA` / `POSSIBILITY` label in docs 02–07.

---

## 7. What Stage E must contain, minimally — a first cut of the waves

Sized like the Stage D plan §2. Four waves, four MINOR releases — one more than the plan's `0.16–0.18` because the engine and the identity thread do not belong in the same release as Luke. Stage F then closes at 1.0.0. Tiers per scope cut §2; every room enters with its §32 reason; each wave states its chain from the previous wave's last link (constitution §29).

**The Stage E spine, from D5's last link.** *THEREFORE the question stops being "what happened to Jules" and becomes "what are these people — and what am I?"* —

**E0.** — **THEREFORE** the evidence about the self is gathered where it already lies: the sheriff's cage, the Bay's lamp, the Hub's ledger — **BUT** dodges are not answers, and every credential in the game stops at the root door; somebody must outrank the building — **THEREFORE** the man who can: the President is coming to the facility his family's administration commissioned, and the town has been repaving for him.
**E1.** — **BUT** the investigator has no identity and the detail is trained to see exactly this nobody coming — **THEREFORE** the family channel: a message no impostor could compose and no censor can parse; Luke reads it and stops the motorcade — **BUT** even the President's authority bottoms out at Sublevel 6: the two-thing door opens for him and the root door's reader stays dark.
**E2.** — **THEREFORE** the remaining doors are family doors: the archive's gates — the last day together, which only Jules's memory completes; and Sissy's sky, which cannot be rewritten in transit if it never transits — **BUT** knowing Jules's memories is not being Jules, and the sky proves there is no outside to escalate to.
**E3.** — **THEREFORE** the only true direction is down: Dad's shaft, Luke's cleared floor, or the credentials that have been in the back cover all along — **BUT** the reconciliation queued on Sublevel 6 is running — **THEREFORE** the family's method, one generation deeper: cache the truth where it cannot be addressed, and at the console do the one thing reconciliation cannot touch. `INITIALIZE?`

### E0 — Engine, the identity thread, the town before the visit (v0.16.0)

| Item | Where | Notes |
|---|---|---|
| **Engine E-1** the continuing ending | `src/session/session.ts`, both shells, ADR | §5.3 (1), (4), (5): `WorldMeta.recursiveEnding`, the `'ending'` slot, per-cycle history |
| **Engine E-2** movement verbs neutral | `act1/verbs.ts` (8 definitions) | §4.2; test: the route's tallies shift; social reachable on a talkative script |
| **Engine E-3** boundary retirement, part 1 | `tests/world-game.test.ts` | the test learns to count gate *objects* named `*_boundary_gate` only; roads renamed now (canon 92), S6 gate deleted in E3 |
| Rooms | **none new** | the identity thread lives in shipped rooms |
| P21 self-evidence | Sheriff's Office (the cage opens on Whitlock's hinge — q6), the Bay (Jack under the lamp is E1), the Hub (`SEARCH LEDGER FOR I` — q17; the profile heading — R13) | classes K throughout; no clock terms |
| R13 | Hub terminal, after `act4_started` | a script over `state.profile`; §2.3's prohibitions |
| Zone 1 dressing | Main Street, diner, post office, motel | the visit's arrival: crews, the sweep, Pearl's counter as the pool-spray stop, a second notice beside the blank rectangle (§1.3); Whitlock's Act IV lines; Jack's state after R12 (he does not know yet) |
| Memories | none new | — |
| Questions | `act4_q_who_outranks_it` opens on the root door's refusal + R13 | the authority thread's anchor |
| State | `act4_started` (set by the first Act IV clue), `act4_profile_seen`, `act4_cage_open`, `act4_handwriting_matched`, `act4_numeral_searched` | |
| Tests | `world-act4-identity.test.ts`; the Stage D playthrough extended; profile-reclass regression | |
| Boundary | the Staging door in the Lobby and the gate frames | one gate object; in-world text (canon 92 does not apply — no road) |

### E1 — Authority: the visit (v0.17.0)

| Room | id | Tier | Causal reason (§32) |
|---|---|---|---|
| Staging Area / Conference | `act4_staging_area` | standard · 6 | Sole venue of P22 (scope cut row 26, refused cut); Luke, the detail, twelve minutes; root leg (i) |

Systems: **P22** — the message composed through the letter prompt against `censor.ts`'s family vocabulary (already declared), handed by Pearl (architecture's working idea; the diner is the stop); the detail as a schedule-dressed, progress-triggered two-day window (canon 11: missing the motorcade leaves the staging meeting reachable). **R15** — Luke's folder. **R16** — Luke's escort opens the S6 door (the two-thing door, D4 §9.7 → `act4_s6_door_open`); the root reader stays dark. **R14, Jack's third** — Jack in the Bay under the lamp: he sees the mark and says something that is not a comparison (canon 33). Luke's rationalization; Jack's silence about his own. Luke's vocabulary (guide §8). Memories: none new (M12 already fired for most; its capability is P22's token). Puzzles: `act4_p22_luke` (S/K/C; a `weekday`-free route through the staging meeting satisfies the validator). Tests: the message verdicts table-driven; the visit's two-day span via `onOrAfterDay`; the S6 door opens only with `act4_s6_door_open`. Boundary: the gate frames.

### E2 — The archive: the Chamber and the hab (v0.18.0)

| Room | id | Tier | Causal reason (§32) |
|---|---|---|---|
| Escape Room — the Chamber | `act4_escape_chamber` | **hero** · 12 | P23: the reconstruction only completes if the player performs Jules's role; the set piece *is* the reveal mechanism (architecture §6); the five coats and one bare hook on the entry wall (scope cut §4) |
| Mars Hab — Galley & Comms | `act4_hab_galley` | standard · 6 | Sissy; the unanswered anomaly logs; the comms rig's four-second "twelve-minute" round trip; L3 station 4 (q5) |
| Mars Hab — Observation Dome | `act4_hab_dome` | standard · 6, polish-priority | the sky; the film; P24 → R17; the game's quietest room (guide §5) |

Systems: the gate transition prose (Hub ↔ Galley: the suit ritual, the elevator-connector idiom). **P23** — the family fragments as capability (≥3 gate at the frame; the siblings' recorded voices on second failure — no-doom); **R14's undodgeable form**. **P24** — Sissy's film; developing at the library darkroom (clock-free route) — and Jules's canister (q4) developed the same way. **R17** — the arrangement match, the seams on the film (q13). **M10** (Chamber threshold, three variants), **M11** (Sissy). Sissy's rationalization (the third). Questions: `act4_q_the_sky` opens on the Dome. State: `act4_chamber_complete`, `act4_deep_index` (P27's key), `act4_film_developed`, `act4_sky_matched`, `act4_jules_film_developed`. Tests: the Chamber completes only with the fragments; the darkroom route; the compare handler. Boundary: the root door's well (`DOWN`) — the last `system.buildBoundary` in the game.

### E3 — Root (v0.19.0)

| Room | id | Tier | Causal reason (§32) |
|---|---|---|---|
| Root Shaft | `act5_root_shaft` | light · 3 | Dad's route made vertical (leg ii, via the tunnel — canon 79); `SYSTEM REVISION 2089.4` (L9); the key's number (§1.4 (1)); Return B arriving, one sentence |
| Root Antechamber | `act5_root_antechamber` | light · 3 | the credentials threshold (P26; L2/L4's landing; M17); *one console asking, patiently, forever* |
| The Blank Room | `act5_blank_room` | **hero** · the console | P26, P27, P28; R18–R21; the description is nearly empty and that is the description |

Systems: **P25** two-of-three legs (any-of `solvedWhen`; Luke's floor, the shaft, the pair). **P26** the console (the shipped prompt idiom; canon 75). **R19** the creation record (the fields per q3, q16; `INITIAL OBJECTS` per q9; no date). **P27** Jules woken once, through the terminal (canon 84, 87; the notebook present; the deep index). **R18** Dad on the rig. The **cache assembly**, player-paced: a place, never a drop (canon 91) — the notebook in two hands, the film(s), the USB, the letter to Jack; *this* cycle leaves a note. **P28** the form: fields pre-filled from the flag set (`placeholder`s), the one field the player cannot set (q3), `INITIALIZE?` → `> YES` → the hand-off (§5.4). **M17** at the antechamber. The Custodian's re-acquire death on the S6 approach after the reconciliation begins (`die` + checkpoint; canon 78). The opening terminal's login (§1.5 (3)). **Boundary retirement**: the S6 gate deleted; the test asserts zero; no `END OF BUILD` in content. Tests: `world-act5-root.test.ts`; the full fixture `playthrough-e3.txt` from turn one through the hand-off, zero diags; the 1.0 regression gate.

### Word budget against the scope cut

Two hero rooms (Chamber ~3,000; Blank Room ~3,000, mostly terminal text) · three standard (Staging, Galley, Dome ~3,600) · two light (~1,000) · dialogue: Luke ~1,200, Sissy ~1,200, Jules's snapshot ~800, Whitlock/Jack/Pearl/Dad additions ~1,300 · terminal/system text (profile, record, form, the ending, the opening login) ~1,800 · memories (M10 ×3, M11, M17) ~600 · Zone 1 visit dressing ~800 · hint ladders (P21–P28, five rungs) ~1,600 · gate transitions and the shaft's one sentence ~400 — **~19–20k**, against the Stage D plan §7.2's ~15k estimate and its ~59k-before-E total. The game lands near **78k** unless Ryan re-rules the budget or takes the plan's levers (hint ladders excluded from the count; the Landing trim; standard rooms at 1,000). Nothing above cuts a puzzle, a reveal, a thread or an NPC; the levers are the same ones §7.2 named.

### What this cut deliberately does not do

No `'V text'` grammar; no NPC-presence engine; no exit effects; no `saveVersion` bump; no carried state across the hand-off; no robot body for Dad; no Catan; no lit fourth gate frame; no second horse beat; no second dark room with something in it (D4 §17 reserves the device for Act IV — the Chamber may spend it, once); no second use of the narrator telling the player what he is like (D3 §17 reserves one — the Blank Room may spend it, once); no fourth narrator count (canon 70). No prose: every quoted line above that is not shipped is a draft for `narrative-writer` to replace, and every line quoted from the game is quoted so that nobody rewrites it.
