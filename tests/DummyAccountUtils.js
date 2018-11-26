"use strict";

const LoginUtilities = require("../models/LogInUtilities.js");
const config = require("../config.js");
const sampleCards = require("./SampleCards.js");
const CardsDB = require("../models/CardsMongoDB.js");

/**
 * @returns {Promise} resolves with a JSON representation of a logged in user.
 */
exports.getDummyAccount = function() {
    let dummyAccountDetails = {
        username: config.DEBUG_USERNAME, password: config.DEBUG_PASSWORD,
        email: config.DEBUG_EMAIL_ADDRESS
    }

    return new Promise(function(resolve, reject) {
        LoginUtilities
            .registerUserAndPassword(dummyAccountDetails)
            .then((_) => {
                return LoginUtilities.authenticateUser({
                    username_or_email: dummyAccountDetails.username,
                    password: dummyAccountDetails.password
                });
            })
            .then((confirmation) => { 
                if (confirmation.success) resolve(confirmation.message);
                else reject(new Error(confirmation.message)); 
            })
            .catch((err) => { reject(err); });
    });
};

if (require.main === module) {

    const dbConnection = require("../models/MongooseClient.js");

    exports.getDummyAccount()
        .then(async (loggedInUser) => {
            let cards = sampleCards.getRandomCards(10);
            for (let i = 0; i < cards.length; i++) {
                let card = cards[i];
                card.createdById = loggedInUser.userIDInApp;
                if (i % 3 == 0) card.isPublic = false;
                else card.isPublic = true;
                await CardsDB.create(card);
                console.log(`Added ${card.title}`);
            }
        })
        .then(() => { return dbConnection.closeMongooseConnection(); })
        .catch((err) => { console.error(err); });
}

