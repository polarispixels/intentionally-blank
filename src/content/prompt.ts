export const PROMPT = {
  title: 'ACCOUNT REQUIRED',
  body: 'Your complimentary Internet session has expired.\n\nCreate an account to continue.',
  usernamePlaceholder: 'user',
  hint: 'The username is "user". The password is "password". The system wishes to stress that it is describing the situation, not recommending it.',
  forgotLabel: 'Forgot password?',
} as const;

export const CREDENTIALS = { username: 'user', password: 'password' } as const;

/** Indexed by failed attempt number (1-based); the last entry repeats. */
export const LOGIN_FAIL: readonly string[] = [
  'Incorrect. The system notes, without judgment, that you appear to be trying.',
  'Incorrect again. The system has quietly filled in a suggestion. It would rather you did not ask how it knows.',
  'Still incorrect. At this point the system is less a gatekeeper than a spectator.',
];
