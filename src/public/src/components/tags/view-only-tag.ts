import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('cg-view-only-tag')
export class ViewOnlyTagElement extends LitElement {
  @property({ type: String }) tag!: string;

  render() {
    return html`
      <span>#${this.tag}</span>
    `;
  }

  static styles = css`
    span {
      background-color: var(--main-bg-color);
      border-radius: 4px;
      border: 1px solid var(--main-border-color);
      padding: 2px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cg-view-only-tag': ViewOnlyTagElement;
  }
}
