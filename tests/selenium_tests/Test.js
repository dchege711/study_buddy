"use strict";

const TestSignUpFlow = require("./TestSignUpFlow.js");
const LoginUtils = require("../../models/LogInUtilities.js");
const dbConnection = require("../../models/MongooseClient.js");

let headless = process.argv[2] === "headless";

async function runTestSuite(headless=true) {

    let passedAllTests = true;
    let numDeleted = await LoginUtils.deleteAllAccounts();
    console.log(`\n${numDeleted} account(s) were deleted\n`);


    console.log(`Testing signup paths...`);
    await TestSignUpFlow
        .test(headless=headless)
        .then(([numTestsPassed, numTotalTests]) => {
            console.log(`\n${numTestsPassed}/${numTotalTests} tests passed!`);
            passedAllTests = numTestsPassed === numTotalTests;
        })
        .catch((err) =>{ 
            console.error(err); 
        });

    return Promise.resolve(passedAllTests);
}

runTestSuite(headless=headless)
    .then((passedAllTests) => {
        // Dear Future Maintainer: I know, I'm so sorry...
        if (!passedAllTests) process.exit(1);
        else process.exit(0);
    })
    .catch((err) => { console.error(err); process.exit(1); });
