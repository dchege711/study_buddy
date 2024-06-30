import { expect } from "chai";
import { StatusCodes } from "http-status-codes";
import request from "supertest";

import { authenticateUser } from "../models/LogInUtilities";
import {
  HOME,
  LOGIN,
  REGISTER_USER,
  RESET_PASSWORD,
  ROOT,
  SEND_VALIDATION_EMAIL,
  VERIFY_ACCOUNT,
} from "../paths";
import { app } from "./../server";
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

describe(ROOT, function() {
  it("should show the login form if not authenticated", function() {
    return request(app)
      .get(ROOT)
      .expect(StatusCodes.OK)
      .expect(/Username or Email Address/);
  });

  it("should redirect to the home page if authenticated", async function() {
    const agent = await logInAgent();
    return agent
      .get(ROOT)
      .expect(StatusCodes.SEE_OTHER)
      .expect("Location", HOME);
  });
});

describe(LOGIN, function() {
  it("should show the login form if not authenticated", function() {
    return request(app)
      .get(LOGIN)
      .expect(StatusCodes.OK)
      .expect(/Username or Email Address/);
  });

  it("should redirect to the home page if authenticated", async function() {
    const agent = await logInAgent();
    return agent
      .get(LOGIN)
      .expect(StatusCodes.SEE_OTHER)
      .expect("Location", HOME);
  });

  it("should use an input parser/validator", async function() {
    return request(app)
      .post(LOGIN)
      .send({
        username_or_email: { $ne: "" } as unknown as string,
        password: "password",
      })
      .expect(StatusCodes.BAD_REQUEST);
  });
});

describe(REGISTER_USER, function() {
  it("should show the registration form", function() {
    return request(app)
      .get(REGISTER_USER)
      .expect(StatusCodes.OK)
      .expect(/Choose an alphanumeric username/);
  });

  it("should redirect to the home page if authenticated", async function() {
    const agent = await logInAgent();
    return agent
      .get(REGISTER_USER)
      .expect(StatusCodes.SEE_OTHER)
      .expect("Location", HOME);
  });

  it("should use an input parser/validator", async function() {
    return request(app)
      .post(REGISTER_USER)
      .send({
        email: "not an email",
        username: "not%&*alphanumeric",
        password: "password",
      })
      .expect(StatusCodes.BAD_REQUEST);
  });
});

describe(SEND_VALIDATION_EMAIL, function() {
  it("should show the validation form", function() {
    return request(app)
      .get(SEND_VALIDATION_EMAIL)
      .expect("Content-Type", /html/)
      .expect(StatusCodes.OK)
      .expect(/Send Validation URL/);
  });

  it("should not redirect even if authenticated", async function() {
    const agent = await logInAgent();
    return agent
      .get(SEND_VALIDATION_EMAIL)
      .expect(StatusCodes.OK)
      .expect(/Send Validation URL/);
  });

  it("should use an input parser/validator", async function() {
    return request(app)
      .post(SEND_VALIDATION_EMAIL)
      .send({
        email: "not an email",
      })
      .expect(StatusCodes.BAD_REQUEST);
  });
});

describe(VERIFY_ACCOUNT, function() {
  it(`should redirect to ${SEND_VALIDATION_EMAIL} if link is stale`, function() {
    return request(app)
      .get(`${VERIFY_ACCOUNT}/32alphanumericcharsinlowercase32`)
      .expect(StatusCodes.SEE_OTHER)
      .expect("Location", SEND_VALIDATION_EMAIL);
  });

  it("should use an input parser/validator", async function() {
    return request(app)
      .get(`${VERIFY_ACCOUNT}/not32characterslong`)
      .expect(StatusCodes.BAD_REQUEST);
  });
});

describe(RESET_PASSWORD, function() {
  it("should show the reset password form", function() {
    return request(app)
      .get(RESET_PASSWORD)
      .expect("Content-Type", /html/)
      .expect(StatusCodes.OK)
      .expect(/Type the email address associated with your account/);
  });

  it("should not redirect even if authenticated", async function() {
    const agent = await logInAgent();
    return agent
      .get(RESET_PASSWORD)
      .expect(StatusCodes.OK)
      .expect(/Type the email address associated with your account/);
  });

  it("should use an input parser/validator", async function() {
    return request(app)
      .post(RESET_PASSWORD)
      .send({
        email: "not an email",
      })
      .expect(StatusCodes.BAD_REQUEST);
  });
});
