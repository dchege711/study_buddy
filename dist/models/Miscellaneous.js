"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A collection of utilities that don't fit neatly in any given file.
 *
 * @module
 */
var UserSchema_1 = require("./mongoose_models/UserSchema");
var CardSchema_1 = require("./mongoose_models/CardSchema");
var MetadataDB = require("./MetadataMongoDB");
var LogInUtils = require("./LogInUtilities.js");
var config_1 = require("../config");
/**
 * @description Add a dummy user in order to make managing the browse page for
 * public cards easier.
 *
 */
function addOrFetchPublicUser() {
    return new Promise(function (resolve, reject) {
        var prevResults;
        UserSchema_1.User
            .findOne({
            username: config_1.PUBLIC_USER_USERNAME, email: config_1.PUBLIC_USER_EMAIL
        }).exec()
            .then(function (savedUser) {
            if (savedUser)
                resolve(savedUser);
            else
                return;
        })
            .then(function () {
            return LogInUtils.registerUserAndPassword({
                username: config_1.PUBLIC_USER_USERNAME,
                email: config_1.PUBLIC_USER_EMAIL,
                password: LogInUtils.getRandomString(20) // Never meant to login
            });
        })
            .then(function (_) {
            return UserSchema_1.User.findOne({ username: config_1.PUBLIC_USER_USERNAME }).exec();
        })
            .then(function (savedUser) {
            prevResults.savedUser = savedUser;
            return CardSchema_1.Card.find({ isPublic: true }).exec();
        })
            .then(function (publicCards) {
            return MetadataDB.updatePublicUserMetadata(publicCards);
        })
            .then(function (confirmation) {
            if (confirmation.success)
                resolve(prevResults.savedUser);
            else
                reject(confirmation.message);
        })
            .catch(function (err) { reject(err); });
    });
}
exports.addOrFetchPublicUser = addOrFetchPublicUser;
if (require.main === module) {
    var dbConnection_1 = require("./MongooseClient.js");
    addOrFetchPublicUser()
        .then(function (publicUser) {
        console.log("Fetched " + publicUser.email + "'s account");
        return dbConnection_1.closeMongooseConnection();
    })
        .then(function () { process.exit(0); })
        .catch(function (err) { console.error(err); process.exit(1); });
    // ... So many pending promises. I'm not proud of calling `process.exit()`
    // const whyIsNodeRunning = require("why-is-node-running");
    // setTimeout(whyIsNodeRunning, 10000);
}
//# sourceMappingURL=Miscellaneous.js.map