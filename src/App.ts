import express = require("express");
import session = require("express-session");
import path = require("path");
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import enforce = require("express-sslify");

import { Response, Request, NextFunction } from "express";

import { AuthenticationRouter } from "./routes/AuthenticationRouter";
import { InAppRouter } from "./routes/InAppRouter"
import { PORT, APP_NAME, BASE_URL } from "./config";
import * as UserModel from "./models/UserModel";
import { DummyError } from "./models/Utils";


/** The application itself. It has all the routes and listeners defined. */
const App = express();

// In Heroku's honesty we trust. Beware otherwise as headers can be spoofed
// https://github.com/florianheinemann/express-sslify
if (process.env.NODE_ENV === "production") {
    App.use(enforce.HTTPS({ trustProtoHeader: true}));
}

App.use(session({
    secret: "bad secret",
    // httpOnly: false,
    resave: false,
    name: "c13u-study-buddy",
    saveUninitialized: true
}));
App.use(bodyParser.urlencoded({ extended: true }));
App.use(bodyParser.json());
App.use(express.static(path.join(__dirname, "public")));
App.use(cookieParser());

App.set("views", path.join(__dirname, "views"));
App.set("view engine", "ejs");

App.use("/", AuthenticationRouter);
App.use("/", InAppRouter);

/** 
 * These values persist throughout the App's lifetime and are available to all 
 * templates. {@link http://expressjs.com/en/api.html#App.locals}
 */
App.locals = {
    APP_NAME: APP_NAME, BASE_URL: BASE_URL, LOGGED_IN: false
};

/**
 * Define Application middleware 
 * {@link https://expressjs.com/en/guide/using-middleware.html}
 */

/**
 * This middleware function with no mount path. It is executed every time the 
 * App receives a request.
 */
App.use(function(req: Request, res: Response, next: NextFunction) {
    // res.locals is scoped to each request
    res.locals.LOGGED_IN = req.session && req.session.user;
    next();
});

/** 
 * Error handling middle ware is a curious case. See docs: 
 * {@link https://expressjs.com/en/guide/using-middleware.html}, 
 * {@link https://expressjs.com/en/guide/error-handling.html}
 * 
 * "Error-handling middleware always takes four arguments. You must provide four 
 * arguments to identify it as an error-handling middleware function. Even if 
 * you don’t need to use the next object, you must specify it to maintain the 
 * signature. Otherwise, the next object will be interpreted as regular 
 * middleware and will fail to handle errors."
 */

App.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    if (err.name !== DummyError.DUMMY_ERR_NAME) console.error(err.stack);
    res.status(500).render(
        "pages/5xx_error_page.ejs", 
        { 
            response_JSON: {status: 500, message: "Internal Server Error"}, 
            APP_NAME: APP_NAME, LOGGED_IN: req.session.user !== undefined
        }
    );
});

// Handling 404: https://expressjs.com/en/starter/faq.html
App.use(function (req: Request, res: Response, next: NextFunction) {
    res.status(404).render(
        "pages/4xx_error_page.ejs", 
        {
            response_JSON: {status: 404, message: "Page Not Found"},
            APP_NAME: APP_NAME, LOGGED_IN: req.session.user !== undefined
        }
    );
});

// Don't run the server unless this script is ran as main. Otherwise, scripts 
// that import the App will have trouble knowing if the app is already listening
// for requests. Setting up a listener has tricky timing.
if (require.main === module) {
    App.listen(PORT, () => { 
        console.log(`Listening on port ${PORT}`);
    });
}

/** Expose the app object for testing. */
export { App };

export function shutdownServer(): Promise<void> {
    return new Promise(function(resolve, reject) {
        UserModel
            .close()
            .then(() => {
                resolve();
            })
            .catch((err) => { reject(err); });
    })
    
}
