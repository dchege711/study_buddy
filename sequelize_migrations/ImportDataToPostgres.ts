/**
 * @description Migrate the data from the existing MongoDB database to Postgres.
 * The objective is for users to not notice the change, save for being logged
 * out of their current sessions.
 * 
 * `$ npx ts-node ImportDataToPostgres.ts`
 */

import { MongoClient, Db } from "mongodb";

import {
    User, INewFlashCard, FlashCard
} from "../src/models/db/DBModels";
import * as FlashCardsModel from "../src/models/FlashCardModel";

interface MongoUser {
    "_id": string,
    "salt": number[],
    "hash": number[],
    "username": string,
    "userIDInApp": number,
    "email": string,
    "createdAt": Date,
    "updatedAt": Date,
    "__v": number,
    "reset_password_timestamp": number,
    "reset_password_uri": string,
    "account_is_valid": boolean,
    "account_validation_uri": string,
    "cardsAreByDefaultPrivate": boolean,
    "dailyTarget": number
};

interface MongoCard {
    "_id": string,
    "title": string,
    "description": string,
    /** Space delimited */
    "tags": string,
    "urgency": number,
    "createdById": number,
    "lastReviewed": Date,
    "createdAt": Date,
    "updatedAt": Date,
    "__v": number,
    "descriptionHTML": string,
    "isPublic": boolean,
    "metadataIndex": number,
    "numChildren": number,
    "numTimesMarkedAsDuplicate": number,
    "numTimesMarkedForReview": number,
    "parent": string,
}

interface MongoMetadata {
    "_id": string,
    "node_information": any[],
    /** A single item array, keyed by card ID and timestamp of deletion */
    "trashed_cards": {[s: string]: number}[],
    "stats": any[],
    "createdById": number,
    "metadataIndex": number,
    "createdAt": Date,
    "updatedAt": Date,
    "__v": number,
    "streak": {
        "timeStamp": number,
        "cardIDs": string[],
        "length": number,
        "dailyTarget": number,
    }
}

/** 
 * A mapping from user IDs used in MongoDB to the newly generated user IDs for
 * Postgres.
 */
let oldUserIdToNewId: {[n: number] : string} = {};

let oldCardIdToNewCardId: {[s: string]: string} = {};

let oldParentToOldChildren: {[s: string]: string[]} = {};

async function transferUser(mongoUser: MongoUser): Promise<string> {
    try {
        let preExistingUser = await User.findOne({where: {userName: mongoUser.username}});
        if (preExistingUser) {
            console.log(`Found ${preExistingUser.userName} already in the db`);
            return preExistingUser.id;
        }

        let user = await User.create({
            userName: mongoUser.username,
            emailAddress: mongoUser.email,
            hasValidatedAccount: mongoUser.account_is_valid,
            createdAt: mongoUser.createdAt,
            updatedAt: mongoUser.updatedAt,
        });
        let authData = await user.createUserAuthenticationData({
            passwordSalt: mongoUser.salt,
            passwordHash: mongoUser.hash,
        });
        let userPrefs = await user.createUserPreferences({
            cardsAreByDefaultPrivate: mongoUser.cardsAreByDefaultPrivate,
            dailyTarget: mongoUser.dailyTarget,
        });
        console.log(`Created <${user.userName}>: prefs - ${userPrefs.id}, auth - ${authData.id}`);
        return user.id;
    } catch (err) {
        console.error(err);
    }
}

function transferUsers(db: Db) {
    db.collection("study_buddy_users")
        .find()
        .forEach(
            async function(user: MongoUser) {
                try {
                    oldUserIdToNewId[user.userIDInApp] = await transferUser(user);
                } catch (err) {
                    console.error(err);
                }
            }, function(err) {
                console.error(err);
            }
        );
}

function transferFlashCards(db: Db) {
    let cardsCollection = db.collection("c13u_study_buddy");

    cardsCollection
        .find({})
        .forEach(
            async function(oldCard: MongoCard) {
                try {
                    let newCard: {[s: string]: any} = {
                        ownerId: oldUserIdToNewId[oldCard.createdById],
                        title: oldCard.title,
                        rawDescription: oldCard.description,
                        urgency: oldCard.urgency,
                        isPublic: oldCard.isPublic,
                        tags: oldCard.tags.split(/\s+/),
                        numTimesFlaggedAsDuplicate: oldCard.numTimesMarkedAsDuplicate,
                        numTimesFlaggedForReview: oldCard.numTimesMarkedForReview,
                        createdAt: oldCard.createdAt,
                        updatedAt: oldCard.updatedAt,
                        trashedTimestamp: null
                    };
                    let card: FlashCard = await (
                        await FlashCardsModel.create(<INewFlashCard>newCard)).message;

                    console.info(`Imported card: ${card.title}`);
                    
                    oldCardIdToNewCardId[oldCard._id] = card.id;
                    if (oldCard.parent) {
                        if (!oldParentToOldChildren[oldCard.parent]) {
                            oldParentToOldChildren[oldCard.parent] = [];
                        }
                        oldParentToOldChildren[oldCard.parent].push(oldCard._id);
                    }
                    
                } catch (err) {
                    console.error(err);
                }
            }, function(err) {
                console.error(err);
            }
        );

    Object.keys(oldParentToOldChildren).forEach(async (oldParentId) => {
        try {
            let parent = await FlashCard.findByPk(oldCardIdToNewCardId[oldParentId]);
            let newChildrenIDs: string[] = [];
            oldParentToOldChildren[oldParentId].forEach((oldChildId) => {
                newChildrenIDs.push(oldCardIdToNewCardId[oldChildId]);
            });
            await parent.addChildren(newChildrenIDs);
            let children = await parent.getChildren();
            console.info(`Imported ${children.length} children for '${parent.title}'`);
        } catch (err) {
            console.error(err);
        }
    });

}

async function markCardsAsTrashed(oldCardIdToTrashTimestamp: {[s: string]: number}) {
    try {
        let oldTrashedCardIds = Object.keys(oldCardIdToTrashTimestamp);
        for (let i = 0; i < oldTrashedCardIds.length; i++) {
            let card = await FlashCard.findByPk(oldCardIdToNewCardId[oldTrashedCardIds[i]]);
            card.trashedTimestamp = new Date(oldCardIdToTrashTimestamp[oldTrashedCardIds[i]]);
            await card.save();
            console.info(`Card [${card.title}] was trashed on ${card.trashedTimestamp}`);
        }
    } catch (err) {
        console.error(err);
    }
}

async function transferStreak(metadata: MongoMetadata) {
    try {
        let cardIdsInStreak: string[] = [];
        metadata.streak.cardIDs.forEach((oldCardId) => {
            cardIdsInStreak.push(oldCardIdToNewCardId[oldCardId]);
        });
        // let cardsInStreak =  await FlashCard.findAll({
        //     where: { id: { in: cardIdsInStreak } } });
        
        let user = await User.findByPk(oldUserIdToNewId[metadata.createdById]);
        let streak = await user.createReviewStreak({
            lastResetTimestamp: new Date(metadata.streak.timeStamp),
            streakLength: metadata.streak.length,
        });

        await streak.addFlashCards(cardIdsInStreak);
        let cardsInStreak = await streak.getFlashCards();
        console.info(`[${user.userName}] has a ${streak.streakLength} day streak with ${cardsInStreak.length} cards`);
    } catch (err) {
        console.error(err);
    }
}

function transferMetadata(db: Db) {
    db.collection("c13u_study_buddy_metadata")
        .find()
        .forEach(
            async function(metadata: MongoMetadata) {
                try {
                    if (metadata.trashed_cards) {
                        markCardsAsTrashed(metadata.trashed_cards[0]);
                    }
                    transferStreak(metadata);
                } catch (err) {
                    console.error(err);
                }
            }, function(err) {
                console.error(err);
            }
        );
}

function importData(db: Db) {
    transferUsers(db);
    transferFlashCards(db);
    transferMetadata(db);
}

async function main(dbURI: string) {
    const client = new MongoClient(dbURI);
    try {
        await client.connect();
        const db = client.db(); // Defaults to the db in the connection string
        importData(db);
    } catch (err) {
        console.error(err);
    }
    client.close();
}

if (require.main === module) {
    if (process.argv.length !== 3) {
        // `$ npx ts-node file.ts` resolves to `$ node_modules/.bin/ts-node file.ts` 
        console.error("Usage: npx ts-node ImportDataToPostgres.ts <mongo-uri>");
        process.exit(1);
    }
    const mongoURI = process.argv[2];
    main(mongoURI);
}
