"use strict";

import { mongooseConnection } from "../../../models/MongooseClient";

const Graph = require("../../../../public/src/Graph.js");

import { deleteAllAccounts } from "../../../models/LogInUtilities";
import { getTagGroupings } from "../../../models/CardsMongoDB";
import { populateDummyAccount } from "../../DummyAccountUtils";

let userTagGroups: string[][];
let myGraph = new Graph();

describe("Test Graph.js\n", function() {

    // Setup the data that will be used for testing
    before(function(done) {
        populateDummyAccount(20)
            .then(function(user) {
                return getTagGroupings({userIDInApp: user.userIDInApp});
            })
            .then(function(response) {
                userTagGroups = response.message;
                done();
            })
            .catch(function(err) { done(err); });
    });

    after(function() {
        return deleteAllAccounts();
    });

    it("should accept new edges", function(done) {
        let tags, weight;
        for (let i = 0; i < userTagGroups.length; i++) {
            tags = userTagGroups[i];
            for (let j = 0; j < tags.length; j++) {
                for (let k = 0; k < tags.length; k++) {
                    if (j !== k) {
                        weight = myGraph.getEdgeWeight(tags[j], tags[k]) || 1;
                        myGraph.addEdge(tags[j], tags[k], 1 / (1/weight + 1));
                    }
                }
            }
        }
        done();
    });

    it("should return reasonable neighbors", function(done) {
        let randomTagGroup, N = userTagGroups.length, neighbors, k;
        for (let i = 0; i < 3; i++) {
            randomTagGroup = userTagGroups[Math.floor(Math.random() * (N))];
            k = 1 + Math.floor(Math.random() * 8);
            neighbors = myGraph.kNearNeighbors(randomTagGroup, k);
            console.log(`${k} neighbors of ${randomTagGroup.join(", ")}: ${neighbors.join(", ")}`);
        }
        done();
    });

});
