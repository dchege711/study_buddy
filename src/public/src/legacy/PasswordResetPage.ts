import { ResetPasswordParams } from "../../models/LogInUtilities";
import { LOGIN, RESET_PASSWORD_LINK } from "../../paths";
import { sendHTTPRequest } from "./AppUtilities";

function resetPassword() {
  let password_1 = (document.getElementById("password_1") as HTMLInputElement).value;
  let password_2 = (document.getElementById("password_1") as HTMLInputElement).value;
  if (!password_1 || !password_2) {
    alert("Please enter a password.");
    return;
  }

  if (password_1 !== password_2) {
      alert("The submitted passwords do not match!");
      return;
  }

  let payload: ResetPasswordParams = {
      password: password_1,
      reset_password_uri: window.location.pathname.split(RESET_PASSWORD_LINK)[1],
      reset_request_time: new Date()
  };
  sendHTTPRequest("POST", location.href, payload)
      .then((confirmation) => {
          window.location.href = `${LOGIN}?msg=${encodeURI(confirmation)}`;
      })
      .catch((err: Error) => { alert(err.message); console.error(err); });

  return false;
}
