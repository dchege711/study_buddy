/**
 * @description Prepare a model for representing metadata in the database.
 */

var mongoose = require('mongoose');

// Using SchemaTypes.Mixed produces unreliable write results
// It's better to include the dictionary in an array.

var metadataSchema = new mongoose.Schema({
    createdById: Number,
    metadataIndex: Number,
    node_information: Array,
    trashed_cards: Array,
    stats: Array,
},
    {
        timestamps: true,
        autoIndex: false,
        collection: "c13u_study_buddy_metadata"
    }
);

metadataSchema.virtual("url").get(function () {
    return "/study-buddy/metadata/" + this._id;
});

module.exports = mongoose.model('Metadata', metadataSchema);