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
            cachedCards: {}, ids_in_visitation_order: null, 
            currentIndex: null
        };
        
        this.updateCardFromID = this.updateCardFromID.bind(this);
        this.getCardFromID = this.getCardFromID.bind(this);
        this.makeHttpRequest = this.makeHttpRequest.bind(this);
        this.fetchNextCard = this.fetchNextCard.bind(this);
        this.fetchPreviousCard = this.fetchPreviousCard.bind(this);
        this.cardHasBeenModified = this.cardHasBeenModified.bind(this); 
        this.organizeCards = this.organizeCards.bind(this);
  
    }
    
    updateCardFromID(id) {
        this.makeHttpRequest(
            "post", "/read-card",
            { _id: id },
            (response) => {
                CardManager.updateCardContents(response["data"]);
            }
        );
    }

    /**
     * Fetch the card that has this ID from the database.
     * Cache the card in the state variable.
     * 
     * @param {string} id The id of the card to be fetched
     * @param {*} callBack A function that takes a card object as a parameter
     */
    getCardFromID(id, callBack) {
        this.makeHttpRequest(
            "post", "/read-card",
            { _id: id },
            (response) => {
                callBack(response["data"]);
                // Cache the card for faster viewing next time
                let newCachedCards = this.state.cachedCards;
                newCachedCards[id] = response["data"];
                this.setState({
                    currentIndex: 0,
                    cachedCards: newCachedCards
                })
                
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
            { _id: metadata_id },
            (response) => {
                // Set the contents of the card being viewed
                this.organizeCards(response["data"]["stats"][0]);
            }
        )
    }

    /**
     * @description Organize the cards from the database.
     * 
     * @param {JSON} cardStats A list of the available cards with 
     * sortable attributes.
     * @param {function} callBack The function to be called upon 
     * completion.
     */
    organizeCards(cardStats) {
        // Sort the cards using their urgency attribute
        var keys = Object.keys(cardStats);
        keys.sort(
            function (a, b) {
                return cardStats[b]["urgency"] - cardStats[a]["urgency"];
            }
        );
        this.setState({
            ids_in_visitation_order: keys 
        })
    }
    
    fetchPreviousCard() {
        
    }
    
    /**
     * @description Fetch the next card to be displayed.
     * @param {function} callBack Function that takes a card as a param
     */
    fetchNextCard(callBack) {
        console.log("Fetching the next card..." + this.state.currentIndex);
        if (this.state.currentIndex === null) {
            let cardID = this.state.ids_in_visitation_order[0];
            this.getCardFromID(
                cardID, function (card) {
                    callBack(card);
            });
            this.setState({ currentIndex: 0 });

        } else {
            let newIndex = (this.state.currentIndex + 1) % this.state.currentIndex.length;
            let cardID = this.state.ids_in_visitation_order[newIndex];
            if (this.state.cachedCards.hasOwnProperty(cardID)) {
                callBack(this.state.cachedCards[cardID])
            } else {
                this.getCardFromID(cardID, function(card) {
                    callBack(card);
                });
            }
            this.setState({currentIndex: newIndex});
            
        }
    }

    cardHasBeenModified(changes) {

    }
    
    render() {
        return (<CardManager 
            card={null} 
            fetchNextCard={this.fetchNextCard}
            fetchPreviousCard={this.fetchPreviousCard}
        />)
    }
}

export default AppManager;
