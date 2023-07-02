"use strict";

/**
 * Provide functionality for sanitizing and validating user input on the server.
 *
 * @module
 */

import xss = require("xss")

import { Converter } from "showdown";
import { ICard } from "./mongoose_models/CardSchema";

/*
 * The converter is used to turn the markdown in the cards into html.
 *
 * Since we're targeting users that store somewhat detailed flashcards,
 * Markdown (in addition to LaTEX and syntax highlighting) will prove useful.
 * Manually converting markdown to HTML is a project by itself. Since it's not
 * the main purpose of the app, we were happy to import
 * [Showdown]{@link https://github.com/showdownjs/showdown}. The library looks
 * mature and the documentation is sound.
 *
 * Previously, users had to escape the LaTEX delimiter themselves and also
 * escape underscores within inline LaTEX. This meant lines like `\(p_i = 2\)`
 * had to be written as `\\(p\_i = 2\\)`. ~~With some regular expressions, we
 * were able to support the former approach. We traded computational efficiency
 * *(more code to automatically escape backslashes and replace automatically
 * inserted `<em>, </em>` tags)* for convenience *(users entering normal
 * LaTEX)*. We choose to make this correction on the client side since we can't
 * afford that much storage capacity on the server side.~~

 * We configured `showdown.converter` to escape underscores and asterisks when
 * converting markdown to HTML. Although we had activated these options before,
 * `showdown.converter` wasn't applying them. The bug was fixed on Github. We
 * downloaded the version of `showdown.min.js` available during commit
 * `039dd66256e771716c20a807a2941974ac7c5873`. Since that version works fine,
 * we use my downloaded copy instead of using the version hosted on the CDN
 * since that might change over time. Later versions of the file insert extra
 * whitespace in my code blocks, so we prefer maintaining the version from the
 * above commit.
 *
 * {@tutorial main.editing_cards}
 */
const converter = new Converter({
    headerLevelStart: 4, literalMidWordUnderscores: true,
    literalMidWordAsterisks: true, simpleLineBreaks: true,
    emoji: true, backslashEscapesHTMLTags: false, tables: true,
    parseImgDimensions: true, simplifiedAutoLink: true,
    strikethrough: true, tasklists: true, openLinksInNewWindow: true,
    disableForced4SpacesIndentedSublists: true
});


/**
 * @description Sanitize the card to prevent malicious input, e.g XSS attack.
 *
 * @param {JSON} card A card object that is about to be saved into the
 * database.
 *
 * @returns {JSON} sanitized card
 */
export function sanitizeCard(card: Partial<ICard>): Partial<ICard> {
    /**
     * TODO(dchege711): Ideally, I shouldn't need to call this function
     * manually. Look into [1] for cleaner validation.
     *
     * [1]: https://mongoosejs.com/docs/validation.html
     */
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
 */
export function sanitizeQuery(query: any) {
    let keys = Object.keys(query);
    for (let i = 0; i < keys.length; i++) {
        if (/^\$/.test(query[keys[i]])) delete query[keys[i]];
    }
    return query;
}
