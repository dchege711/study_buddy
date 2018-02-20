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
                
                card["description_markdown"] = converter.makeHtml(card["description"]),
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
