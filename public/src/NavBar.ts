import { sendHTTPRequest } from "../../src/app/lib/AppUtilities";

/**
 * @description Log out the currently logged in user.
 */
export function logOut() {
  sendHTTPRequest("POST", "/logout", {})
      .then((_) => {
          localStorage.clear();
          window.location.href = "/";
      })
      .catch((err) => { console.error(err); });
}
