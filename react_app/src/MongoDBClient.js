const config = require('../config');
const assert = require('assert');
const collectionName = 'c13u_study_buddy';

var mongoose = require('mongoose');
var cards = require('./controllers/CardController')

mongoose.connect(config.MONGO_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', function() {
    console.log("Connected to the database successfully!");
});

var newCard = {
    body: {
        "title": "Random Walks Pt. 2",
        "description": "We're now getting somewhere!",
        "tags": "#probability",
        "createdById": "1",
        "status": 67
    }
}

cards.create(newCard, function(data) {
    console.log(data);
});
