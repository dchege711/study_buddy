var LogInUtilities = require("../models/LogInUtilities.js");
var convertObjectToResponse = require("./ControllerUtilities.js").convertObjectToResponse;
const config = require("../config.js");

const defaultTemplateObject = {
    appName: config.APP_NAME
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
    LogInUtilities.authenticateByToken(
        req.cookies.session_token, (auth_response) => {
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
        }
    );
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

exports.register_user = function (req, res) {
    LogInUtilities.registerUserAndPassword(req.body, (err, confirmation) => {
        convertObjectToResponse(err, confirmation, res);
    });
};

exports.login = function (req, res, next) {
    LogInUtilities.authenticateUser(req.body, function (confirmation) {
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
    });
};

exports.logout = function (req, res) {
    var session_token = req.session.user.token_id;
    delete req.session.user;
    LogInUtilities.deleteSessionToken(session_token, (delete_info) => {
        res.setHeader(
            "Set-Cookie",
            [`session_token=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT`]
        );
        convertObjectToResponse(null, delete_info, res);
    });
};

exports.send_validation_email_get = function (req, res) {
    res.render("pages/send_validation_url.ejs", defaultTemplateObject);
};

exports.send_validation_email_post = function (req, res) {
    LogInUtilities.sendAccountValidationLink(req.body, (confirmation) => {
        convertObjectToResponse(null, confirmation, res);
    });
};

exports.verify_account = function (req, res) {
    var verification_uri = req.path.split("/verify-account/")[1];
    LogInUtilities.validateAccount(verification_uri, (results) => {
        convertObjectToResponse(null, results, res);
    });
};

exports.reset_password_get = function (req, res) {
    res.render("pages/reset_password_request.ejs", defaultTemplateObject);
};

exports.reset_password_post = function (req, res) {
    LogInUtilities.sendResetLink(req.body, (confirmation) => {
        convertObjectToResponse(null, confirmation, res);
    });
};

exports.reset_password_link_get = function (req, res) {
    var reset_password_uri = req.path.split("/reset-password-link/")[1];
    LogInUtilities.validatePasswordResetLink(reset_password_uri, (results) => {
        if (results.success) {
            res.render("pages/reset_password.ejs", defaultTemplateObject);
        } else {
            convertObjectToResponse(null, results, res);
        }
    });
};

exports.reset_password_link_post =  function (req, res) {
    var reset_password_uri = req.path.split("/reset-password-link/")[1];
    LogInUtilities.validatePasswordResetLink(reset_password_uri, (valid_link) => {
        if (valid_link.success) {
            var payload = req.body;
            payload.reset_password_uri = reset_password_uri;
            var todays_datetime = new Date();
            payload.reset_request_time = todays_datetime.toString();
            LogInUtilities.resetPassword(payload, (reset_confirmation) => {
                convertObjectToResponse(null, reset_confirmation, res);
            });
        } else {
            convertObjectToResponse(valid_link, null, res);
        }
    });
};