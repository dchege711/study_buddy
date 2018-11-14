"use strict";

var Card = require('./mongoose_models/CardSchema.js');
var MetadataDB = require('./MetadataMongoDB');

var generic_500_msg = { 
    success: false, status: 500, message: "Internal Server Error" 
};

var debug = false;

/**
 * Create a new card and add it to the user's current cards.
 * 
 * @param {JSON} payload Expected keys: `title`, `description`, 
 * `tags`, `createdById`, `urgency`, and `idInApp`
 * @param {Function} callBack Takes a JSON with `success`, 
 * `internal_error` and `message` as keys.
 */
exports.create = function(payload, callBack) {
    return new Promise(function(resolve, reject) {

        let card = new Card({
            title: payload.title,
            description: payload.description,
            tags: payload.tags,
            createdById: payload.createdById,
            urgency: payload.urgency,
            isPublic: payload.isPublic
        });
        if (payload.parent !== undefined) card.parent = payload.parent;

        card
            .save()
            .then((savedCard) => {
                savedCard.previousTags = card.tags;
                MetadataDB.update([savedCard], (response) => {
                    if (response.success) {
                        resolve({
                            "success": true, "internal_error": false,
                            "message": savedCard
                        });
                    } else {
                        reject({
                            "success": false, "internal_error": false,
                            "message": response.message
                        });
                    }
                });
            })
            .catch((err) => { reject(err); })
    });
};

/**
 * Read a card(s) from the database.
 * 
 * @param {JSON} payload Must contain `userIDInApp` as one of the keys.
 * If `_id` is not one of the keys, fetch all the user's cards.
 * @param {Function} callBack Takes a JSON with `success`, `internal_error` 
 * and `message` as keys.
 */
exports.read = function(payload, callBack) {
    var _id = payload._id;
    if (_id === undefined) {
        var cursor = Card.find({ createdById: payload.userIDInApp}).cursor();
        var allRelevantCards = [];
        cursor.on("data", (card) => {
            allRelevantCards.push(card);
        });
        cursor.on("close", () => {
            callBack({
                "success": true, "internal_error": false,
                "message": allRelevantCards
            });
        });
    } else {
        Card.findById(_id, function(error, card) {
            if (error) {
                callBack({
                    "success": false, "internal_error": true,
                    "message": error
                });
            } else {
                callBack({
                    "success": true, "internal_error": false,
                    "message": card
                });
            }
        });
    }
};

/**
 * Update an existing card.
 * 
 * @param {JSON} cardJSON The parts of the card that have been updated. Must
 * include the card's `id`
 * @param {Function} callBack Takes a JSON with `success`,
 * `internal_error` and `message` as keys.
 */
exports.update = function(cardJSON, callBack) {

    // findByIdAndUpdate will give me the old, not the updated, document.
    // I need to find the card, save it, and then call MetadataDB.update if need be

    Card.findById(cardJSON._id, function(error, card) {
        if (error) {
            callBack({
                "success": false, "internal_error": true,
                "message": error
            });
        } else {
            var previousTags = card.tags;
            // Overwrite the contents that changed
            Object.keys(cardJSON).forEach(card_key => {
                card[card_key] = cardJSON[card_key];
            });
            card.save(function(error, savedCard) {
                if (error) {
                    callBack({
                        "success": false, "internal_error": true,
                        "message": error
                    });
                } else {
                    if (cardJSON.hasOwnProperty("tags") || cardJSON.hasOwnProperty("urgency")) {
                        savedCard.previousTags = previousTags;
                        MetadataDB.update([savedCard], (response) => {
                            if (response.success) {
                                callBack({
                                    "success": true, "internal_error": false,
                                    "message": savedCard
                                });
                            } else {
                                callBack({
                                    "success": false, "internal_error": false,
                                    "message": response.message
                                });
                            }
                        });
                    } else {
                        callBack({
                            "success": true, "internal_error": false,
                            "message": savedCard
                        });
                    }
                }
            });
        }
    });
};

/**
 * Remove this card from the database.
 * 
 * @param {JSON} payload The card to be removed
 * @param {Function} callBack Takes a JSON with `success`,
 * `internal_error` and `message` as keys.
 */
exports.delete = function(payload, callBack) {
    Card.findByIdAndRemove(
        payload._id, (error, removedCard) => {
        if (error) {
            callBack({
                "success": false, "internal_error": true,
                "message": error
            });
        } else {
            MetadataDB.remove(removedCard, callBack);
        }
    });
};

/**
 * Search for cards with associated key words
 * 
 * @param {JSON} payload Expected keys: `key_words`, `createdById`
 * @param {Function} callBack Takes a JSON with `success`, `status` and `message` 
 * as keys. If successful `message` will contain abbreviated cards that only 
 * the `id`, `urgency` and `title` fields.
 */
exports.search = function(payload, callBack) {
    /**
     * $expr is faster than $where because it does not execute JavaScript 
     * and should be preferred where possible. Note that the JS expression
     * is processed for EACH document in the collection. Yikes!
     */

    if (payload.query_string !== undefined) {
        payload.query_string = splitTags(payload.query_string);
    }
    let queryObject = {
        filter: {
            $and: [
                { createdById: payload.userIDInApp },
                { $text: { $search: payload.query_string } }
            ]
        },
        projection: "title tags urgency",
        limit: payload.limit,
        sortCriteria: { score: { $meta: "textScore" } }
          
    };
    collectSearchResults(queryObject, callBack);
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
 */
let collectSearchResults = function(queryObject, callBack) {
    Card
        .find(queryObject.filter, queryObject.sortCriteria)
        .sort(queryObject.sortCriteria)
        .select(queryObject.projection)
        .limit(queryObject.limit)
        .exec((err, cards) => {
            if (err) { console.log(err); callBack(generic_500_msg); }
            else {
                callBack({ success: true, status: 200, message: cards });
            }
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
 * @param {Function} `callback`. The first parameter is set to any error that 
 * occured. The second parameter contains an array of abbreviated cards
 */
exports.publicSearch = function(payload, callBack) {
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
    collectSearchResults(queryObject, callBack);
}

exports.readPublicCard = function(payload) {
    return new Promise(function(resolve, reject) {
        if (payload.card_id === undefined) {
            resolve({});
        } else {
            Card
                .findOne({isPublic: true, _id: payload.card_id})
                .exec((err, matchingCard) => {
                    if (err) reject(err);
                    else resolve(matchingCard);
                });
        }
        
    });
}

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

exports.flagCard = function(payload) {
    let flagsToUpdate = {};
    if (payload.markedForReview) flagsToUpdate.numTimesMarkedForReview = 1;
    if (payload.markedAsDuplicate) flagsToUpdate.numTimesMarkedAsDuplicate = 1;
    return new Promise(function(resolve, reject) {
        Card
            .findOneAndUpdate({_id: payload.cardID}, {$inc: flagsToUpdate})
            .exec()
            .then((cardToUpdate) => {
                resolve({ message: `Card flagged successfully!` });
            })
            .catch((err) => {
                console.error(err); 
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