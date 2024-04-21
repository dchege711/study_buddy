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

export function home (req: Request, res: Response) {
    let templateVars = getDefaultTemplateVars(req);
    templateVars.SEARCH_ENDPOINT_URL = "/search-cards";
    res.render("pages/home.ejs", templateVars);
};

export function wikiPage(req: Request, res: Response) {
    res.render("pages/wiki_page.ejs", getDefaultTemplateVars(req));
};

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
