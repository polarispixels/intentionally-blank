# Stage F Wave F0 — The Replay Fragments and the Ledger's Answers

**Status:** reviewed by main session 2026-08-31 — approved for wiring as
written. Rulings on §16: q1 titles confirmed (*The Corner* / *Across A Desk* /
*Looking For A Rat* / *An Evening I Did Not Need*). q2 yes — M21 may fire in
Act I; a memory of moving furniture is Act-I-safe (guide §11 holds). q3 the
pooled answer ships; per-route recaps are foreclosed for 1.0 (no `ProseRule[]`
on `QuestionDef.answer`). q4 accepted — the film row may arrive already
closed; *a question the player answers in the act of asking it is the
library*. q5 M24's last sentence stands. q6 adopted as register 149. §7's
trigger refinements: none taken, as recommended. §15's wiring proposals
adopted in full, including the `act2_q_nolan_off_duty` repair (openWhen
`{ met: act2_nolan }`, answerWhen = P15's own solvedWhen) and
`act2_q_inside_the_plant`'s openWhen/answerWhen. All six §17 ASSUMPTIONS
accepted. Register entries **148–150** recorded in
`docs/spec/09-canon-decisions.md`.
**Author:** `narrative-writer` (Opus) · **Date:** 2026-09-21
**Covers:** Stage F wave F0 in full — **M21, M22, M23, M24**, the four replay
fragments reserved by architecture §5 and ruled on by register 148 (the seeded
stratum leaking); and **seven** knowledge-view answer strings for questions the
fiction settled and the ledger never closed: `act1_q_notebook`,
`act1_q_wall_drug`, `act2_q_what_notebook_says`, `act2_q_boot_usb`,
`act2_q_film_vs_database`, `act2_q_inside_the_plant`, and — the commission's
conditional seventh, which does **not** close properly — `act2_q_nolan_off_duty`.
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md`
(§2, §5, §9, §11, §12, §14, §17, §18, §19),
`docs/spec/01-design-constitution.md` §8, §9, §14, §18, §29, §30, §31,
`docs/spec/04-gameplay-and-puzzle-systems.md` **§14** (second-playthrough
knowledge — the section this whole wave exists to serve), §2–§3 (the two
strata),
`docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` **§5** (the
memory table and its strata tells; the M21–M24 reservation line), §7 (L1–L4,
L8, L11),
`docs/superpowers/specs/2026-09-21-stage-f-plan.md` **§F0**, **§F1**'s trigger
table,
`docs/spec/09-canon-decisions.md` entries **70**, **76**, **84**, **86**,
**87**, **89**, **91**, **93**, **94**, **95**, **99**, **103**, **106**,
**111**, **114**, **135**, **139**, **141**, **142**, **144**, **145**,
and the shipped text of `act1/objects/terminal.ts`, `act1/knowledge.ts`,
`act2/knowledge.ts`, `act2/objects/notebook.ts`, `act2/objects/censor.ts`,
`act2/dad.ts`, `act1/objects/countyLibrary.ts`, `act3/scripts.ts`,
`act3/objects/serviceTunnel.ts`, `act3/objects/perimeterRoad.ts`,
`act5/openingLogin.ts`, `act5/anteScripts.ts`.
**Wires into:** `world.memories.{act5_mem_m21, act5_mem_m22, act5_mem_m23,
act5_mem_m24}` (four new fragments, no capability flags, no profile arms, no
variants) and the `answer` field of seven existing `world.questions` entries.
**No new rooms, objects, clues, flags, verbs or puzzles.** Everything this
wave adds is text hung on state that already ships.

---

# PART ONE — M21–M24, the replay fragments

## 1. The ruling, and what it costs the prose

The plan's ruling (register 148) is that these four are **the seeded stratum
leaking**: the substrate knowing something the investigator never learned,
surfacing at the exact moment the player has just used the seed's own
knowledge. That ruling does two things to the writing, and they pull against
each other.

It sets the **voice**, easily: first person, the seeded tell, the same man who
wrote M5 and M7 and M9 — a facilities supervisor with a good eye, a dry
register, and the habit of noticing what he cannot yet do anything about. That
part is free.

What it costs is the **address**. Three of these four fire in situations a
first-run player can reach by guessing, and the plan is explicit that such a
player must not be told he did something wrong. So the fragments may never
look at the player. Not once. There is no *you have been here before*, no
*you knew that*, no second person aimed outward at all. Each one is a man
remembering a small ordinary afternoon, and the entire effect is carried by
**which afternoon, and when it arrives**. The fragment is the substrate saying
*yes, that* — and a fragment that said anything more than that would be the
game marking the player's homework.

The rule I wrote to, and checked every line against:

> The fragment never knows what the player just did. It only knows what the
> man did. The two land on the same beat, and nobody says so.

## 2. M21 — `act5_mem_m21`

**Fires:** the opening terminal's `ACCESS LEVEL: LOCAL` screen has printed
(`act5_opening_login_seen`) and Act II has not begun.
**Re-scores:** the screen's `ENVIRONMENT — MAIN ST / TOP FLOOR REAR`
(canon 144), and — harder — the shipped `EXAMINE` line that has been sitting in
that room since turn one: *It is the only thing in this room that has not been
knocked over, tipped out, or gone through.*

```text
The Corner

I got it up the stairs on my own with the flex round my wrist, which is how
you carry a thing you would rather nobody offered to help with.

It went in the corner because the corner is where the outlet was. Then I
squared it up to the wall. Then I stood back and squared it up again, with a
whole room still to do and no reason on earth to be spending the afternoon on
the angle of a desk.

There was nothing on it anybody would ever want. I did it properly anyway, and
then I turned the light off from the doorway and stood there a minute longer
than the job needed.
```

> **Note.** 117 words. The whole fragment is a man furnishing a room, which is
> the most mundane possible reading and the correct one for Act I (guide §11).
> The second reading is that this is the room, and the desk is that desk, and
> *a whole room still to do* is an inventory — which lands only for a player
> who has seen `INITIAL OBJECTS` on the creation record, i.e. never in Act I on
> a first run. **The lamp is deliberately last and deliberately off**: the game
> opens in darkness and the player's own first act is to pull that switch, so
> the man leaving it off is the only version consistent with turn one. I
> considered having him leave the terminal on — the burn-in ghost argues for
> it — and cut it: the shipped `EXAMINE` says the machine is off until the
> player turns it on, and a fragment that contradicts a shipped state to make a
> point is a fragment I would have to defend forever.
>
> **BUT.** The player has just made the room's oldest machine answer him,
> **BUT** what it answers with is a status page about the room itself — and the
> substrate's contribution is not an explanation, it is a memory of the
> afternoon somebody put that room together. Setup (§30): *a whole room still
> to do*, for `INITIAL OBJECTS` in Act V. Second reading (§31): *nothing on it
> anybody would ever want* — true of a dead terminal, and true of the only
> object in the county that has never been on a network.

## 3. M22 — `act5_mem_m22`

**Fires:** logged in at the Sublevel 6 Hub (`act3_hub_logged_in`) holding
neither credentials clue — the pair typed from nowhere.
**Re-scores:** `ACCESS LEVEL: MAINTENANCE`, and the shipped line under it —
*Upstairs that was the whole answer. Down here it is a heading.*

```text
Across A Desk

He read them out to me across a desk without looking up from what he was
doing, the way you give a man the combination for a gate he is going to use
twice and then never again.

I wrote them down afterwards, out in the corridor, standing up, because I did
not want him watching me decide they were worth writing down.

Nobody has changed them since. I used to put that down to somebody being lazy
about it.

A lock only gets changed when somebody tries it.
```

> **Note.** 89 words. This is the fragment that pays L2 — *"absurdly weak
> password" joke → the door was never locked, only far away* — without any
> narrator ever saying the second half. The shipped back-cover text already
> says he wrote them *the way you write down something you have just been
> handed and do not intend to be told twice*; this is the handing, from the
> inside, and the two are consistent without either quoting the other.
>
> The last line is the fragment's whole weight and it is four beats long on
> purpose. It is a maintenance man's observation about locks. It is also the
> only sentence in this wave that comes near a thesis, and it stays on the near
> side because it is about a lock.
>
> **THEREFORE.** The player has just been let into the archive on two words he
> was never given, **THEREFORE** the substrate supplies the only thing that
> makes that unremarkable: they were never a secret, they were a formality, and
> the building has never had cause to find out. Second reading (§31): *a gate
> he is going to use twice* — the man used it twice; so does the player, at the
> Hub and at root.

## 4. M23 — `act5_mem_m23`

**Fires:** the service tunnel's branch hatch is open (`act5_branch_unlocked`)
and Act IV has not started.
**Re-scores:** the hatch's own shipped `EXAMINE` close — *The rails run past
it. Everything down here runs past it.*

```text
Looking For A Rat

You walk a tunnel like that with your light on the rails, because the rails
are what you are down there for. I did it for years and the light never came
off them once.

The day it did, I was looking for a rat.

Low in the wall on the left, with a lip of concrete over it, and not on any
drawing that has ever come through my hands. I stood in front of it long
enough that my light started going orange.

Then I climbed back out and I did not put it in the book. That was the first
thing I ever left out of it.
```

> **Note.** 110 words. **No numeral** — canon 139 gives `4471` exactly two
> printings (the object's `EXAMINE` and the clue) and this is neither, and the
> lock is the only thing in the game permitted to do the comparing. The
> fragment therefore never mentions the stamp at all, which turned out to be
> the better fragment anyway: what the seed knows is not the number, it is
> *that the hatch is there and is on nothing*.
>
> *The first thing I ever left out of it* is the load-bearing line and it is
> doing three jobs: it dates the beginning of the man's secrecy; it re-scores
> the notebook's shipped fore-edge (*grey with handling for the first two
> thirds and clean for the last third, and the clean part is where a man
> stopped*); and it tells a player who has read the notebook that the notebook
> is not complete, which is true and which nothing else in the game says.
>
> **BUT.** The player has just opened, early, a hatch the plot does not need
> until Act V, **BUT** what comes back is not a route — it is the afternoon
> somebody else stood in front of the same hole and decided not to write it
> down. Setup (§30): the omission, paid whenever a player wonders why the
> notebook stops. Vocabulary (guide §7): none reached for; a man looking for a
> rat in a tunnel does not need a word anybody has to look up.

## 5. M24 — `act5_mem_m24`

**Fires:** accepted at the root console (`act5_root_accepted`) without ever
having learned who Jules was (no `act3_clue_jules_deprecated`).
**Re-scores:** R18 entire — the acceptance, the `ACCESS LEVEL: ROOT` block, and
the door across the room coming off its seal.

```text
An Evening I Did Not Need

I had a second thing to try, and a third after that, and I had put most of an
evening aside for being turned down politely by a machine.

It took about as long as signing for a parcel.

And then the door was open, and I did not go through it. I stood there with my
hand flat on the machine for a while, which is not a thing I do, and I could
not have told you what I was waiting for.

I have been frightened of a good many things in this building. Being let in
was never one of them, and it should have been.
```

> **Note.** 109 words, and the one of the four I would most like a second
> opinion on. It deliberately does **not** touch the `RECOGNIZED` beat: the
> shipped success text already owns that moment — *Upstairs the machine put one
> more word in front of that one … It is not in front of it now* — and a
> fragment paraphrasing it four lines later would spend the game's best
> single-word payoff twice in one screen. So the fragment starts after the
> screen and stays on the man.
>
> The last sentence is the leak. For a player who never opened the ledger and
> does not know what happened to anybody, it says: **somebody stood here, was
> let in, and it went badly** — without a name (canon 84's discipline extended:
> no *deprecated*, no *subject*, no cosmology, nothing about what this place
> is). It is a warning delivered by a man who cannot know he is delivering it,
> and it is aimed at nobody. That is the whole design.
>
> **THEREFORE.** The console has just accepted the player where every machine
> in the game has refused him, **THEREFORE** the substrate produces the only
> memory that is any use here, which is that the acceptance was never the
> difficult part. Guide §5 applies at full strength: no joke anywhere in these
> four lines. Second reading (§31): *a second thing to try, and a third* — the
> man came prepared to be refused, which is what the player has been trained by
> four acts to expect, and neither of them was.

## 6. What the four share, and the no-go audit

| | M21 | M22 | M23 | M24 |
|---|---|---|---|---|
| Words | 117 | 89 | 110 | 109 |
| First person | ✅ | ✅ | ✅ | ✅ |
| Re-scores its own scene | the room's furnishing | the pair's provenance | the hatch nothing looks at | the acceptance |
| Cosmology | none | none | none | none |
| A name | none | none | none | none |
| The word *subject* | never | never | never | never |
| A numeral or a date | none | none | none | none |
| Narrator counting (70/89) | n/a — no narrator line | n/a | n/a | n/a |
| Quotes a shipped line | no | no | no | no |
| Tells the player he erred | no | no | no | no |
| Capability flag | none | none | none | none |

Three further disciplines I held to that nobody asked for, recorded so a
reviewer can overrule them cheaply:

1. **No second person aimed at the player.** M23 opens *You walk a tunnel like
   that* — that is the impersonal *you* of a tradesman describing his own
   practice, the same one shipped in M9 (*the way you touch somebody you are
   not intending to wake*), and it never once means the reader.
2. **No fragment mentions another fragment's material.** M22 does not touch the
   notebook, M23 does not touch the credentials, M24 does not touch either.
   They are four separate afternoons.
3. **None of them is a good line.** They are all deliberately plainer than the
   surrounding narrator prose. The narrator performs; this man does not, and
   the flatness is the tell that this is not the narrator talking.

## 7. Trigger refinements — proposals only

The plan's four conditions are correct and I would ship them as written. Two
optional refinements, both **proposals** (§16 q1, q2):

- **M21.** As specified, a first-run player who guesses the pair in Act I gets
  the fragment in Act I, which is the intent. Consider adding
  `{ not: { memory: act5_mem_m17 } }` for nothing — I checked, it is
  unreachable in Act I and the guard would be dead code. **No change
  recommended.**
- **M23.** `act5_branch_unlocked` + `{ not: { flag: act4_started } }` also
  fires for a player who is simply thorough in Act III with the chair leg. That
  is *correct* and I recommend keeping it: the fragment reads as a facilities
  memory for that player and as a leak for the returning one, and both are
  true. Flagged only so nobody "fixes" it later.

---

# PART TWO — the ledger's seven answers

Register and rules for everything in this part: the player's own note voice,
past tense, concrete, first person where it is natural; **no mechanics**
(no verb, no flag, no *route*, no *puzzle*); **no new facts** — every clause
below restates something a shipped scene put on screen. `answer` is a plain
string (`engine/world.ts` line 645), so there are **no variants**: each of
these has to be true for every route by which its question can settle. That
constraint did real work in §13 and §14 and is called out there.

## 8. `act1_q_notebook`

> *Where did Jules hide the notebook — and who else is looking for it?*

**Settles at:** the Wall Drug cache, with the room's own evidence about who
came through it first.

```text
In a claim box at Wall Drug, on a hold under a numbering scheme the counter
stopped using before the present clerk started — where nothing is indexed, and
nobody currently living had any reason to look it up.

And the other party had already been through my room before I woke up in it:
unhurried, quiet, wiping his feet on the way in, and taking nothing at all,
which is what a man does when the one thing worth taking is the one thing that
is not there.
```

> **Note.** 89 words. Both halves of a two-part question, in order. The second
> half deliberately does not name anybody — the parser noun exists but the word
> has never once appeared in player-visible prose in this game, and this is not
> the place to start. Every detail is shipped: the dead numbering card, the dry
> water ring and the unhurried search, Marlow's *he took nothing, never raised
> his voice, and wiped his feet on the way in*.

## 9. `act1_q_wall_drug`

> *What is waiting at Wall Drug?*

**Settles at:** the cache opened.

```text
Free ice water, as advertised. A woman at the counter who remembers a grey hat
and can tell you nothing whatsoever about the face under it. And behind her, in
a corridor of shelving run on a scheme nobody currently working there was ever
taught: bay E, and a box on a hold that nobody had asked after in months.

A hard-backed notebook with a pencil under a dead rubber band. A memory stick
labelled by hand. A canister of exposed film with nothing written on it. And a
letter that was sent, refused, and kept anyway.
```

> **Note.** 97 words. Written **not** to reuse `CACHE_CONTENTS_DETAIL` verbatim,
> because that string is already `act2_q_where_is_cache`'s answer and two
> ledger rows printing the same paragraph is the ledger admitting it has one
> thought. Same four objects, different sentence, and this one answers the
> question that was actually asked — *what is waiting* — by putting the joke
> first (L17: the one promise in the whole world that is kept) and the four
> objects last.

## 10. `act2_q_what_notebook_says`

> *The notebook is in a shorthand only its author had to read. What is in it?*

**Settles at:** Eli's annotated audit (`act2_has_audit`), or Dad's decode —
both set `act2_shorthand_decoded`.

```text
A hook is a valve. A doubled stroke is a shift. With that much, two thirds of
it is a man's working week over and over: bearings, a door that sticks, a
contractor who does not come.

And then, from about the middle, in among the valves, never underlined and
never set apart — a corridor longer inside than on the plans, a second
chilled-water return that nobody drew, a floor with no drawing at all, and the
manager saying kindly that there is no such floor.

And one line in capitals. The only one in the book, with the pencil through the
paper on the S.
```

> **Note.** 107 words. It opens on the decode because the decode is what
> settles it, and the two annotations are the shipped ones. It **does not print
> the capital line** — a player who has read the notebook supplies it himself
> from three words of description, and a player who has not is given the exact
> shape of the thing he has not read yet. That withholding is the whole reason
> this answer is worth writing rather than dumping the decoded text.

## 11. `act2_q_boot_usb`

> *A stick with a dead man on it, and one machine in the county old enough to
> trust it. How does it go in?*

**Settles at:** the boot (`act2_dad_booted`).

```text
Three obsolete parts out of the junk drawer under the general store's counter,
joined end to end into the in-between that nothing has needed in a working
lifetime. The stick on the end of that. The whole chain onto the back of the
machine by feel, which took two tries.

Then a long enough nothing that I started composing what I was going to say
about it afterwards, and to whom. Then the screen counting its own memory in a
unit that has not impressed anybody in decades, and bad sectors marked rather
than repaired.

Then the speaker behind the grille — which had spent its entire working life
making one noise — made several. He arrived mid-sentence, on the subject of
hotels.
```

> **Note.** 123 words, the longest of the seven and the one I would defend
> longest. The question is mechanical (*how does it go in*) and the honest
> answer is four fittings and a wait, so the recap is structured as the actual
> sequence: parts, stick, chain, nothing, count, speaker, man. The last sentence
> is the payoff and it is eleven words, because §17 — *he arrived mid-sentence,
> on the subject of hotels* is funny to a player who was there and is not
> explained to one who was not. **No count of the bad sectors** (canon 70): the
> screen prints the figure, the note does not repeat it.

## 12. `act2_q_film_vs_database`

> *The library still keeps its own record of the plant's construction on film,
> while the county's own terminal insists there is nothing before 2036. Which
> one is the real archive?*

**Settles at:** the construction reel read (`act2_clue_service_tunnel`).

```text
The film, and it is not close.

The terminal has nothing before 2036 and no account of why. The drawer marked
2028-2031 has a first sod turned in a cold wind, eleven people in coats, a
senator standing slightly apart with his hands behind his back, and a
photograph of the dedication plaque shot square on before it went up, every
letter legible: THE BADLANDS FACILITY, COMMISSIONED 2030. And in the following
winter, a column about the works closing down mentions in passing that the
construction adit is to be sealed rather than demolished.

One of those records can be reached from somewhere else. The other one is a tin
of acetate in an unlocked drawer, in a room with nobody in it.
```

> **Note.** 123 words. Figures are read off things throughout (canon 89): the
> drawer's own label, the caption's eleven, the plaque's own two lines, and the
> question's own 2036. Nothing is subtracted from anything — the two dates sit
> next to each other and the reader does the arithmetic the narrator is
> forbidden to do.
>
> The last sentence is the answer to the question as asked, and it is the
> theme in one image without ever saying the theme: *reachable from somewhere
> else* versus *a tin in an unlocked drawer*. It is also a straight callback to
> the shipped drawer line — *Nothing in here is locked and nothing ever needed
> to be* — without quoting it.

## 13. `act2_q_inside_the_plant`

> *Every route into that plant runs through a badge, a truck, or a lie. Which
> one actually gets you inside?*

**Settles at:** any completed P16 route. **Five of them**: the badge, the
tailgate, the vendor manifest, the fence, and the service tunnel — all five set
`act3_inside` (`act3/scripts.ts`, `act3/objects/perimeterRoad.ts`,
`act3/s1MechanicalGallery.ts`). The commission named the fence; the shipped
resolution is *whichever door the player was equipped for*, and one string has
to be true for all five.

```text
Any of them, which is not the answer I went out there expecting. The gate is
the only part of that plant that behaves like a gate.

Whatever I came through — a badge that told the county the man who runs the
place had arrived for work, a turnstile that turns for anybody standing close
enough behind a man who holds doors, a vendor number in a box on a clipboard, a
fence, or a mile of dark under the grazing land — nothing on the far side of it
moved, or sounded, or asked me anything at all.

It is not built to keep a man out. It is built for people who belong there, and
it has no way whatever of telling the difference.
```

> **Note.** 127 words, and route-agnostic by construction: the middle paragraph
> names all five doors in one breath and commits to none, which is both honest
> for every playthrough and, as it happens, the better answer — the question
> asks *which one*, and the finding is that the question was wrong. Every
> clause is shipped: the badge display, the toe in the door, the vendor number
> in the top right box, the fence, the mile.
>
> **This is the block where a variant would help and cannot exist** (§16 q3).
> If the main session wants five route-specific answers, it needs a
> `ProseRule[]` on `answer`, which is an engine change and F1 has not budgeted
> one. My recommendation is to ship this string: the pooled answer says
> something the five separate ones could not.

## 14. `act2_q_nolan_off_duty` — it does **not** close properly

The commission's conditional. It is worse than empty: `ACT2_D2C_QUESTIONS`
declares it with **`text` only** — no `openWhen`, no `answerWhen`, no `answer`
— and no `openQuestion` or `answerQuestion` effect anywhere in `src/content`
references it. `engine/knowledge.ts` opens only on `openWhen` and
`engine/puzzles.ts` does not open a puzzle's linked `question`. **The row is
unreachable: it never opens, so it can never settle, so the player never sees
it in QUESTIONS at all.** P15 has a name, a five-rung ladder and a
`missedRecovery`, and no ledger row to hang them on.

Answer text, ready for the wiring proposed in §15:

```text
Both, and the second is easier than it looks.

On a Friday, under the low light, with the chairs down off the tables, he stops
dealing between two hands and talks about his week: a convoy that clears the
apron of everybody including him, and a building he has run for eleven years
and has never once been inside during the hours that belong to maintenance.

He is not being indiscreet. He is a man off duty, telling a card table about
his job. And if you ask him before you stand up, he will hand his badge across
the felt, because he does not mind where it says he has been.
```

> **Note.** 112 words, and it has to be true for both of P15's arms — the gate
> talk (which happens win or lose) and the badge (which needs two hands of
> three). So the gate talk is the body and the badge is the last sentence,
> conditional in the prose (*if you ask him*) rather than in the data, which is
> how a note written by a man who did one of the two would read either way.
> *Eleven years* is read off the shipped clue (canon 89). The answer's first
> three words answer the question's actual either/or, which no other answer in
> this wave had to do.

## 15. Wiring proposals for F1

Text only above; conditions here are **proposals**, and any of them the builder
finds already covered should be dropped rather than duplicated.

| Question | `openWhen` (current) | `answerWhen` proposed | Note |
|---|---|---|---|
| `act1_q_notebook` | `{ flag: act1_told_jack_about_room }` — ships | `{ flag: act2_cache_found }` | Simplest honest cond. The "who else" half is carried by evidence every player has from turn one (the unhurried search); gating on `act1_clue_custodian_seen` as well would strand players who never work Marlow's topic. |
| `act1_q_wall_drug` | `{ clue: act1_clue_claim_ticket }` — ships | `{ flag: act2_cache_found }` | Same flag, different answer; both rows settle on the same turn and say different things, which is the point of §9's rewrite. |
| `act2_q_what_notebook_says` | `{ flag: act2_read_notebook }` — ships | `{ flag: act2_shorthand_decoded }` | Covers both decode routes (Eli's audit and Dad), which is why this and not `act2_has_audit`. |
| `act2_q_boot_usb` | `{ has: act2_usb }` — ships | `{ flag: act2_dad_booted }` | Mirrors P12's own `solvedWhen`. |
| `act2_q_film_vs_database` | `{ clue: act2_clue_service_tunnel }` — ships | `{ clue: act2_clue_service_tunnel }` | **Note the collision:** the reel grants the clue that both opens *and* settles this question, and the same clue also ships from `act2/dad.ts`. Two passes in one tick means it opens and answers on the same turn (`knowledge.ts`'s two-pass design makes that legal), which reads as a row that arrives already closed. If that is unwanted, `answerWhen: { flag: act2_read_construction_reel }` would need a new flag — an F1 call, flagged not decided. |
| `act2_q_inside_the_plant` | **none** | `{ flag: act3_inside }` | Also propose `openWhen: { visited: act3_perimeter_road }`. Today the two `answerQuestion` effects drive it straight from `unopened` to `answered`, so it appears in the ledger already settled and, until F0, settled and blank. `act3_inside` additionally catches the service-tunnel route, which neither `answerQuestion` effect covers. |
| `act2_q_nolan_off_duty` | **none** | `{ any: [{ flag: act2_badge_won }, { flag: act2_heard_gate_talk }] }` | = P15's own `solvedWhen`. Also needs `openWhen`; propose `{ met: act2_nolan }`. Without both it stays invisible (§14). |

---

# 16. Canon questions

Answers wanted before wiring; none blocks drafting, all of them are cheap to
overrule.

1. **q1 — Do M21–M24 carry titles at all?** Every shipped fragment has one, so
   these do; but M18–M20's titles are family-idiom (*Commit Or Roll It*) and
   these four are deliberately flatter. Confirm *The Corner*, *Across A Desk*,
   *Looking For A Rat*, *An Evening I Did Not Need*.
2. **q2 — May a replay fragment fire in Act I?** M21 does, by the plan's own
   trigger. It is the first memory some players will ever see, and it arrives
   before M1. I believe that is right (it is a memory of moving furniture; guide
   §11 holds) but it is a real first-impression decision and belongs to the main
   session.
3. **q3 — Is a pooled answer acceptable for a five-route question?** §13. The
   alternative is `ProseRule[]` on `QuestionDef.answer`, an engine change F1 has
   not budgeted. I recommend the pooled string and think it is the better
   writing; recorded because it forecloses per-route recaps for 1.0.
4. **q4 — Does `act2_q_film_vs_database` open and settle in the same tick?**
   §15's fifth row. Either accept it (the row appears already answered) or fund
   a new flag. Writer's preference: accept it — a question the player answers in
   the act of asking it is not a bug in this ledger, it is the library.
5. **q5 — May M24's last sentence stand?** *Being let in was never one of them,
   and it should have been.* It is the only line in the wave that tells a
   first-run player something bad is coming, and it does it without a name, a
   date, or a mechanism. If the main session reads it as too knowing, the
   fragment survives ending on *I could not have told you what I was waiting
   for*, at a cost of about a third of its point.
6. **q6 — Proposed register entry** (a promotion **proposal**, per hard rule 1 —
   I have edited no label): *The four replay fragments never address the player.
   No second person aimed outward, no acknowledgement that anything unusual has
   happened, in any of the four, ever. Forecloses: any replay content that
   congratulates, accuses, or winks.* This is the rule the whole wave is built
   on and it is worth being able to point at when somebody later wants to add a
   fifth.

# 17. ASSUMPTIONS

Marked per the brief; each is a place I acted without an explicit line in the
spec.

1. **ASSUMPTION:** the seeded stratum's speaker in M21–M24 is the same
   voice as M5/M7/M9 — a working supervisor, dry, unliterary, no metaphor he
   would not use out loud. Architecture §5 implies it; nothing states it as a
   register.
2. **ASSUMPTION:** M21's man carried the terminal into the room himself. Canon
   103 fixes the environment string and canon 3/A1 makes him the one who placed
   the subject there; *who moved the furniture* is nowhere on the register. If
   the main session would rather the room came furnished, M21 needs rewriting
   around the squaring-up and not the stairs.
3. **ASSUMPTION:** the credentials were **issued** to him rather than chosen by
   him (M22). The shipped back-cover text strongly implies it (*something you
   have just been handed*); it is not on the register.
4. **ASSUMPTION:** he found the branch hatch **before** he found Sublevel 6
   (M23's *the first thing I ever left out of it*). Nothing dates the hatch
   against the notebook. If the intended order is the reverse, the line becomes
   *That was not the first thing I left out of it* and the fragment still works.
5. **ASSUMPTION:** answer texts may restate a shipped scene's own phrasing
   closely without counting as a quotation. `act1_q_the_record` and
   `act1_q_out_of_this_room` already reuse shipped strings *verbatim* as their
   recaps, so this is the established idiom; I have written fresh sentences
   anyway everywhere except where a document is being reported (the plaque).
6. **ASSUMPTION:** the ledger may print a plaque's own words in capitals
   (§12). Canon 84's rule is that the *system's* vocabulary is only spoken by
   the system; a bronze plaque is not the system, and the answer is quoting a
   photograph.

# 18. Word count

| Block | Words |
|---|---|
| M21 `act5_mem_m21` | 117 |
| M22 `act5_mem_m22` | 89 |
| M23 `act5_mem_m23` | 110 |
| M24 `act5_mem_m24` | 109 |
| **M21–M24 subtotal** | **425** |
| `act1_q_notebook` | 89 |
| `act1_q_wall_drug` | 97 |
| `act2_q_what_notebook_says` | 107 |
| `act2_q_boot_usb` | 123 |
| `act2_q_film_vs_database` | 123 |
| `act2_q_inside_the_plant` | 127 |
| `act2_q_nolan_off_duty` | 112 |
| **Answers subtotal** | **778** |
| **Player-visible total** | **1,203** |

All four fragments are under the ≤120 ceiling. The answers have no ceiling; the
shipped range is roughly 40–110 words; three of these seven sit inside it and
four run over. The longest (§13 at 127, §11 and §12 at 123) are a five-route
pooled recap and two questions that ask *how* rather than *what* — a sequence
takes more words than a list. If a trim is wanted, §12's closing-down column
clause and §11's *which took two tries* come off cleanly for about twenty.

# 19. For Ryan

**Four blocks, in the order I would hand them over.**

**§5, M24** is the one to read first and the one to take off me if any of them
goes. It is the last memory fragment in the game and it is a man standing still
with his hand on a machine, and the whole thing turns on the last eight words —
*and it should have been* — which either land as a chill or land as the writer
being clever. I cannot tell from inside it. §16 q5 has the cut that saves the
fragment if they are wrong.

**§4, M23**, because *That was the first thing I ever left out of it* is the
line I am proudest of in the wave and it is doing a job nothing else in the
game does: it tells you the notebook is incomplete, from inside the man who
kept it, without a narrator ever saying so.

**§11, `act2_q_boot_usb`**, because it ends *He arrived mid-sentence, on the
subject of hotels*, and whether a ledger row is allowed to be that dry is a
Ryan question and not a spec question.

**§13, `act2_q_inside_the_plant`**, because it is the one place I overrode the
commission. The brief named the truck; the shipped game has five doors and one
string, so I wrote the answer that is true of all five — *the gate is the only
part of that plant that behaves like a gate*. If that reads as ducking the
question, §16 q3 is the fork.

One thing worth knowing before the read: **§14 found a broken row.**
`act2_q_nolan_off_duty` has never once appeared in anybody's QUESTIONS list —
it has no `openWhen`, so it cannot open, so it cannot settle. P15's whole
five-rung ladder has been hanging on a question the player has never seen. The
answer text is written and §15 has the two-line fix.
