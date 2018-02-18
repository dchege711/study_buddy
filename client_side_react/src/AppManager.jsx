import React from 'react';
import CardHTMLTemplate from './models/CardHTMLTemplate';

var axios = require('axios');

const emptyCard = {
    _id: null, title: "", description: "", tags: "", isNew: true,
    createdById: 0, createdAt: "", updatedAt: "", urgency: 5,
    changedItems: {
        title: false,
        description: false,
        tags: false,
        urgency: false
    }
};
const keysToUploadToDB = ["title", "description", "tags", "urgency"];
const metadata_id = "5a77c6d0734d1d3bd58d1198";

class AppManager extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            _id: null, title: "", description: "", tags: "", isNew: true,
            createdById: 0, createdAt: "", updatedAt: "", urgency: 5,
            changedItems: {
                title: false,
                description: false,
                tags: false,
                urgency: false
            },
            metadata: null, ids_in_visitation_order: null, 
            currentIndex: 0
        };
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateCardContents = this.updateCardContents.bind(this);
        this.updateCardFromID = this.updateCardFromID.bind(this);
        this.resetContents = this.resetContents.bind(this);
        this.makeHttpRequest = this.makeHttpRequest.bind(this);
        this.fetchNextCard = this.fetchNextCard.bind(this);
        this.fetchPreviousCard = this.fetchPreviousCard.bind(this);
        this.advanceIndex = this.advanceIndex.bind(this);
        this.backTrackIndex = this.backTrackIndex.bind(this);
        this.reorderCardVisitations = this.reorderCardVisitations.bind(this);
    }
    
    updateCardContents(newCard) {
        this.setState(newCard);
        this.setState({
            isNew: false
        });
    }
    
    updateCardFromID(id) {
        this.makeHttpRequest(
            "post", "/read-card",
            { 
                _id: id 
            },
            (response) => {
                this.updateCardContents(response["data"]);
            }
        );
    }
    
    resetContents() {
        this.setState(emptyCard);
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
        // Fetch the metadata about all the available cards
        this.makeHttpRequest(
            "post", "/read-card",
            {_id: metadata_id},
            (response) => {
                // Sort this such that the most urgent cards appear first
                var metadata = response["data"]["stats"][0];
                this.reorderCardVisitations(metadata, function() {
                    return;
                });
                // Set the contents of the card being viewed
                this.updateCardFromID(
                    this.state.ids_in_visitation_order[this.state.currentIndex] 
                );
            }
        )
    }
    
    reorderCardVisitations(metadata, callBack) {
        var keys = Object.keys(metadata);
        keys.sort(
            function(a, b) {
                return metadata[b]["urgency"] - metadata[a]["urgency"];
            }
        );
        
        this.setState({
            metadata: metadata,
            ids_in_visitation_order: keys ,
            currentIndex: 0
        });
        
        callBack();
    }
    
    advanceIndex() {
        var newIndex = (this.state.currentIndex + 1) % this.state.ids_in_visitation_order.length;
        this.setState({
            currentIndex: newIndex
        });
    }
    
    backTrackIndex() {
        var newIndex = (this.state.currentIndex - 1)
        if (newIndex < 0) newIndex = this.state.ids_in_visitation_order.length - 1;
        this.setState({
            currentIndex: newIndex
        });
    }
    
    handleInputChange(event) {
        var key_in_state_variables = event.target.name;
        var changes = this.state.changedItems;
        changes[key_in_state_variables] = true;
        this.setState({
            [key_in_state_variables]: event.target.value,
            changedItems: changes
        });
    }
    
    fetchPreviousCard() {
        this.backTrackIndex();
        this.updateCardFromID(
            this.state.ids_in_visitation_order[this.state.currentIndex] 
        );
    }
    
    fetchNextCard() {
        this.advanceIndex();
        this.updateCardFromID(
            this.state.ids_in_visitation_order[this.state.currentIndex] 
        );
    }
    
    handleSubmit(event) {
        var url;
        var data = {};
        if (this.state.isNew === true) {
            url = "/add-card";
            for (let i = 0; i < keysToUploadToDB.length; i++) {
                data[keysToUploadToDB[i]] = this.state[keysToUploadToDB[i]];
            }
        } else {
            url = "/update-card";
            data["_id"] = this.state._id;
            Object.keys(this.state.changedItems).forEach(key => {
                if (this.state.changedItems[key]) {
                    data[key] = this.state[key];
                }
            });
        }
        
        // Update the card's contents in the database
        this.makeHttpRequest(
            "post", url, data,
            (response) => {
                var card = response["data"];
                this.updateCardContents(card);
                
                // Update the stats about the card's contents in the metadata entry
                console.log("Received " + card["title"]);
                console.log("The id = " + card["_id"] + "and urgency = " + card["urgency"]);
                
                var newMetadata = this.state.metadata;
                newMetadata[card["_id"]] = {"urgency": card["urgency"]};
                console.log(newMetadata);
                this.setState({
                    metadata: newMetadata
                });
                
                this.makeHttpRequest(
                    "post", "/update-card", 
                    {
                        _id: metadata_id,
                        stats: [newMetadata] // mongoose doesn't readily accept dicts
                    },
                    (response) => {
                        var newMetadata = response["data"]["stats"][0];
                        this.reorderCardVisitations(newMetadata, function() {
                            console.log("Set new metadata!");
                        });
                    }
                );
                
            }
        );
        
        this.setState({
            isNew: false
        });
        
        event.preventDefault();
    }
    
    render() {
        var submitLabel = "";
        if (this.state.isNew) {
            submitLabel = "Add Card";
        } else {
            submitLabel = "Update Card";
        }
        return (
            <CardHTMLTemplate 
                title={this.state.title}
                description={this.state.description}
                handleInputChange={this.handleInputChange}
                urgency={this.state.urgency}
                tags={this.state.tags}
                handleSubmit={this.handleSubmit}
                submitLabel={submitLabel}
                resetContents={this.resetContents}
                fetchNextCard={this.fetchNextCard}
                fetchPreviousCard={this.fetchPreviousCard}
            />        
        )
    }
}

export default AppManager;
