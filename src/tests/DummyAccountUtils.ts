"use strict";

import { getRandomCards } from "./SampleCards.js";

import * as LogInUtilities from "../models/LogInUtilities.js";
import * as CardsDB from "../models/CardsMongoDB.js";
import { IUser } from "../models/mongoose_models/UserSchema.js";
import { addPublicUser } from "../models/Miscellaneous.js";
import * as config from "../config.js";

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

export function populateDummyAccountWithCards(): Promise<number> {
  return getDummyAccount()
    .then((user) => {
        return getRandomCards(60, user.userIDInApp)
    })
    .then((cards) => {
        return CardsDB.createMany(cards)
    })
    .then((cards) => {
        console.log(`Created ${cards.length} cards for sample user`);
        return cards.length;
    });
}

if (require.main === module) {
    const dbConnection = require("../models/MongooseClient.js");
    populateDummyAccountWithCards()
      .then((numCards) => {
          console.log(`Created ${numCards} cards for sample user`);
          return dbConnection.closeMongooseConnection();
      })
      .catch((err) => { console.error(err); });
}

