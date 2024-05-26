import { css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { CardViewer } from './base-card-viewer.js';
import { PrivateCardResult, trpc } from '../../trpc.js';

import './components/copyable.js';
import { CardsCarouselUpdateCursorDirection } from '../../context/cards-carousel-context.js';

@customElement('editable-card-viewer')
export class EditableCardViewer extends CardViewer {
  @property({ type: Object})
  protected card: PrivateCardResult = null;

  @state()
  protected isEditing = false;

  protected renderCard() {
    if (!this.card) {
      throw new Error('No card to render');
    }

    const description = this.splitDescription;
    if (!description) {
      throw new Error('No description to render');
    }

    return html`
      <div id='top-row'>
        <button @click=${this.closeDialog}>
          &#10006; Close
        </button>
        ${this.renderShareableLink()}
      </div>
      <div>
        ${when(
          description.prompt, () => html`
            <div class='prompt'>
              ${description.prompt}
            </div>
          `)}
        ${when(
          description.response, () => html`
            <div class='response'>
              ${description.response}
            </div>
          `)}
      </div>
      <div id='action-row'>
        <button @click=${() => this.deleteCard()}>
          &#x2716; Delete
        </button>
        <button
            @click=${() => this.updateCarouselCursor(CardsCarouselUpdateCursorDirection.Previous)}
            ?disabled=${!this.cardsCarousel?.hasPrevious()}>
          &#x276E; Previous
        </button>
        <button
            @click=${() => this.updateCarouselCursor(CardsCarouselUpdateCursorDirection.Next)}
            ?disabled=${!this.cardsCarousel?.hasNext()}>
          Next &#x276F;
        </button>
        <button @click=${() => this.saveCard()}>
          &#x1F4BE; Save
        </button>
      </div>
    `;
  }

  static styles = [
    ...super.styles,
    css`
      div#top-row {
        display: flex;
        justify-content: space-between;
        flex-direction: row-reverse;
      }

      div#action-row {
        display: flex;
        justify-content: space-between;
      }
    `,
  ];

  private renderShareableLink() {
    if (!this.card) {
      throw new Error('No card to render');
    }

    return this.card.isPublic
      ? html`
          <cg-copyable>
            <span>${document.location.origin}/browse/?cardID=${this.card._id}</span>
          </cg-copyable>
        `
      : nothing;
  }

  private saveCard() {
    if (!this.card) {
      throw new Error('No card to save');
    }

    trpc.updateCard.mutate({
      _id: this.card._id,
      title: this.card.title,
      description: this.card.description,
      tags: this.card.tags,
      urgency: this.card.urgency,
      isPublic: this.card.isPublic,
    });
  }

  private deleteCard() {
    if (!this.card) {
      throw new Error('No card to delete');
    }

    trpc.deleteCard.mutate({
      _id: this.card._id,
    });
  }
}
