import { css, html, LitElement } from "lit";
import { customElement, queryAssignedElements } from "lit/decorators.js";

/**
 * A class that avails a button for copying its content to the clipboard.
 */
@customElement("cg-copyable")
export class CopyableElement extends LitElement {
  @queryAssignedElements({ flatten: true })
  _contentElements!: HTMLElement[];

  render() {
    return html`
      <span>
        <slot></slot>
      </span>
      <button @click=${this.copyToClipboard}>&#9988; Copy</button>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      gap: 0.5em;
      align-items: flex-start;
    }
  `;

  private copyToClipboard() {
    const textToCopy = this._contentElements.map(element => element.innerText)
      .join("\n");
    navigator.clipboard.writeText(textToCopy);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "cg-copyable": CopyableElement;
  }
}
