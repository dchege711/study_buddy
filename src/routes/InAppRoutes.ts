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
  reactVersion
} from "../controllers/InAppController";

const router = Router();

router.post("/read-card", requireLogIn, readCard);

router.post("/read-public-card", readPublicCard);

// router.get("/home", requireLogIn, home);

// router.get("/wiki", wikiPage);

// router.get("/browse", browsePageGet);

router.post("/browse", browsePagePost);

// router.get("/account", requireLogIn, accountGet);

router.post("/read-metadata", requireLogIn, readMetadata);

router.post("/read-tag-groups", requireLogIn, readTagGroups);

router.post("/read-public-metadata", readPublicMetadata);

router.post("/add-card", requireLogIn, addCard);

router.post("/search-cards", requireLogIn, searchCards);

router.post("/update-card", requireLogIn, updateCard);

router.post("/update-streak", requireLogIn, updateStreak);

router.post("/delete-card", requireLogIn, deleteCard);

router.post("/trash-card", requireLogIn, trashCard);

router.post("/duplicate-card", requireLogIn, duplicateCard);

router.post("/flag-card", flagCard);

router.post("/restore-from-trash", requireLogIn, restoreCardFromTrash);

// router.get("/account/download-user-data", requireLogIn, downloadUserData);

router.post("/account/delete-account", requireLogIn, deleteAccount);

router.post("/account/update-settings", requireLogIn, updateUserSettings);

router.get("/", reactVersion);

module.exports = router;
