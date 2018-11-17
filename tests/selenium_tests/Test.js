const TestSignUpFlow = require("./TestSignUpFlow.js");

async function runTestSuite() {
    await TestSignUpFlow
        .test()
        .catch((err) =>{ 
            console.error(err); 
        });
}

runTestSuite();
