import React from "react";
import TagsBar from "../partials/TagsBar";
import SearchBar from "../partials/SearchBar";
import CardsProvider from "../partials/CardsHook";
import SearchResults from "../partials/SearchResults";
import MetadataProvider from "../partials/MetadataHook";

export default function Browse() {
  return (
    <MetadataProvider endpoint="/read-public-metadata" payload={{}}>
      <CardsProvider endpoint="/read-public-card">
        <div className="w3-container">
          <div id="card_search_container" className="w3-half">
            <SearchBar endpoint="/browse" />
          </div>
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
          <div id="card_modal" className="w3-modal">
            <div id="card_container_holder" className="w3-modal-content">
              ../partials/search_result_card_template.ejs
            </div>
          </div>
        </div>
      </CardsProvider>
    </MetadataProvider>
  );
}
