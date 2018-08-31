const dbConnection = require("../models/MongooseClient.js");
var LogInUtilities = require("../models/LogInUtilities.js");

describe("LogIn Utilities", function() {

    after(function(done) {
        LogInUtilities.deleteAccount()
        dbConnection.closeMongooseConnection(() => {
            LogInUtilities.close(done);
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
                    email: "c13u.study.buddy@gmail.com"
                }, done
            );
        });

    });
});


// In case the process doesn't close, run this to discover why
// var why_is_node_running = require("why-is-node-running");
// setTimeout(why_is_node_running, 5000);