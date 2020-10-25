/**
 * Provide functionality for sanitizing and validating user input on the server.
 * 
 * @module
 */

import * as showdown from "showdown";
import * as xss from "xss";

import { INewFlashCard, FlashCard } from "./db/DBModels";

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
const converter = new showdown.Converter({
    headerLevelStart: 4, literalMidWordUnderscores: true,
    literalMidWordAsterisks: true, simpleLineBreaks: true,
    emoji: true, backslashEscapesHTMLTags: false, tables: true,
    parseImgDimensions: true, simplifiedAutoLink: true,
    strikethrough: true, tasklists: true, openLinksInNewWindow: true,
    disableForced4SpacesIndentedSublists: true
});

export interface IClientFacingFlashCard extends Partial<FlashCard> {
    /**
     * Internally, the `tags` are not available as a string, but the client
     * doesn't need to know that `tags` are in a separate table. Before
     * returning a card, the `tags` field should be populated.
     */
    tags?: string[];
}

/**
 * @description Return `card` after it has been sanitized. Sanitization helps 
 * prevent malicious actions, e.g an XSS attack. Sanitization is done in place.
 * If `rawDescription` is part of the incoming card, `htmlDescription` will
 * contain a sanitized HTML version of `rawDescription`
 */
export function sanitizeCard(card: INewFlashCard | IClientFacingFlashCard):
    INewFlashCard | IClientFacingFlashCard {
    
    // At least make sure there are no SQL attacks
    card = sanitizeQuery(<ISearchQuery>card);

    if (card.title !== undefined) {
        card.title = xss(card.title);
    }

    if (card.rawDescription !== undefined) {
        let outputHTML = converter.makeHtml(
            String.raw`${card.rawDescription.replace(/\\/g, "\\\\")}`
        );

        // Otherwise, the HTML renders with '&nbsp;' literals instead of spaces
        outputHTML = xss(outputHTML).replace(/&amp;nbsp;/g, "&nbsp;");

        if (outputHTML.match(/\[spoiler\]/i)) {
            outputHTML = outputHTML.replace(
                /\[spoiler\]/i, "<span id='spoiler'>[spoiler]</span>"
            );
            outputHTML += `<span id="spoiler_end"></span>`;
        }

        card.htmlDescription = outputHTML;
    }

    if (card.urgency !== undefined) {

        card.urgency = Number(card.urgency);
        if (Number.isNaN(card.urgency)) card.urgency = 10;
        
        if (card.urgency > 10) card.urgency = 10;
        else if (card.urgency < 0) card.urgency = 0;
    }

    if (card.parentId !== undefined) {
        card.parentId = xss(card.parentId);
    }

    return card;
}

/**
 * This interface is not designed to make sense as a whole. It is a catch all 
 * for any possible key-value pair that we can receive from the server. As such, 
 * all of these properties have better descriptions on the interfaces of the 
 * proper objects, e.g. `dailyTarget` is defined completely in `User`
 */
export interface ISearchQuery {

    [s: string]: number | string | boolean | string[];

    /** The App ID of the user. */
    userIDInApp?: number;

    /** The ID of the user who owns the resource. */
    ownerId?: string;

    /** The index of the metadata document. */
    metadataIndex?: number;

    /** The App ID of the creator of the document being searched for. */
    createdById?: string;

    /** The App ID of the creator of the document being searched for. */
    userId?: string;

    /** The ID of the card. */
    cardId?: string;

    /** A string of card IDs. */
    cardIds?: string[];

    /** Should the user's cards be private unless told otherwise? */
    cardsAreByDefaultPrivate?: boolean;

    /** How many cards does the user want to review per time period? */
    dailyTarget?: number;

    /** What card content is the user searching for? */
    queryString?: string;

    /** What is the maximum number of results that should be fetched? */
    limit?: number;

    /** The timestamp of the earliest date by which the objects were created */
    creationStartDate?: number;

    /** The timestamp of the latest date by which the objects were created */
    creationEndDate?: number;

    /** Is the targeted resource public? */
    isPublic?: boolean;

    /** Has this card been flagged for review? */
    markedForReview?: boolean;

    /** Has this card been flagged as a duplicate? */
    markedAsDuplicate?: boolean;
}

/**
 * @description Sanitize `query` and return it.
 */
export function sanitizeQuery(query: ISearchQuery): ISearchQuery {
    if (!query) return query; // TODO: Is this the way to handle null queries?

    let keys = Object.keys(query);
    for (let i = 0; i < keys.length; i++) {
        let val = query[keys[i]];
        if (!val) continue; // Null values are permitted.
        // Delete all values that begin with `$` to prevent NoSQL injection.
        if (/^\$/.test(query[keys[i]].toString())) delete query[keys[i]];
    }
    return query;
}
