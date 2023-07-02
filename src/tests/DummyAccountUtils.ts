"use strict";

import { getRandomCards } from "./SampleCards";

import * as LogInUtilities from "../models/LogInUtilities";
import * as CardsDB from "../models/CardsMongoDB";
import { IUser } from "../models/mongoose_models/UserSchema";
import { addPublicUser } from "../models/Miscellaneous";
import * as config from "../config";

/**
 * @returns {Promise} resolves with a JSON representation of a logged in user.
 */
export async function getDummyAccount(): Promise<LogInUtilities.AuthenticateUser> {
    let dummyAccountDetails = {
        username: config.DEBUG_USERNAME as string, password: config.DEBUG_PASSWORD as string,
        email: config.DEBUG_EMAIL_ADDRESS as string
    }

    return LogInUtilities
        .deleteAllAccounts([])
        .then((_) => {
            return addPublicUser();
        })
        .then((_) => {
            return LogInUtilities.registerUserAndPassword(dummyAccountDetails);
        })
        .then((_) => {
            return LogInUtilities.authenticateUser({
                username_or_email: dummyAccountDetails.username,
                password: dummyAccountDetails.password
            });
        });
};

if (require.main === module) {

    const dbConnection = require("../models/MongooseClient.js");
    getDummyAccount()
        .then((user) => {
            return getRandomCards(60, user.userIDInApp)
        })
        .then((cards) => {
            return CardsDB.createMany(cards)
        })
        .then((cards) => {
            console.log(`Created ${cards.length} cards for sample user`);
            return dbConnection.closeMongooseConnection();
        })
        .catch((err) => { console.error(err); });

}

