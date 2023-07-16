import React, { useState, useRef, useEffect } from "react";
import { ICard } from "../../../models/mongoose_models/CardSchema";
import { SearchPublicCardParams } from "../../../models/CardsMongoDB";
import { sendHTTPRequest } from "../AppUtilities";
import { useCards } from "./CardsHook";

interface SearchBarState {
  isStillTyping: boolean;
  searchQuery: SearchPublicCardParams | null;
}

/**
 * @returns The search bar. Queries the server for matching cards then displays
 * the top results in a dropdown list.
 */
export default function SearchBar({ endpoint }: { endpoint: string }) {
  const [searchBarState, setSearchBarState] = useState<SearchBarState>({
    isStillTyping: false,
    searchQuery: null,
  });
  const [searchResults, setSearchResults] = useState<Partial<ICard>[]>([]);

  const searchQueryRef = useRef<HTMLInputElement | null>(null);

  function maybeSendSearchQuery(event: React.KeyboardEvent<HTMLInputElement>) {
    // Only query the server if the user has entered a complete word or is
    // done typing.
    const keyPress = event.key;
    if (keyPress !== " " && keyPress !== "Enter") {
      return;
    }

    // Ignore empty queries.
    const queryString = searchQueryRef.current!.value.trim();
    if (queryString === "") {
      return;
    }

    // Trigger a searchQuery change, which will trigger its useEffect hook.
    const isStillTyping = keyPress === " ";
    const limit = isStillTyping ? 7 : Infinity;
    setSearchBarState({ isStillTyping, searchQuery: { queryString, limit } });
  }

  useEffect(() => {
    if (!searchBarState.searchQuery) {
      return;
    }

    sendHTTPRequest("POST", endpoint, searchBarState.searchQuery).then(
      (cards: Partial<ICard>[]) => {
        setSearchResults(cards);
      }
    );
  }, [searchBarState.searchQuery]);

  const { setCards } = useCards();

  /** JSX collection of all the search results. */
  const searchResultsAsJSX = searchResults.map((card) => (
    <li
      key={card._id}
      onClick={() => {
        setCards([card]);
      }}
    >
      {card.title}
    </li>
  ));

  function blurSearchResults() {
    setSearchBarState({ isStillTyping: false, searchQuery: null });
    setSearchResults([]);
  }

  const showNonZeroSearchResults =
    searchBarState.isStillTyping && searchResultsAsJSX.length > 0;
  const showZeroResults =
    searchBarState.searchQuery && !showNonZeroSearchResults;
  const showSearchResults = showNonZeroSearchResults || showZeroResults;

  return (
    <div className="dropdown">
      <input
        type="text"
        ref={searchQueryRef}
        id="card_search_input"
        placeholder="Search card descriptions and titles. Press [Enter] to view all results"
        onKeyDown={(event) => {
          maybeSendSearchQuery(event);
        }}
        className="dropbtn"
        onBlur={() => window.setTimeout(blurSearchResults, 300)}
      />
      {showSearchResults && (
        <div className="dropdown-content" id="card_search_results">
          <ul>
            {showZeroResults && (
              <li className="gray-text" key="zero-results">
                <em>No cards found</em>
              </li>
            )}
            {showNonZeroSearchResults && searchResultsAsJSX}
          </ul>
        </div>
      )}
    </div>
  );
}
