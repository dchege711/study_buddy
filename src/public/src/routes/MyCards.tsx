import React from "react";
import TagsBar from "../partials/TagsBar";
import SearchBar from "../partials/SearchBar";
import CardsProvider from "../partials/CardsHook";
import SearchResults from "../partials/SearchResults";
import MetadataProvider from "../partials/MetadataHook";
import CardSearchResult from "../partials/CardSearchResult";

export default function MyCards() {
  return (
    <MetadataProvider endpoint="/read-metadata">
      <CardsProvider endpoint="/read-card">
        <div className="w3-container" id="status_bar">
          <div id="card_search_container" className="w3-half">
            <SearchBar endpoint="/search-cards" />
          </div>
          <div className="w3-half">
            <div className="w3-threequarter w3-row">Streak</div>
            <div className="w3-quarter">Review Mode</div>
          </div>
        </div>

        <div>
        <p className="w3-left w3-quarter w3-container tooltip">The Tagging and Urgency System</p>
        <p id="filter_list" className="w3-right w3-threequarter w3-container"></p>
        </div>

        <div className="w3-container">
          <div className="w3-container" id="temp_container">
            <div className="w3-container">
              <TagsBar />
              <p id="current_tag_selection" className="w3-right"></p>
              <div
                className="w3-threequarter w3-right flexbox"
                id="minicards_search_results"
              >
                <SearchResults />
              </div>
            </div>
          </div>
          <CardSearchResult />
        </div>
      </CardsProvider>
    </MetadataProvider>
  );
}
