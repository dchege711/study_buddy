"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var node_mocks_http_1 = require("node-mocks-http");
var events_1 = require("events");
var ControllerUtilities_1 = require("./ControllerUtilities");
describe("ControllerUtilities.RoutingRules", function () {
    it("should not display stack traces to the end user ", function () {
        var msgContainer = {
            status: 500, success: false, message: "The user should see me",
            internal_error: new Error("I should only appear in console.err...")
        };
        var res = node_mocks_http_1.createResponse({ eventEmitter: events_1.EventEmitter });
        ControllerUtilities_1.convertObjectToResponse(msgContainer, res);
        assert.ok(res._isUTF8);
        assert.strictEqual(msgContainer.status, res.statusCode);
        console.log(res._getBuffer().toString());
    });
});
//# sourceMappingURL=ControllerUtilitiesUnitTest.js.map