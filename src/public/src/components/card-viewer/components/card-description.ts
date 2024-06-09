import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { when } from "lit/directives/when.js";

import { CardDescription } from "../base-card-viewer.js";

import "./editable-card-description.js";

@customElement("cg-card-description")
export class CardDescriptionElement extends LitElement {
  @property({ type: Boolean })
  canEdit = false;
  @property({ type: Object })
  cardPrompt!: CardDescription | null;
  @property({ type: Object })
  cardResponse!: CardDescription | null;

  render() {
    return html`
      ${
      when(
        this.cardPrompt,
        () =>
          html`
          <cg-editable-card-description
            .value=${this.cardPrompt!}
            .canEdit=${this.canEdit}>
          </cg-editable-card-description>
        `,
      )
    }
      ${
      when(
        this.cardResponse,
        () =>
          html`
          <cg-editable-card-description
            .value=${this.cardResponse!}
            .canEdit=${this.canEdit}>
          </cg-editable-card-description>
        `,
      )
    }
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "cg-card-description": CardDescriptionElement;
  }
}
