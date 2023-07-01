"use strict";

import { sampleCards, getRandomCards } from "./SampleCards";

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

/**
 * @description Creates the dummy account if it doesn't exist. Populates the
 * dummy account with `numCards` cards.
 * @returns {Promise} resolves with a JSON representation of a logged in user.
 */
export function populateDummyAccount(numCards=50): Promise<LogInUtilities.AuthenticateUser> {
    return new Promise(function(resolve, reject) {
        getDummyAccount()
            .then(async (user) => {
                let cards = getRandomCards(numCards);
                for (let i = 0; i < cards.length; i++) {
                    let card = cards[i];
                    card.createdById = user.userIDInApp;
                    if (i % 3 == 0) card.isPublic = false;
                    else card.isPublic = true;
                    await CardsDB.create(card);
                    console.log(`${i + 1}/${cards.length}: ${card.title}`);
                }
                resolve(user)
            })
            .catch((err) => { reject(err); });
    });
}

if (require.main === module) {

    const dbConnection = require("../models/MongooseClient.js");
    let numCards = 60;
    populateDummyAccount(numCards)
        .then((user) => {
            console.log(`Created user ${user.username} and gave them ${numCards} cards`);
            return dbConnection.closeMongooseConnection();
        })
        .catch((err) => { console.error(err); });

}

