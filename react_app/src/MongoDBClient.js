import React from 'react';
import ReactDOM from 'react-dom';
import './css/main.css';

const config = require('../config');
const assert = require('assert');

var mongoose = require('mongoose');
var cards = require('./controllers/CardController')

mongoose.connect(config.MONGO_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', function() {
    console.log("Connected to the database successfully!");
});

export default class MongoDBClient extends React.Component {
    
    constructor(props) {
        super(props);
        this.setCard();
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
    }
    
    setCard() {
        return cards.read(null, function(card) {
            this.setState({
                title: card.title;
                description: card.description;
                tags: card.tags;
                urgency: card.urgency;
                createdById: card.createdById;
                isNew: false; 
            });
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
