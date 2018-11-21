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
    
    try {
        await driver
            .get(config.BASE_URL);

        console.log("\nCreating a new account...\n");

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
            
        await driver
            .switchTo().alert().accept();

        console.log("\nLogging into the new account...\n");

        await driver
            .findElement({ id: "display_login_form" }).click();
        
        await driver
            .findElement({ name: "username_or_email"})
            .sendKeys(config.DEBUG_EMAIL_ADDRESS);

        await driver
            .findElement({ id: "login_password" })
            .sendKeys(config.DEBUG_PASSWORD);

        await driver
            .findElement({ id: "login_submit" }).click();

        await driver
            .wait(
                until.urlIs(`${config.BASE_URL}/home`), 
                config.DEBUG_OPERATION_TIMEOUT_MS
            ).then((logged_in) => {
                console.log(`\tLogged in: ${logged_in}`);
            });

        console.log("\nDeleting the new account...\n");

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
            .then((logged_out) => {
                console.log(`\tDeleted account: ${logged_out}`);
            });

    } catch(err) {
        console.error(err);
    } finally {
        await driver.quit();
    }
}