import React, { useEffect } from "react";
import { useCards } from "../../partials/CardsHook";
import { ICard } from "../../../../models/mongoose_models/CardSchema";
import { FlagCardParams } from "../../../../models/CardsMongoDB";
import { sendHTTPRequest } from "../../AppUtilities";

export default function PublicCard() {
  const { cardsManager, activeCard, setActiveCard } = useCards();
  const [popupText, setPopupText] = React.useState("");
  const [shouldDisplay, setShouldDisplay] = React.useState(true);

  async function fetchPreviousCard() {
    let card = await cardsManager.previous();
    if (!card) {
      setPopupText(`No more cards.`);
      return;
    }

    setActiveCard(card._id);
  }

  async function fetchNextCard() {
    let card = await cardsManager.next();
    if (!card) {
      setPopupText(`No more cards.`);
      return;
    }

    setActiveCard(card._id);
  }

  function flagCard(reason: "markedForReview" | "markedAsDuplicate") {
    let payload: FlagCardParams = {
      cardID: activeCard!._id,
    };
    payload[reason] = true;
    sendHTTPRequest("POST", "/flag-card", payload)
      .then((card: ICard) => {
        setPopupText(`${card.title} flagged successfully.`);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    setShouldDisplay(true);
  }, [activeCard]);

  function copyCardToOwnCollection() {
    throw new Error("Not implemented");
  }

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

          <div className="card-header w3-center w3-container">
            <h4 id="card_title">{activeCard.title}</h4>
          </div>

          <div className="w3-container">
            <div
              className="w3-container"
              id="card_description"
              dangerouslySetInnerHTML={{ __html: activeCard.descriptionHTML! }}
            >
              {}
            </div>

            <br />

            <div>
              <strong>Tags:</strong>
              <span id="card_tags">
                {activeCard.tags && activeCard.tags.trim().replace(/\s/g, ", ")}
              </span>
            </div>

            <br />

            <div>
              <strong>Card Popularity:</strong>
              <span id="card_popularity">
                {activeCard.idsOfUsersWithCopy?.split(", ").length || 0}
              </span>
            </div>
          </div>

          <div className="w3-bar w3-padding-16">
            <button
              className="w3-left w3-third w3-btn w3-round-xxlarge"
              onClick={fetchPreviousCard}
            >
              <b>
                <i className="fa fa-chevron-left"></i> View Similar Cards
              </b>
            </button>

            <div className="w3-center w3-third">
              <div className="popup">
                <span
                  className="popuptext w3-center w3-padding-small"
                  id="card_popup_element"
                ></span>
              </div>
            </div>

            <button
              className="w3-right w3-btn w3-third w3-round-xxlarge"
              onClick={fetchNextCard}
            >
              <b>
                View Similar Cards <i className="fa fa-chevron-right"></i>
              </b>
            </button>
          </div>

          <div className="w3-container w3-center w3-bar w3-padding-16">
            <button
              className="w3-btn w3-round-xlarge w3-third w3-left w3-red"
              onClick={() => flagCard("markedForReview")}
            >
              <b>
                <i
                  className="fa fa-exclamation-circle fa-fw"
                  aria-hidden="true"
                ></i>{" "}
                Flag Card as Inappropriate
              </b>
            </button>

            <button
              className="w3-btn w3-round-xlarge w3-third w3-right w3-green"
              onClick={copyCardToOwnCollection}
            >
              <b>
                <i className="fa fa-plus-square fa-fw" aria-hidden="true"></i>
                Add Card to My Collection
              </b>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
