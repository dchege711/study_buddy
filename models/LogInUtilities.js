"use strict";

/**
 * A collection of functions that are useful for managing user state within the
 * app.
 *
 * @module
 */

const stanfordCrypto = require('sjcl');
const User = require("./mongoose_models/UserSchema.js");
const MetadataDB = require("./MetadataMongoDB.js");
const Metadata = require("./mongoose_models/MetadataCardSchema");
const Card = require("./mongoose_models/CardSchema");
const CardsDB = require("./CardsMongoDB.js");
const Token = require("./mongoose_models/Token.js");
const Email = require("./EmailClient.js");
const config = require("../config.js");

const DIGITS = "0123456789";
const LOWER_CASE = "abcdefghijklmnopqrstuvwxyz";
const UPPER_CASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * @description Clean up resources before exiting the script.
 */
exports.close = function() {
    return new Promise(function(resolve, reject) {
        Email.close();
        resolve();
    })
};

/**
 * @description Generate a salt and a hash for the provided password. We found
 * CrackStation's piece on [salted password hashing]{@link https://crackstation.net/hashing-security.htm}
 * informative.
 *
 * @returns {Promise} the resolved value is an array where the first element is
 * the salt and the second element is the hash.
 */
let getSaltAndHash = function(password) {
    return new Promise(function(resolve, reject) {
        // 8 words = 32 bytes = 256 bits, a paranoia of 7
        let salt = stanfordCrypto.random.randomWords(8, 7);
        let hash = stanfordCrypto.misc.pbkdf2(password, salt);
        resolve([salt, hash]);
    });
};


/**
 * @returns {Promise} resolves with the hash computed from the provided
 * `password` and `salt` parameters.
 */
let getHash = async function(password, salt) {
    let hash = await stanfordCrypto.misc.pbkdf2(password, salt);
    return Promise.resolve(hash);
};

/**
 * @description Generate a random string from the specified alphabet.
 * @param {Number} stringLength The length of the desired string.
 * @param {String} alphabet The characters that can be included in the string.
 * If not specified, defaults to the alphanumeric characters.
 */
exports.getRandomString = function(stringLength, alphabet) {
    if (alphabet === undefined) {
        alphabet = DIGITS + LOWER_CASE + UPPER_CASE;
    }
    let random_string = "";
    for (let i = 0; i < stringLength; i++) {
        // In JavaScript, concatenation is actually faster...
        random_string += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return random_string;
};

/**
 * @description Generate a User ID and a validation string, and make sure they
 * are unique in the database. This method does not save the generated user ID
 * or validation URL.
 *
 * @returns {Promise} the first param is a user ID and the second is a
 * validation string.
 */
let getIdInAppAndValidationURI = async function() {
    let lookingForUniqueIDAndURL = true;
    let randomID = null, validationURI = null;
    while (lookingForUniqueIDAndURL) {
        randomID = parseInt(exports.getRandomString(12, "123456789"), 10);
        validationURI = exports.getRandomString(32, LOWER_CASE + DIGITS);
        let conflictingUser = await new Promise(function(resolve, reject) {
            User
                .findOne({
                    $or: [
                        { userIDInApp: randomID },
                        { account_validation_uri: validationURI }
                    ]
                }).exec()
                .then((user) => {
                    resolve(user);
                })
                .catch((err) => { console.error(err); reject(err); })
        });
        if (conflictingUser === null) {
            return Promise.resolve([randomID, validationURI]);
        }
        lookingForUniqueIDAndURL = false;
    }
};

/**
 * @description Generate a unique session token.
 * @param {JSON} user The user to be associated with this token. Expected keys:
 * `userIDInApp`, `username`, `email`, `cardsAreByDefaultPrivate` and
 * `createdAt`
 * @returns {Promise} resolves with a JSON object keyed by `success`, `status`
 * and `message`. The message field contains the following keys: `token_id`,
 * `userIDInApp`, `username`, `email`, `cardsAreByDefaultPrivate` and
 * `userRegistrationDate`.
 */
let provideSessionToken = function(user) {
    let sessionToken = exports.getRandomString(64, LOWER_CASE + DIGITS + UPPER_CASE);
    return new Promise(async function(resolve, reject) {
        Token
            .findOne({value: sessionToken}).exec()
            .then(async (existingToken) => {
                if (existingToken !== null) {
                    let uniqueToken = await provideSessionToken(user);
                    resolve({success: true, status: 200, message: uniqueToken});
                } else {
                    return Token.create({
                        token_id: sessionToken, userIDInApp: user.userIDInApp,
                        username: user.username, email: user.email,
                        cardsAreByDefaultPrivate: user.cardsAreByDefaultPrivate,
                        userRegistrationDate: new Date(user.createdAt).toDateString()
                    })
                }
            })
            .then((savedToken) => {
                resolve({success: true, status: 200, message: savedToken});
            })
            .catch((err) => { reject(err); });
    });
};

/**
 * @description Send a validation URL to the email address associated with the
 * account. The validation URL must be present in `userDetails`. This method
 * does not generate new validation URLs.
 *
 * @param {JSON} userDetails Expected keys: `email`, `account_validation_uri`
 * @param {Promise} resolves with a JSON object having the keys `success`,
 * `message`, `status`.
 */
let sendAccountValidationURLToEmail = function(userDetails) {

    return new Promise(function(resolve, reject) {
        if (!userDetails.email || !userDetails.account_validation_uri) {
            reject(
                new Error(`Email address == ${userDetails.email} and validation_uri == ${userDetails.account_validation_uri}`)
            );
        } else {
            Email
                .sendEmail({
                    to: userDetails.email,
                    subject: `Please Validate Your ${config.APP_NAME} Account`,
                    text: `Welcome to ${config.APP_NAME}! Before you can log in, please click ` +
                        `on this link to validate your account.\n\n` +
                        `${config.BASE_URL}/verify-account/${userDetails.account_validation_uri}` +
                        `\n\nAgain, glad to have you onboard!`
                })
                .then((emailConfirmation) => {
                    if (emailConfirmation.success) {
                        resolve({
                            success: true, status: 200,
                            message: `If ${userDetails.email} has an account, we've sent a validation URL`
                        });
                    } else {
                        reject(new Error(emailConfirmation.message));
                    }
                })
                .catch((err) => { reject(err); });
        }
    });
};

/**
 * @param {JSON} payload Expected keys: `email`
 * @returns {Promise} resolves with a JSON object keyed by `success`, `status`
 * and `message`
 */
exports.sendAccountValidationLink = function(payload) {
    return new Promise(function(resolve, reject) {
        User
            .findOne({email: payload.email}).exec()
            .then(async (user) => {
                if (user === null) {
                    resolve({
                        success: true, status: 200,
                        message: `If ${payload.email} has an account, we've sent a validation URL`
                    });
                    return Promise.reject("DUMMY");
                } else if (user.account_validation_uri !== "verified") {
                    user.account_is_valid = false;
                    let idAndValidationURL = await getIdInAppAndValidationURI();
                    user.account_validation_uri = idAndValidationURL[1];
                    return user.save();
                } else {
                    resolve({
                        success: true, status: 200,
                        message: `${payload.email} has already validated their account.`
                    });
                    return Promise.reject("DUMMY");
                }
            })
            .then((savedUser) => {
                return sendAccountValidationURLToEmail(savedUser);
            })
            .then((emailConfirmation) => {
                resolve(emailConfirmation);
            })
            .catch((err) => { if (err !== "DUMMY") reject(err); });
    });
};

/**
 * @description Once an account is registered, the user needs to click on a
 * validation link sent to the submitted email. ~~The user cannot log into
 * the app before the email address is verified.~~ We observed a high bounce
 * rate AND few signups, so we'll allow accounts with unvalidated email
 * addresses to sign in for at most 30 days.
 *
 * @param {String} validationURI The validation URL of the associated account
 * @returns {Promise} resolves with a JSON object keyed by `success`, `status`
 * and `message`
 */
exports.validateAccount = function(validationURI) {
    return new Promise(function(resolve, reject) {
        User
            .findOne({account_validation_uri: validationURI}).exec()
            .then((user) => {
                if (user === null) {
                    resolve({
                        success: false, status: 303, redirect_url: `/send-validation-email`,
                        message: `The validation URL is either incorrect or stale. Please request for a new one from ${config.BASE_URL}/send-validation-email`
                    });
                    return Promise.reject("DUMMY");
                } else {
                    user.account_validation_uri = "verified";
                    user.account_is_valid = true;
                    return user.save();
                }
            })
            .then((savedUser) => {
                resolve({
                    success: true, status: 303, redirect_url: `/login`,
                    message: `Successfully validated ${savedUser.email}. Redirecting you to login`
                });
            })
            .catch((err) => { if (err !== "DUMMY") reject(err); });
    });
};

/**
 * @description Register a new user using the provided password, username and email.
 * - If the username is taken, we let the user know that.
 * - If the email address is already taken, send an email to that address
 * notifying them of the signup.
 * - If the input is invalid, e.g. a non alphanumeric username, raise an error
 * since it should have been caught on the client side.
 * - Otherwise, register the user and send them a validation link.
 *
 * @param {JSON} payload Expected keys: `username`, `password`, `email`
 * @returns {Promise} resolves with a JSON object containing the keys `success`,
 * `status` and `message`.
 */
exports.registerUserAndPassword = function(payload) {

    let prevResults = {};

    return new Promise(function(resolve, reject) {
        let username = payload.username;
        let password = payload.password;
        let email = payload.email;
        let results = {salt: null, hash: null};

        if (!username || !password || !email) {
            resolve({
                success: false, status: 200,
                message: "At least one of these wasn't provided: username, password, email"
            });
        } else {

            User
                .findOne({ $or: [{ username: username }, { email: email }]}).exec()
                .then((existingUser) => {
                    if (existingUser === null) return getSaltAndHash(password);
                    let rejectionReason = null;
                    if (existingUser.username === username) {
                        rejectionReason = "Username already taken."
                    } else {
                        rejectionReason = "Email already taken."
                    }
                    resolve({
                        success: false, status: 200,
                        message: rejectionReason
                    });
                    return Promise.reject("DUMMY");
                })
                .then(([salt, hash]) => {
                    results.salt = salt;
                    results.hash = hash;
                    return getIdInAppAndValidationURI();
                })
                .then(([userID, validationURI]) => {
                    return User.create({
                        username: username, salt: results.salt, hash: results.hash,
                        userIDInApp: userID, email: email, account_is_valid: false,
                        account_validation_uri: validationURI
                    });
                })
                .then((savedUser) => {
                    prevResults.savedUser = savedUser;
                    return MetadataDB.create({
                        userIDInApp: savedUser.userIDInApp,
                        metadataIndex: 0
                    });
                })
                .then((metadataConfirmation) => {
                    if (!metadataConfirmation.success) {
                        resolve(metadataConfirmation); return Promise.reject("DUMMY");
                    } else {
                        return sendAccountValidationURLToEmail(prevResults.savedUser);
                    }
                })
                .then((emailConfirmation) => {
                    if (emailConfirmation.success) {
                        emailConfirmation.message = `Welcome to ${config.APP_NAME}! We've also sent a validation URL to ${email}. Please validate your account within 30 days.`;
                        prevResults.emailConfirmation = emailConfirmation;
                        let starterCards = [
                            {
                                title: "Example of a Card Title", tags: "sample_card",
                                description: "# Hash Tags Create Headers\n\n* You can format your cards using markdown, e.g.\n* Bullet points\n\n1. Numbered lists\n\n *So*, **many**, ~~options~~\n\n> See [the Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)",
                                createdById: prevResults.savedUser.userIDInApp,
                                urgency: 10, parent: "", isPublic: false
                            },
                            {
                                title: "Sample Card With Image", tags: "sample_card",
                                description: "When linking to an image, you can optionally specify the width and height (image credit: XKCD)\n\n![xkcd: Alpha Centauri](https://imgs.xkcd.com/comics/alpha_centauri.png =25%x10%)",
                                createdById: prevResults.savedUser.userIDInApp,
                                urgency: 9, parent: "", isPublic: false
                            },
                            {
                                title: "Sample Card With Spoiler Tags", tags: "sample_card",
                                description: "> How do I quiz myself? \n\n[spoiler]\n\n* Anything below the first '[spoiler]' will be covered by a gray box. \n* Hovering over / clicking on the gray box will reveal the content underneath.\n* Also note how the urgency influences the order of the cards. Cards with lower urgency are presented last.",
                                createdById: prevResults.savedUser.userIDInApp,
                                urgency: 8, parent: "", isPublic: false
                            },
                            {
                                title: "Code Snippets and LaTeX", tags: "sample_card",
                                description: "* Feel free to inline LaTeX \\(e = mc^2\\) or code: `int n = 10;`\n\n* Standalone LaTeX also works, e.g.\n$$ e = mc^2 $$\n\n* When writing code blocks, specify the language so that it's highlighted accordingly, e.g.\n```python\nimport sys\nprint(sys.version)\n```",
                                createdById: prevResults.savedUser.userIDInApp,
                                urgency: 7, parent: "", isPublic: false
                            },
                            {
                                title: "Putting It All Together", tags: "sample_card",
                                description: "> Give examples on when these problem solving techniques are appropriate:\n* Defining a recurrence relation.\n* Manipulating the definitions.\n* Analyzing all possible cases.\n\n\n\n[spoiler]\n\n### Define a recurrence and identify base/boundary conditions\n* Useful when knowing a previous state helps you find the next state.\n* Techniques include plug-and-chug and solving for characteristic equation.\n\n### Manipulating the Definitions\n* Useful for proving general statements with little to no specificity.\n\n### Analyzing all possible cases\n* Sometimes there's an invariant that summarizes all possible cases into a few cases, e.g. *Ramsey's 3 mutual friends/enemies for n >= 6*",
                                createdById: prevResults.savedUser.userIDInApp,
                                urgency: 6, parent: "", isPublic: false
                            }
                        ]
                        return CardsDB.createMany(starterCards);
                    } else {
                        resolve(emailConfirmation); return Promise.reject("DUMMY");
                    }
                })
                .then((_) => {
                    resolve(prevResults.emailConfirmation);
                })
                .catch((err) => {
                    if (err !== "DUMMY") reject(err);
                });

        }
    });
};

/**
 * @description Authenticate a user that is trying to log in. When a user
 * successfully logs in, we set a token that will be sent on all subsequent
 * requests. Logging in should be as painless as possible. Since the usernames
 * only contain `[_\-A-Za-z0-9]+`, we can infer whether the submitted string
 * was an email address or a username, and authenticate accordingly. If the
 * username/email/password is incorrect, we send a generic
 * `Invalid username/email or password` message without disclosing which is
 * incorrect. It's possible to enumerate usernames, so this is not entirely
 * foolproof.
 *
 * @param {JSON} payload Expected keys: `username_or_email`, `password`
 * @returns {Promise} resolves with a JSON object keyed by `success`, `status`
 * and `message`. The message field contains the following keys: `token_id`,
 * `userIDInApp`, `username`, `email`, `cardsAreByDefaultPrivate` and
 * `userRegistrationDate`.
 */
exports.authenticateUser = function(payload) {

    let identifierQuery;
    let submittedIdentifier = payload.username_or_email;
    if (submittedIdentifier === undefined) {
        identifierQuery = { path_that_doesnt_exist: "invalid@username!@" };
    } else {
        if (submittedIdentifier.includes("@")) {
            identifierQuery = { email: submittedIdentifier };
        } else {
            identifierQuery = { username: submittedIdentifier };
        }
    }
    let password = payload.password;
    let prevResults = {};

    return new Promise(function(resolve, reject) {
        User
            .findOne(identifierQuery).exec()
            .then((user) => {
                if (user === null) {
                    resolve({
                        success: false, status: 200,
                        message: "Incorrect username/email and/or password"
                    });
                } else {
                    prevResults.user = user;
                    return getHash(password, user.salt);
                }
            })
            .then((computedHash) => {
                let thereIsAMatch = true;
                let hashOnFile = prevResults.user.hash;
                for (let i = 0; i < computedHash.length; i++) {
                    if (computedHash[i] !== hashOnFile[i]) {
                        thereIsAMatch = false; break;
                    }
                }
                if (thereIsAMatch) {
                    return provideSessionToken(prevResults.user);
                } else {
                    resolve({
                        success: false, status: 200,
                        message: "Incorrect username/email and/or password"
                    });
                }
            })
            .then((sessionConfirmation) => { resolve(sessionConfirmation); })
            .catch((err) => { reject(err); });
    });

};

/**
 * @description Provide an authentication endpoint where a session token has
 * been provided. Useful for maintaining persistent logins.
 *
 * @param {String} tokenID The token ID that can be used for logging in.
 * @returns {Promise} resolves with a JSON doc w/ `success`, `status`
 *  and `message` as keys
 */
exports.authenticateByToken = function(tokenID) {
    return new Promise(function(resolve, reject) {
        Token
            .findOne({ token_id: tokenID }).exec()
            .then((token) => {
                if (token === null) {
                    resolve({status: 200, success: false, message: "Invalid login token"});
                } else {
                    resolve({status: 200, success: true, message: token});
                }
            })
            .catch((err) => { reject(err); });
    });
};

/**
 * @description Delete a token from the database. Fail silently if no token
 * has the specified ID.
 * @param {String} sessionTokenID The ID of the token to be removed
 * @returns {Promise} resolves with a JSON object with keys `success`, `status`
 * and `message` as keys.
 */
exports.deleteSessionToken = function (sessionTokenID) {
    return new Promise(function(resolve, reject) {
        Token.findOneAndRemove({token_id: sessionTokenID}).exec()
        .then((_) => {
            resolve({status: 200, success: true, message: "Removed token"});
        })
        .catch((err) => { reject(err); });
    });

};

/**
 * @param {JSON} userIdentifier Expected key: `email_address`
 * @returns {Promise} resolves with a JSON object with keys `success`, `status`
 * and `message` as keys.
 */
exports.sendResetLink = function(userIdentifier) {

    let resetPasswordURI = exports.getRandomString(50, LOWER_CASE + DIGITS);

    return new Promise(function(resolve, reject) {
        User
            .findOne({reset_password_uri: resetPasswordURI}).exec()
            .then(async (user) => {
                if (user !== null) {
                    let confirmation = await exports.sendResetLink(userIdentifier);
                    resolve(confirmation);
                    return Promise.reject("DUMMY");
                } else {
                    return User.findOne({email: userIdentifier.email}).exec();
                }
            })
            .then((userWithMatchingEmail) => {
                if (userWithMatchingEmail === null) {
                    resolve({
                        success: true, status: 200,
                        message: `If ${userIdentifier.email} has an account, we've sent a password reset link`
                    });
                    return Promise.reject("DUMMY");
                } else {
                    userWithMatchingEmail.reset_password_uri = resetPasswordURI;
                    userWithMatchingEmail.reset_password_timestamp = Date.now();
                    return userWithMatchingEmail.save();
                }
            })
            .then((savedUser) => {
                // Multiline template strings render with unwanted line breaks...
                return Email.sendEmail({
                    to: savedUser.email,
                    subject: `${config.APP_NAME} Password Reset`,
                    text: `To reset your ${config.APP_NAME} password, ` +
                        `click on this link:\n\n${config.BASE_URL}` +
                        `/reset-password-link/${resetPasswordURI}` +
                        `\n\nThe link is only valid for 2 hours. If you did not ` +
                        `request a password reset, please ignore this email.`
                })
            })
            .then((_) => {
                resolve({
                    success: true, status: 200,
                    message: `If ${userIdentifier.email} has an account, we've sent a password reset link`
                });
            })
            .catch((err) => { if (err !== "DUMMY") reject(err); });
    });
};

/**
 *
 * @param {String} resetPasswordURI The password reset uri sent in the email
 * @returns {Promise} resolves with a JSON object that has `success` and `message`
 * as its keys. Fails only if something goes wrong with the database.
 */
exports.validatePasswordResetLink = function(resetPasswordURI) {
    return new Promise(function(resolve, reject) {
        User
            .findOne({reset_password_uri: resetPasswordURI}).exec()
            .then((user) => {
                if (user === null) {
                    resolve({
                        success: false, status: 404, message: "Page Not Found"
                    });
                } else if (Date.now() > user.reset_password_timestamp + 2 * 3600 * 1000) {
                    resolve({
                        success: false, status: 200, redirect_url: `${config.BASE_URL}/reset-password`,
                        message: "Expired link. Please submit another reset request."
                    });
                } else {
                    resolve({
                        success: true, status: 200, message: "Please submit a new password"
                    });
                }
            })
            .catch((err) => { reject(err); });
    });
};

/**
 * @description Reset the user's password. We also invalidate all previously
 * issued session tokens so that the user has to provide their new password
 * before logging into any session.
 *
 * @param {payload} payload Expected keys: `reset_password_uri`, `password`,
 * `reset_info`.
 * @returns {Promise} resolves with a JSON object that has the keys `success`
 * and `message`.
 */
exports.resetPassword = function(payload) {
    let prevResults = {};
    return new Promise(function(resolve, reject) {
        User
            .findOne({reset_password_uri: payload.reset_password_uri}).exec()
            .then((user) => {
                if (user === null) {
                    resolve({success: false, status: 404, message: "Page Not Found"});
                    return Promise.reject("DUMMY");
                } else {
                    prevResults.user = user;
                    return getSaltAndHash(payload.password);
                }
            })
            .then(([salt, hash]) => {
                let user = prevResults.user;
                user.salt = salt;
                user.hash = hash;
                user.reset_password_timestamp += -3 * 3600 * 1000; // Invalidate link
                return user.save();
            })
            .then((savedUser) => {
                return Token.deleteMany({userIDInApp: savedUser.userIDInApp}).exec();
            })
            .then(() => {
                return Email.sendEmail({
                    to: prevResults.user.email,
                    subject: `${config.APP_NAME}: Your Password Has Been Reset`,
                    text: `Your ${config.APP_NAME} password was reset on ${payload.reset_request_time}. ` +
                        `If this wasn't you, please request another password reset at ` +
                        `${config.BASE_URL}/reset-password`
                });
            })
            .then((emailConfirmation) => {
                if (emailConfirmation.success) {
                    resolve({
                        success: true, status: 200, redirect_url: "/",
                        message: `Password successfully reset. Log in with your new password.`
                    });
                } else {
                    resolve(emailConfirmation);
                }
            })
            .catch((err) => { if (err !== "DUMMY") reject(err); });

    });
};

/**
 * @description Fetch the User object as represented in the database.
 *
 * @returns {Promise} resolves with a JSON keyed by `status`, `message` and
 * `success`. If `success` is set, the `message` property will contain the `user`
 * object.
 */
exports.getAccountDetails = function(identifierQuery) {
    return new Promise(function(resolve, reject) {
        User
            .findOne(identifierQuery)
            .select("-salt -hash")
            .exec()
            .then((user) => {
                resolve({success: true, status: 200, message: user});
            })
            .catch((err) => { reject(err); });
    });
}


/**
 * @description Permanently delete a user's account and all related cards.
 * @param {Number} userIDInApp The ID of the account that will be deleted.
 * @returns {Promise} resolves with a JSON object that has the keys `success`
 * and `message`.
 */
exports.deleteAccount = function(userIDInApp) {

    return new Promise(function(resolve, reject) {
        User
            .deleteMany({userIDInApp: userIDInApp}).exec()
            .then(() => {
                return Token.deleteMany({userIDInApp: userIDInApp}).exec();
            })
            .then(() => {
                return Metadata.deleteMany({createdById: userIDInApp}).exec();
            })
            .then(() => {
                return Card.deleteMany({createdById: userIDInApp}).exec();
            })
            .then(() => {
                resolve({
                    success: true, status: 200,
                    message: "Account successfully deleted. Sayonara!"
                })
            })
            .catch((err) => { reject(err); });
    });
};

/**
 * @description Delete all existing users from the database. This function only
 * works when `config.NODE_ENV == 'development'`
 *
 * @param {Array} usernamesToSpare A list of usernames whose accounts shouldn't
 * be deleted. By default, the global public user is not deleted.
 *
 * @returns {Promise} resolves with the number of accounts that were deleted.
 */
exports.deleteAllAccounts = function(usernamesToSpare=[config.PUBLIC_USER_USERNAME]) {

    if (config.NODE_ENV !== "development") {
        return new Promise.reject(
            new Error(`Deleting all accounts isn't allowed in the ${config.NODE_ENV} environment`)
        );
    }

    return new Promise(function(resolve, reject) {

        User
            .find({username: {$nin: usernamesToSpare}}).exec()
            .then(async (existingUsers) => {
                let numAccountsDeleted = 0;
                for (let i = 0; i < existingUsers.length; i++) {
                    await exports.deleteAccount(existingUsers[i].userIDInApp);
                    numAccountsDeleted += 1;
                }
                resolve(numAccountsDeleted);
            })
            .catch((err) => { reject(err); });

    });
};
