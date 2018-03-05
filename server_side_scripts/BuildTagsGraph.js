/*
 * BuildTagsGraph.js
 * 
 * Creates a graph where nodes are tags, and within the 
 * nodes are card ids. In the future, certain topics may
 * related, so we'll have links between different tags.
 * 
 */ 

var mongoose = require("mongoose");
var CardsDB = require("./CardsMongoDB");
var Metadata = require("./MetadataCardSchema");

var tagsAndIds = {};
var connections = {};

CardsDB.read({}, function(cards) {
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].tags !== undefined) {
            var preSanitizedTags = cards[i].tags.split("#");
            var sanitizedTags = new Set([]);

            // Sanitize the inputs
            preSanitizedTags.forEach(function(value, index, array) {
                value = value.trim().toLowerCase();
                if (value !== "") {
                    sanitizedTags.add(value);
                } 
            });

            // Accumulate all the cards that have this tag
            sanitizedTags.forEach(function(value, key, set) {
                if (tagsAndIds[value] == undefined) {
                    tagsAndIds[value] = new Set();
                }
                tagsAndIds[value].add(cards[i]._id);
            });
            
            // Infer the connections between the tags by common elements
            // Store both A --> B and B --> A as separate edges
            sanitizedTags.forEach(function(value_a, key_a, set) {
                set.forEach(function(value_b, key_b, set_b) {
                    if (value_a !== value_b) {
                        if (connections[[value_a, value_b]] === undefined) {
                            connections[[value_a, value_b]] = 1; 
                        } else {
                            connections[[value_a, value_b]] += 1;
                        }
                    }
                });
            });
        }
    }

    // Save the graph's structure into the DB
    // tagMetadata["node_information"] = [tagsAndIds];
    var tagMetadata = new Metadata({
        "title": "_tags_metadata_",
        "description": "Stores information about the cards graph",
        "createdById": 1,
        "stats": [],
        "node_information": [1, 2],
        "link_information": [3, 4]
    });

    // console.log(tagMetadata);
    
    CardsDB.saveThisCard(tagMetadata, function(confirmation){
        console.log(confirmation);
    }); 

});
