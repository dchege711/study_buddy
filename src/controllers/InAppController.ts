"use strict";

import { Request, RequestHandler, Response } from "express";

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
function getDefaultTemplateVars(req: Request | null = null): TemplateVariables {
    return {
        APP_NAME: config.APP_NAME, BASE_URL: config.BASE_URL,
        LOGGED_IN: req?.session?.user !== undefined
    };
}

export function readCard (req: Request, res: Response) {
    sendResponseFromPromise(CardsDB.read(req.body), res);
};

export function home (req: Request, res: Response) {
    let templateVars = getDefaultTemplateVars(req);
    templateVars.SEARCH_ENDPOINT_URL = "/search-cards";
    res.render("pages/home.ejs", templateVars);
};

export function wikiPage(req: Request, res: Response) {
    res.render("pages/wiki_page.ejs", getDefaultTemplateVars(req));
};

export function readPublicCard (req: Request, res: Response) {
    sendResponseFromPromise(CardsDB.readPublicCard(req.body), res);
};

export function readPublicMetadata (_: Request, res: Response) {
    User
        .findOne({username: config.PUBLIC_USER_USERNAME})
        .then((publicUser) => {
            if (publicUser === null) {
                throw new Error("Public user not found");
            }

            sendResponseFromPromise(
                MetadataDB.read({userIDInApp: publicUser.userIDInApp}), res
            );
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
}

export function browsePagePost(req: Request, res: Response) {
    sendResponseFromPromise(CardsDB.publicSearch(req.body), res);
}

export function browsePageGet(req: Request, res: Response) {
    let templateVars = getDefaultTemplateVars(req);
    templateVars.SEARCH_ENDPOINT_URL = "/browse";
    CardsDB
        .publicSearch(req.query as unknown as CardsDB.SearchPublicCardParams)
        .then((abbreviatedCards) => {
            templateVars.abbreviatedCards = abbreviatedCards;
            res.render("pages/browse_cards_page.ejs", templateVars);
        })
        .catch((err) => {convertObjectToResponse(err, null, res); });
};

export function accountGet (req: Request, res: Response) {
    res.render(
        "pages/account_page.ejs", {
            account_info: req.session?.user,
            APP_NAME: config.APP_NAME,
            LOGGED_IN: req.session?.user !== undefined
        }
    );
};

export function readMetadata (req: Request, res: Response) {
    let dataObject: {success: boolean; message: {metadataDocs?: Array<IMetadata>, minicards?: Array<Partial<ICard>>}} = {success: true, message: {}};
    MetadataDB.read(req.body)
        .then((metadataDocs) => {
            dataObject.message.metadataDocs = metadataDocs;
            return CardsDB.read(
                { userIDInApp: req.body.userIDInApp }, "title tags urgency"
            );
        })
        .then((minicards) => {
            dataObject.message.minicards = minicards;
            res.json(dataObject);
        })
        .catch((err) => {
            convertObjectToResponse(err, null, res);
        });
};

export function readTagGroups(req: Request, res: Response) {
    sendResponseFromPromise(CardsDB.getTagGroupings(req.body), res);
}

export function addCard (req: Request, res: Response) {
    sendResponseFromPromise(CardsDB.create(req.body), res);
};

export function searchCards (req: Request, res: Response) {
    let payload = req.body;
    payload.userIDInApp = req.session?.user?.userIDInApp;
    sendResponseFromPromise(CardsDB.search(req.body), res);
};

export function updateCard (req: Request, res: Response) {
    sendResponseFromPromise(CardsDB.update(req.body), res);
};

export function updateStreak (req: Request, res: Response) {
    sendResponseFromPromise(MetadataDB.updateStreak(req.body), res);
}

export function deleteCard (req: Request, res: Response) {
    sendResponseFromPromise(MetadataDB.deleteCardFromTrash(req.body), res);
};

export function trashCard (req: Request, res: Response) {
    sendResponseFromPromise(MetadataDB.sendCardToTrash(req.body), res);
};

export function restoreCardFromTrash (req: Request, res: Response) {
    sendResponseFromPromise(MetadataDB.restoreCardFromTrash(req.body), res);
};

export function downloadUserData(req: Request, res: Response) {
    let userIDInApp = req.session?.user?.userIDInApp;
    if (userIDInApp === undefined) {
        res.status(401).send("You must be logged in to download your data.");
        return;
    }

    MetadataDB
        .writeCardsToJSONFile(userIDInApp)
        .then((writeResult) => {
            res.download(writeResult.jsonFilePath, writeResult.jsonFileName, (err) => {
                if (err) { console.error(err); }
                else { deleteTempFile(writeResult.jsonFilePath); }
            });
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
};

export function deleteAccount(req: Request, res: Response) {
    let userIDInApp = req.session?.user?.userIDInApp;
    if (userIDInApp === undefined) {
        res.status(401).send("You must be logged in to delete your account.");
        return;
    }

    loginUtilities
        .deleteAccount(userIDInApp)
        .then((confirmation) => {
            delete req.session?.user;
            res.setHeader(
                "Set-Cookie",
                [`session_token=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT`]
            );
            convertObjectToResponse(null, confirmation, res);
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
};

export function updateUserSettings(req: Request, res: Response) {
    MetadataDB
        .updateUserSettings(req.body)
        .then((user) => {
            convertObjectToResponse(null, user, res);
        })
        .catch((err) => { convertObjectToResponse(err, null, res); });
};

export function duplicateCard(req: Request, res: Response) {
    let duplicateCardArgs = req.body as unknown as CardsDB.DuplicateCardParams;
    let userIDInApp = req.session?.user?.userIDInApp;
    if (userIDInApp === undefined) {
        res.status(401).send("You must be logged in to duplicate a card.");
        return;
    }

    duplicateCardArgs.userIDInApp = userIDInApp;
    sendResponseFromPromise(CardsDB.duplicateCard(duplicateCardArgs), res);
};

export function flagCard(req: Request, res: Response) {
    sendResponseFromPromise(CardsDB.flagCard(req.body), res);
};
