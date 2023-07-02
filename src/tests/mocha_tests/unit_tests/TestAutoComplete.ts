"use strict";

import { mongooseConnection } from "../../../models/MongooseClient";

import { expect } from "chai";

const UndirectedGraph = require("../../../../public/src/Graph.js");
const AutoComplete = require("../../../../public/src/AutoComplete.js");

import { deleteAllAccounts } from "../../../models/LogInUtilities";
import { CreateCardParams, createMany, getTagGroupings } from "../../../models/CardsMongoDB";
import { getDummyAccount } from "../../DummyAccountUtils";

describe("Test CardsDB\n", function() {
    let userIDInApp: number;

    before(function() {
        return getDummyAccount()
            .then((user) => { userIDInApp = user.userIDInApp; });
    });

    after(function() {
        return deleteAllAccounts([]);
    });

    it("should provide correct tag groupings", async function() {
        let sampleCards: CreateCardParams[] = [
            {
                title: "A", description: "B", createdById: userIDInApp,
                urgency: 1, isPublic: true, parent: "", tags: "a b"
            },
            {
                title: "A", description: "B", createdById: userIDInApp,
                urgency: 1, isPublic: true, parent: "", tags: "c d"
            },
            {
                title: "A", description: "B", createdById: userIDInApp,
                urgency: 1, isPublic: true, parent: "", tags: "a d"
            },
            {
                title: "A", description: "B", createdById: userIDInApp,
                urgency: 1, isPublic: true, parent: "", tags: "x"
            },
            {
                title: "A", description: "B", createdById: userIDInApp,
                urgency: 1, isPublic: true, parent: "", tags: "y"
            },
        ];
        await createMany(sampleCards);

        let tagGroups = await getTagGroupings({userIDInApp});
        tagGroups.sort();

        let expectedTagGroups: string[][] = [];
        for (let card of sampleCards) {
            expectedTagGroups.push(card.tags.split(" "));
            expectedTagGroups.push(["sample_card"]);
        }
        expectedTagGroups.sort();

        expect(tagGroups).deep.equal(expectedTagGroups);
    });
});

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

describe("Test AutoComplete\n", function() {
    it("should put more weight on repeated edges", function() {
        let tagGroups = [
            ["a", "b", "c"],
            ["a",      "c", "d"],
            ["a",               "e"],
            [                   "e", "f"],
            [                            "g", "h"]
        ]
        let autoComplete = new AutoComplete();
        autoComplete.initializeGraphFromGroups(tagGroups);

        // "c" is the closest neighbor to "a" because the pairing appears twice.
        let neighbors = autoComplete.kNeighbors(["a"], 1);
        expect(neighbors).deep.equal(["c"]);

        // Closest neighbors are symmetrical.
        neighbors = autoComplete.kNeighbors(["c"], 1);
        expect(neighbors).deep.equal(["a"]);
    });
});
