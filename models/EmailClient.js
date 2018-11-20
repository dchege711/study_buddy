const nodemailer = require("nodemailer");
var config = require("../config.js");

let transporter = nodemailer.createTransport({
    pool: true,
    host: "smtp.mailgun.org",
    port: 587,
    secure: false,
    auth: {
        user: config.MAILGUN_LOGIN,
        pass: config.MAILGUN_PASSWORD
    }
});

/**
 * 
 * @param {JSON} mailOptions Values are comma separated strings whose keys include: 
 * `to`, `cc`, `bcc`, `subject`, `text`, `html`, except for `attachment`
 * which is an object with the keys `filename`, `content`, `path`, `href`,
 * `contentType`, `contentDisposition`, `cid`, `encoding`, `headers`, `raw`.
 * 
 * @returns {Promise} takes a JSON with `success` and `message` as the keys
 */
exports.sendEmail = function(mailOptions) {
    mailOptions.from = `${config.APP_NAME} <${config.EMAIL_ADDRESS}>`;
    return new Promise(function(resolve, reject) {
        transporter.sendMail(mailOptions)
        .then((info) => {
            resolve({success: true, status: 200, message: info});
        })
        .catch((err) => { reject(err); });
    });
};

/**
 * @description Clean up the resources before exiting this module.
 */
exports.close = function() {
    transporter.close();
};

// Close the SMTP pool before closing the application.
process.on("SIGINT", function () {
    exports.close();
});
