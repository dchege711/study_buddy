"use strict";
/**
 * @description A model for representing cards in the database.
 *
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
/** The schema for cards in the database. */
exports.CardSchema = new mongoose.Schema({
    title: { type: String, default: "", trim: true },
    description: { type: String, trim: true, default: "" },
    descriptionHTML: { type: String, trim: true, default: "" },
    tags: { type: String, lowercase: true, trim: true, default: "" },
    urgency: { type: Number, default: 10, max: 10, min: 0 },
    metadataIndex: { type: Number, default: 0 },
    createdById: { type: Number, required: true },
    isPublic: { type: Boolean, default: false },
    lastReviewed: { type: Date, default: Date.now },
    parent: { type: String, trim: true, default: "" },
    numChildren: { type: Number, default: 0 },
    idsOfUsersWithCopy: { type: String, lowercase: true, trim: true, default: "" },
    numTimesMarkedAsDuplicate: { type: Number, default: 0 },
    numTimesMarkedForReview: { type: Number, default: 0 }
}, {
    timestamps: true,
    autoIndex: true,
    collection: "c13u_study_buddy",
    strict: true
});
/**
 * Create a text index to enable case-insensitive search across the specified
 * fields. [docs](https://docs.mongodb.com/manual/tutorial/control-results-of-text-search/)
 */
exports.CardSchema.index({
    title: "text", description: "text", tags: "text"
}, {
    weights: { title: 1, description: 1, tags: 2 },
    name: "TextIndex"
});
/**
 * Calling `mongoose.model` compiles the schema into a mongoose model. I can
 * now use it find, create, update and delete objects of the Card type.
 *
 * Every model has an associated connection (this will be the default
 * connection when you use `mongoose.model()`). One create a new connection and
 * call `.model()` on it to create the documents on a different database.
 */
/** A database model of a card created by a user. */
var Card = mongoose.model('Card', exports.CardSchema);
exports.Card = Card;
if (require.main === module) {
    // Run this script as main if you change the indexes
    // http://thecodebarbarian.com/whats-new-in-mongoose-5-2-syncindexes
    // Note from Mongoose: It is not recommended that you run [syncIndexes] in 
    // production. Index creation may impact database performance depending 
    // on your load. Use with caution.
    Card
        .syncIndexes({})
        // @ts-ignore @todo Investigate this
        .then(function (msg) { console.log(msg); })
        .catch(function (err) { console.error(err); });
    Card
        .listIndexes()
        .then(function (indexes) { console.log(indexes); })
        .catch(function (err) { console.error(err); });
}
//# sourceMappingURL=CardSchema.js.map