import { LitElement, TemplateResult, css, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { consume } from '@lit/context';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { Card } from '../../trpc.js';
import { CardsCarouselUpdateCursorDirection, CardsCarouselUpdateCursorEvent, cardsCarouselContext } from '../../context/cards-carousel-context.js';
import { CardsCarousel } from '../../CardsCarousel.js';
import { atomOneLight } from '../syntax-highlighting.styles.js';

const spoilerMarker = "<span id='spoiler'>[spoiler]</span>";

export interface CardDescription {
  prompt: TemplateResult | null;
  response: TemplateResult | null;
}

export class CardViewer extends LitElement {
  @property({ type: Object})
  protected card: Card | null = null;

  @consume({ context: cardsCarouselContext, subscribe: true})
  protected cardsCarousel?: CardsCarousel;

  protected cardDialogRef: Ref<HTMLDialogElement> = createRef();

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('card') && this.card) {
      this.cardDialogRef.value?.showModal();
    }
  }

  protected updateCarouselCursor(direction: CardsCarouselUpdateCursorDirection) {
    if (!this.cardsCarousel) {
      return;
    }

    let event = new CardsCarouselUpdateCursorEvent(direction);
    this.dispatchEvent(event);
  }

  protected closeDialog() {
    this.cardDialogRef.value?.close();
    this.card = null;
  }

  protected renderCard(): TemplateResult {
    throw new Error('CardViewer must be subclassed and implement renderCard()');
  }

  get splitDescription(): CardDescription | null {
    if (!this.card) {
      return null;
    }

    let combinedHTML = this.card.descriptionHTML;
    let splitIndex = combinedHTML.indexOf(spoilerMarker);
    if (splitIndex === -1) {
      return {
        prompt: null,
        response: html`${unsafeHTML(combinedHTML)}`,
      };
    }

    return {
      prompt: html`${unsafeHTML(combinedHTML.slice(0, splitIndex))}`,
      response: html`${unsafeHTML(combinedHTML.slice(splitIndex + spoilerMarker.length))}`,
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
    atomOneLight,
  ];
}
