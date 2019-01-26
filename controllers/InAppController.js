"use strict";

const CardsDB = require("../models/CardsMongoDB.js");
const User = require("./../models/mongoose_models/UserSchema.js");
const MetadataDB = require("../models/MetadataMongoDB.js");
const controllerUtils = require("./ControllerUtilities.js");
const loginUtilities = require("../models/LogInUtilities.js");
const config = require("../config.js");

const convertObjectToResponse = controllerUtils.convertObjectToResponse;
const deleteTempFile = controllerUtils.deleteTempFile;
const sendResponseFromPromise = controllerUtils.sendResponseFromPromise;

const defaultTemplateObject = {
    APP_NAME: config.APP_NAME, BASE_URL: config.BASE_URL, LOGGED_IN: true
};

exports.readCard = function (req, res) {
    sendResponseFromPromise(CardsDB.read(req.body), res);
};

exports.home = function (req, res) {
    res.render("pages/home.ejs", defaultTemplateObject);
};

exports.wikiPage = function (req, res) {
    let templateObject = Object.assign({}, defaultTemplateObject)
    templateObject.LOGGED_IN = req.session.user !== undefined;
    res.render("pages/wiki_page.ejs", templateObject);
};

exports.readPublicCard = function (req, res) {
    sendResponseFromPromise(CardsDB.readPublicCard(req.body), res);
};

exports.readPublicMetadata = function (req, res) {
    User
        .findOne({username: config.PUBLIC_USER_USERNAME})
        .then((publicUser) => {
            sendResponseFromPromise(
                MetadataDB.read({userIDInApp: publicUser.userIDInApp}), res
            );
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
}

exports.browsePagePost = function(req, res) {
    sendResponseFromPromise(CardsDB.publicSearch(req.body), res);
}

exports.browsePageGet = function(req, res) {
    CardsDB
        .publicSearch(req.query)
        .then((abbreviatedCards) => {
            res.render(
                "pages/browse_cards_page.ejs", 
                {
                    abbreviatedCards: abbreviatedCards.message,
                    APP_NAME: config.APP_NAME,
                    LOGGED_IN: req.session.user !== undefined
                }
            );  
        })
        .catch((err) => {convertObjectToResponse(err, null, res); });
};

exports.accountGet = function (req, res) {
    res.render(
        "pages/account_page.ejs", {
            account_info: req.session.user, 
            APP_NAME: config.APP_NAME, 
            LOGGED_IN: req.session.user !== undefined
        }
    );
};

exports.readMetadata = function (req, res) {
    sendResponseFromPromise(MetadataDB.read(req.body), res);
};

exports.readTagGroups = function(req, res) {
    sendResponseFromPromise(CardsDB.getTagGroupings(req.body), res);
}

exports.addCard = function (req, res) {
    sendResponseFromPromise(CardsDB.create(req.body), res);
};

exports.searchCards = function (req, res) {
    let payload = req.body;
    payload.userIDInApp = req.session.user.userIDInApp;
    sendResponseFromPromise(CardsDB.search(req.body), res);
};

exports.updateCard = function (req, res) {
    sendResponseFromPromise(CardsDB.update(req.body), res);
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

exports.downloadUserData = function(req, res) {
    MetadataDB
        .writeCardsToJSONFile(req.session.user.userIDInApp)
        .then(([filepath, filename]) => {
            res.download(filepath, filename, (err) => {
                if (err) { console.error(err); }
                else { deleteTempFile(filepath); }
            });
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
};

exports.deleteAccount = function(req, res) {
    loginUtilities
        .deleteAccount(req.session.user.userIDInApp)
        .then((confirmation) => {
            delete req.session.user;
            res.setHeader(
                "Set-Cookie",
                [`session_token=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT`]
            );
            convertObjectToResponse(null, confirmation, res);
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
};

exports.updateUserSettings = function(req, res) {
    sendResponseFromPromise(MetadataDB.updateUserSettings(req.body), res);
};

exports.duplicateCard = function(req, res) {
    let duplicateCardArgs = req.body;
    duplicateCardArgs.userIDInApp = req.session.user.userIDInApp;
    sendResponseFromPromise(CardsDB.duplicateCard(duplicateCardArgs), res);
};

exports.flagCard = function(req, res) {
    sendResponseFromPromise(CardsDB.flagCard(req.body), res);
};