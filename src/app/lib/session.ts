/**
 * Code adapted from the docs at [1]
 *
 * [1]: https://github.com/vvo/iron-session/blob/main/examples/next.js-typescript/lib/session.ts
 */

/**
 * `import type` only imports declarations to be used for type annotations and
 * declarations. It always gets fully erased, so there’s no remnant of it at
 * runtime.
 *
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html
 */
import type { IronSessionOptions } from "iron-session";

import { IS_PROD, STUDY_BUDDY_SESSION_SECRET_1 } from "../../config";
import { AuthenticateUser } from "../../models/LogInUtilities";

export const sessionOptions: IronSessionOptions = {
  password: STUDY_BUDDY_SESSION_SECRET_1,
  cookieName: "c13u-study-buddy",
  cookieOptions: {
    // Secure doesn't work for local development via localhost.
    secure: IS_PROD,
  },
};

// Augment the typings of req.session to include our custom `user` property.
declare module "iron-session" {
  interface IronSessionData {
    user?: AuthenticateUser;
  }
}
