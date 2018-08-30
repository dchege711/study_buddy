var CardsDB = require("../models/CardsMongoDB.js");
var MetadataDB = require("../models/MetadataMongoDB.js");
var controller_utils = require("./ControllerUtilities.js");
var login_utils = require("../models/LogInUtilities.js");

var convertObjectToResponse = controller_utils.convertObjectToResponse;
var deleteTempFile = controller_utils.deleteTempFile;

exports.read_card = function (req, res) {
    CardsDB.read(req.body, function (card) {
        res.json(card);
    });
};

exports.home = function (req, res) {
    res.render("pages/home.ejs");
};

exports.account_get = function (req, res) {
    res.render("pages/account_page.ejs", {account_info: req.session.user});
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
    payload.userIDInApp = req.session.user.userIDInApp;
    CardsDB.search(payload, (search_results) => {
        convertObjectToResponse(null, search_results, res);
    });
};

exports.update_card = function (req, res) {
    CardsDB.update(req.body, function (confirmation) {
        res.json(confirmation);
    });
};

exports.delete_card = function (req, res) {
    MetadataDB.delete_from_trash(req.body, function(confirmation) {
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

exports.download_user_data = function(req, res) {
    MetadataDB.write_cards_to_json_file(req.session.user.userIDInApp, (err, filepath, filename) => {
        if (err) { convertObjectToResponse(err, null, res); }
        else {
            res.download(filepath, filename, (err) => {
                if (err) { console.error(err); }
                else { deleteTempFile(filepath); }
            });
        }
    });
};

exports.delete_account = function(req, res) {
    login_utils.deleteAccount(
        req.session.user.userIDInApp, (err, confirmation) => {
            if (err) convertObjectToResponse(err, null, res);
            else {
                delete req.session.user;
                res.setHeader(
                    "Set-Cookie",
                    [`session_token=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT`]
                );
                convertObjectToResponse(null, confirmation, res);
            }
        }
    );
};