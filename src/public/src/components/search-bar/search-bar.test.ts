import { expect, fixture, html, oneEvent } from "@open-wc/testing";

import {
  kSearchResultsChangedEventName,
  SearchResultsChangedEvent,
} from "../../context/search-results-context.js";
import { CardSearchQuery, trpc } from "../../trpc.js";

import "./search-bar.js";

describe("search-bar", () => {
  it("should fetch initial results on load", async () => {
    const parentNode = document.createElement("div");
    await fixture(
      html`
        <search-bar
          .searchEndpoint=${(q: CardSearchQuery) =>
        trpc.searchPublicCards.query(q)}>
        </search-bar>
    `,
      { parentNode },
    );

    const { results } = await oneEvent(
      parentNode,
      kSearchResultsChangedEventName,
    ) as SearchResultsChangedEvent;
    expect(results.length).to.be.greaterThan(0);
  });
});
