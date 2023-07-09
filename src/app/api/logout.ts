import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import { AuthenticateUser } from "../../models/LogInUtilities";

export default withIronSessionApiRoute(logoutRoute, sessionOptions);

const loggedOutUser: AuthenticateUser = {
  token_id: "",
  userIDInApp: -1,
  username: "",
  email: "",
  cardsAreByDefaultPrivate: false,
  user_reg_date: "",
};

function logoutRoute(req: NextApiRequest, res: NextApiResponse<AuthenticateUser>) {
  req.session.destroy();

  // TODO: Is this the best way to do this? Who expects this response?
  res.json(loggedOutUser);
}
