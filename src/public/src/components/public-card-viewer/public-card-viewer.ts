import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';

import { PublicCard } from '../../trpc.js';

@customElement('public-card-viewer')
export class PublicCardViewer extends LitElement {
  @property({ type: Object}) card: PublicCard | null = null;

  private cardDialogRef: Ref<HTMLDialogElement> = createRef();

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('card') && this.card) {
      this.cardDialogRef.value?.showModal();
    }
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

      <h2>${this.card.title}</h2>
      <p>${this.card.description}</p>
    `;
  }
}
