"use strict";

/**
 * A collection of utilities that don't fit neatly in any given file.
 *
 * @module
 */

import { IUser, User } from "./mongoose_models/UserSchema";
import { Card } from "./mongoose_models/CardSchema";
import { updatePublicUserMetadata } from "./MetadataMongoDB";
import { registerUserAndPassword, getRandomString } from "./LogInUtilities";
import { PUBLIC_USER_EMAIL, PUBLIC_USER_USERNAME } from "../config";

/**
 * @description Add a dummy user in order to make managing the browse page for
 * public cards easier
 */
export function addPublicUser() {
    return new Promise(function(resolve, reject) {
        let prevResults : {savedUser?: IUser } = {};
        User
            .findOne({username: PUBLIC_USER_USERNAME, email: PUBLIC_USER_EMAIL}).exec()
            .then((savedUser) => {
                if (savedUser) {
                    resolve("User already exists");
                } else {
                    return Promise.resolve("DUMMY");
                }
            })
            .then((_) => {
                return registerUserAndPassword({
                    username: PUBLIC_USER_USERNAME,
                    email: PUBLIC_USER_EMAIL,
                    password: getRandomString(20) // Never meant to login
                });
            })
            .then((_) => {
                return User.findOne({username: PUBLIC_USER_USERNAME}).exec();
            })
            .then((savedUser) => {
                prevResults.savedUser = savedUser;
                return Card.find({isPublic: true}).exec();
            })
            .then((publicCards) => {
                return updatePublicUserMetadata(publicCards);
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
