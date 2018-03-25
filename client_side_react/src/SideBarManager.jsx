import React from 'react';

var axios = require('axios');
const debug = false;

var selectedTags = new Set();

class SideBarManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tags: {},
            tagsHTML: null
        };
        this.makeHttpRequest = this.makeHttpRequest.bind(this);
        this.selectThisTag = this.selectThisTag.bind(this);
        this.updateTagsList = this.updateTagsList.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
    }

    /**
     * This function is called as soon as SideBarManager is mounted.
     * 
     */
    componentDidMount() {
        this.updateTagsList(this.props.nodeInformation);
    }

    /** 
      * @description Update the tags that are shown on the side bar.
      * 
      * @param {dict} nodeData A dict containing the tags as keys, 
      * and card ids as values.
      * 
      */ 
    updateTagsList(nodeData) {
        if (debug) {
            console.log("updateTagsList() called");
        }

        if (nodeData === undefined || nodeData === null) return;

        var newTags = {};
        for (var key in nodeData) {
            newTags[key] = nodeData[key];
        }

        // Why doesn't nodeData[tag].size work???
        var newTagsHTML = Object.keys(nodeData).map((tag) =>
            <ul key={tag.toString()}>
                <button id={tag.toString()} className="link" onClick={() => this.selectThisTag(tag)}>
                    #{tag} ({Object.keys(nodeData[tag]).length})
                </button>
            </ul>
        );

        this.setState({
            tags: newTags,
            tagsHTML: newTagsHTML
        });
    }

    /**
     * Toggle whether this tag has been selected.
     * @param {string} tag The tag that was selected. 
     */
    selectThisTag(tag) {
        var tagElement = document.getElementById(tag);
        if (selectedTags.has(tag)) {
            selectedTags.delete(tag);
            tagElement.removeAttribute("style");
        } else {
            selectedTags.add(tag);
            tagElement.style.fontSize = "larger";
            tagElement.style.backgroundColor = "white";
            tagElement.style.color = "black";
        }
    }

    /**
     * @description Return the ids of the cards that are found under this tag.
     * @returns {Array} Array of card ids that have the specified tag.
     * 
    */
    applyFilter() {
        if (selectedTags.size === 0) {
            selectedTags = new Set(Object.keys(this.state.tags));
        }
        
        if (debug) console.log("Called fetchCardIdsUnderTag");
        if (debug) console.log(selectedTags);

        var cardIDs = new Set();
        var allTags = this.state.tags;
        if (debug) console.log(allTags);
        
        selectedTags.forEach(function(tag, tag_copy, allSelected) {
            Object.keys(allTags[tag]).forEach(function(id, index_, tag_) {
                if (cardIDs.has(id) === false) {
                    cardIDs.add(id);
                }
            });
        });

        if (debug) console.log(cardIDs);

        // Tell the AppManager to refresh the cards being shown.
        this.props.applyFilter(cardIDs);
    }

    /**
     * @description Make a HTTP request to the provided URL
     * @param {string} method The HTTP method to use, e.g. "post"
     * @param {string} url The URL to which the request will be made
     * @param {Object} data The payload that will be sent to the URL
     * @param {function} callBack The function that handles the response
     */
    makeHttpRequest(method, url, data, callBack) {
        axios({
            method: method,
            url: url,
            data: data
        }).then((response) => {
            callBack(response);
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            [
            <div key="apply_filter_button" className="w3-container w3-center w3-padding-16">
                <input className="w3-center w3-button:hover w3-padding-small"
                    type="submit" value="Apply Filter" onClick={this.applyFilter} />
            </div>,
            this.state.tagsHTML
            ]
        )
    }
}

export default SideBarManager;
