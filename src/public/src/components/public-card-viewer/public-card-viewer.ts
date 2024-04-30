import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { consume } from '@lit/context';

import { FlagCardParams, PublicCardResult, trpc } from '../../trpc.js';
import { atomOneLight } from '../syntax-highlighting.styles.js';
import { CardsCarouselUpdateCursorDirection, CardsCarouselUpdateCursorEvent, cardsCarouselContext } from '../../context/cards-carousel-context.js';
import { CardsCarousel } from '../../CardsCarousel.js';

enum FlagReason {
  Inappropriate = 1,
  Duplicate = 2,
}

@customElement('public-card-viewer')
export class PublicCardViewer extends LitElement {
  @property({ type: Object}) card: PublicCardResult = null;

  @consume({ context: cardsCarouselContext })
  public cardsCarousel?: CardsCarousel;

  private cardDialogRef: Ref<HTMLDialogElement> = createRef();

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('card') && this.card) {
      this.cardDialogRef.value?.showModal();
    }
  }

  private flagCard(reason: FlagReason) {
    if (!this.card) {
      throw new Error('No card to flag');
    }

    let flagCardParams : FlagCardParams = { cardID: this.card._id };
    switch (reason) {
      case FlagReason.Inappropriate:
        flagCardParams.markedForReview = true;
        break;
      case FlagReason.Duplicate:
        flagCardParams.markedAsDuplicate = true;
        break;
    }

    trpc.flagCard.mutate(flagCardParams);
  }

  private updateCarouselCursor(direction: CardsCarouselUpdateCursorDirection) {
    if (!this.cardsCarousel) {
      return;
    }

    let event = new CardsCarouselUpdateCursorEvent(direction);
    this.dispatchEvent(event);
  }

  render() {
    return html`
      <dialog ${ref(this.cardDialogRef)}>
        ${this.renderCard()}
      </dialog>
    `
  }

  private renderCard() {
    if (!this.card) {
      return nothing;
    }

    return html`
      <div id='top-row'>
        <button @click=${() => this.cardDialogRef.value?.close()}>
          &#10006; Close
        </button>
      </div>

      <h3>${this.card.title}</h3>

      <div>
        ${unsafeHTML(this.card.descriptionHTML)}
      </div>
      <p><em>Tags: </em> ${this.card.tags}</p>

      <div class='action-row'>
        <button @click=${() => this.flagCard(FlagReason.Inappropriate)}>
          Flag as Inappropriate
        </button>
        <button @click=${() => this.flagCard(FlagReason.Duplicate)}>
          Flag as Duplicate
        </button>
        <button disabled>
          Copy to My Collection
        </button>
      </div>

      <div class='action-row'>
      <button
            @click=${() => this.updateCarouselCursor(CardsCarouselUpdateCursorDirection.Previous)}
            ?disabled=${this.cardsCarousel?.hasPrevious()}>
          View Similar Card
        </button>
        <button
            @click=${() => this.updateCarouselCursor(CardsCarouselUpdateCursorDirection.Next)}
            ?disabled=${this.cardsCarousel?.hasNext()}>
          View Similar Card
        </button>
      </div>
    `;
  }

  static styles = [
    css`
      ::backdrop {
        backdrop-filter: blur(0.1rem);
      }

      dialog {
        max-width: 80%;
        border: 1px solid var(--main-border-color);
        border-radius: 4px;

        div#top-row {
          display: flex;
          justify-content: flex-end;
        }

        div.action-row {
          display: flex;
          justify-content: space-between;
        }
      }
    `,
    atomOneLight
  ];
}
