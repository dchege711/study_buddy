import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';

import { FlagCardParams, PublicCard, trpc } from '../../trpc.js';

enum FlagReason {
  Inappropriate = 1,
  Duplicate = 2,
}

@customElement('public-card-viewer')
export class PublicCardViewer extends LitElement {
  @property({ type: Object}) card: PublicCard | null = null;

  private cardDialogRef: Ref<HTMLDialogElement> = createRef();

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('card') && this.card) {
      this.cardDialogRef.value?.showModal();
    }
  }

  private flagCard(reason: FlagReason) {
    let flagCardParams : FlagCardParams = { cardID: this.card?._id as string };
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

      <p>${this.card.description}</p>
      <p><em>Tags: </em> ${this.card.tags}</p>
      <p><em>Num Copies: </em>${this.card.numChildren}</p>

      <div id='action-row'>
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
    `;
  }

  static styles = css`
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

      div#action-row {
        display: flex;
        justify-content: space-between;
      }
    }
  `;
}
