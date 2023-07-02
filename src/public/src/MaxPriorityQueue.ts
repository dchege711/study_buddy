/**
 * Implements a max priority queue with a binary heap.
 * Allows us to maintain a sorted deck of N items in log N time.
 * Adapted from https://algs4.cs.princeton.edu/code/edu/princeton/cs/algs4/MaxPQ.java.html
 *
 * @class
 */

export module MaxPriorityQueue {
    export type T = string | number;
    export type KeyAndWeight = [T, number];
}

export class MaxPriorityQueue<T extends MaxPriorityQueue.T>{
    pq: MaxPriorityQueue.KeyAndWeight[] = [];
    n = 0;
    keys_insertion_order: {[key: MaxPriorityQueue.T]: number} = {};

    /* An ever-increasing variable that allows stable sorting in the PQ */
    insert_order_id = 0; // We're not famous enough for an overflow problem

    /**
     * @description Initialize the max PQ data structure.
     * @param {Array} keys_and_weights Array of (key, weight) tuples
     */
    initialize(keys_and_weights: MaxPriorityQueue.KeyAndWeight[]) {
        this.n = keys_and_weights.length;
        this.pq = Array(this.n + 1).fill([null, Number.NEGATIVE_INFINITY]);

        for (let i = 0; i < this.n; i++) {
            this.keys_insertion_order[keys_and_weights[i][0]] = this.insert_order_id;
            this.pq[i+1] = keys_and_weights[i];
            this.insert_order_id += 1;
        }

        for (var k = Math.floor(this.n/2); k >= 1; k--) {
            this.sink(k);
        }

        // console.assert(is_max_heap(1), "Max Heap invariant has been broken");
    };

    /**
     * @description Check whether the PQ is empty
     * @returns {Boolean} `true` if empty, `false` otherwise.
     */
    is_empty(): boolean {
        return this.n === 0;
    };

    /**
     * @description Return the number of items in the PQ
     * @returns {Number} The number of items in the PQ
     */
    size(): number {
        return this.n;
    };

    /**
     * @description Return `true` iff the specified key exists in the PQ
     * @param {String} key The key of the item being queried
     */
    contains_key(key: T): boolean {
        return this.keys_insertion_order.hasOwnProperty(key);
    };

    /**
     * @description Insert `key_and_weight` into the priority queue.
     * @param {Array} key_and_weight A tuple representing the key of the value
     * to be inserted, and its weight relative to what's in the PQ.
     */
    insert(key_and_weight: MaxPriorityQueue.KeyAndWeight) {
        if (this.n === this.pq.length - 1) this.resize(2 * this.pq.length);

        this.n += 1;
        if (!this.keys_insertion_order.hasOwnProperty(key_and_weight[0])) {
            this.keys_insertion_order[key_and_weight[0]] = this.insert_order_id;
            this.insert_order_id += 1;
        }
        this.pq[this.n] = key_and_weight;
        this.swim(this.n);
        // console.assert(is_max_heap(1), "Max Heap invariant has been broken");
    };

    /**
     * @description Delete the item that has the most weight in the PQ.
     */
    del_max(): MaxPriorityQueue.KeyAndWeight | null {
        if (this.is_empty()) return null;

        let max = this.pq[1];
        this.exchange(1, this.n);
        this.n -= 1;
        this.sink(1);
        this.pq.pop();

        if ((this.n > 0) && (this.n === Math.floor((this.pq.length - 1) / 4)))
            this.resize(Math.floor(this.pq.length / 2));
        // console.assert(is_max_heap(1), "Max Heap invariant has been broken");

        delete this.keys_insertion_order[max[0]];
        return max;
    };

    /**
     * @description Return the item at the top of the PQ, but don't
     * delete it.
     */
    peek(): MaxPriorityQueue.KeyAndWeight | null {
        if (this.n === 0) return null;
        return this.pq[1];
    };

    /**
     * @description Increase/descrease the underlying array for the PQ.
     * We're currently doubling the size at half capacity, and halving
     * at quarter capacity.
     * @param {Number} capacity The new capacity of the PQ
     */
    resize(capacity: number) {
        // console.assert(capacity > n);
        let newPQ = Array(capacity).fill([null, Number.NEGATIVE_INFINITY]);
        for (var i = 0; i <= this.n; i++) {
            newPQ[i] = this.pq[i];
        }
        this.pq = newPQ;
    }

    /**
     * @description Move the item at the k'th index up the PQ in order to
     * maintain heap invariant.
     * @param {Number} k The index of the item that needs to be relocated.
     */
    swim(k: number) {
        // console.assert(is_int(k));
        while (k > 1 && this.less(Math.floor(k/2), k)) {
            this.exchange(k, Math.floor(k/2));
            k = Math.floor(k/2);
        }
    }

    /**
     * @description Move the item at the k'th index down the PQ in order to
     * maintain heap invariant.
     * @param {Number} k The index of the item that needs to be relocated.
     */
    sink(k: number) {
        // console.assert(is_int(k));
        while (2 * k <= this.n) {
            var j = 2 * k;
            if (j < this.n && this.less(j, j+1)) j++;
            if (!this.less(k, j)) break;
            this.exchange(k, j);
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
    less(i: number, j: number): boolean {
        // console.assert(is_int(i));
        // console.assert(is_int(j));
        if (this.pq[i][1] !== this.pq[j][1]) return this.pq[i][1] < this.pq[j][1];
        else return this.keys_insertion_order[this.pq[i][0]] < this.keys_insertion_order[this.pq[j][0]];
    }

    /**
     * @description Swap the item at index `i` with the one at index `j`
     * @param {Number} i The index of the first item
     * @param {Number} j The index of the second item
     */
    exchange(i: number, j: number) {
        // console.assert(is_int(i));
        // console.assert(is_int(j));

        var swap = this.pq[i];
        this.pq[i] = this.pq[j];
        this.pq[j] = swap;
    }

    /**
     * @param {Number} x The number that needs to be checked
     * @returns {Boolean} `true` if `x` is an integer, `false` otherwise
     */
    is_int(x: number): boolean {
        return Math.floor(x) === x;
    }

    /**
     * @param {Number} k The index of the item at the root of the (sub)tree
     * @returns {Boolean} `true` if the subtree rooted at satisfies the heap
     * order invariant, `false` otherwise.
     */
    is_max_heap(k: number): boolean {
        if (k > this.n) return true;
        let left = 2*k;
        let right = 2*k + 1;
        if (left <= this.n && this.less(k, left)) return false;
        if (right <= this.n && this.less(k, right)) return false;
        return this.is_max_heap(left) && this.is_max_heap(right);
    }
}
