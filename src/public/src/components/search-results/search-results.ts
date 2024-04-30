import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';

import { CardSearchResult } from '../../trpc.js';
import { searchResultsContext, SearchResultSelectedEvent } from '../../context/search-results-context.js';

@customElement('search-result-tag')
export class SearchResultTag extends LitElement {
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

@customElement('search-result')
export class SearchResult extends LitElement {
  @property({ type: Object }) result!: CardSearchResult;

  private dispatchSearchResultSelected() {
    this.dispatchEvent(new SearchResultSelectedEvent(this.result));
  }

  render() {
    return html`
      <article @click=${this.dispatchSearchResultSelected}>
        <p><em>${this.result.title}</em></p>
        <p class='tags-holder'>
          ${this.result.tags?.split(' ').filter(Boolean).map(
            (tag) => html`
              <search-result-tag .tag=${tag}></search-result-tag>
            `
          )}
        </p>
      </article>
    `;
  }

  static styles = css`
    :host {
      border-radius: 6px;
      background-color: var(--card-bg-color);
      box-shadow: 0 4px 10px 0 var(--box-shadow-color);
      flex: none;
      width: 200px;
      padding: 4px;
    }

    p.tags-holder {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 5px;
    }
  `;
}

@customElement('search-results')
export class SearchResults extends LitElement {
  @consume({ context: searchResultsContext, subscribe: true })
  @property({ type: Array })
  results: CardSearchResult[] = [];

  @property({ type: Boolean }) isPrivateSearch = false;

  render() {
    return html`
      ${this.results.map(
          (result) => html`
            <search-result .result=${result}></search-result>`
        )}
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
    }
  `;
}
