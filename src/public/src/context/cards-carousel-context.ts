import { createContext } from "@lit/context";

import { CardsCarousel } from "../models/cards-carousel.js";

export const kCardsCarouselUpdateCursorEventName =
  "cards-carousel-update-cursor";

export enum CardsCarouselUpdateCursorDirection {
  Next = 1,
  Previous = -1,
}

export class CardsCarouselUpdateCursorEvent extends Event {
  direction: CardsCarouselUpdateCursorDirection;

  constructor(direction: CardsCarouselUpdateCursorDirection) {
    super(kCardsCarouselUpdateCursorEventName, {
      bubbles: true,
      composed: true,
    });
    this.direction = direction;
  }
}

export const cardsCarouselContext = createContext<CardsCarousel>(
  Symbol("cards-carousel-context"),
);

declare global {
  interface GlobalEventHandlersEventMap {
    "cards-carousel-update-cursor": CardsCarouselUpdateCursorEvent;
  }
}
