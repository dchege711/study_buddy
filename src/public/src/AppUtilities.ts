"use strict";

import { MetadataResponse } from "../../controllers/InAppController";
import { AuthenticateUser } from "../../models/LogInUtilities";
import { ICard } from "../../models/mongoose_models/CardSchema";

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
export async function sendForm(form_id: number, url: string) {
    let form = document.forms[form_id];

    if (!form.checkValidity()) {
        form.reportValidity();
        return Promise.reject("Please fill in the form with valid inputs.");
    }

    // Send the form to the server for further processing.
    let payload: {[s: string]: boolean | number | string} = {};
    for (let i = 0; i < form.elements.length; i++) {
        let element = form.elements[i] as HTMLInputElement;
        if (element.type == "checkbox") {
            payload[element.name] = element.checked;
        } else {
            payload[element.name] = element.value;
        }
    }
    delete payload[""];

    return sendHTTPRequest("POST", url, payload);
}

/**
 * @description Send a HTTP request with the specified arguments.
 *
 * @param {string} method The method to use, e.g. `POST`
 * @param {string} url The URL that the request will be sent to
 * @param {JSON} payload The data that will be sent along with the request
 * @return {Promise}
 */
export function sendHTTPRequest(
        method: "GET" | "POST", url: string, payload: any,
        contentType="application/json"): Promise<any> {
    return new Promise(function(resolve, reject) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                let status = this.status;
                if (status < 300) {
                    resolve(this.response);
                } else if (status >= 300 && status < 400) {
                    reject(new Error(`Request was redirected to ${this.responseURL}.`));
                    window.location = this.responseURL as unknown as Location;
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
export function processParams() {
    var params = (new URL(document.location.href)).searchParams;
    if (params.has("msg")) alert(params.get("msg"));
}

/**
 * @description Fetch information about the user from Local Storage
 */
export function getAccountInfo(): AuthenticateUser | null {
    let retrievedAccountInfo = localStorage.getItem("session_info");
    if (retrievedAccountInfo === null) return retrievedAccountInfo;
    else return JSON.parse(retrievedAccountInfo);
}

/**
 * @description Reload the metadata document from the server. Useful if more
 * cards have been added, e.g. from the `/browse` page.
 *
 * @returns {Promise} resolves with the new metadata.
 */
export function refreshMetadata() {
    let accountInfo = getAccountInfo();
    if (!accountInfo) {
        return Promise.resolve(null);
    }

    return sendHTTPRequest("POST", "/read-metadata", {userIDInApp: accountInfo.userIDInApp})
        .then((metadata: MetadataResponse) => {
            if (!metadata.metadataDocs || metadata.metadataDocs.length == 0) {
                return Promise.reject("No metadata found.");
            }
            if (!metadata.minicards || metadata.minicards.length == 0) {
                return Promise.reject("No minicards found.");
            }

            let minicards: {[k: string]: Partial<ICard>} = {};
            for (let minicard of metadata.minicards) {
                minicards[minicard._id] = {
                    _id: minicard._id, title: minicard.title,
                    tags: minicard.tags?.trim().replace(/\s/g, ", ")
                };
            }

            localStorage.setItem("metadata", JSON.stringify(metadata.metadataDocs));
            localStorage.setItem("minicards", JSON.stringify(minicards));
            return Promise.resolve([metadata.metadataDocs[0], minicards]);
        });
}
