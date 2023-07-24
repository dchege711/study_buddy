import React, { createContext, useContext, useState, useEffect } from "react";
import { ICard, MiniICard } from "../../../models/mongoose_models/CardSchema";
import { CardsManager } from "../CardsManager";
import { useMetadata } from "./MetadataHook";

const CardsContext = createContext({
  /** Holds the cards for the current context. */
  cardsManager: new CardsManager({}, -1),

  /** Clear all of the cards held by the provider. */
  resetCards: () => {},

  /** Set the cards availed by this provider. */
  setCards: (cards: Array<Partial<ICard>>) => {},

  getCard: (id: string) => Promise.reject() as Promise<Partial<ICard>>,

  /** The card that is currently being interacted with. */
  activeCard: null as Partial<ICard> | null,

  setActiveCard: (id: string) => {},

  setEmptyCard: () => {},
});

export const useCards = () => useContext(CardsContext);

export default function CardsProvider({
  children,
  endpoint,
}: {
  children: React.ReactNode;
  endpoint: string;
}) {
  const [miniCards, setMiniCards] = useState<MiniICard[]>([]);

  const { metadata } = useMetadata();
  const metadataNodeInformation = metadata?.node_information[0] ?? {};
  const userID = metadata?.createdById ?? -1;

  const [cardsManager, setCardsManager] = useState(
    new CardsManager(metadataNodeInformation, userID, endpoint)
  );

  const [activeCard, setActiveCard] = useState<Partial<ICard> | null>(null);

  // Exposing useState mutators to the context is not desirable because it
  // allows undocumented downstream modifications, which can lead to bugs and
  // hard debuggability. Instead, expose functions that internally call state
  // mutators. These functions can be documented and debugged.

  const resetCards = () => {
    setCards([]);
  };

  const setCards = (cards: Array<Partial<ICard>>) => {
    setMiniCards(cards);
  };

  const getCard = (cardID: string) => {
    return cardsManager.findCard(cardID);
  };

  const _setActiveCard = (cardID: string) => {
    getCard(cardID)?.then((card) => {
      setActiveCard(card);
    });
  };

  const setEmptyCard = () => {
    let emptyCard: Partial<ICard> = {
      _id: null,
      title: "",
      description: "",
      tags: "",
      createdById: userID,
      urgency: 10,
      isPublic: !metadata?.cardsAreByDefaultPrivate ?? false,
    }
    setActiveCard(emptyCard);
  };

  useEffect(() => {
    let newCardsManager = new CardsManager(
      metadataNodeInformation,
      userID,
      endpoint
    );
    // Prefer initialization from minicards if available. Minicards are used to
    // filter the set of cards being shown to the user.
    if (miniCards.length > 0) {
      newCardsManager.initializeFromMinicards(miniCards);
    } else {
      newCardsManager.initialize();
    }
    setCardsManager(newCardsManager);
  }, [miniCards, metadata]);

  return (
    <CardsContext.Provider
      value={{
        resetCards,
        setCards,
        getCard,
        cardsManager,
        activeCard,
        setActiveCard: _setActiveCard,
        setEmptyCard,
      }}
    >
      {children}
    </CardsContext.Provider>
  );
}
