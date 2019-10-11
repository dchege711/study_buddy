"use strict";
var CardsDB = require("../models/CardsMongoDB.js");
var User = require("./../models/mongoose_models/UserSchema.js");
var MetadataDB = require("../models/MetadataMongoDB.js");
var controllerUtils = require("./ControllerUtilities.js");
var loginUtilities = require("../models/LogInUtilities.js");
var config = require("../config.js");
var convertObjectToResponse = controllerUtils.convertObjectToResponse;
var deleteTempFile = controllerUtils.deleteTempFile;
var sendResponseFromPromise = controllerUtils.sendResponseFromPromise;
/**
 * @param {Object} req The incoming HTTP request
 *
 * @return {JSON} The key-value pairs that should be provided to templates by
 * default.
 */
function getDefaultTemplateVars(req) {
    if (req === void 0) { req = undefined; }
    return {
        APP_NAME: config.APP_NAME, BASE_URL: config.BASE_URL,
        LOGGED_IN: req.session.user !== undefined
    };
}
exports.readCard = function (req, res) {
    sendResponseFromPromise(CardsDB.read(req.body), res);
};
exports.home = function (req, res) {
    var templateVars = getDefaultTemplateVars(req);
    templateVars.SEARCH_ENDPOINT_URL = "/search-cards";
    res.render("pages/home.ejs", templateVars);
};
exports.wikiPage = function (req, res) {
    res.render("pages/wiki_page.ejs", getDefaultTemplateVars(req));
};
exports.readPublicCard = function (req, res) {
    sendResponseFromPromise(CardsDB.readPublicCard(req.body), res);
};
exports.readPublicMetadata = function (req, res) {
    User
        .findOne({ username: config.PUBLIC_USER_USERNAME })
        .then(function (publicUser) {
        sendResponseFromPromise(MetadataDB.read({ userIDInApp: publicUser.userIDInApp }), res);
    })
        .catch(function (err) { convertObjectToResponse(err, null, res); });
};
exports.browsePagePost = function (req, res) {
    sendResponseFromPromise(CardsDB.publicSearch(req.body), res);
};
exports.browsePageGet = function (req, res) {
    var templateVars = getDefaultTemplateVars(req);
    templateVars.SEARCH_ENDPOINT_URL = "/browse";
    CardsDB
        .publicSearch(req.query)
        .then(function (abbreviatedCards) {
        templateVars.abbreviatedCards = abbreviatedCards.message;
        res.render("pages/browse_cards_page.ejs", templateVars);
    })
        .catch(function (err) { convertObjectToResponse(err, null, res); });
};
exports.accountGet = function (req, res) {
    res.render("pages/account_page.ejs", {
        account_info: req.session.user,
        APP_NAME: config.APP_NAME,
        LOGGED_IN: req.session.user !== undefined
    });
};
exports.readMetadata = function (req, res) {
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
        convertObjectToResponse(err, null, res);
    });
};
exports.readTagGroups = function (req, res) {
    sendResponseFromPromise(CardsDB.getTagGroupings(req.body), res);
};
exports.addCard = function (req, res) {
    sendResponseFromPromise(CardsDB.create(req.body), res);
};
exports.searchCards = function (req, res) {
    var payload = req.body;
    payload.userIDInApp = req.session.user.userIDInApp;
    sendResponseFromPromise(CardsDB.search(req.body), res);
};
exports.updateCard = function (req, res) {
    sendResponseFromPromise(CardsDB.update(req.body), res);
};
exports.updateStreak = function (req, res) {
    sendResponseFromPromise(MetadataDB.updateStreak(req.body), res);
};
exports.deleteCard = function (req, res) {
    sendResponseFromPromise(MetadataDB.deleteCardFromTrash(req.body), res);
};
exports.trashCard = function (req, res) {
    sendResponseFromPromise(MetadataDB.sendCardToTrash(req.body), res);
};
exports.restoreCardFromTrash = function (req, res) {
    sendResponseFromPromise(MetadataDB.restoreCardFromTrash(req.body), res);
};
exports.downloadUserData = function (req, res) {
    MetadataDB
        .writeCardsToJSONFile(req.session.user.userIDInApp)
        .then(function (_a) {
        var filepath = _a[0], filename = _a[1];
        res.download(filepath, filename, function (err) {
            if (err) {
                console.error(err);
            }
            else {
                deleteTempFile(filepath);
            }
        });
    })
        .catch(function (err) { convertObjectToResponse(err, null, res); });
};
exports.deleteAccount = function (req, res) {
    loginUtilities
        .deleteAccount(req.session.user.userIDInApp)
        .then(function (confirmation) {
        delete req.session.user;
        res.setHeader("Set-Cookie", ["session_token=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT"]);
        convertObjectToResponse(null, confirmation, res);
    })
        .catch(function (err) { convertObjectToResponse(err, null, res); });
};
exports.updateUserSettings = function (req, res) {
    MetadataDB
        .updateUserSettings(req.body)
        .then(function (confirmation) {
        if (confirmation.success)
            req.session.user = confirmation.user;
        convertObjectToResponse(null, confirmation, res);
    })
        .catch(function (err) { convertObjectToResponse(err, null, res); });
};
exports.duplicateCard = function (req, res) {
    var duplicateCardArgs = req.body;
    duplicateCardArgs.userIDInApp = req.session.user.userIDInApp;
    sendResponseFromPromise(CardsDB.duplicateCard(duplicateCardArgs), res);
};
exports.flagCard = function (req, res) {
    sendResponseFromPromise(CardsDB.flagCard(req.body), res);
};
