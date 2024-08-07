"use strict";

import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { UserRecoverableError } from "../errors";
import * as LogInUtilities from "../models/LogInUtilities";
import * as allPaths from "../paths";
import {
  getDefaultTemplateVars,
  maybeRenderError,
  redirectWithMessage,
  redirectWithRecoverableError,
} from "./ControllerUtilities";

/**
 * Render `src/views/pages/forms_base_page.ejs` with the form in
 * `src/views/partials/forms/${baseName}.ejs`.
 *
 * `formName` will be used as the page's title.
 */
function renderForm(
  req: Request,
  res: Response,
  formName: string,
  baseName: string,
) {
  res.render("pages/forms_base_page", {
    ...getDefaultTemplateVars(req),
    formName: formName,
    formPath: `../partials/forms/${baseName}.ejs`,
  });
}

/**
 * @description Middleware designed to ensure that users are logged in before
 * using certain URLs
 */
export const requireLogIn: RequestHandler = (req, res, next) => {
  if (!req.session?.user && !req.cookies.session_token) {
    res.redirect(StatusCodes.SEE_OTHER, allPaths.LOGIN);
  } else if (req.session?.user) {
    if (req.body && req.body.userIDInApp) {
      // I expect these to be the same, but just in case...
      req.body.userIDInApp = req.session?.user.userIDInApp;
    }
    next();
  } else if (req.cookies.session_token) {
    logInBySessionToken(req, res, next);
  }
};

/**
 * @description Middleware for authenticating browsers that provide a session
 * token. If the token is invalid (e.g. after a password reset or after 30 days),
 * we redirect the browser to the login page.
 */
function logInBySessionToken(req: Request, res: Response, next: NextFunction) {
  LogInUtilities
    .authenticateByToken(req.cookies.session_token)
    .then((token) => {
      if (token) {
        if (!req.session) {
          return Promise.reject(
            new Error("User has valid token but no session"),
          );
        }

        req.session.user = token;
        next();
        return;
      }

      res.setHeader(
        "Set-Cookie",
        [`session_token=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT`],
      );
      req.url = allPaths.LOGIN;
      redirectWithMessage(
        req,
        res,
        "Your session has expired. Please log in again.",
      );
    })
    .catch((err) => {
      maybeRenderError(err, req, res);
    });
}

export function handleLogIn(req: Request, res: Response) {
  if (req.session?.user) {
    res.redirect(StatusCodes.SEE_OTHER, allPaths.HOME);
  } else if (req.cookies.session_token) {
    logInBySessionToken(req, res, function() {
      res.redirect(StatusCodes.SEE_OTHER, allPaths.HOME);
    });
  } else {
    renderForm(req, res, "Log In", "login");
  }
}

export function handleRegisterUser(req: Request, res: Response) {
  if (req.session?.user) {
    res.redirect(StatusCodes.SEE_OTHER, allPaths.HOME);
  } else if (req.cookies.session_token) {
    logInBySessionToken(req, res, function() {
      res.redirect(StatusCodes.SEE_OTHER, allPaths.HOME);
    });
  } else {
    renderForm(req, res, "Sign Up", "sign_up");
  }
}

export function registerUser(req: Request, res: Response) {
  LogInUtilities
    .registerUserAndPassword(req.body)
    .then((confirmation) => {
      req.url = allPaths.LOGIN;
      redirectWithMessage(req, res, confirmation);
    })
    .catch((err) => {
      if (err instanceof UserRecoverableError) {
        req.url = allPaths.REGISTER_USER;
        redirectWithRecoverableError(req, res, err);
        return;
      }

      maybeRenderError(err, req, res);
    });
}

export function loginUser(req: Request, res: Response) {
  LogInUtilities
    .authenticateUser(req.body)
    .then((user) => {
      if (req.session) {
        req.session.user = user;
      }
      const expiry_date = (new Date(Date.now() + 1000 * 3600 * 24 * 30))
        .toString();
      res.setHeader(
        "Set-Cookie",
        [`session_token=${user.token_id};Expires=${expiry_date}`],
      );
      res.redirect(StatusCodes.SEE_OTHER, allPaths.HOME);
    })
    .catch((err) => {
      maybeRenderError(err, req, res);
    });
}

/**
 * @description When a user logs out, we delete the token that we issued upon
 * their initial login and redirect them to the welcome/login page.
 */
export async function logoutUser(req: Request, res: Response) {
  const session_token = req.session?.user?.token_id;
  const email = req.session?.user?.email;
  delete req.session?.user;

  if (session_token) {
    await LogInUtilities.deleteSessionToken(session_token);
  }

  res.setHeader(
    "Set-Cookie",
    [`session_token=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT`],
  );
  req.url = allPaths.BROWSE;
  redirectWithMessage(req, res, `${email} logged out successfully.`);
}

export function sendValidationEmailGet(req: Request, res: Response) {
  renderForm(req, res, "Send Validation URL", "send_validation_url");
}

export function sendValidationEmailPost(req: Request, res: Response) {
  LogInUtilities
    .sendAccountValidationLink({ email: req.body.email })
    .then((confirmation) => {
      redirectWithMessage(req, res, confirmation);
    })
    .catch((err) => {
      maybeRenderError(err, req, res);
    });
}

export function verifyAccount(req: Request, res: Response) {
  const verification_uri = req.path.split("/verify-account/")[1];

  LogInUtilities.validateAccount(verification_uri)
    .then((confirmation) => {
      req.url = allPaths.LOGIN;
      redirectWithMessage(req, res, confirmation);
    })
    .catch((err) => {
      if (err instanceof UserRecoverableError) {
        req.url = allPaths.SEND_VALIDATION_EMAIL;
        redirectWithRecoverableError(req, res, err);
        return;
      }
      maybeRenderError(err, req, res);
    });
}

export function resetPasswordGet(req: Request, res: Response) {
  renderForm(req, res, "Reset Password Request", "reset_password_request");
}

export function resetPasswordPost(req: Request, res: Response) {
  LogInUtilities
    .sendResetLink({ email: req.body.email })
    .then((confirmation) => {
      redirectWithMessage(req, res, confirmation);
    })
    .catch((err) => {
      maybeRenderError(err, req, res);
    });
}

export function resetPasswordLinkGet(req: Request, res: Response) {
  const reset_password_uri = req.path.split("/reset-password-link/")[1];
  LogInUtilities
    .validatePasswordResetLink(reset_password_uri)
    .then(() => {
      renderForm(req, res, "Reset Password", "reset_password");
    })
    .catch((err) => {
      maybeRenderError(err, req, res);
    });
}

export function resetPasswordLinkPost(req: Request, res: Response) {
  const reset_password_uri = req.path.split("/reset-password-link/")[1];
  LogInUtilities
    .validatePasswordResetLink(reset_password_uri)
    .then(() => {
      return LogInUtilities.resetPassword({
        reset_request_time: new Date(),
        password: req.body.password,
        reset_password_uri: reset_password_uri,
      });
    })
    .then((reset_confirmation) => {
      req.url = allPaths.LOGIN;
      redirectWithMessage(req, res, reset_confirmation);
    })
    .catch((err) => {
      maybeRenderError(err, req, res);
    });
}
