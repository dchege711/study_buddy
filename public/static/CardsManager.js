"use strict";

var max_PQ = require("./MaxPriorityQueue.js");
var sendHTTPRequest = require("./AppUtilities.js").sendHTTPRequest;

function cards_manager(tags_and_ids, user_id) {

    /* Holds the attributes and methods of the cards_manager module */
    var cards_manager_obj = {};

    /* Hold the IDs of the cards that are yet to be viewed */
    var pq_cards_to_view = max_PQ();

    /* Hold the IDs of the cards that have already been viewed. */
    var pq_cards_already_viewed = max_PQ();

    /* Empty Card Template */
    cards_manager_obj.empty_card = {
        title: "", description: "", tags: "", createdById: null,
        urgency: 0, metadataIndex: null, description_markdown: null
    };

    /**
     * @description Initialize Card Manager by preparing a queue of cards.
     * @param {Array} tags_to_use The tags that should appear in the PQ.
     */
    cards_manager_obj.initialize = function(tags_to_use) {
        return new Promise(function(resolve, reject) {

            if (tags_to_use === null) tags_to_use = Object.keys(tags_and_ids);

            // Reset the PQ (God forgive me for all my garbage :-/ )
            pq_cards_already_viewed = max_PQ();
            pq_cards_to_view = max_PQ();

            // A card may have many tags, so don't repeatedly add it to the PQ
            var already_seen_ids = new Set([]);
            tags_to_use.forEach(function(tag) {
                for (var card_id in tags_and_ids[tag]) {
                    if (already_seen_ids.has(card_id) === false) {
                        pq_cards_to_view.insert(
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
    cards_manager_obj.initialize_from_minicards = function(minicards) {
        return new Promise(function(resolve, reject) {
            pq_cards_already_viewed = max_PQ();
            pq_cards_to_view = max_PQ();

            minicards.forEach((minicard) => {
                pq_cards_to_view.insert([minicard._id, minicard.urgency]);
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
    cards_manager_obj.initialize_from_trash = function (trashed_card_ids, callBack) {
        return new Promise(function(resolve, reject) {
            pq_cards_already_viewed = max_PQ();
            pq_cards_to_view = max_PQ();

            let card_ids = Object.keys(trashed_card_ids); // Synchronous
            for (let i = 0; i < card_ids.length; i++) {
                pq_cards_to_view.insert([card_ids[i], trashed_card_ids[card_ids[i]]]);
            }

            resolve();
        });
    };

    /**
     * @description Return the next card on the queue.
     * @param {Function} callback The function to call that accepts a card
     * as a parameter.
     */
    cards_manager_obj.next = function(callback) {
        return new Promise(function(resolve, reject) {
            if (pq_cards_to_view.is_empty()) resolve({});

            let next_card_id_urgency = transfer_item(
                pq_cards_to_view, pq_cards_already_viewed
            );

            find_card(next_card_id_urgency[0])
                .then((card) => {resolve(card); })
                .catch((err) => {reject(err); })
        });
    };

    /**
     * @description Return the number of cards that are yet to be viewed.
     */
    cards_manager_obj.num_next = function () {
        return pq_cards_to_view.size();
    };

    /**
     * @description Return the number of cards that have already been viewed.
     */
    cards_manager_obj.num_prev = function () {
        return pq_cards_already_viewed.size();
    };

    /**
     * @description Return the previous card on the queue.
     * @param {Function} callback The function to call that accepts a card
     * as a parameter.
     */
    cards_manager_obj.previous = function() {
        return new Promise(function(resolve, reject) {
            if (pq_cards_already_viewed.is_empty()) resolve({});
            let prev_card_id_urgency = transfer_item(pq_cards_already_viewed, pq_cards_to_view);
            find_card(prev_card_id_urgency[0])
                .then((card) => {resolve(card); })
                .catch((err) => {reject(err); })
        });
    };

    /**
     * @description Remove the specified card from the cards that are displayed 
     * to the user.
     * 
     * @param {String} card_to_remove_id The ID of the card to be removed from 
     * the queue of cards.
     */
    cards_manager_obj.remove_card = function(card_to_remove_id) {

        // The card to be removed will be at the top of either PQ
        let card_to_remove = pq_cards_already_viewed.peek();
        if (card_to_remove && card_to_remove[0] == card_to_remove_id) {
            return pq_cards_already_viewed.del_max()[0];
        } else {
            card_to_remove = pq_cards_to_view.peek();
            if (card_to_remove && card_to_remove[0] == card_to_remove_id) {
                return pq_cards_to_view.del_max()[0];
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
    cards_manager_obj.insert_card = function(card_to_insert_id, card_to_insert_urgency) {
        pq_cards_already_viewed.insert(
            [card_to_insert_id, card_to_insert_urgency]
        );
    };

    cards_manager_obj.update_card = function(card) {
        localStorage.removeItem(card._id);
        localStorage.setItem(card._id, JSON.stringify(card));
        this.remove_card(card._id);
        pq_cards_already_viewed.insert([card._id, card.urgency * -1]);
    };

    /**
     * @description Move the top item of the source PQ to the destination PQ.
     * Return the item that has been moved.
     * 
     * @param {max_PQ} source_pq The source PQ
     * @param {max_PQ} destination_pq The destination PQ
     */
    function transfer_item(source_pq, destination_pq, negate=true) {
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
    function find_card(card_id, url="/read-card") {
        return new Promise(function(resolve, reject) {
            let card = JSON.parse(localStorage.getItem(card_id));
            if (card) resolve(card);
            sendHTTPRequest("POST", url, {userIDInApp: user_id, _id: card_id})
                .then((results) => {
                    localStorage.setItem(card_id, JSON.stringify(results.message));
                    resolve(results.message);
                })
                .catch((err) => {
                    reject(err);
                });
        });  
    }

    return cards_manager_obj;

};

module.exports = cards_manager;
