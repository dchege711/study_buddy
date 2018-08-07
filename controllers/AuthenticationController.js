var LogInUtilities = require("../models/LogInUtilities.js");
var convertObjectToResponse = require("./ControllerUtilities.js").convertObjectToResponse;

/**
 * @description Middleware designed to ensure that users are logged in before 
 * using certain URLs in Study Buddy
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
        res.render("pages/welcome_page");
    }
};

exports.register_user = function (req, res) {
    LogInUtilities.registerUserAndPassword(req.body, function (confirmation) {
        convertObjectToResponse(confirmation, res);
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
        convertObjectToResponse(confirmation, res);
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
        convertObjectToResponse(delete_info, res);
    });
};

exports.send_validation_email_get = function (req, res) {
    res.render("pages/send_validation_url.ejs");
};

exports.send_validation_email_post = function (req, res) {
    LogInUtilities.sendAccountValidationLink(req.body, (confirmation) => {
        convertObjectToResponse(confirmation, res);
    });
};

exports.verify_account = function (req, res) {
    var verification_uri = req.path.split("/verify-account/")[1];
    LogInUtilities.validateAccount(verification_uri, (results) => {
        convertObjectToResponse(results, res);
    });
};

exports.reset_password_get = function (req, res) {
    res.render("pages/reset_password_request.ejs");
};

exports.reset_password_post = function (req, res) {
    LogInUtilities.sendResetLink(req.body, (confirmation) => {
        convertObjectToResponse(confirmation, res);
    });
};

exports.reset_password_link_get = function (req, res) {
    var reset_password_uri = req.path.split("/reset-password-link/")[1];
    LogInUtilities.validatePasswordResetLink(reset_password_uri, (results) => {
        if (results.success) {
            res.render("pages/reset_password.ejs");
        } else {
            convertObjectToResponse(results, res);
        }
    });
};

exports.reset_password_link_post =  function (req, res) {
    var reset_password_uri = req.path.split("/reset-password-link/")[1];
    LogInUtilities.validatePasswordResetLink(reset_password_uri, (results) => {
        if (results.success) {
            var payload = req.body;
            payload.reset_password_uri = reset_password_uri;
            var todays_datetime = new Date();
            payload.reset_request_time = todays_datetime.toString();
            LogInUtilities.resetPassword(payload, (confirmation) => {
                convertObjectToResponse(confirmation, res);
            });
        } else {
            convertObjectToResponse(confirmation, results);
        }
    });
};