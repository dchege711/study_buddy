import { expect } from "chai";

import { UndirectedGraph } from "./graph.js";

describe("Test Graph\n", function() {
  it("should have undirected edges", function() {
      let graph = new UndirectedGraph();
      expect(graph.getEdgeWeight("a", "b")).to.be.null;

      graph.addEdge("a", "b", 2);
      expect(graph.getEdgeWeight("a", "b")).equal(2);
      expect(graph.getEdgeWeight("b", "a")).equal(2);
  });

  it("should return connected tags as neighbors", function() {
      /**
       * The graph looks like this:
       *
       *        a ------ d
       *      /   \
       *    b ---- c              f ---- g ---- h
       *      \   /
       *        e
       *
       */
      let edges = [
          ["a", "b"],
          ["a", "c"],
          ["a", "d"],
          ["b", "e"],
          ["b", "c"],
          ["e", "c"],
          ["f", "g"],
          ["g", "h"],
      ];
      let graph = new UndirectedGraph();
      for (let edge of edges) {
          graph.addEdge(edge[0], edge[1]);
      }

      let neighbors = graph.kNearNeighbors(["a", "b"], 10);
      neighbors.sort();
      expect(neighbors).deep.equal(["c", "d", "e"]);

      neighbors = graph.kNearNeighbors(["d"], 3);
      neighbors.sort();
      expect(neighbors).deep.equal(["a", "b", "c"]);

      neighbors = graph.kNearNeighbors(["f"], 3);
      neighbors.sort();
      expect(neighbors).deep.equal(["g", "h"]);
  });
});
