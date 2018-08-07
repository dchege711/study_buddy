var express = require("express");
var session = require("express-session");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var AccountRoutes = require("./routes/AuthenticationRoutes.js");
var AppRoutes = require("./routes/InAppRoutes.js");

// Needed to get a Mongoose instance running for this process
require("./models/MongooseClient.js");

var app = express();
var port = process.env.PORT || 5000;

app.use(session({
    secret: "bad secret",
    httpOnly: false,
    resave: false,
    name: "c13u-study-buddy",
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use("/", AccountRoutes);
app.use("/", AppRoutes);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

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
