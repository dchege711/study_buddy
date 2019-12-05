/**
 * @description A collection of tasks that should be ran on a daily basis. 
 * 
 * @module
 */

import { ReviewStreak, User, UserPrefences } from "./DBModels";

/**
 * @description Reset the daily card review streaks.
 * 
 * @returns Resolves with the number of streaks that were updated
 */
function resetDailyStreaks(): Promise<number> {
    let currentTimeStamp = Date.now();
    let todaysDateStr = (new Date(currentTimeStamp)).toDateString();

    return new Promise(function(resolve, reject) {
        /** 
         * @todo Can this routine be optimized? Is there a need for optimization? 
         */
        let numStreaksUpdated = 0;
        User
            .findAll({})
            .then((users: User[]) => {
                users.forEach(async (user) => {
                    try {
                        let streak: ReviewStreak = await user.getReviewStreak();
                        let lastResetDateStr = (new Date(streak.lastResetTimestamp)).toDateString();

                        // If this streak was set today, let it be.
                        if (todaysDateStr === lastResetDateStr) return;

                        // Otherwise, update it
                        let prefs: UserPrefences = await user.getUserPrefences();
                        let reviewedCount = (await streak.getFlashCards()).length;
                        if (reviewedCount < prefs.dailyTarget) {
                            streak.streakLength = 0;
                        } else {
                            streak.streakLength += 1;
                        }
                        await streak.save();
                        numStreaksUpdated += 1;
                    } catch (err) {
                        console.error(err);
                        reject(err);  
                    }
                });
                resolve(numStreaksUpdated);
            })
            .catch((err: Error) => { reject(err); });
    });
};

if (require.main === module) {
    resetDailyStreaks()
        .then((numUpdated) => {
            console.log(`Reset the streak counters for ${numUpdated} users.`);
        })
        .catch((err) => { console.error(err); });
}