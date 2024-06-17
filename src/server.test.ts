import { StatusCodes } from "http-status-codes";
import request from "supertest";

import { app } from "./server";

describe("/wiki", function() {
  it("responds with an HTML page", function() {
    return request(app)
      .get("/wiki")
      .expect("Content-Type", /html/)
      .expect(StatusCodes.OK);
  });
});
