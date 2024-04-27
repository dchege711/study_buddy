import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { provide } from '@lit/context';

import { kSearchResultsChangedEventName, searchResultsContext, SearchResultsChangedEvent, kSearchResultSelectedEventName, SearchResultSelectedEvent } from '../context/search-results-context.js';
import { trpc, CardSearchResult, PublicCard } from '../trpc.js';

import '../components/search-bar/search-bar.js';
import '../components/search-results/search-results.js';
import '../components/public-card-viewer/public-card-viewer.js';

@customElement('browse-page')
export class BrowsePage extends LitElement {
  @provide({ context: searchResultsContext })
  @state() private searchResults: CardSearchResult[] = [];
  @state() private selectedResult: PublicCard | null = null;

  @property({ type: Boolean }) isPrivateSearch = false;

  constructor() {
    super();
    this.addEventListeners();
  }

  render() {
    return html`
      <search-bar .privateSearch=${this.isPrivateSearch}></search-bar>
      <search-results .privateSearch=${this.isPrivateSearch}></search-results>
      <public-card-viewer .card=${this.selectedResult}></public-card-viewer>
    `;
  }

  private addEventListeners() {
    this.addEventListener(kSearchResultsChangedEventName, (e) => {
      this.searchResults = (e as SearchResultsChangedEvent).results;
    });

    this.addEventListener(kSearchResultSelectedEventName, (e) => {
      let cardID = (e as SearchResultSelectedEvent).result._id as string | undefined;
      if (!cardID) {
        return;
      }

      trpc.fetchPublicCard.query({ cardID }).then((card) => {
        this.selectedResult = card;
      });
    });
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  `;
}
