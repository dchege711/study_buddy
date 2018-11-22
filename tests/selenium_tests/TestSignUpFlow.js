const { Builder, Condition, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const chrome = require("selenium-webdriver/chrome");
const config = require("../../config.js");

/**
 * @description Test common actions that occur from the login page.
 */
exports.test = async function(headless=true) {
    
    let driver;
    if (headless) {
        driver = await new Builder()
            .setChromeOptions(new chrome.Options().headless())
            .setFirefoxOptions(new firefox.Options().headless())
            .build();
    } else {
        driver = await new Builder().build();
    }

    let numTotalTests = 0, numTestsPassed = 0, testLabel = "";
    
    try {
        await driver
            .get(config.BASE_URL);

        testLabel = "Creating and logging into a new account";
        numTotalTests += 1;

        await driver
            .findElement({ id: "display_signup_form" }).click();

        await driver
            .findElement({ name: "email" })
            .sendKeys(config.DEBUG_EMAIL_ADDRESS);

        await driver
            .findElement({ name: "username" })
            .sendKeys(config.DEBUG_USERNAME);

        await driver
            .findElement({ id: "signup_password" })
            .sendKeys(config.DEBUG_PASSWORD);

        await driver
            .findElement({ id: "signup_submit" }).click();

        // Investigate why waiting for an alert doesn't work...
        await driver
            .sleep(config.DEBUG_OPERATION_TIMEOUT_MS);
            
        await driver.switchTo().alert().accept();

        await driver
            .wait(
                until.urlIs(`${config.BASE_URL}/home`), 
                config.DEBUG_OPERATION_TIMEOUT_MS
            ).then((loggedIn) => {
                if (loggedIn) {
                    numTestsPassed += 1;
                    console.log(`✔ ${testLabel}`);
                } else {
                    console.log(`✖ ${testLabel}`);
                }
            });

        testLabel = "Deleting the new account";
        numTotalTests += 1;

        await driver
            .wait(
                until.elementLocated({ id: "account_button" }), 
                config.DEBUG_OPERATION_TIMEOUT_MS
            ).then((account_button) => {
                driver.wait(
                    until.elementIsVisible(account_button),
                    config.DEBUG_OPERATION_TIMEOUT_MS
                ).then((_) => {
                    account_button.click();
                })
            });

        await driver
            .wait(
                until.urlIs(`${config.BASE_URL}/account`),
                config.DEBUG_OPERATION_TIMEOUT_MS
            );

        await driver
            .findElement({ id: "delete_account_button" }).click();

        await driver
            .switchTo().alert().accept();
        
        await driver
            .wait(
                until.urlIs(`${config.BASE_URL}/login`),
                config.DEBUG_OPERATION_TIMEOUT_MS
            )
            .then((loggedOut) => {
                if (loggedOut) {
                    numTestsPassed += 1;
                    console.log(`✔ ${testLabel}`);
                } else {
                    console.log(`✖ ${testLabel}`);
                }
            });

    } catch(err) {
        console.error(err);
    } finally {
        await driver.quit();
        return Promise.resolve([numTestsPassed, numTotalTests]);
    }
}