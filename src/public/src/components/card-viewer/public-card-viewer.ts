import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { CardViewer } from './base-card-viewer.js';
import { FlagCardParams, PublicCardResult, trpc } from '../../trpc.js';
import { CardsCarouselUpdateCursorDirection } from '../../context/cards-carousel-context.js';

enum FlagReason {
  Inappropriate = 1,
  Duplicate = 2,
}

@customElement('public-card-viewer')
export class PublicCardViewer extends CardViewer {
  @property({ type: Object})
  protected card: PublicCardResult = null;

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

  protected renderCard() {
    if (!this.card) {
      throw new Error('No card to render');
    }

    return html`
      <div id='top-row'>
        <button @click=${this.closeDialog}>
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
            ?disabled=${!this.cardsCarousel?.hasPrevious()}>
          View Similar Card
        </button>
        <button
            @click=${() => this.updateCarouselCursor(CardsCarouselUpdateCursorDirection.Next)}
            ?disabled=${!this.cardsCarousel?.hasNext()}>
          View Similar Card
        </button>
      </div>
    `;
  }

  static styles = [
    ...super.styles,
    css`
      div#top-row {
        display: flex;
        justify-content: flex-end;
      }

      div.action-row {
        display: flex;
        justify-content: space-between;
      }
    `,
  ];
}
