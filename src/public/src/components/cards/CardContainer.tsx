import React, { useEffect } from "react";

import { useCards } from "../../partials/CardsHook";

/**
 * A modal container for different types of flashcards. Offers common
 * functionality like selecting the next/previous card in the queue, and closing
 * the modal.
 *
 * @param children The content of the card container.
 *
 * @param statusText The text to display in the status bar. Might be overriden
 * by the card container, e.g., if the user runs out of cards.
 *
 * @returns {React.JSX.Element}
 */
export default function CardContainer({
  children,
  statusText = "",
}: {
  children: React.ReactNode;
  statusText: string;
}): React.JSX.Element {
  const { cardsManager, activeCard, setActiveCard } = useCards();
  const [_statusText, setStatusText] = React.useState(statusText);
  const [shouldDisplay, setShouldDisplay] = React.useState(true);

  async function fetchPreviousCard() {
    let card = await cardsManager.previous();
    if (!card) {
      setStatusText(`No more cards.`);
      return;
    }

    setActiveCard(card._id);
  }

  async function fetchNextCard() {
    let card = await cardsManager.next();
    if (!card) {
      setStatusText(`No more cards.`);
      return;
    }

    setActiveCard(card._id);
  }

  useEffect(() => {
    setShouldDisplay(true);
  }, [activeCard]);

  useEffect(() => {
    if (_statusText.length > 0) {
      window.setTimeout(() => {
        setStatusText("");
      }, 3000);
    }
  }, [_statusText]);

  if (!activeCard || !shouldDisplay) {
    return <></>;
  }

  return (
    <div id="card_modal" className="w3-modal" style={{ display: "block" }}>
      <div id="card_container_holder" className="w3-modal-content">
        <div id="card_container" className="w3-card card_borders">
          <div>
            <button
              className="w3-right w3-btn w3-hover-red"
              onClick={() => {
                setShouldDisplay(false);
              }}
            >
              <strong>&#10006; Close</strong>
            </button>
          </div>
          {children}
          <div className="w3-bar w3-padding-16">
            <button
              className="w3-left w3-third w3-btn w3-round-xxlarge"
              onClick={fetchPreviousCard}
            >
              <b>
                <i className="fa fa-chevron-left"></i> Previous
              </b>
            </button>

            <div className="w3-center w3-third">
              <div className="popup">
                <span
                  className="popuptext w3-center w3-padding-small"
                  id="card_popup_element"
                >
                  {statusText}
                </span>
              </div>
            </div>

            <button
              className="w3-right w3-btn w3-third w3-round-xxlarge"
              onClick={fetchNextCard}
            >
              <b>
                Next <i className="fa fa-chevron-right"></i>
              </b>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
