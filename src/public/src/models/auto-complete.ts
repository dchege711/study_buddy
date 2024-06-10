import { UndirectedGraph } from "./core/graph.js";
import { TernarySearchTrie } from "./core/ternary-search-trie.js";

/**
 * @description Provide autocomplete functionality for a universe of strings,
 * e.g., card tags. This helps the UI provide suggestions to the user. The
 * suggestions are generated in one of 2 ways:
 *
 * - If a partial word is being entered, other strings that share the prefix are
 *   provided, e.g. `pr` might generate `probability` and `primes` if the user
 *   has used these words are known by `AutoComplete`.
 *
 * - Near neighbors of an existing set of strings. The graph has tags as nodes,
 *   with links between strings that have been associated with each other.
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
            this.graph.addEdge(words[j], words[k], 1 / (1 / weight + 1));
          }
        }
      }
    }
  }

  addPairToGraph(wordA: string, wordB: string, edgeWeight: number = 1) {
    const weight = this.graph.getEdgeWeight(wordA, wordB) || 1;
    this.graph.addEdge(wordA, wordB, 1 / (1 / weight + edgeWeight));
  }

  kNeighbors(words: string[], k: number = 10): string[] {
    return this.graph.kNearNeighbors(words, k);
  }
}
