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
  ],
  'ask.generic': [
    '{who} has no recorded opinion on {topic}. Neither, on reflection, do you.',
  ],
  look: [
    'You are sitting in front of a computer. The computer is, in turn, in front of you. Neither of you seems inclined to make the first move.',
  ],
  help: [
    'You could try saying something, asking someone about something, looking around, or inquiring about the time or the weather. The computer accepts these with the enthusiasm of a municipal office.',
  ],
  hello: [
    'The computer does not say hello back. It does, however, blink, which you choose to interpret generously.',
  ],
  whoami: [
    'An excellent question, and one the computer declines to answer on the grounds that it was not asked politely enough, or at all, by anyone with the correct credentials.',
  ],
  time: [
    'The clock in the corner of the screen displays a time. You look at it for a while. It continues to be a time.',
  ],
  weather: [
    'There is a window. Beyond it there is, presumably, weather. The computer is not prepared to speculate.',
  ],
  unknown: [
    'The computer gives this considerable thought and ultimately decides it has no idea what you mean.',
  ],
  'prompt.refused': [
    'The dialog box remains where it is, with the patience of a thing that has never once been closed by wishing.',
  ],
  'over.refused': [
    'The game is over. This is, in most legal jurisdictions, the end of the game.',
  ],
  version: [`Intentionally Blank v${GAME_VERSION}.`],
} as const satisfies Record<string, readonly string[]>;

export type ResponseId = keyof typeof RESPONSES;

/** `say` inputs with a bespoke reply; keys are normalized (lowercase) text. */
export const SAY_SPECIAL: Readonly<Record<string, string>> = {
  'hello world': 'Hello, world.',
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
  if (t === '') return '…';
  const cap = t.charAt(0).toUpperCase() + t.slice(1);
  return /[.!?…]$/.test(cap) ? cap : `${cap}.`;
}
