"use strict";

import { Builder, until, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import * as firefox from "selenium-webdriver/firefox";

import { getAccountDetails } from "../../models/LogInUtilities";
import { DEBUG_OPERATION_TIMEOUT_MS, BASE_URL, DEBUG_EMAIL_ADDRESS, DEBUG_PASSWORD, DEBUG_USERNAME } from "../../config";

/**
 * @description Test common actions that occur from the login page.
 */
export async function testLoginPage(headless=true) {

    let driver: WebDriver = headless
        ? await new Builder()
            .setChromeOptions(new chrome.Options().headless())
            .setFirefoxOptions(new firefox.Options().headless())
            .build()
        : await new Builder().build();

    let numTotalTests = 0, numTestsPassed = 0, testLabel = "";

    /**
     * @description Helper method for printing the results of a test.
     *
     * @param {Boolean} result the outcome of the test
     * @param {String} testLabel the label of the test
     *
     * @returns {Void}
     */
    function printTestResult(result: boolean, testLabel: string) {
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
            .then((webElement) => { return webElement.sendKeys(DEBUG_EMAIL_ADDRESS as string); })
            .then(() => { return driver.findElement({name: "username"}); })
            .then((webElement) => { return webElement.sendKeys(DEBUG_USERNAME); })
            .then(() => { return driver.findElement({id: "signup_password"})})
            .then((webElement) => { webElement.sendKeys(DEBUG_PASSWORD); })
            .then(() => { return driver.findElement({ id: "signup_submit" }); })
            .then((webElement) => { return webElement.click(); })
            .then(() => { return driver.sleep(DEBUG_OPERATION_TIMEOUT_MS); })
            .then(() => { return driver.switchTo().alert().accept(); })
            .then(() => { return driver.wait(until.urlIs(`${BASE_URL}/home`), DEBUG_OPERATION_TIMEOUT_MS); })
            .then((_) => { return driver.manage(); })
            .then((options) => { return options.getCookie("session_token"); })
            .then((optionsCookie) => { printTestResult(optionsCookie !== null, testLabel); })
            .catch((err) => { console.error(err); printTestResult(false, testLabel); });

        /**********************************************************************/

        testLabel = "LocalStorage is cleared upon logging out"
        numTotalTests += 1;

        await driver
            .wait(until.elementLocated({id: "logout_button"}), DEBUG_OPERATION_TIMEOUT_MS)
            .click()
            .then(() => { return driver.wait(until.urlIs(`${BASE_URL}/`), DEBUG_OPERATION_TIMEOUT_MS); })
            .then((_) => { return driver.executeScript("return window.localStorage;"); })
            .then((storedContent: any) => { printTestResult(storedContent.length === 0, testLabel); })
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
            .sendKeys(DEBUG_EMAIL_ADDRESS as string)
            .then(() => { return driver.findElement({name: "password"}); })
            .then((webElement) => { webElement.sendKeys(DEBUG_PASSWORD); })
            .then(() => { return driver.findElement({id: "login_submit"}); })
            .then((webElement) => { return webElement.click(); })
            .then(() => { return driver.getCurrentUrl(); })
            .then((_) => { return driver.executeScript("return window.localStorage;")})
            .then((storedContent: any) => {
                printTestResult(storedContent.metadata !== undefined, testLabel);
            })
            .catch((err) => { console.error(err); printTestResult(false, testLabel); });

        /**********************************************************************/

        testLabel = "Login by session token w/o providing a password";
        numTotalTests += 1;

        await driver
            .get("https://www.google.com/")
            .then((_) => { return driver.get(`${BASE_URL}`); })
            .then((_) => { return driver.getCurrentUrl(); })
            .then((currentURL) => {
                printTestResult(currentURL === `${BASE_URL}/home`, testLabel);
            })
            .catch((err) => { console.error(err); printTestResult(false, testLabel); });

        /**********************************************************************/

        testLabel = "Request a validation URL and use it to validate account"
        numTotalTests += 1;

        await driver
            .wait(until.elementLocated({id: "logout_button"}), DEBUG_OPERATION_TIMEOUT_MS)
            .click()
            .then((_) => { return driver.get(`${BASE_URL}/send-validation-email`); })
            .then((_) => { return driver.findElement({id: "email"}); })
            .then((webElement) => { return webElement.sendKeys(DEBUG_EMAIL_ADDRESS as string); })
            .then(() => { return driver.findElement({id: "send_validation_url_button"}); })
            .then((webElement) => { return webElement.click(); })
            .then(() => { return driver.wait(until.alertIsPresent(), DEBUG_OPERATION_TIMEOUT_MS); })
            .then(() => { return driver.switchTo().alert().accept(); })
            .then(() => { return driver.wait(until.urlIs(`${BASE_URL}/`), DEBUG_OPERATION_TIMEOUT_MS); })
            .then((_) => { return getAccountDetails({email: DEBUG_EMAIL_ADDRESS}); })
            .then((user) => {
                if (user) {
                    return driver.get(
                        `${BASE_URL}/verify-account/${user.account_validation_uri}`
                    );
                } else {
                    return Promise.reject(new Error("User wasn't found in the database"));
                }
            })
            .then(() => { return driver.wait(until.alertIsPresent(), DEBUG_OPERATION_TIMEOUT_MS); })
            .then(() => { return driver.switchTo().alert().accept(); })
            .then(() => { return driver.wait(until.urlContains(`${BASE_URL}/login`), DEBUG_OPERATION_TIMEOUT_MS); })
            .then((success) => { printTestResult(success, testLabel); })
            .catch((err) => { console.error(err); printTestResult(false, testLabel); });

        /**********************************************************************/

        testLabel = "Request a password reset link and use it to change the password"
        numTotalTests += 1;

        await driver
            .findElement({id: "forgot_password_link"}).click()
            .then(() => { return driver.wait(until.urlIs(`${BASE_URL}/reset-password`), DEBUG_OPERATION_TIMEOUT_MS); })
            .then((_) => { return driver.findElement({name: "email"}); })
            .then((webElement) => { return webElement.sendKeys(DEBUG_EMAIL_ADDRESS as string); })
            .then(() => { return driver.findElement({id: "reset_password_req_submit"}); })
            .then((webElement) => { return webElement.click(); })
            .then(() => { return driver.wait(until.elementLocated({id: "go_back_to_login_button"}), DEBUG_OPERATION_TIMEOUT_MS); })
            .then((webElement) => { return webElement.click(); })
            .then(() => { return driver.wait(until.urlIs(`${BASE_URL}/login`), DEBUG_OPERATION_TIMEOUT_MS); })
            .then((_) => { return getAccountDetails({email: DEBUG_EMAIL_ADDRESS}); })
            .then((user) => {
                if (user) {
                    return driver.get(`${BASE_URL}/reset-password-link/${user.reset_password_uri}`);
                } else {
                    return Promise.reject(new Error("Unable to find the user in the database."));
                }
            })
            .then((_) => { return driver.findElement({id: "password_1"}); })
            .then((webElement) => { return webElement.sendKeys(`${DEBUG_PASSWORD}${DEBUG_PASSWORD}`)})
            .then((_) => { return driver.findElement({id: "password_2"}); })
            .then((webElement) => { return webElement.sendKeys(`${DEBUG_PASSWORD}${DEBUG_PASSWORD}`)})
            .then(() => { return driver.findElement({id: "reset_password_submit"}); })
            .then((webElement) => { return webElement.click(); })
            .then(() => { return driver.wait(until.urlContains(`${BASE_URL}/`), DEBUG_OPERATION_TIMEOUT_MS); })
            .then(() => { return driver.wait(until.alertIsPresent(), DEBUG_OPERATION_TIMEOUT_MS); })
            .then(() => { return driver.switchTo().alert().accept(); })
            .then((_) => { return driver.findElement({name: "username_or_email"}); })
            .then((webElement) => { return webElement.sendKeys(DEBUG_EMAIL_ADDRESS as string); })
            .then(() => { return driver.findElement({id: "login_password"}); })
            .then((webElement) => { webElement.sendKeys(DEBUG_PASSWORD); })
            .then(() => { return driver.findElement({id: "login_submit"}); })
            .then((webElement) => { return webElement.click(); })
            .then(() => { return driver.wait(until.alertIsPresent(), DEBUG_OPERATION_TIMEOUT_MS); })
            .then(() => { return driver.switchTo().alert().getText(); })
            .then((text) => {
                if (text === `Incorrect username/email and/or password`) {
                    return driver.switchTo().alert().accept();;
                } else {
                    return Promise.reject(new Error("Password not reset!"));
                }
            })
            // .then(() => { return driver.findElement({id: "login_password"}); })
            // .then((webElement) => { return webElement.sendKeys(Key.CONTROL, 'a', Key.NULL); }) // Doesn't work!
            .then(() => { return driver.executeScript("return document.getElementById('login_password').value = '';"); })
            .then(() => { return driver.findElement({id: "login_password"}); })
            .then((webElement) => { return webElement.sendKeys(`${DEBUG_PASSWORD}${DEBUG_PASSWORD}`); })
            .then(() => { return driver.findElement({id: "login_submit"}); })
            .then((webElement) => { return webElement.click(); })
            .then(() => { return driver.wait(until.urlIs(`${BASE_URL}/home`), DEBUG_OPERATION_TIMEOUT_MS); })
            .then(() => { return driver.executeScript("return window.localStorage;")})
            .then((storedContent: any) => {
                printTestResult(storedContent.metadata !== undefined, testLabel);
            })
            .catch((err) => { console.error(err); printTestResult(false, testLabel); });

        /**********************************************************************/

        testLabel = "Delete the new account";
        numTotalTests += 1;

        await driver
            .wait(until.elementLocated({id: "account_button"}), DEBUG_OPERATION_TIMEOUT_MS)
            .then((accountButton) => { accountButton.click(); })
            .then(() => { return driver.wait(until.urlIs(`${BASE_URL}/account`), DEBUG_OPERATION_TIMEOUT_MS); })
            .then(() => { return driver.findElement({id: "delete_account_button"}); })
            .then((webElement) => { return webElement.click(); })
            .then(() => { return driver.wait(until.alertIsPresent(), DEBUG_OPERATION_TIMEOUT_MS); })
            .then(() => { return driver.switchTo().alert().accept(); })
            .then(() => { return driver.wait(until.urlIs(`${BASE_URL}/login`), DEBUG_OPERATION_TIMEOUT_MS); })
            .then((loggedOut) => { printTestResult(loggedOut, testLabel); })
            .catch((err) => { console.error(err); printTestResult(false, testLabel); });

        /**********************************************************************/

    } catch(err) {
        console.error(err);
    } finally {
        await driver.quit();
        return Promise.resolve([numTestsPassed, numTotalTests]);
    }
}
