var Card = require('../models/Card');
var bodyParser = require('body-parser');

exports.create = function(request, response) {
    var card = new Card({
        title: request.body.title,
        description: request.body.description,
        tags: request.body.tags,
        createdById: request.body.createdById,
        urgency: request.body.urgency
    });
    
    card.save(function(error, confirmation) {
        if (error) {
            console.log(error);
        } else {
            response.json(confirmation);
        }
    });
}

exports.read = function(request, response) {
    var id = request.body.id;
    if (id === null) {
        Card.find({}, function(error, card) {
            if (error) {
                console.log(error);
            } else {
                response.json(card);
            }
        });
    } else {
        Card.findOne({
            _id: id
        }, function(error, card) {
            if (error) {
                console.log(error);
            } else {
                response.json(card);
            }
        });
    }
}

exports.update = function(request, response) {
    var id = request.body.id;
    var data = request.body.data;
    Card.findById(id, function(error, card) {
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
                    response.json(confirmation);
                }
            });
        }
    });
}

exports.delete = function(request, response) {
    Card.remove({_id: request.body.id}, function(error, confirmation) {
        if (error) {
            console.log(error);
        } else {
            response.json(confirmation);
        }
    });
}
