"use strict";

/**
 * Handle actions related to the metadata of the cards in the database.
 *
 * @module
 */

const User = require("./mongoose_models/UserSchema.js");
const Metadata = require('./mongoose_models/MetadataCardSchema');
const Card = require('./mongoose_models/CardSchema.js');
const fs = require("fs");
const querySanitizer = require("./SanitizationAndValidation.js").sanitizeQuery;
const config = require("../config.js");

/**
 * @description Create & save a new metadata document for a user
 * @param {JSON} payload Must contain `userIDInApp` and `metadataIndex` as keys
 * @return {Promise} resolves with a JSON object with `success`, `status` and
 * `message` as keys.
 */
exports.create = function (payload) {
    payload = querySanitizer(payload);
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
    payload = querySanitizer(payload);
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
 * Update the metadata with the new cards' details. This method
 * is usually called by CardsMongoDB.update(). An array is needed to prevent
 * race conditions when updating metadata from more than one card.
 *
 * @param {Array} savedCards Array of cards
 *
 * @param {JSON} metadataQuery An identifier for the metadata document. This
 * argument was added in order to update the global public user account. If not
 * specified, it defaults to the owner of the first card in `savedCards`.
 *
 * @param {String} attributeName A sortable attribute of the card that will be
 * used to rank the cards in the metadata. Possible values include `urgency`,
 * `numChildren`.
 *
 * @returns {Promise} resolves with a JSON with `success`, `status` and
 * `message` as keys. If successful, `message` has a metadata JSON object.
 */
exports.update = async function (savedCards, metadataQuery, attributeName) {
    /*
     * How many cards before we need a new metadata JSON?
     * (400 + 150 * num_id_metadata) * 5 bytes/char <= 16MB
     * num_id_metadata <= 21330. So let's say 15,000 cards max
     * Will that ever happen, probably not!
     */
    if (savedCards[0].metadataIndex === undefined) {
        savedCards[0].metadataIndex = 0;
    }

    if (metadataQuery === undefined) {
        metadataQuery = {
            createdById: savedCards[0].createdById,
            metadataIndex: savedCards[0].metadataIndex
        }
    }

    if (attributeName === undefined) attributeName = "urgency";

    return new Promise(function(resolve, reject) {
        if (savedCards[0].createdById === undefined) {
            reject(
                new Error("MetadataMongoDB.update() was called for a card without an owner")
            );
            return;
        }
        Metadata
            .findOne(metadataQuery).exec()
            .then((metadataDoc) => {
                savedCards.forEach(async (savedCard) => {
                    metadataDoc = await updateMetadataWithCardDetails(
                        savedCard, metadataDoc, attributeName
                    );
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
 * @description Update the metadata for a public card.
 *
 * @param {Array} cards an array of JSON flashcards
 *
 * @returns {Promise} resolves with a JSON with `success`, `status` and
 * `message` as keys. If successful, `message` has a metadata JSON object.
 *
 */
exports.updatePublicUserMetadata = function(cards) {

    let cardsToAdd = [], cardsToRemove = [];
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].isPublic) cardsToAdd.push(cards[i]);
        else cardsToRemove.push(cards[i]);
    }

    return new Promise(function(resolve, reject) {
        User
            .findOne({username: config.PUBLIC_USER_USERNAME}).exec()
            .then(async (publicUser) => {
                if (cardsToAdd.length > 0) {
                    let query = {
                        createdById: publicUser.userIDInApp,
                        metadataIndex: 0 // Because this is the first document
                    };
                    return exports.update(cardsToAdd, query, "numChildren");
                } else {
                    let metadataDocs = await exports.read({userIDInApp: publicUser.userIDInApp});
                    return Promise.resolve({
                        message: metadataDocs.message[0], success: true
                    });
                }
            })
            .then((updateConfirmation) => {
                if (!updateConfirmation.success) {
                    return Promise.reject(updateConfirmation.message);
                }
                let metadataDoc = updateConfirmation.message;
                let metadataStats = metadataDoc.stats[0];
                let metadataNodeInfo = metadataDoc.node_information[0];
                for (let j = 0; j < cardsToRemove.length; j++) {
                    let cardID = cardsToRemove[j]._id;
                    // Remove the card from the lists that the user previews from
                    cardsToRemove[j].tags.split(" ").forEach(tagToRemove => {
                        tagToRemove = tagToRemove.trim();
                        if (tagToRemove !== "" && metadataNodeInfo[tagToRemove]) {
                            delete metadataNodeInfo[tagToRemove][cardID];
                            if (Object.keys(metadataNodeInfo[tagToRemove]).length === 0) {
                                delete metadataNodeInfo[tagToRemove];
                            }
                        }
                    });
                    delete metadataStats[cardID];
                }

                metadataDoc.markModified("stats");
                metadataDoc.markModified("node_information");
                return metadataDoc.save();
            })
            .then((savedMetadata) => {
                resolve({success: true, message: savedMetadata, status: 200});
            })
            .catch((err) => { reject(err); });
    });

}

/**
 * @description Delete all the metadata associated with the user.
 * @param {JSON} payload Contains `userIDInApp` as a key
 * @returns {Promise} resolves with a JSON object keyed by `success`, `status`
 * and `message`
 */
exports.deleteAllMetadata = function (payload) {
    payload = querySanitizer(payload);
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
 * @param {JSON} payload Must contain `cardID` that has the id of the card
 * to be placed into trash, and `userIDInApp`, the ID of the user who owns
 * the card.
 * @returns {Promise} resolves with a JSON keyed by `success`, `status` and
 * `message`
 */
exports.sendCardToTrash = function (payload) {
    payload = querySanitizer(payload);
    let prevResults = {};
    return new Promise(function(resolve, reject) {
        Card
            .findOne({_id: payload.cardID, createdById: payload.createdById}).exec()
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
 * @param {JSON} restoreCardArgs Expected keys: `cardID`, `createdById`
 * @returns {Promise} resolves with a JSON keyed by `success`, `status` and
 * `message`
 */
exports.restoreCardFromTrash = function (restoreCardArgs) {
    let prevResults = {};
    restoreCardArgs = querySanitizer(restoreCardArgs);

    return new Promise(function(resolve, reject) {
        Card
            .findOne({
                _id: restoreCardArgs.cardID, createdById: restoreCardArgs.createdById
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
 * @param {JSON} restoreCardArgs Expected keys: `cardID`, `createdById`
 * @returns {Promise} resolves with a JSON keyed by `success`, `status` and
 * `message`
 */
exports.deleteCardFromTrash = function(deleteCardArgs) {
    deleteCardArgs = querySanitizer(deleteCardArgs);
    return new Promise(function(resolve, reject) {
        Card
            .findOneAndRemove({
                _id: deleteCardArgs.cardID,
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
                if (matchingMetadataDocs.length === 0) resolve({});
                for (let i = 0; i < matchingMetadataDocs.length; i++) {
                    let metadataDoc = matchingMetadataDocs[i];
                    if (cardIdentifier._id in metadataDoc.trashed_cards[0]) {
                        delete metadataDoc.trashed_cards[0][cardIdentifier._id];
                        metadataDoc.markModified("trashed_cards");
                        resolve(metadataDoc);
                        return;
                    }
                }
                resolve(matchingMetadataDocs[0]);
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
    let query = sanitizeQuery({userIDInApp: userIDInApp});
    return new Promise(function(resolve, reject) {
        Card
            .find({ createdById: query.userIDInApp}).exec()
            .then((cards) => {
                let cardData = [];
                for (let i = 0; i < cards.length; i++) {
                    cardData.push({
                        title: cards[i].title, description: cards[i].description,
                        tags: cards[i].tags, urgency: cards[i].urgency,
                        createdAt: cards[i].createdAt, isPublic: cards[i].isPublic
                    });
                }

                let jsonFileName = `flashcards_${userIDInApp}.json`;
                let jsonFilePath = `${process.cwd()}/${jsonFileName}`;;

                fs.open(jsonFilePath, "w", (err, fileDescriptor) => {
                    if (err) { reject(err); }
                    else {
                        fs.write(fileDescriptor, JSON.stringify(cardData), (writeErr) => {
                            if (writeErr) {
                                reject(writeErr);
                            } else {
                                fs.close(fileDescriptor, (closeErr) => {
                                    if (closeErr) {
                                        reject(closeErr);
                                    } else {
                                        resolve([jsonFilePath, jsonFileName]);
                                    }
                                });
                            }
                        });
                    }
                });
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
 * @param {String}
 * @returns {Promise} resolved with a reference to the modified metadata doc
 */
function updateMetadataWithCardDetails(savedCard, metadataDoc, attributeName) {

    let sortableAttribute;
    if (attributeName === undefined) {
        sortableAttribute = savedCard.urgency;
    } else if (attributeName === "numChildren") {
        sortableAttribute = savedCard.idsOfUsersWithCopy.split(", ").length;
    } else {
        sortableAttribute = savedCard[attributeName];
    }
    let cardID = savedCard._id;

    if (metadataDoc.stats.length == 0) metadataDoc.stats.push({});

    if (metadataDoc.node_information.length == 0) {
        metadataDoc.node_information.push({});
    }

    let metadataStats = metadataDoc.stats[0];
    let metadataNodeInfo = metadataDoc.node_information[0];

    // Save this card in the stats field where it only appears once
    if (metadataStats[cardID] === undefined) metadataStats[cardID] = {};
    metadataStats[cardID].urgency = sortableAttribute;
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

                metadataNodeInfo[strippedTag][cardID].urgency = sortableAttribute;
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
    newUserSettings = querySanitizer(newUserSettings);

    let supportedChanges = new Set(["cardsAreByDefaultPrivate", "dailyTarget"]);
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
        let updatedUser;

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
            .then((saveResults) => {
                updatedUser = saveResults;
                if (newUserSettings.dailyTarget) {
                    return Metadata.findOne({
                        createdById: newUserSettings.userIDInApp, metadataIndex: 0
                    }).exec();
                } else {
                    resolve({
                        message: "User settings updated!", success: true,
                        status: 200, user: updatedUser
                    });
                }
            })
            .then((metadataDoc) => {
                if (newUserSettings.dailyTarget) {
                    metadataDoc.streak.set("dailyTarget", newUserSettings.dailyTarget);
                    metadataDoc.markModified("streak");
                }
                return metadataDoc.save();
            })
            .then((_) => {
                resolve({
                    message: "User settings updated!", success: true,
                    status: 200, user: updatedUser
                });
            })
            .catch((err) => { reject(err); });
    });
};

/**
 * @description Update the streak object for the current user. Assumes that the
 * streak object is up to date.
 *
 * @param {JSON} streakUpdateObj Expected properties: `userIDInApp`, `cardIDs`
 *
 * @returns {Object} the saved metadata object with the updated streak
 */
exports.updateStreak = function(streakUpdateObj) {
    streakUpdateObj = querySanitizer(streakUpdateObj);
    return new Promise(function(resolve, reject) {
        Metadata
            .findOne({createdById: streakUpdateObj.userIDInApp, metadataIndex: 0}).exec()
            .then((metadataDoc) => {
                let idsReviewedCards = new Set(metadataDoc.streak.get("cardIDs"));
                for (let cardID of streakUpdateObj.cardIDs) {
                    idsReviewedCards.add(cardID);
                }
                metadataDoc.streak.set('cardIDs', Array.from(idsReviewedCards));
                metadataDoc.markModified("streak");
                return metadataDoc.save();
            })
            .then((savedMetadataDoc) => {
                resolve({
                    message: savedMetadataDoc.streak, success: true, status: 200
                });
            })
            .catch((err) => { reject(err); });
    });

};
