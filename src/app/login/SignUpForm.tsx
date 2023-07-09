import React, { FormEvent, useState } from "react";

import { SignUpOrLogInFormProps } from "./login";
import useUser from "../lib/useUser";
import { sendForm } from "../lib/AppUtilities";

export function SignUpForm({switchForm}: SignUpOrLogInFormProps) {
  // Our parent component, LogInOrSignUp, ensures that the user is not logged in
  // if we're showing.
  const { mutateUser } = useUser({redirectTo: "", redirectIfFound: false });

  const [errorMsg, setErrorMsg] = useState("");

  async function signUpUser(event: FormEvent) {
    event.preventDefault();

    try {
      mutateUser(await sendForm("signup_form", "/register-user"), false);
    } catch (err) {
      setErrorMsg((err as Error).message);
    }
  }

  return (
    <form
      className="w3-padding-large tab_content"
      id="signup_form"
      method="post"
      onSubmit={signUpUser}
    >
      <label htmlFor="email">Email Address: </label>
      <input className="w3-input" type="email" name="email" required />

      <br />
      <br />

      <label htmlFor="username"> Choose an alphanumeric username: </label>
      <input
        autoComplete="username"
        className="w3-input"
        type="text"
        name="username"
        pattern="[_\-A-Za-z0-9]+"
        required
      />

      <br />
      <br />

      <label htmlFor="password"> Choose a password: </label>
      <input
        autoComplete="new-password"
        className="w3-input"
        type="password"
        name="password"
        id="signup_password"
        minLength={8}
        required
      />

      <br />
      <br />

      <button
        className="w3-button w3-center w3-green"
        type="submit"
        id="signup_submit"
      >
        Sign Up
      </button>

      <br />
      <br />

      {errorMsg && <p className="w3-text-red">{errorMsg}</p>}

      <br />
      <br />

      {switchForm}
    </form>
  );
}
