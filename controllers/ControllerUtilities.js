var fs = require("fs");
const APP_NAME = require("../config.js").APP_NAME;

const generic_500_msg = {
    success: false, status: 500, message: "Internal Server Error"
};

/**
 * @description A function to interpret JSON documents into server responses. It
 * is meant to be used as the last function in the controller modules.
 *
 * @param {Error} err Any error that occurred in the preceding function
 * @param {JSON} result_JSON Expected keys: `status`, `success`, `message`
 * @param {Response} res An Express JS res object
 */
exports.convertObjectToResponse = function (err, result_JSON, res) {
    if (err) {
        console.error(err);
        res.type(".html");
        res.status(500);
        res.render(
            "pages/5xx_error_page.ejs",
            { response_JSON: generic_500_msg, APP_NAME: APP_NAME, LOGGED_IN: false }
        );
    } else {
        let status = result_JSON.status || 200;
        res.status(status);
        if (status >= 200 && status < 300) {
            res.type("application/json");
            res.json(result_JSON);
        } else if (status >= 300 && status < 400) {
            res.type('html');
            res.redirect(status, result_JSON.redirect_url + "?msg=" + encodeURIComponent(result_JSON.message));
        } else if (status >= 400 && status < 500) {
            res.type('html');
            res.render("pages/4xx_error_page.ejs", { response_JSON: result_JSON, APP_NAME: APP_NAME });
        } else {
            res.type('html');
            res.render("pages/5xx_error_page.ejs", { response_JSON: result_JSON, APP_NAME: APP_NAME });
        }
    }
};

exports.deleteTempFile = function(filepath) {
    fs.unlink(filepath, (err) => {
        if (err) console.error(err);
    });
};

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
exports.sendResponseFromPromise = function(pendingPromise, res) {
    pendingPromise
        .then((results) => { exports.convertObjectToResponse(null, results, res); })
        .catch((err) => { exports.convertObjectToResponse(err, null, res)});
};
