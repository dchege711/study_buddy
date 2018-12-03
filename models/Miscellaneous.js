"use strict";

require("./MongooseClient");

const User = require("./mongoose_models/UserSchema.js");
const Card = require("./mongoose_models/CardSchema.js");
const MetadataDB = require("./MetadataMongoDB");
const LogInUtils = require("./LogInUtilities.js");

/**
 * @description Add a dummy user in order to make managing the browse page for 
 * public cards easier
 */
function addPublicUser() {
    let prevResults = {};
    User
        .findOne({username: "c13u", email: "flashcards@c13u.com"}).exec()
        .then((savedUser) => {
            if (savedUser) {
                return LogInUtils.deleteAccount(savedUser.userIDInApp);
            } else {
                return Promise.resolve("DUMMY");
            }
        })
        .then((a) => {
            return LogInUtils.registerUserAndPassword({
                username: "c13u", email: "flashcards@c13u.com",
                password: LogInUtils.getRandomString(20) // Never meant to login
            });
        })
        .then((a) => {
            return User.findOne({username: "c13u"}).exec();
        })
        .then((savedUser) => {
            prevResults.savedUser = savedUser;
            return Card.find({isPublic: true}).exec();
        })
        .then((publicCards) => {
            return MetadataDB.updatePublicUserMetadata(publicCards);
        })
        .then((confirmation) => {
            if (confirmation.success) console.log(`Success!`);
            else return Promise.reject(confirmation.message);
        })
        .catch((err) => { console.error(err); });
}

if (require.main === module) {
    addPublicUser();
}