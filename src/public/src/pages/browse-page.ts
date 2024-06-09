import { html } from "lit";
import { customElement } from "lit/decorators.js";

import { CardSearchQuery, trpc } from "../trpc.js";
import { CardsViewingPage } from "./common/cards-viewing-page.js";

import "../components/search-bar/search-bar.js";
import "../components/search-results/search-results.js";
import "../components/card-viewer/public-card-viewer.js";

@customElement("browse-page")
export class BrowsePage extends CardsViewingPage {
  constructor() {
    super(trpc.fetchPublicCard.query);
  }

  protected populateTagsAutoComplete() {
    trpc.publicMetadata.query()
      .then((metadataDocs) => {
        if (metadataDocs.length === 0) {
          throw new Error("No metadata documents found");
        }

        const tags: string[] = [];
        for (const metadataDoc of metadataDocs) {
          tags.push(...Object.keys(metadataDoc.node_information));
        }
        this.tagsAutoComplete.initializePrefixTree(tags);
      });
  }

  render() {
    return html`
      <search-bar
          .searchEndpoint=${(q: CardSearchQuery) =>
      trpc.searchPublicCards.query(q)}>
      </search-bar>
      <search-results></search-results>
      <public-card-viewer .card=${this.selectedResult}></public-card-viewer>
    `;
  }
}
