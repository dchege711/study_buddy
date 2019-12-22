/**
 * A collection of functions that are useful for managing user state within the 
 * app.
 * 
 * @module
 */

import * as fs from "fs";
import { Op } from "sequelize";

import { 
    User, UserAuthenticationToken, ACCOUNT_VALIDATION_TOKEN_TYPE, INewFlashCard, UserAuthenticationData, SESSION_TOKEN_TYPE, PASSWORD_RESET_TOKEN_TYPE, UserPrefences, ReviewStreak, FlashCard 
} from "./db/DBModels";
import { createMany as createManyCards, read as readCards } from "./FlashCardModel";
import * as Email from "./EmailClient";
import { APP_NAME, BASE_URL } from "../config";
import { IBaseMessage } from "../controllers/ControllerUtilities";
import { STARTER_CARDS } from "./SampleCardsUtils"
import { 
    LOWER_CASE, DIGITS, getSaltAndHash, getHash, getRandomString 
} from "./Utils"
import { sanitizeQuery, ISearchQuery, IClientFacingFlashCard } from "./SanitizationAndValidation";

/**
 * @description Clean up resources, e.g. the email client
 */
export function close(): Promise<void> {
    return new Promise(function(resolve, reject) {
        Email.close();
        resolve();
    })
};

/**
 * @description Send a validation URL to the email address associated with the
 * `user`. This method generates the validation URL too. However, it doesn't
 * check nor modify the value of `user.hasValidatedAccount`
 * 
 * @param {Promise} resolves with a JSON object having the keys `success`, 
 * `message`, `status`.
 */
function sendAccountValidationURLToEmail(user: User): Promise<IBaseMessage> {

    return new Promise(function(resolve, reject) {
        let validationURI: string;
        UserAuthenticationToken
            .create({ tokenType: ACCOUNT_VALIDATION_TOKEN_TYPE})
            .then((token: UserAuthenticationToken) => {
                validationURI = token.tokenValue;
                return token.setUser(user);
            })
            .then((_: any) => {
                return Email.sendEmail({
                    to: user.emailAddress,
                    subject: `Please Validate Your ${APP_NAME} Account`,
                    text: `Welcome to ${APP_NAME}! Before you can log in, please click ` +
                          `on this link to validate your account.\n\n` + 
                          `${BASE_URL}/verify-account/${validationURI}` +
                          `\n\nAgain, glad to have you onboard!`
                });
            })
            .then((emailConfirmation: IBaseMessage) => {
                if (emailConfirmation.success) {
                    resolve({
                        success: true, status: 200,
                        message: `If ${user.emailAddress} has an account, we've sent a validation URL`
                    });
                } else {
                    reject(new Error(`${emailConfirmation.message}`));
                }
            })
            .catch((err: Error) => { reject(err); });
    });
};

/**
 * @description Send an account validation link to `emailAddress`. The email is
 * sent if two conditions hold:
 * 1. `emailAddress` is associated with an existing account.
 * 2. The associated account hasn't validated their account.
 * 
 * @returns {Promise} If `success` is set, `message` holds a confirmation string.
 */
export function sendAccountValidationLink(emailAddress: string): 
    Promise<IBaseMessage> {
    return new Promise(function(resolve, reject) {
        User
            .findOne({where: {emailAddress: emailAddress}})
            .then(async (user: User) => {
                if (!user) {
                    resolve({
                        success: true, status: 200,
                        message: `If ${emailAddress} has an account, we've sent a validation URL`
                    });
                    return;
                } else if (!user.hasValidatedAccount) {
                    return sendAccountValidationURLToEmail(user);
                } else {
                    resolve({
                        success: true, status: 200,
                        message: `${emailAddress} has already validated their account.`
                    });
                    return;
                }
            })
            .then((emailConfirmation: IBaseMessage) => {
                resolve(emailConfirmation);
            })
            .catch((err: Error) => { reject(err); });
    });
};

/**
 * @description Once an account is registered, the user needs to click on a 
 * validation link sent to the submitted email. 
 * 
 * Note: ~~The user cannot log into the app before the email address is verified.~~ 
 * We observed a high bounce rate AND few signups, so we'll allow accounts with
 * unvalidated email addresses to sign in for at most 30 days. This is not a new
 * practice, Reddit does it too.
 * 
 * @returns {Promise} If `success` is set, `message` will be a confirmation
 * string. There will also be a `redirect_url` attribute in the `IBaseMessage`.
 */
export function validateAccount(validationURI: string): Promise<IBaseMessage> {
    return new Promise(function(resolve, reject) {
        UserAuthenticationToken
            .findOne({
                where: {
                    tokenType: ACCOUNT_VALIDATION_TOKEN_TYPE,
                    tokenValue: validationURI
                }
            })
            .then(async (token: UserAuthenticationToken) => {
                // If no token is found, communicate that to the user
                if (!token) {
                    /** @todo: This literal URLs will kill me one day */
                    resolve({
                        success: false, status: 303, redirectURL: `/send-validation-email`,
                        message: `The validation URL is either incorrect or stale. Please request for a new one from ${BASE_URL}/send-validation-email`
                    });
                    return;
                }

                // We found a token; validate the user's account
                try {
                    let user: User = await token.getUser();
                    user.hasValidatedAccount = true;
                    await user.save();
                    await token.destroy();
                    resolve({
                        success: true, status: 303, redirectURL: `/login`,
                        message: `Successfully validated ${user.emailAddress}. Redirecting you to login`
                    });
                    return;
                } catch (err) {
                    console.error(err);
                    reject(err);
                }
            })
            .catch((err: Error) => {
                reject(err);
            });
    });
};

/**
 * @description Register a new user using the provided `password`, `userName`
 * and `emailAddress`.
 * - If the userName is taken, we let the user know that.
 * - If the email address is already taken, send an email to that address 
 *   notifying them of the signup.
 * - If the input is invalid, e.g. a non alphanumeric userName, raise an error 
 *   since it should have been caught on the client side.
 * - Otherwise, register the user and send them a validation link.
 * 
 * @returns {Promise} If `success` is set, `message` contains a string that
 * tells the user that account creation was successful.
 */
export function registerUser(
    registrationDetails: {userName: string, password: string, emailAddress: string}): 
    Promise<IBaseMessage> {
    
    return new Promise(function(resolve, reject) {
        let userName = registrationDetails.userName;
        let password = registrationDetails.password;
        let emailAddress = registrationDetails.emailAddress;

        if (!userName || !password || !emailAddress) {
            resolve({
                success: false, status: 200,
                message: "At least one of these wasn't provided: userName, password, email"
            });
            return;
        }

        User
            // Check if there's any existing user with the same login...
            .findOne({
                where: { 
                    [Op.or]: [
                        {emailAddress: emailAddress}, 
                        {userName: userName}
                    ] 
                }
            })
            // Only create a new account if there are no clashing logins
            .then((existingUser: User | null) => {
                if (existingUser) {
                    resolve({
                        success: false, status: 200,
                        message: existingUser.userName === userName ? 
                                "Username already taken.": "Email already taken."
                    });
                    return;
                }
                return User.create({
                    userName: userName, emailAddress: emailAddress, 
                    hasValidatedAccount: false
                });
            })
            // Configure the user profile with the appropriate table entries
            .then(async (savedUser: User) => {
                try {
                    // - Save the salt and hash to enable logging in
                    let saltAndHash = await getSaltAndHash(password);
                    await savedUser.createUserAuthenticationData({
                        passwordSalt: saltAndHash[0], 
                        passwordHash: saltAndHash[1]
                    });

                    // - Set an account validation URI
                    await sendAccountValidationURLToEmail(savedUser);

                    // - Create a preferences object for the user
                    await savedUser.createUserPreferences({
                        cardsAreByDefaultPrivate: true, dailyTarget: 10
                    });

                    // - Set a streak object to track card reviews
                    await savedUser.createReviewStreak({
                        lastResetTimestamp: Date.now(),
                        streakLength: 0
                    });

                    // Create tutorial cards for the user
                    let starterCards: INewFlashCard[] = [];
                    STARTER_CARDS.forEach((card) => {
                        card.ownerId = savedUser.id;
                        starterCards.push(<INewFlashCard>card);
                    })
                    await createManyCards(starterCards);

                    // Finally, pass the good news to the user
                    resolve({
                        success: true, status: 200,
                        message: `Welcome to ${APP_NAME}! We've also sent a validation URL to ${savedUser.emailAddress}. Please validate your account within 30 days.`
                    });
                } catch (err) {
                    reject(err);
                }
            })
            .catch((err: Error) => {
                reject(err);
            });
    });
};

/**
 * @description Authenticate a user that is trying to log in. When a user 
 * successfully logs in, we set a token that will be sent on all subsequent 
 * requests. Logging in should be as painless as possible. Since the userNames 
 * only contain `[_\-A-Za-z0-9]+`, we can infer whether the submitted string 
 * was an email address or a userName, and authenticate accordingly. If the 
 * userName/email/password is incorrect, we send a generic 
 * `Invalid username/email or password` message without disclosing which is 
 * incorrect. It's possible to enumerate userNames, so this is not entirely 
 * foolproof.
 * 
 * @returns {Promise} If `success` is set, `message` will have a session token.
 */
export function authenticateUser(
    authDetails: {userNameOrEmailAddress: string, password: string}): Promise<IBaseMessage> {

    let identifierQuery: {[s: string]: string};
    let submittedIdentifier = authDetails.userNameOrEmailAddress;
    if (submittedIdentifier === undefined) {
        identifierQuery = { path_that_doesnt_exist: "invalid@userName!@" };
    } else {
        if (submittedIdentifier.includes("@")) {
            identifierQuery = { emailAddress: submittedIdentifier };
        } else {
            identifierQuery = { userName: submittedIdentifier };
        }
    }
    let password = authDetails.password;

    return new Promise(function(resolve, reject) {
        User
            .findOne({where: identifierQuery})
            .then(async (user: User) => {
                if (!user) {
                    resolve({
                        success: false, status: 200, 
                        message: "Incorrect userName/email and/or password"
                    });
                    return;
                }

                try {
                    let authData = await user.getUserAuthenticationData();
                    let computedHash = await getHash(password, authData.passwordSalt);
                    let hashOnFile = authData.passwordHash;
                    for (let i = 0; i < computedHash.length; i++) {
                        if (computedHash[i] !== hashOnFile[i]) {
                            resolve({
                                success: false, status: 200, 
                                message: "Incorrect userName/email and/or password"
                            });
                            return;
                        }
                    }
                    let sessionToken: UserAuthenticationToken = await 
                        UserAuthenticationToken.create({
                            tokenType: SESSION_TOKEN_TYPE
                    });
                    await sessionToken.setUser(user);
                    resolve({
                        success: true, status: 200, message: sessionToken
                    });
                } catch (err) {
                    reject(err);
                }
            })
            .catch((err: Error) => { reject(err); });
    });
};

/**
 * @description Provide an authentication endpoint where a session token has 
 * been provided. Useful for maintaining persistent logins.
 *
 * @returns {Promise} If `success` is set, `message` will be a token object.
 */
export function authenticateByToken(tokenValue: string): Promise<IBaseMessage> {
    return new Promise(function(resolve, reject) {
        UserAuthenticationToken
            .findOne({
                where: {tokenType: SESSION_TOKEN_TYPE, tokenValue: tokenValue}
            })
            .then((token: UserAuthenticationToken) => {
                if (token === null) {
                    resolve({status: 200, success: false, message: "Invalid login token"});
                } else {
                    resolve({status: 200, success: true, message: token});
                }
            })
            .catch((err: Error) => { reject(err); });
    });
};

/**
 * @description Delete a token from the database. Fail silently if no token has 
 * the specified ID.
 * 
 * @returns {Promise} If `success` is set, `message` will be a confirmation 
 * string.
 */
export function deleteSessionToken(tokenValue: string): Promise<IBaseMessage> {
    return new Promise(function(resolve, reject) {
        UserAuthenticationToken
            .destroy({
                where: {tokenValue: tokenValue, tokenType: SESSION_TOKEN_TYPE}
            })
            .then((_: any) => {
                resolve({status: 200, success: true, message: "Removed token"});
            })
            .catch((err: Error) => { reject(err); });
    });
    
};

/**
 * @description Send a password reset link to `emailAddress`.
 * 
 * @returns {Promise} If `success` is set, `message` contains a confirmatory 
 * string.
 */
export function sendResetLink(emailAddress: string): Promise<IBaseMessage> {
    
    let resetPasswordURI = getRandomString(50, LOWER_CASE + DIGITS);
    return new Promise(function(resolve, reject) {
        User
            .findOne({where: {emailAddress: emailAddress}})
            .then(async (user: User) => {
                if (!user) {
                    // Do not disclose that no user has that email address.
                    resolve({
                        success: true, status: 200,
                        message: `If ${emailAddress} has an account, we've sent a password reset link`
                    });
                    return;
                }
                try {
                    let passwordResetToken: UserAuthenticationToken = await 
                        UserAuthenticationToken.create({
                            tokenType: PASSWORD_RESET_TOKEN_TYPE
                    });
                    await passwordResetToken.setUser(user);
                    // Multiline template strings render with unwanted line breaks...
                    return Email.sendEmail({
                        to: user.emailAddress,
                        subject: `[${APP_NAME}] Password Reset`,
                        text: `To reset your ${APP_NAME} password, ` + 
                            `click on this link:\n\n${BASE_URL}` + 
                            `/reset-password-link/${resetPasswordURI}` + 
                            `\n\nThe link is only valid for 2 hours. If you did not ` +
                            `request a password reset, please ignore this email.`
                    });
                } catch (err) {
                    console.error(err); reject(err);
                }
            })
            .then((_: Email.IEmailConfirmation) => {
                resolve({
                    success: true, status: 200,
                    message: `If ${emailAddress} has an account, we've sent a password reset link`
                });
            })
            .catch((err: Error) => { reject(err); });
    });
};

/**
 * @description Should the user be able to reset their password, given a visit 
 * to `resetPasswordURI`?
 * 
 * @returns {Promise} Is `success` is set, `message` contains a confirmation.
 */
export function validatePasswordResetLink(resetPasswordURI: string): 
    Promise<IBaseMessage> {
    return new Promise(function(resolve, reject) {
        UserAuthenticationToken
            .findOne({
                where: {
                    tokenValue: resetPasswordURI, 
                    tokenType: PASSWORD_RESET_TOKEN_TYPE
                }
            })
            .then((token: UserAuthenticationToken) => {
                if (!token) {
                    resolve({
                        success: false, status: 404, message: "Page Not Found"
                    });
                } else if (Date.now() > token.createdAt.getMilliseconds() + (2 * 3600 * 1000)) {
                    // Password reset tokens expire after 2 hours.
                    resolve({ 
                        success: false, status: 302, redirectURL: `${BASE_URL}/reset-password`, 
                        message: "Expired link. Please submit another reset request." 
                    });
                } else {
                    resolve({
                        success: true, status: 200, 
                        message: "Please submit a new password"
                    });
                }
            })
            .catch((err: Error) => { reject(err); });
    });
};

/**
 * @description Reset the user's password. We also invalidate all previously 
 * issued session tokens so that the user has to provide their new password 
 * before logging into any session.
 * 
 * @returns {Promise} If `success` is set, `message` is a confirmation string.
 */
export function resetPassword(
    resetRequest: {resetPasswordURI: string, password: string, timeOfRequest: string}): 
    Promise<IBaseMessage> {
    return new Promise(function(resolve, reject) {
        UserAuthenticationToken
            .findOne({
                where: {
                    tokenValue: resetRequest.resetPasswordURI,
                    tokenType: PASSWORD_RESET_TOKEN_TYPE
                }
            })
            .then(async (token: UserAuthenticationToken) => {
                if (!token) {
                    resolve({
                        success: false, status: 404, message: "Page Not Found"
                    });
                    return;
                }
                try {
                    let user: User = await token.getUser();

                    // Reset the user's password
                    let saltAndHash = await getSaltAndHash(resetRequest.password);
                    await user.createUserAuthenticationData({
                        passwordSalt: saltAndHash[0], 
                        passwordHash: saltAndHash[1]
                    });

                    // Invalidate the password reset token
                    await token.destroy();

                    // Invalidate login tokens
                    await UserAuthenticationToken.destroy({
                        where: {userId: user.id, tokenType: SESSION_TOKEN_TYPE}
                    });

                    return Email.sendEmail({
                        to: user.emailAddress,
                        subject: `[${APP_NAME}] Your Password Has Been Reset`,
                        text: `Your ${APP_NAME} password was reset on ${resetRequest.timeOfRequest}. ` +
                            `If this wasn't you, please request another password reset at ` +
                            `${BASE_URL}/reset-password`
                    });
                } catch (err) {
                    console.error(err); reject(err);
                }
            })
            .then((emailConfirmation: Email.IEmailConfirmation) => {
                if (emailConfirmation.success) {
                    resolve({
                        success: true, status: 200, redirectURL: "/",
                        message: `Password successfully reset. Log in with your new password.`
                    });
                } else {
                    console.error(emailConfirmation);
                    resolve({
                        success: false, status: 500,
                        message: `Internal Server Error`
                    });
                }
            })
            .catch((err: Error) => { reject(err); });

    });
};

/**
 * @description Update the preferences of the user whose id is `userId`
 * @todo Try to crash this method by providing invalid values.
 * @param userId The ID of the user whose preferences will be updated
 * @param newPrefs The new preferences
 */
export function updateUserPreferences(
        userId: string, newPrefs: Partial<UserPrefences>): Promise<IBaseMessage> {
    newPrefs = sanitizeQuery(<ISearchQuery>newPrefs);
    userId = sanitizeQuery({userId: userId}).userId;
    return new Promise(function(resolve, reject) {
        UserPrefences
            .findOne({where: {userId: userId}})
            .then((prefs: UserPrefences) => {
                if (newPrefs.cardsAreByDefaultPrivate !== undefined) {
                    prefs.cardsAreByDefaultPrivate = newPrefs.cardsAreByDefaultPrivate
                }
                if (newPrefs.dailyTarget) {
                    prefs.dailyTarget = newPrefs.dailyTarget;
                }
                return newPrefs.save();
            })
            .then((updatedPrefs: UserPrefences) => {
                resolve({
                    success: true, status: 200, message: updatedPrefs
                });
            })
            .catch((err: Error) => { console.error(err); });
    });
}

/**
 * @description Update the streak for this user. Extend it with the cards in
 * `payload.cardIds`
 * 
 * @todo Do I need to check that `cardIds` are not in `streak.getFlashCards`
 * before calling `streak.addFlashCards(cardIds)`?
 * 
 * @param payload Expected keys: `userId`, `cardIds`
 */
export function updateStreak(payload: Pick<ISearchQuery, "userId" | "cardIds">): 
        Promise<IBaseMessage> {
    payload = sanitizeQuery(payload);
    return new Promise(function(resolve, reject) {
        ReviewStreak
            .findOne({where: {userId: payload.userId}})
            .then(async (streak: ReviewStreak) => {
                if (!streak) {
                    reject({
                        success: false, status: 200, message: "User not found."
                    });
                    return;
                }
                await streak.addFlashCards(payload.cardIds);
                resolve({
                    message: streak, success: true, status: 200
                });
            })
            .catch((err: Error) => { console.error(err); });
    });
}

/**
 * @description Permanently delete a user's account and all related cards.
 * 
 * @returns {Promise} If `success` is set, `message` contains a confirmation 
 * string.
 */
export function deleteAccount(identifier: ISearchQuery): Promise<IBaseMessage> {
    identifier = sanitizeQuery(identifier);
    return new Promise(function(resolve, reject) {
        User
            .destroy({where: identifier})
            .then((_: any) => {
                resolve({
                    success: true, status: 200,
                    message: "Account successfully deleted. Sayonara!"
                })
            })
            .catch((err: Error) => { reject(err); });
    });
};

/**
 * @description Fetch all the user's cards and compile them into a JSON file.
 * 
 * @returns A promise that resolves with two string arguments. The first one is 
 * a path to the written JSON file. The 2nd argument is the name of that JSON file.
 */
export function writeCardsToJSONFile(userId: string): Promise<[string, string]> {
    userId = sanitizeQuery({userId: userId}).userId;
    return new Promise(function(resolve, reject) {
        readCards({ ownerId: userId})
            .then((cardsPayload: IBaseMessage) => {
                let cards: IClientFacingFlashCard[] = cardsPayload.message;
                let jsonFileName = `flashcards_${userId}.json`;
                let jsonFilePath = `${process.cwd()}/${jsonFileName}`;;
                /** Good Lord! What monstrosity did I write back then? */
                fs.open(jsonFilePath, "w", (err: Error, fileDescriptor) => {
                    if (err) { reject(err); } 
                    else {
                        fs.write(fileDescriptor, JSON.stringify(cards), (writeErr) => {
                            if (writeErr) {
                                reject(writeErr);
                            } else {
                                fs.close(fileDescriptor, (closeErr) => {
                                    if (closeErr) {
                                        reject(closeErr);
                                    } else {
                                        resolve([jsonFilePath, jsonFileName]);
                                    }
                                });
                            }
                        });
                    }
                });
            })
            .catch((err: Error) => { reject(err); });
    });       
};

