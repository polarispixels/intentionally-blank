# Stage E Wave E2 — The Archive

**Status (main session, 2026-08-31):** **wired and shipped v0.18.0**; accepted whole — no cuts; §53 rulings: q1–q13 as recommended (q1: entry 104 binds the facility's floors, not the archive's environments — Sissy speaks; q9: the two tie defaults are two authors' choices and both stand; q13: report against 7,800). §58's proposals recorded as register **128–136** (the wayfinding doc claimed 126–127 first). §55 none wired. Original: draft for main-session voice review · **Author:** `narrative-writer`
· **Date:** 2026-09-19
**Covers:** Act IV's archive thread — the two lit gate frames and the three dark
ones; **`act4_escape_chamber`** (hero, twelve objects), the family's last day
rebuilt by a machine out of four people's memories and a hole where the fifth
was, and **P23**, the three performances that complete it; **`act4_hab_galley`**
and **`act4_hab_dome`**, the compressed Mars hab and its suit ritual;
**Sissy**, her eight topics, her three shows and the film she keeps shooting
after being told to stop; **M10** ×3 at the Chamber threshold and **M11** at the
launch topic; the **darkroom** at the County Library — a scene, not a room
(canon 109) — and the two prints that come out of it: **canon 96's** last day,
with a stranger in the frame and nothing said about him, and **R17**, Sissy's
sky laid beside the porch Polaroid's; and the last `system.buildBoundary` in the
game, narrowed to the well.
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md`
(**§5** — the Dome and the Chamber's completion are two of the seven moments §5
names, and Sissy's section is where the guide says the humour goes quietest,
**§7**, **§8**, **§11**, **§12**, **§14**, **§17**, **§18**),
`docs/spec/01-design-constitution.md` §8, §9, §14, §29, §30, §31, §32,
`docs/spec/02-story-world-canon.md` §11–§13, §17–§21,
`docs/spec/03-characters-and-relationships.md` §3, §9, §10,
`docs/spec/04-gameplay-and-puzzle-systems.md` §3, §5, §12, §14, §16, §18,
`docs/spec/09-canon-decisions.md` entries **5**, **9**, **12**, **13**,
**15**, **33**, **37**, **43**, **46**, **47**, **54**, **70**, **78**,
**82**, **84**, **85**, **86**, **87**, **88**, **89**, **91**, **93**,
**94**, **96**, **98**, **99**, **101**, **102**, **104**, **108**, **109**,
**110**, **112**, **113**, **114**, **119**, **122**, **123**, **124**,
`docs/superpowers/specs/2026-09-16-stage-e-plan.md` **§1 E2**, **§2 E2**,
**§4.0**, **§4.3**, **§5 Q1**, **Q7**, **Q12**,
`docs/superpowers/specs/2026-09-15-endgame-integrity-review.md` **§2.3
R14/R17**, **§3** rows 6, 9, 12, 13, 20, **§4.1** (M10, M11 and the strata),
`docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` §1 Act IV,
§2 P23/P24, §3 rooms 34–38, §5, §6, and the **E0** and **E1 prose documents**,
whose street, sheriff, terminal, President and lamp this wave stands on and
whose registers it extends.
**Wires into:** `world.rooms.{act4_escape_chamber, act4_hab_galley,
act4_hab_dome}` (three new rooms), `world.npcs.act4_sissy` (new),
`world.objects.{act4_gate_escape, act4_gate_hab, act4_coats, act4_bare_hook,
act4_silhouette, act4_family_table, act4_table_drawer, act4_family_camera,
act4_coffee_jar, act4_spare_key, act4_chairs, act4_countdown,
act4_chamber_door, act4_voices, act4_game_box, act4_chamber_window,
act4_anomaly_logs, act4_comms_rig, act4_hab_terminal, act4_airlock_door,
act4_galley_table, act4_hab_trays, act4_sky, act4_camera, act4_dome_glass,
act4_horizon, act4_dome_chair, act4_sky_log, act4_sissy_film,
act4_annex_shelf, act4_darkroom_key, act4_print_sky, act4_print_last_day}`,
`world.scripts.{act4_enter_escape, act4_enter_hab, act4_leave_hab,
act4_chamber_door_open, act4_chamber_phrase_respond, act4_develop}`,
`world.events.{act4_ev_chamber_complete, act4_ev_chamber_timer}`,
`world.memories.{act4_mem_m10_analytical, act4_mem_m10_social,
act4_mem_m10_direct, act4_mem_m11}`, `world.clues.act4_*`,
`world.questions.{act4_q_the_room, act4_q_the_sky}`,
`world.puzzles.{act4_p23_chamber, act4_p24_mars_film}`, plus **amendments in
place** to `act3/objects/s6ArchiveHub.ts` (the class gate object loses four
nouns and its `IN` handler changes; `SYSTEM_BOUNDARY_TEXT` gains a fourth arm)
and `act1/objects/countyLibrary.ts` (the darkroom door gains an unlocked state
and a pry route; one new object under the sign-in book's shelf).

Every string below is final prose. Nothing here is a placeholder. **Three
blocks are quarantined** (§55); I recommend wiring none of them. **§59 counts
the wave and says where it is over and why.**

---

## 0. How to read this

Conventions are E1's, which are E0's, which are D5's. Path ids are authored-slot
addresses; numbered variants are a `string[]` rotation in order; state-dependent
blocks are `ProseRule[]` in match order, first match wins, last rule
unconditional; `when:` clauses are `Cond` shorthand; `> **Note.**` blocks are
authoring notes and are never player-visible.

**Every player-visible word in this document is inside a fenced `text` block.**
Nothing else is. §59's count is mechanical for that reason.

**Read §52 before editing any one response alone.** It extends E1 §33, which
extends E0 §27, which extends D5 §35, back to D1 §23. The rows this wave stands
on, and the four things that will break it fastest:

- **Nobody counts anything.** Canon 70 is spent for the whole game and canon
  93 governs the refusal. This wave contains a room with coats on hooks, a
  table with chairs round it, a speaker with a family on it and a dome with the
  night sky in it, and **the narrator arrives at no total in any of them.**
  Eleven drafts were rewritten to remove a number (§52). The stars are the
  reason this rule exists: R17 is *the same arrangement*, and an arrangement
  that has been counted is a different and much worse reveal.
- **`COUNT STARS` is answered and produces nothing** (§37.2). Canon 93 lets a
  refusal say that a number was asked for. The refusal in this wave does one
  more thing, which I am flagging as §53 q6: **it points at the camera**, which
  is the puzzle's own solution and the game's actual answer to *how do you
  count a sky*.
- **The sky is described twice in this wave and never three times.** The Dome
  (§37.1) and the developed film (§46). The Chamber's window is curtained and
  **the curtain does not open, in any state, ever** (§20) — review §2.3's
  constraint, and the reason is that a third sky before the Dome makes R17 a
  repetition instead of a recognition. The porch Polaroid **stays out of focus**
  and no line in this wave describes it as sharper than wave 5 wrote it.
- **The mark is not named again.** Canon 124 spent the narrator's one naming in
  the Bay. Nothing in this wave returns to the player's forearm, and Sissy's
  arms are not described (§53 q8).

**Canon 104 and who is allowed to speak.** The entry reads *no living person
speaks below Sublevel 5 in any act*. Three things in this wave make sounds and
**this document's position is that none of them is a living person below
Sublevel 5** — it is my first canon question and §53 q1 states it properly:

1. **The recorded voices in the Chamber** (§17) are a machine playing back a
   reconstruction. They are the same class of thing as the terminal, which
   canon 87 has always allowed to speak, and they are never Jules's.
2. **Sissy** (§32) is through a frame, and a frame is not a floor. The Chamber
   and the hab are not *below* anything; they are not on the map's vertical
   axis at all. If the ruling goes the other way this wave loses its NPC and
   P24 loses its `C` route — §53 q1 prices it.
3. **The player** never speaks aloud anywhere in this wave, in the Chamber or
   the hab, and the two places where he plainly does something with his mouth —
   the door's prompt (§21) and the comms rig (§28) — are both **typed**.

**The vocabulary zone (guide §7, §8).** The Chamber's words are domestic and
sixty years old: *beading*, *dado*, *the good cloth*, *the back ring*,
*flimsy*, *dowel*. The hab's are procedural and flat: *stow*, *the seal*,
*cycle*, *pressure*, *the ring*, *regolith*, *station*. **Nothing in either
list is required to express an action** and nothing is glossed. Luke's three
words are his and do not travel; the one that appears here (§22) is in a
recording of him, which is where a word of his belongs.

---

## 1. Beat test (constitution §29, guide §18)

E1's last link: *THEREFORE the only person left who has believed him from the
beginning gets shown the room with the chairs in it — and under the lamp in
that room, the man who hired an investigator to find his brother stops being a
client.*

**The frames — THEREFORE.** Authority has been taken as far down as authority
goes and it stopped one floor short. **THEREFORE** the only doors left in the
building are the two in the left-hand wall that no credential has ever been
offered to, because they do not have anywhere to put one. They are not locked.
They are *checking* something, and what they are checking is not in a pocket.

**The Chamber — THEREFORE.** They check what is in your head. **THEREFORE**
the first one opens for a man carrying two afternoons that belong to somebody
else, and puts him in a kitchen that four people remembered and that he has
never been in, standing in front of a place where the light says a person is
and there is nobody.

**The performances — THEREFORE.** The room will not finish without the part
that is missing from it, and the part is a set of small ordinary things a man
did on an ordinary day: which chair he took, where he looked for the key,
what he said on the way out. **THEREFORE** do them. Not deduce them — do them,
the way you do a thing you have done before, and watch a machine accept each
one.

**The completion — BUT.** It completes. It puts the whole kitchen up sharp for
a second and lets you have it and takes it away, and the door at the back of it
opens, and there is nobody standing where the shape was. **BUT** a room
completing is not a fact about a man. It is a fact about a fit, and a fit
proves the shape of a hole and not the name of what came out of it — and the
difference between the two of them is a record, and records are not kept on
this floor.

**The hab — THEREFORE.** So go and find the one thing left in reach that
nobody can have edited: a sister who has been filing the same report for a
year, on the far side of a doorway, with a camera on a tripod and a habit she
was told to give up. **THEREFORE** the second frame, ten minutes of airlock,
and a woman who has been alone long enough to be exact.

**The film — THEREFORE.** Her evidence cannot come down a wire, because a wire
is the one place this world has ever been caught changing a thing.
**THEREFORE** it comes in a canister, in a coat pocket, up a ladder, through a
tunnel, across a county, and into a red-lit room under a library that the
county has agreed not to think about. **BUT** what comes out of the trays is
not a photograph of Mars. Laid beside a bad Polaroid of a porch roof in South
Dakota, it is the same arrangement — and on the film, which was on a tripod and
open for a long time, there are lines behind the stars, and the lines meet.

**The last day — AND THEN.** The other canister is developed in the same hour
and it is the kitchen: the cloth on, everybody round it, and a man at the end
of the table with his hand still out from the shutter, who is not in the room
you just walked out of. **Beat-test honesty (§29):** the second print's link to
the first is `AND THEN` — the same trays, the same hour, the player's own
choice to bring both. Its link *backwards* is a genuine `THEREFORE` off the
cache in Act II, and forwards a genuine `THEREFORE` into the record in Act V.
It is in this scene because the darkroom is the only darkroom, and the prose
does not pretend the two rolls have anything to do with each other. They do
not. That is why it works.

**Exempt (atmosphere, §18):** the tins with unprinted labels, the tea towel
folded in three, the tray of something green and the tray of something that
was, the bootlace on the seat restraint, the wheel track and its shadow, the
kettle on the back ring, and every response either room gives a man who tries
to take something home.

---

## 2. State

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `act4_chamber_admitted` | false | `act4_enter_escape` on the admitting branch (§4.1) | `act4_q_the_room`'s `openWhen`; the Chamber's rule 1 |
| `act4_chamber_first_done` | false | §18 | `act4_ev_chamber_complete`; the voices; the assist |
| `act4_chamber_copy_found` | false | §19.3 | `act4_ev_chamber_complete`; the voices; the assist |
| `act4_chamber_phrase_said` | false | `act4_chamber_phrase_respond` (§21.2) | `act4_ev_chamber_complete`; the door |
| `act4_chamber_failures` | 0 (number) | §18.2, §19.4, §21.3 (`inc`) | the assist's `>= 2` arm (§22) |
| `act4_chamber_complete` | false | `act4_ev_chamber_complete` (§23) | P23's `solvedWhen`; the Chamber's rule 3; the back door; the boundary |
| `act4_deep_index` | false | `act4_ev_chamber_complete` (§23) | **E3.** P27 — where Jules's snapshot is filed |
| `act4_sissy_topic_launch` | false | §32.4 | **M11**'s trigger |
| `act4_darkroom_open` | false | §43.1 (pry) or §43.2 (key) | the darkroom door; `act4_develop`'s gate |
| `act4_sissy_film_developed` | false | `act4_develop` (§44.1) | the print's existence; R17 |
| `act4_jules_film_developed` | false | `act4_develop` (§44.2) | the print's existence; §24; **E3**'s re-cache |
| `act4_sky_matched` | false | §46 | `act4_q_the_sky`'s answer; **E3**'s ending beats |

`act4_has_sissy_film` is **derived** — the plan's own note: use `{ has:
act4_sissy_film }`, do not add a flag.

### Clues

`act4_clue_frame_wants_more` (§4.2) · `act4_clue_admitted` (§4.1) ·
`act4_clue_room_completed` (§23 — **R14's undodgeable form**) ·
`act4_clue_harvest_wrong` (§24) · `act4_clue_sissy_counts_three` (§32.4) ·
`act4_clue_sissys_reason` (§32.5 — canon 110) · `act4_clue_same_arrangement`
(§37.3) · `act4_clue_sky_is_ceiling` (§46 — **R17**).

**Clue detail text** — knowledge-view strings, in the player's own note.

`act4_clue_frame_wants_more`
```text
The first frame is not locked and there is nothing on it to unlock. I walked
into it and came out of it eighteen inches further into the same room. It is
checking something, and there is no reader, no pad and no slot anywhere near
it, so whatever it wants is not a thing I can be carrying.
```

`act4_clue_admitted`
```text
It let me in. The second time I put a foot over that sill the floor on the far
side of it was linoleum. Nothing about me changed between the two attempts
except what I had remembered in between.
```

`act4_clue_room_completed`
```text
The kitchen is built out of what four people remember of one afternoon. The
parts all four of them looked at are exact. The parts nobody looked at are
blank. There is a place in the middle of it, standing height, that the light
treats as occupied and that has nothing in it, and the room will not finish
until somebody does that person's small ordinary business: takes his chair,
looks where he kept the spare, says the thing he said on the way out.

It only completes for the one who knew the part.

It completed.
```

`act4_clue_harvest_wrong`
```text
On the film the good cloth is on the table. In the room the good cloth is off
it and folded on the dresser. Four people built that kitchen out of what they
had and got that one wrong, and there is no way to be wrong about a thing like
that unless it was never looked at by anybody who was in the room.
```

`act4_clue_sissy_counts_three`
```text
She has three brothers. She said it the way you say a thing that has never had
a reason to be said carefully — counting off what each of them was doing on the
day she went up, and stopping when she ran out of them.
```

`act4_clue_sissys_reason`
```text
Her account of why the sheet starts at two: the first one did not take. The man
put it on somebody, it healed out to a smear inside a year, and rather than sit
that one down again they moved the whole row up. She cannot tell me which of
them it was on. Eli says the parlour refused to do a single upright at all.
The President says their father was I and there never was another. All three of them are
certain and no two of them agree, and not one of them has mentioned birth
order, which is the only version I was given by anybody who lives here.
```

`act4_clue_same_arrangement`
```text
Held up against the dome: the bright one, and the long shallow triangle of
smaller ones under it, and the close pair below and left of that, all in the
same positions and the same proportions as they are on a Polaroid of a porch roof in
South Dakota. The Polaroid is out of focus and cannot prove anything on its
own. The arrangement is the arrangement.
```

`act4_clue_sky_is_ceiling`
```text
Her film and the Polaroid, side by side under the safelight. Same arrangement,
confirmed — the film is sharp and the discs on the Polaroid are the same discs.

And on the film only, because it was open on a tripod for a long time and the
negative was pushed: straight lines behind the stars. Faint, but straight, and
they meet, and they do not meet at any angle that anything in a sky meets at.
Where two of them cross the black is a different black and it has an edge, and
behind the edge there is structure — the kind a thing has when it was made
rather than when it grew.

Two skies. Eighty million miles. One arrangement, and the seams are in both of
them; you can only see them on the one that was photographed properly.
```

### Questions

`act4_q_the_room` — opened on `act4_chamber_admitted`, answered on
`act4_chamber_complete`.

```text
Why does the room stop where you stand?
```

**`act4_q_the_room`'s answer text** (P23's `onSolved`):

```text
Because it was built out of four people and there were five, and the shape of
what is missing from it is the shape of a man who took the first chair, kept
the spare key in the coffee jar, and said the same thing on his way out of a
door for as long as anybody could remember. It stopped where you stood because
you were standing in the hole. It started again when you did his afternoon.
```

`act4_q_the_sky` — opened on `{ visited: act4_hab_dome }`, answered on
`act4_clue_sky_is_ceiling`.

```text
Whose sky is that?
```

**`act4_q_the_sky`'s answer text:**

```text
It is the same one. Her camera and a Polaroid of a porch roof in South Dakota
took the same arrangement of stars, and the film is good enough to show what
the Polaroid never could: the lines behind them, and where the lines cross.
Nobody up there is looking at anything the people down here are not looking at.
```

`act4_q_record_about_you` (E0's) and `act3_q_what_are_these_people` (D5's)
**stay open**. `act4_q_who_outranks_it` was answered in E1 and is untouched.

### Puzzles

| Puzzle | State after E2 |
|---|---|
| **P23** `act4_p23_chamber` — *the reconstruction* | **opened and solvable.** `solvedWhen: { flag: act4_chamber_complete }`; `onSolved: [{ answerQuestion: act4_q_the_room }]`. Clock-free. Solutions: `knowledge` ×3 (the chair, the jar, the phrase) with a `conversation` assist at two failures. **No death, no lockout, the timer resets on every attempt.** |
| **P24** `act4_p24_mars_film` — *Mars, on film* | **opened and solvable.** `solvedWhen: { clue: act4_clue_sky_is_ceiling }`; `onSolved: [{ answerQuestion: act4_q_the_sky }]`. Clock-free — the hour in the darkroom is time spent, not a window missed. Solutions: `conversation` (Sissy, with M11), `knowledge` (the night-sky Polaroid shown to her), `stealth` (the camera in the Dome while she is in the galley); then `physical` (developing) and `knowledge` (the comparison). |
| **P25** | root leg (i) was delivered in E1 and is untouched. E2 delivers nothing to it. |

**P23 has no `missedRecovery`** — nothing in it carries a clock term, and the
frame does not close. **P24 has none either**, for the same reason; the plan
says so and the prose holds to it.

**P23's solution notes** (knowledge view, one per solution):

```text
SIT IN THE FIRST CHAIR when the voices call the game. Not the chair nearest the
door and not the chair you would have chosen. The first one — the one at the
end with its back to the window, which is empty and stays empty.
```

```text
LOOK IN THE COFFEE JAR on the shelf over the stove. The drawer in the table is
locked and there is no key in this room, which is only true of rooms where
nobody kept a spare. Somebody in this family always kept a spare, and always
kept it in the same place, and said so often enough that it stuck.
```

```text
SAY THE HOUSE RULE at the panel by the back door when the timer runs out. It
wants a line, not a code. It is the thing the last one out of that kitchen said
every time, and you have heard it twice this week from two different people who
have never met.
```

**P24's solution notes:**

```text
ASK SISSY ABOUT THE FILM once she has told you about the launch. She will hand
it over. She has been waiting a year for somebody to want it.
```

```text
SHOW HER THE NIGHT-SKY POLAROID. She will look at it for a long time and then
go and get the canister without being asked.
```

```text
TAKE THE FILM out of the camera on the tripod in the dome while she is down in
the galley. It is not locked and it is not hidden and she never asks for it
back, which is its own answer about her.
```

### Memories

**M10** — *The Kitchen* — three behavioural variants sharing one title, in M3's
mutually-exclusive idiom, fired on the Chamber threshold (§5). **M11** — *One
Sky* — one fragment, fired on Sissy's launch topic (§33). Both are **family**
stratum and both count toward P23's family cluster; M10 is deliberately the
third fragment for a minimum-route player, who arrives with M3 and M6 and is
admitted on two.

**The tie-breaker.** M10's analytical variant carries the plan's rule —
`{ any: [{ profileLeader: 'analytical' }, { not: { any: [{ profileLeader:
'social' }, { profileLeader: 'direct' }] } }] }` — so that a tied profile fires
analytical rather than nothing. **A tie must not cost the minimum route its
third fragment.** M3's shipped variants send a tie to *social* and M10's send it
to *analytical*; that is not an inconsistency to tidy, it is two different
defaults chosen by two different authors, and §53 q9 asks for a ruling.

---

## 3. The gate frames — amendments, and the two that work

`act3_gate_frames` **stays the class object** for `EXAMINE` / `READ` / `TOUCH` /
`LOOK UNDER` on all five, and its shipped text is untouched (§56.1). It loses
four nouns — `escape`, `hab`, `escape room`, and the bare singular `frame` when
a lit frame is in scope — to the two new objects. Its `IN` handler stops being
a boundary and becomes §3.1.

### 3.1 `IN` / `ENTER GATE` / `GO THROUGH FRAMES` on the class object

```text
Two of them have light behind them and three of them have the other thing, and
you cannot walk at a wall in general.

Which one.
```

> **Note.** No clarify event, no disambiguation prompt — the frames are objects
> and not exits, and the engine has nothing to offer here. Two sentences and a
> full stop where a question mark would be, because the room is not asking.

### 3.2 `act4_gate_escape` — `EXAMINE`

Nouns: escape room, escape, first frame, first, lit frame, light. Adjectives:
first, lit, escape.

```text
Standing right under it, the light behind it has a floor in it.

Not much of one. A line, low down, running left to right across the whole width
of the opening, where a floor would meet a wall if there were a floor and a
wall. Above the line the standby glow is even. Below it, it is fractionally
warmer, the way light is warmer coming off something laid down flat.

From the middle of the room you cannot see it at all. It is the sort of detail
that goes away if you look at it directly and comes back if you look at the
strip of plastic over it instead.
```

### 3.3 `act4_gate_hab` — `EXAMINE`

Nouns: hab, mars, second frame, second. Adjectives: second, dark, hab.

```text
The second one is dark and the sill under it is not.

Cast into the concrete under this opening, and under no other opening in the
row, there is a shallow trough: a rounded channel about two fingers wide,
running the width of the frame, with a lip on the far side of it.

It is the shape a floor is given when something with a rubber seal on the
bottom of it is going to come down on it, over and over, and be expected to
hold pressure.
```

### 3.4 The three dark frames — `ENTER` — canon 101

Three refusals, one each, in declaration order. **None names anything and none
is ever lit.**

Frame three:
```text
You step through it.

The far side of it is the archive hub, which is where you were, and the frame
is now behind you, which it was not a moment ago. Nothing else about the room
has been altered in any way.

It has the manner of a machine returning a coin.
```

Frame four:
```text
The slot over this one has never had a strip in it. No screws, no screw holes,
no adhesive, no rectangle of cleaner paint.

You go through anyway, on the grounds that the other one had a legend and did
nothing either, and come out into the same room facing the same wall at the
same temperature, which at least is consistent.
```

Frame five:
```text
The last one in the row is the coldest, which means nothing: it is nearest the
well and the well is tiled all the way down.

You put a shoulder into it, in case it turns out to have been a question of
commitment.

It was not a question of commitment.
```

---

## 4. Through the first frame — `act4_enter_escape`

`ScriptFn` on `act4_gate_escape`'s `IN` / `ENTER` / `GO THROUGH`. Counts family
fragments held; `>= 2` admits.

### 4.1 Admitted — sets `act4_chamber_admitted`, grants `act4_clue_admitted`, `goto act4_escape_chamber`

```text
You put a hand on the edge of the frame, and then a foot over the sill, and the
floor on the other side of it is a floor.

Linoleum. Brown and cream squares laid on the diagonal, warm through the sole of
the shoe, with a pale road worn across it from where you are standing to a sink
that is over there and was not over there a second ago.

There is no moment. Nothing dissolves, nothing resolves, nothing takes a breath
to load. The concrete is behind your back foot and the linoleum is under your
front one and both of them are ordinary.

Behind you is a doorway with a hall through it: beading round the frame, gloss
on the beading, and a chip out of the beading at the height of a hand carrying
something.

The air in here has bread in it.
```

> **Note — the M10 grant.** M10 fires on the threshold, on the tick after this
> block, as its own `MEMORY RECOVERED` output. The two must not be concatenated:
> the room is described first and the memory arrives after it, which is the
> order every other threshold memory in the game uses.
>
> The first line is `GATE_ENTER_TEXT`, shipped, **reused verbatim** and not
> counted in §59.

### 4.2 Refused — grants `act4_clue_frame_wants_more`

```text
You put a hand on the edge of the frame, and then a foot over the sill, and the
floor on the other side of it is a floor.

It is the floor of the archive hub. You have gone forward about eighteen inches
into the room you were already in, and the frame is behind you now, and the
carpet under you is the same grey cord it has been all night.

Behind the frame the standby light goes on being exactly as bright as it was.

There is no reader on this thing. No pad, no slot, no plate, no keyhole and no
handle. Whatever it is checking, it is not checking anything that is on you.
```

---

## 5. M10 — *The Kitchen* — three variants

`{ all: [{ visited: act4_escape_chamber }, <leader> ] }` plus the M3 exclusion
arms. Title is shared; exactly one fires, ever.

### 5.1 `act4_mem_m10_analytical` — the timer

```text
The kitchen timer lived on the sill over the sink and it ran a minute and a half
slow across its whole travel, which I had established over a summer and which
nobody had asked me to establish.

Dad set it for the potatoes and went out to the yard. I put it back a turn.
When it went off, the potatoes were done at the time he thought he had set it
for, and he said what he always said, which was that there was nothing wrong
with that timer.

There is nothing wrong with that timer. That was never the claim.
```

### 5.2 `act4_mem_m10_social` — who was laughing at whom

```text
The joke was that the youngest still could not say a particular long word, and
the joke was old by then, and she had started getting it wrong on purpose
because a joke you do on purpose is one you own.

All of us at that table going. Dad not going. Dad going.

I had the end seat with my back to the window, which is the seat you end up in
if you are the one who gets up to take the picture.
```

### 5.3 `act4_mem_m10_direct` — the chair

```text
The chair went under me on the back left leg, all at once, the way they do —
the dowel coming out of the socket dry and clean with no splinter on it
anywhere.

I went down with the plate still level in my hand. I have never managed that
since and I did not manage it on purpose then.

The leg lay under the table for the rest of the afternoon and nobody picked it
up, and I have thought about that leg more than the day deserves.
```

> **Note — the leg.** The player has been carrying a chair leg since Act I and
> **no response in this game connects the two**, here or anywhere. The direct
> variant is the one the plan asked for (*D1 §14.7's chair, losing its leg*) and
> it is written so that the connection is available and never offered. If the
> chair leg is in the inventory when this fires, nothing changes.

---

## 6. The Chamber — `act4_escape_chamber` — three `ProseRule`s

`area: 'act4'`. Exit `w` / `out` → `act3_s6_archive_hub` (§56.4). Hero tier.

### 6.1 Rule 1 — first sight — `when: { not: { visited: act4_escape_chamber } }`

```text
A kitchen.

Not a set of a kitchen, and not a room that puts you in mind of one. Linoleum on
the diagonal, a pale road worn across it to the sink, a table under the window
with chairs round it, a stove with a kettle standing on the back ring and a tea
towel folded in three over the rail.

Some of it is exact. The chip in the beading. The burn on the counter beside the
stove where something got put down once by somebody in a hurry. The handle of
the top drawer, worn bright down one side only, because a thumb comes at a
drawer from the same angle for years. You could give a statement about any of
those.

And some of it is not. The cupboard doors have no handles on them at all. The
tins along the shelf have labels and there is no printing on the labels. The
pattern on the curtain over the window is a pattern for about a foot in from the
edge, and after that it is a colour.

Behind the door as you came in, a row of hooks with coats on them, and one hook
without.

At the back of the room, past the stove, there is a door that does not belong to
this house: flush, grey, with a panel beside it at shoulder height showing a
single line of nothing.

And in the middle of the floor, standing up, where the light on the linoleum
says a person is standing, there is nobody.
```

### 6.2 Rule 2 — `when: { not: { flag: act4_chamber_complete } }`

```text
The kitchen, with its exact parts and its unfinished ones. The table under the
curtained window, the chairs, the stove, the hooks, and the grey door at the
back with its one line of display.

The shape is where it was. The light is still going round it.
```

### 6.3 Rule 3 — `when: { flag: act4_chamber_complete }`

```text
The kitchen, with the back door standing open on a corridor that has strip
lights in it, and nothing in the middle of the floor.

The light comes off the linoleum flat and even the whole way across, the way it
does in an empty room.
```

### 6.4 Room-level senses

`SMELL`:
```text
Bread, and boiled potato water, and the particular hot-dust smell of a stove
that has been on for a while in a room with the window shut.

Not one of those smells is coming from anywhere. The kettle is cold.
```

`LISTEN`:
```text
The timer on the sill, going.

Under it, from the speaker over the door, the sound a room full of people makes
between sentences: a chair moving, a cup down on a saucer, somebody breathing in
to say something and somebody else getting there first.
```

`LOOK UP`:
```text
A ceiling in a colour that used to be white, a paper shade on a flex, and one of
those pressed-tin roses round the flex that nobody has painted round properly
since long before anybody in this family was born.

The shade is not moving and there is no reason for it to be.
```

---

## 7. The coats — `act4_coats`

`portable: false`, class object. Nouns: coats, coat, hooks, hook, row, pegs,
peg, rack. Adjectives: family, hanging.

### 7.1 `EXAMINE`

```text
Working coats and one that is not.

A man's canvas chore coat, gone soft, with a rule pocket on the thigh and the
rule still in it. A parka with the fur off the hood on one side. A denim jacket
with a patch sewn on badly and a second patch sewn on over the bad sewing. A
long wool thing, black, far too good for this room, on the hook nearest the door
so that it can be got at fastest. And a child's anorak, red, which has been let
down at the cuffs and is still too short.

They are all on the hook and none of them is on the hook properly. Every one of
them is hung by the collar rather than the loop, which is what people do to
coats and what nobody does to a coat they are describing to somebody.
```

### 7.2 `SEARCH COATS` / `LOOK IN POCKETS`

```text
Cigarette papers in the chore coat, and a rule that pulls out to a foot and
locks. A boiled sweet in the parka, gone to liquid inside the wrapper. Nothing
in the denim.

The black wool coat has an inside pocket with a stitched line where a label goes
and no label in it, which is a thing about expensive coats and not a thing about
this room.

The red anorak has a mitten in it. One.
```

### 7.3 `TAKE COAT` / `WEAR COAT`

```text
It comes off the hook and it has the weight of a coat and the smell of one, and
you stand in a stranger's kitchen holding it.

You put it back on the hook. By the collar, because that is how the others are
on.
```

---

## 8. The bare hook — `act4_bare_hook` — **canon 54's rhyme, unnamed**

`portable: false`. Nouns: bare hook, empty hook, spare hook, sixth hook.

### 8.1 `EXAMINE`

```text
The hook is the same as the others: a screwed-on cast thing with two arms, and
the paint on it is the paint on all of them.

What is different is the wall behind it.

Behind each of the other hooks there is a shadow of a coat — a soft grey outline
pushed into the paint by years of the same shoulder in the same place, which is
a thing that happens to a wall in a hall whether anybody wants it to or not.

Behind this one the paint is clean. Not wiped clean. The same age as the paint
everywhere else in the room, and nothing has ever been against it.
```

> **Note — the rhyme, and what it is not.** In the Maintenance Bay there is a
> hook with a peeled label under it and *you can see where the letters were and
> you cannot read them*. This one is the inversion and it is deliberate: there
> is nothing under it to read, because a room built out of what four people
> remember cannot contain the wear a fifth person's coat left on a wall
> **nobody was looking at**. The two hooks are never named together, no clue
> joins them, and no response in this wave uses the words *tape*, *gum*,
> *label* or *letters*. A player who remembers grey gum supplies the rest.
> **Do not let an editor put a mark under this hook.**

### 8.2 `TOUCH` / `HANG COAT ON HOOK`

```text
You take the black wool coat off its own hook and put it on this one, and it
hangs there, and it is a coat on a hook.

Nothing about the room acknowledges it. You put it back.
```

---

## 9. The silhouette — `act4_silhouette`

`portable: false`. Nouns: silhouette, shape, figure, person, place, space, gap,
outline, nobody. **No adjectives.**

### 9.1 `EXAMINE` — no face, no build

```text
There is nothing there. That is the first and most reliable thing about it and
it goes on being true however long you look.

What there is, is what the room is doing around a place where nothing is. The
light off the window falls across the linoleum and stops on a line, and starts
again on the far side of a gap about the width of a person, and the edge of the
gap is soft the way the edge of a shadow is soft and not the way the edge of a
cut-out is.

The chair at that end of the table is pushed back from the table by about the
distance a chair goes when somebody has stood up out of it in a hurry and has
not come back for it.

It is standing height. It is not doing anything. It has no front and no back.
```

### 9.2 `TOUCH SILHOUETTE` / `TALK TO SILHOUETTE` / `ATTACK`

```text
Your hand goes through the place where the light is not, and comes out the far
side of it, and is a hand.

There is no cold spot, no resistance, no hum, and nothing in the room changes
its mind about anything. Whatever is being withheld here is being withheld at
the level of the record, and the record does not care what you do with your arm.
```

### 9.3 `STAND IN SILHOUETTE` / `STAND WHERE THE SHAPE IS` / `TAKE HIS PLACE`

```text
You step into it.

The light closes over you the way water does not — instantly, with no edge — and
the gap in it is gone, and now the room has a person in the middle of it and the
person is you.

From in here you can see the whole of the table, the door, the hooks, and the
back of the stove. It is the standing place in this kitchen from which the most
of it is visible, which is either a fact about a room or a fact about a man, and
the room is not saying which.

Nothing else happens. Standing in the place is not the same as doing what was
done in it.
```

---

## 10. The family table — `act4_family_table`

`portable: false`. Nouns: table, kitchen table, top, surface, dresser, cloth,
good cloth. Adjectives: kitchen, family, wooden.

### 10.1 `EXAMINE`

```text
A rectangular deal table, scrubbed pale, with the grain standing proud of the
soft wood between the grain — sixty years of scrubbing takes a table down that
way and nothing else does.

Set for a meal that has been eaten. Plates stacked at one end, cutlery gathered
on the top plate, a jug with an inch of water left in it and the light going
through it onto the wood.

There are rings on the table and ink on the table and one place where something
was cut against it and the cut was not deep enough to matter and deep enough to
last.

The good cloth is not on it. It is on the dresser behind, folded in a square with
the crease of the fold gone shiny, the way a cloth goes when it lives folded.
```

> **Note.** *A kitchen table with the good cloth off it* is M19-S's own image,
> shipped, and a player who has beaten Dad at cards has read it. The response
> does not remark on it in any way and no clue mentions it. It is also §24's
> whole mechanism, and §24 does not remark on it either.

### 10.2 `LOOK UNDER TABLE`

```text
Four legs, a stretcher, and the underside of a table top, which is the part of a
table nobody scrubs.

There is a wad of something dried on under there, high up in the corner, in
about the position a hand goes if a hand is going to do that, and it has been
there long enough to be the colour of the wood.
```

### 10.3 `TAKE CLOTH` / `PUT CLOTH ON TABLE`

```text
You shake it out and lay it over the table and square it up at the corners, and
it fits, because it is that table's cloth.

The room does not object and does not care. It is not the cloth that is wrong
here, and putting it on does not make it right; it makes two things wrong at
once.

You take it off and fold it back down to its own creases.
```

---

## 11. The drawer in the table — `act4_table_drawer`

`portable: false`, `container: { open: false, locked: true }`. Nouns: drawer,
table drawer, top drawer, handle, knob.

### 11.1 `EXAMINE`

```text
A single shallow drawer in the long side of the table, with a wooden knob and a
brass escutcheon round a keyhole that somebody once thought a kitchen table
needed.

The knob is worn bright down one side. Whoever opened this most came at it from
the left, and did it often, and did not stop to think about it once.
```

### 11.2 `OPEN DRAWER` / `PULL DRAWER` — locked

```text
Locked. Properly locked — the drawer moves the eighth of an inch that a drawer
moves against its own lock and then stops dead on it.

There is no key in the escutcheon and no key on the table and no key on any of
the hooks, which is unusual, because a locked drawer in a kitchen is not a
security arrangement. It is a place where something goes so that nobody has to
ask where it went.
```

### 11.3 `PRY DRAWER WITH CHAIR LEG` / `FORCE DRAWER` — a fail, in voice

```text
You get the end of the leg into the gap over the drawer front and lean on it,
and the table comes up off two of its feet, and the drawer does not.

The leg is too thick to go past the rail, the front is oak and the top is deal
and the deal will go first, and you can feel the whole table telling you so
through the wood.

This drawer has a key. You have not yet been anywhere in this room that a key is
kept.
```

> **Note — the running joke's one refusal.** The chair leg has opened a desk
> drawer, a chase hatch, a tunnel plate and, in this same wave, a darkroom
> (§43.1). **It does not open this.** The refusal is in-world (a rail, a
> thickness, the wrong two woods), it teaches the next move in its last line,
> and it is the only place in the game where the leg is the wrong answer.

---

## 12. The coffee jar — `act4_coffee_jar`

`portable: false` (§56.2 on why). Nouns: jar, coffee jar, coffee, tin, shelf,
caddy. Adjectives: coffee, glass.

### 12.1 `EXAMINE`

```text
On the shelf over the stove, between a tin with a blank label and a tin with a
blank label, a squat glass jar with a screw lid and about two inches of ground
coffee in the bottom of it.

The lid is the only lid in this kitchen that anybody has bothered to keep clean.
```

### 12.2 `LOOK IN JAR` / `SEARCH JAR` / `OPEN JAR` — reveals `act4_spare_key`

```text
The lid comes off in the half-turn of a lid that gets taken off a lot.

Coffee, and the smell of coffee, which in here is the first smell that has come
from the thing it ought to be coming from.

And down the side of the jar, pushed in against the glass where a hand going in
for a spoonful would go round it rather than through it, a small flat key on a
loop of green string.

You have been told about this jar. Not this jar. The principle of it, in a
garage, by a man who thought it was the most obvious thing in the world and
could not understand why it had to be said twice.
```

> **Note — M6.** *"Always keep a copy, kiddo."* is shipped and the response does
> not quote it, name Dad, or say the word *copy*. The last paragraph is as close
> as it goes and it is deliberately about the man's exasperation rather than the
> lesson.

---

## 13. The spare key — `act4_spare_key`

`portable: true`. Nouns: key, spare key, small key, flat key, string, loop.
Adjectives: small, spare, flat, green.

### 13.1 `EXAMINE`

```text
A flat steel key about the length of a thumb joint, with the wards cut shallow
and a stamped number in the bow that is not stamped on anything else in this room.

The string is green and is tied in a granny knot, which is a knot tied by
somebody who did not care and did not have to.
```

> **Note.** *A number stamped in the bow that is not stamped anywhere else* is
> D4 §4.2's own device, used here on a much smaller object and to no effect
> whatever: the number means nothing, opens nothing, and is never mentioned
> again. §53 q10 asks whether that is one echo too many; I think it is the right
> amount of one.

---

## 14. The chairs — `act4_chairs`

`portable: false`, class object. Nouns: chairs, chair, seat, seats, first chair,
end chair. Adjectives: kitchen, wooden, first.

### 14.1 `EXAMINE`

```text
Kitchen chairs, and no two of them out of the same set, which is what happens to
a kitchen over a long enough run of children.

A pair of spindle-backs with the varnish gone off the top rail. One has a woven
seat with a hole starting in the middle of it and a magazine underneath the
weave holding the hole shut. One is a bentwood with a wire round the joint of
the back leg, wound tight and twisted off with pliers, and the twist has been
flattened over with a hammer so it will not take anybody's leg.

And the one at the end with its back to the window is pushed out from the table
and nobody is in it.
```

> **Note — the wired leg.** Nothing says whose repair it is, when it was done or
> which chair broke. The direct variant of M10 is about a chair losing a leg;
> this chair has kept one. **No response joins them.**

### 14.2 `SIT` in any chair that is not the first — a fail

See §18.2 — the response is the same block, because sitting anywhere else *is*
the wrong performance and the room's answer to it is one answer.

---

## 15. The countdown — `act4_countdown`

`portable: false`. Nouns: timer, countdown, clock, dial, kitchen timer, sill.
Adjectives: kitchen, wound.

### 15.1 `EXAMINE` — **no figure, ever**

```text
A clockwork kitchen timer on the sill over the sink: a chrome dome the size of a
fist with a bakelite dial, wound round to where somebody wound it to.

The dial has the marks a dial has and there is nothing readable on any of them —
not worn off, not scratched out. The paint that would be numbers has been laid
on and never made into anything.

It is going. You can hear it from the door.
```

### 15.2 `TURN TIMER` / `WIND TIMER` / `STOP TIMER`

```text
It winds. It goes round under your fingers with the ratchet noise timers make
and stops where you stop, and starts again the instant you let go.

You cannot put more time on this than it wants and you cannot take it off. What
you can do is stand at a sink in a house you have never been in, holding the
neck of a timer, listening to it decide.
```

### 15.3 When it runs out — `act4_ev_chamber_timer`, repeating, resets on each pass

```text
The timer gets to the end of its travel and lets go with a single flat note that
goes on a shade longer than you expect it to.

Behind you the speaker over the door stops.

The panel beside the grey door comes up out of nothing into one line of pale
characters, and waits.
```

---

## 16. The Catan box — `act4_game_box` — flavour only (canon 9)

`portable: false`. Nouns: box, game, board game, catan, settlers, lid, cards.

### 16.1 `EXAMINE`

```text
On the dresser under the folded cloth, a game box with the corners gone soft and
one corner mended with electrical tape.

The lid is on. Somebody has written on the end of the box, in marker, in a
child's capitals, the words HOUSE RULES, and underneath them nothing at all,
because whoever started writing them down found out how long they were going to
take.
```

### 16.2 `OPEN BOX` / `PLAY GAME`

```text
Cardboard, a lot of small wooden pieces in a bag, and a rule book with a coffee
ring on it.

Nobody in this room is going to play a game with you and the timer is going.
```

> **Note — canon 9.** Flavour, no sequence, no minigame. The box carries the
> phrase the back door will ask for and does not carry the phrase's meaning; a
> player who reads the box before he gets to the panel has been given the answer
> without being told it is one, which is the whole of what this object is for.

---

## 17. The recorded voices — `act4_voices`

`portable: false`. Nouns: voices, voice, speaker, sound, family, them, tape,
recording.

### 17.1 `LISTEN TO VOICES` / `EXAMINE SPEAKER`

```text
There is a speaker over the door, a paper cone in a pressed grille, painted over
with the wall in a way that means it was never meant to be seen, and it is
carrying a kitchen.

A man's voice with a lot of the county still in it, saying something about the
drive back. A woman's, younger than the rest of it, going
straight over the top of him. A slow one, being funny very quietly and being
missed. And one that starts sentences and does not always land them.

They talk across each other and finish each other and go quiet in the same
places, which is what a family does and what four people recorded separately do
not.

None of them is talking to you. And every so often all of them leave a space, of
about the length a short answer takes, and then carry on from the other side of
it.
```

> **Note — canon 104, and the count that is not one.** *Four of them* is the
> figure the plan requires the player to be able to hold against Sissy's *three
> brothers* and M11's *four*, and it is arrived at by describing four voices one
> after another rather than by the narrator adding them up. The room's family
> has five children and one father in it; **the wave never gives a total for
> that and never can.** These are recordings played by a machine, which is the
> class of thing canon 87 has always allowed to make noise below.

### 17.2 They call the game — the first performance's prompt

Fires on entering the room and after each reset, as the speaker's own line.

```text
From the speaker: "Right. Board's out. Who's going?"

And then the man's voice, over the noise, in the tone of somebody quoting a law
of physics at a room of people who have heard it four hundred times:

"House rules. Youngest goes last."

The space that comes after it is the length of a short answer, and nothing goes
into it.
```

---

## 18. P23, performance one — the order

### 18.1 `SIT IN FIRST CHAIR` / `GO FIRST` / `TAKE THE FIRST TURN` / `SIT IN THE END CHAIR` — sets `act4_chamber_first_done`

```text
You pull the end chair in under you with your back to the window and put both
hands flat on the table, which is not a decision you remember making.

The speaker does not react. Nothing announces anything.

What happens is that the room gets slightly more real at the edges. The pattern
on the curtain runs a hand's width further in from the hem than it did. There is
printing on one of the tins now — a brand, in a typeface that stopped being made
a long time ago — and there was not before.

From the speaker, the woman's voice, entirely unbothered: "Finally."
```

### 18.2 `SIT` in any other chair — a fail — `inc: act4_chamber_failures`

```text
You take one of the other chairs.

The voices go on. Nobody objects and nobody says anything to you, because there
is nothing in this recording about somebody sitting in the wrong chair; there
was never an occasion on which anybody did.

The space at the end of the sentence comes round again, and again nothing goes
into it, and the timer on the sill goes on doing what it is doing.

Whatever is supposed to happen next in this kitchen has not started.
```

---

## 19. P23, performance two — the copy

### 19.1 `UNLOCK DRAWER WITH KEY` / `OPEN DRAWER` with the key held

```text
The key goes in, turns a quarter turn against a lock that has one spring in it,
and the drawer comes out on wooden runners with the noise wooden runners make.
```

### 19.2 The drawer's contents — `act4_family_camera` revealed

```text
Inside: a ball of string. Batteries, dead, kept. A church key. A tin of
plasters with a hinge that has gone. A photograph wallet, empty, with a
chemist's name on it that does not exist any more.

And a camera.

A plastic thirty-five-millimetre compact, the automatic kind, with a wrist strap
and a scratch across the front of the lens housing where it has been in and out
of this drawer for years.

The back is open, and it is empty, and the take-up spool has the little curl of
leader on it that a film leaves behind when somebody has rewound it and taken it
out.
```

> **Note — canon 96, delivered as an object.** The film the player has been
> carrying since the cache came out of this camera. **Nothing in this response
> says so**, nothing in the room says so, and the response does not change if
> `act2_film_canister` is in the inventory. §53 q2 records this as a new fact
> and asks for the register entry.

### 19.3 The performance completes — sets `act4_chamber_copy_found`

```text
You have the drawer open and your hand on the camera, checking a thing that
wanted checking before anybody sat down, and the room takes it.

The handles come on the cupboard doors. Not one after another: they are on, and
they are the wrong shade of the same colour as the doors, the way a handle is
when it has been replaced once.

From the speaker, the slow one, quietly, to somebody who is not you: "He's
checked it. He always checks it."
```

### 19.4 `SEARCH DRAWER` before the key, or `LOOK IN JAR` after it is empty — soft fails

```text
The jar has coffee in it and a smell of coffee and nothing else. Whatever was
kept down the side of the glass is on a green string in your pocket.
```

```text
You go over the drawer again. String, batteries, a church key, an empty wallet,
and a camera with nothing in it.

There is no second thing in here. There was never going to be; it is a kitchen
drawer.
```

---

## 20. The window and the curtain — `act4_chamber_window` — **it does not open**

`portable: false`. Nouns: window, curtain, curtains, glass, sill, hem, pattern.

### 20.1 `EXAMINE`

```text
A sash window over the table with a curtain drawn across the whole of it, hem to
rail, on a wire.

The pattern is small flowers for about a foot in from each edge and then it gives
up and is a colour — a soft mid-green with nothing in it — all the way across the
middle.

Behind the curtain the glass is glass. There is light coming through it, the even
sort, off nothing.
```

### 20.2 `OPEN CURTAIN` / `PULL CURTAIN` / `LOOK THROUGH WINDOW` / `OPEN WINDOW`

```text
You take the edge of it and pull, and the rings go along the wire the way rings
do, and the curtain gathers, and behind it the pattern of the curtain carries on.

You pull it further. It carries on further.

Whatever is on the other side of that glass was not in anybody's memory of this
afternoon, because nobody sitting at this table looked out of this window, and
the room has done the only honest thing available to it, which is to keep drawing
curtain for as long as you keep asking for window.

You let go and it goes back to where it was.
```

> **Note — review §2.3, and the reason.** The curtain **never** opens, in any
> state, before or after completion. A third sky in Stage E before the Dome
> turns R17 from a recognition into a repetition. This response is also the
> wave's clearest statement of what the room is made of, and it is a joke, and
> it never explains itself.

---

## 21. P23, performance three — the phrase at the door

### 21.1 The door and its panel — `act4_chamber_door` — `EXAMINE`

```text
A flush grey door where a back door should be, hung on a frame that has been let
into the plaster and made good and painted the kitchen's colour, so that the wall
is a lie for about four inches all the way round it and then stops being one.

No handle. A panel beside it at shoulder height, dark, with a bevel round it.

When the timer runs out the panel has one line on it. The rest of the time it has
nothing on it, and there is no cursor.
```

### 21.2 The prompt — `act4_chamber_door_open` → `openPrompt: act4_chamber_phrase`

Prompt title:
```text
LAST ONE OUT SAYS
```

One field, no label, free text. Accepts `youngest goes last` or `house rules`,
lowercased and trimmed.

**Accepted** — sets `act4_chamber_phrase_said`:
```text
You type it in the way you would say it, which is fast and without listening to
yourself, because it is not a sentence anybody in that family ever finished
thinking about before they said it.

The line clears.

From the speaker, all of them, not together and not tidily, in the ragged
overlapping way a family says a thing it has said ten thousand times — and one of
them gets it wrong on purpose, and one of them laughs at that, and it is the one
who has been being funny quietly all afternoon and finally being heard.
```

### 21.3 **Refused** — closes the prompt, `inc: act4_chamber_failures`

```text
The line clears and comes back exactly as it was.

Behind you the timer resets itself to the top of its travel with a noise like a
thumb going round a ratchet, and starts again, and the voices pick up from the
beginning of the afternoon.

It is not a code. Nothing in this house has a code in it. It is a thing somebody
said.
```

> **Note — the prompt closes on failure.** The v0.15.0 lesson from
> `act3HubLoginRespond`: a prompt that stays open after a wrong answer strands a
> player who has nothing else to type. This one closes, the timer resets, the
> room is fully playable again, and the panel comes back on the next pass.

---

## 22. The assist — `act4_chamber_failures >= 2`

The voices prompt whichever performance is outstanding, one line each, in the
order first / copy / phrase. **No doom, no lockout**; the room can always be
finished.

**The order, unprompted:**
```text
The man's voice, into the space where nobody has answered, and for the first
time not to the room: "Come on. You're first. You've been first since before she
was born."
```

**The copy, unprompted:**
```text
The woman's voice, from further off, in the tone of somebody who has been asked
this at least once a week her whole life: "It's in the coffee. Where do you think
it is."
```

**The phrase, unprompted** — rule 1, `when: { flag: act4_luke_said_word }`:
```text
And the one who starts sentences without always landing them, to nobody, with the
enormous patience of a man who has decided that this is a hill:

"It is not a rule, it is a — there is a word for the thing behind a rule that
makes the rule the shape it is. Noumena. It is the noumena of the house."

Somebody throws something at him. The rest of it is said by everybody at once and
the panel is still waiting for it.
```

**The phrase, unprompted** — rule 2, unconditional:
```text
And the slow one, quietly, to whoever is nearest, in a voice that is enjoying
itself:

"Go on. Say it. He's not going to open that door till somebody says it."
```

> **Note — canon 122, and where a word of Luke's may live.** Luke's three words
> are his and this wave does not lend them to anybody. The assist's rule 1 is a
> *recording of Luke*, made out of what four people remember of one afternoon,
> and the family's response to the habit is to throw something at him. It is the
> only place in the game the joke about the words is told from the inside, it is
> told once, and **nobody explains it**. If the player never spoke to him, rule 2
> fires and nothing is lost.

---

## 23. The room completes — `act4_ev_chamber_complete`

`once`, `when: { all: [{ flag: act4_chamber_first_done }, { flag:
act4_chamber_copy_found }, { flag: act4_chamber_phrase_said }] }`. Sets
`act4_chamber_complete`, `act4_deep_index`, grants `act4_clue_room_completed`,
answers `act4_q_the_room` via P23's `onSolved`.

```text
The timer stops without finishing.

And then, for about as long as it takes to breathe in, the kitchen is a kitchen.

All of it at once. Printing on every tin and a maker's name on the stove and a
water stain on the ceiling in the shape of a country. Handles, catches, a
calendar on the back of the door with a farm on it. The pattern in the curtain
running edge to edge. Grain in the wood of the chairs and dust on the top of the
picture rail and the particular grey of an afternoon in that county at that time
of year, coming in through a window nobody looked out of.

And a great deal of noise: chairs, cutlery, a door somewhere else in the house, a
dog, all of them at once, and under it the sound a house makes with people in it,
which is not the sound of any one thing.

Then the lights go out.

Not off — down, all of it, the way a room goes when the last person out of it has
put a hand on the switch. It is dark, and it is not empty. Something the size of
a kitchen full of people is in here with you and it is finishing its afternoon: a
chair going back, somebody's shoulder past your shoulder, the smell of coats
coming off hooks, a voice at the far end saying something you do not catch to
somebody who laughs at it.

The back door opens on a corridor with strip lights in it.

By the time you have turned round, the standby light is up. The tins have no
labels. The cupboards have no handles.

There is nobody in the middle of the floor and there is no gap in the light where
nobody is.
```

> **Note — the dark, spent.** D4 §17 recorded the rule: *the day a dark room in
> this game contains something, the device is finished, and it should be Act
> IV's.* This is that day. It is spent here, once, on a kitchen leaving a
> kitchen, and **it contains no face, no player, and nothing that touches
> anybody.** E3 does not get a second one.
>
> **Never a face.** The word *face* does not occur in this block; the plan's test
> asserts it. The completion is a room being finished with a man, not a man being
> shown himself.

---

## 24. The print against the room — `COMPARE PRINT WITH ROOM` / `COMPARE PHOTOGRAPH WITH KITCHEN`

`withInstrument: [act4_print_last_day]`, in `act4_escape_chamber`. Grants
`act4_clue_harvest_wrong`.

```text
You hold it up and stand where the camera stood, which is not difficult, because
there is only one place in this kitchen a camera can have been.

Everything lines up. The window in the same place, the dresser in the same place,
the chip in the beading, the stove, the hooks with a coat on every one of them,
the burn on the counter beside the ring.

The good cloth is on the table.

On the table, laid on, squared up at the corners, with the plates on top of it.
It is four feet from you, folded on the dresser, with the crease gone shiny.

The people this room was built out of were not looking at the tablecloth,
because none of them had to be: it was on, the way it was always
on when the good cloth went on, and a thing that is always true is the first
thing to go.
```

> **Note.** *One detail the harvest got wrong, no count* — the plan's constraint,
> held. There is exactly one and the response does not go looking for a second.
> The last paragraph is the closest this wave comes to the narrator explaining a
> mechanism; it is about a tablecloth, and I think it earns it. §55.2 quarantines
> the version that was about people.

---

## 25. Through the second frame — `act4_enter_hab` and `act4_leave_hab`

Four blocks: out for the first time, out subsequently, back for the first time,
back subsequently. `advanceClock: 10` each way.

### 25.1 First crossing — Hub → `act4_hab_galley`

```text
The dark frame is dark until your hand is in it, and then your hand is in a
white-painted steel box the size of a shower with a lamp in the ceiling and a
grab rail down both sides.

Behind you, where the archive hub was, there is now an oval door with a bar
across it and a gasket round it and a small round window in it, and through the
window there is grey cord carpet and a bench.

On a rack: suits, hanging by the shoulders, in a line by size. You take the
second-smallest and get into it the way the laminated card on the wall says to,
which is legs, arms, seal at the waist, gloves, helmet, and check the seal at the
waist again because everybody forgets the waist.

Nothing about the suit fits. It is a size, and you are a person, and it is
adequate.

Then the card runs out of instructions and there is a green switch.

The pump takes a long time. It is not dramatic; it is a pump, and it goes on
being a pump, and the noise of it drops away in stages as there gets to be less
and less air to carry it. The last stage is the one that means something: your
own breathing, close, inside a helmet, with nothing else in the world in it.

The far door unseals. The gauge over it has been sitting on the same figure for a
while and the light beside it goes from amber to green.
```

### 25.2 Later crossings out

```text
Suit off the rack, legs, arms, waist, gloves, helmet, waist again. Green switch.

The pump, and the noise going down in stages, and at the bottom of it your own
breathing.

Green light. Ten minutes of your life that you cannot do anything else with, and
you will do them again on the way back.
```

### 25.3 First crossing back — Galley → Hub

```text
The lock the other way is worse, because coming in you can hear it happening:
nothing, then a thin whistle somewhere above the helmet, then the whistle getting
a body to it, and then air, with the pump grinding under it, and then the suit
going soft against you all at once as the pressures come level.

You get the helmet off and the cold that comes in at you is a room's cold and
not a planet's, and it smells of the inside of a suit rack.

The oval door swings and there is grey cord carpet on the other side of it and a
steel bench with a terminal on it, and a well at the end of the room with a door
at the bottom.

You hang the suit up by the shoulders in the space it came out of, which is the
second space from the small end, and the rack looks exactly as it did before you
touched it.
```

### 25.4 Later crossings back

```text
The whistle, the air coming up, the suit going soft. Helmet off. Ten minutes.

The suit goes back second from the small end, and the rack is the way it was.
```

> **Note — declining the echo.** *The hat fits* is on the recontextualization
> list and pays at the record; a suit that fitted would spend it early and badly.
> The suit is a size off a rack and it is *adequate*, which is what suits are.
> §52 records the decline.

---

## 26. The Galley & Comms — `act4_hab_galley` — three `ProseRule`s

`area: 'act4'`. Exit `up` → `act4_hab_dome`; the airlock (§30) is an object, not
an exit (§56.4). Standard tier.

### 26.1 Rule 1 — first sight

```text
The inner door comes off its seal with the noise of a jar being opened, and you
are in a galley.

It is small and everything in it is doing at least two jobs. A table folds down
off the bulkhead with a lip round the edge of it and restraints on the seats that
nobody has used in a long time; one of them has been tied out of the way with a
bootlace. Overhead, a run of stowage in soft bags, each with a printed square on
it and a handwritten word under the printed square.

Along the far bulkhead, a comms rig, awake, with one green light on it.

Under the rig, on a shelf, there is a terminal, and it is on.

You have seen this terminal before. It was in a room with a bed in it and a
window onto a street. It was behind a curtain at the back of a gift shop with a
generator running outside. It was on a steel bench under a building, with a well
at the end of the room.

Here it is showing a clock.

Under a lamp on the end of the counter, a shallow tray of something green, and
beside it a shallow tray of something that was.

There is a ladder up through a hatch in the ceiling, and through the hatch it is
black.
```

### 26.2 Rule 2 — `when: { npcAt: [act4_sissy, here] }`

```text
The galley: the fold-down table, the stowage overhead, the rig with its green
light, the terminal with its clock, the trays under the lamp, and the ladder up
through the hatch.

She is at the table with her feet hooked under the seat rail.
```

### 26.3 Rule 3 — unconditional

```text
The fold-down table with the bootlace on the restraint, the stowage bags
overhead, the rig, the terminal, the trays, and the ladder going up into the
dark.

The fan runs. It is the loudest thing in here by a distance, and it is not loud.
```

### 26.4 Room-level senses

`SMELL`:
```text
Warm plastic, a lamp over damp soil, and — a long way under those — the smell of
somebody's cooking from a while ago that has nowhere in this building to go.
```

`LISTEN`:
```text
The fan. Something cycling behind a panel every so often and cutting out again.

And a sound so far down under both of them that you have to stop breathing to
have it, which is the pump in the airlock keeping the seal you came through where
it ought to be.
```

`LOOK UP`:
```text
Stowage, cable runs in a tray, a light with a wire cage on it, and a hatch with a
ladder going up through it into a room that has no light on in it.
```

---

## 27. The anomaly logs — `act4_anomaly_logs`

`portable: false`. Nouns: logs, log, reports, report, anomaly, anomalies,
printouts, file, folder, binder, clip. Adjectives: anomaly, filed.

### 27.1 `EXAMINE` / `READ LOGS`

```text
On a clipboard by the rig, a wad of printouts on the flimsy paper a thermal
printer uses, going brown at the edges where the top sheets have been in the
lamp.

Every one of them is the same form. A date field she has filled in by hand. A box
for the observation. A box underneath for the response.

The observations get shorter as they go down the wad. The early ones are
paragraphs, with the field of view given and the exposure and the equipment. In
the middle they are two lines. Near the top of the pile — which is the recent end
— one of them says only: same as 14 through 31.

Every response box on every sheet has the same word typed into it by something
that is not a person.

HANDLED.
```

> **Note.** *Same as 14 through 31* is a figure read off a sheet, which canon 89
> permits and which is not the narrator counting. The wad's thickness is never
> given, the number of sheets is never given, and the narrator does not say how
> long a year is.

### 27.2 `TAKE LOGS` / `TAKE CLIPBOARD`

```text
The clip comes up and the wad comes off it and it is a double handful of thermal
paper, which is the least durable material anybody has ever chosen to put a
record on.

It has been through a printer, which means it came down a wire, which means it is
a copy of something that a machine agreed to print.

You put it back under the clip. It is not the thing you came for and you knew
that before you picked it up.
```

---

## 28. The comms rig — `act4_comms_rig`

`portable: false`. Nouns: rig, comms, radio, transmitter, set, key, console,
link, uplink. Adjectives: comms, radio.

### 28.1 `EXAMINE`

```text
A grey box in a rack with a handset on a hook, a keyboard on a shelf under it,
and a small screen with a queue on it.

The queue has two columns, OUT and IN, and the OUT column is longer.

Beside the screen, printed on a strip of dymo tape and stuck to the rack by
somebody who wanted to be able to see it without turning their head: LINK DELAY
NOMINAL — ALLOW FULL ROUND TRIP.
```

### 28.2 `SEND MESSAGE` / `USE RIG` / `TYPE ON RIG` — **never flagged**

```text
You type something short into the OUT field. It does not matter what; it is the
sort of thing you put in a box to see what the box does.

You put your hand on the key and send it.

The reply is on the screen before your hand is off the key.

It is a correct reply. It is addressed correctly and it answers what you asked
and it is signed by a desk with a name and a number, and it arrived in less time
than it takes to lift a hand off a switch, and the strip of dymo tape says to
allow the full round trip.

She has told you what the round trip is. She was told it too.
```

> **Note — no clue object, no flag, and no figure.** The architecture is explicit
> that this is *never flagged*. **The four seconds are never given a number** —
> the measure is *less time than it takes to lift a hand off a switch* — and the
> twelve minutes are Sissy's to say, in §32.7, in her mouth, once. The player
> does the arithmetic or he does not; the narrator does not do it for him, and no
> clue records it. This is the only reveal in the wave with no `grantClue`
> anywhere near it and that is deliberate.

---

## 29. The hab terminal — `act4_hab_terminal` — **L3 station four**

`portable: false`. Nouns: terminal, computer, screen, monitor, keyboard, keys,
station, clock, machine.

### 29.1 `EXAMINE`

```text
The same beige. The same deep grey screen with the phosphor even the whole way
across. The same keyboard with the same three keys worn shiny and the same key
missing off the top row.

It is not showing a prompt. It is showing a clock: hours, minutes, and a seconds
field going over, in the middle of the screen, in characters four times the
height of the rest of the character set, the way a machine displays a thing when
there is nothing else it has been asked to do.

The clock agrees with the clock on the bench under the building.
```

> **Note — canon 112, and the one new thing.** D1's three clauses of recognition
> are in the room's own first-sight block (§26.1); this is the object's closer
> look. **The one new thing is that this station is not asking anybody
> anything** — every other station in the game wants a user, and this one is
> showing the time. That the time is the facility's is stated flatly and **nobody
> remarks on it**; a player who does the subtraction between two planets is doing
> it on his own.

### 29.2 `TYPE` / `USE TERMINAL` / `LOG IN` / `TYPE ADMIN`

```text
You put your hands on it and type, and the characters do not appear.

Not refused. Not rejected. There is no prompt to type into, no cursor, no line at
the bottom of the screen where a line goes, and no response of any kind to a
keyboard being used.

The clock goes over.
```

---

## 30. The airlock door — `act4_airlock_door`

`portable: false`. Nouns: airlock, lock, hatch, oval door, inner door, bar,
gasket, seal, window. Adjectives: inner, oval, airlock.

### 30.1 `EXAMINE`

```text
An oval door in the bulkhead with a bar across it and a gasket in a channel round
it that somebody keeps greased, and a round window at head height.

Through the window: white paint, a grab rail, a suit rack with a gap in it second
from the small end, and, on the far side of that, a room with grey cord carpet in
it and a bench with a terminal on the bench.

That is the wrong thing to be able to see out of the window of an airlock and it
is what is out of the window of this one.
```

### 30.2 `OPEN` / `ENTER AIRLOCK` / `OUT` — runs `act4_leave_hab`

Text is §25.3 / §25.4.

---

## 31. The galley table and the trays

### 31.1 `act4_galley_table` — `EXAMINE`

Nouns: table, galley table, seat, seats, restraint, restraints, bootlace, lip.

```text
A steel top on a hinge, with a lip round it a quarter-inch proud, and two seats
that fold out of the bulkhead under it.

There are rings on the steel where a hot cup has been put down and left, and they
are all in the same place, and there is a groove worn in the lip in front of that
place from a forearm.

She sits on that side. Nobody sits on the other side, and the restraint over
there is tied out of the way with a bootlace so that it stops hitting the wall.
```

### 31.2 `act4_hab_trays` — `EXAMINE`

Nouns: trays, tray, plants, plant, garden, soil, lamp, green, seedlings.

```text
Shallow trays under a lamp with a red-purple cast to it that makes everything
under it look like a photograph of itself.

The near one has something green in it in rows, thin and doing well enough, with
the soil dark and level and the runs of it tucked in round the stems by a finger.

The far one has stalks in it. Dry, upright, the colour of paper, with the seed
heads still on. Nobody has emptied it and nobody is going to.

There is a plastic label pushed into the dead one with a word on it in pencil,
and the pencil has gone silver the way pencil does under a lamp like that, and
the word is still legible and is the name of a herb.
```

---

## 32. Sissy — `act4_sissy`

`name: 'Sissy'`. Nouns: sissy, astronaut, woman, sister, her. Schedule: the
Galley on morning / afternoon / evening, the Dome at night — the facility's phase
table, unremarked (canon 112).

### 32.0a `description`

```text
She is at the fold-down table with her feet hooked under the seat rail and a
valve body in bits on a cloth in front of her, doing something to it with a pick,
and she looks up when the seal goes — not startled, not pleased, in the way you
look up when a thing happens at about the time it happens.

Small, and rope-thin the way people get when the food is adequate and the work is
constant. Hair cut by herself with clippers and growing out of it. A crew shirt
with the sleeves buttoned at the wrist, which in a room this warm is a choice,
and it is not a choice she offers you any part of.

She puts every piece of the valve down inside the lip of the table, every time,
without looking at where she is putting it. Not one of those pieces was ever
going anywhere. It is a habit out of somewhere that is not this room.
```

### 32.0b `greeting` — two rules

Rule 1 — first meeting:
```text
"You came through the lock," she says.

She has not stood up. She turns the pick over and puts it down inside the lip.

"That's fine. I'm going to be honest with you: I stopped assuming things about
who is on the other side of that door about eight months ago, and it has made me
much easier to live with." A pause that is not for effect; she is looking at the
suit rack behind you and doing arithmetic. "You hung it up second from the small
end."

"Sit down. Mind the seat on your side, the restraint's tied off."
```

Rule 2 — subsequently:
```text
She moves the cloth over an inch so the other seat has table in front of it.
```

### 32.0c `unknownTopic` — three, in rotation

```text
"No," she says, pleasantly, and goes back to the valve.
```

```text
"I could invent something. I have a lot of time and I have got very good at it,
and I have decided it is a bad habit."
```

```text
She thinks about it properly, which is worse than being brushed off, and then
shakes her head once. "That's not one I've got."
```

### 32.1 `topic_sky` — `ASK SISSY ABOUT THE SKY` / `ABOUT THE STARS` / `ABOUT THE ANOMALY` / `ABOUT THE REPORTS`

```text
"I file it every time and it comes back handled."

She wipes the pick on the cloth and does not pick anything else up, which is the
first time her hands have been still.

"It started as a calibration problem, which is what everything starts as. You get
a field you know, you put the camera on it, you compare it to the plate, and if
it doesn't match you have got a bad mount or a bad clock or a bad you. I did the
mount. I did the clock. I did me, twice, and I got somebody at Flight to do me a
third time without telling them why."

"It matches. That's the thing I keep having to say to people who have stopped
reading by then. It matches the plate. It matches it too well. There is a
tolerance you are supposed to see and I am not seeing it, and I have not seen it
for a year, and I have written that down forty different ways and every one of
them comes back with the same word in the box."

"Handled." She says it without any weight on it at all. "It is a very good word.
You can't argue with it. There's nothing in it to argue with."
```

### 32.2 `topic_film` — two rules — **P24's `C` route**

Rule 1 — `when: { memory: act4_mem_m11 }` — hands over `act4_sissy_film`:
```text
"You want the film."

She is up before she has finished saying it, and along the galley, and into a
stowage bag by the third handhold that she does not have to look for.

"I was told to stop shooting chemical eleven months ago. It's mass, and it's mass
that comes back up, and there's a very good argument for it that I agree with and
have not acted on." The canister comes out taped round the join, the grey kind
with a grey lid. "I have been shooting one roll a month since, on a tripod,
exposures long enough to do the job, and I have not sent one frame of it
anywhere, because the whole point of the argument I am having is that the
pictures keep arriving correct."

She holds it out and does not let go of it straight away.

"There is no darkroom on this station. There is nowhere within a very long way of
here that there is a darkroom. If you are going to do this, do it properly, and
if it comes out and I am wrong I would quite like to be told that as well."
```

Rule 2 — unconditional:
```text
"Who told you about that?"

It is not hostile. It is the flat question of somebody who has been careful about
one thing for a year and has just found out that the care may have been
decorative.

"No. Not yet."
```

### 32.3 `topic_luke` — `ASK SISSY ABOUT LUKE` / `ABOUT THE PRESIDENT`

```text
"He writes. He is the only one of them who has never once missed."

She turns the valve body over.

"Three paragraphs. Ask after the work, one thing about a bill, one thing about
the weather where he is, and a line at the bottom that is trying to be funny. I
could set my watch by it, and I have, more or less, because there is nothing else
up here that arrives on a schedule."

"They are very good letters and I could not tell you one thing that has ever been
in one of them."
```

### 32.4 `topic_launch` / `topic_brothers` — sets `act4_sissy_topic_launch`, grants `act4_clue_sissy_counts_three` — **M11 fires after this**

```text
"Everybody watched it, is the answer you're after. Everybody who could."

She counts them off on the back of her hand with the pick, which is a thing she
would not do if she were thinking about doing it.

"The oldest of the boys had a field and a truck and he had the rest of them out
in it, which took organising, and he is the one who organised it, because he was
the one who organised things. The one who does energy watched it in an airport
and told me about the airport for an hour afterwards. And the youngest of them
drove eleven hours to be in the field, which he has never once mentioned to me,
which is how I know it was eleven hours."

She stops, and looks at the hand for a second the way you look at a sum that has
come out, and goes back to the valve.

"Three brothers, and all three of them in a field in the dark looking up at a
thing they could not possibly see yet. My mother would have hated it. She'd have
made them come inside."
```

> **Note — the gap.** She counts to three by describing three men, *the oldest of
> the boys* first — and the oldest of the boys is not the one who does energy or
> the one who drives. She does not notice, and the narrator does not notice for
> her, and there is no clue text that lays it out. **M11 fires on the next tick
> and says four.** The player holds the two of them together and nothing in the
> game ever does.

### 32.5 `topic_jules` — `ASK SISSY ABOUT JULES` / `ABOUT THE MISSING ONE` / `ABOUT I` / `ABOUT THE TATTOOS` — grants `act4_clue_sissys_reason` — **canon 110**

```text
"I don't know that name."

She says it the way she says everything, which is without hedging, and then she
sits with it for a second longer than the sentence needed.

"The numbers, though. I know about the numbers, and I know what you are going to
ask, because everybody does eventually."

"The first one didn't take. That's all it is. The man did it, and it looked right
the day it was done, and inside a year it had gone to a smudge — which happens; a
single upright is the hardest thing on that whole sheet to keep, because there is
nothing in it for the skin to hold on to. And rather than sit that one back down
in the chair and put him through it again, my father moved everybody up a place,
and the sheet started at two, and that was that."

She has said this before. It has the shape of a thing said before.

"Which of them was it on?"

The pick goes down inside the lip of the table.

"It'll be one of the boys," she says. "Ask my brother the one who does energy; he
remembers that day better than any of us. He was six and he has never once shut
up about it."
```

> **Note — canon 110 and canon 113.** Her slot is *the first one didn't take*.
> Eli's shipped reason is that the parlour **refused** to put a single upright on
> skin at all; hers is that they **did** and it failed. Luke's is that there was
> never one to fail. All three are certain, no two agree, **none mentions birth
> order**, and the response's last line sends the player to the man whose account
> contradicts hers flattest — cheerfully, as a helpful suggestion.

### 32.6 `topic_jack` — `ASK SISSY ABOUT JACK` / `ABOUT THE TRUCK`

```text
"Eleven hours," she says. "He drove eleven hours to stand in a field and he has
never told me and he never will."

"He writes, and his letters are the ones that read like a man doing homework. I
know exactly what they cost him and I would not swap one of them for the whole of
the other correspondence."

"He asks me a question in every one. Nobody else asks me a question."
```

### 32.7 `topic_comms` — `ASK SISSY ABOUT THE RIG` / `ABOUT THE DELAY` / `ABOUT MESSAGES` — **the twelve minutes are hers**

```text
"Twelve minutes each way," she says. "That is what we were told at the start and
it is what is on every timeline anybody has ever sent me, and it is why you do not
have conversations up here, you have correspondence."

"You learn to write a message that does not need an answer. Everybody who does
this learns it. You put the question at the top and then you put everything the
other end is going to need in order to answer it underneath, because if you get
that wrong you have spent half an hour finding out that you got it wrong."

She looks at the rig for a moment, and then at the queue on it, and then at the
valve.

"I am extremely good at it now," she says. "That is not the compliment it sounds
like."
```

### 32.8 `topic_home` — `ASK SISSY ABOUT HOME` / `ABOUT THE HOUSE` / `ABOUT THE PORCH`

```text
"The porch," she says immediately, which surprises her more than it surprises
you. "That's what I've got. Not the house. The porch, and the top step, and the
noise the screen door made, which I could do for you now."

"The rest of it comes and goes. I can tell you the arrangement of a kitchen I have
not been in for a long time and I could not tell you the colour of any of it."

She goes back to the valve.

"I sit up in the dome at night and I have got into the way of putting that porch
under it. Which is not what the dome is for. But you have to put something under a
sky or it is only a lot of light with nothing to be over."
```

> **Note.** She has the porch, she does not know its sky, and the response does
> not say so. R17 is one room and one hour away when this is read and **nothing
> here points at it.**

### 32.9 `showResponses`

**`SHOW NIGHT-SKY POLAROID TO SISSY`** — `act1_intact_polaroids` — the `K` route
to the canister:
```text
She takes it in both hands, which she has not done with anything else you have
seen her handle, and holds it under the lamp at the wrong angle for looking at a
photograph and the right angle for keeping the lamp out of it.

She looks at it for a long time. Long enough that the fan cycles.

"Who took this?"

You tell her when, roughly, and where, roughly, and she nods at each of those
without taking her eyes off it, and puts it down on the cloth, and gets up and
goes along the galley to the third handhold.

"It's out of focus," she says, with her back to you, in the voice of somebody
being scrupulous about the one thing that is going to matter later. "I want that
on the record. It is badly out of focus and you cannot prove anything with it and
neither can I."

She comes back with the canister and puts it on the cloth next to the Polaroid,
and moves the Polaroid a little so that they are square with each other, and does
not appear to know she has done it.
```

**`SHOW PORCH POLAROID TO SISSY`**:
```text
She looks at it for a second and hands it straight back.

"That's the porch," she says.

Then, going back to the valve: "There's a man on the left of that I could not put
a name to and I have been looking at that step my whole life."

She does not say it as though it troubles her. She says it the way you mention a
draught.
```

**`SHOW FEDORA TO SISSY`** — nothing (D1 §23):
```text
"It's a hat," she says.
```

---

## 33. M11 — *One Sky* — `act4_mem_m11`

`{ all: [{ met: act4_sissy }, { flag: act4_sissy_topic_launch }] }`. Family
stratum; counts toward P23's cluster.

```text
A field with the truck backed into it and the tailgate down and four of us up on
the bed of it with our necks back, and the cold coming up out of the ground into
the metal into us.

The one who does energy had worked out to the minute when it would clear the
horizon and had told everybody twice. The youngest of the boys had driven all day
and would not say so. I had the blanket, because I was the oldest, which is not a
privilege, it is a duty about blankets.

And the sky over that field was the sky over that field: the whole enormous
ordinary lot of it, going all the way down to the fence line, with nothing of hers
in it yet.

We watched a nothing for a long time and then there was a thing in it going up,
and one of them said her name, and none of us said anything else at all.
```

> **Note — four, and the youngest not yet in it.** The fragment says *four of us*
> in the player's own remembered voice — the four brothers — and the narrator
> does not count them anywhere; the memory names its own arithmetic the way a
> person does. Sissy's *three brothers* is one topic and one tick away in either
> direction. **No line, clue, question or hint ever puts the two numbers side by
> side.**

---

## 34. The Observation Dome — `act4_hab_dome` — three `ProseRule`s

`area: 'act4'`. Exit `down` → `act4_hab_galley`. Standard tier,
polish-priority — the quietest room in the game (guide §5).

### 34.1 Rule 1 — first sight

```text
Up the ladder, and then there is nothing over your head.

The dome is one piece of whatever glass is when it has to do this job, seamed
into a steel ring at hip height, and above the ring it is all sky, and it comes
down past you on every side until it stops at the ring, so that you are standing
in the sky up to the waist.

Below the ring, all the way round, the ground. Regolith the colour of a brick
left out in the weather, going away flat and then not flat, with a wheel track
cut across the near part of it and the track's own shadow lying in it.

Under the dome: a chair, bolted down, set back from the ring so that a person in
it is looking up and not out. Beside the chair a tripod, and on the tripod a
camera with its lens straight up at the top of the dome and a cable release
hanging off it in a loop.

There is no fan in this room. That is the first thing you notice about it after
the sky and it is the thing you keep noticing.
```

### 34.2 Rule 2 — `when: { npcAt: [act4_sissy, here] }`

```text
The dome, the ring, the ground going away under it, the tripod and the chair.

She is in the chair with her head back and her hands in her lap and she does not
turn round.
```

### 34.3 Rule 3 — unconditional

```text
The sky, the ring, the ground, the chair, the tripod, and no sound at all except
the ones you are making.
```

### 34.4 Room-level senses

`LISTEN`:
```text
Nothing.

Not quiet — there is no fan up here and no pump and no cycling and no hum in the
structure, and what you get instead is your own body, which is loud, and which
you are not used to being the loudest thing in a room.
```

`SMELL`:
```text
Cold glass and clean steel, and the galley's cooking a long way down the ladder
behind you.
```

---

## 35. The dome glass — `act4_dome_glass`

`portable: false`. Nouns: glass, dome, pane, ring, seam, seams, steel ring.

### 35.1 `EXAMINE`

```text
Thicker than you want it to be and clearer than glass that thick has any right to
be, with the ring bedded into it at hip height in a channel of black compound run
in by somebody with a gun and a steady hand.

There are no seams in it above the ring. It is one piece. You can walk the whole
way round the ring with a hand on the glass and find nothing in it: no join, no
lamination line, no distortion where a pane would end.
```

### 35.2 `TOUCH GLASS`

```text
Cold.

That is the whole of what it is. It is cold the way a window is cold on the
inside on a hard night, and your hand takes the cold, and the flat of your palm
leaves a mark on it that goes away from the edges inward.
```

> **Note — the seams are not in the glass.** This is the response that makes R17
> possible: the player is invited to look for a seam here and there is not one
> here, so that when the seams turn up on a piece of film in a library basement
> in South Dakota they are somewhere else entirely. **Do not put a seam in this
> glass.**

---

## 36. The horizon — `act4_horizon`

`portable: false`. Nouns: horizon, ground, regolith, dust, surface, track, wheel
track, tracks, planet, mars, outside, landscape.

### 36.1 `EXAMINE`

```text
It goes away from the hab flat for a long way and then it does not, and where it
stops being flat it does it in the round-shouldered way of country that has had a
very long time and no water to speak of.

Close in, the ground is not smooth. It is grit over a crust, and the crust is
broken up round the hab where things have been walked on it, and the wheel track
comes in from the left and goes round out of sight behind the structure. The
track has a shadow in it, which means the sun is low, which means it has been low
for a while.

There are rocks. There is nothing else. There is not one thing out there that was
not out there before anybody came.

It is a planet. It is being one extremely convincingly and without any effort at
all, and that is the last time anybody in this room is going to be able to say
so.
```

> **Note.** *The planet played straight* — the plan's own instruction, held for
> four paragraphs. The last one is the only place the wave nudges, it does not
> nudge at the sky, and it is the closest thing to a wink in the room. §55.1
> quarantines the sharper version.

---

## 37. The sky — `act4_sky`

`portable: false`. Nouns: sky, stars, star, night, field, constellation,
constellations, arrangement.

### 37.1 `EXAMINE`

```text
Points.

Hard, still points, on a black with nothing in it — no haze, no colour at the
bottom of it, no gradient anywhere. There is no air out there to make any of them
move, so none of them does, and a sky where nothing twinkles is the single
strangest thing you have looked at in three weeks of strange things, and it takes
about a minute to work out why.

They are of different sizes. Not brightnesses — sizes, and you can see it without
an instrument: a big one over the wheel track with a long shallow
triangle of smaller ones under it, and a close pair below and to the left of
that.

The eye keeps going back to those. Not because they are the brightest. Because
they are the shape the eye has decided to hold on to, which is how anybody has
ever found anything in a sky.
```

> **Note — where R17 is loaded.** The bright one, the shallow triangle, and the
> close pair are named here, named again in §37.3 against the Polaroid, and named
> a third and last time in §46 against the film. **They are the same three
> features every time and they are never counted into a total.** The player
> learns an arrangement the way you learn one, which is by being shown it three
> times in three places.

### 37.2 `COUNT STARS` — **the refusal** (canon 93)

```text
You ask yourself for a number.

What comes back is the bright one, and the triangle under it, and the close
pair, and then the bright one again — because that is what the eye does with a field it
has not been given any way to organise. It finds the shape it already knows and
hands you that instead, over and over, and it will go on doing it all night and
you will not get a total out of it.

You are not the instrument for this.

There is one in this room, on a tripod, pointed straight up, with a cable release
hanging off it.
```

> **Note — canon 93, and a refusal that teaches.** The response says a number was
> asked for and produces none: no digit, no number word, no range, no *about*, no
> *dozens*. It also does the thing the project's own standard asks a failure to
> do, which is teach — it points at the camera. **§53 q6 flags that as the one
> liberty**; the architecture's own line for this room was *count them, they
> repeat*, and this is the closest a narrator who may not count can get to it.

### 37.3 `COMPARE POLAROID WITH SKY` — `withInstrument: [act1_intact_polaroids]` — grants `act4_clue_same_arrangement`

```text
You hold it up at arm's length with the gutter line along the bottom of the ring
and turn slowly until it stops being wrong.

It stops being wrong facing the wheel track.

The bright one is where the bright one is. The triangle under it has the same
lean and the same proportions. The close pair sits below and left of it at the
same distance and the same angle, and there is a faint one under the pair on the
Polaroid and there is a faint one under the pair up there.

The Polaroid is out of focus. It has been out of focus since you took it out of a
box in a corridor, and out of focus is what it is going to stay: the stars on it
are soft discs of different sizes and there is nothing in any of them, and
anybody could tell you that a blur is not evidence and would be right.

But a blur has a position.

You take it down and put it away, and stand in a dome on another planet with a
photograph of a porch roof in your inside pocket, and you would like a better
photograph.
```

---

## 38. The camera — `act4_camera` — the `St` route to the canister

`portable: false`. Nouns: camera, tripod, lens, body, release, cable release,
shutter, back.

### 38.1 `EXAMINE`

```text
A chemical camera, and not a cheap one: a metal body on a proper head, with the
lens straight up at the top of the dome and a cable release screwed into the
shutter and hanging in a loop off the leg.

There is tape over the frame counter with a number written on the tape in pencil,
and the tape has been written on and crossed out and written on again a number of
times.

The back has a film in it. You can see the cassette through the little window
where the manufacturers put a little window precisely so that people would stop
opening the back to check.
```

### 38.2 `TAKE FILM` / `OPEN CAMERA` — `when: { not: { npcAt: [act4_sissy, here] } }`

```text
You wind it back — the crank comes up out of the top plate and turns, and the
tension goes off it all at once at the end, and you keep going two turns past
that out of caution.

The back comes open on a hinge that has been opened a lot. The cassette comes out
into your hand, warm from nothing, and goes into your pocket.

The camera stays as it is: on the tripod, pointed straight up, with the cable
release hanging in a loop off the leg and the tape on the counter that will need
crossing out.

She does not ask for it back. Not that day and not any day.
```

### 38.3 `TAKE FILM` with Sissy present

```text
Your hand goes to the back of it and she says, without turning round in the
chair, "Ask me."

She does not sound annoyed. She sounds like somebody who would rather be asked.
```

---

## 39. Her chair — `act4_dome_chair`

`portable: false`. Nouns: chair, seat, her chair, cushion, arm, arms.

### 39.1 `EXAMINE`

```text
An ordinary steel-framed chair, bolted through the floor at the corners, set back
from the ring at the angle that makes a person in it look up.

The seat is worn through on one side and not the other. The right arm has the
finish off it. There is no book on it, no cup ring, no cushion, no blanket, and
nothing tucked down the side, because whatever she does in this chair does not
require any of those.

The bolts are not original. Somebody moved it, once, and got it right, and has
not moved it since.
```

### 39.2 `SIT IN CHAIR` — with Sissy elsewhere

```text
You sit down in it and your head goes back because the chair makes it go back,
and the ring drops out of the bottom of your vision, and there is nothing in
front of you that is not sky.

It is a very good chair. Whoever set the angle spent an evening on it.

After a while you notice that you have stopped looking at the bright one and the
triangle and the pair, and have started looking at the black between them, which
has nothing in it at all and goes on having nothing in it for as long as you are
prepared to keep looking.
```

---

## 40. Her log — `act4_sky_log`

`portable: false`. Nouns: log, logbook, notebook, book, sky log, entries, pencil.

### 40.1 `EXAMINE` / `READ LOG`

```text
A hardback notebook wedged between the chair leg and the floor bracket, with a
pencil down the spine and the covers gone soft.

Handwriting, all of it hers, every entry starting with a number she has written in
the margin and ruled off. The numbers run on down the page and over onto the next
one and you leave them alone; they are hers, and they are a filing system, and a
filing system is nobody's business.

The entries themselves are short and get shorter.

Cloud, if that is what we are calling it.

Nothing. Sat two hours. Recommend nothing.

Went round the whole thing twice with the reticle. It is the plate. It is exactly
the plate.

Filed. Will file again.

And near the back, on its own, in the same pencil and a lot smaller:

If it is right then it has been right the whole time, which is worse.
```

> **Note — canon 70 and the numbers she wrote.** She numbers her entries and
> **the narrator does not read the numbers**: they are named as existing, ruled
> off, and left. This is the one place in the wave where a total is physically
> present on a page in front of the player and the prose walks past it.

---

## 41. The Chamber's exit, and the hall

`act4_escape_chamber` exit `w` / `out` → `act3_s6_archive_hub`. `travelText`:

```text
The hall is a hall for about four feet — beading, gloss, a strip of carpet, the
bottom of a staircase you do not get to see the top of — and then it is concrete,
and there is a bench along the right-hand wall with a terminal on it.
```

---

## 42. The library, and the door under it

The darkroom is a **scene**, not a room (canon 109). Everything below hangs on
`act1_darkroom_door` and one new object in `act1_county_library`.

### 42.1 `act4_annex_shelf` — `EXAMINE` / `SEARCH SHELF` / `SEARCH COUNTER` / `LOOK UNDER BOOK` — reveals `act4_darkroom_key`

Nouns: shelf, counter, ledge, bracket, underside. Adjectives: annex, wooden.

```text
The sign-in book lives on a shelf by the door — one board on two brackets, put up
by somebody who had a board and two brackets.

Underneath it, out of anybody's eyeline and inside the reach of anybody who has
worked here, there is a strip of gaffer tape stuck across the underside of the
board with a key held flat against the wood by it.

The tape has gone hard and yellow and lets go all at once.
```

### 42.2 `act4_darkroom_key` — `EXAMINE`

```text
A long key for a mortice lock, older than the door it belongs to by the look of
it, with a bow you could hang a picture on.

Somebody taped it under a shelf rather than take it home, which is what people do
about a key they are not supposed to have and are not prepared to give back.
```

---

## 43. Opening the darkroom — sets `act4_darkroom_open`

### 43.1 `PRY DOOR WITH CHAIR LEG` — the leg's fourth

```text
The frame is soft where the frame always goes soft, which is the bottom eight
inches on the hinge side, and the leg goes in there and stays.

It is not a fast job. It is three separate leans with a rest in the middle of
them, and at the end of the third the screws come out of the keep rather than the
lock coming out of the door, which is the good outcome and is not the one you
were expecting.

The door swings in about a foot and stops against something soft on the other
side of it, and the smell that comes out of the gap has been in there a very long
time.
```

### 43.2 `UNLOCK DOOR WITH KEY` — the `K` route

```text
The key goes in the whole way and turns with the long slow travel of a mortice
that somebody looked after for a great many years and nobody has touched since.

The door swings in about a foot and stops against something soft, and the smell
that comes out of the gap has been in there a very long time.
```

### 43.3 The door, once open — `EXAMINE`

```text
Open a foot on a room that has no light in it, with a heavy curtain hung inside
the frame on a rail so that the door and the curtain cannot both be open, which
is the whole idea.

The bulb in the red glass shade over the door is not lit. There is a switch for
it, on the outside, where a switch for it has to be.
```

---

## 44. The darkroom scene — `act4_develop`

`ENTER DARKROOM` / `DEVELOP FILM` with a canister held. `advanceClock: 60`. If
both canisters are held, the script asks which and runs once per canister.

### 44.1 Sissy's — `act4_sissy_film` → `act4_print_sky`, sets `act4_sissy_film_developed`

```text
Behind the curtain: a room the size of a pantry with a stone sink, a bench, an
enlarger under a dust cover, and a shelf of brown glass bottles with handwritten
labels, all of them in the same hand and none of them recent.

You put the red bulb on. The room turns into a photograph of itself.

The chemistry is old and you cut it long to allow for that. The rest of it is what
it has always been: get the film onto the spiral in the dark by feel, cap the
tank, and then stand in a cellar under a county library agitating a plastic drum
for a length of time you have to keep in your head, because there is a clock on
the wall in here and there is no light to read it by.

Wash. Fix. Wash again, longer than anybody wants to. And then the tank comes open
and there is a strip of wet negative hanging off your fingers with sky on it, and
you put the light on to look at it properly and the wet holds the light in a line
down the whole length of the strip.

The enlarger is not going to take an hour of your life it has not already had.
The paper on the shelf is older than the chemistry and it fogs at the edges, and
in the middle of it, when it comes up in the tray, there is a sky.

You wash it and stand it in the rack and let it go on being a sky for a while.
```

### 44.2 Jules's — `act2_film_canister` → `act4_print_last_day`, sets `act4_jules_film_developed`

```text
The second tank goes the same way as the first, except that this film has been in
a tin in a box under a floor at the back of a gift shop for weeks and you cut it
longer still and expect to lose it.

You do not lose it.

It comes up out of the fix as a kitchen.
```

---

## 45. The two prints

### 45.1 `act4_print_sky` — `EXAMINE` — `plotCritical`

Nouns: print, sky print, film, negative, photograph, picture, mars print.
Adjectives: sky, mars, developed, wet.

```text
A ten-by-eight on old paper, fogged round the edges and good in the middle, which
is where the sky is.

Points, on black, sharp all the way to the corners, with the drag on the longest
ones that a long exposure puts into anything that moves at all.

The bright one is over on the left, with the long shallow triangle under it and
the close pair below and to the left of that, and a faint one under the pair.

At the bottom of the frame, a hand's width of something dark and out of focus,
which is the top of the dome ring, and which she left in because she is not
sentimental and it gives the frame a scale.
```

### 45.2 `act4_print_last_day` — `EXAMINE` — `plotCritical` — **canon 96, canon 43**

Nouns: print, kitchen print, photograph, picture, family, film, last day.
Adjectives: kitchen, family, developed.

```text
A ten-by-eight of a kitchen, taken from the end of it by the door, on a flash
that has bounced off a low ceiling and lit everybody evenly and taken all the
shadow out of the room.

The table with the good cloth on it, squared up, plates on top of it. A jug. The
curtain drawn. A table meant for fewer, with everybody round it in the
arrangement of people who have not been asked to arrange themselves.

The old man at the head with his mouth open mid-sentence. A young man with his
chin on the old man's head. A girl leaning in from the end so as to be in it. Two
at the right-hand edge, one laughing and one determinedly not.

And at the near end, half out of the chair, with one arm still out towards the
camera and the other hand flat on the cloth, a man in his forties in a
short-sleeved shirt with a square-faced watch on him. He has come the length of
the kitchen at speed and got there and is turning back into the frame and the
shutter has caught him doing it, and he is laughing at how close it was.

Nothing is written on the back.
```

> **Note — canon 43, canon 96, and what the response does not do.** It is a
> self-timer photograph, which is why the film was in a camera in a drawer in a
> kitchen and why the man who cached it is in it. **No line remarks on the
> face**, no line says he is not in the room the player has just walked out of,
> and no line connects him to the man on the left of the porch Polaroid, whom the
> shipped text describes in the same words for the same reason. *Nothing is
> written on the back* is the porch Polaroid's own last line and it is doing the
> same job here.

---

## 46. R17 — `COMPARE PRINT WITH POLAROID` / `COMPARE PHOTOGRAPH WITH FILM` / `COMPARE SKY PRINT WITH PHOTOGRAPH`

`withInstrument: [act1_intact_polaroids]`, in the darkroom or anywhere. Grants
`act4_clue_sky_is_ceiling`, sets `act4_sky_matched`, answers `act4_q_the_sky`.

```text
You put them down on the bench side by side under the red bulb, and turn the
Polaroid until the gutter line is horizontal, and then you do not have to do
anything else.

The bright one. The long shallow triangle under it. The close pair below and
left, and the faint one under the pair.

Same positions. Same proportions. Same lean on the triangle. One of them is a
badly-held Polaroid of a porch roof in South Dakota and the other is a
forty-minute exposure on a tripod under a dome, and the soft discs on the first
one are sitting exactly where the hard points on the second one are.

That is the arrangement, and the arrangement is the thing, and you have known it
since the dome.

What you did not have in the dome is the second half of it.

The film was open a long time and the negative got pushed to make anything of the
paper, and what that has done is bring up everything in the frame that is fainter
than a star. Most of it is grain. Some of it is not grain, because grain does not
go in straight lines.

There are lines behind the stars. Very faint, and straight, and long, and they run
behind the points rather than in front of them, and they meet — at angles, in a
way that gives you something like a very large panel and then another very large
panel next to it.

And where two of the lines cross, the black is a different black. It has an edge.
Hold the paper to the bulb and the edge stays where it is, which grain does not
do.

Behind the edge there is structure. Not a shape, not an object, and not anything
you could put a name to: the regular, repeating, carrying kind of detail that a
thing has when it was made rather than when it grew.

Under the same bulb, four inches to the left, a photograph of a porch roof has the
same stars in the same places, and is much too soft to show anything behind them,
and never will be anything else.
```

> **Note — the constraints, all four.** No total anywhere. No *skybox* and no
> synonym for one; no *ceiling* in the narrator's mouth — the clue's title is the
> plan's and this prose never uses the word. The Polaroid stays out of focus and
> its softness is stated twice, at the top and at the bottom, so that the match
> is by arrangement and the seams belong to the film alone. And *structure* is
> the one noun, at the end, undefined, uncompared and never returned to.
>
> **Forty minutes** is a figure describing an exposure, which canon 89 permits as
> a reading rather than a count. It is the only number in the block. If the main
> session wants it out, *a long exposure* costs the sentence nothing except the
> specificity that makes it sound like somebody who has done it.
>
> **The word *ceiling*.** It occurs five times in this wave — §6.4, §23, §25.1,
> §26.1 and §45.2 — and every one of them is an actual ceiling in an actual room
> with a lamp or a hatch or a water stain on it. It occurs **nowhere within a
> hundred lines of a star**, and it is not in this block, or in §37, or in
> §34. That is deliberate: the word is ordinary furniture everywhere else in the
> wave precisely so that it never rings, and the clue's title (`sky_is_ceiling`)
> is the plan's private id and is not prose. **Do not let an editor use it once
> in the Dome.**

---

## 47. Hint ladders — P23 and P24

Counted separately (the brief's own line).

### 47.1 P23 — five rungs

```text
There are two openings in that wall with light behind them, and one of them let
you in.
```
```text
Nothing in this kitchen is locked except a drawer, and nothing in this kitchen is
asking you a question except a panel by the back door, and neither of those is
the first thing that has to happen. Something is being waited for.
```
```text
Listen to the speaker properly. They call the game, and then somebody says the
rule, and then they leave a gap the length of a short answer, and nothing goes in
it. There is a chair at that table nobody is in.
```
```text
Three small ordinary things, in any order, and none of them is clever: take the
chair the room is holding for you; find the spare key where that family always
kept the spare of everything; and when the timer runs out, put in the thing the
last one out of that kitchen said, which you have heard this week from two people
who have never met.
```
```text
SIT IN THE FIRST CHAIR — the end one, back to the window. LOOK IN THE JAR on the
shelf over the stove, and use what is down the side of the glass on the drawer.
When the panel comes up, type YOUNGEST GOES LAST, or HOUSE RULES; it takes
either, because they are the same sentence in that house. If the room gets away
from you, keep going: it resets, it never locks, and after two bad turns the
voices start helping.
```

### 47.2 P24 — five rungs

```text
Everything anybody has told you comes down a wire, and the wire is the one place
this world has ever been caught changing its mind. Her sky does not have to.
```
```text
She was told to stop shooting film and she did not stop. Ask her about it, or
show her the one photograph of a sky you already own, or go up the ladder and
look at what is on the tripod.
```
```text
A roll of exposed film is worth nothing at all until somebody puts it through
chemistry, and there is exactly one room in this county with the chemistry in it.
You have walked past its door and read the plate on it.
```
```text
The library annex, past the drawer bank. It is locked and it has been locked
since before you got here. There is more than one way into a door like that: the
thing you have been prying with all week, or the key that whoever used that room
last did not take home with them.
```
```text
Open the darkroom — PRY DOOR WITH CHAIR LEG, or SEARCH THE SHELF the sign-in book
stands on and use the key. DEVELOP FILM; develop both canisters while you are in
there, they take the same hour. Then put her print and the night-sky Polaroid
side by side: COMPARE PRINT WITH POLAROID.
```

---

## 48. The boundary — the E2 line

`SYSTEM_BOUNDARY_TEXT` gains a **fourth arm**, above E1's, gated
`{ any: [{ visited: act4_escape_chamber }, { visited: act4_hab_galley }] }`. It
renders on the well's `down` only; `ENTER` on the three dark frames is canon
101's refusal (§3.4) and **not** a boundary. All four arms are deleted with the
gate in E3.

```text
END OF BUILD

The door at the bottom of the well is the next version. Everything above it, and
everything through the two frames that are lit, is this one.
```

> **Note.** Names no act. No *town*, no date, no stage name, no person, and no
> reference to the player's state of mind. It is the last one in the game.

---

## 49. Setups planted (constitution §30)

| Setup | Where | Pays off |
|---|---|---|
| `act4_deep_index` — a completed room files a session under somebody's index | §23 | **E3.** P27: where Jules's snapshot is, and why the console can be told to find it |
| A camera in a kitchen drawer with the leader still curled on the spool | §19.2 | **Immediately, and never stated** — the canister in the player's pocket since Act II |
| A print of a kitchen with a man at the near end half out of his chair | §45.2 | **E3.** The record's `AUTHOR` line, and the cache the player leaves for the next one |
| *If it is right then it has been right the whole time, which is worse* | §40.1 | **E3.** The Blank Room; nobody quotes it |
| A panel let into a plaster wall and made good for four inches | §21.1 | **E3.** The antechamber's console in a room with nothing else in it |
| Sissy's *I have got very good at inventing things and have decided it is a bad habit* | §32.0c | **Unassigned.** I recommend it stay unassigned |
| The porch she keeps putting under a sky that is not hers | §32.8 | **§46**, one room and one hour later, and no line joins them |
| The suit rack with a gap in it second from the small end | §25.1, §30.1 | **Nothing, ever.** A detail about a rack |

## 50. Second readings (constitution §31)

| Object | First reading, and it holds | Second reading, later, unprompted |
|---|---|---|
| The bare hook's clean paint (§8.1) | A hook nobody used | **R14.** A wall cannot record a coat nobody remembers being hung on it |
| The tins with unprinted labels (§6.1) | An unfinished reconstruction | The parts of a life nobody was looking at are the parts that do not survive being remembered |
| *You hung it up second from the small end* (§32.0b) | An observant woman | She checks the rack every time somebody comes through, and has done for a while, and does not say why |
| The reply that beats the hand off the key (§28.2) | A fast link | **R17.** Twelve minutes each way was on every timeline anybody ever sent her |
| The good cloth folded on the dresser (§10.1) | A tidy kitchen | **§24.** Four people, and not one of them looked at the table |
| *There's a man on the left of that I could not put a name to* (§32.9) | Old photograph, distant family | **R14 / R19.** She has been looking at that step her whole life |
| The camera with the leader curled on the spool (§19.2) | A drawer with a camera in it | The film is in your coat and has been since Wall Drug |
| The chair with the wire round the back leg (§14.1) | A mended chair | **M10-direct**, if that is the variant the player got, and nothing says so |

## 51. What this wave re-scores (guide §12)

Nothing below is re-scored by a narrator line.

| Shipped, Act I–IV | What E2 makes it mean, without saying so |
|---|---|
| `the stars come out as small soft discs of different sizes` (wave 5 §9.4) | §37.3 and §46: a blur has a position, and the position is the evidence |
| `a night sky over the same porch roof` | §32.9: the astronaut wants it on the record that it is out of focus |
| Jack: *"Birth order. That's the whole of the joke. I'm four."* | §32.5: a third account, from a fourth person, agreeing with nobody |
| Eli's letter: the parlour would not put a single upright on skin | §32.5: she says they did and it failed |
| Luke: *"Our father was I."* | §32.5: she has never heard that version and does not offer it |
| The Bay's peeled hook: *you can see where the letters were* | §8.1: a hook with nothing under it at all |
| Dad: *"Always keep a copy, kiddo."* | §12.2: it is a jar, it was always a jar, and it is the puzzle |
| M19-S: *a kitchen table with the good cloth off it* | §10.1 and §24: the one thing the harvest got wrong |
| M13's boy folding paper at a hearing | §32.4: the brother who told everybody twice, in an airport |
| `USER NOT RECOGNIZED` at five stations | §29.2: a station that does not ask anything at all |
| D5's rows of chairs, set to people | §17.1: four of the voices in the speaker have chairs down there |
| The chair leg's three pries | §11.3: the one drawer it is wrong for; §43.1, the one it is right for |
| Luke's *noumena*, and the family joke about it | §22: the joke from the inside, and somebody throwing something at him |

## 52. The anti-repetition register — extends E1 §33

All prior rows stand. These are E2's; deletions are marked **CUT**.

| Device | Already spent | This wave |
|---|---|---|
| **A narrator who does the arithmetic** | D5 §24.3 is the one permitted instance; E0 and E1 both stopped one operation short | **None.** §28.2 puts a four-second reply and a twelve-minute round trip in the player's hands on two different pages and never subtracts. §32.4 and §33 put *three brothers* and *four of us* one tick apart and nothing joins them. **If an editor joins either pair, the wave's two best moments are gone** |
| **Counting** | Canon 70's two counts spent in D3; E0 flagged *six of them*; E1 rewrote four drafts | **None, and this was the expensive row — and it is the row an editor will undo without noticing.** Seventeen drafts were rewritten to take a number out: *five kitchen chairs* (§14.1), *four of them* and *all four of them* for the voices (§17.1, §21.2, §23), *four people built this room* (§24), *three fingers* (§32.4), *six people round a table* (§45.2), *three smaller ones* and *the three under it* for the stars (§37.1, §37.2, §37.3, §45.1, §46), *two shallow trays* (§31.2), *two batteries* (§19.2), *two wards* (§13.1), *four points* (§39.1), *three rings* (§31.1), and *the same six people crossing a floor* (§4.1). **Nothing in this wave gives a quantity of coats, hooks, chairs, voices, people, sheets or stars.** §37.2 is the wave's authored refusal; §40.1 is a page of numbers the narrator declines to read; §17.1 and §45.2 enumerate people one at a time so that the player is the one who arrives at four and at six, which is the whole mechanism of §32.4 and M11 |
| **The sky** | CUT since wave 5; CUT for eight waves running | **Spent, twice, on purpose, and then closed.** §37.1 (the dome) and §46 (the film). §36's horizon does not look up. **§20 refuses a third**, permanently, and that refusal is the wave's most load-bearing joke. No sky in E3 |
| **Handwriting as evidence** | E0 §15 was declared the last comparison in the game and E0 §27 closed it | **Held closed.** §40.1 is one hand read on its own; §27.1 is a form filled in by hand and answered by a machine. **No `COMPARE` verb reaches any handwriting in this wave** — the three `COMPARE`s here are a photograph against a room, a photograph against a sky, and a photograph against a photograph |
| **A blank somebody declined to fill in** | E0 took two and said no more until the record | **None, and one deliberate inversion:** §6.1's labels are blanks nobody declined to fill in — nobody was *asked*. The panel at §21.1 has *no cursor*, which is an absence of an invitation rather than an unanswered one |
| **The narrator telling the player what he is like** | Once ever, D3's bell; E0 and E1 both quarantined their best sentence | **CUT.** §36 was drafted with a closing line about what the player now knows and it is quarantined (§55.1). §23 ends on an absence of a gap in some light and says nothing whatever about the man standing in the room |
| **A man who finishes a job completely** | Closed at two in D1–D2; held cut in D3–E1 | **Held cut,** with two inversions and no admiration: §39.1's bolts, moved once and got right; §31.2's dead tray that nobody has emptied. Neither has a person attached to it |
| **A price, a date, a year, a clock time** | Refused in fourteen rooms; E0 and E1 cut all of them | **CUT.** §15.1's dial has marks and no numbers. §29.1 prints a clock and **no line gives what it says**. §27.1's date field is *filled in by hand* and never read. The only figures anywhere are dimensions, a forty-minute exposure (§46, canon 89), *same as 14 through 31* off a sheet (canon 89), and *eleven hours*, twice, in Sissy's mouth |
| **The Custodian speaking** | Four words, once, inside M16; standing rule since E0 | **None.** He is not in this wave in any state, and nothing through a frame has ever heard of him |
| **An old terminal** | Five stations; E0 added none; E1 added none | **Station four, and it is the last new one.** §26.1 is D1's three clauses and §29 is a machine with nothing to ask. **The root console in E3 is station five and there are no more** |
| **A building with an opinion** | One in D5; none in E0 or E1 | **None.** The Chamber is a room doing arithmetic about a hole and §23 gives it no intent; the word *wants* appears in a hint and not in a response |
| **Somebody being kind and being wrong** | Finished with Nolan in D5 | **Not reopened. Sissy is kind and is not wrong** — she is the only character in the game who has done the work correctly, filed it correctly, and been answered with a word. The discomfort is that she is right |
| **A thing that fits the player** | The hat, once, in the opening, and it pays at the record | **Declined.** §25.1's suit is a size off a rack and is *adequate*. A second thing that fits would spend the record's best field two waves early |
| **A dark room with something in it** | D4 §17: *the day a dark room contains something, the device is finished, and it should be Act IV's* | **Spent, here, once** (§23). A kitchen leaving a kitchen. No face, no touch, nothing addressed to the player. **E3 does not get one** |
| **A man turning his arm over on a table** | Jack, once, in Act I, and once wordlessly under the lamp in E1 | **Refused.** Sissy's cuffs are buttoned and her forearms are never described (§53 q8). A second sibling doing the gesture spends it, and canon 33 would then be one sentence away |

---

## 53. Canon questions for the main session

1. **Does canon 104 reach through a frame?** The entry reads *no living person
   speaks below Sublevel 5 in any act*, and the Chamber and the hab are entered
   from a wall on Sublevel 6. **As written, Sissy speaks and the Chamber's
   recorded voices speak. Recommend confirming that canon 104 binds the
   facility's floors and not the archive's environments** — the frames are not
   on the map's vertical axis, and the rule's whole force is that the harvest
   floor is a place where nobody talks, which is untouched by a woman on the
   other side of a doorway. The recordings are a machine playing back, which
   canon 87 has always permitted. **If the ruling goes the other way this wave
   loses its NPC**: Sissy becomes a queue of typed messages on the comms rig,
   P24 loses its conversation route entirely, M11 loses its trigger, canon 110's
   third rationalization has no mouth to be said in, and the section guide §5
   calls the quietest in the game becomes a screen. It would be a re-plan, not
   an edit. **This is the wave's first and largest question.**
2. **The film in the player's pocket came out of the camera in the drawer**
   (§19.2). New fact, and the strongest one this wave invents: canon 96 says the
   film shows the family's last day, and this gives it a mechanism, gives P23's
   second performance a reward that is a thing rather than a clue, and makes
   §45.2 a self-timer photograph — which is why the man who cached the roll is
   in the frame at all. **Recommend as written**, with the register entry at
   §58. Nothing anywhere says it; the response does not change if the canister
   is in the inventory.
3. **The harvest's one wrong detail is the good cloth** (§10.1, §24, §45.2).
   **Recommend as written.** It is domestic, it is checkable, it is one, it
   costs nothing to notice and nothing to miss, and it quietly hands M19-S's
   shipped image a second life for the players who have it. The alternative
   candidates were all people, and a wrong *person* would say much more than
   canon 96 wants said.
4. **The bare hook has nothing under it** (§8.1) — the inversion of the Bay's
   peeled label rather than a repeat of it. **Recommend as written**; the rhyme
   works better as a contrast and it keeps the wave clear of *tape*, *gum* and
   *letters*, which are D5's words.
5. **The dark-room device, spent at §23.** D4 §17 reserved it for Act IV and
   this is the only place in Act IV it fits. **Confirm** — and confirm that E3
   does not get a second one, which §52 records as a standing rule.
6. **`COUNT STARS` points at the camera** (§37.2). Canon 93 permits a refusal
   that produces no figure; this one also teaches the puzzle's next move.
   **Recommend as written** — the project's standard says a failure teaches or
   amuses, the architecture's own line for this room (*count them, they repeat*)
   is unavailable to a narrator who may not count, and this is the nearest
   honest thing to it. If the main session wants a pure refusal, cut the last
   two lines and it still works. Register proposal §58.
7. **Sissy's account, and who it was on** (§32.5). She says *the first one didn't
   take*, cannot say which brother, and sends the player to Eli, whose account
   contradicts hers flatly. **Recommend as written** — canon 110's slot, and the
   send-off is the device working: three certainties, no agreement, nobody
   lying.
8. **Sissy's sleeves** (§32.0a) are buttoned at the wrist and her forearms are
   never described. **Recommend as written.** Jack turned his arm over on a table
   in Act I and that is the game's one instance of the gesture; doing it again
   with a second sibling spends it, and canon 33 forbids the comparison the
   player would then be a sentence away from. §57 lists `EXAMINE SISSY'S ARM`,
   which will be typed.
9. **M10's tie-breaker fires analytical; M3's shipped tie-breaker fires
   social.** The plan is explicit that M10's tie must not fall through to
   nothing, and analytical is what it names. **Confirm the inconsistency is
   deliberate** — or rule one default for both, in which case M10's variants are
   a one-line cond change and no prose moves.
10. **The stamped number in the spare key's bow** (§13.1) echoes D4 §4.2's branch
    hatch. It means nothing, opens nothing and is never mentioned again.
    **Recommend keeping**; it is one clause and it is the correct kind of detail
    for a key. If it reads as a promise, the fix is deleting the clause.
11. **The darkroom's act gate.** Canon 96 says the film is *developable at the
    library from Act II*, and the chair leg is available in Act I. **Recommend
    the darkroom carry no act gate at all**: `act4_darkroom_open` is set by
    whichever route the player finds, whenever he finds it, and `act4_develop`
    runs on whichever canister is in hand. A player who pries that door in Act II
    gets the kitchen print early, which canon 96 explicitly allows and which
    spoils nothing — there is no room yet to hold it against. If the main session
    wants it gated, gate it on `act4_started` and canon 96 needs its *from Act
    II* clause amended.
12. **Three dark frames, three different refusals** (§3.4). Canon 101 says *one
    refusal each, never named*. **Recommend as written** — three identical
    refusals would read as a bug, and the three here are the same fact told three
    ways, which is the joke. §59 names them as the first cut if budget is
    demanded, and I do not recommend taking it.
13. **The brief's arithmetic.** §4.3's eight lines sum to **7,800**, and its
    headline says **~8,200**. The 400 is exactly the hint-ladder line, which the
    same paragraph says is *counted separately*. §59 reports against **7,800**
    and states the discrepancy rather than quietly using the larger number.

## 54. Assumptions (`ASSUMPTION` — none of these is canon)

- **`ASSUMPTION`: the Chamber is a kitchen** — linoleum on the diagonal, a deal
  table, a dresser, five mismatched chairs, a stove with a back ring, a shelf of
  tins, a curtained sash window and a hall doorway. Invented. The architecture
  says *the family's last day all together, rebuilt from harvested memories* and
  the plan fixes the coats, the hook, the silhouette, the table, the drawer, the
  jar, the chairs, the timer, the panel, the voices, the game box and the
  window; everything domestic is mine.
- **`ASSUMPTION`: the reconstruction is uneven in resolution** — exact where four
  people looked, blank where nobody did (handles, labels, the curtain's pattern),
  and it fills in as the performances land. Invented, and it is the room's whole
  visual idea and the reason §24's clue is possible.
- **`ASSUMPTION`: the family camera is a plastic thirty-five-millimetre compact,
  kept in the table drawer, and the cached canister came out of it.** Invented
  and load-bearing — §53 q2.
- **`ASSUMPTION`: the back door is a flush grey door let into the plaster with a
  panel beside it and no handle**, and it is the only object in the room that is
  not domestic. Invented.
- **`ASSUMPTION`: the coats are a chore coat, a parka, a patched denim jacket, a
  black wool overcoat and a child's red anorak**, hung by the collar. Invented,
  and deliberately not assigned to anybody; the black coat is the one a player
  will assign.
- **`ASSUMPTION`: the hab's airlock has a suit rack, a laminated card and a green
  switch, and the cycle is ten minutes.** Invented from the plan's *the suit
  ritual as transition prose* and its clock cost.
- **`ASSUMPTION`: Sissy is small, rope-thin, cuts her own hair, works on a valve
  body at the galley table, and puts every part down inside the lip.** Invented.
  The architecture gives her the mission, the anomaly reports, the film and *her
  section is where the game's humour goes quietest*.
- **`ASSUMPTION`: Sissy has a mother who is spoken of once** (§32.4). Invented;
  it is the only mention of a mother in the game and it is one clause in an
  aside. If the register wants the family motherless, the clause goes and the
  line ends on the field.
- **`ASSUMPTION`: the anomaly logs are thermal printouts on a clipboard with a
  typed `HANDLED` in every response box**, and the recent ones read *same as 14
  through 31*. Invented.
- **`ASSUMPTION`: there is a hydroponic lamp with one living tray and one dead
  one, and a pencil label in the dead one with the name of a herb on it.**
  Invented; it is the Galley's sixth object.
- **`ASSUMPTION`: the darkroom key is taped under the shelf the sign-in book
  stands on.** Invented, and it is a **correction to the plan**: there is no
  counter in the shipped County Library annex — the sign-in book is *open on a
  shelf by the door*. `SEARCH COUNTER` is kept as a trigger on the new object so
  the plan's own phrasing still parses.
- **`ASSUMPTION`: the darkroom is a pantry-sized room with a stone sink, an
  enlarger under a cover and a shelf of brown glass bottles in one hand**, with a
  curtain on a rail inside the door. Invented.
- **`ASSUMPTION`: the ids are `act1_intact_polaroids`, `act1_chair_leg`,
  `act1_fedora`, `act1_county_library`, `act1_darkroom_door`,
  `act1_sign_in_book`, `act2_film_canister`, `act2_deck`, `act3_gate_frames`,
  `act3_s6_archive_hub`, `act3_s6_boundary_gate`, `act4_luke_said_word`, and the
  family memory ids the plan lists as `FAMILY_MEMORY_IDS`.** D1–E1 name them;
  **builders grep the `ids.ts` files before wiring.**

## 55. Quarantined — **do not wire without sign-off**

### 55.1 The horizon, with the sentence that says it

**The problem.** §36 ends on *that is the last time anybody in this room is going
to be able to say so*, which is a nudge. The line below was the draft's next
sentence and it is R17 stated a room early.

```text
It is being a planet the way a room is being a kitchen, which is completely, and
for as long as nobody looks at the ceiling.
```

> **Recommendation: do not wire it.** It is the best sentence in the Dome and it
> hands the player R17 before he has any evidence for it, in the narrator's
> voice, using the one word canon will not let that object carry. He is one hour
> and one comparison away from working it out himself.

### 55.2 The harvest's wrong detail, about people

**The problem.** §24 lands on a tablecloth. The version below lands on the
family, and it is the version the scene appears to be aiming at.

```text
Nobody was looking at the tablecloth because everybody was looking at each other,
and the machine had four sets of eyes to build a room out of and every one of
them was pointed at the same five faces.
```

> **Recommendation: do not wire it.** It is warm and it is true and it explains
> the mechanism in the narrator's voice at the exact moment constitution §31
> wants the player doing it. The cloth alone is the better clue and the colder
> room. It also contains the word *faces*, which §23 spent the whole wave
> avoiding.

### 55.3 Sissy, at the end of the sky topic

**The problem.** §32.1 ends on *handled*. The line below gives her the beat the
topic is obviously aiming at.

```text
"I have started wondering what I would do if somebody answered," she says. "I
have not got anywhere with it."
```

> **Recommendation: do not wire it.** It is a good line and it is the only place
> in the wave she asks for anything. Guide §5 wants this section quiet, and the
> version where she does not ask, does not flinch and goes back to the valve is
> the one that makes the player carry it out of the room. If Ryan wants it, it is
> a topic of its own and not the end of this one.

---

## 56. Wiring summary for the builder

### 56.1 What supersedes what

| Shipped | Becomes |
|---|---|
| `act3_gate_frames` (`act3/objects/s6ArchiveHub.ts`) | **keeps** `GATE_EXAMINE_TEXT`, `GATE_TOUCH_TEXT`, `GATE_LOOK_BEHIND_TEXT` and `GATE_READ_LEGENDS_TEXT` **word for word**; **loses** the nouns `escape`, `hab`, `escape room` and the bare singular `frame` to the two new objects; its `IN` handler drops `GATE_ENTER_BOUNDARY_TEXT` and takes §3.1. `GATE_ENTER_TEXT` (*the floor on the other side of it is a floor*) is **reused verbatim** as the first sentence of §4.1 and §4.2 and is **not counted** in §59 |
| `SYSTEM_BOUNDARY_TEXT` | becomes **four** arms: §48 (a frame used), E1's `act4_luke_met`, E0's `act4_started`, canon 88's shipped Act III line. It renders on the well's `down` **only** — the `IN` entry point is gone. All four are deleted with the gate in E3 |
| `act3_s6_archive_hub` exits | gains `{ dir: 'e', to: ACT4_ESCAPE_CHAMBER }` and `{ dir: 'ne', to: ACT4_HAB_GALLEY }` as `door`-style exits **that never open** — the map and `GO TO` need them; traversal is the gate objects' `IN` scripts. `blockedText` on both is §3.1 |
| `act1_darkroom_door` (`act1/objects/countyLibrary.ts`) | gains a `PRY` handler (§43.1), an `UNLOCK`-with-key handler (§43.2) and an open-state `EXAMINE` (§43.3). **The shipped locked `EXAMINE` and `OPEN` text stay underneath** and still answer before `act4_darkroom_open`; neither is counted in §59 |
| `act1_county_library` objects | gains `act4_annex_shelf` (§42.1). The sign-in book is untouched; the shelf takes `shelf`, `counter`, `ledge`, `bracket` and does **not** take `book` |
| `act2_film_canister` | unchanged as an object; `act4_develop` consumes it and replaces it with `act4_print_last_day`. Its shipped `OPEN` refusal (*undeveloped film in a lit corridor*) **still answers everywhere except behind the darkroom curtain** |
| `act1_intact_polaroids` | unchanged. **Its text is not edited, in any direction** — recontextualization row 12: the Polaroid stays out of focus |
| `act1_chair_leg` | gains nothing of its own; §11.3 and §43.1 are handlers on the two doors, not on the leg |

### 56.2 Parser collisions — named, with the recommendation

| Word | Collides with | Recommendation |
|---|---|---|
| `film` | `act2_film_canister` vs. `act4_sissy_film` vs. `act4_print_sky` vs. the library reader's shipped `film`/`microfilm`/`reel` nouns | **Four objects and a machine.** Sissy's canister takes `adjectives: ['sissy', 'her', 'mars', 'second']`; the prints take `sky` / `kitchen`. Bare `FILM` in the County Library must keep resolving to the **reader** (it is a shipped required trigger). Bare `FILM` in the Dome and Galley is Sissy's. A player holding both canisters gets a clarify, which is correct, and `DEVELOP FILM` with two in hand asks which |
| `camera` | `act4_family_camera` (the Chamber drawer) vs. `act4_camera` (the Dome tripod) | **Different rooms, never in scope together.** Named so nobody merges them. The family one is `portable: false` and stays in the drawer |
| `print` / `photograph` / `picture` | `act4_print_sky` vs. `act4_print_last_day` vs. `act1_intact_polaroids` vs. `act2_cache_polaroid` | **Four.** The prints take `sky` and `kitchen`/`family`; the Polaroids keep bare `POLAROID`. **`COMPARE PRINT WITH POLAROID` must resolve the instrument to `act1_intact_polaroids`** and not to the cache Polaroid — check the adjective table before wiring §46 |
| `chair` / `chairs` | `act4_chairs` (Chamber) vs. `act4_dome_chair` vs. `act3_chairs` (the Bay) vs. Jack's shipped `topic_chairs` | **Three objects in three rooms plus an NPC topic.** No collision in scope. `FIRST CHAIR` and `END CHAIR` are the Chamber's only |
| `drawer` | `act4_table_drawer` vs. `act1_desk_drawer` (the opening room) vs. the library's shipped `drawers` / `drawer bank` | **Different rooms.** The library's bare `DRAWER` stays the bank's — it is shipped and load-bearing |
| `door` | `act4_chamber_door` vs. `act4_airlock_door` vs. `act1_darkroom_door` vs. every shipped door | **Different rooms.** In the Chamber, `DOOR` is the grey one and `DOORWAY` / `HALL` is the way out; **check that `OUT` and `W` reach the exit and not the panel** |
| `log` / `logs` | `act4_sky_log` (Dome) vs. `act4_anomaly_logs` (Galley) vs. `act3_load_log` | **Different rooms, and one room apart.** The Dome's takes `sky`, `notebook`; the Galley's takes `anomaly`, `reports`, and bare `LOGS` in the Galley is the clipboard |
| `glass` | `act4_dome_glass` vs. the library's shipped `ground glass` vs. `act1_broken_glass` | **Different rooms.** Named because *glass* is the Dome's best bare noun |
| `key` | `act4_spare_key` vs. `act4_darkroom_key` vs. `act1_keyring` and its brass key | **Two new and two shipped, and they will be in one inventory.** The spare takes `small`, `green`, `string`; the darkroom's takes `long`, `library`, `mortice` |
| `frame` / `frames` | `act3_gate_frames` vs. `act4_gate_escape` vs. `act4_gate_hab` | **`FRAMES` stays the class object. `FRAME` alone must clarify** once the two lit ones exist — this is the one place in the wave a clarify prompt is right, and the `first` / `second` adjectives are how it is answered |
| `jar` / `tin` | `act4_coffee_jar` vs. the Chamber's blank-label tins (scenery) vs. `act2_film_canister`'s shipped `tin` noun | **`JAR` and `COFFEE` are the jar's. `TIN` in the Chamber should reach the jar** rather than a scenery tin, because a player who has heard M6 will type `LOOK IN TIN` |
| `table` | `act4_family_table` vs. `act4_galley_table` vs. `act4_conference_table` (E1) vs. the diner's | **Four rooms, four tables.** No collision in scope |
| `sky` | `act4_sky` (Dome) vs. the Polaroids' shipped *night sky* phrasing | **`SKY` is the Dome's object.** Outside the Dome, `SKY` must not resolve to anything — the game has not described one outdoors since wave 5 and §52 says why |
| `voices` / `speaker` | `act4_voices` vs. nothing shipped | **No collision.** Named because `LISTEN` in the Chamber must reach the room's sense (§6.4) and `LISTEN TO VOICES` must reach §17.1 |
| `hook` / `hooks` | `act4_coats` (class) vs. `act4_bare_hook` vs. `act3_peeled_hook` and `act3_badge_hooks` (the Bay) | **Two rooms.** In the Chamber, `HOOKS` is the coats' and `BARE HOOK` / `EMPTY HOOK` is §8's. **`EMPTY HOOK` is also a shipped noun on the Bay's peeled hook and must stay one** |

### 56.3 Things a builder will look for and not find

- **A `COUNT` verb that produces a figure.** None exists anywhere in this wave.
  `COUNT COATS`, `COUNT CHAIRS`, `COUNT VOICES` and `COUNT STARS` will all be
  typed; only `COUNT STARS` has one authored (§37.2), and §57 commissions the
  rest. **None of them may print a number.**
- **A second `COMPARE` reaching handwriting.** There is none and none may be
  added — E0 §27 closed the device.
- **A face, anywhere.** The word does not occur in §23, §9.1 or §45.2, and
  appears in this document only inside the quarantine at §55.2.
- **The Chamber's fourth and fifth performances.** There are three. The plan says
  three; the architecture's *five-part puzzle furniture* is furniture, not five
  steps.
- **A response for `ENTER GATE` that is a boundary.** Gone. §3.1 replaces it and
  the boundary now lives only on the well's `down`.
- **Sissy's `tellTopics`.** Not authored separately; `TELL SISSY ABOUT X` should
  reach the same eight topics.
- **A `giveResponse` on Sissy.** None. `GIVE POLAROID TO SISSY` should route to
  §32.9's show response, and §57 flags it.
- **The Chamber's `SLEEP`, `WAIT`, `YELL`, `WHAT YEAR IS IT`.** Not authored;
  they fall to the globals, and `WAIT` in a room with a running timer is one of
  §57's commissions.
- **A `travelText` on the hab's exits.** The ladder is a ladder; §26 and §34
  describe both ends and nothing is authored for the climb.
- **Order on the threshold:** §4.1's block, then the room description, then M10
  as its own output on the next tick. **Three outputs, never concatenated.**
- **Order on completion:** §23 is one block; the room's rule 3 does **not** also
  render on that turn; the clue and the question's answer land after it.
- **Order in the darkroom:** §44.1 and §44.2 are separate scripts run separately,
  each costing its own hour. A player developing both spends two.

### 56.4 Exits and the map

**Three new rooms, five exits.**

| From | Dir | To | Gate |
|---|---|---|---|
| `act3_s6_archive_hub` | `e` | `act4_escape_chamber` | never opens; `blockedText` §3.1; real traversal is `act4_gate_escape`'s `IN` |
| `act4_escape_chamber` | `w` / `out` | `act3_s6_archive_hub` | always; `travelText` §41 |
| `act3_s6_archive_hub` | `ne` | `act4_hab_galley` | never opens; `blockedText` §3.1; real traversal is `act4_gate_hab`'s `IN` |
| `act4_hab_galley` | `up` | `act4_hab_dome` | always |
| `act4_hab_dome` | `down` | `act4_hab_galley` | always |

**The hab's way out is an object, not an exit** — `act4_airlock_door`'s `OPEN` /
`ENTER` / `OUT` runs `act4_leave_hab`. `OUT` in the Galley must reach it.
**Nothing else on the map changes**; the well's door is still shut, the lift's
blank button is still not pressable, and the tunnel is unchanged.

## 57. Suggested extra responses the engine should support

In rough order of certainty.

1. **`COUNT COATS`, `COUNT CHAIRS`, `COUNT VOICES`, `COUNT HOOKS`.** The Chamber
   is a room that invites arithmetic and the player will do it out loud. **Four
   responses, and not one of them may print a number** — canon 93 is the model
   and §37.2 is the tone.
2. **`WAIT` in the Chamber.** There is a timer running. A player will wait to see
   what happens when it stops, which is the intended discovery, and the global
   `WAIT` will not do it justice.
3. **`SIT IN THE FIRST CHAIR` before the voices have called the game**, and
   `STAND IN SILHOUETTE` after completion. Both will be typed; §9.3 and §18.1
   answer neither state.
4. **`EXAMINE SISSY'S ARM` / `ASK SISSY ABOUT HER TATTOO` / `SHOW ARM TO
   SISSY`.** Certain, and **canon 33 governs**: there must be a response, it must
   not compare two arms, and after §32.5 the player will absolutely try it.
5. **`TELL SISSY ABOUT THE CHAMBER` / `ABOUT THE ARCHIVE` / `ABOUT THE
   FACILITY`.** She has been filing reports at a machine for a year and the
   player will want to tell her what is on the other side of her airlock.
   Whatever it is, it is not a revelation scene.
6. **`SHOW PRINT TO SISSY`** after §46. The most predictable unwritten action in
   the wave. It must not resolve anything and it must not be triumphant.
7. **`ASK SISSY ABOUT DAD` / `ABOUT HER MOTHER`.** §32.4 mentions a mother — the
   only mention of one in the game — and somebody will ask.
8. `TAKE JAR`, `TAKE TIMER`, `TAKE CAMERA`, `TAKE PRINT OUT OF THE CHAMBER`, and
   the general question of whether anything from a reconstruction can leave.
   **Recommend nothing leaves**, in one line, in voice, once.
9. `LOOK BEHIND CURTAIN` after §20, repeatedly. He will.
10. `TURN OFF LAMP` / `TAKE TRAY` / `WATER PLANTS` in the Galley.
11. `OPEN AIRLOCK` from the Dome; `GO OUT` / `WALK ON MARS`. **There must be a
    refusal and it must be a procedure, not a wall.**
12. `USE RIG` a second time, and `SEND MESSAGE TO JACK` / `TO LUKE`. The third
    one is the one that deserves a line.
13. `DEVELOP FILM` with no canister; `DEVELOP POLAROID`; `DEVELOP FILM` a second
    time on a roll already developed.
14. `TURN ON RED LAMP` from outside the darkroom while somebody is inside it —
    nobody ever is, and the plate on that door has been asking for it since Act
    I.

## 58. Register proposals (`docs/spec/09`, column format; proposals only)

Numbered from **126** (E1's proposals were recorded as entries 119–125).

| # | Question | Proposed decision | Why | Forecloses |
|---|---|---|---|---|
| 126 | Does entry 104 bind the archive environments? (§53 q1) | **No. Entry 104 binds the facility's floors — Sublevel 5, Sublevel 6 and the well. The Chamber and the hab are entered through frames and are not below anything; Sissy speaks, and the Chamber's recorded voices are a machine playing back, which entry 87 has always allowed** | The rule's force is that the harvest floor is a place where nobody talks, and that is untouched; the alternative costs the wave its only NPC, P24 its conversation route, M11 its trigger and entry 110 its third mouth | A living speaker on S5, S6 or in the well, in any act; any reading in which the frames are a floor |
| 127 | What the cached film canister came out of (entry 96) | **A plastic thirty-five-millimetre compact kept in the drawer of the family's kitchen table, found in the Chamber with its back open and the leader curled on the take-up spool. The last-day photograph is a self-timer frame, which is why the man who cached the roll is standing in it. Nothing in any response says so** | It gives P23's second performance a reward that is an object rather than a note, it explains entry 43's stranger being in the picture at all, and it is the quietest possible delivery of entry 96 | Any other provenance for the roll; a response that connects the camera to the canister |
| 128 | What the harvest got wrong (§2 E2's *one detail*) | **The good cloth. It is on the table in the photograph and folded on the dresser in the room. Exactly one detail, never a second, and the clue draws no conclusion from it** | Domestic, checkable, and the one kind of fact four people could all fail to look at; it also gives M19-S's shipped image a second reading for the players who have it | A second wrong detail; a wrong *person*; any count of what the harvest got right |
| 129 | What is under the Chamber's bare hook (entry 54) | **Nothing. The wall behind the other five hooks carries the shadow a coat pushes into paint over years; the wall behind this one is the same age as the rest of the room and has never had anything against it. No tape, no gum, no letters, and no response joins it to the Maintenance Bay's peeled hook** | Entry 54's rhyme lands harder as an inversion than as a repeat, and a room built out of what four people remember cannot contain wear that nobody ever looked at | A mark under this hook; any line naming the hook's owner; any response that pairs the two hooks |
| 130 | Where the dark-room device is spent (D4 §17) | **In the Chamber's completion, once: the light goes down, the room is full for the length of a departure, nothing touches the player, and no face appears. Act V does not get a second one** | D4's register reserved it for Act IV and this is the only moment in Act IV large enough to carry it | A dark room with something in it anywhere in Act V; a second use in Act IV |
| 131 | The darkroom's availability (entries 96, 109) | **No act gate. The door opens to the chair leg or to the key taped under the annex shelf whenever the player finds either, in any act, and the develop scene runs on whichever canister is in hand** | Entry 96 says the film is developable *from Act II* and the pry tool ships in Act I; gating it would contradict a decision already on the register | A darkroom that is closed until Act IV; a develop scene that refuses a canister |
| 132 | Where the darkroom key is (entry 109) | **Taped flat under the shelf the sign-in book stands on, in the County Library annex. The plan's *counter* does not exist in the shipped room; `SEARCH COUNTER` is kept as a trigger word** | A correction to the plan against shipped prose, made the cheapest way | A counter in the annex; a key held by an NPC |
| 133 | Whether a refusal may teach the next move (entry 93) | **Yes. `COUNT STARS` says a number was asked for, produces none, and names the instrument in the room that could do it. A refusal that teaches is still a refusal** | Entry 93 forbids a leaked figure, not a useful sentence, and the project's own standard says a failure teaches or amuses | A refusal that leaks a figure or a range; a narrator who counts anything, ever |
| 134 | Sissy's mother | **Mentioned once, by Sissy, in an aside about a cold field, and never again by anybody. The family's mother is not a character, not a thread, and not explained** | The family has had a father and five children and no mother in the whole game, and one clause is the correct amount of acknowledgement | A mother as a thread; any second mention; any explanation of her absence |

**Proposed canon promotions:** none.

## 59. Word count against budget

Player-visible words only: fenced `text` blocks, counted with a script, not
estimated. Authoring notes, tables, headings and wiring notes excluded. **Text
reused verbatim from shipped prose is not counted** — `GATE_ENTER_TEXT`'s
opening sentence at §4.1 and §4.2 (52 words across two blocks), and the shipped
darkroom-door refusals that stay underneath §43 (§56.1). The quarantine (§55, 85
words) is **not** counted. **Canon 46 governs the split**, and it names this
wave: *ceilings are furniture-only; puzzle machinery is priced separately* —
*P16's approach and **P23's chamber** will hit the same wall.*

**A note on the brief's own arithmetic** (§53 q13): §4.3's eight lines sum to
**7,800**, and its headline says **~8,200**. The 400 is exactly the hint-ladder
line, which the same paragraph says is counted separately. **Everything below is
against 7,800.**

### 59.1 Against the brief's eight lines

| Piece | Brief | Actual | |
|---|---|---|---|
| The Chamber — three description rules, three senses, twelve objects and the exit (§6–§17.1, §20, §41) | **3,000** | **2,547** | −15% |
| The Galley — three rules, three senses, six objects (§26–§31) | **1,200** | **1,352** | +13% |
| The Dome — three rules, two senses, six objects (§34–§40) | **1,200** | **1,250** | +4% |
| Sissy — description, greeting ×2, `unknownTopic` ×3, eight topics, three shows (§32) | **1,200** | **1,913** | +59% |
| The gate frames and the two transitions (§3, §4, §25) | **400** | **1,119** | +180% |
| The darkroom scene (§42–§44) | **300** | **715** | +138% |
| M10 ×3 and M11 (§5, §33) | **450** | **441** | −2% |
| The boundary (§48) | **50** | **30** | −40% |
| **Against the brief's eight lines** | **7,800** | **9,367** | **+20%** |

### 59.2 Machinery — priced separately (canon 46)

| Piece | Actual |
|---|---|
| P23 — the pry refusal, the jar, the timer event, the voices calling the game, three performances, three fails, the assist ×4, the completion (§11.3, §12.2, §15.3, §17.2, §18, §19, §21, §22, §23) | **1,557** |
| P24 — the star refusal, the two comparisons, the two takes of the film, the two prints, R17 (§24, §37.2, §37.3, §38.2, §38.3, §45, §46) | **1,309** |
| Clue detail text (8), question text (2) and answers (2), solution notes (5) — §2 | **1,033** |
| **Machinery total** | **3,899** |

### 59.3 The wave

| | Brief | Actual | |
|---|---|---|---|
| Shipping prose against the brief's eight lines | **7,800** | **9,367** | +20% |
| Machinery, priced separately (canon 46) | — | **3,899** | |
| **WAVE TOTAL (shipping)** | **~7,800 + machinery** | **13,266** | |
| P23 and P24 hint ladders, counted separately | **~400** | **473** | +18% |
| *(quarantined, not shipped)* | — | *(85)* | §55 |
| *(reused verbatim, not counted)* | — | *(52)* | §56.1 |

**Where this wave is over, and what I would do about it.**

**The hero room came in under.** The Chamber is 2,547 against 3,000 and a 3,700
ceiling, and that is not thrift: it is the room's own idea. A kitchen assembled
out of four people's attention is *specific where they looked and blank where
they did not*, and half its furniture is therefore describable in a clause. The
Galley and the Dome are within tolerance at +13% and +4%. **M10 and M11 landed
on the number**, and the boundary is under.

**Sissy is +59%, at 1,913 against 1,200.** E1's Luke was 1,419 for a comparable
sheet of topics, and the difference is what she has to carry: P24's whole
conversation route including the hand-over, canon 110's third rationalization and
the send-off that sets it against Eli's, the *three brothers* that M11 exists to
contradict, the twelve minutes that §28's four seconds exist to contradict, and
the porch that R17 pays off an hour later. She is the only NPC in Act IV who is
in the game once, and five separate threads terminate in her. **If the main
session wants her at 1,200, the cut is §32.3 (97) and §32.6 (74) and shortening
§32.1 by a paragraph (about 90)** — and the wave then loses the only two places
in the game where anybody says what it is like to be written to by that family.
I do not recommend it.

**The two real overruns are the fifth line and the sixth, and they are the same
overrun twice: the brief priced a transition and the wave owes a system.**

**Line five is 1,119 against 400.** The brief said *the two gate transitions
(four variants)*. What a player can actually type at that wall is: two
`EXAMINE`s for the lit frames, **three separate refusals for the dark ones —
canon 101 says one refusal each**, a *which one* line on the class object, an
admitting transition, a refusing transition that has to teach with no reader to
point at, and the four airlock variants. That is eleven authored responses where
the brief counted four, and **the airlock alone is 508**, because a suit ritual
*played straight* (the scope cut's own words) is a sequence of ordinary acts and
a sequence of ordinary acts is the one thing you cannot summarise. **The
cheapest honest cut is the second and third dark-frame refusals (about 110
words)**, replaced by one shared line — and it costs canon 101 its *one refusal
each*, which the register adopted three days ago.

**Line six is 715 against 300.** The brief priced *the darkroom scene*; the wave
delivers two ways in, the shelf that hides one of them, the door's open state,
and two develop scenes, of which the second is 60 words precisely because the
first did the work. Under canon 46 the develop scenes are the scene and the door
is furniture. **If the main session wants the 300, the cut is §43.2 (60 words),**
and P24 then has one route through that door instead of two.

**The cheapest 484 words in the wave, if budget is wanted:** §7.3 (45), §8.2
(38), §10.3 (73), §16.2 (37), §27.2 (85), §31.1 (98), §39.2 (108). **Every one
of them is a response to a reasonable action** — take a coat, hang a coat, lay a
cloth, open a game box, pick up a clipboard, look at a table, sit in a chair.
The project's own standard says a failure acknowledges the attempt. **I recommend
keeping all seven and taking the overrun.**

**For Ryan.** Four blocks are the ones to read first, and the last one is the one
to take off me if any of them is.

**§23**, the Chamber completing, is the wave and probably the act: a kitchen
comes up sharp for the length of a breath, the light goes down, a family leaves a
room around you in the dark, and when it comes back up there is nobody in the
middle of the floor and no gap in the light where nobody is. It spends D4's
reserved dark-room device and it never says one word about what any of that
meant.

**§46** is R17, and it is the one I would most like a second opinion on. It has
to do three things in one block — confirm an arrangement, find seams on one of
two photographs only, and land the word *structure* — without a total, without
*ceiling*, without *skybox*, and without letting the Polaroid be sharper than
wave 5 made it. It is long because each of those needs its own paragraph and
none of them may lean on the others.

**§32.4**, Sissy counting her brothers off on the back of her hand with a pick,
is the quietest thing in the wave: she gets to three by describing three men, the
first of whom is neither of the other two, and neither she nor the narrator
notices, and M11 fires on the next tick and says four.

**And §20** — the curtain that goes on being curtain for as long as you keep
asking for window — is the block I would hand over first. It is the wave's best
joke, it is the whole thesis of the room in four sentences, and it is the sort of
thing Ryan writes better than I do.
