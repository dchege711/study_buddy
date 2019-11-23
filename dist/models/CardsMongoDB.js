"use strict";
/**
 * Handle card-related activities, e.g. CRUD operations.
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
var CardSchema_1 = require("./mongoose_models/CardSchema");
var MetadataDB = require("./MetadataMongoDB");
var SanitizationAndValidation_1 = require("./SanitizationAndValidation");
/**
 * @description Create a new card and add it to the user's current cards. If
 * successful, the `message` property holds the newly saved card.
 */
function create(newCard) {
    return new Promise(function (resolve, reject) {
        var savedCard;
        newCard = SanitizationAndValidation_1.sanitizeCard(newCard);
        CardSchema_1.Card
            .create(newCard)
            .then(function (card) {
            card.previousTags = card.tags;
            savedCard = card;
            return MetadataDB.update([savedCard], { createdById: card.createdById, metadataIndex: 0 });
        })
            .then(function (confirmation) {
            if (confirmation.success) {
                return MetadataDB.updatePublicUserMetadata([savedCard]);
            }
            else {
                return Promise.resolve(null);
            }
        })
            .then(function (_) {
            resolve({ success: true, status: 200, message: savedCard });
        })
            /** @todo: Get rid of this workaround */
            .catch(function (err) { if (err !== "DUMMY")
            reject(err); });
    });
}
exports.create = create;
;
/**
 * Create multiple cards at once. If successful, the `message` attribute will
 * be an array of the IDs of the saved cards.
 */
function createMany(newCards) {
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
                        if (!(i < newCards.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, create(newCards[i])
                                .catch(function (err) { reject(err); })];
                    case 2:
                        /** @todo How could this go wrong? */
                        // @ts-ignore
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
}
exports.createMany = createMany;
/**
 * Read a card(s) from the database. If `searchQuery.cardID` is not defined,
 * all the cards belonging to the user will be fetched. If successful, `message`
 * will be an array of all matching cards.
 */
function read(searchQuery, projection) {
    if (projection === void 0) { projection = "title description descriptionHTML tags urgency createdById isPublic"; }
    searchQuery = SanitizationAndValidation_1.sanitizeQuery(searchQuery);
    var query = { createdById: searchQuery.userIDInApp };
    if (searchQuery.cardID !== undefined)
        query._id = searchQuery.cardID;
    return new Promise(function (resolve, reject) {
        CardSchema_1.Card
            .find(query).select(projection).exec()
            .then(function (cards) {
            resolve({
                success: true, status: 200, message: cards
            });
        })
            .catch(function (err) { reject(err); });
    });
}
exports.read = read;
;
/**
 * @description Save the changes `cardJSON` to the database.
 *
 * @param cardJSON The parts of the card that have been updated. Must
 * include `cardID` as an attribute, otherwise no changes will be made. Some
 * fields of the card are treated as constants, e.g. `createdById` and `createdAt`.
 *
 * @returns {Promise} If successful, `message` will be the updated card.
 */
function update(cardJSON) {
    var prevResults = {};
    var EDITABLE_ATTRIBUTES = new Set([
        "title", "description", "descriptionHTML", "tags", "urgency", "isPublic",
        "numTimesMarkedAsDuplicate", "numTimesMarkedForReview"
    ]);
    var query = SanitizationAndValidation_1.sanitizeQuery({ cardID: cardJSON.cardID });
    cardJSON = SanitizationAndValidation_1.sanitizeCard(cardJSON);
    // findByIdAndUpdate will give me the old, not the updated, document.
    // I need to find the card, save it, and then call MetadataDB.update if need be
    return new Promise(function (resolve, reject) {
        CardSchema_1.Card
            .findById(query.cardID).exec()
            .then(function (existingCard) {
            if (existingCard === null) {
                resolve({ success: false, status: 200, message: null });
            }
            else {
                prevResults.previousTags = existingCard.tags;
                Object.keys(cardJSON).forEach(function (cardKey) {
                    if (EDITABLE_ATTRIBUTES.has(cardKey)) {
                        // @ts-ignore EDITABLE_ATTRIBUTES is a safe list
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
                return MetadataDB.update([savedCard], { createdById: savedCard.createdById, metadataIndex: 0 });
            }
            else {
                prevResults.savedCard = savedCard;
                return Promise.resolve({});
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
}
exports.update = update;
;
/**
 * @description Search for cards with associated key words. Search should be
 * relevant and fast, erring on the side of relevance.
 *
 * @returns If successful the `message` attribute holds a list of partial cards,
 * i.e. each card object only has `id`, `urgency` and `title` attributes.
 */
function search(payload) {
    payload = SanitizationAndValidation_1.sanitizeQuery(payload);
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
    return collectMatchingCards(queryObject);
}
exports.search = search;
;
/**
 * @description Append a copy of the hyphenated/underscored words in `s`
 * without the hyphens/underscores. Useful for pre-processing search queries.
 * For instance, the input: `arrays dynamic_programming iterative-algorithms`
 * would lead to:
 * `arrays dynamic_programming iterative-algorithms dynamic programming iterative algorithms`
 *
 * @todo Not entirely true. Interest in `dynamic_programming` doesn't mean a
 * user is interested in `dynamic` and `programming` as separate terms. A better
 * approach would be filtering out stop words and asking the user to enquote
 * phrases that should be matched exactly.
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
 * @returns {Promise} If `success` is set, then the `message` attribute will be
 * an array of matching cards.
 */
var collectMatchingCards = function (queryObject) {
    /**
     * $expr is faster than $where because it does not execute JavaScript
     * and should be preferred where possible. Note that the JS expression
     * is processed for EACH document in the collection. Yikes!
     * ~~Using regex inside the query itself is more efficient.~~
     * MongoDB supports
     * [text search]{@link https://docs.mongodb.com/v3.2/text-search/} and
     * a 'sort by relevance' function.
     */
    return new Promise(function (resolve, reject) {
        CardSchema_1.Card
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
 * @param payload Supported keys include:
 *  - `userID`: The ID of the creator of the cards
 *  - `cardIDs`: A string of card IDs separated by a `,` without spaces
 *  - `cardID`: The ID of a single card. The same effect can be achieved with `cardIDs`
 *  - `queryString`: The keywords to look for. They are interpreted as tags
 *  - `creationStartDate`: The earliest date by which the cards were created
 *  - `creationEndDate`: The latest date for which the cards were created
 *
 * @returns {Promise} If `success` is set, then the `message` attribute will
 * be an array of matching cards.
 */
function publicSearch(payload) {
    payload = SanitizationAndValidation_1.sanitizeQuery(payload);
    var mandatoryFields = [{ isPublic: true }];
    if (payload.userID !== undefined) {
        mandatoryFields.push({ createdById: payload.userID });
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
        // @ts-ignore Doesn't match the date type on ICard, but this is fine
        mandatoryFields.push({ createdAt: dateQuery });
    }
    var queryObject = {
        filter: { $and: mandatoryFields },
        projection: "title tags",
        limit: payload.limit,
        sortCriteria: { score: { $meta: "textScore" } }
    };
    return collectMatchingCards(queryObject);
}
exports.publicSearch = publicSearch;
/**
 * @description Read a card as a `public` user, e.g. from the `browse` page
 *
 * @returns {Promise} If `success` is set, then the `message` attribute will
 * contain a single-element array containing the matching card if any.
 */
function readPublicCard(payload) {
    payload = SanitizationAndValidation_1.sanitizeQuery(payload);
    return new Promise(function (resolve, reject) {
        if (payload.cardID === undefined) {
            resolve({
                success: false, status: 200,
                message: "Couldn't parse the card ID from the request."
            });
        }
        else {
            CardSchema_1.Card
                .findOne({ isPublic: true, _id: payload.cardID }).exec()
                .then(function (matchingCard) {
                resolve({
                    success: true, status: 200, message: [matchingCard]
                });
            })
                .catch(function (err) { reject(err); });
        }
    });
}
exports.readPublicCard = readPublicCard;
/**
 * @description Create a copy of the referenced card and add it to the user's
 * collection.
 *
 * @returns {Promise} If successful, `message` will contain the saved card.
 */
function duplicateCard(payload) {
    return new Promise(function (resolve, reject) {
        var queryObject = SanitizationAndValidation_1.sanitizeQuery({ _id: payload.cardID, isPublic: true });
        CardSchema_1.Card
            .findOne(queryObject).exec()
            .then(function (preExistingCard) {
            if (preExistingCard === null) {
                resolve({
                    success: false, status: 200,
                    message: "The card to be copied was not found on the server."
                });
                return;
            }
            else {
                var idsOfUsersWithCopy = new Set(preExistingCard.idsOfUsersWithCopy.split(", "));
                idsOfUsersWithCopy.add("" + payload.userIDInApp);
                preExistingCard.idsOfUsersWithCopy = Array.from(idsOfUsersWithCopy).join(", ");
                return preExistingCard.save();
            }
        })
            .then(function (savedPreExistingCard) {
            return create({
                title: savedPreExistingCard.title,
                description: savedPreExistingCard.description,
                tags: savedPreExistingCard.tags,
                parent: savedPreExistingCard._id,
                createdById: payload.userIDInApp,
                isPublic: payload.isPublic,
                urgency: CardSchema_1.CardSchema.obj.urgency.max
            });
        })
            .then(function (confirmation) { resolve(confirmation); })
            .catch(function (err) { reject(err); });
    });
}
exports.duplicateCard = duplicateCard;
;
/**
 * @description With public cards, it's possible that some malicious users may
 * upload objectionable cards. While we don't delete users' cards against their
 * will, we don't have an obligation to help them share such cards. When a card
 * gets flagged as inappropriate, it is excluded from search results in the
 * `/browse` page. We increase the counter of the specified file. This allows
 * moderators to deal with the most flagged cards first.
 *
 * @param payload The `cardID` must be set. `markedForReview` and
 * `markedAsDuplicate` are optional. If set, they should be booleans.
 *
 * @returns {Promise} If successful, `message` will be a confirmation string.
 */
function flagCard(payload) {
    payload = SanitizationAndValidation_1.sanitizeQuery(payload);
    var flagsToUpdate = {};
    if (payload.markedForReview)
        flagsToUpdate.numTimesMarkedForReview = 1;
    if (payload.markedAsDuplicate)
        flagsToUpdate.numTimesMarkedAsDuplicate = 1;
    return new Promise(function (resolve, reject) {
        CardSchema_1.Card
            .findOneAndUpdate({ _id: payload.cardID }, { $inc: flagsToUpdate })
            .exec()
            .then(function (_) {
            resolve({
                status: 200, success: true, message: "Card flagged successfully!"
            });
        })
            .catch(function (err) { reject(err); });
    });
}
exports.flagCard = flagCard;
/**
 * @description Fetch the tags contained in the associated users cards.
 *
 * @returns {Promise} If successful, `message` will contain an array of arrays.
 * Each inner array will have tags that were found on a same card.
 */
function getTagGroupings(payload) {
    payload = SanitizationAndValidation_1.sanitizeQuery(payload);
    return new Promise(function (resolve, reject) {
        CardSchema_1.Card
            .find({ createdById: payload.userIDInApp })
            .select("tags").exec()
            .then(function (cards) {
            var tagsArray = [];
            for (var i = 0; i < cards.length; i++) {
                tagsArray.push(cards[i].tags.split(" "));
            }
            resolve({
                success: true, message: tagsArray, status: 200
            });
        })
            .catch(function (err) { reject(err); });
    });
}
exports.getTagGroupings = getTagGroupings;
/**
 * @description For uniformity, tags should be delimited by white-space. If a
 * tag has multiple words, then an underscore or hyphen can be used to delimit
 * the words themselves.
 *
 * Remember to add `require('./MongooseClient');` at the top of this file when
 * running this script as main.
 */
var standardizeTagDelimiters = function () {
    var cursor = CardSchema_1.Card.find({}).cursor();
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
    var cursor = CardSchema_1.Card.find({}).cursor();
    cursor.on("data", function (card) {
        var currentCard = card;
        currentCard = SanitizationAndValidation_1.sanitizeCard(currentCard);
        currentCard.save(function (err, savedCard) {
            if (err)
                console.log(err);
            else
                console.log("Updated " + savedCard.title);
        });
    });
    cursor.on("close", function () {
        console.log("Finished the operation");
        connection.close();
    });
};
if (require.main === module) {
    // @ts-ignore Let me be :-) Haha, can't run the resulting JS
    // import { dbConnection } from "../models/MongooseClient";
    // standardizeTagDelimiters();
    insertDescriptionHTML(dbConnection);
}
//# sourceMappingURL=CardsMongoDB.js.map