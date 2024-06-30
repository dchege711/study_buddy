import { unlink } from "fs";

import { NextFunction, Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import { StatusCodes } from "http-status-codes";
import { z, ZodError } from "zod";

import * as config from "../config";
import { UserRecoverableError } from "../errors";
import { AuthenticateUser } from "../models/LogInUtilities";
import { ICard } from "../models/mongoose_models/CardSchema";
import * as allPaths from "../paths";

interface TemplateVariables {
  APP_NAME: string;
  BASE_URL: string;
  LOGGED_IN: boolean;
  SEARCH_ENDPOINT_URL?: string;
  abbreviatedCards?: Array<Partial<ICard>>;
  account_info?: AuthenticateUser;
  message: string;
}

/**
 * @param {Object} req The incoming HTTP request
 *
 * @return {JSON} The key-value pairs that should be provided to templates by
 * default.
 */
export function getDefaultTemplateVars(
  req: Request | null = null,
): TemplateVariables {
  // Message is meant to be displayed to the user, and then cleared.
  const message = req?.session?.message || "";
  if (req?.session) { req.session.message = ""; }

  return {
    APP_NAME: config.APP_NAME,
    BASE_URL: config.BASE_URL,
    LOGGED_IN: req?.session?.user !== undefined,
    message,
    ...allPaths,
  };
}

/**
 * Redirect the user to `req.url` with and show `err.message` to the user.
 */
export function redirectWithRecoverableError(
  req: Request,
  res: Response,
  err: UserRecoverableError,
) {
  redirectWithMessage(req, res, err.message);
}

/**
 * Redirect the user to `req.url` with and show `message` to the user.
 */
export function redirectWithMessage(
  req: Request,
  res: Response,
  message: string,
) {
  if (req.session) {
    req.session.message = message;
  }
  // From [1]:
  //
  // > `req.originalUrl` is much like `req.url`; however, it retains the
  // > original request URL, allowing you to rewrite `req.url` freely for
  // > internal routing purposes.
  //
  // In this case, we use `req.url` to store where the user should be redirected
  // to.
  //
  // [1]: https://expressjs.com/en/api.html#req.originalUrl
  res.redirect(StatusCodes.SEE_OTHER, req.url);
}

/**
 * Decides how to communicate `err` to the user. If `err` is a
 * `UserRecoverableError`, then this method is equivalent to
 * `redirectWithRecoverableError`. Otherwise, this method logs `err` and renders
 * a 5XX error page with `err.toString()` for easier debugging.
 */
export function maybeRenderError(err: Error, req: Request, res: Response) {
  if (err instanceof UserRecoverableError) {
    redirectWithRecoverableError(req, res, err);
    return;
  }

  console.error(err);
  res.type("html");
  res.render(
    "pages/5xx_error_page.ejs",
    { ...getDefaultTemplateVars(req), message: err.toString() },
  );
}

export function deleteTempFile(filepath: string) {
  unlink(filepath, (err) => {
    if (err) { console.error(err); }
  });
}

/** A utility for rate-limiting routes that perform expensive operations. */
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Helper function for validating that `req.body` matches the schema provided.
 * Adapted from [1].
 *
 * [1]: https://dev.to/osalumense/validating-request-data-in-expressjs-using-zod-a-comprehensive-guide-3a0j
 */
export function validationMiddleware(schema: ReturnType<typeof z.object>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res.status(StatusCodes.BAD_REQUEST).json({
          error: "Invalid data",
          details: errorMessages,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: "Internal Server Error",
        });
      }
    }
  };
}

// TODO: How to share code with `validationMiddleware` above?
export function pathValidationMiddleware(
  schema: z.ZodEffects<z.ZodString, string, string>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.path);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res.status(StatusCodes.BAD_REQUEST).json({
          error: "Invalid data",
          details: errorMessages,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: "Internal Server Error",
        });
      }
    }
  };
}
