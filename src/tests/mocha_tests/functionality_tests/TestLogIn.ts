"use strict";

import { mongooseConnection } from "../../../models/MongooseClient";
import { DEBUG_EMAIL_ADDRESS } from "../../../config";
import { addPublicUser } from "../../../models/Miscellaneous";
import * as LogInUtilities from "../../../models/LogInUtilities";

describe("Test LoginUtilities\n", function() {

    describe("#registerUserAndPassword()", function() {
        this.timeout(5000); // These tests may run slower than 2s in CI.

        before(function() {
            return addPublicUser();
        });

        after(function() {
            return LogInUtilities.deleteAllAccounts([]);
        });

        it("should reject incorrect signup info", function(done) {
            LogInUtilities
                .registerUserAndPassword({
                    username: "test711@!", password: "dummy_password",
                    email: "c13u.study.buddygmail.com"
                })
                .then(function(signupResult) {
                    done(new Error(signupResult.message));
                })
                .catch(function(_) { done(); });
        });

        it("should sign up users with valid info", function() {
            return LogInUtilities
                .registerUserAndPassword({
                    username: "test", password: "test_dummy_password",
                    email: DEBUG_EMAIL_ADDRESS
                });
        });

        // Remarks: a.b@gmail.com and ab@gmail.com will be regarded as different emails!
        it("should prevent multiple users from sharing email/usernames", function(done) {
            LogInUtilities
                .registerUserAndPassword({
                    username: "test-dup", password: "test_dummy_password",
                    email: DEBUG_EMAIL_ADDRESS
                })
                .then(function(signupResult) {
                    if (signupResult.success) done(new Error(signupResult.message));
                    else done();
                })
                .catch(function(err) { done(err); });
        });

    });
});
