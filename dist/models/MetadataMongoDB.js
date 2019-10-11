"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * Handle actions related to the metadata of the cards in the database.
 *
 * @module
 */
var User = require("./mongoose_models/UserSchema.js");
var Metadata = require('./mongoose_models/MetadataCardSchema');
var Card = require('./mongoose_models/CardSchema.js');
var fs = require("fs");
var querySanitizer = require("./SanitizationAndValidation.js").sanitizeQuery;
var config = require("../config.js");
/**
 * @description Create & save a new metadata document for a user
 * @param {JSON} payload Must contain `userIDInApp` and `metadataIndex` as keys
 * @return {Promise} resolves with a JSON object with `success`, `status` and
 * `message` as keys.
 */
exports.create = function (payload) {
    payload = querySanitizer(payload);
    return new Promise(function (resolve, reject) {
        if (payload.userIDInApp === undefined || payload.metadataIndex === undefined) {
            reject(new Error("Please provide a userIDInApp and a metadataIndex."));
        }
        else {
            Metadata.count({
                createdById: payload.userIDInApp,
                metadataIndex: payload.metadataIndex
            }).exec()
                .then(function (count) {
                if (count >= 1) {
                    reject(new Error("The metadata document already exists."));
                }
                else {
                    return Metadata
                        .create({
                        createdById: payload.userIDInApp,
                        metadataIndex: payload.metadataIndex,
                        stats: [], node_information: []
                    });
                }
            })
                .then(function (savedMetadataDoc) {
                resolve({
                    success: true, status: 200, message: savedMetadataDoc
                });
            })
                .catch(function (err) { reject(err); });
        }
    });
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
    return new Promise(function (resolve, reject) {
        Metadata
            .find({ createdById: payload.userIDInApp }).exec()
            .then(function (metadataDocs) {
            resolve({
                success: true, status: 200, message: metadataDocs
            });
        })
            .catch(function (err) { reject(err); });
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
exports.update = function (savedCards, metadataQuery, attributeName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
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
                };
            }
            if (attributeName === undefined)
                attributeName = "urgency";
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var _this = this;
                    if (savedCards[0].createdById === undefined) {
                        reject(new Error("MetadataMongoDB.update() was called for a card without an owner"));
                        return;
                    }
                    Metadata
                        .findOne(metadataQuery).exec()
                        .then(function (metadataDoc) {
                        savedCards.forEach(function (savedCard) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, updateMetadataWithCardDetails(savedCard, metadataDoc, attributeName)];
                                    case 1:
                                        metadataDoc = _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        metadataDoc.markModified("stats");
                        metadataDoc.markModified("node_information");
                        return metadataDoc.save();
                    })
                        .then(function (savedMetadata) {
                        resolve({ success: true, status: 200, message: savedMetadata });
                    })
                        .catch(function (err) { reject(err); });
                })];
        });
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
exports.updatePublicUserMetadata = function (cards) {
    var cardsToAdd = [], cardsToRemove = [];
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].isPublic)
            cardsToAdd.push(cards[i]);
        else
            cardsToRemove.push(cards[i]);
    }
    return new Promise(function (resolve, reject) {
        var _this = this;
        User
            .findOne({ username: config.PUBLIC_USER_USERNAME }).exec()
            .then(function (publicUser) { return __awaiter(_this, void 0, void 0, function () {
            var query, metadataDocs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(cardsToAdd.length > 0)) return [3 /*break*/, 1];
                        query = {
                            createdById: publicUser.userIDInApp,
                            metadataIndex: 0 // Because this is the first document
                        };
                        return [2 /*return*/, exports.update(cardsToAdd, query, "numChildren")];
                    case 1: return [4 /*yield*/, exports.read({ userIDInApp: publicUser.userIDInApp })];
                    case 2:
                        metadataDocs = _a.sent();
                        return [2 /*return*/, Promise.resolve({
                                message: metadataDocs.message[0], success: true
                            })];
                }
            });
        }); })
            .then(function (updateConfirmation) {
            if (!updateConfirmation.success) {
                return Promise.reject(updateConfirmation.message);
            }
            var metadataDoc = updateConfirmation.message;
            var metadataStats = metadataDoc.stats[0];
            var metadataNodeInfo = metadataDoc.node_information[0];
            var _loop_1 = function (j) {
                var cardID = cardsToRemove[j]._id;
                // Remove the card from the lists that the user previews from
                cardsToRemove[j].tags.split(" ").forEach(function (tagToRemove) {
                    tagToRemove = tagToRemove.trim();
                    if (tagToRemove !== "" && metadataNodeInfo[tagToRemove]) {
                        delete metadataNodeInfo[tagToRemove][cardID];
                        if (Object.keys(metadataNodeInfo[tagToRemove]).length === 0) {
                            delete metadataNodeInfo[tagToRemove];
                        }
                    }
                });
                delete metadataStats[cardID];
            };
            for (var j = 0; j < cardsToRemove.length; j++) {
                _loop_1(j);
            }
            metadataDoc.markModified("stats");
            metadataDoc.markModified("node_information");
            return metadataDoc.save();
        })
            .then(function (savedMetadata) {
            resolve({ success: true, message: savedMetadata, status: 200 });
        })
            .catch(function (err) { reject(err); });
    });
};
/**
 * @description Delete all the metadata associated with the user.
 * @param {JSON} payload Contains `userIDInApp` as a key
 * @returns {Promise} resolves with a JSON object keyed by `success`, `status`
 * and `message`
 */
exports.deleteAllMetadata = function (payload) {
    payload = querySanitizer(payload);
    return new Promise(function (resolve, reject) {
        Metadata
            .deleteMany({ createdById: payload.userIDInApp }).exec()
            .then(function (deleteConfirmation) {
            resolve({ success: true, status: 200, message: deleteConfirmation });
        })
            .catch(function (err) { reject(err); });
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
    var prevResults = {};
    return new Promise(function (resolve, reject) {
        Card
            .findOne({ _id: payload.cardID, createdById: payload.createdById }).exec()
            .then(function (card) {
            if (card === null) {
                resolve({
                    success: false, status: 200, message: "The card wasn't found"
                });
            }
            if (card.metadataIndex === undefined)
                card.metadataIndex = 0;
            prevResults.card = card;
            return Metadata.findOne({
                createdById: card.createdById, metadataIndex: card.metadataIndex
            }).exec();
        })
            .then(function (metadataDoc) {
            var metadataStats = metadataDoc.stats[0];
            var metadataNodeInfo = metadataDoc.node_information[0];
            var trashedCardID = prevResults.card._id;
            // Remove the card from the lists that the user previews from
            prevResults.card.tags.split(" ").forEach(function (tagToRemove) {
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
            .then(function (_) {
            resolve({
                success: true, status: 200,
                message: "Card moved to the trash. <span class=\"underline_bold_text clickable\" onclick=\"restoreCardFromTrash('" + prevResults.card._id + "', '" + prevResults.card.urgency + "')\">Undo Action</span>"
            });
        })
            .catch(function (err) { reject(err); });
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
    var prevResults = {};
    restoreCardArgs = querySanitizer(restoreCardArgs);
    return new Promise(function (resolve, reject) {
        Card
            .findOne({
            _id: restoreCardArgs.cardID, createdById: restoreCardArgs.createdById
        }).exec()
            .then(function (card) {
            if (card === null) {
                resolve({
                    success: false, status: 200, message: "Card wasn't found."
                });
            }
            else {
                prevResults.card = card;
                return removeCardFromMetadataTrash(card);
            }
        })
            .then(function (metadataDoc) {
            return updateMetadataWithCardDetails(prevResults.card, metadataDoc);
        })
            .then(function (modifiedMetadataDoc) {
            return modifiedMetadataDoc.save();
        })
            .then(function (_) {
            resolve({
                success: true, status: 200,
                message: "'" + prevResults.card.title + "' has been restored!"
            });
        })
            .catch(function (err) { reject(err); });
    });
};
/**
 * @description Permanently delete a card from the user's trash.
 *
 * @param {JSON} restoreCardArgs Expected keys: `cardID`, `createdById`
 * @returns {Promise} resolves with a JSON keyed by `success`, `status` and
 * `message`
 */
exports.deleteCardFromTrash = function (deleteCardArgs) {
    deleteCardArgs = querySanitizer(deleteCardArgs);
    return new Promise(function (resolve, reject) {
        Card
            .findOneAndRemove({
            _id: deleteCardArgs.cardID,
            createdById: deleteCardArgs.createdById
        }).exec()
            .then(function (deletedCard) {
            if (deletedCard === null) {
                resolve({
                    success: false, status: 200,
                    message: "The card wasn't found in the database."
                });
            }
            return removeCardFromMetadataTrash(deletedCard);
        })
            .then(function (modifiedMetadataDoc) {
            return modifiedMetadataDoc.save();
        })
            .then(function (_) {
            resolve({ success: true, status: 200, message: "Card permanently deleted!" });
        })
            .catch(function (err) { reject(err); });
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
    return new Promise(function (resolve, reject) {
        Metadata
            .find({ createdById: cardIdentifier.createdById }).exec()
            .then(function (matchingMetadataDocs) {
            if (matchingMetadataDocs.length === 0)
                resolve({});
            for (var i = 0; i < matchingMetadataDocs.length; i++) {
                var metadataDoc = matchingMetadataDocs[i];
                if (cardIdentifier._id in metadataDoc.trashed_cards[0]) {
                    delete metadataDoc.trashed_cards[0][cardIdentifier._id];
                    metadataDoc.markModified("trashed_cards");
                    resolve(metadataDoc);
                    return;
                }
            }
            resolve(matchingMetadataDocs[0]);
        })
            .catch(function (err) { reject(err); });
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
    var query = sanitizeQuery({ userIDInApp: userIDInApp });
    return new Promise(function (resolve, reject) {
        Card
            .find({ createdById: query.userIDInApp }).exec()
            .then(function (cards) {
            var cardData = [];
            for (var i = 0; i < cards.length; i++) {
                cardData.push({
                    title: cards[i].title, description: cards[i].description,
                    tags: cards[i].tags, urgency: cards[i].urgency,
                    createdAt: cards[i].createdAt, isPublic: cards[i].isPublic
                });
            }
            var jsonFileName = "flashcards_" + userIDInApp + ".json";
            var jsonFilePath = process.cwd() + "/" + jsonFileName;
            ;
            fs.open(jsonFilePath, "w", function (err, fileDescriptor) {
                if (err) {
                    reject(err);
                }
                else {
                    fs.write(fileDescriptor, JSON.stringify(cardData), function (writeErr) {
                        if (writeErr) {
                            reject(writeErr);
                        }
                        else {
                            fs.close(fileDescriptor, function (closeErr) {
                                if (closeErr) {
                                    reject(closeErr);
                                }
                                else {
                                    resolve([jsonFilePath, jsonFileName]);
                                }
                            });
                        }
                    });
                }
            });
        })
            .catch(function (err) { reject(err); });
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
    var sortableAttribute;
    if (attributeName === undefined) {
        sortableAttribute = savedCard.urgency;
    }
    else if (attributeName === "numChildren") {
        sortableAttribute = savedCard.idsOfUsersWithCopy.split(", ").length;
    }
    else {
        sortableAttribute = savedCard[attributeName];
    }
    var cardID = savedCard._id;
    if (metadataDoc.stats.length == 0)
        metadataDoc.stats.push({});
    if (metadataDoc.node_information.length == 0) {
        metadataDoc.node_information.push({});
    }
    var metadataStats = metadataDoc.stats[0];
    var metadataNodeInfo = metadataDoc.node_information[0];
    // Save this card in the stats field where it only appears once
    if (metadataStats[cardID] === undefined)
        metadataStats[cardID] = {};
    metadataStats[cardID].urgency = sortableAttribute;
    metadataDoc.markModified("stats");
    // Keep track of which tags have been changed
    var prevTagStillExists = {};
    if (savedCard.previousTags) {
        savedCard.previousTags.split(" ").forEach(function (prevTag) {
            if (prevTag !== "") {
                prevTag = prevTag.trim();
                prevTagStillExists[prevTag] = false;
            }
        });
    }
    // Save the card's id in each tag that it has
    if (savedCard.tags) {
        savedCard.tags.split(" ").forEach(function (tag) {
            var strippedTag = tag.trim();
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
    Object.keys(prevTagStillExists).forEach(function (prevTag) {
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
exports.updateUserSettings = function (newUserSettings) {
    newUserSettings = querySanitizer(newUserSettings);
    var supportedChanges = new Set(["cardsAreByDefaultPrivate", "dailyTarget"]);
    var validChanges = [];
    Object.keys(newUserSettings).forEach(function (setting) {
        if (supportedChanges.has(setting))
            validChanges.push(setting);
    });
    return new Promise(function (resolve, reject) {
        if (validChanges.length == 0) {
            resolve({
                success: false, status: 200, message: "No changes were made."
            });
        }
        var updatedUser;
        User
            .findOne({ userIDInApp: newUserSettings.userIDInApp }).exec()
            .then(function (existingUser) {
            if (existingUser === null) {
                resolve({
                    message: "No user found. User settings not updated!",
                    success: false, status: 200
                });
            }
            for (var i = 0; i < validChanges.length; i++) {
                existingUser[validChanges[i]] = newUserSettings[validChanges[i]];
            }
            return existingUser.save();
        })
            .then(function (saveResults) {
            updatedUser = saveResults;
            if (newUserSettings.dailyTarget) {
                return Metadata.findOne({
                    createdById: newUserSettings.userIDInApp, metadataIndex: 0
                }).exec();
            }
            else {
                resolve({
                    message: "User settings updated!", success: true,
                    status: 200, user: updatedUser
                });
            }
        })
            .then(function (metadataDoc) {
            if (newUserSettings.dailyTarget) {
                metadataDoc.streak.set("dailyTarget", newUserSettings.dailyTarget);
                metadataDoc.markModified("streak");
            }
            return metadataDoc.save();
        })
            .then(function (_) {
            resolve({
                message: "User settings updated!", success: true,
                status: 200, user: updatedUser
            });
        })
            .catch(function (err) { reject(err); });
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
exports.updateStreak = function (streakUpdateObj) {
    streakUpdateObj = querySanitizer(streakUpdateObj);
    return new Promise(function (resolve, reject) {
        Metadata
            .findOne({ createdById: streakUpdateObj.userIDInApp, metadataIndex: 0 }).exec()
            .then(function (metadataDoc) {
            var idsReviewedCards = new Set(metadataDoc.streak.get("cardIDs"));
            for (var _i = 0, _a = streakUpdateObj.cardIDs; _i < _a.length; _i++) {
                var cardID = _a[_i];
                idsReviewedCards.add(cardID);
            }
            metadataDoc.streak.set('cardIDs', Array.from(idsReviewedCards));
            metadataDoc.markModified("streak");
            return metadataDoc.save();
        })
            .then(function (savedMetadataDoc) {
            resolve({
                message: savedMetadataDoc.streak, success: true, status: 200
            });
        })
            .catch(function (err) { reject(err); });
    });
};
