import React from "react";

import { APP_NAME } from "../constants";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div>
      <ul className="topnav" id="topnavitems">
        <li className="left">
          <Link to="/" className="link_button">
            <strong>{APP_NAME}</strong>
          </Link>
        </li>

        <li className="left">
          <Link to="/home" className="link_button">
            Home
          </Link>
        </li>

        <li className="left">
          <Link to="/browse" className="link_button">
            Browse/Search
          </Link>
        </li>

        <li className="left">
          <Link to="/wiki" className="link_button">
            Wiki
          </Link>
        </li>
      </ul>
    </div>
  );
}
