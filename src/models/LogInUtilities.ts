"use strict";

/**
 * A collection of functions that are useful for managing user state within the
 * app.
 *
 * @module
 */

import { FilterQuery } from "mongoose";
import * as stanfordCrypto from "sjcl";
import * as config from "../config";
import { APP_NAME } from "../config";
import { UserRecoverableError } from "../errors";
import { createMany } from "./CardsMongoDB";
import * as Email from "./EmailClient";
import { Card } from "./mongoose_models/CardSchema";
import { Metadata } from "./mongoose_models/MetadataCardSchema";
import { IToken, Token } from "./mongoose_models/Token";
import { IUser, User } from "./mongoose_models/UserSchema";

const DIGITS = "0123456789";
const LOWER_CASE = "abcdefghijklmnopqrstuvwxyz";
const UPPER_CASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * @description Clean up resources before exiting the script.
 */
export function close() {
  return new Promise(function(resolve) {
    Email.close();
    resolve(null);
  });
}

interface SaltAndHash {
  salt: stanfordCrypto.BitArray;
  hash: stanfordCrypto.BitArray;
}

/**
 * @description Generate a salt and a hash for the provided password. We found
 * CrackStation's piece on [salted password hashing]{@link https://crackstation.net/hashing-security.htm}
 * informative.
 *
 * @returns {Promise} the resolved value is an array where the first element is
 * the salt and the second element is the hash.
 */
const getSaltAndHash = function(password: string): SaltAndHash {
  // 8 words = 32 bytes = 256 bits, a paranoia of 7
  const salt = stanfordCrypto.random.randomWords(8, 7);
  const hash = stanfordCrypto.misc.pbkdf2(password, salt);
  return { salt, hash };
};

/**
 * @returns {Promise} resolves with the hash computed from the provided
 * `password` and `salt` parameters.
 */
const getHash = function(
  password: string,
  salt: stanfordCrypto.BitArray,
): stanfordCrypto.BitArray {
  return stanfordCrypto.misc.pbkdf2(password, salt);
};

/**
 * @description Generate a random string from the specified alphabet.
 * @param {Number} stringLength The length of the desired string.
 * @param {String} alphabet The characters that can be included in the string.
 * If not specified, defaults to the alphanumeric characters.
 */
export function getRandomString(
  stringLength: number,
  alphabet = DIGITS + LOWER_CASE + UPPER_CASE,
) {
  let random_string = "";
  for (let i = 0; i < stringLength; i++) {
    // In JavaScript, concatenation is actually faster...
    random_string += alphabet.charAt(
      Math.floor(Math.random() * alphabet.length),
    );
  }
  return random_string;
}

interface UniqueIDAndValidationURI {
  userIDInApp: number;
  validationURI: string;
}

/**
 * @description Generate a User ID and a validation string, and make sure they
 * are unique in the database. This method does not save the generated user ID
 * or validation URL.
 *
 * @returns {Promise} the first param is a user ID and the second is a
 * validation string.
 */
const getIdInAppAndValidationURI = async function(): Promise<
  UniqueIDAndValidationURI
> {
  let lookingForUniqueIDAndURL = true,
    userIDInApp: number = 0,
    validationURI: string = "";
  while (lookingForUniqueIDAndURL) {
    userIDInApp = parseInt(getRandomString(12, "123456789"), 10);
    validationURI = getRandomString(32, LOWER_CASE + DIGITS);
    const conflictingUser = await User
      .findOne({
        $or: [
          { userIDInApp: userIDInApp },
          { account_validation_uri: validationURI },
        ],
      }).exec();

    if (conflictingUser === null) {
      lookingForUniqueIDAndURL = false;
    }
  }
  return Promise.resolve({ userIDInApp, validationURI });
};

/**
 * @description Generate a unique session token.
 * @param {JSON} user The user to be associated with this token. Expected keys:
 * `userIDInApp`, `username`, `email`, `cardsAreByDefaultPrivate` and
 * `createdAt`
 * @returns {Promise} resolves with a JSON object keyed by `success`, `status`
 * and `message`. The message field contains the following keys: `token_id`,
 * `userIDInApp`, `username`, `email`, `cardsAreByDefaultPrivate` and
 * `userRegistrationDate`.
 */
const provideSessionToken = async function(
  user: Pick<
    IUser,
    | "userIDInApp"
    | "username"
    | "email"
    | "cardsAreByDefaultPrivate"
    | "createdAt"
  >,
): Promise<IToken> {
  const sessionToken = getRandomString(64, LOWER_CASE + DIGITS + UPPER_CASE);

  const conflictingToken = await Token.findOne({ value: sessionToken }).exec();
  if (conflictingToken) {
    return provideSessionToken(user);
  }

  return Token.create({
    token_id: sessionToken,
    userIDInApp: user.userIDInApp,
    username: user.username,
    email: user.email,
    cardsAreByDefaultPrivate: user.cardsAreByDefaultPrivate,
    userRegistrationDate: new Date(user.createdAt).toDateString(),
  });
};

/**
 * @description Send a validation URL to the email address associated with the
 * account. The validation URL must be present in `userDetails`. This method
 * does not generate new validation URLs.
 *
 * @param {JSON} userDetails Expected keys: `email`, `account_validation_uri`
 * @param {Promise} resolves with a JSON object having the keys `success`,
 * `message`, `status`.
 */
const sendAccountValidationURLToEmail = function(
  userDetails: Pick<IUser, "email" | "account_validation_uri">,
): Promise<string> {
  return Email.sendEmail({
    to: userDetails.email,
    subject: `Please Validate Your ${APP_NAME} Account`,
    text: `Welcome to ${APP_NAME}! Before you can log in, please click `
      + `on this link to validate your account.\n\n`
      + `${config.BASE_URL}/verify-account/${userDetails.account_validation_uri}`
      + `\n\nAgain, glad to have you onboard!`,
  }).then(() => {
    return Promise.resolve(
      `If ${userDetails.email} has an account, we've sent a validation URL.`,
    );
  });
};

export type SendAccountValidationLinkParams = Pick<IUser, "email">;

/**
 * @param {JSON} payload Expected keys: `email`
 * @returns {Promise} resolves with a JSON object keyed by `success`, `status`
 * and `message`
 */
export async function sendAccountValidationLink(
  payload: SendAccountValidationLinkParams,
): Promise<string> {
  const user = await User.findOne({ email: { $eq: payload.email } }).exec();
  if (user === null) {
    return `If ${payload.email} has an account, we've sent a validation URL`;
  }

  if (user.account_validation_uri === "verified") {
    return `${payload.email} has already validated their account.`;
  }

  const { validationURI } = await getIdInAppAndValidationURI();
  user.account_validation_uri = validationURI;
  await user.save();

  return sendAccountValidationURLToEmail(user)
    .then(() =>
      `If ${payload.email} has an account, we've sent a validation URL`
    );
}

/**
 * @description Once an account is registered, the user needs to click on a
 * validation link sent to the submitted email. ~~The user cannot log into
 * the app before the email address is verified.~~ We observed a high bounce
 * rate AND few signups, so we'll allow accounts with unvalidated email
 * addresses to sign in for at most 30 days.
 */
export async function validateAccount(validationURI: string): Promise<string> {
  const user = await User.findOne({ account_validation_uri: validationURI })
    .exec();

  // TODO(dchege711): How can we know that the user is already verified?
  if (user === null) {
    return Promise.reject(
      new UserRecoverableError("The validation URL is invalid."),
    );
  }

  user.account_validation_uri = "verified";
  user.account_is_valid = true;
  await user.save();

  return `Successfully validated ${user.email}. Redirecting you to login`;
}

export type RegisterUserAndPasswordParams =
  & Pick<IUser, "username" | "email">
  & { password: string };

/**
 * @description Register a new user using the provided password, username and
 * email.
 *
 * - If the username is taken, we let the user know that.
 * - If the email address is already taken, send an email to that address
 *   notifying them of the signup.
 * - If the input is invalid, e.g. a non alphanumeric username, raise an error
 *   since it should have been caught on the client side.
 * - Otherwise, register the user and send them a validation link.
 *
 * @returns {Promise} Resolves with a confirmation message that should be shown
 * to the user.
 */
export async function registerUserAndPassword(
  payload: RegisterUserAndPasswordParams,
): Promise<string> {
  const conflictingUser = await User.findOne({
    $or: [{ username: payload.username }, { email: payload.email }],
  }).exec();
  if (conflictingUser !== null) {
    return conflictingUser.username === payload.username
      ? Promise.reject(new UserRecoverableError("Username already taken."))
      : Promise.reject(new UserRecoverableError("Email already taken."));
  }

  const { salt, hash } = await getSaltAndHash(payload.password);
  const { userIDInApp, validationURI } = await getIdInAppAndValidationURI();
  const user = await User.create({
    username: payload.username,
    salt: salt,
    hash: hash,
    userIDInApp: userIDInApp,
    email: payload.email,
    account_is_valid: false,
    account_validation_uri: validationURI,
  });
  await Metadata.create({ createdById: userIDInApp, metadataIndex: 0 });
  await sendAccountValidationURLToEmail(user);

  const starterCards = [
    {
      title: "Example of a Card Title",
      tags: "sample_card",
      description:
        "# Hash Tags Create Headers\n\n* You can format your cards using markdown, e.g.\n* Bullet points\n\n1. Numbered lists\n\n *So*, **many**, ~~options~~\n\n> See [the Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)",
      createdById: userIDInApp,
      urgency: 10,
      parent: "",
      isPublic: false,
    },
    {
      title: "Sample Card With Image",
      tags: "sample_card",
      description:
        "When linking to an image, you can optionally specify the width and height (image credit: XKCD)\n\n![xkcd: Alpha Centauri](https://imgs.xkcd.com/comics/alpha_centauri.png =25%x10%)",
      createdById: userIDInApp,
      urgency: 9,
      parent: "",
      isPublic: false,
    },
    {
      title: "Sample Card With Spoiler Tags",
      tags: "sample_card",
      description:
        "> How do I quiz myself? \n\n[spoiler]\n\n* Anything below the first '[spoiler]' will be covered by a gray box. \n* Hovering over / clicking on the gray box will reveal the content underneath.\n* Also note how the urgency influences the order of the cards. Cards with lower urgency are presented last.",
      createdById: userIDInApp,
      urgency: 8,
      parent: "",
      isPublic: false,
    },
    {
      title: "Code Snippets and LaTeX",
      tags: "sample_card",
      description:
        "* Feel free to inline LaTeX \\(e = mc^2\\) or code: `int n = 10;`\n\n* Standalone LaTeX also works, e.g.\n$$ e = mc^2 $$\n\n* When writing code blocks, specify the language so that it's highlighted accordingly, e.g.\n```python\nimport sys\nprint(sys.version)\n```",
      createdById: userIDInApp,
      urgency: 7,
      parent: "",
      isPublic: false,
    },
    {
      title: "Putting It All Together",
      tags: "sample_card",
      description:
        "> Give examples on when these problem solving techniques are appropriate:\n* Defining a recurrence relation.\n* Manipulating the definitions.\n* Analyzing all possible cases.\n\n\n\n[spoiler]\n\n### Define a recurrence and identify base/boundary conditions\n* Useful when knowing a previous state helps you find the next state.\n* Techniques include plug-and-chug and solving for characteristic equation.\n\n### Manipulating the Definitions\n* Useful for proving general statements with little to no specificity.\n\n### Analyzing all possible cases\n* Sometimes there's an invariant that summarizes all possible cases into a few cases, e.g. *Ramsey's 3 mutual friends/enemies for n >= 6*",
      createdById: userIDInApp,
      urgency: 6,
      parent: "",
      isPublic: false,
    },
  ];
  await createMany(starterCards);

  return `Welcome to ${APP_NAME}! We've also sent a validation URL to ${user.email}. Please validate your account within 30 days.`;
}

export type AuthenticateUser = Pick<
  IUser & IToken,
  | "token_id"
  | "userIDInApp"
  | "username"
  | "email"
  | "cardsAreByDefaultPrivate"
  | "user_reg_date"
>;

export interface AuthenticateUserParam {
  username_or_email: string;
  password: string;
}

/**
 * @description Authenticate a user that is trying to log in. When a user
 * successfully logs in, we set a token that will be sent on all subsequent
 * requests. Logging in should be as painless as possible. Since the usernames
 * only contain `[_\-A-Za-z0-9]+`, we can infer whether the submitted string
 * was an email address or a username, and authenticate accordingly. If the
 * username/email/password is incorrect, we send a generic
 * `Invalid username/email or password` message without disclosing which is
 * incorrect. It's possible to enumerate usernames, so this is not entirely
 * foolproof.
 */
export async function authenticateUser(
  payload: AuthenticateUserParam,
): Promise<AuthenticateUser> {
  let identifierQuery: FilterQuery<IUser> = {};
  const submittedIdentifier = payload.username_or_email;
  if (submittedIdentifier.includes("@")) {
    identifierQuery = { email: { $eq: submittedIdentifier } };
  } else {
    identifierQuery = { username: { $eq: submittedIdentifier } };
  }

  const password = payload.password;

  const user = await User.findOne(identifierQuery).exec();
  if (user === null) {
    return Promise.reject(
      new UserRecoverableError(
        `No user matching "${submittedIdentifier}" found.`,
      ),
    );
  }

  const computedHash = getHash(password, user.salt);
  let thereIsAMatch = computedHash.length === user.hash.length;
  if (thereIsAMatch) {
    for (let i = 0; i < computedHash.length; i++) {
      if (computedHash[i] !== user.hash[i]) {
        thereIsAMatch = false;
        break;
      }
    }
  }
  if (!thereIsAMatch) {
    return Promise.reject(
      new UserRecoverableError("Incorrect username/email and/or password"),
    );
  }

  const userToken = await provideSessionToken(user);

  return {
    token_id: userToken.token_id,
    userIDInApp: user.userIDInApp,
    username: user.username,
    email: user.email,
    cardsAreByDefaultPrivate: user.cardsAreByDefaultPrivate,
    user_reg_date: userToken.user_reg_date,
  };
}

/**
 * @description Provide an authentication endpoint where a session token has
 * been provided. Useful for maintaining persistent logins.
 *
 * @param {String} tokenID The token that can be used for logging in. This is
 * stored on the Request object.
 *
 * @returns {Promise} Resolves with an `AuthenticateUser` object if the token is
 * valid, and otherwise `null`. Never rejects.
 */
export async function authenticateByToken(
  tokenID: string,
): Promise<AuthenticateUser | null> {
  return Token.findOne({ token_id: tokenID }).exec()
    .then(async (token) => {
      if (!token) {
        return Promise.resolve(null);
      }

      const user = await User.findOne({ userIDInApp: token.userIDInApp })
        .exec();
      if (!user) {
        return Promise.resolve(null);
      }

      return {
        token_id: token.id,
        userIDInApp: user.userIDInApp,
        username: user.username,
        email: user.email,
        cardsAreByDefaultPrivate: user.cardsAreByDefaultPrivate,
        user_reg_date: token.user_reg_date,
      };
    });
}

/**
 * @description Delete a token from the database. Fail silently if no token
 * has the specified ID.
 * @param {String} sessionTokenID The ID of the token to be removed
 * @returns {Promise} resolves with a JSON object with keys `success`, `status`
 * and `message` as keys.
 */
export async function deleteSessionToken(
  sessionTokenID: string,
): Promise<void> {
  await Token.findOneAndDelete({ token_id: sessionTokenID }).exec();
}

export type ResetLinkParams = Pick<IUser, "email">;

/**
 * @param {JSON} userIdentifier Expected key: `email_address`
 * @returns {Promise} resolves with a JSON object with keys `success`, `status`
 * and `message` as keys.
 */
export async function sendResetLink(
  userIdentifier: ResetLinkParams,
): Promise<string> {
  const user = await User.findOne({ email: { $eq: userIdentifier.email } })
    .exec();
  if (!user) {
    return `No user found with the email address: ${userIdentifier.email}`;
  }

  let resetPasswordURI = "";
  let hasConflictingUser = true;
  while (hasConflictingUser) {
    resetPasswordURI = getRandomString(50, LOWER_CASE + DIGITS);
    hasConflictingUser = (await User.exists({
      reset_password_uri: resetPasswordURI,
    }).exec()) !== null;
  }

  user.reset_password_uri = resetPasswordURI;
  user.reset_password_timestamp = Date.now();
  await user.save();

  // Multiline template strings render with unwanted line breaks...
  await Email.sendEmail({
    to: user.email,
    subject: `${APP_NAME} Password Reset`,
    text: `To reset your ${APP_NAME} password, `
      + `click on this link:\n\n${config.BASE_URL}`
      + `/reset-password-link/${resetPasswordURI}`
      + `\n\nThe link is only valid for 2 hours. If you did not `
      + `request a password reset, please ignore this email.`,
  });

  return `We've sent a reset link to ${userIdentifier.email} that is valid for 2 hours.`;
}

/**
 * Resolves the promise if `resetPasswordURI` is valid and hasn't expired.
 */
export async function validatePasswordResetLink(
  resetPasswordURI: string,
): Promise<void> {
  const user = await User.findOne({ reset_password_uri: resetPasswordURI })
    .exec();
  if (user === null) {
    return Promise.reject(
      new UserRecoverableError(
        "Invalid link. Please submit another reset request.",
      ),
    );
  }

  if (Date.now() > user.reset_password_timestamp + 2 * 3600 * 1000) {
    return Promise.reject(
      new UserRecoverableError(
        "Expired link. Please submit another reset request.",
      ),
    );
  }
}

export type ResetPasswordParams = Pick<IUser, "reset_password_uri"> & {
  password: string;
  reset_request_time: Date;
};

/**
 * @description Reset the user's password. We also invalidate all previously
 * issued session tokens so that the user has to provide their new password
 * before logging into any session.
 */
export async function resetPassword(
  payload: ResetPasswordParams,
): Promise<string> {
  const user = await User.findOne({
    reset_password_uri: payload.reset_password_uri,
  }).exec();
  if (user === null) {
    return Promise.reject(new UserRecoverableError("Invalid link"));
  }

  const { salt, hash } = await getSaltAndHash(payload.password);
  user.salt = salt;
  user.hash = hash;
  user.reset_password_timestamp += -3 * 3600 * 1000; // Invalidate link
  await user.save();

  await Token.deleteMany({ userIDInApp: user.userIDInApp }).exec();
  await Email.sendEmail({
    to: user.email,
    subject: `${APP_NAME}: Your Password Has Been Reset`,
    text:
      `Your ${APP_NAME} password was reset on ${payload.reset_request_time}. `
      + `If this wasn't you, please request another password reset at `
      + `${config.BASE_URL}/reset-password`,
  });

  return "Password successfully reset. Log in with your new password";
}

/**
 * @description Fetch the User object as represented in the database.
 *
 * @returns {Promise} resolves with a JSON keyed by `status`, `message` and
 * `success`. If `success` is set, the `message` property will contain the `user`
 * object.
 */
export function getAccountDetails(
  identifierQuery: FilterQuery<IUser>,
): Promise<Partial<IUser> | null> {
  return User.findOne(identifierQuery).select("-salt -hash").exec();
}

/**
 * @description Permanently delete a user's account and all related cards.
 * @param {Number} userIDInApp The ID of the account that will be deleted.
 * @returns {Promise} resolves with a JSON object that has the keys `success`
 * and `message`.
 */
export async function deleteAccount(userIDInApp: number): Promise<void> {
  await User.deleteMany({ userIDInApp: userIDInApp }).exec();
  await Token.deleteMany({ userIDInApp: userIDInApp }).exec();
  await Metadata.deleteMany({ createdById: userIDInApp }).exec();
  await Card.deleteMany({ createdById: userIDInApp }).exec();
}

/**
 * @description Delete all existing users from the database. This function only
 * works when `config.NODE_ENV == 'development'`
 *
 * @param {Array} usernamesToSpare A list of usernames whose accounts shouldn't
 * be deleted. By default, the global public user is not deleted.
 *
 * @returns {Promise} resolves with the number of accounts that were deleted.
 */
export function deleteAllAccounts(
  usernamesToSpare = [config.PUBLIC_USER_USERNAME],
): Promise<number> {
  if (config.NODE_ENV !== "development") {
    return Promise.reject(
      `Deleting all accounts isn't allowed in the ${config.NODE_ENV} environment`,
    );
  }

  return User
    .find({ username: { $nin: usernamesToSpare } }).exec()
    .then(async (existingUsers) => {
      let numAccountsDeleted = 0;
      for (const user of existingUsers) {
        await deleteAccount(user.userIDInApp);
        numAccountsDeleted += 1;
      }
      return numAccountsDeleted;
    });
}
