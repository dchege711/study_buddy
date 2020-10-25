/**
 * @description A collection of utility functions that don't need a database
 * connection.
 */

import * as sjcl from "sjcl";

export const DIGITS = "0123456789";
export const LOWER_CASE = "abcdefghijklmnopqrstuvwxyz";
export const UPPER_CASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const ALPHANUMERICS = DIGITS + LOWER_CASE + UPPER_CASE;

/**
 * A dummy error class. Useful for raising errors that shouldn't be logged.
 * Used by test functions to investigate the apps error handling.
 */
export class DummyError extends Error {
  static DUMMY_ERR_NAME: string = "dummy-ef3a2433-2305-4f79-err";

  constructor(msg: string) {
    super(msg);
    this.name = DummyError.DUMMY_ERR_NAME;
  }
}

/**
 * @description Generate a salt and a hash for the provided password.
 *
 * @returns {Promise} the resolved value is an array where the first element is
 * the salt and the second element is the hash.
 */
export function getSaltAndHash(
  password: string
): Promise<[sjcl.BitArray, sjcl.BitArray]> {
  /**
   * I found CrackStation's piece on [salted password hashing]
   * {@link https://crackstation.net/hashing-security.htm} informative.
   */
  return new Promise(function (resolve, reject) {
    // 8 words = 32 bytes = 256 bits, a paranoia of 7
    let salt = sjcl.random.randomWords(8, 7);
    let hash = sjcl.misc.pbkdf2(password, salt);
    resolve([salt, hash]);
  });
}

/**
 * @returns {Promise} resolves with the hash computed from the provided
 * `password` and `salt` parameters.
 */
export async function getHash(
  password: string,
  salt: sjcl.BitArray
): Promise<sjcl.BitArray> {
  let hash = await sjcl.misc.pbkdf2(password, salt);
  return Promise.resolve(hash);
}

/**
 * @description Generate a random string from the specified alphabet.
 * @param stringLength The length of the desired string.
 * @param alphabet The characters that can be included in the string. If not
 * specified, defaults to the alphanumeric characters.
 */
export function getRandomString(
  stringLength: number,
  alphabet: string = ALPHANUMERICS
) {
  let random_string = "";
  for (let i = 0; i < stringLength; i++) {
    // In JavaScript, concatenation is fast
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat#Performance
    random_string += alphabet.charAt(
      Math.floor(Math.random() * alphabet.length)
    );
  }
  return random_string;
}
