"use strict";

import * as emailClient from "../../../models/EmailClient";

import { APP_NAME, DEBUG_EMAIL_ADDRESS, EMAIL_ADDRESS } from "../../../config";

describe("EmailClient\n", function() {
  it("should send an email successfully", function() {
    return emailClient.sendEmail({
      from: `${APP_NAME} <${EMAIL_ADDRESS}>`,
      to: DEBUG_EMAIL_ADDRESS,
      subject: "Testing EmailClient",
      text: "Because there's HTML, this text won't appear in the email.",
      html: "<button style='color:blue;'>The button does nothing</button>",
    });
  });
});
