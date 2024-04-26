import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { provide } from '@lit/context';

import { kSearchResultsChangedEventName, searchResultsContext, SearchResultsChangedEvent } from '../context/search-results-context.js';
import { CardSearchResult } from '../trpc.js';

import '../components/search-bar/search-bar.js';
import '../components/search-results/search-results.js';

@customElement('browse-page')
export class BrowsePage extends LitElement {
  @provide({ context: searchResultsContext })
  @state() private searchResults: CardSearchResult[] = [];

  constructor() {
    super();
    this.addEventListeners();
  }

  render() {
    return html`
      <search-bar></search-bar>
      <search-results></search-results>
    `;
  }

  private addEventListeners() {
    this.addEventListener(kSearchResultsChangedEventName, (e) => {
      this.searchResults = (e as SearchResultsChangedEvent).results;
    });
  }
}
