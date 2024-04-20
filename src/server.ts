/**
 * We use [express-session]{@link https://github.com/expressjs/session} and
 * some custom middleware to support persistent logins. In case we'll need to
 * support Facebook/Twitter/Google logins in the future, we'll use
 * [passport]{@link http://www.passportjs.org/docs/configure/}. For now,
 * Passport is an overkill.
 */

import { NextFunction, Request, Response } from "express";
import * as trpcExpress from '@trpc/server/adapters/express';

import { publicProcedure, router, mergeRouters } from "./trpc";
import { inAppRouter } from "./routes/InAppRouter";
import { authRouter } from "./routes/AuthenticationRouter";
import { IS_DEV } from "./config";
import { populateDummyAccountWithCards } from "./tests/DummyAccountUtils";

var express = require("express");
var session = require("express-session");
var MongoStore = require('connect-mongo');
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var enforce = require('express-sslify');

var AccountRoutes = require("./routes/AuthenticationRoutes");
var InAppRoutes = require("./routes/InAppRoutes");
var config = require("./config");
const misc = require("./models/Miscellaneous");

// Needed to get a Mongoose instance running for this process
const dbConnection = require("./models/MongooseClient");

// Set up the default account for publicly viewable cards
(async () => { await misc.addPublicUser(); })();

var app = express();
var port = config.PORT;

// In Heroku's honesty we trust. Beware otherwise as headers can be spoofed
// https://github.com/florianheinemann/express-sslify
if (process.env.NODE_ENV === "production") {
    app.use(enforce.HTTPS({ trustProtoHeader: true}));
}

const appRouter = mergeRouters(
  authRouter, inAppRouter
);

// Export only the type of the router to prevent us from importing server code
// on the client.
export type AppRouter = typeof appRouter;

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

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  }),
);

app.use("/", AccountRoutes);
app.use("/", InAppRoutes);

if (config.IS_TS_NODE) {
    let newStaticsPath = path.join(__dirname, "..", "dist", "public");
    console.log(`Detected ts-node: Using ${newStaticsPath} as the static path`);
    app.use(express.static(newStaticsPath));
}

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

if (IS_DEV) {
  populateDummyAccountWithCards();
}
