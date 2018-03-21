var Card = require('./CardSchema');
var config = require('../config');
var mongoose = require('mongoose');
var showdown = require('showdown');
var MetadataDB = require('./MetadataMongoDB');

var converter = new showdown.Converter();

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
        title: payload["title"],
        description: payload["description"],
        description_markdown: converter.makeHtml(payload["description"]),
        tags: payload["tags"],
        createdById: payload["createdById"],
        urgency: payload["urgency"]
    });

    /*
     * How many cards before we need a new metadata JSON?
     * 
     * (400 + 150 * num_id_metadata) * 5 bytes/char <= 16MB
     * num_id_metadata <= 21330. So let's say 15,000 cards max
     * 
     * Will that ever happen, probably not!
     */
    
    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function() {
        card.save(function(error, savedCard) {
            if (error) {
                callBack({
                    "success": false, "internal_error": true,
                    "message": error
                })
                db.close();
            } else {
                // Update the metadata object with this card's details
                MetadataDB.update(savedCard, callBack);
                db.close();
            }
        });
    });
}

/*
 * Delete this method if nothing breaks.
 * 
exports.saveThisCard = function(card, callBack) {
    // To do: Store the metadata ID under user's details.
    if (card.title === "_tags_metadata_" || card.title === "_metadata_") {
        return;
    }

    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function () {
        console.log("Now saving card...");
        console.log(card);
        card.save(function (error, confirmation) {
            console.log("I'm in the callback");
            if (error) {
                console.log(error);
            } else {
                console.log(confirmation);
                callBack(confirmation);
                db.close();
            }
        });
    });
}
*/

/**
 * Read a card(s) from the database.
 * 
 * @param {JSON} payload Must contain `userIDInApp` as one of the keys.
 * If `_id` is not one of the keys, fetch all the user's cards.
 * @param {Function} callBack Takes a JSON with `success`, `internal_error` 
 * and `message` as keys.
 */
exports.read = function(payload, callBack) {
    var _id = payload["_id"];
    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function() {
        if (_id === undefined) {
            var cursor = Card.find({ createdById: payload["userIDInApp"]}).cursor();
            var allRelevantCards = [];
            cursor.on("data", (card) => {
                allRelevantCards.push(card);
            });
            cursor.on("close", () => {
                db.close();
                callBack({
                    "success": true, "internal_error": false,
                    "message": allRelevantCards
                })
            });
        } else {
            Card.findById(_id, function(error, card) {
                if (error) {
                    db.close();
                    callBack({
                        "success": false, "internal_error": true,
                        "message": error
                    })
                } else {
                    db.close();
                    callBack({
                        "success": true, "internal_error": false,
                        "message": card
                    })
                }
            });
        }
    });
}

/**
 * Update an existing card.
 * 
 * @param {JSON} cardJSON The entire card as a JSON object
 * @param {Function} callBack Takes a JSON with `success`,
 * `internal_error` and `message` as keys.
 */
exports.update = function(cardJSON, callBack) {
    var _id = cardJSON["_id"];
    cardJSON["description_markdown"] = converter.makeHtml(cardJSON["description"]);
    delete cardJSON._id;
    
    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function() {
        Card.findByIdAndUpdate(
            _id, {$set: cardJSON}, {new: true}, 
            (error, updatedCard) => {
                if (error) {
                    callBack({
                        "success": false, "internal_error": true,
                        "message": error
                    })
                    db.close();
                } else {
                    MetadataDB.update(updatedCard, callBack);
                    db.close();
                }
            }
        );
    });
}

/**
 * Remove this card from the database.
 * 
 * @param {JSON} payload The card to be removed
 * @param {Function} callBack Takes a JSON with `success`,
 * `internal_error` and `message` as keys.
 */
exports.delete = function(payload, callBack) {
    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function() {
        Card.findByIdAndRemove(
            payload["_id"], (error, removedCard) => {
            if (error) {
                callBack({
                    "success": false, "internal_error": true,
                    "message": error
                })
                db.close();
            } else {
                MetadataDB.remove(removedCard, callBack);
                db.close();
            }
        });
    });
}
