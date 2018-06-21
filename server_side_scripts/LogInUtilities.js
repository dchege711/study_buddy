var stanfordCrypto = require('sjcl');
var User = require("./models/UserSchema.js");
var MetadataDB = require("./MetadataMongoDB.js");
var Email = require("./EmailClient.js");
var config = require("../config.js");
var mongoose = require('mongoose');

var debug = false;

getSaltAndHash = function(password, callBack) {
    // 8 words = 32 bytes = 256 bits, a paranoia of 7
    var salt = stanfordCrypto.random.randomWords(8, 7);
    var hash = stanfordCrypto.misc.pbkdf2(password, salt);
    callBack(salt, hash);
};

getHash = function(password, salt, callBack) {
    var hash = stanfordCrypto.misc.pbkdf2(password, salt);
    callBack(hash);
};

/**
 * @description Generate a random User ID and make sure it is unique
 * in the database.
 */
getIdInApp = function(callBack) {
    var randomID = Math.floor(Math.random() * 10000000000000);
    User.findOne({userIDInApp: randomID}, function(error, user) {
        if (error) {
            console.log(error);
        }
        if (user === null) {
            callBack(randomID);
        } else {
            getIdInApp(callBack);
            return;
        }
    });
};

/**
 * Register a new user using the provided password.
 * 
 * @param {JSON} payload Expected keys: `username`, `password`
 * @param {function} callBack Function that takes a JSON param w/ `success`, 
 * `internal_error` and `message` as keys. 
 */
exports.registerUserAndPassword = function(payload, callBack) {
    var username = payload["username"];
    var password = payload["password"];
    var email = payload["email"];

    // Apologies for the nesting nightmare below
    // Be the change that you wish to see in the world ;-)

    getSaltAndHash(password, function(salt, hash) {
        getIdInApp(function(userId) {
            var user = new User({
                username: username,
                salt: salt,
                hash: hash,
                userIDInApp: userId,
                email: email
            });

            if (debug) console.log("Saving new user: " + email);
            User.findOne({ email: user.email }, (error, existingUser) => {
                if (error) {
                    callBack({
                        "success": false,
                        "internal_error": true,
                        "message": error
                    });        
                    return;
                } else {
                    // Check what mongoose returns if a document doesn't exist. Ans: []
                    if (existingUser) {
                        // Send an email to them notifying them of suspicious activity            
                        return;
                    } else {
                        // Save the new user's account and send enough info to log them in
                        user.save(function (error, savedUser) {
                            if (error) {
                                callBack({
                                    "success": false, "internal_error": true, "message": error
                                });                   
                            } else {
                                MetadataDB.create({
                                    userIDInApp: savedUser.userIDInApp,
                                    metadataIndex: 0
                                }, callBack);
                            }
                        });
                    }
                }
            });
        });    
    });
};

/**
 * Authenticate a user that is trying to log in.
 * 
 * @param {JSON} payload Expected keys: `username`, `password`
 * @param {function} callBack Accepts JSON param w/ `success`, `internal_error`
 *  and `message` as keys
 */
exports.authenticateUser = function(payload, callBack) {

    var username = payload["username"];
    var password = payload["password"];

    User.findOne({ username: username}, function(error, user) {
        if (error) {
            console.log(error);
        } else {
            // Case 1: The user doesn't exist
            if (!user) {
                callBack({
                    "success": false, "internal_error": false,
                    "message": "Incorrect username and/or password"
                });   
                return;
            }

            // Otherwise try authenticating the user
            var saltOnFile = user["salt"];
            var hashOnFile = user["hash"];
            getHash(password, saltOnFile, function(calculatedHash) {
                var thereIsAMatch = true;
                for (let i = 0; i < calculatedHash.length; i++) {
                    if (calculatedHash[i] !== hashOnFile[i]) {
                        thereIsAMatch = false;
                        break;
                    } 
                }

                // Case 2: The user has provided correct credentials
                if (thereIsAMatch) {
                    MetadataDB.read({ userIDInApp: user.userIDInApp}, callBack);        
                    return;
                } else {
                    // Case 3: The user provided wrong credentials
                    callBack({
                        "success": false, "internal_error": false,
                        "message": "Incorrect username and/or password"
                    });
                    return;
                }
            });
        }
    });
};

/**
 * 
 * @param {JSON} userIdentifier Expected key: `email_address`
 * @param {*} callBack 
 */
exports.sendResetLink = function(userIdentifier, callBack) {
    var alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
    var reset_password_uri = "";
    for (let i = 0; i < 50; i++) {
        reset_password_uri += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    User.findOne({ resetPasswordURL: reset_password_uri}, (error, user) => {
        if (error) console.log(error);
        if (user === null) {
            User.findOne({email: userIdentifier.email}, (error, user) => {
                if (error) {
                    console.log(error);
                    return;
                }
                if (user === null) {
                    callBack({
                        success: false, 
                        message: `Email not found. Did you want to sign up?`
                    });
                } else {
                    user.reset_password_uri = reset_password_uri;
                    user.reset_password_timestamp = Date.now();
                    user.save(function (error, savedUser, numAffected) {
                        if (error) {
                            callBack({
                                "success": false, "message": error
                            });
                        } else {
                            // For some reason, multiline template strings get
                            // unwanted line breaks in the sent email.
                            Email.sendEmail({
                                to: user.email,
                                subject: "Study Buddy Password Reset",
                                text: `To reset your Study Buddy password, ` + 
                                    `click on this link:\n\n${config.BASE_URL}` + 
                                    `/reset-password-link/${reset_password_uri}` + 
                                    `\n\nThe link is only valid for 2 hours. If you did not ` +
                                    `request a password reset, please ignore this email.`
                            }, (email_results) => {
                                callBack({
                                    success: email_results.success,
                                    message: email_results.message
                                });
                            });
                        }
                    });
                }
            });
        } else {
            sendResetLink(userIdentifier, callBack);
        }
    });

};


/**
 * 
 * @param {String} reset_password_uri The password reset uri sent in the email
 * @param {Function} callBack Takes a JSON object that has `success` and `message`
 * as its keys.
 */
exports.validatePasswordResetLink = function(reset_password_uri, callBack) {
    User.find({ reset_password_uri: reset_password_uri}, (error, users) => {
        if (error) {
            console.error(error);
            callBack({ success: false, message: error });
        }
        if (users.length !== 1) {
            console.error(`@validatePasswordResetLink: ${users.length} had ${reset_password_uri} as their reset link`);
            callBack({success: false, message: "Invalid link."});
        } else {
            if (Date.now() > users[0].reset_password_timestamp + 2 * 3600 * 1000) {
                callBack({ success: false, message: "Expired link. Please submit another reset request." });
            } else {
                callBack({ success: true, message: "Please submit a new password" });
            }
        }
    });
};

/**
 * 
 * @param {payload} payload Expected keys: `reset_password_uri`, `password`,
 * `reset_info`.
 * 
 * @param {Function} callBack Takes a JSON object that has the keys `success` 
 * and `message`.
 */
exports.resetPassword = function(payload, callBack) {
    User.find({ reset_password_uri: payload.reset_password_uri}, (error, users) => {
        if (error) {
            console.error(error);
            callBack({ success: false, message: error });
        }
        if (users.length !== 1) {
            console.error(`${users.length} users had ${payload.reset_password_uri} as their reset link`);
            callBack({ success: false, message: "User not found." });
        } else {
            var user = users[0];
            getSaltAndHash(payload.password, (salt, hash) => {
                user.salt = salt;
                user.hash = hash;
                user.reset_password_timestamp += -3 * 3600 * 1000; // Invalidate link
                user.save(function (error, savedUser, numAffected) {
                    if (error) {
                        callBack({
                            "success": false, "message": error
                        });
                    } else {
                        // For some reason, multiline template strings get
                        // unwanted line breaks in the sent email.
                        Email.sendEmail({
                            to: user.email,
                            subject: "Study Buddy: Your Password Has Been Reset",
                            text: `Your Study Buddy password was reset on ${payload.reset_request_time}. ` +
                                `If this wasn't you, please request another password reset at ` + 
                                `${config.BASE_URL}/reset-password`
                            }, 
                            (email_results) => {
                                callBack({
                                    success: email_results.success,
                                    message: email_results.message
                            });
                        });
                    }
                });
            });
        }
    });
};
