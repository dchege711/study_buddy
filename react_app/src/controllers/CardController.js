var Card = require('../models/Card');
var config = require('../config');
var mongoose = require('mongoose');

exports.create = function(payload, callBack) {
    var card = new Card({
        title: payload["title"],
        description: payload["description"],
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
            }
        });
    });
}

exports.read = function(payload, callBack) {
    var _id = payload["_id"];
    console.log("Reading card... _id = " + _id);
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
                }
            });
        }
    });
}

exports.update = function(payload, callBack) {
    var _id = payload["_id"];
    
    console.log("Update received...");
    console.log(payload);
    delete payload._id;
    
    
    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function() {
        Card.findById(_id, function(error, card) {
            if (error) {
                console.log(error);
            } else {
                console.log("Fetched card after getting it by id");
                console.log(card);
                Object.keys(payload).forEach(key => {
                    console.log("Setting " + key + " to " + payload[key]);
                    card[key] = payload[key];
                });
                card.save(function(error, confirmation) {
                    if (error) {
                        console.log(error);
                    } else {
                        callBack(confirmation);
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
            }
        });
    });
}
