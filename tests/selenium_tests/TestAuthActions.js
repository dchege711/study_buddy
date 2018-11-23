const { Builder, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const chrome = require("selenium-webdriver/chrome");
const config = require("../../config.js");
const LoginUtils = require("../../models/LogInUtilities.js");

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
        await driver
            .get(config.BASE_URL)

        testLabel = "Create a new account";
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
            ).then((_) => {
                return driver.manage().getCookie("session_token")
            })
            .then((cookie) => {
                printTestResult(cookie !== null, testLabel);
            });

        testLabel = "LocalStorage is cleared upon logging out"
        numTotalTests += 1;

        await driver
            .wait(
                until.elementLocated({ id: "logout_button" }), 
                config.DEBUG_OPERATION_TIMEOUT_MS
            )
            .then((logOutButton) => {
                driver.wait(
                    until.elementIsVisible(logOutButton),
                    config.DEBUG_OPERATION_TIMEOUT_MS
                ).then((_) => {
                    logOutButton.click();
                });
            });

        await driver
            .wait(
                until.urlIs(`${config.BASE_URL}/`),
                config.DEBUG_OPERATION_TIMEOUT_MS
            );

        await driver
            .executeScript("return window.localStorage")
            .then((storedContent) => {
                printTestResult(storedContent.length === 0, testLabel);
            });

        testLabel = "Cookies are cleared upon logging out"
        numTotalTests += 1;

        await driver
            .manage()
            .getCookie("session_token")
            .then((cookie) => {
                printTestResult(cookie === null, testLabel);
            })
            .catch((err) => {
                if (err.name === "NoSuchCookieError") {
                    printTestResult(true, testLabel);
                } else {
                    throw(err);
                }
            });

        testLabel = "Need to resubmit password after logging out"
        numTotalTests += 1;

        await driver
            .get(`${config.BASE_URL}/home`)
            .then(function() { return driver.getCurrentUrl(); })
            .then((currentURL) => {
                printTestResult(
                    (currentURL === `${config.BASE_URL}/login` 
                        || currentURL === `${config.BASE_URL}/`), 
                    testLabel);
            });

        testLabel = "Log into the new account";
        numTotalTests += 1;

        await driver
            .findElement({name: "username_or_email"})
            .sendKeys(config.DEBUG_EMAIL_ADDRESS)
            .then(() => { return driver.findElement({name: "password"}); })
            .then((element) => { element.sendKeys(config.DEBUG_PASSWORD); })
            .then(() => { return driver.findElement({id: "login_submit"}); })
            .then((element) => { return element.click(); })
            .then(() => { return driver.getCurrentUrl(); })
            .then((_) => { return driver.executeScript("return window.localStorage;")})
            .then((storedContent) => {
                printTestResult(storedContent.metadata !== undefined, testLabel);
            });

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
                        `${config.BASE_URL}/verify-account/${results.message.account_validation_uri}`
                    );
                } else {
                    return Promise.reject("User wasn't found in the database");
                }
            })
            .then(() => { return driver.getCurrentUrl(); })
            .then((currentURL) => {
                printTestResult(
                    (currentURL === `${config.BASE_URL}/home`), 
                    testLabel);
            });

        testLabel = "Request a password reset"
        

        testLabel = "Delete the new account";
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
                printTestResult(loggedOut, testLabel);
            });

    } catch(err) {
        console.error(err);
    } finally {
        await driver.quit();
        return Promise.resolve([numTestsPassed, numTotalTests]);
    }
}