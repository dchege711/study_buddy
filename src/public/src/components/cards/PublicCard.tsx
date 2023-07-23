import React from "react";

import { useCards } from "../../partials/CardsHook";
import { ICard } from "../../../../models/mongoose_models/CardSchema";
import { FlagCardParams } from "../../../../models/CardsMongoDB";
import { sendHTTPRequest } from "../../AppUtilities";
import CardContainer from "./CardContainer";

export default function PublicCard() {
  const { activeCard } = useCards();

  if (!activeCard) {
    return <></>;
  }

  const [statusText, setStatusText] = React.useState("");

  function flagCard(reason: "markedForReview" | "markedAsDuplicate") {
    let payload: FlagCardParams = {
      cardID: activeCard!._id,
    };
    payload[reason] = true;
    sendHTTPRequest("POST", "/flag-card", payload)
      .then((card: ICard) => {
        setStatusText(`${card.title} flagged successfully.`);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function copyCardToOwnCollection() {
    throw new Error("Not implemented");
  }

  return (
    <CardContainer statusText={statusText}>
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
    </CardContainer>
  );
}
