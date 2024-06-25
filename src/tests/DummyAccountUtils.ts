"use strict";

import { getRandomCards } from "./SampleCards";

import * as config from "../config";
import * as CardsDB from "../models/CardsMongoDB";
import * as LogInUtilities from "../models/LogInUtilities";
import { addPublicUser } from "../models/Miscellaneous";

export const dummyAccountDetails = {
  username: config.DEBUG_USERNAME,
  password: config.DEBUG_PASSWORD,
  email: config.DEBUG_EMAIL_ADDRESS,
};

/**
 * @returns {Promise} resolves with a JSON representation of a logged in user.
 */
export async function getDummyAccount(): Promise<
  LogInUtilities.AuthenticateUser
> {
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

export function populateDummyAccountWithCards(log: boolean): Promise<number> {
  return getDummyAccount()
    .then((user) => {
      return getRandomCards(60, user.userIDInApp);
    })
    .then((cards) => {
      return CardsDB.createMany(cards);
    })
    .then((cards) => {
      if (log) {
        console.log(`Created ${cards.length} cards for sample user`);
      }
      return cards.length;
    });
}
