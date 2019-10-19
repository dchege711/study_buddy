/**
 * @description Set up the global setup and teardown functions. Should be 
 * included in the mocha command under `--file <path/to/this/file.ts>`
 * 
 * {@link https://mochajs.org/#-file-filedirectoryglob}
 */

import assert = require("assert");

// const whyIsNodeRunning = require("why-is-node-running");
import { shutdownServer } from "./App";
import { dbConnection } from "./models/MongooseClient";
import { User } from "./models/mongoose_models/UserSchema";

// Fetch a user. This ensures that `MongooseClient` has opened a connection
before(function () {
    return User.findOne({}).exec();
});

// Clean the database before each test.
beforeEach(async function() {
    const collectionNames = Object.keys(User.db.collections);
    for (let collectionName in collectionNames) {
        // Dropping a collection if it doesn't [yet] exist leads to an error
        // Instead, drop all documents in a collection
        let collection = User.db.collection(collectionName)
        await collection.deleteMany({});
        assert.strictEqual((await collection.countDocuments({})), 0); 
    }
});

after(async function() {  
    await shutdownServer();
    // setTimeout(whyIsNodeRunning, 5000);
    console.log("Please stop using --exit. https://mochajs.org/#-exit");
});
