"use strict";

const showdown = require("showdown");
const xss = require("xss");

/* The converter is used to turn the markdown in the cards into html. */
const converter = new showdown.Converter({
    headerLevelStart: 4, literalMidWordUnderscores: true,
    literalMidWordAsterisks: true, simpleLineBreaks: true,
    emoji: true, backslashEscapesHTMLTags: false, tables: true,
    parseImgDimensions: true, simplifiedAutoLink: true,
    strikethrough: true, tasklists: true, openLinksInNewWindow: true,
    disableForced4SpacesIndentedSublists: true
});


/**
 * @description Sanitize the card to prevent malicious input, e.g XSS attack
 * 
 * @param {JSON} card A card object that is about to be saved into the 
 * database.
 * 
 * @returns {JSON} sanitized card
 */
exports.sanitizeCard = function(card) {
    if (card.title !== undefined) {
        card.title = xss(card.title);
    }

    if (card.description !== undefined) {
        let outputHTML = converter.makeHtml(
            String.raw`${card.description.replace(/\\/g, "\\\\")}`
        );

        // Otherwise, the HTML renders with '&nbsp;' literals instead of spaces
        outputHTML = xss(outputHTML).replace(/&amp;nbsp;/g, "&nbsp;");

        if (outputHTML.match(/\[spoiler\]/i)) {
            outputHTML = outputHTML.replace(
                /\[spoiler\]/i, "<span id='spoiler'>[spoiler]</span>"
            );
            outputHTML += `<span id="spoiler_end"></span>`;
        }

        card.descriptionHTML = outputHTML;
    }

    if (card.urgency !== undefined) {

        card.urgency = Number(card.urgency);
        if (Number.isNaN(card.urgency)) card.urgency = 10;
        
        if (card.urgency > 10) card.urgency = 10;
        else if (card.urgency < 0) card.urgency = 0;
    }

    if (card.tags !== undefined) {
        card.tags = xss(card.tags);
    }

    if (card.parent !== undefined) {
        card.parent = xss(card.parent);
    }

    return card;
}

/**
 * @description Prevent a NoSQL Injection in the search parameters. This is 
 * achieved by deleting all query values that begin with `$`.
 * 
 * @param {Object} query A mapping of query values, e.g. {username: "dchege711"}
 * 
 * @returns {Object} A sanitized version of the input.
 */
exports.sanitizeQuery = function(query) {

    let keys = Object.keys(query);
    for (let i = 0; i < keys.length; i++) {
        if (/^\$/.test(query[keys[i]])) delete query[keys[i]];
    }
    return query;
}