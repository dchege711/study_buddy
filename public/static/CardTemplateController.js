"use strict";

const showdown = require("showdown");
const hljs = require("highlightjs");
const MathJax = require("mathjax");

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
 * @param {CardsManager} cardsManager A data structure that maintains the set of 
 * cards that the viewer will iterate through. Implements convenient methods such 
 * as `next()`, `prev()`, `save()`, etc.
 */
function CardTemplateController(state, cardsManager) {

    // this.state = state;
    this.cardsManager = cardsManager;
    // this.userMetadata = userMetadata;

    /**
     * @description Set the collection of cards that will be accessible from the 
     * previous/next methods of this Card Template
     */
    this.initializeCards = function(miniCards) {
        this.cardsManager.initialize(miniCards, () => {
            this.cardsManager.next((card) => {
                this.renderCard(card);
            });
        });
    };

    /**
     * @description Display the next card on the view queue. This method should 
     * be attached to the next button.
     */
    this.fetchNextCard = function() {
        this.cardsManager.next((card) => {
            if (card.title !== undefined) {
                this.renderCard(card);
            } else {
                displayPopUp("Out of cards!", 1500);
            } 
        });
    };

    /**
     * @description Display the previous card on the view queue. This button should 
     * be attached to the previous button.
     */
    this.fetchPreviousCard = function() {
        this.cardsManager.previous((card) => {
            if (card.title !== undefined) {
                this.renderCard(card);
            } else {
                displayPopUp("Out of cards!", 1500);
            } 
        });
    };

    /**
     * @description Display a new card in the view queue.
     * 
     * @returns {Promise} This method merely updates the card template. It's up 
     * to the caller to add more functionality once the promise resolves.
     */
    this.displayNewCard = function() {
        return new Promise(function(resolve) {
            document.getElementById("card_title").value = "";
            document.getElementById("card_description").innerHTML = "";
            document.getElementById("already_set_card_tags").innerHTML = "";
            document.getElementById("card_is_public_toggle").checked = this.metadata.cardsAreByDefaultPrivate;
    
            document.getElementById("card_urgency").value = 0;
            document.getElementById("card_urgency_number").innerText = "0";

            resolve();
        });
    };

    /**
     * @description Display the provided card in the view queue.
     * 
     * @returns {Promise} This method merely updates the card template. It's up 
     * to the caller to add more functionality once the promise resolves.
     */
    this.renderCard = function(card) {

        return new Promise(function(resolve) {

            if (!card.title && !card.description) { displayNewCard(); return; }
    
            document.getElementById("card_title").value = card.title;
            
            // Workaround for allowing users to omit extra escaping backslashes
            // in their LaTEX. I can't afford to do store this string on the server.
            let description_html = converter.makeHtml(
                String.raw`${card.description.replace(/\\/g, "\\\\")}`
            );
            
            if (description_html.match(/\[spoiler\]/i)) {
                description_html = description_html.replace(
                    /\[spoiler\]/i, "<span id='spoiler'>[spoiler]</span>"
                );
                description_html += `<span id="spoiler_end"></span>`;
            }
            
            let card_description_element = document.getElementById("card_description");
            card_description_element.innerHTML = description_html;
        
            let tags_html = "";
            let tags_array = card.tags.trim().split(" ");
            for (let i = 0; i < tags_array.length; i++) {
                if (tags_array[i].length > 0) {
                    tags_html += `<button id="card_tag_text_${tags_array[i]}" class="card_tag_button_text">${tags_array[i]}</button><button id="card_tag_remove_${tags_array[i]}" class="card_tag_button_remove" onclick="removeTagFromCard('${tags_array[i]}')"> <i class="fa fa-times fa-fw" aria-hidden="true"></i> </button>`;
                }
            }
            document.getElementById("already_set_card_tags").innerHTML = tags_html;
            document.getElementById("card_urgency").value = card.urgency;
            document.getElementById("card_urgency_number").innerText = card.urgency;
            document.getElementById("card_description").removeAttribute("contenteditable");
            
            document.getElementById("card_is_public_toggle").checked = card.isPublic;
        
            let code_elements = document.querySelectorAll('pre code');
            for (let i = 0; i < code_elements.length; i++) {
                hljs.highlightBlock(code_elements[i]);
            }
        
            loadMathJAX();
            syncSpoilerBox();

            resolve();

        });

    }

}


/*******************************************************************************
 * Helper Methods
 * 
 ******************************************************************************/

/**
 * @description Make the DOM element referenced by the element ID invisible.
 * 
 * @param {String} elementID 
 */
function makeInvisible(elementID) {
    document.getElementById(elementID).style.visibility = "hidden";
};

/**
 * @description Display a popup text for the specified number of milliseconds. 
 * Useful popups include `Saved Card!`, `Out of Cards!`
 * 
 * @param {String} text 
 * @param {Number} timeoutMS 
 */
function displayPopUp(text, timeoutMS) {
    let popup = document.getElementById("card_popup_element");
    popup.innerHTML = text;
    popup.style.visibility = "visible";
    window.setTimeout(() => {
        makeInvisible("card_popup_element")
    }, timeoutMS);
}


/**
 * @description Set the dimensions of the spoiler cover so that it
 * hides the intended content.
 */ 
function syncSpoilerBox() {
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

/**
 * @description Reload MathJAX to render new LaTEX
 * http://docs.mathjax.org/en/latest/advanced/typeset.html
 */
function loadMathJAX() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "card_description"]);
}

module.exports = CardTemplateController;

