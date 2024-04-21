import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { trpc, CardSearchResult } from '../../trpc.js';

@customElement('search-bar')
export class SearchBar extends LitElement {
  @property({ type: Boolean }) privateSearch = false;

  @state() private searchResults: CardSearchResult[] = [];
  @state() private receivedNoResults = false;

  inputRef: Ref<HTMLInputElement> = createRef();

  render() {
    return html`
      <input
          id='card_search_input'
          placeholder='Search card descriptions and titles. Press [Enter] to view all results'
          @keydown=${this.searchCards}
          @blur=${this.clearResultsAfterTimeout}
          ${ref(this.inputRef)}>
      <ul id='card_search_results'>
        ${this.searchResults.map((card) => html`
          <li @click=${() => this.clearResults()}>${card.title}</li>
        `)}
        ${this.receivedNoResults
        ? html`<li class='gray-text'><em>No cards found</em></li>`
        : html`<li class='gray-text'><em>Press [Enter] to view all matches</em></li>`}
      </ul>
    `;
  }

  /**
   * @description
   * Provide search results for queries typed in the search bar.
   * We want to strike a balance between making frequent hits to the database
   * and providing search feedback as the user types. Therefore:
   *  - If the user pressed the space bar, ask the server for the top 7 results.
   *  - If the user pressed 'Enter', ask the server for all results.
   *  - If the user clicks on any of the 7 results, display that card and stop.
   *
   * To minimize the amount of data being transferred between the client and
   * the database as the user types a query, the server returns partial
   * cards. These partial cards contain the `_id, urgency, title` fields and
   * nothing else. We display the titles in the dropdown menu that gets
   * updated as the user continues searching. Once the user has decided on
   * which card(s) to view, we use the already built functions to load the
   * card, i.e. first check if the card is in the cache, otherwise, fetch the
   * full card from the database.
   */
  private searchCards(event: KeyboardEvent) {
    const queryString = this.inputRef.value?.value.trim() || '';
    if (queryString.length === 0) {
      return;
    }

    const cardFetcher = this.privateSearch ? trpc.searchCards : trpc.searchPublicCards;
    cardFetcher
      .query({ queryString, limit: 7 })
      .then((cards) => {
        this.searchResults = cards;
        this.receivedNoResults = cards.length === 0;
      });
  }

  private clearResultsAfterTimeout() {
    window.setTimeout(this.clearResults, 300);
  }

  private clearResults() {
  }

  static styles = css`
    input {
      border: none;
      border-bottom: 0.2px solid black;
      width: 100%;
      min-height: 40px;
      padding: 1%;
      margin-right: 10%;
    }

    ul {
      text-overflow: ellipsis;
      width: 49%;
      position: absolute;
      background: white;
      z-index: 10;
      padding: 2%;
      margin: 0;
    }

    ul > li {
      border-bottom: 1px solid lightgray;
      padding: 4px;
      list-style-type: none;
    }

    ul > li:hover {
      color: white;
      background: black;
      cursor: pointer;
    }

    .gray-text {
      color: gray;
    }
  `;
}

