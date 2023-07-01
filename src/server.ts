/**
 * We use [express-session]{@link https://github.com/expressjs/session} and
 * some custom middleware to support persistent logins. In case we'll need to
 * support Facebook/Twitter/Google logins in the future, we'll use
 * [passport]{@link http://www.passportjs.org/docs/configure/}. For now,
 * Passport is an overkill.
 */

import { NextFunction, Request, Response } from "express";

var express = require("express");
var session = require("express-session");
var MongoStore = require('connect-mongo');
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var enforce = require('express-sslify');

var AccountRoutes = require("./routes/AuthenticationRoutes");
var InAppRoutes = require("./routes/InAppRoutes");
var config = require("./config.js");
const misc = require("./models/Miscellaneous");

// Needed to get a Mongoose instance running for this process
const dbConnection = require("./models/MongooseClient.js");

// Set up the default account for publicly viewable cards
(async () => { await misc.addPublicUser(); })();

var app = express();
var port = config.PORT;

// In Heroku's honesty we trust. Beware otherwise as headers can be spoofed
// https://github.com/florianheinemann/express-sslify
if (process.env.NODE_ENV === "production") {
    app.use(enforce.HTTPS({ trustProtoHeader: true}));
}

app.use(session({
    secret: [config.STUDY_BUDDY_SESSION_SECRET_1],
    httpOnly: false,
    resave: false,
    name: "c13u-study-buddy",
    store: config.IS_DEV ? session.MemoryStore() : MongoStore.create({
        mongoUrl: config.MONGO_URI,
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

app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack)
    res.status(500).render(
        "pages/5xx_error_page.ejs",
        {
            response_JSON: {status: 500, message: "Internal Server Error"},
            APP_NAME: config.APP_NAME,
            LOGGED_IN: false,
        }
    );
});

// Handling 404: https://expressjs.com/en/starter/faq.html
app.use(function (req: Request, res: Response, next: NextFunction) {
    res.status(404).render(
        "pages/4xx_error_page.ejs",
        {
            response_JSON: {status: 404, message: "Page Not Found"},
            APP_NAME: config.APP_NAME,
            LOGGED_IN: false,
        }
    );
});

app.listen(port, function() {
    console.log(`App is running on port ${port}`);
});
