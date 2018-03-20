var Card = require('./CardSchema');
var config = require('../config');
var mongoose = require('mongoose');
var showdown = require('showdown');

var converter = new showdown.Converter();

exports.create = function(payload, callBack) {
    var card = new Card({
        title: payload["title"],
        description: payload["description"],
        description_markdown: converter.makeHtml(payload["description"]),
        tags: payload["tags"],
        createdById: payload["createdById"],
        urgency: payload["urgency"]
    });

    // To do: Store the metadata ID under user's details.
    if (card.title === "_tags_metadata_" || card.title === "_metadata_") {
        return;
    }

    /*
     * How many cards before we need a new metadata JSON?
     * 
     * (400 + 150 * num_id_metadata) * 5 bytes/char <= 16MB
     * num_id_metadata <= 21330. So let's say 15,000 cards max
     * 
     * Will that ever happen, probably not!
     */
    
    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function() {
        card.save(function(error, confirmation) {
            if (error) {
                console.log(error);
            } else {
                callBack(confirmation);
                mongoose.disconnect();
            }
        });
    });
}

exports.saveThisCard = function(card, callBack) {
    // To do: Store the metadata ID under user's details.
    if (card.title === "_tags_metadata_" || card.title === "_metadata_") {
        return;
    }

    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function () {
        console.log("Now saving card...");
        console.log(card);
        card.save(function (error, confirmation) {
            console.log("I'm in the callback");
            if (error) {
                console.log(error);
            } else {
                console.log(confirmation);
                callBack(confirmation);
                mongoose.disconnect();
            }
        });
    });
}

var updateMetadata = function(modifications) {
    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function () {
        Card.findOne({"title": "_tags_metadata_"}, function (error, card) {
            if (error) {
                console.log(error);
            } else {
                if (card === null || card === undefined) {
                    console.log("{title: _tags_metadata_} didn't match any documents");
                    return;
                }
                Object.keys(payload).forEach(key => {
                    card[key] = payload[key];
                });

                card["description_markdown"] = converter.makeHtml(card["description"]),
                    card.save(function (error, confirmation) {
                        if (error) {
                            console.log(error);
                        } else {
                            callBack(confirmation);
                            mongoose.disconnect();
                        }
                    });
            }
        });
    });
}

exports.read = function(payload, callBack) {
    var _id = payload["_id"];
    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function() {
        if (_id === null || _id === undefined) {
            Card.find({}, function(error, card) {
                if (error) {
                    console.log(error);
                } else {
                    callBack(card);
                    mongoose.disconnect();
                }
            });
        } else {
            Card.findOne({
                _id: _id
            }, function(error, card) {
                if (error) {
                    console.log(error);
                } else {
                    callBack(card);
                    mongoose.disconnect();
                }
            });
        }
    });
}

exports.update = function(payload, callBack) {
    var _id = payload["_id"];
    delete payload._id;
    
    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function() {
        Card.findById(_id, function(error, card) {
            if (error) {
                console.log(error);
            } else {
                if (card === null || card === undefined) {
                    console.log("The provided ID didn't match any documents");
                    return
                }
                Object.keys(payload).forEach(key => {
                    card[key] = payload[key];
                });
                
                card["description_markdown"] = converter.makeHtml(card["description"]);
                
                // To do: Store the metadata ID under user's details.
                if (card.title === "_tags_metadata_" || card.title === "_metadata_") {
                    return;
                }

                card.save(function(error, confirmation) {
                    if (error) {
                        console.log(error);
                    } else {
                        callBack(confirmation);
                        mongoose.disconnect();
                    }
                });
            }
        });
    });
}

exports.delete = function(payload, callBack) {
    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function() {
        Card.remove({_id: payload["_id"]}, function(error, confirmation) {
            if (error) {
                console.log(error);
            } else {
                callBack(confirmation);
                mongoose.disconnect();
            }
        });
    });
}
