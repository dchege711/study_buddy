"use strict";

/**
 * A collection of utility functions for managing the tags sidebar.
 * 
 * @module
 */

let tagsState = {
    selectedTags: new Set([]),
    tagsAndIDs: null
};

/**
 * @description Toggle the selection of a tag.
 * 
 * @param {String} tag the tag that has been clicked.
 */
exports.selectThisTag = function(tag) {
    if (tagsState.selectedTags.has(tag)) {
        tagsState.selectedTags.delete(tag);
    } else {
        tagsState.selectedTags.add(tag);
    }                
    document.getElementById(`c13u_${tag}`).classList.toggle("chosen");
}

/**
 * @description Unselect all currently selected tags
 */
exports.resetTagSelection = function() {
    tagsState.selectedTags.forEach((tag) => {
        exports.selectThisTag(tag);
    });
}

/**
 * @description Populate the tags HTMLElement with a list of clickable tags in 
 * descending order of importance. As opposed to tag frequency, we weight each 
 * tag by summing up the urgencies of all the cards that the tag is included in. 
 * This better captures the relative importance of the tags.
 * 
 * @param {String} tagBarElementID the ID of the HTML Element that will bear the 
 * tags
 * 
 * @param {JSON} tagsAndIDs a mapping of tags to the card IDs that have that tag
 */
exports.initializeTagsBar = function(tagBarElementID, tagsAndIDs) {
    let tagsInDecreasingOrder = Object.keys(tagsAndIDs);
    tagsState.tagsAndIDs = tagsAndIDs;
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

    let tagsHTML = "";
    tagsInDecreasingOrder.forEach((tag) => {
        let tag_prefix = "#";
        if (tag.charAt(0) == "#") tag_prefix = "";
        tagsHTML += "<ul id='c13u_" + tag +
            "' class='link' onclick='TagsBarUtilities.selectThisTag(`" + tag +
            "`);'> " + tag_prefix + tag + " (" + Object.keys(tagsAndIDs[tag]).length +
            ")</ul>";
    });
    
    document.getElementById(tagBarElementID).innerHTML = tagsHTML;
};

/**
 * @returns {Set} all the currently selected tags
 * @returns {null} if there are no selected tags
 */
exports.getSelectedTags = function() {
    if (tagsState.selectedTags.size == 0) return null;
    
    return tagsState.selectedTags;
}

/**
 * @returns {Set} the IDs of the cards that have any of the selected tags
 */
exports.getIDsOfSelectedTags = function() {
    if (tagsState.selectedTags.size == 0) return null;

    let setCardIDs = new Set([]);
    tagsState.selectedTags.forEach((tag) => {
        for (let cardID in tagsState.tagsAndIDs[tag]) {
            setCardIDs.add(cardID);
        }
    });
    
    return setCardIDs;
};