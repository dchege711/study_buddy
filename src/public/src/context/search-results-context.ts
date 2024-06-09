import { createContext } from "@lit/context";

import { CardSearchResult } from "../trpc.js";

export const kSearchResultsChangedEventName = "search-results";

export class SearchResultsChangedEvent extends Event {
  results: CardSearchResult[];

  constructor(results: CardSearchResult[]) {
    super(kSearchResultsChangedEventName, { bubbles: true, composed: true });
    this.results = results;
  }
}

export const kSearchResultSelectedEventName = "search-result-selected";

export class SearchResultSelectedEvent extends Event {
  result: CardSearchResult;

  constructor(result: CardSearchResult) {
    super(kSearchResultSelectedEventName, { bubbles: true, composed: true });
    this.result = result;
  }
}

export const searchResultsContext = createContext<CardSearchResult[]>(
  Symbol("search-results-context"),
);

declare global {
  interface GlobalEventHandlersEventMap {
    "search-results": SearchResultsChangedEvent;
    "search-result-selected": SearchResultSelectedEvent;
  }
}
