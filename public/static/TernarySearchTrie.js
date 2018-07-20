/**
 * @author Chege Gitau
 * @description A minimal version of the ternary search trie as implemented by
 * Robert Sedgewick and Kevin Wayne. The original implementation was in Java and
 * was licensed under GNU GPLv3, and can be found here:
 * 
 * https://algs4.cs.princeton.edu/code/edu/princeton/cs/algs4/TST.java
 * 
 */

/**
 * Minimal implementation of a ternary search trie. Intended to be used for
 * autocomplete purposes. No values are stored at the nodes of the TST.
 * @param {String[]} words Words to initialize the trie with.
 */
function TernarySearchTrie(words) {
    var TST = {};
    var root = null;

    for (let i = 0; i < words.length; i++) root = insert_key(root, words[i], 0);

    /**
     * @description Check whether `key` exists in the trie
     * @param {String} key The key to check in the trie.
     * @returns {Boolean} `true` if the key exists, `false` otherwise.
     */
    TST.contains = function(key) {
        if (!key || key.length === 0) return false;
        var tst_node = get_key(root, key, 0);
        if (tst_node === null) return null;
        return tst_node.val !== null;
    };

    /**
     * @description Add `key` to the ternary search trie. Null or zero-length
     * keys will not be added to the ternary search trie.
     * @param {String} key The key to be added to the ternary search trie.
     * @returns {VoidFunction} 
     */
    TST.put = function (key) {
        if (!key || key.length === 0) return;
        root = insert_key(root, key, 0);
    };

    /**
     * @description Fetch all the keys that begin with a given prefix
     * @param {String} prefix The prefix to be matched
     * @returns {String[]} An array of all keys that have the provided prefix
     */
    TST.keys_with_prefix = function (prefix) {
        var matching_keys = [];
        var tst_node = get_key(root, prefix, 0);
        if (!tst_node) return matching_keys;
        if (tst_node.val) matching_keys.push(prefix);
        collect(tst_node.mid, prefix, matching_keys);
        return matching_keys;
    };

    /**
     * @description Return the node associated with `key` in the TST.
     * @param {Object} x A node in the TST. Might be null
     * @param {String} key The string to be inserted into the TST
     * @param {Number} i The character to be considered in the string
     * @returns {Object} A node in the TST. Might be null.
     */
    function get_key(x, key, i) {
        if (x === null) return null;
        var c = key.charAt(i);
        if (c < x.c) return get_key(x.left, key, i);
        else if (c > x.c) return get_key(x.right, key, i);
        else if (i < key.length - 1) return get_key(x.mid, key, i+1);
        else return x;
    }

    /**
     * @description Collect all keys that share prefix `prefix`
     * @param {Object} x A node in the TST
     * @param {String} prefix The prefix to match
     * @param {String[]} matching_keys An array that collects all matching keys
     * @returns {VoidFunction}
     */
    function collect(x, prefix, matching_keys) {
        if (!x) return;
        collect(x.left, prefix, matching_keys);
        if (x.val) matching_keys.push(prefix + x.c);
        collect(x.mid, prefix + x.c, matching_keys);
        prefix = prefix.slice(0, prefix.length-1);
        collect(x.right, prefix, matching_keys);
    }

    /**
     * @description Insert `key` into the ternary search trie.
     * @param {Object} x A node in the TST. Might be null
     * @param {String} key The string to be inserted into the TST
     * @param {Number} i The character to be considered in the string
     * @returns {Object} A node in the TST. Might be null.
     */
    function insert_key(x, key, i) {
        var current_char = key.charAt(i);
        if (x === null) {
            x = { 
                c: current_char, left: null, right: null, mid: null, val:null
            };
        }
        if (current_char < x.c) x.left = insert_key(x.left, key, i);
        else if (current_char > x.c) x.right = insert_key(x.right, key, i);
        else if (i < key.length - 1) x.mid = insert_key(x.mid, key, i+1);
        else x.val = true;
        return x;
    }

    return TST;
}

/**
 * Sanity check...
 */
if (typeof require !== "undefined" && require.main === module) {
    var words_one = [
        "1984", "miscellaneous", "fiction", "algorithms", "graph_theory", 
        "c", "programming", "cos217", "ele302", "hardware", "cos340", 
        "mathematics", "networks", "ele301", "book_excerpts", "articles", 
        "tech", "ai", "pointers", "books", "probability", "cs_theory", 
        "education", "the_case_against_education", "getting_real", 
        "entrepreneurship", "orf401", "neural_networks", "stochastics", 
        "lauren_ipsum", "systems", "book_exercpts", "business", "set_theory", 
        "tv_quotes", "silicon_valley_hbo", "arthur_clarke", "linux", 
        "assembly", "c_system", "c_memory", "memory", "programming_challenges", 
        "arrays", "algebra", "primes", "linear_algebra", "data_structures", 
        "string_processing", "sorting", "dynamic_programming", "searching"
    ];

    var words_two = [
        "trees", "search", "order-statistics", "parks_and_rec", "short_story",
        "reduction", "brave_new_world", "dystopia", "politics", "language",
        "rhetoric", "binary_search", "c13u_diaries"
    ];

    var testTST = TernarySearchTrie(words_one);

    console.log("Printing keys with prefix 'pr'...");
    console.log(testTST.keys_with_prefix("pr"));

    for (let i = 0; i < words_two.length; i++) testTST.put(words_two[i]);

    console.log("Printing keys with prefix 'red'...");
    console.log(testTST.keys_with_prefix("red"));

    console.log("Printing all keys with prefix 'sdcdvfv'...");
    console.log(testTST.keys_with_prefix("sdcdvfv"));

}