import { GAME_VERSION } from '../version';

export const OPENING: readonly string[] = [
  'You are sitting in front of a computer.',
  'The cursor blinks patiently.',
  'You have the vague impression that something important is supposed to happen, although the computer seems unwilling to elaborate.',
];

/** Authored responses. First variant of each id is from the brief where one exists. */
export const RESPONSES = {
  'ask.jeeves.weather': [
    'Jeeves considers the matter.\n\n"The weather is adequate."',
    'Jeeves considers the matter with the gravity of a man consulting instruments he does not have.\n\n"The weather is adequate."',
    'Jeeves considers the matter.\n\n"The weather is adequate. It has been adequate for some time. Adequacy is, in the end, what one hopes for."',
  ],
  'ask.generic': [
    '{who} has no recorded opinion on {topic}. Neither, on reflection, do you.',
    'The computer forwards your question about {topic} to {who}, or to something it sincerely believes is {who}, and receives nothing back.',
    'Somewhere a query concerning {topic} is addressed to {who} and quietly declines to arrive. The cursor resumes blinking.',
    'The subject of {topic} is put to {who} and produces no comment, no acknowledgment, and no discernible interest.',
  ],
  look: [
    'You are sitting in front of a computer. The computer is, in turn, in front of you. Neither of you seems inclined to make the first move.',
    'The room is quiet in the specific way a room is quiet when a machine is running in it. There is a chair, a desk, a window, and a screen. The screen is the only one of them with anything to say.',
    'The cursor blinks. It was blinking before you sat down and shows every sign of outlasting you, and whatever it is waiting for, it is in no hurry to explain.',
    'Beyond the screen is a window. Beyond the window is the ordinary outdoors. Between them, at the approximate center of everything, sits you, in a chair chosen by somebody else.',
  ],
  help: [
    'You could try saying something, asking someone about something, looking around, or inquiring about the time or the weather. The computer accepts these with the enthusiasm of a municipal office.',
    'There is no manual and no menu, and the computer has no strong feelings about your ignorance. You may look around, say something, ask someone about something, offer a greeting, or raise the subject of the time or the weather.',
    'Help, to this computer, means reciting the things it already knows how to be asked: look, help, hello, who are you, the time, the weather, say something, ask someone about something. It considers the list generous.',
    'You may look around, greet the machine, ask it who you are, ask someone about something, say something out loud, or bring up the time or the weather. Anything else will be received, considered, and misunderstood.',
  ],
  hello: [
    'The computer does not say hello back. It does, however, blink, which you choose to interpret generously.',
    'The word crosses the room, finds nobody in it but you, and settles quietly into the carpet.',
    'Your greeting is received with the composure of something that was not expecting one and does not expect the next.',
    'Somewhere, something logs the fact that you said hello. Nothing on the screen changes. The room does not become noticeably warmer.',
  ],
  whoami: [
    'An excellent question, and one the computer declines to answer on the grounds that it was not asked politely enough, or at all, by anyone with the correct credentials.',
    'The computer is a computer. You are, as far as it can determine, the person operating the computer. It records this as a working hypothesis rather than a finding.',
    'The screen offers no name, no account, and no sign of wanting either. That will hold for a while yet.',
    'Identity, the computer implies, is an administrative matter, and administration is closed.',
  ],
  time: [
    'The clock in the corner of the screen displays a time. You look at it for a while. It continues to be a time.',
    'It is later than it was when you sat down and earlier than it will be when you stop asking. The computer regards this as sufficient.',
    'The computer knows the time to a precision nobody has ever needed and declines to round it for your convenience.',
    'The hour is available. The date is available. What is not available is any indication of why you wanted them.',
  ],
  weather: [
    'There is a window. Beyond it there is, presumably, weather. The computer is not prepared to speculate.',
    'The computer has never been outside and is not about to start guessing. It suggests, by doing nothing whatsoever, that you try the window.',
    'Outside, weather is happening at its usual rate. Inside, a fan turns over somewhere in the machine, which is the closest thing this room has to a climate.',
    'Weather belongs to some other department. The computer does not know which one, but is confident that the Internet is full of them.',
  ],
  unknown: [
    'The computer gives this considerable thought and ultimately decides it has no idea what you mean.',
    'The cursor blinks twice, which in this room passes for a shrug.',
    'The request is received, weighed, and returned unopened.',
    'The computer parses this, fails, parses it a second time in case the first failure was a fluke, and files the result under "later".',
  ],
  'prompt.refused': [
    'The dialog box remains where it is, with the patience of a thing that has never once been closed by wishing.',
    'The dialog box is modal. Whatever you were doing before, you are not doing it now.',
    'The room, the computer, and the window are all still there, behind a small gray rectangle that has made itself the only subject under discussion.',
    'The computer is no longer taking questions. It is taking credentials.',
  ],
  'over.refused': [
    'The game is over. This is, in most legal jurisdictions, the end of the game.',
    'You are under arrest. Arrest is a full-time occupation and leaves very little room for hobbies.',
    'The room now belongs to a different jurisdiction. There is a RESTART, and it is the only verb still in service.',
    'Whatever you had in mind, the window for it closed at roughly the same moment the door opened.',
  ],
  version: [`Intentionally Blank v${GAME_VERSION}.`],
} as const satisfies Record<string, readonly string[]>;

export type ResponseId = keyof typeof RESPONSES;

/** `say` inputs with a bespoke reply; keys are normalized (lowercase) text. */
export const SAY_SPECIAL: Readonly<Record<string, string>> = {
  'hello world': 'Hello, world.',
  'please': 'The computer was not expecting to be asked nicely, and takes a moment longer over it than strictly necessary. Then it does nothing, politely.',
  'intentionally blank': 'THIS RESPONSE INTENTIONALLY LEFT BLANK.',
};

/** Deterministic variant selection. */
export function pick(variants: readonly string[], n: number): string {
  const v = variants[((n % variants.length) + variants.length) % variants.length];
  if (v === undefined) throw new Error('pick: empty variants');
  return v;
}

/** Replace `{name}` placeholders. */
export function fill(template: string, vars: Readonly<Record<string, string>>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? `{${k}}`);
}

/** The computer repeats what you said, tidied. */
export function formatSay(text: string): string {
  const special = SAY_SPECIAL[text.toLowerCase()];
  if (special) return special;
  const t = text.trim();
  if (t === '') return '\u2026';
  const cap = t.charAt(0).toUpperCase() + t.slice(1);
  return /[.!?\u2026]$/.test(cap) ? cap : `${cap}.`;
}
