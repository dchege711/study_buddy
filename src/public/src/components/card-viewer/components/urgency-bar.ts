import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { CardChangedEvent } from "./card-changed-event.js";

@customElement("cg-card-urgency-bar")
export class CardUrgencyBar extends LitElement {
  @property({ type: Number })
  urgency = 0;

  @query("input")
  private input!: HTMLInputElement;

  render() {
    return html`
      <label for='urgency'>Urgency</label>
      <input
          type='range' min='0' max='10' name='urgency' list='markers'
          .value=${this.urgency.toString()}
          @input=${this.updateUrgency}
      />
      <datalist id='markers'>
        <option value='0.0'></option>
        <option value='2.5'></option>
        <option value='5.0'></option>
        <option value='7.5'></option>
        <option value='10.0'></option>
      </datalist>
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
      flex-grow: 1;
    }
  `;

  private updateUrgency() {
    this.urgency = parseFloat(this.input.value);
    this.dispatchEvent(new CardChangedEvent({ urgency: this.urgency }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "cg-card-urgency-bar": CardUrgencyBar;
  }
}
