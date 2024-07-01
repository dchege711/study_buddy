import { StatusCodes } from "http-status-codes";
import request from "supertest";

import {
  HOME,
  LOGIN,
  REGISTER_USER,
  RESET_PASSWORD,
  RESET_PASSWORD_LINK,
  ROOT,
  SEND_VALIDATION_EMAIL,
  VERIFY_ACCOUNT,
} from "../paths";
import { app } from "./../server";
import { logInAgent } from "../tests/supertest.utils";

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

describe(RESET_PASSWORD_LINK, function() {
  const url =
    `${RESET_PASSWORD_LINK}/50alphanumericcharsinlowercase12345678901234567850`;

  it("should show the reset password form", async function() {
    return request(app)
      .get(url)
      .expect(StatusCodes.SEE_OTHER)
      .expect("Location", url);
  });

  it("should use an input parser/validator in GET", async function() {
    return request(app)
      .get(`${RESET_PASSWORD_LINK}/not50characterslong`)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it("should use an input parser/validator in POST", async function() {
    return request(app)
      .post(url)
      .send({
        password_1: "this_password_is_not",
        password_2: "the_same_as_this one",
      })
      .expect(StatusCodes.BAD_REQUEST);
  });
});
