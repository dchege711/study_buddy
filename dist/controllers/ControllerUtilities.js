"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
;
/** A utility method for handling pending errors. */
function handleServerError(err, res) {
    convertObjectToResponse({
        success: false, internal_error: err, status: 500,
        message: "Internal Server Error"
    }, res);
}
exports.handleServerError = handleServerError;
/**
 * @description A function to interpret JSON documents into server responses. It
 * is meant to be used as the last function in the controller modules.
 */
function convertObjectToResponse(messageContainer, res) {
    if (messageContainer.internal_error) {
        console.error(messageContainer.internal_error);
        res.type(".html");
        res.status(messageContainer.status);
        res.render("pages/5xx_error_page.ejs", { response_JSON: messageContainer });
        return;
    }
    var status = messageContainer.status;
    res.status(status);
    if (status >= 200 && status < 300) {
        res.type("application/json");
        res.json(messageContainer);
    }
    else if (status >= 300 && status < 400) {
        res.type('html');
        res.redirect(status, messageContainer.redirect_url + "?msg=" + encodeURIComponent(messageContainer.message));
    }
    else if (status >= 400 && status < 500) {
        res.type('html');
        res.render("pages/4xx_error_page.ejs", { response_JSON: messageContainer });
    }
    else {
        res.type('html');
        res.render("pages/5xx_error_page.ejs", { response_JSON: messageContainer });
    }
}
exports.convertObjectToResponse = convertObjectToResponse;
;
/** Delete the file found at `filepath` */
function deleteTempFile(filepath) {
    fs.unlink(filepath, function (err) {
        if (err)
            console.error(err);
    });
}
exports.deleteTempFile = deleteTempFile;
;
/**
 * @description Most of my controller code involves waiting for results from a
 * promise, and then sending that response via the `res` object. This method
 * prevents unnecessarily duplicated code.
 *
 * @param {Promise} pendingPromise the promise should be such that calling
 * `then` delivers the message that needs to be sent to the user.
 *
 * @param {Response} res a reference to the Express Response object associated
 * with the pending request
 */
function sendResponseFromPromise(pendingPromise, res) {
    pendingPromise
        .then(function (results) { exports.convertObjectToResponse(null, results, res); })
        .catch(function (err) { exports.convertObjectToResponse(err, null, res); });
}
exports.sendResponseFromPromise = sendResponseFromPromise;
;
//# sourceMappingURL=ControllerUtilities.js.map