import { Runner } from "mocha";

import { PORT } from "./config";
import { close as closeEmailClient } from "./models/EmailClient";
import { deleteAllAccounts } from "./models/LogInUtilities";
import { closeMongooseConnection } from "./models/MongooseClient";
import { app } from "./server";

/**
 * Root hooks are ran before (or after) every test in every file.
 *
 * [1]: https://mochajs.org/#root-hook-plugins
 */
export const mochaHooks = {
  /**
   * In both parallel and serial modes, runs before each test.
   */
  async beforeEach() {
    await deleteAllAccounts([]);
  },

  /**
   * In serial mode, run after all tests end, once only.
   *
   * In parallel mode, run after all tests end, for each file.
   */
  async afterAll() {
    // await closeLoginUtils();
    // await dbConnection.closeMongooseConnection();

    // const whyIsNodeRunning = require("why-is-node-running");
    // setInterval(whyIsNodeRunning, 8000);

    return Promise.resolve();
  },
};

/**
 * Unlike root hooks, global fixtures like `mochaGlobalSetup` and
 * `mochaGlobalTeardown`:
 *
 * - Are guaranteed to execute once and only once.
 * - Work identically parallel mode, watch mode, and serial mode.
 * - Do not share a context with tests, suites, or other hooks
 *
 * [1]: https://mochajs.org/#global-fixtures
 */

/**
 * Run once before all tests.
 */
export async function mochaGlobalSetup(this: Runner) {
  this.server = app.listen(PORT);
  console.log(`Server listening on port ${PORT}`);
}

/**
 * Run once after all tests.
 */
export async function mochaGlobalTeardown(this: Runner) {
  closeEmailClient();
  await closeMongooseConnection();
  this.server.close();
}

// In case the process doesn't close, run this to discover why
// const whyIsNodeRunning = require("why-is-node-running");
// setTimeout(whyIsNodeRunning, 5000);
