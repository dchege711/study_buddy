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
var deleteMetadata = function (userIDInApp) {
    MetadataDB.delete(
        {
            "userIDInApp": userIDInApp
        }, (response) => {
            console.log(response["message"]);
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
            cards.forEach(card => {
                if (card.title === "_metadata_" || card.title === "_tags_metadata_") {
                    // Do nothing
                } else {
                    card["metadataIndex"] = 0;
                    CardsDB.update(card, (response) => {
                        console.log(response["message"]["title"]);
                    });
                }
            }); 
        }
    );
}

if (require.main === module) {
    addAndPopulateMetadata(1);
    //deleteMetadata(1);
}