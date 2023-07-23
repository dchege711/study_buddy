import { sendForm } from "./AppUtilities";

function sendValidationURL() {
  sendForm("POST", location.href, new FormData(document.getElementById("send_validation_url_form") as HTMLFormElement))
      .then((confirmation) => {
          alert(confirmation);
          window.location.href = "/";
      })
      .catch((err) => { console.error(err); });

  return false;
}
