import { StatusCodes } from "http-status-codes";
import request from "supertest";

import { ACCOUNT, HOME, LOGIN, WIKI } from "../paths";
import { app } from "../server";
import { logInAgent } from "../tests/supertest.utils";

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

describe(ACCOUNT, function() {
  it("should require authentication", function() {
    return request(app)
      .get(ACCOUNT)
      .expect(StatusCodes.SEE_OTHER)
      .expect("Location", LOGIN);
  });

  it("should return an HTML page on GET", async function() {
    const agent = await logInAgent();
    return agent
      .get(ACCOUNT)
      .expect(StatusCodes.OK)
      .expect("Content-Type", /html/);
  });

  it("should use an input parser/validator", async function() {
    const agent = await logInAgent();
    return agent
      .post(ACCOUNT)
      .send({
        cardsAreByDefaultPrivate: "neither-on-nor-off",
        dailyTarget: "not-a-number",
      })
      .expect(StatusCodes.BAD_REQUEST);
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
