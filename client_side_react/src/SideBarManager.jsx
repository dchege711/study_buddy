import React from 'react';

var axios = require('axios');
const graph_metadata_id = "5a9cf84bbd98043c9e7f2404";

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
     * @param {string} tag The #tag for this topic.
     * @returns {Array} Array of card ids that have the specified tag.
     * 
    */
    fetchCardIdsUnderTag(tag) {
        return this.state.tags[tag];
    }

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
