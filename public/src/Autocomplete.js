"use strict";

const UndirectedGraph = require("./Graph.js");
const TST = require("./TernarySearchTrie.js");

/**
 * @description Provide autocomplete functionality for the card tags. This
 * helps the user use the fewest tags possible while still being descriptive.
 * The suggestions are generated in one of 2 ways:
 *
 * - If a partial tag is being entered, other tags that share the prefix are
 *   provided, e.g. `pr` might generate `probability` and `primes` if the user
 *   has used these tags on other cards that they own.
 *
 * - Near neighbors of the already completed tags. The graph has tags as nodes,
 *   with links between tags that appear on the same card.
 *
 * {@tutorial main.editing_cards}
 *
 * @class
 */
function AutoComplete() {

    AutoComplete.prefixTree = null;
    AutoComplete.graph = null;

    this.initializePrefixTree = function(words) {
        AutoComplete.prefixTree = new TST(words);
    }

    this.keysWithPrefix = function(prefix) {
        if (AutoComplete.prefixTree === null) return null;
        return AutoComplete.prefixTree.keysWithPrefix(prefix);
    }

    this.updatePrefixTree = function(word) {
        AutoComplete.prefixTree.put(word);
    }

    this.initializeGraphFromGroups = function(wordGroups) {
        AutoComplete.graph = new UndirectedGraph();
        let words, weight;
        for (let i = 0; i < wordGroups.length; i++) {
            words = wordGroups[i];
            for (let j = 0; j < words.length; j++) {
                for (let k = 0; k < words.length; k++) {
                    if (j !== k) {
                        weight = AutoComplete.graph.getEdgeWeight(words[j], words[k]) || 1;
                        AutoComplete.graph.addEdge(words[j], words[k], 1 / (1/weight + 1));
                    }
                }
            }
        }
    }

    this.addPairToGraph = function(wordA, wordB, edgeWeight=1) {
        let weight = AutoComplete.graph.getEdgeWeight(wordA, wordB) || 1;
        AutoComplete.graph.addEdge(wordA, wordB, 1 / (1/weight + edgeWeight));
    }

    this.kNeighbors = function(words, k=10) {
        return AutoComplete.graph.kNearNeighbors(words, k);
    }

}

module.exports = AutoComplete;
