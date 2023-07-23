import React from "react";
import { ActionFunction, Form, redirect, useActionData } from "react-router-dom";
import { sendForm } from "../AppUtilities";
import { useUser } from "../partials/UserHook";
import { AuthenticateUser } from "../../../models/LogInUtilities";

type FormType = "login" | "signup" | "reset-password";

function SwitchButton({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w3-button w3-center w3-border w3-border-blue w3-round-large w3-padding w3-margin"
    >
      {text}
    </button>
  );
}

function FormSwitcher({
  formOnDisplay,
  setFormOnDisplay,
}: {
  formOnDisplay: FormType;
  setFormOnDisplay: (form: FormType) => void;
}) {
  function SwitchToSignUpForm() {
    return (
      <SwitchButton
        text="... or Sign Up for a New Account"
        onClick={() => {
          setFormOnDisplay("signup");
        }}
      />
    );
  }

  function SwitchToLogInForm() {
    return (
      <SwitchButton
        text="... or Log In to an Existing Account"
        onClick={() => {
          setFormOnDisplay("login");
        }}
      />
    );
  }

  function SwitchToForgotPasswordForm() {
    return (
      <SwitchButton
        text="... or Reset Your Password"
        onClick={() => {
          setFormOnDisplay("reset-password");
        }}
      />
    );
  }

  return (
    <>
      {formOnDisplay !== "signup" && <SwitchToSignUpForm />}
      {formOnDisplay !== "login" && <SwitchToLogInForm />}
      {formOnDisplay !== "reset-password" && <SwitchToForgotPasswordForm />}
    </>
  );
}

export const handleLogin: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  return sendForm("POST", "/login", formData).then((res: AuthenticateUser | string) => {
    if (typeof res === "object") {
        localStorage.setItem("session_info", JSON.stringify(res));
        return redirect("/");
    }

    // Store the error message in the session so it can be displayed on the
    // form.
    return res;
  });
};

function LogInForm() {
  const validationMessage = useActionData() as string | null;
  return (
    <Form
      className="w3-padding-large tab_content"
      id="login_form"
      method="post"
      action="login"
      encType="multipart/form-data"
    >
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
        className="w3-input"
        type="password"
        name="password"
        id="login_password"
        autoComplete="current-password"
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

      {validationMessage && <p className="w3-text">{validationMessage}</p>}
    </Form>
  );
}

export const handleSignUp: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  return sendForm("POST", "/register-user", formData).then((res: string) => {
    return res;
  });
};

function SignUpForm() {
  const validationMessage = useActionData() as string | null;
  return (
    <Form
      className="w3-padding-large tab_content"
      id="signup_form"
      method="post"
      action="register-user"
      encType="multipart/form-data"
    >
      <label htmlFor="email">Email Address: </label>
      <input className="w3-input" type="email" name="email" required />

      <br />
      <br />

      <label htmlFor="username"> Choose an alphanumeric username: </label>
      <input
        className="w3-input"
        type="text"
        name="username"
        pattern="[_\-A-Za-z0-9]+"
        autoComplete="username"
        required
      />

      <br />
      <br />

      <label htmlFor="password"> Choose a password: </label>
      <input
        className="w3-input"
        type="password"
        name="password"
        id="signup_password"
        minLength={8}
        autoComplete="new-password"
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
      {validationMessage && <p className="w3-text">{validationMessage}</p>}
    </Form>
  );
}

export default function LogInOrSignUp() {
  const [formOnDisplay, setFormOnDisplay] = React.useState<FormType>("login");

  let content: JSX.Element | null = null;
  switch (formOnDisplay) {
    case "login":
      content = <LogInForm />;
      break;
    case "signup":
      content = <SignUpForm />;
      break;
  }

  return (
    <div
      id="welcome_page_content"
      className="w3-container w3-padding-large"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="w3-container w3-third w3-center">
        {content}
        <FormSwitcher
          formOnDisplay={formOnDisplay}
          setFormOnDisplay={setFormOnDisplay}
        />
      </div>
    </div>
  );
}
