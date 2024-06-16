import {
  MaxPriorityQueue,
  MaxPriorityQueueKey,
  MaxPriorityQueueKeyAndWeight,
} from "./max-priority-queue.js";

/**
 * @description A minimal graph data type
 *
 * @class
 */
export class UndirectedGraph {
  adj: { [node1: string]: { [node2: string]: number } } = {};

  /**
   * @description Add edge `(nodeOneID, nodeTwoID)` into the graph and set its weight
   * to `weight`.
   *
   * @param nodeOneID the id of the first node
   * @param nodeTwoID the id of the second node
   * @param weight the weight to be assigned to the edge
   */
  addEdge(nodeOneID: string, nodeTwoID: string, weight: number = 1) {
    if (this.adj[nodeOneID] === undefined) { this.adj[nodeOneID] = {}; }
    this.adj[nodeOneID][nodeTwoID] = weight;

    if (this.adj[nodeTwoID] === undefined) { this.adj[nodeTwoID] = {}; }
    this.adj[nodeTwoID][nodeOneID] = weight;
  }

  /**
   * @returns {Number} the weight assigned to the `(nodeOneID, nodeTwoID)` if
   * the edge exists. If the edge doesn't exist, returns `null`.
   */
  getEdgeWeight(nodeOneID: string, nodeTwoID: string): number | null {
    if (this.adj[nodeOneID] && this.adj[nodeOneID][nodeTwoID]) {
      return this.adj[nodeOneID][nodeTwoID];
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
  kNearNeighbors(nodeIDs: string[], k: number = 7): string[] {
    const kNeighbors: Map<MaxPriorityQueueKey, number> = new Map([]);
    const alreadySeenIDs: Set<MaxPriorityQueueKey> = new Set(nodeIDs);
    let pq = new MaxPriorityQueue<string>();

    const enqueue = (
      node: MaxPriorityQueueKey,
      currentPQ: MaxPriorityQueue<string>,
    ): void => {
      if (!this.adj[node]) { return; }
      Object.keys(this.adj[node]).forEach((otherNode) => {
        if (!alreadySeenIDs.has(otherNode)) {
          currentPQ.insert([otherNode, this.adj[node][otherNode] * -1]);
        }
      });
    };

    nodeIDs.forEach((nodeID) => {
      enqueue(nodeID, pq);
    });

    let nodeAndNegatedDistance: MaxPriorityQueueKeyAndWeight | null;
    let nextPQ: MaxPriorityQueue<string>;
    while (kNeighbors.size < k && !pq.is_empty()) {
      nextPQ = new MaxPriorityQueue<string>();
      while (kNeighbors.size < k && !pq.is_empty()) {
        nodeAndNegatedDistance = pq.del_max();
        if (nodeAndNegatedDistance === null) { continue; }

        if (!kNeighbors.has(nodeAndNegatedDistance[0])) {
          kNeighbors.set(
            nodeAndNegatedDistance[0],
            nodeAndNegatedDistance[1] * -1,
          );
          enqueue(nodeAndNegatedDistance[0], nextPQ);
          alreadySeenIDs.add(nodeAndNegatedDistance[0]);
        }
      }
      pq = nextPQ;
    }

    return Array.from(kNeighbors.keys()).map(s => s as string);
  }
}
