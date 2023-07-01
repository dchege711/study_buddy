/**
 * A central place for patching up types from external libraries.
 *
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
 */

import { IToken } from "./models/mongoose_models/Token";
import { IUser } from "./models/mongoose_models/UserSchema";
import { NextFunction, Request, Response } from "express";

declare module "express" {
  interface Request {
    session?: {
      user?: Pick<IToken, "token_id" | "userIDInApp">;
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
