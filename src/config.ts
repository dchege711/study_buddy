/**
 * @description Access point for sensitive/central information.
 */

export const APP_NAME = "Flashcards by c13u";
export const PORT = process.env.PORT || 5000;

export const NODE_ENV = process.env.NODE_ENV;
export const IS_PROD = NODE_ENV === "production";
export const IS_DEV = NODE_ENV === "development";

if (!IS_DEV && !IS_PROD) {
    throw Error("Please set the NODE_ENV environment variable to either 'production' or 'development'.");
}

export const MONGO_URI = IS_PROD ? process.env.STUDY_BUDDY_MLAB_MONGO_URI : "invalid://use-memory-db";
export const BASE_URL = IS_PROD ? "https://cards.c13u.com" : `http://localhost:${PORT}`;

export const EMAIL_ADDRESS = process.env.STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS;
if (!EMAIL_ADDRESS) {
    throw Error("Please set the STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS env variable");
}

export const MAILGUN_LOGIN = process.env.STUDY_BUDDY_MAILGUN_LOGIN;
if (!MAILGUN_LOGIN) {
    throw Error("Please set the STUDY_BUDDY_MAILGUN_LOGIN env variable");
}

export const MAILGUN_PASSWORD = process.env.STUDY_BUDDY_MAILGUN_PASSWORD;
if (!MAILGUN_PASSWORD) {
    throw Error("Please set the STUDY_BUDDY_MAILGUN_PASSWORD env variable");
}

export const DEBUG_EMAIL_ADDRESS = process.env.STUDY_BUDDY_EMAIL_ADDRESS;
if (!DEBUG_EMAIL_ADDRESS) {
    throw Error("Please set the STUDY_BUDDY_EMAIL_ADDRESS env variable");
}

export const DEBUG_USERNAME = "test-study-buddy-user";
export const DEBUG_PASSWORD = "i_know_how_to_keep_passwords_safe_amirite?";
export const DEBUG_OPERATION_TIMEOUT_MS = 3000;

export const PUBLIC_USER_USERNAME = "c13u";
export const PUBLIC_USER_EMAIL = process.env.STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS;
if (!PUBLIC_USER_EMAIL) {
    throw Error("Please set the STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS env variable");
}

export const STUDY_BUDDY_SESSION_SECRET_1 = process.env.STUDY_BUDDY_SESSION_SECRET_1;
if (!STUDY_BUDDY_SESSION_SECRET_1) {
    throw Error("Please set the STUDY_BUDDY_SESSION_SECRET_1 env variable");
}
