var express = require("express");
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var AccountRoutes = require("./routes/AuthenticationRoutes.js");
var InAppRoutes = require("./routes/InAppRoutes.js");

// Needed to get a Mongoose instance running for this process
const dbConnection = require("./models/MongooseClient.js");

var app = express();
var port = process.env.PORT || 5000;

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

app.use(function (req, res, next) {
    if (req.secure) {
        // request was via https, so do no special handling
        next();
    } else {
        // request was via http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url);
    }
});

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
