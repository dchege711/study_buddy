"use strict";

const emailClient = require("../../../models/EmailClient.js");
const config = require("../../../config.js");

describe("Test EmailClient\n", function() {


    describe("Sending an email...", function() {

        it("should send an email successfully", function() {
            return emailClient.sendEmail({
                from: `${config.APP_NAME} <${config.EMAIL_ADDRESS}>`,
                to: config.DEBUG_EMAIL_ADDRESS,
                subject: "Testing EmailClient",
                text: "Because there's HTML, this text won't appear in the email.",
                html: "<button style='color:blue;'>The button does nothing</button>"
            });
        });

    });
    
});