# Stage E Wave E1 — The Visit

**Status (main session, 2026-08-31):** **wired and shipped v0.17.0**; accepted whole — no cuts (§40's case accepted; the machinery is priced by canon 46); §34 rulings: q1–q10 as recommended (q8: **west**, matching the shipped Lobby — the plan's `e` was the slip; register 119–125 for §39); §36 neither block wired; §38 items 1–4, 6, 10–13 and the S6 door's open examine commissioned as `2026-09-18-stage-e1-addendum.md`. Original: draft for main-session voice review · **Author:** `narrative-writer`
· **Date:** 2026-09-18
**Covers:** Act IV's authority thread — the one new room (`act4_staging_area`,
the Staging Area / Conference off the Lobby) and its six objects; **Luke**, his
eight topics, his four shows and his vocabulary; **P22**, the message that gets
through and the two hands it can be given to; the office's form letter for the
one that does not; **R15**, the folder of cheerful letters from Jack that Jack
never wrote; **R16**, the escort — the lift, Sublevel 5, the two-thing door
getting its second thing, and the reader at the bottom of the well that does
nothing for the President of the United States; **R14's completion** — Jack
under the inspection lamp in the Maintenance Bay, wordless, and his one line
upstairs the next morning; and the Act IV build boundary, moved.
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md`
(**§5** — the Bay scene and the reader are two of the seven moments §5 names,
**§8** — Luke is the vocabulary source and this is where the device pays,
**§11**, **§12**, **§14**, **§17**, **§18**),
`docs/spec/01-design-constitution.md` §8, §9, §14, §29, §30, §31, §32,
`docs/spec/02-story-world-canon.md` §8–§13, §17, §19–§21,
`docs/spec/03-characters-and-relationships.md` §3, §9, §10,
`docs/spec/04-gameplay-and-puzzle-systems.md` §5, §12, §16, §18,
`docs/spec/09-canon-decisions.md` entries **8**, **11**, **12**, **15**,
**33**, **37**, **43**, **46**, **47**, **59**, **70**, **71**, **78**,
**79**, **81**, **82**, **84**, **85**, **87**, **88**, **89**, **93**,
**94**, **96**, **97**, **98**, **102**, **104**, **110**, **113**, **114**,
**117**, **118**,
`docs/superpowers/specs/2026-09-16-stage-e-plan.md` **§1 E1**, **§2 E1**,
**§4.0**, **§4.2**, **§5 Q1**, **Q3**, **Q11**, **Q12**,
`docs/superpowers/specs/2026-09-15-endgame-integrity-review.md` **§2.3
R14/R15/R16**, **§3** rows 4, 12, 13, 14, 16, 20, and the **E0 prose
document**, whose street, sheriff and terminal this wave is standing on and
whose registers it extends.
**Wires into:** `world.rooms.act4_staging_area` (one new room, one new exit
pair), `world.npcs.{act4_luke (new), act1_jack (three topics, three gated
rules), act1_pearl (two responses), act1_whitlock (one response)}`,
`world.objects.{act4_staging_whiteboard, act4_conference_table,
act4_lukes_folder, act4_jack_letters, act4_staging_window, act4_detail,
act4_coffee_urn, act4_reply_office}`, `world.scripts.{act4_hand_letter,
act4_luke_descends, act4_luke_at_root, act4_jack_comes_down}`,
`world.events.{act4_ev_staging_opens, act4_ev_jack_sees, act4_ev_jack_returns,
act4_ev_office_reply}`, `world.clues.act4_*`, `world.questions.act4_q_reach_luke`,
`world.puzzles.act4_p22_luke`, plus **amendments in place** to
`act2/censor.ts` (one new pure export, `familyVerdict`),
`act3/objects/lobby.ts` (`STAGING_DOOR_BLOCKED_TEXT` gains two rules),
`act3/objects/s5ReactorInterface.ts` (the S6 door gains an open state and a
stair), `act3/objects/s6ArchiveHub.ts` (the root reader gains a with-Luke
branch; `SYSTEM_BOUNDARY_TEXT` gains a third arm),
`act3/objects/s6MaintenanceBay.ts` (the lamp fires one event).

Every string below is final prose. Nothing here is a placeholder. **Two blocks
are quarantined** (§36); I recommend wiring neither. **The wave is 30% over the
brief's word budget and §40 says exactly where, why, and what the cheapest cut
is** — it also says I do not recommend taking it.

---

## 0. How to read this

Conventions are E0's, which are D5's. Path ids are authored-slot addresses;
numbered variants are a `string[]` rotation in order; state-dependent blocks
are `ProseRule[]` in match order, first match wins, last rule unconditional;
`when:` clauses are `Cond` shorthand; `> **Note.**` blocks are authoring notes
and are never player-visible.

**Every player-visible word in this document is inside a fenced `text` block.**
Nothing else is. §40's count is mechanical for that reason.

**Read §33 before editing any one response alone.** It extends E0 §27, which
extends D5 §35, back to D1 §23. The rows this wave is standing on:

- **Nobody living speaks below Sublevel 5** (canon 104). Luke says everything
  he is ever going to say in the Staging Area. From the moment the lift leaves
  the lobby he says nothing, and the wave does not compensate for that with
  narration about what he might be thinking: the door speaks for him, and then
  the reader does not. Jack says nothing from the mouth of the tunnel onward,
  and his one line lands upstairs, the next morning, and is about something
  else. **If an editor gives either man a line below ground, both scenes stop
  working and canon 104 is gone.**
- **Canon 33 is absolute here.** Jack's own arm is not mentioned, not
  described, not covered and not rolled, in the Bay or anywhere else in this
  wave; Luke's is not shown at all (§12.4's note); no response compares any two
  arms, and no `COMPARE` verb reaches a person. The mark on the player's
  forearm is named **once**, as *a numeral*, in §25, by the narrator, and never
  again.
- **The gloss is never printed.** *The world's most powerful man is not the
  user either* is the architecture's sentence about R16 and it is not prose.
  §22 gives the player a man doing a small thing twice and then stopping.
  Nothing after it explains what that meant.
- **The narrator does not count.** Canon 70 is spent for the whole game. Four
  drafts in this document were rewritten to remove a number (§33); the
  whiteboard prints no times, the folder does not say how many letters are in
  it, and nobody counts the men in the lot.
- **No date, no clock time, no price.** The schedule's time column has been
  wiped and rewritten until it is unreadable (§4.1), which is the wave's answer
  to canon 37 and canon 47 and is also true of every board of its kind.
- **Canon 118 is held to the letter, and it turned out to cost nothing.** The
  name *Luke* is printed **once in the whole wave**, at the top of a letter, in
  Jack's own hand (§7.1) — which is exactly the one place canon 118 leaves open
  (*nobody outside Jack and the letters*). The narrator never uses it; the
  detail never says a name; the whiteboard says `PRINCIPAL`; Whitlock's shipped
  complaint is not repeated; Pearl does not say *the President* a second time.
  *The President* appears in two of the player's own clue notes and in the
  office's form letter, both of which are documents rather than mouths. **The
  NPC's `name` field and its parser nouns are the only other place the name
  exists, and neither is prose** — see §34 q1.
- **Every anomaly still has a mundane reading.** A protection detail is
  suspicious of a man with no papers. A politician keeps his family's letters.
  A schedule item gets cut between the airport and the site. A badge reader in
  a sub-basement was never commissioned because the sub-basement was never
  finished. The second readings are in §31 and **none of them is stated.**

**The vocabulary zone (guide §7, §8).** E0 spent road words and paper words.
This wave is in a hold room and a protection detail's afternoon, so its words
are staff words and trade words: *advance*, *hold*, *spray*, *the pool*,
*edge line*, *hasp*, and one plate of engraved plastic. **Luke is the game's
declared vocabulary source (guide §8) and this is the only wave he is in**: he
uses *noumena* (canon; M12; a P22 token), *lacuna* (once, §11.4) and
*provenance* (once, §11.5). **Not one of them is required to express an
action**, none is defined by anybody, and the family joke about them is told
once and never explained (§11.2).

---

## 1. Beat test (constitution §29, guide §18)

E0's last link: *THEREFORE the road is being milled for him, the sheriff has
his schedule, the diner has been told about pie, and the register has three
names in it that one hand wrote. He is coming here.*

**The doors — BUT.** He is coming here, and the room they are keeping him in
is forty feet from a lobby the player can already walk into. **BUT** there are
two men on those doors whose entire profession is the recognition of a person
who does not have a reason to be somewhere, and the investigator does not have
one, and cannot get one, because every credential he carries was issued to
somebody else or to nobody.

**The message — THEREFORE.** Nothing the player is carries gets through a man
like that. **THEREFORE** the thing that has been getting through all game
does: paper. Folded the way a boy folded it asleep under a table at a hearing,
with one of the family's own words in it, signed with a numeral, and handed to
a woman who has fed that family for forty years and whom nobody in this county
has ever thought to search.

**The folder — BUT.** He read it, and he stopped the schedule, and he is
sitting in a hold room being pleasant. **BUT** on the table in front of him
there is a folder of letters from his brother going back years, cheerful,
asking after everybody, asking for nothing, every one of them the same length
— and the brother who wrote none of them is thirty-two miles away at a counter,
being the crank.

**The stair — THEREFORE.** Authority is what opens the doors upstairs, and
here is the whole of it, standing up and putting its coat on. **THEREFORE**
take it to the door that has refused everything: the one at the end of the
Sublevel 5 gallery that wants two things and has never had more than one. It
gets its second thing. There is a stair behind it.

**The reader — BUT.** **BUT** at the bottom of the well the reader does not
refuse him. There is nothing in it to refuse him with. He does it twice, the
way a man checks he did it right the first time, and then he stands in a tiled
well under a building with his father's name on the wall of its lobby, and
then he goes back up, and the visit is over.

**The lamp — THEREFORE.** Authority is the wrong axis, and there is nobody in
this building who will confirm one word of any of it. **THEREFORE** the only
person left who has believed him from the beginning gets shown the room with
the chairs in it — and under the lamp in that room, the man who hired an
investigator to find his brother stops being a client.

> **Beat-test honesty (§29).** R14's Bay scene has **no causal link to the
> visit**. Its honest link to the wave's other thread is `AND THEN`; I am
> saying so before writing it, as the standard requires. Its link backwards is
> a genuine `THEREFORE` off Stage D's rail of hooks and rows of chairs, and its
> link forwards is a genuine `THEREFORE` into E3's cache letter. It is in this
> wave because it is the second half of the same question and because the plan
> put it here, not because the visit caused it, and nothing in the prose
> pretends otherwise.

**Exempt (atmosphere, §18):** the roll of white paper over the trestles, the
urn and its extension lead, the wire basket of pens, the men in the lot, the
fresh edge line on the county road, the little windows over the lift door, and
every response the room gives a man who tries to take something home.

---

## 2. State

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `act4_message_delivered` | false | `act4_hand_letter` on a `'family'` verdict (§16) | `act4_ev_staging_opens`; P22 |
| `act4_message_verdict` | `'none'` | `act4_hand_letter`, every verdict (§16) | `act4_ev_office_reply`; hints |
| `act4_office_reply_due` | — | `act4_hand_letter` (number: day + 1) | `act4_ev_office_reply` |
| `act4_staging_open` | false | `act4_ev_staging_opens` (§17) | the Lobby's west exit; the staging door's blocked text |
| `act4_luke_met` | false | `act4_staging_area`'s `onEnter` with Luke present | P22's `solvedWhen`; Luke's greeting rule 2; `act4_luke_gone`'s day arm; the boundary (§26) |
| `act4_luke_said_word` | false | §11.2 | **E2** (the Chamber's second-failure assist); nothing in this wave |
| `act4_luke_will_escort` | false | §11.6 | `act4_luke_descends` (§20) |
| `act4_s6_door_open` | false | §21 | the S6 door's own text; the stair's exit; **E3** root leg (i) |
| `act4_luke_gone` | false | §23, or `{ all: [{ onOrAfterDay: act4_visit_over_day }, { flag: act4_luke_met }] }` | Luke's schedule; the room's description rule 3; the boundary |
| `act4_jack_will_come` | false | §24.1 | the tunnel mouth's follow (§24.2) |
| `act4_jack_saw_mark` | false | `act4_ev_jack_sees` (§25) | §26's morning line; Jack's short variants (§27); **E3**'s cache letter |

> **Note.** Nothing in this wave can be missed permanently. Luke stays at the
> Staging Area until the message reaches him, however many days that takes
> (canon 11: missing a window costs a cycle, never the game); the S6 door,
> once open, stays open; Jack's willingness to come does not expire. The one
> thing that *is* gone for good is Luke, after §23 — and by then he has given
> the game everything he has.

### Clues

`act4_clue_detail_refuses` (§9.2) · `act4_clue_message_through` (§16 —
`'family'` only) · `act4_clue_letters_from_jack` (§8.1 — **R15**) ·
`act4_clue_lukes_word` (§11.2) · `act4_clue_lukes_reason` (§11.4 — canon 110) ·
`act4_clue_two_thing_door` (§21) · `act4_clue_not_the_user` (§22 — **R16**) ·
`act4_clue_jack_saw` (§25 — **R14**).

**Clue detail text** — knowledge-view strings, in the player's own note.

`act4_clue_detail_refuses`
```text
Two men stand on the doors of the staging area. They took the borrowed badge
and read both sides of it and handed it back and did not move. Nothing I am
carrying was issued to me, because there is nobody for anything to be issued
to.
```

`act4_clue_message_through`
```text
The letter went in folded the way Eli folds, with one of the family's own words
in it and a numeral at the end of it where a signature goes, and it was handed
across a counter rather than posted. The post office is where the censor lives.
```

`act4_clue_letters_from_jack`
```text
There is a folder in that room with years of letters from Jack in it. Cheerful.
Asking after everybody. Not one of them asking for anything, not one of them
crossed out, and every one of them the same length. Jack's hand and Jack's
signature. Jack wrote none of them.
```

`act4_clue_lukes_word`
```text
Noumena. He used it at a dinner table until it was the family's joke, and it is
in the margin of the work book, and it is one of the three things that got a
folded piece of paper read by the President of the United States.
```

`act4_clue_lukes_reason`
```text
He says there was never an I. He says their father was I: he paid for the
tattoos, he sat in the chair first, and he put himself at the head of the row
because he was the head of the row. He says Eli tells it differently, and that
Eli is wrong.
```

`act4_clue_two_thing_door`
```text
The door at the end of the Sublevel 5 gallery takes a badge on the reader and
then a name on the pad. It took his. Behind it there is a stair, and the stair
goes down.
```

`act4_clue_not_the_user`
```text
The reader beside the door at the bottom of the well did nothing at all for the
President of the United States. It did not refuse him. There is nothing in it
to refuse anybody with.
```

`act4_clue_jack_saw`
```text
Jack took my wrist under the inspection lamp in the maintenance bay and turned
the arm over and looked at what is under the skin there. He did not say
anything. He has not said anything about it since.
```

### Questions

`act4_q_reach_luke` — opened on `act4_clue_detail_refuses`, answered on
`act4_luke_met`.

```text
How do you reach the one man who outranks the detail?
```

**`act4_q_reach_luke`'s answer text** (P22's `onSolved`):

```text
Not with anything you own. With a sheet of post-office paper, folded the way a
six-year-old folded them at the back of a hearing, with a word in it that only
five people ever used and a numeral at the bottom where a name goes — handed
over a counter to somebody nobody has ever thought to search.
```

`act4_q_who_outranks_it` (opened in E0) — **answered** on
`act4_clue_not_the_user` (§22).

**`act4_q_who_outranks_it`'s answer text:**

```text
Nobody who is alive. The building took his badge upstairs and opened a door for
him on Sublevel 5, and then it did nothing whatever at the bottom of the well,
because the thing at the bottom of the well is not a door that refuses people.
It is a door nobody has ever switched the reader on for.
```

`act3_q_what_are_these_people` **stays open.** `act4_q_record_about_you` is
E0's and is untouched.

### Puzzles

| Puzzle | State after E1 |
|---|---|
| **P22** `act4_p22_luke` — *the message* | **opened and solvable.** `solvedWhen: { flag: act4_luke_met }`; `onSolved: [{ answerQuestion: act4_q_reach_luke }]`. Two solutions — Pearl (`social`), Whitlock (`social`, and gated on E0's `act4_whitlock_convinced`, so it is the route for a player who has already done the analytical work). Both carry `onOrAfterDay`, so both take `missedRecovery`. |
| **P21** | unchanged; still solvable, still gates nothing mechanical |
| **P25** | root leg (i) is **delivered** by §21 — `act4_s6_door_open` is permanent |

**P22's `missedRecovery`:**

```text
The visit, once announced, does not leave. He stays in that room until the
message reaches him, and the room is still there the day after.
```

**P22's solution notes** (knowledge view, one per solution):

```text
GIVE LETTER TO PEARL, at her counter, once the visit is announced. Write it at
the post office and fold it before you go — but do not post it. Two of three:
the fold, one of the family's own words, and a numeral last on the page.
```

```text
GIVE LETTER TO WHITLOCK, once she has been shown paper she can hold. She goes
in and out of that lobby with a folder and nobody in this county has ever asked
her what is in it. Two of three: the fold, the word, the numeral.
```

### Memories

**None new.** M12 (*Noumena*) is shipped and remains reachable on its own two
half-triggers; nothing in this wave fires it, needs it, or refers to it. M13's
fold is the mechanism §16 tests. M17 is E3's.

---

# PART ONE — THE ROOM THEY PUT HIM IN

## 3. The Staging Area — `act4_staging_area` — three `ProseRule`s

Off the Lobby, **west**, through the shipped `CONTRACTORS — STAGING` doors
(`act3_staging_door`). See §37.4 on the direction: the shipped Lobby text puts
these doors *on the left* of a room entered from the south, and the shipped
exit comment says west; the Stage E plan §2 E1 says `e`. I have written the
room as **west of the Lobby, east back to it**, and flagged it.

`area: 'act4'`. The exit exists only when `{ flag: act4_staging_open }`; before
that the doors are the shipped scenery object with §17's blocked text.

### 3.1 Rule 1 — first sight — `when: { not: { visited: act4_staging_area } }`

```text
A long room off the lobby with one window in it, lit by the same downlights as
the lobby and colder than the lobby by enough to notice.

The folding tables are not stacked against the wall any more. They are down the
middle of the room, end to end, under a roll of white paper off a dispenser,
which is what a building does with an hour's notice and no linen. There are
chairs down both sides of them and nobody in any of them but one, and over the
back of that one there is a coat.

At the far end, the county's whiteboard, with the grid still ruled on it in
permanent marker and, this week, something written in the grid.

On a card table by the door, an urn, with a lead running from it along the
skirting to a socket somebody had to go and find.

There is a man at the door you came in by and a man at the door you did not,
and neither has looked at you since, and both know exactly where you are.
```

### 3.2 Rule 2 — `when: { not: { flag: act4_luke_gone } }`

```text
Trestles under white paper, chairs down both sides, a whiteboard at the far
end with somebody else's handwriting in the county's grid, and an urn on a card
table with a lead running to the skirting.

He is in the chair with the coat over the back of it. The two men are where the
two doors are.
```

### 3.3 Rule 3 — `when: { flag: act4_luke_gone }`

```text
The paper has been rolled off the trestles and put in a bin that was not in
here before. The chairs are back along the wall in a row. The tables are folded
and stacked where they were the first time you looked at them through wired
glass.

The urn is still on the card table with its lead still along the skirting.
There is about an inch left in it and it is cold.

Nobody has touched the whiteboard.
```

> **Note — the count that is not one.** *A man at the door you came in by, and
> a man at the door you did not* is positional and produces no total; a drafted
> *two men in a room with two doors* was cut (§33). Nothing anywhere in this
> room says how many cars are in the lot, how many letters are in the folder,
> or how many rows are on the board.
>
> The urn is Pearl's and the wave never says so in narrator voice. §7 does the
> work, §4.1 does the other half of it, and no line joins them.

### 3.4 Room-level senses

`SMELL`:
```text
Coffee that has been standing, marker pen, and the particular smell of a room
that has had its carpet shampooed inside the last day.
```

`LISTEN`:
```text
The downlights. The urn, ticking as it cools and then deciding not to. A radio
being listened to by somebody wearing an earpiece, which sounds like nothing at
all until you know what you are listening for.
```

---

## 4. The whiteboard — `act4_staging_whiteboard`

`portable: false`. Nouns: whiteboard, board, grid, schedule, marker, pen,
timetable. Adjectives: white, county.

### 4.1 `EXAMINE` / `READ`

```text
The county's grid is still on it, ruled in permanent marker by somebody with a
straightedge, and this week there is a dry-wipe hand in it that is not the
county's: enormous, upright, all capitals, made to be read from the back of a
room by a person walking.

    LOT / ARRIVE          PRINCIPAL
    PLANT FLOOR           PRINCIPAL, ESCORT
    STAGING — HOLD        PRINCIPAL
    MAIN ST — SPRAY       ------------
    LOT / DEPART          PRINCIPAL

The left-hand column is where the times go. They have been wiped and put back
so often that the column is grey the whole way down, and what is in it now
cannot be read from here and cannot be read from a foot away either.

The fourth row has a line through it, drawn with the straightedge, which means
somebody had the straightedge in his hand at the time.

Nothing on the board says who PRINCIPAL is, and nothing on it says the name of
the building.
```

### 4.2 `RUB` / `ERASE` / `WIPE BOARD` / `WRITE ON BOARD` / `TAKE MARKER`

```text
There is a man at each end of this room being paid to notice exactly this, and
you are going to be in here for a while yet.

You put your hands where they were.
```

> **Note.** The struck-through fourth row is §7's other half and **no response
> in the game connects them.** The player who has heard Pearl on the subject of
> four minutes and pie either makes the connection or does not; Pearl is never
> told by the narrator, and §18 is what she says if the player tells her.
>
> *PRINCIPAL* is canon 118's word, printed here on the document canon 118 is
> about. Whitlock's shipped complaint (*It says PRINCIPAL all the way through*)
> is **not quoted, echoed or referred to** — this is simply the document she
> was complaining about, and the player recognises it or does not.

---

## 5. The conference table — `act4_conference_table`

`portable: false`. Nouns: table, tables, trestle, trestles, paper, roll,
pens, basket, jug, glasses, water.

### 5.1 `EXAMINE`

```text
Trestles under a roll of white paper, and the paper has been pulled off the
dispenser a little short, so the last table is bare at the end and somebody has
put the pens there to cover it.

A wire basket of pens with a contractor's name down the barrel. A jug of water
with the condensation gone off it. Glasses, upside down, on a folded napkin
because there was no tray.

At the top of it, a folder, squared to the edge by somebody who squares things.
```

### 5.2 `SIT` / `SIT AT TABLE`

```text
There is a chair on your side. It is not the chair anybody expects you to take
and you take it anyway, and neither of the men at the doors does anything at
all about it, which you find you would have preferred them to.
```

---

## 6. Luke's folder — `act4_lukes_folder`

`portable: false`, container, open. Nouns: folder, file, wallet, papers.
Adjectives: his, brown, squared. Holds `act4_jack_letters`.

### 6.1 `EXAMINE`

```text
Brown card, worn soft at the corners, with a rubber band round it gone flat
where it sits. It is not a government folder; it is the sort of folder a man
buys in a shop.

Nothing is written on the front. The back has been written on and rubbed out.

It is open, and what is in it is letters.
```

### 6.2 `TAKE FOLDER` / `TAKE LETTERS`

```text
The man at the far door does not move and does not need to. You put it back
down and square it to the edge of the table, because that is how you found it,
and because it is his.
```

---

## 7. The letters — `act4_jack_letters` — **R15**

`portable: false`, in `act4_lukes_folder`. Nouns: letters, letter, mail,
correspondence, notes. Adjectives: cheerful, jack's.

### 7.1 `READ LETTERS` — grants `act4_clue_letters_from_jack`

```text
They are in the folder in the order they came, oldest at the bottom, each one
still in its envelope with the envelope tucked in behind it.

    Hi Luke —

    Everything's fine here. Busy, the good kind of busy. Shop's steady, the
    weather's been kind, and I've nothing to complain about that anybody
    would want to hear.

    Don't worry about us. Come out when you can and don't make a thing of
    it.

    Jack

The next one is that letter with the weather changed. The one under it is that
letter with the weather changed.

Square capitals, pressed hard, the L's finished with a separate stroke.

Every one of them is cheerful. Not one of them asks him for anything, and the
last one in the folder came inside the last five weeks.
```

### 7.2 `EXAMINE LETTERS`

```text
No crossings-out. Not one, anywhere in the folder, from a man writing at a
kitchen table with a pen he did not choose.

They are also all the same length. Every one of them goes down the sheet to
about the same place and stops there, the way a form stops.

Held up to the window, the pressure is even the whole way through, with nowhere
on the sheet where the pen stopped while somebody thought.
```

> **Note — R15, and the line I have not written.** The player has read
> `act2_reply_rewritten`'s examine text (*The hand is the hand… It is also
> fast. A hand like that is slow to make*) and Jack's shipped hand
> (*square capitals, pressed hard, the L's finished with a separate stroke*,
> `act2_returned_letter`). **This response does not repeat either of them and
> does not use the word *fast*.** It gives new evidence of the same fact — no
> crossings-out, one length, even pressure — and stops. Jack's shipped *"He
> writes back every time, nice as you like"* is **not quoted by anybody**
> (recontextualization list row 10) and Luke's own version of it (§11.1) is
> worded so that it is not the same sentence.
>
> *the last one in the folder came in the last five weeks* is the only clause
> in the response that hurts, and it is a fact about a date nobody prints.

---

## 8. The window — `act4_staging_window`

`portable: false`. Nouns: window, glass, lot, cars, motorcade, blind.

### 8.1 `EXAMINE` / `LOOK THROUGH WINDOW`

```text
The lot has been swept, and the weeds along the base of the fence have been
sprayed and have not had time to go brown.

The cars are nose out with a man standing between each pair of them, and none
of the men is looking at the same thing as any of the others, which is the
whole of the trick and takes years.

Past the cars, the gatehouse. Past the gatehouse, the county road, where
somebody has been out with a machine and put a fresh white edge line down the
side of it as far as you can see from this window.

At the far end of what you can see from this window, the edge line stops.
```

### 8.2 `OPEN WINDOW`

```text
Sealed unit, no opening light, and a bead of mastic all the way round it that
has gone hard and yellow and is original.

There are people in this room who would notice the first minute of any serious
attempt on it.
```

---

## 9. The detail — `act4_detail`

`portable: false`, scenery. Present in `act4_staging_area` and — as the
antecedent of §17's blocked text — in `act3_lobby` on and after
`act4_visit_day`. Nouns: detail, agent, agents, man, men, guard, guards,
security, protection, earpiece. Adjectives: protection, secret.

### 9.1 `EXAMINE`

```text
Two of them, and there is nothing to say about how they look, because that has
been worked at.

Suits that fit. Shoes that will not squeak on terrazzo. An earpiece each, and a
lapel pin that is not a flag and is not anything else either.

Neither has a hand in a pocket. Neither is leaning on anything. They have
arranged it so that the room has two doors and each door has a man in front of
it looking at the other man's door.
```

### 9.2 `SHOW <anything> TO DETAIL` / `SHOW BADGE TO DETAIL` — grants `act4_clue_detail_refuses`

```text
He takes it. That is the part you had not prepared for: he takes it, reads all
of it, turns it over and reads the back, with the flat attention of a man
trained to find the one wrong thing who has not yet had a week where he did not.

Then he hands it back.

"Thank you, sir," he says, and puts himself where he was standing, which is
between you and the door.

Everything in your pockets belonged to somebody else first, and none of it has
a name on it that is yours, because there is not one for it to have.
```

### 9.3 `TALK TO DETAIL` / `ASK DETAIL ABOUT ANYTHING`

```text
"Sir."

That is the whole of it and will be every time. He is not being rude; he has
been given one word for this and told to use it until you go away.
```

### 9.4 `ATTACK DETAIL` / `PUSH PAST` / `RUN`

```text
No.

You have been hit on the head once this month by somebody better at it than you
are, and these two do it professionally, in pairs, and would be extremely sorry
about it afterwards, in writing.
```

> **Note.** The detail are the only people in the game who take the borrowed
> badge seriously enough to read it. That is what makes §9.2 the wave's second
> worst moment: everybody else in the county has waved the player through on
> the strength of a hat and a manner, and these two look properly, and hand it
> back, and it is fine, and it does not work.

---

## 10. The coffee urn — `act4_coffee_urn`

`portable: false`. Nouns: urn, coffee, boiler, pot, lead, cable.

### 10.1 `EXAMINE`

```text
A stainless catering urn on a card table, with a lead running along the
skirting and a plastic cup upside down over the tap so that it does not drip on
the floor.

It is not the building's; the building has a machine through a door. This one
has a dent in the side the size of a hip, a piece of tape round one handle, and
the last of somebody's writing on the tape in laundry marker, gone to about two
letters.
```

### 10.2 `TAKE COFFEE` / `DRINK` / `POUR`

```text
It is good coffee, and it is too strong, and it has been standing for a while
in a way that has not improved it and has not spoiled it either.

You have had this before. You have had this a great many mornings, at a counter
thirty-two miles from here, from a woman who does not stop pouring until you
put your hand over the cup.
```

> **Note — canon 46 and the second reading.** §10.2 is the only place in the
> wave that says where the urn came from, and it says it as a taste, not as a
> fact. §4.1's struck-through row is the other half. The narrator never puts
> them together, Pearl is never told, and if the player tells her, §18 is what
> she says.

---

# PART TWO — THE MAN

## 11. Luke — `act4_luke`

`name: 'Luke'`, `pronoun: 'he'`. Nouns: luke, president, man, visitor. **Not**
`brother` (Jack's shipped noun) and **not** `him`/`he` (the parser's own
pronoun machinery). Schedule per the plan: the Staging Area from
`act4_visit_day` until `act4_luke_gone`, `'offstage'` otherwise.

### 11.0a `description`

```text
Wide face, heavy jaw, grey coming in at one temple, and about twenty years of
photographs between you and any of it.

Grey suit, no tie, one button of the collar open, and the coat over the back of
the chair rather than on him, because he has been in this room a while and
expects to be a while longer.

He sits square to the table with a cup in front of him he has not drunk out of
and both hands where they can be seen, which is habit rather than courtesy.
```

### 11.0b `greeting` — two rules

Rule 1 — `when: { not: { met: act4_luke } }`:

```text
He is on his feet before you are through the door, which is either manners or
twenty years of being got at, and he puts his hand out.

"You'll be the one who folds paper," he says.
```

Rule 2 — unconditional:

```text
He is where he was, coat still over the chair, cup still not drunk out of, and
he stops what he is doing entirely, which nobody else in this county does.
```

### 11.0c `unknownTopic` — three, in rotation

```text
"I don't know." He says it flatly and without decorating it, which is
apparently what a man can do in a room with no press in it.
```
```text
He answers a question standing next to the one you asked. It is a good answer
and it is not to your question, and he knows both of those things.
```
```text
"That is outside my competence." Then, because that was not quite honest:
"Outside my knowledge. Competence would be a claim."
```

### 11.1 `topic_letters` — `ASK LUKE ABOUT LETTERS` / `ABOUT JACK'S LETTERS` / `ABOUT WRITING` / `ABOUT POST` — **R15**

```text
"I kept them." He does not touch the folder. "I have kept everything my family
has sent me for twenty years. You start because you are sentimental and you go
on because somebody in an office tells you that you have to."

"I answered every one. Inside the week, in my own hand, because he would have
known." A pause he does not fill. "And I could not tell you tonight what I said
back to him. Not one line of it."

He puts one finger on the folder and does not open it.

"He is the only one of us who was ever any good at complaining. There is not a
complaint in there, and I have not had anybody to say that to who would not
have written it down."
```

### 11.2 `topic_noumena` — `ASK LUKE ABOUT NOUMENA` / `ABOUT THE WORD` / `ABOUT WORDS` / `ABOUT THE LETTER` — sets `act4_luke_said_word`, grants `act4_clue_lukes_word`

```text
"My father used to say it back to me with the vowels in the wrong places." He
says this without any particular fondness and without any particular anything
else. "Four of them at that table and not one ever asked me what it meant. They
waited for Sunday, to see whether I would do it again."

"The thing as it is." He stops there, which is where he has always stopped.
"Ask Eli. Eli will give you forty minutes and a diagram."

Then he looks at you a second longer than the question needed.

"You spelled it right," he says.
```

> **Note — guide §8 and §17.** The word is used, the family joke is told once,
> and it is **not defined**. The four words *The thing as it is* are the whole
> of the philosophy the architecture wanted smuggled in (L14) and they are cut
> off by his own habit rather than by the narrator. Nothing after them explains
> anything, and *You spelled it right* is the only acknowledgement P22 ever
> gets from him.

### 11.3 `topic_jack` — `ASK LUKE ABOUT JACK` / `ABOUT HIS BROTHER` / `ABOUT FAMILY`

```text
"Jack." Something happens to his face that is not a smile and is next door to
one. "The only one of us who stayed where he was put, and the only one of us
anybody here would recognise, and he has never once been in a photograph with
me."

"He fixes things. He has been fixing things since he was eleven. He did my
first car twice and charged me for the second one, and he was right to."

The finger goes back on the folder.

"Is he well?"
```

### 11.4 `topic_jules` — `ASK LUKE ABOUT JULES` / `ABOUT THE MISSING ONE` / `ABOUT I` / `ABOUT THE TATTOOS` — grants `act4_clue_lukes_reason` — **canon 110**

```text
"I don't know that name." He says it without hedging, which is the thing about
him: he will tell you he does not know something and not put anything on the
front of it.

Then, because you have not moved:

"There is a lacuna where you are pointing and I am not going to pretend there
is not. I have been at it since a folded piece of paper was put in front of me
this morning, and I have a very good memory."

He turns the cup a quarter turn.

"If you are asking about the numbers: there is no I and there was never an I.
Our father was I. He paid for them, he sat in the chair first, and he put
himself at the head of the row because he was the head of the row." A short
breath through the nose that is nearly amusement. "Eli tells it differently. Eli
is wrong, and will be wrong about it at my funeral."
```

> **Note — canon 110, canon 12, and no arm.** Luke's slot is *Dad was I*, said
> lightly, with no mention of birth order, and it contradicts Eli's shipped
> reason (canon 113: the parlour would not put a single upright on skin)
> flatly. **He does not show his own tattoo** — see §12.4's note. *lacuna* is
> the second of his three words and is not defined by him or by anybody.

### 11.5 `topic_facility` — `ASK LUKE ABOUT PLANT` / `ABOUT FACILITY` / `ABOUT BUILDING` / `ABOUT DAD` / `ABOUT HEARINGS`

```text
"I know the provenance of this building considerably better than I know the
building." He turns the cup back. "Commissioned the year I finished law school,
out of a bill my father spent two winters on, and there is a plaque in that
lobby with his name on it and a title in front of it that he enjoyed more than
he ever admitted."

"I have been in that lobby three times in twenty years. Ribbon, ribbon, and a
photograph with a man from the county."

He goes and finds the end of the sentence, which he has not had to do yet.

"I have never been anywhere else in it, and nobody has ever offered."
```

### 11.6 `topic_door` / `topic_sublevel` — `ASK LUKE ABOUT DOOR` / `TELL LUKE ABOUT SUBLEVEL` / `ABOUT SIX` / `ABOUT THE ARCHIVE` — two rules

Rule 1 — `when: { clue: act3_clue_s6_door_refuses }` — sets `act4_luke_will_escort`:

```text
You tell him there is a door in this building that has refused everything you
have been able to put in front of it, and that it is five floors under the lobby he
has been photographed in three times.

He listens the whole way through without helping you along, which is what twenty
years of it does to a man.

Then the cup goes down and he reaches back for the coat.

"Take me to it," he says, and is on his feet before he has finished saying it,
which is the fastest anybody in this county has agreed to anything all week.
```

Rule 2 — unconditional:

```text
"There is a door." He is not humouring you; he is waiting for the rest of it,
and there is not any rest of it yet.

"Bring me a door," he says.
```

### 11.7 `topic_sissy` — `ASK LUKE ABOUT SISSY` / `ABOUT MARS` / `ABOUT THE STATION`

```text
"Sissy writes to everybody. It is the one thing the distance has not touched."
A pause that is not for effect. "She has been filing something for about a
year that I get told has been handled. I asked once what it was. It had been
handled."

"I have signed for that programme four times and I could not tell you tonight
what my sister is looking at."
```

### 11.8 `topic_detail` — `ASK LUKE ABOUT DETAIL` / `ABOUT SECURITY` / `ABOUT SCHEDULE` / `ABOUT THE VISIT`

```text
"They are very good," he says, and means it, "and they are not mine."

"There was a stop on my sheet this morning. A counter on a main street, four
minutes, a photograph of me holding a cup and saying something about pie." He
puts a hand flat on the paper tablecloth. "It came off between the airport
and here. Nobody has told me why, and I have stopped asking, because the answer
is always that it was for my safety and it is always said kindly."

He looks at the urn on the card table and then does not look at it again.
```

> **Note — R16, two scenes early, in a mundane register.** A man who cannot
> keep four minutes on his own schedule is not going to be the answer to a
> door, and the response never says so. **He looks at the urn and does not look
> at it again** is the only line in the game that puts the urn and the struck
> row in the same paragraph, and it does not say what he worked out, or when,
> or whether he did.

---

## 12. Luke's `showResponses` — four

### 12.1 `SHOW NOTEBOOK TO LUKE` — `act2_notebook`

```text
He takes it and does what a lawyer does with a document nobody has given him
time to read: he opens it at the back first.

He looks at the inside of the back cover for a while.

"Whose is this?"

You tell him. He gives it back, and then asks you a question about the paper.
```

### 12.2 `SHOW RETURNED LETTER TO LUKE` — `act2_returned_letter`

```text
He takes it and turns it over and reads the front, and does not put it down.

"That is his hand. That is his stamp, and that is how he does an L."

Then nothing for a while. He is reading the red printing, and specifically the
second line of it, which says there is no such addressee.

"It's sealed," he says.

He puts it down on the white paper between you, squared, and does not ask you
for it and does not ask you to open it.
```

### 12.3 `SHOW POLAROIDS TO LUKE` — `act1_intact_polaroids`

```text
"That's the porch." He holds it at the distance a man his age holds a
photograph. "The old place. That is my father's chair and my father in it, and
I could tell you what the argument was about and I am not going to."

He gives it back without turning to the other one.
```

### 12.4 `SHOW FEDORA TO LUKE` — `act1_fedora`

```text
"It's a hat," he says, in the voice of a man being shown a hat.
```

> **Note — two constraints, held.** D1 §23: **nobody except the player and Dot
> ever recognises the hat**, in any act, and Luke is emphatically nobody. And
> canon 33: **Luke's own tattoo is never shown.** He is in a suit, in a room
> with a protection detail in it, and a man like that does not turn a cuff back
> to settle a point about his father; he says it instead (§11.4). This also
> means the only arm turned over on screen in the whole game is Jack's, in
> Act I, on a table in a motel — which is the arm §25 needs the player to be
> remembering, and which §25 does not mention.

### 12.5 Luke's `handlers`

`ATTACK`:
```text
There are two men in this room whose entire working life is arranged around the
ten seconds after you finish having that idea.
```

`FOLLOW`:
```text
"I'm not going anywhere," he says, "which is the first true thing I have said
in this building."
```

`HUG` / `KISS`:
```text
He converts it into a handshake without any suggestion that anything needed
converting.
```

---

# PART THREE — THE MESSAGE

## 13. `familyVerdict` — what the player is being taught, and by what

New pure export in `act2/censor.ts`, alongside `censorVerdict`, which is not
touched. `familyVerdict(message, folded)` returns `'rewritten'` if any
`CENSOR_FLAGGED` token is present; otherwise `'family'` if at least two of
three hold — **fold** (`folded === true`), **word** (any `CENSOR_FAMILY` entry
other than the five numerals, matched as a lowercased phrase on the message
string), **numeral** (the message's *last* token is one of `i ii iii iv v`) —
and `'plain'` otherwise.

**No response anywhere states the rule** (D2's standing constraint, carried).
It is taught by the consequence in §17 against the consequence in §19, and by
the hint ladder in §28 if the player asks.

---

## 14. `GIVE LETTER TO PEARL` — P22, social — `act4_hand_letter`

`when: { all: [{ flag: act4_visit_announced }, { has: act2_letter_out }, { at: act1_sundown_diner }] }`.
**One text, whatever the verdict** — she cannot read the fold and neither can
the narrator.

```text
Pearl reads the outside of it, which is you, and not the inside of it, which is
none of her business.

"The boy in the good coat's coming back for that urn himself," she says. "He'd
not send anybody."

She puts it in her apron pocket, flat, with her hand over it, and goes back
down the counter and starts wiping a stretch of it that is already clean.

"I have fed that family since before there was a plant out there. If this comes
back to me unopened, you'll hear it from me and from nobody else."
```

---

## 15. `GIVE LETTER TO WHITLOCK` — P22, social — `act4_hand_letter`

`when: { all: [{ flag: act4_whitlock_convinced }, { has: act2_letter_out }, { npcAt: [act1_whitlock, here] }] }`.
Same script, same verdict handling, different hand.

```text
She reads the outside of it, and then she reads you, which takes longer.

"I'm liaison," she says. "That means I stand in a lobby tomorrow next to a man
who won't give me his first name. It also means I walk in and out of that lobby
with a folder under my arm, and nobody has ever asked me what's in it."

The folder comes off the desk and the letter goes into it.

"I'm not carrying anything I'd have to lie about. Is there anything in there
I'd have to lie about?"

You tell her no.

"Right," she says, because she has never yet asked a man twice.
```

> **Note — canon 97 and canon 116, held exactly.** She does not ask what is in
> it; she asks whether it would make her a liar, which is a different question
> and the only one she has ever cared about. She still does not say *Jules* and
> she still does not say what she believes.

---

## 16. What the hand-off does

| Verdict | Effects | What the player sees |
|---|---|---|
| `'family'` | `act4_message_delivered = true`, `act4_message_verdict = 'family'`, letter → `nowhere`, `{ grantClue: act4_clue_message_through }` | §14 or §15, and then the door in §17 |
| `'plain'` | `act4_message_verdict = 'plain'`, letter → `nowhere`, `act4_office_reply_due = day + 1` | §14 or §15, and then §19 in box 141 |
| `'rewritten'` | as `'plain'`, with `act4_message_verdict = 'rewritten'` | identical |

> **Note.** **The two hand-off responses are byte-identical across all three
> verdicts.** That is the design: a woman with an apron and a sheriff with a
> folder cannot tell a family letter from a polite one, and neither can the
> narrator, and the game must not leak the rule at the counter. What differs is
> what comes back, and how long it takes, and whether a door opens.
>
> A `'rewritten'` letter — one with `jules` or `brother` or `sublevel` in it —
> gets the same form letter as a plain one, one day later, and **nothing
> anywhere says the message was read on the way**. The player who has done R5
> knows. The player who has not gets an office that is very polite.

---

## 17. The door opens — `act4_ev_staging_opens`

`once`, `when: { all: [{ flag: act4_message_delivered }, { onOrAfterDay: act4_visit_day }] }` → `act4_staging_open`.

`STAGING_DOOR_BLOCKED_TEXT` gains two rules above E0's, in this order.

### 17.1 Rule 1 — `when: { all: [{ onOrAfterDay: act4_visit_day }, { not: { flag: act4_staging_open } }] }`

```text
There is a man in front of the push bar now, with his hands loose in front of
him, and he is not a large man, and it does not signify.

"Sir."

That is all he says and all he is going to say. He has a short list in his head
and does not have to look at it, and you are not going to get on it by
explaining yourself to him.

Behind you, out in the lobby, the man who runs this plant is standing on the
wrong side of his own building with a folder under one arm and nowhere to put
it.
```

### 17.2 Rule 2 — `when: { flag: act4_staging_open }` — the door is now an exit; this is what the player gets on `OPEN DOORS` from the far side, and once, on the way in

```text
The man in front of the bar puts a finger to his ear, listens to somebody on
the other side of the wall, and takes his hands apart.

"Go ahead, sir."

He does not ask you anything, and that is the whole of what has changed.
```

> **Note — Nolan (§34 q4).** His shipped day post is the Lobby and the visit
> does not move him; the plan gives him no line and this wave gives him none.
> One clause in §17.1 puts him where the detail have put him — outside the room
> where his building is being talked about — and that is the whole of it.
> **He does not speak, is not asked, and is not remarked on again.** Reopening
> Nolan here would restart a device E0 §27 records as finished.

---

## 18. Pearl, told about the urn — `TELL PEARL ABOUT URN` / `ABOUT COFFEE` / `ABOUT SPRAY`

`when: { flag: act4_luke_met }`. No effect, no flag, no clue.

```text
"They sent a boy out for the urn," she says, before you are anywhere near the
end of it. "I know. He was very nice about it."

The cloth goes along the counter.

"You'll want the rhubarb," she says. "There's a lot of it."
```

> **Note — guide §5.** The narrator says nothing before this response and
> nothing after it, and no other response in the game refers to it. §36.2 holds
> the version in which she is sad, which is worse.

---

## 19. The office's reply — `act4_reply_office`

`portable: true`, delivered into `act1_po_boxes` by `act4_ev_office_reply`
(`once: false`, `when: { all: [{ flag: act4_message_verdict, equals: 'plain' }, { onOrAfterDay: act4_office_reply_due }] }`, and the same for `'rewritten'`).
Nouns: reply, letter, answer. Adjectives: office, form, white house. See
§37.2 on the five-way `reply` collision.

### 19.1 `READ REPLY`

```text
    Dear Sir or Madam:

        Thank you for writing. The President is grateful for the interest and
    support of citizens across the country and reads as much of his
    correspondence as the demands of the office allow. Your comments have
    been noted and forwarded to the appropriate office.

    With best wishes,

    Correspondence Unit

The whole of it is handwritten, which is not how an office of that size answers
anybody, and the hand is a good one.
```

### 19.2 `EXAMINE REPLY`

```text
Good paper. A printed heading. An even upright hand with the loops closed, and
a signature under the last line that is not a name and is not quite a mark
either.

There is one crease in it and it is the one it got in the box.
```

> **Note.** §19.2's last line is the tell for a player who folded his letter:
> what came back is not folded. It is one sentence, it is never explained, and
> the response ends on it. **Nothing here says the letter was read on the way**
> — canon 8's rule is never stated by anybody, in any act.

---

# PART FOUR — DOWN

## 20. The escort — `act4_luke_descends` — the lift and Sublevel 5

Fired from §11.6 rule 1's follow-up (`ASK LUKE ABOUT DOOR` again, or
`LUKE, FOLLOW ME`, or leaving the room with `act4_luke_will_escort`).
`advanceClock: 20`, `{ moveNpc: [act4_luke, act3_s5_reactor_interface] }`,
`goto` S5.

```text
The one who does the talking says a sentence with the word advance in it and
then a sentence with the word protocol in it, and neither is addressed to you.

He is answered in four words and a look at a watch. The two of them come as far
as the lift and no further, because there is only so much of this that a man can
be told.

The leaves come together.

Nobody says anything on the way down. He stands the way a man stands in a
freight lift, hands at his sides, and on the way past it he reads the legend
strip beside the buttons, the way you read anything in a lift.

There is nothing on it to read.

The little windows over the door go L, and then a long nothing, and then S5.
```

Arriving:

```text
He walks the length of the gallery once, slowly, hands behind his back, past a
hundred round faces he has no way of reading, and stops at the end wall.
```

> **Note — canon 104 begins at the leaves.** *Nobody says anything on the way
> down* is the sentence that turns the rule on, and it is a narrator statement
> of fact rather than a description of restraint. From here to §23 he has no
> line, and neither does anybody else. **The blank button is read and not
> pressed**: *he reads the legend strip… There is nothing on it to
> read* is the whole of the beat, and nothing before or after it points at the
> disc. *a hundred round faces* is a scale, not a count — the shipped room says
> *two ranks of them* and this document does not improve on it.

---

## 21. The door with two things — `act3_s6_door`, with Luke present

`OPEN DOOR` / `USE DOOR` / `PUSH DOOR` / `USE READER` at S5 with
`{ npcAt: [act4_luke, here] }` → sets `act4_s6_door_open` (permanent), grants
`act4_clue_two_thing_door`.

```text
The door at the end wall wants two things and has never had more than one of
them off you.

He takes the visitor's badge off his lapel — the paper one, printed for him
this morning by the plant, in a plastic sleeve, with his name spelled correctly
on it — and puts it on the reader.

The reader goes green. That is not the surprise. The surprise is the pad.

He types on it without looking at it. It is short, and whatever it is, it is
something he has known long enough that he does not have to go and find it.

The two-line display clears itself, and the leaf comes off its seal with the
soft heavy sound of a thing that is very well hung, and swings in about a foot
and stops.

Behind it there is a stair.
```

### 21.1 The stair, in E1 — `GO DOWN` / `ENTER STAIR` — in-world, **not** a boundary

```text
Poured steps going down out of the light, no handrail, and a cold coming up
them that the rest of this floor has not got.

You have been in this building at night and underneath it in a pipe, and you
know by now the difference between a place you are not ready for and a place you
have not got a reason for yet.

This is the second one.
```

> **Note — what is not printed.** **What he types is never shown.** The
> narrator sees the hand and the length and not the letters, which is what a
> man standing behind another man at a keypad actually sees, and it is the
> whole reason the beat can be played at all. E3's antechamber is the payoff of
> that omission and nothing in this wave points at it. *A pad with letters on
> it is fitted when somebody expects a name to be typed* is D4's shipped line
> and it is **not quoted here**.
>
> §21.1 is in-world text on the object, **not** `system.buildBoundary`. Canon
> 88's discipline: a build boundary is for the edge of the build, and this
> stair is inside it — E3 opens it with a reason, not with a version bump.

---

## 22. The reader at the bottom of the well — **R16**

`act4_luke_at_root`, at `act3_s6_archive_hub` with Luke present:
`USE READER` / `SHOW LUKE THE DOOR` / `ASK LUKE ABOUT ROOT` / entering the Hub
with him following. Grants `act4_clue_not_the_user`, answers
`act4_q_who_outranks_it`, and then §23.

```text
He follows you the length of Sublevel 6 without asking where you are going.
Past the rail of hooks. Past the rows of chairs, at which he looks the way
anybody looks the first time, and does not stop.

In the archive room he stands for a moment in front of a door frame with no
door in it, and then goes on to the far end, where the carpet stops at three
steps down into a well.

He goes down them.

He puts his hand flat on the reader beside the door. Then the badge. Then the
hand again.

Nothing. No diode. No beat while something somewhere agrees with something
else.

He does it once more, the way a man checks he did it right the first time, and
then stops, at the bottom of a tiled well under a building with his father's
name on a plaque in its lobby, in front of a small grey box that has never once
been switched on.

He is down there a while.

Then he comes back up the three steps and goes past you, and does not look at
you as he passes, and it is not rudeness. There is nothing on his face to give
anybody.
```

> **Note — the sentence I have not written.** *The world's most powerful man is
> not the user either* is the architecture's gloss and does not appear here or
> anywhere. What appears is a man doing a small thing twice and stopping, and
> the shipped fact from D5 that the reader has nothing in it. **The narrator
> does not say what the failure means, does not say what Luke understood, and
> does not compare this to any other refused door in the game.** The response
> ends on his face and the player supplies everything else.
>
> *stands for a moment in front of a door frame with no door in it* is the
> only glance at the lit gate frames in this wave and it is a stage direction.
> E2 owns the frames. Nothing here says which one he stopped at.

---

## 23. He goes up — `act4_luke_gone`

Immediately after §22, in the same script.

```text
He is already in the lift with his hand flat on the leaf, holding it, which is a
courtesy from a man who has not needed to open a door for himself in years.

Nobody says anything on the way up either.

In the lobby two men are waiting at the turnstile who have plainly had the worst
afternoon of their professional lives, and one of them takes his elbow, and he
lets him.

At the doors he looks back into the building, once, at the whole of it, the way
you look at a room you have decided you will not be in again.
```

Alternate arm — `when: { all: [{ onOrAfterDay: act4_visit_over_day }, { flag: act4_luke_met }, { not: { flag: act4_s6_door_open } }] }`, rendered the next time the player enters the Staging Area:

```text
The tables are folded and stacked against the wall. The chairs are in a row.
The urn is cold.

He was here for two days, and then the two days were over, which is what a
visit is.
```

---

# PART FIVE — THE BROTHER

## 24. Jack comes down — **R14**

### 24.1 `ASK JACK ABOUT CHAIRS` / `TELL JACK ABOUT NOLAN'S CHAIR` / `TELL JACK ABOUT SUBLEVEL` — `when: { flag: act4_started }` — sets `act4_jack_will_come`

```text
You tell him there is a room under that plant with chairs in it, in rows, and a
rail of hooks along the wall with names under them, and that one of the names is
Nolan's.

Jack does not ask you any of the four questions you have got answers ready for.

"Show me."

He is looking for his keys and they are in his hand.
```

### 24.2 The tunnel mouth — `when: { flag: act4_jack_will_come }` — `{ setFollowing: [act1_jack, true] }`

```text
He stops at the mouth of it with the lamp in his hand and looks at how the
concrete is finished on the inside, and at the rebate round the frame where a
door used to be shut.

"Somebody built this to be used," he says.

Then he goes in ahead of you, which he is not supposed to do and does anyway,
and forty feet in he stands aside and lets you past.

He does not say anything else.
```

> **Note — canon 104, one floor early.** The rule binds below Sublevel 5.
> **The brief binds Jack from here**, which is stronger and which I have
> written to: *Somebody built this to be used* is the last thing he says until
> §26, and the sentence after it says so plainly so that no editor puts one
> back. The chase, the ladder and the spotted events move the player and Jack
> follows; **none of them gets a Jack line.**

---

## 25. The Bay, under the lamp — `act4_ev_jack_sees`

`once`, `when: { all: [{ at: act3_s6_maintenance_bay }, { flag: act3_uv_lamp_on }, { npcAt: [act1_jack, here] }] }`. Sets `act4_jack_saw_mark`, grants
`act4_clue_jack_saw`, then `{ setFollowing: [act1_jack, false] }`,
`{ moveNpc: [act1_jack, 'offstage'] }`.

```text
He has been behind you since the ladder and has not made a sound on that tile,
which for a man his size is an effort you can hear him making.

Then he is not behind you. He is at your left, and he has your wrist.

He turns the arm over. He gets the lamp round on its joint with his other hand
and holds the inside of the forearm under the shade, close, the way you hold a
part up to a light to find the crack in it.

The skin goes flat white. The stroke does not.

It is a numeral. It has been a numeral since the first morning, and nobody has
said so out loud, and nobody says so now.

He does not let go of the wrist for a while.

When he does, he sits down. There is a chair behind him and he sits down in it
because his legs have gone, and he is in it about a second before he is out of
it again and standing well clear of it with both hands off it.

He reaches past you and turns the lamp off.

Then he goes and stands at the foot of the ladder with his back to the room
until you come.
```

> **Note — canon 33, and the test's two strings.** The words *his arm* and *his
> own* do not occur in this block. Jack's own tattoo is not mentioned,
> described, covered, rolled or compared; **the gesture is the comparison and
> the player makes it.** He turns the arm over — which is precisely what he did
> on a table in a motel in Act I, on being asked — and no line here says so.
>
> **The naming.** The plan permits the narrator to call the mark *a numeral*
> once, in this scene, and nothing more specific. That is the fifth paragraph.
> `I` is never printed, the stroke is not re-described (D5 §8.3 did that and
> canon 82 is spent), and no later response in the game returns to it.
>
> **The chair.** He sits in one of the harvest chairs and gets straight back
> out of it. Nothing explains why, nobody refers to it again, and it is the
> only time in the game a living person sits in one of them.

---

## 26. The next morning — `act4_ev_jack_returns`

`once`, `when: { all: [{ flag: act4_jack_saw_mark }, { clockPhase: 'morning' }] }` → `{ moveNpc: [act1_jack, 'schedule'] }`. The block below is his
greeting rule 1 while `{ flag: act4_jack_saw_mark }` holds and the player has
not yet spoken to him since.

```text
He is on his stool. There is a second plate down beside him, cooling, with
nobody sitting at it, and Pearl has not asked him about it.

"Sit down," he says.

That is the whole of it. He eats, and lets you eat, and does not ask you one
thing about last night, and twice he starts to say something and finds
something to do with his cup instead.

On the way out he holds the door, which he has never once done, and does not
make anything of it.
```

> **Note — canon 102, and the brief's constraint.** Not arms, not marks, not
> hats, not Jules. **No line says he has accepted anything, worked anything
> out, or been reconciled to anything** — he has had a night, and he is at a
> counter, and he holds a door. Guide §5 says the narrator steps aside for
> this; the narrator's only two contributions are *which he has never once
> done* and *and does not make anything of it*, and both of them are about a
> door.

---

## 27. Jack afterwards — two shorter variants

Prepended above the shipped topics, both `when: { flag: act4_jack_saw_mark }`.

### 27.1 `topic_nobody` rule 1

```text
"Nobody remembers him," he says, and then does not do the rest of it.

He has said the rest of it to everybody in this county for five weeks and he is
not going to say it to you.
```

### 27.2 `topic_tattoo` rule 1

```text
He puts both hands round his cup and leaves them there.

"I've told you what I know about that," he says. "I'm not going to improve on
it by saying it again."
```

> **Note.** Two, not four. The plan says his ordinary topics get shorter
> variants; these are the two that would otherwise be *wrong* after §25 — the
> one where he pleads for belief, and the one where he turns his arm over. The
> rest are left exactly as shipped, because a man does not change his whole
> conversation in a night and because rewriting nine topics to be sadder is the
> single most available bad idea in this wave.

---

# PART SIX — THE EDGE OF THE BUILD

## 28. P22's hint ladder — five rungs

Counted separately (the brief's own line).

```text
There is one man alive who outranks the last door in that building, and the
county has milled a road for him.
```
```text
Two men stand between you and the room they are keeping him in, and they are
the only people in this county who have ever looked properly at what you are
carrying.
```
```text
You cannot go through them and you cannot go round them. Something can, though.
Paper has been reaching this family all week, and you know which kind reaches
them and which kind reaches somebody else first.
```
```text
A letter that reads like everybody else's gets answered like everybody else's.
Think about what is in a letter from his family that is not in a letter from a
stranger: the way it is folded, a word only the five of them ever used,
and what goes at the bottom where a name would.
```
```text
Fold it the way you learned at the reader. Put one of the family's words in it.
Sign it with a numeral, last thing on the page. Then give it — do not post it,
the post office is where the other thing lives — to somebody nobody has ever
thought to search: the woman at the counter, or the sheriff, if you have given
her a reason.
```

---

## 29. The boundary — the E1 line

`SYSTEM_BOUNDARY_TEXT` gains a third arm above E0's, gated
`{ flag: act4_luke_met }`. E0's Act IV line still renders for a player who has
started Act IV and not yet met him; canon 88's shipped Act III line still
renders below both.

```text
END OF BUILD

The frames, and the door at the bottom of the well, are later versions. The
stair behind the door on Sublevel 5 is this one.
```

> **Note.** Names no act (canon 88 stays the only line that does). No *town*,
> no date, no stage name, no reference to the player's state of mind, and no
> reference to a person — E0's line ended on *the man who is coming*, which
> stops being true the day he goes. It is deleted with its gate in E3.

---

## 30. Setups planted (constitution §30)

| Setup | Where | Pays off |
|---|---|---|
| A stair behind a door on Sublevel 5, unlit, with a reason still missing | §21.1 | **E3.** Root leg (i); P25 |
| What he typed on the pad, seen and not read | §21 | **E3.** The antechamber console, and the word `RECOGNIZED` |
| A reader with nothing in it, tried twice by the only man who could have had it switched on | §22 | **E3.** `ACCESS LEVEL: ROOT`, and what the credentials in the back cover are for |
| *There is a lacuna where you are pointing* | §11.4 | **E2.** The silhouette in the Chamber, which is the same shape |
| Sissy filing something for a year that has been handled | §11.7 | **E2.** The Dome, the film, R17 |
| A letter in Jack's hand, sealed, put down squared on a table between two men | §12.2 | **E3.** The cache letter, and who it is written to |
| A folder of letters nobody asked for anything in | §7.1 | **E3.** What reconciliation leaves behind when it is finished |
| A chair sat in for one second by a living man | §25 | **Unassigned.** I recommend it stay unassigned |
| The urn, and the row with a line through it | §4.1, §10.2 | **Nothing, ever.** Two halves the game never joins |

## 31. Second readings (constitution §31)

| Object | First reading, and it holds | Second reading, later, unprompted |
|---|---|---|
| The letters' even pressure and single length (§7.2) | A man who writes the same sort of letter every time | **R5.** *A hand like that is slow to make*, and these were not made slowly |
| *That is how he does an L* (§12.2) | A brother knows a brother's writing | He is holding the real one and he has a folder of the other kind and he has not looked |
| *I could not tell you what I said back to him* (§11.1) | A busy man, twenty years of correspondence | Nobody can remember either end of that correspondence, and there is a reason that is not busyness |
| *There is a lacuna where you are pointing* (§11.4) | A gap in an ageing memory | **R10.** Everyone in that family has the same gap and none of them has the same story about it |
| *Our father was I* (§11.4) | The oldest explanation in the family | The third of three that disagree, and the only one told by a man who has never been asked to defend it |
| *He looks at the urn and then does not look at it again* (§11.8) | A man noticing the coffee | He has worked out that his own schedule is not his, and he does not say so, and neither does anybody |
| *He reads the legend strip… there is nothing on it to read* (§20) | Idle reading in a lift | **D4 §12.2.** There is more polish on the blank than on S5 |
| The reader doing nothing, twice (§22) | An uncommissioned reader in an unfinished sub-basement | The building has never had a user, and the one it is waiting for is not elected |
| *whatever it is, it is something he has known long enough* (§21) | A man remembers his own credentials | A name that opens a door on Sublevel 5 and a name that opens the one below it are not the same length |
| The chair he gets out of (§25) | A man's legs go and he sits down | Every chair in that room has been set to a person, and one of the hooks on the wall has had its label taken off |
| *He holds the door* (§26) | A small courtesy | The client has stopped hiring and started something else, and nothing in the game will ever say what |

## 32. What this wave re-scores (guide §12)

Nothing below is re-scored by a narrator line.

| Shipped, Act I–IV | What E1 makes it mean, without saying so |
|---|---|
| Jack: *"He writes back every time, nice as you like… never once answers the question I asked him"* | §7.1: the other end of the same correspondence, in a folder, in his own hand |
| Jack's returned envelope: *square capitals, pressed hard, the L's finished with a separate stroke* | §7.1: the letters in the folder are in that hand and were not written by that man |
| `act2_reply_rewritten`: *It is also fast* | §7.2: no crossings-out, one length, even pressure — the same fact, found again |
| Jack: *"Birth order. That's the whole of the joke. I'm four."* | §11.4: a second explanation for the missing one, from the man he told you to go and ask |
| Jack: *"Ask Luke why he's two. Go on. Ask him."* | §11.4: you did, and he answered, and it does not match Eli |
| E0's whiteboard, *a grid ruled on it… and nothing written in the grid* | §4.1: what a county's empty grid is for |
| Whitlock: *It says PRINCIPAL all the way through* | §4.1: the document itself, on a wall, saying it |
| Pearl: *four minutes… and I was not to put anything new on the menu* | §4.1's struck row and §10.2's taste |
| D4: *the only door you have seen in this building that wants two things* | §21: what the second thing is |
| D5: *it has never been switched on* | §22: and it is still not switched on for him |
| D5's rows of chairs, set to people | §25: a man sits in one for a second |
| M13, the boy folding paper asleep under a table | §16: the fold is one of the three things that got a letter read |

## 33. The anti-repetition register — extends E0 §27

All prior rows stand. These are E1's; deletions are marked **CUT**.

| Device | Already spent | This wave |
|---|---|---|
| **A narrator who does the arithmetic** | D5 §24.3 is the one permitted instance; E0 §15 and §20.1 both stop one operation short | **None.** §7.1 says *the last one in the folder came in the last five weeks* and does not subtract; §11.1 says he cannot remember what he wrote back and nobody says why |
| **Counting** | Canon 70's two counts both spent in D3; E0 flagged *six of them* | **None.** Four drafts rewritten: *two men in a room with two doors* (§3.1), *eleven of them in the folder* (§7.1), *three cars* (§8.1), and a count of the gauges he walks past (§20). §3.1 is positional, §20's *a hundred round faces* is the shipped room's own scale |
| **Handwriting as evidence** | D5 called E0 §15 the last comparison in the game and E0 §27 closed it | **Held closed.** §7.2 is not a comparison: it is one document examined on its own, and the document it re-reads is never put beside it. **No `COMPARE` verb reaches the letters** |
| **A blank somebody declined to fill in** | E0 took two and said no more until the record | **None.** The whiteboard's unreadable time column is not a blank; it is a column that has been written in too often, which is the opposite and is the point |
| **The narrator telling the player what he is like** | Once ever, D3's bell; E0 quarantined its own best sentence | **CUT.** §22 was drafted with a closing line and it is quarantined (§36.1) |
| **A man who finishes a job completely** | Closed at two in D1–D2 | **Held cut**, with one deliberate inversion: §8.1's edge line stops, and nothing admires or blames it |
| **A price, a date, a year, a clock time** | Refused in eleven rooms; E0 cut all three | **CUT.** §4.1's time column cannot be read. §14 says *the day after*, never a day. Nobody prints an hour, and the only figures anywhere in the wave are a foot, forty feet and an inch |
| **Stars / the sky** | CUT since wave 5 | **CUT, an eighth wave running.** §8.1 looks out of a window at a road |
| **The Custodian speaking** | Four words, once, inside M16; E0 made it standing | **None.** He is not in this wave in any state |
| **An old terminal** | Five stations; E0 added no new one | **None.** §21's two-line display prints nothing the player reads and §22's reader prints nothing at all |
| **A building with an opinion** | One in D5 | **None.** The reader in §22 has no opinion; that is the reveal |
| **Somebody being kind and being wrong** | Finished with Nolan in D5; E0 did not reopen it | **Not reopened.** §17.1 puts Nolan outside a door and gives him no line |
| **Two brothers, the same two words** | new | **Refused.** Jack gets *"Show me."* (§24.1). Luke was drafted with the same two words at §11.6 and got *"Take me to it"* instead. **They must not converge** |

---

## 34. Canon questions for the main session

1. **The name, and what the parser needs.** As written, the narrator never
   prints *Luke*: the only occurrence in any player-visible block is the
   salutation of a letter in Jack's hand (§7.1), which is the exact case canon
   118 leaves open. **But the NPC must still be `name: 'Luke'` with `luke` in
   its nouns**, or `ASK LUKE ABOUT LETTERS` does not parse and a disambiguation
   prompt has no word to offer. **Recommend confirming that a `name` field and
   a parser noun are not *saying* it**, which is how every other Act IV rule
   has treated ids and topic words. If the main session wants the name out of
   the engine as well, the NPC becomes `name: 'the President'` with `luke` kept
   as a hidden noun, and no prose changes.
2. **Luke's two extra words** (§11.4 *lacuna*, §11.5 *provenance*). Guide §8
   asks for a vocabulary source and this is his only wave. **Recommend as
   written** — one use each, neither defined, neither required to express an
   action, and the family joke about the habit is told once at §11.2 and never
   again.
3. **The diner stop, struck from the schedule** (§4.1, §10.2, §18). This is a
   new fact: the four minutes Pearl was promised in E0 are cancelled between
   the airport and the site, and the urn is sent for instead. **Recommend as
   written**; it makes the visit an object lesson in a county being rearranged
   for something that then does not happen, and it costs Pearl nothing she is
   shown losing. It does mean E0's Pearl was told a true thing that stopped
   being true, which is what advance schedules do. Register proposal §39.
4. **Nolan during the visit** (§17.1). His shipped day post is the Lobby and
   nothing moves him; he gets one clause of narrator description and no line.
   **Recommend as written.** The alternative reopens a device E0 §27 recorded
   as finished.
5. **Luke's badge and the pad** (§21). The plant prints the President a paper
   visitor badge; the reader takes it; he types something short on the pad
   without looking and **the narrator never shows what**. **Recommend as
   written** — it is the mechanism R16 needs, it is funny in the correct dry
   way, and the omission is E3's whole foundation. If the main session wants
   the door opened another way, everything downstream of it changes.
6. **The description reuse at §11.0a.** *Wide face, heavy jaw, grey coming in
   at one temple* are the shipped words for the man in the cache Polaroid.
   **Recommend as written**: it is a family resemblance, it is the strongest
   unnarrated moment available in Luke's description, and the narrator does not
   remark on it in either direction. If it reads as too much, the fix is one
   word — *greying at one temple*.
7. **Luke's *"Is he well?"*** (§11.3.) The President asks an investigator
   whether his brother is all right, and the game gives the player no way to
   answer. **Recommend as written**; the question is the response's last line
   and hangs. §38 lists the follow-ups a player will type at it.
8. **The exit direction** (§3, §37.4). The shipped Lobby text and the shipped
   exit comment both put the staging doors **west**; the Stage E plan §2 E1
   says `e`. I have written west. **Confirm** — it is a one-character fix in
   whichever direction the ruling goes, and it must be made before the fixture.
9. **Luke's `topic_door` rule 2** (§11.6). A player who has never reached the
   S6 door gets *"Bring me a door"* and no escort. **Confirm** that this is
   acceptable as the only walk-away in the wave; canon 11 holds because the
   shaft (P25 leg ii) is E3's other route and the visit does not expire.
10. **Whitlock's route to Luke** (§15) requires `act4_whitlock_convinced`,
    which is E0's cage flag. That makes the sheriff's hand-off unavailable to a
    player who solved P21 without her. **Recommend as written** — Pearl is the
    unconditional route and Whitlock is the reward for having already done the
    work.

## 35. Assumptions (`ASSUMPTION` — none of these is canon)

- **`ASSUMPTION`: the Staging Area is trestle tables under a roll of white
  paper, a card table with a borrowed urn on it, a wire basket of contractor's
  pens, and a jug of water.** Invented. The plan fixes the whiteboard, the
  table, the folder, the window, the detail and the coffee; the dressing is
  mine.
- **`ASSUMPTION`: the visit's schedule is written on the county's shipped grid
  in dry-wipe by an advance staffer, in capitals, with the time column wiped
  grey and one row struck through with a straightedge.** Invented, and
  constrained by canon 37/47 to carry no legible time and by canon 118 to carry
  no name.
- **`ASSUMPTION`: the detail is two men, one on each door, with earpieces and
  a lapel pin that is not a flag.** Invented. The plan says *two men who don't
  look at you*.
- **`ASSUMPTION`: the plant issues the President a paper visitor badge in a
  plastic sleeve.** Invented, and load-bearing: it is the reader's half of the
  two-thing door.
- **`ASSUMPTION`: the letters in the folder are what Luke *received* — Jack's
  outgoing correspondence as it arrived — and Luke's own replies are not in the
  game.** Invented from the plan's *cheerful letters "from Jack" that Jack
  never wrote*, and it is what makes §11.1's *I could not tell you what I said
  back* possible.
- **`ASSUMPTION`: Luke has been in the lobby three times in twenty years and
  nowhere else in the building.** Invented from the plan's *he has never been
  below the lobby*.
- **`ASSUMPTION`: Sissy has been filing anomaly reports for about a year and
  Luke is told they have been handled.** Invented from the plan's *the anomaly
  reports "handled"*. E2 owns everything else about it.
- **`ASSUMPTION`: the urn is Pearl's, has a dent and a piece of tape on one
  handle, and gets back to her off-screen.** Invented. The game never shows it
  returned and §18 does not say it was.
- **`ASSUMPTION`: Jack goes down the tunnel with a lamp of his own** (§24.2).
  Invented; he is a mechanic with a truck.
- **`ASSUMPTION`: the ids are `act2_notebook`, `act2_returned_letter`,
  `act1_intact_polaroids`, `act1_fedora`, `act2_letter_out`, `act1_po_boxes`,
  `act3_staging_door`, `act3_lobby`, `act3_s5_reactor_interface`,
  `act3_s6_door`, `act3_root_door`, `act3_s6_archive_hub`,
  `act3_s6_maintenance_bay`, `act3_uv_lamp_on`, `act3_clue_s6_door_refuses`,
  `act4_visit_day`, `act4_visit_over_day`, `act4_whitlock_convinced`,
  `act1_sundown_diner`.** D1–E0 name them; **builders grep the `ids.ts` files
  before wiring.**

## 36. Quarantined — **do not wire without sign-off**

### 36.1 The reader, with a sentence after it

**The problem.** §22 ends on his face. The line below is what the paragraph
wants, and it is R16 stated instead of delivered.

```text
It is the first door in his life that has not been rude to him.
```

> **Recommendation: do not wire it.** It is the best sentence in the wave and
> it is the architecture's gloss in a better coat. It tells the player what the
> scene was about, at the exact moment constitution §31 wants him working it
> out, and it makes the narrator cleverer than the man in the well. If Ryan
> wants it, it belongs to nobody in this act.

### 36.2 Pearl, sad

**The problem.** §18 has her cheerful and brisk and finished with it. The
version below gives her the beat the scene is obviously aiming at.

```text
"They sent a boy out for the urn," she says. "I know."

She does not say the rest of it. She goes and turns the pan out and comes
back, and she has taken the apron off and put it on again, which is a thing
she does about twice a year.
```

> **Recommendation: do not wire it.** Pearl has fed governors and a senator and
> was not impressed by any of them; making her hurt in front of the player
> spends a character whose whole function is that she never does. The rhubarb
> line is the same fact and it is hers.

---

## 37. Wiring summary for the builder

### 37.1 What supersedes what

| Shipped | Becomes |
|---|---|
| `act3/lobby.ts` exits | gains `{ dir: 'w', to: ACT4_STAGING_AREA, when: { flag: act4_staging_open } }` and `{ dir: 'e', to: ACT3_LOBBY }` on the new room. See §37.4 and §34 q8 on the direction |
| `STAGING_DOOR_BLOCKED_TEXT` (`act3/objects/lobby.ts`) | becomes a **four-rule** `ProseRule[]`: §17.2, then §17.1, then E0's announced variant, then the shipped text. E0's rule and the shipped text are **kept word for word** and are not counted in §40 |
| `act3_s6_door` (`act3/objects/s5ReactorInterface.ts`) | gains an `OPEN`/`PUSH`/`USE READER` handler gated `{ npcAt: [act4_luke, here] }` (§21) and a `GO DOWN`/`ENTER STAIR` handler (§21.1). See §37.3 on the door's after-state examine, which is deliberately not authored. **Every shipped refusal is kept underneath** and still answers before the flag |
| `act3_s5_reactor_interface` exits | gains `{ dir: 'd', ... }` **only in E3.** In E1 the stair is §21.1's handler text and **not an exit** — a builder who wires an exit here ships E3 early |
| `act3_root_door`'s reader (`act3/objects/s6ArchiveHub.ts`) | gains a branch gated `{ npcAt: [act4_luke, here] }` → §22. The shipped badge-on-the-reader text is untouched and still answers alone |
| `SYSTEM_BOUNDARY_TEXT` | becomes **three** arms: `act4_luke_met` (§29), `act4_started` (E0 §22), and canon 88's shipped Act III line. All three are deleted with the gate in E3 |
| `act2/censor.ts` | gains `familyVerdict`, a new pure export. **`censorVerdict` is not touched** and `CENSOR_FAMILY`/`CENSOR_FLAGGED` are read, not edited |
| `act1_pearl` | gains one `giveResponse` (§14) and one topic (§18, `when: { flag: act4_luke_met }`) |
| `act1_whitlock` | gains one `giveResponse` (§15). Her E0 topics are untouched |
| `act1_jack` | gains `act4_jack_topic_chairs` (§24.1, declared **above** `topic_s6`, which claims bare *six* and *sublevel*), and two prepended rules on `topic_nobody` and `topic_tattoo` (§27). His E0 topics are untouched |
| `act3_uv_lamp` | fires `act4_ev_jack_sees` — **no change to the lamp's own text.** §25's block is the event's, not the lamp's, and the shipped forearm response still renders on its own for a player without Jack |

### 37.2 Parser collisions — named, with the recommendation

| Word | Collides with | Recommendation |
|---|---|---|
| `letters` / `letter` | `act4_jack_letters` vs. `act2_letter_out` (the one you write) vs. `act2_returned_letter` vs. §19's office reply | **`LETTERS` (plural) is the folder's, in the Staging Area only.** Bare `LETTER` stays `act2_letter_out` everywhere. The office reply takes `adjectives: ['office', 'form', 'white house']` |
| `reply` | §19 vs. the three shipped replies and E0's fourth | **Five objects sharing the noun.** §19 takes `adjectives: ['office', 'form']` and a distinct `name` (`office reply`), the same fix v0.16.0 applied to the other four. A player holding all five gets a clarify, which is correct |
| `folder` | `act4_lukes_folder` vs. Jack's shipped folder at the motel vs. Whitlock's | **Different rooms, never in scope together.** Named so nobody "fixes" it. Whitlock's is not an object |
| `board` | `act4_staging_whiteboard` vs. `act1_notice_board` | **Different rooms.** The whiteboard takes `adjectives: ['white', 'county']`; the notice board keeps bare `BOARD` in Zone 1 |
| `table` | `act4_conference_table` vs. the Lobby's shipped `desk`/`counter` vs. the diner's | **Different rooms.** `TABLE`, `TABLES`, `TRESTLE` → §5 in the Staging Area only |
| `men` / `man` | `act4_detail` vs. §4's absent crews vs. every NPC | **`MEN` and `DETAIL` resolve to §9** in the Staging Area and in the Lobby on and after `act4_visit_day`. `MAN` alone should prefer an NPC in scope; the detail are not NPCs and must not become them |
| `luke` | new NPC vs. Jack's `topic_family` word *luke* | **NPC-scoped versus object-scoped; no collision.** `ASK JACK ABOUT LUKE` stays Jack's shipped topic. Named so it is not "corrected" |
| `president` | `act4_luke`'s noun vs. Jack's `topic_family` word vs. Whitlock's `ASK ABOUT PRESIDENT` | same; all three are scoped and all three must keep it |
| `door` / `doors` | §21's S6 door vs. `act3_staging_door` vs. the Lobby's `inner doors` | **Unchanged in every room but S5.** The S6 door's shipped nouns already win at S5; the new handlers hang on the same object |
| `urn` / `coffee` | `act4_coffee_urn` vs. `act3_lobby_coffee` (shipped, one room away) | **Different rooms.** The Lobby's shipped *you did not come here for coffee* still answers in the Lobby, and it is funnier now |
| `stair` / `steps` | §21.1 vs. the shipped S1↔S5 stair vs. the Hub's three steps into the well | **All different rooms.** `GO DOWN` at S5 with `act4_s6_door_open` must reach §21.1 and **not** the shipped `d` exit to the Pipe Chase — check the exit table before wiring the handler |
| `badge` | Luke's visitor badge (not an object) vs. `act2_nolan_badge` | **His badge is never an object.** It exists only inside §21's text; `TAKE BADGE`/`EXAMINE BADGE` must keep resolving to Nolan's |
| `chairs` | §24.1's topic word vs. `act3_chairs` (shipped, the Bay) | **NPC-scoped versus object-scoped; no collision.** Named because *chairs* is also the topic's best word and a builder will worry |

### 37.3 Things a builder will look for and not find

- **A `COMPARE` verb reaching the letters, Luke, or Jack.** None exists, none
  may be added, and canon 33 is the reason.
- **A Luke line below Sublevel 5, or a Jack line below ground.** There are
  none. The test the plan asks for should assert against the authored list in
  §11 and §24 — every quoted line Luke has is in §11, §12 and §23's lobby, and
  §23's lobby is above the lift.
- **`act4_luke`'s `tellTopics`.** Not authored separately. `TELL LUKE ABOUT X`
  should reach the same eight topics; §11.6 is written to answer both verbs.
- **A response for `GIVE LETTER TO PEARL` before the visit is announced.**
  Not authored. It should fall to the engine's ordinary give-refusal, and §38
  flags it.
- **A second `familyVerdict` message.** There is no limit on retries and no
  authored line acknowledging one. Each attempt costs a day and gets §19.
- **The S6 door's `EXAMINE` after it is open.** Not authored. The shipped text
  still reads correctly with the leaf standing open — *no handle on this side*
  is the only stale clause, and it is still true. **Either leave it or ask for
  one paragraph;** do not improvise it. (Same call E0's §31.3 made for the
  evidence cage, and the same remedy.)
- **What Luke types on the pad.** Deliberately absent (§34 q5). If a builder
  needs a string for the display, it prints nothing the player reads.
- **The whiteboard's times.** There are none, in any state, ever.
- **A memory.** None fires in E1. M12 is shipped and independent.
- **Order on the hand-off:** the response text, then the verdict effects, then
  — if the day has already come — `act4_ev_staging_opens` on the next tick, as
  its own output. **Nothing else fires on that turn.**
- **Order in the Bay:** §25 is one response, in one block, and the lamp's own
  shipped forearm text does **not** also render on that turn.

### 37.4 Exits and the map

**One new room, one exit pair.** `act4_staging_area` sits **west** of
`act3_lobby`; `e` and `out` come back. The exit is gated
`{ flag: act4_staging_open }` and the shipped scenery door supplies the blocked
text (§17) until it is not.

**Nothing else on the map changes.** The stair behind the S6 door is **not** an
exit in E1 (§37.1); the lift's blank button is not pressed and is not
pressable; the tunnel is unchanged; and the Staging Area remains reachable
after `act4_luke_gone`, because a room the player was allowed into once does
not stop existing when the person in it goes home.

## 38. Suggested extra responses the engine should support

In rough order of certainty.

1. **Answering *"Is he well?"*** (§11.3.) `TELL LUKE ABOUT JACK`,
   `YES`, `NO`, `TELL LUKE ABOUT THE CRANK`. **The most predictable unwritten
   action in the wave.** It must not become a confession scene and it must not
   be a joke.
2. **`TELL LUKE ABOUT JULES` after §11.4.** The player will push. He has
   nothing more and should say so in a way that is not the `unknownTopic`
   rotation.
3. `SHOW LETTERS TO LUKE`, `ASK LUKE ABOUT THE HAND`, `TELL LUKE ABOUT THE
   CENSOR`. **He must not be told the rule** — D2's standing constraint holds
   in his room too.
4. **`TELL JACK ABOUT LUKE` / `TELL JACK ABOUT THE LETTERS`.** A player who has
   read §7.1 will go straight back to the motel with it. Canon 102 and guide §5
   both bear on it; whatever it is, it is not a reunion.
5. `SEARCH FOLDER`, `LOOK BEHIND WHITEBOARD`, `TAKE PEN`, `TAKE CUP`,
   `DRINK FROM HIS CUP`.
6. **`FOLLOW LUKE` after §23.** He is gone; the answer should say so without
   ceremony.
7. `USE READER` at the root door **after** §22, alone. The shipped response
   still holds and now means something else; it should not change.
8. `GO DOWN` at S5 repeatedly after §21.1. The player will try it every visit
   until E3 gives him the reason.
9. `ASK PEARL ABOUT LUKE`, `ASK WHITLOCK ABOUT LUKE`. **Canon 118 says neither
   of them says the name.** They will both be asked.
10. `SHOW MARK TO JACK`, `SHOW ARM TO JACK`, `SHOW ARM TO ANYBODY` before §25.
    **Canon 33.** There must be a response and it must not be a comparison.
11. `WAKE JACK` / `TALK TO JACK` in the Bay after §25 and before morning — he
    is offstage and the player will look for him.
12. `TURN LAMP ON` again in the Bay with Jack gone.
13. `GIVE LETTER TO MARLOW` / `TO DOT` / `TO NOLAN` / `TO JACK`. Four wrong
    hands, and Jack's is the one that deserves a line.

## 39. Register proposals (`docs/spec/09`, column format; proposals only)

Numbered from **119** (E0's proposals were recorded as entries 113–118).

| # | Question | Proposed decision | Why | Forecloses |
|---|---|---|---|---|
| 119 | Where the name *Luke* may appear in Act IV (entry 118) | **Nowhere in narrator prose, in any wave. It is printed once in E1, at the top of a letter in Jack's hand, which is entry 118's own exception. The NPC's `name` field and parser nouns are not prose and are exempt** | Entry 118 held without an exemption, and the discipline turned out to cost nothing: a man everybody is arranging around and nobody is allowed to call anything is more frightening than one the narrator names | A narrator use of the name; a document that names a principal; a townsperson who says it |
| 120 | What happens to the four minutes at Pearl's counter | **The diner stop is struck from the schedule between the airport and the site; nobody tells Pearl why; the urn is sent for and stands in the staging area on a card table. The struck row and the urn are never joined by any line, and Pearl, if told, is brisk about it** | The county rearranged itself for something that then did not happen, which is the visit in one object; and it gives entry 117's road a companion | A motorcade that stops on Main Street; any scene of Pearl being disappointed |
| 121 | The second thing the two-thing door wants | **A name typed on the pad. The President's plant-issued paper visitor badge opens the reader; he types something short without looking; the narrator never shows what** | It is the only mechanism that opens the door without a line of dialogue below the lift (entry 104), and the omission is what E3's antechamber pays off | Any printing of what he typed; a door opened by rank rather than by a credential |
| 122 | Luke's vocabulary beyond *noumena* | **Two more, one use each, in his only wave: *lacuna* and *provenance*. Neither is defined by him or by anybody, and the family joke about the habit is told once and never explained** | Guide §8 asks for a source and this is the only chance to be one; guide §17 forbids the gloss | A fourth word; any character defining one; a running gag after Act IV |
| 123 | How R16 is delivered | **Two dead attempts at the reader and a look, wordless, with no narrator sentence after them. The architecture's gloss (*the world's most powerful man is not the user either*) is never printed, in any act** | The scene is a man doing a small thing twice and stopping; explaining it makes the narrator cleverer than the man in the well | Any line stating what the failure means; a Luke line at the root door |
| 124 | Jack's recognition, and what he does | **Wordless: he takes the wrist, turns the arm over under the lamp, names nothing, sits down in one of the chairs for a second and gets straight out of it, and turns the lamp off. The narrator names the mark *a numeral*, once, here, and never again** | Entry 104 and canon 33 both hold; the gesture is the comparison and the player makes it | Any Jack line below ground; any narrator comparison of two arms; a second naming of the mark |
| 125 | Jack's one line afterwards | **Upstairs, the next morning, at the counter: a second plate, *"Sit down,"* and a door held on the way out. Nothing about arms, marks, hats or Jules, and no line saying he has accepted anything** | Entry 102: he is never shown reconciled, and guide §5 forbids the rest | Any scene where Jack says what he now believes |

**Proposed canon promotions:** none.

## 40. Word count against budget

Player-visible words only: fenced `text` blocks, counted with a script, not
estimated. Authoring notes, tables, headings and wiring notes excluded. **Text
reused verbatim from shipped prose is not counted** — E0's staging-door variant
and the shipped two paragraphs beneath it (§17), and the shipped S6-door and
root-reader refusals that stay underneath the new branches (§37.1). The
quarantine (§36) is **not** counted. **Canon 46 governs the split:** everything
the player gets by looking at the room is furniture; everything reached by a
puzzle verb, a reveal-bearing script, an event or a boundary is machinery.

### 40.1 Against the brief's six lines

| Piece | Brief | Actual | |
|---|---|---|---|
| The Staging Area — three description rules, two senses, and the five furniture objects (§3–§8, §10) | **1,200** | **1,333** | +11% |
| Luke — description, greeting ×2, `unknownTopic` ×3, eight topics, four shows, four handlers (§11–§12) | **1,200** | **1,419** | +18% |
| The detail, the two hand-offs, the office reply, the door, and Pearl told (§9, §14, §15, §17, §18, §19) | **500** | **791** | +58% |
| The escort — the lift, S5, the two-thing door, the stair, the reader, the departure (§20–§23) | **350** | **735** | +110% |
| Jack — the trigger, the tunnel, the Bay, the morning line, two variants (§24–§27) | **400** | **521** | +30% |
| The boundary (§29) | **50** | **28** | −44% |
| **Against the brief's six lines** | **3,700** | **4,827** | **+30%** |

### 40.2 Machinery — priced separately (canon 46)

| Piece | Actual |
|---|---|
| Clue detail text, eight clues (§2) | **357** |
| Question text ×1, two answer texts (§2) | **128** |
| P22's `missedRecovery` and two solution notes (§2) | **120** |
| **Machinery total** | **605** |

### 40.3 The wave

| | Brief | Actual | |
|---|---|---|---|
| Shipping prose against the brief's six lines | **3,700** | **4,827** | +30% |
| Machinery, priced separately (canon 46) | — | **605** | |
| **WAVE TOTAL (shipping)** | **~3,900** | **5,432** | |
| P22's hint ladder, counted separately | **~250** | **213** | −15% |
| *(quarantined, not shipped)* | — | *(67)* | §36 |
| *(reused verbatim, not counted)* | — | — | §37.1 |

**This wave is over, and two of the six lines are where it is over.** The room
and Luke are within the tolerances the scope cut expects of a standard room and
a 1,200-word NPC (+11% and +18%); the boundary is under; Jack is +30% on 521
words, which is one long scene and four short ones. The two real overruns are
the fourth line and the fifth, and they are the same overrun twice.

**The fourth line is 791 against 500, and 587 of it is puzzle machinery.** The
brief priced *the detail, the hand-off, the office reply, the door* as one item;
the wave delivers **eleven authored responses** — four for the detail, two
hand-offs that must be byte-identical across three verdicts (§16), two states of
the Lobby door, two states of the office reply, and Pearl at §18, which the
brief did not price at all because it did not exist when the brief was written.
Under canon 46 every one of those except §9.1 is machinery rather than
furniture. **If the main session wants the 500, the honest cut is §9.3 and §9.4
(71 words) and §18 (44),** and the wave then owes a player two responses it will
be asked for and loses the best forty-four words Pearl has in Act IV. I do not
recommend it.

**The fifth line is 735 against 350, and the brief priced four beats where the
scene has six.** *The lift, S5, the two-thing door, the reader* is four; what
R16 actually needs is the detail being overruled and left behind, the descent
under canon 104 with the blank button read and not pressed, the gallery, the
badge and the pad, an in-world refusal on the stair that has to hold until E3
opens it, the walk to the Hub, the reader twice, and a departure — because a
man who has been given a thing this large cannot simply stop being in the room.
§23 alone is 143 words the brief never priced. **There is no cut here I would
make.** R16 is one of the seven moments guide §5 names, it is delivered entirely
without dialogue because canon 104 says so, and every word of it is doing the
work three lines of Luke speaking would otherwise do.

**The cheapest 294 words in the wave, if the main session wants budget:** §3.4's
two senses (61), §4.2 (35), §5.2 (45), §6.2 (40), §8.2 (42), §9.3 (34), §9.4
(37). **Every one of them is a response to a reasonable action** — wipe the
board, take the folder, open the window, talk to the guard, sit down, smell the
room — and the project's own standard says a failure acknowledges the attempt
rather than refusing it. **I recommend keeping all seven and taking the
overrun.**

**For Ryan.** Three blocks are the ones to read first. **§25** is the whole
reason the wave exists: Jack takes a wrist, turns an arm over under a lamp,
says nothing, sits down in one of those chairs for a second, and turns the lamp
off — and the words *his arm* and *his own* do not occur in it. **§22** is R16
without a syllable of gloss: a man puts his hand on a reader, then a badge, then
his hand, then does it once more, and the narrator declines to say what that
meant. And **§7.2** is R15's evidence — *no crossings-out, all the same length,
the pressure even the whole way through* — which is the same fact the player
already read about a different letter in a different hand, in words this
document does not reuse.

