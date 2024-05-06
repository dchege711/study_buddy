import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { trpc } from '../trpc.js';
import { CardsViewingPage } from './common/cards-viewing-page.js';

import '../components/search-bar/search-bar.js';
import '../components/search-results/search-results.js';
import '../components/card-viewer/public-card-viewer.js';

@customElement('browse-page')
export class BrowsePage extends CardsViewingPage {
  @property({ type: Boolean }) isPrivateSearch = false;

  constructor() {
    super(trpc.fetchPublicCard.query);
  }

  render() {
    return html`
      <search-bar .privateSearch=${this.isPrivateSearch}></search-bar>
      <search-results .privateSearch=${this.isPrivateSearch}></search-results>
      <public-card-viewer .card=${this.selectedResult}></public-card-viewer>
    `;
  }
}
