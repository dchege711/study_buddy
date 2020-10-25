/**
 * @description Provide routes related to authenticating users.
 */

import { Router } from "express";

import {
  handleLogIn,
  registerUser,
  loginUser,
  logoutUser,
  sendValidationEmailGet,
  sendValidationEmailPost,
  verifyAccount,
  resetPasswordGet,
  resetPasswordPost,
  resetPasswordLinkGet,
  resetPasswordLinkPost,
} from "../controllers/AuthenticationController";

/**
 * A AuthenticationRouter with routes for registering users, logging in users, processing
 * account validation emails and processing password resets.
 */
const AuthenticationRouter = Router();

AuthenticationRouter.get("/", handleLogIn);
AuthenticationRouter.get("/login", handleLogIn);

AuthenticationRouter.post("/register-user", registerUser);

AuthenticationRouter.post("/login", loginUser);

AuthenticationRouter.post("/logout", logoutUser);

AuthenticationRouter.get("/send-validation-email", sendValidationEmailGet);

AuthenticationRouter.post("/send-validation-email", sendValidationEmailPost);

AuthenticationRouter.get("/verify-account/*", verifyAccount);

AuthenticationRouter.get("/reset-password", resetPasswordGet);

AuthenticationRouter.post("/reset-password", resetPasswordPost);

AuthenticationRouter.get("/reset-password-link/*", resetPasswordLinkGet);

AuthenticationRouter.post("/reset-password-link/*", resetPasswordLinkPost);

export { AuthenticationRouter };
