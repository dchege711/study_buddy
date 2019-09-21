"use strict";

/**
 * A collection of functions that tend to be used in different pages on the 
 * website.
 * 
 * @module
 */

/**
 * @description Prepare a JSON document from the form's inputs.
 * 
 * @param {string} form_id The ID of the form
 * @param {string} url The url at which the form will be processed
 * 
 * @return {Promise} Should take in a JSON argument. 
 */
exports.sendForm = function(form_id, url) {
    return new Promise(function(resolve, reject) {
        let form = document.forms[form_id];

        if (form.checkValidity()) {
            // Send the form to the server for further processing.
            let elements = form.elements;
            let payload = {};
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].type == "checkbox") {
                    payload[elements[i].name] = elements[i].checked;
                } else {
                    payload[elements[i].name] = elements[i].value;
                }
            }
            delete payload[""];

            exports.sendHTTPRequest("POST", url, payload)
                .then((response) => { resolve(response); })
                .catch((err) => { reject(err); })
        } else {
            form.reportValidity();
            reject("Please fill in the form with valid inputs.");
        }
    });
}

/**
 * @description Send a HTTP request with the specified arguments.
 * 
 * @param {string} method The method to use, e.g. `POST`
 * @param {string} url The URL that the request will be sent to
 * @param {JSON} payload The data that will be sent along with the request
 * @return {Promise} 
 */
exports.sendHTTPRequest = function(method, url, payload, contentType="application/json") {
    return new Promise(function(resolve, reject) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                let status = this.status;
                if (status < 300) {
                    resolve(this.response);
                } else if (status >= 300 && status < 400) {
                    reject(new Error(`Request was redirected to ${this.responseURL}.`));
                    window.location = this.responseURL;
                } else {
                    reject(new Error(`Request returned a response status (${status})`));
                    document.write(this.response);
                }
            }
        };
        xhttp.open(method, url, true);
        xhttp.setRequestHeader("Content-Type", contentType);
        xhttp.send(JSON.stringify(payload));
    });
}

/**
 * @description Parse the parameters that are passed in the URL and perform
 * the expected actions.
 */
exports.processParams = function() {
    var params = (new URL(document.location)).searchParams;
    if (params.has("msg")) alert(params.get("msg"));
}

/**
 * @description Fetch information about the user from Local Storage
 */
exports.getAccountInfo = function() {
    let retrievedAccountInfo = localStorage.getItem("session_info");
    if (retrievedAccountInfo === null) return retrievedAccountInfo;
    else return JSON.parse(retrievedAccountInfo);
}

/**
 * @description Set new information about the user in Local Storage
 */
exports.updateAccountInfo = function(newInfo) {
    let existingInfo = exports.getAccountInfo();
    if (existingInfo === null) existingInfo = {};
    Object.keys(newInfo).forEach((key) => {
        existingInfo[key] = newInfo[key];
    });
    localStorage.setItem("session_info", JSON.stringify(existingInfo));
}

/**
 * @description Reload the metadata document from the server. Useful if more 
 * cards have been added, e.g. from the `/browse` page.
 * 
 * @returns {Promise} resolves with the new metadata.
 */
exports.refreshMetadata = function() {
    let accountInfo = exports.getAccountInfo();
    if (accountInfo === null) return Promise.resolve(null);

    return new Promise(function(resolve, reject) {
        exports
            .sendHTTPRequest("POST", "/read-metadata", {userIDInApp: accountInfo.userIDInApp})
            .then((metadataResponse) => {
                let metadata = JSON.parse(metadataResponse).message;
                let metadataDocs = metadata.metadataDocs;

                let minicards = {}
                for (let minicard of metadata.minicards) {
                    minicards[minicard._id] = { 
                        _id: minicard._id, title: minicard.title, 
                        tags: minicard.tags.trim().replace(/\s/g, ", ") 
                    };
                }
                localStorage.setItem("metadata", JSON.stringify(metadataDocs));
                localStorage.setItem("minicards", JSON.stringify(minicards));
                resolve([metadataDocs[0], minicards]);
            })
            .catch((err) => { reject(err); });
    });
}
