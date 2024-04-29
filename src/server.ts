/**
 * We use [express-session]{@link https://github.com/expressjs/session} and
 * some custom middleware to support persistent logins. In case we'll need to
 * support Facebook/Twitter/Google logins in the future, we'll use
 * [passport]{@link http://www.passportjs.org/docs/configure/}. For now,
 * Passport is an overkill.
 */

import { NextFunction, Request, Response } from "express";
import * as trpcExpress from '@trpc/server/adapters/express';

import express from "express";
import session from "express-session";
import MongoStore from 'connect-mongo';
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import enforce from 'express-sslify';

import { publicProcedure, router, mergeRouters } from "./trpc.js";
import { createContext } from "./context.js";
import { inAppRouter } from "./routes/InAppRouter.js";
import { authRouter } from "./routes/AuthenticationRouter.js";
import { IS_DEV } from "./config.js";
import { populateDummyAccountWithCards } from "./tests/DummyAccountUtils.js";
import * as allPaths from "./paths.js";

import { router as AccountRoutes } from "./routes/AuthenticationRoutes.js";
import { router as InAppRoutes } from "./routes/InAppRoutes.js";
import * as config from "./config.js";
import * as misc from "./models/Miscellaneous.js";

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
    cookie: {
      httpOnly: false,
    },
    resave: false,
    name: "c13u-study-buddy",
    store: config.IS_DEV ? new session.MemoryStore() : MongoStore.create({
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
    createContext,
  }),
);

app.use("/", AccountRoutes);
app.use("/", InAppRoutes);

if (config.IS_TS_NODE) {
    let newStaticsPath = path.join(__dirname, "..", "dist", "public");
    console.log(`Detected ts-node: Using ${newStaticsPath} as the static path`);
    app.use(express.static(newStaticsPath));
}

const app5XXHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).render(
      "pages/5xx_error_page.ejs",
      {
          response_JSON: {status: 500, message: "Internal Server Error"},
          APP_NAME: config.APP_NAME,
          LOGGED_IN: false,
          ...allPaths,
      }
  );
};

app.use(app5XXHandler);

const app4XXHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).render(
      "pages/4xx_error_page.ejs",
      {
          response_JSON: {status: 404, message: "Page Not Found"},
          APP_NAME: config.APP_NAME,
          LOGGED_IN: false,
          ...allPaths,
      }
  );
};

// Handling 404: https://expressjs.com/en/starter/faq.html
app.use(app4XXHandler);

app.listen(port, function() {
    console.log(`App is running on port ${port}`);
});

if (IS_DEV) {
  populateDummyAccountWithCards();
}
