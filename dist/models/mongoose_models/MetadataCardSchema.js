"use strict";
/**
 * @description A model for representing metadata in the database. The metadata
 * is a summary of the user's cards. With it, we can answer questions such as
 * 'what range of urgencies does the user use?', 'how many tags do they use?',
 * 'which cards have X tag?', etc, without having to examine all the cards that
 * they own.
 *
 * Such questions are asked frequently through the application. We decided to
 * have a database object that can efficiently answer those questions. This
 * comes with a few costs, e.g. data duplication and extra database saves to
 * update the metadata when the user updates a card.
 *
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
;
/** The database schema used for metadata documents. */
exports.MetadataSchema = new mongoose.Schema({
    createdById: Number,
    metadataIndex: Number,
    // Using SchemaTypes.Mixed produces unreliable write results
    // It's better to include the dictionary in an array.
    node_information: Array,
    trashed_cards: Array,
    stats: Array,
    streak: {
        type: Map,
        default: {
            cardIDs: [], length: 0, dailyTarget: 25, timeStamp: Date.now
        }
    },
    cardsAreByDefaultPrivate: { type: Boolean, default: true }
}, {
    timestamps: true,
    autoIndex: true,
    collection: "c13u_study_buddy_metadata",
    strict: true
});
var Metadata = mongoose.model('Metadata', exports.MetadataSchema);
exports.Metadata = Metadata;
//# sourceMappingURL=MetadataCardSchema.js.map