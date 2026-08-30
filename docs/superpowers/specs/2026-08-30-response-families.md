# Global Response Families

**Status:** authored prose, awaiting main-session voice review and Ryan's
spot-check · **Author:** `narrative-writer` · **Date:** 2026-08-30
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md`,
`docs/spec/01-design-constitution.md` §8, §9, §14, §16,
`docs/superpowers/specs/2026-08-29-stage-a-engine-architecture.md` §2.2, §2.9, §3.6
**Wires into:** `world.responses` (family keys) and `VerbDef.default` (verb keys)

Every string below is final prose. Nothing here is a placeholder.

---

## 0. Notes for whoever wires this in

Five things that changed how these were written. They are craft constraints,
not preferences.

1. **Variant order is not decorative.** Rotation is per-node
   (`action.<verb>.<objectId>`), so a player who takes forty different
   objects sees **variant 1 forty times** and never reaches variant 3.
   Variant 1 of every family is therefore the plainest and most reusable
   line; later variants escalate, get stranger, or take a different angle,
   because they are only ever seen by a player poking repeatedly at one
   thing. Preserve the order. Do not shuffle.

2. **No default or refusal implies a state change.** `fallbackToVerbDefault`
   and `refuse` render prose and change nothing. So no verb default says the
   object moved, broke, opened, tipped, or landed. Where the obvious line
   would have implied one (THROW, SIT, EMPTY), the prose describes the
   attempt stopping short instead. This is invisible when it is right and
   very loud when it is wrong.

3. **`{name}` may be a person.** The vocabulary compiler feeds NPCs through
   the same noun resolution as objects, so `PUSH ELI` reaches
   `push.default`. Lines are written to survive an animate `{name}` without
   becoming cruel. Where a verb is inherently person-facing (TALK TO, GIVE,
   SHOW, ATTACK, WAKE) the prose leans that way on purpose.

4. **Available template variables:** `{name}` and `{dobj}` (same value),
   `{iobj}`, `{topic}`. Nothing else. In particular there is **no template
   for the containing object**, which is why `take.containerClosed` says
   "something you have not opened" rather than naming the box.

5. **Built-in verbs' `default` families fire only with no direct object.**
   `performAction` dispatches to built-in semantics whenever `dobj` is
   present, so `take.default` is reached only by a bare `TAKE`. Those
   thirteen defaults are written as object-free prompts (§5 below), not as
   `{name}` lines — a `{name}` in them would render against nothing.

---

## 1. The ladder — rungs 3, 4, 5

These are the most-seen lines in the game. They carry the whole §14 promise.

### `unknown`

**Fires:** rung 5. Nothing in the input was recognized — no verb, no noun.

Each variant acknowledges that the player intended *something*, and three of
the four hand back a concrete next move without ever saying "I don't
understand."

1. The intention is there. The shape of it is not. Try again with a verb, and something to aim it at.
2. You get as far as considering it, whatever it was, and no further. Fewer words, and plainer ones, tend to survive the trip.
3. Some plans fail in the execution. This one has failed earlier than that, at the point where a plan is supposed to become a sentence.
4. Whatever you had in mind stays in mind, unable to find a verb it agrees with. Name a thing, then name what you want done to it.

### `nounMiss.seen`

**Fires:** rung 3, when the noun names something the player has encountered
elsewhere in the game. Naming it is safe: they have already met it.

1. The {name} is not here. You have seen it somewhere. Somewhere is not here.
2. No {name} in this room. It is wherever you last left it, keeping its own counsel.
3. You look for the {name} out of habit, and the habit is the only thing that turns up.
4. The {name} is elsewhere, doing whatever a {name} does when unobserved.

### `nounMiss.unseen`

**Fires:** rung 3, when the noun resolves to nothing the player has seen — or
to nothing at all.

**Spoiler boundary.** Not one of these confirms that the named thing exists,
and none denies it either. Variants 3 and 4 make the refusal-to-say into the
joke, so the silence reads as narrator temperament rather than as a
suspicious omission. Do not "improve" these by naming what the player typed.

1. You look for it. Nothing in the room admits to being it.
2. Nothing here answers to that name. The room is not being coy; it simply has other contents.
3. There is no such thing here. Whether there is such a thing at all is a separate question, and nobody in this room is qualified to answer it.
4. You cast about for it with the thoroughness of someone who has already decided it will not be found. It is not found.

### `unknownVerbKnownNoun`

**Fires:** rung 4. The verb is unrecognized, but a noun in the input
resolved. The response acknowledges the target so the player learns that
half of what they said landed — which is the fastest possible route to a
working rephrase.

1. Whatever you intend for the {name}, the {name} waits.
2. The {name} is here and willing. What you proposed doing to it is neither.
3. You have found the {name}. You have not yet found a word for what you want from it.
4. The {name} remains, unimproved by the attempt. Try plainer language and it may cooperate.

---

## 2. Empty multi-object expansions

### `take.allEmpty`

**Fires:** `TAKE ALL` in a room where nothing is portable, visible, and not
already held.

1. There is nothing here worth carrying.
2. You survey the room for portable value and come away with the strong impression that someone has surveyed it before you.
3. Nothing here comes loose, and nothing here would be improved by coming with you.

### `drop.allEmpty`

**Fires:** `DROP ALL` with an empty inventory.

1. You are carrying nothing. Dropping it goes quickly.
2. Your hands are already as empty as they are going to get.
3. There is nothing on you to part with. You part with it anyway, at no cost to anyone.

---

## 3. Built-in refusals

One per failure branch in `src/engine/actions.ts`. Per constitution §9 each
one states *why*, so a refusal is a fact the player can use. The locked and
already-unlocked families are load-bearing clues and are marked.

### TAKE

**`take.notPortable`** — `portable !== true`
1. The {name} does not come away. It is fixed, heavy, or part of something larger.
2. You get a grip on the {name} and learn that it is considerably more attached to this room than you are.
3. Some things travel and some things stay. The {name} has made its choice, and it made it before you arrived.

**`take.alreadyHeld`** — already in inventory or worn
1. You already have the {name}. Taking it twice would be redundant, though admittedly thorough.
2. The {name} is in your hands. Both of you appear to be aware of this.

**`take.containerClosed`** — visible through/inside a closed container
*Informative: tells the player the obstacle is a lid, not a rule.*
1. The {name} is shut away behind something you have not opened. Open that first.
2. You reach for the {name} and meet a closed lid instead. Whatever is between you and it wants opening.

### DROP

**`drop.notHeld`**
1. You are not carrying the {name}. You cannot let go of what you never picked up, though the gesture remains available.
2. The {name} is not in your hands to be put down.

### OPEN

**`open.notContainer`** — no `container` declaration
1. The {name} does not open. There is no lid, no door, and no seam to argue with.
2. You look for the part of the {name} that opens. The {name} does not have one.

**`open.alreadyOpen`**
1. The {name} is already open. It has been for some time and shows no sign of reconsidering.
2. Open is the current condition of the {name}. Further opening is not on offer.

**`open.locked`** — **clue.** The player learns the obstacle has a solution.
1. The {name} is locked. It moves the eighth of an inch that locked things move, and stops.
2. Locked. Somewhere there is a key, or a way around it, or somebody who knows which.
3. The {name} holds. Whatever is inside it was meant to stay inside it until someone arrived with the correct hardware.

### CLOSE

**`close.notContainer`**
1. The {name} does not close, never having opened in the first place.

**`close.alreadyClosed`**
1. The {name} is already closed. Firmly, and with a certain finality.

### LOCK

**`lock.notLockable`** — no `container.key`
1. The {name} has no lock. Nothing about it was built with suspicion in mind.

**`lock.mustCloseFirst`**
1. You cannot lock the {name} while it stands open. Close it, then try the lock.

**`lock.alreadyLocked`**
1. The {name} is already locked. You lock it again regardless, which changes nothing and feels tidy.

**`lock.wrongKey`**
1. The {iobj} does not fit the {name}. It goes in far enough to raise your hopes and no further.

**`lock.noKey`**
1. You have nothing on you that will lock the {name}.

### UNLOCK

**`unlock.notLockable`**
1. The {name} has no lock to undo.

**`unlock.alreadyUnlocked`** — **clue.** Redirects the player from the lock to
whatever is actually holding it shut.
1. The {name} is already unlocked. Whatever is keeping it shut, it is not the lock.

**`unlock.wrongKey`**
1. The {iobj} enters the lock, turns a few degrees, and stops with the flat certainty of a wrong answer.
2. Not this one. The {name} wants a different key and is prepared to wait for it.

**`unlock.noKey`**
1. The {name} is locked, and you have nothing on you that fits it.
2. You try the lock with your fingers, which is how everyone begins and how nobody finishes. This one wants a key.

### PUT IN

**`putIn.notContainer`**
1. The {iobj} has no inside to put things in.
2. You look for an opening in the {iobj} and find it solid the whole way through.

**`putIn.closedContainer`**
1. The {iobj} is closed. Open it, and the {name} will fit or it will not.

**`putIn.loop`** — `dobj === iobj`, or `iobj` nested inside `dobj`
1. The {name} cannot go inside itself. The geometry alone would be a scandal.
2. That would require the {iobj} to be inside the {name} and the {name} inside the {iobj} at the same time, which is more than this room is prepared to host.

### PUT ON

**`putOn.notSupporter`**
1. Nothing stays on the {iobj}. It offers no surface that would hold the {name}.

**`putOn.loop`**
1. The {name} cannot rest on itself. Something has to be underneath.

### WEAR

**`wear.notWearable`**
1. The {name} is not clothing, and putting it on would raise more questions than it settled.
2. There is no way to wear the {name} that ends with you looking like someone who meant to.

**`wear.alreadyWorn`**
1. You are already wearing the {name}.

### REMOVE

**`remove.notWorn`**
1. You are not wearing the {name}.
2. The {name} is not on you to be taken off.

### TURN ON / TURN OFF

**`turnOn.notSwitchable`**
1. The {name} has no switch, no button, and no discernible ambition to be on.

**`turnOn.alreadyOn`**
1. The {name} is already on.

**`turnOff.notSwitchable`**
1. The {name} is not the sort of thing that turns off, never having been the sort of thing that was on.

**`turnOff.alreadyOff`**
1. The {name} is already off, and has been for a while.

---

## 4. Built-in successes

`succeed()` renders one of these on every successful built-in action, so they
are seen more often than anything else in this document. They are short on
purpose: a success line that tries to be funny every time becomes noise, and
worse, it slows the player down in the middle of doing something that worked.

`take.success` doubles as the implicit-take prefix ("first taking the …"), so
variant 1 names the object.

**`take.success`**
1. You take the {name}.
2. Taken.
3. The {name} comes with you.

**`drop.success`**
1. You set the {name} down.
2. Dropped.
3. The {name} joins the room.

**`open.success`**
1. The {name} opens.
2. You open the {name}.

**`close.success`**
1. You close the {name}.
2. The {name} shuts.

**`lock.success`**
1. The lock turns. The {name} is locked.

**`unlock.success`**
1. The lock gives. The {name} is unlocked.

**`putIn.success`**
1. You put the {name} in the {iobj}.

**`putOn.success`**
1. You set the {name} on the {iobj}.

**`wear.success`**
1. You put on the {name}.

**`remove.success`**
1. You take off the {name}.

**`turnOn.success`**
1. The {name} comes on.

**`turnOff.success`**
1. The {name} goes off.

---

## 5. `VerbDef.default` — the thirteen built-in verbs

Object-free, per §0 note 5: these render only when the verb arrives with no
direct object.

| Verb | Variants |
|---|---|
| `take` | 1. Take what? The room is full of candidates and short on volunteers. <br>2. You make the grasping motion. Nothing was named, so nothing is grasped. |
| `drop` | 1. Drop what? You would have to be more specific, and probably holding it. |
| `open` | 1. Open what? Naming it would speed this along considerably. |
| `close` | 1. Close what? The room offers several options and no guidance. |
| `lock` | 1. Lock what, and with what? Both halves of that are missing. |
| `unlock` | 1. Unlock what? There is no shortage of locked things in the world, but you will have to point at one. |
| `put_in` | 1. Put what where? The preposition is doing all the work and none of the thinking. |
| `put_on` | 1. Put what on what? Two nouns, and you have supplied neither. |
| `wear` | 1. Wear what? You look down at yourself and find the question no easier. |
| `remove` | 1. Take off what? Nothing has been named and you are not going to guess in front of witnesses. |
| `read` | 1. Read what? Nothing here has volunteered any text. |
| `turn_on` | 1. Turn on what? The room contains at least one thing that would object. |
| `turn_off` | 1. Turn off what? Say which, and it will be considered. |

---

## 6. `VerbDef.default` — the non-built-in verbs

The rung-2 workhorses. Each is `{name}`-templated. This is the set that makes
an unwritten verb–object pair land, so most carry three or four variants.

**Verb ids below are proposed, not canon** — see the report. They follow the
`BUILTIN_VERB_IDS` naming style (snake_case, one id per concept, synonyms
collected on `VerbDef.words`).

### Inspection

**`examine`** *(words: examine, x, inspect, study, look at)*
1. You look closely at the {name} and find it to be exactly, stubbornly, itself.
2. Closer inspection of the {name} adds detail without adding meaning.
3. You examine the {name}. Whatever it is hiding, it is hiding it well enough to be boring about it.

**`search`** *(search, look in, look through, rummage)*
1. You go through the {name} carefully. It gives up dust, the usual dead insect, and nothing you can use.
2. A thorough search of the {name} produces nothing but the satisfaction of having been thorough.
3. You search the {name} twice, the second time slower, in case thoroughness was the missing ingredient. It was not.

**`look_under`** *(look under, check under)*
1. Under the {name} there is floor, dust, and the small cool draft that lives under things.
2. You check beneath the {name}. Nothing has been hidden there, or if it has, it was hidden well enough to survive you.
3. Underneath: less than you hoped, and more dust than you had budgeted for.

**`look_behind`** *(look behind, check behind)*
1. Behind the {name} there is wall, and the narrow grey world that exists between a wall and a thing pushed against it.
2. You check behind the {name}. The check is quick and the result is wall.
3. Nothing has been left behind the {name}. People rarely leave things where they would be found by anyone willing to bend down.

### Senses

**`touch`** *(touch, feel, stroke)*
1. You touch the {name}. It is about as cold as the room and no more forthcoming.
2. The {name} is solid, textured, and entirely uninterested in the contact.
3. Under your hand the {name} is exactly what it looks like, which is either reassuring or a waste of a perfectly good suspicion.

**`smell`** *(smell, sniff)*
1. The {name} smells faintly of the room it has been sitting in.
2. You smell the {name}. Dust, mostly, and the particular staleness of air that has been indoors longer than you have.
3. The {name} offers no odour worth the effort of having gone and got it.

**`listen`** *(listen, listen to)*
1. You put your ear near the {name} and hear the room, your own pulse, and nothing that belongs to the {name}.
2. The {name} is not making a sound. You listen long enough to be certain, which is longer than it needed.
3. Silence, from the {name}, of the ordinary kind.

**`taste`** *(taste, lick)*
1. You lick the {name}. It tastes of dust, cold surfaces, and a decision you are already reconsidering.
2. The {name} tastes the way objects taste: faintly of metal, faintly of the last hands on it, and mostly of your own bad idea.
3. You taste the {name}. The information gained is not worth writing down, but nobody saw, and that is a victory of its own kind.

### Manipulation

**`push`** *(push, press against, shove)*
1. You push the {name}. It moves the distance a thing moves when it has no particular reason to, and then stops.
2. The {name} accepts the pressure without comment and returns to exactly where it was.
3. You lean on the {name} with real intent. The {name} outlasts the intent.

**`pull`** *(pull, tug, yank, drag)*
1. You pull the {name} toward you. It comes as far as it is willing and no further.
2. The {name} resists in the patient, structural way of something bolted, wedged, or simply heavier than your enthusiasm.
3. You pull. Nothing gives, except slightly, in your back.

**`turn`** *(turn, rotate, twist)*
1. You turn the {name}. It turns. Nothing else in the room takes this as a signal.
2. The {name} rotates obligingly and settles back, having given a full account of itself and nothing more.
3. You give the {name} a quarter turn, then another, on the theory that persistence is a mechanism. It is not, today.

**`move`** *(move, shift, slide, reposition)*
1. You shift the {name} a few inches. The room is not noticeably improved.
2. The {name} moves, reluctantly, and shows you the exact shape of where it used to be.
3. You reposition the {name}. Somewhere, a floor plan is now slightly out of date.

**`shake`** *(shake, rattle, jiggle)*
1. You shake the {name}. Something inside it, or inside you, rattles briefly and settles.
2. The {name} tolerates being shaken and gives nothing up for it.
3. You shake the {name} the way one shakes a machine that has stopped working, which is to say without any theory at all.

**`rub`** *(rub, clean, wipe, polish, dust)*
1. You rub the {name}. It becomes marginally cleaner and no more talkative.
2. The dust comes away on your hand. Underneath the dust is the {name}, unchanged.
3. You polish a small patch of the {name} to a shine, which only makes the rest of it look worse.

**`pry`** *(pry, lever, force, wedge)*
1. You work at the {name}, looking for the seam that would make prying a plan. There isn't one.
2. Prying wants a gap and a lever. The {name} is offering neither.
3. You lean into it. The {name} creaks in a way that is considerably more warning than progress.

**`press`** *(press, push button)*
1. You press the {name} firmly. It presses back, which is what surfaces do.
2. Nothing about the {name} is a button, although you press it as though it might be.

**`tie`** *(tie, attach, fasten, secure)*
1. Tying the {name} would want line, an anchor, and a plan. The plan is usually the part that goes missing.
2. There is nothing here to tie the {name} to, and no knot that would improve matters.

**`untie`** *(untie, unfasten, loosen, detach)*
1. Nothing about the {name} is knotted, fastened, or otherwise awaiting your patience.

**`fill`** *(fill, pour into)*
1. Filling the {name} would want a source. This room is not one.

**`empty`** *(empty, pour out, dump, tip)*
1. You make the motion of upending the {name}. Nothing comes out of it, and it does not go over.
2. The {name} has nothing in it to spill, or is not the sort of thing that spills.

**`plug_in`** *(plug in, connect)*
1. There is no cord on the {name}, no outlet in reach, or no reason. Possibly all three.

### Force

**`break`** *(break, smash, destroy, hit, strike)*
1. You apply violence to the {name}. The {name} declines to become a different shape.
2. Nothing about the {name} suggests it will break usefully, and a great deal about it suggests it will break loudly.
3. You could probably destroy the {name}, given a tool, a reason, and an afternoon. Two of those are missing.

**`kick`** *(kick, stomp)*
1. You kick the {name}. The {name} shudders. Your foot objects. Honours, on balance, go to the {name}.
2. Your boot meets the {name} with a sound that carries considerably further than the damage does.
3. You kick it. Kicking remains an excellent way to learn how solid a thing is and a poor way to change it.

**`cut`** *(cut, slice, saw, tear, rip)*
1. You saw at the {name} without much conviction. It stays in one piece.
2. The {name} does not part, split, or open along any line you can find.
3. Cutting the {name} would want a better edge and a better reason.

**`burn`** *(burn, light, set fire to, ignite)*
1. Nothing here catches. The {name} remains exactly as combustible as it was, which is to say: theoretically.
2. Burning the {name} is a plan with an ending, and the ending is a room full of smoke and every problem you started with.
3. You imagine setting fire to the {name}. It is a brief, warm thought, and it passes.

**`throw`** *(throw, toss, hurl, chuck)*
1. You hold the {name} at throwing height, find nothing here that would be improved by being hit with it, and lower your arm.
2. The throw does not happen. Somewhere between the intent and the release, the {name} makes a persuasive case for staying in your hand.
3. Throwing the {name} would be satisfying, brief, and immediately followed by going and picking the {name} back up.

**`attack`** *(attack, fight, punch, kill)*
1. You start toward the {name} and stop. Whatever you came here for, it does not survive going that way.
2. Violence is available. It is simply, on inspection, a very poor instrument for the problem in front of you.
3. You consider it, and the considering is where it ends. Nothing here gets solved by hitting it.

### Body

**`climb`** *(climb, climb on, scale)*
1. You get a hand on the {name} and discover it was not designed with your ascent in mind.
2. The {name} is not climbable in any way that ends with you both higher and intact.
3. You climb the {name} approximately four inches, which settles the question.

**`jump`** *(jump, hop, leap)* — no direct object
1. You jump. The floor accepts you back without comment.
2. You leave the ground briefly. Nothing about the room changes in the interval.
3. A small, private jump, of the kind nobody is meant to see, and, as far as you can establish, nobody does.

**`enter`** *(enter, get in, go in, board)*
1. There is no getting inside the {name}, and the {name} shows no sign of having an inside.
2. You would have to be smaller, or the {name} would have to be more hospitable. Neither seems likely today.

**`exit`** *(exit, get out, get off)*
1. There is no getting out of the {name}. You are not, technically, in it.

**`sit`** *(sit, sit on, sit down)*
1. You test the {name} with a portion of your weight and decide against committing the rest.
2. Sitting is available in principle. The {name} is not offering.
3. You do not sit down. Whatever is going on here, it is not the sort of thing you sit down in the middle of.

**`stand`** *(stand, stand up, get up)* — no direct object
1. You stand. You were, in every sense that matters, already standing.

**`dig`** *(dig, excavate, burrow)*
1. You dig at the {name} with what you have. At the current rate, completion falls sometime during the next administration.
2. Digging wants a tool, a surface willing to be dug, and a reason. You are short at least two.
3. You scrape at the {name}. A small quantity of material relocates. The situation does not.

**`sleep`** *(sleep, nap, rest)* — no direct object
1. You are not going to sleep here. Whatever else is true, this is not the room for it.
2. Sleep is a fine idea and a worse plan. You stay awake, which is the only version of this that ends with you knowing anything.
3. You close your eyes for a moment. The room is still there when you open them, and so are you.

**`wake`** *(wake, wake up, rouse)*
1. The {name} does not stir, and you find you have no strong argument for why it should.
2. You try to rouse the {name}. Nothing in the attempt is especially persuasive.

**`wave`** *(wave, brandish, flourish)*
1. You wave the {name} around. The air moves. Nothing else does.
2. You give the {name} an experimental flourish. Nothing opens, which was always the likelier outcome.

**`wait`** *(wait, z)* — no direct object
1. You wait. Time, which needed no encouragement, passes.
2. You give the moment a chance to become something. It declines, politely.
3. Nothing happens, at some length.

### Consumption

**`eat`** *(eat, bite, chew, swallow)*
1. You bring the {name} near your mouth on general principle, and then, on further principle, do not.
2. The {name} is not food. It is barely adjacent to food.
3. Hunger is not currently the problem. If it were, the {name} would still not be the answer.

**`drink`** *(drink, sip, swallow from)*
1. There is nothing drinkable about the {name}, and the {name} would like that on the record.
2. The {name} contains no liquid you are willing to be responsible for.

### Social

**`talk_to`** *(talk to, speak to, chat with)*
*Teaches the ASK verb — constitution §9: the failure produces information.*
1. You try to draw the {name} out with general conversation. Ask about something in particular and you will do better.
2. Talking at the {name} produces politeness at best. Name a subject.
3. General conversation gets you general answers. Ask about something.

**`give`** *(give, give to, offer, hand)*
1. The {iobj} does not take the {name}, and does not explain the refusal.
2. You offer the {name}. The offer hangs in the air between you until you take it back.
3. The {name} changes no hands. Whatever the {iobj} wants, it is not this.

**`show`** *(show, show to, present)*
1. You hold up the {name}. The {iobj} looks at it, or near it, and has nothing to add.
2. The {name} is presented for consideration and is not, in the end, considered.

**`yell`** *(yell, shout, scream, holler)* — no direct object
1. You raise your voice. The room takes it, flattens it, and hands back a slightly smaller version.
2. You shout. The sound goes out, finds the walls, and comes back having learned nothing.
3. Nothing answers. On some level you had been counting on that.

**`kiss`** *(kiss, hug, embrace)*
1. You decline to kiss the {name}, and the {name} declines right back. A rare moment of agreement.
2. Whatever is going on here, it is not going that way.

**`sing`** *(sing, hum, whistle)* — no direct object
1. You sing a few bars. The acoustics are unkind and the audience is theoretical.

**`pray`** *(pray)* — no direct object
1. You pray. The ceiling, being the nearest available authority, does not respond.

---

## 7. Later additions — movement, bare verbs, and the two stopped phases

**Added:** 2026-08-30, second pass · **Author:** `narrative-writer`
**Status:** authored prose, awaiting voice review and Ryan's spot-check

Five families that were gaps after the first pass. The five craft constraints
in §0 apply here unchanged, plus three specific to this set:

- **Rotation for these is per-family, not per-node.** Every player walks all
  the variants of each family in order within a few minutes of play, so all
  of them get read, not just variant 1. They are still ordered plainest-first.
- **No template variables are available except `{verb}` in `bareVerb`.**
  In particular there is no `{dir}` and no `{name}`, so the movement families
  say "that direction" rather than naming north or naming a door. If a
  direction template is added later these can be tightened; they are written
  to stand without one.
- **These fire in every room in all five acts**, indoors and out, so no line
  assumes walls, a ceiling, or an interior.

### `move.noExit`

**Fires:** the player goes a direction with no exit at all, or one whose
condition is unmet so the exit is not present. The player must come away
believing *there is no way here*, and be able to draw that on their map.

1. There is no way out in that direction. This place ends there, and goes on ending for as long as you look at it.
2. Nothing leads that way. You establish this the way everyone establishes it: by looking, and then by looking again with more hope.
3. That is not one of the ways out of here. Whatever is over there arrived by some other route.
4. You consider that direction. It is not on offer, and the geography settled that long before you got here.

### `move.blocked`

**Fires:** an exit **exists** in that direction and will not yield right now —
closed, locked, or otherwise held. **Clue.** Distinct from `move.noExit` on
purpose: this one must read as *there is a way here and it is shut*, because
the player's map is built out of the difference. Nothing here implies the
obstacle changed state.

1. There is a way through here, and it is shut. Whatever is closing it will have to be opened first.
2. The way exists. It is simply not open, and it does not open by being walked at.
3. Something stands between you and that direction, closed, and content to stay closed until somebody does something about it.
4. You get as far as the way out and no further. The route is there; the opening is not, yet.

### `bareVerb`

**Fires:** a bare non-built-in verb with no direct object — `SEARCH`, `PUSH`,
`LISTEN`, `PRAY`, `SING`, `WAVE`, and the rest of the ~47. Replaces the
`nounMiss` answer, which asked about a noun the player never typed.

**Template:** `{verb}` — the verb word as the player typed it.

**Substitution note.** Every variant quotes `{verb}` as a *word* rather than
setting it as the head of a transitive clause, so intransitive and odd verbs
survive: "Half a command: the half that says pray" reads as well as "…that
says search." Avoid the obvious "{verb} what?" frame — it is fine for SEARCH
and unusable for PRAY. **Do not move `{verb}` to the start of a line**;
nothing capitalizes it, and a sentence would open lowercase.

1. You have a verb, {verb}, and nothing to aim it at. Name something and try again.
2. The word {verb} hangs there on its own, waiting for a noun. Supply one and it will get to work.
3. Half a command: the half that says {verb}, without the half that says to what.
4. As intentions go, {verb} is a perfectly good one. As sentences go, it is unfinished.

### `dead.refused`

**Fires:** an ordinary command after death. The engine refuses it; no time
passes and nothing changes. Meta commands still work and the shell already
offers UNDO / RESTART ENCOUNTER / RESTART, so **none of these explains the
menu** — they say only that the world has stopped accepting input.

Constitution §11: death is cheap and may be funny. It is never a scolding and
never a time tax, and this is the one place where smugness about the player's
failure would be unforgivable. Nothing below blames them for dying.

1. You are dead. The dead are poor at taking instructions, and worse at carrying them out.
2. Nothing you say reaches the world from here. Whatever was going on in that room is going on without you.
3. The intention is sound. The body it was addressed to has resigned the position.

### `ended.refused`

**Fires:** an ordinary command after an ending. Same refusal, deliberately a
different tone from `dead.refused`: the player finished something, so this is
quiet rather than funny, and it does not explain the menu either.

1. The story is over. Nothing entered here changes what it was.
2. It has finished. The world stops taking instructions at the end — no hard feelings, simply nothing further to do with them.
3. Whatever this is, it happens after the last page, in the quiet part, where nothing gets written down.

---

## 8. Later additions — inventory

**Added:** 2026-08-30, third pass · **Author:** `narrative-writer`
**Status:** authored prose, awaiting voice review and Ryan's spot-check

Two families for the inventory listing. The five craft constraints in §0
apply unchanged, plus two specific to this pair:

- **Rotation is per-family.** There is one inventory node, and a player types
  `I` more often than almost anything else, so **every variant is seen, many
  times, by every player**. They are ordered plainest-first like everything
  else, but the real constraint here is §4's: a line that tries to be funny
  every single time becomes noise, and noise in the middle of a check the
  player is running for information is worse than nothing. These are short
  on purpose.
- **Global, so: no room, no act, no canon.** Nothing below assumes walls,
  weather, a coat, pockets, or that the player has ever owned anything.

### `inventory.empty`

**Fires:** `I` / `INVENTORY` with nothing held and nothing worn.

The opening room begins with empty hands, so variant 1 is a candidate for the
first or second line a player ever reads that is not the opening beats. It is
written flat for that reason: the joke, if any, belongs to the room, not to
the family. In `your_room` the room-scoped override
(`2026-08-30-opening-room-prose.md` §8.9) takes precedence, because there the
empty inventory is a clue; everywhere else in all five acts, these fire.

1. You are carrying nothing. Both hands empty, which is at least easy to keep track of.
2. You take stock. Two hands, the clothes you are standing in, and no property whatsoever.
3. Nothing at all. You check twice, on the grounds that the first check was carried out by somebody who had already decided the answer.

### `inventory.carrying`

**Fires:** `I` / `INVENTORY` with at least one item held or worn. The engine
supplies the item names; this is only the frame.

**My call: a one-line frame, not a bare list.** A bare list is defensible and
I considered it — but in a scrolling REPL the list needs a boundary, or it
reads as a continuation of whatever the last response was, and the player has
to work out where the game stopped talking and started enumerating. One short
line does that for the cost of one line. *"You are carrying:"* is also the
genre's own idiom, and this is not a place to be original at the player's
expense.

Rendered as a header, with the list following on subsequent lines. Each ends
in a colon and carries no terminal period.

1. You are carrying:
2. You have on you:
3. In hand and on your person:

> **Note.** If the engine renders the frame **inline** rather than as a
> header — `You are carrying a hat, a page and a coin.` — use variant 1 only,
> with the colon dropped and the list spliced in; variants 2 and 3 do not
> survive being turned into sentence heads. If the engine prefers a single
> fixed frame over rotation, use variant 1 and drop the others; nothing is
> lost. **ASSUMPTION:** worn items are distinguished by the engine's own
> listing (`(being worn)` or similar) and not by this frame — three frames
> that each had to account for worn-versus-held would be three frames doing
> the engine's job badly.

---

## 9. Later additions — AGAIN with nothing to repeat

**Added:** 2026-08-30, fourth pass · **Author:** `narrative-writer`
**Status:** authored prose, awaiting voice review and Ryan's spot-check

One family. The five craft constraints in §0 apply unchanged, plus:

- **Global.** Fires in every room, in all five acts, indoors and out. Nothing
  below assumes walls, a floor, a room, light, an inventory, or that the
  player has done anything at all — which is the whole condition it answers.
- **Rotation is per-family**, and a player reaches this at most a handful of
  times in a playthrough, usually in the first thirty seconds. Variant 1 is
  therefore the one that has to teach; 2 and 3 are for the player who types
  it again to see what happens, which is exactly the curiosity §8 of the
  constitution says to reward.
- **No template variables.** `{verb}` is not available here — the player may
  have typed `AGAIN` or `G`, and quoting the wrong one back is worse than
  quoting neither.

### `again.nothing`

**Fires:** `AGAIN` / `G` with no previous command to repeat — the first
command of a new game, or the first after a `RESTART`. The engine repeats
nothing; no time passes and nothing changes.

`G` is a convenience players arrive already expecting, and a player who types
it on turn one and gets `unknown` (rung 5) has been told the game does not
know the word, which is false and is the wrong first impression to hand
somebody. Variant 1 says what the verb is for, in one clause, without a
tutorial voice.

1. There is no last command to repeat. Give one, and this will give it a second time.
2. Nothing has been done yet, so there is nothing to do again.
3. You do it all again: the nothing, exactly as before, to precisely the same effect.

> **Note.** Variant 3 performs the action rather than refusing it
> (constitution §8) and implies no state change (§0 note 2) — the player asked
> for a repeat of nothing and gets one. It is the reward for the second try.
> None of the three scolds, and none of them says "I don't understand," which
> is the one thing this family exists to avoid.
>
> **Not authored here:** registering `again` and `g` as words, and the
> ordinary case where there *is* a command to repeat. The engine re-runs the
> stored command and renders whatever that command renders; it should not
> print a frame line of its own before it. That is a wiring decision, not
> prose.

---

## 10. Later additions — `HELP`, `ABOUT`, and the restart confirmation

**Added:** 2026-08-30, fifth pass · **Author:** `narrative-writer`
**Status:** authored prose, awaiting voice review and Ryan's spot-check
**Occasioned by:** Ryan's v0.3.2 playtest — `HELP` and `ABOUT` were never
registered as verbs and returned the `unknown` rung; `RESTART`/`RESET` were
unreachable in the browser shell.
**Authored against:** constitution §9, §11, §12, §14, §20, §21, §22 and
writing guide §19.

Four families. The §0 craft constraints apply, plus four specific to this set:

- **This is chrome, not the narrator.** See the ruling below. None of these
  four families is in the narrator's voice, and none of them should be
  edited toward it.
- **They fire in every room, in all five acts.** No line names a room, an
  act, a chapter, an object, a character, or how far along the player is.
  Nothing here is canon and nothing here goes stale as rooms are added — the
  one exception is flagged inline in `meta.about`.
- **No template variables.** None are available and none are wanted.
- **Fixed text, not rotations.** A player who types `HELP` twice wants the
  same answer twice. Variety here is a bug.

### The voice ruling

> **`HELP`, `ABOUT`, and the restart confirmation are chrome. They speak
> from outside the fiction, like `END OF BUILD`.**

Four reasons, in order of weight:

1. **A player types `HELP` because the fiction has stopped working for
   them.** Answering in the voice of the thing that just failed them is a
   second failure. Clarity is the whole job.
2. **The narrator is *slightly adversarial* (guide §3).** An adversarial
   help screen is the definition of pointlessly cruel, and guide §5 already
   requires the narrator to step aside when the moment needs it. A stuck
   player is that moment.
3. **Constitution §22: logistics should disappear.** Putting a persona on
   logistics is how you make them appear.
4. **The restart prompt asks the player to confirm destroying something.**
   A joke landing there is not dry, it is careless.

Chrome does not mean careless prose. These are written plainly, in short
declarative sentences, with nothing in them reaching for a laugh — guide §19
applied by simply never starting. One sentence at the end of `HELP` tells
the player the game rewards ridiculous input, because that is *information*
about how to play (constitution §8, §14), and a player who does not have it
plays the game far too carefully.

### `meta.help`

**Fires:** `HELP`, `?`, `COMMANDS`, `WHAT CAN I DO`. Meta — costs no turn.
Static; no rotation, no state, no context sensitivity. Context-sensitive
help may come later and would be a different family.

```text
INTENTIONALLY BLANK is a parser game. You type what you want to do, in
plain English, and the game works out what you meant. Most commands are a
verb and a thing:

    OPEN THE DESK        READ THE LETTER        LOOK UNDER THE BED

The things you can name are the things the writing names. If a description
mentions a lamp, a window, a stain on the ceiling, you can EXAMINE it — and
examining something usually names more things worth examining. Reading the
room and then looking at the nouns in it is most of how this game is played.

Verbs worth knowing:

  LOOK, EXAMINE (X), SEARCH, READ
  LOOK UNDER, LOOK BEHIND, TOUCH, SMELL, LISTEN
  TAKE, DROP, OPEN, CLOSE, PUSH, PULL, TURN, MOVE, CLIMB
  NORTH, SOUTH, EAST, WEST, UP, DOWN, IN, OUT
  (abbreviated N, S, E, W, U, D)

Commands that stand on their own:

  LOOK (L)        describe where you are again
  INVENTORY (I)   what you are carrying
  AGAIN (G)       repeat your last command
  WAIT (Z)        let a moment pass
  SAVE            store your progress
  UNDO            take back the last turn
  RESTART         begin again from the start (it will ask first)
  ABOUT           what this game is

Phrasing is forgiving. Articles are optional, abbreviations work, and
several wordings usually reach the same action. When a command does not
work, the response will normally tell you why rather than only refusing.

Try odd things. A good deal of the writing in this game exists only for
players who tried something unreasonable first.
```

> **Wiring preconditions — cut lines, do not rewrite them.** This text names
> only commands verified against `src/content/world/act1/verbs.ts`, with four
> exceptions that are being added in the same change as this family. If any
> of them is not registered when `HELP` ships, **delete that one line** from
> the "stand on their own" block and change nothing else; each is a whole
> line and removing one leaves the text intact.
>
> - `SAVE` — not a registered verb. The browser shell exposes save as a
>   button only (`src/ui/controller.ts` `saveNow`); typed `SAVE` reaches the
>   parser and returns `unknown`. Works in the CLI REPL.
> - `UNDO` — same: a button in the browser, typed-only in the CLI.
> - `RESTART` — being wired in this change, with the confirmation below.
> - `ABOUT` — being wired in this change.
>
> **Deliberately absent, and why.** `HINT` is *not* listed: `availableHints`
> currently returns nothing anywhere in Act I, so a player who typed it
> would be told there is nothing to hint at, which teaches the wrong thing
> about a feature that will matter later. `TALK TO` / `ASK … ABOUT` are not
> listed either: no NPC and no such verb exists in `act1`. Both lines are
> authored below and should be inserted the moment their precondition holds.
>
> - `  HINT            a nudge toward what you are stuck on, one step at a time`
>   — insert after `WAIT (Z)` once any puzzle in the current build declares
>   hints. Wording matches constitution §21: progressive, player-controlled.
> - `  TALK TO, ASK … ABOUT, SHOW … TO, GIVE … TO` — insert as a fifth line
>   in the verb block the first time a room ships with somebody in it.
>
> **`MAP` and `OPEN QUESTIONS`** (constitution §20) are absent for the same
> reason and should join the "stand on their own" block when they exist.

### `meta.about`

**Fires:** `ABOUT`, `CREDITS`, `INFO`. Meta — costs no turn. Static.

No story canon: no year, no place, no names from the fiction, nothing about
who the player is. This is about the artifact.

```text
INTENTIONALLY BLANK
A text adventure by Ryan Grissinger.

A parser, a world that behaves the same way twice, prose written by hand,
and a mystery that gives up its answers slowly — built in the tradition of
the Infocom games.

This is a build in progress rather than a finished game. It ends at the top
of the stairs; everything past that is still being written.

Type HELP for how to play.
```

> **The one line here that will go stale**, on purpose and with permission:
> *"It ends at the top of the stairs; everything past that is still being
> written."* It is currently true (`objects/landing.ts`'s `END OF BUILD`
> text says the same thing from inside the world) and a player who walks
> into the boundary deserves the context. It is its own sentence so it can
> be replaced or deleted in one edit. **Whoever extends the world past the
> landing owns deleting it.**
>
> The build number is deliberately not printed here — the browser footer
> already shows `v{GAME_VERSION}`, and the CLI has `VERSION`. Naming a
> version in prose is a second place to forget to bump.

### `restart.confirm`

**Fires:** `RESTART` or `RESET`. The engine has **not** restarted anything
yet; this is the question, and the game is waiting on the answer.

Constitution §9 separates failure from punishment and §11 refuses to make a
player pay a time tax. Typing four letters and losing a session is exactly
that tax. The consequence has to be unmistakable in one sentence, and then
the question has to get out of the way — a player is either sure or they
are not, and a paragraph does not change which.

```text
This ends the current playthrough and begins again from the start. Restart?
```

> Nothing about how far along they are — this fires in every act, and it
> cannot know. Nothing about saves either: whether a save survives a restart
> is a save-system fact, and stating it in prose would be a promise the
> prose cannot keep. "Ends the current playthrough" is true regardless.

### `restart.declined`

**Fires:** the player answers no. Nothing happened; no turn passes.

```text
Nothing has changed. The game is where you left it.
```

> Changing your mind is not a failure and this does not treat it as one:
> no "very well", no "as you wish", no relief, no joke. The second sentence
> exists because the player's live worry at that instant is *did I just
> break something* — answering it is the entire job of the line.

### The confirmed case — no line

**Ruling: the confirmed restart prints nothing of its own.** The opening
beat fires immediately and it opens with `Darkness. Your head hurts.`
Anything in front of that — "Restarting.", "Very well.", a rule of dashes —
is chrome standing between the player and the first line of the game, and
the game beginning again *is* the confirmation. A player who just answered
yes to "Restart?" and sees the opening does not need to be told which of the
two things happened.

The one exception, and it is the shell's, not prose: if the restart is not
instantaneous, the shell may show its own progress indicator. That is not a
response family and nothing is authored for it here.

> **Not authored here:** registering `help`, `?`, `commands`, `what can i
> do`, `about`, `credits`, `info`, `restart`, `reset` as verb words; marking
> them `meta: true` so they cost no turn; the yes/no mechanism the
> confirmation uses; and whether the browser death menu's existing RESTART
> *button* should route through the same confirmation. Those are wiring
> decisions. Note that `ids.ts` will need ids for these and that
> `validate.ts` requires a non-null `default` on each.

---

## 11. Later additions — `USE`

**Added:** 2026-08-30, sixth pass · **Author:** `narrative-writer`
**Status:** authored prose, awaiting voice review and Ryan's spot-check
**Occasioned by:** Ryan's playtest — `USE DOOR` in the opening room reached
no verb at all. `USE` is being registered; for doors it walks the player
through (`USE DOOR` = `ENTER DOOR` = `GO THROUGH DOOR`). This family answers
everything else.
**Authored against:** constitution §8, §9, §14 and writing guide §3, §5, §19.

One family. The five craft constraints in §0 apply unchanged, plus three
specific to it:

- **`USE` is a request for a hint wearing the clothes of an action.** A
  player types it when they are sure the thing matters and unsure what the
  game wants done to it. The most useful thing the line can do is get them
  to picture a specific motion — so the teaching is real, and it has to
  survive being read as prose rather than as a tooltip. Every variant below
  puts the missing piece in the player's *intention*, where it actually is,
  rather than in their grammar. Nothing here says "be more specific,"
  because that sentence is correct and unbearable.
- **`{name}` may be anything, including a person.** Not one of these assumes
  the thing is a tool, has moving parts, or can be operated. They work for a
  lamp, a page, a staircase, and Eli.
- **No state change**, per §0 note 2. Nothing is picked up, switched, or
  approached; the attempt stops at the point where it would have had to
  become a particular action.

### `use.default`

**Fires:** `USE <thing>` where the thing is not a door and no authored
handler covers the pair. Rung 2.

Variant 1 carries the teaching, since rotation is per-node
(`action.use.<objectId>`) and a player who uses `USE` across a room's
contents will read it several times before reaching the others. It is the
only variant with no imperative in it — an order is what turns a nudge into
a scolding, and the player has not done anything wrong.

1. You intend to use the {name}. Intention is the easy half; the other half is deciding what using it would involve.
2. The {name} is willing. It is the nature of the service that remains unspecified.
3. Using is not itself an activity. It is the category the activities go in, and you will have to pick one out of it.
4. You use the {name} in the general sense, which is the sense in which nothing ever happens. Name the particular thing and something might.

> **Note.** Variant 2 is the same bureaucratic register as guide §14's
> running humor and lands equally on an object and on a person — "the nature
> of the service" is funnier about Eli than about a lamp, and cruel about
> neither. Variant 3 is the philosophical reading and is the closest this
> family comes to stating the rule outright; it is placed third because a
> player only reaches it by poking the same thing repeatedly, which is
> exactly the curiosity constitution §8 says to reward. Variant 4 is for the
> player who has decided to find out how long this goes on, and it stops
> short of smug: the joke is on the word, not on them.
>
> **Not authored here:** the door case, which is engine behavior, not prose —
> `USE DOOR` performs the movement and renders whatever the movement
> renders, with no framing line of its own in front of it. Also not
> authored: the verb id and word list. **PROPOSED, not canon:** id `use`,
> words *use, utilize, operate, employ, apply, work*. `ENTER` and
> `GO THROUGH` are movement-side and belong to the mover, not to this family.
