"use strict";

/**
 * Handle card-related activities, e.g. CRUD operations.
 *
 * @module
 */

import { FilterQuery, SortOrder } from "mongoose";
import * as MetadataDB from "./MetadataMongoDB";
import { Card, ICard, ICardDocument } from "./mongoose_models/CardSchema";
import { sanitizeCard, sanitizeQuery } from "./SanitizationAndValidation";

export type CreateCardParams = Pick<
  ICard,
  | "title"
  | "description"
  | "tags"
  | "createdById"
  | "urgency"
  | "isPublic"
  | "parent"
>;

/**
 * Create a new card from `payload` and add it to the user's current cards.
 *
 * @returns {Promise} takes a JSON object with `success`, `status` and `message`
 * as its keys. If successful, the message will contain the saved card.
 */
export async function create(unsavedCard: CreateCardParams): Promise<ICard> {
  const card = await Card.create(sanitizeCard(unsavedCard));
  return Promise.all([
    MetadataDB.update([{ card, previousTags: "" }]),
    MetadataDB.updatePublicUserMetadata([{ card, previousTags: "" }]),
  ]).then(() => card);
}

/**
 * Create multiple cards at once.
 *
 * @param {Array} unsavedCards An array of JSON objects keyed by `title`,
 * `description`, `tags`, `createdById`, `urgency`, `isPublic` and `parent`.
 *
 * @returns {Promise} takes a JSON object with `success`, `status` and `message`
 * as its keys. If successful, the message will be an array of the saved cards' IDs
 */
export async function createMany(
  unsavedCards: CreateCardParams[],
): Promise<Partial<ICard>[]> {
  const sanitizedCards = unsavedCards.map((card) => sanitizeCard(card));
  const cards = await Card.insertMany(sanitizedCards);
  await MetadataDB.update(
    cards.map((
      card,
    ) => ({ card, previousTags: "" } as MetadataDB.SavedCardParams)),
  );
  await MetadataDB.updatePublicUserMetadata(
    cards.map((
      card,
    ) => ({ card, previousTags: "" } as MetadataDB.SavedCardParams)),
  );
  return cards;
}

export interface ReadCardParams {
  userIDInApp: number;
  cardID?: string;
}

/**
 * Read cards from the database that match `payload`.
 *
 * @param {JSON} payload Must contain `userIDInApp` as one of the keys.
 * If `_id` is not one of the keys, fetch all the user's cards.
 *
 * @param {String} projection The fields to return. Defaults to
 * `title description descriptionHTML tags urgency createdById isPublic`.
 *
 * @returns {Promise} resolves with an array of all matching cards.
 */
export function read(
  payload: ReadCardParams,
  projection =
    "title description descriptionHTML tags urgency createdById isPublic",
): Promise<ICard | null> {
  payload = sanitizeQuery(payload);
  const query: FilterQuery<ICard> = { createdById: payload.userIDInApp };
  if (payload.cardID) { query._id = payload.cardID; }
  return Card.findOne(query).select(projection).exec();
}

/**
 * Update an existing card. Some fields of the card are treated as constants,
 * e.g. `createdById` and `createdAt`
 *
 * @returns {Promise} resolves with the updated card.
 */
export async function update(payload: Partial<ICard>): Promise<ICard> {
  payload = sanitizeCard(payload);
  const oldCard = await Card.findByIdAndUpdate(
    payload._id,
    payload,
    { returnOriginal: true, runValidators: true },
  ).exec();
  if (oldCard === null) {
    return Promise.reject("Card not found.");
  }

  const newCard = await Card.findById(oldCard._id).exec();
  if (newCard === null) {
    return Promise.reject("Card not found.");
  }

  if (newCard.tags === oldCard.tags && newCard.urgency === oldCard.urgency) {
    return Promise.resolve(newCard);
  }

  return Promise.all([
    MetadataDB.update([{ card: newCard, previousTags: oldCard.tags }]),
    MetadataDB.updatePublicUserMetadata([{
      card: newCard,
      previousTags: oldCard.tags,
    }]),
  ]).then(() => newCard as ICard);
}

export interface SearchCardParams {
  queryString: string;
  limit: number;
  creationStartDate?: Date;
  creationEndDate?: Date;
  // TODO: Change this to Array<Pick<ICard, "_id">>?
  cardIDs?: string;
}

interface ServerAddedSearchCardParams {
  createdById?: number;
  isPublic?: boolean;
}

interface SortCriteria {
  [key: string]: SortOrder | { $meta: "textScore" };
}

interface CardQuery {
  filter: FilterQuery<ICard>;
  projection: string;
  limit: number;
  sortCriteria: SortCriteria;
}

const kCardsSearchProjection = "title tags urgency";
type CardsSearchResult = Pick<ICard, "_id" | "title" | "tags" | "urgency">;

/**
 * @description Search for cards with associated key words. Search should be
 * relevant and fast, erring on the side of relevance. Studying the docs helps
 * one make efficient queries and capture some low-hanging fruit. For instance,
 * using `where(some_js_expression)` in MongoDB is expensive because
 * `some_js_expression` will be evaluated for every document in the collection.
 * ~~Using regex inside the query itself is more efficient.~~ MongoDB supports
 * [text search]{@link https://docs.mongodb.com/v3.2/text-search/} and a 'sort
 * by relevance' function.
 *
 * @param {JSON} payload Expected keys: `key_words`, `createdById`
 * @returns {Promise} resolves with a JSON with `success`, `status` and `message`
 * as keys. If successful `message` will contain abbreviated cards that only
 * the `id`, `urgency` and `title` fields.
 */
export function search(
  payload: SearchCardParams,
  createdById: number,
): Promise<CardsSearchResult[]> {
  /**
   * $expr is faster than $where because it does not execute JavaScript
   * and should be preferred where possible. Note that the JS expression
   * is processed for EACH document in the collection. Yikes!
   */
  return collectSearchResults(
    computeInternalQueryFromClientQuery(
      sanitizeQuery(payload),
      { createdById },
    ),
  );
}

/**
 * @description Append a copy of the hyphenated/underscored words in the incoming
 * string without the hyphens/underscores. Useful for pre-processing search
 * queries. A person searching for `dynamic_programming` should be interested in
 * `dynamic programming` as well.
 *
 * @param {String} s a string that may contain hyphenated/underscored words, e.g
 * `arrays dynamic_programming iterative-algorithms`.
 *
 * @returns {String} a string with extra space delimited words, e.g.
 * `arrays dynamic_programming iterative-algorithms dynamic programming iterative algorithms`
 */
const splitTags = function(s: string): string {
  const possibleTags = s.match(/[\w|\d]+(\_|-){1}[\w|\d]+/g);
  if (possibleTags === null) { return s; }

  for (let i = 0; i < possibleTags.length; i++) {
    s += " " + possibleTags[i].split(/[\_-]/g).join(" ");
  }
  return s;
};

function computeInternalQueryFromClientQuery(
  clientQuery: SearchCardParams,
  serverAddedParams: ServerAddedSearchCardParams,
): CardQuery {
  const mandatoryFields: FilterQuery<ICard>[] = [];
  if (clientQuery.queryString) {
    mandatoryFields.push({
      $text: { $search: splitTags(clientQuery.queryString) },
    });
  }
  if (serverAddedParams.createdById) {
    mandatoryFields.push({ createdById: serverAddedParams.createdById });
  }

  if (serverAddedParams.isPublic) {
    mandatoryFields.push({ isPublic: serverAddedParams.isPublic });
  }

  if (clientQuery.cardIDs) {
    mandatoryFields.push({
      _id: { $in: Array.from(clientQuery.cardIDs.split(",")) },
    });
  }

  if (clientQuery.creationStartDate || clientQuery.creationEndDate) {
    const dateQuery: { $gt?: Date; $lt?: Date } = {};
    if (clientQuery.creationStartDate) {
      dateQuery["$gt"] = clientQuery.creationStartDate;
    }
    if (clientQuery.creationEndDate) {
      dateQuery["$lt"] = clientQuery.creationEndDate;
    }
    mandatoryFields.push({ createdAt: dateQuery });
  }

  const sortCriteria: SortCriteria = clientQuery.queryString
    ? { score: { $meta: "textScore" } }
    : {};

  return {
    filter: { $and: mandatoryFields },
    projection: kCardsSearchProjection,
    limit: clientQuery.limit || 100,
    sortCriteria: sortCriteria,
  };
}

/**
 * @description Search the database for cards matching the specified schema.
 * Return the results to the callback function that was passed in.
 *
 * @returns {Promise} resolves with a JSON object. If `success` is set, then
 * the `message` attribute will be an array of matching cards.
 */
const collectSearchResults = function(
  queryObject: CardQuery,
): Promise<CardsSearchResult[]> {
  return Card.find(queryObject.filter, kCardsSearchProjection)
    .sort(queryObject.sortCriteria)
    .limit(queryObject.limit)
    .exec();
};

/**
 * @description Find cards that satisfy the given criteria and are publicly
 * viewable.
 *
 * @param {JSON} `payload` Supported keys include:
 *  - `userID`: The ID of the creator of the cards
 *  - `cardIDs`: A string of card IDs separated by a `,` without spaces
 *  - `cardID`: The ID of a single card. The same effect can be achieved with `cardIDs`
 *  - `queryString`: The keywords to look for. They are interpreted as tags
 *  - `creationStartDate`: The earliest date by which the cards were created
 *  - `creationEndDate`: The latest date for which the cards were created
 *
 * @returns {Promise} resolves with a JSON object. If `success` is set, then
 * the `message` attribute will be an array of matching cards.
 */
export function publicSearch(
  payload: SearchCardParams,
): Promise<CardsSearchResult[]> {
  return collectSearchResults(
    computeInternalQueryFromClientQuery(
      sanitizeQuery(payload),
      { isPublic: true },
    ),
  );
}

export type ReadPublicCardParams = Omit<ReadCardParams, "userIDInApp">;

/**
 * @description Read a card that has been set to 'public'
 * @param {JSON} payload The `card_id` property should be set to a valid ID
 * @returns {Promise} resolves with a JSON object. If `success` is set, then
 * the `message` attribute will contain a single-element array containing the
 * matching card if any.
 */
export function readPublicCard(
  payload: ReadPublicCardParams,
): Promise<ICard | null> {
  return _readPublicCard(payload);
}

/**
 * Similar signature to `readPublicCard` but types the result to `ICard`. This
 * is necessary for other functions in this file that call this function.
 *
 * `readPublicCard` is a public function that is exposed to the client, and thus
 * the need for a safer return type. [1]
 *
 * [1]: https://github.com/trpc/trpc/discussions/3661
 */
function _readPublicCard(
  payload: ReadPublicCardParams,
): Promise<ICardDocument | null> {
  payload = sanitizeQuery(payload);
  if (payload.cardID === undefined) {
    return Promise.reject("cardID is undefined");
  }
  return Card.findOne({ isPublic: true, _id: payload.cardID }).exec();
}

export interface DuplicateCardParams {
  cardID: string;
  userIDInApp: number;
  cardsAreByDefaultPrivate: boolean;
}

/**
 * @description Create a copy of the referenced card and add it to the user's
 * collection
 *
 * @param {JSON} payload The `cardID` and `userIDInApp` and
 * `cardsAreByDefaultPrivate` attributes should be set appropriately.
 *
 * @returns {Promise} takes a JSON object with `success`, `status` and `message`
 * as its keys. If successful, the message will contain the saved card. This
 * response is the same as that of `CardsMongoDB.create(payload)`.
 */
export async function duplicateCard(
  payload: DuplicateCardParams,
): Promise<ICard> {
  payload = sanitizeQuery(payload);
  const originalCard = await _readPublicCard({ cardID: payload.cardID });
  if (originalCard === null) {
    return Promise.reject("Card not found!");
  }

  const idsOfUsersWithCopy = new Set(
    originalCard.idsOfUsersWithCopy.split(", "),
  );
  idsOfUsersWithCopy.add(payload.userIDInApp.toString());
  originalCard.idsOfUsersWithCopy = Array.from(idsOfUsersWithCopy).join(", ");
  await originalCard.save();

  return create({
    title: originalCard.title,
    description: originalCard.description,
    tags: originalCard.tags,
    parent: originalCard._id,
    createdById: payload.userIDInApp,
    isPublic: payload.cardsAreByDefaultPrivate,
    urgency: 10,
  });
}

export interface FlagCardParams {
  cardID: string;
  markedForReview?: boolean;
  markedAsDuplicate?: boolean;
}

/**
 * @description With public cards, it's possible that some malicious users may
 * upload objectionable cards. While we don't delete users' cards against their
 * will, we don't have an obligation to help them share such cards. When a card
 * gets flagged as inappropriate, it is excluded from search results in the
 * `/browse` page. We increase the counter of the specified file. This allows
 * moderators to deal with the most flagged cards first.
 *
 * @param {JSON} payload The `cardID` must be set. `markedForReview` and
 * `markedAsDuplicate` are optional. If set, they should be booleans.
 *
 * @returns {Promise} takes a JSON object with `success`, `status` and `message`
 * as its keys. If successful, the message will contain the saved card.
 */
export async function flagCard(payload: FlagCardParams): Promise<ICard> {
  payload = sanitizeQuery(payload);
  const flagsToUpdate: Partial<
    Pick<ICard, "numTimesMarkedAsDuplicate" | "numTimesMarkedForReview">
  > = {};
  if (payload.markedForReview) { flagsToUpdate.numTimesMarkedForReview = 1; }
  if (payload.markedAsDuplicate) { flagsToUpdate.numTimesMarkedAsDuplicate =
      1; }

  const card = await Card
    .findOneAndUpdate({ _id: payload.cardID }, { $inc: flagsToUpdate }, {
      returnDocument: "after",
    })
    .exec();
  if (card === null) {
    return Promise.reject("Card not found!");
  }
  return card;
}

export type TagGroupingsParam = Pick<ReadCardParams, "userIDInApp">;
export type TagGroupings = string[][];

/**
 * @description Fetch the tags contained in the associated users cards.
 *
 * @param {JSON} payload Must contain `userIDInApp` as one of the keys.
 *
 * @returns {Promise} takes a JSON object with `success`, `status` and `message`
 * as its keys. If successful, the message will contain an array of arrays. Each
 * inner array will have tags that were found on a same card.
 */
export function getTagGroupings(
  payload: TagGroupingsParam,
): Promise<TagGroupings> {
  payload = sanitizeQuery(payload);
  return Card
    .find({ createdById: payload.userIDInApp })
    .select("tags").exec()
    .then((cards) => {
      const tagsArray = [];
      for (let i = 0; i < cards.length; i++) {
        tagsArray.push(cards[i].tags.split(" "));
      }
      return tagsArray;
    });
}
