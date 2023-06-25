"use strict";

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
export function requireLogIn (req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else if (req.session.user) {
        if (req.body && req.body.userIDInApp) {
            // I expect these to be the same, but just in case...
            req.body.userIDInApp = req.session.user.userIDInApp;
        }
        next();
    } else if (req.cookies.session_token) {
        exports.logInBySessionToken(req.cookies.session_token, res, next);
    }
};

/**
 * @description Middleware for authenticating browsers that provide a session
 * token. If the token is invalid (e.g. after a password reset or after 30 days),
 * we redirect the browser to the login page.
 */
exports.logInBySessionToken = function (req, res, next) {
    LogInUtilities
        .authenticateByToken(req.cookies.session_token)
        .then(function(auth_response) {
            if (auth_response.success) {
                req.session.user = auth_response.message;
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

export function handleLogIn(req, res) {
    if (req.session.user) {
        res.redirect("/home");
    } else if (req.cookies.session_token) {
        exports.logInBySessionToken(req, res, function () { res.redirect("/home"); });
    } else {
        res.render("pages/welcome_page", defaultTemplateObject);
    }
};

export function registerUser (req, res) {
    sendResponseFromPromise(
        LogInUtilities.registerUserAndPassword(req.body), res
    );
};

export function loginUser (req, res, next) {
    LogInUtilities
        .authenticateUser(req.body)
        .then((confirmation) => {
            if (confirmation.status === 200 && confirmation.success) {
                req.session.user = confirmation.message;
                let expiry_date = (new Date(Date.now() + 1000 * 3600 * 24 * 30)).toString();
                res.setHeader(
                    "Set-Cookie",
                    [`session_token=${(confirmation.message as any).token_id};Expires=${expiry_date}`]
                );
            }
            convertObjectToResponse(null, confirmation, res);
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
};

/**
 * @description When a user logs out, we delete the token that we issued upon
 * their initial login and redirect them to the welcome/login page.
 */
export function logoutUser (req, res) {
    var session_token = req.session.user.token_id;
    delete req.session.user;
    LogInUtilities
        .deleteSessionToken(session_token)
        .then((deleteInfo) => {
            res.setHeader(
                "Set-Cookie",
                [`session_token=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT`]
            );
            convertObjectToResponse(null, deleteInfo, res);
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
};

export function sendValidationEmailGet (req, res) {
    res.render("pages/send_validation_url.ejs", defaultTemplateObject);
};

export function sendValidationEmailPost (req, res) {
    sendResponseFromPromise(
        LogInUtilities.sendAccountValidationLink(req.body), res
    );
};

export function verifyAccount (req, res) {
    var verification_uri = req.path.split("/verify-account/")[1];
    sendResponseFromPromise(
        LogInUtilities.validateAccount(verification_uri), res
    );
};

export function resetPasswordGet (req, res) {
    res.render("pages/reset_password_request.ejs", defaultTemplateObject);
};

export function resetPasswordPost (req, res) {
    sendResponseFromPromise(
        LogInUtilities.sendResetLink(req.body), res
    );
};

export function resetPasswordLinkGet (req, res) {
    var reset_password_uri = req.path.split("/reset-password-link/")[1];
    LogInUtilities
        .validatePasswordResetLink(reset_password_uri)
        .then((results) => {
            if (results.success) {
                res.render("pages/reset_password.ejs", defaultTemplateObject);
            } else {
                convertObjectToResponse(null, results, res);
            }
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
};

export function resetPasswordLinkPost (req, res) {
    var reset_password_uri = req.path.split("/reset-password-link/")[1];
    LogInUtilities
        .validatePasswordResetLink(reset_password_uri)
        .then((validLinkConfirmation) => {
            if (validLinkConfirmation.success) {
                let payload = req.body;
                payload.reset_password_uri = reset_password_uri;
                let todays_datetime = new Date();
                payload.reset_request_time = todays_datetime.toString();
                return LogInUtilities.resetPassword(payload);
            } else {
                convertObjectToResponse(null, validLinkConfirmation, res);
                return Promise.reject("DUMMY");
            }
        })
        .then((reset_confirmation) => {
            convertObjectToResponse(null, reset_confirmation, res);
        })
        .catch((err) => { if (err !== "DUMMY") convertObjectToResponse(err, null, res); });
};
