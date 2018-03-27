import React from 'react';
import ReactDOM from 'react-dom';
import SideBarManager from './SideBarManager';
import CardManager from './CardManager';

var axios = require('axios');
const debug = false;

class AppManager extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            cachedCards: {}, ids_in_visitation_order: null, 
            currentIndex: null, currentCard: null, cardStats: null,
            nodeInformation: null
        };
        
        this.getCardFromID = this.getCardFromID.bind(this);
        this.renderNextCard = this.renderNextCard.bind(this);
        this.makeHttpRequest = this.makeHttpRequest.bind(this);
        this.fetchNextCard = this.fetchNextCard.bind(this);
        this.fetchPreviousCard = this.fetchPreviousCard.bind(this);
        this.cardHasBeenModified = this.cardHasBeenModified.bind(this); 
        this.organizeCards = this.organizeCards.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.fetchMetadata = this.fetchMetadata.bind(this);
        this.renderSideBar = this.renderSideBar.bind(this);

        // Initialization code:

        // Fetch data on the available tags
        this.fetchMetadata(() => {
            this.organizeCards(this.state.cardStats);
            this.renderSideBar();
        });
    }

    fetchMetadata(callBack) {
        // Fetch the metadata about all the available cards
        this.makeHttpRequest(
            "post", "/read-metadata",
            { userIDInApp: this.props.userIDInApp },
            (response) => {
                this.setState({
                    cardStats: response["data"][0]["stats"][0],
                    nodeInformation: response["data"][0]["node_information"][0]
                });
                callBack();
            }
        )
    }

    renderSideBar() {
        if (debug) console.log("renderSideBar() called");
        document.getElementById("sidebar").hidden = false;
        ReactDOM.render(
            <SideBarManager
                userIDInApp={this.props.userIDInApp}
                applyFilter={this.applyFilter}
                nodeInformation={this.state.nodeInformation} />,
            document.getElementById("sidebar")
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
                callBack(response["data"]["message"]);
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

    /**
     * @description Organize the cards from the database.
     * 
     * @param {JSON} cardStats A list of the available cards with 
     * sortable attributes.
     */
    organizeCards(cardStats, callBack) {
        if (debug) console.log("organizeCards() using urgency...");
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
     * @param {JSON} card The modified card's complete JSON
     */
    cardHasBeenModified(card) {
       
        // Todo: Use a priority queue because the number of cards 
        // might grow substantially
        let newCachedCards = this.state.cachedCards;
        newCachedCards[card["_id"]] = card;
        if (debug) {
            console.log("cardHasBeenModified() called for:");
            console.log(card);
        }
        
        this.setState({
            cachedCards: newCachedCards,
            currentCard: card
        });

        // Reorganize the side bar with updated info
        this.fetchMetadata(() => {
            this.organizeCards(this.state.cardStats);
            this.renderSideBar();
        });
    }
    
    render() {
        if (debug) console.log("AppManager rendered!");
        return (<CardManager 
            card={this.state.currentCard} 
            fetchNextCard={this.fetchNextCard}
            fetchPreviousCard={this.fetchPreviousCard}
            cardHasBeenModified={this.cardHasBeenModified}
            userIDInApp={this.props.userIDInApp}
        />)
    }
}

export default AppManager;
