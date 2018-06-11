var Metadata = require('./models/MetadataCardSchema');
var Card = require('./models/CardSchema.js');

var debug = false;

/**
 * 
 * @param {JSON} payload Must contain `userIDInApp` and `metadataIndex` as keys
 * @param {Function} callBack Takes a JSON with `success`,
 * `internal_error` and `message` as keys.
 */
exports.create = function (payload, callBack) {
    if (payload.userIDInApp === undefined || payload.metadataIndex === undefined) {
        callBack({
            "success": false, "internal_error": false,
            "message": "Please provide a userIDInApp and a metadataIndex."
        });
        return;
    }

    // Do not overwrite. Only create new metadata.
    Metadata.count(
        { 
            "createdById": payload.userIDInApp,
            "metadataIndex": payload.metadataIndex
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
                    "createdById": payload.userIDInApp,
                    "metadataIndex": payload.metadataIndex,
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
};

/**
 * Read all the metadata associated with a user's cards.
 * 
 * @param {JSON} payload Must contain `userIDInApp` as a key
 * @param {Function} callBack Function that takes an array of JSON `Metadata` objects 
 */
exports.read = function (payload, callBack) {
    var userIDInApp = payload.userIDInApp;
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
};

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
};

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
                    updateMetadataWithCardDetails(
                        savedCard, metadataDoc, () => {}
                    );
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
};

/**
 * Delete the metadata associated with the user.
 * @param {JSON} payload Must contain `userIDInApp` as a key
 * @param {Function} callBack Takes a JSON with `success`,
 * `internal_error` and `message` as keys.
 */
exports.delete = function (payload, callBack) {
    var userIDInApp = payload.userIDInApp;
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
};

/**
 * @param {JSON} payload Must contain `_id` that has the id of the card
 * to be placed into trash, and `userIDInApp`, the ID of the user who owns
 * the card.
 * @param {Function} callBack Takes a JSON with `success`, `internal_error` 
 * and `message` as keys.
 */
exports.send_to_trash = function (payload, callBack) {
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
                    message: "The card was not trashed."
                });
            } else {
                // Since ids are unique, we're sure that we found an exact match
                card_JSON = card_results[0];

                if (card_JSON.metadataIndex === undefined) {
                    card_JSON.metadataIndex = 0;
                }
                Metadata.findOne(
                    {
                        createdById: card_JSON.createdById,
                        metadataIndex: card_JSON.metadataIndex
                    }, (error, metadataDoc) => {
                        if (error) {
                            callBack({
                                "success": false, "internal_error": true,
                                "message": error
                            });
                        } else {

                            metadataStats = metadataDoc.stats[0];
                            metadataNodeInfo = metadataDoc.node_information[0];
                            var trashed_card_id = card_JSON._id;

                            // Remove the card from the lists that the user previews from
                            card_JSON.tags.split("#").forEach(tag_to_remove => {
                                tag_to_remove = tag_to_remove.trim();
                                if (tag_to_remove !== "") {
                                    delete metadataNodeInfo[tag_to_remove][trashed_card_id];
                                    if (Object.keys(metadataNodeInfo[tag_to_remove]).length === 0) {
                                        delete metadataNodeInfo[tag_to_remove];
                                    }
                                }
                            });
                            delete metadataStats[trashed_card_id];

                            // Add the card to the trashed items associated with the user
                            // Associate the deletion time so that we can have a clean up 
                            // of all cards in the trash that are older than 30 days

                            if (!metadataDoc.trashed_cards || metadataDoc.trashed_cards.length == 0) {
                                metadataDoc.trashed_cards = [];
                                metadataDoc.trashed_cards.push({});
                                console.log("Added an empty object to metadataDoc.trashed_cards[]");
                            }
                            metadataDoc.trashed_cards[0][trashed_card_id] = Date.now();

                            // This is necessary. All that hair pulling can now stop :-/
                            metadataDoc.markModified("stats");
                            metadataDoc.markModified("node_information");
                            metadataDoc.markModified("trashed_cards");

                            metadataDoc.save(function (error, savedMetadata, numAffected) {
                                if (error) {
                                    callBack({
                                        "success": false, "internal_error": true,
                                        "message": error
                                    });
                                } else {
                                    callBack({
                                        success: true, internal_error: false,
                                        message: `Card moved to the trash. <span class="underline_bold_text clickable" onclick="restoreFromTrash('${card_JSON._id}', '${card_JSON.urgency}')">Undo Action</span>`
                                    });
                                }
                            });
                        }
                    }
                );

            }
        }
    );
};

/**
 * @description Helper method for updating the metadata from a given card.
 * @param {JSON} savedCard The card that whose details should be added to the 
 * metadata.
 * @param {JSON} metadataDoc A Mongoose Schema object that is used to store the
 * current user's metadata.
 * @param {Function} callBack A function that's called on successful termination.
 * Takes no parameters.
 */
function updateMetadataWithCardDetails(savedCard, metadataDoc, callBack) {
    if (debug) {
        console.log("Updating metadata: " + savedCard.title + " urgency -> " + savedCard.urgency);
    }

    var urgency = savedCard.urgency;
    var cardID = savedCard._id;

    if (metadataDoc.stats.length == 0) {
        metadataDoc.stats.push({});
        if (debug) console.log("Created new stats item for " + savedCard.title);
    }

    if (metadataDoc.node_information.length == 0) {
        metadataDoc.node_information.push({});
        if (debug) console.log("Created new nodes item for " + savedCard.title);
    }

    metadataStats = metadataDoc.stats[0];
    metadataNodeInfo = metadataDoc.node_information[0];

    // Save this card in the stats field where it only appears once
    if (metadataStats[cardID] === undefined) {
        metadataStats[cardID] = {};
    }
    metadataStats[cardID].urgency = urgency;
    metadataDoc.markModified("stats");

    // Keep track of which tags have been changed
    var prevTagStillExists = {};
    if (savedCard.previousTags) {
        savedCard.previousTags.split("#").forEach(prevTag => {
            if (prevTag !== "") {
                prevTag = prevTag.trim();
                prevTagStillExists[prevTag] = false;
            }
        });
    }

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

            // If this tag was in the previous version of the card, flag it
            if (strippedTag in prevTagStillExists) {
                prevTagStillExists[strippedTag] = true;
            }

            metadataNodeInfo[strippedTag][cardID].urgency = urgency;
        }
    });
    metadataDoc.markModified("node_information");

    // Get rid of all tags that were deleted in the current card
    Object.keys(prevTagStillExists).forEach((prevTag) => {
        if (!prevTagStillExists[prevTag]) {
            delete metadataNodeInfo[prevTag][cardID];
            if (Object.keys(metadataNodeInfo[prevTag]).length === 0) {
                delete metadataNodeInfo[prevTag];
            }
            if (debug) console.log(
                `${savedCard.title} was deleted from ${prevTag}`
            );
        }
    });
    
    callBack();
}

exports.restore_from_trash = function(restore_card_args, callBack) {
    Card.find(
        {
            _id: restore_card_args._id, 
            createdById: restore_card_args.createdById
        }, (error, matchingCards) => {
            if (error) {
                console.log(err);
                callBack({
                    success: false, internal_error: true,
                    message: "500. Internal Server Error"
                });
            } else if (matchingCards.length == 1) {
                var card_to_restore_JSON = matchingCards[0];
                Metadata.find(
                    { createdById: card_to_restore_JSON.createdById },
                    (err, matchingMetadataDocs) => {
                        if (err) {
                            console.log(err);
                            callBack({
                                success: false, internal_error: true,
                                message: "500. Internal Server Error"
                            });
                        } else {
                            matchingMetadataDocs.forEach((metadataDoc) => {
                                if (card_to_restore_JSON._id in metadataDoc.trashed_cards[0]) {
                                    var date = new Date(metadataDoc.trashed_cards[0][card_to_restore_JSON._id]);
                                    console.log(`Found card trashed on ${date.toDateString()} ${date.toTimeString()} in ${metadataDoc._id}`);
                                    delete metadataDoc.trashed_cards[0][card_to_restore_JSON._id];
                                    metadataDoc.markModified("trashed_cards");

                                    updateMetadataWithCardDetails(
                                        card_to_restore_JSON, metadataDoc, ()=> {
                                            metadataDoc.save(function (error, savedMetadata, numAffected) {
                                                if (error) {
                                                    callBack({
                                                        "success": false, "internal_error": true,
                                                        "message": error
                                                    });
                                                } else {
                                                    callBack({
                                                        success: true, internal_error: false,
                                                        message: card_to_restore_JSON._id
                                                    });
                                                }
                                                return;
                                            });
                                        }
                                    );
                                }
                            });
                        }
                    }
                );
            } else {
                // ... otherwise don't do anything to the database
                console.log(`Search Failure: Restore query: 
                ${Object.values(restore_card_args)} returned ${matchingCards}`);
                callBack({
                    success: false, internal_error: true,
                    message: "404: Card Not Found"
                });
            }
        }
    );
};