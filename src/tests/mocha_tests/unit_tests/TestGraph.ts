"use strict";

const dbConnection = require("../../../models/MongooseClient.js");
const Graph = require("../../../public/src/Graph.js");
const CardsDB = require("../../../models/CardsMongoDB.js");
const DummyAccountUtils = require("../../DummyAccountUtils.js");
const LogInUtilities = require("../../../models/LogInUtilities.js");

let userTagGroups;
let myGraph = new Graph();
describe("Test Graph.js\n", function() {

    // Setup the data that will be used for testing
    before(function(done) {
        DummyAccountUtils.populateDummyAccount(20)
            .then(function(user) {
                return CardsDB.getTagGroupings({userIDInApp: user.userIDInApp});
            })
            .then(function(response) {
                userTagGroups = response.message;
                done();
            })
            .catch(function(err) { done(err); });
    });

    after(function() {
        return LogInUtilities.deleteAllAccounts();
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
