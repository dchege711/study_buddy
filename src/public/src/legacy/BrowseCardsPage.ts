import { IMetadata, IMetadataNodeInformation } from "../../models/mongoose_models/MetadataCardSchema";
import { sendHTTPRequest } from "./AppUtilities";
import { CardsManager } from "./CardsManager";
import { initializeTagsBar, getIDsOfSelectedTags, getSelectedTags } from "./TagsBarUtilities";
import { AutoComplete } from "./AutoComplete";
import { DuplicateCardParams, FlagCardParams, SearchPublicCardParams } from "../../models/CardsMongoDB";
import { ICard } from "../../models/mongoose_models/CardSchema";
import { displayPopUp } from "./CardTemplateUtilities";
import { AuthenticateUser } from "../../models/LogInUtilities";
import { syncSpoilerBox } from "./CardTemplateUtilities";
import { addSyntaxHighlighting } from "./SyntaxHighlighting";
import { renderLatex } from "./Latex";
import { BROWSE, DUPLICATE_CARD, FLAG_CARD, READ_PUBLIC_METADATA } from "../../paths";

interface BrowseCardsPageState {
    currentCardID: string | null,
    currentTagSelectionElement: HTMLElement,
    searchResultsElement: HTMLElement,
    tagsAndIDs: IMetadataNodeInformation | null,
    queryString: string,
}

interface ElementRefs {
    searchInputElement: HTMLInputElement,
    cardContainerHolderElement: HTMLElement,
    cardTitleElement: HTMLElement,
    cardDescriptionElement: HTMLElement,
    cardTagsElement: HTMLElement,
    cardPopularityElement: HTMLElement
}

let cardsManager: CardsManager | null = null;
let autocomplete: AutoComplete | null = null;
let state: BrowseCardsPageState | null = null;
let elementRefs: ElementRefs | null = null;

export function initializeBrowsePage() {
  state = {
      currentCardID: null,
      currentTagSelectionElement: document.getElementById("current_tag_selection") as HTMLElement,
      searchResultsElement: document.getElementById("minicards_search_results") as HTMLElement,
      tagsAndIDs: null,
      queryString: "",
  };
  if (!state.currentTagSelectionElement || !state.searchResultsElement) {
      throw new Error("Could not find the current tag selection element or the search results element.");
  }

  elementRefs = {
      searchInputElement: document.getElementById("search_input") as HTMLInputElement,
      cardContainerHolderElement: document.getElementById("card_modal") as HTMLElement,
      cardTitleElement: document.getElementById("card_title") as HTMLElement,
      cardDescriptionElement: document.getElementById("card_description") as HTMLElement,
      cardTagsElement: document.getElementById("card_tags") as HTMLElement,
      cardPopularityElement: document.getElementById("card_popularity") as HTMLElement
  };
  for (let val in Object.values(elementRefs)) {
      if (!val) throw new Error(`Could not find some element references.`);
  }

  sendHTTPRequest("POST", READ_PUBLIC_METADATA, {})
      .then((metadataDocs: IMetadata[]) => {
          if (metadataDocs.length === 0) {
              return Promise.reject("No metadata found.");
          }
          if (!state) {
              throw new Error("State not initialized.");
          }

          state.tagsAndIDs = metadataDocs[0].node_information[0];
          cardsManager = new CardsManager(state.tagsAndIDs, metadataDocs[0].createdById, "/read-public-card");
          initializeTagsBar("side_bar_contents", state.tagsAndIDs);
          autocomplete = new AutoComplete();
          autocomplete.initializePrefixTree(Object.keys(state.tagsAndIDs));
      })
      .catch((err) => { console.error(err); });
}

function handleSearchInputChange() {
    if (!state || !elementRefs) {
        throw new Error("State and/or element refs not initialized.");
    }
    state.queryString = elementRefs.searchInputElement.value || "";
}

function filterCards() {
    if (!state) {
        throw new Error("State not initialized.");
    }

    let selectedTags = getSelectedTags();
    let selectedIDs = getIDsOfSelectedTags();

    let payload: SearchPublicCardParams= {};
    if (selectedIDs) {
        payload.cardIDs = Array.from(selectedIDs).join(",");
    }
    if (state.queryString) {
        payload.queryString = state.queryString;
    }

    sendHTTPRequest("POST", BROWSE, payload)
        .then((cards: Partial<ICard>[]) => {
            if (!state) {
                throw new Error("State went out of scope.");
            }

            let currentTagsString = (selectedTags === null) ? "all" : Array.from(selectedTags).join(", ");
            state.currentTagSelectionElement.innerHTML = `Current Tags: ${currentTagsString}`;
            displayAllSearchResults(cards);
        })
        .catch((err) => { console.error(err); });
}

export function displayAllSearchResults(abbreviatedCards: Partial<ICard>[]) {
    if (!state) {
        throw new Error("State not initialized.");
    }

    let searchResultsHTML = ``;
    for (let card of abbreviatedCards) {
        searchResultsHTML += `
            <div class="w3-card-4 w3-padding-small w3-margin search-result" onclick="BrowseCardsPage.displayFullCard('${card._id}')">
            <header class="w3-container w3-pale-green"><h4>${card.title}</h4></header>
            <div class="w3-container"><p><strong>Tags: </strong><span id="tags${card._id}">${card.tags?.split(/\s/).join(", ")}</span></p></div>
            </div>
        `;
    }
    state.searchResultsElement.innerHTML = searchResultsHTML;
}

function displayFullCard(cardID: string) {
    if (cardsManager === null) {
        throw new Error("CardsManager not initialized.");
    }

    cardsManager.initializeFromMinicards(
            [{
                _id: cardID, urgency: Number.POSITIVE_INFINITY,
                tags: document.getElementById(`tags${cardID}`)?.innerText
            }],
            true
        );

    cardsManager.next()
        .then((card) => {
            if (!elementRefs) {
                throw new Error("Element refs not initialized.");
            }

            if (card === null) {
                throw new Error("No card found.");
            }

            // 2x so that the spoiler box can have positive dimensions
            renderCard(card); renderCard(card);
            elementRefs.cardContainerHolderElement.style.display = "block";
        })
        .catch((err) => { console.error(err); });
}

export function fetchPreviousCard() {
    if (cardsManager === null) {
        throw new Error("CardsManager not initialized.");
    }

    cardsManager.previous()
        .then((card) => { renderCard(card); })
        .catch((err) => { console.error(err); });
}

export function fetchNextCard() {
    if (cardsManager === null) {
        throw new Error("CardsManager not initialized.");
    }

    cardsManager.next()
        .then((card) => { renderCard(card); })
        .catch((err) => { console.error(err); });
}

function flagCard(reason: "markedForReview" | "markedAsDuplicate") {
    if (!state) {
        throw new Error("State not initialized.");
    }

    let payload: FlagCardParams = {
        cardID: state.currentCardID as string,
    };
    payload[reason] = true;
    sendHTTPRequest("POST", FLAG_CARD, payload)
        .then((card: ICard) => {
            displayPopUp(`${card.title} flagged successfully.`, 1000);
        })
        .catch((err) => { console.error(err); });
}

function copyCardToOwnCollection() {
    if (!state) {
        throw new Error("State not initialized.");
    }

    let payload = {
        cardID: state.currentCardID as string
    };

    sendHTTPRequest("POST", DUPLICATE_CARD, payload)
        .then((card: ICard) => {
            displayPopUp(`Added ${card.title} to your collection!`, 1000);
            sessionStorage.setItem(card._id, JSON.stringify(card));
        })
        .catch((err) => { console.error(err); });
}

function renderCard(card: Partial<ICard> | null) {
    if (!card) {
        displayPopUp("Out of cards!", 1500);
        return;
    }

    if (!state || !elementRefs) {
        throw new Error("State and/or element refs not initialized.");
    }

    elementRefs.cardTitleElement.innerHTML = card.title as string;
    elementRefs.cardDescriptionElement.innerHTML = card.descriptionHTML as string;

    elementRefs.cardTagsElement.innerText = card.tags?.trim().replace(/\s/g, ", ") || "";
    elementRefs.cardPopularityElement.innerText = `${card.idsOfUsersWithCopy?.split(", ").length || 0}`;
    state.currentCardID = card._id;

    addSyntaxHighlighting();
    renderLatex(["card_description"]);

    syncSpoilerBox();
};
