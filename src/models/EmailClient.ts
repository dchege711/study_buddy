"use strict";
/**
 * A client for sending emails. Using Gmail is great for testing, but it
 * prevents authenticating from suspicious devices (e.g. Heroku's servers). We
 * chose [MailGun]{@link https://documentation.mailgun.com/en/latest/quickstart-sending.html#send-with-smtp-or-api}
 * which provides 10,000 free email sends per month.
 *
 * @module
 */

import { createTransport, SentMessageInfo } from "nodemailer";

import Mail = require("nodemailer/lib/mailer");

import {
  APP_NAME,
  EMAIL_ADDRESS,
  MAILGUN_LOGIN,
  MAILGUN_PASSWORD,
} from "../config";

export const transporter = createTransport({
  pool: true,
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: MAILGUN_LOGIN,
    pass: MAILGUN_PASSWORD,
  },
});

/**
 * @param {Mail.Options} mailOptions Values are comma separated strings whose keys include:
 * `to`, `cc`, `bcc`, `subject`, `text`, `html`, except for `attachment`
 * which is an object with the keys `filename`, `content`, `path`, `href`,
 * `contentType`, `contentDisposition`, `cid`, `encoding`, `headers`, `raw`.
 *
 * @returns {Promise} takes a JSON with `success` and `message` as the keys
 */
export function sendEmail(mailOptions: Mail.Options): Promise<SentMessageInfo> {
  mailOptions.from = `${APP_NAME} <${EMAIL_ADDRESS}>`;
  return transporter.sendMail(mailOptions);
}

/**
 * @description Clean up the resources before exiting this module.
 */
export function close() {
  transporter.close();
}

// Close the SMTP pool before closing the application.
process.on("SIGINT", function() {
  close();
});
