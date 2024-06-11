"use strict";

/**
 * @description A collection of tasks that should be ran on a daily basis.
 *
 * @module
 */

import * as mongoDB from "mongodb";

import { FilterQuery, UpdateQuery } from "mongoose";
import {
  IMetadata,
  IStreakRaw,
  Metadata,
} from "./mongoose_models/MetadataCardSchema";
import { closeMongooseConnection } from "./MongooseClient";

/**
 * @description Reset the daily card review streaks.
 */
async function resetStreaks(): Promise<mongoDB.BulkWriteResult> {
  const bulkWriteOps: {
    updateOne: {
      filter?: FilterQuery<IMetadata>;
      update?: UpdateQuery<IMetadata>;
    };
  }[] = [];
  const currentTimeStamp = Date.now();
  const todaysDate = (new Date(currentTimeStamp)).toDateString();

  const metadataDocs = await Metadata.find({ metadataIndex: 0 }).exec();
  for (const metadataDoc of metadataDocs) {
    const streakObj: IStreakRaw = {
      cardIDs: metadataDoc.streak.get("cardIDs") || [],
      length: metadataDoc.streak.get("length") || 0,
      dailyTarget: metadataDoc.streak.get("dailyTarget") || 25,
      timeStamp: metadataDoc.streak.get("timeStamp") || Date.now(),
    };
    const timeStampDate = (new Date(streakObj.timeStamp)).toDateString();
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
        filter: { _id: metadataDoc._id },
        update: { $set: { streak: streakObj } },
      },
    });
  }
  return Metadata.bulkWrite(bulkWriteOps);
}

if (require.main === module) {
  resetStreaks()
    .then((result) => {
      console.log(
        `Reset the streak counters for ${result.modifiedCount} documents`,
      );
      return closeMongooseConnection();
    })
    .catch((err) => {
      console.error(err);
    });
}
