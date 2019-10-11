/**
 * @description A model for representing cards in the database.
 * 
 * @module
 */

var mongoose = require('mongoose');

/**
 * The schema for cards in the database 
 * 
 * @param {Number} urgency
 * [Spaced Repetition]{@link https://en.wikipedia.org/wiki/Spaced_repetition} 
 * is commonly practised when a user has to retain a large amount of 
 * information indefinitely. It exploits the 
 * [Spacing Effect]{@link https://en.wikipedia.org/wiki/Spacing_effect}, the 
 * phenomenon whereby learning is greater when studying is spread out over time, 
 * as opposed to studying the same amount of content in a single session.
 * Flashcard software usually adjusts the spacing time based on whether the 
 * user provided the right answer. Answers may at times be too complex to 
 * define in code. We therefore depend on the user updating the `card.urgency` 
 * attribute in lieu of providing an answer to the flash card. Since the cards 
 * are shown in decreasing order of urgency, cards that are ranked lower will 
 * appear much later in subsequent review sessions.
 * 
 * @param {Boolean} isPublic 
 *  If `false`, then the card is private. A private flashcard is only visible 
 *  to its owner. It will not appear in the search results at the `/browse` page. In contrast, a public card will appear in the search results as a read-only card. Any user that adds the card to their own collection will get a separate copy of the card.
 */
var cardSchema = new mongoose.Schema(
    {
        title: { type: String, default: "", trim: true },
        description: { type: String, trim: true, default: "" },
        descriptionHTML: { type: String, trim: true, default: "" },
        tags: { type: String, lowercase: true, trim: true, default: "" },
        urgency: { type: Number, default: 10 },
        metadataIndex: { type: Number, default: 0 },
        createdById: { type: Number, required: true}, 
        isPublic: { type: Boolean, default: false },
        lastReviewed: { type: Date, default: Date.now },
        parent: { type: String, trim: true, default: "" },
        numChildren: { type: Number, default: 0 },
        idsOfUsersWithCopy: { type: String, lowercase: true, trim: true, default: "" },
        numTimesMarkedAsDuplicate: { type: Number, default: 0 },
        numTimesMarkedForReview: { type: Number, default: 0 }
    }, 
    {
        timestamps: true,
        autoIndex: true,
        collection: "c13u_study_buddy",
        strict: true
    }
);

/**
 * Create a text index to enable case-insensitive search across the specified 
 * fields. [docs](https://docs.mongodb.com/manual/tutorial/control-results-of-text-search/)
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
