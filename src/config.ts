/**
 * @description A collection of all the configuration values used by the app.
 */

/** The official name of the application. */
const APP_NAME = "Flashcards by c13u";
export { APP_NAME };

/** @description The port at which the server is listening. */
const PORT = process.env.PORT || 5000;
export { PORT };

/** The node environment in which the app is being ran. */
const NODE_ENV = process.env.NODE_ENV;
export { NODE_ENV };

/**
 * @returns The database URI based on the value of `NODE_ENV`.
 */
function getDBURI(): string {
    if (NODE_ENV === "production") return process.env.STUDY_BUDDY_MLAB_MONGO_URI;
    if (NODE_ENV === "development") return process.env.STUDY_BUDDY_MLAB_TEST_DB_URI;
}

/** The URI used to connected to the MongoDB database. */
const MONGO_URI = getDBURI();
export { MONGO_URI };

/**
 * @returns The base URL of the app depending on the value of `NODE_ENV`.
 */
function getAppBaseURL() {
    if (NODE_ENV === "production") return "https://cards.c13u.com";
    if (NODE_ENV === "development") return `http://localhost:${PORT}`;
}

/** The web URL from which all other app URLs are based of. */
const BASE_URL = getAppBaseURL();
export { BASE_URL };

/** The email address used by default to communicate to users. */
const EMAIL_ADDRESS = process.env.STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS;
export { EMAIL_ADDRESS };

/** The login email for Mailgun's SMTP service. */
const MAILGUN_LOGIN = process.env.STUDY_BUDDY_MAILGUN_LOGIN;
export { MAILGUN_LOGIN };

/** The password for our Mailgun account. */
const MAILGUN_PASSWORD = process.env.STUDY_BUDDY_MAILGUN_PASSWORD;
export { MAILGUN_PASSWORD };

/** The email address used to sign up the dummy test user. */
const DEBUG_EMAIL_ADDRESS = process.env.STUDY_BUDDY_EMAIL_ADDRESS;
export { DEBUG_EMAIL_ADDRESS };

/** The user name assigned to the dummy test user. */
const DEBUG_USERNAME = "test-study-buddy-user";
export { DEBUG_USERNAME };

/** The password used from the dummy test user's account. */
const DEBUG_PASSWORD = "i_know_how_to_keep_passwords_safe_amirite?";
export { DEBUG_PASSWORD };

/** The time allowed before a test times out */
const DEBUG_OPERATION_TIMEOUT_MS = 3000; 
export { DEBUG_OPERATION_TIMEOUT_MS };

/** 
 * The username of the global user. All public cards are treated as if they're 
 * owned by the public user.
 */
const PUBLIC_USER_USERNAME = "c13u";
export { PUBLIC_USER_USERNAME };

/** The email address associated with `PUBLIC_USER_USERNAME`'s account. */
const PUBLIC_USER_EMAIL = process.env.STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS;
export { PUBLIC_USER_EMAIL };
