import { expect } from "chai";
import { StatusCodes } from "http-status-codes";
import request from "supertest";

import {
  authenticateUser,
  AuthenticateUserParam,
} from "../models/LogInUtilities";
import { HOME, LOGIN } from "../paths";
import { app } from "../server";
import { dummyAccountDetails } from "./DummyAccountUtils";

/**
 * Log in a user using `supertest` and return the agent. By default, logs in the
 * dummy account.
 */
export async function logInAgent(authDetails: AuthenticateUserParam = {
  username_or_email: dummyAccountDetails.email,
  password: dummyAccountDetails.password,
}) {
  const agent = request.agent(app);

  // Check that the user does exist.
  const user = await authenticateUser(authDetails);
  expect(user).to.not.be.null;

  // Login, and follow redirect to `HOME`.
  const result = await agent
    .post(LOGIN)
    .send(authDetails)
    .redirects(1);

  expect(result.status).to.equal(StatusCodes.OK);
  expect(result.type).to.equal("text/html");

  const finalURL = new URL(result.request.url);
  expect(finalURL.pathname).to.equal(HOME);

  return Promise.resolve(agent);
}
