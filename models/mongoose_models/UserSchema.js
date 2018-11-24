/**
 * @description Prepare a model for representing users in the database.
 * 
 */

var mongoose = require('mongoose');
var isEmail = require("validator").isEmail;

var userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: [true, "This username is already taken"],
            match: /[_\-A-Za-z0-9]+/
        },
        salt: Array,
        hash: Array,
        userIDInApp: {
            type: Number,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [isEmail, 'Please provide a valid email address']
        },
        reset_password_uri: String,
        reset_password_timestamp: Number,
        account_validation_uri: String,
        account_is_valid: Boolean,
        cardsAreByDefaultPrivate: {type: Boolean, default: true }
    },
    {
        timestamps: true,
        autoIndex: false,
        collection: "study_buddy_users",
        strict: true
    }
);

module.exports = mongoose.model('User', userSchema);
