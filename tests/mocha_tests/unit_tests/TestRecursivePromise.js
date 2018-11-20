"use strict";

var done = (function wait () { if (!done) setTimeout(wait, 1000) })();

function test(n) {
    return new Promise(async function(resolve, reject) {
        if (n == 3) resolve(["Three!", "Fancy3"]);
        else {
            let val = await test(n+1);
            resolve(val, "Fancy");
        }
    });
}

function runTest() {
    test(0)
        .then((val, fancy) => {
            console.log(`Received ${val} and ${fancy}`);
            done = true;
        })
        .catch((err) => { console.error(err); });
    
}

if (require.main === module) {
    runTest();
}