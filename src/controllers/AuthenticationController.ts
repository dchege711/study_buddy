"use strict";

import { NextFunction, Request, Response } from "express";

import * as LogInUtilities from "../models/LogInUtilities";
import { convertObjectToResponse, sendResponseFromPromise } from "./ControllerUtilities";
import { APP_NAME } from "../config";

const defaultTemplateObject = {
    APP_NAME: APP_NAME, LOGGED_IN: false
};

/**
 * @description Middleware designed to ensure that users are logged in before
 * using certain URLs
 */
export function requireLogIn(req: Request, res: Response, next: NextFunction) {
    if (!req.session?.user) {
        res.redirect("/login");
    } else if (req.session?.user) {
        if (req.body && req.body.userIDInApp) {
            // I expect these to be the same, but just in case...
            req.body.userIDInApp = req.session?.user.userIDInApp;
        }
        next();
    } else if (req.cookies.session_token) {
        logInBySessionToken(req.cookies.session_token, res, next);
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
        .then(function(auth_response) {
            if (auth_response && req.session) {
                req.session.user = auth_response;
                next();
            } else {
                res.setHeader(
                    "Set-Cookie",
                    [`session_token=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT`]
                );
                res.redirect("/login");
            }
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
};

export function handleLogIn(req: Request, res: Response) {
    if (req.session?.user) {
        res.redirect("/home");
    } else if (req.cookies.session_token) {
        logInBySessionToken(req, res, function () { res.redirect("/home"); });
    } else {
        res.render("pages/welcome_page", defaultTemplateObject);
    }
};

export function registerUser (req: Request, res: Response) {
    sendResponseFromPromise(
        LogInUtilities.registerUserAndPassword(req.body), res
    );
};

export function loginUser (req: Request, res: Response, next: NextFunction) {
    LogInUtilities
        .authenticateUser(req.body)
        .then((confirmation) => {
            if (req.session) {
                req.session.user = confirmation;
            }
            let expiry_date = (new Date(Date.now() + 1000 * 3600 * 24 * 30)).toString();
            res.setHeader(
                "Set-Cookie",
                [`session_token=${confirmation.token_id};Expires=${expiry_date}`]
            );
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
};

/**
 * @description When a user logs out, we delete the token that we issued upon
 * their initial login and redirect them to the welcome/login page.
 */
export async function logoutUser (req: Request, res: Response) {
    var session_token = req.session?.user?.token_id;
    delete req.session?.user;

    if (session_token) {
        await LogInUtilities.deleteSessionToken(session_token);
    }

    res.setHeader(
        "Set-Cookie",
        [`session_token=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT`]
    );
    convertObjectToResponse(null, {}, res);
};

export function sendValidationEmailGet (req: Request, res: Response) {
    res.render("pages/send_validation_url.ejs", defaultTemplateObject);
};

export function sendValidationEmailPost (req: Request, res: Response) {
    sendResponseFromPromise(
        LogInUtilities.sendAccountValidationLink(req.body), res
    );
};

export function verifyAccount (req: Request, res: Response) {
    var verification_uri = req.path.split("/verify-account/")[1];
    sendResponseFromPromise(
        LogInUtilities.validateAccount(verification_uri), res
    );
};

export function resetPasswordGet (req: Request, res: Response) {
    res.render("pages/reset_password_request.ejs", defaultTemplateObject);
};

export function resetPasswordPost (req: Request, res: Response) {
    sendResponseFromPromise(
        LogInUtilities.sendResetLink(req.body), res
    );
};

export function resetPasswordLinkGet (req: Request, res: Response) {
    var reset_password_uri = req.path.split("/reset-password-link/")[1];
    LogInUtilities
        .validatePasswordResetLink(reset_password_uri)
        .then((result) => {
            if (result) {
                res.render("pages/reset_password.ejs", defaultTemplateObject);
            } else {
                convertObjectToResponse(null, result, res);
            }
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
};

export function resetPasswordLinkPost (req: Request, res: Response) {
    var reset_password_uri = req.path.split("/reset-password-link/")[1];
    LogInUtilities
        .validatePasswordResetLink(reset_password_uri)
        .then((_) => {
            let payload = req.body;
            payload.reset_password_uri = reset_password_uri;
            let todays_datetime = new Date();
            payload.reset_request_time = todays_datetime.toString();
            return LogInUtilities.resetPassword(payload);
        })
        .then((reset_confirmation) => {
            convertObjectToResponse(null, reset_confirmation, res);
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
};
