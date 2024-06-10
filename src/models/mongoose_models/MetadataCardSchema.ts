/**
 * @description A model for representing metadata in the database.
 *
 * @module
 */
import { Document, model, Schema } from "mongoose";

export interface IStreak extends Map<string, any> {
  cardIDs: Array<string>;
  length: number;
  dailyTarget: number;
  timeStamp: number;
}

interface IMetadataNodeInformationEntry {
  [id: string]: { urgency: number };
}

export interface IMetadataNodeInformation {
  [tag: string]: IMetadataNodeInformationEntry;
}

export interface IMetadataTrashedCardInformation {
  [id: string]: number;
}

export interface IMetadataRaw {
  createdById: number;
  metadataIndex: number;
  node_information: Array<IMetadataNodeInformation>;
  trashed_cards: Array<IMetadataTrashedCardInformation>;
  stats: Array<any>;
  streak: IStreak;
  cardsAreByDefaultPrivate: boolean;
}

// Using SchemaTypes.Mixed produces unreliable write results
// It's better to include the dictionary in an array.

const metadataSchema = new Schema<IMetadataRaw>(
  {
    createdById: { type: Number, immutable: true },
    metadataIndex: { type: Number, immutable: true },
    node_information: Array,
    trashed_cards: Array,
    stats: Array,
    streak: {
      type: Map,
      default: {
        cardIDs: [],
        length: 0,
        dailyTarget: 25,
        timeStamp: Date.now,
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

export const Metadata = model<IMetadataRaw>("Metadata", metadataSchema);
export type IMetadata = IMetadataRaw & Document<any, any, IMetadataRaw>;
