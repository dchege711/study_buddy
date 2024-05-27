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
import { ACCOUNT, ADD_CARD, BROWSE, DELETE_ACCOUNT, DELETE_CARD, DOWNLOAD_USER_DATA, DUPLICATE_CARD, FLAG_CARD, HOME, READ_CARD, READ_METADATA, READ_PUBLIC_CARD, READ_PUBLIC_METADATA, READ_TAG_GROUPS, RESTORE_CARD_FROM_TRASH, SEARCH_CARDS, TRASH_CARD, UPDATE_CARD, UPDATE_STREAK, UPDATE_USER_SETTINGS, WIKI } from "../paths";

const router = Router();

router.get(HOME, requireLogIn, home);

router.get(WIKI, wikiPage);

router.get(BROWSE, browsePageGet);

router.get(ACCOUNT, requireLogIn, accountGet);

router.post(ACCOUNT, requireLogIn, updateUserSettings);

router.get(DOWNLOAD_USER_DATA, requireLogIn, downloadUserData);

router.get(DELETE_ACCOUNT, requireLogIn, deleteAccount);

module.exports = router;
