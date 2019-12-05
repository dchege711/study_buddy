/**
 * @description Unit test the `config.ts` module.
 */

import assert = require("assert");

import * as config from "./config";

describe("Config.ExpectedValues", function() {
    it("should export these config variables with truthy values", function() {
        assert.ok(config.APP_NAME);
        assert.ok(config.PORT);
        assert.ok(config.NODE_ENV);
        assert.ok(config.BASE_URL);
        assert.ok(config.EMAIL_ADDRESS);
        assert.ok(config.MAILGUN_LOGIN);
        assert.ok(config.MAILGUN_PASSWORD);
        if (config.NODE_ENV === "development" || config.NODE_ENV === "testing") {
            assert.ok(config.DEBUG_EMAIL_ADDRESS);
            assert.ok(config.DEBUG_USERNAME);
            assert.ok(config.DEBUG_PASSWORD);
            assert.ok(config.DEBUG_OPERATION_TIMEOUT_MS);
        }
    });
});
