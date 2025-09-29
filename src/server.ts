/**
 * We use [express-session]{@link https://github.com/expressjs/session} and
 * some custom middleware to support persistent logins. In case we'll need to
 * support Facebook/Twitter/Google logins in the future, we'll use
 * [passport]{@link http://www.passportjs.org/docs/configure/}. For now,
 * Passport is an overkill.
 */

import * as trpcExpress from "@trpc/server/adapters/express";
import { json, urlencoded } from "body-parser";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import session, { MemoryStore } from "express-session";
import { HTTPS } from "express-sslify";
import { csrf } from "lusca";
import { join } from "path";

import {
  IS_DEV,
  IS_PROD,
  IS_TEST,
  IS_TS_NODE,
  MONGO_URI,
  PORT,
  STUDY_BUDDY_SESSION_SECRET_1,
} from "./config";
import * as config from "./config";
import { createContext } from "./context";
import { addPublicUser } from "./models/Miscellaneous";
import expressAuthRouter from "./routes/AuthenticationRoutes";
import { inAppRouter } from "./routes/InAppRouter";
import expressInAppRouter from "./routes/InAppRoutes";
import * as allPaths from "./paths";
import { populateDummyAccountWithCards } from "./tests/DummyAccountUtils";
import { mergeRouters } from "./trpc";

// Needed to get a Mongoose instance running for this process
import { mongooseConnection } from "./models/MongooseClient";

const app = express();
const port = PORT;

// Set up app.locals with application-wide constants
app.locals.APP_NAME = config.APP_NAME;
app.locals.BASE_URL = config.BASE_URL;
// Spread all path constants to app.locals
Object.assign(app.locals, allPaths);

// In Heroku's honesty we trust. Beware otherwise as headers can be spoofed
// https://github.com/florianheinemann/express-sslify
if (process.env.NODE_ENV === "production") {
  app.use(HTTPS({ trustProtoHeader: true }));
}

const appRouter = mergeRouters(
  inAppRouter,
);

// Export only the type of the router to prevent us from importing server code
// on the client.
export type AppRouter = typeof appRouter;

app.use(session({
  secret: [STUDY_BUDDY_SESSION_SECRET_1],
  cookie: {
    secure: IS_PROD,
    httpOnly: true,
  },
  resave: false,
  name: "c13u-study-buddy",
  store: (IS_DEV || IS_TEST) ? new MemoryStore() : MongoStore.create({
    mongoUrl: MONGO_URI,
    touchAfter: 24 * 3600,
  }),
  saveUninitialized: true,
}));
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(express.static(join(__dirname, "public")));
app.use(cookieParser());

// Middleware to populate res.locals with request-specific template variables
app.use((req, res, next) => {
  // Message is meant to be displayed to the user, and then cleared.
  const session = req.session as any; // Use any to work around TypeScript Session interface limitations
  res.locals.message = session?.message || "";
  if (session?.message) { session.message = ""; }
  
  // Set LOGGED_IN based on session state
  res.locals.LOGGED_IN = session?.user !== undefined;
  
  next();
});

/**
 * Protections against CSRF attacks.
 *
 * With csrf enabled, the CSRF token must be in the payload when modifying data
 * or the client will receive a 403 Forbidden. To send the token the client
 * needs to echo back the _csrf value received from the previous request.
 * Furthermore, parsers must be registered before lusca.
 *
 * [1]: https://github.com/krakenjs/lusca#readme
 */
if (!IS_TEST) {
  app.use(csrf());
} else {
  // Provide a fake CSRF token as the EJS templates expect it.
  app.locals._csrf = "csrf_has_been_disabled_for_testing";
}

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.use("/", expressAuthRouter);
app.use("/", expressInAppRouter);

if (IS_TS_NODE) {
  const newStaticsPath = join(__dirname, "..", "dist", "public");
  console.log(`Detected ts-node: Using ${newStaticsPath} as the static path`);
  app.use(express.static(newStaticsPath));
}

app.use(function(err: Error, req: Request, res: Response) {
  console.error(err.stack);
  res.status(500).render(
    "pages/5xx_error_page.ejs",
    {
      message: "500: Internal Server Error",
    },
  );
});

// Handling 404: https://expressjs.com/en/starter/faq.html
app.use(function(req: Request, res: Response) {
  res.status(404).render(
    "pages/4xx_error_page.ejs",
    {
      message: "404: Page Not Found",
    },
  );
});

// Export app and mongoose connection for testing
export { app, mongooseConnection };

// Set up needed when running this file directly, e.g., in the server, as
// opposed to when running tests.
if (require.main === module) {
  app.listen(port, function() {
    console.log(`App is running on port ${port}`);
  });

  // Set up the default account for publicly viewable cards
  (async () => {
    await addPublicUser();
  })();

  if (IS_DEV) {
    populateDummyAccountWithCards(true);
  }
}
