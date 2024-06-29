"use strict";

/**
 * Provide functionality for sanitizing and validating user input on the server.
 *
 * @module
 */

import xss = require("xss");

import hljs from "highlight.js";
import katex from "katex";
import type { KatexOptions } from "katex";
import markdownit from "markdown-it";
import texMath from "markdown-it-texmath";
import { isMongoId } from "validator";
import { z } from "zod";

import { ICard } from "./mongoose_models/CardSchema";

function syntaxHighlight(code: string, lang: string): string {
  if (lang && hljs.getLanguage(lang)) {
    const { value } = hljs.highlight(code, {
      language: lang,
      ignoreIllegals: true,
    });
    return `<pre><code class="hljs">${value}</code></pre>`;
  }
  return `<pre><code class="hljs">${
    hljs.highlightAuto(code).value
  }</code></pre>`;
}

const katexOptions: KatexOptions = {
  output: "mathml",
  throwOnError: false,
};

const md: markdownit = markdownit({
  linkify: true,
  html: true,
  langPrefix: "hljs language-",
  highlight: syntaxHighlight,
});
md.use(texMath, {
  engine: katex,
  delimiters: ["dollars", "brackets", "beg_end"],
  katexOptions,
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
        /\[spoiler\]/i,
        "<span id='spoiler'>[spoiler]</span>",
      );
      outputHTML += `<span id="spoiler_end"></span>`;
    }

    card.descriptionHTML = outputHTML;
  }

  if (card.urgency !== undefined) {
    card.urgency = Number(card.urgency);
    if (Number.isNaN(card.urgency)) { card.urgency = 10; }

    if (card.urgency > 10) { card.urgency = 10; }
    else if (card.urgency < 0) { card.urgency = 0; }
  }

  if (card.tags !== undefined) {
    card.tags = xss(card.tags);
  }

  if (card.parent !== undefined) {
    card.parent = xss(card.parent);
  }

  return card;
}

export const readPublicCardParamsValidator = z.object({
  cardID: z.string().refine(isMongoId, {
    message: "Invalid card ID",
  }),
});

export const searchCardsParamsValidator = z.object({
  queryString: z.string(),
  limit: z.number().int().positive(),
  creationStartDate: z.date().optional(),
  creationEndDate: z.date().optional(),
  cardIDs: z.string().optional(),
});

export const searchPublicCardsParamsValidator = searchCardsParamsValidator;
export const searchOwnedCardsParamsValidator = searchCardsParamsValidator;

export const flagCardParamsValidator = z.object({
  cardID: z.string().refine(isMongoId, {
    message: "Invalid card ID",
  }),
  markedForReview: z.boolean().optional(),
  markedAsDuplicate: z.boolean().optional(),
});

export const fetchCardParamsValidator = z.object({
  cardID: z.string().refine(isMongoId, {
    message: "Invalid card ID",
  }),
});

export const addCardParamsValidator = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.string(),
  urgency: z.number().int().positive(),
  isPublic: z.boolean(),
  parent: z.string().refine(isMongoId, {
    message: "Invalid card ID",
  }),
});

export const partialCardValidator = z.object({
  _id: z.string().refine(isMongoId, {
    message: "Invalid card ID",
  }).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.string().optional(),
  urgency: z.number().int().nonnegative().optional(),
  metadataIndex: z.number().int().nonnegative().optional(),
  createdById: z.number().int().optional(),
  isPublic: z.boolean().optional(),
  lastReviewed: z.date().optional(),
  parent: z.string().refine(isMongoId, {
    message: "Invalid card ID",
  }).optional(),
  numChildren: z.number().int().nonnegative().optional(),
  idsOfUsersWithCopy: z.string().optional(),
  numTimesMarkedAsDuplicate: z.number().int().nonnegative().optional(),
  numTimesMarkedForReview: z.number().int().nonnegative().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const trashCardParamsValidator = partialCardValidator.pick({
  _id: true,
}).required();

export const deleteCardParamsValidator = trashCardParamsValidator;

export const duplicateCardParamsValidator = z.object({
  cardID: z.string().refine(isMongoId, {
    message: "Invalid card ID",
  }),
});

export const restoreCardFromTrashParamsValidator = z.object({
  _id: z.string().refine(isMongoId, {
    message: "Invalid card ID",
  }),
});

export const streakParamsValidator = z.object({
  cardIDs: z.array(
    z.string().refine(isMongoId, {
      message: "Invalid card ID",
    }),
  ),
});

export const userSettingsParamsValidator = z.object({
  cardsAreByDefaultPrivate: z.boolean(),
  dailyTarget: z.number().int().nonnegative(),
});
