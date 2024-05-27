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

export function redirectWithRecoverableError(
    req: Request, res: Response, err: UserRecoverableError) {
  redirectWithMessage(req, res, req.url, err.message);
}

/**
 * Redirect the user to `redirectURL` with and show `message` to the user.
 */
export function redirectWithMessage(
    req: Request, res: Response, redirectURL: string, message: string) {
  if (req.session) {
    req.session.message = message;
  }
  res.redirect(StatusCodes.SEE_OTHER, redirectURL);
}

/**
 * @description A function to interpret JSON documents into server responses. It
 * is meant to be used as the last function in the controller modules.
 *
 * @param {Error} err Any error that occurred in the preceding function
 * @param {JSON} result_JSON Expected keys: `status`, `success`, `message`
 * @param {Response} res An Express JS res object
 */
export function convertObjectToResponse (err: Error | null, result_JSON: any, req: Request, res: Response) {
    if (err) {
        if (typeof err === "string") {
            res.type("text").status(200).send(err);
            return;
        }

        res.type(".html");
        res.status(500);
        res.render(
            "pages/5xx_error_page.ejs",
            { ...getDefaultTemplateVars(req), response_JSON: generic_500_msg }
        );
        return;
    }

    let status = result_JSON.status || 200;
    res.status(status);
    if (status >= 200 && status < 300) {
        res.type("application/json");
        res.json(result_JSON);
    } else if (status >= 300 && status < 400) {
        res.type('html');
        if (req.session) {
          req.session.message = result_JSON.message;
        }
        res.redirect(status, result_JSON.redirect_url);
    } else if (status >= 400 && status < 500) {
        res.type('html');
        res.render(
          "pages/4xx_error_page.ejs",
          { ...getDefaultTemplateVars(req), response_JSON: result_JSON });
    } else {
        res.type('html');
        res.render(
          "pages/5xx_error_page.ejs",
          { ...getDefaultTemplateVars(req), response_JSON: result_JSON });
    }
};

export function deleteTempFile(filepath: string) {
    unlink(filepath, (err) => {
        if (err) console.error(err);
    });
};
