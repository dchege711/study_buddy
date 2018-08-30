const dbConnection = require("../models/MongooseClient.js");
var LogInUtilities = require("../models/LogInUtilities.js");

describe("LogIn Utilities", function() {

    describe("#registerUserAndPassword()", function() {
        
        it("should reject incomplete signup info", function(done) {
            LogInUtilities.registerUserAndPassword(
                { username: "test711", password: "dummy_password" },
                function(err, confirmation) {
                    if (err) done();
                    else done(new Error("User signed up without an email address"));
                }
            );
        });

    });
});

