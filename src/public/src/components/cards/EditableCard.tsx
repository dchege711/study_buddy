import React, { useEffect } from "react";
import { useCards } from "../../partials/CardsHook";
import { ICard } from "../../../../models/mongoose_models/CardSchema";
import { FlagCardParams } from "../../../../models/CardsMongoDB";
import { sendHTTPRequest } from "../../AppUtilities";

export default function EditableCard() {
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

  function displayNewCard() {
    throw new Error("Not implemented");
  }

  function displayRawCardDescription() {
    throw new Error("Not implemented");
  }

  function insertTabsIfNecessary(event: React.KeyboardEvent<HTMLDivElement>) {
    throw new Error("Not implemented");
  }

  function suggestNewTags() {
    throw new Error("Not implemented");
  }

  function removeTagSuggestions() {
    throw new Error("Not implemented");
  }

  function moveCardToTrash() {
    throw new Error("Not implemented");
  }

  function saveCard() {
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
            <p id="shareable_link" className="w3-left"></p>
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
            <label className="input-area-padded padding-small w3-twothird w3-left">
              <input
                type="text"
                id="card_title"
                name="title"
                className="w3-input"
                style={{ fontWeight: "bolder" }}
                defaultValue={activeCard.title}
              />
            </label>

            <button
              className="w3-btn w3-hover-white w3-right"
              onClick={() => displayNewCard()}
            >
              <b>
                <i className="fa fa-plus-square-o fa-fw" aria-hidden="true"></i>{" "}
                Create a New Card
              </b>
            </button>

            <button
              className="w3-btn w3-hover-white w3-right"
              onClick={() => displayRawCardDescription()}
            >
              <b>
                <i
                  className="w3-right fa fa-pencil fa-fw"
                  aria-hidden="true"
                ></i>{" "}
                Edit Card
              </b>
            </button>
          </div>

          <div className="w3-container">
            <div
              className="w3-container"
              id="card_description"
              onKeyDown={(event) => {
                insertTabsIfNecessary(event);
              }}
            ></div>
            <p className="w3-right tooltip">
              <i className="fa fa-fw fa-info-circle" aria-hidden="true"></i>{" "}
              Formatting Help
              <span className="tooltiptext" id="formatting_help_tooltip">
                You can use HTML, Markdown and LaTeX within your card's
                contents.
                <a href="/wiki/#formatting" target="_blank">
                  Read more
                </a>
              </span>
            </p>

            <br />

            <div>
              <strong>Tags: </strong>
              <span id="already_set_card_tags"></span>
              <div className="dropdown">
                <input
                  type="text"
                  id="card_tag_input"
                  placeholder="Add a new tag..."
                  onFocus={() => suggestNewTags()}
                  onBlur={() => window.setTimeout(removeTagSuggestions, 300)}
                  className="w3-input dropbtn"
                />
                <div
                  className="dropdown-content"
                  id="tags_autocomplete_results"
                ></div>
              </div>
            </div>

            <br />

            <div>
              <div className="w3-threequarter w3-left">
                <label className="input-area-padded w3-padding-small">
                  <strong>Urgency</strong>
                  <input
                    id="card_urgency"
                    type="range"
                    name="urgency"
                    className="w3-input"
                    min="0"
                    max="10"
                    step="0.01"
                  />
                </label>
              </div>

              <div className="w3-quarter w3-right">
                <span id="card_urgency_number">
                  <strong></strong>
                </span>
                <label className="w3-right switch tooltip">
                  <input type="checkbox" id="card_is_public_toggle"></input>
                  <span
                    className="slider round"
                    id="card_is_public_label"
                  ></span>
                  <span className="tooltiptext" id="card_is_public_tooltip">
                    <a href="/wiki#public_cards" target="_blank">
                      More about public cards
                    </a>
                  </span>
                </label>
              </div>

              <div className="w3-threequarter w3-left quartile_bar">
                <ul>
                  <li
                    id="zeroth_quartile_marker"
                    style={{ backgroundColor: "none" }}
                  ></li>
                  <li
                    id="first_quartile_marker"
                    style={{ backgroundColor: "green" }}
                  ></li>
                  <li
                    id="second_quartile_marker"
                    style={{ backgroundColor: "orange" }}
                  ></li>
                  <li
                    id="third_quartile_marker"
                    style={{ backgroundColor: "blue" }}
                  ></li>
                  <li
                    id="fourth_quartile_marker"
                    style={{ backgroundColor: "red" }}
                  ></li>
                </ul>
              </div>

              <div className="w3-quarter w3-right tooltip">
                <i className="fa fa-fw fa-info-circle" aria-hidden="true"></i>{" "}
                Help
                <span className="tooltiptext" id="urgency_bar_help_tooltip">
                  The green bar indicates where the urgency values of the first
                  25% of the cards lie. The orange bar does the same for the
                  next 25% of the cards, and so forth.
                  <a href="/wiki/#urgency_bars" target="_blank">
                    Read more.
                  </a>
                </span>
              </div>
            </div>

            <br />

            <div>
              <strong>Card Popularity:</strong>
              <span id="card_popularity">
                {activeCard.idsOfUsersWithCopy?.split(", ").length || 0}
              </span>
            </div>
          </div>

          <div className="w3-bar" style={{ padding: "2%" }}>
            <div className="w3-third w3-left">
              <button
                className="w3-btn w3-round-xxlarge w3-left w3-red"
                onClick={() => moveCardToTrash()}
              >
                <b>
                  <i className="fa fa-trash-o fa-fw" aria-hidden="true"></i>{" "}
                  Delete Card
                </b>
              </button>
              <button
                className="w3-right w3-btn w3-round-xxlarge w3-blue"
                onClick={() => fetchPreviousCard()}
              >
                <b>
                  <i className="fa fa-chevron-left"></i> Previous
                </b>
              </button>
            </div>

            <div className="w3-center w3-third">
              <div className="popup">
                <span
                  className="popuptext w3-center w3-padding-small"
                  id="card_popup_element"
                ></span>
              </div>
            </div>

            <div className="w3-right w3-third">
              <button
                className="w3-left w3-btn w3-round-xxlarge w3-blue"
                onClick={() => fetchNextCard()}
              >
                <b>
                  <i className="fa fa-chevron-right"></i> Next
                </b>
              </button>

              <button
                className="w3-btn w3-round-xxlarge w3-right w3-green"
                onClick={() => saveCard()}
              >
                <b>
                  <i className="fa fa-floppy-o fa-fw" aria-hidden="true"></i>
                  Save Card
                </b>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
