import { expect } from "chai";
import { StatusCodes } from "http-status-codes";
import request from "supertest";

import { authenticateUser } from "../models/LogInUtilities";
import { HOME, LOGIN, WIKI } from "../paths";
import { app } from "../server";
import { dummyAccountDetails } from "../tests/DummyAccountUtils";

const authDetails = {
  username_or_email: dummyAccountDetails.email,
  password: dummyAccountDetails.password,
};

async function logInAgent() {
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

describe(HOME, function() {
  it("requires authentication", function() {
    return request(app)
      .get(HOME)
      .expect(StatusCodes.SEE_OTHER)
      .expect("Location", LOGIN);
  });

  it("GET returns an HTML page", async function() {
    const agent = await logInAgent();
    return agent
      .get(HOME)
      .expect(StatusCodes.OK)
      .expect("Content-Type", /html/);
  });
});

describe(WIKI, function() {
  it("GET returns an HTML page", function() {
    return request(app)
      .get(WIKI)
      .expect("Content-Type", /html/)
      .expect(StatusCodes.OK)
      .expect(/Wiki Contents/);
  });
});
