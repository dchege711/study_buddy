var Metadata = require('./models/MetadataCardSchema');
var Card = require('./models/CardSchema');
var config = require('../config');
var mongoose = require('mongoose');

// mongoose.connect(config.MONGO_URI);
// var db = mongoose.connection;
// db.on("error", console.error.bind(console, "Connection Error:"));

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
                    "metadataIndex": 0,
                    "stats": {},
                    "node_information": {}
                });

                tagMetadata.markModified("stats");
                tagMetadata.markModified("node_information");

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


var updateMetadata = function (modifications) {
    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function () {
        Card.findOne({ "title": "_tags_metadata_" }, function (error, card) {
            if (error) {
                console.log(error);
            } else {
                if (card === null || card === undefined) {
                    console.log("{title: _tags_metadata_} didn't match any documents");
                    return;
                }
                Object.keys(payload).forEach(key => {
                    card[key] = payload[key];
                });

                card["description_markdown"] = converter.makeHtml(card["description"]),
                    card.save(function (error, confirmation) {
                        if (error) {
                            console.log(error);
                        } else {
                            callBack(confirmation);
            
                        }
                    });
            }
        });
    });
}

/**
 * Read all the metadata associated with a user's cards.
 * 
 * @param {JSON} payload Must contain `userIDInApp` as a key
 * @param {Function} callBack Function that takes an array of JSON `Metadata` objects 
 */
exports.read = function (payload, callBack) {
    var userIDInApp = payload["userIDInApp"];
//    db.on('open', function () {
        var cursor = Metadata.find({ createdById: userIDInApp}).cursor();
        var metadataResults = [];
        cursor.on("data", (metadataDoc) => {
            metadataResults.push(metadataDoc);
        });
        cursor.on("close", () => {
            callBack(metadataResults);
        });
//    });
}

/**
 * Update the metadata with the new card's details. This method
 * is usually called by CardsMongoDB.update().  
 * 
 * @param {mongoose.Model} savedCard The card that has just been saved
 * @param {Function} callBack Takes a JSON with `success`,
 * `internal_error` and `message` as keys.
 */
exports.update = function (savedCard, callBack) {
    if (savedCard.metadataIndex === undefined) {
        savedCard.metadataIndex = 0;
    }
    Metadata.findOne(
        {
            createdById: savedCard.createdById,
            metadataIndex: savedCard.metadataIndex
        }, 
        (error, metadataDoc) => {
            if (error) {
                callBack({
                    "success": false, "internal_error": true,
                    "message": error
                });    
            } else {
                var urgency = savedCard.urgency;
                var cardID = savedCard._id;

                if (metadataDoc["stats"] === undefined) {
                    metadataDoc["stats"] = {}
                }

                if (metadataDoc["node_information"] === undefined) {
                    metadataDoc["node_information"] = {}
                } 
                
                
                // Save this card in the stats field where it only appears once
                if (metadataDoc["stats"][cardID] === undefined) {
                    metadataDoc["stats"][cardID] = {};
                }
                metadataDoc["stats"][cardID]["urgency"] = urgency;

                // We need to mark the nested path, `stats` by itself is wacky.
                var modifiedPath = "stats." + cardID + ".urgency";
                metadataDoc.markModified(modifiedPath);

                // Save the card's id in each tag that it has
                savedCard.tags.split("#").forEach(tag => {
                    if (tag !== "") {
                        if (metadataDoc["node_information"][tag] === undefined) {
                            metadataDoc["node_information"][tag] = {};
                        }

                        if (metadataDoc["node_information"][tag][cardID] === undefined) {
                            metadataDoc["node_information"][tag][cardID] = {}
                        }

                        metadataDoc["node_information"][tag][cardID]["urgency"] = urgency;
                        modifiedPath = "node_information." + tag + "." + cardID + ".urgency";
                        metadataDoc.markModified(modifiedPath);
                    }
                });

                // This is needed for fields that have SchemaTypes.Mixed
                
                metadataDoc.markModified("node_information");

                // Save this metadata document and return the card that has
                // caused us all this trouble. We assume that the caller is more
                // interested in the Card since they called Card.save()
                metadataDoc.save(function (error, savedMetadata) {
                    if (error) {
                        callBack({
                            "success": false, "internal_error": true,
                            "message": error
                        });           
                    } else {
                        callBack({
                            "success": true, "internal_error": false,
                            "message": savedCard
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