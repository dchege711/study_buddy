"use strict";
/**
 * @description A collection of all the configuration values used by the app.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** The official name of the application. */
var APP_NAME = "Flashcards by c13u";
exports.APP_NAME = APP_NAME;
/** @description The port at which the server is listening. */
var PORT = process.env.PORT || 5000;
exports.PORT = PORT;
/** The node environment in which the app is being ran. */
var NODE_ENV = process.env.NODE_ENV;
exports.NODE_ENV = NODE_ENV;
/**
 * @returns The database URI based on the value of `NODE_ENV`.
 */
function getDBURI() {
    if (NODE_ENV === "production")
        return process.env.STUDY_BUDDY_MLAB_MONGO_URI;
    if (NODE_ENV === "development")
        return process.env.STUDY_BUDDY_MLAB_TEST_DB_URI;
}
/** The URI used to connected to the MongoDB database. */
var MONGO_URI = getDBURI();
exports.MONGO_URI = MONGO_URI;
/**
 * @returns The base URL of the app depending on the value of `NODE_ENV`.
 */
function getAppBaseURL() {
    if (NODE_ENV === "production")
        return "https://cards.c13u.com";
    if (NODE_ENV === "development")
        return "http://localhost:" + PORT;
}
/** The web URL from which all other app URLs are based of. */
var BASE_URL = getAppBaseURL();
exports.BASE_URL = BASE_URL;
/** The email address used by default to communicate to users. */
var EMAIL_ADDRESS = process.env.STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS;
exports.EMAIL_ADDRESS = EMAIL_ADDRESS;
/** The login email for Mailgun's SMTP service. */
var MAILGUN_LOGIN = process.env.STUDY_BUDDY_MAILGUN_LOGIN;
exports.MAILGUN_LOGIN = MAILGUN_LOGIN;
/** The password for our Mailgun account. */
var MAILGUN_PASSWORD = process.env.STUDY_BUDDY_MAILGUN_PASSWORD;
exports.MAILGUN_PASSWORD = MAILGUN_PASSWORD;
/** The email address used to sign up the dummy test user. */
var DEBUG_EMAIL_ADDRESS = process.env.STUDY_BUDDY_EMAIL_ADDRESS;
exports.DEBUG_EMAIL_ADDRESS = DEBUG_EMAIL_ADDRESS;
/** The user name assigned to the dummy test user. */
var DEBUG_USERNAME = "test-study-buddy-user";
exports.DEBUG_USERNAME = DEBUG_USERNAME;
/** The password used from the dummy test user's account. */
var DEBUG_PASSWORD = "i_know_how_to_keep_passwords_safe_amirite?";
exports.DEBUG_PASSWORD = DEBUG_PASSWORD;
/** The time allowed before a test times out */
var DEBUG_OPERATION_TIMEOUT_MS = 3000;
exports.DEBUG_OPERATION_TIMEOUT_MS = DEBUG_OPERATION_TIMEOUT_MS;
/**
 * The username of the global user. All public cards are treated as if they're
 * owned by the public user.
 */
var PUBLIC_USER_USERNAME = "c13u";
exports.PUBLIC_USER_USERNAME = PUBLIC_USER_USERNAME;
/** The email address associated with `PUBLIC_USER_USERNAME`'s account. */
var PUBLIC_USER_EMAIL = process.env.STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS;
exports.PUBLIC_USER_EMAIL = PUBLIC_USER_EMAIL;
//# sourceMappingURL=config.js.map