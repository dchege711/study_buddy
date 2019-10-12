import assert = require("assert");

import { AuthenticationRouter } from "./AuthenticationRoutes";
import { GET, POST, RouteChecker } from "./TestUtilsRouter";

describe("AuthenticationRouter.ExpectedRoutes", function() {
    it("should define routes for these URLs", function() {

        const expectedRoutes = [
            ["/", GET], ["/login", GET], ["/register-user", POST], 
            ["/login", POST], ["/logout", POST], 
            ["/send-validation-email", GET], ["/send-validation-email", POST], 
            ["/verify-account/*", GET], ["/reset-password", GET], 
            ["/reset-password", POST], ["/reset-password-link/*", GET], 
            ["/reset-password-link/*", POST]
        ];

        const routeChecker = new RouteChecker(AuthenticationRouter);
        expectedRoutes.forEach((routeAndMethod) => {
            assert.ok(
                routeChecker.hasRoute(routeAndMethod[0], routeAndMethod[1]), 
                `Missing method: ${routeAndMethod[1]}; path: ${routeAndMethod[0]}`
            );
        });

    });
});