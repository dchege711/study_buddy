import { close as closeLoginUtils } from "./models/LogInUtilities";
import { dbConnection, server } from "./server";

/**
 * Root hooks are ran before (or after) every test in every file.
 *
 * [1]: https://mochajs.org/#root-hook-plugins
 */
export const mochaHooks = {
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

export async function mochaGlobalTeardown() {
  await closeLoginUtils();
  await dbConnection.closeMongooseConnection();
  server.close();
}

// In case the process doesn't close, run this to discover why
// const whyIsNodeRunning = require("why-is-node-running");
// setTimeout(whyIsNodeRunning, 5000);
