import { css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { CardViewer, markdownSpoilerMarker } from './base-card-viewer.js';
import { PrivateCardResult, trpc } from '../../trpc.js';
import { CardsCarouselUpdateCursorDirection } from '../../context/cards-carousel-context.js';
import { kCardChangedEventName } from './components/card-changed-event.js';

import './components/copyable.js';
import './components/editable-card-title.js';
import './components/editable-card-description.js';

@customElement('editable-card-viewer')
export class EditableCardViewer extends CardViewer {
  constructor() {
    super();
    this.addEventListeners();
  }

  @property({ type: Object})
  protected card: PrivateCardResult = null;

  @state()
  protected isEditing = false;

  protected renderCard() {
    if (!this.card) {
      throw new Error('No card to render');
    }

    return html`
      <div class='space-between reverse'>
        <button @click=${this.closeDialog}>
          &#10006; Close
        </button>
        ${this.renderShareableLink()}
      </div>
      <div id='main-card-content'>
        <div class='space-between'>
          <cg-editable-card-title .value=${this.card.title}>
          </cg-editable-card-title>
          <div>
            <button
                @click=${() => this.isEditing = !this.isEditing}
                ?disabled=${this.isEditing}>
              &#x270E; Edit
            </button>
          </div>
        </div>
        <div>
          ${when(
            this.cardPrompt, () => html`
              <cg-editable-card-description
                .value=${this.cardPrompt!}
                .isEditing=${this.isEditing}>
              </cg-editable-card-description>
            `)}
          ${when(
            this.cardResponse, () => html`
              <cg-editable-card-description
                .value=${this.cardResponse!}
                .isEditing=${this.isEditing}>
              </cg-editable-card-description>
            `)}
        </div>
      </div>
      <div class='space-between'>
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
      .reverse {
        flex-direction: row-reverse;
      }

      .space-between {
        display: flex;
        gap: 4px;
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

  private addEventListeners() {
    this.addEventListener(kCardChangedEventName, (ev) => {
      if (!this.card) {
        throw new Error('No card to update');
      }

      const updatedPrompt = ev.changes.prompt || this.cardPrompt?.raw || '';
      const updatedResponse = ev.changes.response || this.cardResponse?.raw || '';
      const updatedDescription = updatedResponse
          ? `${updatedPrompt}\n${markdownSpoilerMarker}\n${updatedResponse}`
          : updatedPrompt;

      this.card = {
        ...this.card,
        title: ev.changes.title || this.card.title,
        description: updatedDescription,
        tags: ev.changes.tags || this.card.tags,
        urgency: ev.changes.urgency || this.card.urgency,
        isPublic: ev.changes.isPublic || this.card.isPublic,
      }
    });
  }

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
