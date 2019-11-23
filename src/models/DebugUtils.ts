import { dbConnection, closeMongooseConnection } from "./MongooseClient"; 

import * as LoginUtils from "./LogInUtilities";
import { getRandomCards } from "./SampleCardsUtils";
import { 
    PUBLIC_USER_USERNAME, PUBLIC_USER_EMAIL, 
    DEBUG_USERNAME, DEBUG_PASSWORD, DEBUG_EMAIL_ADDRESS
} from "../config";
import { getRandomString } from "./Utils";
import { UserAuthenticationToken, User, INewFlashCard } from "./DBModels";
import { createMany as createManyCards } from "./FlashCardModel";
import { IBaseMessage } from "../controllers/ControllerUtilities";

const DEBUG_ACCOUNT_DETAILS = {
    userName: DEBUG_USERNAME, password: DEBUG_PASSWORD,
    emailAddress: DEBUG_EMAIL_ADDRESS
};

/** 
 * @description Create a debug account. If the account existed, it gets
 * overwritten.
 * 
 * @param overwrite If the account exists, should it be overwritten?
 * 
 * @returns Resolves with the debug user's account.
 */
function getDebugAccount(overwrite=true): Promise<User> {

    return new Promise(function(resolve, reject) {
        User
            .findOne({where: {emailAddress: DEBUG_ACCOUNT_DETAILS.emailAddress}})
            .then((user: User) => {
                if (user && !overwrite) {
                    resolve(user); return;
                }
                return LoginUtils.deleteAccount({
                    emailAddress: DEBUG_ACCOUNT_DETAILS.emailAddress
                });
            })
            .then((_: IBaseMessage) => {
                return LoginUtils.registerUser(DEBUG_ACCOUNT_DETAILS);
            })
            .then((_: IBaseMessage) => {
                resolve(
                    User.findOne({
                        where: {emailAddress: DEBUG_ACCOUNT_DETAILS.emailAddress}
                    })
                );
            })
            .catch((err: Error) => { reject(err); });
    });
}

/**
 * @description Create a new debug account and authenticate them.
 * 
 * @returns Resolves with a session token that can be used to log in.
 */
export function getAuthTokenForDebugUser(): Promise<UserAuthenticationToken> {

    return new Promise(function(resolve, reject) {
        getDebugAccount(true)
            .then((_) => {
                return LoginUtils.authenticateUser({
                    userNameOrEmailAddress: DEBUG_ACCOUNT_DETAILS.emailAddress,
                    password: DEBUG_ACCOUNT_DETAILS.password
                })
            })
            .then((confirmation) => { 
                if (confirmation.success) resolve(confirmation.message);
                else reject(new Error(confirmation.message)); 
            })
            .catch((err) => { reject(err); });
    });
};

/**
 * @description Populates the debug account with `numCards` cards.
 */
export function populateDebugAccount(numCards=20): Promise<User> {
    return new Promise(function(resolve, reject) {
        getDebugAccount(false)
            .then(async (user) => {
                let cards = getRandomCards(numCards);
                for (let i = 0; i < cards.length; i++) {
                    let card = cards[i];
                    card.ownerId = user.id;
                    if (i % 3 == 0) {
                        card.isPublic = false;
                    } else {
                        card.isPublic = true;
                    }
                    console.log(`Card ${i + 1}/${cards.length}: ${card.title}`);
                }
                await createManyCards(<INewFlashCard[]>cards);
                console.log(`All cards saved to the database`);
                resolve(user);
            })
            .catch((err: Error) => { reject(err); });
    }); 
}

if (require.main === module) {
    let numCards = 15;
    populateDebugAccount(numCards)
        .then((user) => { 
            console.log(
                `Populated ${user.userName}'s account with ${numCards} cards`
            );
        })
        .catch((err) => { console.error(err); });
}

