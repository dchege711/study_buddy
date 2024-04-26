import { createContext } from '@lit/context';

import { CardSearchResult } from '../trpc.js';

export const kSearchResultsChangedEventName = 'search-results';

export class SearchResultsChangedEvent extends Event {
  results: CardSearchResult[];

  constructor(results: CardSearchResult[]) {
    super(kSearchResultsChangedEventName, { bubbles: true, composed: true });
    this.results = results;
  }
}

export const searchResultsContext = createContext<CardSearchResult[]>(
  Symbol('search-results-context'));
