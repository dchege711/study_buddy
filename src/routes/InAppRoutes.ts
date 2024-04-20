import { Router } from "express";

import { requireLogIn } from "../controllers/AuthenticationController";
import {
  readCard,
  readPublicCard,
  home,
  wikiPage,
  browsePageGet,
  browsePagePost,
  accountGet,
  readMetadata,
  readTagGroups,
  readPublicMetadata,
  addCard,
  searchCards,
  updateCard,
  updateStreak,
  deleteCard,
  trashCard,
  duplicateCard,
  flagCard,
  restoreCardFromTrash,
  downloadUserData,
  deleteAccount,
  updateUserSettings,
} from "../controllers/InAppController";
import { ACCOUNT, ADD_CARD, BROWSE, DELETE_ACCOUNT, DELETE_CARD, DOWNLOAD_USER_DATA, DUPLICATE_CARD, FLAG_CARD, HOME, READ_CARD, READ_METADATA, READ_PUBLIC_CARD, READ_PUBLIC_METADATA, READ_TAG_GROUPS, RESTORE_CARD_FROM_TRASH, SEARCH_CARDS, TRASH_CARD, UPDATE_CARD, UPDATE_STREAK, UPDATE_USER_SETTINGS, WIKI } from "../paths";

const router = Router();

router.post(READ_CARD, requireLogIn, readCard);

router.post(READ_PUBLIC_CARD, readPublicCard);

router.get(HOME, requireLogIn, home);

router.get(WIKI, wikiPage);

router.get(BROWSE, browsePageGet);

router.post(BROWSE, browsePagePost);

router.get(ACCOUNT, requireLogIn, accountGet);

router.post(READ_METADATA, requireLogIn, readMetadata);

router.post(READ_TAG_GROUPS, requireLogIn, readTagGroups);

router.post(READ_PUBLIC_METADATA, readPublicMetadata);

router.post(ADD_CARD, requireLogIn, addCard);

router.post(SEARCH_CARDS, requireLogIn, searchCards);

router.post(UPDATE_CARD, requireLogIn, updateCard);

router.post(UPDATE_STREAK, requireLogIn, updateStreak);

router.post(DELETE_CARD, requireLogIn, deleteCard);

router.post(TRASH_CARD, requireLogIn, trashCard);

router.post(DUPLICATE_CARD, requireLogIn, duplicateCard);

router.post(FLAG_CARD, flagCard);

router.post(RESTORE_CARD_FROM_TRASH, requireLogIn, restoreCardFromTrash);

router.get(DOWNLOAD_USER_DATA, requireLogIn, downloadUserData);

router.get(DELETE_ACCOUNT, requireLogIn, deleteAccount);

router.post(UPDATE_USER_SETTINGS, requireLogIn, updateUserSettings);

module.exports = router;
