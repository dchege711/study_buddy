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
}