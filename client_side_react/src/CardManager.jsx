import React from 'react';
import CardHTMLTemplate from './models/CardHTMLTemplate';
import ReadOnlyCardTemplate from './models/ReadOnlyCardTemplate';

var axios = require('axios');

const emptyCard = {
    _id: null, title: "", description: "", tags: "", isNew: true,
    createdById: 0, createdAt: "", updatedAt: "", urgency: 5,
    description_markdown: "", changedItems: {
        title: false,
        description: false,
        tags: false,
        urgency: false
    }, editableDescription:true
};

/**
 * @description Controls the card that is displayed within the app. 
 * Given a card, CardManager can perform all the desired operations on that
 * one card. However, CardManager doesn't know about any other cards.
 * 
 */
class CardManager extends React.Component {
    
    /**
     * @description Initialize the CardManager.
     * @param {} props cardHasBeenModified()
     */
    constructor(props) {
        super(props);
        this.state = {
            _id: null, title: "", description: "", tags: "", isNew: true,
            createdById: 0, createdAt: "", updatedAt: "", urgency: 5,
            description_markdown: "", editableDescription:false, 
            changedItems: {
                title: false,
                description: false,
                tags: false,
                urgency: false
            }
        };
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateCardContents = this.updateCardContents.bind(this);
        this.resetContents = this.resetContents.bind(this);
        this.makeHttpRequest = this.makeHttpRequest.bind(this);
        this.setEditableDesc = this.setEditableDesc.bind(this);
    }
    
    /**
     * @description Toggle whether this card's contents are editable.
     */
    setEditableDesc() {
        this.setState({
            editableDescription: true
        });
    }
    
    /**
     * @description Set newCard as the card being handled by CardManager.
     * @param {Object} newCard The card that should be displayed by the CardManager
     */
    updateCardContents(newCard) {
        this.setState(newCard);
        this.setState({
            isNew: false,
            editableDescription: false
        });
    }
    
    /**
     * @description Reset the contents of the card template. Useful for 
     * creating new cards
     */
    resetContents() {
        this.setState(emptyCard);
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
    
    /**
     * @description Update the state variables to reflect changes in input, 
     * e.g. typing in text boxes
     * @param {React.SyntheticEvent} event The event that has encountered a change
     */
    handleInputChange(event) {
        var key_in_state_variables = event.target.name;
        var changes = this.state.changedItems;
        changes[key_in_state_variables] = true;
        this.setState({
            [key_in_state_variables]: event.target.value,
            changedItems: changes
        });
    }
    
    /**
     * @description Save the current state of this card to the database.
     * @param {React.SyntheticEvent} event The event that triggered the submission.
     */
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
                
                // Update the metadata
                this.makeHttpRequest(
                    "post", "/update-metadata", 
                    {
                        _id: metadata_id,
                        card_metadata: {
                            urgency: card["urgency"],
                            card_id: card["_id"],
                            card_tags: card["tags"]
                        }
                    },
                    (response) => {
                        console.log("Card update process completed");
                    }
                ); 
            }
        );
        
        this.setState({
            isNew: false
        });

        // Notify the parent function that this card has been modified
        props.cardHasBeenModified();

        event.preventDefault();
    }
    
    /**
     * @returns {JSX.Element} Return a representation of the current card.
     */
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

export default CardManager;
