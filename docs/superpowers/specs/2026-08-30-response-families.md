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
