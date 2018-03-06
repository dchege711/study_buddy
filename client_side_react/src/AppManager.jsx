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
        
        this.updateCardFromID = this.updateCardFromID.bind(this);
        this.makeHttpRequest = this.makeHttpRequest.bind(this);
        this.fetchNextCard = this.fetchNextCard.bind(this);
        this.fetchPreviousCard = this.fetchPreviousCard.bind(this);
        this.cardHasBeenModified = this.cardHasBeenModified.bind(this);
  
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
                // Set the contents of the card being viewed
                this.updateCardFromID(
                    this.state.ids_in_visitation_order[this.state.currentIndex] 
                );
            }
        )
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

    cardHasBeenModified(changes) {

    }
    
    render() {
        return (<CardManager />)
    }
}

export default AppManager;
