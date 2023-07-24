import React, { useState, useEffect } from "react";

import { useCards } from "../../partials/CardsHook";
import CardContainer from "./CardContainer";
import { useTags } from "../../partials/TagsBar";

function TitleInput({
  title,
  setTitle,
}: {
  title: string;
  setTitle: (title: string) => void;
}): React.JSX.Element {
  return (
    <label className="input-area-padded padding-small w3-twothird w3-left">
      <input
        type="text"
        id="card_title"
        name="title"
        className="w3-input"
        style={{ fontWeight: "bolder" }}
        placeholder="Add a title to your card"
        defaultValue={title}
        onChange={(event) => setTitle(event.target.value)}
      />
    </label>
  );
}

export function QuartilesBar({ quartiles }: { quartiles: number[] }) {
  if (quartiles.length !== 5) {
    throw new Error(
      `Incorrect number of quartiles. Expected 5 values but got ${quartiles.length}:`
    );
  }

  let barWidthPercentages = [Math.floor(quartiles[0] * 10), 0, 0, 0, 0];
  for (let i = 1; i < quartiles.length; i++) {
    barWidthPercentages[i] = Math.floor((quartiles[i] - quartiles[i - 1]) * 10);
  }

  return (
    <ul className="quartile_bar">
      <li
        id="zeroth_quartile_marker"
        style={{
          backgroundColor: "none",
          width: `${barWidthPercentages[0]}%`,
        }}
      ></li>
      <li
        id="first_quartile_marker"
        style={{
          backgroundColor: "green",
          width: `${barWidthPercentages[1]}%`,
        }}
      ></li>
      <li
        id="second_quartile_marker"
        style={{
          backgroundColor: "orange",
          width: `${barWidthPercentages[2]}%`,
        }}
      ></li>
      <li
        id="third_quartile_marker"
        style={{
          backgroundColor: "blue",
          width: `${barWidthPercentages[3]}%`,
        }}
      ></li>
      <li
        id="fourth_quartile_marker"
        style={{
          backgroundColor: "red",
          width: `${barWidthPercentages[4]}%`,
        }}
      ></li>
    </ul>
  );
}

function UrgencyQuartilesBar() {
  const { cardsManager } = useCards();
  return (
    <>
      <div className="w3-threequarter w3-left">
        <QuartilesBar quartiles={cardsManager.quartiles()} />
      </div>
      <div className="w3-quarter w3-right tooltip">
        <i className="fa fa-fw fa-info-circle" aria-hidden="true"></i> Help
        <span className="tooltiptext" id="urgency_bar_help_tooltip">
          The green bar indicates where the urgency values of the first 25% of
          the cards lie. The orange bar does the same for the next 25% of the
          cards, and so forth.
          <a href="/wiki/#urgency_bars" target="_blank">
            Read more.
          </a>
        </span>
      </div>
    </>
  );
}

function SetTag({
  tag,
  removeTag,
}: {
  tag: string;
  removeTag: (tag: string) => void;
}): React.JSX.Element {
  return (
    <>
      <button className="card_tag_button_text">{tag}</button>
      <button
        id="card_tag_remove_${new_tag}"
        className="card_tag_button_remove"
        onClick={() => removeTag(tag)}
      >
        <i className="fa fa-times fa-fw" aria-hidden="true"></i>
      </button>
    </>
  );
}

function SuggestedTag({
  tag,
  addTag,
}: {
  tag: string;
  addTag: (tag: string) => void;
}): React.JSX.Element {
  return (
    <button
      className="autocomplete_suggestion_button"
      onClick={() => addTag(tag)}
    >
      {tag}
    </button>
  );
}

function EditableTags({
  tags,
  addTag,
  removeTag,
}: {
  tags: Set<string>;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}): React.JSX.Element {
  const { tagsAutoComplete } = useTags();

  const [suggestedTags, setSuggestedTags] = useState([] as string[]);

  function suggestNewTags() {
    let suggestedTags = tagsAutoComplete.kNeighbors(Array.from(tags), 5);
    setSuggestedTags(suggestedTags);
  }

  function removeTagSuggestions() {
    setSuggestedTags([]);
  }

  return (
    <div>
      <strong>Tags: </strong>
      <span id="already_set_card_tags">
        {Array.from(tags).map((tag) => (
          <SetTag tag={tag} key={tag} removeTag={removeTag} />
        ))}
      </span>
      <div className="dropdown">
        <input
          type="text"
          id="card_tag_input"
          placeholder="Add a new tag..."
          onFocus={() => suggestNewTags()}
          onBlur={() => window.setTimeout(removeTagSuggestions, 300)}
          className="w3-input dropbtn"
        />
        <div className="dropdown-content" id="tags_autocomplete_results">
          {suggestedTags.map((tag) => (
            <SuggestedTag tag={tag} key={tag} addTag={addTag} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CreateNewCardButton({
  onClick,
}: {
  onClick: () => void;
}): React.JSX.Element {
  return (
    <button className="w3-btn w3-hover-white w3-right" onClick={onClick}>
      <b>
        <i className="fa fa-plus-square-o fa-fw" aria-hidden="true"></i> Create
        a New Card
      </b>
    </button>
  );
}

function EditCardButton({
  onClick,
}: {
  onClick: () => void;
}): React.JSX.Element {
  return (
    <button className="w3-btn w3-hover-white w3-right" onClick={onClick}>
      <b>
        <i className="w3-right fa fa-pencil fa-fw" aria-hidden="true"></i> Edit
        Card
      </b>
    </button>
  );
}

function Description({
  displayRawDescription,
  description,
  setDescription,
  descriptionHTML,
}: {
  displayRawDescription: boolean;
  description: string;
  setDescription: (description: string) => void;
  descriptionHTML: string;
}): React.JSX.Element {
  function insertTabsIfNecessary(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
      document.execCommand("insertText", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
    }
  }

  function RawDescription(): React.JSX.Element {
    return (
      <div
        className="w3-container"
        id="card_description"
        onKeyDown={(event) => {
          insertTabsIfNecessary(event);
        }}
        contentEditable={true}
        onChange={(event) => {
          setDescription(event.currentTarget.innerText);
        }}
        suppressContentEditableWarning={true}
      >
        {description}
      </div>
    );
  }

  function ReadOnlyDescription(): React.JSX.Element {
    return (
      <div
        className="w3-container"
        id="card_description"
        dangerouslySetInnerHTML={{ __html: descriptionHTML }}
      ></div>
    );
  }

  return (
    <>
      {displayRawDescription ? <RawDescription /> : <ReadOnlyDescription />}
      <p className="w3-right tooltip">
        <i className="fa fa-fw fa-info-circle" aria-hidden="true"></i>
        Formatting Help
        <span className="tooltiptext" id="formatting_help_tooltip">
          You can use HTML, Markdown and LaTeX within your card's contents.
          <a href="/wiki/#formatting" target="_blank">
            Read more
          </a>
        </span>
      </p>
    </>
  );
}

function UrgencySlider({
  urgency,
  setUrgency,
}: {
  urgency: number;
  setUrgency: (urgency: number) => void;
}): React.JSX.Element {
  return (
    <label className="input-area-padded w3-padding-small">
      <strong>Urgency</strong>
      <input
        id="card_urgency"
        type="range"
        name="urgency"
        className="w3-input"
        min="0"
        max="10"
        value={urgency}
        onChange={(event) => setUrgency(Number(event.target.value))}
        step="0.01"
      />
    </label>
  );
}

function IsPublicToggle({
  isPublic,
  setIsPublic,
}: {
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
}): React.JSX.Element {
  return (
    <label className="w3-right switch tooltip">
      <input
        type="checkbox"
        id="card_is_public_toggle"
        checked={isPublic}
        onChange={() => {
          setIsPublic(!isPublic);
        }}
      ></input>
      <span className="slider round" id="card_is_public_label"></span>
      <span className="tooltiptext" id="card_is_public_tooltip">
        <a href="/wiki#public_cards" target="_blank">
          More about public cards
        </a>
      </span>
    </label>
  );
}

function SaveCardButton({
  onClick,
}: {
  onClick: () => void;
}): React.JSX.Element {
  return (
    <div className="w3-right w3-third">
      <button
        className="w3-btn w3-round-xxlarge w3-right w3-green"
        onClick={onClick}
      >
        <b>
          <i className="fa fa-floppy-o fa-fw" aria-hidden="true"></i>
          Save Card
        </b>
      </button>
    </div>
  );
}

function MoveCardToTrashButton({
  onClick,
}: {
  onClick: () => void;
}): React.JSX.Element {
  return (
    <div className="w3-third w3-left">
      <button
        className="w3-btn w3-round-xxlarge w3-left w3-red"
        onClick={onClick}
      >
        <b>
          <i className="fa fa-trash-o fa-fw" aria-hidden="true"></i> Delete Card
        </b>
      </button>
    </div>
  );
}

export default function EditableCard() {
  const { activeCard, setActiveCard, setEmptyCard, cardsManager } = useCards();
  const [statusText, setStatusText] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionHTML, setDescriptionHTML] = useState("");
  const [urgency, setUrgency] = useState(10);
  const [displayRawDescription, setDisplayRawDescription] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<Set<string>>(new Set());
  const [postURL, setPostURL] = useState<"/add-card" | "/update-card">(
    "/add-card"
  );

  useEffect(() => {
    setTitle(activeCard?.title || "");
    setDescription(activeCard?.description || "");
    setDescriptionHTML(activeCard?.descriptionHTML || "");
    setUrgency(activeCard?.urgency || 10);
    setIsPublic(activeCard?.isPublic || false);
    setTags(
      new Set(
        (activeCard?.tags?.split(",") || [])
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
      )
    );
    setPostURL(activeCard?._id === null ? "/add-card" : "/update-card");
  }, [activeCard]);

  function _setEmptyCard() {
    setEmptyCard();
    setPostURL("/add-card");
  }

  function addTag(tag: string) {
    setTags(new Set(tags.add(tag)));
  }
  function removeTag(tag: string) {
    let newSet = new Set(tags);
    newSet.delete(tag);
    setTags(newSet);
  }

  function moveCardToTrash() {
    cardsManager.removeCard(activeCard!._id);
    if (cardsManager.hasNext()) {
      cardsManager.next().then((card) => setActiveCard(card!.id));
    } else if (cardsManager.hasPrev()) {
      cardsManager.previous().then((card) => setActiveCard(card!.id));
    } else {
      setStatusText("No cards left");
    }
  }

  function saveCard() {
    cardsManager.saveCard(
      {
        title: title,
        description: description,
        urgency: urgency,
        isPublic: isPublic,
        tags: Array.from(tags).join(","),
        createdById: cardsManager.userID,
      },
      postURL
    );
  }

  if (activeCard === null) {
    return <></>;
  }

  return (
    <CardContainer statusText={statusText}>
      <div className="card-header w3-center w3-container">
        <TitleInput title={title} setTitle={setTitle} />
        <CreateNewCardButton onClick={_setEmptyCard} />
        <EditCardButton onClick={() => setDisplayRawDescription(true)} />
      </div>
      <div className="w3-container">
        <Description
          displayRawDescription={displayRawDescription}
          description={description}
          setDescription={setDescription}
          descriptionHTML={descriptionHTML}
        />
        <br />
        <EditableTags tags={tags} addTag={addTag} removeTag={removeTag} />
        <br />
        <div>
          <div className="w3-threequarter w3-left">
            <UrgencySlider urgency={urgency} setUrgency={setUrgency} />
          </div>
          <div className="w3-quarter w3-right">
            <span id="card_urgency_number">
              <strong>{urgency}</strong>
            </span>
            <IsPublicToggle isPublic={isPublic} setIsPublic={setIsPublic} />
          </div>
        </div>
        <UrgencyQuartilesBar />
        <br />
      </div>
      <div className="w3-bar" style={{ padding: "2%" }}>
        <MoveCardToTrashButton onClick={moveCardToTrash} />
        <SaveCardButton onClick={saveCard} />
      </div>
    </CardContainer>
  );
}
