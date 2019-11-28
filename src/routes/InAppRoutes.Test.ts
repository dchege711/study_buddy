import assert = require("assert");

import { InAppRouter } from "./InAppRouter";
import { GET, POST, RouteChecker } from "./RouterUtils.Test";

describe("InAppRoutes.ExpectedRoutes", function() {
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
        expectedRoutes.forEach(([path, method]) => {
            assert.ok(
                routeChecker.hasRoute(path, method), 
                `Missing method: ${method}; path: ${path}`
            );
        });

    });
});