import { Router } from "express";

import {
  handleLogIn,
  handleRegisterUser,
  loginUser,
  logoutUser,
  sendValidationEmailGet,
  verifyAccount,
  registerUser,
  resetPasswordGet,
  resetPasswordPost,
  resetPasswordLinkGet,
  resetPasswordLinkPost,
} from "../controllers/AuthenticationController";
import { LOGIN, LOGOUT, REGISTER_USER, RESET_PASSWORD, RESET_PASSWORD_LINK, ROOT, SEND_VALIDATION_EMAIL, VERIFY_ACCOUNT } from "../paths";

const router = Router();

router.get(ROOT, handleLogIn);

router.get(LOGIN, handleLogIn);

router.post(LOGIN, loginUser);

router.get(LOGOUT, logoutUser);

router.get(REGISTER_USER, handleRegisterUser);

router.post(REGISTER_USER, registerUser);

router.get(SEND_VALIDATION_EMAIL, sendValidationEmailGet);

router.get(`${VERIFY_ACCOUNT}/*`, verifyAccount);

router.get(RESET_PASSWORD, resetPasswordGet);

router.post(RESET_PASSWORD, resetPasswordPost);

router.get(`${RESET_PASSWORD_LINK}/*`, resetPasswordLinkGet);

router.post(`${RESET_PASSWORD_LINK}/*`, resetPasswordLinkPost);

export = router;
