"uses strict";

const MaxPQ = require("./MaxPriorityQueue.js");

/**
 * @description A minimal graph data type
 *
 * @class
 */
function UndirectedGraph() {

    UndirectedGraph.__adj = {};
    this.__adj = UndirectedGraph.__adj; // Future Me: I'm so sorry. Quick way to inspect the graph

    /**
     * @description Add edge `(nodeOneID, nodeTwoID)` into the graph and set its weight
     * to `weight`.
     *
     * @param nodeOneID the id of the first node
     * @param nodeTwoID the id of the second node
     * @param weight the weight to be assigned to the edge
     *
     */
    this.addEdge = function(nodeOneID, nodeTwoID, weight=1) {

        if (UndirectedGraph.__adj[nodeOneID] === undefined) UndirectedGraph.__adj[nodeOneID] = {};
        UndirectedGraph.__adj[nodeOneID][nodeTwoID] = weight;

        if (UndirectedGraph.__adj[nodeTwoID] === undefined) UndirectedGraph.__adj[nodeTwoID] = {};
        UndirectedGraph.__adj[nodeTwoID][nodeOneID] = weight;
    }

    /**
     * @returns {Number} the weight assigned to the `(nodeOneID, nodeTwoID)` if
     * the edge exists. If the edge doesn't exist, returns `null`.
     */
    this.getEdgeWeight = function(nodeOneID, nodeTwoID) {
        if (UndirectedGraph.__adj[nodeOneID] && UndirectedGraph.__adj[nodeOneID][nodeTwoID]) {
            return UndirectedGraph.__adj[nodeOneID][nodeTwoID];
        } else {
            return null;
        }
    }

    /**
     * @description Find `k` nodes that are near the input array of node IDs.
     * This is a rough estimate which doesn't guarantee global optimality.
     * The search for the neighbors proceeds in a BFS manner.
     *
     * @returns Map whose keys are the `k` nodes near to `nodeID` and their
     * values are the respective distances
     */
    this.kNearNeighbors = function(nodeIDs, k=7) {
        let kNeighbors = new Map([]);
        let alreadySeenIDs = new Set(nodeIDs);
        let pq = new MaxPQ();

        function __enqueue(node, currentPQ) {
            if (!UndirectedGraph.__adj[node]) return;
            Object.keys(UndirectedGraph.__adj[node]).forEach((otherNode) => {
                if (!alreadySeenIDs.has(otherNode)) {
                    currentPQ.insert([otherNode, UndirectedGraph.__adj[node][otherNode] * -1]);
                }
            });
        }

        nodeIDs.forEach((nodeID) => { __enqueue(nodeID, pq); });

        let nodeAndNegatedDistance, nextPQ;
        while (kNeighbors.size < k && !pq.is_empty()) {
            nextPQ = new MaxPQ();
            while (kNeighbors.size < k && !pq.is_empty()) {
                nodeAndNegatedDistance = pq.del_max();
                if (nodeAndNegatedDistance[0] !== null) {
                    kNeighbors.set(nodeAndNegatedDistance[0], nodeAndNegatedDistance[1] * -1);
                    __enqueue(nodeAndNegatedDistance[0], nextPQ);
                    alreadySeenIDs.add(nodeAndNegatedDistance[0]);
                }
            }
            pq = nextPQ;
        }

        return Array.from(kNeighbors.keys());
    }

}

module.exports = UndirectedGraph;
