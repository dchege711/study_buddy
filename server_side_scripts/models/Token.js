/**
 * @description Prepare a model for representing tokens.
 * 
 */

var mongoose = require('mongoose');

var tokenSchema = new mongoose.Schema(
    {
        value: {
            type: String,
            required: true,
            unique: [true, "This token already exists"],
        },
        owner: String
    },
    {
        autoIndex: false,
        collection: "study_buddy_meta"
    }
);

module.exports = mongoose.model('Token', tokenSchema);