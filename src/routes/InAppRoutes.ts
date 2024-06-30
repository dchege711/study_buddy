import { Router } from "express";

import { requireLogIn } from "../controllers/AuthenticationController";
import {
  rateLimiter,
  validationMiddleware,
} from "../controllers/ControllerUtilities";
import {
  accountGet,
  browsePageGet,
  deleteAccount,
  downloadUserData,
  home,
  updateUserSettings,
  wikiPage,
} from "../controllers/InAppController";
import { userSettingsParamsValidator } from "../models/SanitizationAndValidation";
import {
  ACCOUNT,
  BROWSE,
  DELETE_ACCOUNT,
  DOWNLOAD_USER_DATA,
  HOME,
  WIKI,
} from "../paths";

const router = Router();

router.get(HOME, rateLimiter, requireLogIn, home);

router.get(WIKI, wikiPage);

router.get(BROWSE, browsePageGet);

router.get(ACCOUNT, rateLimiter, requireLogIn, accountGet);

router.post(
  ACCOUNT,
  rateLimiter,
  validationMiddleware(userSettingsParamsValidator),
  requireLogIn,
  updateUserSettings,
);

router.get(DOWNLOAD_USER_DATA, rateLimiter, requireLogIn, downloadUserData);

router.get(DELETE_ACCOUNT, rateLimiter, requireLogIn, deleteAccount);

export = router;
