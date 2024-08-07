import { consume } from "@lit/context";
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { when } from "lit/directives/when.js";
import {
  searchResultsContext,
  SearchResultSelectedEvent,
} from "../../context/search-results-context.js";
import { CardSearchResult } from "../../trpc.js";

import "../tags/card-tag.js";

@customElement("search-result")
export class SearchResult extends LitElement {
  @property({ type: Object })
  result!: CardSearchResult;

  private dispatchSearchResultSelected() {
    this.dispatchEvent(new SearchResultSelectedEvent(this.result));
  }

  render() {
    return html`
      <article @click=${this.dispatchSearchResultSelected}>
        <p><em>${this.result.title}</em></p>
        <p class='tags-holder'>
          ${
      this.result.tags?.split(" ").filter(Boolean).map(
        (tag) =>
          html`
              <cg-card-tag .tag=${tag}></cg-card-tag>
            `,
      )
    }
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

@customElement("search-results")
export class SearchResults extends LitElement {
  @consume({ context: searchResultsContext, subscribe: true })
  @property({ type: Array })
  results: CardSearchResult[] = [];

  render() {
    return html`
      ${
      this.results.map(
        (result) =>
          html`
            <search-result .result=${result}></search-result>`,
      )
    }
      ${when(this.results.length === 0, () => html`<p>No results found</p>`)}
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
