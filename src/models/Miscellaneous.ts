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
export async function addPublicUser(): Promise<IUser> {
    let existingUser = await User.findOne({username: PUBLIC_USER_USERNAME, email: PUBLIC_USER_EMAIL}).exec();
    if (existingUser) {
        return existingUser;
    }

    await registerUserAndPassword({
        username: PUBLIC_USER_USERNAME,
        email: PUBLIC_USER_EMAIL as string,
        password: getRandomString(20) // Never meant to login
    });

    let user = await User
        .findOne({username: PUBLIC_USER_USERNAME, email: PUBLIC_USER_EMAIL}).exec();
    if (!user) {
        return Promise.reject("Could not find the user we just created");
    }

    let publicCards = await Card.find({isPublic: true}).exec();
    await updatePublicUserMetadata(publicCards.map((card) => ({card, previousTags: ""})));

    return user;
}

if (require.main === module) {

    const dbConnection = require("./MongooseClient.js");

    addPublicUser()
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
