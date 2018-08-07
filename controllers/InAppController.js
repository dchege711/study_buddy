var CardsDB = require("../models/CardsMongoDB.js");
var MetadataDB = require("../models/MetadataMongoDB.js");

exports.read_card = function (req, res) {
    CardsDB.read(req.body, function (card) {
        res.json(card);
    });
};

exports.home = function (req, res) {
    res.render("pages/home.ejs");
};

exports.read_metadata = function (req, res) {
    MetadataDB.read(req.body, function (metadata) {
        res.json(metadata);
    });
};

exports.tags = function (req, res) {
    MetadataDB.readTags(req.body, function (tags) {
        res.json(tags);
    });
};

exports.add_card = function (req, res) {
    CardsDB.create(req.body, function (confirmation) {
        res.json(confirmation);
    });
};

exports.search_cards = function (req, res) {
    var payload = req.body;
    payload.userIDInrouter = req.session.user.userIDInrouter;
    CardsDB.search(payload, (search_results) => {
        convertObjectToResponse(search_results, res);
    });
};

exports.update_card = function (req, res) {
    CardsDB.update(req.body, function (confirmation) {
        res.json(confirmation);
    });
};

exports.delete_card = function (req, res) {
    CardsDB.delete(req.body, function (confirmation) {
        res.json(confirmation);
    });
};

exports.trash_card = function (req, res) {
    MetadataDB.send_to_trash(req.body, function (confirmation) {
        res.json(confirmation);
    });
};

exports.restore_from_trash = function (req, res) {
    MetadataDB.restore_from_trash(req.body, function (confirmation) {
        res.json(confirmation);
    });
};