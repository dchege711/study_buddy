/**
 * A central place for patching up types from external libraries.
 *
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
 */

import type { NextFunction, Request, Response } from "express";

import type { AuthenticateUser } from "../models/LogInUtilities.js";
import type { IUser } from "../models/mongoose_models/UserSchema.js";

declare module "express" {
  interface Request {
    session?: {
      message?: string;
      user?: AuthenticateUser;
    };
  }

  interface Response {
    body?: {
      userIDInApp?: Pick<IUser, "userIDInApp">;
    };
  }
}

declare module 'express-session' {
  export interface SessionData {
    user: AuthenticateUser;
  }
}
