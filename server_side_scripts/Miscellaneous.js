var CardsDB = require('./CardsMongoDB');
var MetadataDB = require('./MetadataMongoDB');

/**
 * Add the metadataIndex field to every card
 * 
 * @param {Number} userIDInApp The app ID of the user owning the cards
 */
var addMetadataIndex = function(userIDInApp) {
    CardsDB.read(
        {
            "userIDInApp": userIDInApp
        }, (response) => {
            cards = response["message"];
            // cards.forEach(card => {
            //     if (card.title === "_metadata_" || card.title === "_tags_metadata_") {
            //         // Do nothing
            //     } else {
            //         console.log(card.title);
            //         // card["metadataIndex"] = 0;
            //         // CardsDB.update(card, (response) => {
            //         //     console.log(response["message"]);
            //         // });
            //     }
            // }); 

            var card = cards[0];
            console.log("Updating " + card.title);
            if (card.title === "_metadata_" || card.title === "_tags_metadata_") {
                console.log("Did nothing");
            } else {
                card["metadataIndex"] = 0;
                CardsDB.update(card, (response) => {
                    console.log(response["message"]);
                });
            }
        }
    );
}


// Store node information as described in MetadataMongoDB.js

// Next:

if (require.main === module) {
    addMetadataIndex(1);
}