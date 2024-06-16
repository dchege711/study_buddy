import { css, html, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { CardsCarouselUpdateCursorDirection } from "../../context/cards-carousel-context.js";
import { PrivateCardResult, trpc } from "../../trpc.js";
import { CardViewer, markdownSpoilerMarker } from "./base-card-viewer.js";
import {
  kCardChangedEventName,
  ModifiableCardAttributes,
} from "./components/card-changed-event.js";

import "./components/copyable.js";
import "./components/editable-card-title.js";
import "./components/card-description.js";
import "./components/editable-card-tags.js";
import "./components/urgency-bar.js";
import "./components/public-private-toggle.js";

type PendingChanges = Partial<
  & Omit<ModifiableCardAttributes, "prompt" | "response">
  & Pick<NonNullable<PrivateCardResult>, "description">
>;

@customElement("editable-card-viewer")
export class EditableCardViewer extends CardViewer {
  constructor() {
    super();
    this.addEventListeners();
  }

  @property({ type: Object })
  public card: PrivateCardResult = null;

  @state()
  protected canEdit = false;

  private pendingChanges: PendingChanges = {};

  protected willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("card")) {
      this.canEdit = false;
    }
    super.willUpdate(changedProperties);
  }

  protected renderCard() {
    if (!this.card) {
      throw new Error("No card to render");
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
                @click=${() => this.canEdit = !this.canEdit}
                ?disabled=${this.canEdit}>
              &#x270E; Edit
            </button>
          </div>
        </div>
        <cg-card-description
          .cardPrompt=${this.cardPrompt}
          .cardResponse=${this.cardResponse}
          .canEdit=${this.canEdit}>
        </cg-card-description>
        <cg-editable-card-tags .tags=${this.tags}></cg-editable-card-tags>
      </div>
      <div id='bottom-card-content'>
        <div class='space-between'>
          <cg-card-urgency-bar .urgency=${this.card.urgency}></cg-card-urgency-bar>
          <cg-card-privacy-toggle .isPublic=${this.card.isPublic}></cg-card-privacy-toggle>
        </div>
        <div class='space-between'>
          <button @click=${() => this.deleteCard()}>
            &#x2716; Delete
          </button>
          <button
              @click=${() =>
      this.updateCarouselCursor(CardsCarouselUpdateCursorDirection.Previous)}
              ?disabled=${!this.cardsCarousel?.hasPrevious()}>
            &#x276E; Previous
          </button>
          <button
              @click=${() =>
      this.updateCarouselCursor(CardsCarouselUpdateCursorDirection.Next)}
              ?disabled=${!this.cardsCarousel?.hasNext()}>
            Next &#x276F;
          </button>
          <button @click=${() => this.saveCard()}>
            &#x1F4BE; Save
          </button>
        </div>
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

      div#bottom-card-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      cg-card-urgency-bar {
        flex-grow: 1;
      }
    `,
  ];

  private addEventListeners() {
    this.addEventListener(kCardChangedEventName, (ev) => {
      if (!this.card) {
        throw new Error("No card to update");
      }

      const updatedPrompt = ev.changes.prompt || this.cardPrompt?.raw || "";
      const updatedResponse = ev.changes.response || this.cardResponse?.raw
        || "";
      const updatedDescription = updatedPrompt
        ? `${updatedPrompt}\n${markdownSpoilerMarker}\n${updatedResponse}`
        : updatedResponse;

      this.pendingChanges = {
        ...this.card,
        title: ev.changes.title || this.card.title,
        description: updatedDescription,
        tags: ev.changes.tags || this.card.tags,
        urgency: ev.changes.urgency || this.card.urgency,
        isPublic: ev.changes.isPublic || this.card.isPublic,
      };
    });
  }

  private renderShareableLink() {
    if (!this.card) {
      throw new Error("No card to render");
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
      throw new Error("No card to save");
    }

    trpc.updateCard.mutate({
      _id: this.card._id,
      ...this.pendingChanges,
    }).then((updatedCard) => {
      this.card = updatedCard;
      this.pendingChanges = {};
    });
  }

  private deleteCard() {
    if (!this.card) {
      throw new Error("No card to delete");
    }

    trpc.deleteCard.mutate({
      _id: this.card._id,
    });
  }
}
