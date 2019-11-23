"use strict";
/**
 * @description A model for representing users in the database.
 *
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var validator_1 = require("validator");
/** The schema used to represent the user in the database. */
exports.UserSchema = new mongoose.Schema({
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
        validate: [validator_1.isEmail, 'Please provide a valid email address']
    },
    reset_password_uri: String,
    reset_password_timestamp: Number,
    account_validation_uri: String,
    account_is_valid: Boolean,
    cardsAreByDefaultPrivate: { type: Boolean, default: true },
    dailyTarget: { type: Number, default: 20 }
}, {
    timestamps: true,
    autoIndex: false,
    collection: "study_buddy_users",
    strict: true
});
var User = mongoose.model('User', exports.UserSchema);
exports.User = User;
//# sourceMappingURL=UserSchema.js.map