/**
 * A central place for patching up types from external libraries.
 *
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
 */

import type { NextFunction, Request, Response } from "express";
import type { Session } from "express-session";

import type { AuthenticateUser } from "../models/LogInUtilities.js";
import type { IUser } from "../models/mongoose_models/UserSchema.js";

declare module "express" {
  interface Request {
    session?: Session & {
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

declare module "express-session" {
  export interface SessionData {
    user: AuthenticateUser;
  }
}

declare global {
  namespace NodeJS {
    // https://github.com/TypeStrong/ts-node/issues/846#issuecomment-631830056
    interface Process {
      [s: symbol]: Register;
    }
  }
}

declare module "mocha" {
  /**
   * Global setup fixtures and global teardown fixtures share a context, which
   * means we can add properties to the context object (`this`) in the setup
   * fixture, and reference them later in the teardown fixture.
   *
   * [1]: https://mochajs.org/#global-setup-fixtures
   */
  interface Runner {
    server: import("http").Server;
  }
}
