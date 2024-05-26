import { css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { CardViewer } from './base-card-viewer.js';
import { PrivateCardResult } from '../../trpc.js';

import './components/copyable.js';

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

    return html`
      <div id='top-row'>
        <button @click=${this.closeDialog}>
          &#10006; Close
        </button>
        ${this.renderShareableLink()}
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
}
