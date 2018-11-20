"use strict";

const LoginUtilities = require("../models/LogInUtilities.js");
const config = require("../config.js");

/**
 * @returns {Promise} resolves with a JSON representation of a logged in user.
 * 
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

