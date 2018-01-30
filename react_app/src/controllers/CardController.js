var Card = require('../models/Card');

exports.create = function(cardData, callBack) {
    var card = new Card({
        title: cardData.title,
        description: cardData.description,
        tags: cardData.tags,
        createdById: cardData.createdById,
        urgency: cardData.urgency
    });
    
    card.save(function(error, data) {
        if (error) {
            console.log(error);
        } else {
            callBack(data);
        }
    });
}

exports.read = function(id, callBack) {
    if (id === null) {
        Card.find({}, function(error, data) {
            if (error) {
                console.log(error);
            } else {
                callBack(data);
            }
        });
    } else {
        Card.findOne({
            _id: id
        }, function(error, data) {
            if (error) {
                console.log(error);
            } else {
                callBack(data);
            }
        });
    }
}

exports.update = function(id, data, callBack) {
    Card.findById(id, function(error, card) {
        if (error) {
            console.log(error);
        } else {
            Object.keys(data).forEach(key => {
                card.key = data.key;
            });
            card.save(function(error, data) {
                if (error) {
                    console.log(error);
                } else {
                    callBack(data);
                }
            });
        }
    });
}

exports.delete = function(id, callBack) {
    Card.remove({_id: id}, function(error, confirmation) {
        if (error) {
            console.log(error);
        } else {
            callBack(confirmation);
        }
    });
}
