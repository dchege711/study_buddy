var express = require("express");
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var AccountRoutes = require("./routes/AuthenticationRoutes.js");
var InAppRoutes = require("./routes/InAppRoutes.js");
var enforce = require('express-sslify');

// Needed to get a Mongoose instance running for this process
const dbConnection = require("./models/MongooseClient.js");

var app = express();
var port = process.env.PORT || 5000;

// In Heroku's honesty we trust. Beware otherwise as headers can be spoofed
// https://github.com/florianheinemann/express-sslify
app.use(enforce.HTTPS({ trustProtoHeader: true}));

app.use(session({
    secret: "bad secret",
    httpOnly: false,
    resave: false,
    name: "c13u-study-buddy",
    store: new MongoStore({
        mongooseConnection: dbConnection.mongooseConnection,
        touchAfter: 24 * 3600
    }),
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", AccountRoutes);
app.use("/", InAppRoutes);

app.listen(port, function() {
    console.log(`App is running on port ${port}`);
});

/**
 * Setup default error catcher.
 */
app.use(function (error, req, res, next) {
    console.error(error.stack);
    res.render(
        "pages/4xx_error_page.ejs", 
        {response_JSON: {status: 404, message: "Page Not Found"}}
    );
});
