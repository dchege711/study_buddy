import { css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { CardViewer } from './base-card-viewer.js';
import { PrivateCardResult } from '../../trpc.js';

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

    const shareableLink = this.card.isPublic
      ? html`<p>${document.location.origin}/browse/?cardID=${this.card._id}</p>`
      : nothing;

    return html`
      <div id='top-row'>
        ${shareableLink}
        <button @click=${this.closeDialog}>
          &#10006; Close
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
      }

      div#action-row {
        display: flex;
        justify-content: space-between;
      }
    `,
  ];
}
