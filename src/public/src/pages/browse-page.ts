import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { provide } from '@lit/context';

import { CardsCarouselUpdateCursorDirection, cardsCarouselContext, kCardsCarouselUpdateCursorEventName } from '../context/cards-carousel-context.js';
import { CardsCarousel, CardsCarouselBSTKey } from '../CardsCarousel.js';
import { kSearchResultsChangedEventName, searchResultsContext, SearchResultsChangedEvent, kSearchResultSelectedEventName, SearchResultSelectedEvent } from '../context/search-results-context.js';
import { trpc, CardSearchResult, PublicCardResult } from '../trpc.js';

import '../components/search-bar/search-bar.js';
import '../components/search-results/search-results.js';
import '../components/public-card-viewer/public-card-viewer.js';

@customElement('browse-page')
export class BrowsePage extends LitElement {
  @provide({ context: searchResultsContext })
  @state() private searchResults: CardSearchResult[] = [];
  @state() private selectedResult: PublicCardResult = null;

  @provide({ context: cardsCarouselContext })
  @state() private cardsCarousel = new CardsCarousel([]);

  @property({ type: Boolean }) isPrivateSearch = false;

  constructor() {
    super();
    this.addEventListeners();
  }

  render() {
    return html`
      <search-bar .privateSearch=${this.isPrivateSearch}></search-bar>
      <search-results .privateSearch=${this.isPrivateSearch}></search-results>
      <public-card-viewer .card=${this.selectedResult}></public-card-viewer>
    `;
  }

  private addEventListeners() {
    this.addEventListener(kSearchResultsChangedEventName, (ev) => {
      this.searchResults = ev.results;
      this.cardsCarousel = new CardsCarousel(
        ev.results.map(result => {
          return {
            _id: result._id!,
            urgency: result.urgency!,
          };
        })
      );
    });

    this.addEventListener(kSearchResultSelectedEventName, (ev) => {
      this.updateSelectedCard(ev.result._id!);
    });

    this.addEventListener(kCardsCarouselUpdateCursorEventName, (ev) => {
      switch (ev.direction) {
        case CardsCarouselUpdateCursorDirection.Next:
          if (this.cardsCarousel.hasNext()) this.cardsCarousel.next();
          break;
        case CardsCarouselUpdateCursorDirection.Previous:
          if (this.cardsCarousel.hasPrevious()) this.cardsCarousel.previous();
          break;
      }
      let currentCard = this.cardsCarousel.current();
      if (currentCard) {
        this.updateSelectedCard(currentCard._id);
      }
    });
  }

  private updateSelectedCard(cardID: string) {
    trpc.fetchPublicCard.query({ cardID }).then((card) => {
      this.selectedResult = card;
    });

  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  `;
}
