"use strict";
/**
 * A collection of functions that are useful for managing user state within the
 * app.
 *
 * @module
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var sjcl = require("sjcl");
var MetadataDB = require("./MetadataMongoDB");
var CardsDB = require("./CardsMongoDB");
var Email = require("./EmailClient");
var UserSchema_1 = require("./mongoose_models/UserSchema");
var MetadataCardSchema_1 = require("./mongoose_models/MetadataCardSchema");
var CardSchema_1 = require("./mongoose_models/CardSchema");
var Token_1 = require("./mongoose_models/Token");
var config_1 = require("../config");
var DIGITS = "0123456789";
var LOWER_CASE = "abcdefghijklmnopqrstuvwxyz";
var UPPER_CASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
exports.ALL_ALPHANUMERICS = DIGITS + LOWER_CASE + UPPER_CASE;
/**
 * @description Clean up resources, e.g. the email client
 */
function close() {
    return new Promise(function (resolve, reject) {
        Email.close();
        resolve();
    });
}
exports.close = close;
;
/**
 * @description Generate a salt and a hash for the provided password. We found
 * CrackStation's piece on
 * [salted password hashing]{@link https://crackstation.net/hashing-security.htm}
 * informative.
 *
 * @returns {Promise} the resolved value is an array where the first element is
 * the salt and the second element is the hash.
 */
function getSaltAndHash(password) {
    return new Promise(function (resolve, reject) {
        // 8 words = 32 bytes = 256 bits, a paranoia of 7
        var salt = sjcl.random.randomWords(8, 7);
        var hash = sjcl.misc.pbkdf2(password, salt);
        resolve([salt, hash]);
    });
}
;
/**
 * @returns {Promise} resolves with the hash computed from the provided
 * `password` and `salt` parameters.
 */
function getHash(password, salt) {
    return __awaiter(this, void 0, void 0, function () {
        var hash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sjcl.misc.pbkdf2(password, salt)];
                case 1:
                    hash = _a.sent();
                    return [2 /*return*/, Promise.resolve(hash)];
            }
        });
    });
}
;
/**
 * @description Generate a random string from the specified alphabet.
 * @param stringLength The length of the desired string.
 * @param alphabet The characters that can be included in the string. If not
 * specified, defaults to the alphanumeric characters.
 */
function getRandomString(stringLength, alphabet) {
    if (alphabet === void 0) { alphabet = exports.ALL_ALPHANUMERICS; }
    var random_string = "";
    for (var i = 0; i < stringLength; i++) {
        // In JavaScript, concatenation is fast
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat#Performance
        random_string += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return random_string;
}
exports.getRandomString = getRandomString;
;
/**
 * @description Generate a User ID and a validation string, and make sure they
 * are unique in the database. This method does not save the generated user ID
 * or validation URL.
 *
 * @returns {Promise} The first param is a user ID and the second is a
 * validation URI.
 */
function getIdInAppAndValidationURI() {
    return __awaiter(this, void 0, void 0, function () {
        var lookingForUniqueIDAndURL, randomID, validationURI, conflictingUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lookingForUniqueIDAndURL = true;
                    _a.label = 1;
                case 1:
                    if (!lookingForUniqueIDAndURL) return [3 /*break*/, 3];
                    randomID = parseInt(exports.getRandomString(12, "123456789"), 10);
                    validationURI = exports.getRandomString(32, LOWER_CASE + DIGITS);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            UserSchema_1.User
                                .findOne({
                                $or: [
                                    { userIDInApp: randomID },
                                    { account_validation_uri: validationURI }
                                ]
                            }).exec()
                                .then(function (user) {
                                resolve(user);
                            })
                                .catch(function (err) { console.error(err); reject(err); });
                        })];
                case 2:
                    conflictingUser = _a.sent();
                    if (conflictingUser === null) {
                        return [2 /*return*/, Promise.resolve([randomID, validationURI])];
                    }
                    /** @todo Found a bug. Now make it crash :-D */
                    lookingForUniqueIDAndURL = false;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
;
/**
 * @description Generate a unique session token for `user`.
 *
 * @returns {Promise} If successful, the `message` attribute holds a `Token`
 * object.
 */
function provideSessionToken(user) {
    var sessionToken = exports.getRandomString(64, LOWER_CASE + DIGITS + UPPER_CASE);
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                Token_1.Token
                    .findOne({ value: sessionToken }).exec()
                    .then(function (existingToken) { return __awaiter(_this, void 0, void 0, function () {
                    var uniqueToken;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(existingToken !== null)) return [3 /*break*/, 2];
                                return [4 /*yield*/, provideSessionToken(user)];
                            case 1:
                                uniqueToken = _a.sent();
                                resolve({ success: true, status: 200, message: uniqueToken });
                                return [3 /*break*/, 3];
                            case 2: return [2 /*return*/, Token_1.Token.create({
                                    token_id: sessionToken, userIDInApp: user.userIDInApp,
                                    username: user.username, email: user.email,
                                    cardsAreByDefaultPrivate: user.cardsAreByDefaultPrivate,
                                    userRegistrationDate: new Date(user.createdAt).toDateString()
                                })];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })
                    .then(function (savedToken) {
                    resolve({ success: true, status: 200, message: savedToken });
                })
                    .catch(function (err) { reject(err); });
                return [2 /*return*/];
            });
        });
    });
}
;
/**
 * @description Send a validation URL to the email address associated with the
 * account. The validation URL must be present in `userDetails`. This method
 * does not generate new validation URLs.
 *
 * @param {Promise} resolves with a JSON object having the keys `success`,
 * `message`, `status`.
 */
function sendAccountValidationURLToEmail(userDetails) {
    return new Promise(function (resolve, reject) {
        if (!userDetails.email || !userDetails.account_validation_uri) {
            resolve({
                success: false, status: 200,
                message: "Could not parse the email address or the validation URI"
            });
            return;
        }
        Email
            .sendEmail({
            to: userDetails.email,
            subject: "Please Validate Your " + config_1.APP_NAME + " Account",
            text: "Welcome to " + config_1.APP_NAME + "! Before you can log in, please click " +
                "on this link to validate your account.\n\n" +
                (config_1.BASE_URL + "/verify-account/" + userDetails.account_validation_uri) +
                "\n\nAgain, glad to have you onboard!"
        })
            .then(function (emailConfirmation) {
            if (emailConfirmation.success) {
                resolve({
                    success: true, status: 200,
                    message: "If " + userDetails.email + " has an account, we've sent a validation URL"
                });
            }
            else {
                reject(new Error(emailConfirmation.message));
            }
        })
            .catch(function (err) { reject(err); });
    });
}
;
/**
 * @description Send an account validation link to `emailAddress`.
 *
 * @returns {Promise} If successful, `message` holds a confirmation string.
 */
function sendAccountValidationLink(emailAddress) {
    return new Promise(function (resolve, reject) {
        var _this = this;
        UserSchema_1.User
            .findOne({ email: emailAddress }).exec()
            .then(function (user) { return __awaiter(_this, void 0, void 0, function () {
            var idAndValidationURL;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(user === null)) return [3 /*break*/, 1];
                        resolve({
                            success: true, status: 200,
                            message: "If " + emailAddress + " has an account, we've sent a validation URL"
                        });
                        return [2 /*return*/];
                    case 1:
                        if (!(user.account_validation_uri !== "verified")) return [3 /*break*/, 3];
                        user.account_is_valid = false;
                        return [4 /*yield*/, getIdInAppAndValidationURI()];
                    case 2:
                        idAndValidationURL = _a.sent();
                        user.account_validation_uri = idAndValidationURL[1];
                        return [2 /*return*/, user.save()];
                    case 3:
                        resolve({
                            success: true, status: 200,
                            message: emailAddress + " has already validated their account."
                        });
                        return [2 /*return*/];
                }
            });
        }); })
            .then(function (savedUser) {
            return sendAccountValidationURLToEmail(savedUser);
        })
            .then(function (emailConfirmation) {
            resolve(emailConfirmation);
        })
            .catch(function (err) { reject(err); });
    });
}
exports.sendAccountValidationLink = sendAccountValidationLink;
;
/**
 * @description Once an account is registered, the user needs to click on a
 * validation link sent to the submitted email. ~~The user cannot log into
 * the app before the email address is verified.~~ We observed a high bounce
 * rate AND few signups, so we'll allow accounts with unvalidated email
 * addresses to sign in for at most 30 days.
 *
 * @returns {Promise} If `success` is set, `message` will be a confirmation
 * string. There will also be a `redirect_url` attribute in the `IBaseMessage`.
 */
function validateAccount(validationURI) {
    return new Promise(function (resolve, reject) {
        UserSchema_1.User
            .findOne({ account_validation_uri: validationURI }).exec()
            .then(function (user) {
            if (user === null) {
                /** @todo: This literal URLs will kill me one day */
                resolve({
                    success: false, status: 303, redirect_url: "/send-validation-email",
                    message: "The validation URL is either incorrect or stale. Please request for a new one from " + config_1.BASE_URL + "/send-validation-email"
                });
                return;
            }
            else {
                user.account_validation_uri = "verified";
                user.account_is_valid = true;
                return user.save();
            }
        })
            .then(function (savedUser) {
            resolve({
                success: true, status: 303, redirect_url: "/login",
                message: "Successfully validated " + savedUser.email + ". Redirecting you to login"
            });
        })
            .catch(function (err) { reject(err); });
    });
}
exports.validateAccount = validateAccount;
;
/**
 * @description Register a new user using the provided password, username and email.
 * - If the username is taken, we let the user know that.
 * - If the email address is already taken, send an email to that address
 *   notifying them of the signup.
 * - If the input is invalid, e.g. a non alphanumeric username, raise an error
 *   since it should have been caught on the client side.
 * - Otherwise, register the user and send them a validation link.
 *
 * @returns {Promise} resolves with a JSON object containing the keys `success`,
 * `status` and `message`.
 */
function registerUserAndPassword(registrationDetails) {
    var prevResults = {};
    return new Promise(function (resolve, reject) {
        var username = registrationDetails.username;
        var password = registrationDetails.password;
        var email = registrationDetails.email;
        var results = {};
        if (!username || !password || !email) {
            resolve({
                success: false, status: 200,
                message: "At least one of these wasn't provided: username, password, email"
            });
            return;
        }
        UserSchema_1.User
            .findOne({ $or: [{ username: username }, { email: email }] }).exec()
            .then(function (existingUser) {
            if (existingUser === null)
                return getSaltAndHash(password);
            var rejectionReason = null;
            if (existingUser.username === username) {
                rejectionReason = "Username already taken.";
            }
            else {
                rejectionReason = "Email already taken.";
            }
            resolve({
                success: false, status: 200,
                message: rejectionReason
            });
            return;
        })
            .then(function (_a) {
            var salt = _a[0], hash = _a[1];
            results.salt = salt;
            results.hash = hash;
            return getIdInAppAndValidationURI();
        })
            .then(function (_a) {
            var userID = _a[0], validationURI = _a[1];
            return UserSchema_1.User.create({
                username: username, salt: results.salt, hash: results.hash,
                userIDInApp: userID, email: email, account_is_valid: false,
                account_validation_uri: validationURI
            });
        })
            .then(function (savedUser) {
            prevResults.savedUser = savedUser;
            return MetadataDB.create({
                userIDInApp: savedUser.userIDInApp,
                metadataIndex: 0
            });
        })
            .then(function (metadataConfirmation) {
            if (!metadataConfirmation.success) {
                resolve(metadataConfirmation);
                return;
            }
            else {
                return sendAccountValidationURLToEmail(prevResults.savedUser);
            }
        })
            .then(function (emailConfirmation) {
            if (emailConfirmation.success) {
                emailConfirmation.message = "Welcome to " + config_1.APP_NAME + "! We've also sent a validation URL to " + email + ". Please validate your account within 30 days.";
                prevResults.emailConfirmation = emailConfirmation;
                var starterCards = [
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
                ];
                return CardsDB.createMany(starterCards);
            }
            else {
                resolve(emailConfirmation);
                return;
            }
        })
            .then(function (_) {
            resolve(prevResults.emailConfirmation);
        })
            .catch(function (err) { reject(err); });
    });
}
exports.registerUserAndPassword = registerUserAndPassword;
;
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
 * @returns {Promise} If `success` is set, `message` will have a session token.
 */
function authenticateUser(authDetails) {
    var identifierQuery;
    var submittedIdentifier = authDetails.username_or_email;
    if (submittedIdentifier === undefined) {
        identifierQuery = { path_that_doesnt_exist: "invalid@username!@" };
    }
    else {
        if (submittedIdentifier.includes("@")) {
            identifierQuery = { email: submittedIdentifier };
        }
        else {
            identifierQuery = { username: submittedIdentifier };
        }
    }
    var password = authDetails.password;
    var prevResults = {};
    return new Promise(function (resolve, reject) {
        UserSchema_1.User
            .findOne(identifierQuery).exec()
            .then(function (user) {
            if (user === null) {
                resolve({
                    success: false, status: 200,
                    message: "Incorrect username/email and/or password"
                });
                return;
            }
            else {
                prevResults.user = user;
                return getHash(password, user.salt);
            }
        })
            .then(function (computedHash) {
            var thereIsAMatch = true;
            var hashOnFile = prevResults.user.hash;
            for (var i = 0; i < computedHash.length; i++) {
                if (computedHash[i] !== hashOnFile[i]) {
                    thereIsAMatch = false;
                    break;
                }
            }
            if (thereIsAMatch) {
                return provideSessionToken(prevResults.user);
            }
            else {
                resolve({
                    success: false, status: 200,
                    message: "Incorrect username/email and/or password"
                });
            }
        })
            .then(function (sessionConfirmation) { resolve(sessionConfirmation); })
            .catch(function (err) { reject(err); });
    });
}
exports.authenticateUser = authenticateUser;
;
/**
 * @description Provide an authentication endpoint where a session token has
 * been provided. Useful for maintaining persistent logins.
 *
 * @returns {Promise} If `success` is set, `message` will be a token object.
 */
function authenticateByToken(tokenID) {
    return new Promise(function (resolve, reject) {
        Token_1.Token
            .findOne({ token_id: tokenID }).exec()
            .then(function (token) {
            if (token === null) {
                resolve({ status: 200, success: false, message: "Invalid login token" });
            }
            else {
                resolve({ status: 200, success: true, message: token });
            }
        })
            .catch(function (err) { reject(err); });
    });
}
exports.authenticateByToken = authenticateByToken;
;
/**
 * @description Delete a token from the database. Fail silently if no token has
 * the specified ID.
 *
 * @returns {Promise} If `success` is set, `message` will be a confirmation
 * string.
 */
function deleteSessionToken(sessionTokenID) {
    return new Promise(function (resolve, reject) {
        Token_1.Token.findOneAndRemove({ token_id: sessionTokenID }).exec()
            .then(function (_) {
            resolve({ status: 200, success: true, message: "Removed token" });
        })
            .catch(function (err) { reject(err); });
    });
}
exports.deleteSessionToken = deleteSessionToken;
;
/**
 * @description Send a password reset link to `emailAddress`.
 *
 * @returns {Promise} if `success` is set, `message` contains a confirmatory
 * string.
 */
function sendResetLink(emailAddress) {
    var resetPasswordURI = getRandomString(50, LOWER_CASE + DIGITS);
    return new Promise(function (resolve, reject) {
        var _this = this;
        UserSchema_1.User
            .findOne({ reset_password_uri: resetPasswordURI }).exec()
            .then(function (user) { return __awaiter(_this, void 0, void 0, function () {
            var confirmation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(user !== null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, sendResetLink(emailAddress)];
                    case 1:
                        confirmation = _a.sent();
                        resolve(confirmation);
                        return [2 /*return*/];
                    case 2: return [2 /*return*/, UserSchema_1.User.findOne({ email: emailAddress }).exec()];
                }
            });
        }); })
            .then(function (userWithMatchingEmail) {
            if (userWithMatchingEmail === null) {
                resolve({
                    success: true, status: 200,
                    message: "If " + emailAddress + " has an account, we've sent a password reset link"
                });
                return;
            }
            else {
                userWithMatchingEmail.reset_password_uri = resetPasswordURI;
                userWithMatchingEmail.reset_password_timestamp = Date.now();
                return userWithMatchingEmail.save();
            }
        })
            .then(function (savedUser) {
            // Multiline template strings render with unwanted line breaks...
            return Email.sendEmail({
                to: savedUser.email,
                subject: config_1.APP_NAME + " Password Reset",
                text: "To reset your " + config_1.APP_NAME + " password, " +
                    ("click on this link:\n\n" + config_1.BASE_URL) +
                    ("/reset-password-link/" + resetPasswordURI) +
                    "\n\nThe link is only valid for 2 hours. If you did not " +
                    "request a password reset, please ignore this email."
            });
        })
            .then(function (_) {
            resolve({
                success: true, status: 200,
                message: "If " + emailAddress + " has an account, we've sent a password reset link"
            });
        })
            .catch(function (err) { reject(err); });
    });
}
exports.sendResetLink = sendResetLink;
;
/**
 * @description Should the user be able to reset their password, given a visit
 * to `resetPasswordURI`?
 *
 * @returns {Promise} Is `success` is set, `message` contains a confirmation.
 */
function validatePasswordResetLink(resetPasswordURI) {
    return new Promise(function (resolve, reject) {
        UserSchema_1.User
            .findOne({ reset_password_uri: resetPasswordURI }).exec()
            .then(function (user) {
            if (user === null) {
                resolve({
                    success: false, status: 404, message: "Page Not Found"
                });
            }
            else if (Date.now() > user.reset_password_timestamp + 2 * 3600 * 1000) {
                resolve({
                    success: false, status: 200, redirect_url: config_1.BASE_URL + "/reset-password",
                    message: "Expired link. Please submit another reset request."
                });
            }
            else {
                resolve({
                    success: true, status: 200, message: "Please submit a new password"
                });
            }
        })
            .catch(function (err) { reject(err); });
    });
}
exports.validatePasswordResetLink = validatePasswordResetLink;
;
/**
 * @description Reset the user's password. We also invalidate all previously
 * issued session tokens so that the user has to provide their new password
 * before logging into any session.
 *
 * @returns {Promise} If `success` is set, `message` is a confirmation string.
 */
function resetPassword(resetRequest) {
    var prevResults;
    return new Promise(function (resolve, reject) {
        UserSchema_1.User
            .findOne({ reset_password_uri: resetRequest.reset_password_uri }).exec()
            .then(function (user) {
            if (user === null) {
                resolve({ success: false, status: 404, message: "Page Not Found" });
                return;
            }
            else {
                prevResults.user = user;
                return getSaltAndHash(resetRequest.password);
            }
        })
            .then(function (_a) {
            var salt = _a[0], hash = _a[1];
            var user = prevResults.user;
            user.salt = salt;
            user.hash = hash;
            user.reset_password_timestamp += -3 * 3600 * 1000; // Invalidate link
            return user.save();
        })
            .then(function (savedUser) {
            return Token_1.Token.deleteMany({ userIDInApp: savedUser.userIDInApp }).exec();
        })
            .then(function (_) {
            return Email.sendEmail({
                to: prevResults.user.email,
                subject: config_1.APP_NAME + ": Your Password Has Been Reset",
                text: "Your " + config_1.APP_NAME + " password was reset on " + resetRequest.reset_request_time + ". " +
                    "If this wasn't you, please request another password reset at " +
                    (config_1.BASE_URL + "/reset-password")
            });
        })
            .then(function (emailConfirmation) {
            if (emailConfirmation.success) {
                resolve({
                    success: true, status: 200, redirect_url: "/",
                    message: "Password successfully reset. Log in with your new password."
                });
            }
            else {
                resolve(emailConfirmation);
            }
        })
            .catch(function (err) { reject(err); });
    });
}
exports.resetPassword = resetPassword;
;
/**
 * @description Fetch the User object as represented in the database.
 *
 * @returns {Promise} If `success` is set, `message` will contain the `user`
 * object.
 */
function getAccountDetails(identifierQuery) {
    return new Promise(function (resolve, reject) {
        UserSchema_1.User
            .findOne(identifierQuery)
            .select("-salt -hash")
            .exec()
            .then(function (user) {
            resolve({ success: true, status: 200, message: user });
        })
            .catch(function (err) { reject(err); });
    });
}
exports.getAccountDetails = getAccountDetails;
/**
 * @description Permanently delete a user's account and all related cards.
 *
 * @returns {Promise} If `success` is set, `message` contains a confirmation
 * string.
 */
function deleteAccount(userIDInApp) {
    return new Promise(function (resolve, reject) {
        UserSchema_1.User
            .deleteMany({ userIDInApp: userIDInApp }).exec()
            .then(function (_) {
            return Token_1.Token.deleteMany({ userIDInApp: userIDInApp }).exec();
        })
            .then(function (_) {
            return MetadataCardSchema_1.Metadata.deleteMany({ createdById: userIDInApp }).exec();
        })
            .then(function (_) {
            return CardSchema_1.Card.deleteMany({ createdById: userIDInApp }).exec();
        })
            .then(function (_) {
            resolve({
                success: true, status: 200,
                message: "Account successfully deleted. Sayonara!"
            });
        })
            .catch(function (err) { reject(err); });
    });
}
exports.deleteAccount = deleteAccount;
;
/**
 * @description Delete all existing users from the database. This function only
 * works when `config.NODE_ENV == 'development'`
 *
 * @param {Array} usernamesToSpare A list of usernames whose accounts shouldn't
 * be deleted. By default, the global public user is not deleted.
 *
 * @returns {Promise} resolves with the number of accounts that were deleted.
 */
function deleteAllAccounts(usernamesToSpare) {
    if (usernamesToSpare === void 0) { usernamesToSpare = [config_1.PUBLIC_USER_USERNAME]; }
    if (config_1.NODE_ENV !== "development") {
        return Promise.reject(new Error("Deleting all accounts isn't allowed in the " + config_1.NODE_ENV + " environment"));
    }
    return new Promise(function (resolve, reject) {
        var _this = this;
        UserSchema_1.User
            .find({ username: { $nin: usernamesToSpare } }).exec()
            .then(function (existingUsers) { return __awaiter(_this, void 0, void 0, function () {
            var numAccountsDeleted, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        numAccountsDeleted = 0;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < existingUsers.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, deleteAccount(existingUsers[i].userIDInApp)];
                    case 2:
                        _a.sent();
                        numAccountsDeleted += 1;
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        resolve(numAccountsDeleted);
                        return [2 /*return*/];
                }
            });
        }); })
            .catch(function (err) { reject(err); });
    });
}
exports.deleteAllAccounts = deleteAllAccounts;
;
//# sourceMappingURL=LogInUtilities.js.map