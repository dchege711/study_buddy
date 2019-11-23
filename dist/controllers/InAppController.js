"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CardsDB = require("../models/CardsMongoDB");
var MetadataDB = require("../models/MetadataMongoDB");
var LoginUtils = require("../models/LogInUtilities");
var UserSchema_1 = require("./../models/mongoose_models/UserSchema");
var config_1 = require("../config");
var ControllerUtilities_1 = require("./ControllerUtilities");
function readCard(req, res) {
    ControllerUtilities_1.sendResponseFromPromise(CardsDB.read(req.body), res);
}
exports.readCard = readCard;
;
function home(req, res) {
    res.render("pages/home.ejs", { SEARCH_ENDPOINT_URL: "/search-cards" });
}
exports.home = home;
;
function wikiPage(req, res) {
    res.render("pages/wiki_page.ejs");
}
exports.wikiPage = wikiPage;
;
function readPublicCard(req, res) {
    ControllerUtilities_1.sendResponseFromPromise(CardsDB.readPublicCard(req.body), res);
}
exports.readPublicCard = readPublicCard;
;
function readPublicMetadata(req, res) {
    UserSchema_1.User
        .findOne({ username: config_1.PUBLIC_USER_USERNAME })
        .then(function (publicUser) {
        ControllerUtilities_1.sendResponseFromPromise(MetadataDB.read({ userIDInApp: publicUser.userIDInApp }), res);
    })
        .catch(function (err) { ControllerUtilities_1.handleServerError(err, res); });
}
exports.readPublicMetadata = readPublicMetadata;
function browsePagePost(req, res) {
    ControllerUtilities_1.sendResponseFromPromise(CardsDB.publicSearch(req.body), res);
}
exports.browsePagePost = browsePagePost;
function browsePageGet(req, res) {
    CardsDB
        .publicSearch(req.query)
        .then(function (msgContainer) {
        res.render("pages/browse_cards_page.ejs", {
            SEARCH_ENDPOINT_URL: "/browse",
            abbreviatedCards: msgContainer.message
        });
    })
        .catch(function (err) { ControllerUtilities_1.handleServerError(err, res); });
}
exports.browsePageGet = browsePageGet;
;
function accountGet(req, res) {
    res.render("pages/account_page.ejs", { account_info: req.session.user });
}
exports.accountGet = accountGet;
;
function readMetadata(req, res) {
    var dataObject = { success: true, message: {} };
    MetadataDB.read(req.body)
        .then(function (metadataResponse) {
        dataObject.message.metadataDocs = metadataResponse.message;
        return CardsDB.read({ userIDInApp: req.body.userIDInApp }, "title tags urgency");
    })
        .then(function (minicardsResponse) {
        dataObject.message.minicards = minicardsResponse.message;
        res.json(dataObject);
    })
        .catch(function (err) {
        ControllerUtilities_1.handleServerError(err, res);
    });
}
exports.readMetadata = readMetadata;
;
function readTagGroups(req, res) {
    ControllerUtilities_1.sendResponseFromPromise(CardsDB.getTagGroupings(req.body), res);
}
exports.readTagGroups = readTagGroups;
function addCard(req, res) {
    ControllerUtilities_1.sendResponseFromPromise(CardsDB.create(req.body), res);
}
exports.addCard = addCard;
;
function searchCards(req, res) {
    var payload = req.body;
    payload.userIDInApp = req.session.user.userIDInApp;
    ControllerUtilities_1.sendResponseFromPromise(CardsDB.search(req.body), res);
}
exports.searchCards = searchCards;
;
function updateCard(req, res) {
    ControllerUtilities_1.sendResponseFromPromise(CardsDB.update(req.body), res);
}
exports.updateCard = updateCard;
;
function updateStreak(req, res) {
    ControllerUtilities_1.sendResponseFromPromise(MetadataDB.updateStreak(req.body), res);
}
exports.updateStreak = updateStreak;
function deleteCard(req, res) {
    ControllerUtilities_1.sendResponseFromPromise(MetadataDB.deleteCardFromTrash(req.body), res);
}
exports.deleteCard = deleteCard;
;
function trashCard(req, res) {
    ControllerUtilities_1.sendResponseFromPromise(MetadataDB.sendCardToTrash(req.body), res);
}
exports.trashCard = trashCard;
;
function restoreCardFromTrash(req, res) {
    ControllerUtilities_1.sendResponseFromPromise(MetadataDB.restoreCardFromTrash(req.body), res);
}
exports.restoreCardFromTrash = restoreCardFromTrash;
;
function downloadUserData(req, res) {
    MetadataDB
        .writeCardsToJSONFile(req.session.user.userIDInApp)
        .then(function (_a) {
        var filepath = _a[0], filename = _a[1];
        res.download(filepath, filename, function (err) {
            if (err) {
                console.error(err);
            }
            else {
                ControllerUtilities_1.deleteTempFile(filepath);
            }
        });
    })
        .catch(function (err) { ControllerUtilities_1.handleServerError(err, res); });
}
exports.downloadUserData = downloadUserData;
;
function deleteAccount(req, res) {
    LoginUtils
        .deleteAccount(req.session.user.userIDInApp)
        .then(function (confirmation) {
        delete req.session.user;
        res.setHeader("Set-Cookie", ["session_token=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT"]);
        ControllerUtilities_1.convertObjectToResponse(confirmation, res);
    })
        .catch(function (err) { ControllerUtilities_1.handleServerError(err, res); });
}
exports.deleteAccount = deleteAccount;
;
function updateUserSettings(req, res) {
    MetadataDB
        .updateUserSettings(req.body)
        .then(function (confirmation) {
        if (confirmation.success)
            req.session.user = confirmation.message;
        ControllerUtilities_1.convertObjectToResponse(confirmation, res);
    })
        .catch(function (err) { ControllerUtilities_1.handleServerError(err, res); });
}
exports.updateUserSettings = updateUserSettings;
;
function duplicateCard(req, res) {
    var duplicateCardArgs = req.body;
    duplicateCardArgs.userIDInApp = req.session.user.userIDInApp;
    ControllerUtilities_1.sendResponseFromPromise(CardsDB.duplicateCard(duplicateCardArgs), res);
}
exports.duplicateCard = duplicateCard;
;
function flagCard(req, res) {
    ControllerUtilities_1.sendResponseFromPromise(CardsDB.flagCard(req.body), res);
}
exports.flagCard = flagCard;
;
//# sourceMappingURL=InAppController.js.map