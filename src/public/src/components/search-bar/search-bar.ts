import { css, html, LitElement, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { createRef, Ref } from "lit/directives/ref.js";

import { SearchResultsChangedEvent } from "../../context/search-results-context.js";
import {
  CardSearchEndpoint,
  CardSearchQuery,
  CardSearchResult,
} from "../../trpc.js";
import {
  InputState,
  kTextInputBlurEvent,
  kTextInputEvent,
  TextInputEvent,
} from "../input/text-input.js";

import "../input/text-input.js";

const kNumResultsWhenTyping = 7;
const kNumResultsWhenEnter = 50;

@customElement("search-bar")
export class SearchBar extends LitElement {
  searchEndpoint: CardSearchEndpoint | null = null;

  @state()
  private searchResults: CardSearchResult[] = [];

  @state()
  private receivedNoResults = false;

  inputRef: Ref<HTMLInputElement> = createRef();

  connectedCallback(): void {
    super.connectedCallback();
    this.maybeFetchInitialResults();
    this.addEventListeners();
  }

  render() {
    const showResults = this.searchResults.length > 0 || this.receivedNoResults;
    return html`
      <cg-text-input
          .placeholder=${"Search card descriptions and titles. Press [Enter] to view all results"}>
      </cg-text-input>
      ${showResults ? this.renderSearchResults() : nothing}
    `;
  }

  private renderSearchResults() {
    return html`
      <div role='presentation' id='search-results-anchor'>
        <ul>
          ${
      this.searchResults.map((card) =>
        html`
            <li @click=${() =>
          this.onSearchResultSelected(card._id)}>${card.title}</li>
          `
      )
    }
          ${
      this.receivedNoResults
        ? html`<li class='gray-text'><em>No cards found</em></li>`
        : html`<li class='gray-text'><em>Press [Enter] to view all matches</em></li>`
    }
        </ul>
      </div>
    `;
  }

  private addEventListeners() {
    this.addEventListener(
      kTextInputEvent,
      (e: TextInputEvent) => this.searchCards(e),
    );
    this.addEventListener(
      kTextInputBlurEvent,
      () => this.clearResultsAfterTimeout(),
    );
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
  private async searchCards(event: TextInputEvent) {
    if (event.state === InputState.InWord) {
      // Do not search mid-word.
      return;
    }

    const stillTyping = event.state === InputState.PressedSpace;

    const cards = await this.fetchResults({
      limit: stillTyping ? kNumResultsWhenTyping : kNumResultsWhenEnter,
      queryString: event.text,
    });

    if (stillTyping) {
      this.searchResults = cards;
      this.receivedNoResults = cards.length === 0;
    } else {
      // Report the search results up the tree, and clear the results.
      this.dispatchSearchResults(cards);
      this.clearResults();
    }
  }

  private clearResultsAfterTimeout() {
    window.setTimeout(this.clearResults.bind(this), 300);
  }

  private clearResults() {
    this.searchResults = [];
    this.receivedNoResults = false;
  }

  private dispatchSearchResults(results: CardSearchResult[]) {
    this.dispatchEvent(new SearchResultsChangedEvent(results));
  }

  private onSearchResultSelected(cardId: string) {
    const results = this.searchResults.filter((result) =>
      result._id === cardId
    );
    this.dispatchSearchResults(results);
    this.clearResults();
  }

  private maybeFetchInitialResults() {
    if (this.searchResults.length !== 0) {
      return;
    }

    this.fetchResults({ limit: kNumResultsWhenEnter, queryString: "" }).then(
      (results) => {
        this.dispatchSearchResults(results);
      },
    );
  }

  private fetchResults(searchQuery: CardSearchQuery) {
    if (!this.searchEndpoint) {
      throw new Error("Search endpoint not set");
    }

    return this.searchEndpoint(searchQuery);
  }

  static styles = css`
    :host {
      width: 100%;
      display: flex;
      flex-direction: column;
    }

    div#search-results-anchor {
      /**
       * We want the <ul> to float in the page above everything else (position:
       * absolute). Wrap it in a <div> which will be its closest positioned
       * ancestor.
       */
      position: relative;

      ul {
        text-overflow: ellipsis;
        position: absolute;
        background: white;
        z-index: 10;
        width: 100%;

        /** Need it flush with the search box; user agent comes with spacing. */
        margin: 0;
        padding: 0;

        li {
          border-bottom: 1px solid lightgray;
          padding: 1%;
          list-style-type: none;

          &:hover {
            color: white;
            background: black;
            cursor: pointer;
          }

          &.gray-text {
            color: gray;
          }
        }
      }
    }
  `;
}
