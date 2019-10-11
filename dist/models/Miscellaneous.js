"use strict";
/**
 * A collection of utilities that don't fit neatly in any given file.
 *
 * @module
 */
var User = require("./mongoose_models/UserSchema.js");
var Card = require("./mongoose_models/CardSchema.js");
var MetadataDB = require("./MetadataMongoDB");
var LogInUtils = require("./LogInUtilities.js");
var config = require("../config.js");
/**
 * @description Add a dummy user in order to make managing the browse page for
 * public cards easier
 */
exports.addPublicUser = function () {
    return new Promise(function (resolve, reject) {
        var prevResults = {};
        User
            .findOne({ username: config.PUBLIC_USER_USERNAME, email: config.PUBLIC_USER_EMAIL }).exec()
            .then(function (savedUser) {
            if (savedUser) {
                resolve("User already exists");
            }
            else {
                return Promise.resolve("DUMMY");
            }
        })
            .then(function (_) {
            return LogInUtils.registerUserAndPassword({
                username: config.PUBLIC_USER_USERNAME,
                email: config.PUBLIC_USER_EMAIL,
                password: LogInUtils.getRandomString(20) // Never meant to login
            });
        })
            .then(function (_) {
            return User.findOne({ username: config.PUBLIC_USER_USERNAME }).exec();
        })
            .then(function (savedUser) {
            prevResults.savedUser = savedUser;
            return Card.find({ isPublic: true }).exec();
        })
            .then(function (publicCards) {
            return MetadataDB.updatePublicUserMetadata(publicCards);
        })
            .then(function (confirmation) {
            if (confirmation.success)
                resolve("Success!");
            else
                reject(confirmation.message);
        })
            .catch(function (err) { reject(err); });
    });
};
if (require.main === module) {
    var dbConnection_1 = require("./MongooseClient.js");
    exports.addPublicUser()
        .then(function (confirmation) {
        console.log(confirmation);
        return dbConnection_1.closeMongooseConnection();
    })
        .then(function () { process.exit(0); })
        .catch(function (err) { console.error(err); process.exit(1); });
    // ... So many pending promises. I'm not proud of calling `process.exit()`
    // const whyIsNodeRunning = require("why-is-node-running");
    // setTimeout(whyIsNodeRunning, 10000);
}
