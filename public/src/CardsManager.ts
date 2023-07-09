"use strict";

import AVLTree, { Node } from "avl";
import { ICard, MiniICard } from "../../models/mongoose_models/CardSchema";
import { IMetadataNodeInformation, IMetadataTrashedCardInformation } from "../../models/mongoose_models/MetadataCardSchema";
import { sendHTTPRequest } from "../../src/app/lib/AppUtilities";

interface CardsManagerBSTKey {
    urgency: number;
    _id: string;
}

type CardsManagerBSTNode = Node<CardsManagerBSTKey, number>;

/**
 * Manage the set of cards being displayed to the user.
 *
 * @class
 */
export class CardsManager implements Iterable<CardsManagerBSTKey> {
    userID: number;
    cardSourceURL: string;
    minicards: MiniICard[];
    empty_card: Partial<ICard>;
    tagsAndIds: IMetadataNodeInformation;
    bst: AVLTree<CardsManagerBSTKey, number> = new AVLTree();
    currentNode: CardsManagerBSTNode | null = null;
    idsToBSTKeys: {[id: string]: CardsManagerBSTKey} = {};

    constructor(tagsAndIds: IMetadataNodeInformation, userID: number,
                cardSourceURL: string = "/read-card", minicards: MiniICard[] = []) {
        this.tagsAndIds = tagsAndIds;
        this.userID = userID;
        this.cardSourceURL = cardSourceURL;
        this.minicards = minicards;
        this.empty_card = {
            title: "", description: "", tags: "", createdById: userID,
            urgency: 0, metadataIndex: 0
        };
    }

    /**
     * A function for comparing the keys for the BST
     *
     * @param {Object} a Expected attributes: `urgency`, `_id`
     * @param {Object} b Expected attributes: `urgency`, `id`
     *
     * @returns {Number} `0` if the keys are equal, `1` if `a < b` and `-1` if
     * `a > b`
     */
    reverseComparator(a: CardsManagerBSTKey, b: CardsManagerBSTKey): number {
        if (a.urgency < b.urgency) return 1;
        if (a.urgency > b.urgency) return -1;
        if (a._id < b._id) return 1;
        if (a._id > b._id) return -1;
        return 0;
    }

    /**
     * @description Initialize Card Manager by preparing a queue of cards.
     * @param {Array} tagsToUse The tags that should appear in the PQ.
     */
    initializeFromTags(tagsToUse: Set<string>): void {
        if (tagsToUse.size === 0) {
            tagsToUse = new Set(Object.keys(this.tagsAndIds));
        }
        this.bst = new AVLTree(this.reverseComparator, true);
        this.currentNode = null;
        let alreadySeenIDs = new Set<string>();
        tagsToUse.forEach((tag) => {
            for (let cardID in this.tagsAndIds[tag]) {
                if (alreadySeenIDs.has(cardID) === false) {
                    this.insertCard(cardID, this.tagsAndIds[tag][cardID].urgency);
                    alreadySeenIDs.add(cardID);
                }
            }
        });
    };

    /**
     * @description Initialize a card manager using an array of abbreviated
     * cards.
     *
     * @param {Array} minicards Array of JSON objects having the keys `_id`,
     * and `urgency`
     *
     * @param {Boolean} includeTagNeighbors If set to true, enqueue cards that share
     * similar tags as well. Note that this expects the minicards to have a `tags`
     * attribute in addition to `_id` and `urgency`.
     */
    initializeFromMinicards(minicards: MiniICard[], includeTagNeighbors: boolean = false) {
        this.bst = new AVLTree(this.reverseComparator, true);
        this.currentNode = null;

        let alreadySeenIDs: Set<string> = new Set([]);
        minicards.forEach((minicard) => {
            if (minicard._id === undefined || minicard.urgency === undefined) {
                console.error(minicard);
                throw new Error("Invalid minicard");
            }
            alreadySeenIDs.add(minicard._id);
            this.insertCard(minicard._id, minicard.urgency);
        });

        if (!includeTagNeighbors) {
            return;
        }

        let tagsToUse: Set<string> = new Set([]);
        minicards.forEach((minicard) => {
            if (minicard.tags === undefined) {
                console.error(minicard);
                throw new Error("Invalid minicard");
            }

            minicard.tags.split(' ').forEach((tag) => { tagsToUse.add(tag); });
        });

        tagsToUse.forEach((tag) => {
            for (let cardID in this.tagsAndIds[tag]) {
                if (!alreadySeenIDs.has(cardID)) {
                    this.insertCard(cardID, this.tagsAndIds[tag][cardID].urgency);
                    alreadySeenIDs.add(cardID);
                }
            }
        });
    };

    /**
     * @description Initialize a card manager using a trash object.
     *
     * @param {JSON} trashed_card_ids A JSON object whose keys are card IDs and
     * the value is the timestamp on which they were trashed.
     *
     * @param {Function} callBack Function to call once everything is complete.
     */
    initializeFromTrash (trashedCards: IMetadataTrashedCardInformation) {
        this.bst = new AVLTree(this.reverseComparator, true);
        this.currentNode = null;

        let card_ids = Object.keys(trashedCards); // Synchronous
        for (let i = 0; i < card_ids.length; i++) {
            this.insertCard(card_ids[i], trashedCards[card_ids[i]]);
        }
    };

    /**
     * @description An iterator over all cards that are discoverable through
     * the `prev()` and `next()` methods of the `CardsManager`
     */
    [Symbol.iterator]() {
        let bst = this.bst;
        let node: CardsManagerBSTNode | null = bst.minNode();

        return {
          next(): IteratorResult<CardsManagerBSTKey> {
            if (node && node.key) {
                let value = node.key;
                node = bst.next(node);
                return {
                    done: false,
                    value: value
                }
            } else {
                return {
                    done: true,
                    value: null
                }
            }
          }
        }
    }

    /**
     * @description Set the cursor of the `CardsManager` object to the card
     * with the provided ID
     */
    fetchCard(cardID: string) {
        this.currentNode = this.bst.find(this.idsToBSTKeys[cardID]);
        if (this.currentNode === null) {
            return null;
        }

        return this.findCard(cardID);
    };

    /**
     * @description Return the next card on the queue.
     * @param {Function} callback The function to call that accepts a card
     * as a parameter.
     */
    async next(): Promise<Partial<ICard> | null>  {
        if (!this.hasNext()) {
            return null;
        }

        if (this.currentNode === null) {
            let min = this.bst.min();
            if (min === null) {
                return Promise.reject("No cards left, but hasNext() claims there are some");
            }
            this.currentNode = this.bst.find(min);
        } else {
            this.currentNode = this.bst.next(this.currentNode);
        }

        if (this.currentNode === null || !this.currentNode.key) {
            return Promise.reject("No cards left, but hasNext() claims there are some");
        }

        return this.findCard(this.currentNode.key._id);
    };

    /**
     * @return {Boolean} `true` if calling `next()` will produce a card. `false`
     * otherwise
     */
    hasNext(): boolean {
        if (this.bst.size === 0) return false;
        if (this.currentNode === null) return true;
        return this.bst.next(this.currentNode) !== null;
    };

    /**
     * @return {Boolean} `true` if calling `prev()` will produce a card. `false`
     * otherwise
     */
    hasPrev (): boolean {
        if (this.bst.size === 0) return false;
        if (this.currentNode === null) return true;
        return this.bst.prev(this.currentNode) !== null;
    };

    /**
     * @description Return the previous card on the queue.
     * @param {Function} callback The function to call that accepts a card
     * as a parameter.
     */
    previous(): Promise<Partial<ICard> | null> {
        if (!this.hasPrev() || this.currentNode === null) {
            return Promise.resolve(null);
        }

        this.currentNode = this.bst.prev(this.currentNode);
        if (this.currentNode === null || !this.currentNode.key) {
            return Promise.reject("No cards left, but hasPrev() claims there are some");
        }

        return this.findCard(this.currentNode.key._id);
    };

    /**
     * @description Remove the specified card from the cards that are displayed
     * to the user.
     *
     * @param {String} idOfCardToRemove The ID of the card to be removed from
     * the queue of cards.
     */
    removeCard(idOfCardToRemove: string) {
        // If we're removing the current card, adjust such that `next()`
        // resolves to the card that followed the card that we'll remove
        if (this.currentNode && this.currentNode.key && this.currentNode.key._id === idOfCardToRemove) {
            if (this.hasPrev()) {
                this.currentNode = this.bst.prev(this.currentNode);
            } else if (this.hasNext()) {
                this.currentNode = this.bst.next(this.currentNode);
            } else {
                this.currentNode = null;
            }
        }
        let keyToRemove = this.idsToBSTKeys[idOfCardToRemove];
        delete this.idsToBSTKeys[idOfCardToRemove];
        if (keyToRemove) this.bst.remove(keyToRemove);
    };

    status() {
        if (this.currentNode && this.currentNode.key) {
            let node = this.bst.prev(this.currentNode);
            if (node && node.key) {
                this.findCard(node.key._id)
                    .then((card) => {
                        console.log(`Previous: (${card.urgency}) ${card.title}`);
                    })
                    .catch((err) => { console.error(err); });
            } else {
                console.log(`Previous: null`);
            }

            this.findCard(this.currentNode.key._id)
                .then((card) => {
                    console.log(`Current: (${card.urgency}) ${card.title}`);
                })
                .catch((err) => { console.error(err); });

            node = this.bst.next(this.currentNode);
            if (node && node.key) {
                this.findCard(node.key._id)
                    .then((card) => {
                        console.log(`Next: (${card.urgency}) ${card.title}`);
                    })
                    .catch((err) => { console.error(err); });
            } else {
                console.log(`Next: null`);
            }
        } else {
            console.log(`Current: null`);
        }
    }

    /**
     * @description Insert a card into the set of cards that can be discovered
     * by the `next()` and `prev()` iterators. The card will be insrted into
     * its natural position in the iteration order. As such, it may not be
     * the card returned by the immediate call of either `prev()` or `next()`
     *
     * @param {String} newCardID The ID of the card to insert into the queue
     * @param {Number} newCardUrgency The urgency of the card to be inserted.
     * Used as a sorting key.
     */
    insertCard(newCardID: string, newCardUrgency: number) {
        let newKey = { _id: newCardID, urgency: newCardUrgency }
        this.idsToBSTKeys[newCardID] = newKey;
        this.bst.insert(newKey, newCardUrgency);
    };

    /**
     * @description Sync the changes made to the card with the card manager. We
     * don't check whether the urgency changed. The old key is removed from the
     * BST and a new (possibly updated) key is added to the BST.
     *
     * @param {Object} card the new version of the card
     */
    updateCard(card: Partial<ICard>) {
        localStorage.removeItem(card._id);
        localStorage.setItem(card._id, JSON.stringify(card));
        this.minicards[card._id] = {
            _id: card._id, title: card.title,
            tags: card.tags?.trim().replace(/\s/g, ", ")
        };

        let oldKey = this.idsToBSTKeys[card._id];
        if (oldKey) {
            this.removeCard(card._id);
        }
        this.insertCard(card._id, card.urgency as number);
    };

    /**
     * @description Compute and return the 0th, 1st, 2nd, 3rd and 4th quartiles
     * of the urgencies of the cards on the current `CardsManager` object.
     *
     * @returns {Array} A 5 element array denoting the 0th, 1st, 2nd, 3rd and 4th
     * quartiles of the urgences.
     */
    quartiles() {
        let N = this.bst.size;
        if (N == 0) {
            return [0, 0, 0, 0, 0];
        }
        else if (N <= 4) {
            // Recall that the BST is populated using `reverseComparator()`, thus
            // the min node on the BST has the highest urgency.
            let maxUrgency = this.bst.min()?.urgency || -Infinity;
            return [maxUrgency, maxUrgency, maxUrgency, maxUrgency, maxUrgency];
        } else {
            let zeroQuartile = this.bst.max();
            let firstQuartile = this.bst.at(Math.floor(3 * N / 4));
            let secondQuartile = this.bst.at(Math.floor(N / 2));
            let thirdQuartile = this.bst.at(Math.floor(N / 4));
            let fourthQuartile = this.bst.min();
            if (zeroQuartile === null || firstQuartile === null || secondQuartile === null || thirdQuartile === null || fourthQuartile === null) {
                throw new Error("Unexpected null value in quartiles()");
            }
            if (firstQuartile.key === undefined || secondQuartile.key === undefined || thirdQuartile.key === undefined) {
                throw new Error("Unexpected null keys in quartiles()");
            }
            return [
                zeroQuartile.urgency,
                firstQuartile.key.urgency,
                secondQuartile.key.urgency,
                thirdQuartile.key.urgency,
                fourthQuartile.urgency
            ];
        }
    }

    /**
     * @description Search for the card with the given ID. First search in the
     * browser, then query the database if necessary.
     *
     * @param {String} cardID The ID of the card that's to be fetched
     * @param {Function} callback The function to be called once the card is
     * found
     */
    findCard(cardID: string): Promise<Partial<ICard>> {
        let cachedCard = localStorage.getItem(cardID);
        if (cachedCard) {
            return Promise.resolve(JSON.parse(cachedCard) as ICard);
        }

        return sendHTTPRequest("POST", this.cardSourceURL, {userIDInApp: this.userID, cardID: cardID})
            .then((cards: Partial<ICard>[]) => {
                if (cards.length !== 1) {
                    return Promise.reject(`Expected 1 card, got ${cards.length}`);
                } else {
                    localStorage.setItem(cardID, JSON.stringify(cards[0]));
                    return Promise.resolve(cards[0]);
                }
            });
    }

    saveCard(card: Partial<ICard>, url: string): Promise<Partial<ICard>> {
        return sendHTTPRequest("POST", url, card)
            .then((savedCard: Partial<ICard>) => {
                this.updateCard(savedCard);
                return savedCard;
            });
    };
}
