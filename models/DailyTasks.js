"use strict";

/**
 * @description A collection of tasks that should be ran on a daily basis. 
 * Remember to set up a cron job to run this script.
 */

const dbConnection = require("./MongooseClient.js");
const Metadata = require("./mongoose_models/MetadataCardSchema.js");

/**
 * @description Reset the daily card review streaks. 
 */
function resetStreaks() {

    let bulkWriteOps = [];
    let todaysDate = (new Date(Date.now())).toDateString();

    return new Promise(function(resolve, reject) {
        Metadata
            .find({metadataIndex: 0}).exec()
            .then((metadataDocs) => {
                for (let metadataDoc of metadataDocs) {
                    let streakObj = {
                        timeStamp: metadataDoc.streak.get("timeStamp"),
                        cardIDs: metadataDoc.streak.get("cardIDs"), 
                        length: metadataDoc.streak.get("length"),
                        dailyTarget: metadataDoc.streak.get("dailyTarget")
                    };
                    let timeStampDate = (new Date(streakObj.timeStamp)).toDateString();
                    if (todaysDate !== timeStampDate) {
                        if (streakObj.cardIDs.size >= streakObj.dailyTarget) {
                            streakObj.length += 1;
                        } else {
                            streakObj.length = 0;
                        }
                    }
                    streakObj.timeStamp = Date.now();
                    bulkWriteOps.push({
                        updateOne: {
                            filter: {_id: metadataDoc._id}, 
                            update: { $set: { streak: streakObj } }
                        }
                    })
                }
                return Metadata.bulkWrite(bulkWriteOps);
            })
            .then((bulkWriteOpResult) => { resolve(bulkWriteOpResult); })
            .catch((err) => { reject(err); });
    });
};

if (require.main === module) {
    resetStreaks()
        .then((result) => {
            console.log(
                `Reset the streak counters for ${result.modifiedCount} documents`
            );
            return dbConnection.closeMongooseConnection();
        })
        .catch((err) => { console.error(err); });
}