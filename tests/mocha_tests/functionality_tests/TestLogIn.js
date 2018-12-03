"use strict";

const dbConnection = require("../../../models/MongooseClient.js");
var LogInUtilities = require("../../../models/LogInUtilities.js");
const config = require("../../../config.js");

describe("Test LoginUtilities\n", function() {

    before(function() {
        return LogInUtilities.deleteAllAccounts([config.PUBLIC_USER_USERNAME]);
    });

    after(function() {
        return LogInUtilities.deleteAllAccounts([config.PUBLIC_USER_USERNAME]);        
    });

    describe("#registerUserAndPassword()", function() {

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
                    email: config.DEBUG_EMAIL_ADDRESS
                });
        });

        // Remarks: a.b@gmail.com and ab@gmail.com will be regarded as different emails!
        it("should prevent multiple users from sharing email/usernames", function(done) {
            LogInUtilities
                .registerUserAndPassword({
                    username: "test-dup", password: "test_dummy_password",
                    email: config.DEBUG_EMAIL_ADDRESS
                })
                .then(function(signupResult) {
                    if (signupResult.success) done(new Error(signupResult.message));
                    else done();
                })
                .catch(function(err) { done(err); });
        });

    });
});
