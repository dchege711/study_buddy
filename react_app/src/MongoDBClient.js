import React from 'react';
import './css/main.css';
var axios = require('axios');

class MongoDBClient extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            tags: "",
            createdById: 0,
            urgency: 0,
            isNew: false
        }
        // Binding is necessary to make this work in the callback
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.initializeCard();
    }
    
    initializeCard() {
        axios.get("/read-card", {
            id: null
        }).then(function(response) {
            var card = JSON.parse(response);
            Object.keys(card).forEach(key => {
                this.setState({
                    key: card.key
                });
            });
        }).catch(function(error) {
            console.log(error);
        });
    }
    
    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    
    handleSubmit(event) {
        event.preventDefault();
    }
    
    render() {
        return (
            <div class="w3-card">
                <header class="w3-container w3-blue">
                    <h5>{this.state.card.title}</h5>
                </header>
                
                <label>Description
                    <input type="text" name="description" value={this.state.card.description}
                    onChange={this.handleInputChange} />
                </label>
                
                <label>Urgency
                    <input type="number" name="urgency" 
                    value={this.state.card.urgency} onChange={this.handleInputChange} />
                </label>
                
            </div>
        )
    }
}

export default MongoDBClient;
