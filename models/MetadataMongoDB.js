"use strict";

const User = require("./mongoose_models/UserSchema.js");
const Metadata = require('./mongoose_models/MetadataCardSchema');
const Card = require('./mongoose_models/CardSchema.js');
const fs = require("fs");

/**
 * @description Create & save a new metadata document for a user
 * @param {JSON} payload Must contain `userIDInApp` and `metadataIndex` as keys
 * @return {Promise} resolves with a JSON object with `success`, `status` and 
 * `message` as keys.
 */
exports.create = function (payload) {
    return new Promise(function(resolve, reject) {
        if (payload.userIDInApp === undefined || payload.metadataIndex === undefined) {
            reject(new Error("Please provide a userIDInApp and a metadataIndex."));
        } else {
            Metadata.count({
                createdById: payload.userIDInApp, 
                metadataIndex: payload.metadataIndex
            }).exec()
            .then((count) => {
                if (count >= 1) {
                    reject(new Error("The metadata document already exists."));
                } else {
                    return Metadata
                        .create({
                            createdById: payload.userIDInApp,
                            metadataIndex: payload.metadataIndex,
                            stats: [], node_information: []
                        });
                }
            })
            .then((savedMetadataDoc) => {
                resolve({
                    success: true, status: 200, message: savedMetadataDoc
                });
            })
            .catch((err) => { reject(err); });
        }
    
    })
};

/**
 * @description Read all the metadata associated with a user's cards.
 * 
 * @param {JSON} payload Must contain `userIDInApp` as a key
 * @returns {Promise} If successful, the `message` attribute is an array of 
 * JSON `Metadata` objects 
 */
exports.read = function (payload) {
    return new Promise(function(resolve, reject) {
        Metadata
            .find({createdById: payload.userIDInApp}).exec()
            .then((metadataDocs) => {
                resolve({
                    success: true, status: 200, message: metadataDocs
                });
            })
            .catch((err) => { reject(err); });
    });
};

/**
 * @description Scan the metadata database, looking for all the tags and their
 * counts. Return this info as a list of JSON objects keyed by `text` and `size`
 * 
 * @param {JSON} payload Filter for the metadata documents
 * @returns {Promise} takes in an array of dicts. Each dict has the keys 
 * `text` and `size`.
 */
exports.readTags = function(payload) {
    let cursor = Metadata.find(payload).cursor();
    let tags = {};
    cursor.on("data", (metadataDoc) => {
        var nodeInfo = metadataDoc.node_information[0];
        for (const tag in nodeInfo) {
            Object.keys(nodeInfo[tag]).forEach((card_id) => {
                if (!tags.hasOwnProperty(tag)) {
                    tags[tag] = nodeInfo[tag][card_id].urgency;
                } else {
                    tags[tag] += nodeInfo[tag][card_id].urgency;
                }
            }); 
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

        // The D3 wrapper works better when the input is sorted.
        // RN there's a pending PR: https://github.com/wvengen/d3-wordcloud/pull/13
        tagsAsList.sort(function(tag_item_a, tag_item_b) {
            return tag_item_b.size - tag_item_a.size;
        });

        tagsAsList = tagsAsList.slice(0, 25);
        return new Promise.resolve(tagsAsList);
    });
};

/**
 * Update the metadata with the new cards' details. This method
 * is usually called by CardsMongoDB.update(). An array is needed to prevent
 * race conditions when updating metadata from more than one card. 
 * 
 * @param {Array} savedCards Array of cards
 * @returns {Promise} takes a JSON with `success`, `status` and `message` as keys.
 */
exports.update = async function (savedCards) {
    /*
     * How many cards before we need a new metadata JSON?
     * (400 + 150 * num_id_metadata) * 5 bytes/char <= 16MB
     * num_id_metadata <= 21330. So let's say 15,000 cards max
     * Will that ever happen, probably not!
     */
    if (savedCards[0].metadataIndex === undefined) {
        savedCards[0].metadataIndex = 0;
    }

    return new Promise(function(resolve, reject) {
        if (savedCards[0].createdById === undefined) {
            reject(
                new Error("MetadataMongoDB.update() was called for a card without an owner")
            );
        }
        Metadata
            .findOne({
                createdById: savedCards[0].createdById,
                metadataIndex: savedCards[0].metadataIndex
            }).exec()
            .then((metadataDoc) => {
                savedCards.forEach(async (savedCard) => {
                    metadataDoc = await updateMetadataWithCardDetails(savedCard, metadataDoc);
                });
                metadataDoc.markModified("stats");
                metadataDoc.markModified("node_information");

                return metadataDoc.save();
            })
            .then((savedMetadata) => {
                resolve({success: true, status: 200, message: savedMetadata});
            })
            .catch((err) => { reject(err); })
    });
};

/**
 * @description Delete all the metadata associated with the user.
 * @param {JSON} payload Contains `userIDInApp` as a key
 * @returns {Promise} resolves with a JSON object keyed by `success`, `status` 
 * and `message`
 */
exports.delete = function (payload) {
    return new Promise(function(resolve, reject) {
        Metadata
            .deleteMany({createdById: payload.userIDInApp}).exec()
            .then((deleteConfirmation) => {
                resolve({success: true, status: 200, message: deleteConfirmation});
            })
            .catch((err) => { reject(err); });
    });
};

/**
 * @param {JSON} payload Must contain `_id` that has the id of the card
 * to be placed into trash, and `userIDInApp`, the ID of the user who owns
 * the card.
 * @returns {Promise} resolves with a JSON keyed by `success`, `status` and  
 * `message`
 */
exports.sendCardToTrash = function (payload) {
    let prevResults = {};
    return new Promise(function(resolve, reject) {
        Card
            .findOne({_id: payload._id, createdById: payload.createdById}).exec()
            .then((card) => {
                if (card === null) {
                    resolve({
                        success: false, status: 200, message: "The card wasn't found"
                    });
                }
                if (card.metadataIndex === undefined) card.metadataIndex = 0;
                prevResults.card = card;
                return Metadata.findOne({
                    createdById: card.createdById, metadataIndex: card.metadataIndex
                }).exec();
            })
            .then((metadataDoc) => {
                let metadataStats = metadataDoc.stats[0];
                let metadataNodeInfo = metadataDoc.node_information[0];
                let trashedCardID = prevResults.card._id;

                // Remove the card from the lists that the user previews from
                prevResults.card.tags.split(" ").forEach(tagToRemove => {
                    tagToRemove = tagToRemove.trim();
                    if (tagToRemove !== "") {
                        delete metadataNodeInfo[tagToRemove][trashedCardID];
                        if (Object.keys(metadataNodeInfo[tagToRemove]).length === 0) {
                            delete metadataNodeInfo[tagToRemove];
                        }
                    }
                });
                delete metadataStats[trashedCardID];

                // Add the card to the trashed items associated with the user
                // Associate the deletion time so that we can have a clean up 
                // of all cards in the trash that are older than 30 days
                if (!metadataDoc.trashed_cards || metadataDoc.trashed_cards.length == 0) {
                    metadataDoc.trashed_cards = [];
                    metadataDoc.trashed_cards.push({});
                }
                metadataDoc.trashed_cards[0][trashedCardID] = Date.now();

                // This is necessary. All that hair pulling can now stop :-/
                metadataDoc.markModified("stats");
                metadataDoc.markModified("node_information");
                metadataDoc.markModified("trashed_cards");

                return metadataDoc.save();
            })
            .then((_) => {
                resolve({
                    success: true, status: 200,
                    message: `Card moved to the trash. <span class="underline_bold_text clickable" onclick="restoreCardFromTrash('${prevResults.card._id}', '${prevResults.card.urgency}')">Undo Action</span>`
                })
            })
            .catch((err) => { reject(err); });
    });
};

/**
 * @description Restore a card from the trash, back into the user's list of
 * current cards.
 * @param {JSON} restoreCardArgs Expected keys: `_id`, `createdById`
 * @returns {Promise} resolves with a JSON keyed by `success`, `status` and  
 * `message`
 */
exports.restoreCardFromTrash = function (restoreCardArgs) {
    let prevResults = {};

    return new Promise(function(resolve, reject) {
        Card
            .findOne({
                _id: restoreCardArgs._id, createdById: restoreCardArgs.createdById
            }).exec()
            .then((card) => {
                if (card === null) {
                    resolve({
                        success: false, status: 200, message: "Card wasn't found."
                    });
                } else {
                    prevResults.card = card;
                    return removeCardFromMetadataTrash(card);
                }
            })
            .then((metadataDoc) => {
                return updateMetadataWithCardDetails(prevResults.card, metadataDoc);
            })
            .then((modifiedMetadataDoc) => {
                return modifiedMetadataDoc.save();
            })
            .then((_) => {
                resolve({
                    success: true, status: 200,
                    message: `'${prevResults.card.title}' has been restored!`
                })
            })
            .catch((err) => { reject(err); });
    });
};

/**
 * @description Permanently delete a card from the user's trash.
 * 
 * @param {JSON} restoreCardArgs Expected keys: `_id`, `createdById`
 * @returns {Promise} resolves with a JSON keyed by `success`, `status` and  
 * `message`
 */
exports.deleteCardFromTrash = function(deleteCardArgs) {
    return new Promise(function(resolve, reject) {
        Card
            .findOneAndRemove({
                _id: deleteCardArgs._id,
                createdById: deleteCardArgs.createdById
            }).exec()
            .then((deletedCard) => {
                if (deletedCard === null) {
                    resolve({
                        success: false, status: 200, 
                        message: "The card wasn't found in the database."
                    });
                }   
                return removeCardFromMetadataTrash(deletedCard);
            })
            .then((modifiedMetadataDoc) => {
                return modifiedMetadataDoc.save();
            })
            .then((_) => {
                resolve({success: true, status: 200, message: `Card permanently deleted!`})
            })
            .catch((err) => { reject(err); });
    });
};

/**
 * @description Remove the card from the trash records of the metadata object. 
 * This method does not save the modified metadata into the database!
 * 
 * @param {JSON} cardIdentifier JSON object that contains the keys 
 * `createdById` and `_id`.
 * 
 * @returns {Promise} resolves with the modified metadata document. It is up to 
 * the callee to persist the saved metadata in the database. 
 */
function removeCardFromMetadataTrash(cardIdentifier) {
    return new Promise(function(resolve, reject) {
        Metadata
            .find({createdById: cardIdentifier.createdById}).exec()
            .then((matchingMetadataDocs) => {
                for (let i = 0; i < matchingMetadataDocs.length; i++) {
                    let metadataDoc = matchingMetadataDocs[i];
                    if (cardIdentifier._id in metadataDoc.trashed_cards[0]) {
                        delete metadataDoc.trashed_cards[0][cardIdentifier._id];
                        metadataDoc.markModified("trashed_cards");
                        resolve(metadataDoc);
                    }
                }
                reject(new Error(`${cardIdentifier} wasn't found in the metadata.`));
            })
            .catch((err) => { reject(err); });
    });
}

/**
 * @description Fetch all the user's cards and compile them into a JSON file.
 * 
 * @param {Number} userIDInApp The ID of the user whose cards should be exported
 * to a .json file.
 * 
 * @returns {Promise} resolves with two string arguments. The first one is a path 
 * to the written JSON file. The 2nd argument is the name of the JSON file.
 */
exports.writeCardsToJSONFile = function (userIDInApp) {
    let prevResults = {cardData: []};

    return new Promise(function(resolve, reject) {
        Card
            .find({ createdById: userIDInApp}).exec()
            .then((cards) => {
                for (let i = 0; i < cards.length; i++) {
                    prevResults.cardData.push({
                        title: cards[i].title, description: cards[i].description,
                        tags: cards[i].tags, urgency: cards[i].urgency,
                        createdAt: cards[i].createdAt, isPublic: cards[i].isPublic
                    });
                }

                prevResults.jsonFileName = `flashcards_${userIDInApp}.json`;
                prevResults.jsonFilePath = `${process.cwd()}/${jsonFileName}`;;

                return fs.open(prevResults.jsonFilePath, "w");
            })
            .then((fileDescriptor) => {
                prevResults.fileDescriptor = fileDescriptor;
                return fs.write(fileDescriptor, JSON.stringify(prevResults.cardData));
            })
            .then(() => {
                return fs.close(prevResults.fileDescriptor);
            })
            .then(() => {
                resolve([prevResults.jsonFilePath, prevResults.jsonFileName]);
            })
            .catch((err) => { reject(err); });
    });       
};

/**
 * @description Helper method for updating the metadata from a given card. This 
 * method does not persist the modified metadata document into the database. It 
 * is up to the callee to save the changes once they're done manipulating the 
 * metadata.
 * 
 * @param {JSON} savedCard The card that whose details should be added to the 
 * metadata.
 * @param {JSON} metadataDoc A Mongoose Schema object that is used to store the
 * current user's metadata.
 * @returns {Promise} resolved with a reference to the modified metadata doc 
 */
function updateMetadataWithCardDetails(savedCard, metadataDoc) {

    let urgency = savedCard.urgency;
    let cardID = savedCard._id;

    if (metadataDoc.stats.length == 0) metadataDoc.stats.push({});

    if (metadataDoc.node_information.length == 0) {
        metadataDoc.node_information.push({});
    }

    let metadataStats = metadataDoc.stats[0];
    let metadataNodeInfo = metadataDoc.node_information[0];

    // Save this card in the stats field where it only appears once
    if (metadataStats[cardID] === undefined) metadataStats[cardID] = {};
    metadataStats[cardID].urgency = urgency;
    metadataDoc.markModified("stats");

    // Keep track of which tags have been changed
    let prevTagStillExists = {};
    if (savedCard.previousTags) {
        savedCard.previousTags.split(" ").forEach(prevTag => {
            if (prevTag !== "") {
                prevTag = prevTag.trim();
                prevTagStillExists[prevTag] = false;
            }
        });
    }

    // Save the card's id in each tag that it has
    if (savedCard.tags) {
        savedCard.tags.split(" ").forEach(tag => {
            let strippedTag = tag.trim();
            if (strippedTag !== "") {
                // If we've not seen this tag before, create its node
                if (metadataNodeInfo[strippedTag] === undefined) {
                    metadataNodeInfo[strippedTag] = {};
                }

                // If we've not seen this card under this tag, add it
                if (metadataNodeInfo[strippedTag][cardID] === undefined) {
                    metadataNodeInfo[strippedTag][cardID] = {};
                }

                // If this tag was in the previous version of the card, flag it
                if (strippedTag in prevTagStillExists) {
                    prevTagStillExists[strippedTag] = true;
                }

                metadataNodeInfo[strippedTag][cardID].urgency = urgency;
            }
        });
    }
    metadataDoc.markModified("node_information");

    // Get rid of all tags that were deleted in the current card
    Object.keys(prevTagStillExists).forEach((prevTag) => {
        if (!prevTagStillExists[prevTag]) {
            delete metadataNodeInfo[prevTag][cardID];
            if (Object.keys(metadataNodeInfo[prevTag]).length === 0) {
                delete metadataNodeInfo[prevTag];
            }
        }
    });
    
    return Promise.resolve(metadataDoc);
}

/**
 * @description Update the settings of the given user.
 * @param {JSON} newUserSettings Supported keys: 
 * @returns {Promise} resolves with a JSON keyed by `success`, `status` and  
 * `message`
 */
exports.updateUserSettings = function(newUserSettings) {

    let supportedChanges = new Set(["cardsAreByDefaultPrivate"]);
    let validChanges = [];
    Object.keys(newUserSettings).forEach((setting) => {
        if (supportedChanges.has(setting)) validChanges.push(setting);
    }) 

    return new Promise(function(resolve, reject) {
        if (validChanges.length == 0) {
            resolve({
                success: false, status: 200, message: "No changes were made."
            });
        }
        User
            .findOne({userIDInApp: newUserSettings.userIDInApp}).exec()
            .then((existingUser) => {
                if (existingUser === null) {
                    resolve({
                        message: "No user found. User settings not updated!",
                        success: false, status: 200
                    });
                }
                for (let i = 0; i < validChanges.length; i++) {
                    existingUser[validChanges[i]] = newUserSettings[validChanges[i]];
                }
                return existingUser.save();
            })
            .then((_) => {
                resolve({
                    message: "User settings updated!", success: true, status: 200
                });
            })
            .catch((err) => { reject(err); });
    });
}
