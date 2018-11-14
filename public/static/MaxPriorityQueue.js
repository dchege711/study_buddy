/**
 * Implements a max priority queue with a binary heap.
 * Allows us to maintain a sorted deck of N items in log N time.
 * Adapted from https://algs4.cs.princeton.edu/code/edu/princeton/cs/algs4/MaxPQ.java.html
 */
function max_PQ() {
    
    /**
     * Holds the class for the max PQ 'class'
     */
    var pq_object = {};

    var pq = [];
    var n = 0;
    var keys_insertion_order = {};

    /* An ever-increasing variable that allows stable sorting in the PQ */
    var insert_order_id = 0; // We're not famous enough for an overflow problem

    /**
     * @description Initialize the max PQ data structure.
     * @param {Array} keys_and_weights Array of (key, weight) tuples
     */
    pq_object.initialize = function(keys_and_weights) {
        n = keys_and_weights.length;
        pq = Array(n + 1).fill([null, Number.NEGATIVE_INFINITY]);

        for (var i = 0; i < n; i++) {
            keys_insertion_order[keys_and_weights[i][0]] = insert_order_id;
            pq[i+1] = keys_and_weights[i];
            insert_order_id += 1;
        }

        for (var k = Math.floor(n/2); k >= 1; k--) {
            sink(k);
        }

        // console.assert(is_max_heap(1), "Max Heap invariant has been broken");
    };

    /**
     * @description Check whether the PQ is empty
     * @returns {Boolean} `true` if empty, `false` otherwise.
     */
    pq_object.is_empty = function() {
        return n === 0;
    };

    /**
     * @description Return the number of items in the PQ
     * @returns {Number} The number of items in the PQ
     */
    pq_object.size = function() {
        return n;
    };

    /**
     * @description Return `true` iff the specified key exists in the PQ
     * @param {String} key The key of the item being queried
     */
    pq_object.contains_key = function(key) {
        return keys_insertion_order.hasOwnProperty(key);
    };

    /**
     * @description Insert `key_and_weight` into the priority queue.
     * @param {Array} key_and_weight A tuple representing the key of the value
     * to be inserted, and its weight relative to what's in the PQ.
     */
    pq_object.insert = function(key_and_weight) {
        if (n === pq.length - 1) resize(2 * pq.length);
        
        n = n + 1;
        if (keys_insertion_order.hasOwnProperty(key_and_weight[0]) === false) {
            keys_insertion_order[key_and_weight[0]] = insert_order_id;
            insert_order_id += 1;
        }
        pq[n] = key_and_weight;
        swim(n);
        // console.assert(is_max_heap(1), "Max Heap invariant has been broken");
    };

    /**
     * @description Delete the item that has the most weight in the PQ.
     */
    pq_object.del_max = function() {
        if (this.is_empty()) return [null, Number.NEGATIVE_INFINITY];

        var max = pq[1];
        exchange(1, n);
        n = n - 1;
        sink(1);
        pq[n + 1] = [null, Number.NEGATIVE_INFINITY];

        if ((n > 0) && (n === Math.floor((pq.length - 1) / 4))) 
            resize(Math.floor(pq.length / 2));
        // console.assert(is_max_heap(1), "Max Heap invariant has been broken");
        
        delete keys_insertion_order[max[0]];
        return max;
    };

    /**
     * @description Return the item at the top of the PQ, but don't 
     * delete it.
     */
    pq_object.peek = function() {
        if (n === 0) return null;
        return pq[1];
    };

    /**
     * @description Increase/descrease the underlying array for the PQ. 
     * We're currently doubling the size at half capacity, and halving 
     * at quarter capacity.
     * @param {Number} capacity The new capacity of the PQ
     */
    function resize(capacity) {
        // console.assert(capacity > n);
        var newPQ = Array(capacity).fill([null, Number.NEGATIVE_INFINITY]);
        for (var i = 0; i <= n; i++) {
            newPQ[i] = pq[i];
        }
        pq = newPQ;
    }

    /**
     * @description Move the item at the k'th index up the PQ in order to 
     * maintain heap invariant.
     * @param {Number} k The index of the item that needs to be relocated.
     */
    function swim(k) {
        // console.assert(is_int(k));
        while (k > 1 && less(Math.floor(k/2), k)) {
            exchange(k, Math.floor(k/2));
            k = Math.floor(k/2);
        }
    }

    /**
     * @description Move the item at the k'th index down the PQ in order to 
     * maintain heap invariant.
     * @param {Number} k The index of the item that needs to be relocated.
     */
    function sink(k) {
        // console.assert(is_int(k));
        while (2 * k <= n) {
            var j = 2 * k;
            if (j < n && less(j, j+1)) j++;
            if (!less(k, j)) break;
            exchange(k, j);
            k = j;
        }
    }

    /**
     * @description Compare the item at index `i` with the one at index `j`.
     * @param {Number} i The index of the first item
     * @param {Number} j The index of the second item
     * @returns {Boolean} `true` if the item at `i` is strictly less than 
     * the one at `j`.
     */
    function less(i, j) {
        // console.assert(is_int(i));
        // console.assert(is_int(j));
        if (pq[i][1] !== pq[j][1]) return pq[i][1] < pq[j][1];
        else return keys_insertion_order[pq[i][0]] < keys_insertion_order[pq[j][0]];
    }

    /**
     * @description Swap the item at index `i` with the one at index `j`
     * @param {Number} i The index of the first item
     * @param {Number} j The index of the second item
     */
    function exchange(i, j) {
        // console.assert(is_int(i));
        // console.assert(is_int(j));

        var swap = pq[i];
        pq[i] = pq[j];
        pq[j] = swap;
    }

    /**
     * @param {Number} x The number that needs to be checked
     * @returns {Boolean} `true` if `x` is an integer, `false` otherwise
     */
    function is_int(x) {
        return Math.floor(x) === x;
    }

    /**
     * @param {Number} k The index of the item at the root of the (sub)tree
     * @returns {Boolean} `true` if the subtree rooted at satisfies the heap
     * order invariant, `false` otherwise.
     */
    function is_max_heap(k) {
        if (k > n) return true;
        var left = 2*k;
        var right = 2*k + 1;
        if (left <= n && less(k, left)) return false;
        if (right <= n && less(k, right)) return false;
        return is_max_heap(left) && is_max_heap(right);
    }

    /**
     * Return an iterator over all items in the PQ
     */
    pq_object[Symbol.iterator] = function* () {
        // MDN: Object.assign(...) copies the reference values
        // JSON.parse(JSON.stringify(pq_object)) loses functions.
        let original_pq = [];
        for (var i = 0; i < pq.length; i++) {
            if (pq[i][0]) {
                original_pq.push(pq[i]);
            }
        }

        while (!this.isEmpty()) {
            yield this.delMax();
        }

        this.initialize(original_pq);
    };

    return pq_object;
}

/**
 * Sanity check...
 */
if (typeof require !== "undefined" && require.main === module) {
    var testPQ = maxPQ();
    var keys_and_weights = [
        ["one", 1], ["five", 5], ["two", 2], 
        ["three", 3], ["zero", 0], ["four", 4] 
    ];
    testPQ.initialize(keys_and_weights);

    console.log("Expect to see 6 items in descending order");
    for (let item of testPQ) {
        console.log(item);
    }

    console.log("Size should be 6: " + testPQ.size());

    testPQ.insert(["ten", 10]);
    testPQ.insert(["twenty", 20]);
    testPQ.insert(["-ve one", -1]);

    console.log("Size should be 9: " + testPQ.size());

    console.log("Expect to see 9 items in descending order");
    for (let item of testPQ) {
        console.log(item);
    }
}

module.exports = max_PQ;
