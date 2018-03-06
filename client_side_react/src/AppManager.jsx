import React from 'react';
import ReactDOM from 'react-dom';
import SideBarManager from './SideBarManager';
import CardManager from './CardManager';

var axios = require('axios');

const metadata_id = "5a77c6d0734d1d3bd58d1198";

class AppManager extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            cachedCards: null, ids_in_visitation_order: null, 
            currentIndex: 0,
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
        this.setEditableDesc = this.setEditableDesc.bind(this);
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
        // Fetch data on the available tags
        document.getElementById("sidebar").hidden = false;
        ReactDOM.render(<SideBarManager />, document.getElementById("sidebar"));

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
    
    render() {
        var submitLabel = "";
        if (this.state.isNew) {
            submitLabel = "Add Card";
        } else {
            submitLabel = "Update Card";
        }
        
        var descriptionContents;
        if (this.state.editableDescription) {
            descriptionContents = <label 
                className="input-area"><strong>Description</strong>
                <textarea name="description" value={this.state.description}
                className="w3-input" onChange={this.handleInputChange} 
                />
            </label>
        } else {
            descriptionContents = "<label className='w3-container'><p><strong>";
            descriptionContents += "Description</strong><br /></p><p>";
            descriptionContents += this.state.description_markdown;
            descriptionContents += "</p></label>";
            
        }
        
        if (this.state.editableDescription) {
            return (
                <CardHTMLTemplate 
                    title={this.state.title}
                    description={this.state.description}
                    handleInputChange={this.handleInputChange}
                    urgency={this.state.urgency}
                    tags={this.state.tags}
                    handleSubmit={this.handleSubmit}
                    submitLabel={submitLabel}
                    descriptionTextArea={descriptionContents}
                    resetContents={this.resetContents}
                    fetchNextCard={this.fetchNextCard}
                    fetchPreviousCard={this.fetchPreviousCard}
                />        
            )
        } else {
            return (
                <ReadOnlyCardTemplate 
                    title={this.state.title}
                    description={this.state.description}
                    handleInputChange={this.handleInputChange}
                    urgency={this.state.urgency}
                    tags={this.state.tags}
                    handleSubmit={this.handleSubmit}
                    submitLabel={submitLabel}
                    descriptionTextArea={descriptionContents}
                    setEditableDesc={this.setEditableDesc}
                    resetContents={this.resetContents}
                    fetchNextCard={this.fetchNextCard}
                    fetchPreviousCard={this.fetchPreviousCard}
                />        
            )
        }
    }
}

export default AppManager;
