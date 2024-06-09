import { html } from "lit";
import { customElement } from "lit/decorators.js";

import { CardSearchQuery, trpc } from "../trpc.js";
import { CardsViewingPage } from "./common/cards-viewing-page.js";

import "../components/search-bar/search-bar.js";
import "../components/search-results/search-results.js";
import "../components/card-viewer/editable-card-viewer.js";

@customElement("home-page")
export class HomePage extends CardsViewingPage {
  constructor() {
    super(trpc.fetchCard.query);
  }

  protected populateTagsAutoComplete() {
    trpc.tagGroups.query()
      .then((tagGroups) => {
        // TODO: Make this easier to hold by having one initialization point.
        this.tagsAutoComplete.initializePrefixTree(tagGroups.flat());
        this.tagsAutoComplete.initializeGraphFromGroups(tagGroups);
      });
  }

  render() {
    return html`
      <search-bar
          .searchEndpoint=${(q: CardSearchQuery) => trpc.searchCards.query(q)}>
      </search-bar>
      <search-results></search-results>
      <editable-card-viewer .card=${this.selectedResult}></editable-card-viewer>
    `;
  }
}
