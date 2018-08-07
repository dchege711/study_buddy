const nodemailer = require("nodemailer");
var config = require("../config.js");

let transporter = nodemailer.createTransport({
    pool: true,
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: config.EMAIL_ADDRESS,
        pass: config.EMAIL_PASSWORD
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
    mailOptions.from = `Study Buddy by c13u <${config.EMAIL_ADDRESS}>`;
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

// Close the SMTP pool before closing the application.
process.on("SIGINT", function () {
    transporter.close();
    console.log("Closed the SMTP pool.");
});

if (require.main === module) {
    this.sendEmail({
        from: `Study Buddy by c13u <${config.EMAIL_ADDRESS}>`,
        to: "d.chege711@gmail.com", 
        subject: "Test Nodemailer Setup", 
        text: "This is plain text...",
        html: "<p>Where does <em>the HTML</em> go?</p>"
    }, (results) => {
        console.log(results.message);
    });
}