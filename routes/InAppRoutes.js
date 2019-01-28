var express = require("express");
var inAppController = require("../controllers/InAppController.js");
var requireLogIn = require("../controllers/AuthenticationController.js").requireLogIn;

var router = express.Router();

router.post("/read-card", requireLogIn, inAppController.readCard);

router.post("/read-public-card", inAppController.readPublicCard);

router.get("/home", requireLogIn, inAppController.home);

router.get("/wiki", inAppController.wikiPage);

router.get("/browse", inAppController.browsePageGet);

router.post("/browse", inAppController.browsePagePost);

router.get("/account", requireLogIn, inAppController.accountGet);

router.post("/read-metadata", requireLogIn, inAppController.readMetadata);

router.post("/read-tag-groups", requireLogIn, inAppController.readTagGroups);

router.post("/read-public-metadata", inAppController.readPublicMetadata);

router.post("/add-card", requireLogIn, inAppController.addCard);

router.post("/search-cards", requireLogIn, inAppController.searchCards);

router.post("/update-card", requireLogIn, inAppController.updateCard);

router.post("/update-streak", requireLogIn, inAppController.updateStreak);

router.post("/delete-card", requireLogIn, inAppController.deleteCard);

router.post("/trash-card", requireLogIn, inAppController.trashCard);

router.post("/duplicate-card", requireLogIn, inAppController.duplicateCard);

router.post("/flag-card", inAppController.flagCard);

router.post("/restore-from-trash", requireLogIn, inAppController.restoreCardFromTrash);

router.get("/account/download-user-data", requireLogIn, inAppController.downloadUserData);

router.post("/account/delete-account", requireLogIn, inAppController.deleteAccount);

router.post("/account/update-settings", requireLogIn, inAppController.updateUserSettings);

module.exports = router;