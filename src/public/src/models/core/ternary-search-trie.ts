interface TSTNode {
  c: string;
  left: TSTNode | null;
  mid: TSTNode | null;
  right: TSTNode | null;
  val: boolean | null;
}

/**
 * @description A minimal version of the ternary search trie as implemented by
 * Robert Sedgewick and Kevin Wayne. The original implementation was in Java and
 * was licensed under GNU GPLv3, and
 * [can be found here](https://algs4.cs.princeton.edu/code/edu/princeton/cs/algs4/TST.java)
 *
 * @param {String[]} words Words to initialize the trie with.
 *
 * @class
 */
export class TernarySearchTrie {
  root: TSTNode | null = null;

  constructor(words: string[]) {
    for (const word of words) {
      this.root = this.insertKey(this.root, word, 0);
    }
  }

  /**
   * @description Check whether `key` exists in the trie
   * @param {String} key The key to check in the trie.
   * @returns {Boolean} `true` if the key exists, `false` otherwise.
   */
  contains(key: string): boolean {
    if (!this.root || !key || key.length === 0) { return false; }
    const tst_node = this.getKey(this.root, key, 0);
    return tst_node !== null && tst_node.val !== null;
  }

  /**
   * @description Add `key` to the ternary search trie. Null or zero-length
   * keys will not be added to the ternary search trie.
   * @param {String} key The key to be added to the ternary search trie.
   * @returns {VoidFunction}
   */
  put(key: string): void {
    if (!key || key.length === 0) { return; }
    this.root = this.insertKey(this.root, key, 0);
  }

  /**
   * @description Fetch all the keys that begin with a given prefix
   * @param {String} prefix The prefix to be matched
   * @returns {String[]} An array of all keys that have the provided prefix
   */
  keysWithPrefix(prefix: string): string[] {
    if (!this.root) { return []; }

    const matching_keys: string[] = [];
    const tst_node = this.getKey(this.root, prefix, 0);
    if (!tst_node) { return matching_keys; }
    if (tst_node.val) { matching_keys.push(prefix); }
    this.collect(tst_node.mid, prefix, matching_keys);
    return matching_keys;
  }

  /**
   * @description Return the node associated with `key` in the TST.
   * @param {Object} x A node in the TST. Might be null
   * @param {String} key The string to be inserted into the TST
   * @param {Number} i The character to be considered in the string
   * @returns {Object} A node in the TST. Might be null.
   */
  getKey(x: TSTNode | null, key: string, i: number): TSTNode | null {
    if (x === null) { return null; }

    const c = key.charAt(i);
    if (c < x.c) { return this.getKey(x.left, key, i); }
    else if (c > x.c) { return this.getKey(x.right, key, i); }
    else if (i < key.length - 1) { return this.getKey(x.mid, key, i + 1); }
    else { return x; }
  }

  /**
   * @description Collect all keys that share prefix `prefix`
   * @param {Object} x A node in the TST
   * @param {String} prefix The prefix to match
   * @param {String[]} matching_keys An array that collects all matching keys
   * @returns {VoidFunction}
   */
  collect(x: TSTNode | null, prefix: string, matching_keys: string[]): void {
    if (!x) { return; }

    this.collect(x.left, prefix, matching_keys);
    if (x.val) { matching_keys.push(prefix + x.c); }
    this.collect(x.mid, prefix + x.c, matching_keys);
    prefix = prefix.slice(0, prefix.length);
    this.collect(x.right, prefix, matching_keys);
  }

  /**
   * @description Insert `key` into the ternary search trie.
   * @param {Object} x A node in the TST. Might be null
   * @param {String} key The string to be inserted into the TST
   * @param {Number} i The character to be considered in the string
   * @returns {Object} A node in the TST. Might be null.
   */
  insertKey(x: TSTNode | null, key: string, i: number): TSTNode | null {
    const current_char = key.charAt(i);
    if (x === null) {
      x = {
        c: current_char,
        left: null,
        right: null,
        mid: null,
        val: null,
      };
    }
    if (current_char < x.c) { x.left = this.insertKey(x.left, key, i); }
    else if (current_char > x.c) { x.right = this.insertKey(x.right, key, i); }
    else if (i < key.length - 1) { x.mid = this.insertKey(x.mid, key, i + 1); }
    else { x.val = true; }
    return x;
  }
}
