"use strict";

/**
 * Handle card-related activities, e.g. CRUD operations.
 *
 * @module
 */

const Card = require('./mongoose_models/CardSchema.js');
const MetadataDB = require('./MetadataMongoDB.js');
const sanitizer = require("./SanitizationAndValidation.js");

const cardSanitizer = sanitizer.sanitizeCard;
const querySanitizer = sanitizer.sanitizeQuery;

/**
 * Create a new card and add it to the user's current cards.
 *
 * @param {JSON} payload Expected keys: `title`, `description`, `tags`,
 * `createdById`, `urgency`, `isPublic` and `parent`.
 *
 * @returns {Promise} takes a JSON object with `success`, `status` and `message`
 * as its keys. If successful, the message will contain the saved card.
 */
exports.create = function(payload) {
    return new Promise(function(resolve, reject) {
        let returnedValues = {};
        let sanitizedCard = cardSanitizer(payload);
        Card
            .create(sanitizedCard)
            .then((savedCard) => {
                returnedValues.savedCard = savedCard;
                savedCard.previousTags = savedCard.tags;
                return MetadataDB.update([savedCard]);
            })
            .then((confirmation) => {
                if (confirmation.success) {
                    confirmation.message = returnedValues.savedCard;
                }
                returnedValues.saveConfirmation = confirmation;
                return MetadataDB.updatePublicUserMetadata([returnedValues.savedCard]);
            })
            .then((_) => { resolve(returnedValues.saveConfirmation); })
            .catch((err) => { if (err !== "DUMMY") reject(err); })
    });
};

/**
 * Create multiple cards at once
 *
 * @param {Array} unsavedCards An array of JSON objects keyed by `title`,
 * `description`, `tags`, `createdById`, `urgency`, `isPublic` and `parent`.
 *
 * @returns {Promise} takes a JSON object with `success`, `status` and `message`
 * as its keys. If successful, the message will be an array of the saved cards' IDs
 */
exports.createMany = function(unsavedCards) {
    return new Promise(async function(resolve, reject) {
        let savedCardsIDs = [];
        let saveConfirmation;
        for (let i = 0; i < unsavedCards.length; i++) {
            saveConfirmation = await exports.create(unsavedCards[i]).catch((err) => {
                reject(err);
                return;
            });
            savedCardsIDs.push(saveConfirmation.message._id);
        }
        resolve({
            success: true, status: 200, message: savedCardsIDs
        });
    });
}

/**
 * Read a card(s) from the database.
 *
 * @param {JSON} payload Must contain `userIDInApp` as one of the keys.
 * If `_id` is not one of the keys, fetch all the user's cards.
 *
 * @param {String} projection The fields to return. Defaults to
 * `title description descriptionHTML tags urgency createdById isPublic`
 *
 * @returns {Promise} resolves with a JSON doc with `success`, `status` and
 * `message` as keys. If successful, `message` will be an array of all matching
 * cards.
 */
exports.read = function(payload, projection="title description descriptionHTML tags urgency createdById isPublic") {
    payload = querySanitizer(payload);
    let query = {createdById: payload.userIDInApp};
    if (payload.cardID !== undefined) query._id = payload.cardID;
    return new Promise(function(resolve, reject) {
        Card
            .find(query).select(projection).exec()
            .then((cards) => {
                resolve({
                    success: true, status: 200, message: cards
                });
            })
            .catch((err) => { reject(err); });
    });
};

/**
 * Update an existing card. Some fields of the card are treated as constants,
 * e.g. `createdById` and `createdAt`
 *
 * @param {JSON} cardJSON The parts of the card that have been updated. Must
 * include `cardID` as an attribute, otherwise no changes will be made.
 *
 * @returns {Promise} resolves with a JSON doc with `success`, `status` and
 * `message` as keys. If successful, `message` will be the updated card.
 */
exports.update = function(cardJSON) {

    let prevResults = {};
    const EDITABLE_ATTRIBUTES = new Set([
        "title", "description", "descriptionHTML", "tags", "urgency", "isPublic",
        "numTimesMarkedAsDuplicate", "numTimesMarkedForReview"
    ]);

    let query = querySanitizer({cardID: cardJSON.cardID});
    cardJSON = cardSanitizer(cardJSON);

    // findByIdAndUpdate will give me the old, not the updated, document.
    // I need to find the card, save it, and then call MetadataDB.update if need be

    return new Promise(function(resolve, reject) {
        Card
            .findById(query.cardID).exec()
            .then((existingCard) => {
                if (existingCard === null) {
                    resolve({success: false, status: 200, message: null});
                } else {
                    prevResults.previousTags = existingCard.tags;
                    Object.keys(cardJSON).forEach(cardKey => {
                        if (EDITABLE_ATTRIBUTES.has(cardKey)) {
                            existingCard[cardKey] = cardJSON[cardKey];
                        }
                    });
                    return existingCard.save();
                }
            })
            .then((savedCard) => {
                if (cardJSON.hasOwnProperty("tags") || cardJSON.hasOwnProperty("urgency")) {
                    savedCard.previousTags = prevResults.previousTags;
                    prevResults.savedCard = savedCard;
                    return MetadataDB.update([savedCard]);
                } else {
                    prevResults.savedCard = savedCard;
                    return Promise.resolve("DUMMY");
                }
            })
            .then((_) => {
                return MetadataDB.updatePublicUserMetadata([prevResults.savedCard]);
            })
            .then((_) => {
                resolve({success: true, status: 200, message: prevResults.savedCard});
            })
            .catch((err) => { reject(err); });
    });
};

/**
 * @description Remove this card from the database. We learned that we should
 * [never use a warning when we meant undo]{@link http://alistapart.com/article/neveruseawarning}.
 * Seems like a good design decision. Users who really want to delete a card
 * might be unsatisifed, but I bet they're in the minority(?). Furthermore,
 * they can permanently delete a card from the accounts page. Amazing how much
 * fiddling goes in the backend, just to allow a user to delete and then save
 * themselves 3 seconds later by hitting `Undo`.
 *
 * {@tutorial main.editing_cards}
 *
 * @param {JSON} payload The card to be removed
 * @return {Promise} resolves with a JSON keyed by `success`, `status` and
 * `message` as keys.
 */
exports.delete = function(payload) {
    payload = querySanitizer(payload);
    return new Promise(function(resolve, reject) {
        Card
            .findByIdAndRemove(payload.cardID).exec()
            .then((removedCard) => {
                return MetadataDB.remove(removedCard);
            })
            .then((confirmation) => {
                resolve(confirmation);
            })
            .catch((err) => { reject(err); });
    });
};

/**
 * @description Search for cards with associated key words. Search should be
 * relevant and fast, erring on the side of relevance. Studying the docs helps
 * one make efficient queries and capture some low-hanging fruit. For instance,
 * using `where(some_js_expression)` in MongoDB is expensive because
 * `some_js_expression` will be evaluated for every document in the collection.
 * ~~Using regex inside the query itself is more efficient.~~ MongoDB supports
 * [text search]{@link https://docs.mongodb.com/v3.2/text-search/} and a 'sort
 * by relevance' function.
 *
 * @param {JSON} payload Expected keys: `key_words`, `createdById`
 * @returns {Promise} resolves with a JSON with `success`, `status` and `message`
 * as keys. If successful `message` will contain abbreviated cards that only
 * the `id`, `urgency` and `title` fields.
 */
exports.search = function(payload) {
    /**
     * $expr is faster than $where because it does not execute JavaScript
     * and should be preferred where possible. Note that the JS expression
     * is processed for EACH document in the collection. Yikes!
     */

    payload = querySanitizer(payload);

    if (payload.queryString !== undefined) {
        payload.queryString = splitTags(payload.queryString);
    } else {
        return Promise.resolve({success: true, status: 200, message: []})
    }
    let queryObject = {
        filter: {
            $and: [
                { createdById: payload.userIDInApp },
                { $text: { $search: payload.queryString } }
            ]
        },
        projection: "title tags urgency",
        limit: payload.limit,
        sortCriteria: { score: { $meta: "textScore" } }

    };
    return collectSearchResults(queryObject);
};

/**
 * @description Append a copy of the hyphenated/underscored words in the incoming
 * string without the hyphens/underscores. Useful for pre-processing search
 * queries. A person searching for `dynamic_programming` should be interested in
 * `dynamic programming` as well.
 *
 * @param {String} s a string that may contain hyphenated/underscored words, e.g
 * `arrays dynamic_programming iterative-algorithms`.
 *
 * @returns {String} a string with extra space delimited words, e.g.
 * `arrays dynamic_programming iterative-algorithms dynamic programming iterative algorithms`
 */
let splitTags = function(s) {
    let possibleTags = s.match(/[\w|\d]+(\_|-){1}[\w|\d]+/g);
    if (possibleTags === null) return s;

    for (let i = 0; i < possibleTags.length; i++) {
        s += " " + possibleTags[i].split(/[\_-]/g).join(" ");
    }
    return s;
}

/**
 * @description Search the database for cards matching the specified schema.
 * Return the results to the callback function that was passed in.
 *
 * @returns {Promise} resolves with a JSON object. If `success` is set, then
 * the `message` attribute will be an array of matching cards.
 */
let collectSearchResults = function(queryObject) {
    return new Promise(function(resolve, reject) {
        Card
            .find(queryObject.filter, queryObject.sortCriteria)
            .sort(queryObject.sortCriteria)
            .select(queryObject.projection)
            .limit(queryObject.limit)
            .exec()
            .then((cards) => {
                resolve({success: true, status: 200, message: cards});
            })
            .catch((err) => { reject(err); });
    });
}

/**
 * @description Find cards that satisfy the given criteria and are publicly
 * viewable.
 *
 * @param {JSON} `payload` Supported keys include:
 *  - `userID`: The ID of the creator of the cards
 *  - `cardIDs`: A string of card IDs separated by a `,` without spaces
 *  - `cardID`: The ID of a single card. The same effect can be achieved with `cardIDs`
 *  - `queryString`: The keywords to look for. They are interpreted as tags
 *  - `creationStartDate`: The earliest date by which the cards were created
 *  - `creationEndDate`: The latest date for which the cards were created
 *
 * @returns {Promise} resolves with a JSON object. If `success` is set, then
 * the `message` attribute will be an array of matching cards.
 */
exports.publicSearch = function(payload) {
    payload = querySanitizer(payload);

    let mandatoryFields = [{isPublic: true}];
    if (payload.userID !== undefined) {
        mandatoryFields.push({createdById: payload.userID});
    }

    if (payload.cardIDs && typeof payload.cardIDs === "string") {
        payload.cardIDs = Array.from(payload.cardIDs.split(","));
    }
    if (payload.cardID) payload.cardIDs = [payload.cardID];
    if (payload.cardIDs !== undefined) {
        mandatoryFields.push({ _id: { $in: payload.cardIDs } });
    }
    if (payload.queryString !== undefined) {
        mandatoryFields.push({ $text: { $search: splitTags(payload.queryString) } });
    }
    if (payload.creationStartDate || payload.creationEndDate) {
        let dateQuery = {}
        if (payload.creationStartDate) dateQuery["$gt"] = payload.creationStartDate;
        if (payload.creationEndDate) dateQuery["$lt"] = payload.creationEndDate;
        mandatoryFields.push({createdAt: dateQuery});
    }

    let queryObject = {
        filter: { $and: mandatoryFields },
        projection: "title tags",
        limit: payload.limit,
    };
    return collectSearchResults(queryObject);
}

/**
 * @description Read a card that has been set to 'public'
 * @param {JSON} payload The `card_id` property should be set to a valid ID
 * @returns {Promise} resolves with a JSON object. If `success` is set, then
 * the `message` attribute will contain a single-element array containing the
 * matching card if any.
 */
exports.readPublicCard = function(payload) {
    payload = querySanitizer(payload);
    return new Promise(function(resolve, reject) {
        if (payload.cardID === undefined) {
            resolve([{}]);
        } else {
            Card
                .findOne({isPublic: true, _id: payload.cardID}).exec()
                .then((matchingCard) => {
                    resolve({
                        success: true, status: 200, message: [matchingCard]
                    });
                })
                .catch((err) => { reject(err); });
        }

    });
}

/**
 * @description Create a copy of the referenced card and add it to the user's
 * collection
 *
 * @param {JSON} payload The `cardID` and `userIDInApp` and
 * `cardsAreByDefaultPrivate` attributes should be set appropriately.
 *
 * @returns {Promise} takes a JSON object with `success`, `status` and `message`
 * as its keys. If successful, the message will contain the saved card. This
 * response is the same as that of `CardsMongoDB.create(payload)`.
 */
exports.duplicateCard = function(payload) {
    // Fetch the card to be duplicated
    return new Promise(function(resolve, reject) {
        let queryObject = querySanitizer({ _id: payload.cardID, isPublic: true });
        Card
            .findOne(queryObject).exec()
            .then((preExistingCard) => {
                if (preExistingCard === null) {
                    resolve({
                        success: false, status: 200, message: "Card not found!"
                    });
                    return Promise.reject("DUMMY");
                } else {
                    let idsOfUsersWithCopy = new Set(preExistingCard.idsOfUsersWithCopy.split(", "));
                    idsOfUsersWithCopy.add(payload.userIDInApp);
                    preExistingCard.idsOfUsersWithCopy = Array.from(idsOfUsersWithCopy).join(", ");
                    return preExistingCard.save();
                }
            })
            .then((savedPreExistingCard) => {
                return exports.create({
                    title: savedPreExistingCard.title,
                    description: savedPreExistingCard.description,
                    tags: savedPreExistingCard.tags,
                    parent: savedPreExistingCard._id,
                    createdById: payload.userIDInApp,
                    isPublic: payload.cardsAreByDefaultPrivate
                });
            })
            .then((confirmation) => { resolve(confirmation); })
            .catch((err) => { if (err !== "DUMMY") reject(err); })
    });

};

/**
 * @description With public cards, it's possible that some malicious users may
 * upload objectionable cards. While we don't delete users' cards against their
 * will, we don't have an obligation to help them share such cards. When a card
 * gets flagged as inappropriate, it is excluded from search results in the
 * `/browse` page. We increase the counter of the specified file. This allows
 * moderators to deal with the most flagged cards first.
 *
 * @param {JSON} payload The `cardID` must be set. `markedForReview` and
 * `markedAsDuplicate` are optional. If set, they should be booleans.
 *
 * @returns {Promise} takes a JSON object with `success`, `status` and `message`
 * as its keys. If successful, the message will contain the saved card.
 */
exports.flagCard = function(payload) {
    payload = querySanitizer(payload);
    let flagsToUpdate = {};
    if (payload.markedForReview) flagsToUpdate.numTimesMarkedForReview = 1;
    if (payload.markedAsDuplicate) flagsToUpdate.numTimesMarkedAsDuplicate = 1;
    return new Promise(function(resolve, reject) {
        Card
            .findOneAndUpdate({_id: payload.cardID}, {$inc: flagsToUpdate})
            .exec()
            .then((_) => {
                resolve({
                    status: 200, success: true, message: `Card flagged successfully!`
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
}

/**
 * @description Fetch the tags contained in the associated users cards.
 *
 * @param {JSON} payload Must contain `userIDInApp` as one of the keys.
 *
 * @returns {Promise} takes a JSON object with `success`, `status` and `message`
 * as its keys. If successful, the message will contain an array of arrays. Each
 * inner array will have tags that were found on a same card.
 */
exports.getTagGroupings = function(payload) {
    payload = querySanitizer(payload);
    return new Promise(function(resolve, reject) {
        Card
            .find({createdById: payload.userIDInApp})
            .select("tags").exec()
            .then((cards) => {
                let tagsArray = [];
                for (let i = 0; i < cards.length; i++) {
                    tagsArray.push(cards[i].tags.split(" "));
                }
                resolve({
                    success: true, message: tagsArray
                })
            })
            .catch((err) => { reject(err); });
    });
}

/**
 * @description For uniformity, tags should be delimited by white-space. If a
 * tag has multiple words, then an underscore or hyphen can be used to delimit
 * the words themselves.
 *
 * Remember to add `require('./MongooseClient');` at the top of this file when
 * running this script as main.
 *
 */
let standardizeTagDelimiters = function() {
    let cursor = Card.find({}).cursor();
    cursor.on("data", (card) => {
        let currentCard = card; // In case of any race conditions...
        currentCard.tags = currentCard.tags.replace(/#/g, "");

        currentCard.save((err, savedCard) => {
            if (err) console.log(err);
            else console.log(`${savedCard.title} -> ${savedCard.tags}`);
        });

    });
    cursor.on("close", () => {
        console.log("Finished the operation");
    });
};

/**
 * @description The `descriptionHTML` field was introduced later on in the
 * project. To avoid conditionals for documents created before the change, this
 * method adds the `descriptionHTML` field to all cards in the database.
 *
 * @param {MongooseClient} connection An instance of the mongoose connection
 * object. Needed so that it can be closed at the end of the script.
 */
let insertDescriptionHTML = function(connection) {
    let cursor = Card.find({}).cursor();
    cursor.on("data", (card) => {
        let currentCard = card;
        currentCard = cardSanitizer(currentCard);
        currentCard.save((err, savedCard) => {
            if (err) console.log(err);
            else console.log(`Updated ${savedCard.title}`);
        });
    });
    cursor.on("close", () => {
        console.log("Finished the operation");
        connection.closeMongooseConnection();
    });
}

if (require.main === module) {
    const dbConnection = require("../models/MongooseClient.js");
    // standardizeTagDelimiters();
    insertDescriptionHTML(dbConnection);
}
