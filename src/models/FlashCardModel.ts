/**
 * Handle card-related activities, e.g. CRUD operations.
 * 
 * @module
 */

import { 
    sanitizeCard, sanitizeQuery, ISearchQuery, IClientFacingFlashCard
} from "./SanitizationAndValidation";
import { IBaseMessage } from "../controllers/ControllerUtilities";

import { FlashCard, INewFlashCard, Tag } from "./DBModels";
import { WhereOptions, FindOptions, Op, Model } from "sequelize/types";

/** 
 * Create new tags for each val in `tagsValues`, if no `Tag` has a value `val`.
 */
async function findOrCreateTags(tagValues: string[]): Promise<Tag[]> {
    try {
        let tagValuesSet = new Set(tagValues);
        let alreadyExistingTags = await Tag.findAll({
            where: { value: { in: tagValues } }
        });
        alreadyExistingTags.forEach((tag: Tag) => {
            tagValuesSet.delete(tag.value)
        });
        let tagCreationObjects: {value: string}[] = []
        tagValuesSet.forEach((val) => {
            tagCreationObjects.push({value: val});
        });
        /**
         * Sequelize warns that `bulkCreate` might not return all the rows:
         * > The success handler is passed an array of instances, but please
         * > notice that these may not completely represent the state of the
         * > rows in the DB. This is because MySQL and SQLite do not make it
         * > easy to obtain back automatically generated IDs and other default
         * > values in a way that can be mapped to multiple records. To obtain
         * > Instances for the newly created values, you will need to query for
         * > them again.
         * 
         * However, we're using Postgres, so we're safe. We have a test to
         * assert that all the tags get returned.
         */
        return await Tag.bulkCreate(tagCreationObjects);

    } catch (err) {
        throw err;
    }
    
}

/** 
 * A utility function for setting the tags for a given card.
 */
function setTagsToCard(card: FlashCard, tagValues: string[]):
    Promise<FlashCard> {
    return new Promise(function(resolve, reject) {
        findOrCreateTags(tagValues)
            .then((tags) => {
                return card.setTags(tags);
            })
            .then((savedCard: FlashCard) => {
                resolve(savedCard);
            })
            .catch((err: Error) => { reject(err); });
    });
}

/**
 * @description Create a new card and add it to the user's current cards. If 
 * successful, the `message` property holds the newly saved card.
 */
export function create(newCard: INewFlashCard): Promise<IBaseMessage> {
    return new Promise(function(resolve, reject) {
        newCard = <INewFlashCard>sanitizeCard(newCard);
        FlashCard.create(newCard)
            .then((savedCard: FlashCard) => {
                return setTagsToCard(savedCard, newCard.tags);
            })
            .then((savedCard: FlashCard) => {
                resolve({ success: true, status: 200, message: savedCard });
            })
            .catch((err: Error) => { reject(err); });
    });
};

/**
 * Create multiple cards at once. If successful, the `message` attribute will 
 * be an array of the IDs of the saved cards.
 * 
 * @todo Why does this method return a list of IDs when it already has a list
 * of the complete cards themselves? It's not as if we're saving space - most of
 * the information was already in `newCards` anyway...
 * 
 * @todo Can you utilize the `bulkCreate` operation to speed up this function?
 * Is it even worth speeding up? Don't optimize prematurely.
 */
export function createMany(newCards: INewFlashCard[]): Promise<IBaseMessage> {
    for (let i = 0; i < newCards.length; i++) {
        newCards[i] = <INewFlashCard>sanitizeCard(newCards[i]);
    }

    return new Promise(async function(resolve, reject) {
        let savedCardsIDs = [];
        let saveConfirmation: IBaseMessage;

        try {
            for (let i = 0; i < newCards.length; i++) {
                saveConfirmation = await create(newCards[i]);
                savedCardsIDs.push(saveConfirmation.message._id);
            }
            resolve({
                success: true, status: 200, message: savedCardsIDs
            });
        } catch (err) {
            reject(err);
        }
        
    });
}

/**
 * Fetch matching card(s) from the database.
 * 
 * @param searchQuery `ownerId` must be set to the ID of the user that owns the
 * card(s) being searched for. `cardId` should also be set. If `cardId` is 
 * `null`, then all cards owned by `ownerId` will be returned.
 * 
 * @todo Is returning `descriptionHTML` the reason for superflous whitespace
 * when we convert it to raw text in the card editor? Or is it a shortcoming of
 * the conversion library?
 * 
 * @todo What about fetching multiple cards from a list of card IDs?
 */
export function read(
    searchQuery: Pick<ISearchQuery, "ownerId" | "cardId">, 
    attributesToFetch: string[] = [
        "title", "rawDescription", "htmlDescription", "tags", "urgency", 
        "ownerId", "isPublic"]
    ): Promise<IBaseMessage> {
    
    searchQuery = sanitizeQuery(searchQuery);
    let query: Partial<FlashCard> = {ownerId: searchQuery.ownerId};
    if (!searchQuery.cardId) query.id = searchQuery.cardId;
    
    const ATTACH_TAGS = attributesToFetch.includes("tags");

    return new Promise(function(resolve, reject) {
        FlashCard
            .findAll({
                where: <WhereOptions>query,
                attributes: attributesToFetch
            })
            .then((cards: IClientFacingFlashCard[]) => {
                if (ATTACH_TAGS) {
                    for (let i = 0; i < cards.length; i++) {
                        cards[i].tags = cards[i].getTags();
                    }
                }
                resolve({
                    success: true, status: 200, message: cards
                });
            })
            .catch((err: Error) => { reject(err); });
    });
};

/**
 * @description Save the changes `cardJSON` to the database.
 * 
 * @param flashCard The parts of the card that have been updated. Must
 * include `id` as an attribute, otherwise no changes will be made. Some 
 * fields are treated as constants, e.g. `createdById` and `createdAt`.
 * 
 * @returns {Promise} If successful, `message` will be the updated card.
 */
export function update(incomingCard: IClientFacingFlashCard): Promise<IBaseMessage> {

    incomingCard = sanitizeCard(incomingCard);
    return new Promise(function(resolve, reject) {
        FlashCard
            .findByPk(incomingCard.id)
            .then((card: FlashCard) => {
                if (!card) {
                    resolve({success: false, status: 200, message: null});
                    return;
                }
                // `htmlDescription` is overwritten by `sanitizeCard` anyway
                const EDITABLE_ATTRIBUTES = new Set([
                    "title", "rawDescription", "urgency", "isPublic", 
                    "htmlDescription"
                ]);
                Object.keys(incomingCard).forEach((key) => {
                    if (EDITABLE_ATTRIBUTES.has(key)) {
                        // @ts-ignore EDITABLE_ATTRIBUTES is a safe list
                        card[key] = incomingCard[key];
                    }
                });
                return card.save();
            })
            .then((card: FlashCard) => {
                if (!incomingCard.tags) {
                    resolve({ success: true, status: 200, message: card });
                    return;
                }
                return setTagsToCard(card, incomingCard.tags);
            })
            .then((card: FlashCard) => {
                resolve({ success: true, status: 200, message: card });
            })
            .catch((err: Error) => { reject(err); });
    });
};

/**
 * @description Search for cards with associated key words. Search should be 
 * relevant and fast, erring on the side of relevance.
 * 
 * @todo We no longer have the `textScore` relevance sorting from MongoDB. We
 * might need to build a searchable index ourselves. For now, we'll have string
 * matching.
 * 
 * @returns If successful the `message` attribute holds a list of partial cards,  
 * i.e. each card object only has `id`, `urgency` and `title` attributes.
 */
export function search(
    payload: Pick<ISearchQuery, "queryString" | "ownerId" | "limit">): 
    Promise<IBaseMessage> {
    
    payload = sanitizeQuery(payload);
    let queryObject = {
        ownerId: payload.ownerId,
        rawDescription: {
            [Op.substring]: payload.queryString
        },
        attributes: ["title", "tags", "urgency"],
        limit: payload.limit
    };
    return collectMatchingCards(queryObject);
};

/**
 * @description Search the database for cards matching the specified schema. 
 * Return the results to the callback function that was passed in.
 * 
 * @returns {Promise} If `success` is set, then the `message` attribute will be 
 * an array of matching cards.
 */
let collectMatchingCards = function(queryObject: FindOptions): Promise<IBaseMessage> {
    return new Promise(function(resolve, reject) {
        FlashCard
            .findAll(queryObject)
            .then((cards: FlashCard[]) => {
                resolve({success: true, status: 200, message: cards});
            })
            .catch((err: Error) => { reject(err); });
    });
}

/**
 * @description Find cards that satisfy the given criteria and are publicly 
 * viewable.
 * 
 * @param payload Supported keys include:
 *  - `ownerId`: The ID of the owner of the cards
 *  - `cardIds`: An array of card IDs
 *  - `queryString`: The keywords to look for in card descriptions
 *  - `creationStartDate`: The earliest date by which the cards were created
 *  - `creationEndDate`: The latest date for which the cards were created
 * 
 * @returns {Promise} If `success` is set, then the `message` attribute will 
 * be an array of matching cards.
 */
export function publicSearch(payload: Partial<ISearchQuery>): Promise<IBaseMessage> {
    payload = sanitizeQuery(payload);

    let query: {[s: string]: any} = {
        isPublic: true
    };

    if (payload.ownerId) query.ownerId = payload.ownerId;
    if (payload.cardIds) query.id = {[Op.in]: payload.cardIds};
    if (payload.queryString) {
        query.rawDescription = { [Op.substring]: payload.queryString };
    }
    if (payload.creationStartDate || payload.creationEndDate) {
        if (payload.creationStartDate && !payload.creationEndDate) {
            query.createdAt = {
                [Op.gt]: payload.creationStartDate
            };
        } else if (!payload.creationStartDate && payload.creationEndDate) {
            query.createdAt = {
                [Op.lt]: payload.creationEndDate
            };
        } else {
            query.createdAt = {
                [Op.gt]: payload.creationStartDate,
                [Op.lt]: payload.creationEndDate
            };
        }
    }

    query.limit = payload.limit;
    query.attributes = ["title", "tags"];
    return collectMatchingCards(query);
}

/**
 * @description Read a card as a `public` user, e.g. from the `browse` page
 * 
 * @returns {Promise} If `success` is set, then the `message` attribute will 
 * contain a single-element array containing the matching card if any.
 */
export function readPublicCard(payload: Pick<ISearchQuery, "cardId">): 
    Promise<IBaseMessage> {
    
    payload = sanitizeQuery(payload);
    return new Promise(function(resolve, reject) {
        if (payload.cardId === undefined) {
            resolve({
                success: false, status: 400, 
                message: "The request is missing the 'cardId' field"
            });
        } else {
            FlashCard
                .findOne({
                    where: {isPublic: true, id: payload.cardId}
                })
                .then((matchingCard: FlashCard) => {
                    resolve({
                        success: true, status: 200, message: [matchingCard]
                    });
                })
                .catch((err: Error) => { reject(err); });
        }
        
    });
}

/**
 * @description Create a copy of the referenced card and add it to the user's 
 * collection.
 * 
 * @returns {Promise} If successful, `message` will contain the saved card.
 */
export function duplicateCard(
    payload: Pick<ISearchQuery, "cardId" | "userId" | "isPublic">): 
    Promise<IBaseMessage> {
    
    return new Promise(function(resolve, reject) {
        let queryObject = sanitizeQuery({ _id: payload.cardId, isPublic: true });
        FlashCard
            .findOne({where: queryObject})
            .then(async (preExistingCard: FlashCard) => { 
                if (preExistingCard === null) {
                    resolve({
                        success: false, status: 200, 
                        message: "The card to be copied was not found on the server."
                    });
                    return;
                }

                let res = await create({
                    title: preExistingCard.title,
                    rawDescription: preExistingCard.rawDescription,
                    tags: preExistingCard.getTags(),
                    isPublic: payload.isPublic,
                    ownerId: payload.userId,
                    urgency: 10, /** See FlashCard.init */
                    parentId: preExistingCard.id,
                });
                let dupeCard: FlashCard = res.message;
                preExistingCard.addChildren(dupeCard);

                await preExistingCard.save();
                resolve({
                    success: true, status: 200, message: dupeCard
                });     
            })
            .catch((err: Error) => { reject(err); })
    });
        
};

/**
 * @description With public cards, it's possible that some malicious users may 
 * upload objectionable cards. While we don't delete users' cards against their 
 * will, we don't have an obligation to help them share such cards. When a card 
 * gets flagged as inappropriate, it is excluded from search results in the 
 * `/browse` page. We increase the counter of the specified file. This allows 
 * moderators to deal with the most flagged cards first. 
 * 
 * @param payload The `cardID` must be set. `markedForReview` and 
 * `markedAsDuplicate` are optional. If set, they should be booleans.
 * 
 * @returns {Promise} If successful, `message` will be a confirmation string.
 */
export function flagCard(
    payload: Partial<Pick<ISearchQuery, "cardId" | "markedForReview" | "markedAsDuplicate" >>):
    Promise<IBaseMessage> {
    payload = sanitizeQuery(payload);
    let colsToIncrement: string[] = [];
    if (payload.markedForReview) {
        colsToIncrement.push("numTimesFlaggedForReview");
    }
    if (payload.markedAsDuplicate) {
        colsToIncrement.push("numTimesFlaggedAsDuplicate");
    }

    return new Promise(function(resolve, reject) {
        FlashCard
            // @ts-ignore This example is in the docs
            .increment(colsToIncrement, { by: 1, where: {id: payload.cardId, isPublic: true }})
            .then((_: any) => {
                resolve({
                    status: 200, success: true, message: `Card flagged successfully!`
                });
            })
            .catch((err: Error) => { reject(err); });
    });
}

/**
 * @description Fetch the tags contained in the associated users cards.
 * 
 * @returns {Promise} If successful, `message` will contain an array of arrays. 
 * Each inner array will have tags that were found on a same card.
 */
export function getTagGroupings(payload: Pick<ISearchQuery, "userId">):
        Promise<IBaseMessage> {
    payload = sanitizeQuery(payload);
    return new Promise(function(resolve, reject) {
        FlashCard
            .findAll({where: { ownerId: payload.userId }})
            .then((cards: FlashCard[]) => {
                let tagsArray = [];
                for (let i = 0; i < cards.length; i++) {
                    tagsArray.push(cards[i].getTags());
                }
                resolve({
                    success: true, message: tagsArray, status: 200
                })
            })
            .catch((err: Error) => { reject(err); });
    });
}

/**
 * @description Set the 'in-trash' status of this card.
 * @param payload Identifier for the card.
 * @param trash Should the card be moved to the trash?
 * @returns If `success` is set, `message` contains the updated card.
 */
function setTrashedStatusOfCard(
    payload: Pick<ISearchQuery, "cardId" | "ownerId">, trash=true): 
        Promise<IBaseMessage> {
    payload = sanitizeQuery(payload);
    return new Promise(function(resolve, reject) {
        FlashCard
            .findOne({
                where: {id: payload.cardId, ownerId: payload.ownerId}
            })
            .then((card: FlashCard) => {
                if (!card) {
                    resolve({
                        success: false, status: 200, 
                        message: "The card wasn't found."
                    });
                    return;
                }
                card.trashedTimestamp = trash ? Date.now(): 0;
                return card.save();
            })
            .then((updatedCard: FlashCard) => {
                resolve({
                    success: true, status: 200, 
                    message: updatedCard
                });
            })
            .catch((err: Error) => { reject(err); });
    });
}

/**
 * @description Send the card matching `payload` to the trash. The trash is 
 * where cards that haven't been deleted permanently are tracked. We learned 
 * that we should never use a warning when we meant undo. 
 * {@link http://alistapart.com/article/neveruseawarning}.
 * 
 * Seems like a good design decision. Users who really want to delete a card 
 * might be unsatisifed, but I bet they're in the minority(?). Furthermore, 
 * they can permanently delete a card from the accounts page. Amazing how much 
 * fiddling goes in the backend, just to allow a user to delete and then save 
 * themselves 3 seconds later by hitting `Undo`.
 * 
 * @todo What happens when `cardId` gets scrubbed off by `sanitizeQuery`?
 */
export function trashCard(payload: Pick<ISearchQuery, "cardId" | "ownerId">):
        Promise<IBaseMessage> {
    payload = sanitizeQuery(payload);
    return setTrashedStatusOfCard(payload, true);
}

/**
 * @description Restore a card from the trash, back into the user's list of
 * currently active cards.
 * 
 * @todo Return the restored card instead of a confirmatory string.
 */
export function restoreCardFromTrash(
    payload: Pick<ISearchQuery, "cardId" | "ownerId">): 
    Promise<IBaseMessage> {
    payload = sanitizeQuery(payload);
    return setTrashedStatusOfCard(payload, false);
}

/**
 * @description Permanently delete a card from the user's trash.
 * 
 * @returns {Promise} resolves with a JSON keyed by `success`, `status` and  
 * `message`
 */
export function permanentlyDeleteCard(
    payload: Pick<ISearchQuery, "cardId" | "ownerId">): 
    Promise<IBaseMessage> {
    payload = sanitizeQuery(payload);

    return new Promise(function(resolve, reject) {
        FlashCard
            .destroy({
                where: {id: payload.cardId, ownerId: payload.ownerId}
            })
            .then((numDestroyed: number) => {
                resolve({
                    success: numDestroyed > 0 ? true: false, 
                    status: 200, message: numDestroyed
                });
            })
            .catch((err: Error) => { reject(err); });
    });
}