"use strict";

const AVLTree = require("./AVLTree.js");
var sendHTTPRequest = require("./AppUtilities.js").sendHTTPRequest;

function CardsManager(tags_and_ids, userID, cardSourceURL="/read-card") {

    /* Holds the attributes and methods of the CardsManager module */
    var cardsManagerObj = {};

    /* Holds the IDs of the cards that are currently being viewed */
    var bst = new AVLTree();

    /* A reference to the current node on the BST */
    var currentNode = null;

    /* A mapping of card IDs to keys in the BST */
    var idsToBSTKeys = {};

    /**
     * A function for comparing the keys for the BST
     * 
     * @param {Object} a Expected attributes: `urgency`, `_id`
     * @param {Object} b Expected attributes: `urgency`, `id`
     * 
     * @returns {Number} `0` if the keys are equal, `1` if `a < b` and `-1` if 
     * `a > b`
     */
    function reverseComparator(a, b) {
        if (a.urgency < b.urgency) return 1;
        if (a.urgency > b.urgency) return -1;
        if (a._id < b._id) return 1;
        if (a._id > b._id) return -1;
        return 0;
    }

    /* Empty Card Template */
    cardsManagerObj.empty_card = {
        title: "", description: "", tags: "", createdById: null,
        urgency: 0, metadataIndex: null
    };

    /**
     * @description Initialize Card Manager by preparing a queue of cards.
     * @param {Array} tagsToUse The tags that should appear in the PQ.
     */
    cardsManagerObj.initializeFromTags = function(tagsToUse) {
        return new Promise(function(resolve, reject) {

            if (tagsToUse === null) tagsToUse = Object.keys(tags_and_ids);

            bst = new AVLTree(reverseComparator, true);
            let already_seen_ids = new Set([]);
            tagsToUse.forEach(function(tag) {
                for (let cardID in tags_and_ids[tag]) {
                    if (already_seen_ids.has(cardID) === false) {
                        cardsManagerObj.insertCard(cardID, tags_and_ids[tag][cardID].urgency);
                        already_seen_ids.add(cardID);
                    }
                }
            });
            resolve();
        });
    };

    /**
     * @description Initialize a card manager using an array of abbreviated 
     * cards.
     * 
     * @param {Array} minicards Array of JSON objects having the keys `_id`, 
     * and `urgency`
     * 
     * @param {Boolean} includeTagNeighbors If set to true, enqueue cards that share 
     * similar tags as well. Note that this expects the minicards to have a `tags` 
     * attribute in addition to `_id` and `urgency`.
     */
    cardsManagerObj.initializeFromMinicards = function(minicards, includeTagNeighbors=false) {
        return new Promise(function(resolve, reject) {
            bst = new AVLTree(reverseComparator, true);
            let alreadySeenIDs = new Set([]);
            minicards.forEach((minicard) => {
                alreadySeenIDs.add(minicard._id);
                cardsManagerObj.insertCard(minicard._id, minicard.urgency);
            });

            if (includeTagNeighbors) {
                let tagsToUse = new Set([]);
                minicards.forEach((minicard) => {
                    minicard.tags.forEach((tag) => { tagsToUse.add(tag); });
                });

                tagsToUse.forEach(function(tag) {
                    for (let cardID in tags_and_ids[tag]) {
                        if (!alreadySeenIDs.has(cardID)) {
                            cardsManagerObj.insertCard(minicard._id, minicard.urgency);
                            alreadySeenIDs.add(cardID);
                        }
                    }
                });
            }

            resolve();
        });
    };

    /**
     * @description Initialize a card manager using a trash object.
     * 
     * @param {JSON} trashed_card_ids A JSON object whose keys are card IDs and 
     * the value is the timestamp on which they were trashed.
     * 
     * @param {Function} callBack Function to call once everything is complete.
     */
    cardsManagerObj.initializeFromTrash = function (trashed_card_ids) {
        return new Promise(function(resolve, reject) {
            bst = new AVLTree(reverseComparator, true);
            let card_ids = Object.keys(trashed_card_ids); // Synchronous
            for (let i = 0; i < card_ids.length; i++) {
                cardsManagerObj.insertCard(card_ids[i], trashed_card_ids[card_ids[i]]);
            }

            resolve();
        });
    };

    /**
     * @description Return the next card on the queue.
     * @param {Function} callback The function to call that accepts a card
     * as a parameter.
     */
    cardsManagerObj.next = function() {
        return new Promise(function(resolve, reject) {
            if (cardsManagerObj.hasNext()) {
                if (currentNode === null) {
                    currentNode = bst.find(bst.min());
                } else {
                    currentNode = bst.next(currentNode);
                }
                findCard(currentNode.key._id)
                    .then((card) => { resolve(card); })
                    .catch((err) => { reject(err); });
            } else {
                resolve(null);
            }           
        });
    };

    /**
     * @return {Boolean} `true` if calling `next()` will produce a card. `false` 
     * otherwise
     */
    cardsManagerObj.hasNext = function () {
        if (bst.size === 0) return false;
        if (currentNode === null) return true;
        return bst.next(currentNode) !== null;
    };

    /**
     * @return {Boolean} `true` if calling `prev()` will produce a card. `false` 
     * otherwise
     */
    cardsManagerObj.hasPrev = function () {
        if (bst.size === 0) return false;
        return bst.prev(currentNode) !== null;
    };

    /**
     * @description Return the previous card on the queue.
     * @param {Function} callback The function to call that accepts a card
     * as a parameter.
     */
    cardsManagerObj.previous = function() {
        return new Promise(function(resolve, reject) {
            if (cardsManagerObj.hasPrev()) {
                currentNode = bst.prev(currentNode);
                findCard(currentNode.key._id)
                    .then((card) => { resolve(card); })
                    .catch((err) => { reject(err); });
            } else {
                resolve(null);
            } 
        });
    };

    /**
     * @description Remove the specified card from the cards that are displayed 
     * to the user.
     * 
     * @param {String} idOfCardToRemove The ID of the card to be removed from 
     * the queue of cards.
     */
    cardsManagerObj.removeCard = function(idOfCardToRemove) {
        if (currentNode.key._id === idOfCardToRemove) {
            let keyToRemove = currentNode.key;
            if (cardsManagerObj.hasNext()) {
                currentNode = bst.next(currentNode);
            } else if (cardsManagerObj.hasPrev()) {
                currentNode = bst.prev(currentNode);
            } else {
                currentNode = null;
            }
            delete idsToBSTKeys[idOfCardToRemove];
            bst.remove(keyToRemove);
        } else {
            console.error(`${currentNode.key._id} !== ${idOfCardToRemove}`);
        }
    };

    /**
     * @description Insert a card into the set of cards that can be discovered 
     * by the `next()` and `prev()` iterators. The card will be insrted into 
     * its natural position in the iteration order. As such, it may not be 
     * the card returned by the immediate call of either `prev()` or `next()`
     * 
     * @param {String} newCardID The ID of the card to insert into the queue
     * @param {Number} newCardUrgency The urgency of the card to be inserted. 
     * Used as a sorting key.
     */
    cardsManagerObj.insertCard = function(newCardID, newCardUrgency) {
        let newKey = { _id: newCardID, urgency: newCardUrgency }
        idsToBSTKeys[newCardID] = newKey;
        bst.insert(newKey);
    };

    /**
     * @description Sync the changes made to the card with the card manager. We 
     * don't check whether the urgency changed. The old key is removed from the 
     * BST and a new (possibly updated) key is added to the BST.
     * 
     * @param {Object} card the new version of the card
     */
    cardsManagerObj.updateCard = function(card) {
        localStorage.removeItem(card._id);
        localStorage.setItem(card._id, JSON.stringify(card));
        cardsManagerObj.removeCard(card._id);
        cardsManagerObj.insertCard(card._id, card.urgency);
    };

    /**
     * @description Search for the card with the given ID. First search in the
     * browser, then query the database if necessary.
     * 
     * @param {String} cardID The ID of the card that's to be fetched
     * @param {Function} callback The function to be called once the card is
     * found
     */
    function findCard(cardID) {
        return new Promise(function(resolve, reject) {
            let card = JSON.parse(localStorage.getItem(cardID));
            if (card) { 
                resolve(card); 
            } else {
                sendHTTPRequest("POST", cardSourceURL, {userIDInApp: userID, cardID: cardID})
                    .then((results) => {
                        results = JSON.parse(results);
                        localStorage.setItem(cardID, JSON.stringify(results.message[0]));
                        resolve(results.message[0]);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            }
        });  
    }

    cardsManagerObj.saveCard = function(card, url) {
        return new Promise(function(resolve, reject) {
            sendHTTPRequest("POST", url, card)
                .then((results) => {
                    results = JSON.parse(results);
                    if (results.success) {
                        cardsManagerObj.updateCard(results.message);
                        resolve(results.message);
                    } else {
                        reject(results.message);
                    }
                    
                })
                .catch((err) => { reject(err); });
        })
    };

    return cardsManagerObj;

};

module.exports = CardsManager;
