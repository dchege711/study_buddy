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
 * @param {Function} callBack Takes a JSON with `success` and `message` as the keys
 */
exports.sendEmail = function(mailOptions, callBack) {
    mailOptions.from = `${config.APP_NAME} <${config.EMAIL_ADDRESS}>`;
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            callBack({
                success: false, message: error
            });
        } else {
            callBack({
                success: true, message: info
            });
        }
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

if (require.main === module) {
    this.sendEmail({
        from: `${config.APP_NAME} <${config.EMAIL_ADDRESS}>`,
        to: "d.chege711@gmail.com", 
        subject: "Test Nodemailer Setup", 
        text: "This is plain text...",
        html: "<p>Where does <em>the HTML</em> go?</p>"
    }, (results) => {
        console.log(results.message);
    });
}