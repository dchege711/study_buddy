import { Router } from "express";

import { requireLogIn } from "../controllers/AuthenticationController";
import * as InAppController from "../controllers/InAppController";
import { DummyError } from "../models/Utils";

const InAppRouter = Router();

InAppRouter.post("/read-card", requireLogIn, InAppController.readCard);

InAppRouter.post("/read-public-card", InAppController.readPublicCard);

InAppRouter.get("/home", requireLogIn, InAppController.home);

InAppRouter.get("/wiki", InAppController.wikiPage);

InAppRouter.get("/browse", InAppController.browsePageGet);

InAppRouter.post("/browse", InAppController.browsePagePost);

InAppRouter.get("/account", requireLogIn, InAppController.accountGet);

InAppRouter.post(
  "/read-tag-groups",
  requireLogIn,
  InAppController.readTagGroups
);

InAppRouter.post("/add-card", requireLogIn, InAppController.addCard);

InAppRouter.post("/search-cards", requireLogIn, InAppController.searchCards);

InAppRouter.post("/update-card", requireLogIn, InAppController.updateCard);

InAppRouter.post("/update-streak", requireLogIn, InAppController.updateStreak);

InAppRouter.post("/delete-card", requireLogIn, InAppController.deleteCard);

InAppRouter.post("/trash-card", requireLogIn, InAppController.trashCard);

InAppRouter.post(
  "/duplicate-card",
  requireLogIn,
  InAppController.duplicateCard
);

InAppRouter.post("/flag-card", InAppController.flagCard);

InAppRouter.post(
  "/restore-from-trash",
  requireLogIn,
  InAppController.restoreCardFromTrash
);

InAppRouter.get(
  "/account/download-user-data",
  requireLogIn,
  InAppController.downloadUserData
);

InAppRouter.post(
  "/account/delete-account",
  requireLogIn,
  InAppController.deleteAccount
);

InAppRouter.post(
  "/account/update-settings",
  requireLogIn,
  InAppController.updateUserPreferences
);

/** Dummy route added to test error handling on the application. */
InAppRouter.get("/5bc75664-dummy-server-error-url", (_, __) => {
  throw new DummyError("This string shouldn't appear to the user.");
});

export { InAppRouter };
