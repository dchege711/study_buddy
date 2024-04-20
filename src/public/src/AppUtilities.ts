"use strict";

import { MetadataResponse } from "../../controllers/InAppController";
import { AuthenticateUser } from "../../models/LogInUtilities";
import { ICard, MiniICard } from "../../models/mongoose_models/CardSchema";
import { IMetadata } from "../../models/mongoose_models/MetadataCardSchema";
import { READ_METADATA } from "../../paths";

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
export async function sendForm(form_id: number | string, url: string) {
    let form = (typeof form_id === "string")
        ? document.forms.namedItem(form_id) : document.forms[form_id];
    if (!form) {
        return Promise.reject("Form not found.");
    }

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
    return fetch(url, {
            method, body: JSON.stringify(payload), credentials: "same-origin",
            headers: {"Content-Type": contentType},
        })
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
    return sendHTTPRequest("POST", READ_METADATA, {})
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

            return Promise.resolve({metadata: metadata.metadataDocs[0], minicards});
        });
}
