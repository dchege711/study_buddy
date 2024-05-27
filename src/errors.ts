/**
 * A helper class for errors that the user can overcome with the appropriate
 * action.
 */
export class UserRecoverableError extends Error {
  /** A message that will be shown to the user to help them fix the error. */
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
