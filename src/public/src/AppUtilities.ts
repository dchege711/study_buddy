"use strict";

import { MetadataResponse } from "../../controllers/InAppController";
import { AuthenticateUser } from "../../models/LogInUtilities";
import { ICard, MiniICard } from "../../models/mongoose_models/CardSchema";
import { IMetadata } from "../../models/mongoose_models/MetadataCardSchema";

/**
 * A collection of functions that tend to be used in different pages on the
 * website.
 *
 * @module
 */

/**
 * @description Send @param {formData} to @param {url} using the specified
 * @param {method}.
 */
export async function sendForm(
        method: "GET" | "POST", url: string, formData: FormData) {
    return sendFetchRequest(method, url, formData);
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
        method: "GET" | "POST", url: string, payload: any): Promise<any> {
    return sendFetchRequest(method, url, JSON.stringify(payload));
}

function sendFetchRequest(
        method: "GET" | "POST", url: string, body: string | FormData): Promise<any> {
    let requestInit: RequestInit = {
        method, body,
        credentials: "same-origin",
    };
    if (typeof body === "string") {
        requestInit.headers = {"Content-Type": "application/json"};
    }
    return fetch(url, requestInit)
        .then((response) => {
            let responseContentType = response.headers.get("content-type") || "";
            if (responseContentType.indexOf("application/json") !== -1) {
                return response.json();
            }
            return response.text();
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

export type RefreshMetadataResponseMiniCards = Map<string, MiniICard>;

export interface RefreshMetadataResponse {
    metadata: IMetadata;
    minicards: RefreshMetadataResponseMiniCards;
};

/**
 * @description Reload the metadata document from the server. Useful if more
 * cards have been added, e.g. from the `/browse` page.
 *
 * @returns {Promise} resolves with the new metadata.
 */
export function refreshMetadata(): Promise<RefreshMetadataResponse> {
    let accountInfo = getAccountInfo();
    if (!accountInfo) {
        return Promise.reject("No account information found.");
    }

    return sendHTTPRequest("POST", "/read-metadata", {userIDInApp: accountInfo.userIDInApp})
        .then((metadata: MetadataResponse) => {
            if (!metadata.metadataDocs || metadata.metadataDocs.length == 0) {
                return Promise.reject("No metadata found.");
            }
            if (!metadata.minicards || metadata.minicards.length == 0) {
                return Promise.reject("No minicards found.");
            }

            let minicards = new Map<string, MiniICard>();
            for (let minicard of metadata.minicards) {
                minicards.set(minicard._id, {
                    _id: minicard._id, title: minicard.title,
                    tags: minicard.tags?.trim().replace(/\s/g, ", ")
                });
            }

            localStorage.setItem("metadata", JSON.stringify(metadata.metadataDocs));
            localStorage.setItem("minicards", JSON.stringify(minicards));
            return Promise.resolve({metadata: metadata.metadataDocs[0], minicards});
        });
}
