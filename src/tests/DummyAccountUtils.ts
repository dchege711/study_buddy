"use strict";

import { getRandomCards } from "./SampleCards";

import * as config from "../config";
import * as CardsDB from "../models/CardsMongoDB";
import * as LogInUtilities from "../models/LogInUtilities";
import { addPublicUser } from "../models/Miscellaneous";

/**
 * @returns {Promise} resolves with a JSON representation of a logged in user.
 */
export async function getDummyAccount(): Promise<
  LogInUtilities.AuthenticateUser
> {
  const dummyAccountDetails = {
    username: config.DEBUG_USERNAME as string,
    password: config.DEBUG_PASSWORD as string,
    email: config.DEBUG_EMAIL_ADDRESS as string,
  };

  return LogInUtilities
    .deleteAllAccounts([])
    .then(() => {
      return addPublicUser();
    })
    .then(() => {
      return LogInUtilities.registerUserAndPassword(dummyAccountDetails);
    })
    .then(() => {
      return LogInUtilities.authenticateUser({
        username_or_email: dummyAccountDetails.username,
        password: dummyAccountDetails.password,
      });
    });
}

export function populateDummyAccountWithCards(): Promise<number> {
  return getDummyAccount()
    .then((user) => {
      return getRandomCards(60, user.userIDInApp);
    })
    .then((cards) => {
      return CardsDB.createMany(cards);
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
    .catch((err) => {
      console.error(err);
    });
}
