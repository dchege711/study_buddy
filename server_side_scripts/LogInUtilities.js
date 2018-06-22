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
 * @description Generate a random string from the specified alphabet.
 * @param {Number} string_length The length of the desired string.
 * @param {String} alphabet The characters that can be included in the string.
 */
getRandomString = function(string_length, alphabet) {
    var random_string = "";
    for (let i = 0; i < string_length; i++) {
        random_string += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return random_string;
};

/**
 * @description Generate a User ID and a validation string, and 
 * make sure they are unique in the database.
 * @param {Function} callBack A function that takes two parameters, a user ID
 * and a validation string.
 */
getIdInAppAndValidationURI = function(callBack) {
    var randomID = parseInt(getRandomString(12, "123456789"), 10);
    var validationURI = getRandomString(32, "abcdefghijklmnopqrstuvwxyz0123456789");
    User.findOne(
        { $or: 
            [
                { userIDInApp: randomID }, 
                { account_validation_uri: validationURI }
            ] 
        },
        function(error, user) {
        if (error) {
            console.error(error);
        }
        if (user === null) {
            callBack(randomID, validationURI);
        } else {
            getIdInAppAndValidationURI(callBack);
            return;
        }
    });
};

/**
 * @description Send a validation URL to the email address associated with the
 * account.
 * @param {object} userDetails Expected keys: `email_address`, `account_validation_uri`
 * @param {Function} callBack A function that takes a JSON object having the keys
 * `success`, `message`, `status`.
 */
sendAccountValidationURLToEmail = function(userDetails, callBack) {
    if (userDetails.email !== undefined && userDetails.account_validation_uri !== undefined) {
        Email.sendEmail(
            {
                to: userDetails.email,
                subject: "Please Validate Your Study Buddy Account",
                text: `Welcome to Study Buddy! Before you can log in, please click ` +
                    `on this link to validate your account.\n\n` + 
                    `${config.BASE_URL}/verify-account/${userDetails.account_validation_uri}` +
                    `\n\nAgain, glad to have you onboard!`
            }, (email_confirmation) => {
                if (email_confirmation.success) {
                    callBack({
                        success: true, status: 200,
                        message: `Please check ${userDetails.email} for an account validation link.`
                    });
                } else {
                    console.error(email_confirmation.message);
                    callBack({success: false, status: 500, message: email_confirmation.message});
                }
            }
        );
    } else {
        console.error(`@sendAccountValidationURLToEmail: Missing email address and validation_uri in ${userDetails.username}`);
        callBack({
            success: false, status: 500, 
            message: "@sendAccountValidationURLToEmail: Missing parameters"
        });
    }
};

/**
 * 
 * @param {Object} payload Expected keys: `email`
 * @param {Function} callBack Takes a JSON object with `success`, `status` and
 * `message` as its keys.
 */
exports.sendAccountValidationLink = function(payload, callBack) {
    User.find({email: payload.email}, (error, users) => {
        if (error) {
            console.error(error);
            callBack({success: false, status: 500, message: "Internal Server Error"});
        } else if (users.length === 0) {
            callBack({
                success: false, status: 200,
                message: `No account was found under ${payload.email}`
            });
        } else if (users.length > 1) {
            console.error(`@sendAccountValidationLink: Multiple accounts under ${payload.email}`);
            callBack({ success: false, status: 500, message: "Internal Server Error" });
        } else {
            var user = users[0];
            if (user.account_validation_uri === undefined || user.account_is_valid === undefined) {
                user.account_validation_uri = getRandomString(32, "abcdefghijklmnopqrstuvwxyz0123456789");
                user.account_is_valid = false;
                User.find(
                    { account_validation_uri: user.account_validation_uri},
                    (error, existing_users_with_same_uri) => {
                        if (error) {
                            console.error(error);
                            callBack({ success: false, status: 500, message: "Internal Server Error" });
                        } else if (existing_users_with_same_uri.length !== 0) {
                            console.error(`${existing_users_with_same_uri.length} duplicate URIs found!`);
                            sendAccountValidationLink(payload, callBack);
                        } else {
                            user.save((error, savedUser) => {
                                if (error) {
                                    console.error(error);
                                    callBack({ success: false, status: 500, message: "Internal Server Error" });
                                } else {
                                    sendAccountValidationURLToEmail(savedUser, callBack);
                                }
                            });
                        }
                    }
                );
            } else {
                sendAccountValidationURLToEmail(user, callBack);
            }  
        }
    });
};

exports.validateAccount = function(validation_uri, callBack) {
    User.find(
        { account_validation_uri: validation_uri},
        (error, users) => {
            if (error) {
                console.error(error);
                callBack({success: false, status: 500, message: "Internal Server Error"});
            } else if (users.length !== 1) {
                console.error(`@validateAccount ${users.length} users have the same validation uri`);
                callBack({ success: false, status: 500, message: "Internal Server Error" });
            } else {
                var user = users[0];
                user.account_validation_uri = "verified";
                user.account_is_valid = true;
                user.save((error, savedUser) => {
                    if (error) {
                        console.error(error);
                        callBack({ success: false, status: 500, message: "Internal Server Error" });
                    } else {
                        callBack({
                            success: true, status: 200,
                            message: savedUser.email
                        });
                    }
                });
            }
        }
    );
};

/**
 * Register a new user using the provided password.
 * 
 * @param {JSON} payload Expected keys: `username`, `password`
 * @param {function} callBack Function that takes a JSON param w/ `success`, 
 * `internal_error` and `message` as keys. 
 */
exports.registerUserAndPassword = function(payload, callBack) {
    var username = payload.username;
    var password = payload.password;
    var email = payload.email;

    // Apologies for the nesting nightmare below
    // Be the change that you wish to see in the world ;-)

    getSaltAndHash(password, function(salt, hash) {
        getIdInAppAndValidationURI(function(userId, validationURI) {
            var user = new User({
                username: username,
                salt: salt,
                hash: hash,
                userIDInApp: userId,
                email: email,
                account_validation_uri: validationURI,
                account_is_valid: false
            });

            if (debug) console.log("Saving new user: " + email);
            User.find({ email: user.email }, (error, existingUsers) => {
                if (error) {
                    console.error(error);
                    callBack({success: false, status: 500, message: error});        
                    return;
                } else {
                    // Check what mongoose returns if a document doesn't exist. Ans: []
                    if (existingUsers.length !== 0) {

                        if (existingUsers.length !== 1) {
                            // I hope it never comes to this, ever.
                            console.error(`@registerUserAndPassword: ${existingUsers.length} have the same email: ${user.email}`);
                            callBack({success: false, status: 500, message: "500: Internal Server Error"});
                        } else {
                            // Send an email to them notifying them of suspicious activity
                            var existingUser = existingUsers[0];
                            Email.sendEmail(
                                {
                                    to: existingUser.email,
                                    subject: `Did you try to register for a new Study Buddy Account?`,
                                    text: `Psst! Someone tried registering for a new Study Buddy ` + 
                                        `account using your email address. If this was you, you ` + 
                                        `already have an account.\n\nForgot your password? Request a ` +
                                        `reset at ${config.BASE_URL}/reset-password.\n\nCheers,\nStudy Buddy by c13u` 
                                }, (email_confirmation) => {
                                    if (email_confirmation.success) {
                                        callBack({
                                            success: true, status: 200, 
                                            message: `Please check ${user.email} for a confirmation message`
                                        });
                                    } else {
                                        console.error(email_confirmation.message);
                                        callBack({
                                            success: false, status: 500,
                                            message: email_confirmation.message
                                        });
                                    }
                                }
                            );
                        }            
                        return;
                    } else {
                        // Save the new user's account and send enough info to log them in
                        user.save(function (error, savedUser) {
                            if (error) {
                                console.error(error);
                                callBack({ success: false, status: 500, message: error });                   
                            } else {
                                MetadataDB.create({
                                    userIDInApp: savedUser.userIDInApp,
                                    metadataIndex: 0
                                }, (metadata_confirmation) => {
                                    if (metadata_confirmation.success) {
                                        sendAccountValidationURLToEmail(savedUser, callBack);
                                    } else {
                                        console.error(metadata_confirmation.message);
                                        callBack({
                                            success: false, status: 500,
                                            message: metadata_confirmation.message
                                        });
                                    }
                                });
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

    var identifier_query;
    var submitted_identifier = payload.username_or_email;
    if (submitted_identifier === undefined) {
        identifier_query = {path_that_doesnt_exist: "invalid@username!@"};
    } else {
        if (submitted_identifier.includes("@")) {
            identifier_query = { email: submitted_identifier };
        } else {
            identifier_query = { username: submitted_identifier };
        }
    }
    var password = payload.password;

    User.findOne(identifier_query, function(error, user) {
        if (error) {
            console.error(error);
        } else {
            // Case 1: The user doesn't exist
            if (!user) {
                callBack({
                    success: false, status: 200,
                    message: "Incorrect username/email and/or password"
                });   
                return;
            }

            // Otherwise try authenticating the user
            var saltOnFile = user.salt;
            var hashOnFile = user.hash;
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

                    // Prevent unvalidated accounts from logging in..
                    if (!user.account_is_valid) {
                        callBack({
                            success: false, status: 200,
                            message: `Please validate this account using the URL that was sent ` +
                                `to the email address associated with ${user.username}, ` + 
                                `or go to ${config.BASE_URL}/send-validation-email to request a new URL`
                        });
                    } else {
                        MetadataDB.read(
                            { userIDInApp: user.userIDInApp }, callBack
                        ); 
                    }       
                    return;
                } else {
                    // Case 3: The user provided wrong credentials
                    callBack({
                        success: false, status: 200,
                        message: "Incorrect username/email and/or password"
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
    
    reset_password_uri = getRandomString(50, "abcdefghijklmnopqrstuvwxyz0123456789");

    User.findOne({ resetPasswordURL: reset_password_uri}, (error, user) => {
        if (error) console.log(error);
        if (user === null) {
            User.findOne({email: userIdentifier.email}, (error, user) => {
                if (error) {
                    console.error(error);
                    return;
                }
                if (user === null) {
                    callBack({
                        success: false, status: 200,
                        message: `If ${userIdentifier.email} has an account, we've sent a reset link`
                    });
                } else {
                    user.reset_password_uri = reset_password_uri;
                    user.reset_password_timestamp = Date.now();
                    user.save(function (error, savedUser, numAffected) {
                        if (error) {
                            console.error(error);
                            callBack({
                                success: false, status: 500, message: error
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
                                if (email_results.success) {
                                    callBack({
                                        success: true, status: 200,
                                        message: `If ${userIdentifier.email} has an account, we've sent a reset link`
                                    });
                                } else {
                                    console.error(email_results.message);
                                    callBack({ success: false, message: error, status: 500 });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            // Repeat the process because the password_uri is already taken
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
            callBack({ success: false, message: error, status: 500 });
        }
        if (users.length === 0) {
            callBack({success: false, status: 404, message: ""});
        } else if (users.length > 1) {
            console.error(`@validatePasswordResetLink: ${users.length} share the same password reset uri`);
            callBack({ success: false, status: 500, message: "" });
        } else {
            if (Date.now() > users[0].reset_password_timestamp + 2 * 3600 * 1000) {
                callBack({ success: false, status: 200, message: "Expired link. Please submit another reset request." });
            } else {
                callBack({ success: true, status: 200, message: "Please submit a new password" });
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
            callBack({ success: false, message: error, status: 500 });
        }
        if (users.length !== 1) {
            if (users.length === 0) {
                callBack({ success: false, status: 404, message: "" });
            } else {
                console.error(`${users.length} users had ${payload.reset_password_uri} as their reset link`);
                callBack({ success: false, status: 500, message: "" });
            }
        } else {
            var user = users[0];
            getSaltAndHash(payload.password, (salt, hash) => {
                user.salt = salt;
                user.hash = hash;
                user.reset_password_timestamp += -3 * 3600 * 1000; // Invalidate link
                user.save(function (error, savedUser, numAffected) {
                    if (error) {
                        console.error(error);
                        callBack({success: false, message: error, status: 500});
                    } else {
                        // For some reason, multiline template strings get line breaks in the sent email.
                        Email.sendEmail({
                            to: user.email,
                            subject: "Study Buddy: Your Password Has Been Reset",
                            text: `Your Study Buddy password was reset on ${payload.reset_request_time}. ` +
                                `If this wasn't you, please request another password reset at ` + 
                                `${config.BASE_URL}/reset-password`
                            }, 
                            (email_results) => {
                                if (email_results.success) {
                                    callBack({
                                        success: true, status: 200,
                                        message: `Password successfully reset. Log in with your new password.`
                                    });
                                } else {
                                    console.error(email_results.message);
                                    callBack({ success: false, message: error, status: 500 });
                                }
                            }
                        );
                    }
                });
            });
        }
    });
};
