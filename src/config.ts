/**
 * @description Access point for sensitive/central information.
 */

const someUnusedVariable = "CI should fail if this is not removed";

export const APP_NAME = "Flashcards by c13u";
export const PORT = process.env.PORT || 5000;

export const NODE_ENV = process.env.NODE_ENV || "";
export const IS_PROD = NODE_ENV === "production";
export const IS_DEV = NODE_ENV === "development";
export const IS_TEST = NODE_ENV === "test";

export const IS_TS_NODE = !!process[Symbol.for("ts-node.register.instance")]
  || process.env.TS_NODE_DEV !== undefined;

if (!IS_DEV && !IS_PROD && !IS_TEST) {
  throw Error(
    "Please set the NODE_ENV environment variable to either 'production', 'development', or 'test'.",
  );
}

if (IS_PROD && !process.env.STUDY_BUDDY_MLAB_MONGO_URI) {
  throw Error("Please set the STUDY_BUDDY_MLAB_MONGO_URI env variable");
}

export const MONGO_URI = IS_PROD
  ? process.env.STUDY_BUDDY_MLAB_MONGO_URI as string
  : "invalid://use-memory-db";
export const BASE_URL = IS_PROD
  ? "https://cards.c13u.com"
  : `http://localhost:${PORT}`;

const _emailAddress = process.env.STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS;
if (!_emailAddress) {
  throw Error("Please set the STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS env variable");
}
export const EMAIL_ADDRESS = _emailAddress;

const _mailGunLogin = process.env.STUDY_BUDDY_MAILGUN_LOGIN;
if (!_mailGunLogin) {
  throw Error("Please set the STUDY_BUDDY_MAILGUN_LOGIN env variable");
}
export const MAILGUN_LOGIN = _mailGunLogin;

const _mailGunPassword = process.env.STUDY_BUDDY_MAILGUN_PASSWORD;
if (!_mailGunPassword) {
  throw Error("Please set the STUDY_BUDDY_MAILGUN_PASSWORD env variable");
}
export const MAILGUN_PASSWORD = _mailGunPassword;

const _debugEmailAddress = process.env.STUDY_BUDDY_EMAIL_ADDRESS;
if (!_debugEmailAddress) {
  throw Error("Please set the STUDY_BUDDY_EMAIL_ADDRESS env variable");
}
export const DEBUG_EMAIL_ADDRESS = _debugEmailAddress;

export const DEBUG_USERNAME = "test-study-buddy-user";
export const DEBUG_PASSWORD = "i_know_how_to_keep_passwords_safe_amirite?";
export const DEBUG_OPERATION_TIMEOUT_MS = 3000;

export const PUBLIC_USER_USERNAME = "c13u";

const _publicUserEmail = process.env.STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS;
if (!_publicUserEmail) {
  throw Error("Please set the STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS env variable");
}
export const PUBLIC_USER_EMAIL = _publicUserEmail;

const _sessionSecret1 = process.env.STUDY_BUDDY_SESSION_SECRET_1;
if (!_sessionSecret1) {
  throw Error("Please set the STUDY_BUDDY_SESSION_SECRET_1 env variable");
}
export const STUDY_BUDDY_SESSION_SECRET_1 = _sessionSecret1;
