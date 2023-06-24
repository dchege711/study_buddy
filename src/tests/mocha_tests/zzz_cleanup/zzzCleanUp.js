"use strict";

// const emailClient = require("../../models/EmailClient.js");
const dbConnection = require("../../../models/MongooseClient.js");
const LoginUtils = require("../../../models/LogInUtilities.js");


/**
 * @description Clean up after all tests are done. This file is prefixed with
 * a lower-case z. If mocha's --sort is set, this file should be executed last
 * (unless you have another test file starting with `zzzD...`) A global cleanup
 * is necessary since some resources, e.g. the mongoose connection are shared
 * between the running processes. If the mongoose connection is closed
 * pre-maturely in one script, subsequent scripts that need mongoose will
 * timeout.
 */

describe("Cleaning up pending actions\n", function() {

    it("close all pending actions", function() {
        LoginUtils
            .close()
            .then(function() { return dbConnection.closeMongooseConnection(); })
    });

});

// In case the process doesn't close, run this to discover why
// const whyIsNodeRunning = require("why-is-node-running");
// setTimeout(whyIsNodeRunning, 5000);
