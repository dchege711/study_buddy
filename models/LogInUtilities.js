var stanfordCrypto = require('sjcl');
var User = require("./mongoose_models/UserSchema.js");
var MetadataDB = require("./MetadataMongoDB.js");
var Token = require("./mongoose_models/Token.js");
var Email = require("./EmailClient.js");
var config = require("../config.js");
var mongoose = require('mongoose');

var debug = false;

var DIGITS = "0123456789";
var LOWER_CASE = "abcdefghijklmnopqrstuvwxyz";
var UPPER_CASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var generic_500_msg = {
    success: false, status: 500, message: "Internal Server Error"
};

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
exports.getRandomString = function(string_length, alphabet) {
    var random_string = "";
    for (let i = 0; i < string_length; i++) {
        // In JavaScript, concatenation is actually faster...
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
    var validationURI = getRandomString(32, LOWER_CASE + DIGITS);
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
 * @description Generate a unique session token.
 * @param {String} user The user to be associated with this token
 * @param {Function} callBack Takes a JSON object with `success`, `status` and
 * `message` as its keys.
 */
provideSessionToken = function(user, callBack) {
    var session_token = exports.getRandomString(64, LOWER_CASE + DIGITS + UPPER_CASE);
    Token.findOne({value: session_token}, (error, tokenObject) => {
        if (error) {
            console.error(error);
            callBack(generic_500_msg);
        } else if (tokenObject) {
            provideSessionToken(callBack);
        } else {
            var new_token = Token({
                token_id: session_token, userIDInApp: user.userIDInApp
            });
            new_token.save((error, saved_token) => {
                if (error) {
                    console.error(error);
                    callBack(generic_500_msg);
                } else {
                    callBack({ status: 200, success: true, message: saved_token });
                }
            });
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
                        message: `If ${userDetails.email} has an account, we've sent a validation URL`
                    });
                } else {
                    console.error(email_confirmation.message);
                    callBack(generic_500_msg);
                }
            }
        );
    } else {
        console.error(`@sendAccountValidationURLToEmail: Missing email address and validation_uri in ${userDetails.username}`);
        callBack(generic_500_msg);
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
            callBack(generic_500_msg);
        } else if (users.length === 0) {
            callBack({
                success: false, status: 200,
                message: `If ${payload.email} has an account, we've sent a validation URL`
            });
        } else if (users.length > 1) {
            console.error(`@sendAccountValidationLink: Multiple accounts under ${payload.email}`);
            callBack(generic_500_msg);
        } else {
            var user = users[0];
            if (user.account_validation_uri === undefined || user.account_is_valid === undefined) {
                user.account_validation_uri = getRandomString(32, LOWER_CASE + DIGITS);
                user.account_is_valid = false;
                User.find(
                    { account_validation_uri: user.account_validation_uri},
                    (error, existing_users_with_same_uri) => {
                        if (error) {
                            console.error(error);
                            callBack(generic_500_msg);
                        } else if (existing_users_with_same_uri.length !== 0) {
                            console.error(`${existing_users_with_same_uri.length} duplicate URIs found!`);
                            sendAccountValidationLink(payload, callBack);
                        } else {
                            user.save((error, savedUser) => {
                                if (error) {
                                    console.error(error);
                                    callBack(generic_500_msg);
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
                callBack(generic_500_msg);
            } else if (users.length !== 1) {
                console.error(`@validateAccount ${users.length} users have the same validation uri`);
                callBack(generic_500_msg);
            } else {
                var user = users[0];
                user.account_validation_uri = "verified";
                user.account_is_valid = true;
                user.save((error, savedUser) => {
                    if (error) {
                        console.error(error);
                        callBack(generic_500_msg);
                    } else {
                        callBack({ 
                            success: true, status: 303, redirect_url: "/",
                            message: `Successfully validated ${savedUser.email}. Redirecting you to login`
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

    User.find({username: username}, (error, usersWithSameUsername) => {
        if (error) {
            console.error(error);
            callBack(generic_500_msg);
        } else if (usersWithSameUsername.length !== 0) {
            callBack({ success: false, status: 200, message: "Username already taken."});
        } else {
            getSaltAndHash(password, function (salt, hash) {
                getIdInAppAndValidationURI(function (userId, validationURI) {
                    var user = new User({
                        username: username,
                        salt: salt,
                        hash: hash,
                        userIDInApp: userId,
                        email: email,
                        account_validation_uri: validationURI,
                        account_is_valid: false
                    });

                    if (debug) console.log(`Saving new user: ${email}`);
                    User.find({ email: user.email }, (error, existingUsers) => {
                        if (error) {
                            console.error(error);
                            callBack(generic_500_msg);
                            return;
                        } else {
                            if (existingUsers.length > 1) {
                                // I hope it never comes to this, ever.
                                console.error(`@registerUserAndPassword: ${existingUsers.length} have the same email: ${user.email}`);
                                callBack(generic_500_msg);
                            } else if (existingUsers.length === 1) {
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
                                                message: `Please check ${existingUser.email} for an account validation link.`
                                            });
                                        } else {
                                            console.error(email_confirmation.message);
                                            callBack(generic_500_msg);
                                        }
                                    }
                                );
                            } else {
                                // Save the new user's account and send enough info to log them in
                                user.save(function (error, savedUser) {
                                    if (error) {
                                        console.error(error);
                                        callBack(generic_500_msg);
                                    } else {
                                        MetadataDB.create({
                                            userIDInApp: savedUser.userIDInApp,
                                            metadataIndex: 0
                                        }, (metadata_confirmation) => {
                                            if (metadata_confirmation.success) {
                                                sendAccountValidationURLToEmail(savedUser, (email_confirmation) => {
                                                    // Overwrite the message on success
                                                    if (email_confirmation.success) {
                                                        email_confirmation.message = `We've sent a validation URL to ${savedUser.email}. Please validate before logging in`;
                                                    }
                                                    callBack(email_confirmation);
                                                });
                                            } else {
                                                console.error(metadata_confirmation.message);
                                                callBack(generic_500_msg);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                });
            });
        }
    });

    
};

/**
 * Authenticate a user that is trying to log in.
 * 
 * @param {JSON} payload Expected keys: `username`, `password`
 * @param {function} callBack Accepts JSON param w/ `success`, `status`
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
                        sendAccountValidationURLToEmail(user, (email_confirmation) => {
                            if (email_confirmation.success) email_confirmation.success = false; 
                            callBack(email_confirmation);
                        });
                    } else {
                        provideSessionToken(user, callBack);
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
 * @description Provide an authentication endpoint where a session token has 
 * been provided. Useful for maintaining persistent logins.
 * @param {String} token_id The token ID that can be used for logging in.
 * @param {Function} callBack Takes a JSON object with keys `success`, `status`
 * and `message` as keys.
 */
exports.authenticateByToken = function(token_id, callBack) {
    Token.find({ token_id: token_id }, (err, tokens) => {
        if (err) {
            console.error(err);
            callBack(generic_500_msg);
        } else if (tokens.length > 1) {
            console.error("@authenticateByToken: Multiple users have the same login token!");
        } else if (tokens.length == 0) {
            callBack({ status: 200, success: false, message: "Invalid login token" });
        } else {
            callBack({ status: 200, success: true, message: tokens[0] });
        }
    });
};

/**
 * @description Delete a token from the database. Fail silently if no token
 * has the specified ID.
 * @param {String} session_token The ID of the token to be removed
 * @param {Function} callBack Takes a JSON object with keys `success`, `status`
 * and `message` as keys.
 */
exports.deleteSessionToken = function (session_token, callBack) {
    Token.findOneAndRemove({ token_id: session_token }, (error, removed_token) => {
        if (error) {
            console.log(error);
            callBack(generic_500_msg);
        } else {
            callBack({ status: 200, success: true, message: "Removed token" });
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

    User.find({ resetPasswordURL: reset_password_uri}, (error, existing_users_with_same_uri) => {
        if (error) console.log(error);
        if (existing_users_with_same_uri.length === 0) {
            User.find({email: userIdentifier.email}, (error, users_with_same_email) => {
                if (error) {
                    console.error(error);
                    callBack(generic_500_msg);
                }
                else if (users_with_same_email.length === 0) {
                    callBack({
                        success: true, status: 200,
                        message: `If ${userIdentifier.email} has an account, we've sent a password reset link`
                    });
                } else if (users_with_same_email.length > 1) {
                    console.error(`${users_with_same_email.length} users have ${userIdentifier.email} as their email address`);
                    callBack(generic_500_msg);
                } else {
                    var user = users_with_same_email[0];
                    user.reset_password_uri = reset_password_uri;
                    user.reset_password_timestamp = Date.now();
                    user.save(function (error, savedUser, numAffected) {
                        if (error) {
                            console.error(error);
                            callBack(generic_500_msg);
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
                                    callBack(generic_500_msg);
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
            callBack(generic_500_msg);
        }
        if (users.length === 0) {
            callBack({success: false, status: 404, message: "Page Not Found"});
        } else if (users.length > 1) {
            console.error(`@validatePasswordResetLink: ${users.length} share the same password reset uri`);
            callBack(generic_500_msg);
        } else {
            if (Date.now() > users[0].reset_password_timestamp + 2 * 3600 * 1000) {
                callBack({ 
                    success: false, status: 303, redirect_url: "/reset-password", 
                    message: "Expired link. Please submit another reset request." 
                });
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
            callBack(generic_500_msg);
        }
        if (users.length !== 1) {
            if (users.length === 0) {
                callBack({ success: false, status: 404, message: "Page Not Found" });
            } else {
                console.error(`${users.length} users had ${payload.reset_password_uri} as their reset link`);
                callBack(generic_500_msg);
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
                        callBack(generic_500_msg);
                    } else {
                        // For some reason, multiline template strings get line breaks in the sent email.
                        Token.deleteMany({userIDInApp: user.userIDInApp}, (err) => {
                            if (err) {
                                console.error(error);
                                callBack(generic_500_msg);
                            } else {
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
                                                success: true, status: 303, redirect_url: "/",
                                                message: `Password successfully reset. Log in with your new password.`
                                            });
                                        } else {
                                            console.error(email_results.message);
                                            callBack(generic_500_msg);
                                        }
                                    }
                                );
                            }
                        });
                        
                    }
                });
            });
        }
    });
};