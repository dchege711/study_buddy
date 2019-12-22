import { Request, Response } from "express"

import * as UserModel from "../models/UserModel";
import * as FlashCardsModel from "../models/FlashCardModel";
import { 
    convertObjectToResponse, deleteTempFile,
    sendResponseFromPromise, handleServerError 
} from "./ControllerUtilities";
import { 
    ISearchQuery, IClientFacingFlashCard 
} from "../models/SanitizationAndValidation";
import { INewFlashCard } from "../models/db/DBModels";

/**
 * @description Read the card whose id is `req.body.cardId` and owned by the
 * currently logged in user.
 */
export function readCard(req: Request, res: Response) {
    sendResponseFromPromise(
        FlashCardsModel.read({
            ownerId: req.session.user.id, cardId: req.body.cardId
        }), 
        res
    );
};

/**
 * @description Render the main page for the app. This page shows the flashcards
 * that are owned by the logged in user and provides methods for editing/viewing
 * them.
 */
export function home(_: Request, res: Response) {
    res.render("pages/home.ejs", {SEARCH_ENDPOINT_URL: "/search-cards"});
};

/**
 * @description Render the wiki page. The wiki page explains how different
 * features are used in the app, e.g. LaTeX, sorting, code snippets, etc.
 */
export function wikiPage(req: Request, res: Response) {
    res.render("pages/wiki_page.ejs");
};

/**
 * @description Read a card that is available for anyone to view. This differs
 * from `read` in that the logged in user doesn't need to own the requested
 * card.
 */
export function readPublicCard(req: Request, res: Response) {
    sendResponseFromPromise(
        FlashCardsModel.readPublicCard({cardId: req.body.cardId}), res
    );
};

/**
 * @description Pick all the necessary attributes from the incoming payload
 * needed to form a query for flashcards. This is instead of passing the whole
 * payload, which may contain malicious data in fields that we don't care to 
 * sanitize.
 * @param payload The data submitted by the client, e.g. through a POST request
 * @returns A filtered version of the payload with keys that are recognized by
 * the `SanitizationAndValidation.ISearchQuery` interface.
 */
function parsePublicSearchQuery(payload: any): ISearchQuery {
    let query: ISearchQuery = {};
    if (payload.ownerId) query.ownerId = payload.ownerId;
    if (payload.cardIds) query.cardIds = payload.cardIds;
    if (payload.queryString) query.queryString = payload.queryString;
    if (payload.creationStartDate) query.creationStartDate = payload.creationStartDate;
    if (payload.creationEndDate) query.creationEndDate = payload.creationEndDate;
    return query;
}

/**
 * @description Respond to card queries posted from the browse page. These
 * queries fetch more information about publicly owned cards.
 */
export function browsePagePost(req: Request, res: Response) {
    sendResponseFromPromise(
        FlashCardsModel.publicSearch(parsePublicSearchQuery(req.body)), res
    );
}

/**
 * @description Render the browse page, where users can view publicly available
 * cards (including their own).
 */
export function browsePageGet(req: Request, res: Response) {
    FlashCardsModel
        .publicSearch(parsePublicSearchQuery(req.query))
        .then((msgContainer) => {
            res.render(
                "pages/browse_cards_page.ejs", 
                { 
                    SEARCH_ENDPOINT_URL: "/browse", 
                    abbreviatedCards: msgContainer.message
                }
            );
        })
        .catch((err) => { handleServerError(err, res); });
};

/**
 * @description Render the account page from where the user can administer
 * actions such as updating their preferences, download their cards and delete
 * their account.
 */
export function accountGet(req: Request, res: Response) {
    res.render(
        "pages/account_page.ejs", { account_info: req.session.user }
    );
};

/**
 * @description Return the various groupings of tags owned by the user, i.e. an
 * array of arrays, where each inner array is a list of tags that appear on the
 * same card.
 */
export function readTagGroups(req: Request, res: Response) {
    sendResponseFromPromise(
        FlashCardsModel.getTagGroupings({userId: req.session.user.id}), res
    );
}

/**
 * @description Create a new card that is owned by the logged in user.
 */
export function addCard(req: Request, res: Response) {
    let card = parseClientFacingCard(req.body);
    card.ownerId = req.session.user.id;
    sendResponseFromPromise(FlashCardsModel.create(<INewFlashCard>card), res);
};

/**
 * @description Search for cards that are owned by the logged in user.
 */
export function searchCards(req: Request, res: Response) {
    let payload: {[s: string]: any} = {};
    payload.ownerId = req.session.user.id;
    if (req.body.limit) payload.limit = req.body.limit;
    if (req.body.queryString) payload.queryString = req.body.queryString;
    sendResponseFromPromise(FlashCardsModel.search(payload), res);
};

/**
 * @description Pick all the necessary attributes from the incoming payload
 * needed to form a flashcard (from the client's perspective). This is instead
 * of passing the whole payload, which may contain malicious data in fields that
 * we don't care to sanitize.
 * @param payload The data submitted by the client, e.g. through a POST request
 * @returns The `payload` stripped of all attributes unrelated to a flashcard.
 */
function parseClientFacingCard(payload: {[s: string]: any}): 
        IClientFacingFlashCard {
    let card: Partial<IClientFacingFlashCard>;
    if (payload.title) card.title = payload.title;
    if (payload.tags) card.tags = payload.tags;
    if (payload.rawDescription) card.rawDescription = payload.rawDescription;
    if (payload.urgency) card.urgency = payload.urgency;
    if (payload.id) card.id = payload.id;
    return card;
}

/**
 * @description Update a card owned by the logged in user.
 */
export function updateCard(req: Request, res: Response) {
    let card = parseClientFacingCard(req.body);
    card.ownerId = req.session.user.id;
    sendResponseFromPromise(FlashCardsModel.update(card), res);
};

/**
 * @description Add some more cards to the list of cards that the user has 
 * reviewed today. This list is used to update the streaks at the end of each
 * day.
 */
export function updateStreak(req: Request, res: Response) {
    sendResponseFromPromise(
        UserModel.updateStreak({
            userId: req.session.user.id, cardIds: req.body.cardIds
        }), res
    );
}

/**
 * @description Delete a card owned by the user.
 */
export function deleteCard(req: Request, res: Response) {
    sendResponseFromPromise(
        FlashCardsModel.permanentlyDeleteCard({
            ownerId: req.session.user.id, cardId: req.body.cardId
        }), res
    );
};

/**
 * @description Move a card owned by the user to the trash. Such a card can be
 * restored later. It is not permanently deleted (unless it's been in the trash
 * for 30 days)
 */
export function trashCard(req: Request, res: Response) {
    sendResponseFromPromise(
        FlashCardsModel.trashCard({
            ownerId: req.session.user.id, cardId: req.body.cardId
        }), res
    );
};

/**
 * @description Restore a card owned by the user from the trash.
 */
export function restoreCardFromTrash(req: Request, res: Response) {
    sendResponseFromPromise(
        FlashCardsModel.restoreCardFromTrash({
            ownerId: req.session.user.id, cardId: req.body.cardId
        }), res
    );
};

/**
 * @description Allow the user to download all the cards that they own.
 */
export function downloadUserData(req: Request, res: Response) {
    UserModel
        .writeCardsToJSONFile(req.session.user.userIDInApp)
        .then(([filepath, filename]) => {
            res.download(filepath, filename, (err) => {
                if (err) { console.error(err); }
                else { deleteTempFile(filepath); }
            });
        })
        .catch((err) => { handleServerError(err, res); });
};

/**
 * @description Delete the logged in user's account permanently. There is no
 * going back.
 */
export function deleteAccount(req: Request, res: Response) {
    UserModel
        .deleteAccount({id: req.session.user.id})
        .then((confirmation) => {
            delete req.session.user;
            res.setHeader(
                "Set-Cookie",
                [`session_token=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT`]
            );
            convertObjectToResponse(confirmation, res);
        })
        .catch((err) => { handleServerError(err, res); });
};

/**
 * @description Update the logged in user's preferences.
 */
export function updateUserPreferences(req: Request, res: Response) {
    let newPrefs: {[s: string]: number | boolean} = {};
    if (req.body.cardsAreByDefaultPrivate !== undefined) {
        newPrefs.cardsAreByDefaultPrivate = req.body.cardsAreByDefaultPrivate;
    }
    if (req.body.dailyTarget) newPrefs.dailyTarget = req.body.dailyTarget;

    UserModel
        .updateUserPreferences(req.session.user.id, newPrefs)
        .then((confirmation) => {
            if (confirmation.success) req.session.user = confirmation.message;
            convertObjectToResponse(confirmation, res);
        })
        .catch((err) => { handleServerError(err, res); });
};

/**
 * @description Duplicate the submitted card and add it to the logged in user's
 * set of cards.
 * 
 * @todo Make this a no-op if the logged in user already owns the card.
 */
export function duplicateCard(req: Request, res: Response) {
    let duplicateCardArgs = req.body;
    duplicateCardArgs.userId = req.session.user.id;
    sendResponseFromPromise(
        FlashCardsModel.duplicateCard({
            cardId: req.body.cardId, userId: req.session.user.id, 
            isPublic: req.body.isPublic
        }), res
    );
};

/**
 * @description Flag a publicly available card for further review.
 */
export function flagCard(req: Request, res: Response) {
    sendResponseFromPromise(
        FlashCardsModel.flagCard({
            cardId: req.body.cardId, markedForReview: req.body.markedForReview,
            markedAsDuplicate: req.body.markedAsDuplicate
        }), res
    );
};