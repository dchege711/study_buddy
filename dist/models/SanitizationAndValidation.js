"use strict";
/**
 * Provide functionality for sanitizing and validating user input on the server.
 *
 * @module
 */
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var showdown = require("showdown");
var xss = require("xss");
/**
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
var converter = new showdown.Converter({
    headerLevelStart: 4, literalMidWordUnderscores: true,
    literalMidWordAsterisks: true, simpleLineBreaks: true,
    emoji: true, backslashEscapesHTMLTags: false, tables: true,
    parseImgDimensions: true, simplifiedAutoLink: true,
    strikethrough: true, tasklists: true, openLinksInNewWindow: true,
    disableForced4SpacesIndentedSublists: true
});
/**
 * @description Return `card` after it has been sanitized. Sanitization helps
 * prevent malicious actions, e.g an XSS attack. Sanitization is done in place.
 */
function sanitizeCard(card) {
    if (card.title !== undefined) {
        card.title = xss(card.title);
    }
    if (card.description !== undefined) {
        var outputHTML = converter.makeHtml(String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", ""], ["", ""])), card.description.replace(/\\/g, "\\\\")));
        // Otherwise, the HTML renders with '&nbsp;' literals instead of spaces
        outputHTML = xss(outputHTML).replace(/&amp;nbsp;/g, "&nbsp;");
        if (outputHTML.match(/\[spoiler\]/i)) {
            outputHTML = outputHTML.replace(/\[spoiler\]/i, "<span id='spoiler'>[spoiler]</span>");
            outputHTML += "<span id=\"spoiler_end\"></span>";
        }
        // @ts-ignore
        card.descriptionHTML = outputHTML;
    }
    if (card.urgency !== undefined) {
        card.urgency = Number(card.urgency);
        if (Number.isNaN(card.urgency))
            card.urgency = 10;
        if (card.urgency > 10)
            card.urgency = 10;
        else if (card.urgency < 0)
            card.urgency = 0;
    }
    if (card.tags !== undefined) {
        card.tags = xss(card.tags);
    }
    if (card.parent !== undefined) {
        card.parent = xss(card.parent);
    }
    return card;
}
exports.sanitizeCard = sanitizeCard;
/**
 * @description Sanitize `query` and return it.
 */
function sanitizeQuery(query) {
    var keys = Object.keys(query);
    for (var i = 0; i < keys.length; i++) {
        // Delete all values that begin with `$` to prevent NoSQL injection.
        if (/^\$/.test(query[keys[i]].toString()))
            delete query[keys[i]];
    }
    return query;
}
exports.sanitizeQuery = sanitizeQuery;
var templateObject_1;
//# sourceMappingURL=SanitizationAndValidation.js.map