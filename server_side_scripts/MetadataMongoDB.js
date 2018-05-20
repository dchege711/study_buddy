var Metadata = require('./models/MetadataCardSchema');
var Card = require('./models/CardSchema');
var config = require('../config');
var mongoose = require('mongoose');

var debug = true;

/**
 * 
 * @param {JSON} payload Must contain `userIDInApp` and `metadataIndex` as keys
 * @param {Function} callBack Takes a JSON with `success`,
 * `internal_error` and `message` as keys.
 */
exports.create = function (payload, callBack) {
    if (payload["userIDInApp"] === undefined || payload["metadataIndex"] === undefined) {
        callBack({
            "success": false, "internal_error": false,
            "message": "Please provide a userIDInApp and a metadataIndex."
        });
        return;
    }

    // Do not overwrite. Only create new metadata.
    Metadata.count(
        { 
            "createdById": payload["userIDInApp"],
            "metadataIndex": payload["metadataIndex"]
        }, function(error, count) {
            if (count >= 1) {
                callBack({
                    "success": false, "internal_error": false,
                    "message": "This metadata document already exists."
                });
                return;
            } else {

                // Metadata.create forgets to include `stats` and 
                // `node_information`. Scrap that, even after using 
                // `markModified`, nothing happens. :-/
                var tagMetadata = new Metadata({
                    "createdById": payload["userIDInApp"],
                    "metadataIndex": payload["metadataIndex"],
                    "stats": [],
                    "node_information": []
                });

                tagMetadata.save(function(error, savedMetadata) {
                    if (error) {
                        callBack({
                            "success": false, "internal_error": true,
                            "message": error
                        });
                    } else {
                        callBack({
                            "success": true, "internal_error": false,
                            "message": savedMetadata
                        });
                    }
                });
            }
        }
    );
}

/**
 * Read all the metadata associated with a user's cards.
 * 
 * @param {JSON} payload Must contain `userIDInApp` as a key
 * @param {Function} callBack Function that takes an array of JSON `Metadata` objects 
 */
exports.read = function (payload, callBack) {
    var userIDInApp = payload["userIDInApp"];
    var cursor = Metadata.find({ createdById: userIDInApp}).cursor();
    var metadataResults = [];
    cursor.on("data", (metadataDoc) => {
        metadataResults.push(metadataDoc);
    });
    cursor.on("close", () => {
        callBack({
            "success": true, "internal_error": false,
            "message": metadataResults
        });
    });
}

/**
 * @description Scan the metadata database, looking for all the tags and their
 * counts. Return this info as a list of {`text`: x, `size`: y} dicts.
 * 
 * @param {JSON} payload Empty for now. Might get used later on
 * @param {Function} callBack Function that takes in an array of dicts. Each
 * dict has the keys `text` and `size`.
 */
exports.readTags = function(payload, callBack) {
    var cursor = Metadata.find({}).cursor();
    var tags = {};
    cursor.on("data", (metadataDoc) => {
        var nodeInfo = metadataDoc.node_information[0];
        for (const tag in nodeInfo) {
            if (!tags.hasOwnProperty(tag)) {
                tags[tag] = Object.keys(nodeInfo[tag]).length;
            } else {
                tags[tag] += Object.keys(nodeInfo[tag]).length;
            }
        }
    });

    cursor.on("close", () => {
        tagsAsList = [];
        for (const property in tags) {
            tagsAsList.push({
                text: property,
                size: tags[property] 
            });
        }
        callBack(tagsAsList);
    });
}

/**
 * Update the metadata with the new cards' details. This method
 * is usually called by CardsMongoDB.update(). An array is needed to prevent
 * race conditions when updating metadata from more than one card. 
 * 
 * @param {Array} savedCards Array of cards
 * @param {Function} callBack Takes a JSON with `success`,
 * `internal_error` and `message` as keys.
 */
exports.update = function (savedCards, callBack) {
    if (savedCards[0].metadataIndex === undefined) {
        savedCards[0].metadataIndex = 0;
    }

    if (savedCards[0].createdById === undefined) {
        callBack({
            success: false, internal_error: false,
            message: "Expected the ID of the creator of this card"
        });
    }
    Metadata.findOne(
        {
            createdById: savedCards[0].createdById,
            metadataIndex: savedCards[0].metadataIndex
        }, 
        (error, metadataDoc) => {
            if (error) {
                callBack({
                    "success": false, "internal_error": true,
                    "message": error
                });    
            } else {

                savedCards.forEach(savedCard => {

                    if (debug) {
                        console.log("Updating metadata: " + savedCard.title + " urgency -> " + savedCard.urgency);
                    }

                    var urgency = savedCard.urgency;
                    var cardID = savedCard._id;

                    if(metadataDoc["stats"].length == 0) {
                        metadataDoc["stats"].push({});
                        if (debug) console.log("Created new stats item for " + savedCard.title);
                    }

                    if (metadataDoc["node_information"].length == 0) {
                        metadataDoc["node_information"].push({});
                        if (debug) console.log("Created new nodes item for " + savedCard.title);
                    }

                    metadataStats = metadataDoc["stats"][0];
                    metadataNodeInfo = metadataDoc["node_information"][0];

                    // Save this card in the stats field where it only appears once
                    if (metadataStats[cardID] === undefined) {
                        metadataStats[cardID] = {};
                    }
                    metadataStats[cardID]["urgency"] = urgency;

                    // Save the card's id in each tag that it has
                    savedCard.tags.split("#").forEach(tag => {
                        var strippedTag = tag.trim();
                        if (strippedTag !== "") {
                            // If we've not seen this tag before, create its node
                            if (metadataNodeInfo[strippedTag] === undefined) {
                                metadataNodeInfo[strippedTag] = {};
                            }

                            // If we've not seen this card under this tag, add it
                            if (metadataNodeInfo[strippedTag][cardID] === undefined) {
                                metadataNodeInfo[strippedTag][cardID] = {}
                            }

                            metadataNodeInfo[strippedTag][cardID]["urgency"] = urgency;
                        }
                    });

                });

                // This is necessary. All that hair pulling can now stop :-/
                metadataDoc.markModified("stats");
                metadataDoc.markModified("node_information");

                metadataDoc.save(function (error, savedMetadata, numAffected) {
                    if (error) {
                        callBack({
                            "success": false, "internal_error": true,
                            "message": error
                        });           
                    } else {
                        callBack({
                            "success": true, "internal_error": false,
                            "message": metadataDoc
                        });    
                    }
                });
            }
        }
    );
}

/**
 * Delete the metadata associated with the user.
 * @param {JSON} payload Must contain `userIDInApp` as a key
 * @param {Function} callBack Takes a JSON with `success`,
 * `internal_error` and `message` as keys.
 */
exports.delete = function (payload, callBack) {
    var userIDInApp = payload["userIDInApp"];
    Metadata.deleteMany(
        { createdById: userIDInApp }, 
        (error, deleteConfirmation) => {
        if (error) {
            callBack({
                "success": false, "internal_error": true,
                "message": error
            });
        } else {
            callBack({
                "success": true, "internal_error": false,
                "message": deleteConfirmation
            });
        }
    });
}