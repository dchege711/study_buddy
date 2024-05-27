/**
 * A helper class for errors that the user can overcome with the appropriate
 * action.
 */
export class UserRecoverableError extends Error {
  /** The URL where the user should be redirected to. */
  redirectURL: string;

  /** A message that will be shown to the user to help them fix the error. */
  message: string;

  constructor(message: string, redirectURL: string) {
    super(message);
    this.redirectURL = redirectURL;
    this.message = message;
  }
}
