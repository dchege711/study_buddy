"use strict";

/**
 * @description A collection of tasks that should be ran on a daily basis.
 *
 * @module
 */

import * as mongoDB from "mongodb";

import { IStreak, Metadata } from "./mongoose_models/MetadataCardSchema";
import { closeMongooseConnection } from "./MongooseClient";

/**
 * @description Reset the daily card review streaks.
 */
async function resetStreaks(): Promise<void> {
  const currentTimeStamp = Date.now();
  const todaysDate = (new Date(currentTimeStamp)).toDateString();

  const metadataDocs = await Metadata.find({ metadataIndex: 0 }).exec();
  for (const metadataDoc of metadataDocs) {
    const streakObj: IStreak = {
      cardIDs: metadataDoc.streak.cardIDs || [],
      length: metadataDoc.streak.length || 0,
      dailyTarget: metadataDoc.streak.dailyTarget || 25,
      timeStamp: metadataDoc.streak.timeStamp || Date.now(),
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

    await Metadata.findByIdAndUpdate(metadataDoc._id, {
      $set: {
        "streak.cardIDs": streakObj.cardIDs,
        "streak.length": streakObj.length,
        "streak.timeStamp": streakObj.timeStamp,
        "streak.dailyTarget": streakObj.dailyTarget,
      },
    });
  }
}

if (require.main === module) {
  resetStreaks()
    .then(() => {
      console.log(
        `Reset the streak counters for documents`,
      );
      return closeMongooseConnection();
    })
    .catch((err) => {
      console.error(err);
    });
}
