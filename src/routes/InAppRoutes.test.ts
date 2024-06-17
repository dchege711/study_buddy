import { StatusCodes } from "http-status-codes";
import request from "supertest";

import { WIKI } from "../paths";
import { app } from "../server";

describe(WIKI, function() {
  it("GET returns an HTML page", function() {
    return request(app)
      .get(WIKI)
      .expect("Content-Type", /html/)
      .expect(StatusCodes.OK)
      .expect(/Wiki Contents/);
  });
});
