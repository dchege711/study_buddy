import * as fs from "fs";

import { Response } from "express";

/** The interface that messages passed around in the application should use. */
export interface IBaseMessage {
    /** The HTTP status that should be relayed to the user */
    status: number;

    /** Did the intended operation succeed? */
    success: boolean;

    /**
     * If the intended operation failed, then `message` contains an error message 
     * that can be displayed to the user. Otherwise, `message` is set to the 
     * result that the operation returns. See the function signature for more 
     * details on what value `message` will be.
     */
    message: any;

    /**
     * An error that happened inside the application and can be thrown. If set, 
     * we assume that the error hasn't been logged yet. Nonetheless, this error 
     * must never be shown to the end user. The `message` attribute should be 
     * used to let the user know what happened.
     */
    internalError?: Error;

    /** Usually set when `status = 3xx`. */
    redirectURL?: string;
};

/** A utility method for handling pending errors. */
export function handleServerError(err: Error, res: Response) {
    convertObjectToResponse({
        success: false, internalError: err, status: 500, 
        message: "Internal Server Error"
    }, res); 
}

/**
 * @description A function to interpret JSON documents into server responses. It
 * is meant to be used as the last function in the controller modules.
 */
export function convertObjectToResponse(
    messageContainer: IBaseMessage, res: Response): void {
    if (messageContainer.internalError) {
        console.error(messageContainer.internalError);
        res.type(".html");
        res.status(messageContainer.status);
        res.render(
            "pages/5xx_error_page.ejs", { response_JSON: messageContainer }
        );
        return;
    }

    let status = messageContainer.status;
    res.status(status);
    if (status >= 200 && status < 300) {
        res.type("application/json");
        res.json(messageContainer);
    } else if (status >= 300 && status < 400) {
        res.type('html');
        res.redirect(
            status, 
            messageContainer.redirectURL + "?msg=" + encodeURIComponent(messageContainer.message)
        );
    } else if (status >= 400 && status < 500) {
        res.type('html');
        res.render("pages/4xx_error_page.ejs", { response_JSON: messageContainer });
    } else {
        res.type('html');
        res.render("pages/5xx_error_page.ejs", { response_JSON: messageContainer });
    }
};

/** Delete the file found at `filepath` */
export function deleteTempFile(filepath: string): void {
    fs.unlink(filepath, (err) => { 
        if (err) console.error(err); 
    });
};

/**
 * @description Most of my controller code involves waiting for results from a 
 * promise, and then sending that response via the `res` object. This method 
 * prevents unnecessarily duplicated code.
 * 
 * @param {Promise} pendingPromise the promise should be such that calling 
 * `then` delivers the message that needs to be sent to the user.
 * 
 * @param {Response} res a reference to the Express Response object associated 
 * with the pending request 
 */
export function sendResponseFromPromise(pendingPromise: Promise<any>, res: Response) {
    pendingPromise
        .then((results) => { exports.convertObjectToResponse(null, results, res); })
        .catch((err) => { exports.convertObjectToResponse(err, null, res)});
};