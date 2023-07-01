/**
 * @description A model for representing metadata in the database.
 *
 * @module
 */
import { model, Schema, Document } from "mongoose";

export interface IStreak extends Map<string, any> {
    cardIDs: Array<number>;
    length: number;
    dailyTarget: number;
    timeStamp: number;
}

interface IMetadataRaw {
    createdById: number;
    metadataIndex: number;
    node_information: Array<any>;
    trashed_cards: Array<any>;
    stats: Array<any>;
    streak: IStreak;
    cardsAreByDefaultPrivate: boolean;
}

// Using SchemaTypes.Mixed produces unreliable write results
// It's better to include the dictionary in an array.

let metadataSchema = new Schema<IMetadataRaw>(
    {
        createdById: Number,
        metadataIndex: Number,
        node_information: Array,
        trashed_cards: Array,
        stats: Array,
        streak: {
            type: Map,
            default: {
                cardIDs: [], length: 0, dailyTarget: 25, timeStamp: Date.now
            }
        },
        cardsAreByDefaultPrivate: {type: Boolean, default: true}
    },
    {
        timestamps: true,
        autoIndex: true,
        collection: "c13u_study_buddy_metadata",
        strict: true
    }
);

export const Metadata = model<IMetadataRaw>('Metadata', metadataSchema);
export type IMetadata = IMetadataRaw & Document<any, any, IMetadataRaw>;
