import {
  expect,
  fixture,
  html,
  nextFrame,
  oneEvent,
  waitUntil,
} from "@open-wc/testing";
import { restore, spy } from "sinon";

import {
  kSearchResultsChangedEventName,
  SearchResultsChangedEvent,
} from "../../context/search-results-context.js";
import { CardSearchQuery, trpc } from "../../trpc.js";

import "./search-bar.js";
import {
  InputState,
  TextInputBlurEvent,
  TextInputEvent,
} from "../input/text-input.js";
import { SearchBar } from "./search-bar.js";

beforeEach(() => {
  // Reset the mocks before each test.
  restore();
});

describe("search-bar", () => {
  async function testFixture() {
    const searchEndpointSpy = spy(trpc.searchPublicCards, "query");
    const searchBar = await fixture(
      html`
        <search-bar
          .searchEndpoint=${(q: CardSearchQuery) =>
        trpc.searchPublicCards.query(q)}>
        </search-bar>
    `,
    ) as SearchBar;
    // await nextFrame();
    return { searchBar, searchEndpointSpy };
  }

  async function displayedSearchResults(searchBar: HTMLElement) {
    const displayedResults = searchBar.shadowRoot?.querySelector("ul");
    if (!displayedResults) {
      return [];
    }
    return Array.from(displayedResults.querySelectorAll("li"));
  }

  it("should fetch initial results on load but not display them in the drop-down", async () => {
    const { searchBar, searchEndpointSpy } = await testFixture();
    expect(searchEndpointSpy.callCount).to.equal(1);

    const displayedResults = await displayedSearchResults(searchBar);
    expect(displayedResults?.length).to.equal(0);
  });

  it("should not fetch results when the user is mid-word", async () => {
    const { searchBar, searchEndpointSpy } = await testFixture();
    searchEndpointSpy.resetHistory();

    const textInputEvent = new TextInputEvent("ma", InputState.InWord);
    searchBar.dispatchEvent(textInputEvent);

    expect(searchEndpointSpy.callCount).to.equal(0);
  });

  it("should fetch results after the user types a word", async () => {
    const { searchBar, searchEndpointSpy } = await testFixture();

    // Update visible results when the user presses space.
    {
      searchEndpointSpy.resetHistory();
      const textInputEvent = new TextInputEvent(
        "math",
        InputState.PressedSpace,
      );
      searchBar.dispatchEvent(textInputEvent);
      expect(searchEndpointSpy.callCount).to.equal(1);

      await nextFrame();

      const displayedResults = await displayedSearchResults(searchBar);
      expect(displayedResults.length).to.be.greaterThan(0);
    }

    // Broadcast search results and reset when the user presses Enter.
    {
      searchEndpointSpy.resetHistory();

      setTimeout(() => {
        const textInputEvent = new TextInputEvent(
          "math",
          InputState.PressedEnter,
        );
        searchBar.dispatchEvent(textInputEvent);
      });

      const { results } = await oneEvent(
        searchBar,
        kSearchResultsChangedEventName,
      ) as SearchResultsChangedEvent;
      expect(results.length).to.be.greaterThan(0);
      expect(searchEndpointSpy.callCount).to.equal(1);

      await nextFrame();

      const displayedResults = await displayedSearchResults(searchBar);
      expect(displayedResults.length).to.be.equal(0);
    }
  });

  it("should clear results on blur", async () => {
    const { searchBar, searchEndpointSpy } = await testFixture();

    // Update visible results when the user presses space.
    {
      searchEndpointSpy.resetHistory();
      const textInputEvent = new TextInputEvent(
        "math",
        InputState.PressedSpace,
      );
      searchBar.dispatchEvent(textInputEvent);
      expect(searchEndpointSpy.callCount).to.equal(1);

      await nextFrame();

      const displayedResults = await displayedSearchResults(searchBar);
      expect(displayedResults.length).to.be.greaterThan(0);
    }

    // Clear results on blur after a timeout.
    {
      searchBar.dispatchEvent(new TextInputBlurEvent());

      await waitUntil(
        async () => {
          const displayedResults = await displayedSearchResults(searchBar);
          return displayedResults.length === 0;
        },
        "Did not clear search results after TextInputBlurEvent",
      );

      const displayedResults = await displayedSearchResults(searchBar);
      expect(displayedResults.length).to.be.equal(0);
    }
  });
});
