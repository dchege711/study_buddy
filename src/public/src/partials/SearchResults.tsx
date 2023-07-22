import React, { useEffect, useState } from "react";
import { useCards } from "./CardsHook";
import { ICard } from "../../../models/mongoose_models/CardSchema";

export default function SearchResults() {
  const { cardsManager, setActiveCard } = useCards();

  const [ cards, setCards ] = useState<Partial<ICard>[]>([]);

  useEffect(() => {
    // TODO(dchege711): Use suspense instead.
    //
    // [1]: https://github.com/facebook/react/issues/14326
    async function populateCards() {
        const newCards: Partial<ICard>[] = [];
        for (const key of cardsManager) {
            newCards.push(await cardsManager.findCard(key._id));
        }
        setCards(newCards);
    }
    populateCards();
  }, [cardsManager]);

  if (cardsManager.empty()) {
    return (
      <div className="w3-container">
        <p>No cards found.</p>
      </div>
    );
  }

  function displayFullCard(cardID: string) {
    setActiveCard(cardID);
  }

  return cards.map((result) => (
    <div
      className="w3-card-4 w3-padding-small w3-margin minicard_search_result"
      onClick={() => {
        displayFullCard(result._id);
      }}
      key={result._id}
    >
      <header className="w3-container w3-pale-green">
        <h4>{result.title}</h4>
      </header>
      <div className="w3-container">
        <p>
          <strong>Tags: </strong>
          <span id={`tags${result._id}`}>
            {result.tags && result.tags.split(/\s/).join(", ")}
          </span>
        </p>
      </div>
    </div>
  ));
}
