const webdriver = require("selenium-webdriver");
const config = require("../config.js");

async function test() {
    let driver = await new webdriver.Builder().build();
    try {
        await driver.get(`http://localhost:${config.PORT}/`);
    } catch(err) {
        console.error(err);
    } finally {
        await driver.quit();
    }
}

test();
