"use strict";
/**
 * Handle actions related to the metadata of the cards in the database.
 *
 * @module
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var UserSchema_1 = require("./mongoose_models/UserSchema");
var MetadataCardSchema_1 = require("./mongoose_models/MetadataCardSchema");
var CardSchema_1 = require("./mongoose_models/CardSchema");
var SanitizationAndValidation_1 = require("./SanitizationAndValidation");
var config_1 = require("../config");
/**
 * @description Create & save a new metadata document for the user. If
 * successful, the `message` attribute contains a `Metadata` object.
 */
function create(payload) {
    payload = SanitizationAndValidation_1.sanitizeQuery(payload);
    return new Promise(function (resolve, reject) {
        if (payload.userIDInApp === undefined || payload.metadataIndex === undefined) {
            reject(new Error("Please provide a userIDInApp and a metadataIndex."));
        }
        else {
            MetadataCardSchema_1.Metadata.count({
                createdById: payload.userIDInApp,
                metadataIndex: payload.metadataIndex
            }).exec()
                .then(function (count) {
                if (count >= 1) {
                    reject(new Error("The metadata document already exists."));
                }
                else {
                    return MetadataCardSchema_1.Metadata.create({
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
}
exports.create = create;
;
/**
 * @description Read all the metadata associated with a user's cards. If
 * successful, the `message` property has a `Metadata[]` value.
 */
function read(payload) {
    payload = SanitizationAndValidation_1.sanitizeQuery(payload);
    return new Promise(function (resolve, reject) {
        MetadataCardSchema_1.Metadata
            .find({ createdById: payload.userIDInApp }).exec()
            .then(function (metadataDocs) {
            resolve({
                success: true, status: 200, message: metadataDocs
            });
        })
            .catch(function (err) { reject(err); });
    });
}
exports.read = read;
;
// https://stackoverflow.com/questions/44497388/typescript-array-to-string-literal-type/54061487#54061487
var tuple = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args;
};
var cardProperties = tuple.apply(void 0, Object.keys(CardSchema_1.CardSchema.obj));
/**
 * @description Update the metadata with the new cards' details. This method
 * is usually called by CardsMongoDB.update(). An array of cards is needed to
 * avoid race conditions when updating metadata from more than one card. If the
 * call succeeds, the `message` attribute has a `Metadata` document.
 */
function update(savedCards, metadataQuery, statsKey) {
    if (statsKey === void 0) { statsKey = "urgency"; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            /*
             * How many cards before we need a new metadata JSON?
             * (400 + 150 * num_id_metadata) * 5 bytes/char <= 16MB
             * num_id_metadata <= 21330. So let's say 15,000 cards max to be safe.
             * Will that ever happen, probably not!
             */
            if (metadataQuery === undefined) {
                metadataQuery = {
                    createdById: savedCards[0].createdById,
                    metadataIndex: savedCards[0].metadataIndex || 0
                };
            }
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var _this = this;
                    if (savedCards[0].createdById === undefined) {
                        reject(new Error("MetadataMongoDB.update() was called for a card without an owner"));
                        return;
                    }
                    MetadataCardSchema_1.Metadata
                        .findOne(metadataQuery).exec()
                        .then(function (metadataDoc) {
                        savedCards.forEach(function (savedCard) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, updateMetadataWithCardDetails(savedCard, metadataDoc, statsKey)];
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
}
exports.update = update;
;
/**
 * @description Update the metadata for cards that can be viewed by anyone.
 *
 * @param cards A list of cards that changed. Some might have become private,
 * so we need to remove them from the metadata of the public user. Others might
 * have become public, so we need to add them to the public user's metadata.
 */
function updatePublicUserMetadata(cards) {
    var cardsToAdd = [];
    var cardsToRemove = [];
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].isPublic)
            cardsToAdd.push(cards[i]);
        else
            cardsToRemove.push(cards[i]);
    }
    return new Promise(function (resolve, reject) {
        var _this = this;
        UserSchema_1.User
            .findOne({ username: config_1.PUBLIC_USER_USERNAME }).exec()
            .then(function (publicUser) { return __awaiter(_this, void 0, void 0, function () {
            var query, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(cardsToAdd.length > 0)) return [3 /*break*/, 1];
                        query = {
                            createdById: publicUser.userIDInApp,
                            metadataIndex: 0 // Because this is the first document
                        };
                        return [2 /*return*/, update(cardsToAdd, query, "numChildren")];
                    case 1: return [4 /*yield*/, read({ userIDInApp: publicUser.userIDInApp })];
                    case 2:
                        msg = _a.sent();
                        return [2 /*return*/, Promise.resolve({
                                message: msg.message[0], success: true, status: 200
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
}
exports.updatePublicUserMetadata = updatePublicUserMetadata;
/**
 * @description Delete all the metadata associated with the user. If successful,
 * the `message` property holds the number of items deleted.
 */
function deleteAllMetadata(payload) {
    payload = SanitizationAndValidation_1.sanitizeQuery(payload);
    return new Promise(function (resolve, reject) {
        MetadataCardSchema_1.Metadata
            .deleteMany({ createdById: payload.userIDInApp }).exec()
            .then(function (deleteConfirmation) {
            resolve({
                success: true, status: 200,
                message: deleteConfirmation.deletedCount
            });
        })
            .catch(function (err) { reject(err); });
    });
}
exports.deleteAllMetadata = deleteAllMetadata;
;
/**
 * @description Send the card matching `payload` to the trash. The trash is
 * where cards that haven't been deleted permanently are tracked. We learned
 * that we should never use a warning when we meant undo.
 * {@link http://alistapart.com/article/neveruseawarning}.
 *
 * Seems like a good design decision. Users who really want to delete a card
 * might be unsatisifed, but I bet they're in the minority(?). Furthermore,
 * they can permanently delete a card from the accounts page. Amazing how much
 * fiddling goes in the backend, just to allow a user to delete and then save
 * themselves 3 seconds later by hitting `Undo`.
 *
 * @todo This method shouldn't have any HTML associated with it!
 *
 * @todo What happens when `cardID` gets scrubbed off by `sanitizeQuery`?
 */
function sendCardToTrash(payload) {
    payload = SanitizationAndValidation_1.sanitizeQuery(payload);
    var prevResults = {};
    return new Promise(function (resolve, reject) {
        CardSchema_1.Card
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
            return MetadataCardSchema_1.Metadata.findOne({
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
            if (!metadataDoc.trashed_cards) {
                metadataDoc.trashed_cards = [{}];
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
}
exports.sendCardToTrash = sendCardToTrash;
;
/**
 * @description Restore a card from the trash, back into the user's list of
 * current cards.
 *
 * @todo Return the restored card instead of a confirmatory string.
 */
function restoreCardFromTrash(restoreCardArgs) {
    var prevResults = {};
    restoreCardArgs = SanitizationAndValidation_1.sanitizeQuery(restoreCardArgs);
    return new Promise(function (resolve, reject) {
        CardSchema_1.Card
            .findOne({
            _id: restoreCardArgs.cardID, createdById: restoreCardArgs.createdById
        }).exec()
            .then(function (card) {
            if (card === null) {
                resolve({
                    success: false, status: 200, message: "Card wasn't found."
                });
                return;
            }
            else {
                prevResults.card = card;
                return removeCardFromMetadataTrash(card);
            }
            /** @todo: There's probably a bug here... */
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
}
exports.restoreCardFromTrash = restoreCardFromTrash;
;
/**
 * @description Permanently delete a card from the user's trash.
 *
 * @param {JSON} restoreCardArgs Expected keys: `cardID`, `createdById`
 * @returns {Promise} resolves with a JSON keyed by `success`, `status` and
 * `message`
 */
function deleteCardFromTrash(deleteCardArgs) {
    deleteCardArgs = SanitizationAndValidation_1.sanitizeQuery(deleteCardArgs);
    return new Promise(function (resolve, reject) {
        CardSchema_1.Card
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
                return;
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
}
exports.deleteCardFromTrash = deleteCardFromTrash;
;
/**
 * @description Remove the card from the trash records of the metadata object.
 * This method does not save the modified metadata into the database!
 *
 * @todo Why don't we save the metadata?
 */
function removeCardFromMetadataTrash(filter) {
    return new Promise(function (resolve, reject) {
        MetadataCardSchema_1.Metadata
            .find({ createdById: filter.createdById }).exec()
            .then(function (matchingMetadataDocs) {
            if (matchingMetadataDocs.length === 0) {
                resolve(null);
            }
            for (var i = 0; i < matchingMetadataDocs.length; i++) {
                var metadataDoc = matchingMetadataDocs[i];
                if (filter._id in metadataDoc.trashed_cards[0]) {
                    delete metadataDoc.trashed_cards[0][filter._id];
                    metadataDoc.markModified("trashed_cards");
                    resolve(metadataDoc);
                    return;
                }
            }
            resolve(null);
        })
            .catch(function (err) { reject(err); });
    });
}
/**
 * @description Fetch all the user's cards and compile them into a JSON file.
 *
 * @returns A promise that resolves with two string arguments. The first one is
 * a path to the written JSON file. The 2nd argument is the name of that JSON file.
 */
function writeCardsToJSONFile(userIDInApp) {
    var query = SanitizationAndValidation_1.sanitizeQuery({ userIDInApp: userIDInApp });
    return new Promise(function (resolve, reject) {
        CardSchema_1.Card
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
            /** Good Lord! What monstrosity did I write back then? */
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
}
exports.writeCardsToJSONFile = writeCardsToJSONFile;
;
/**
 * @description Helper method for updating the metadata with `savedCard`. This
 * method does not persist the modified metadata document into the database. It
 * is up to the callee to save the changes once they're done manipulating the
 * metadata.
 */
function updateMetadataWithCardDetails(savedCard, metadataDoc, attributeName) {
    if (attributeName === void 0) { attributeName = "urgency"; }
    var attributeValue = savedCard.get(attributeName);
    var cardID = savedCard._id;
    var metadataStats = metadataDoc.stats[0];
    var metadataNodeInfo = metadataDoc.node_information[0];
    // Save this card in the stats field where it only appears once
    if (metadataStats[cardID] === undefined) {
        metadataStats[cardID] = {};
    }
    else {
        metadataStats[cardID].urgency = attributeValue;
    }
    metadataDoc.markModified("stats");
    // Keep track of which tags have been changed
    var prevTagStillExists = {};
    if (savedCard.previousTags) {
        savedCard.previousTags.split(" ").forEach(function (prevTag) {
            if (prevTag !== "") {
                prevTag = prevTag.trim(); // @todo: Wait, what?
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
                metadataNodeInfo[strippedTag][cardID].urgency = attributeValue;
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
 * @description Update the profile settings of the given user. If settings were
 * updated (including overwriting with the same value), `success` is set and
 * `message` holds the updated `User` object.
 */
function updateUserSettings(newUserSettings) {
    newUserSettings = SanitizationAndValidation_1.sanitizeQuery(newUserSettings);
    var supportedChanges = new Set(["cardsAreByDefaultPrivate", "dailyTarget"]);
    var validSettingKeys = [];
    Object.keys(newUserSettings).forEach(function (setting) {
        if (supportedChanges.has(setting))
            validSettingKeys.push(setting);
    });
    return new Promise(function (resolve, reject) {
        if (validSettingKeys.length == 0) {
            resolve({
                success: false, status: 200, message: "No changes were made."
            });
        }
        var updatedUser;
        UserSchema_1.User
            .findOne({ userIDInApp: newUserSettings.userIDInApp }).exec()
            .then(function (existingUser) {
            if (existingUser === null) {
                resolve({
                    message: "No user found. User settings not updated!",
                    success: false, status: 200
                });
            }
            for (var i = 0; i < validSettingKeys.length; i++) {
                // @ts-ignore: I'm sure that the keys exist on the user obj
                existingUser[validSettingKeys[i]] = newUserSettings[validSettingKeys[i]];
            }
            return existingUser.save();
        })
            .then(function (savedUser) {
            updatedUser = savedUser;
            if (newUserSettings.dailyTarget) {
                return MetadataCardSchema_1.Metadata.findOne({
                    createdById: newUserSettings.userIDInApp, metadataIndex: 0
                }).exec();
            }
            else {
                resolve({
                    message: updatedUser, success: true, status: 200,
                });
                return;
            }
        })
            .then(function (metadataDoc) {
            if (newUserSettings.dailyTarget) {
                metadataDoc.streak.dailyTarget = newUserSettings.dailyTarget;
                metadataDoc.markModified("streak");
            }
            return metadataDoc.save();
        })
            .then(function (_) {
            resolve({
                message: updatedUser, success: true, status: 200
            });
        })
            .catch(function (err) { reject(err); });
    });
}
exports.updateUserSettings = updateUserSettings;
;
/**
 * @description Update the streak object for the current user. Assumes that the
 * streak object is up to date. If successful, the `message` property holds a
 * streak object.
 */
function updateStreak(streakUpdateObj) {
    streakUpdateObj = SanitizationAndValidation_1.sanitizeQuery(streakUpdateObj);
    return new Promise(function (resolve, reject) {
        MetadataCardSchema_1.Metadata
            .findOne({ createdById: streakUpdateObj.userIDInApp, metadataIndex: 0 }).exec()
            .then(function (metadataDoc) {
            var idsReviewedCards = new Set(metadataDoc.streak.cardIDs);
            for (var _i = 0, _a = streakUpdateObj.cardIDs; _i < _a.length; _i++) {
                var cardID = _a[_i];
                idsReviewedCards.add(cardID);
            }
            metadataDoc.streak.cardIDs = Array.from(idsReviewedCards);
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
}
exports.updateStreak = updateStreak;
;
//# sourceMappingURL=MetadataMongoDB.js.map