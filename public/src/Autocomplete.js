"use strict";

/**
 * @author Chege Gitau
 * 
 * @description A helper data type for providing autocomplete suggestions
 * 
 */

const Graph = require("./Graph.js");
const TST = require("./TernarySearchTrie.js");

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
        AutoComplete.graph = new Graph(false);
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

    this.kNeighbors = function(nodeIDs, k=10) {
        return AutoComplete.graph.kNearNeighbors(randomTagGroup, k);
    }

}

module.exports = AutoComplete;
