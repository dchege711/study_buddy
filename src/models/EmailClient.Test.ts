import { sendEmail } from "./EmailClient";

const TEST_EMAIL_ADDRESS = "debug@c13u.com";

describe("EmailClientTest", function () {
  this.slow("3s");

  it("should send an email successfully.", function () {
    return new Promise(function (resolve, reject) {
      sendEmail({
        subject: "Test Email",
        to: TEST_EMAIL_ADDRESS,
        text: "This is a test email",
      }).then(function (confirmation) {
        if (confirmation.success) resolve(confirmation.message);
        else reject(confirmation.message);
      });
    });
  });

  it("should only send emails to validated accounts.", function () {
    throw new Error("Not implemented yet.");
  });
});
