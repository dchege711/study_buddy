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
const keysToUploadToDB = ["title", "description", "tags", "urgency"];

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
        this.makeHttpRequest = this.makeHttpRequest.bind(this);
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
        this.makeHttpRequest(
            "get", "/read-card",
            { _id: null },
            (response) => {
                var card = response["data"][0];
                this.updateCardContents(card);
            }
        );
    }
    
    handleInputChange(event) {
        console.log("handleInputChange() was called");
        var key_in_state_variables = event.target.name;
        var changes = this.state.changedItems;
        changes[key_in_state_variables] = true;
        this.setState({
            [key_in_state_variables]: event.target.value,
            changedItems: changes
        });
    }
    
    handleSubmit(event) {
        console.log("handleSubmit was called");
        var url;
        var data = {};
        if (this.state.isNew) {
            url = "/add-card";
            for (let i = 0; i < keysToUploadToDB.length; i++) {
                data[keysToUploadToDB[i]] = this.state[keysToUploadToDB[i]];
            }
        } else {
            url = "/update-card";
            data["_id"] = this.state._id;
            Object.keys(this.state.changedItems).forEach(key => {
                if (this.state.changedItems[key]) {
                    data[key] = this.state.key;
                }
            });
        }
        
        this.makeHttpRequest(
            "post", url, data,
            (response) => {
                var card = response["data"][0];
                console.log(card);
            }
        );
        
        event.preventDefault();
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
                tags={this.state.tags}
                handleSubmit={this.handleSubmit}
                submitLabel={submitLabel}
                resetContents={this.resetContents}
            />        
        )
    }
}

export default CardClient;
