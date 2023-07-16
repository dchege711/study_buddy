import React from "react";
import { useCards } from "./cards/CardsHook";

export default function SearchResults() {
  const { cards } = useCards();

  if (cards.length === 0) {
    return (
      <div className="w3-container">
        <p>No cards found.</p>
      </div>
    );
  }

  function displayFullCard(cardID: string) {
    throw new Error("Not implemented");
  }

  return cards.map((card) => (
    <div
      className="w3-card-4 w3-padding-small w3-margin minicard_search_result"
      onClick={() => {
        displayFullCard(card._id);
      }}
      key={card._id}
    >
      <header className="w3-container w3-pale-green">
        <h4>{card.title}</h4>
      </header>
      <div className="w3-container">
        <p>
          <strong>Tags: </strong>
          <span id={`tags${card._id}`}>
            {card.tags && card.tags.split(/\s/).join(", ")}
          </span>
        </p>
      </div>
    </div>
  ));
}
