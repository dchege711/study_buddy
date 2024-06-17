import { StatusCodes } from "http-status-codes";
import request from "supertest";

import { SEND_VALIDATION_EMAIL } from "../paths";
import { app } from "./../server";

describe("AuthenticationRoutes", function() {
  describe(SEND_VALIDATION_EMAIL, function() {
    it("GET returns an HTML page", function() {
      return request(app)
        .get(SEND_VALIDATION_EMAIL)
        .expect("Content-Type", /html/)
        .expect(StatusCodes.OK)
        .expect(/Send Validation URL/);
    });
  });
});
