import { Request, Response, NextFunction } from "express";
import * as UserModel from "../models/UserModel";
import {
  convertObjectToResponse,
  sendResponseFromPromise,
  handleServerError,
} from "./ControllerUtilities";

/**
 * @description Middleware designed to ensure that users are logged in before
 * using certain URLs. It also writes the `id` of the currently logged in user
 * at `req.body.userId`. This ID should be trusted over what the user provides.
 */
export function requireLogIn(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    res.redirect("/login");
  } else if (req.session.user) {
    if (req.body && req.body.userIDInApp) {
      // I expect these to be the same, but just in case...
      req.body.userId = req.session.user.id;
    }
    next();
  } else if (req.cookies.sessionToken) {
    logInBySessionToken(req, res, next);
  }
}

/**
 * @description Middleware for authenticating browsers that provide a session
 * token. If the token is invalid (e.g. after a password reset or after 30 days),
 * we redirect the browser to the login page.
 *
 * It also writes the `id` of the currently logged in user at `req.body.userId`.
 * This ID should be trusted over what the user provides.
 */
export function logInBySessionToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  UserModel.authenticateByToken(req.cookies.sessionToken)
    .then(function (authResponse) {
      if (authResponse.success) {
        req.session.user = authResponse.message;
        req.body.userId = req.session.user.id;
        next();
      } else {
        res.setHeader("Set-Cookie", [
          `sessionToken=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        ]);
        res.redirect("/login");
      }
    })
    .catch((err) => {
      handleServerError(err, res);
    });
}

export function handleLogIn(req: Request, res: Response) {
  if (req.session.user) {
    res.redirect("/home");
  } else if (req.cookies.sessionToken) {
    logInBySessionToken(req, res, function () {
      res.redirect("/home");
    });
  } else {
    res.render("pages/welcome_page");
  }
}

export function registerUser(req: Request, res: Response) {
  sendResponseFromPromise(
    UserModel.registerUser({
      userName: req.body.userName,
      password: req.body.password,
      emailAddress: req.body.emailAddress,
    }),
    res
  );
}

export function loginUser(req: Request, res: Response, next: NextFunction) {
  UserModel.authenticateUser({
    userNameOrEmailAddress: req.body.userNameOrEmailAddress,
    password: req.body.password,
  })
    .then((confirmation) => {
      if (confirmation.status === 200 && confirmation.success) {
        req.session.user = confirmation.message;
        let expiry_date = new Date(
          Date.now() + 1000 * 3600 * 24 * 30
        ).toString();
        res.setHeader("Set-Cookie", [
          `sessionToken=${confirmation.message.token_id};Expires=${expiry_date}`,
        ]);
      }
      convertObjectToResponse(confirmation, res);
    })
    .catch((err) => {
      handleServerError(err, res);
    });
}

/**
 * @description When a user logs out, we delete the token that we issued upon
 * their initial login and redirect them to the welcome/login page.
 */
export function logoutUser(req: Request, res: Response) {
  var tokenValue = req.cookies.sessionToken;
  delete req.session.user;
  UserModel.deleteSessionToken(tokenValue)
    .then((deleteInfo) => {
      res.setHeader("Set-Cookie", [
        `sessionToken=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      ]);
      convertObjectToResponse(deleteInfo, res);
    })
    .catch((err) => {
      handleServerError(err, res);
    });
}

export function sendValidationEmailGet(_: Request, res: Response) {
  res.render("pages/send_validation_url.ejs");
}

export function sendValidationEmailPost(req: Request, res: Response) {
  sendResponseFromPromise(
    UserModel.sendAccountValidationLink(req.body.emailAddress),
    res
  );
}

export function verifyAccount(req: Request, res: Response) {
  var verificationURI = req.path.split("/verify-account/")[1];
  sendResponseFromPromise(UserModel.validateAccount(verificationURI), res);
}

export function resetPasswordGet(_: Request, res: Response) {
  res.render("pages/reset_password_request.ejs");
}

export function resetPasswordPost(req: Request, res: Response) {
  sendResponseFromPromise(UserModel.sendResetLink(req.body.emailAddress), res);
}

export function resetPasswordLinkGet(req: Request, res: Response) {
  var resetPasswordURI = req.path.split("/reset-password-link/")[1];
  UserModel.validatePasswordResetLink(resetPasswordURI)
    .then((results) => {
      if (results.success) {
        res.render("pages/reset_password.ejs");
      } else {
        convertObjectToResponse(results, res);
      }
    })
    .catch((err) => {
      handleServerError(err, res);
    });
}

export function resetPasswordLinkPost(req: Request, res: Response) {
  var resetPasswordURI = req.path.split("/reset-password-link/")[1];
  UserModel.validatePasswordResetLink(resetPasswordURI)
    .then((validLinkConfirmation) => {
      if (validLinkConfirmation.success) {
        let payload = req.body;
        payload.resetPasswordURI = resetPasswordURI;
        let todays_datetime = new Date();
        payload.reset_request_time = todays_datetime.toString();
        return UserModel.resetPassword(payload);
      } else {
        convertObjectToResponse(validLinkConfirmation, res);
        return;
      }
    })
    .then((resetConfirmation) => {
      convertObjectToResponse(resetConfirmation, res);
    })
    .catch((err) => {
      handleServerError(err, res);
    });
}
