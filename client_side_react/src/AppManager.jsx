import React from 'react';
import ReactDOM from 'react-dom';
import SideBarManager from './SideBarManager';
import CardManager from './CardManager';

var axios = require('axios');

const metadata_id = "5a77c6d0734d1d3bd58d1198";
const debug = true;

class AppManager extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            cachedCards: {}, ids_in_visitation_order: null, 
            currentIndex: null, currentCard: null, cardStats: null
        };
        
        this.getCardFromID = this.getCardFromID.bind(this);
        this.renderNextCard = this.renderNextCard.bind(this);
        this.makeHttpRequest = this.makeHttpRequest.bind(this);
        this.fetchNextCard = this.fetchNextCard.bind(this);
        this.fetchPreviousCard = this.fetchPreviousCard.bind(this);
        this.cardHasBeenModified = this.cardHasBeenModified.bind(this); 
        this.organizeCards = this.organizeCards.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
  
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
        ReactDOM.render(
            <SideBarManager applyFilter={this.applyFilter}
            />, document.getElementById("sidebar")
        );

        // Fetch the metadata about all the available cards
        this.makeHttpRequest(
            "post", "/read-card",
            { _id: metadata_id },
            (response) => {
                // Set the contents of the card being viewed
                this.setState({
                    cardStats: response["data"]["stats"][0]
                })
                this.organizeCards(response["data"]["stats"][0]);
            }
        )
    }

    /**
     * @description Organize the cards from the database.
     * 
     * @param {JSON} cardStats A list of the available cards with 
     * sortable attributes.
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
            ids_in_visitation_order: keys,
            currentIndex: null
        })
    }

    /**
     * Filters out the cards that are not relevant to the user.
     * This filter occurs at the side bar panel.
     * 
     * @param {Set} relevantIDs The new IDs that should be in the queue
     */
    applyFilter(relevantIDs) {
        if (debug) console.log("The filter is being applied");
        if (debug) console.log(relevantIDs);
        var newCardStats = {}
        relevantIDs.forEach((id, id_copy, setReadOnly) => {
            newCardStats[id] = {
                "urgency": this.state.cardStats[id]["urgency"]
            }
        });
        this.organizeCards(newCardStats);
    }
    
    /**
     * @description Fetch the previous card in the sequence
     */
    fetchPreviousCard() {
        // Get the appropriate index into the list of cards
        var newIndex;
        var numIDs = this.state.ids_in_visitation_order.length;
        if (this.state.currentIndex === null) {
            newIndex = numIDs - 1;
        } else {
            newIndex = (this.state.currentIndex - 1) % numIDs;
            // In JS and Java, -2 % 5 = -2, while in Python, -2 % 5 = 3
            if (newIndex < 0) newIndex = numIDs + newIndex;
        }
        this.renderNextCard(newIndex);
    }
    
    /**
     * @description Fetch the next card to be displayed.
     */
    fetchNextCard() {
        // Get the appropriate index into the list of cards
        var newIndex;
        if (this.state.currentIndex === null) {
            newIndex = 0;
        } else {
            newIndex = (this.state.currentIndex + 1) % this.state.ids_in_visitation_order.length;
        }
        this.renderNextCard(newIndex);
    }

    /**
     * Set the state variables to trigger the render() function.
     * Try fetching the card from cache before requesting it from the
     * server.
     * 
     * @param {int} newIndex The index of the card id in the array of ids
     */
    renderNextCard(newIndex) {

        // Look for the card...
        var cardID = this.state.ids_in_visitation_order[newIndex];
        if (debug) console.log("Looking for " + newIndex + ", id = " + cardID);
        if (this.state.cachedCards[cardID] !== undefined) {
            if (debug) console.log("Found this card in the cache... " + this.state.cachedCards[cardID]["title"]);
            this.setState({
                currentCard: this.state.cachedCards[cardID],
                currentIndex: newIndex
            });
        } else {
            this.setState({ currentIndex: newIndex });
            this.getCardFromID(cardID, (card) => {
                let newCachedCards = this.state.cachedCards;
                newCachedCards[cardID] = card;
                if (debug) console.log("Got this card from the server... " + card.title);
                this.setState({
                    currentIndex: newIndex,
                    cachedCards: newCachedCards,
                    currentCard: card
                })
            });
        }
    }

    /**
     * @description Once a card has been updated, set the metadata
     * to match the current changes.
     * 
     * @param {JSON} changes Expected keys: _id, urgency, tags 
     */
    cardHasBeenModified(changes) {
        // Todo: Use a priority queue because the number of cards 
        // might grow substantially
    }
    
    render() {
        return (<CardManager 
            card={this.state.currentCard} 
            fetchNextCard={this.fetchNextCard}
            fetchPreviousCard={this.fetchPreviousCard}
            cardHasBeenModified={this.cardHasBeenModified}
        />)
    }
}

export default AppManager;
