/**
 * A central place for patching up types from external libraries.
 *
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
 */

import { AuthenticateUser } from "./models/LogInUtilities";
import { IUser } from "./models/mongoose_models/UserSchema";
import { NextFunction, Request, Response } from "express";

declare module "express" {
  interface Request {
    session?: {
      user?: AuthenticateUser;
    };
  }

  interface Response {
    body?: {
      userIDInApp?: Pick<IUser, "userIDInApp">;
    };
  }

  interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): void;
    (req: Request, res: Response, next: NextFunction): void;
  }
}
