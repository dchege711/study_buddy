import { ICard } from "../../models/mongoose_models/CardSchema";
import { BROWSE, SEARCH_CARDS } from "../../paths";
import { sendHTTPRequest } from "./AppUtilities";
import { displayAllSearchResults } from "./BrowseCardsPage";
import { reInitializeCards } from "./HomePage"

const CARD_SEARCH_INPUT_ELEMENT = document.getElementById("card_search_input") as HTMLInputElement;
if (!CARD_SEARCH_INPUT_ELEMENT) {
    throw new Error("Could not find the card search input element.");
}

const CARD_SEARCH_RESULTS_ELEMENT = document.getElementById("card_search_results") as HTMLElement;
if (!CARD_SEARCH_RESULTS_ELEMENT) {
    throw new Error("Could not find the card search results element.");
}

/**
 * @description
 * Provide search results for queries typed in the search bar.
 * We want to strike a balance between making frequent hits to the database
 * and providing search feedback as the user types. Therefore:
 *  - If the user pressed the space bar, ask the server for the top 7 results.
 *  - If the user pressed 'Enter', ask the server for all results.
 *  - If the user clicks on any of the 7 results, display that card and stop.
 *
 * To minimize the amount of data being transferred between the client and
 * the database as the user types a query, the server returns partial
 * cards. These partial cards contain the `_id, urgency, title` fields and
 * nothing else. We display the titles in the dropdown menu that gets
 * updated as the user continues searching. Once the user has decided on
 * which card(s) to view, we use the already built functions to load the
 * card, i.e. first check if the card is in the cache, otherwise, fetch the
 * full card from the database.
 */
export async function searchCards(event: KeyboardEvent) {
    let keyPress = event.key;
    // Only query the server if the user has entered a complete word or is
    // done typing.
    if (keyPress !== " " && keyPress !== "Enter") {
      return;
    }

    let queryString = CARD_SEARCH_INPUT_ELEMENT.value.trim();
    if (queryString === "") {
      return;
    }

    let isStillTyping = keyPress === " ";
    let limit = isStillTyping ? 7 : Infinity;
    let searchEndpointURL = "<%= SEARCH_ENDPOINT_URL %>";

    let cards: Partial<ICard>[] = await sendHTTPRequest("POST", searchEndpointURL, { queryString, limit });

    if (isStillTyping) {
      let search_results_html = "<ul>";
      for (let card of cards) {
          search_results_html +=
            `<li onclick='reInitializeCards([${JSON.stringify(card)}]);'>${card.title}</li>`;
      }
      if (cards.length == 0) {
          search_results_html += `<li class='gray-text'><em>No cards found<em></li></ul>`;
      } else {
          search_results_html += `<li class='gray-text'><em>Press [Enter] to view all matches<em></li></ul>`;
      }
      CARD_SEARCH_RESULTS_ELEMENT.innerHTML = search_results_html;
  } else {
      CARD_SEARCH_RESULTS_ELEMENT.innerHTML = "";
      if (searchEndpointURL == SEARCH_CARDS) {
          reInitializeCards(cards);
      } else if (searchEndpointURL == BROWSE) {
          displayAllSearchResults(cards);
      }
  }
}

/**
 * @description Clear the search results dropdown.
 */
export function clearSearchResults() {
    CARD_SEARCH_RESULTS_ELEMENT.innerHTML = "";
}
