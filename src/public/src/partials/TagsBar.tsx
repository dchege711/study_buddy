import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";
import {
  IMetadataNodeInformation,
  IMetadataNodeInformationEntry,
} from "../../../models/mongoose_models/MetadataCardSchema";
import { AutoComplete } from "../AutoComplete";
import { useMetadata } from "./MetadataHook";

function defaultIsSelectedTag(_: string) {
  return false;
}

const TagsContext = createContext({
  selectTag: (tag: string) => {},
  isSelectedTag: defaultIsSelectedTag,
  tagsAutoComplete: new AutoComplete(),
});

export const useTags = () => useContext(TagsContext);

function TagsFilterButton({ filterCards }: { filterCards: () => void }) {
  return (
    <button
      className="w3-button w3-blue w3-round-xxlarge w3-left"
      onClick={filterCards}
    >
      <b>
        <i className="fa fa-refresh fa-fw" aria-hidden="true"></i> Filter By
        Tags
      </b>
    </button>
  );
}

function TagsResetSelectionButton({
  filterCards,
  resetTagSelection,
}: {
  filterCards: () => void;
  resetTagSelection: () => void;
}) {
  return (
    <button
      className="w3-button w3-blue w3-round-xxlarge w3-right"
      onClick={() => {
        resetTagSelection();
        filterCards();
      }}
    >
      <b>Clear Selection</b>
    </button>
  );
}

function AutoCompleteTagSearchResult({ tag }: { tag: string }) {
  const { selectTag } = useContext(TagsContext);
  return (
    <button
      className="autocomplete_suggestion_button"
      onClick={() => selectTag(tag)}
    >
      {tag}
    </button>
  );
}

function TagsSearchBox({
  tagsAndIDs,
}: {
  tagsAndIDs: IMetadataNodeInformation;
}) {
  const [tagSearchResults, setTagSearchResults] = useState<string[]>([]);

  const autoComplete = new AutoComplete();
  autoComplete.initializePrefixTree(Object.keys(tagsAndIDs));

  function searchTags(prefix: string) {
    setTagSearchResults(autoComplete.keysWithPrefix(prefix));
  }

  const searchTerm = useRef<HTMLInputElement | null>(null);

  return (
    <div className="dropdown w3-container">
      <input
        type="text"
        ref={searchTerm}
        placeholder="Search for tag..."
        onKeyUp={() => {
          searchTags(searchTerm.current!.value);
        }}
        onBlur={() => {
          window.setTimeout(() => setTagSearchResults([]), 200);
        }}
        className="w3-input dropbtn"
      />
      <div className="dropdown-content" id="tags_search_results">
        {tagSearchResults.map((tag) => (
          <AutoCompleteTagSearchResult tag={tag} key={tag} />
        ))}
      </div>
    </div>
  );
}

interface TagInfo {
  name: string;
  info: IMetadataNodeInformationEntry;
}

function Tag({ tag }: { tag: TagInfo }) {
  const { selectTag, isSelectedTag } = useContext(TagsContext);

  function toggleIsSelected() {
    selectTag(tag.name);
  }

  const prefix = tag.name[0] === "#" ? "" : "#";
  const displayText = `${prefix}${tag.name} (${Object.keys(tag.info).length})`;

  return (
    <li
      id={`c13u_${tag.name}`}
      className={`link ${isSelectedTag(tag.name) ? "chosen" : ""}`}
      onClick={toggleIsSelected}
    >
      {displayText}
    </li>
  );
}

function Tags({ tagsAndIDs }: { tagsAndIDs: IMetadataNodeInformation }) {
  const tagsInDecreasingOrder = Object.keys(tagsAndIDs);
  tagsInDecreasingOrder.sort(function (tagA, tagB) {
    let importanceTagA = 0;
    let importanceTagB = 0;

    Object.keys(tagsAndIDs[tagB]).forEach((cardID) => {
      importanceTagB += tagsAndIDs[tagB][cardID].urgency;
      importanceTagB += 1;
    });

    Object.keys(tagsAndIDs[tagA]).forEach((cardID) => {
      importanceTagA += tagsAndIDs[tagA][cardID].urgency;
      importanceTagA += 1;
    });
    return importanceTagB - importanceTagA;
  });

  return (
    <div id="side_bar" className="w3-container">
      <div id="side_bar_contents">
        {tagsInDecreasingOrder.map((tag) => (
          <Tag tag={{ name: tag, info: tagsAndIDs[tag] }} key={tag} />
        ))}
      </div>
    </div>
  );
}

export default function TagsBar() {
  const { metadata } = useMetadata();
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const [tagsAutoComplete, setTagsAutoComplete] = useState(
    new AutoComplete()
  );

  function isSelectedTag(tag: string) {
    return selectedTags.has(tag);
  }
  function selectTag(tag: string) {
    let selectedTagsCopy = new Set(selectedTags);
    if (selectedTagsCopy.has(tag)) {
      selectedTagsCopy.delete(tag);
    } else {
      selectedTagsCopy.add(tag);
    }
    setSelectedTags(selectedTagsCopy);
  }
  function resetTagSelection() {
    setSelectedTags(new Set());
  }

  function filterCards() {}

  useEffect(() => {
    let newAutoComplete = new AutoComplete();
    if (metadata) {
      newAutoComplete.initializePrefixTree(Object.keys(metadata.node_information[0]));
      setTagsAutoComplete(newAutoComplete);
    }
  }, [metadata]);

  const showTags = metadata && metadata.node_information.length > 0;

  return (
    <TagsContext.Provider value={{ selectTag, isSelectedTag, tagsAutoComplete }}>
      <div className="w3-container w3-left w3-quarter w3-padding">
        <div className="w3-container w3-padding-small">
          <TagsFilterButton filterCards={filterCards} />
          <TagsResetSelectionButton
            filterCards={filterCards}
            resetTagSelection={resetTagSelection}
          />
        </div>
        {showTags && (
          <TagsSearchBox tagsAndIDs={metadata.node_information[0]} />
        )}
        {showTags && <Tags tagsAndIDs={metadata.node_information[0]} />}
      </div>
    </TagsContext.Provider>
  );
}
