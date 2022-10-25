/**
 * @description Access point for sensitive/central information.
 */

exports.APP_NAME = "Flashcards by c13u";
exports.PORT = process.env.PORT || 5000;
exports.NODE_ENV = process.env.NODE_ENV;

if (exports.NODE_ENV === "production") {
    exports.MONGO_URI = process.env.STUDY_BUDDY_MLAB_MONGO_URI;
    exports.BASE_URL = "https://cards.c13u.com";
} else if (exports.NODE_ENV === "development") {
    exports.MONGO_URI = "invalid://use-memory-db";
    exports.BASE_URL = `http://localhost:${exports.PORT}`;
} else {
    throw Error("Please set the NODE_ENV environment variable.");
}

exports.IS_DEV = exports.NODE_ENV === "development";

exports.EMAIL_ADDRESS = process.env.STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS;
if (!exports.EMAIL_ADDRESS) {
    throw Error("Please set the STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS env variable");
}

exports.MAILGUN_LOGIN = process.env.STUDY_BUDDY_MAILGUN_LOGIN;
if (!exports.MAILGUN_LOGIN) {
    throw Error("Please set the STUDY_BUDDY_MAILGUN_LOGIN env variable");
}

exports.MAILGUN_PASSWORD = process.env.STUDY_BUDDY_MAILGUN_PASSWORD;
if (!exports.MAILGUN_PASSWORD) {
    throw Error("Please set the STUDY_BUDDY_MAILGUN_PASSWORD env variable");
}

exports.DEBUG_EMAIL_ADDRESS = process.env.STUDY_BUDDY_EMAIL_ADDRESS;
if (!exports.DEBUG_EMAIL_ADDRESS) {
    throw Error("Please set the STUDY_BUDDY_EMAIL_ADDRESS env variable");
}

exports.DEBUG_USERNAME = "test-study-buddy-user";
exports.DEBUG_PASSWORD = "i_know_how_to_keep_passwords_safe_amirite?";
exports.DEBUG_OPERATION_TIMEOUT_MS = 3000;

exports.PUBLIC_USER_USERNAME = "c13u";
exports.PUBLIC_USER_EMAIL = process.env.STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS;
if (!exports.PUBLIC_USER_EMAIL) {
    throw Error("Please set the STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS env variable");
}
