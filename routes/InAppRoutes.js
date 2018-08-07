var express = require("express");
var inAppController = require("../controllers/InAppController.js");
var requireLogIn = require("../controllers/AuthenticationController.js").requireLogIn;

var router = express.Router();

router.post("/read-card", requireLogIn, inAppController.read_card);

router.get("/home", requireLogIn, inAppController.home);

router.post("/read-metadata", requireLogIn, inAppController.read_metadata);

router.post("/tags", inAppController.tags);

router.post("/add-card", requireLogIn, inAppController.add_card);

router.post("/search-cards", requireLogIn, inAppController.search_cards);

router.post("/update-card", requireLogIn, inAppController.update_card);

router.post("/delete-card", requireLogIn, inAppController.delete_card);

router.post("/trash-card", requireLogIn, inAppController.trash_card);

router.post("/restore-from-trash", requireLogIn, inAppController.restore_from_trash);

module.exports = router;