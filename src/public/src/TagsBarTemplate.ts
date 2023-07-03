import { AutoComplete } from "./Autocomplete";

const tagsBarTemplateState = {
  tagSearchResultsElement: document.getElementById("tags_search_results") as HTMLElement,
};
if (!tagsBarTemplateState.tagSearchResultsElement) {
  throw new Error("Could not find the tag search results element.");
}

export function searchTags(prefix: string, autocomplete: AutoComplete) {
  let autocompleteHTML = "";
  let matches = autocomplete.keysWithPrefix(prefix);
  let numResultsToShow = 5;
  if (matches.length < 5) numResultsToShow = matches.length;
  for (let i = 0; i < matches.length; i++) {
      autocompleteHTML += `<button class="autocomplete_suggestion_button" onclick="TagsBarUtilities.selectThisTag('${matches[i]}');">${matches[i]}</button>`;
  }
  tagsBarTemplateState.tagSearchResultsElement.innerHTML = autocompleteHTML;
}

export function removeTagSearchResults() {
  tagsBarTemplateState.tagSearchResultsElement.innerHTML = "";
}
