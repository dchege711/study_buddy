import { AuthenticateUserParam } from "../../models/LogInUtilities";
import { sendForm, sendHTTPRequest } from "./AppUtilities";

/**
 * @description Toggle the form being displayed.
 * @param {string} form_id The ID of the form to be displayed.
 *
 */
export function displayForm(form_id: string) {
  var elements = document.getElementsByClassName("tab_content");
  for (let i = 0; i < elements.length; i++) {
      (elements[i] as HTMLElement).style.display = "none";
  }
  (document.getElementById(form_id) as HTMLElement).style.display = "block";
  return false;
}

/**
 * @description Log in the user.
 * @param {string} formID The ID of the form that has credentials
 * @param {string} url The URL at which the form will be processed
 */
export function logInUser(formID: string, url: string) {
  sendForm(formID, url)
      .then((message: string) => {
        alert(message);
      })
      .catch((err) => { console.error(err); });

  return false;
}

/*
 * @description Sign up a new user and log them in.
 *
 * @param {string} formID The ID of the form that has credentials
 * @param {string} url The URL at which the form will be processed
 */
export function signUpUser(formID: string, url: string) {
  let formElements = (document.getElementById(formID) as HTMLFormElement).elements;
  let username_or_email = (formElements.namedItem("email") as HTMLInputElement).value;
  let password = (formElements.namedItem("password") as HTMLInputElement).value;
  if (!username_or_email || !password) {
    alert("Please fill in the form with valid inputs.");
    return false;
  }

  sendForm(formID, url)
      .then((confirmation: string) => {
          alert(confirmation);
          let payload: AuthenticateUserParam = {username_or_email, password};
          return sendHTTPRequest("POST", "/login", payload);
      })
      .catch((err) => { console.error(err); })

  return false;
}
