"use strict";

const AVLTree = require("./AVLTree.js");
var sendHTTPRequest = require("./AppUtilities.js").sendHTTPRequest;

function CardsManager(tags_and_ids, userID, cardSourceURL="/read-card", minicards={}) {

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
            cardsManagerObj.bst = bst;
            currentNode = null;

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
            cardsManagerObj.bst = bst;
            currentNode = null;

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
                            cardsManagerObj.insertCard(cardID, tags_and_ids[tag][cardID].urgency);
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
            cardsManagerObj.bst = bst;
            currentNode = null;
            
            let card_ids = Object.keys(trashed_card_ids); // Synchronous
            for (let i = 0; i < card_ids.length; i++) {
                cardsManagerObj.insertCard(card_ids[i], trashed_card_ids[card_ids[i]]);
            }

            resolve();
        });
    };

    /**
     * @description An iterator over all cards that are discoverable through 
     * the `prev()` and `next()` methods of the `CardsManager`
     */
    cardsManagerObj.cardKeys = function* () {
        let currentNode = bst.minNode();
        while (currentNode) {
            yield currentNode.key;
            currentNode = bst.next(currentNode);
        }
        return "done";
    }

    /**
     * @description Set the cursor of the `CardsManager` object to the card 
     * with the provided ID
     */
    cardsManagerObj.fetchCard = function (cardID) {
        return new Promise(function(resolve, reject) {
            currentNode = bst.find(idsToBSTKeys[cardID]);
            if (currentNode) {
                findCard(currentNode.key._id)
                    .then((card) => { resolve(card); })
                    .catch((err) => { reject(err); });
            } else {
                resolve(null);
            }
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
        // If we're removing the current card, adjust such that `next()` 
        // resolves to the card that followed the card that we'll remove
        if (currentNode && currentNode.key._id === idOfCardToRemove) {
            if (cardsManagerObj.hasPrev()) {
                currentNode = bst.prev(currentNode);
            } else if (cardsManagerObj.hasNext()) {
                currentNode = bst.next(currentNode);
            } else {
                currentNode = null;
            }
        }
        let keyToRemove = idsToBSTKeys[idOfCardToRemove];
        delete idsToBSTKeys[idOfCardToRemove];
        if (keyToRemove) bst.remove(keyToRemove);
        return idOfCardToRemove;
    };

    cardsManagerObj.status = function() {
        if (currentNode) {
            let node = bst.prev(currentNode);
            if (node) {
                findCard(node.key._id)
                    .then((card) => {
                        console.log(`Previous: (${card.urgency}) ${card.title}`);
                    })
                    .catch((err) => { console.error(err); });
            } else {
                console.log(`Previous: null`);
            }
            
            findCard(currentNode.key._id)
                .then((card) => {
                    console.log(`Current: (${card.urgency}) ${card.title}`);
                })
                .catch((err) => { console.error(err); });

            node = bst.next(currentNode);
            if (node) {
                findCard(node.key._id)
                    .then((card) => {
                        console.log(`Next: (${card.urgency}) ${card.title}`);
                    })
                    .catch((err) => { console.error(err); });
            } else {
                console.log(`Next: null`);
            }      
        } else {
            console.log(`Current: null`);
        }
    }

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
        minicards[card._id] = { 
            _id: card._id, title: card.title, 
            tags: card.tags.trim().replace(/\s/g, ", ") 
        };

        let oldKey = idsToBSTKeys[card._id];
        if (oldKey) {
            cardsManagerObj.removeCard(card._id);
        }
        cardsManagerObj.insertCard(card._id, card.urgency);
        
    };

    /**
     * @description Compute and return the 0th, 1st, 2nd, 3rd and 4th quartiles 
     * of the urgencies of the cards on the current `CardsManager` object.
     * 
     * @returns {Array} A 5 element array denoting the 0th, 1st, 2nd, 3rd and 4th 
     * quartiles of the urgences.
     */
    cardsManagerObj.quartiles = function() {
        let N = bst._size;
        if (N == 0) {
            return [0, 0, 0, 0, 0];
        }
        else if (N <= 4) {
            // Recall that the BST is populated using `reverseComparator()`, thus 
            // the min node on the BST has the highest urgency.
            let maxUrgency = bst.min().urgency;
            return [maxUrgency, maxUrgency, maxUrgency, maxUrgency, maxUrgency];
        } else {
            return [
                bst.max().urgency, 
                bst.at(Math.floor(3 * N / 4)).key.urgency,
                bst.at(Math.floor(N / 2)).key.urgency,
                bst.at(Math.floor(N / 4)).key.urgency,
                bst.min().urgency
            ];
        }
    }

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
