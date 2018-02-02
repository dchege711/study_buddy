import React from 'react';
import './css/main.css';
import './css/w3.css';
var axios = require('axios');
var ReactToExpress = require('./ReactToExpress');

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
        // this.initializeCard();
    }
    
    initializeCard() {
        axios({
            method: "get",
            url: "/read-card",
            data: {
                id: null
            }
        }).then(function(response) {
            var card = JSON.parse(response);
            console.log("Receiving card.." + card);
            Object.keys(card).forEach(key => {
                console.log("Setting " + key);
                this.setState({
                    key: card.key
                });
            });
        }).catch(function(error) {
            console.log(error);
        });
    }
    
    // initializeCard() {
    //     ReactToExpress.getDataFromURL(
    //         "/read-card", 
    //         {id: null}, 
    //         function(responseData) {
    //             console.log(responseData);
    //         }
    //     );
    // }
    
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
            <div className="w3-card">
                <header className="w3-container w3-blue">
                    <h5>{this.state.title}</h5>
                </header>
                
                <label>Description
                    <input type="text" name="description" value={this.state.description}
                    onChange={this.handleInputChange} />
                </label>
                
                <label>Urgency
                    <input type="number" name="urgency" 
                    value={this.state.urgency} onChange={this.handleInputChange} />
                </label>
                
                <input type="submit" name="update" value="Update" 
                    onChange={this.handleSubmit} />
                
                
            </div>
        )
    }
}

export default MongoDBClient;
