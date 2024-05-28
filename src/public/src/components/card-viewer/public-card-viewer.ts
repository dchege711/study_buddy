import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { CardViewer } from './base-card-viewer.js';
import { FlagCardParams, PublicCardResult, trpc } from '../../trpc.js';
import { CardsCarouselUpdateCursorDirection } from '../../context/cards-carousel-context.js';

import './components/card-description.js';
import '../tags/view-only-tag.js';

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

      <div id='main-card-content'>
        <h3>${this.card.title}</h3>
        <cg-card-description
          .cardPrompt=${this.cardPrompt}
          .cardResponse=${this.cardResponse}
          .canEdit=${false}>
        </cg-card-description>
        <p>
        ${repeat(
            this.tags, (tag) => tag,
            (tag) => html`<cg-view-only-tag .tag=${tag}></cg-view-only-tag>`
          )}
        </p>
      </div>

      <div id='action-row'>
        <button
            @click=${() => this.updateCarouselCursor(CardsCarouselUpdateCursorDirection.Previous)}
            ?disabled=${!this.cardsCarousel?.hasPrevious()}>
          &#x276E; View Similar Card
        </button>
        <button @click=${() => this.flagCard(FlagReason.Inappropriate)}>
          Flag as Inappropriate
        </button>
        <button @click=${() => this.flagCard(FlagReason.Duplicate)}>
          Flag as Duplicate
        </button>
        <button disabled>
          Copy to My Collection
        </button>
        <button
            @click=${() => this.updateCarouselCursor(CardsCarouselUpdateCursorDirection.Next)}
            ?disabled=${!this.cardsCarousel?.hasNext()}>
          View Similar Card &#x276F;
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

      div#action-row {
        display: flex;
        justify-content: space-between;
      }

      div#main-card-content {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        gap: 4px;
      }
    `,
  ];
}
