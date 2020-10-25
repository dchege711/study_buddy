/**
 * https://codefool.tumblr.com/post/15288874550/list-of-valid-and-invalid-email-addresses
 */
const VALID_EMAIL_ADDRESSES: string[] = [
  // The normal ones...
  "email@example.com",
  "firstname.lastname@example.com",
  "email@subdomain.example.com",
  "firstname+lastname@example.com",
  // "email@123.123.123.123", // TODO(#83)
  // "email@[123.123.123.123]", // TODO(#83)
  "“email”@example.com",
  "1234567890@example.com",
  "email@example-one.com",
  "_______@example.com",
  "email@example.name",
  "email@example.museum",
  "email@example.co.jp",
  "firstname-lastname@example.com",

  // The weird ones... TODO(#83)
  `much.“more\ unusual”@example.com`,
  // `very.unusual.“@”.unusual.com@example.com`,
  // `very.“(),:;<>[]”.VERY.“very@\\ "very”.unusual@strange.example.com`,
];
export { VALID_EMAIL_ADDRESSES };

/**
 * https://codefool.tumblr.com/post/15288874550/list-of-valid-and-invalid-email-addresses
 */
const INVALID_EMAIL_ADDRESSES: string[] = [
  // The usual...
  `plainaddress`,
  `#@%^%#$@#$@#.com`,
  `@example.com`,
  `Joe Smith <email@example.com>`,
  `email.example.com`,
  `email@example@example.com`,
  `.email@example.com`,
  `email.@example.com`,
  `email..email@example.com`,
  `あいうえお@example.com`,
  `email@example.com (Joe Smith)`,
  `email@example`,
  `email@-example.com`,
  `email@example.web`,
  `email@111.222.333.44444`,
  `email@example..com`,
  `Abc..123@example.com`,

  // The weird ones...
  `“(),:;<>[\]@example.com`,
  `just"not"right@example.com`,
  `this\ is"really"not\allowed@example.com`,
];
export { INVALID_EMAIL_ADDRESSES };
