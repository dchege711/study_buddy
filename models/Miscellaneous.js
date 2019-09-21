"use strict";

/**
 * A collection of utilities that don't fit neatly in any given file.
 * 
 * @module
 */

const User = require("./mongoose_models/UserSchema.js");
const Card = require("./mongoose_models/CardSchema.js");
const MetadataDB = require("./MetadataMongoDB");
const LogInUtils = require("./LogInUtilities.js");
const config = require("../config.js");

/**
 * @description Add a dummy user in order to make managing the browse page for 
 * public cards easier
 */
exports.addPublicUser = function() {
    return new Promise(function(resolve, reject) {
        let prevResults = {};
        User
            .findOne({username: config.PUBLIC_USER_USERNAME, email: config.PUBLIC_USER_EMAIL}).exec()
            .then((savedUser) => {
                if (savedUser) {
                    resolve("User already exists");
                } else {
                    return Promise.resolve("DUMMY");
                }
            })
            .then((_) => {
                return LogInUtils.registerUserAndPassword({
                    username: config.PUBLIC_USER_USERNAME, 
                    email: config.PUBLIC_USER_EMAIL,
                    password: LogInUtils.getRandomString(20) // Never meant to login
                });
            })
            .then((_) => {
                return User.findOne({username: config.PUBLIC_USER_USERNAME}).exec();
            })
            .then((savedUser) => {
                prevResults.savedUser = savedUser;
                return Card.find({isPublic: true}).exec();
            })
            .then((publicCards) => {
                return MetadataDB.updatePublicUserMetadata(publicCards);
            })
            .then((confirmation) => {
                if (confirmation.success) resolve(`Success!`);
                else reject(confirmation.message);
            })
            .catch((err) => { reject(err); });
    });

}

if (require.main === module) {

    const dbConnection = require("./MongooseClient.js");
    
    exports.addPublicUser()
        .then((confirmation) => { 
            console.log(confirmation);
            return dbConnection.closeMongooseConnection(); 
        })
        .then(() => {  process.exit(0); })
        .catch((err) => { console.error(err); process.exit(1); });

    // ... So many pending promises. I'm not proud of calling `process.exit()`
    // const whyIsNodeRunning = require("why-is-node-running");
    // setTimeout(whyIsNodeRunning, 10000);
}