/**
 * Implements a max priority queue with a binary heap.
 * Adapted from https://algs4.cs.princeton.edu/code/edu/princeton/cs/algs4/MaxPQ.java.html
 */
maxPQ = function() {
    
    var pq_object = {};

    var pq;
    var n = 0;

    pq_object.initialize = function(keys_and_weights) {
        n = keys_and_weights.length;
        pq = Array(n + 1).fill([null, Number.NEGATIVE_INFINITY]);

        for (var i = 0; i < n; i++) {
            pq[i+1] = keys_and_weights[i];
        }

        for (var k = Math.floor(n/2); k >= 1; k--) {
            sink(k);
        }

        // console.assert(isMaxHeap(1), "Max Heap invariant has been broken");
    };

    pq_object.isEmpty = function() {
        return n === 0;
    };

    pq_object.size = function() {
        return n;
    };

    pq_object.insert = function(key_and_weight) {
        if (n === pq.length - 1) resize(2 * pq.length);
        
        n = n + 1;
        pq[n] = key_and_weight;
        swim(n);
        // console.assert(isMaxHeap(1), "Max Heap invariant has been broken");
    }

    pq_object.delMax = function() {
        if (this.isEmpty()) return [null, Number.NEGATIVE_INFINITY];

        var max = pq[1];
        exchange(1, n);
        n = n - 1;
        sink(1);
        pq[n + 1] = [null, Number.NEGATIVE_INFINITY];

        if ((n > 0) && (n === Math.floor((pq.length - 1) / 4))) 
            resize(Math.floor(pq.length / 4));
        // console.assert(isMaxHeap(1), "Max Heap invariant has been broken");
        
        return max;
    };

    function resize(capacity) {
        // console.assert(capacity > n);
        var newPQ = Array(capacity).fill([null, Number.NEGATIVE_INFINITY]);
        for (var i = 0; i <= n; i++) {
            newPQ[i] = pq[i];
        }
        pq = newPQ;
    }

    function swim(k) {
        // console.assert(isInt(k));
        while (k > 1 && less(Math.floor(k/2), k)) {
            exchange(k, Math.floor(k/2));
            k = Math.floor(k/2);
        }
    }

    function sink(k) {
        // console.assert(isInt(k));
        while (2 * k <= n) {
            var j = 2 * k;
            if (j < n && less(j, j+1)) j++;
            if (!less(k, j)) break;
            exchange(k, j);
            k = j;
        }
    }

    function less(i, j) {
        // console.assert(isInt(i));
        // console.assert(isInt(j));
        // console.log("size: " + n + ": " + i + " -> " + pq[i] + ", " + j + " -> " + pq[j]);
        return pq[i][1] < pq[j][1];
    }

    function exchange(i, j) {
        // console.assert(isInt(i));
        // console.assert(isInt(j));

        var swap = pq[i];
        pq[i] = pq[j];
        pq[j] = swap;
    }

    function isInt(x) {
        return Math.floor(x) === x;
    }

    function isMaxHeap(k) {
        if (k > n) return true;
        var left = 2*k;
        var right = 2*k + 1;
        if (left <= n && less(k, left)) return false;
        if (right <= n && less(k, right)) return false;
        return isMaxHeap(left) && isMaxHeap(right);
    }

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
};

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