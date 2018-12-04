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
    exports.MONGO_URI = process.env.STUDY_BUDDY_MLAB_MONGO_URI;
    exports.BASE_URL = `http://localhost:${exports.PORT}`;
} else {
    throw Error("Please set the NODE_ENV environment variable.");
}

exports.EMAIL_ADDRESS = process.env.STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS;
exports.MAILGUN_LOGIN = process.env.STUDY_BUDDY_MAILGUN_LOGIN;
exports.MAILGUN_PASSWORD = process.env.STUDY_BUDDY_MAILGUN_PASSWORD;

exports.DEBUG_EMAIL_ADDRESS = process.env.STUDY_BUDDY_EMAIL_ADDRESS;
exports.DEBUG_USERNAME = "test-study-buddy-user";
exports.DEBUG_PASSWORD = "i_know_how_to_keep_passwords_safe_amirite?";
exports.DEBUG_OPERATION_TIMEOUT_MS = 3000; 

exports.PUBLIC_USER_USERNAME = "c13u";
exports.PUBLIC_USER_EMAIL = process.env.STUDY_BUDDY_DEFAULT_EMAIL_ADDRESS;
