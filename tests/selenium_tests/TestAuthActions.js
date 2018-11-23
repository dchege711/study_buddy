const { Builder, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const chrome = require("selenium-webdriver/chrome");
const config = require("../../config.js");
const LoginUtils = require("../../models/LogInUtilities.js");

const TIMEOUT = config.DEBUG_OPERATION_TIMEOUT_MS;
const BASE_URL = config.BASE_URL;

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

    /**
     * @description Helper method for printing the results of a test.
     * 
     * @param {Boolean} result the outcome of the test
     * @param {String} testLabel the label of the test
     * 
     * @returns {Void}
     */
    function printTestResult(result, testLabel) {
        if (result) {
            numTestsPassed += 1;
            console.log('\x1b[32m%s\x1b[0m %s', `✔`, testLabel);
        } else {
            console.log('\x1b[31m%s\x1b[0m %s', `✖`, testLabel);
        }
    }
    
    try {

        /**********************************************************************/

        testLabel = "Create a new account";
        numTotalTests += 1;

        await driver
            .get(BASE_URL)
            .then(() => { return driver.findElement({id: "display_signup_form"}); })
            .then((webElement) => { return webElement.click(); })
            .then(() => { return driver.findElement({name: "email"}); })
            .then((webElement) => { return webElement.sendKeys(config.DEBUG_EMAIL_ADDRESS); })
            .then(() => { return driver.findElement({name: "username"}); })
            .then((webElement) => { return webElement.sendKeys(config.DEBUG_USERNAME); })
            .then(() => { return driver.findElement({id: "signup_password"})})
            .then((webElement) => { webElement.sendKeys(config.DEBUG_PASSWORD); })
            .then(() => { return driver.findElement({ id: "signup_submit" }); })
            .then((webElement) => { return webElement.click(); })
            .then(() => { return driver.sleep(TIMEOUT); })
            .then(() => { return driver.switchTo().alert().accept(); })
            .then(() => { return driver.wait(until.urlIs(`${BASE_URL}/home`), TIMEOUT); })
            .then((_) => { return driver.manage(); })
            .then((options) => { return options.getCookie("session_token"); })
            .then((optionsCookie) => { printTestResult(optionsCookie !== null, testLabel); })
            .catch((err) => { console.error(err); printTestResult(false, testLabel); });

        /**********************************************************************/

        testLabel = "LocalStorage is cleared upon logging out"
        numTotalTests += 1;

        await driver
            .wait(until.elementLocated({ id: "logout_button" }), TIMEOUT)
            .click()
            .then(() => { return driver.wait(until.urlIs(`${BASE_URL}/`), TIMEOUT); })
            .then((_) => { return driver.executeScript("return window.localStorage;"); })
            .then((storedContent) => { printTestResult(storedContent.length === 0, testLabel); })
            .catch((err) => { console.error(err); printTestResult(false, testLabel); });

        /**********************************************************************/

        testLabel = "Cookies are cleared upon logging out"
        numTotalTests += 1;

        await driver
            .manage()
            .getCookie("session_token")
            .then((optionsCookie) => { printTestResult(optionsCookie === null, testLabel); })
            .catch((err) => { 
                if (err.name === "NoSuchCookieError") { printTestResult(true, testLabel); }
                else { console.error(err); printTestResult(false, testLabel); } 
            });
        
        /**********************************************************************/

        testLabel = "Need to resubmit password after logging out"
        numTotalTests += 1;

        await driver
            .get(`${BASE_URL}/home`)
            .then(() => { return driver.getCurrentUrl(); })
            .then((currentURL) => {
                printTestResult(currentURL === `${BASE_URL}/login`, testLabel);
            })
            .catch((err) => { console.error(err); printTestResult(false, testLabel); });

        /**********************************************************************/

        testLabel = "Log into the new account";
        numTotalTests += 1;

        await driver
            .findElement({name: "username_or_email"})
            .sendKeys(config.DEBUG_EMAIL_ADDRESS)
            .then(() => { return driver.findElement({name: "password"}); })
            .then((webElement) => { webElement.sendKeys(config.DEBUG_PASSWORD); })
            .then(() => { return driver.findElement({id: "login_submit"}); })
            .then((webElement) => { return webElement.click(); })
            .then(() => { return driver.getCurrentUrl(); })
            .then((_) => { return driver.executeScript("return window.localStorage;")})
            .then((storedContent) => {
                printTestResult(storedContent.metadata !== undefined, testLabel);
            })
            .catch((err) => { console.error(err); printTestResult(false, testLabel); });

        /**********************************************************************/

        testLabel = "Validate the new account & login by session token";
        numTotalTests += 1;

        await driver
            .executeScript("return window.localStorage;")
            .then((storedContent) => {
                let sessionInfo = JSON.parse(storedContent.session_info);
                return LoginUtils.getAccountDetails({
                    userIDInApp: sessionInfo.userIDInApp
                });
            })
            .then((results) => {
                if (results.success) {
                    return driver.get(
                        `${BASE_URL}/verify-account/${results.message.account_validation_uri}`
                    );
                } else {
                    return Promise.reject("User wasn't found in the database");
                }
            })
            .then(() => { return driver.getCurrentUrl(); })
            .then((currentURL) => {
                printTestResult(currentURL === `${BASE_URL}/home`, testLabel);
            })
            .catch((err) => { console.error(err); printTestResult(false, testLabel); });

        /**********************************************************************/

        testLabel = "Request a password reset"
        
        /**********************************************************************/

        testLabel = "Delete the new account";
        numTotalTests += 1;

        // await driver
        //     .wait(until.elementLocated({ id: "account_button" }), TIMEOUT)
        //     .then((accountButton) => { return accountButton.click(); })
        //     .then(async () => { return await driver.wait(until.urlIs(`${BASE_URL}/account`), TIMEOUT); })
        //     .then((_) => { return driver.findElement({ id: "delete_account_button" }); })
        //     .then((webElement) => { webElement.click(); })
        //     .then(() => { return driver.switchTo(); })
        //     .then((targetLocator) => { return targetLocator.alert(); })
        //     .then((alertPromise) => { return alertPromise.accept(); })
        //     .then(() => { return driver.wait(until.urlIs(`${BASE_URL}/login`), TIMEOUT); })
        //     .then((loggedOut) => { printTestResult(loggedOut, testLabel); })
        //     .catch((err) => { console.error(err); printTestResult(false, testLabel); });

        await driver
            .wait(until.elementLocated({id: "account_button"}), TIMEOUT)
            .then((accountButton) => { accountButton.click(); })
            .then(() => { return driver.wait(until.urlIs(`${config.BASE_URL}/account`), TIMEOUT); })
            .then(() => { return driver.findElement({id: "delete_account_button"}); })
            .then((webElement) => { return webElement.click(); })
            .then(() => { return driver.switchTo().alert().accept(); })
            .then(() => { return driver.wait(until.urlIs(`${config.BASE_URL}/login`), TIMEOUT); })
            .then((loggedOut) => { printTestResult(loggedOut, testLabel); })
            .catch((err) => { console.error(err); printTestResult(false, testLabel); });

        /**********************************************************************/

        driver.wait(until.alertIsPresent, TIMEOUT)

    } catch(err) {
        console.error(err);
    } finally {
        await driver.quit();
        return Promise.resolve([numTestsPassed, numTotalTests]);
    }
}