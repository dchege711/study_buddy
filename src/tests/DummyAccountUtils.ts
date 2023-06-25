"use strict";

import { sampleCards, getRandomCards } from "./SampleCards";

import * as LogInUtilities from "../models/LogInUtilities";
import * as CardsDB from "../models/CardsMongoDB";
import { IUser } from "../models/mongoose_models/UserSchema";

/**
 * @returns {Promise} resolves with a JSON representation of a logged in user.
 */
export function getDummyAccount(): Promise<LogInUtilities.AuthenticateUser> {
    let dummyAccountDetails = {
        username: config.DEBUG_USERNAME, password: config.DEBUG_PASSWORD,
        email: config.DEBUG_EMAIL_ADDRESS
    }

    return new Promise(function(resolve, reject) {
        LogInUtilities.deleteAllAccounts([])
            .then((_) => {
                return misc.addPublicUser();
            })
            .then((_) => {
                return LogInUtilities.registerUserAndPassword(dummyAccountDetails);
            })
            .then((_) => {
                return LogInUtilities.authenticateUser({
                    username_or_email: dummyAccountDetails.username,
                    password: dummyAccountDetails.password
                });
            })
            .then((response) => {
                if (typeof response.message === "string") {
                    reject(response.message);
                    return;
                }

                resolve(response.message);
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
    exports.populateDummyAccount(numCards)
        .then((user) => {
            console.log(`Created user ${user.username} and gave them ${numCards} cards`);
            return dbConnection.closeMongooseConnection();
        })
        .catch((err) => { console.error(err); });

}

