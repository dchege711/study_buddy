require('./MongooseClient');

var CardsDB = require('./CardsMongoDB');
var MetadataDB = require('./MetadataMongoDB');

/**
 * @description Add metadata for the specified user
 */
var addAndPopulateMetadata = function(userIDInApp) {
    MetadataDB.create(
        {
            "userIDInApp": userIDInApp,
            "metadataIndex": 0
        }, (response) => {
        console.log(response["message"]);
        populateMetadata(1);
    });
}

var testMetadataUpdate = function(callBack) {
    var randomUrgency = Math.floor(Math.random() * 200);
    var cardID = "5a7d20921aef274630536c1a"
    CardsDB.update({
        _id: cardID, urgency: randomUrgency
    }, function(response) {
        MetadataDB.read({ "userIDInApp": 1 }, (results) => {
            console.log("Testing updates to metadata...");
            console.log(results[0]["stats"][0][cardID]["urgency"] + " should equal " + randomUrgency);
            callBack();
        });
    })
}

/**
 * @description Delete metadata for the specified user
 */
var deleteMetadata = function (userIDInApp, callBack) {
    MetadataDB.delete(
        {
            "userIDInApp": userIDInApp
        }, (response) => {
            console.log(response["message"]);
            callBack(userIDInApp);
        });
}

/**
 * Add the metadataIndex field to every card that the user owns.
 * 
 * @param {Number} userIDInApp The app ID of the user owning the cards
 */
var populateMetadata = function(userIDInApp) {
    CardsDB.read(
        {
            "userIDInApp": userIDInApp
        }, (response) => {
            cards = response["message"];
            MetadataDB.update(cards, (response) => {
                console.log(response["message"]);
            });
        }
    );
}

if (require.main === module) {
    deleteMetadata(1, addAndPopulateMetadata);
    // addAndPopulateMetadata(1);
    // testMetadataUpdate(function() {
    //     process.exit(0);
    // });
}