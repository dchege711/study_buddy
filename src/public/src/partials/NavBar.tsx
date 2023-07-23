import React from "react";

import { APP_NAME } from "../constants";
import { Link, useRouteLoaderData } from "react-router-dom";
import { AuthenticateUser } from "../../../models/LogInUtilities";

export default function NavBar() {
  const user = useRouteLoaderData("root") as AuthenticateUser | null | undefined;
  const isLoggedIn = user !== null && user !== undefined;

  return (
    <div>
      <ul className="topnav" id="topnavitems">
        <li className="left">
          <Link to="/" className="link_button">
            <strong>{APP_NAME}</strong>
          </Link>
        </li>
        {isLoggedIn && (
          <li className="left">
            <Link to="/home" className="link_button">
              My Cards
            </Link>
          </li>
        )}
        <li className="left">
          <Link to="/browse" className="link_button">
            Browse
          </Link>
        </li>
        <li className="left">
          <Link to="/wiki" className="link_button">
            Wiki
          </Link>
        </li>
        {isLoggedIn && (
          <>
            <li className="right">
              <Link to="/account" className="link_button">
                My Account
              </Link>
            </li>
            <li className="right">
              <Link to="/logout" className="link_button">
                Log Out
              </Link>
            </li>
          </>
        )}
        {!isLoggedIn && (
          <li className="right">
            <Link to="/login-or-sign-up" className="link_button">
              Log In / Sign Up
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
