import React, { createContext, useContext, useState } from "react";
import { ICard } from "../../../../models/mongoose_models/CardSchema";

const CardsContext = createContext({
    /** The cards availed by this provider. */
    cards: new Array<Partial<ICard>>(),

    /** Clear all of the cards held by the provider. */
    resetCards: () => {},

    /** Set the cards availed by this provider. */
    setCards: (cards: Array<Partial<ICard>>) => {}
})

export const useCards = () => useContext(CardsContext);

export default function CardsProvider({ children }: { children: React.ReactNode }) {
    const [cards, setCards] = useState(new Array<Partial<ICard>>());

    // Exposing setCards to the context is not desirable because it allows
    // undocumented downstream modifications, which can lead to bugs and hard
    // debuggability. Instead, expose functions that internally call setCards.
    // These functions can be documented and debugged.

    const resetCards = () => setCards([]);

    const _setCards = (cards: Array<Partial<ICard>>) => setCards(cards);

    return (
        <CardsContext.Provider value={{ cards, resetCards, setCards: _setCards }}>
            {children}
        </CardsContext.Provider>
    )
}
