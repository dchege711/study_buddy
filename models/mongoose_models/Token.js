/**
 * @description Prepare a model for representing tokens.
 * 
 */

var mongoose = require('mongoose');

var tokenSchema = new mongoose.Schema(
    {
        token_id: {
            type: String,
            required: true,
            unique: [true, "This token already exists"],
        },
        userIDInApp: String,
        username: String, 
        email: String,
        user_reg_date: String
    },
    {
        autoIndex: false,
        collection: "study_buddy_tokens",
        strict: true
    }
);

module.exports = mongoose.model('Token', tokenSchema);