/**
 * @description Set up the connection that will be used across the app. 
 * There's a nice tutorial at: 
 * https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
 */

var mongoose = require("mongoose");
var config = require('../config');

// Already 5 by default, but I might need to increase it one day...
mongoose.connect(config.MONGO_URI, {poolSize: 12, useNewUrlParser: true});

// Get Mongoose to use the global promise library.
mongoose.Promise = global.Promise;

// Get the default connection (this will be registered on mongoose)
var db = mongoose.connection;

// Bind the connection to the error event (to get notifications)
db.on("error", console.error.bind(console, "Connection Error:"));

/*
 * Tip from MDN:
 * 
 * You can get the default Connection object with mongoose.connection
 * Once connected, the open event is fired on the Connection instance.
 * 
 * If you need to create additional connections you can use 
 * mongoose.createConnection(). This takes the same form of 
 * database URI (with host, database, port, options etc.) 
 * as connect() and returns a Connection object).
 */

 /**
  * @description Close the MongoDB connection before closing the application.
  * 
  * @param {Function} callback The first parameter will be set in case of any 
  * error
  */
exports.closeMongooseConnection = function(callback) {
    return mongoose.disconnect();
};

process.on("SIGINT", function () {
    exports.closeMongooseConnection()
        .then(() => { process.exit(0); })
        .catch((err) => { console.error(err); process.exit(1); });
});

exports.mongooseConnection = db;
