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
import {
  pathValidationMiddleware,
  rateLimiter,
  validationMiddleware,
} from "../controllers/ControllerUtilities";
import {
  resetPasswordLinkPathValidator,
  resetPasswordLinkPostParamsValidator,
  resetPasswordRequestParamsValidator,
  sendValidationEmailParamsValidator,
  userLoginParamsValidator,
  userRegistrationParamsValidator,
  verificationPathValidator,
} from "../models/SanitizationAndValidation";
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

router.post(
  LOGIN,
  rateLimiter,
  validationMiddleware(userLoginParamsValidator),
  loginUser,
);

router.get(LOGOUT, logoutUser);

router.get(REGISTER_USER, rateLimiter, handleRegisterUser);

router.post(
  REGISTER_USER,
  validationMiddleware(userRegistrationParamsValidator),
  registerUser,
);

router.get(SEND_VALIDATION_EMAIL, sendValidationEmailGet);

router.post(
  SEND_VALIDATION_EMAIL,
  validationMiddleware(sendValidationEmailParamsValidator),
  sendValidationEmailPost,
);

router.get(
  `${VERIFY_ACCOUNT}/*`,
  pathValidationMiddleware(verificationPathValidator),
  verifyAccount,
);

router.get(RESET_PASSWORD, resetPasswordGet);

router.post(
  RESET_PASSWORD,
  validationMiddleware(resetPasswordRequestParamsValidator),
  resetPasswordPost,
);

router.get(
  `${RESET_PASSWORD_LINK}/*`,
  pathValidationMiddleware(resetPasswordLinkPathValidator),
  resetPasswordLinkGet,
);

router.post(
  `${RESET_PASSWORD_LINK}/*`,
  pathValidationMiddleware(resetPasswordLinkPathValidator),
  validationMiddleware(resetPasswordLinkPostParamsValidator),
  resetPasswordLinkPost,
);

export = router;
