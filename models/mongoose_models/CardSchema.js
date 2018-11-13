/**
 * @description Prepare a model for representing cards in the database.
 */

var mongoose = require('mongoose');

/**
 * Tips from MDN:
 * 
 * Each model maps to a collection of documents in the MongoDB database. 
 * The documents will contain the fields/schema types defined in the model 
 * Schema.
 * 
 */

var cardSchema = new mongoose.Schema(
    {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        tags: { type: String, lowercase: true, trim: true, default: "" },
        urgency: { type: Number, default: 10 },
        metadataIndex: { type: Number, default: 0 },
        createdById: { type: Number, required: true}, 
        isPublic: { type: Boolean, default: false },
        lastReviewed: { type: Date, default: Date.now },
        parent: { type: String, default: "" },
        numChildren: { type: Number, default: 0 },
        numTimesMarkedAsDuplicate: { type: Number, default: 0 },
        numTimesMarkedForReview: { type: Number, default: 0 }
    }, 
    {
        timestamps: true,
        collection: "c13u_study_buddy",
        strict: true
    }
);

/**
 * Creating a text index enables case-insensitive search across the specified 
 * fields. 
 * https://docs.mongodb.com/manual/tutorial/control-results-of-text-search/
 */
cardSchema.index(
    {
        title: "text", description: "text", tags: "text"
    },
    {
        weights: {title: 1, description: 1, tags: 2},
        name: "TextIndex"
    }
);
cardSchema.virtual("url").get(function () {
    return "/study-buddy/card/" + this._id;
});

/*
 * The schema has now been compiled into a mongoose model. I can now use it
 * find, create, update and delete objects of the Card type.
 * 
 * Also, Every model has an associated connection (this will be the default 
 * connection when you use mongoose.model()). 
 * You create a new connection and call .model() on it to create the 
 * documents on a different database.
 * 
 */ 
let CardModel = mongoose.model('Card', cardSchema);
module.exports = CardModel;

if (require.main === module) {
    // Run this script as main if you change the indexes
    // http://thecodebarbarian.com/whats-new-in-mongoose-5-2-syncindexes
    CardModel
        .syncIndexes()
        .then((msg) => { console.log(msg); })
        .catch((err) => { console.error(err); });

    CardModel
        .listIndexes()
        .then((indexes) => { console.log(indexes); })
        .catch((err) => { console.error(err); });

}
