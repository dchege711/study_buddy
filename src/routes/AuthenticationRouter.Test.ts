import assert = require("assert");

import { AuthenticationRouter } from "./AuthenticationRouter";
import { GET, POST, RouteChecker } from "./RouterUtils.Test";

describe("AuthenticationRouter.ExpectedRoutes", function () {
  it("should define routes for these URLs", function () {
    const expectedRoutes = [
      ["/", GET],
      ["/login", GET],
      ["/register-user", POST],
      ["/login", POST],
      ["/logout", POST],
      ["/send-validation-email", GET],
      ["/send-validation-email", POST],
      ["/verify-account/*", GET],
      ["/reset-password", GET],
      ["/reset-password", POST],
      ["/reset-password-link/*", GET],
      ["/reset-password-link/*", POST],
    ];

    const routeChecker = new RouteChecker(AuthenticationRouter);
    expectedRoutes.forEach(([path, method]) => {
      assert.ok(
        routeChecker.hasRoute(path, method),
        `Missing method: ${method}; path: ${path}`
      );
    });
  });
});
