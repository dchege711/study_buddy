import React from "react";

import { LogInForm } from "./LogInForm";
import { SignUpForm } from "./SignUpForm";
import { FormOnDisplay } from "./login";
import useUser from "../lib/useUser";

interface SwitchFormProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  text: string;
}

function SwitchForm({ onClick, text }: SwitchFormProps) {
  return (
    <button
      className="w3-button w3-center w3-blue"
      onClick={onClick}
      type="button"
    >
      {text}
    </button>
  );
}

export default function LogInOrSignUp() {
  // If the user is already logged in, redirect them to the home page.
  useUser({redirectTo: "/home", redirectIfFound: true });

  const [formOnDisplay, setFormOnDisplay] =
    React.useState<FormOnDisplay>("login");

  function logInForm() {
    return (
      <LogInForm
        switchForm={
          <SwitchForm
            onClick={() => {
              setFormOnDisplay("signup");
            }}
            text="... or Sign Up for a New Account"
          />
        }
      />
    );
  }

  function signUpForm() {
    return (
      <SignUpForm
        switchForm={
          <SwitchForm
            onClick={() => {
              setFormOnDisplay("login");
            }}
            text="... or go back to LogIn"
          />
        }
      />
    );
  }

  return (
    <div
      id="welcome_page_content"
      className="w3-container w3-display-middle w3-third w3-center w3-padding-large"
    >
      {formOnDisplay === "login" && logInForm()}
      {formOnDisplay === "signup" && signUpForm()}
      <p>
        ...or head over to <a href="/browse/">browse/search</a> to view existing
        cards.
      </p>
    </div>
  );
}
