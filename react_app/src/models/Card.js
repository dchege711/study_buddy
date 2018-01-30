var mongoose = require('mongoose');

var cardSchema = new mongoose.Schema({
    title: String,
    description: String,
    tags: String,
    createdById: Number,
    lastReviewed: {
        type: Date,
        default: Date.now
    },
    urgency: Number
    
}, {
    timestamps: true,
    autoIndex: false,
    collection: "c13u_study_buddy"
});

module.exports = mongoose.model('Card', cardSchema);
