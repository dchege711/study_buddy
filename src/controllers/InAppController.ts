"use strict";

import * as CardsDB from "../models/CardsMongoDB";
import { User } from "../models/mongoose_models/UserSchema";
import * as MetadataDB from "../models/MetadataMongoDB";
import * as controllerUtils from "./ControllerUtilities";
import * as loginUtilities from "../models/LogInUtilities";
import * as config from "../config";
import { ICard } from "../models/mongoose_models/CardSchema";
import { IMetadata } from "../models/mongoose_models/MetadataCardSchema";

const convertObjectToResponse = controllerUtils.convertObjectToResponse;
const deleteTempFile = controllerUtils.deleteTempFile;
const sendResponseFromPromise = controllerUtils.sendResponseFromPromise;

interface TemplateVariables {
    APP_NAME: string,
    BASE_URL: string,
    LOGGED_IN: boolean,
    SEARCH_ENDPOINT_URL?: string;
    abbreviatedCards?: Array<Partial<ICard>>;
}

/**
 * @param {Object} req The incoming HTTP request
 *
 * @return {JSON} The key-value pairs that should be provided to templates by
 * default.
 */
function getDefaultTemplateVars(req = undefined): TemplateVariables {
    return {
        APP_NAME: config.APP_NAME, BASE_URL: config.BASE_URL,
        LOGGED_IN: req.session.user !== undefined
    };
}

export function readCard (req, res) {
    sendResponseFromPromise(CardsDB.read(req.body), res);
};

export function home (req, res) {
    let templateVars = getDefaultTemplateVars(req);
    templateVars.SEARCH_ENDPOINT_URL = "/search-cards";
    res.render("pages/home.ejs", templateVars);
};

export function wikiPage (req, res) {
    res.render("pages/wiki_page.ejs", getDefaultTemplateVars(req));
};

export function readPublicCard (req, res) {
    sendResponseFromPromise(CardsDB.readPublicCard(req.body), res);
};

export function readPublicMetadata (req, res) {
    User
        .findOne({username: config.PUBLIC_USER_USERNAME})
        .then((publicUser) => {
            sendResponseFromPromise(
                MetadataDB.read({userIDInApp: publicUser.userIDInApp}), res
            );
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
}

export function browsePagePost(req, res) {
    sendResponseFromPromise(CardsDB.publicSearch(req.body), res);
}

export function browsePageGet(req, res) {
    let templateVars = getDefaultTemplateVars(req);
    templateVars.SEARCH_ENDPOINT_URL = "/browse";
    CardsDB
        .publicSearch(req.query)
        .then((abbreviatedCards) => {
            templateVars.abbreviatedCards = abbreviatedCards;
            res.render("pages/browse_cards_page.ejs", templateVars);
        })
        .catch((err) => {convertObjectToResponse(err, null, res); });
};

export function accountGet (req, res) {
    res.render(
        "pages/account_page.ejs", {
            account_info: req.session.user,
            APP_NAME: config.APP_NAME,
            LOGGED_IN: req.session.user !== undefined
        }
    );
};

export function readMetadata (req, res) {
    let dataObject: {success: boolean; message: {metadataDocs?: Array<IMetadata>, minicards?: Array<Partial<ICard>>}} = {success: true, message: {}};
    MetadataDB.read(req.body)
        .then((metadataResponse) => {
            dataObject.message.metadataDocs = metadataResponse.message;
            return CardsDB.read(
                { userIDInApp: req.body.userIDInApp }, "title tags urgency"
            );
        })
        .then((minicardsResponse) => {
            dataObject.message.minicards = minicardsResponse.message;
            res.json(dataObject);
        })
        .catch((err) => {
            convertObjectToResponse(err, null, res);
        });
};

export function readTagGroups(req, res) {
    sendResponseFromPromise(CardsDB.getTagGroupings(req.body), res);
}

export function addCard (req, res) {
    sendResponseFromPromise(CardsDB.create(req.body), res);
};

export function searchCards (req, res) {
    let payload = req.body;
    payload.userIDInApp = req.session.user.userIDInApp;
    sendResponseFromPromise(CardsDB.search(req.body), res);
};

export function updateCard (req, res) {
    sendResponseFromPromise(CardsDB.update(req.body), res);
};

export function updateStreak (req, res) {
    sendResponseFromPromise(MetadataDB.updateStreak(req.body), res);
}

export function deleteCard (req, res) {
    sendResponseFromPromise(MetadataDB.deleteCardFromTrash(req.body), res);
};

export function trashCard (req, res) {
    sendResponseFromPromise(MetadataDB.sendCardToTrash(req.body), res);
};

export function restoreCardFromTrash (req, res) {
    sendResponseFromPromise(MetadataDB.restoreCardFromTrash(req.body), res);
};

export function downloadUserData(req, res) {
    MetadataDB
        .writeCardsToJSONFile(req.session.user.userIDInApp)
        .then((writeResult) => {
            res.download(writeResult.jsonFilePath, writeResult.jsonFileName, (err) => {
                if (err) { console.error(err); }
                else { deleteTempFile(writeResult.jsonFilePath); }
            });
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
};

export function deleteAccount(req, res) {
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

export function updateUserSettings(req, res) {
    MetadataDB
        .updateUserSettings(req.body)
        .then((confirmation) => {
            if (confirmation.success) req.session.user = confirmation.user;
            convertObjectToResponse(null, confirmation, res);
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
};

export function duplicateCard(req, res) {
    let duplicateCardArgs = req.body;
    duplicateCardArgs.userIDInApp = req.session.user.userIDInApp;
    sendResponseFromPromise(CardsDB.duplicateCard(duplicateCardArgs), res);
};

export function flagCard(req, res) {
    sendResponseFromPromise(CardsDB.flagCard(req.body), res);
};
