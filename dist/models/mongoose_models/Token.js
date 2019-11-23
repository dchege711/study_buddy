"use strict";
/**
 * @description A model for representing tokens. Tokens are my way of logging
 * in returning users without them providing their login details.
 *
 * @todo How used is this model? Can I switch it of and use the `sessions`
 * collection created by `express-session` in `server.js`. Furthermore, how
 * does one invalidate `express-session` sessions when the user changes their
 * password, or decides to log out of the application?
 *
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var validator_1 = require("validator");
;
/**
 * The schema used to represent tokens in the database.
 */
exports.TokenSchema = new mongoose.Schema({
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
        validate: [validator_1.isEmail, 'Please provide a valid email address']
    },
    user_reg_date: String
}, {
    autoIndex: false,
    collection: "study_buddy_tokens",
    strict: true
});
/** A database model of the token used to re-login users automatically. */
var Token = mongoose.model('Token', exports.TokenSchema);
exports.Token = Token;
//# sourceMappingURL=Token.js.map