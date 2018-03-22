import React from 'react';
import CardHTMLTemplate from './models/CardHTMLTemplate';
import ReadOnlyCardTemplate from './models/ReadOnlyCardTemplate';

var axios = require('axios');
const debug = true;

const emptyCard = {
    _id: "", title: "", description: "", 
    tags: "", createdById: 0, createdAt: "", 
    updatedAt: "", urgency: 5,
    description_markdown: "", 
};

const keysToUploadToDB = ["title", "description", "tags", "urgency"];

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
        var currentCard;
        if (props.card === null || props.card === undefined) {
            console.log("CardManager initialized with empty card.");
            currentCard = emptyCard;
        } else {
            console.log("CardManager initialized with " + props.card.title);
            currentCard = props.card;
        }
        this.state = {
            _id: currentCard._id,
            title: currentCard.title,
            description: currentCard.description,
            tags: currentCard.tags,
            createdById: currentCard.createdById,
            createdAt: currentCard.createdAt,
            updatedAt: currentCard.updatedAt,
            urgency: currentCard.urgency,
            description_markdown: currentCard.description_markdown,
            isNew: false,
            editableDescription: false,
            titleChanged: false,
            descriptionChanged: false,
            tagsChanged: false,
            urgencyChanged: false
        };
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateCardContents = this.updateCardContents.bind(this);
        this.resetContents = this.resetContents.bind(this);
        this.makeHttpRequest = this.makeHttpRequest.bind(this);
        this.setEditableDesc = this.setEditableDesc.bind(this);
    }

    /**
     * @description Invoked after CardManager is already propped, but before it 
     * receives new props. But this results in a lag between the first click
     * and the first card's appearance.
     * 
     * To do: Read the docs more closely for a better fix.
     */
    componentWillReceiveProps() {
        if (this.props.card === null || this.props.card === undefined) {
            console.log("CardManager initialized with empty card.");
            this.updateCardContents(emptyCard);
        } else {
            console.log("CardManager initialized with " + this.props.card.title);
            this.updateCardContents(this.props.card);
        }
        
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
        if (debug) {
            console.log("updateCardContents() was called");
        }

        this.setState({
            _id: newCard._id,
            title: newCard.title,
            description: newCard.description,
            tags: newCard.tags,
            createdById: newCard.createdById,
            createdAt: newCard.createdAt,
            updatedAt: newCard.updatedAt,
            urgency: newCard.urgency,
            description_markdown: newCard.description_markdown,
            isNew: false,
            editableDescription: false
        });
    }
    
    /**
     * @description Reset the contents of the card template. 
     * Useful for creating new cards
     */
    resetContents() {
        this.updateCardContents(emptyCard);
        this.setState({
            isNew: true,
            editableDescription: false
        })
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
        if (debug) console.log("handleInputChange() called by " + event.target.name);
        var key_in_state_variables = event.target.name;
        this.setState({
            [key_in_state_variables]: event.target.value,
            [key_in_state_variables + "Changed"]: true
        });
    }
    
    /**
     * @description Save the current state of this card to the database.
     * @param {React.SyntheticEvent} event The event that triggered the submission.
     */
    handleSubmit(event) {
        var url;
        var data = {};
        if (debug) console.log("Updating card...");
        if (this.state.isNew === true) {
            url = "/add-card";
            for (let i = 0; i < keysToUploadToDB.length; i++) {
                data[keysToUploadToDB[i]] = this.state[keysToUploadToDB[i]];
            }
        } else {
            url = "/update-card";
            data["_id"] = this.state._id;
            for (let i = 0; i < keysToUploadToDB.length; i++) {
                if (this.state[keysToUploadToDB[i] + "Changed"]) {
                    data[keysToUploadToDB[i]] = this.state[keysToUploadToDB[i]];
                }        
            }
        }
        
        // Update the card's contents in the database
        this.makeHttpRequest(
            "post", url, data,
            (response) => {
                var card = response["data"]["message"];

                // Notify the parent function that this card has been modified
                this.props.cardHasBeenModified({
                    urgency: card["urgency"],
                    card_id: card["_id"],
                    card_tags: card["tags"]
                }); 
            }
        );
        
        this.setState({
            isNew: false
        });

        event.preventDefault();
    }
    
    /**
     * @returns {JSX.Element} Return a representation of the current card.
     */
    render() {
        var submitLabel;
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
        
        if (this.state.editableDescription === true) {
            return (
                <CardHTMLTemplate
                    title={this.state.title}
                    description={this.state.description}
                    urgency={this.state.urgency}
                    tags={this.state.tags}
                    submitLabel={submitLabel}
                    descriptionTextArea={descriptionContents}
                    handleInputChange={this.handleInputChange}
                    handleSubmit={this.handleSubmit}
                    resetContents={this.resetContents}
                    fetchNextCard={this.props.fetchNextCard}
                    fetchPreviousCard={this.props.fetchPreviousCard}
                />
            )
        } else {
            return (
                <ReadOnlyCardTemplate
                    title={this.state.title}
                    description={this.state.description}
                    submitLabel={submitLabel}
                    descriptionTextArea={descriptionContents}
                    urgency={this.state.urgency}
                    tags={this.state.tags}
                    handleInputChange={this.handleInputChange}
                    handleSubmit={this.handleSubmit}
                    setEditableDesc={this.setEditableDesc}
                    resetContents={this.resetContents}
                    fetchNextCard={this.props.fetchNextCard}
                    fetchPreviousCard={this.props.fetchPreviousCard}
                />
            )
        }
    }
}

export default CardManager;
