"use strict";

import { mongooseConnection } from "../../../models/MongooseClient";
import { addPublicUser } from "../../../models/Miscellaneous";
import * as LogInUtilities from "../../../models/LogInUtilities";

describe("Test LoginUtilities\n", function() {
    describe("when signing up new users", function(this: Mocha.Context) {
        this.timeout(5000); // These tests may run slower than 2s in CI.

        before(function() {
            return addPublicUser();
        });

        after(function() {
            return LogInUtilities.deleteAllAccounts([]);
        });

        it("should reject an incorrect email address", function(done) {
            LogInUtilities
                .registerUserAndPassword({
                    username: "sample-user", password: "dummy_password",
                    email: "c13u.study.buddygmail.com"
                })
                .then(function(signupResult) {
                    done(new Error(signupResult));
                })
                .catch(function(_: Error) { done(); });
        });

        it("should reject an incorrect username", function(done) {
            LogInUtilities
                .registerUserAndPassword({
                    username: "!not$alpha*numeric", password: "dummy_password",
                    email: "c13u.study.buddygmail.com"
                })
                .then(function(signupResult) {
                    done(new Error(signupResult));
                })
                .catch(function(_: Error) { done(); });
        });

        describe("when a valid user already exists", function() {

            before(function() {
                return LogInUtilities
                    .registerUserAndPassword({
                        username: "alice", password: "test_dummy_password",
                        email: "test@example.com"
                    });
            });

            // Remarks: a.b@gmail.com and ab@gmail.com will be regarded as different emails!
            it("should prevent other users from using the same email", function(done) {
                LogInUtilities
                    .registerUserAndPassword({
                        username: "bob", password: "test_dummy_password",
                        email: "test@example.com"
                    })
                    .then(function(signupResult) {
                        done(new Error(signupResult));
                    })
                    .catch(function(_: Error) { done(); });
            });

            it("should prevent other users from using the same username", function(done) {
                LogInUtilities
                    .registerUserAndPassword({
                        username: "alice", password: "test_dummy_password",
                        email: "bob@example.com"
                    })
                    .then(function(signupResult) {
                        done(new Error(signupResult));
                    })
                    .catch(function(_: Error) { done(); });
            });

        });
    });
});
