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
exports.makeInvisible = function (elementID) {
    document.getElementById(elementID).style.visibility = "hidden";
};
/**
 * @description Display a popup text for the specified number of milliseconds.
 * Useful popups include `Saved Card!`, `Out of Cards!`
 *
 * @param {String} text
 * @param {Number} timeoutMS
 */
exports.displayPopUp = function (text, timeoutMS) {
    var _this = this;
    var popup = document.getElementById("card_popup_element");
    popup.innerHTML = text;
    popup.style.visibility = "visible";
    window.setTimeout(function () {
        _this.makeInvisible("card_popup_element");
    }, timeoutMS);
};
/**
 * @description Set the dimensions of the spoiler cover so that it
 * hides the intended content.
 */
exports.syncSpoilerBox = function () {
    // These two elements exist whenever there is a spoiler. 
    // We use them to determine the height of the obscuring cover.
    var spoiler = document.getElementById("spoiler");
    var spoiler_end = document.getElementById("spoiler_end");
    if (spoiler && spoiler_end) {
        var spoiler_bbox = spoiler.getBoundingClientRect();
        var spoiler_end_bbox = spoiler_end.getBoundingClientRect();
        // Only the difference matters. No biggie that the coordinates are not absolute.
        // Reduce the width because the card_description HTMLElement is padded
        var spoiler_box_html = "\n            <div id=\"spoiler_box\" \n            style=\"height:" + (spoiler_end_bbox.bottom - spoiler_bbox.top) + "px; \n            width:" + (document.getElementById("card_description").getBoundingClientRect().width - 30) + "px\" \n            onclick=\"makeInvisible('spoiler_box')\"></div>\n        ";
        var existing_spoiler_cover = document.getElementById("spoiler_box");
        if (existing_spoiler_cover) {
            existing_spoiler_cover.innerHTML = spoiler_box_html;
        }
        else {
            spoiler.insertAdjacentHTML("beforebegin", spoiler_box_html);
        }
    }
};
//# sourceMappingURL=CardTemplateUtilities.js.map