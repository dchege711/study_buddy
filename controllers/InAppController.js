"use strict";

const CardsDB = require("../models/CardsMongoDB.js");
const MetadataDB = require("../models/MetadataMongoDB.js");
const controllerUtils = require("./ControllerUtilities.js");
const loginUtilities = require("../models/LogInUtilities.js");
const config = require("../config.js");

const convertObjectToResponse = controllerUtils.convertObjectToResponse;
const deleteTempFile = controllerUtils.deleteTempFile;
const sendResponseFromPromise = controllerUtils.sendResponseFromPromise;

const defaultTemplateObject = {
    APP_NAME: config.APP_NAME, BASE_URL: config.BASE_URL
};

exports.read_card = function (req, res) {
    sendResponseFromPromise(CardsDB.read(req.body), res);
};

exports.home = function (req, res) {
    res.render("pages/home.ejs", defaultTemplateObject);
};

exports.wiki_page = function (req, res) {
    res.render("pages/wiki_page.ejs", defaultTemplateObject);
};

exports.read_public_card = function (req, res) {
    sendResponseFromPromise(CardsDB.readPublicCard(req.body), res);
};

exports.browse_page = function(req, res) {
    CardsDB
        .publicSearch(req.query)
        .then((abbreviatedCards) => {
            res.render(
                "pages/browse_cards_page.ejs", 
                {
                    abbreviatedCards: abbreviatedCards.message,
                    APP_NAME: config.APP_NAME
                }
            );
        })
        .catch((err) => {convertObjectToResponse(err, null, res); });
};

exports.account_get = function (req, res) {
    res.render(
        "pages/account_page.ejs", 
        {account_info: req.session.user, APP_NAME: config.APP_NAME}
    );
};

exports.read_metadata = function (req, res) {
    sendResponseFromPromise(MetadataDB.read(req.body), res);
};

exports.tags = function (req, res) {
    sendResponseFromPromise(MetadataDB.readTags(req.body), res);
};

exports.add_card = function (req, res) {
    sendResponseFromPromise(CardsDB.create(req.body), res);
};

exports.search_cards = function (req, res) {
    let payload = req.body;
    payload.userIDInApp = req.session.user.userIDInApp;
    sendResponseFromPromise(CardsDB.search(req.body), res);
};

exports.update_card = function (req, res) {
    sendResponseFromPromise(CardsDB.update(req.body), res);
};

exports.delete_card = function (req, res) {
    sendResponseFromPromise(MetadataDB.deleteCardFromTrash(req.body), res);
};

exports.trash_card = function (req, res) {
    sendResponseFromPromise(MetadataDB.sendCardToTrash(req.body), res);
};

exports.restore_from_trash = function (req, res) {
    sendResponseFromPromise(MetadataDB.restoreCardFromTrash(req.body), res);
};

exports.download_user_data = function(req, res) {
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

exports.delete_account = function(req, res) {
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