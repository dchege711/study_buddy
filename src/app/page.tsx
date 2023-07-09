import React from "react";
import Link from "next/link";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { withIronSessionSsr } from "iron-session/next";

import { APP_NAME, IS_PROD, STUDY_BUDDY_SESSION_SECRET_1 } from "../config";
import { IToken } from "../models/mongoose_models/Token";
import { sendHTTPRequest } from "./lib/AppUtilities";
import useUser from "./lib/useUser";

function NavBar() {
  const { user } = useUser({ redirectTo: "", redirectIfFound: false });
  const isLoggedIn = user && user.token_id !== undefined;

  function renderNavLink(
    to: string,
    text: string | JSX.Element,
    onClick: React.MouseEventHandler<HTMLAnchorElement> = () => {}
  ) {
    return (
      <li className="left">
        <Link href={to} className="link_button" onClick={onClick}>
          {text}
        </Link>
      </li>
    );
  }

  function logOut() {
    sendHTTPRequest("POST", "/logout", {})
        .then((_) => { localStorage.clear(); window.location.href = "/"; });
  }

  return (
    <div>
      <ul className="topnav" id="topnavitems">
        {renderNavLink("/", <strong>{APP_NAME}</strong>)}
        {renderNavLink("/home", "Home")}
        {renderNavLink("/browse", "Browse/Search")}
        {renderNavLink("/wiki", "Wiki")}
        {isLoggedIn && renderNavLink("#", "Your Account", logOut)}
        {isLoggedIn && renderNavLink("/account", "Your Account")}
      </ul>
    </div>
  );
}

export default function App() {
    return <NavBar />;
}
