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

const router = Router();

router.get("/", handleLogIn);

router.get("/login", handleLogIn);

router.post("/register-user", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/send-validation-email", sendValidationEmailGet);

router.post("/send-validation-email", sendValidationEmailPost);

router.get("/verify-account/*", verifyAccount);

router.get("/reset-password", resetPasswordGet);

router.post("/reset-password", resetPasswordPost);

router.get("/reset-password-link/*", resetPasswordLinkGet);

router.post("/reset-password-link/*", resetPasswordLinkPost);

export = router;
