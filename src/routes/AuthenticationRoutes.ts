import { Router } from "express";

import {
  handleLogIn,
  handleRegisterUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPasswordGet,
  resetPasswordLinkGet,
  resetPasswordLinkPost,
  resetPasswordPost,
  sendValidationEmailGet,
  sendValidationEmailPost,
  verifyAccount,
} from "../controllers/AuthenticationController";
import { rateLimiter } from "../controllers/ControllerUtilities";
import {
  LOGIN,
  LOGOUT,
  REGISTER_USER,
  RESET_PASSWORD,
  RESET_PASSWORD_LINK,
  ROOT,
  SEND_VALIDATION_EMAIL,
  VERIFY_ACCOUNT,
} from "../paths";

const router = Router();

router.get(ROOT, rateLimiter, handleLogIn);

router.get(LOGIN, rateLimiter, handleLogIn);

router.post(LOGIN, rateLimiter, loginUser);

router.get(LOGOUT, logoutUser);

router.get(REGISTER_USER, rateLimiter, handleRegisterUser);

router.post(REGISTER_USER, registerUser);

router.get(SEND_VALIDATION_EMAIL, sendValidationEmailGet);

router.post(SEND_VALIDATION_EMAIL, sendValidationEmailPost);

router.get(`${VERIFY_ACCOUNT}/*`, verifyAccount);

router.get(RESET_PASSWORD, resetPasswordGet);

router.post(RESET_PASSWORD, resetPasswordPost);

router.get(`${RESET_PASSWORD_LINK}/*`, resetPasswordLinkGet);

router.post(`${RESET_PASSWORD_LINK}/*`, resetPasswordLinkPost);

export = router;
