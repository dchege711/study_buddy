"use strict";

/**
 * @description A collection of tasks that should be ran on a daily basis.
 *
 * @module
 */

import * as mongoDB from "mongodb";

import { Metadata } from "./mongoose_models/MetadataCardSchema";
import { closeMongooseConnection } from "./MongooseClient";

/**
 * @description Reset the daily card review streaks.
 */
function resetStreaks(): Promise<mongoDB.BulkWriteResult> {

    let bulkWriteOps = [];
    let currentTimeStamp = Date.now();
    let todaysDate = (new Date(currentTimeStamp)).toDateString();

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
                        if (streakObj.cardIDs.length >= streakObj.dailyTarget) {
                            streakObj.length += 1;
                        } else {
                            streakObj.length = 0;
                        }
                    }
                    streakObj.cardIDs = [];
                    streakObj.timeStamp = currentTimeStamp;
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
            return closeMongooseConnection(null);
        })
        .catch((err) => { console.error(err); });
}
