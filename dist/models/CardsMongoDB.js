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
 * Handle card-related activities, e.g. CRUD operations.
 *
 * @module
 */
var Card = require('./mongoose_models/CardSchema.js');
var MetadataDB = require('./MetadataMongoDB.js');
var sanitizer = require("./SanitizationAndValidation.js");
var cardSanitizer = sanitizer.sanitizeCard;
var querySanitizer = sanitizer.sanitizeQuery;
/**
 * Create a new card and add it to the user's current cards.
 *
 * @param {JSON} payload Expected keys: `title`, `description`, `tags`,
 * `createdById`, `urgency`, `isPublic` and `parent`.
 *
 * @returns {Promise} takes a JSON object with `success`, `status` and `message`
 * as its keys. If successful, the message will contain the saved card.
 */
exports.create = function (payload) {
    return new Promise(function (resolve, reject) {
        var returnedValues = {};
        var sanitizedCard = cardSanitizer(payload);
        Card
            .create(sanitizedCard)
            .then(function (savedCard) {
            returnedValues.savedCard = savedCard;
            savedCard.previousTags = savedCard.tags;
            return MetadataDB.update([savedCard]);
        })
            .then(function (confirmation) {
            if (confirmation.success) {
                confirmation.message = returnedValues.savedCard;
            }
            returnedValues.saveConfirmation = confirmation;
            return MetadataDB.updatePublicUserMetadata([returnedValues.savedCard]);
        })
            .then(function (_) { resolve(returnedValues.saveConfirmation); })
            .catch(function (err) { if (err !== "DUMMY")
            reject(err); });
    });
};
/**
 * Create multiple cards at once
 *
 * @param {Array} unsavedCards An array of JSON objects keyed by `title`,
 * `description`, `tags`, `createdById`, `urgency`, `isPublic` and `parent`.
 *
 * @returns {Promise} takes a JSON object with `success`, `status` and `message`
 * as its keys. If successful, the message will be an array of the saved cards' IDs
 */
exports.createMany = function (unsavedCards) {
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function () {
            var savedCardsIDs, saveConfirmation, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        savedCardsIDs = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < unsavedCards.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, exports.create(unsavedCards[i]).catch(function (err) {
                                reject(err);
                                return;
                            })];
                    case 2:
                        saveConfirmation = _a.sent();
                        savedCardsIDs.push(saveConfirmation.message._id);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        resolve({
                            success: true, status: 200, message: savedCardsIDs
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
};
/**
 * Read a card(s) from the database.
 *
 * @param {JSON} payload Must contain `userIDInApp` as one of the keys.
 * If `_id` is not one of the keys, fetch all the user's cards.
 *
 * @param {String} projection The fields to return. Defaults to
 * `title description descriptionHTML tags urgency createdById isPublic`
 *
 * @returns {Promise} resolves with a JSON doc with `success`, `status` and
 * `message` as keys. If successful, `message` will be an array of all matching
 * cards.
 */
exports.read = function (payload, projection) {
    if (projection === void 0) { projection = "title description descriptionHTML tags urgency createdById isPublic"; }
    payload = querySanitizer(payload);
    var query = { createdById: payload.userIDInApp };
    if (payload.cardID !== undefined)
        query._id = payload.cardID;
    return new Promise(function (resolve, reject) {
        Card
            .find(query).select(projection).exec()
            .then(function (cards) {
            resolve({
                success: true, status: 200, message: cards
            });
        })
            .catch(function (err) { reject(err); });
    });
};
/**
 * Update an existing card. Some fields of the card are treated as constants,
 * e.g. `createdById` and `createdAt`
 *
 * @param {JSON} cardJSON The parts of the card that have been updated. Must
 * include `cardID` as an attribute, otherwise no changes will be made.
 *
 * @returns {Promise} resolves with a JSON doc with `success`, `status` and
 * `message` as keys. If successful, `message` will be the updated card.
 */
exports.update = function (cardJSON) {
    var prevResults = {};
    var EDITABLE_ATTRIBUTES = new Set([
        "title", "description", "descriptionHTML", "tags", "urgency", "isPublic",
        "numTimesMarkedAsDuplicate", "numTimesMarkedForReview"
    ]);
    var query = querySanitizer({ cardID: cardJSON.cardID });
    cardJSON = cardSanitizer(cardJSON);
    // findByIdAndUpdate will give me the old, not the updated, document.
    // I need to find the card, save it, and then call MetadataDB.update if need be
    return new Promise(function (resolve, reject) {
        Card
            .findById(query.cardID).exec()
            .then(function (existingCard) {
            if (existingCard === null) {
                resolve({ success: false, status: 200, message: null });
            }
            else {
                prevResults.previousTags = existingCard.tags;
                Object.keys(cardJSON).forEach(function (cardKey) {
                    if (EDITABLE_ATTRIBUTES.has(cardKey)) {
                        existingCard[cardKey] = cardJSON[cardKey];
                    }
                });
                return existingCard.save();
            }
        })
            .then(function (savedCard) {
            if (cardJSON.hasOwnProperty("tags") || cardJSON.hasOwnProperty("urgency")) {
                savedCard.previousTags = prevResults.previousTags;
                prevResults.savedCard = savedCard;
                return MetadataDB.update([savedCard]);
            }
            else {
                prevResults.savedCard = savedCard;
                return Promise.resolve("DUMMY");
            }
        })
            .then(function (_) {
            return MetadataDB.updatePublicUserMetadata([prevResults.savedCard]);
        })
            .then(function (_) {
            resolve({ success: true, status: 200, message: prevResults.savedCard });
        })
            .catch(function (err) { reject(err); });
    });
};
/**
 * @description Remove this card from the database. We learned that we should
 * [never use a warning when we meant undo]{@link http://alistapart.com/article/neveruseawarning}.
 * Seems like a good design decision. Users who really want to delete a card
 * might be unsatisifed, but I bet they're in the minority(?). Furthermore,
 * they can permanently delete a card from the accounts page. Amazing how much
 * fiddling goes in the backend, just to allow a user to delete and then save
 * themselves 3 seconds later by hitting `Undo`.
 *
 * {@tutorial main.editing_cards}
 *
 * @param {JSON} payload The card to be removed
 * @return {Promise} resolves with a JSON keyed by `success`, `status` and
 * `message` as keys.
 */
exports.delete = function (payload) {
    payload = querySanitizer(payload);
    return new Promise(function (resolve, reject) {
        Card
            .findByIdAndRemove(payload.cardID).exec()
            .then(function (removedCard) {
            return MetadataDB.remove(removedCard);
        })
            .then(function (confirmation) {
            resolve(confirmation);
        })
            .catch(function (err) { reject(err); });
    });
};
/**
 * @description Search for cards with associated key words. Search should be
 * relevant and fast, erring on the side of relevance. Studying the docs helps
 * one make efficient queries and capture some low-hanging fruit. For instance,
 * using `where(some_js_expression)` in MongoDB is expensive because
 * `some_js_expression` will be evaluated for every document in the collection.
 * ~~Using regex inside the query itself is more efficient.~~ MongoDB supports
 * [text search]{@link https://docs.mongodb.com/v3.2/text-search/} and a 'sort
 * by relevance' function.
 *
 * @param {JSON} payload Expected keys: `key_words`, `createdById`
 * @returns {Promise} resolves with a JSON with `success`, `status` and `message`
 * as keys. If successful `message` will contain abbreviated cards that only
 * the `id`, `urgency` and `title` fields.
 */
exports.search = function (payload) {
    /**
     * $expr is faster than $where because it does not execute JavaScript
     * and should be preferred where possible. Note that the JS expression
     * is processed for EACH document in the collection. Yikes!
     */
    payload = querySanitizer(payload);
    if (payload.queryString !== undefined) {
        payload.queryString = splitTags(payload.queryString);
    }
    else {
        return Promise.resolve({ success: true, status: 200, message: [] });
    }
    var queryObject = {
        filter: {
            $and: [
                { createdById: payload.userIDInApp },
                { $text: { $search: payload.queryString } }
            ]
        },
        projection: "title tags urgency",
        limit: payload.limit,
        sortCriteria: { score: { $meta: "textScore" } }
    };
    return collectSearchResults(queryObject);
};
/**
 * @description Append a copy of the hyphenated/underscored words in the incoming
 * string without the hyphens/underscores. Useful for pre-processing search
 * queries. A person searching for `dynamic_programming` should be interested in
 * `dynamic programming` as well.
 *
 * @param {String} s a string that may contain hyphenated/underscored words, e.g
 * `arrays dynamic_programming iterative-algorithms`.
 *
 * @returns {String} a string with extra space delimited words, e.g.
 * `arrays dynamic_programming iterative-algorithms dynamic programming iterative algorithms`
 */
var splitTags = function (s) {
    var possibleTags = s.match(/[\w|\d]+(\_|-){1}[\w|\d]+/g);
    if (possibleTags === null)
        return s;
    for (var i = 0; i < possibleTags.length; i++) {
        s += " " + possibleTags[i].split(/[\_-]/g).join(" ");
    }
    return s;
};
/**
 * @description Search the database for cards matching the specified schema.
 * Return the results to the callback function that was passed in.
 *
 * @returns {Promise} resolves with a JSON object. If `success` is set, then
 * the `message` attribute will be an array of matching cards.
 */
var collectSearchResults = function (queryObject) {
    return new Promise(function (resolve, reject) {
        Card
            .find(queryObject.filter, queryObject.sortCriteria)
            .sort(queryObject.sortCriteria)
            .select(queryObject.projection)
            .limit(queryObject.limit)
            .exec()
            .then(function (cards) {
            resolve({ success: true, status: 200, message: cards });
        })
            .catch(function (err) { reject(err); });
    });
};
/**
 * @description Find cards that satisfy the given criteria and are publicly
 * viewable.
 *
 * @param {JSON} `payload` Supported keys include:
 *  - `userID`: The ID of the creator of the cards
 *  - `cardIDs`: A string of card IDs separated by a `,` without spaces
 *  - `cardID`: The ID of a single card. The same effect can be achieved with `cardIDs`
 *  - `queryString`: The keywords to look for. They are interpreted as tags
 *  - `creationStartDate`: The earliest date by which the cards were created
 *  - `creationEndDate`: The latest date for which the cards were created
 *
 * @returns {Promise} resolves with a JSON object. If `success` is set, then
 * the `message` attribute will be an array of matching cards.
 */
exports.publicSearch = function (payload) {
    payload = querySanitizer(payload);
    var mandatoryFields = [{ isPublic: true }];
    if (payload.userID !== undefined) {
        mandatoryFields.push({ createdById: payload.userID });
    }
    if (payload.cardIDs && typeof payload.cardIDs === "string") {
        payload.cardIDs = Array.from(payload.cardIDs.split(","));
    }
    if (payload.cardID)
        payload.cardIDs = [payload.cardID];
    if (payload.cardIDs !== undefined) {
        mandatoryFields.push({ _id: { $in: payload.cardIDs } });
    }
    if (payload.queryString !== undefined) {
        mandatoryFields.push({ $text: { $search: splitTags(payload.queryString) } });
    }
    if (payload.creationStartDate || payload.creationEndDate) {
        var dateQuery = {};
        if (payload.creationStartDate)
            dateQuery["$gt"] = payload.creationStartDate;
        if (payload.creationEndDate)
            dateQuery["$lt"] = payload.creationEndDate;
        mandatoryFields.push({ createdAt: dateQuery });
    }
    var queryObject = {
        filter: { $and: mandatoryFields },
        projection: "title tags",
        limit: payload.limit,
        sortCriteria: { score: { $meta: "textScore" } }
    };
    return collectSearchResults(queryObject);
};
/**
 * @description Read a card that has been set to 'public'
 * @param {JSON} payload The `card_id` property should be set to a valid ID
 * @returns {Promise} resolves with a JSON object. If `success` is set, then
 * the `message` attribute will contain a single-element array containing the
 * matching card if any.
 */
exports.readPublicCard = function (payload) {
    payload = querySanitizer(payload);
    return new Promise(function (resolve, reject) {
        if (payload.cardID === undefined) {
            resolve([{}]);
        }
        else {
            Card
                .findOne({ isPublic: true, _id: payload.cardID }).exec()
                .then(function (matchingCard) {
                resolve({
                    success: true, status: 200, message: [matchingCard]
                });
            })
                .catch(function (err) { reject(err); });
        }
    });
};
/**
 * @description Create a copy of the referenced card and add it to the user's
 * collection
 *
 * @param {JSON} payload The `cardID` and `userIDInApp` and
 * `cardsAreByDefaultPrivate` attributes should be set appropriately.
 *
 * @returns {Promise} takes a JSON object with `success`, `status` and `message`
 * as its keys. If successful, the message will contain the saved card. This
 * response is the same as that of `CardsMongoDB.create(payload)`.
 */
exports.duplicateCard = function (payload) {
    // Fetch the card to be duplicated
    return new Promise(function (resolve, reject) {
        var queryObject = querySanitizer({ _id: payload.cardID, isPublic: true });
        Card
            .findOne(queryObject).exec()
            .then(function (preExistingCard) {
            if (preExistingCard === null) {
                resolve({
                    success: false, status: 200, message: "Card not found!"
                });
                return Promise.reject("DUMMY");
            }
            else {
                var idsOfUsersWithCopy = new Set(preExistingCard.idsOfUsersWithCopy.split(", "));
                idsOfUsersWithCopy.add(payload.userIDInApp);
                preExistingCard.idsOfUsersWithCopy = Array.from(idsOfUsersWithCopy).join(", ");
                return preExistingCard.save();
            }
        })
            .then(function (savedPreExistingCard) {
            return exports.create({
                title: savedPreExistingCard.title,
                description: savedPreExistingCard.description,
                tags: savedPreExistingCard.tags,
                parent: savedPreExistingCard._id,
                createdById: payload.userIDInApp,
                isPublic: payload.cardsAreByDefaultPrivate
            });
        })
            .then(function (confirmation) { resolve(confirmation); })
            .catch(function (err) { if (err !== "DUMMY")
            reject(err); });
    });
};
/**
 * @description With public cards, it's possible that some malicious users may
 * upload objectionable cards. While we don't delete users' cards against their
 * will, we don't have an obligation to help them share such cards. When a card
 * gets flagged as inappropriate, it is excluded from search results in the
 * `/browse` page. We increase the counter of the specified file. This allows
 * moderators to deal with the most flagged cards first.
 *
 * @param {JSON} payload The `cardID` must be set. `markedForReview` and
 * `markedAsDuplicate` are optional. If set, they should be booleans.
 *
 * @returns {Promise} takes a JSON object with `success`, `status` and `message`
 * as its keys. If successful, the message will contain the saved card.
 */
exports.flagCard = function (payload) {
    payload = querySanitizer(payload);
    var flagsToUpdate = {};
    if (payload.markedForReview)
        flagsToUpdate.numTimesMarkedForReview = 1;
    if (payload.markedAsDuplicate)
        flagsToUpdate.numTimesMarkedAsDuplicate = 1;
    return new Promise(function (resolve, reject) {
        Card
            .findOneAndUpdate({ _id: payload.cardID }, { $inc: flagsToUpdate })
            .exec()
            .then(function (_) {
            resolve({
                status: 200, success: true, message: "Card flagged successfully!"
            });
        })
            .catch(function (err) {
            reject(err);
        });
    });
};
/**
 * @description Fetch the tags contained in the associated users cards.
 *
 * @param {JSON} payload Must contain `userIDInApp` as one of the keys.
 *
 * @returns {Promise} takes a JSON object with `success`, `status` and `message`
 * as its keys. If successful, the message will contain an array of arrays. Each
 * inner array will have tags that were found on a same card.
 */
exports.getTagGroupings = function (payload) {
    payload = querySanitizer(payload);
    return new Promise(function (resolve, reject) {
        Card
            .find({ createdById: payload.userIDInApp })
            .select("tags").exec()
            .then(function (cards) {
            var tagsArray = [];
            for (var i = 0; i < cards.length; i++) {
                tagsArray.push(cards[i].tags.split(" "));
            }
            resolve({
                success: true, message: tagsArray
            });
        })
            .catch(function (err) { reject(err); });
    });
};
/**
 * @description For uniformity, tags should be delimited by white-space. If a
 * tag has multiple words, then an underscore or hyphen can be used to delimit
 * the words themselves.
 *
 * Remember to add `require('./MongooseClient');` at the top of this file when
 * running this script as main.
 *
 */
var standardizeTagDelimiters = function () {
    var cursor = Card.find({}).cursor();
    cursor.on("data", function (card) {
        var currentCard = card; // In case of any race conditions...
        currentCard.tags = currentCard.tags.replace(/#/g, "");
        currentCard.save(function (err, savedCard) {
            if (err)
                console.log(err);
            else
                console.log(savedCard.title + " -> " + savedCard.tags);
        });
    });
    cursor.on("close", function () {
        console.log("Finished the operation");
    });
};
/**
 * @description The `descriptionHTML` field was introduced later on in the
 * project. To avoid conditionals for documents created before the change, this
 * method adds the `descriptionHTML` field to all cards in the database.
 *
 * @param {MongooseClient} connection An instance of the mongoose connection
 * object. Needed so that it can be closed at the end of the script.
 */
var insertDescriptionHTML = function (connection) {
    var cursor = Card.find({}).cursor();
    cursor.on("data", function (card) {
        var currentCard = card;
        currentCard = cardSanitizer(currentCard);
        currentCard.save(function (err, savedCard) {
            if (err)
                console.log(err);
            else
                console.log("Updated " + savedCard.title);
        });
    });
    cursor.on("close", function () {
        console.log("Finished the operation");
        connection.closeMongooseConnection();
    });
};
if (require.main === module) {
    var dbConnection = require("../models/MongooseClient.js");
    // standardizeTagDelimiters();
    insertDescriptionHTML(dbConnection);
}
