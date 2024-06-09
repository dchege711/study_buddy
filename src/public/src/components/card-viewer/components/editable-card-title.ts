import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { CardChangedEvent } from "./card-changed-event.js";

@customElement("cg-editable-card-title")
export class EditableCardTitle extends LitElement {
  @property({ type: String })
  value = "";

  @query("input")
  private input!: HTMLInputElement;

  render() {
    return html`
      <input type='text' .value=${this.value} @input=${this.inputChanged} />
    `;
  }

  static styles = css`
    :host {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    input {
      padding: 8px;
      border: none;
      border-bottom: 1px solid var(--main-border-color);
      font-weight: bolder;
    }
  `;

  private inputChanged() {
    this.dispatchEvent(new CardChangedEvent({ title: this.input.value }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "cg-editable-card-title": EditableCardTitle;
  }
}
