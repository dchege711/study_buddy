/*
 * var max_PQ = require("./MaxPriorityQueue.js");
 * var sendHTTPRequest = require("./AppUtilities.js");
 * 
 * This works for non-browser side function definitions 
 * cards_manager = function (tags_and_ids, user_id) {
 */
function cards_manager(tags_and_ids, user_id) {

    /* Holds the attributes and methods of the cards_manager module */
    var cards_manager_obj = {};

    /* Hold the IDs of the cards that are yet to be viewed */
    var pq_cards_to_view;

    /* Hold the IDs of the cards that have already been viewed. */
    var pq_cards_already_viewed;

    /* Empty Card Template */
    cards_manager_obj.empty_card = {
        title: "", description: "", tags: "", createdById: null,
        urgency: 0, metadataIndex: null, description_markdown: null
    };

    /**
     * @description Initialize Card Manager by preparing a queue of cards.
     * @param {Array} tags_to_use The tags that should appear in the PQ.
     */
    cards_manager_obj.initialize = function(tags_to_use, callback) {
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
                        [card_id, tags_and_ids[tag][card_id].urgency, tag]
                    );
                    already_seen_ids.add(card_id);
                }
            }
        });

        callback();
    };

    /**
     * @description Return the next card on the queue.
     * @param {Function} callback The function to call that accepts a card
     * as a parameter.
     */
    cards_manager_obj.next = function(callback) {
 
        if (pq_cards_to_view.is_empty()) {
            callback({});
            return;
        }

        var next_card_id_urgency = transfer_item(pq_cards_to_view, pq_cards_already_viewed);
        console.log("Next: " + next_card_id_urgency);
        find_card(next_card_id_urgency[0], callback);

    };

    cards_manager_obj.num_next = function () {
        return pq_cards_to_view.size();
    };

    cards_manager_obj.num_prev = function () {
        return pq_cards_already_viewed.size();
    };

    /**
     * @description Return the previous card on the queue.
     * @param {Function} callback The function to call that accepts a card
     * as a parameter.
     */
    cards_manager_obj.previous = function(callback) {
        // transfer_item(pq_cards_already_viewed, pq_cards_to_view);

        if (pq_cards_already_viewed.is_empty()) {
            callback({});
            return;
        }

        var prev_card_id_urgency = transfer_item(
            pq_cards_already_viewed, pq_cards_to_view
        );
        
        console.log("Prev: " + prev_card_id_urgency);
        find_card(prev_card_id_urgency[0], callback);
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
        if (pq_cards_already_viewed.peek()[0] == card_to_remove_id) {
            return pq_cards_already_viewed.del_max()[0];
        } else if (pq_cards_to_view.peek()[0] == card_to_remove_id) {
            return pq_cards_to_view.del_max()[0];
        } else {
            return null;
        }
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
    function find_card(card_id, callback) {
        var card = JSON.parse(localStorage.getItem(card_id));
        // var card = null;
        if (card) {
            callback(card);
        } else {
            sendHTTPRequest("POST", "/read-card", {
                userIDInApp: user_id, _id: card_id
            }, (results) => {
                localStorage.setItem(card_id, JSON.stringify(results.message));
                callback(results.message);
            });
        }
    }

    return cards_manager_obj;

};


/**
 * Sanity check...
 */
if (typeof require !== "undefined" && require.main === module) {
    var tags_and_ids = JSON.parse('{"1984":{"5a7d217f1aef274630536c1b":{"urgency":3}},"miscellaneous":{"5a88f2564ccf401c1577d19b":{"urgency":1},"5a7d21ec1aef274630536c1c":{"urgency":3},"5a7d22641aef274630536c1d":{"urgency":3},"5a7d217f1aef274630536c1b":{"urgency":3}},"fiction":{"5a88f2564ccf401c1577d19b":{"urgency":1},"5ab5e50a2617815af58b99dd":{"urgency":3},"5ad36e293987940014517048":{"urgency":3},"5ad3777e398794001451704a":{"urgency":3},"5ad3d9da16db1c0014ed7c68":{"urgency":3},"5ad40a9223f37700145b5fb4":{"urgency":3},"5ad61a96215c4b001433b125":{"urgency":3},"5af149ad80a9660014c96d6b":{"urgency":2}},"algorithms":{"5a88ec19998ef8152cf0d486":{"urgency":4},"5a777ed8ab6d2636d78996da":{"urgency":7}},"graph_theory":{"5a88ec19998ef8152cf0d486":{"urgency":4},"5ac07617ae330d0014762972":{"urgency":7},"5ac08d27b4fc3f0014e57e53":{"urgency":5},"5ac0ae292bf3c700149e44e5":{"urgency":8},"5ac08bb8b4fc3f0014e57e52":{"urgency":7},"5ac09451b4fc3f0014e57e54":{"urgency":8},"5ac0aac82bf3c700149e44e4":{"urgency":7}},"c":{"5a889ef7998ef8152cf0d480":{"urgency":8},"5a88a0b7998ef8152cf0d481":{"urgency":6},"5ad572e93d3307001448a379":{"urgency":8}},"programming":{"5a889ef7998ef8152cf0d480":{"urgency":8},"5a8bb782be00e63fcd9c5883":{"urgency":9},"5a88a0b7998ef8152cf0d481":{"urgency":6},"5ad572e93d3307001448a379":{"urgency":8},"5ad58076fa80ad0014dabb3b":{"urgency":6},"5ad582b4fa80ad0014dabb3c":{"urgency":9}},"cos217":{"5a889ef7998ef8152cf0d480":{"urgency":8},"5a8bb782be00e63fcd9c5883":{"urgency":9},"5a88a0b7998ef8152cf0d481":{"urgency":6},"5ad572e93d3307001448a379":{"urgency":8},"5ad58076fa80ad0014dabb3b":{"urgency":6},"5ad582b4fa80ad0014dabb3c":{"urgency":9},"5adcd9bb9c1c7f00144e3063":{"urgency":5}},"ele302":{"5a88e872998ef8152cf0d483":{"urgency":8}},"hardware":{"5a88e872998ef8152cf0d483":{"urgency":8},"5a88eaad998ef8152cf0d485":{"urgency":3},"5adcd9bb9c1c7f00144e3063":{"urgency":5}},"cos340":{"5a88a4f6998ef8152cf0d482":{"urgency":7},"5a7d20921aef274630536c1a":{"urgency":3},"5aa4a01bedc05850533e9898":{"urgency":8},"5aa4ad94edc05850533e9899":{"urgency":7},"5aa4ae96edc05850533e989a":{"urgency":7},"5a88e940998ef8152cf0d484":{"urgency":6},"5ac07617ae330d0014762972":{"urgency":7},"5ac08d27b4fc3f0014e57e53":{"urgency":5},"5ac0ae292bf3c700149e44e5":{"urgency":8},"5ab70f07ac506326934e503a":{"urgency":8},"5ab713423e4f7829ed615456":{"urgency":9},"5ab717b5c830692a270a39b9":{"urgency":9},"5ab9e49e962be166f4392cb4":{"urgency":6},"5ac08bb8b4fc3f0014e57e52":{"urgency":7},"5ac09451b4fc3f0014e57e54":{"urgency":8},"5ac0aac82bf3c700149e44e4":{"urgency":7},"5ad041c8d97d220014d917d5":{"urgency":7},"5ad049b9d97d220014d917d6":{"urgency":22},"5ad9fcb7f8edbe0014dfb457":{"urgency":8},"5ad9fe45f8edbe0014dfb458":{"urgency":9},"5ada05e1f8edbe0014dfb459":{"urgency":9}},"mathematics":{"5a88a4f6998ef8152cf0d482":{"urgency":7},"5a777ed8ab6d2636d78996da":{"urgency":7},"5a7d20921aef274630536c1a":{"urgency":3},"5aa4a01bedc05850533e9898":{"urgency":8},"5aa4ad94edc05850533e9899":{"urgency":7},"5aa4ae96edc05850533e989a":{"urgency":7},"5a88e940998ef8152cf0d484":{"urgency":6},"5ab70f07ac506326934e503a":{"urgency":8},"5ab713423e4f7829ed615456":{"urgency":9},"5ab9e49e962be166f4392cb4":{"urgency":6},"5ad041c8d97d220014d917d5":{"urgency":7},"5ad049b9d97d220014d917d6":{"urgency":22},"5ad9fcb7f8edbe0014dfb457":{"urgency":8},"5ad9fe45f8edbe0014dfb458":{"urgency":9},"5ada05e1f8edbe0014dfb459":{"urgency":9}},"networks":{"5a777e31ab6d2636d78996d9":{"urgency":4}},"ele301":{"5a88eaad998ef8152cf0d485":{"urgency":3}},"book_excerpts":{"5a7d21ec1aef274630536c1c":{"urgency":3},"5a7d217f1aef274630536c1b":{"urgency":3},"5ad36e293987940014517048":{"urgency":3},"5ad371e13987940014517049":{"urgency":3},"5ad3777e398794001451704a":{"urgency":3},"5ad3d9da16db1c0014ed7c68":{"urgency":3},"5ad40a9223f37700145b5fb4":{"urgency":3}},"geek_heresy":{"5a7d21ec1aef274630536c1c":{"urgency":3}},"articles":{"5a7d22641aef274630536c1d":{"urgency":3},"5add679ea4d1150014da9b0d":{"urgency":1}},"tech":{"5a7d22641aef274630536c1d":{"urgency":3}},"ai":{"5a7d22641aef274630536c1d":{"urgency":3}},"pointers":{"5a8bb782be00e63fcd9c5883":{"urgency":9}},"books":{"5a95b2a8f4060956b3e1d4df":{"urgency":2},"5ab5e50a2617815af58b99dd":{"urgency":3},"5ab6e4128562310014eb11f2":{"urgency":2},"5ad2bd35bb6057001439d594":{"urgency":3},"5ad36e293987940014517048":{"urgency":3},"5ad371e13987940014517049":{"urgency":3},"5ad3777e398794001451704a":{"urgency":3},"5ad3d9da16db1c0014ed7c68":{"urgency":3},"5ad40a9223f37700145b5fb4":{"urgency":3},"5ad61a96215c4b001433b125":{"urgency":3},"5af149ad80a9660014c96d6b":{"urgency":2}},"so_good_they_cannot_ignore_you":{"5a95b2a8f4060956b3e1d4df":{"urgency":2}},"cal_newport":{"5a95b2a8f4060956b3e1d4df":{"urgency":2}},"probability":{"5aa4a01bedc05850533e9898":{"urgency":8},"5aa4ad94edc05850533e9899":{"urgency":7},"5aa4ae96edc05850533e989a":{"urgency":7},"5ab70f07ac506326934e503a":{"urgency":8},"5ab713423e4f7829ed615456":{"urgency":9},"5ab717b5c830692a270a39b9":{"urgency":9},"5ab9e49e962be166f4392cb4":{"urgency":6}},"cs_theory":{"5a88e940998ef8152cf0d484":{"urgency":6},"5ab717b5c830692a270a39b9":{"urgency":9},"5ad041c8d97d220014d917d5":{"urgency":7}},"education":{"5ab5e50a2617815af58b99dd":{"urgency":3},"5ab6e4128562310014eb11f2":{"urgency":2}},"the_case_against_education":{"5ab6e4128562310014eb11f2":{"urgency":2}},"getting_real":{"5ad2bd35bb6057001439d594":{"urgency":3}},"entrepreneurship":{"5ad2bd35bb6057001439d594":{"urgency":3}},"orf401":{"5ad74eb17fed1a0014b189ad":{"urgency":9},"5ad748147fed1a0014b189ac":{"urgency":5}},"neural_networks":{"5ad74eb17fed1a0014b189ad":{"urgency":9}},"stochastics":{"5ab9e49e962be166f4392cb4":{"urgency":6}},"lauren_ipsum":{"5ad36e293987940014517048":{"urgency":3},"5ad371e13987940014517049":{"urgency":3},"5ad3777e398794001451704a":{"urgency":3},"5ad3d9da16db1c0014ed7c68":{"urgency":3},"5ad40a9223f37700145b5fb4":{"urgency":3},"5ad61a96215c4b001433b125":{"urgency":3}},"systems":{"5ad58076fa80ad0014dabb3b":{"urgency":6},"5ad582b4fa80ad0014dabb3c":{"urgency":9}},"book_exercpts":{"5ad61a96215c4b001433b125":{"urgency":3}},"business":{"5ad748147fed1a0014b189ac":{"urgency":5}},"set_theory":{"5ad9fcb7f8edbe0014dfb457":{"urgency":8},"5ad9fe45f8edbe0014dfb458":{"urgency":9},"5ada05e1f8edbe0014dfb459":{"urgency":9}},"tv_quotes":{"5add506a9705ef0014c0e1a6":{"urgency":1}},"silicon_valley_hbo":{"5add506a9705ef0014c0e1a6":{"urgency":1}},"machine_learning":{"5add679ea4d1150014da9b0d":{"urgency":1}},"arthur_clarke":{"5ab5e50a2617815af58b99dd":{"urgency":3},"5a88f2564ccf401c1577d19b":{"urgency":1},"5af149ad80a9660014c96d6b":{"urgency":2}}}');
    var test_cards_manager = cards_manager(tags_and_ids, 1);
    test_cards_manager.initialize(null, () => {

        console.log("\nScanning next...\n");
        for (var i = 0; i < 10; i++) {
            test_cards_manager.next((card) => {
                // console.log(card);
            });
        }

        console.log("\n\nScanning previous...\n");

        for (var j = 0; j < 10; j++) {
            test_cards_manager.previous((card) => {
                // console.log(card);
            });
        }
        
    });
    
}

/**
 * To-do for next time...
 * 
 * tags_and_ids contains duplicates. This makes the same card to appear more
 * than once in the PQ. Ensure uniqueness.
 * 
 * When a new item arrives, it should sink below items that already exist that
 * have the same weight.
 * 
 * Uncomment the sections that reference browser resources, e.g. localStorage
 * 
 */

/* Make the contents available to others */
// module.exports = cards_manager;