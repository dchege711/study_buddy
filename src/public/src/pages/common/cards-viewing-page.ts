import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { provide } from '@lit/context';

import { CardsCarouselUpdateCursorDirection, cardsCarouselContext, kCardsCarouselUpdateCursorEventName } from '../../context/cards-carousel-context.js';
import { CardsCarousel, CardsCarouselBSTKey } from '../../models/cards-carousel.js';
import { kSearchResultsChangedEventName, searchResultsContext, SearchResultsChangedEvent, kSearchResultSelectedEventName, SearchResultSelectedEvent } from '../../context/search-results-context.js';
import { trpc, CardSearchResult, Card, CardFetchEndpoint } from '../../trpc.js';

import '../../components/search-bar/search-bar.js';
import '../../components/search-results/search-results.js';
import '../../components/card-viewer/public-card-viewer.js';

export class CardsViewingPage extends LitElement {
  @provide({ context: searchResultsContext })
  @state() protected searchResults: CardSearchResult[] = [];
  @state() protected selectedResult: Card | null = null;

  @provide({ context: cardsCarouselContext })
  @state() protected cardsCarousel = new CardsCarousel([]);

  protected cardFetcher: CardFetchEndpoint;

  constructor(cardFetcher: CardFetchEndpoint) {
    super();
    this.cardFetcher = cardFetcher;
    this.addEventListeners();
  }

  render() {
    throw new Error('CardsViewingPage must be subclassed and implement render()');
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
    if (!this.cardFetcher) {
      throw new Error('CardFetcher must be set before calling updateSelectedCard');
    }

    this.cardFetcher({ cardID }).then((card) => {
      if (!card) {
        throw new Error(`Card with ID ${cardID} not found`);
      }

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
