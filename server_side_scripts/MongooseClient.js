/**
 * @description Set up the connection that will 
 */

var mongoose = require("mongoose");
var config = require('../config');

var options = {
    poolSize: 10
}

mongoose.connect(config.MONGO_URI, options);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", function() {
    console.log("Successfully connected to the database.");
});

// Close the MongoDB connection before closing the application.
process.on("SIGINT", function () {
    db.close(function () {
        console.log("Mongoose connection closed from CardsMongoDB.js");
        process.exit(0);
    });
})
