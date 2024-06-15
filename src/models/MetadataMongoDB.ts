"use strict";

/**
 * Handle actions related to the metadata of the cards in the database.
 *
 * @module
 */

import * as fs from "fs/promises";

import { DeleteResult } from "mongodb";
import { FilterQuery } from "mongoose";
import { PUBLIC_USER_USERNAME } from "../config";
import { Card, ICard, ICardDocument } from "./mongoose_models/CardSchema";
import {
  IMetadata,
  IMetadataDocument,
  IStreak,
  Metadata,
} from "./mongoose_models/MetadataCardSchema";
import { IUser, User } from "./mongoose_models/UserSchema";
import { sanitizeQuery } from "./SanitizationAndValidation";

type MetadataCreateParams =
  & Pick<IMetadata, "metadataIndex">
  & Pick<IUser, "userIDInApp">;

/**
 * @description Create & save a new metadata document for a user
 * @param {JSON} payload Must contain `userIDInApp` and `metadataIndex` as keys
 * @return {Promise} resolves with a JSON object with `success`, `status` and
 * `message` as keys.
 */
export async function create(
  payload: MetadataCreateParams,
): Promise<IMetadata> {
  payload = sanitizeQuery(payload);

  const preExistingMetadata = await Metadata.findOne({
    createdById: payload.userIDInApp,
    metadataIndex: payload.metadataIndex,
  }).exec();
  if (preExistingMetadata) {
    return Promise.reject("Metadata already exists");
  }

  return Metadata.create({
    createdById: payload.userIDInApp,
    metadataIndex: payload.metadataIndex,
    stats: [],
    node_information: [],
  });
}

/**
 * @description Read all the metadata associated with a user's cards.
 */
export function read(
  payload: Pick<IUser, "userIDInApp">,
): Promise<IMetadata[]> {
  return _readInternal(payload);
}

function _readInternal(
  payload: Pick<IUser, "userIDInApp">,
): Promise<IMetadataDocument[]> {
  payload = sanitizeQuery(payload);
  return Metadata.find({ createdById: payload.userIDInApp }).exec();
}

type SortableCardAttribute = "urgency" | "numChildren";

export type SavedCardParams = {
  card: ICardDocument;
  previousTags: string;
};

/**
 * Update the metadata with the new cards' details. This method
 * is usually called by CardsMongoDB.update(). An array is needed to prevent
 * race conditions when updating metadata from more than one card.
 *
 * @param {Array} savedCards Array of cards
 *
 * @param {JSON} metadataQuery An identifier for the metadata document. This
 * argument was added in order to update the global public user account. If not
 * specified, it defaults to the owner of the first card in `savedCards`.
 *
 * @param {String} attributeName A sortable attribute of the card that will be
 * used to rank the cards in the metadata. Possible values include `urgency`,
 * `numChildren`.
 *
 * @returns {Promise} resolves with a JSON with `success`, `status` and
 * `message` as keys. If successful, `message` has a metadata JSON object.
 */
export async function update(
  savedCards: SavedCardParams[],
  metadataQuery: FilterQuery<IMetadata> | null = null,
  attributeName: SortableCardAttribute = "urgency",
): Promise<IMetadataDocument> {
  /*
   * How many cards before we need a new metadata JSON?
   * (400 + 150 * num_id_metadata) * 5 bytes/char <= 16MB
   * num_id_metadata <= 21330. So let's say 15,000 cards max
   * Will that ever happen, probably not!
   */
  if (savedCards[0].card.metadataIndex === undefined) {
    savedCards[0].card.metadataIndex = 0;
  }

  if (metadataQuery === null) {
    metadataQuery = {
      createdById: savedCards[0].card.createdById,
      metadataIndex: savedCards[0].card.metadataIndex,
    };
  }

  const metadataDoc = await Metadata.findOne(metadataQuery).exec();
  if (metadataDoc === null) {
    return Promise.reject("Could not find metadata document");
  }

  savedCards.forEach(async (savedCard) => {
    await updateMetadataWithCardDetails(
      savedCard.card,
      metadataDoc,
      savedCard.previousTags,
      attributeName,
    );
  });
  metadataDoc.markModified("stats");
  metadataDoc.markModified("node_information");
  await metadataDoc.save();

  return metadataDoc;
}

/**
 * @description Update the metadata for a public card.
 *
 * @param {Array} cards an array of JSON flashcards
 *
 * @returns {Promise} resolves with a JSON with `success`, `status` and
 * `message` as keys. If successful, `message` has a metadata JSON object.
 */
export async function updatePublicUserMetadata(
  cards: SavedCardParams[],
): Promise<IMetadata> {
  const cardsToAdd = cards.filter(savedCard => savedCard.card.isPublic);
  const cardsToRemove = cards.filter(savedCard => !savedCard.card.isPublic);

  const user = await User.findOne({ username: PUBLIC_USER_USERNAME }).exec();
  if (!user) {
    return Promise.reject("Could not find public user");
  }

  const metadataDoc = cardsToAdd.length > 0
    ? await update(cardsToAdd, {
      createdById: user.userIDInApp,
      metadataIndex: 0,
    }, "numChildren")
    : (await _readInternal({ userIDInApp: user.userIDInApp }))[0];

  // TODO(dchege711): This shouldn't happen. Investigate why it does.
  const metadataStats = metadataDoc.stats.length > 0
    ? metadataDoc.stats[0]
    : {};
  const metadataNodeInfo = metadataDoc.node_information.length > 0
    ? metadataDoc.node_information[0]
    : {};

  for (const savedCard of cardsToRemove) {
    const cardID = savedCard.card._id;
    // Remove the card from the lists that the user previews from.
    savedCard.card.tags.split(" ").forEach(tagToRemove => {
      tagToRemove = tagToRemove.trim();
      if (tagToRemove !== "" && metadataNodeInfo[tagToRemove]) {
        delete metadataNodeInfo[tagToRemove][cardID];
        if (Object.keys(metadataNodeInfo[tagToRemove]).length === 0) {
          delete metadataNodeInfo[tagToRemove];
        }
      }
    });
    delete metadataStats[cardID];
  }

  metadataDoc.markModified("stats");
  metadataDoc.markModified("node_information");
  // await metadataDoc.save();

  return metadataDoc;
}

/**
 * @description Delete all the metadata associated with the user.
 * @param {JSON} payload Contains `userIDInApp` as a key
 * @returns {Promise} resolves with a JSON object keyed by `success`, `status`
 * and `message`
 */
export function deleteAllMetadata(
  payload: Pick<IUser, "userIDInApp">,
): Promise<DeleteResult> {
  payload = sanitizeQuery(payload);
  return Metadata.deleteMany({ createdById: payload.userIDInApp }).exec();
}

export type SendCardToTrashParams = Pick<ICard, "_id" | "createdById">;

/**
 * @param {JSON} payload Must contain `cardID` that has the id of the card
 * to be placed into trash, and `userIDInApp`, the ID of the user who owns
 * the card.
 * @returns {Promise} resolves with a JSON keyed by `success`, `status` and
 * `message`
 */
export async function sendCardToTrash(
  payload: SendCardToTrashParams,
): Promise<string> {
  payload = sanitizeQuery(payload);

  const card = await Card.findOne({
    _id: payload._id,
    createdById: payload.createdById,
  }).exec();
  if (!card) {
    return Promise.reject("Could not find card");
  }

  if (!card.metadataIndex) {
    card.metadataIndex = 0;
    await card.save();
  }

  const metadataDoc = await Metadata.findOne({
    createdById: card.createdById,
    metadataIndex: card.metadataIndex,
  }).exec();
  if (!metadataDoc) {
    return Promise.reject("Could not find metadata document");
  }

  const metadataStats = metadataDoc.stats[0];
  const metadataNodeInfo = metadataDoc.node_information[0];
  const trashedCardID = card._id;

  // Remove the card from the lists that the user previews from
  card.tags.split(" ").forEach(tagToRemove => {
    tagToRemove = tagToRemove.trim();
    if (tagToRemove !== "") {
      delete metadataNodeInfo[tagToRemove][trashedCardID.toString()];
      if (Object.keys(metadataNodeInfo[tagToRemove]).length === 0) {
        delete metadataNodeInfo[tagToRemove];
      }
    }
  });
  delete metadataStats[trashedCardID.toString()];

  // Add the card to the trashed items associated with the user
  // Associate the deletion time so that we can have a clean up
  // of all cards in the trash that are older than 30 days
  if (!metadataDoc.trashed_cards || metadataDoc.trashed_cards.length == 0) {
    metadataDoc.trashed_cards = [];
    metadataDoc.trashed_cards.push({});
  }
  metadataDoc.trashed_cards[0][trashedCardID.toString()] = Date.now();

  // This is necessary. All that hair pulling can now stop :-/
  metadataDoc.markModified("stats");
  metadataDoc.markModified("node_information");
  metadataDoc.markModified("trashed_cards");

  // await metadataDoc.save();

  return `Card moved to the trash. <span class="underline_bold_text clickable" onclick="restoreCardFromTrash('${card._id}', '${card.urgency}')">Undo Action</span>`;
}

export type RestoreCardFromTrashParams = SendCardToTrashParams;

/**
 * @description Restore a card from the trash, back into the user's list of
 * current cards.
 * @param {JSON} restoreCardArgs Expected keys: `cardID`, `createdById`
 * @returns {Promise} resolves with a JSON keyed by `success`, `status` and
 * `message`
 */
export async function restoreCardFromTrash(
  restoreCardArgs: RestoreCardFromTrashParams,
): Promise<string> {
  restoreCardArgs = sanitizeQuery(restoreCardArgs);

  const card = await Card.findOne({
    _id: restoreCardArgs._id,
    createdById: restoreCardArgs.createdById,
  }).exec();
  if (!card) {
    return Promise.reject("Card wasn't found");
  }

  let metadataDoc = await removeCardFromMetadataTrash(card);
  metadataDoc = await updateMetadataWithCardDetails(
    card,
    metadataDoc,
    card.tags,
    "urgency",
  );
  // await metadataDoc.save();

  return `${card.title} has been restored!`;
}

type DeleteCardFromTrashParams = SendCardToTrashParams;

/**
 * @description Permanently delete a card from the user's trash.
 *
 * @param {JSON} restoreCardArgs Expected keys: `cardID`, `createdById`
 * @returns {Promise} resolves with a JSON keyed by `success`, `status` and
 * `message`
 */
export async function deleteCardFromTrash(
  deleteCardArgs: DeleteCardFromTrashParams,
): Promise<string> {
  deleteCardArgs = sanitizeQuery(deleteCardArgs);

  const card = await Card.findOneAndDelete({
    _id: deleteCardArgs._id,
    createdById: deleteCardArgs.createdById,
  }).exec();
  if (!card) {
    return Promise.reject("Card wasn't found");
  }

  const metadataDoc = await removeCardFromMetadataTrash(card);
  // await metadataDoc.save();

  return `${card.title} has been permanently deleted!`;
}

/**
 * @description Remove the card from the trash records of the metadata object.
 * This method does not save the modified metadata into the database!
 *
 * @param {JSON} cardIdentifier JSON object that contains the keys
 * `createdById` and `_id`.
 *
 * @returns {Promise} resolves with the modified metadata document. It is up to
 * the callee to persist the saved metadata in the database.
 */
async function removeCardFromMetadataTrash(
  cardIdentifier: Pick<ICard, "_id" | "createdById" | "metadataIndex">,
): Promise<IMetadataDocument> {
  const metadataDoc = await Metadata.findOne({
    createdById: cardIdentifier.createdById,
    metadataIndex: cardIdentifier.metadataIndex,
  })
    .exec();
  if (!metadataDoc) {
    return Promise.reject("Metadata document wasn't found");
  }

  if (cardIdentifier._id in metadataDoc.trashed_cards[0]) {
    delete metadataDoc.trashed_cards[0][cardIdentifier._id];
    metadataDoc.markModified("trashed_cards");
    // await metadataDoc.save();
    return metadataDoc;
  } else {
    return Promise.reject("Card wasn't found in the trash");
  }
}

interface WriteCardsToJSONFileResult {
  jsonFilePath: string;
  jsonFileName: string;
}

/**
 * @description Fetch all the user's cards and compile them into a JSON file.
 *
 * @param {Number} userIDInApp The ID of the user whose cards should be exported
 * to a .json file.
 *
 * @returns {Promise} resolves with two string arguments. The first one is a path
 * to the written JSON file. The 2nd argument is the name of the JSON file.
 */
export async function writeCardsToJSONFile(
  userIDInApp: number,
): Promise<WriteCardsToJSONFileResult> {
  const query = sanitizeQuery({ userIDInApp: userIDInApp });
  const cards = await Card
    .find({ createdById: query.userIDInApp })
    .select("title description tags urgency createdAt isPublic")
    .exec();

  const jsonFileName = `flashcards_${userIDInApp}.json`;
  const jsonFilePath = `${process.cwd()}/${jsonFileName}`;

  const fileDescriptor = await fs.open(jsonFilePath, "w");
  await fs
    .writeFile(fileDescriptor, JSON.stringify(cards))
    .then(() => fileDescriptor.close());

  return { jsonFilePath, jsonFileName };
}

/**
 * @description Helper method for updating the metadata from a given card. This
 * method does not persist the modified metadata document into the database. It
 * is up to the callee to save the changes once they're done manipulating the
 * metadata.
 *
 * @param {JSON} savedCard The card that whose details should be added to the
 * metadata.
 * @param {JSON} metadataDoc A Mongoose Schema object that is used to store the
 * current user's metadata.
 * @param {String} attributeName The name of the attribute that should be used
 * to sort the metadata.
 * @returns {Promise} resolved with a reference to the modified metadata doc
 */
function updateMetadataWithCardDetails(
  savedCard: ICard,
  metadataDoc: IMetadataDocument,
  previousTags: string,
  attributeName: SortableCardAttribute,
): Promise<IMetadataDocument> {
  const sortableAttribute = attributeName === "numChildren"
    ? savedCard.idsOfUsersWithCopy.split(", ").length
    : savedCard[attributeName];

  if (metadataDoc.stats.length == 0) { metadataDoc.stats.push({}); }
  if (metadataDoc.node_information.length == 0) {
    metadataDoc.node_information.push({});
  }

  const metadataStats = metadataDoc.stats[0];
  const metadataNodeInfo = metadataDoc.node_information[0];

  // Save this card in the stats field where it only appears once
  if (metadataStats[savedCard._id] === undefined) {
    metadataStats[savedCard._id] = {};
  }
  metadataStats[savedCard._id].urgency = sortableAttribute;
  metadataDoc.markModified("stats");

  // TODO(dchege711): Keep track of which tags have been changed. Remove ones
  // that have been removed from the card.
  const currentTags = new Set(
    savedCard.tags.split(" ").map(s => s.trim()).filter(s => s.length > 0),
  );
  if (currentTags) {
    currentTags.forEach(tag => {
      // If we've not seen this tag before, create its node
      if (metadataNodeInfo[tag] === undefined) {
        metadataNodeInfo[tag] = {};
      }

      // If we've not seen this card under this tag, add it
      if (metadataNodeInfo[tag][savedCard._id] === undefined) {
        metadataNodeInfo[tag][savedCard._id] = {
          urgency: sortableAttribute,
        };
      } else {
        metadataNodeInfo[tag][savedCard._id].urgency = sortableAttribute;
      }
    });
  }

  // Get rid of all tags that were deleted in the current card
  const deletedTags = previousTags.split(" ")
    .map(s => s.trim())
    .filter(tag => tag.length > 0 && !currentTags.has(tag));
  deletedTags.forEach((tag) => {
    delete metadataNodeInfo[tag][savedCard._id];
    if (Object.keys(metadataNodeInfo[tag]).length === 0) {
      delete metadataNodeInfo[tag];
    }
  });

  metadataDoc.markModified("node_information");
  return Promise.resolve(metadataDoc);
}

export type UpdateUserSettingsParams = Pick<
  IUser,
  "cardsAreByDefaultPrivate" | "dailyTarget" | "userIDInApp"
>;

/**
 * @description Update the settings of the given user.
 * @param {JSON} newUserSettings Supported keys:
 * @returns {Promise} resolves with a JSON keyed by `success`, `status` and
 * `message`
 */
export async function updateUserSettings(
  newUserSettings: UpdateUserSettingsParams,
): Promise<IUser> {
  newUserSettings = sanitizeQuery(newUserSettings);

  const supportedChanges = new Set(["cardsAreByDefaultPrivate", "dailyTarget"]);
  const validChanges = Object.keys(newUserSettings).filter((setting) =>
    supportedChanges.has(setting)
  );

  if (validChanges.length == 0) {
    return Promise.reject(
      "No changes were made as there were no valid changes provided",
    );
  }

  const user = await User.findOne({
    userIDInApp: { $eq: newUserSettings.userIDInApp },
  }).exec();
  if (user === null) {
    return Promise.reject("No user found. User settings not updated!");
  }

  user.cardsAreByDefaultPrivate = newUserSettings.cardsAreByDefaultPrivate;
  user.dailyTarget = newUserSettings.dailyTarget;

  if (newUserSettings.dailyTarget) {
    const metadataDoc = await Metadata
      .findOne({ createdById: user.userIDInApp, metadataIndex: 0 }).exec();
    if (metadataDoc === null) {
      return Promise.reject("No metadata found. User settings not updated!");
    }
    metadataDoc.streak.dailyTarget = newUserSettings.dailyTarget;
    metadataDoc.markModified("streak");
    // await metadataDoc.save();
  }

  return user.save();
}

export type UpdateStreakParams =
  & Pick<IStreak, "cardIDs">
  & Pick<IUser, "userIDInApp">;

/**
 * @description Update the streak object for the current user. Assumes that the
 * streak object is up to date.
 *
 * @param {JSON} streakUpdateObj Expected properties: `userIDInApp`, `cardIDs`
 *
 * @returns {Object} the saved metadata object with the updated streak
 */
export function updateStreak(
  streakUpdateObj: UpdateStreakParams,
): Promise<IStreak> {
  streakUpdateObj = sanitizeQuery(streakUpdateObj);

  return Metadata
    .findOne({ createdById: streakUpdateObj.userIDInApp, metadataIndex: 0 })
    .exec()
    .then((metadataDoc) => {
      if (metadataDoc === null) {
        return Promise.reject("No metadata found. Streak not updated!");
      }

      const idsReviewedCards = new Set(metadataDoc.streak.cardIDs);
      for (const cardID of streakUpdateObj.cardIDs) {
        idsReviewedCards.add(cardID);
      }
      metadataDoc.streak.cardIDs = Array.from(idsReviewedCards);
      metadataDoc.markModified("streak");
      return metadataDoc.save();
    })
    .then((metadataDoc) => {
      return metadataDoc.streak;
    });
}

/**
 * Read metadata for the public user.
 */
export function readPublicMetadata(): Promise<IMetadata[]> {
  return User.findOne({ username: PUBLIC_USER_USERNAME })
    .then((publicUser) => {
      if (publicUser === null) {
        throw new Error("Public user not found");
      }

      return read({ userIDInApp: publicUser.userIDInApp });
    });
}
