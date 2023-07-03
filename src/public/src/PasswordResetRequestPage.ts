import { ResetLinkParams } from "../../models/LogInUtilities";
import { sendHTTPRequest } from "./AppUtilities";

let state = {
  addressElement: document.getElementById("email_address") as HTMLInputElement,
  formPasswordRequest: document.getElementById("form_password_request") as Element
};
if (!state.addressElement || !state.formPasswordRequest) {
  throw new Error("Could not find either the form or email address element.");
}

/**
* @description Request a password reset.
*/
export function passwordResetRequest() {

  if (!state.addressElement.checkValidity()) {
      state.addressElement.reportValidity();
      return;
  }

  let payload: ResetLinkParams = {
      email: state.addressElement.value
  }

  sendHTTPRequest("POST", "/reset-password", payload)
    .then((confirmation) => {
      state.formPasswordRequest.innerHTML = `
            <p>${confirmation}</p>

            <br />
            <br />

            <button class="w3-button w3-center w3-blue"
                id="go_back_to_login_button" onclick="window.location='/login'">
                ... go back to LogIn</button>`;
    })
    .catch((err) => { console.error(err); });

  return false;
}
