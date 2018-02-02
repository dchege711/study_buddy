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
    var data = payload["data"];
    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function() {
        Card.findById(_id, function(error, card) {
            if (error) {
                console.log(error);
            } else {
                Object.keys(data).forEach(key => {
                    card.key = data.key;
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