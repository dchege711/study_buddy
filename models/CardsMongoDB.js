"use strict";

const Card = require('./mongoose_models/CardSchema.js');
const MetadataDB = require('./MetadataMongoDB.js');

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
        Card
            .create(payload)
            .then((savedCard) => {
                returnedValues.savedCard = savedCard;
                savedCard.previousTags = savedCard.tags;
                return MetadataDB.update([savedCard]);
            })
            .then((confirmation) => { 
                if (confirmation.success) {
                    confirmation.message = returnedValues.savedCard;
                }
                resolve(confirmation);
            })
            .catch((err) => { reject(err); })
    });
};

/**
 * Read a card(s) from the database.
 * 
 * @param {JSON} payload Must contain `userIDInApp` as one of the keys.
 * If `_id` is not one of the keys, fetch all the user's cards.
 * 
 * @returns {Promise} resolves with a JSON doc with `success`, `status` and  
 * `message` as keys. If successful, `message` will be an array of all matching 
 * cards.
 */
exports.read = function(payload) {
    let query = {createdById: payload.userIDInApp};
    if (payload._id !== undefined) query._id = payload._id;
    return new Promise(function(resolve, reject) {
        Card
            .find(query).exec()
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
 * include `_id` as an attribute, otherwise no changes will be made. 
 * 
 * @returns {Promise} resolves with a JSON doc with `success`, `status` and  
 * `message` as keys. If successful, `message` will be the updated card.
 */
exports.update = function(cardJSON) {

    let prevResults = {};
    const EDITABLE_ATTRIBUTES = new Set([
        "title", "description", "tags", "urgency", "isPublic", "numChildren",
        "numTimesMarkedAsDuplicate", "numTimesMarkedForReview"
    ]);

    // findByIdAndUpdate will give me the old, not the updated, document.
    // I need to find the card, save it, and then call MetadataDB.update if need be

    return new Promise(function(resolve, reject) {
        Card
            .findById(cardJSON._id).exec()
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
                    resolve({success: true, status: 200, message: savedCard});
                }
            })
            .then((_) => {
                resolve({success: true, status: 200, message: prevResults.savedCard});
            })
            .catch((err) => { reject(err); });
    });
};

/**
 * Remove this card from the database.
 * 
 * @param {JSON} payload The card to be removed
 * @return {Promise} resolves with a JSON keyed by `success`, `status` and 
 * `message` as keys.
 */
exports.delete = function(payload) {
    return new Promise(function(resolve, reject) {
        Card
            .findByIdAndRemove(payload._id).exec()
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
 * @description Search for cards with associated key words
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
 * @param {JSON} `payload` Expected keys are `card_id`, `user_id`, `query_string`. 
 * The `user_id` in this case refers to the creator of the cards, 
 * not the ID of the user/guest that makes the request. 
 * 
 * @returns {Promise} resolves with a JSON object. If `success` is set, then 
 * the `message` attribute will be an array of matching cards.
 */
exports.publicSearch = function(payload) {
    let mandatoryFields = [{isPublic: true}];
    if (payload.userID !== undefined) {
        mandatoryFields.push({createdById: payload.userID});
    }
    if (payload.cardID !== undefined) {
        mandatoryFields.push({_id: payload.cardID });
    }
    if (payload.queryString !== undefined) {
        mandatoryFields.push({ $text: { $search: splitTags(payload.queryString) } });
    }

    let queryObject = {
        filter: { $and: mandatoryFields },
        projection: "title tags",
        limit: payload.limit,
        sortCriteria: { score: { $meta: "textScore" } }
    };
    return collectSearchResults(queryObject);
}

/**
 * @description Read a card that has been set to 'public'
 * @param {JSON} payload The `card_id` property should be set to a valid ID
 * @returns {Promise} resolves with a JSON object. If `success` is set, then 
 * the `message` attribute will contain the matching card in JSON format
 */
exports.readPublicCard = function(payload) {
    return new Promise(function(resolve, reject) {
        if (payload.card_id === undefined) {
            resolve({});
        } else {
            Card
                .findOne({isPublic: true, _id: payload.card_id}).exec()
                .then((matchingCard) => {
                    resolve({
                        success: true, status: 200, message: matchingCard
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
        let queryObject = { _id: payload.cardID, isPublic: true };
        Card
            .findOne(queryObject).exec()
            .then((preExistingCard) => {            
                preExistingCard.numChildren = preExistingCard.numChildren + 1;
                return preExistingCard.save();
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
            .catch((err) => { console.error(err); reject(err); })
    });
        
};

/**
 * @description Increase the counter of the specified file. This allows 
 * moderators to deal with the most flagged cards first. 
 * 
 * @param {JSON} payload The `cardID` must be set. `markedForReview` and 
 * `markedAsDuplicate` are optional. If set, they should be booleans.
 * 
 * @returns {Promise} takes a JSON object with `success`, `status` and `message` 
 * as its keys. If successful, the message will contain the saved card.
 */
exports.flagCard = function(payload) {
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
        if (debug) console.log("Finished the operation");
    });
};

if (require.main === module) {
    // standardizeTagDelimiters();
    console.log(splitTags("there-are tags in this_string-delimited differently"));
    console.log(splitTags("no tags present in this string"))
}