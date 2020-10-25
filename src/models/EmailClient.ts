/**
 * A client for sending emails. Using Gmail is great for testing, but it
 * prevents authenticating from suspicious devices (e.g. Heroku's servers). We
 * chose [MailGun]{@link https://documentation.mailgun.com/en/latest/quickstart-sending.html#send-with-smtp-or-api}
 * which provides 10,000 free email sends per month.
 *
 * @module
 */

import * as nodemailer from "nodemailer";
import {
  MAILGUN_LOGIN,
  MAILGUN_PASSWORD,
  APP_NAME,
  EMAIL_ADDRESS,
} from "../config";
import { MailOptions } from "nodemailer/lib/ses-transport";
import { IBaseMessage } from "../controllers/ControllerUtilities";
import Mail = require("nodemailer/lib/mailer");

const transporter = nodemailer.createTransport({
  pool: true,
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: { user: MAILGUN_LOGIN, pass: MAILGUN_PASSWORD },
});

/** A helper interface for my mail sender */
export interface IEmailConfirmation extends IBaseMessage {
  message: {
    accepted: string[];
    rejected: string[];
    envelopeTime: number;
    messageSize: number;
    response: number;
    envelope: { from: string; to: string[] };
    messageId: string;
  };
}

/**
 * @description Send an email as directed by `mailOptions`. If successful, the
 * `message` property holds the object returned by `nodemailer`.
 */
export function sendEmail(
  mailOptions: Pick<MailOptions, "to" | "subject" | "text">
): Promise<IEmailConfirmation> {
  let mailOptions_ = mailOptions as MailOptions;
  mailOptions_.from = `${APP_NAME} <${EMAIL_ADDRESS}>`;
  mailOptions_.sender = EMAIL_ADDRESS;
  return new Promise(function (resolve, reject) {
    transporter
      .sendMail(mailOptions_)
      .then((info) => {
        resolve({ success: true, status: 200, message: info });
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
}

/**
 * @description Clean up the resources before exiting this module.
 */
export function close() {
  transporter.close(); // Typescript only exports local objects
}

// Close the SMTP pool before closing the application.
process.on("SIGINT", function () {
  close();
});
