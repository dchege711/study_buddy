"use strict";

const showdown = require("showdown");
const CardsManager = require("./CardsManager.js");

/**
 * This script assumes that Showdown, MathJAX and HighlightJS have already been 
 * loaded onto the page. 
 */

/* The converter is used to turn the markdown in the cards into html. */
let converter = new showdown.Converter({
    headerLevelStart: 4, literalMidWordUnderscores: true,
    literalMidWordAsterisks: true, simpleLineBreaks: true,
    emoji: true, backslashEscapesHTMLTags: true, tables: true,
    parseImgDimensions: true, simplifiedAutoLink: true,
    strikethrough: true, tasklists: true
});

/**
 * @description An abstraction for basic manipulation of the card object on a 
 * page. Methods that depend on the specific page, e.g. `restoreFromTrash()` are 
 * not implemented in this module. It is up to the concerned page to provide 
 * such methods.
 * 
 * @param {JSON} state Maintains state variables that the card may need when 
 * updating. The state is used as read-only. It is up to the specific page to 
 * define methods to alter the state.
 * 
 * @param {CardsManager} cardsManager 
 */
function CardTemplateController(state) {

    this.state = state;

    /**
     * A data structure that maintains the set of cards that the viewer will 
     * iterate through. Implements convenient methods such as `next()`, 
     * `prev()`, `save()`, etc.
     */
    this.cardsManager = new CardsManager(null, null);

    // this.userMetadata = userMetadata;

    /**
     * @description Set the collection of cards that will be accessible from the 
     * previous/next methods of this Card Template
     */
    this.initializeCards = function(miniCards) {
        return new Promise(function(resolve, reject) {
            this.cardsManager
                .initialize_from_minicards(miniCards)
                .then(function() {
                    this.cardsManager
                        .next((card) => {resolve(card);})
                        .catch((err) => {reject(err);})
                })
                .catch((err) => {reject(err);})

        });
    };

    /**
     * @description Display the next card on the view queue. This method should 
     * be attached to the next button.
     */
    this.fetchNextCard = function() {
        return new Promise(function(resolve, reject) {
            this.cardsManager
                .next((card) => {resolve(card);})
                .catch((err) => {reject(err);})
        });
    };

    /**
     * @description Display the previous card on the view queue. This button should 
     * be attached to the previous button.
     */
    this.fetchPreviousCard = function() {
        return new Promise(function(resolve, reject) {
            this.cardsManager
                .previous((card) => {resolve(card);})
                .catch((err) => {reject(err);})
        });
    };

    /**
    * @description Make the DOM element referenced by the element ID invisible.
    * 
    * @param {String} elementID 
    */
    this.makeInvisible = function(elementID) {
       document.getElementById(elementID).style.visibility = "hidden";
    };

    /**
     * @description Display a popup text for the specified number of milliseconds. 
     * Useful popups include `Saved Card!`, `Out of Cards!`
     * 
     * @param {String} text 
     * @param {Number} timeoutMS 
     */
    this.displayPopUp = function(text, timeoutMS) {
        let popup = document.getElementById("card_popup_element");
        popup.innerHTML = text;
        popup.style.visibility = "visible";
        window.setTimeout(() => {
            this.makeInvisible("card_popup_element")
        }, timeoutMS);
    };

    /**
     * @description Set the dimensions of the spoiler cover so that it
     * hides the intended content.
     */ 
    this.syncSpoilerBox = function() {
        // These two elements exist whenever there is a spoiler. 
        // We use them to determine the height of the obscuring cover.
        let spoiler = document.getElementById("spoiler");
        let spoiler_end = document.getElementById("spoiler_end");

        if (spoiler && spoiler_end) {
            let spoiler_bbox = spoiler.getBoundingClientRect();
            let spoiler_end_bbox = spoiler_end.getBoundingClientRect();
            // Only the difference matters. No biggie that the coordinates are not absolute.
            // Reduce the width because the card_description HTMLElement is padded
            let spoiler_box_html = `
                <div id="spoiler_box" 
                style="height:${spoiler_end_bbox.bottom - spoiler_bbox.top}px; 
                width:${document.getElementById("card_description").getBoundingClientRect().width - 30}px" 
                onclick="makeInvisible('spoiler_box')">
                <p>Hover/Click to Reveal</p></div>
            `;
            let existing_spoiler_cover = document.getElementById("spoiler_box");
            if (existing_spoiler_cover) {
                existing_spoiler_cover.innerHTML = spoiler_box_html;
            } else {
                spoiler.insertAdjacentHTML("beforebegin", spoiler_box_html);
            }
        }
    }


}

module.exports = CardTemplateController;

