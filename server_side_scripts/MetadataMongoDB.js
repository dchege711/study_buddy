var Metadata = require('./MetadataCardSchema');
var Card = require('./CardSchema');
var config = require('../config');
var mongoose = require('mongoose');

// Note: Reconnecting to MongoDB is slow. Share the connection!
mongoose.connect(config.MONGO_URI);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));

/**
 * 
 * @param {JSON} payload Must contain `userIDInApp` as a key
 * @param {Function} callBack Takes a JSON with `success`,
 * `internal_error` and `message` as keys.
 */
exports.create = function (payload, callBack) {
    var userIDInApp = payload["userIDInApp"];
    // Prepare the metadata document for this user
    var tagMetadata = new Metadata({
        "createdById": userIDInApp,
        "metadataIndex": 0,
        "stats": {},
        "node_information": {}
    });

    db.once('open', function () {
        tagMetadata.markModified("stats");
        tagMetadata.markModified("node_information");
        tagMetadata.save((error, savedMetadata) => {
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
    });
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
    db.once('open', function () {
        var cursor = Metadata.find({ createdById: userIDInApp}).cursor();
        var metadataResults = [];
        cursor.on("data", (metadataDoc) => {
            metadataResults.push(metadataDoc);
        });
        cursor.on("close", () => {
            callBack(metadataResults);
        });
    });
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
    db.once('open', function () {
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
                    metadataDoc["stats"][0][savedCard["_id"]]["urgency"] = savedCard["urgency"];
                    savedCard["tags"].forEach(tag => {
                        metadata["node_information"][0][tag][savedCard["_id"]] = savedCard["urgency"];
                    })

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
    });
}

/**
 * Delete the metadata associated with the user.
 * @param {JSON} payload Must contain `userIDInApp` as a key
 * @param {Function} callBack Takes a JSON with `success`,
 * `internal_error` and `message` as keys.
 */
exports.delete = function (payload, callBack) {
    var userIDInApp = payload["userIDInApp"];
    db.once('open', function () {
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
    });
}

// Close the MongoDB connection before closing the application.
process.on("SIGINT", function () {
    db.close(function () {
        console.log("Mongoose connection closed from CardsMongoDB.js");
        process.exit(0);
    });
})