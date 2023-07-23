import React from "react";
import { ActionFunction, Form } from "react-router-dom";
import { sendForm } from "../AppUtilities";

type FormType = "login" | "signup";

function FormSwitcher({ formOnDisplay }: { formOnDisplay: FormType }) {
  function SwitchButton({ text }: { text: string }) {
    return (
      <button className="w3-button w3-center w3-border w3-border-blue w3-round-large w3-padding w3-margin">
        {text}
      </button>
    );
  }

  function SwitchToSignUpForm() {
    return <SwitchButton text="... or Sign Up for a New Account" />;
  }

  function SwitchToLogInForm() {
    return <SwitchButton text="... or Log In to an Existing Account" />;
  }

  function SwitchToForgotPasswordForm() {
    return <SwitchButton text="... or Reset Your Password" />;
  }

  return (
    <>
      {formOnDisplay !== "signup" && <SwitchToSignUpForm />}
      {formOnDisplay !== "login" && <SwitchToLogInForm />}
      <SwitchToForgotPasswordForm />
    </>
  );
}

export const handleLogin: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  return sendForm("POST", "/login", formData).then((res) => {
    console.log(res);
    return null;
  });
};

export function LogInForm() {
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
    </Form>
  );
}

export default function LogInOrSignUp() {
  const [formOnDisplay] = React.useState<FormType>("login");

  let content: JSX.Element | null = null;
  switch (formOnDisplay) {
    case "login":
      content = <LogInForm />;
      break;
    case "signup":
      content = <p>SignUpForm</p>;
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
        <FormSwitcher formOnDisplay={formOnDisplay} />
      </div>
    </div>
  );
}
