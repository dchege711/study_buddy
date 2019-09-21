/**
 * @description A model for representing tokens.
 * 
 * @module
 */

var mongoose = require('mongoose');
var isEmail = require("validator").isEmail;

var tokenSchema = new mongoose.Schema(
    {
        token_id: {
            type: String,
            required: true,
            unique: [true, "This token already exists"],
        },
        userIDInApp: String,
        username: String, 
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [isEmail, 'Please provide a valid email address']
        },
        user_reg_date: String
    },
    {
        autoIndex: false,
        collection: "study_buddy_tokens",
        strict: true
    }
);

module.exports = mongoose.model('Token', tokenSchema);