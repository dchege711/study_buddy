"use strict";
/**
 * A client for sending emails. Using Gmail is great for testing, but it
 * prevents authenticating from suspicious devices (e.g. Heroku's servers). We
 * chose [MailGun]{@link https://documentation.mailgun.com/en/latest/quickstart-sending.html#send-with-smtp-or-api}
 * which provides 10,000 free email sends per month.
 *
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer = require("nodemailer");
var config_1 = require("../config");
var transporter = nodemailer.createTransport({
    pool: true,
    host: "smtp.mailgun.org",
    port: 587,
    secure: false,
    auth: { user: config_1.MAILGUN_LOGIN, pass: config_1.MAILGUN_PASSWORD }
});
/**
 * @description Send an email as directed by `mailOptions`. If successful, the
 * `message` property holds the object returned by `nodemailer`
 */
function sendEmail(mailOptions) {
    mailOptions.from = config_1.APP_NAME + " <" + config_1.EMAIL_ADDRESS + ">";
    return new Promise(function (resolve, reject) {
        transporter.sendMail(mailOptions)
            .then(function (info) {
            resolve({ success: true, status: 200, message: info });
        })
            .catch(function (err) { reject(err); });
    });
}
exports.sendEmail = sendEmail;
;
/**
 * @description Clean up the resources before exiting this module.
 */
function close() {
    transporter.close(); // Typescript only exports local objects
}
exports.close = close;
;
// Close the SMTP pool before closing the application.
process.on("SIGINT", function () {
    close();
});
//# sourceMappingURL=EmailClient.js.map