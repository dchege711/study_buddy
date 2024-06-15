/**
 * We use [express-session]{@link https://github.com/expressjs/session} and
 * some custom middleware to support persistent logins. In case we'll need to
 * support Facebook/Twitter/Google logins in the future, we'll use
 * [passport]{@link http://www.passportjs.org/docs/configure/}. For now,
 * Passport is an overkill.
 */

import * as trpcExpress from "@trpc/server/adapters/express";
import { Request, Response } from "express";

import { IS_DEV } from "./config";
import { createContext } from "./context";
import { getDefaultTemplateVars } from "./controllers/ControllerUtilities";
import { inAppRouter } from "./routes/InAppRouter";
import { populateDummyAccountWithCards } from "./tests/DummyAccountUtils";
import { mergeRouters } from "./trpc";

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const enforce = require("express-sslify");
const lusca = require("lusca");

const AccountRoutes = require("./routes/AuthenticationRoutes");
const InAppRoutes = require("./routes/InAppRoutes");
const config = require("./config");
const misc = require("./models/Miscellaneous");

// Needed to get a Mongoose instance running for this process
const dbConnection = require("./models/MongooseClient");

// Set up the default account for publicly viewable cards
(async () => {
  await misc.addPublicUser();
})();

const app = express();
const port = config.PORT;

// In Heroku's honesty we trust. Beware otherwise as headers can be spoofed
// https://github.com/florianheinemann/express-sslify
if (process.env.NODE_ENV === "production") {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

const appRouter = mergeRouters(
  inAppRouter,
);

// Export only the type of the router to prevent us from importing server code
// on the client.
export type AppRouter = typeof appRouter;

app.use(session({
  secret: [config.STUDY_BUDDY_SESSION_SECRET_1],
  secure: true,
  httpOnly: true,
  resave: false,
  name: "c13u-study-buddy",
  store: config.IS_DEV ? session.MemoryStore() : MongoStore.create({
    mongoUrl: config.MONGO_URI,
    touchAfter: 24 * 3600,
  }),
  saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

/**
 * Protections against CSRF attacks.
 *
 * With csrf enabled, the CSRF token must be in the payload when modifying data
 * or the client will receive a 403 Forbidden. To send the token the client
 * needs to echo back the _csrf value you received from the previous request.
 * Furthermore, parsers must be registered before lusca.
 *
 * [1]: https://github.com/krakenjs/lusca#readme
 *
 * TODO: Enable CSRF protection
 */
// app.use(lusca.csrf());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.use("/", AccountRoutes);
app.use("/", InAppRoutes);

if (config.IS_TS_NODE) {
  const newStaticsPath = path.join(__dirname, "..", "dist", "public");
  console.log(`Detected ts-node: Using ${newStaticsPath} as the static path`);
  app.use(express.static(newStaticsPath));
}

app.use(function(err: any, req: Request, res: Response) {
  console.error(err.stack);
  res.status(500).render(
    "pages/5xx_error_page.ejs",
    {
      ...getDefaultTemplateVars(req),
      message: "500: Internal Server Error",
    },
  );
});

// Handling 404: https://expressjs.com/en/starter/faq.html
app.use(function(req: Request, res: Response) {
  res.status(404).render(
    "pages/4xx_error_page.ejs",
    {
      ...getDefaultTemplateVars(req),
      message: "404: Page Not Found",
    },
  );
});

app.listen(port, function() {
  console.log(`App is running on port ${port}`);
});

if (IS_DEV) {
  populateDummyAccountWithCards();
}
