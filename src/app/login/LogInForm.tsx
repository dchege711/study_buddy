import React, { FormEvent, useState } from "react";
import Link from "next/link";

import { SignUpOrLogInFormProps } from "./login";
import useUser from "../lib/useUser";
import { sendForm } from "../lib/AppUtilities";

export function LogInForm({switchForm}: SignUpOrLogInFormProps) {
  // Our parent component, LogInOrSignUp, ensures that the user is not logged in
  // if we're showing.
  const { mutateUser } = useUser({redirectTo: "", redirectIfFound: false });

  const [errorMsg, setErrorMsg] = useState("");

  async function logInUser(event: FormEvent) {
    event.preventDefault();

    try {
      mutateUser(await sendForm("login_form", "/login"), false);
    } catch (err) {
      setErrorMsg((err as Error).message);
    }
  }

  return (
    <form method="post" onSubmit={logInUser} id="login_form">
      <label htmlFor="username"> Username or Email Address: </label>
      <input
        className="w3-input"
        type="text"
        name="username_or_email"
        autoComplete="username"
        required
      />

      <br />
      <br />

      <label htmlFor="password"> Password: </label>
      <input
        autoComplete="current-password"
        className="w3-input"
        type="password"
        name="password"
        id="login_password"
        minLength={8}
        required
      />

      <br />
      <br />

      <button
        className="w3-button w3-center w3-green"
        type="submit"
        id="login_submit"
      >
        Log In
      </button>

      <br />
      <br />

      {errorMsg && <p className="w3-text-red">{errorMsg}</p>}

      <br />
      <br />

      {switchForm}

      <Link href="/reset-password" style={{ textDecoration: "underline" }}>
        Forgot password?
      </Link>
    </form>
  );
}
