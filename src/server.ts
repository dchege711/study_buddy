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
import { createContext } from "./context";
import { getDefaultTemplateVars } from "./controllers/ControllerUtilities";
import { addPublicUser } from "./models/Miscellaneous";
import expressAuthRouter from "./routes/AuthenticationRoutes";
import { inAppRouter } from "./routes/InAppRouter";
import expressInAppRouter from "./routes/InAppRoutes";
import { populateDummyAccountWithCards } from "./tests/DummyAccountUtils";
import { mergeRouters } from "./trpc";

// Needed to get a Mongoose instance running for this process
import { mongooseConnection } from "./models/MongooseClient";

const app = express();
const port = PORT;

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

/**
 * Protections against CSRF attacks.
 *
 * With csrf enabled, the CSRF token must be in the payload when modifying data
 * or the client will receive a 403 Forbidden. To send the token the client
 * needs to echo back the _csrf value received from the previous request.
 * Furthermore, parsers must be registered before lusca.
 *
 * [1]: https://github.com/krakenjs/lusca#readme
 *
 * TODO: Enable CSRF protection
 */
app.use(csrf());

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
