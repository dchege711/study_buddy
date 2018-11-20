"use strict";

var max_PQ = require("./MaxPriorityQueue.js");
var sendHTTPRequest = require("./AppUtilities.js").sendHTTPRequest;

function CardsManager(tags_and_ids, user_id) {

    /* Holds the attributes and methods of the CardsManager module */
    var cardsManagerObj = {};

    /* Hold the IDs of the cards that are yet to be viewed */
    var pqCardsToView = max_PQ();

    /* Hold the IDs of the cards that have already been viewed. */
    var pqCardsAlreadyViewed = max_PQ();

    /* Empty Card Template */
    cardsManagerObj.empty_card = {
        title: "", description: "", tags: "", createdById: null,
        urgency: 0, metadataIndex: null
    };

    /**
     * @description Initialize Card Manager by preparing a queue of cards.
     * @param {Array} tags_to_use The tags that should appear in the PQ.
     */
    cardsManagerObj.initializeFromTags = function(tags_to_use) {
        return new Promise(function(resolve, reject) {

            if (tags_to_use === null) tags_to_use = Object.keys(tags_and_ids);

            // Reset the PQ (God forgive me for all my garbage :-/ )
            pqCardsAlreadyViewed = max_PQ();
            pqCardsToView = max_PQ();

            // A card may have many tags, so don't repeatedly add it to the PQ
            var already_seen_ids = new Set([]);
            tags_to_use.forEach(function(tag) {
                for (var card_id in tags_and_ids[tag]) {
                    if (already_seen_ids.has(card_id) === false) {
                        pqCardsToView.insert(
                            [card_id, tags_and_ids[tag][card_id].urgency]
                        );
                        already_seen_ids.add(card_id);
                    }
                }
            });

            resolve();

        });
    };

    /**
     * @description Initialize a card manager using an array of abbreviated 
     * cards.
     * @param {Array} minicards Array of JSON objects having the keys `_id`, 
     * and `urgency`
     * @param {Function} callBack Function to call once everything is complete.
     */
    cardsManagerObj.initializeFromMinicards = function(minicards) {
        return new Promise(function(resolve, reject) {
            pqCardsAlreadyViewed = max_PQ();
            pqCardsToView = max_PQ();

            minicards.forEach((minicard) => {
                pqCardsToView.insert([minicard._id, minicard.urgency]);
            });

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
    cardsManagerObj.initializeFromTrash = function (trashed_card_ids, callBack) {
        return new Promise(function(resolve, reject) {
            pqCardsAlreadyViewed = max_PQ();
            pqCardsToView = max_PQ();

            let card_ids = Object.keys(trashed_card_ids); // Synchronous
            for (let i = 0; i < card_ids.length; i++) {
                pqCardsToView.insert([card_ids[i], trashed_card_ids[card_ids[i]]]);
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
            if (pqCardsToView.is_empty()) {
                resolve(null);
            } else {
                let next_card_id_urgency = transferItem(
                    pqCardsToView, pqCardsAlreadyViewed
                );
    
                findCard(next_card_id_urgency[0])
                    .then((card) => {resolve(card); })
                    .catch((err) => {reject(err); });
            }            
        });
    };

    /**
     * @description Return the number of cards that are yet to be viewed.
     */
    cardsManagerObj.numNext = function () {
        return pqCardsToView.size();
    };

    /**
     * @description Return the number of cards that have already been viewed.
     */
    cardsManagerObj.numPrev = function () {
        return pqCardsAlreadyViewed.size();
    };

    /**
     * @description Return the previous card on the queue.
     * @param {Function} callback The function to call that accepts a card
     * as a parameter.
     */
    cardsManagerObj.previous = function() {
        return new Promise(function(resolve, reject) {
            if (pqCardsAlreadyViewed.is_empty()) {
                resolve(null);
            } else {
                let prev_card_id_urgency = transferItem(pqCardsAlreadyViewed, pqCardsToView);
                findCard(prev_card_id_urgency[0])
                    .then((card) => {resolve(card); })
                    .catch((err) => {reject(err); });
            }
            
        });
    };

    /**
     * @description Remove the specified card from the cards that are displayed 
     * to the user.
     * 
     * @param {String} card_to_remove_id The ID of the card to be removed from 
     * the queue of cards.
     */
    cardsManagerObj.removeCard = function(card_to_remove_id) {

        // The card to be removed will be at the top of either PQ
        let card_to_remove = pqCardsAlreadyViewed.peek();
        if (card_to_remove && card_to_remove[0] == card_to_remove_id) {
            return pqCardsAlreadyViewed.del_max()[0];
        } else {
            card_to_remove = pqCardsToView.peek();
            if (card_to_remove && card_to_remove[0] == card_to_remove_id) {
                return pqCardsToView.del_max()[0];
            }
        }
        
        return null;
    };

    /**
     * @description Insert a card into the queue. By convention, the card will 
     * be inserted into the queue of already viewed cards. If you wish to view
     * it, run `CardsManager.previous`
     * @param {String} card_to_insert_id The ID of the card to insert into the queue
     * @param {Number} card_to_insert_urgency The urgency of the card to be inserted. 
     * Used as a sorting key.
     */
    cardsManagerObj.insertCard = function(card_to_insert_id, card_to_insert_urgency) {
        pqCardsAlreadyViewed.insert(
            [card_to_insert_id, card_to_insert_urgency]
        );
    };

    cardsManagerObj.update_card = function(card) {
        localStorage.removeItem(card._id);
        localStorage.setItem(card._id, JSON.stringify(card));
        this.removeCard(card._id);
        pqCardsAlreadyViewed.insert([card._id, card.urgency * -1]);
    };

    /**
     * @description Move the top item of the source PQ to the destination PQ.
     * Return the item that has been moved.
     * 
     * @param {max_PQ} source_pq The source PQ
     * @param {max_PQ} destination_pq The destination PQ
     */
    function transferItem(source_pq, destination_pq, negate=true) {
        var id_and_urgency = source_pq.del_max();
        id_and_urgency[1] = id_and_urgency[1] * -1;
        destination_pq.insert(id_and_urgency);
        return id_and_urgency;
    }

    /**
     * @description Search for the card with the given ID. First search in the
     * browser, then query the database if necessary.
     * 
     * @param {String} card_id The ID of the card that's to be fetched
     * @param {Function} callback The function to be called once the card is
     * found
     */
    function findCard(card_id, url="/read-card") {
        return new Promise(function(resolve, reject) {
            let card = JSON.parse(localStorage.getItem(card_id));
            if (card) resolve(card);
            sendHTTPRequest("POST", url, {userIDInApp: user_id, _id: card_id})
                .then((results) => {
                    localStorage.setItem(card_id, JSON.stringify(results.message[0]));
                    resolve(results.message[0]);
                })
                .catch((err) => {
                    reject(err);
                });
        });  
    }

    cardsManagerObj.saveCard = function(card, url) {
        return new Promise(function(resolve, reject) {
            sendHTTPRequest("POST", url, card)
                .then((results) => {
                    if (results.success) {
                        cardsManagerObj.update_card(results.message);
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
