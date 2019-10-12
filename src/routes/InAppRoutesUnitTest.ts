import assert = require("assert");

import { InAppRouter } from "./InAppRoutes";
import { GET, POST, RouteChecker } from "./TestUtilsRouter";

describe("AuthenticationRouter.ExpectedRoutes", function() {
    it("should define routes for these URLs", function() {

        const expectedRoutes = [
            ["/read-card", POST], ["/read-public-card", POST], ["/home", GET], 
            ["/wiki", GET], ["/browse", GET], ["/browse", POST], 
            ["/account", GET], ["/read-metadata", POST], 
            ["/read-tag-groups", POST], ["/read-public-metadata", POST], 
            ["/add-card", POST], ["/search-cards", POST], ["/update-card", POST], 
            ["/update-streak", POST], ["/delete-card", POST], 
            ["/trash-card", POST], ["/duplicate-card", POST], ["/flag-card", POST], 
            ["/restore-from-trash", POST], ["/account/download-user-data", GET], 
            ["/account/delete-account", POST], ["/account/update-settings", POST]
        ];

        const routeChecker = new RouteChecker(InAppRouter);
        expectedRoutes.forEach((routeAndMethod) => {
            assert.ok(
                routeChecker.hasRoute(routeAndMethod[0], routeAndMethod[1]), 
                `Missing method: ${routeAndMethod[1]}; path: ${routeAndMethod[0]}`
            );
        });

    });
});