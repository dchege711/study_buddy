"use strict";
/**
 * @description A collection of tasks that should be ran on a daily basis.
 *
 * @module
 */
var dbConnection = require("./MongooseClient.js");
var Metadata = require("./mongoose_models/MetadataCardSchema.js");
/**
 * @description Reset the daily card review streaks.
 */
function resetStreaks() {
    var bulkWriteOps = [];
    var currentTimeStamp = Date.now();
    var todaysDate = (new Date(currentTimeStamp)).toDateString();
    return new Promise(function (resolve, reject) {
        Metadata
            .find({ metadataIndex: 0 }).exec()
            .then(function (metadataDocs) {
            for (var _i = 0, metadataDocs_1 = metadataDocs; _i < metadataDocs_1.length; _i++) {
                var metadataDoc = metadataDocs_1[_i];
                var streakObj = {
                    timeStamp: metadataDoc.streak.get("timeStamp"),
                    cardIDs: metadataDoc.streak.get("cardIDs"),
                    length: metadataDoc.streak.get("length"),
                    dailyTarget: metadataDoc.streak.get("dailyTarget")
                };
                var timeStampDate = (new Date(streakObj.timeStamp)).toDateString();
                if (todaysDate !== timeStampDate) {
                    if (streakObj.cardIDs.length >= streakObj.dailyTarget) {
                        streakObj.length += 1;
                    }
                    else {
                        streakObj.length = 0;
                    }
                }
                streakObj.cardIDs = [];
                streakObj.timeStamp = currentTimeStamp;
                bulkWriteOps.push({
                    updateOne: {
                        filter: { _id: metadataDoc._id },
                        update: { $set: { streak: streakObj } }
                    }
                });
            }
            return Metadata.bulkWrite(bulkWriteOps);
        })
            .then(function (bulkWriteOpResult) { resolve(bulkWriteOpResult); })
            .catch(function (err) { reject(err); });
    });
}
;
if (require.main === module) {
    resetStreaks()
        .then(function (result) {
        console.log("Reset the streak counters for " + result.modifiedCount + " documents");
        return dbConnection.closeMongooseConnection();
    })
        .catch(function (err) { console.error(err); });
}
