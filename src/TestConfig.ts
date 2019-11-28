/**
 * @description Set up the global setup and teardown functions. Should be 
 * included in the mocha command under `--file <path/to/this/file.ts>`
 * 
 * {@link https://mochajs.org/#-file-filedirectoryglob}
 */

import assert = require("assert");

// const whyIsNodeRunning = require("why-is-node-running");

before(function () {
});

// Clean the database before each test.
beforeEach(async function() {
});

after(async function() {
});
