"use strict";

import * as emailClient from "../../../models/EmailClient";

import { APP_NAME, EMAIL_ADDRESS, DEBUG_EMAIL_ADDRESS } from "../../../config";

const config = require("../../../config.js");

describe("Test EmailClient\n", function() {

    describe("Sending an email...", function() {

        it("should send an email successfully", function() {
            return emailClient.sendEmail({
                from: `${APP_NAME} <${EMAIL_ADDRESS}>`,
                to: DEBUG_EMAIL_ADDRESS,
                subject: "Testing EmailClient",
                text: "Because there's HTML, this text won't appear in the email.",
                html: "<button style='color:blue;'>The button does nothing</button>"
            });
        });

    });

});
