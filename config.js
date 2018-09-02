/**
 * @description Access point for sensitive information.
 */

// Select the appropriate database
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
