var Card = require('./models/CardSchema');
var User = require("./models/UserSchema.js");
var mongoose = require('mongoose');
var MetadataDB = require('./MetadataMongoDB');

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
    var card = new Card({
        title: payload.title,
        description: payload.description,
        tags: payload.tags,
        createdById: payload.createdById,
        urgency: payload.urgency
    });

    /*
     * How many cards before we need a new metadata JSON?
     * 
     * (400 + 150 * num_id_metadata) * 5 bytes/char <= 16MB
     * num_id_metadata <= 21330. So let's say 15,000 cards max
     * 
     * Will that ever happen, probably not!
     */
    card.save(function(error, savedCard) {
        if (error) {
            callBack({
                "success": false, "internal_error": true,
                "message": error
            })
        } else {
            // Update the metadata object with this card's details
            savedCard.previousTags = card.tags;
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
        }
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
    var _id = cardJSON._id;

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
 * 
 * @param {JSON} payload Must contain `_id` that has the id of the card
 * to be placed into trash, and `userIDInApp`, the ID of the user who owns
 * the card.
 * @param {Function} callBack Takes a JSON with `success`, `internal_error` 
 * and `message` as keys.
 */
exports.send_to_trash = function(payload, callBack) {
    Card.find(
        {
            _id: payload._id, createdById: payload.createdById
        }, (error, card_results) => {
            if (error) {
                console.log(error);
                callBack({
                    success: false, internal_error: false,
                    message: "500. Internal Server Error"
                });
            }
            else if (card_results.length == 0) {
                callBack({
                    success: false, internal_error: false,
                    message: "The card could not was not trashed."
                });
            } else {
                // Since ids are unique, we're sure that we found an exact match
                MetadataDB.send_to_trash(card_results[0], callBack);
            }
        }
    );
};
