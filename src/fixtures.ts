import { Runner } from "mocha";
import { fake, replace } from "sinon";

import { PORT } from "./config";
import { close as closeEmailClient, transporter } from "./models/EmailClient";
import {
  deleteAllAccounts,
  registerUserAndPassword,
} from "./models/LogInUtilities";
import { addPublicUser } from "./models/Miscellaneous";
import { closeMongooseConnection } from "./models/MongooseClient";
import { app } from "./server";
import { dummyAccountDetails } from "./tests/DummyAccountUtils";

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
    return deleteAllAccounts([])
      .then(() => addPublicUser())
      .then(() => registerUserAndPassword(dummyAccountDetails));
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
  // Mock out the outgoing email. There doesn't seem to be a way to mock out
  // ES6 exports.
  replace(transporter, "sendMail", fake.resolves("Mocked out sendMail."));

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
