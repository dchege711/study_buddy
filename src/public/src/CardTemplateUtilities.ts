"use strict";

/**
 * @description A collection of common operations that are carried out on the
 * card templates across different situations.
 *
 * @module
 */

/**
 * @description Make the DOM element invisible.
 */
export function makeInvisible(elementID: string) {
    let elem = document.getElementById(elementID);
    if (elem) elem.style.visibility = "hidden";
};

/**
 * @description Display a popup text for the specified number of milliseconds.
 * Useful popups include `Saved Card!`, `Out of Cards!`
 *
 * @param {String} text
 * @param {Number} timeoutMS
 */
export function displayPopUp(text: string, timeoutMS: number) {
    let popup = document.getElementById("card_popup_element");
    if (!popup) {
        throw new Error("Could not find the popup element.");
    }

    popup.innerHTML = text;
    popup.style.visibility = "visible";
    window.setTimeout(() => { makeInvisible("card_popup_element")}, timeoutMS);
};

/**
 * @description Set the dimensions of the spoiler cover so that it
 * hides the intended content.
 */
export function syncSpoilerBox() {
    // These two elements exist whenever there is a spoiler.
    // We use them to determine the height of the obscuring cover.
    let spoiler = document.getElementById("spoiler");
    let spoiler_end = document.getElementById("spoiler_end");

    if (!spoiler || !spoiler_end) return;

    let spoiler_bbox = spoiler.getBoundingClientRect();
    let spoiler_end_bbox = spoiler_end.getBoundingClientRect();
    // Only the difference matters. No biggie that the coordinates are not absolute.
    // Reduce the width because the card_description HTMLElement is padded
    let width =
        (document.getElementById("card_description")?.getBoundingClientRect().width  || spoiler_bbox.width) - 30;
    let spoiler_box_html = `
        <div id="spoiler_box"
        style="height:${spoiler_end_bbox.bottom - spoiler_bbox.top}px;
        width:${width}px"
        onclick="makeInvisible('spoiler_box')"></div>
    `;
    let existing_spoiler_cover = document.getElementById("spoiler_box");
    if (existing_spoiler_cover) {
        existing_spoiler_cover.innerHTML = spoiler_box_html;
    } else {
        spoiler.insertAdjacentHTML("beforebegin", spoiler_box_html);
    }
};

