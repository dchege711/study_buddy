import { ROOT } from "../../paths";
import { sendForm } from "./AppUtilities";

function sendValidationURL() {
  sendForm("send_validation_url_form", location.href)
      .then((confirmation) => {
          alert(confirmation);
          window.location.href = ROOT;
      })
      .catch((err) => { console.error(err); });

  return false;
}