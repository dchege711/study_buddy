import { sendEmail } from "./EmailClient";

const TEST_EMAIL_ADDRESS = "debug@c13u.com";

describe("EmailClientTest", function() {

    this.slow("3s");

    it("should send an email successfully", function() {
        return new Promise(function(resolve, reject) {
            sendEmail({
                subject: "Test Email", to: TEST_EMAIL_ADDRESS, 
                text: "This is a test email"
            })
            .then(function (confirmation) {
                console.log(confirmation);
                if (confirmation.success) resolve(confirmation.message);
                else reject(confirmation.message);
            })
        });
    });

});