import React from 'react';
import './css/main.css';
import './css/w3.css';
import CardHTMLTemplate from './models/CardHTMLTemplate.js';
// import ReactToExpress from './ReactToExpress.js';

var axios = require('axios');

class MongoDBClient extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            _id: null,
            title: "Default Title",
            description: "Default Description",
            tags: "#default",
            createdById: 0,
            createdAt: "",
            updatedAt: "",
            urgency: 50,
            isNew: false
        }
        // Binding is necessary to make this work in the callback
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateCardContents = this.updateCardContents.bind(this);
        this.initializeCard = this.initializeCard.bind(this);
        this.initializeCard();
        
    }
    
    initializeCard() {
        axios.get('/read-card', {
            params: {
                _id: null
            }
        })
        .then(function (response) {
            var card = response["data"][0];
            Object.keys(card).forEach(key => {
                
                this.setState({
                    key: card[key]
                });
                console.log(key + " --> " + card[key]);
            });
            this.updateCardContents(response["data"][0]);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    
    updateCardContents(newCard) {
        console.log("updateCardContents was called");
        Object.keys(newCard).forEach(key => {
            this.setState({
                key: newCard[key]
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
            <CardHTMLTemplate 
                title={this.state.title}
                description={this.state.description}
                handleInputChange={this.handleInputChange}
                urgency={this.state.urgency}
                handleSubmit={this.handleSubmit}
            />        
        )
    }
}

export default MongoDBClient;
