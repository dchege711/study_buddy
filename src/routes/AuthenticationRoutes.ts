import { Router } from "express";

import {
  handleLogIn,
  loginUser,
  logoutUser,
  sendValidationEmailGet,
  verifyAccount,
  resetPasswordGet,
  resetPasswordLinkGet,
  resetPasswordLinkPost,
} from "../controllers/AuthenticationController";
import { LOGIN, LOGOUT, REGISTER_USER, RESET_PASSWORD, RESET_PASSWORD_LINK, ROOT, SEND_VALIDATION_EMAIL, VERIFY_ACCOUNT } from "../paths";

const router = Router();

router.get(ROOT, handleLogIn);

router.get(LOGIN, handleLogIn);

router.post(LOGIN, loginUser);

router.get(LOGOUT, logoutUser);

router.get(SEND_VALIDATION_EMAIL, sendValidationEmailGet);

router.get(`${VERIFY_ACCOUNT}/*`, verifyAccount);

router.get(RESET_PASSWORD, resetPasswordGet);

router.get(`${RESET_PASSWORD_LINK}/*`, resetPasswordLinkGet);

router.post(`${RESET_PASSWORD_LINK}/*`, resetPasswordLinkPost);

export = router;
