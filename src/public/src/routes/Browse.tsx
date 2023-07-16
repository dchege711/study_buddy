import React from "react";
import TagsBar from "../partials/TagsBar";

export default function Browse() {
  return (
    <>
      <div className="w3-container">
        <div id="card_search_container" className="w3-half">
          ../partials/search_bar_dropdown.ejs
        </div>
        <div className="w3-container" id="temp_container">
            <TagsBar endpoint="/read-public-metadata" payload={{}}/>
        </div>
      </div>
    </>
  );
}
