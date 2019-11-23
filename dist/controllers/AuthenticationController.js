"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoginUtils = require("../models/LogInUtilities");
var ControllerUtilities_1 = require("./ControllerUtilities");
/**
 * @description Middleware designed to ensure that users are logged in before
 * using certain URLs
 */
function requireLogIn(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    }
    else if (req.session.user) {
        if (req.body && req.body.userIDInApp) {
            // I expect these to be the same, but just in case...
            req.body.userIDInApp = req.session.user.userIDInApp;
        }
        next();
    }
    else if (req.cookies.session_token) {
        logInBySessionToken(req.cookies.session_token, res, next);
    }
}
exports.requireLogIn = requireLogIn;
;
/**
 * @description Middleware for authenticating browsers that provide a session
 * token. If the token is invalid (e.g. after a password reset or after 30 days),
 * we redirect the browser to the login page.
 */
function logInBySessionToken(req, res, next) {
    LoginUtils
        .authenticateByToken(req.cookies.session_token)
        .then(function (auth_response) {
        if (auth_response.success) {
            req.session.user = auth_response.message;
            next();
        }
        else {
            res.setHeader("Set-Cookie", ["session_token=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT"]);
            res.redirect("/login");
        }
    })
        .catch(function (err) { ControllerUtilities_1.handleServerError(err, res); });
}
exports.logInBySessionToken = logInBySessionToken;
;
function handleLogIn(req, res) {
    if (req.session.user) {
        res.redirect("/home");
    }
    else if (req.cookies.session_token) {
        logInBySessionToken(req, res, function () { res.redirect("/home"); });
    }
    else {
        res.render("pages/welcome_page");
    }
}
exports.handleLogIn = handleLogIn;
;
function registerUser(req, res) {
    ControllerUtilities_1.sendResponseFromPromise(LoginUtils.registerUserAndPassword(req.body), res);
}
exports.registerUser = registerUser;
;
function loginUser(req, res, next) {
    LoginUtils
        .authenticateUser(req.body)
        .then(function (confirmation) {
        if (confirmation.status === 200 && confirmation.success) {
            req.session.user = confirmation.message;
            var expiry_date = (new Date(Date.now() + 1000 * 3600 * 24 * 30)).toString();
            res.setHeader("Set-Cookie", ["session_token=" + confirmation.message.token_id + ";Expires=" + expiry_date]);
        }
        ControllerUtilities_1.convertObjectToResponse(confirmation, res);
    })
        .catch(function (err) { ControllerUtilities_1.handleServerError(err, res); });
}
exports.loginUser = loginUser;
;
/**
 * @description When a user logs out, we delete the token that we issued upon
 * their initial login and redirect them to the welcome/login page.
 */
function logoutUser(req, res) {
    var session_token = req.session.user.token_id;
    delete req.session.user;
    LoginUtils
        .deleteSessionToken(session_token)
        .then(function (deleteInfo) {
        res.setHeader("Set-Cookie", ["session_token=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT"]);
        ControllerUtilities_1.convertObjectToResponse(deleteInfo, res);
    })
        .catch(function (err) { ControllerUtilities_1.handleServerError(err, res); });
}
exports.logoutUser = logoutUser;
;
function sendValidationEmailGet(_, res) {
    res.render("pages/send_validation_url.ejs");
}
exports.sendValidationEmailGet = sendValidationEmailGet;
;
function sendValidationEmailPost(req, res) {
    ControllerUtilities_1.sendResponseFromPromise(LoginUtils.sendAccountValidationLink(req.body), res);
}
exports.sendValidationEmailPost = sendValidationEmailPost;
;
function verifyAccount(req, res) {
    var verification_uri = req.path.split("/verify-account/")[1];
    ControllerUtilities_1.sendResponseFromPromise(LoginUtils.validateAccount(verification_uri), res);
}
exports.verifyAccount = verifyAccount;
;
function resetPasswordGet(_, res) {
    res.render("pages/reset_password_request.ejs");
}
exports.resetPasswordGet = resetPasswordGet;
;
function resetPasswordPost(req, res) {
    ControllerUtilities_1.sendResponseFromPromise(LoginUtils.sendResetLink(req.body), res);
}
exports.resetPasswordPost = resetPasswordPost;
;
function resetPasswordLinkGet(req, res) {
    var reset_password_uri = req.path.split("/reset-password-link/")[1];
    LoginUtils
        .validatePasswordResetLink(reset_password_uri)
        .then(function (results) {
        if (results.success) {
            res.render("pages/reset_password.ejs");
        }
        else {
            ControllerUtilities_1.convertObjectToResponse(results, res);
        }
    })
        .catch(function (err) { ControllerUtilities_1.handleServerError(err, res); });
}
exports.resetPasswordLinkGet = resetPasswordLinkGet;
;
function resetPasswordLinkPost(req, res) {
    var reset_password_uri = req.path.split("/reset-password-link/")[1];
    LoginUtils
        .validatePasswordResetLink(reset_password_uri)
        .then(function (validLinkConfirmation) {
        if (validLinkConfirmation.success) {
            var payload = req.body;
            payload.reset_password_uri = reset_password_uri;
            var todays_datetime = new Date();
            payload.reset_request_time = todays_datetime.toString();
            return LoginUtils.resetPassword(payload);
        }
        else {
            ControllerUtilities_1.convertObjectToResponse(validLinkConfirmation, res);
            return;
        }
    })
        .then(function (resetConfirmation) {
        ControllerUtilities_1.convertObjectToResponse(resetConfirmation, res);
    })
        .catch(function (err) { ControllerUtilities_1.handleServerError(err, res); });
}
exports.resetPasswordLinkPost = resetPasswordLinkPost;
;
//# sourceMappingURL=AuthenticationController.js.map