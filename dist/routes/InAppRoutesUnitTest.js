"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var InAppRoutes_1 = require("./InAppRoutes");
var TestUtilsRouter_1 = require("./TestUtilsRouter");
describe("AuthenticationRouter.ExpectedRoutes", function () {
    it("should define routes for these URLs", function () {
        var expectedRoutes = [
            ["/read-card", TestUtilsRouter_1.POST], ["/read-public-card", TestUtilsRouter_1.POST], ["/home", TestUtilsRouter_1.GET],
            ["/wiki", TestUtilsRouter_1.GET], ["/browse", TestUtilsRouter_1.GET], ["/browse", TestUtilsRouter_1.POST],
            ["/account", TestUtilsRouter_1.GET], ["/read-metadata", TestUtilsRouter_1.POST],
            ["/read-tag-groups", TestUtilsRouter_1.POST], ["/read-public-metadata", TestUtilsRouter_1.POST],
            ["/add-card", TestUtilsRouter_1.POST], ["/search-cards", TestUtilsRouter_1.POST], ["/update-card", TestUtilsRouter_1.POST],
            ["/update-streak", TestUtilsRouter_1.POST], ["/delete-card", TestUtilsRouter_1.POST],
            ["/trash-card", TestUtilsRouter_1.POST], ["/duplicate-card", TestUtilsRouter_1.POST], ["/flag-card", TestUtilsRouter_1.POST],
            ["/restore-from-trash", TestUtilsRouter_1.POST], ["/account/download-user-data", TestUtilsRouter_1.GET],
            ["/account/delete-account", TestUtilsRouter_1.POST], ["/account/update-settings", TestUtilsRouter_1.POST]
        ];
        var routeChecker = new TestUtilsRouter_1.RouteChecker(InAppRoutes_1.InAppRouter);
        expectedRoutes.forEach(function (_a) {
            var path = _a[0], method = _a[1];
            assert.ok(routeChecker.hasRoute(path, method), "Missing method: " + method + "; path: " + path);
        });
    });
});
//# sourceMappingURL=InAppRoutesUnitTest.js.map