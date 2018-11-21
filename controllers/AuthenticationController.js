"use strict";

const LogInUtilities = require("../models/LogInUtilities.js");
const controllerUtils = require("./ControllerUtilities.js");
const config = require("../config.js");

const convertObjectToResponse = controllerUtils.convertObjectToResponse;
const sendResponseFromPromise = controllerUtils.sendResponseFromPromise;

const defaultTemplateObject = {
    APP_NAME: config.APP_NAME
};

/**
 * @description Middleware designed to ensure that users are logged in before 
 * using certain URLs
 */
exports.requireLogIn = function (req, res, next) {
    if (!req.session.user) res.redirect("/login");
    else if (req.session.user) next();
    else if (req.cookies.session_token) {
        exports.logInBySessionToken(req.cookies.session_token, res, next);
    }
};

/**
 * @description Middleware for authenticating browsers that provide a session
 * token.
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

exports.handleLogIn = function (req, res) {
    if (req.session.user) {
        res.redirect("/home");
    } else if (req.cookies.session_token) {
        exports.logInBySessionToken(req, res, function () { res.redirect("/home"); });
    } else {
        res.render("pages/welcome_page", defaultTemplateObject);
    }
};

exports.registerUser = function (req, res) {
    sendResponseFromPromise(
        LogInUtilities.registerUserAndPassword(req.body), res
    );
};

exports.loginUser = function (req, res, next) {
    LogInUtilities
        .authenticateUser(req.body)
        .then((confirmation) => {
            if (confirmation.status === 200 && confirmation.success) {
                req.session.user = confirmation.message;
                var expiry_date = new Date(Date.now() + 1000 * 3600 * 24 * 30);
                expiry_date = expiry_date.toString();
                res.setHeader(
                    "Set-Cookie",
                    [`session_token=${confirmation.message.token_id};Expires=${expiry_date}`]
                );
            }
            convertObjectToResponse(null, confirmation, res);
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
};

exports.logoutUser = function (req, res) {
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

exports.sendValidationEmailGet = function (req, res) {
    res.render("pages/send_validation_url.ejs", defaultTemplateObject);
};

exports.sendValidationEmailPost = function (req, res) {
    sendResponseFromPromise(
        LogInUtilities.sendAccountValidationLink(req.body), res
    );
};

exports.verifyAccount = function (req, res) {
    var verification_uri = req.path.split("/verify-account/")[1];
    sendResponseFromPromise(
        LogInUtilities.validateAccount(verification_uri), res
    );
};

exports.resetPasswordGet = function (req, res) {
    res.render("pages/reset_password_request.ejs", defaultTemplateObject);
};

exports.resetPasswordPost = function (req, res) {
    sendResponseFromPromise(
        LogInUtilities.sendResetLink(req.body), res
    );
};

exports.resetPasswordLinkGet = function (req, res) {
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

exports.resetPasswordLinkPost =  function (req, res) {
    var reset_password_uri = req.path.split("/reset-password-link/")[1];
    LogInUtilities
        .validatePasswordResetLink(reset_password_uri)
        .then((valid_link) => {
            if (valid_link.success) {
                let payload = req.body;
                payload.reset_password_uri = reset_password_uri;
                let todays_datetime = new Date();
                payload.reset_request_time = todays_datetime.toString();
                return LogInUtilities.resetPassword(payload);
            }
        })
        .then((reset_confirmation) => {
            convertObjectToResponse(null, reset_confirmation, res);
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
};