"use strict";

import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";

import * as CardsDB from "../models/CardsMongoDB";
import { User } from "../models/mongoose_models/UserSchema";
import * as MetadataDB from "../models/MetadataMongoDB";
import * as controllerUtils from "./ControllerUtilities";
import * as loginUtilities from "../models/LogInUtilities";
import * as config from "../config";
import { ICard, MiniICard } from "../models/mongoose_models/CardSchema";
import { IMetadata } from "../models/mongoose_models/MetadataCardSchema";
import * as allPaths from "../paths";

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
        LOGGED_IN: req?.session?.user !== undefined,
        ...allPaths
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
  sendResponseFromPromise(MetadataDB.readPublicMetadata(), res);
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

export interface MetadataResponse {
    metadataDocs?: IMetadata[],
    minicards?: MiniICard[]
}

export function readMetadata (req: Request, res: Response) {
    let dataObject: MetadataResponse = {};
    let userIDInApp = req.session?.user?.userIDInApp;

    if (userIDInApp === undefined) {
        res.status(401).send("You must be logged in to read metadata.");
        return;
    }

    MetadataDB.read({userIDInApp})
        .then((metadataDocs) => {
            dataObject.metadataDocs = metadataDocs;
            return CardsDB.read(
                { userIDInApp: userIDInApp! }, "title tags urgency"
            );
        })
        .then((minicards) => {
            dataObject.minicards = minicards;
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
        .then((_) => {
            delete req.session?.user;
            res.setHeader(
                "Set-Cookie",
                [`session_token=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT`]
            );
            res.redirect(StatusCodes.SEE_OTHER, "/browse");
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
    if (!req.session?.user) {
        res.status(401).send("You must be logged in to duplicate a card.");
        return;
    }

    let payload : CardsDB.DuplicateCardParams = {
        cardID: req.body?.cardID,
        userIDInApp: req.session.user.userIDInApp,
        cardsAreByDefaultPrivate: req.session.user.cardsAreByDefaultPrivate,
    }
    sendResponseFromPromise(CardsDB.duplicateCard(payload), res);
};

export function flagCard(req: Request, res: Response) {
    sendResponseFromPromise(CardsDB.flagCard(req.body), res);
};
