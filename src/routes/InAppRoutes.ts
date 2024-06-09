import { Router } from "express";

import { requireLogIn } from "../controllers/AuthenticationController";
import {
  home,
  wikiPage,
  browsePageGet,
  accountGet,
  updateUserSettings,
  downloadUserData,
  deleteAccount,
} from "../controllers/InAppController";
import { rateLimiter } from "../controllers/ControllerUtilities";
import { ACCOUNT, ADD_CARD, BROWSE, DELETE_ACCOUNT, DELETE_CARD, DOWNLOAD_USER_DATA, DUPLICATE_CARD, FLAG_CARD, HOME, READ_CARD, READ_METADATA, READ_PUBLIC_CARD, READ_PUBLIC_METADATA, READ_TAG_GROUPS, RESTORE_CARD_FROM_TRASH, SEARCH_CARDS, TRASH_CARD, UPDATE_CARD, UPDATE_STREAK, UPDATE_USER_SETTINGS, WIKI } from "../paths";

const router = Router();

router.get(HOME, rateLimiter, requireLogIn, home);

router.get(WIKI, wikiPage);

router.get(BROWSE, browsePageGet);

router.get(ACCOUNT, rateLimiter, requireLogIn, accountGet);

router.post(ACCOUNT, rateLimiter, requireLogIn, updateUserSettings);

router.get(DOWNLOAD_USER_DATA, rateLimiter, requireLogIn, downloadUserData);

router.get(DELETE_ACCOUNT, rateLimiter, requireLogIn, deleteAccount);

module.exports = router;
