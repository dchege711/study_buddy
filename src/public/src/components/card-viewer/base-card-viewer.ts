import { consume } from "@lit/context";
import {
  css,
  html,
  LitElement,
  nothing,
  PropertyValues,
  TemplateResult,
} from "lit";
import { property } from "lit/decorators.js";
import { createRef, Ref, ref } from "lit/directives/ref.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import {
  cardsCarouselContext,
  CardsCarouselUpdateCursorDirection,
  CardsCarouselUpdateCursorEvent,
} from "../../context/cards-carousel-context.js";
import { CardsCarousel } from "../../models/cards-carousel.js";
import { Card } from "../../trpc.js";

export const markdownSpoilerMarker = "[spoiler]";
const htmlSpoilerMarker = "<span id='spoiler'>[spoiler]</span>";

export enum CardDescriptionType {
  Prompt,
  Response,
}

export interface CardDescription {
  type: CardDescriptionType;
  markup: TemplateResult;
  raw: string;
}

export class CardViewer extends LitElement {
  @property({ type: Object })
  public card: Card | null = null;

  @consume({ context: cardsCarouselContext, subscribe: true })
  protected cardsCarousel?: CardsCarousel;

  protected cardDialogRef: Ref<HTMLDialogElement> = createRef();

  @property({ type: Object })
  protected cardPrompt: CardDescription | null = null;

  @property({ type: Object })
  protected cardResponse: CardDescription | null = null;

  get tags(): Set<string> {
    if (!this.card) {
      return new Set();
    }

    return new Set(this.card.tags.split(" ").filter(Boolean));
  }

  protected willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("card")) {
      this.updatePromptAndResponse();
    }
  }

  updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("card")) {
      if (this.card) {
        this.cardDialogRef.value?.showModal();
      }
    }
  }

  protected updateCarouselCursor(
    direction: CardsCarouselUpdateCursorDirection,
  ) {
    if (!this.cardsCarousel) {
      return;
    }

    const event = new CardsCarouselUpdateCursorEvent(direction);
    this.dispatchEvent(event);
  }

  protected closeDialog() {
    this.cardDialogRef.value?.close();
    this.card = null;
  }

  protected renderCard(): TemplateResult {
    throw new Error("CardViewer must be subclassed and implement renderCard()");
  }

  private updatePromptAndResponse() {
    if (!this.card) {
      this.cardPrompt = null;
      this.cardResponse = null;
      return;
    }

    const combinedRawDescription = this.card.description;
    const combinedHTML = this.card.descriptionHTML;

    const markdownSplitIndex = combinedRawDescription.indexOf(
      markdownSpoilerMarker,
    );
    if (markdownSplitIndex === -1) {
      this.cardPrompt = null;
      this.cardResponse = {
        type: CardDescriptionType.Response,
        markup: html`${unsafeHTML(combinedHTML)}`,
        raw: combinedRawDescription,
      };
      return;
    }

    const htmlSplitIndex = combinedHTML.indexOf(htmlSpoilerMarker);
    if (htmlSplitIndex === -1) {
      throw new Error("HTML and Markdown descriptions are out of sync");
    }

    this.cardPrompt = {
      type: CardDescriptionType.Prompt,
      markup: html`${unsafeHTML(combinedHTML.slice(0, htmlSplitIndex))}`,
      raw: combinedRawDescription.slice(0, markdownSplitIndex),
    };
    this.cardResponse = {
      type: CardDescriptionType.Response,
      markup: html`${
        unsafeHTML(
          combinedHTML.slice(htmlSplitIndex + htmlSpoilerMarker.length),
        )
      }`,
      raw: combinedRawDescription.slice(
        markdownSplitIndex + markdownSpoilerMarker.length,
      ),
    };
  }

  render() {
    if (!this.card) {
      return nothing;
    }

    return html`
      <dialog ${ref(this.cardDialogRef)}>
        ${this.renderCard()}
      </dialog>
    `;
  }

  static styles = [
    css`
      ::backdrop {
        backdrop-filter: blur(0.1rem);
      }

      dialog {
        border: 1px solid var(--main-border-color);
        border-radius: 4px;

        /**
         * Provide spatial stability to the previous/next buttons that are found
         * in the bottom action row. That way, the user can click the same
         * location to move to the next/previous card.
         */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 80%;
        height: 80%;
      }
    `,
  ];
}
