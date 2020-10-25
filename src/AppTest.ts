import assert = require("assert");
import * as request from "supertest";

import { App } from "./App";
import { APP_NAME, BASE_URL } from "./config";

describe("App", function () {
  const TEST_APP = request(App);

  describe("App.Variables", function () {
    it("should define these variables for each template", function () {
      assert.strictEqual(App.locals.APP_NAME, APP_NAME);
      assert.strictEqual(App.locals.BASE_URL, BASE_URL);
    });
    // How do I test that `res.locals` gets set in every request?
  });

  describe("App.ErrorHandling", function () {
    this.slow(1500);

    it("should display a 404 error page", function () {
      return TEST_APP.get("/5e48038f-31ad-427c-ae52-e228e8991b98")
        .expect("Content-Type", "text/html; charset=utf-8")
        .expect(404)
        .then((res) => {
          assert.ok(res.text.includes("Page Not Found"));
        });
    });

    it("should filter stack traces from the user", function () {
      return TEST_APP.get("/5bc75664-dummy-server-error-url")
        .expect("Content-Type", "text/html; charset=utf-8")
        .expect(500)
        .then((res) => {
          assert.ok(
            !res.text.includes("This string shouldn't appear to the user.")
          );
          assert.ok(res.text.includes("Internal Server Error"));
        });
    });
  });
});
