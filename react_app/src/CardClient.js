import React from 'react';
import './css/main.css';
import './css/w3.css';
import CardHTMLTemplate from './models/CardHTMLTemplate.js';

var axios = require('axios');

class CardClient extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            _id: null, title: "", description: "", tags: "", isNew: false,
            createdById: 0, createdAt: "", updatedAt: "", urgency: 50
        }
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateCardContents = this.updateCardContents.bind(this);
    }
    
    updateCardContents(newCard) {
        Object.keys(newCard).forEach(key => {
            this.setState({
                [key]: newCard[key]
            });
        });
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

export default CardClient;
