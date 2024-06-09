import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { CardChangedEvent } from "./card-changed-event.js";

@customElement("cg-card-privacy-toggle")
export class CardPrivacyToggle extends LitElement {
  @property({ type: Boolean })
  isPublic = false;

  render() {
    return html`
      <input
          type='checkbox' name='isPublic' .checked=${this.isPublic}
          @input=${this.togglePrivacy}
      />
      <label for='isPublic'>Public</label>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      align-items: center;
    }

    input {
      padding: 8px;
      border: none;
    }
  `;

  private togglePrivacy() {
    this.isPublic = !this.isPublic;
    this.dispatchEvent(new CardChangedEvent({ isPublic: this.isPublic }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "cg-card-privacy-toggle": CardPrivacyToggle;
  }
}
