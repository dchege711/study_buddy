import { UndirectedGraph } from "./core/graph.js";
import { TernarySearchTrie } from "./core/ternary-search-trie.js";

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
export class AutoComplete {

    prefixTree: TernarySearchTrie = new TernarySearchTrie([]);
    graph: UndirectedGraph = new UndirectedGraph();

    initializePrefixTree(words: string[]) {
        this.prefixTree = new TernarySearchTrie(words);
    }

    keysWithPrefix(prefix: string): string[] {
        return this.prefixTree.keysWithPrefix(prefix);
    }

    updatePrefixTree(word: string) {
        this.prefixTree.put(word);
    }

    initializeGraphFromGroups(wordGroups: string[][]) {
        this.graph = new UndirectedGraph();
        let words, weight;
        for (let i = 0; i < wordGroups.length; i++) {
            words = wordGroups[i];
            for (let j = 0; j < words.length; j++) {
                for (let k = 0; k < words.length; k++) {
                    if (j !== k) {
                        weight = this.graph.getEdgeWeight(words[j], words[k]) || 1;
                        this.graph.addEdge(words[j], words[k], 1 / (1/weight + 1));
                    }
                }
            }
        }
    }

    addPairToGraph(wordA: string, wordB: string, edgeWeight: number = 1) {
        let weight = this.graph.getEdgeWeight(wordA, wordB) || 1;
        this.graph.addEdge(wordA, wordB, 1 / (1/weight + edgeWeight));
    }

    kNeighbors(words: string[], k: number = 10): string[] {
        return this.graph.kNearNeighbors(words, k);
    }

}
