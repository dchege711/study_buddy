const dbConnection = require("../models/MongooseClient.js");
var LogInUtilities = require("../models/LogInUtilities.js");
const config = require("../config.js");

describe("LogIn Utilities", function() {

    before(function(done) {
        LogInUtilities.deleteAllAccounts(done);
    });

    after(function(done) {
        LogInUtilities.deleteAllAccounts(function(err) {
            if (err) done(err);
            else {
                dbConnection.closeMongooseConnection(function(err) {
                    if (err) done(err);
                    else LogInUtilities.close(done);
                });
            }
        });            
    });

    describe("#registerUserAndPassword()", function() {

        it("should reject incorrect signup info", function(done) {
            LogInUtilities.registerUserAndPassword(
                { 
                    username: "test711@!", password: "dummy_password",
                    email: "c13u.study.buddygmail.com" 
                },
                function(err, signup_result) {
                    if (err) done();
                    else {
                        done(new Error(signup_result.message));
                    }
                }
            );
        });

        it("should sign up users with valid info", function(done) {
            LogInUtilities.registerUserAndPassword(
                {
                    username: "test", password: "test_dummy_password",
                    email: config.DEBUG_EMAIL_ADDRESS
                }, done
            );
        });

        // Remarks: a.b@gmail.com and ab@gmail.com will be regarded as different emails!
        it("should prevent multiple users from sharing email/usernames", function(done) {
            LogInUtilities.registerUserAndPassword(
                {
                    username: "test-dup", password: "test_dummy_password",
                    email: config.DEBUG_EMAIL_ADDRESS
                },
                function(err, signup_result) {
                    if (err) done(err);
                    else {
                        if (signup_result.success) done(new Error(signup_result.message));
                        else done();
                    }
                }
            );
        });

    });
});

// In case the process doesn't close, run this to discover why
// var why_is_node_running = require("why-is-node-running");
// setTimeout(why_is_node_running, 5000);
