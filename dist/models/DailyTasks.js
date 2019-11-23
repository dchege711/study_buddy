"use strict";
/**
 * @description A collection of tasks that should be ran on a daily basis.
 *
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
var MongooseClient_1 = require("./MongooseClient");
var MetadataCardSchema_1 = require("./mongoose_models/MetadataCardSchema");
/**
 * @description Reset the daily card review streaks.
 */
function resetStreaks() {
    var bulkWriteOps = [];
    var currentTimeStamp = Date.now();
    var todaysDate = (new Date(currentTimeStamp)).toDateString();
    return new Promise(function (resolve, reject) {
        MetadataCardSchema_1.Metadata
            .find({ metadataIndex: 0 }).exec()
            .then(function (metadataDocs) {
            for (var _i = 0, metadataDocs_1 = metadataDocs; _i < metadataDocs_1.length; _i++) {
                var metadataDoc = metadataDocs_1[_i];
                var streakObj = {
                    timeStamp: metadataDoc.streak.timeStamp,
                    cardIDs: metadataDoc.streak.cardIDs,
                    length: metadataDoc.streak.length,
                    dailyTarget: metadataDoc.streak.dailyTarget
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
            return MetadataCardSchema_1.Metadata.bulkWrite(bulkWriteOps);
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
        return MongooseClient_1.closeMongooseConnection();
    })
        .catch(function (err) { console.error(err); });
}
//# sourceMappingURL=DailyTasks.js.map