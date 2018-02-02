import React from 'react';
import './css/main.css';
import './css/w3.css';
import CardHTMLTemplate from './models/CardHTMLTemplate.js';

var axios = require('axios');

const emptyCard = {
    _id: null, title: "", description: "", tags: "", isNew: true,
    createdById: 0, createdAt: "", updatedAt: "", urgency: 50,
    changedItems: {
        title: false,
        description: false,
        tags: false,
        urgency: false
    }
};

class CardClient extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            _id: null, title: "", description: "", tags: "", isNew: true,
            createdById: 0, createdAt: "", updatedAt: "", urgency: 50,
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
    }
    
    updateCardContents(newCard) {
        this.setState(newCard);
        this.setState({
            isNew: false
        });
    }
    
    resetContents() {
        this.setState(emptyCard);
    }
    
    componentDidMount() {
        axios.get('/read-card', {
            params: {
                _id: null
            }
        })
        .then((response) => {
            var card = response["data"][0];
            this.updateCardContents(card);
        })
        .catch(function (error) {
            console.log(error);
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
    
    handleSubmit(event) {
        event.preventDefault();
        
        // Add a new card to the database
        if (this.state.isNew) {
            axios.post('/add-card', {
                params: this.state
            })
            .then((response) => {
                console.log(response["data"][0]);
            })
            .catch((error) => {
                console.log(error);
            });
        } else {
            var updatedValues = {};
            updatedValues["_id"] = this.state._id;
            Object.keys(this.state.changedItems).forEach(key => {
                if (this.state.changedItems[key]) {
                    updatedValues[key] = this.state.key;
                }
            });
            axios.post('/update-card', {
                params: updatedValues
            })
            .then((response) => {
                console.log(response["data"][0]);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }
    
    render() {
        var submitLabel = "";
        if (this.state.isNew) {
            submitLabel = "Add Card";
        } else {
            submitLabel = "Update Card";
        }
        console.log("render() called");
        return (
            <CardHTMLTemplate 
                title={this.state.title}
                description={this.state.description}
                handleInputChange={this.handleInputChange}
                urgency={this.state.urgency}
                handleSubmit={this.handleSubmit}
                submitLabel={submitLabel}
                resetContents={this.resetContents}
            />        
        )
    }
}

export default CardClient;
