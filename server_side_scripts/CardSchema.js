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

var cardSchema = new mongoose.Schema({
    title: String,
    description: String,
    description_markdown: String,
    tags: {
        type: String,
        lowercase: true,
        trim: true
    },
    urgency: Number,
    metadataIndex: Number,
    createdById: Number,
    lastReviewed: {
        type: Date,
        default: Date.now
    }}, 
    {
        timestamps: true,
        autoIndex: false,
        collection: "c13u_study_buddy"
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
module.exports = mongoose.model('Card', cardSchema);
