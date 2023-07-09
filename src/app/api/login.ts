/**
 * Adapted from [1].
 *
 * [1]: https://github.com/vvo/iron-session/blob/main/examples/next.js-typescript/pages/api/login.ts
 */

import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { sessionOptions } from "../lib/session";
import { authenticateUser } from "../../models/LogInUtilities";

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username_or_email, password } = await req.body;

  try {
    const authenticatedUser = await authenticateUser({username_or_email, password});
    req.session.user = authenticatedUser;
    await req.session.save();
    res.json(authenticatedUser);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
