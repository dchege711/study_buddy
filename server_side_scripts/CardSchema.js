var mongoose = require('mongoose');

var cardSchema = new mongoose.Schema({
    title: String,
    description: String,
    description_markdown: String,
    tags: String,
    urgency: Number,
    stats: Array,
    createdById: {
        type: Number,
        default: 1
    },
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

module.exports = mongoose.model('Card', cardSchema);
