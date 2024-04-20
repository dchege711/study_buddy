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
import { LOGIN, LOGOUT, REGISTER_USER, RESET_PASSWORD, RESET_PASSWORD_LINK, ROOT, SEND_VALIDATION_EMAIL, VERIFY_ACCOUNT } from "../paths";

const router = Router();

router.get(ROOT, handleLogIn);

router.get(LOGIN, handleLogIn);

router.post(REGISTER_USER, registerUser);

router.post(LOGIN, loginUser);

router.get(LOGOUT, logoutUser);

router.get(SEND_VALIDATION_EMAIL, sendValidationEmailGet);

router.post(SEND_VALIDATION_EMAIL, sendValidationEmailPost);

router.get(`${VERIFY_ACCOUNT}/*`, verifyAccount);

router.get(RESET_PASSWORD, resetPasswordGet);

router.post(RESET_PASSWORD, resetPasswordPost);

router.get(`${RESET_PASSWORD_LINK}/*`, resetPasswordLinkGet);

router.post(`${RESET_PASSWORD_LINK}/*`, resetPasswordLinkPost);

export = router;
