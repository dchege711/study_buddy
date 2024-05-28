import { unlink } from "fs";

import { Request, Response } from "express";

import { AuthenticateUser } from "../models/LogInUtilities";
import { ICard } from "../models/mongoose_models/CardSchema";
import * as allPaths from "../paths";
import * as config from "../config";
import { StatusCodes } from "http-status-codes";
import { UserRecoverableError } from "../errors";

const generic_500_msg = {
    success: false, status: 500, message: "Internal Server Error"
};

interface TemplateVariables {
  APP_NAME: string,
  BASE_URL: string,
  LOGGED_IN: boolean,
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
export function getDefaultTemplateVars(req: Request | null = null): TemplateVariables {
  // Message is meant to be displayed to the user, and then cleared.
  const message = req?.session?.message || '';
  if (req?.session) req.session.message = '';

  return {
      APP_NAME: config.APP_NAME, BASE_URL: config.BASE_URL,
      LOGGED_IN: req?.session?.user !== undefined, message,
      ...allPaths
  };
}

/**
 * Redirect the user to `req.url` with and show `err.message` to the user.
 */
export function redirectWithRecoverableError(
    req: Request, res: Response, err: UserRecoverableError) {
  redirectWithMessage(req, res, err.message);
}

/**
 * Redirect the user to `req.url` with and show `message` to the user.
 */
export function redirectWithMessage(
    req: Request, res: Response, message: string) {
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
export function maybeRenderError (err: Error, req: Request, res: Response) {
  if (err instanceof UserRecoverableError) {
      redirectWithRecoverableError(req, res, err);
      return;
  }

  console.error(err);
  res.type('html');
  res.render(
    "pages/5xx_error_page.ejs",
    { ...getDefaultTemplateVars(req), message: err.toString() });
};

export function deleteTempFile(filepath: string) {
    unlink(filepath, (err) => {
        if (err) console.error(err);
    });
};
