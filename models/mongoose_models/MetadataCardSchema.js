/**
 * @description A model for representing metadata in the database.
 * 
 * @module
 */

var mongoose = require('mongoose');

// Using SchemaTypes.Mixed produces unreliable write results
// It's better to include the dictionary in an array.

var metadataSchema = new mongoose.Schema(
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

module.exports = mongoose.model('Metadata', metadataSchema);