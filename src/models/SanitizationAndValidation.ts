"use strict";

/**
 * Provide functionality for sanitizing and validating user input on the server.
 *
 * @module
 */

import xss = require("xss")

import hljs from 'highlight.js';
import markdownit from 'markdown-it';
import katex from 'katex';
import type { KatexOptions } from 'katex';
import texMath from 'markdown-it-texmath';

import { ICard } from "./mongoose_models/CardSchema";

function syntaxHighlight(code: string, lang: string): string {
  if (lang && hljs.getLanguage(lang)) {
    const { value } = hljs.highlight(code, { language: lang, ignoreIllegals: true });
    return `<pre><code class="hljs">${value}</code></pre>`;
  }
  return `<pre><code class="hljs">${hljs.highlightAuto(code).value}</code></pre>`;
}

const katexOptions: KatexOptions = {
  output: 'mathml',
  throwOnError: false,
};

const md: markdownit = markdownit({
  linkify: true,
  html: true,
  langPrefix: 'hljs language-',
  highlight: syntaxHighlight
});
md.use(texMath, {
  engine: katex,
  delimiters: ['dollars', 'brackets', 'beg_end'],
  katexOptions
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
        let outputHTML = md.render(String.raw`${card.description}`);

        // Otherwise, the HTML renders with '&nbsp;' literals instead of spaces
        // outputHTML = xss(outputHTML).replace(/&amp;nbsp;/g, "&nbsp;");

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
