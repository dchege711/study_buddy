import { TagGroupings, TagGroupingsParam } from "../../models/CardsMongoDB";
import { AuthenticateUser } from "../../models/LogInUtilities";
import { RestoreCardFromTrashParams, SendCardToTrashParams, UpdateStreakParams } from "../../models/MetadataMongoDB";
import { ICard, MiniICard } from "../../models/mongoose_models/CardSchema";
import { IMetadata, IMetadataNodeInformation, IStreak } from "../../models/mongoose_models/MetadataCardSchema";
import { RefreshMetadataResponseMiniCards, getAccountInfo, refreshMetadata, sendHTTPRequest } from "./AppUtilities";
import { AutoComplete } from "./AutoComplete";
import { displayPopUp, syncSpoilerBox } from "./CardTemplateUtilities";
import { CardsManager } from "./CardsManager";
import { renderLatex } from "./Latex";
import { addSyntaxHighlighting } from "./SyntaxHighlighting";
import { getSelectedTags, initializeTagsBar } from "./TagsBarUtilities";

interface HomePageState {
  metadata: IMetadata;
  minicards: RefreshMetadataResponseMiniCards;
  changedItems: Set<string>;
  currentCardID: string | null;
  currentUserID: number;
  rawDescription: string | null;
  selectedTags: Set<string>;
  tagsAndIDs: IMetadataNodeInformation;
  currentCardTags: Set<string>;
  currentCardTagsHaveChanged: boolean;
  cardPostURL: "/add-card" | "/update-card";
  reviewModeToggle: boolean;
  card_is_public_toggle: boolean;
};

interface ElementRefs {
  cardContainerHolderElement: HTMLElement;
  alreadySetTagsElement: HTMLElement;
  cardDescriptionElement: HTMLElement;
  cardIsPublicToggleElement: HTMLInputElement;
  cardPopupElement: HTMLElement;
  cardSearchInputElement: HTMLElement;
  cardSearchResultsElement: HTMLElement;
  abbreviatedCardsElement: HTMLElement;
  cardTagInputElement: HTMLInputElement;
  cardTitleElement: HTMLInputElement;
  cardUrgencyElement: HTMLInputElement;
  cardUrgencyNumberElement: HTMLElement;
  filterListElement: HTMLElement;
  sideBarContentsElement: HTMLElement;
  spoilerElement: HTMLElement;
  spoilerBoxElement: HTMLElement;
  spoilerEndElement: HTMLElement;
  tagsAutocompleteResultsElement:  HTMLElement;
  shareableLinkElement: HTMLElement;
  reviewModeToggleElement: HTMLInputElement;
};

/* If a user is logged in, there'll be some metadata about them in
 * Local Storage.
 */
let state: HomePageState | null, autocomplete: AutoComplete | null, cardsManager: CardsManager | null, elementRefs: ElementRefs | null;

function updateStreakBar(streakObj: IStreak) {
  let streakBarElement = document.getElementById("streak_bar");
  if (!streakBarElement) {
    throw new Error("Could not find streak bar element.");
  }

  let streakWidth = Math.min(
    100,
    (streakObj.cardIDs.length * 100.0) / streakObj.dailyTarget
  );
  streakBarElement.style.width = `${streakWidth}%`;
  streakBarElement.style.backgroundImage =
    `linear-gradient(45deg, #ffc719 20% ${100 - streakWidth}%, #bf033b 100%)`;

  let streakTextElement = document.getElementById("streak_text");
  if (!streakTextElement) {
    throw new Error("Could not find streak text element.");
  }

  streakTextElement.innerText = `Daily Target: ${streakObj.cardIDs.length} / ${streakObj.dailyTarget} (Streak ${streakObj.length})`;
}

export function initializeHomepage() {
  // Maintain references to elements that get searched for often
  elementRefs = {
    cardContainerHolderElement: document.getElementById("card_modal") as HTMLElement,
    alreadySetTagsElement: document.getElementById("already_set_card_tags") as HTMLElement,
    cardDescriptionElement: document.getElementById("card_description") as HTMLElement,
    cardIsPublicToggleElement: document.getElementById("card_is_public_toggle") as HTMLInputElement,
    cardPopupElement: document.getElementById("card_popup_element") as HTMLElement,
    cardSearchInputElement: document.getElementById("card_search_input") as HTMLElement,
    cardSearchResultsElement: document.getElementById("card_search_results") as HTMLElement,
    abbreviatedCardsElement: document.getElementById("minicards_search_results") as HTMLElement,
    cardTagInputElement: document.getElementById("card_tag_input") as HTMLInputElement,
    cardTitleElement: document.getElementById("card_title") as HTMLInputElement,
    cardUrgencyElement: document.getElementById("card_urgency") as HTMLInputElement,
    cardUrgencyNumberElement: document.getElementById("card_urgency_number") as HTMLElement,
    filterListElement: document.getElementById("filter_list") as HTMLElement,
    sideBarContentsElement: document.getElementById("side_bar_contents") as HTMLElement,
    spoilerElement: document.getElementById("spoiler") as HTMLElement,
    spoilerBoxElement: document.getElementById("spoiler_box") as HTMLElement,
    spoilerEndElement: document.getElementById("spoiler_end") as HTMLElement,
    tagsAutocompleteResultsElement: document.getElementById(
      "tags_autocomplete_results"
    ) as HTMLElement,
    shareableLinkElement: document.getElementById("shareable_link") as HTMLElement,
    reviewModeToggleElement: document.getElementById("reviewModeToggle") as HTMLInputElement,
  };

  refreshMetadata()
    .then(({metadata, minicards}) => {
      state = {
        minicards: minicards,
        metadata: metadata,
        changedItems: new Set([]),
        currentCardID: null,
        currentUserID: metadata.createdById,
        rawDescription: null,
        selectedTags: new Set([]),
        tagsAndIDs: metadata.node_information[0],
        currentCardTags: new Set([]),
        currentCardTagsHaveChanged: false,
        cardPostURL: "/add-card",
        reviewModeToggle: false,
        card_is_public_toggle: metadata.cardsAreByDefaultPrivate,
      };

      autocomplete = new AutoComplete();
      autocomplete.initializePrefixTree(Object.keys(state.tagsAndIDs));
      cardsManager = new CardsManager(
        state.tagsAndIDs,
        state.currentUserID,
        "/read-card",
        Array.from(minicards.values())
      );

      initializeTagsBar("side_bar_contents", state.tagsAndIDs);
      initializeCards();
      updateStreakBar(metadata.streak);

      let payload: TagGroupingsParam = {
        userIDInApp: state.currentUserID,
      }
      return sendHTTPRequest("POST", "/read-tag-groups", payload);
    })
    .then((tagGroupings: TagGroupings) => {
      (autocomplete as AutoComplete).initializeGraphFromGroups(tagGroupings);
    })
    .catch((err) => {
      console.error(err);
    });
}

async function refreshMinicards() {
  if (!cardsManager || !state || !elementRefs) {
    throw new Error("Cards manager not initialized.");
  }

  let minicardsHTML = `
                    <div class="w3-card-4 w3-padding-small w3-margin minicard_search_result" onclick="HomePage.displayNewCard()">
                        <header class="w3-container w3-pale-blue"><h4><i class="fa fa-plus-square-o fa-fw" aria-hidden="true"></i> Create a New Card</h4></header>
                    </div>`;
  for (let cardKey of cardsManager) {
    minicardsHTML += `
                    <div class="w3-card-4 w3-padding-small w3-margin minicard_search_result" onclick="HomePage.displayFullCard('${
                      cardKey._id
                    }')">
                        <header class="w3-container w3-pale-green"><h4>${
                          state.minicards.get(cardKey._id)?.title
                        }</h4></header>
                        <div class="w3-container"><p><strong>Tags: </strong>${
                          state.minicards.get(cardKey._id)?.tags
                        }</p></div>
                    </div>`;
  }
  elementRefs.abbreviatedCardsElement.innerHTML = minicardsHTML;
}

export async function displayFullCard(cardID: string) {
  if (cardsManager === null) {
    throw new Error("Cards manager not initialized.");
  }

  let card = await cardsManager.fetchCard(cardID);
  if (!card) {
    throw new Error("Card not found.");
  }

  // 2x so that the spoiler box can have positive dimensions
  renderCard(card);
  renderCard(card);
}

function initializeCards() {
  if (!cardsManager) {
    throw new Error("Cards manager not initialized.");
  }

  cardsManager.initializeFromTags(new Set([]))

  refreshMinicards()
    .then((_) => {
      colorUrgencyQuartiles((cardsManager as CardsManager).quartiles());
    });
}

function fetchCard(cardCaller: () => Promise<Partial<ICard> | null>) {
  if (!state) {
    throw new Error("State not initialized.");
  }

  cardCaller()
    .then((card) => {
      (state as HomePageState).currentCardID = card?._id;
      renderCard(card);
    })
    .catch((err) => {
      if (err) console.error(err);
    });
}

export function fetchPreviousCard() {
  if (!cardsManager) {
    throw new Error("Cards manager not initialized.");
  }

  fetchCard(cardsManager.previous);
}

export function fetchNextCard() {
  if (!cardsManager) {
    throw new Error("Cards manager not initialized.");
  }

  fetchCard(cardsManager.next);
}

export function toggleOption(element_id: "reviewModeToggle" | "card_is_public_toggle") {
  if (!state || !elementRefs) {
    throw new Error("State not initialized.");
  }

  if (element_id === "reviewModeToggle") {
    state.reviewModeToggle = elementRefs.reviewModeToggleElement.checked;
  } else if (element_id === "card_is_public_toggle") {
    state.card_is_public_toggle = elementRefs.cardIsPublicToggleElement.checked;
  }
}

function makeInvisible(element_id: string) {
  let element = document.getElementById(element_id);
  if (element) {
    element.style.visibility = "hidden";
  }
}

function filterCards() {
  if (!elementRefs) {
    throw new Error("Element references not initialized.");
  }
  // I apologize for this embarassing line. :-(
  let tagsToUse = getSelectedTags();

  // Communicate which cards are being displayed...
  if (tagsToUse === null) {
    elementRefs.filterListElement.innerHTML = "Now showing: all";
  } else {
    elementRefs.filterListElement.innerHTML = `Now showing: ${Array.from(
      tagsToUse
    ).join(", ")}`;
  }

  if (!cardsManager) {
    throw new Error("Cards manager not initialized.");
  }

  // Update the cards being displayed
  cardsManager.initializeFromTags(tagsToUse || new Set([]))
  refreshMinicards()
    .then(() => {
      if (!cardsManager) {
        throw new Error("Cards manager not initialized.");
      }
      colorUrgencyQuartiles(cardsManager.quartiles());
    })
    .catch((err) => {
      console.error(err);
    });
}

/**
 * Color the quartile marker with the quartile range for the
 * current selection of cards. The quartile marker is located right
 * below the urgency slider.
 *
 * @param {Array} quartiles The values of the 1st, 2nd, 3rd and 4th
 * quartiles. Assumes the maximum urgency is 10.
 */
function colorUrgencyQuartiles(quartiles: number[]) {
  if (quartiles.length == 5) {
    let barWidthIDs = [
      "zeroth_quartile_marker",
      "first_quartile_marker",
      "second_quartile_marker",
      "third_quartile_marker",
      "fourth_quartile_marker",
    ];
    let barWidthPercentages = [Math.floor(quartiles[0] * 10), 0, 0, 0, 0];
    for (let i = 1; i < quartiles.length; i++) {
      barWidthPercentages[i] = Math.floor(
        (quartiles[i] - quartiles[i - 1]) * 10
      );
    }

    for (let i = 0; i < barWidthIDs.length; i++) {
      let element = document.getElementById(barWidthIDs[i]);
      if (element) element.style.width = `${barWidthPercentages[i]}%`;
    }
  }
}

function renderCard(card: Partial<ICard> | null) {
  if (!elementRefs) {
    throw new Error("Element references not initialized.");
  }
  if (!card) {
    displayPopUp("Out of cards!", 1500);
    elementRefs.cardContainerHolderElement.style.display = "block";
    return;
  }

  if (!state) {
    throw new Error("State not initialized.");
  }

  state.currentCardTags.clear();
  state.currentCardTagsHaveChanged = false;
  state.changedItems = new Set([]);

  // Reset card contents
  if (!card.description) card.description = "";
  if (!card.tags) card.tags = "";
  if (!card.title) card.title = "";
  if (!card.urgency) card.urgency = 0;

  elementRefs.cardTitleElement.value = card.title;
  elementRefs.cardDescriptionElement.innerHTML = card.descriptionHTML as string;

  let tagsHTML = "";
  var tagsArray = card.tags.trim().split(" ");
  for (let i = 0; i < tagsArray.length; i++) {
    if (tagsArray[i].length > 0) {
      tagsHTML += `<button id="card_tag_text_${tagsArray[i]}" class="card_tag_button_text">${tagsArray[i]}</button><button id="card_tag_remove_${tagsArray[i]}" class="card_tag_button_remove" onclick="removeTagFromCard('${tagsArray[i]}')"> <i class="fa fa-times fa-fw" aria-hidden="true"></i> </button>`;
      state.currentCardTags.add(tagsArray[i]);
    }
  }
  elementRefs.alreadySetTagsElement.innerHTML = tagsHTML;
  elementRefs.cardUrgencyElement.value = `${card.urgency}`;
  elementRefs.cardUrgencyNumberElement.innerText = `${card.urgency}`;
  elementRefs.cardDescriptionElement.removeAttribute("contenteditable");
  elementRefs.cardIsPublicToggleElement.checked = card.isPublic as boolean;
  state.card_is_public_toggle = card.isPublic as boolean;
  if (card.isPublic) {
    elementRefs.shareableLinkElement.innerText = `${document.location.origin}/browse/?cardID=${card._id}`;
  } else {
    elementRefs.shareableLinkElement.innerText = "";
  }

  // Reset the contents of the current_card variable
  state.currentCardID = card._id;
  state.cardPostURL = "/update-card";
  state.rawDescription = card.description;

  addSyntaxHighlighting();
  renderLatex(["card_description"]);
  syncSpoilerBox();

  elementRefs.cardContainerHolderElement.style.display = "block";

  // Update the streak counter
  let payload: UpdateStreakParams = {
    userIDInApp: state.currentUserID,
    cardIDs: [state.currentCardID as string],
  };
  sendHTTPRequest("POST", "/update-streak", payload)
    .then((streak: IStreak) => {
      updateStreakBar(streak);
    })
    .catch((err) => {
      if (err) console.error(err);
    });
}

export function displayRawCardDescription() {
  if (!state || !elementRefs) {
    throw new Error("State not initialized.");
  }
  elementRefs.cardDescriptionElement.innerText = state.rawDescription as string;
  elementRefs.cardDescriptionElement.setAttribute("contenteditable", "true");
}

export function displayNewCard() {
  if (!state || !elementRefs) {
    throw new Error("State not initialized.");
  }

  elementRefs.cardTitleElement.value = "";
  elementRefs.cardDescriptionElement.innerHTML = "";
  elementRefs.alreadySetTagsElement.innerHTML = "";
  elementRefs.shareableLinkElement.innerText = "";
  elementRefs.cardIsPublicToggleElement.checked =
    state.metadata.cardsAreByDefaultPrivate;

  state.card_is_public_toggle = state.metadata.cardsAreByDefaultPrivate;
  state.currentCardTagsHaveChanged = false;

  elementRefs.cardUrgencyElement.value = "10";
  elementRefs.cardUrgencyNumberElement.innerText = "10";
  elementRefs.cardDescriptionElement.setAttribute("contenteditable", "true");

  // Reset the contents of the current_card variable
  state.changedItems.clear();
  state.currentCardTags.clear();
  state.currentCardID = null;
  state.rawDescription = "";
  state.cardPostURL = "/add-card";

  elementRefs.cardContainerHolderElement.style.display = "block";
}

export function handleInputChange(element_id: string) {
  if (!state) {
    throw new Error("State not initialized.");
  }
  state.changedItems.add(element_id);
}

function handleTagsInputChange(event: KeyboardEvent) {
  if (!autocomplete || !elementRefs) {
    throw new Error("Autocomplete not initialized.");
  }

  let tagBeingEntered = elementRefs.cardTagInputElement.value;
  let keyPress = event.key;
  // If whitespace was added, create the new tag if need be.
  if (keyPress === " " || keyPress === "Enter" || keyPress === "Tab") {
    updateTagsButtons(tagBeingEntered.trim());
  } else {
    // Provide autocomplete results
    let autocompleteHTML = "";
    let matches = autocomplete.keysWithPrefix(tagBeingEntered);
    let numResultsToShow = 5;
    if (matches.length < 5) numResultsToShow = matches.length;
    for (let i = 0; i < matches.length; i++) {
      autocompleteHTML += `<button class="autocomplete_suggestion_button" onclick="updateTagsButtons('${matches[i]}');">${matches[i]}</button>`;
    }
    elementRefs.tagsAutocompleteResultsElement.innerHTML = autocompleteHTML;
  }
}

export function suggestNewTags(tagInputElement: HTMLInputElement) {
  if (!state) {
    throw new Error("State not initialized.");
  }

  if (tagInputElement.value !== "" || state.currentCardTags.size == 0) {
    return;
  }

  if (!autocomplete) {
    throw new Error("Autocomplete not initialized.");
  }

  let suggestedTags = autocomplete.kNeighbors(Array.from(state.currentCardTags), 5);
  let autocompleteHTML = "";
  for (let i = 0; i < suggestedTags.length; i++) {
    autocompleteHTML += `<button class="autocomplete_suggestion_button" onclick="updateTagsButtons('${suggestedTags[i]}');">${suggestedTags[i]}</button>`;
  }

  if (!elementRefs) {
    throw new Error("Element refs not initialized.");
  }
  elementRefs.tagsAutocompleteResultsElement.innerHTML = autocompleteHTML;
}

export function removeTagSuggestions() {
  if (!elementRefs) {
    throw new Error("Element refs not initialized.");
  }
  elementRefs.tagsAutocompleteResultsElement.innerHTML = "";
}

function updateTagsButtons(new_tag: string) {
  if (!state) {
    throw new Error("State not initialized.");
  }

  if (new_tag.trim() === "" || state.currentCardTags.has(new_tag)) {
    return;
  }

  state.currentCardTags.add(new_tag);

  if (!elementRefs) {
    throw new Error("Element refs not initialized.");
  }
  elementRefs.tagsAutocompleteResultsElement.innerHTML = "";
  elementRefs.alreadySetTagsElement.insertAdjacentHTML(
    "beforeend",
    `<button id="card_tag_text_${new_tag}" class="card_tag_button_text">${new_tag}</button><button id="card_tag_remove_${new_tag}" class="card_tag_button_remove" onclick="removeTagFromCard('${new_tag}')"> <i class="fa fa-times fa-fw" aria-hidden="true"></i> </button>`
  );
  elementRefs.cardTagInputElement.value = "";
  state.currentCardTagsHaveChanged = true;
}

function removeTagFromCard(tag: string) {
  for (let elem of [
      document.getElementById(`card_tag_text_${tag}`),
      document.getElementById(`card_tag_remove_${tag}`)]) {
    if (elem) elem.remove();
  }

  if (!state) {
    throw new Error("State not initialized.");
  }

  state.currentCardTags.delete(tag);
  state.currentCardTagsHaveChanged = true;
}

/**
 * @description Insert `&nbsp;&nbsp;&nbsp;&nbsp;` if the user
 * pressed the `tab` key. The downside to this is that deleting a
 * 'tab' requires 4 backspaces. We tried inserting a tab character
 * instead but for it to render, we needed to add
 * `white-space: pre-wrap;` as a style attribute. This however
 * inserts to much whitespace between separate lines of texts.
 * Since flash cards are more frequently read than written, we
 * prioritized having the flash cards as compact as possible in
 * order to avoid the need to scroll down when reading them.
 *
 * {@tutorial main.editing_cards}
 */
export function insertTabsIfNecessary(event: KeyboardEvent) {
  if (event.key == "Tab") {
    document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
    event.preventDefault();
  }
}

export function handleCardUrgencyChange() {
  if (!state) {
    throw new Error("State not initialized.");
  }

  handleInputChange("card_urgency");
  if (state.reviewModeToggle) {
    saveCard(false);
    fetchNextCard();
  } else {
    if (!elementRefs) {
      throw new Error("Element refs not initialized.");
    }
    elementRefs.cardUrgencyNumberElement.innerText =
      elementRefs.cardUrgencyElement.value;
  }
}

export function saveCard(renderSavedCard = true) {
  if (!state) {
    throw new Error("State not initialized.");
  }

  if (!cardsManager) {
    throw new Error("Cards manager not initialized.");
  }

  if (!elementRefs) {
    throw new Error("Element refs not initialized.");
  }

  let payload: Partial<ICard> = {
    title: elementRefs.cardTitleElement.value,
    description: String.raw`${elementRefs.cardDescriptionElement.innerText}`,
    urgency: Number(elementRefs.cardUrgencyElement.value),
    createdById: state.currentUserID,
    tags: Array.from(state.currentCardTags).join(" "),
    isPublic: state.card_is_public_toggle,
  };
  if (state.currentCardID) {
    payload._id = state.currentCardID;
  }

  if (state.currentCardTagsHaveChanged) {
    state.currentCardTags.forEach((tag) => {
      if (!autocomplete) {
        throw new Error("Autocomplete not initialized.");
      }
      autocomplete.updatePrefixTree(tag);
    });
  }

  // If the tags or urgency has been changed, update the sidebar to reflect current info
  let rerenderSideBar =
    state.currentCardTagsHaveChanged || state.changedItems.has("card_urgency");

  cardsManager.saveCard(payload, state.cardPostURL)
    .then((savedCard: Partial<ICard>) => {
      displayPopUp("Card saved!", 1000);
      if (renderSavedCard) renderCard(savedCard);

      if (rerenderSideBar) {
        if (savedCard.tags) {
          savedCard.tags.split(" ").map((tag) => tag.trim()).forEach((tag) => {
            if (!state) {
              throw new Error("State went out of scope.");
            }

            if (!state.tagsAndIDs.hasOwnProperty(tag)) {
              state.tagsAndIDs[tag] = {};
            }
            state.tagsAndIDs[tag][savedCard._id] = {
              urgency: savedCard.urgency as number,
            };
          });
        }

        if (!state) {
          throw new Error("State went out of scope.");
        }
        initializeTagsBar("side_bar_contents", state.tagsAndIDs);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

export function moveCardToTrash() {
  if (!state) {
    throw new Error("State not initialized.");
  }
  if (!cardsManager) {
    throw new Error("Cards manager not initialized.");
  }
  if (!state.currentCardID) {
    throw new Error("Current card ID not initialized.");
  }

  // Remove the card from the ones that get displayed
  cardsManager.removeCard(state.currentCardID);
  // Move on to the next card in the PQ
  if (cardsManager.hasNext()) {
    fetchNextCard();
  } else if (cardsManager.hasPrev()) {
    fetchPreviousCard();
  } else {
    displayNewCard();
  }

  // Request the server to trash the card
  let payload: SendCardToTrashParams = {
    _id: state.currentCardID,
    createdById: state.currentUserID as number,
  }
  sendHTTPRequest("POST", "/trash-card", payload)
    .then((trash_confirmation) => {
      displayPopUp(trash_confirmation, 5000);
    })
    .catch((err) => {
      console.error(err);
    });
}

function restoreCardFromTrash(card_to_restore_id: string, card_to_restore_urgency: number) {
  if (!state || !cardsManager) {
    throw new Error("State not initialized.");
  }

  let payload: RestoreCardFromTrashParams = {
    createdById: state.currentUserID,
    _id: card_to_restore_id,
  };

  sendHTTPRequest("POST", "/restore-from-trash", payload)
    .then((confirmation) => {
      (cardsManager as CardsManager).insertCard(card_to_restore_id, card_to_restore_urgency);
      fetchPreviousCard();
      displayPopUp(confirmation, 5000);
    })
    .catch((err) => {
      console.error(err);
    });
}

/*
 * @description Reset the queue of cards to be viewed.
 * @param {Array} abbreviated_cards Array of JSON objects having the
 * keys `_id`, and `urgency`
 */
export function reInitializeCards(abbreviated_cards: MiniICard[]) {
  if (!cardsManager) {
    throw new Error("Cards manager not initialized.");
  }

  if (!elementRefs) {
    throw new Error("Element refs not initialized.");
  }

  elementRefs.cardSearchResultsElement.innerHTML = "";
  cardsManager.initializeFromMinicards(abbreviated_cards);

  refreshMinicards()
    .then(() => {
      colorUrgencyQuartiles((cardsManager as CardsManager).quartiles());
    })
    .catch((err) => {
      console.error(err);
    });
}
