/**
 * @description Set up the global setup and teardown functions. Should be 
 * included in the mocha command under `--file <path/to/this/file.ts>`
 * 
 * {@link https://mochajs.org/#-file-filedirectoryglob}
 */

// const whyIsNodeRunning = require("why-is-node-running");
import { shutdownServer } from "./src/server";

after(async () => {  
    try {
        await shutdownServer();
        // setTimeout(whyIsNodeRunning, 5000);
        console.log("Please stop using --exit. https://mochajs.org/#-exit");
    } catch (err) {
        console.error(err);
    }
});
