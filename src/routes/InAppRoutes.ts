import { Router } from "express";

import { requireLogIn } from "../controllers/AuthenticationController";
import * as InAppController from "../controllers/InAppController";

const InAppRouter = Router();

InAppRouter.post("/read-card", requireLogIn, InAppController.readCard);

InAppRouter.post("/read-public-card", InAppController.readPublicCard);

InAppRouter.get("/home", requireLogIn, InAppController.home);

InAppRouter.get("/wiki", InAppController.wikiPage);

InAppRouter.get("/browse", InAppController.browsePageGet);

InAppRouter.post("/browse", InAppController.browsePagePost);

InAppRouter.get("/account", requireLogIn, InAppController.accountGet);

InAppRouter.post("/read-metadata", requireLogIn, InAppController.readMetadata);

InAppRouter.post("/read-tag-groups", requireLogIn, InAppController.readTagGroups);

InAppRouter.post("/read-public-metadata", InAppController.readPublicMetadata);

InAppRouter.post("/add-card", requireLogIn, InAppController.addCard);

InAppRouter.post("/search-cards", requireLogIn, InAppController.searchCards);

InAppRouter.post("/update-card", requireLogIn, InAppController.updateCard);

InAppRouter.post("/update-streak", requireLogIn, InAppController.updateStreak);

InAppRouter.post("/delete-card", requireLogIn, InAppController.deleteCard);

InAppRouter.post("/trash-card", requireLogIn, InAppController.trashCard);

InAppRouter.post("/duplicate-card", requireLogIn, InAppController.duplicateCard);

InAppRouter.post("/flag-card", InAppController.flagCard);

InAppRouter.post("/restore-from-trash", requireLogIn, InAppController.restoreCardFromTrash);

InAppRouter.get("/account/download-user-data", requireLogIn, InAppController.downloadUserData);

InAppRouter.post("/account/delete-account", requireLogIn, InAppController.deleteAccount);

InAppRouter.post("/account/update-settings", requireLogIn, InAppController.updateUserSettings);

export { InAppRouter };