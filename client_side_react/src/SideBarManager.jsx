import React from 'react';

var axios = require('axios');
const graph_metadata_id = "5a9cf84bbd98043c9e7f2404";
const debug = true;

class SideBarManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tags: {},
            tagsHTML: null
        };

        this.makeHttpRequest = this.makeHttpRequest.bind(this);
        this.refreshTags = this.refreshTags.bind(this);
        this.updateTags = this.updateTagsList.bind(this);
        this.fetchCardIdsUnderTag = this.fetchCardIdsUnderTag.bind(this);
    }

    refreshTags() {
        this.makeHttpRequest(
            "post", "/read-card",
            { _id: graph_metadata_id}, 
            (response) => {
                this.updateTagsList(response["data"]["node_information"][0]);
                // this.fetchCardIdsUnderTag(null);
            }
        );
    }

    /** 
      * @description Update the tags that are shown on the side bar.
      * 
      * @param {dict} nodeData A dict containing the tags as keys, 
      * and card ids as values.
      * 
      */ 
    updateTagsList(nodeData) {

        if (nodeData === undefined) return;

        var newTags = {};
        for (var key in nodeData) {
            newTags[key] = nodeData[key];
        }

        var newTagsHTML = Object.keys(nodeData).map((tag) =>
            <ul key={tag.toString()}>
                <button className="link" onClick={() => this.fetchCardIdsUnderTag(tag)}>
                    #{tag} ({nodeData[tag].length})
                </button>
            </ul>
        );

        this.setState({
            tags: newTags,
            tagsHTML: newTagsHTML
        });
    }

    /**
     * @description Return the ids of the cards that are found under this tag.
     * @param {Array} tags The tags for the desired topics. Null array means all tags.
     * @returns {Array} Array of card ids that have the specified tag.
     * 
    */
    fetchCardIdsUnderTag(tags) {
        if (tags === null) tags = Object.keys(this.state.tags);

        var cardIDs = new Set();
        if (debug) console.log("Called fetchCardIdsUnderTag");
        if (debug) console.log(tags);
        tags.forEach(function(tag, index, array) {
            this.state.tags[tag].forEach(function(id, index_, tag_) {
                console.log("id " + id);
                if (cardIDs.has(id) === false) {
                    cardIDs.add(id);
                }
            });
        });
        return Array.from(cardIDs);
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

    componentDidMount() {
        this.refreshTags();
    }

    render() {
        return (
            this.state.tagsHTML
        )
    }
}

export default SideBarManager;
