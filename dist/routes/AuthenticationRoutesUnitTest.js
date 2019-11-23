"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var AuthenticationRoutes_1 = require("./AuthenticationRoutes");
var TestUtilsRouter_1 = require("./TestUtilsRouter");
describe("AuthenticationRouter.ExpectedRoutes", function () {
    it("should define routes for these URLs", function () {
        var expectedRoutes = [
            ["/", TestUtilsRouter_1.GET], ["/login", TestUtilsRouter_1.GET], ["/register-user", TestUtilsRouter_1.POST],
            ["/login", TestUtilsRouter_1.POST], ["/logout", TestUtilsRouter_1.POST],
            ["/send-validation-email", TestUtilsRouter_1.GET], ["/send-validation-email", TestUtilsRouter_1.POST],
            ["/verify-account/*", TestUtilsRouter_1.GET], ["/reset-password", TestUtilsRouter_1.GET],
            ["/reset-password", TestUtilsRouter_1.POST], ["/reset-password-link/*", TestUtilsRouter_1.GET],
            ["/reset-password-link/*", TestUtilsRouter_1.POST]
        ];
        var routeChecker = new TestUtilsRouter_1.RouteChecker(AuthenticationRoutes_1.AuthenticationRouter);
        expectedRoutes.forEach(function (_a) {
            var path = _a[0], method = _a[1];
            assert.ok(routeChecker.hasRoute(path, method), "Missing method: " + method + "; path: " + path);
        });
    });
});
//# sourceMappingURL=AuthenticationRoutesUnitTest.js.map