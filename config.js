/**
 * @description Access point for sensitive information.
 */

exports.PORT = process.env.PORT || 5000;
exports.NODE_ENV = process.env.NODE_ENV;

if (exports.NODE_ENV === "production") {
    exports.MONGO_URI = process.env.STUDY_BUDDY_MLAB_MONGO_URI;
} else if (exports.NODE_ENV === "development") {
    exports.MONGO_URI = process.env.STUDY_BUDDY_MLAB_TEST_DB_URI;
} else {
    throw Error("Please set the NODE_ENV environment variable.");
}

exports.EMAIL_ADDRESS = process.env.STUDY_BUDDY_EMAIL_ADDRESS;

exports.EMAIL_PASSWORD = process.env.STUDY_BUDDY_EMAIL_PASSWORD;

exports.BASE_URL = "https://notes.c13u.com";

exports.DEBUG_EMAIL_ADDRESS = process.env.STUDY_BUDDY_EMAIL_ADDRESS;
exports.DEBUG_USERNAME = "test-study-buddy-user";
exports.DEBUG_PASSWORD = "i_know_how_to_keep_passwords_safe_amirite?";
exports.DEBUG_BASE_URL = `http://localhost:${exports.PORT}`;
exports.DEBUG_OPERATION_TIMEOUT_MS = 3000; 