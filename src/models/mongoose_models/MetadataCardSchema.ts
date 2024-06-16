/**
 * @description A model for representing metadata in the database.
 *
 * @module
 */
import { model, Schema } from "mongoose";

export interface IStreak {
  cardIDs: Array<string>;
  length: number;
  dailyTarget: number;
  timeStamp: number;
}

export type IStreakMap = IStreak & Map<string, Array<string> | number>;

interface IMetadataNodeInformationEntry {
  [id: string]: { urgency: number };
}

interface IMetadataNodeStatsEntry {
  [id: string]: { urgency?: number };
}

export interface IMetadataNodeInformation {
  [tag: string]: IMetadataNodeInformationEntry;
}

export interface IMetadataTrashedCardInformation {
  [id: string]: number;
}

export interface IMetadata {
  createdById: number;
  metadataIndex: number;
  node_information: Array<IMetadataNodeInformation>;
  trashed_cards: Array<IMetadataTrashedCardInformation>;
  stats: Array<IMetadataNodeStatsEntry>;
  streak: IStreak;
  cardsAreByDefaultPrivate: boolean;
}

// Using SchemaTypes.Mixed produces unreliable write results
// It's better to include the dictionary in an array.

const metadataSchema = new Schema<IMetadata>(
  {
    createdById: { type: Number, immutable: true },
    metadataIndex: { type: Number, immutable: true },
    node_information: Array,
    trashed_cards: Array,
    stats: Array,
    streak: {
      type: Map,
      default: {
        cardIDs: new Array<string>(),
        length: 0,
        dailyTarget: 25,
        timeStamp: Date.now(),
      },
    },
    cardsAreByDefaultPrivate: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    autoIndex: true,
    collection: "c13u_study_buddy_metadata",
    strict: true,
  },
);

export const Metadata = model<IMetadata>("Metadata", metadataSchema);
export type IMetadataDocument = ReturnType<(typeof Metadata)["hydrate"]>;
